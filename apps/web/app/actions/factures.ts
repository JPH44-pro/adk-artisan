"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import {
  invoiceLines,
  invoices,
  INVOICE_STATUSES,
  type InvoiceStatus,
} from "@/lib/drizzle/schema";
import { aggregateQuoteTotals, lineTotalHtCents } from "@/lib/quotes/calc";
import { queryInvoiceIdByQuoteForUser } from "@/lib/queries/invoices";
import {
  queryClientExistsForUser,
  queryQuoteWithLinesForUser,
} from "@/lib/queries/quotes";

const uuidSchema = z.string().uuid("Identifiant invalide");

const lineSchema = z.object({
  label: z.string().trim().min(1, "Chaque ligne doit avoir un libellé.").max(500),
  quantity: z.string().trim().min(1, "Quantité requise"),
  unitPriceHtCents: z.coerce.number().int().min(0),
});

function parseDateInput(s: string | undefined): Date | null {
  if (!s?.trim()) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const saveInvoicePayloadSchema = z.object({
  title: z.string().trim().max(200).optional(),
  reference: z.string().trim().max(100).optional(),
  clientId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.union([z.string().uuid(), z.null()])
  ),
  vatRateBps: z.coerce.number().int().min(0).max(50000),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(8000).optional(),
  lines: z.array(lineSchema).min(1, "Au moins une ligne est requise."),
});

export type SaveInvoicePayload = z.infer<typeof saveInvoicePayloadSchema>;

async function assertInvoiceOwned(
  userId: string,
  invoiceId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)))
    .limit(1);
  return Boolean(row);
}

export async function createInvoice(
  clientId?: string | null
): Promise<{ success: true; id: string } | { error: string }> {
  const userId = await requireUserId();
  if (clientId) {
    const ok = await queryClientExistsForUser(userId, clientId);
    if (!ok) {
      return { error: "Client introuvable." };
    }
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx
        .insert(invoices)
        .values({
          userId,
          clientId: clientId ?? null,
          title: "Nouvelle facture",
          status: "draft",
          issueDate: new Date(),
        })
        .returning({ id: invoices.id });

      if (!inv) {
        throw new Error("insert invoice");
      }

      await tx.insert(invoiceLines).values({
        invoiceId: inv.id,
        sortOrder: 0,
        label: "Prestation",
        quantity: "1",
        unitPriceHtCents: 0,
        lineTotalHtCents: 0,
      });

      return inv.id;
    });

    revalidatePath("/factures");
    return { success: true, id: result };
  } catch (e) {
    console.error("createInvoice", e);
    return { error: "Impossible de créer la facture." };
  }
}

export async function createInvoiceFromQuote(
  quoteId: string
): Promise<
  | { success: true; id: string }
  | { error: string; existingInvoiceId?: string }
> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(quoteId);
  if (!idParsed.success) {
    return { error: "Devis introuvable." };
  }

  const data = await queryQuoteWithLinesForUser(userId, idParsed.data);
  if (!data) {
    return { error: "Devis introuvable." };
  }

  if (data.quote.status !== "sent" && data.quote.status !== "accepted") {
    return {
      error:
        "Pour facturer, le devis doit être au statut « Envoyé » ou « Accepté ».",
    };
  }

  if (data.lines.length === 0) {
    return { error: "Le devis ne contient aucune ligne." };
  }

  const existingInvoiceId = await queryInvoiceIdByQuoteForUser(
    userId,
    idParsed.data
  );
  if (existingInvoiceId) {
    return {
      error: "Une facture existe déjà pour ce devis.",
      existingInvoiceId,
    };
  }

  try {
    const newId = await db.transaction(async (tx) => {
      const [inv] = await tx
        .insert(invoices)
        .values({
          userId,
          clientId: data.quote.clientId,
          quoteId: data.quote.id,
          title: data.quote.title
            ? `Facture — ${data.quote.title}`
            : "Facture",
          status: "draft",
          vatRateBps: data.quote.vatRateBps,
          subtotalHtCents: data.quote.subtotalHtCents,
          vatCents: data.quote.vatCents,
          totalTtcCents: data.quote.totalTtcCents,
          issueDate: new Date(),
          dueDate: null,
          notes: data.quote.notes,
        })
        .returning({ id: invoices.id });

      if (!inv) {
        throw new Error("insert invoice");
      }

      for (let i = 0; i < data.lines.length; i++) {
        const ln = data.lines[i];
        await tx.insert(invoiceLines).values({
          invoiceId: inv.id,
          sortOrder: i,
          label: ln.label,
          quantity: ln.quantity,
          unitPriceHtCents: ln.unitPriceHtCents,
          lineTotalHtCents: ln.lineTotalHtCents,
        });
      }

      return inv.id;
    });

    revalidatePath("/factures");
    revalidatePath("/devis");
    revalidatePath(`/devis/${idParsed.data}`);
    return { success: true, id: newId };
  } catch (e) {
    console.error("createInvoiceFromQuote", e);
    return { error: "Impossible de créer la facture depuis ce devis." };
  }
}

export async function saveInvoice(
  invoiceId: string,
  input: unknown
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(invoiceId);
  if (!idParsed.success) {
    return { error: "Facture introuvable." };
  }

  const parsed = saveInvoicePayloadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(" ") || "Données invalides.",
    };
  }

  const data = parsed.data;
  const owned = await assertInvoiceOwned(userId, idParsed.data);
  if (!owned) {
    return { error: "Facture introuvable." };
  }

  let clientId: string | null = null;
  if (data.clientId) {
    const ok = await queryClientExistsForUser(userId, data.clientId);
    if (!ok) {
      return { error: "Client introuvable." };
    }
    clientId = data.clientId;
  }

  const issueDate = parseDateInput(data.issueDate) ?? new Date();
  const dueDate = parseDateInput(data.dueDate);

  const linesForTotals = data.lines.map((l) => ({
    quantity: l.quantity,
    unitPriceHtCents: l.unitPriceHtCents,
  }));
  const totals = aggregateQuoteTotals(linesForTotals, data.vatRateBps);

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(invoices)
        .set({
          title: data.title?.length ? data.title : null,
          reference: data.reference?.length ? data.reference : null,
          clientId,
          vatRateBps: data.vatRateBps,
          issueDate,
          dueDate,
          notes: data.notes?.length ? data.notes : null,
          subtotalHtCents: totals.subtotalHtCents,
          vatCents: totals.vatCents,
          totalTtcCents: totals.totalTtcCents,
          updatedAt: new Date(),
        })
        .where(and(eq(invoices.id, idParsed.data), eq(invoices.userId, userId)));

      await tx
        .delete(invoiceLines)
        .where(eq(invoiceLines.invoiceId, idParsed.data));

      for (let i = 0; i < data.lines.length; i++) {
        const line = data.lines[i];
        const lt = lineTotalHtCents(line.quantity, line.unitPriceHtCents);
        await tx.insert(invoiceLines).values({
          invoiceId: idParsed.data,
          sortOrder: i,
          label: line.label,
          quantity: line.quantity.trim().replace(",", "."),
          unitPriceHtCents: line.unitPriceHtCents,
          lineTotalHtCents: lt,
        });
      }
    });

    revalidatePath("/factures");
    revalidatePath(`/factures/${idParsed.data}`);
    return { success: true };
  } catch (e) {
    console.error("saveInvoice", e);
    return { error: "Enregistrement impossible." };
  }
}

const statusSchema = z.enum(INVOICE_STATUSES);

export async function setInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(invoiceId);
  if (!idParsed.success) {
    return { error: "Facture introuvable." };
  }
  if (!statusSchema.safeParse(status).success) {
    return { error: "Statut invalide." };
  }

  const result = await db
    .update(invoices)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(invoices.id, idParsed.data), eq(invoices.userId, userId)))
    .returning({ id: invoices.id });

  if (result.length === 0) {
    return { error: "Facture introuvable." };
  }

  revalidatePath("/factures");
  revalidatePath(`/factures/${idParsed.data}`);
  return { success: true };
}

export async function duplicateInvoice(
  invoiceId: string
): Promise<{ success: true; id: string } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(invoiceId);
  if (!idParsed.success) {
    return { error: "Facture introuvable." };
  }

  const existing = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, idParsed.data), eq(invoices.userId, userId)))
    .limit(1);

  const inv0 = existing[0];
  if (!inv0) {
    return { error: "Facture introuvable." };
  }

  const lines = await db
    .select()
    .from(invoiceLines)
    .where(eq(invoiceLines.invoiceId, idParsed.data));

  try {
    const newId = await db.transaction(async (tx) => {
      const [ni] = await tx
        .insert(invoices)
        .values({
          userId,
          clientId: inv0.clientId,
          quoteId: null,
          status: "draft",
          title: inv0.title ? `Copie — ${inv0.title}` : "Copie de facture",
          reference: null,
          vatRateBps: inv0.vatRateBps,
          subtotalHtCents: inv0.subtotalHtCents,
          vatCents: inv0.vatCents,
          totalTtcCents: inv0.totalTtcCents,
          issueDate: new Date(),
          dueDate: null,
          notes: inv0.notes,
          pdfStorageKey: null,
        })
        .returning({ id: invoices.id });

      if (!ni) {
        throw new Error("dup invoice");
      }

      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        await tx.insert(invoiceLines).values({
          invoiceId: ni.id,
          sortOrder: i,
          label: ln.label,
          quantity: ln.quantity,
          unitPriceHtCents: ln.unitPriceHtCents,
          lineTotalHtCents: ln.lineTotalHtCents,
        });
      }

      return ni.id;
    });

    revalidatePath("/factures");
    return { success: true, id: newId };
  } catch (e) {
    console.error("duplicateInvoice", e);
    return { error: "Duplication impossible." };
  }
}

export async function deleteInvoice(
  invoiceId: string
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(invoiceId);
  if (!idParsed.success) {
    return { error: "Facture introuvable." };
  }

  const result = await db
    .delete(invoices)
    .where(and(eq(invoices.id, idParsed.data), eq(invoices.userId, userId)))
    .returning({ id: invoices.id });

  if (result.length === 0) {
    return { error: "Facture introuvable." };
  }

  revalidatePath("/factures");
  return { success: true };
}
