import { stripe, STRIPE_CONFIG } from "./stripe";
import type Stripe from "stripe";
import type { SubscriptionTier } from "./subscriptions";

export interface StripeSubscriptionData {
  tier: SubscriptionTier;
  status: Stripe.Subscription.Status | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Get subscription data directly from Stripe using customer ID
 * Throws error on API failures - should be caught and handled with toast notifications
 */
export async function getSubscriptionFromStripe(
  customerId: string
): Promise<StripeSubscriptionData> {
  try {
    // Query Stripe directly using customer ID
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === "active" || sub.status === "past_due"
    );

    if (!activeSubscription) {
      return {
        tier: "free",
        status: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // Determine tier from price ID - simplified binary system
    const priceId = activeSubscription.items.data[0]?.price.id;
    let tier: SubscriptionTier = "free";

    if (priceId === STRIPE_CONFIG.PAID_PRICE_ID) {
      tier = "paid";
    }

    // Get period data from subscription items (where Stripe actually stores it)
    const firstItem = activeSubscription.items.data[0];
    const periodStart = firstItem?.current_period_start;
    const periodEnd = firstItem?.current_period_end;

    // Verify we have the required period data for paid subscriptions
    if (!periodEnd && tier !== "free") {
      console.error(
        "❌ [Stripe Error] Missing current_period_end in subscription item:",
        {
          subscriptionId: activeSubscription.id,
          customerId,
          tier,
          hasItems: activeSubscription.items.data.length > 0,
          firstItemHasPeriodEnd: !!firstItem?.current_period_end,
        }
      );
      throw new Error(
        `Missing period data in Stripe subscription items for subscription ${activeSubscription.id}`
      );
    }

    return {
      tier,
      status: activeSubscription.status ?? null,
      currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: Boolean(activeSubscription.cancel_at_period_end),
    };
  } catch (error) {
    console.error("Error fetching subscription from Stripe:", error);
    throw new Error(
      `Failed to fetch subscription data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
