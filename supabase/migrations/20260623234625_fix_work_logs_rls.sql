ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anon" ON public.work_logs;
DROP POLICY IF EXISTS "Enable ALL for authenticated" ON public.work_logs;
CREATE POLICY "Enable ALL for anon" ON public.work_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated" ON public.work_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
