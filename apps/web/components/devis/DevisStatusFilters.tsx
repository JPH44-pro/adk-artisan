import Link from "next/link";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/lib/drizzle/schema";
import { QUOTE_STATUS_LABELS } from "@/lib/quotes/labels";

const ALL = "all" as const;

type FilterValue = typeof ALL | QuoteStatus;

interface DevisStatusFiltersProps {
  current: FilterValue;
}

const LINKS: { value: FilterValue; label: string }[] = [
  { value: ALL, label: "Tous" },
  { value: "draft", label: QUOTE_STATUS_LABELS.draft },
  { value: "sent", label: QUOTE_STATUS_LABELS.sent },
  { value: "accepted", label: QUOTE_STATUS_LABELS.accepted },
  { value: "rejected", label: QUOTE_STATUS_LABELS.rejected },
  { value: "expired", label: QUOTE_STATUS_LABELS.expired },
];

export function DevisStatusFilters({
  current,
}: DevisStatusFiltersProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {LINKS.map((item) => {
        const href =
          item.value === ALL ? "/devis" : `/devis?status=${item.value}`;
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
