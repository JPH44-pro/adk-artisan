-- ReglePro — RLS hardening for core tables.
-- Fixes Supabase security warnings:
-- - rls_disabled_in_public
-- - sensitive_columns_exposed
--
-- Apply in Supabase SQL Editor (project: adk-artisan).

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_delete_own" ON public.users;

CREATE POLICY "users_select_own"
  ON public.users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own"
  ON public.users FOR DELETE TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "session_names_select_own" ON public.session_names;
DROP POLICY IF EXISTS "session_names_insert_own" ON public.session_names;
DROP POLICY IF EXISTS "session_names_update_own" ON public.session_names;
DROP POLICY IF EXISTS "session_names_delete_own" ON public.session_names;

CREATE POLICY "session_names_select_own"
  ON public.session_names FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "session_names_insert_own"
  ON public.session_names FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_names_update_own"
  ON public.session_names FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_names_delete_own"
  ON public.session_names FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_usage_events_select_own" ON public.user_usage_events;
DROP POLICY IF EXISTS "user_usage_events_insert_own" ON public.user_usage_events;
DROP POLICY IF EXISTS "user_usage_events_update_own" ON public.user_usage_events;
DROP POLICY IF EXISTS "user_usage_events_delete_own" ON public.user_usage_events;

CREATE POLICY "user_usage_events_select_own"
  ON public.user_usage_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_usage_events_insert_own"
  ON public.user_usage_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_usage_events_update_own"
  ON public.user_usage_events FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_usage_events_delete_own"
  ON public.user_usage_events FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Explicit table privileges hardening
-- -----------------------------------------------------------------------------
-- Keep RLS as the row filter, but remove broad grants that trigger
-- "sensitive_columns_exposed" and reduce blast radius.

REVOKE ALL PRIVILEGES ON TABLE public.users FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.users FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.session_names FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.session_names FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.session_names TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.user_usage_events FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.user_usage_events FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_usage_events TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.clients FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.clients FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.clients TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.quotes FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.quotes FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quotes TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.quote_lines FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.quote_lines FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quote_lines TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.invoices FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.invoices FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.invoices TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.invoice_lines FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.invoice_lines FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.invoice_lines TO authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.agenda_events FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.agenda_events FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.agenda_events TO authenticated;
