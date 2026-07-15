-- ============================================================
-- YSDMS Security Batch Fix — Applied by PE 2026-07-14
-- Resolves all Supabase Security Advisor ERRORs + WARNs
-- ============================================================

-- 1. Batch enable RLS + add temporary authenticated-allow policy
--    on all tables that had no RLS at all
DO $$
DECLARE
  r RECORD;
  pol_name TEXT;
BEGIN
  FOR r IN
    SELECT t.tablename
    FROM pg_tables t
    LEFT JOIN pg_class c ON c.relname = t.tablename
    LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
    WHERE t.schemaname = 'public'
      AND c.relrowsecurity = false
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    pol_name := 'tmp_authenticated_all_' || r.tablename;
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      pol_name, r.tablename
    );
  END LOOP;
END;
$$;

-- 2. Fix tables with RLS on but zero policies (INFO warnings)
--    material_consumption_logs, ng_detail_logs, shipment_required_docs
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['material_consumption_logs','ng_detail_logs','shipment_required_docs']
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY tmp_authenticated_all_%I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
        tbl, tbl
      );
    END IF;
  END LOOP;
END;
$$;

-- 3. Drop overly permissive anon policies on work_logs
--    (was granting unrestricted access to anonymous users)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'work_logs'
      AND (roles @> ARRAY['anon']::name[] OR roles = '{}'::name[])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.work_logs', pol.policyname);
  END LOOP;
END;
$$;

-- 4. Revoke anon EXECUTE on audit_trigger_func
--    Remediation: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func() FROM anon;

-- 5. Fix search_path on SECURITY DEFINER functions
--    Remediation: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
ALTER FUNCTION public.set_layer_code() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.audit_trigger_func() SET search_path = public;

-- ============================================================
-- NOTE: Policies above are TEMPORARY (tmp_authenticated_all_*)
-- They grant all authenticated users full read/write access.
-- Before go-live, replace each with role-based policies:
--   USING (auth.uid() = created_by)   -- user-scoped
--   USING (auth.jwt() ->> 'role' = 'manager')  -- role-scoped
-- ============================================================
