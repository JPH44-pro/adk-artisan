import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  FileText,
  Users,
  Wallet,
} from "lucide-react";
import { requireUserId } from "@/lib/auth";
import { formatYmdUtc } from "@/lib/agenda/week";
import { queryDashboardForUser } from "@/lib/queries/dashboard";
import { formatCentsEUR } from "@/lib/quotes/calc";
import { QUOTE_STATUS_LABELS } from "@/lib/quotes/labels";
import { INVOICE_STATUS_LABELS } from "@/lib/invoices/labels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

function fmtDateTime(d: Date): string {
  return d.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage(): Promise<ReactElement> {
  const userId = await requireUserId();
  const data = await queryDashboardForUser(userId);
  const { kpi } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Synthèse de l’activité : devis à traiter, factures en retard et
          prochains rendez-vous.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {kpi.clientCount}
            </div>
            <CardDescription className="mt-1">
              <Link
                href="/clients"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Dossier clients
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Devis en attente
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {kpi.pendingQuotesCount}
            </div>
            <CardDescription className="mt-1">
              Brouillons et envoyés
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Factures en retard
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums text-destructive">
              {kpi.overdueInvoicesCount}
            </div>
            <CardDescription className="mt-1">
              Statut « en retard » ou échéance dépassée
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV à venir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {kpi.upcomingEventsNext30DaysCount}
            </div>
            <CardDescription className="mt-1">
              Sur les 30 prochains jours
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>Devis à traiter</CardTitle>
              <CardDescription>
                Brouillons et devis envoyés (les plus récents d’abord)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/devis">Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pendingQuotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun devis en brouillon ou envoyé.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.pendingQuotes.map((q) => (
                  <li key={q.id}>
                    <Link
                      href={`/devis/${q.id}`}
                      className="block rounded-lg border bg-background p-3 text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium line-clamp-1">
                        {q.title?.trim() || "Sans titre"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>{QUOTE_STATUS_LABELS[q.status]}</span>
                        {q.clientName ? <span>· {q.clientName}</span> : null}
                        <span className="tabular-nums">
                          · {formatCentsEUR(q.totalTtcCents)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>Factures en retard</CardTitle>
              <CardDescription>
                Échéance dépassée ou statut « en retard »
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/factures">Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.overdueInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune facture en retard.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.overdueInvoices.map((inv) => (
                  <li key={inv.id}>
                    <Link
                      href={`/factures/${inv.id}`}
                      className="block rounded-lg border bg-background p-3 text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium line-clamp-1">
                        {inv.title?.trim() || "Sans titre"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>{INVOICE_STATUS_LABELS[inv.status]}</span>
                        <span>· éch. {fmtDate(inv.dueDate)}</span>
                        {inv.clientName ? <span>· {inv.clientName}</span> : null}
                        <span className="tabular-nums">
                          · {formatCentsEUR(inv.totalTtcCents)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>Prochains rendez-vous</CardTitle>
              <CardDescription>Les 5 prochains événements</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/agenda">Agenda</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun rendez-vous à venir.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.upcomingEvents.map((ev) => (
                  <li key={ev.id}>
                    <Link
                      href={`/agenda?week=${formatYmdUtc(ev.startAt)}`}
                      className="block rounded-lg border bg-background p-3 text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium line-clamp-2">{ev.title}</div>
                      <div className="text-muted-foreground text-xs mt-1 space-y-0.5">
                        <div>{fmtDateTime(ev.startAt)}</div>
                        {ev.clientName ? (
                          <div>Client : {ev.clientName}</div>
                        ) : null}
                        {ev.location ? (
                          <div className="truncate">Lieu : {ev.location}</div>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
