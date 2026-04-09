-- Down migration for: 0000_remarkable_sphinx
--
-- Reverses initial schema: users, session_names, user_usage_events.
--
-- WARNINGS:
-- - Dropping these tables permanently deletes all application user profiles,
--   session titles, and usage event data.

-- ==========================================
-- REVERSE INDEX OPERATIONS (last created first)
-- ==========================================

DROP INDEX IF EXISTS "idx_user_usage_events_user_id";
DROP INDEX IF EXISTS "idx_user_usage_events_created_at";
DROP INDEX IF EXISTS "idx_user_usage_events_user_id_type_time";
DROP INDEX IF EXISTS "session_names_session_user_idx";
DROP INDEX IF EXISTS "session_names_user_id_idx";
DROP INDEX IF EXISTS "role_idx";

-- ==========================================
-- REVERSE FOREIGN KEYS
-- ==========================================

ALTER TABLE "user_usage_events" DROP CONSTRAINT IF EXISTS "user_usage_events_user_id_users_id_fk";
ALTER TABLE "session_names" DROP CONSTRAINT IF EXISTS "session_names_user_id_users_id_fk";

-- ==========================================
-- REVERSE TABLE OPERATIONS
-- ==========================================

DROP TABLE IF EXISTS "user_usage_events";
DROP TABLE IF EXISTS "session_names";
DROP TABLE IF EXISTS "users";
