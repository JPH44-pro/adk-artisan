"use client";

import { useTransition } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createInvoice } from "@/app/actions/factures";

export function FacturesNewButton(): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(): void {
    startTransition(async () => {
      const result = await createInvoice();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.push(`/factures/${result.id}`);
      router.refresh();
    });
  }

  return (
    <Button type="button" onClick={handleClick} disabled={pending}>
      <Plus className="h-4 w-4 mr-2" />
      {pending ? "Création…" : "Nouvelle facture"}
    </Button>
  );
}
