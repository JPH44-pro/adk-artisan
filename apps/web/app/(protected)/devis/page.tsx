import type { Metadata } from "next";
import type { ReactElement } from "react";
import { requireUserId } from "@/lib/auth";
import { queryQuotesForUser } from "@/lib/queries/quotes";
import {
  QUOTE_STATUSES,
  type QuoteStatus,
} from "@/lib/drizzle/schema";
import { DevisNewButton } from "@/components/devis/DevisNewButton";
import { DevisStatusFilters } from "@/components/devis/DevisStatusFilters";
import { DevisTable } from "@/components/devis/DevisTable";
import { DevisPagination } from "@/components/devis/DevisPagination";

export const metadata: Metadata = {
  title: "Devis",
};

interface DevisPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

function parseStatus(raw: string | undefined): QuoteStatus | "all" {
  if (!raw) return "all";
  return QUOTE_STATUSES.includes(raw as QuoteStatus)
    ? (raw as QuoteStatus)
    : "all";
}

export default async function DevisPage({
  searchParams,
}: DevisPageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const sp = await searchParams;
  const status = parseStatus(
    typeof sp.status === "string" ? sp.status : undefined
  );
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;

  const { items, total } = await queryQuotesForUser({
    userId,
    page,
    pageSize,
    status,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground mt-1">
            Créez des devis par client, suivez les statuts et les montants HT /
            TVA / TTC.
          </p>
        </div>
        <DevisNewButton />
      </div>

      <div className="mb-6">
        <DevisStatusFilters current={status} />
      </div>

      <div className="space-y-6">
        <DevisTable items={items} />
        <DevisPagination
          page={page}
          pageSize={pageSize}
          total={total}
          status={status}
        />
      </div>
    </div>
  );
}
