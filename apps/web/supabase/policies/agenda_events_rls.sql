-- ReglePro — Row Level Security for public.agenda_events
-- Apply in Supabase SQL Editor after Drizzle migration 0005.

ALTER TABLE public.agenda_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agenda_events_select_own"
  ON public.agenda_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "agenda_events_insert_own"
  ON public.agenda_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agenda_events_update_own"
  ON public.agenda_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agenda_events_delete_own"
  ON public.agenda_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
