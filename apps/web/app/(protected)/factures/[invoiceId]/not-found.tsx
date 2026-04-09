import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export default function FactureNotFound(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">Facture introuvable</h1>
      <p className="text-muted-foreground mb-6">
        Cette facture n’existe pas ou vous n’y avez pas accès.
      </p>
      <Button asChild>
        <Link href="/factures">Retour à la liste</Link>
      </Button>
    </div>
  );
}
