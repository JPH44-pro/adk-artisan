"use client";

import { useMemo } from "react";
import { useUsage } from "@/contexts/UsageContext";
import { AdkSession } from "@/lib/adk/session-service";

interface UseChatLimitsConfig {
  session: AdkSession | null;
}

interface UseChatLimitsReturn {
  isMessageLimitReached: boolean;
  isSessionLimitReached: boolean;
  isInputBlocked: boolean;
}

/**
 * Calculate usage limits and input blocking based on subscription tier and current session state
 * Integrates with UsageContext to determine if user can send messages or create new sessions
 */
export function useChatLimits({
  session,
}: UseChatLimitsConfig): UseChatLimitsReturn {
  const { usageStats } = useUsage();

  // Check if message limits are reached
  const isMessageLimitReached = useMemo(() => {
    if (!usageStats) return false;
    const { messages } = usageStats.usage;
    // -1 means unlimited (paid tier)
    if (messages.limit === -1) return false;
    return messages.used >= messages.limit;
  }, [usageStats]);

  // Check if session limits are reached
  const isSessionLimitReached = useMemo(() => {
    if (!usageStats) return false;
    const { sessions } = usageStats.usage;
    // -1 means unlimited (paid tier)
    if (sessions.limit === -1) return false;
    return sessions.used >= sessions.limit;
  }, [usageStats]);

  // Check if user should be blocked from sending messages
  const isInputBlocked = useMemo(() => {
    if (session) {
      // Inside existing session - only check message limits
      return isMessageLimitReached;
    } else {
      // Creating new session - check session limits
      return isSessionLimitReached || isMessageLimitReached;
    }
  }, [session, isMessageLimitReached, isSessionLimitReached]);

  return {
    isMessageLimitReached,
    isSessionLimitReached,
    isInputBlocked,
  };
}
