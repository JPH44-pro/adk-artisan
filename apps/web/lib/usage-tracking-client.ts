/**
 * Usage Tracking Client Utilities for ADK-Agent-SaaS
 *
 * Client-safe utilities for usage enforcement UI components.
 * Contains types, formatters, and helper functions that can be safely imported by client components.
 * Adapted for session and message tracking in adk-agent-saas.
 */

// Import client-safe types from subscriptions
import { type SubscriptionTier } from "@/lib/subscriptions";

// Unified interface for user usage statistics
export interface UsageStats {
  subscriptionTier: SubscriptionTier;
  billingPeriodStart: Date;
  usage: {
    sessions: {
      used: number;
      limit: number;
      resetPeriod: "monthly";
      nextReset?: Date;
    };
    messages: {
      used: number;
      limit: number;
      resetPeriod: "monthly";
      nextReset?: Date;
    };
  };
  stripeData: {
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  };
}

/**
 * Get default usage stats for error cases
 * This is a pure function with no server dependencies
 */
export function getDefaultUsageStats(): UsageStats {
  return {
    subscriptionTier: "free",
    billingPeriodStart: new Date(),
    usage: {
      sessions: { used: 0, limit: 1, resetPeriod: "monthly" },
      messages: { used: 0, limit: 20, resetPeriod: "monthly" },
    },
    stripeData: {
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  };
}

// Usage enforcement specific types
export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage: {
    sessions: { used: number; limit: number };
    messages: { used: number; limit: number };
  };
  upgradeRequired?: boolean;
  canSendMessage: boolean;
  canCreateSession: boolean;
}

/**
 * Core usage limit checking logic (shared between client and server)
 */
export function checkUsageLimitsCore(usage: { used: number; limit: number }): {
  canUse: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  // -1 means unlimited (paid tier)
  if (usage.limit === -1) {
    return { canUse: true };
  }

  if (usage.used >= usage.limit) {
    return {
      canUse: false,
      reason: "Usage limit exceeded. Upgrade to continue.",
      upgradeRequired: true,
    };
  }

  return { canUse: true };
}

/**
 * Client-safe function to check if user can send messages
 */
export function canSendMessage(usageStats: UsageStats | null): {
  canSend: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  if (!usageStats) {
    return {
      canSend: false,
      reason: "Unable to load usage information",
      upgradeRequired: false,
    };
  }

  return {
    canSend: checkUsageLimitsCore(usageStats.usage.messages).canUse,
    reason: checkUsageLimitsCore(usageStats.usage.messages).reason,
    upgradeRequired: checkUsageLimitsCore(usageStats.usage.messages)
      .upgradeRequired,
  };
}

/**
 * Client-safe function to check if user can create sessions
 */
export function canCreateSession(usageStats: UsageStats | null): {
  canCreate: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  if (!usageStats) {
    return {
      canCreate: false,
      reason: "Unable to load usage information",
      upgradeRequired: false,
    };
  }

  return {
    canCreate: checkUsageLimitsCore(usageStats.usage.sessions).canUse,
    reason: checkUsageLimitsCore(usageStats.usage.sessions).reason,
    upgradeRequired: checkUsageLimitsCore(usageStats.usage.sessions)
      .upgradeRequired,
  };
}
