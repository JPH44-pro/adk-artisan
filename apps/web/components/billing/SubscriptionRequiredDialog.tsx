"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown, ArrowRight } from "lucide-react";
import { PRICING } from "@/lib/subscriptions";

interface SubscriptionRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionRequiredDialog({
  open,
  onOpenChange,
}: SubscriptionRequiredDialogProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/profile");
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-sm sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-orange-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

          <div className="relative p-4 sm:p-5">
            <DialogHeader className="text-center space-y-3">
              {/* Enhanced Crown Icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-xl shadow-orange-500/25 ring-1 ring-orange-500/20">
                <Crown className="h-6 w-6 text-white drop-shadow-lg" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  Subscription Required
                </DialogTitle>
                <DialogDescription className="text-slate-300 text-sm leading-relaxed px-2">
                  Upgrade to Pro to start sending messages and unlock unlimited
                  access.
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Enhanced Pricing Display */}
            <div className="mt-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl" />
              <div className="relative rounded-lg border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl p-4 text-center shadow-xl">
                <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {PRICING.paid.displayPrice}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  per month
                </div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-300 text-xs font-medium">
                    Best Value
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Features List */}
            <div className="mt-4 space-y-2">
              {[
                { icon: "💬", text: "Unlimited messages" },
                { icon: "🤖", text: "All AI models" },
                { icon: "⚡", text: "Priority support" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-green-400 to-emerald-500 shadow-md shadow-green-500/25">
                    <span className="text-xs">{feature.icon}</span>
                  </div>
                  <span className="text-slate-200 text-sm font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="mt-6 space-y-2">
              <Button
                onClick={handleUpgrade}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-2.5 rounded-lg shadow-xl shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-blue-500/40 border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Subscription
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={handleCancel}
                className="w-full text-slate-400 hover:text-white hover:bg-slate-700/30 py-2 rounded-lg transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
