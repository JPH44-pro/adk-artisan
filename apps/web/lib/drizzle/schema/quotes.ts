import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";
import { clients } from "./clients";

/** Statuts métier (valeurs stockées en anglais pour le code). */
export const QUOTE_STATUSES = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    status: text("status", {
      enum: QUOTE_STATUSES,
    })
      .notNull()
      .default("draft"),
    title: text("title"),
    /** Référence affichable (ex. prochaine numérotation métier). */
    reference: text("reference"),
    /** TVA en basis points (2000 = 20,00 %). */
    vatRateBps: integer("vat_rate_bps").notNull().default(2000),
    subtotalHtCents: integer("subtotal_ht_cents").notNull().default(0),
    vatCents: integer("vat_cents").notNull().default(0),
    totalTtcCents: integer("total_ttc_cents").notNull().default(0),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_quotes_user_id").on(t.userId),
    index("idx_quotes_user_status_updated").on(
      t.userId,
      t.status,
      t.updatedAt
    ),
  ]
);

export const quoteLines = pgTable(
  "quote_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteId: uuid("quote_id")
      .references(() => quotes.id, { onDelete: "cascade" })
      .notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    label: text("label").notNull(),
    /** Quantité (décimal exact côté PG). */
    quantity: numeric("quantity", { precision: 14, scale: 4 })
      .notNull()
      .default("1"),
    /** Prix unitaire HT en centimes. */
    unitPriceHtCents: integer("unit_price_ht_cents").notNull().default(0),
    /** Total ligne HT en centimes (aligné sur qty × PU, arrondi). */
    lineTotalHtCents: integer("line_total_ht_cents").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_quote_lines_quote_id").on(t.quoteId),
    index("idx_quote_lines_quote_sort").on(t.quoteId, t.sortOrder),
  ]
);

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectQuoteSchema = createSelectSchema(quotes);
export const insertQuoteLineSchema = createInsertSchema(quoteLines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectQuoteLineSchema = createSelectSchema(quoteLines);

export type Quote = InferSelectModel<typeof quotes>;
export type QuoteLine = InferSelectModel<typeof quoteLines>;
