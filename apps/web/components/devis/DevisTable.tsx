import Link from "next/link";
import type { ReactElement } from "react";
import { formatDate } from "@/lib/utils";
import { formatCentsEUR } from "@/lib/quotes/calc";
import { QUOTE_STATUS_LABELS } from "@/lib/quotes/labels";
import type { QuoteListRow } from "@/lib/queries/quotes";
import { CreateInvoiceFromQuoteButton } from "@/components/devis/CreateInvoiceFromQuoteButton";

interface DevisTableProps {
  items: QuoteListRow[];
}

export function DevisTable({ items }: DevisTableProps): ReactElement {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border rounded-lg p-8 text-center">
        Aucun devis pour ce filtre. Créez un devis ou changez le statut affiché.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="p-3 font-medium">Devis</th>
            <th className="p-3 font-medium">Client</th>
            <th className="p-3 font-medium">Statut</th>
            <th className="p-3 font-medium text-right">Total TTC</th>
            <th className="p-3 font-medium hidden md:table-cell">Modifié</th>
            <th className="p-3 font-medium text-right w-[1%] whitespace-nowrap">
              Facture
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((q) => (
            <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-3">
                <Link
                  href={`/devis/${q.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {q.title?.trim() || "Sans titre"}
                </Link>
                {q.reference ? (
                  <div className="text-xs text-muted-foreground">
                    Réf. {q.reference}
                  </div>
                ) : null}
              </td>
              <td className="p-3 text-muted-foreground">
                {q.clientName ?? "—"}
              </td>
              <td className="p-3">
                <span className="inline-flex rounded-md border px-2 py-0.5 text-xs">
                  {QUOTE_STATUS_LABELS[q.status]}
                </span>
              </td>
              <td className="p-3 text-right font-medium tabular-nums">
                {formatCentsEUR(q.totalTtcCents)}
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground whitespace-nowrap">
                {formatDate(q.updatedAt)}
              </td>
              <td className="p-3 text-right align-middle">
                {q.status === "sent" || q.status === "accepted" ? (
                  <CreateInvoiceFromQuoteButton
                    quoteId={q.id}
                    variant="outline"
                    size="sm"
                    compact
                  />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
