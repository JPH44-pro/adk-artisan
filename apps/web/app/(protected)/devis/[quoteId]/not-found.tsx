import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export default function DevisNotFound(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">Devis introuvable</h1>
      <p className="text-muted-foreground mb-6">
        Ce devis n’existe pas ou vous n’y avez pas accès.
      </p>
      <Button asChild>
        <Link href="/devis">Retour à la liste</Link>
      </Button>
    </div>
  );
}
