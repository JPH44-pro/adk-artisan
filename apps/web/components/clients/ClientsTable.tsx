import Link from "next/link";
import type { ReactElement } from "react";
import { formatDate } from "@/lib/utils";
import type { Client } from "@/lib/drizzle/schema";

interface ClientsTableProps {
  items: Client[];
}

export function ClientsTable({ items }: ClientsTableProps): ReactElement {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border rounded-lg p-8 text-center">
        Aucun client pour cette recherche. Créez un client ou modifiez les
        filtres.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="p-3 font-medium">Nom</th>
            <th className="p-3 font-medium hidden sm:table-cell">Coordonnées</th>
            <th className="p-3 font-medium hidden md:table-cell">Ville</th>
            <th className="p-3 font-medium hidden lg:table-cell">Modifié</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-3">
                <Link
                  href={`/clients/${c.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {c.name}
                </Link>
                {c.companyName ? (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.companyName}
                  </div>
                ) : null}
              </td>
              <td className="p-3 hidden sm:table-cell text-muted-foreground">
                {[c.email, c.phone].filter(Boolean).join(" · ") || "—"}
              </td>
              <td className="p-3 hidden md:table-cell">
                {c.city ? (
                  <>
                    {c.postalCode ? `${c.postalCode} ` : null}
                    {c.city}
                  </>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="p-3 hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                {formatDate(c.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
