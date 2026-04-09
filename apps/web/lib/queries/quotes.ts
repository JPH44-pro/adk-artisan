import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/drizzle/db";
import {
  clients,
  quoteLines,
  quotes,
  type Quote,
  type QuoteLine,
  type QuoteStatus,
} from "@/lib/drizzle/schema";

const uuidSchema = z.string().uuid();

export type QuoteListRow = Quote & { clientName: string | null };

export async function queryQuotesForUser(params: {
  userId: string;
  page: number;
  pageSize: number;
  status: QuoteStatus | "all";
}): Promise<{ items: QuoteListRow[]; total: number }> {
  const { userId, page, pageSize, status } = params;

  const base = eq(quotes.userId, userId);
  const whereClause =
    status === "all" ? base : and(base, eq(quotes.status, status));

  const [totalRow] = await db
    .select({ c: count() })
    .from(quotes)
    .where(whereClause);

  const total = Number(totalRow?.c ?? 0);

  const rows = await db
    .select({
      quote: quotes,
      clientName: clients.name,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .where(whereClause)
    .orderBy(desc(quotes.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const items: QuoteListRow[] = rows.map((r) => ({
    ...r.quote,
    clientName: r.clientName,
  }));

  return { items, total };
}

export async function queryQuoteWithLinesForUser(
  userId: string,
  quoteId: string
): Promise<{ quote: Quote; lines: QuoteLine[] } | null> {
  if (!uuidSchema.safeParse(quoteId).success) {
    return null;
  }

  const [q] = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)))
    .limit(1);

  if (!q) {
    return null;
  }

  const lines = await db
    .select()
    .from(quoteLines)
    .where(eq(quoteLines.quoteId, quoteId))
    .orderBy(asc(quoteLines.sortOrder), asc(quoteLines.createdAt));

  return { quote: q, lines };
}

export async function queryClientExistsForUser(
  userId: string,
  clientId: string
): Promise<boolean> {
  if (!uuidSchema.safeParse(clientId).success) {
    return false;
  }
  const [row] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .limit(1);

  return Boolean(row);
}
