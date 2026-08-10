-- Migration: Fix RLS policies for machines and processing_statuses
-- These tables have RLS enabled (by Supabase default) but no policy → anon gets 0 rows

-- 1. machines
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for machines" ON public.machines;
CREATE POLICY "Allow all for machines" ON public.machines FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.machines TO authenticated, anon;

-- 2. processing_statuses
ALTER TABLE public.processing_statuses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for processing_statuses" ON public.processing_statuses;
CREATE POLICY "Allow all for processing_statuses" ON public.processing_statuses FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.processing_statuses TO authenticated, anon;

-- 3. Also fix employees, standard_process_times, processing_codes if they have the same problem
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for employees" ON public.employees;
CREATE POLICY "Allow all for employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.employees TO authenticated, anon;

ALTER TABLE public.standard_process_times ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for standard_process_times" ON public.standard_process_times;
CREATE POLICY "Allow all for standard_process_times" ON public.standard_process_times FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.standard_process_times TO authenticated, anon;

-- 4. processing_codes (already has RLS from migration 20260620000001)
DROP POLICY IF EXISTS "Allow all for processing_codes" ON public.processing_codes;
CREATE POLICY "Allow all for processing_codes" ON public.processing_codes FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.processing_codes TO authenticated, anon;

-- 5. jobs and job_steps and work_logs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for jobs" ON public.jobs;
CREATE POLICY "Allow all for jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.jobs TO authenticated, anon;

ALTER TABLE public.job_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for job_steps" ON public.job_steps;
CREATE POLICY "Allow all for job_steps" ON public.job_steps FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.job_steps TO authenticated, anon;

-- work_logs already has RLS + policy from 20260623234625_fix_work_logs_rls.sql
-- but let's make sure
DROP POLICY IF EXISTS "Allow all for work_logs" ON public.work_logs;
CREATE POLICY "Allow all for work_logs" ON public.work_logs FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.work_logs TO authenticated, anon;
