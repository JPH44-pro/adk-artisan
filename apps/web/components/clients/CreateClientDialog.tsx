"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { createClient, type ClientFormInput } from "@/app/actions/clients";

export function CreateClientDialog(): ReactElement {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleCreate(
    data: ClientFormInput
  ): Promise<{ error?: string } | void> {
    const result = await createClient(data);
    if ("error" in result) {
      return { error: result.error };
    }
    setOpen(false);
    router.push(`/clients/${result.id}`);
    router.refresh();
    return undefined;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
          <DialogDescription>
            Saisissez l’identité et les coordonnées. Vous pourrez compléter plus
            tard.
          </DialogDescription>
        </DialogHeader>
        <ClientForm submitLabel="Créer le client" onSubmit={handleCreate} />
      </DialogContent>
    </Dialog>
  );
}
