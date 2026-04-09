"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import { clients, type Client } from "@/lib/drizzle/schema";
import { parseClientImportMatrix } from "@/lib/clients/import-parse";
import { queryClientsForUser } from "@/lib/queries/clients";

const MAX_CLIENT_IMPORT_ROWS = 500;
const MAX_CLIENT_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

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

export type ImportClientsResult =
  | {
      success: true;
      created: number;
      failed: number;
      errors: { line: number; message: string }[];
      warnings: string[];
    }
  | { error: string };

/**
 * Importe des clients depuis un fichier CSV ou Excel (première feuille).
 * La première ligne non vide doit contenir des en-têtes reconnus (ex. nom, email).
 */
export async function importClientsFromFile(
  formData: FormData
): Promise<ImportClientsResult> {
  const userId = await requireUserId();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "Aucun fichier sélectionné." };
  }

  if (file.size > MAX_CLIENT_IMPORT_FILE_BYTES) {
    return { error: "Fichier trop volumineux (maximum 2 Mo)." };
  }

  const lower = file.name.toLowerCase();
  if (
    !lower.endsWith(".csv") &&
    !lower.endsWith(".xlsx") &&
    !lower.endsWith(".xls")
  ) {
    return {
      error: "Format non pris en charge. Utilisez un fichier .csv, .xlsx ou .xls.",
    };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return { error: "Impossible de lire le fichier." };
  }

  let matrix: unknown[][];
  try {
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      raw: false,
      codepage: 65001,
    });
    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) {
      return { error: "Le classeur ne contient aucune feuille." };
    }
    const sheet = workbook.Sheets[firstSheet];
    matrix = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      raw: false,
    }) as unknown[][];
  } catch {
    return {
      error:
        "Impossible d’analyser le fichier. Vérifiez qu’il s’ouvre correctement dans Excel ou LibreOffice.",
    };
  }

  const { rows: parsedRows, warnings } = parseClientImportMatrix(matrix);

  if (parsedRows.length === 0) {
    const extra =
      warnings.length > 0 ? ` ${warnings.slice(0, 5).join(" ")}` : "";
    return {
      error: `Aucune ligne importable : chaque client doit avoir un « nom » dans une colonne reconnue.${extra}`,
    };
  }

  if (parsedRows.length > MAX_CLIENT_IMPORT_ROWS) {
    return {
      error: `Trop de lignes : maximum ${MAX_CLIENT_IMPORT_ROWS} clients par import.`,
    };
  }

  const errors: { line: number; message: string }[] = [];
  const toInsert: z.infer<typeof clientInputBaseSchema>[] = [];

  for (const { lineNumber, data } of parsedRows) {
    const parsed = clientInputBaseSchema.safeParse(data);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(" ");
      errors.push({ line: lineNumber, message: msg || "Données invalides." });
      continue;
    }
    toInsert.push(parsed.data);
  }

  if (toInsert.length === 0) {
    return {
      success: true,
      created: 0,
      failed: errors.length,
      errors,
      warnings,
    };
  }

  const CHUNK = 80;
  let created = 0;
  try {
    for (let i = 0; i < toInsert.length; i += CHUNK) {
      const chunk = toInsert.slice(i, i + CHUNK);
      const values = chunk.map((data) => ({
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
      }));
      await db.insert(clients).values(values);
      created += values.length;
    }
  } catch (e) {
    console.error("importClientsFromFile insert error", e);
    return {
      error:
        "Erreur lors de l’enregistrement en base. Vérifiez les données et réessayez.",
    };
  }

  revalidatePath("/clients");

  return {
    success: true,
    created,
    failed: errors.length,
    errors,
    warnings,
  };
}
