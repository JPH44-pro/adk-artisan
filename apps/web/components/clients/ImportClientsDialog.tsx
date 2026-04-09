"use client";

import { useRef, useState, useTransition } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importClientsFromFile } from "@/app/actions/clients";

/** Modèle CSV (séparateur ;) avec BOM UTF-8 pour Excel. */
const TEMPLATE_CSV =
  "\ufeffnom;société;email;téléphone;adresse;ville;code postal;pays;notes\n" +
  "Dupont Jean;SARL Exemple;jean@example.com;0612345678;12 rue des Lilas;Lyon;69001;FR;\n";

function downloadCsvTemplate(): void {
  const blob = new Blob([TEMPLATE_CSV], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modele-import-clients-reglepro.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function ImportClientsDialog(): ReactElement {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(): void {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      const result = await importClientsFromFile(fd);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if (result.warnings.length > 0) {
        toast.message("Import terminé avec avertissements", {
          description: result.warnings.slice(0, 6).join("\n"),
        });
      }

      if (result.errors.length > 0) {
        toast.warning(
          `${result.created} client(s) créé(s), ${result.failed} ligne(s) en erreur`,
          {
            description: result.errors
              .slice(0, 5)
              .map((e) => `Ligne ${e.line} : ${e.message}`)
              .join("\n"),
          }
        );
      } else {
        toast.success(
          `${result.created} client(s) importé(s)${result.failed ? `, ${result.failed} ignoré(s)` : ""}`
        );
      }

      if (input) {
        input.value = "";
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Importer (CSV / Excel)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des clients</DialogTitle>
          <DialogDescription>
            Fichier <strong>.csv</strong>, <strong>.xlsx</strong> ou{" "}
            <strong>.xls</strong> : la <strong>première ligne non vide</strong>{" "}
            contient les en-têtes. La colonne <strong>nom</strong> est
            obligatoire pour chaque ligne. Maximum 500 lignes, fichier 2 Mo
            max.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            En-têtes reconnus (exemples) :{" "}
            <span className="font-mono text-xs">
              nom, société, email, téléphone, adresse, ville, code postal, pays,
              notes
            </span>
            — ou équivalents en anglais (<span className="font-mono text-xs">name, company, …</span>
            ).
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={downloadCsvTemplate}
          >
            Télécharger un modèle CSV
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          className="hidden"
          onChange={handleFileSelected}
        />

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {pending ? "Import…" : "Choisir un fichier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
