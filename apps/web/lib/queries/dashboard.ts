import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lt,
  or,
} from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import {
  agendaEvents,
  clients,
  invoices,
  quotes,
  type InvoiceStatus,
  type QuoteStatus,
} from "@/lib/drizzle/schema";

const PENDING_QUOTE_STATUSES: QuoteStatus[] = ["draft", "sent"];

export type DashboardPendingQuote = {
  id: string;
  title: string | null;
  reference: string | null;
  status: QuoteStatus;
  updatedAt: Date;
  clientName: string | null;
  totalTtcCents: number;
};

export type DashboardOverdueInvoice = {
  id: string;
  title: string | null;
  reference: string | null;
  status: InvoiceStatus;
  dueDate: Date | null;
  clientName: string | null;
  totalTtcCents: number;
};

export type DashboardUpcomingEvent = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  location: string | null;
  clientName: string | null;
};

export type DashboardSnapshot = {
  kpi: {
    clientCount: number;
    pendingQuotesCount: number;
    overdueInvoicesCount: number;
    upcomingEventsNext30DaysCount: number;
  };
  pendingQuotes: DashboardPendingQuote[];
  overdueInvoices: DashboardOverdueInvoice[];
  upcomingEvents: DashboardUpcomingEvent[];
};

function overdueInvoiceCondition(now: Date) {
  return or(
    eq(invoices.status, "overdue"),
    and(
      inArray(invoices.status, ["sent", "draft"]),
      isNotNull(invoices.dueDate),
      lt(invoices.dueDate, now)
    )
  );
}

export async function queryDashboardForUser(
  userId: string
): Promise<DashboardSnapshot> {
  const now = new Date();
  const horizon30 = new Date(now);
  horizon30.setDate(horizon30.getDate() + 30);

  const pendingQuotesWhere = and(
    eq(quotes.userId, userId),
    inArray(quotes.status, PENDING_QUOTE_STATUSES)
  );

  const overdueWhere = and(eq(invoices.userId, userId), overdueInvoiceCondition(now));

  const upcomingRangeWhere = and(
    eq(agendaEvents.userId, userId),
    gte(agendaEvents.startAt, now),
    lt(agendaEvents.startAt, horizon30)
  );

  const [
    clientCountRow,
    pendingQuotesCountRow,
    overdueCountRow,
    upcoming30CountRow,
    pendingQuoteRows,
    overdueInvoiceRows,
    upcomingEventRows,
  ] = await Promise.all([
    db
      .select({ c: count() })
      .from(clients)
      .where(eq(clients.userId, userId)),
    db
      .select({ c: count() })
      .from(quotes)
      .where(pendingQuotesWhere),
    db
      .select({ c: count() })
      .from(invoices)
      .where(overdueWhere),
    db
      .select({ c: count() })
      .from(agendaEvents)
      .where(upcomingRangeWhere),
    db
      .select({
        quote: quotes,
        clientName: clients.name,
      })
      .from(quotes)
      .leftJoin(clients, eq(quotes.clientId, clients.id))
      .where(pendingQuotesWhere)
      .orderBy(desc(quotes.updatedAt))
      .limit(8),
    db
      .select({
        invoice: invoices,
        clientName: clients.name,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(overdueWhere)
      .orderBy(
        asc(invoices.dueDate),
        desc(invoices.updatedAt)
      )
      .limit(8),
    db
      .select({
        event: agendaEvents,
        clientName: clients.name,
      })
      .from(agendaEvents)
      .leftJoin(clients, eq(agendaEvents.clientId, clients.id))
      .where(and(eq(agendaEvents.userId, userId), gte(agendaEvents.startAt, now)))
      .orderBy(asc(agendaEvents.startAt))
      .limit(5),
  ]);

  const pendingQuotes: DashboardPendingQuote[] = pendingQuoteRows.map((r) => ({
    id: r.quote.id,
    title: r.quote.title,
    reference: r.quote.reference,
    status: r.quote.status,
    updatedAt: r.quote.updatedAt,
    clientName: r.clientName,
    totalTtcCents: r.quote.totalTtcCents,
  }));

  const overdueInvoices: DashboardOverdueInvoice[] = overdueInvoiceRows.map(
    (r) => ({
      id: r.invoice.id,
      title: r.invoice.title,
      reference: r.invoice.reference,
      status: r.invoice.status,
      dueDate: r.invoice.dueDate,
      clientName: r.clientName,
      totalTtcCents: r.invoice.totalTtcCents,
    })
  );

  const upcomingEvents: DashboardUpcomingEvent[] = upcomingEventRows.map(
    (r) => ({
      id: r.event.id,
      title: r.event.title,
      startAt: r.event.startAt,
      endAt: r.event.endAt,
      location: r.event.location,
      clientName: r.clientName,
    })
  );

  return {
    kpi: {
      clientCount: Number(clientCountRow[0]?.c ?? 0),
      pendingQuotesCount: Number(pendingQuotesCountRow[0]?.c ?? 0),
      overdueInvoicesCount: Number(overdueCountRow[0]?.c ?? 0),
      upcomingEventsNext30DaysCount: Number(upcoming30CountRow[0]?.c ?? 0),
    },
    pendingQuotes,
    overdueInvoices,
    upcomingEvents,
  };
}
