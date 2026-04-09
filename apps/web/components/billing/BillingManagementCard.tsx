"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Settings,
  Crown,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { createCustomerPortalSession } from "@/app/actions/subscriptions";
import { useUsage } from "@/contexts/UsageContext";
import { formatDate } from "@/lib/utils";
import type { SubscriptionTier } from "@/lib/subscriptions";

interface BillingManagementCardProps {
  className?: string;
}

export function BillingManagementCard({
  className,
}: BillingManagementCardProps) {
  const { usageStats } = useUsage();

  // Derive subscription data from usage context
  const subscriptionTier = (usageStats?.subscriptionTier ||
    "free") as SubscriptionTier;
  const currentPeriodStart = usageStats?.billingPeriodStart || null;
  const currentPeriodEnd = usageStats?.usage.sessions.nextReset || null;
  const cancelAtPeriodEnd = usageStats?.stripeData?.cancelAtPeriodEnd || false;
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const result = await createCustomerPortalSession();

      if (result.success && result.portalUrl) {
        // Redirect to the portal URL
        window.location.href = result.portalUrl;
        return;
      }

      // Handle different error cases
      if (result.fallbackUrl) {
        // Open fallback URL if provided (from env variable)
        window.open(result.fallbackUrl, "_blank");
        return;
      }

      // Show user-friendly error message
      const errorMessage = result.error || "Unable to open billing portal";

      if (result.error?.includes("Customer portal not configured")) {
        alert(
          `${errorMessage}\n\nAs a temporary workaround, you can manage your subscription directly through Stripe at billing.stripe.com.`
        );
      } else {
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      alert("Unable to open billing portal. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    switch (tier) {
      case "free":
        return "Gratuit";
      case "paid":
        return "Pro";
      default:
        return "Gratuit";
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "free":
        return "bg-gray-500";
      case "paid":
        return "bg-primary";
      default:
        return "bg-gray-500";
    }
  };

  const getPricing = (tier: SubscriptionTier) => {
    switch (tier) {
      case "paid":
        return "9,99 €/mois";
      default:
        return null;
    }
  };

  // Simplified status logic
  const getStatusDisplay = () => {
    if (subscriptionTier !== "free" && cancelAtPeriodEnd) {
      return {
        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
        label: "Résiliation en cours",
        color: "bg-muted-foreground",
      };
    }

    // Default to active for any non-free tier or free tier
    return {
      icon: <CheckCircle className="h-4 w-4 text-primary" />,
      label: "Actif",
      color: "bg-primary",
    };
  };

  const statusDisplay = getStatusDisplay();
  const pricing = getPricing(subscriptionTier);
  const isActiveSubscription = subscriptionTier !== "free";
  const isCanceled = cancelAtPeriodEnd;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle className="text-lg">Abonnement et facturation</CardTitle>
          </div>
          {subscriptionTier === "paid" && (
            <Crown className="h-5 w-5 text-primary" />
          )}
        </div>
        <CardDescription>
          Gérer votre abonnement ReglePro via Stripe
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Formule actuelle</span>
            <div className="flex items-center gap-2">
              <Badge className={`${getTierColor(subscriptionTier)} text-white`}>
                {getTierLabel(subscriptionTier)}
              </Badge>
              {pricing && (
                <span className="text-sm text-muted-foreground">{pricing}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Statut</span>
            <div className="flex items-center gap-2">
              {statusDisplay.icon}
              <Badge
                variant="outline"
                className={`${statusDisplay.color} text-white border-transparent`}
              >
                {statusDisplay.label}
              </Badge>
            </div>
          </div>

          {/* Cancellation Notice */}
          {isCanceled && subscriptionTier !== "free" && (
            <div className="flex items-start gap-2 p-3 border border-destructive/20 dark:border-red-800 bg-destructive/5 dark:bg-red-950/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive dark:text-red-300 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive dark:text-red-300">
                  Abonnement résilié
                </p>
                <p className="text-destructive dark:text-red-300">
                  Votre abonnement prend fin le {formatDate(currentPeriodEnd)}.
                  Vous conservez l’accès aux fonctionnalités Pro jusqu’à cette date.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Billing Period (for paid plans only) */}
        {isActiveSubscription && currentPeriodStart && currentPeriodEnd && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période de facturation
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Période en cours :</span>
                  <span>{formatDate(currentPeriodStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochain renouvellement :</span>
                  <span>{formatDate(currentPeriodEnd)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Management Actions */}
        <Separator />
        <div className="space-y-3">
          {subscriptionTier !== "free" ? (
            <div className="space-y-2">
              <Button
                onClick={handleManageBilling}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ouverture…
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Gérer l’abonnement et la facturation
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé via Stripe
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Vous êtes sur la formule gratuite. Passez à Pro pour un usage
                illimité de l’assistant.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Scroll to the plan comparison section
                  const plansSection = document.querySelector(
                    '[data-section="plans"]'
                  );
                  if (plansSection) {
                    plansSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                Voir les formules
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats for paid plans */}
        {subscriptionTier !== "free" && currentPeriodEnd && (
          <div className="grid grid-cols-2 gap-2 text-xs text-center">
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">Prochain prélèvement</p>
              <p className="text-muted-foreground">
                {formatDate(currentPeriodEnd)}
              </p>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <p className="font-medium">Montant</p>
              <p className="text-muted-foreground">{pricing || "N/A"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
