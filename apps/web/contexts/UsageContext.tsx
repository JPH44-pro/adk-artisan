"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUserUsage } from "@/app/actions/usage";
import {
  type UsageStats,
  canSendMessage,
  canCreateSession,
} from "@/lib/usage-tracking-client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

interface UsageContextType {
  usageStats: UsageStats | null;
  loading: boolean;
  error: string | null;

  // Mutation functions to refresh usage after server actions
  refreshUsage: () => Promise<void>;

  // Derived permission states
  canSendMessage: () => {
    canSend: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  };
  canCreateSession: () => {
    canCreate: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  };
}

// Re-export UsageStats for components
export type { UsageStats };

const UsageContext = createContext<UsageContextType | undefined>(undefined);

interface UsageProviderProps {
  children: React.ReactNode;
}

export function UsageProvider({ children }: UsageProviderProps) {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: userId } = useUser();

  // Fetch usage stats from server
  const refreshUsage = useCallback(async (): Promise<void> => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await getCurrentUserUsage();

      if (result.success && result.data) {
        setUsageStats(result.data);
      } else if (!result.success) {
        setError(result.error || "Failed to fetch usage statistics");
        toast.error("Failed to refresh usage stats");
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      setError("Failed to fetch usage statistics");
      toast.error("Failed to refresh usage stats");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load initial usage stats
  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  // Permission checking functions
  const canSendMessageCheck = useCallback(() => {
    return canSendMessage(usageStats);
  }, [usageStats]);

  const canCreateSessionCheck = useCallback(() => {
    return canCreateSession(usageStats);
  }, [usageStats]);

  const value: UsageContextType = {
    usageStats,
    loading,
    error,
    refreshUsage,
    canSendMessage: canSendMessageCheck,
    canCreateSession: canCreateSessionCheck,
  };

  return (
    <UsageContext.Provider value={value}>{children}</UsageContext.Provider>
  );
}

export function useUsage(): UsageContextType {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error("useUsage must be used within a UsageProvider");
  }
  return context;
}
