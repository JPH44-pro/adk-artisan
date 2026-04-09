/** Lundi 00:00 UTC de la semaine calendaire contenant `d`. */
export function getUtcMonday(d: Date): Date {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff)
  );
}

export function addUtcDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

export function formatYmdUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Nombre de semaines calendaires UTC affichées sur l’agenda (lundi → dimanche). */
export const AGENDA_VISIBLE_WEEK_COUNT = 5;

/**
 * `week` = n’importe quel jour (YYYY-MM-DD) ou absent : ancre sur aujourd’hui UTC.
 * Retourne le lundi UTC de la 1re semaine visible et la fin d’intervalle [start, end)
 * couvrant `AGENDA_VISIBLE_WEEK_COUNT` semaines complètes.
 */
export function resolveWeekRangeFromParam(weekParam: string | undefined): {
  monday: Date;
  rangeEnd: Date;
} {
  let anchor: Date;
  if (weekParam && /^\d{4}-\d{2}-\d{2}$/.test(weekParam)) {
    const [y, m, d] = weekParam.split("-").map(Number);
    anchor = new Date(Date.UTC(y, m - 1, d));
    if (Number.isNaN(anchor.getTime())) {
      anchor = new Date();
    }
  } else {
    anchor = new Date();
  }
  const monday = getUtcMonday(anchor);
  const rangeEnd = addUtcDays(monday, 7 * AGENDA_VISIBLE_WEEK_COUNT);
  return { monday, rangeEnd };
}
