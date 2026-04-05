/**
 * Usage Enforcement Library for ADK-Agent-SaaS
 *
 * Server-side usage limit checking and enforcement for subscription tiers.
 * Provides real-time calculations using the userUsageEvents table for sessions and messages.
 *
 * This file contains server-only operations and should not be imported by client components.
 *
 * ARCHITECTURE:
 * - getUserUsage(): Core consolidated function that retrieves all usage data from database
 * - getUserUsageStatsForUI(): UI wrapper for components (returns UsageStats with nextReset, billingPeriod)
 * - checkMessageLimits(): Message sending enforcement
 * - checkSessionLimits(): Session creation enforcement
 * - recordUsageEvent(): Record usage events in the database
 */

import { eq, and, sql, gte } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema/users";
import {
  userUsageEvents,
  USAGE_EVENT_TYPES,
  type UsageEventType,
} from "@/lib/drizzle/schema/usage-events";
import {
  getUsageLimitsForTier,
  type SubscriptionTier,
  type UsageLimits,
} from "@/lib/subscriptions";
import { getSubscriptionFromStripe } from "@/lib/stripe-service";
import { revalidatePath } from "next/cache";

// Import client-safe types and utilities for use in server functions
import type { UsageCheckResult, UsageStats } from "./usage-tracking-client";

// Import shared validation utilities
import {
  checkUsageLimitsCore,
  getDefaultUsageStats,
} from "./usage-tracking-client";
import { requireUserId } from "./auth";

// Re-export for backward compatibility
export { getDefaultUsageStats };

// Re-export all client-safe types and constants for consumers
export type { UsageCheckResult, UsageStats } from "./usage-tracking-client";

// Re-export usage event types and constants
export {
  USAGE_EVENT_TYPES,
  type UsageEventType,
} from "@/lib/drizzle/schema/usage-events";

/**
 * Get the start time for the current usage window (monthly-only)
 */
function getUsageWindowStart(currentPeriodStart?: Date): Date {
  // Use billing period start if provided
  if (currentPeriodStart) {
    return new Date(currentPeriodStart);
  }

  // Fallback to first of current month in UTC
  const now = new Date();
  const monthStart = new Date(now);
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  return monthStart;
}
/**
 * Calculate usage within a time window for both message and session event types
 */
async function calculateUsage(
  userId: string,
  windowStart: Date
): Promise<{ messageUsage: number; sessionUsage: number }> {
  try {
    // Calculate message usage
    const [messageResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userUsageEvents)
      .where(
        and(
          eq(userUsageEvents.userId, userId),
          eq(userUsageEvents.eventType, USAGE_EVENT_TYPES.MESSAGE_SENT),
          gte(userUsageEvents.createdAt, windowStart)
        )
      );

    // Calculate session usage
    const [sessionResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userUsageEvents)
      .where(
        and(
          eq(userUsageEvents.userId, userId),
          eq(userUsageEvents.eventType, USAGE_EVENT_TYPES.SESSION_CREATED),
          gte(userUsageEvents.createdAt, windowStart)
        )
      );

    return {
      messageUsage: Number(messageResult?.count || 0),
      sessionUsage: Number(sessionResult?.count || 0),
    };
  } catch (error) {
    console.error("Error calculating usage:", error);
    return {
      messageUsage: 0,
      sessionUsage: 0,
    };
  }
}

/**
 * Core usage data retrieval function
 * Consolidated function that gets all usage data from database
 */
async function getUserUsage(userId: string): Promise<{
  user: {
    id: string;
    stripe_customer_id: string | null;
  };
  subscriptionTier: SubscriptionTier;
  limits: UsageLimits;
  usage: {
    sessions: { used: number; limit: number };
    messages: { used: number; limit: number };
  };
  windowStart: Date;
  stripeData: {
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  };
} | null> {
  try {
    // Get user info - subscription data comes from Stripe directly
    const [user] = await db
      .select({
        id: users.id,
        stripe_customer_id: users.stripe_customer_id,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return null;
    }

    // Handle users without Stripe customer ID (free tier users)
    let stripeSubscriptionData;

    if (!user.stripe_customer_id) {
      // User without Stripe customer ID = free tier
      stripeSubscriptionData = {
        tier: "free" as SubscriptionTier,
        currentPeriodStart: null,
        currentPeriodEnd: null,
      };
    } else {
      stripeSubscriptionData = await getSubscriptionFromStripe(
        user.stripe_customer_id
      );
    }

    const subscriptionTier = stripeSubscriptionData.tier;
    const limits = getUsageLimitsForTier(subscriptionTier);

    // Calculate usage window start using Stripe period dates
    const windowStart = getUsageWindowStart(
      stripeSubscriptionData.currentPeriodStart || undefined
    );

    // Get both message and session usage within time window
    const { messageUsage, sessionUsage } = await calculateUsage(
      userId,
      windowStart
    );

    return {
      user,
      subscriptionTier,
      limits,
      usage: {
        sessions: {
          used: sessionUsage || 0,
          limit: limits.sessions,
        },
        messages: {
          used: messageUsage || 0,
          limit: limits.messages,
        },
      },
      windowStart,
      stripeData: {
        currentPeriodStart: stripeSubscriptionData.currentPeriodStart,
        currentPeriodEnd: stripeSubscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: stripeSubscriptionData.cancelAtPeriodEnd || false,
      },
    };
  } catch (error) {
    console.error("Error getting user usage data:", error);
    return null;
  }
}

/**
 * Check if user can send a message
 */
export async function checkMessageLimits(
  userId: string
): Promise<UsageCheckResult> {
  try {
    const usageData = await getUserUsage(userId);

    if (!usageData) {
      return {
        allowed: false,
        reason: "Unable to fetch user information",
        currentUsage: {
          sessions: { used: 0, limit: 0 },
          messages: { used: 0, limit: 0 },
        },
        upgradeRequired: true,
        canSendMessage: false,
        canCreateSession: false,
      };
    }

    const messageCheck = checkUsageLimitsCore(usageData.usage.messages);
    const sessionCheck = checkUsageLimitsCore(usageData.usage.sessions);

    return {
      allowed: messageCheck.canUse,
      reason: messageCheck.reason,
      currentUsage: usageData.usage,
      upgradeRequired: messageCheck.upgradeRequired || false,
      canSendMessage: messageCheck.canUse,
      canCreateSession: sessionCheck.canUse,
    };
  } catch (error) {
    console.error("Error checking message limits:", error);

    // Fail safely - deny message if we can't check limits
    return {
      allowed: false,
      reason: "Unable to verify usage limits. Please try again.",
      currentUsage: {
        sessions: { used: 0, limit: 0 },
        messages: { used: 0, limit: 0 },
      },
      upgradeRequired: false,
      canSendMessage: false,
      canCreateSession: false,
    };
  }
}

/**
 * Check if user can create a new session
 */
export async function checkSessionLimits(
  userId: string
): Promise<UsageCheckResult> {
  try {
    const usageData = await getUserUsage(userId);

    if (!usageData) {
      return {
        allowed: false,
        reason: "Unable to fetch user information",
        currentUsage: {
          sessions: { used: 0, limit: 0 },
          messages: { used: 0, limit: 0 },
        },
        upgradeRequired: true,
        canSendMessage: false,
        canCreateSession: false,
      };
    }

    const messageCheck = checkUsageLimitsCore(usageData.usage.messages);
    const sessionCheck = checkUsageLimitsCore(usageData.usage.sessions);

    return {
      allowed: sessionCheck.canUse,
      reason: sessionCheck.reason,
      currentUsage: usageData.usage,
      upgradeRequired: sessionCheck.upgradeRequired || false,
      canSendMessage: messageCheck.canUse,
      canCreateSession: sessionCheck.canUse,
    };
  } catch (error) {
    console.error("Error checking session limits:", error);

    // Fail safely - deny session if we can't check limits
    return {
      allowed: false,
      reason: "Unable to verify usage limits. Please try again.",
      currentUsage: {
        sessions: { used: 0, limit: 0 },
        messages: { used: 0, limit: 0 },
      },
      upgradeRequired: false,
      canSendMessage: false,
      canCreateSession: false,
    };
  }
}

/**
 * Get comprehensive usage statistics for a user
 * Returns UsageStats format for actions and UI components
 * This is the main function used throughout the app for fetching user usage data
 */
export async function getUserUsageStatsForUI(
  userId: string
): Promise<UsageStats | null> {
  const data = await getUserUsage(userId);

  if (!data) {
    return null;
  }

  // Calculate next reset time using Stripe billing period data
  let nextReset: Date;
  let billingPeriodStart: Date;

  if (data.stripeData.currentPeriodEnd) {
    // Use Stripe subscription period data
    nextReset = new Date(data.stripeData.currentPeriodEnd);
    billingPeriodStart = data.stripeData.currentPeriodStart || data.windowStart;
  } else {
    // Fallback to monthly calculation for free tier
    nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1); // First of next month
    billingPeriodStart = data.windowStart;
  }

  return {
    subscriptionTier: data.subscriptionTier as "free" | "paid",
    usage: {
      sessions: {
        ...data.usage.sessions,
        resetPeriod: "monthly" as const,
        nextReset,
      },
      messages: {
        ...data.usage.messages,
        resetPeriod: "monthly" as const,
        nextReset,
      },
    },
    billingPeriodStart,
    stripeData: {
      currentPeriodStart: data.stripeData.currentPeriodStart,
      currentPeriodEnd: data.stripeData.currentPeriodEnd,
      cancelAtPeriodEnd: data.stripeData.cancelAtPeriodEnd,
    },
  };
}

/**
 * Standard result type for usage event recording
 */
export type UsageEventResult = {
  success: boolean;
  error?: string;
};

/** Usage event recording function */
export async function recordUsageEvent(
  eventType: UsageEventType
): Promise<UsageEventResult> {
  try {
    // Get authenticated user
    const userId = await requireUserId();

    if (!userId) {
      return { success: false, error: "Authentication required" };
    }

    // Record the usage event
    await db.insert(userUsageEvents).values({
      userId: userId,
      eventType: eventType,
    });

    // Revalidate any pages that show usage stats
    revalidatePath("/profile");
    if (
      eventType === USAGE_EVENT_TYPES.MESSAGE_SENT ||
      eventType === USAGE_EVENT_TYPES.SESSION_CREATED
    ) {
      revalidatePath("/chat");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error recording ${eventType} event:`, error);
    return {
      success: false,
      error: `Failed to record ${eventType} event`,
    };
  }
}
