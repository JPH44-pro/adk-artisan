ALTER TABLE "agenda_events" ADD COLUMN "event_kind" text DEFAULT 'appointment' NOT NULL;--> statement-breakpoint
ALTER TABLE "agenda_events" ADD COLUMN "typology" text DEFAULT 'other' NOT NULL;