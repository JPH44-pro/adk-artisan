"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Crown, Zap, ArrowUpRight } from "lucide-react";
import { useUsage } from "@/contexts/UsageContext";
import { getDefaultUsageStats } from "@/lib/usage-tracking-client";

export function UsageStatisticsCard() {
  const { usageStats } = useUsage();

  // Use default stats for error cases (0 usage) instead of hiding
  const displayStats = usageStats || getDefaultUsageStats();
  const subscriptionTier = displayStats.subscriptionTier || "free";

  // For paid users, show unlimited or high limits
  const sessionsLimit = displayStats.usage.sessions.limit;
  const messagesLimit = displayStats.usage.messages.limit;

  const sessionsUsed = displayStats.usage.sessions.used;
  const messagesUsed = displayStats.usage.messages.used;

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <CardTitle>Usage This Month</CardTitle>
        </div>
        <CardDescription>
          Your AI agent usage for the current billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Agent Sessions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <h4 className="font-medium">AI Agent Sessions</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {subscriptionTier === "paid" ? "Usage" : "Used / Limit"}
                </span>
                <span className="font-medium">
                  {subscriptionTier === "paid"
                    ? "Unlimited"
                    : sessionsUsed + "/" + sessionsLimit}
                </span>
              </div>
              {subscriptionTier !== "paid" && (
                <Progress
                  value={Math.min((sessionsUsed / sessionsLimit) * 100, 100)}
                  className="h-2 [&>div]:bg-primary"
                />
              )}
              {subscriptionTier === "paid" && (
                <div className="h-2 bg-primary rounded-full" />
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Messages</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {subscriptionTier === "paid" ? "Usage" : "Used / Limit"}
                </span>
                <span className="font-medium">
                  {subscriptionTier === "paid"
                    ? "Unlimited"
                    : messagesUsed + "/" + messagesLimit}
                </span>
              </div>
              {subscriptionTier !== "paid" && (
                <Progress
                  value={Math.min((messagesUsed / messagesLimit) * 100, 100)}
                  className="h-2 [&>div]:bg-primary"
                />
              )}
              {subscriptionTier === "paid" && (
                <div className="h-2 bg-primary rounded-full" />
              )}
            </div>
          </div>
        </div>

        {subscriptionTier === "free" && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <ArrowUpRight className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-primary">
                  Need more sessions?
                </h4>
                <p className="text-sm text-primary">
                  Upgrade to Pro for unlimited sessions and messages.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
