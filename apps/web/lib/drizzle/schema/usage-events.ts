import {
  pgTable,
  timestamp,
  uuid,
  text,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// User usage events table - tracks individual user actions for time-window based limits
export const userUsageEvents = pgTable(
  "user_usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    eventType: text("event_type").notNull(), // 'message_sent', 'session_created'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Index for efficient time window queries
    index("idx_user_usage_events_user_id_type_time").on(
      table.userId,
      table.eventType,
      table.createdAt
    ),
    // Index for general time-based queries
    index("idx_user_usage_events_created_at").on(table.createdAt),
    // Index for user-specific queries
    index("idx_user_usage_events_user_id").on(table.userId),
  ]
);

// Zod validation schemas
export const insertUserUsageEventSchema = createInsertSchema(userUsageEvents);
export const selectUserUsageEventSchema = createSelectSchema(userUsageEvents);

// TypeScript types
export type UserUsageEvent = InferSelectModel<typeof userUsageEvents>;
export type InsertUserUsageEvent = typeof userUsageEvents.$inferInsert;

// Event type constants for adk-agent-saas (messages and sessions)
export const USAGE_EVENT_TYPES = {
  MESSAGE_SENT: "message_sent",
  SESSION_CREATED: "session_created",
} as const;

export type UsageEventType = typeof USAGE_EVENT_TYPES[keyof typeof USAGE_EVENT_TYPES];
