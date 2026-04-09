import { and, asc, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/drizzle/db";
import {
  agendaEvents,
  clients,
  type AgendaEvent,
} from "@/lib/drizzle/schema";

const uuidSchema = z.string().uuid();

export type AgendaEventRow = AgendaEvent & { clientName: string | null };

/**
 * Événements dont le début tombe dans [rangeStart, rangeEnd) (demi-ouvert).
 */
export async function queryAgendaEventsInRange(params: {
  userId: string;
  rangeStart: Date;
  rangeEnd: Date;
}): Promise<AgendaEventRow[]> {
  const { userId, rangeStart, rangeEnd } = params;

  const rows = await db
    .select({
      event: agendaEvents,
      clientName: clients.name,
    })
    .from(agendaEvents)
    .leftJoin(clients, eq(agendaEvents.clientId, clients.id))
    .where(
      and(
        eq(agendaEvents.userId, userId),
        gte(agendaEvents.startAt, rangeStart),
        lt(agendaEvents.startAt, rangeEnd)
      )
    )
    .orderBy(asc(agendaEvents.startAt));

  return rows.map((r) => ({
    ...r.event,
    clientName: r.clientName,
  }));
}

export async function queryAgendaEventByIdForUser(
  userId: string,
  eventId: string
): Promise<AgendaEventRow | null> {
  if (!uuidSchema.safeParse(eventId).success) {
    return null;
  }

  const [row] = await db
    .select({
      event: agendaEvents,
      clientName: clients.name,
    })
    .from(agendaEvents)
    .leftJoin(clients, eq(agendaEvents.clientId, clients.id))
    .where(and(eq(agendaEvents.id, eventId), eq(agendaEvents.userId, userId)))
    .limit(1);

  if (!row) {
    return null;
  }

  return { ...row.event, clientName: row.clientName };
}
