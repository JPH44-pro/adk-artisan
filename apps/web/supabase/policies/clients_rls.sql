-- ReglePro — Row Level Security for public.clients
-- Apply in Supabase SQL Editor or via `psql` after Drizzle migration 0002.
-- Ensures rows are visible only when auth.uid() matches user_id (defense in depth
-- alongside server-side Drizzle checks).

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select_own"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "clients_insert_own"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_update_own"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_delete_own"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
