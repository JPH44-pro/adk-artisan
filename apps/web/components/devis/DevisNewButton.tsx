"use client";

import { useTransition } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createQuote } from "@/app/actions/devis";

export function DevisNewButton(): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(): void {
    startTransition(async () => {
      const result = await createQuote();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.push(`/devis/${result.id}`);
      router.refresh();
    });
  }

  return (
    <Button type="button" onClick={handleClick} disabled={pending}>
      <Plus className="h-4 w-4 mr-2" />
      {pending ? "Création…" : "Nouveau devis"}
    </Button>
  );
}
