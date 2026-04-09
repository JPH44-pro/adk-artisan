-- Down migration for: 0004_mysterious_rhino
DROP TABLE IF EXISTS "public"."invoice_lines";
DROP TABLE IF EXISTS "public"."invoices";
