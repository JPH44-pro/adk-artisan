import Link from "next/link";
import type { ReactElement } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  q: string;
}

export function ClientsPagination({
  page,
  pageSize,
  total,
  q,
}: ClientsPaginationProps): ReactElement {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  if (totalPages <= 1) {
    return <p className="text-sm text-muted-foreground">{total} client(s)</p>;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {total} client(s) — page {page} / {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clients?page=${page - 1}${qParam}`}>
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
            <Link href={`/clients?page=${page + 1}${qParam}`}>
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
