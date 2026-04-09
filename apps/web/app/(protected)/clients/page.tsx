import type { Metadata } from "next";
import type { ReactElement } from "react";
import { listClients } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { ImportClientsDialog } from "@/components/clients/ImportClientsDialog";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsPagination } from "@/components/clients/ClientsPagination";

export const metadata: Metadata = {
  title: "Clients",
};

interface ClientsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ClientsPage({
  searchParams,
}: ClientsPageProps): Promise<ReactElement> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const data = await listClients({ q, page, pageSize: 20 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Dossier clients : recherche, liste et fiches détaillées.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateClientDialog />
          <ImportClientsDialog />
        </div>
      </div>

      <form
        action="/clients"
        method="get"
        className="flex flex-col gap-2 sm:flex-row sm:items-center mb-6"
      >
        <Input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom, ville, e-mail…"
          className="sm:max-w-md"
          aria-label="Recherche clients"
        />
        <input type="hidden" name="page" value="1" />
        <Button type="submit" variant="secondary">
          Rechercher
        </Button>
      </form>

      <div className="space-y-6">
        <ClientsTable items={data.items} />
        <ClientsPagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          q={q}
        />
      </div>
    </div>
  );
}
