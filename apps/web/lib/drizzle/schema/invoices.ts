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
import { quotes } from "./quotes";

/** Statuts de paiement / cycle de vie facture. */
export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    /** Devis source (optionnel). */
    quoteId: uuid("quote_id").references(() => quotes.id, {
      onDelete: "set null",
    }),
    status: text("status", {
      enum: INVOICE_STATUSES,
    })
      .notNull()
      .default("draft"),
    title: text("title"),
    reference: text("reference"),
    /** TVA en basis points (2000 = 20,00 %). */
    vatRateBps: integer("vat_rate_bps").notNull().default(2000),
    subtotalHtCents: integer("subtotal_ht_cents").notNull().default(0),
    vatCents: integer("vat_cents").notNull().default(0),
    totalTtcCents: integer("total_ttc_cents").notNull().default(0),
    issueDate: timestamp("issue_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }),
    notes: text("notes"),
    /** Emplacement futur PDF (ex. clé bucket Supabase) — ne bloque pas la sauvegarde. */
    pdfStorageKey: text("pdf_storage_key"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_invoices_user_id").on(t.userId),
    index("idx_invoices_user_status_updated").on(
      t.userId,
      t.status,
      t.updatedAt
    ),
    index("idx_invoices_quote_id").on(t.quoteId),
  ]
);

export const invoiceLines = pgTable(
  "invoice_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id")
      .references(() => invoices.id, { onDelete: "cascade" })
      .notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    label: text("label").notNull(),
    quantity: numeric("quantity", { precision: 14, scale: 4 })
      .notNull()
      .default("1"),
    unitPriceHtCents: integer("unit_price_ht_cents").notNull().default(0),
    lineTotalHtCents: integer("line_total_ht_cents").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_invoice_lines_invoice_id").on(t.invoiceId),
    index("idx_invoice_lines_invoice_sort").on(t.invoiceId, t.sortOrder),
  ]
);

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectInvoiceSchema = createSelectSchema(invoices);
export const insertInvoiceLineSchema = createInsertSchema(invoiceLines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectInvoiceLineSchema = createSelectSchema(invoiceLines);

export type Invoice = InferSelectModel<typeof invoices>;
export type InvoiceLine = InferSelectModel<typeof invoiceLines>;
