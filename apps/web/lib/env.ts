import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper to check if we need Google Cloud auth
const isCloudDeployment =
  process.env.ADK_URL?.includes("googleapis.com") ?? false;

export const env = createEnv({
  server: {
    // Drizzle
    DATABASE_URL: z.string().url(),

    // Supabase
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Stripe - simplified to single paid tier
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_PAID_PRICE_ID: z.string().min(1), // Single $9.99/month price ID

    // ADK
    ADK_URL: z.string().url(),

    // Google AI - for Gemini 2.5 Pro
    GEMINI_API_KEY: z.string().min(1),

    // Google Cloud - required only for cloud deployment
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: isCloudDeployment
      ? z.string().min(1)
      : z.string().min(1).optional(),

    // Optional: Fallback customer portal URL when automated session creation fails
    STRIPE_CUSTOMER_PORTAL_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PAID_PRICE_ID: process.env.STRIPE_PAID_PRICE_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,
    STRIPE_CUSTOMER_PORTAL_URL: process.env.STRIPE_CUSTOMER_PORTAL_URL,
    ADK_URL: process.env.ADK_URL,

    // Client variables
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
