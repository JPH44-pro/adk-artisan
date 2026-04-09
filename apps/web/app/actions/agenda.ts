"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import {
  agendaEvents,
  AGENDA_EVENT_KINDS,
  AGENDA_TYPOLOGIES,
} from "@/lib/drizzle/schema";
import { queryClientExistsForUser } from "@/lib/queries/quotes";

const uuidSchema = z.string().uuid("Identifiant invalide");

const optionalTrimmed = z
  .string()
  .max(2000)
  .optional()
  .transform((v) => (v === undefined || v === "" ? undefined : v.trim()));

const kindSchema = z.enum(AGENDA_EVENT_KINDS);
const typologySchema = z.enum(AGENDA_TYPOLOGIES);

const eventInputSchema = z.object({
  eventKind: kindSchema.default("appointment"),
  typology: typologySchema.default("other"),
  title: z.string().trim().min(1, "Le titre est obligatoire").max(300),
  notes: z
    .string()
    .max(8000)
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : v.trim())),
  location: optionalTrimmed,
  clientId: z
    .union([z.literal(""), z.string().uuid()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  startAt: z.string().min(1, "Date de début requise"),
  endAt: z.string().min(1, "Date de fin requise"),
});

function parseInstant(s: string): Date | null {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createAgendaEvent(
  input: unknown
): Promise<{ success: true; id: string } | { error: string }> {
  const userId = await requireUserId();
  const parsed = eventInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues.map((i) => i.message).join(" ") ||
        "Données invalides.",
    };
  }

  const data = parsed.data;
  const startAt = parseInstant(data.startAt);
  const endAt = parseInstant(data.endAt);
  if (!startAt || !endAt) {
    return { error: "Date ou heure invalide." };
  }
  if (endAt <= startAt) {
    return { error: "La fin doit être après le début." };
  }

  if (data.clientId) {
    const ok = await queryClientExistsForUser(userId, data.clientId);
    if (!ok) {
      return { error: "Client introuvable." };
    }
  }

  const [row] = await db
    .insert(agendaEvents)
    .values({
      userId,
      clientId: data.clientId ?? null,
      eventKind: data.eventKind,
      typology: data.typology,
      title: data.title,
      notes: data.notes ?? null,
      location: data.location ?? null,
      startAt,
      endAt,
    })
    .returning({ id: agendaEvents.id });

  if (!row) {
    return { error: "Création impossible." };
  }

  revalidatePath("/agenda");
  return { success: true, id: row.id };
}

const updateSchema = eventInputSchema.extend({
  id: uuidSchema,
});

export async function updateAgendaEvent(
  input: unknown
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues.map((i) => i.message).join(" ") ||
        "Données invalides.",
    };
  }

  const data = parsed.data;
  const startAt = parseInstant(data.startAt);
  const endAt = parseInstant(data.endAt);
  if (!startAt || !endAt) {
    return { error: "Date ou heure invalide." };
  }
  if (endAt <= startAt) {
    return { error: "La fin doit être après le début." };
  }

  if (data.clientId) {
    const ok = await queryClientExistsForUser(userId, data.clientId);
    if (!ok) {
      return { error: "Client introuvable." };
    }
  }

  const [updated] = await db
    .update(agendaEvents)
    .set({
      clientId: data.clientId ?? null,
      eventKind: data.eventKind,
      typology: data.typology,
      title: data.title,
      notes: data.notes ?? null,
      location: data.location ?? null,
      startAt,
      endAt,
      updatedAt: new Date(),
    })
    .where(
      and(eq(agendaEvents.id, data.id), eq(agendaEvents.userId, userId))
    )
    .returning({ id: agendaEvents.id });

  if (!updated) {
    return { error: "Événement introuvable." };
  }

  revalidatePath("/agenda");
  return { success: true };
}

export async function deleteAgendaEvent(
  eventId: string
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(eventId);
  if (!idParsed.success) {
    return { error: "Événement introuvable." };
  }

  const deleted = await db
    .delete(agendaEvents)
    .where(
      and(eq(agendaEvents.id, idParsed.data), eq(agendaEvents.userId, userId))
    )
    .returning({ id: agendaEvents.id });

  if (deleted.length === 0) {
    return { error: "Événement introuvable." };
  }

  revalidatePath("/agenda");
  return { success: true };
}
