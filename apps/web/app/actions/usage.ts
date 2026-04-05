"use server";

import { getUserUsageStatsForUI } from "@/lib/usage-tracking";
import type { UsageStats } from "@/lib/usage-tracking-client";
import {
  getUsageLimitsForTier,
  type SubscriptionTier,
} from "@/lib/subscriptions";
import { getCurrentUserId } from "@/lib/auth";

/**
 * Return type for getCurrentUserUsage server action
 */
export type GetCurrentUserUsageResult =
  | {
      success: true;
      data: UsageStats;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Create default usage stats for new users
 */
function createDefaultUsageStats(
  subscriptionTier: SubscriptionTier = "free"
): UsageStats {
  const limits = getUsageLimitsForTier(subscriptionTier);
  const now = new Date();

  // Calculate next reset time (monthly billing period)
  const nextReset = new Date(now);
  nextReset.setMonth(nextReset.getMonth() + 1);
  nextReset.setDate(1);
  nextReset.setHours(0, 0, 0, 0);

  return {
    subscriptionTier: subscriptionTier as "free" | "paid",
    billingPeriodStart: now,
    usage: {
      sessions: {
        used: 0,
        limit: limits.sessions,
        resetPeriod: "monthly" as const,
        nextReset,
      },
      messages: {
        used: 0,
        limit: limits.messages,
        resetPeriod: "monthly" as const,
        nextReset,
      },
    },
    stripeData: {
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  };
}

/**
 * Server action to get current user's usage statistics
 * Used by client components to display usage information
 */
export async function getCurrentUserUsage(): Promise<GetCurrentUserUsageResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "Authentication required" };
    }

    const usageStats = await getUserUsageStatsForUI(userId);

    if (!usageStats) {
      const defaultStats = createDefaultUsageStats();
      return {
        success: true,
        data: defaultStats,
      };
    }

    return {
      success: true,
      data: usageStats,
    };
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return { success: false, error: "Failed to fetch usage statistics" };
  }
}
