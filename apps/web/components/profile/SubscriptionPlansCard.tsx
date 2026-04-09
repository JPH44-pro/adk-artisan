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
    support: "Assistance de base",
    description: "Découvrir ReglePro et l’assistant (limites d’usage)",
  },
  {
    name: "Pro",
    sessions: -1,
    messages: -1,
    price: 9.99,
    support: "Assistance prioritaire",
    description: "Usage illimité de l’assistant et fonctionnalités Pro",
  },
];

export function SubscriptionPlansCard() {
  return (
    <>
      <Card className="md:col-span-2" data-section="plans">
        <CardHeader>
          <CardTitle>Formules</CardTitle>
          <CardDescription>
            Gratuit ou Pro — même tarif équitable pour tous les artisans
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
