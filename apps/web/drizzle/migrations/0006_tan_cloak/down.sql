-- Down migration for: 0006_tan_cloak
ALTER TABLE "public"."agenda_events" DROP COLUMN IF EXISTS "typology";
ALTER TABLE "public"."agenda_events" DROP COLUMN IF EXISTS "event_kind";
