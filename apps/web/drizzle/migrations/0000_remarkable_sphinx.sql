CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stripe_customer_id" text,
	"role" text DEFAULT 'member' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session_names" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_names_unique_session_user" UNIQUE("session_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_names" ADD CONSTRAINT "session_names_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_usage_events" ADD CONSTRAINT "user_usage_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "session_names_user_id_idx" ON "session_names" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_names_session_user_idx" ON "session_names" USING btree ("session_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_user_usage_events_user_id_type_time" ON "user_usage_events" USING btree ("user_id","event_type","created_at");--> statement-breakpoint
CREATE INDEX "idx_user_usage_events_created_at" ON "user_usage_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_user_usage_events_user_id" ON "user_usage_events" USING btree ("user_id");