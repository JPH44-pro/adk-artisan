"use client";

import { useEffect, useState, useTransition, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { updateQuoteBranding } from "@/app/actions/profile";

export function QuoteBrandingCard(): ReactElement {
  const router = useRouter();
  const { quoteCompanyName, quoteLetterhead } = useUser();
  const [company, setCompany] = useState(quoteCompanyName ?? "");
  const [letterhead, setLetterhead] = useState(quoteLetterhead ?? "");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setCompany(quoteCompanyName ?? "");
    setLetterhead(quoteLetterhead ?? "");
  }, [quoteCompanyName, quoteLetterhead]);

  function handleSave(): void {
    startTransition(async () => {
      const result = await updateQuoteBranding({
        quoteCompanyName: company,
        quoteLetterhead: letterhead,
      });
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("En-tête des devis enregistré.");
      router.refresh();
    });
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>Devis PDF — en-tête société</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground font-normal pt-1">
          Ces informations apparaissent en haut du PDF (téléchargement depuis la
          fiche devis). Indiquez votre raison sociale et, si besoin, adresse,
          SIRET, TVA intracommunautaire, téléphone.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="quote-company">Raison sociale (optionnel)</Label>
          <Input
            id="quote-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ex. : SARL Dupont Rénovation"
            maxLength={200}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote-letterhead">Bloc en-tête (optionnel)</Label>
          <Textarea
            id="quote-letterhead"
            value={letterhead}
            onChange={(e) => setLetterhead(e.target.value)}
            placeholder={"12 rue des Artisans\n75000 Paris\nSIRET … · TVA …\nTél. …"}
            rows={6}
            maxLength={4000}
            disabled={pending}
            className="font-mono text-sm"
          />
        </div>
        <Button type="button" onClick={handleSave} disabled={pending}>
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}
