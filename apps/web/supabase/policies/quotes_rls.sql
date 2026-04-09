-- ReglePro — RLS for quotes and quote_lines (apply in Supabase SQL Editor after migration 0003).

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes_select_own"
  ON public.quotes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "quotes_insert_own"
  ON public.quotes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quotes_update_own"
  ON public.quotes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quotes_delete_own"
  ON public.quotes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.quote_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_lines_select_own"
  ON public.quote_lines FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_lines.quote_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "quote_lines_insert_own"
  ON public.quote_lines FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_lines.quote_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "quote_lines_update_own"
  ON public.quote_lines FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_lines.quote_id AND q.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_lines.quote_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "quote_lines_delete_own"
  ON public.quote_lines FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_lines.quote_id AND q.user_id = auth.uid()
    )
  );
