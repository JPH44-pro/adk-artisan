import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/drizzle/db";
import {
  clients,
  invoiceLines,
  invoices,
  type Invoice,
  type InvoiceLine,
  type InvoiceStatus,
} from "@/lib/drizzle/schema";

const uuidSchema = z.string().uuid();

export type InvoiceListRow = Invoice & { clientName: string | null };

export async function queryInvoicesForUser(params: {
  userId: string;
  page: number;
  pageSize: number;
  status: InvoiceStatus | "all";
}): Promise<{ items: InvoiceListRow[]; total: number }> {
  const { userId, page, pageSize, status } = params;

  const base = eq(invoices.userId, userId);
  const whereClause =
    status === "all" ? base : and(base, eq(invoices.status, status));

  const [totalRow] = await db
    .select({ c: count() })
    .from(invoices)
    .where(whereClause);

  const total = Number(totalRow?.c ?? 0);

  const rows = await db
    .select({
      invoice: invoices,
      clientName: clients.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .where(whereClause)
    .orderBy(desc(invoices.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const items: InvoiceListRow[] = rows.map((r) => ({
    ...r.invoice,
    clientName: r.clientName,
  }));

  return { items, total };
}

export async function queryInvoiceWithLinesForUser(
  userId: string,
  invoiceId: string
): Promise<{ invoice: Invoice; lines: InvoiceLine[] } | null> {
  if (!uuidSchema.safeParse(invoiceId).success) {
    return null;
  }

  const [inv] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)))
    .limit(1);

  if (!inv) {
    return null;
  }

  const lines = await db
    .select()
    .from(invoiceLines)
    .where(eq(invoiceLines.invoiceId, invoiceId))
    .orderBy(asc(invoiceLines.sortOrder), asc(invoiceLines.createdAt));

  return { invoice: inv, lines };
}
