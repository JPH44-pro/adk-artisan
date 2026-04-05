// Simplified subscription types for binary free/paid system
export type SubscriptionTier = "free" | "paid";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete";

// Usage limits configuration for adk-agent-saas
export type UsageLimits = {
  sessions: number;
  messages: number;
};

export const USAGE_LIMITS: Record<SubscriptionTier, UsageLimits> = {
  free: { sessions: 1, messages: 20 },
  paid: { sessions: -1, messages: -1 }, // -1 means unlimited
};

// Get usage limits for a subscription tier
export function getUsageLimitsForTier(tier: SubscriptionTier): UsageLimits {
  return USAGE_LIMITS[tier];
}

// Simple subscription validation - no usage tracking needed
export function canSendMessage(tier: SubscriptionTier): {
  allowed: boolean;
  reason?: string;
} {
  if (tier === "paid") {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "Subscription required. Upgrade to send messages.",
  };
}

// Check if user has paid subscription
export function hasPaidSubscription(tier: SubscriptionTier): boolean {
  return tier === "paid";
}

// Simple tier display names
export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case "paid":
      return "Pro";
    case "free":
    default:
      return "Free";
  }
}

// Pricing information for the single paid tier
export const PRICING = {
  paid: {
    amount: 999, // $9.99 in cents
    currency: "USD",
    interval: "month",
    displayPrice: "$9.99",
  },
} as const;
