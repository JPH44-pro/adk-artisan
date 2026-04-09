"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Invoice, InvoiceLine, InvoiceStatus } from "@/lib/drizzle/schema";
import { aggregateQuoteTotals, formatCentsEUR } from "@/lib/quotes/calc";
import { INVOICE_STATUS_OPTIONS } from "@/lib/invoices/labels";
import {
  deleteInvoice,
  duplicateInvoice,
  saveInvoice,
  setInvoiceStatus,
} from "@/app/actions/factures";

interface InvoiceEditorClientProps {
  invoice: Invoice;
  lines: InvoiceLine[];
  clientOptions: { id: string; name: string }[];
}

interface LocalLine {
  key: string;
  label: string;
  quantity: string;
  unitPriceHtCents: number;
}

function toDateInputValue(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

function centsToEuroInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function parseEuroInput(raw: string): number {
  const n = parseFloat(raw.replace(",", ".").replace(/\s/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : 0;
}

export function InvoiceEditorClient({
  invoice,
  lines: initialLines,
  clientOptions,
}: InvoiceEditorClientProps): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(invoice.title ?? "");
  const [reference, setReference] = useState(invoice.reference ?? "");
  const [clientId, setClientId] = useState<string>(invoice.clientId ?? "");
  const [vatPercent, setVatPercent] = useState(
    (invoice.vatRateBps / 100).toFixed(2)
  );
  const [issueDate, setIssueDate] = useState(toDateInputValue(invoice.issueDate));
  const [dueDate, setDueDate] = useState(toDateInputValue(invoice.dueDate));
  const [notes, setNotes] = useState(invoice.notes ?? "");
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);

  const [localLines, setLocalLines] = useState<LocalLine[]>(() =>
    initialLines.map((l) => ({
      key: l.id,
      label: l.label,
      quantity: String(l.quantity),
      unitPriceHtCents: l.unitPriceHtCents,
    }))
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice.status]);

  const vatRateBps = Math.round(parseFloat(vatPercent.replace(",", ".")) * 100);
  const safeVatBps =
    Number.isFinite(vatRateBps) && vatRateBps >= 0 && vatRateBps <= 50000
      ? vatRateBps
      : invoice.vatRateBps;

  const previewTotals = useMemo(() => {
    const linesForCalc = localLines.map((l) => ({
      quantity: l.quantity,
      unitPriceHtCents: l.unitPriceHtCents,
    }));
    return aggregateQuoteTotals(linesForCalc, safeVatBps);
  }, [localLines, safeVatBps]);

  function addLine(): void {
    setLocalLines((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        label: "Prestation",
        quantity: "1",
        unitPriceHtCents: 0,
      },
    ]);
  }

  function removeLine(key: string): void {
    setLocalLines((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((l) => l.key !== key);
    });
  }

  function updateLine(
    key: string,
    patch: Partial<Pick<LocalLine, "label" | "quantity" | "unitPriceHtCents">>
  ): void {
    setLocalLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  }

  function handleSave(): void {
    startTransition(async () => {
      const vatParsed = parseFloat(vatPercent.replace(",", "."));
      const vatBps = Math.round(vatParsed * 100);
      if (!Number.isFinite(vatBps) || vatBps < 0 || vatBps > 50000) {
        toast.error("TVA invalide (0 à 500 %).");
        return;
      }

      const payload = {
        title: title.trim() || undefined,
        reference: reference.trim() || undefined,
        clientId: clientId === "" ? null : clientId,
        vatRateBps: vatBps,
        issueDate: issueDate || undefined,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
        lines: localLines.map((l) => ({
          label: l.label,
          quantity: l.quantity,
          unitPriceHtCents: l.unitPriceHtCents,
        })),
      };

      const result = await saveInvoice(invoice.id, payload);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Facture enregistrée.");
      router.refresh();
    });
  }

  function handleStatusChange(value: string): void {
    const next = value as InvoiceStatus;
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await setInvoiceStatus(invoice.id, next);
      if ("error" in result) {
        toast.error(result.error);
        setStatus(previous);
        return;
      }
      toast.success("Statut mis à jour.");
      router.refresh();
    });
  }

  function handleDuplicate(): void {
    startTransition(async () => {
      const result = await duplicateInvoice(invoice.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.push(`/factures/${result.id}`);
      router.refresh();
    });
  }

  function handleDelete(): void {
    startTransition(async () => {
      const result = await deleteInvoice(invoice.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Facture supprimée.");
      setDeleteOpen(false);
      router.push("/factures");
      router.refresh();
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <Link
          href="/factures"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux factures
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {title.trim() || "Facture"}
            </h1>
            <div className="flex flex-col gap-1 mt-2 text-sm">
              {invoice.clientId ? (
                <Link
                  href={`/clients/${invoice.clientId}`}
                  className="text-primary hover:underline"
                >
                  Fiche client
                </Link>
              ) : (
                <span className="text-muted-foreground">Aucun client lié</span>
              )}
              {invoice.quoteId ? (
                <Link
                  href={`/devis/${invoice.quoteId}`}
                  className="text-primary hover:underline"
                >
                  Devis source
                </Link>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={pending}
            >
              <Copy className="h-4 w-4 mr-1" />
              Dupliquer
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              disabled={pending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select
            value={clientId || "__none__"}
            onValueChange={(v) => setClientId(v === "__none__" ? "" : v)}
          >
            <SelectTrigger id="client">
              <SelectValue placeholder="Choisir un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">— Aucun —</SelectItem>
              {clientOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Référence interne</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="vat">TVA (%)</Label>
          <Input
            id="vat"
            value={vatPercent}
            onChange={(e) => setVatPercent(e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue">Date d&apos;émission</Label>
          <Input
            id="issue"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due">Échéance de paiement</Label>
          <Input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={8000}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lignes (HT)</h2>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            Ajouter une ligne
          </Button>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="p-2 font-medium">Libellé</th>
                <th className="p-2 font-medium w-24">Qté</th>
                <th className="p-2 font-medium w-32">PU HT (€)</th>
                <th className="p-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {localLines.map((line) => (
                <tr key={line.key} className="border-b last:border-0">
                  <td className="p-2 align-top">
                    <Input
                      value={line.label}
                      onChange={(e) =>
                        updateLine(line.key, { label: e.target.value })
                      }
                      maxLength={500}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(line.key, { quantity: e.target.value })
                      }
                      inputMode="decimal"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      value={centsToEuroInput(line.unitPriceHtCents)}
                      onChange={(e) =>
                        updateLine(line.key, {
                          unitPriceHtCents: parseEuroInput(e.target.value),
                        })
                      }
                      inputMode="decimal"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      disabled={localLines.length <= 1}
                      onClick={() => removeLine(line.key)}
                      aria-label="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total HT</span>
          <span className="font-medium tabular-nums">
            {formatCentsEUR(previewTotals.subtotalHtCents)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            TVA ({(safeVatBps / 100).toFixed(2).replace(".", ",")} %)
          </span>
          <span className="font-medium tabular-nums">
            {formatCentsEUR(previewTotals.vatCents)}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Total TTC</span>
          <span className="tabular-nums">
            {formatCentsEUR(previewTotals.totalTtcCents)}
          </span>
        </div>
      </div>

      <section
        className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground space-y-2"
        aria-label="PDF"
      >
        <p className="font-medium text-foreground">PDF</p>
        <p>
          Génération PDF (modèle, mise en page, stockage) : à brancher plus tard.
          L&apos;enregistrement en base ne dépend pas du PDF.
        </p>
        {invoice.pdfStorageKey ? (
          <p className="text-xs break-all">
            Référence de stockage : {invoice.pdfStorageKey}
          </p>
        ) : null}
      </section>

      <Button type="button" onClick={handleSave} disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer la facture"}
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette facture ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive. Les lignes seront supprimées avec la
              facture.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={pending}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              {pending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
