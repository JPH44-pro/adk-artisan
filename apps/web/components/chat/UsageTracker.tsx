"use client";

import Link from "next/link";
import { Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUsage } from "@/contexts/UsageContext";

export function UsageTracker() {
  const { usageStats, loading } = useUsage();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats) return null;

  const { sessions, messages } = usageStats.usage;
  const subscriptionTier = usageStats.subscriptionTier;

  // Check if user has unlimited usage (paid subscription)
  const isUnlimited = subscriptionTier === "paid";

  // Calculate percentages only for limited subscriptions
  const sessionsPercentage =
    sessions.limit === -1
      ? 0 // Unlimited, show as 0% usage
      : Math.min((sessions.used / sessions.limit) * 100, 100);
  const messagesPercentage =
    messages.limit === -1
      ? 0 // Unlimited, show as 0% usage
      : Math.min((messages.used / messages.limit) * 100, 100);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gray-500";
      case "paid":
        return "bg-primary";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Monthly Usage</CardTitle>
          <Badge
            className={cn(
              "text-xs text-white capitalize",
              getTierBadgeColor(subscriptionTier)
            )}
          >
            {subscriptionTier === "paid" ? "Pro" : "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sessions Usage - Only show for non-unlimited users */}
        {!isUnlimited && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-primary" />
                <span className="font-medium">Sessions</span>
              </div>
              <span className="font-mono">
                {sessions.used}/{sessions.limit.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={sessionsPercentage}
                className="h-2 [&>div]:bg-primary"
              />
            </div>
          </div>
        )}

        {/* Messages Usage - Only show for non-unlimited users */}
        {!isUnlimited && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-primary" />
                <span className="font-medium">Messages</span>
              </div>
              <span className="font-mono">
                {messages.used}/{messages.limit.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={messagesPercentage}
                className="h-2 [&>div]:bg-primary"
              />
            </div>
          </div>
        )}

        {/* Pro Features Section */}
        {isUnlimited && (
          <>
            <div className="space-y-2">
              <div className="text-xs text-center text-primary font-medium dark:text-primary">
                ✓ Unlimited Sessions
              </div>
              <div className="text-xs text-center text-primary font-medium dark:text-primary">
                ✓ Unlimited Messages
              </div>
            </div>
          </>
        )}

        {/* Upgrade Section */}
        {subscriptionTier !== "paid" && (
          <>
            <Separator />
            <div>
              <Link href="/profile">
                <Button
                  size="sm"
                  className="w-full text-xs mb-2"
                  variant="outline"
                >
                  <Users className="h-3 w-3" />
                  Upgrade to Pro
                </Button>
              </Link>
              <div className="text-xs text-center text-muted-foreground">
                Upgrade for unlimited sessions and messages
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
