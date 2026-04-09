"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import {
  quoteLines,
  quotes,
  QUOTE_STATUSES,
  type QuoteStatus,
} from "@/lib/drizzle/schema";
import { aggregateQuoteTotals, lineTotalHtCents } from "@/lib/quotes/calc";
import { queryClientExistsForUser } from "@/lib/queries/quotes";

const uuidSchema = z.string().uuid("Identifiant invalide");

const lineSchema = z.object({
  label: z.string().trim().min(1, "Chaque ligne doit avoir un libellé.").max(500),
  quantity: z.string().trim().min(1, "Quantité requise"),
  unitPriceHtCents: z.coerce.number().int().min(0),
});

const saveQuotePayloadSchema = z.object({
  title: z.string().trim().max(200).optional(),
  reference: z.string().trim().max(100).optional(),
  clientId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.union([z.string().uuid(), z.null()])
  ),
  vatRateBps: z.coerce.number().int().min(0).max(50000),
  validUntil: z
    .string()
    .optional()
    .transform((s) => {
      if (!s || !s.trim()) return null;
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? null : d;
    }),
  notes: z.string().trim().max(8000).optional(),
  lines: z.array(lineSchema).min(1, "Au moins une ligne est requise."),
});

export type SaveQuotePayload = z.infer<typeof saveQuotePayloadSchema>;

async function assertQuoteOwned(
  userId: string,
  quoteId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: quotes.id })
    .from(quotes)
    .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)))
    .limit(1);
  return Boolean(row);
}

export async function createQuote(
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
      const [q] = await tx
        .insert(quotes)
        .values({
          userId,
          clientId: clientId ?? null,
          title: "Nouveau devis",
          status: "draft",
        })
        .returning({ id: quotes.id });

      if (!q) {
        throw new Error("insert quote");
      }

      await tx.insert(quoteLines).values({
        quoteId: q.id,
        sortOrder: 0,
        label: "Prestation",
        quantity: "1",
        unitPriceHtCents: 0,
        lineTotalHtCents: 0,
      });

      return q.id;
    });

    revalidatePath("/devis");
    return { success: true, id: result };
  } catch (e) {
    console.error("createQuote", e);
    return { error: "Impossible de créer le devis." };
  }
}

export async function saveQuote(
  quoteId: string,
  input: unknown
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(quoteId);
  if (!idParsed.success) {
    return { error: "Devis introuvable." };
  }

  const parsed = saveQuotePayloadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(" ") || "Données invalides.",
    };
  }

  const data = parsed.data;
  const owned = await assertQuoteOwned(userId, idParsed.data);
  if (!owned) {
    return { error: "Devis introuvable." };
  }

  let clientId: string | null = null;
  if (data.clientId && data.clientId !== "") {
    const ok = await queryClientExistsForUser(userId, data.clientId);
    if (!ok) {
      return { error: "Client introuvable." };
    }
    clientId = data.clientId;
  }

  const linesForTotals = data.lines.map((l) => ({
    quantity: l.quantity,
    unitPriceHtCents: l.unitPriceHtCents,
  }));
  const totals = aggregateQuoteTotals(linesForTotals, data.vatRateBps);

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(quotes)
        .set({
          title: data.title?.length ? data.title : null,
          reference: data.reference?.length ? data.reference : null,
          clientId,
          vatRateBps: data.vatRateBps,
          validUntil: data.validUntil,
          notes: data.notes?.length ? data.notes : null,
          subtotalHtCents: totals.subtotalHtCents,
          vatCents: totals.vatCents,
          totalTtcCents: totals.totalTtcCents,
          updatedAt: new Date(),
        })
        .where(and(eq(quotes.id, idParsed.data), eq(quotes.userId, userId)));

      await tx
        .delete(quoteLines)
        .where(eq(quoteLines.quoteId, idParsed.data));

      for (let i = 0; i < data.lines.length; i++) {
        const line = data.lines[i];
        const lt = lineTotalHtCents(line.quantity, line.unitPriceHtCents);
        await tx.insert(quoteLines).values({
          quoteId: idParsed.data,
          sortOrder: i,
          label: line.label,
          quantity: line.quantity.trim().replace(",", "."),
          unitPriceHtCents: line.unitPriceHtCents,
          lineTotalHtCents: lt,
        });
      }
    });

    revalidatePath("/devis");
    revalidatePath(`/devis/${idParsed.data}`);
    return { success: true };
  } catch (e) {
    console.error("saveQuote", e);
    return { error: "Enregistrement impossible." };
  }
}

const statusSchema = z.enum(QUOTE_STATUSES);

export async function setQuoteStatus(
  quoteId: string,
  status: QuoteStatus
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(quoteId);
  if (!idParsed.success) {
    return { error: "Devis introuvable." };
  }
  if (!statusSchema.safeParse(status).success) {
    return { error: "Statut invalide." };
  }

  const result = await db
    .update(quotes)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(quotes.id, idParsed.data), eq(quotes.userId, userId)))
    .returning({ id: quotes.id });

  if (result.length === 0) {
    return { error: "Devis introuvable." };
  }

  revalidatePath("/devis");
  revalidatePath(`/devis/${idParsed.data}`);
  return { success: true };
}

export async function duplicateQuote(
  quoteId: string
): Promise<{ success: true; id: string } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(quoteId);
  if (!idParsed.success) {
    return { error: "Devis introuvable." };
  }

  const existing = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.id, idParsed.data), eq(quotes.userId, userId)))
    .limit(1);

  const q0 = existing[0];
  if (!q0) {
    return { error: "Devis introuvable." };
  }

  const lines = await db
    .select()
    .from(quoteLines)
    .where(eq(quoteLines.quoteId, idParsed.data));

  try {
    const newId = await db.transaction(async (tx) => {
      const [nq] = await tx
        .insert(quotes)
        .values({
          userId,
          clientId: q0.clientId,
          status: "draft",
          title: q0.title ? `Copie — ${q0.title}` : "Copie de devis",
          reference: null,
          vatRateBps: q0.vatRateBps,
          subtotalHtCents: q0.subtotalHtCents,
          vatCents: q0.vatCents,
          totalTtcCents: q0.totalTtcCents,
          validUntil: null,
          notes: q0.notes,
        })
        .returning({ id: quotes.id });

      if (!nq) {
        throw new Error("dup quote");
      }

      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        await tx.insert(quoteLines).values({
          quoteId: nq.id,
          sortOrder: i,
          label: ln.label,
          quantity: ln.quantity,
          unitPriceHtCents: ln.unitPriceHtCents,
          lineTotalHtCents: ln.lineTotalHtCents,
        });
      }

      return nq.id;
    });

    revalidatePath("/devis");
    return { success: true, id: newId };
  } catch (e) {
    console.error("duplicateQuote", e);
    return { error: "Duplication impossible." };
  }
}

export async function deleteQuote(
  quoteId: string
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(quoteId);
  if (!idParsed.success) {
    return { error: "Devis introuvable." };
  }

  const result = await db
    .delete(quotes)
    .where(and(eq(quotes.id, idParsed.data), eq(quotes.userId, userId)))
    .returning({ id: quotes.id });

  if (result.length === 0) {
    return { error: "Devis introuvable." };
  }

  revalidatePath("/devis");
  return { success: true };
}
