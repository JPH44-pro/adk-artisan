import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";
import { clients } from "./clients";

/** Rendez-vous classique ou rappel (affichage et icône distincts). */
export const AGENDA_EVENT_KINDS = ["appointment", "reminder"] as const;
export type AgendaEventKind = (typeof AGENDA_EVENT_KINDS)[number];

/** Typologie métier pour la couleur des rendez-vous. */
export const AGENDA_TYPOLOGIES = [
  "site_visit",
  "quote",
  "work",
  "admin",
  "other",
] as const;
export type AgendaTypology = (typeof AGENDA_TYPOLOGIES)[number];

export const agendaEvents = pgTable(
  "agenda_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    /** `reminder` = rappel (icône cloche, style dédié). */
    eventKind: text("event_kind", { enum: AGENDA_EVENT_KINDS })
      .notNull()
      .default("appointment"),
    /** Sous-type pour la couleur (rappels : souvent `other`). */
    typology: text("typology", { enum: AGENDA_TYPOLOGIES })
      .notNull()
      .default("other"),
    title: text("title").notNull(),
    notes: text("notes"),
    /** Chantier / lieu (optionnel). */
    location: text("location"),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_agenda_events_user_id").on(t.userId),
    index("idx_agenda_events_user_start").on(t.userId, t.startAt),
  ]
);

export const insertAgendaEventSchema = createInsertSchema(agendaEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectAgendaEventSchema = createSelectSchema(agendaEvents);

export type AgendaEvent = InferSelectModel<typeof agendaEvents>;
