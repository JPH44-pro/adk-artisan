import Link from "next/link";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";

export default function ClientNotFound(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">Client introuvable</h1>
      <p className="text-muted-foreground mb-6">
        Ce client n’existe pas ou a été supprimé.
      </p>
      <Button asChild>
        <Link href="/clients">Retour à la liste</Link>
      </Button>
    </div>
  );
}
