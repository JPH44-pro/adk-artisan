import Link from "next/link";
import type { ReactElement } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceStatus } from "@/lib/drizzle/schema";

interface FacturesPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  status: InvoiceStatus | "all";
}

export function FacturesPagination({
  page,
  pageSize,
  total,
  status,
}: FacturesPaginationProps): ReactElement {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const statusQuery =
    status === "all" ? "" : `&status=${encodeURIComponent(status)}`;

  if (totalPages <= 1) {
    return <p className="text-sm text-muted-foreground">{total} facture(s)</p>;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {total} facture(s) — page {page} / {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/factures?page=${page - 1}${statusQuery}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
        )}
        {page < totalPages ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/factures?page=${page + 1}${statusQuery}`}>
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
