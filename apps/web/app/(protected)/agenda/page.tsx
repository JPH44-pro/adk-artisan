import type { Metadata } from "next";
import type { ReactElement } from "react";
import { requireUserId } from "@/lib/auth";
import {
  addUtcDays,
  formatYmdUtc,
  resolveWeekRangeFromParam,
} from "@/lib/agenda/week";
import {
  queryAgendaEventsInRange,
  type AgendaEventRow,
} from "@/lib/queries/agenda";
import { queryClientOptionsForUser } from "@/lib/queries/clients";
import {
  AgendaPageClient,
  type AgendaEventSerializable,
} from "@/components/agenda/AgendaPageClient";

export const metadata: Metadata = {
  title: "Agenda",
};

interface AgendaPageProps {
  searchParams: Promise<{ week?: string }>;
}

function serializeEvent(row: AgendaEventRow): AgendaEventSerializable {
  return {
    ...row,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export default async function AgendaPage({
  searchParams,
}: AgendaPageProps): Promise<ReactElement> {
  const userId = await requireUserId();
  const sp = await searchParams;
  const weekParam = typeof sp.week === "string" ? sp.week : undefined;
  const { monday, rangeEnd } = resolveWeekRangeFromParam(weekParam);

  const [events, clientOptions] = await Promise.all([
    queryAgendaEventsInRange({
      userId,
      rangeStart: monday,
      rangeEnd,
    }),
    queryClientOptionsForUser(userId),
  ]);

  const weekMondayYmd = formatYmdUtc(monday);
  const prevWeekYmd = formatYmdUtc(addUtcDays(monday, -7));
  const nextWeekYmd = formatYmdUtc(addUtcDays(monday, 7));

  return (
    <AgendaPageClient
      weekMondayYmd={weekMondayYmd}
      prevWeekYmd={prevWeekYmd}
      nextWeekYmd={nextWeekYmd}
      events={events.map(serializeEvent)}
      clientOptions={clientOptions}
    />
  );
}
