import type { Metadata } from "next";
import type { ReactElement } from "react";
import { requireUserId } from "@/lib/auth";
import { queryInvoicesForUser } from "@/lib/queries/invoices";
import {
  INVOICE_STATUSES,
  type InvoiceStatus,
} from "@/lib/drizzle/schema";
import { FacturesNewButton } from "@/components/factures/FacturesNewButton";
import { FacturesStatusFilters } from "@/components/factures/FacturesStatusFilters";
import { FacturesTable } from "@/components/factures/FacturesTable";
import { FacturesPagination } from "@/components/factures/FacturesPagination";

export const metadata: Metadata = {
  title: "Factures",
};

interface FacturesPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

function parseStatus(raw: string | undefined): InvoiceStatus | "all" {
  if (!raw) return "all";
  return INVOICE_STATUSES.includes(raw as InvoiceStatus)
    ? (raw as InvoiceStatus)
    : "all";
}

export default async function FacturesPage({
  searchParams,
}: FacturesPageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const sp = await searchParams;
  const status = parseStatus(
    typeof sp.status === "string" ? sp.status : undefined
  );
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;

  const { items, total } = await queryInvoicesForUser({
    userId,
    page,
    pageSize,
    status,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground mt-1">
            Émission, suivi de paiement et totaux HT / TVA / TTC. Le PDF pourra
            être ajouté sans bloquer la sauvegarde.
          </p>
        </div>
        <FacturesNewButton />
      </div>

      <div className="mb-6">
        <FacturesStatusFilters current={status} />
      </div>

      <div className="space-y-6">
        <FacturesTable items={items} />
        <FacturesPagination
          page={page}
          pageSize={pageSize}
          total={total}
          status={status}
        />
      </div>
    </div>
  );
}
