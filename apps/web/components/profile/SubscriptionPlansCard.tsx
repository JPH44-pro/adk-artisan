"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanCard } from "./PlanCard";

const PLANS = [
  {
    name: "Free",
    sessions: 1,
    messages: 20,
    price: 0,
    support: "Basic support",
    description: "Perfect for getting started",
  },
  {
    name: "Pro",
    sessions: -1,
    messages: -1,
    price: 9.99,
    support: "Priority support",
    description: "For serious agents and power users",
  },
];

export function SubscriptionPlansCard() {
  return (
    <>
      <Card className="md:col-span-2" data-section="plans">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} loading={false} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
