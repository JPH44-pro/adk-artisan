-- ReglePro — RLS for invoices and invoice_lines (apply in Supabase SQL Editor after migration 0004).

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_own"
  ON public.invoices FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "invoices_insert_own"
  ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_update_own"
  ON public.invoices FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_delete_own"
  ON public.invoices FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_lines_select_own"
  ON public.invoice_lines FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_lines.invoice_id AND inv.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_lines_insert_own"
  ON public.invoice_lines FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_lines.invoice_id AND inv.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_lines_update_own"
  ON public.invoice_lines FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_lines.invoice_id AND inv.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_lines.invoice_id AND inv.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_lines_delete_own"
  ON public.invoice_lines FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_lines.invoice_id AND inv.user_id = auth.uid()
    )
  );
