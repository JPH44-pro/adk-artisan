import Link from "next/link";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/drizzle/schema";
import { INVOICE_STATUS_LABELS } from "@/lib/invoices/labels";

const ALL = "all" as const;

type FilterValue = typeof ALL | InvoiceStatus;

interface FacturesStatusFiltersProps {
  current: FilterValue;
}

const LINKS: { value: FilterValue; label: string }[] = [
  { value: ALL, label: "Toutes" },
  { value: "draft", label: INVOICE_STATUS_LABELS.draft },
  { value: "sent", label: INVOICE_STATUS_LABELS.sent },
  { value: "paid", label: INVOICE_STATUS_LABELS.paid },
  { value: "overdue", label: INVOICE_STATUS_LABELS.overdue },
  { value: "cancelled", label: INVOICE_STATUS_LABELS.cancelled },
];

export function FacturesStatusFilters({
  current,
}: FacturesStatusFiltersProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {LINKS.map((item) => {
        const href =
          item.value === ALL ? "/factures" : `/factures?status=${item.value}`;
        const active = current === item.value;
        return (
          <Link
            key={item.value}
            href={href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
