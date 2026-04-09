import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/drizzle/db";
import { clients, type Client } from "@/lib/drizzle/schema";

const uuidSchema = z.string().uuid();

export async function queryClientsForUser(params: {
  userId: string;
  page: number;
  pageSize: number;
  q: string;
}): Promise<{ items: Client[]; total: number }> {
  const { userId, page, pageSize, q } = params;
  const base = eq(clients.userId, userId);

  const whereClause =
    q.length > 0
      ? and(
          base,
          or(
            ilike(clients.name, `%${q}%`),
            ilike(clients.companyName, `%${q}%`),
            ilike(clients.email, `%${q}%`),
            ilike(clients.city, `%${q}%`),
            ilike(clients.phone, `%${q}%`)
          )
        )
      : base;

  const [totalRow] = await db
    .select({ c: count() })
    .from(clients)
    .where(whereClause);

  const total = Number(totalRow?.c ?? 0);

  const items = await db
    .select()
    .from(clients)
    .where(whereClause)
    .orderBy(desc(clients.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { items, total };
}

export async function queryClientByIdForUser(
  userId: string,
  clientId: string
): Promise<Client | null> {
  if (!uuidSchema.safeParse(clientId).success) {
    return null;
  }

  const [row] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .limit(1);

  return row ?? null;
}

export async function queryClientOptionsForUser(
  userId: string
): Promise<{ id: string; name: string }[]> {
  return db
    .select({ id: clients.id, name: clients.name })
    .from(clients)
    .where(eq(clients.userId, userId))
    .orderBy(asc(clients.name));
}
