import type { AgendaEventKind, AgendaTypology } from "@/lib/drizzle/schema";

export const TYPOLOGY_LABELS: Record<AgendaTypology, string> = {
  site_visit: "Visite chantier",
  quote: "Devis / commercial",
  work: "Intervention",
  admin: "Administratif",
  other: "Autre",
};

export const EVENT_KIND_LABELS: Record<AgendaEventKind, string> = {
  appointment: "Rendez-vous",
  reminder: "Rappel",
};

/** Classes pour les pastilles rendez-vous (bordure gauche + fond léger). */
export const TYPOLOGY_STYLES: Record<AgendaTypology, string> = {
  site_visit:
    "border-l-4 border-l-amber-500 bg-amber-500/15 hover:bg-amber-500/25",
  quote: "border-l-4 border-l-sky-500 bg-sky-500/15 hover:bg-sky-500/25",
  work: "border-l-4 border-l-emerald-500 bg-emerald-500/15 hover:bg-emerald-500/25",
  admin: "border-l-4 border-l-slate-500 bg-slate-500/15 hover:bg-slate-500/25",
  other: "border-l-4 border-l-violet-500 bg-violet-500/15 hover:bg-violet-500/25",
};

/** Style distinct pour les rappels (prioritaire sur la typologie). */
export const REMINDER_STYLE =
  "border-l-4 border-l-rose-500 bg-rose-500/15 hover:bg-rose-500/25";

export function chipStyleForEvent(
  kind: AgendaEventKind,
  typology: AgendaTypology
): string {
  if (kind === "reminder") {
    return REMINDER_STYLE;
  }
  return TYPOLOGY_STYLES[typology];
}
