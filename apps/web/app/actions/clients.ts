"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import { clients, type Client } from "@/lib/drizzle/schema";
import { queryClientsForUser } from "@/lib/queries/clients";

const optionalTrimmed = z
  .string()
  .max(500)
  .optional()
  .transform((v) => (v === undefined || v === "" ? undefined : v.trim()));

const clientInputBaseSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire").max(200),
  companyName: optionalTrimmed,
  email: z
    .union([z.literal(""), z.string().trim().email().max(320)])
    .transform((v) => (v === "" ? undefined : v)),
  phone: optionalTrimmed,
  addressLine1: optionalTrimmed,
  city: optionalTrimmed,
  postalCode: optionalTrimmed,
  country: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? "FR" : v),
    z.string().trim().length(2, "Code pays (ISO 2 lettres)").toUpperCase()
  ),
  notes: z.string().trim().max(8000).optional(),
});

export type ClientFormInput = z.infer<typeof clientInputBaseSchema>;

const uuidSchema = z.string().uuid("Identifiant invalide");

export type ListClientsResult = {
  items: Client[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listClients(params: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<ListClientsResult> {
  const userId = await requireUserId();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(5, params.pageSize ?? 20));
  const q = params.q?.trim() ?? "";

  const { items, total } = await queryClientsForUser({
    userId,
    page,
    pageSize,
    q,
  });

  return { items, total, page, pageSize };
}

export async function getClientById(
  clientId: string
): Promise<{ client: Client } | { error: string }> {
  const userId = await requireUserId();
  const parsed = uuidSchema.safeParse(clientId);
  if (!parsed.success) {
    return { error: "Client introuvable." };
  }

  const [row] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, parsed.data), eq(clients.userId, userId)))
    .limit(1);

  if (!row) {
    return { error: "Client introuvable." };
  }

  return { client: row };
}

export async function createClient(
  input: unknown
): Promise<{ success: true; id: string } | { error: string }> {
  const userId = await requireUserId();
  const parsed = clientInputBaseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(" ") || "Données invalides.",
    };
  }

  const data = parsed.data;
  const [row] = await db
    .insert(clients)
    .values({
      userId,
      name: data.name,
      companyName: data.companyName ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      addressLine1: data.addressLine1 ?? null,
      city: data.city ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country,
      notes: data.notes ?? null,
    })
    .returning({ id: clients.id });

  if (!row) {
    return { error: "Impossible de créer le client." };
  }

  revalidatePath("/clients");
  return { success: true, id: row.id };
}

export async function updateClient(
  clientId: string,
  input: unknown
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(clientId);
  if (!idParsed.success) {
    return { error: "Client introuvable." };
  }

  const parsed = clientInputBaseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues.map((i) => i.message).join(" ") || "Données invalides.",
    };
  }

  const data = parsed.data;
  const result = await db
    .update(clients)
    .set({
      name: data.name,
      companyName: data.companyName ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      addressLine1: data.addressLine1 ?? null,
      city: data.city ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country,
      notes: data.notes ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(clients.id, idParsed.data), eq(clients.userId, userId)))
    .returning({ id: clients.id });

  if (result.length === 0) {
    return { error: "Client introuvable." };
  }

  revalidatePath("/clients");
  revalidatePath(`/clients/${idParsed.data}`);
  return { success: true };
}

export async function deleteClient(
  clientId: string
): Promise<{ success: true } | { error: string }> {
  const userId = await requireUserId();
  const idParsed = uuidSchema.safeParse(clientId);
  if (!idParsed.success) {
    return { error: "Client introuvable." };
  }

  const result = await db
    .delete(clients)
    .where(and(eq(clients.id, idParsed.data), eq(clients.userId, userId)))
    .returning({ id: clients.id });

  if (result.length === 0) {
    return { error: "Client introuvable." };
  }

  revalidatePath("/clients");
  return { success: true };
}
