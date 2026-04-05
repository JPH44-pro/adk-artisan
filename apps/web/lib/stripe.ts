import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  appInfo: {
    name: "ShipKit ADK Agent Template",
    version: "1.0.0",
  },
});

// Stripe configuration constants - simplified to single paid tier
export const STRIPE_CONFIG = {
  PAID_PRICE_ID: env.STRIPE_PAID_PRICE_ID, // Single $9.99/month tier
  SUCCESS_URL: "/profile?session_id={CHECKOUT_SESSION_ID}",
  CANCEL_URL: "/profile",
} as const;
