import Link from "next/link";
import type { ReactElement } from "react";
import { formatDate } from "@/lib/utils";
import { formatCentsEUR } from "@/lib/quotes/calc";
import { INVOICE_STATUS_LABELS } from "@/lib/invoices/labels";
import type { InvoiceListRow } from "@/lib/queries/invoices";

interface FacturesTableProps {
  items: InvoiceListRow[];
}

export function FacturesTable({ items }: FacturesTableProps): ReactElement {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border rounded-lg p-8 text-center">
        Aucune facture pour ce filtre. Créez une facture ou modifiez le statut
        affiché.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="p-3 font-medium">Facture</th>
            <th className="p-3 font-medium">Client</th>
            <th className="p-3 font-medium">Statut</th>
            <th className="p-3 font-medium text-right">Total TTC</th>
            <th className="p-3 font-medium hidden md:table-cell">Émise</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-3">
                <Link
                  href={`/factures/${inv.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {inv.title?.trim() || "Sans titre"}
                </Link>
                {inv.reference ? (
                  <div className="text-xs text-muted-foreground">
                    Réf. {inv.reference}
                  </div>
                ) : null}
              </td>
              <td className="p-3 text-muted-foreground">
                {inv.clientName ?? "—"}
              </td>
              <td className="p-3">
                <span className="inline-flex rounded-md border px-2 py-0.5 text-xs">
                  {INVOICE_STATUS_LABELS[inv.status]}
                </span>
              </td>
              <td className="p-3 text-right font-medium tabular-nums">
                {formatCentsEUR(inv.totalTtcCents)}
              </td>
              <td className="p-3 hidden md:table-cell text-muted-foreground whitespace-nowrap">
                {formatDate(inv.issueDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
