"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import type { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClientForm } from "@/components/clients/ClientForm";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
import { updateClient } from "@/app/actions/clients";
import type { ClientFormInput } from "@/app/actions/clients";
import type { Client } from "@/lib/drizzle/schema";
import { formatDate } from "@/lib/utils";

interface ClientDetailClientProps {
  client: Client;
}

export function ClientDetailClient({
  client,
}: ClientDetailClientProps): ReactElement {
  const router = useRouter();

  async function handleUpdate(
    data: ClientFormInput
  ): Promise<{ error?: string } | void> {
    const result = await updateClient(client.id, data);
    if ("error" in result) {
      return { error: result.error };
    }
    toast.success("Client enregistré.");
    router.refresh();
    return undefined;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à la liste
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            {client.companyName ? (
              <p className="text-muted-foreground mt-1">{client.companyName}</p>
            ) : null}
            <p className="text-xs text-muted-foreground mt-2">
              Dernière mise à jour : {formatDate(client.updatedAt)}
            </p>
          </div>
          <DeleteClientButton
            clientId={client.id}
            clientName={client.name}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
          <CardDescription>Lecture rapide (identique au formulaire ci-dessous)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">E-mail : </span>
            {client.email ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Téléphone : </span>
            {client.phone ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Adresse : </span>
            {client.addressLine1 ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Ville : </span>
            {[client.postalCode, client.city].filter(Boolean).join(" ") || "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Pays : </span>
            {client.country}
          </p>
          {client.notes ? (
            <>
              <Separator className="my-3" />
              <p className="whitespace-pre-wrap">{client.notes}</p>
            </>
          ) : null}
        </CardContent>
      </Card>

      <section
        className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
        aria-label="Historique documents"
      >
        Historique des devis et factures liés à ce client : prévu aux phases
        devis et facturation.
      </section>

      <div>
        <h2 className="text-lg font-semibold mb-4">Modifier le client</h2>
        <ClientForm
          client={client}
          submitLabel="Enregistrer les modifications"
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
}
