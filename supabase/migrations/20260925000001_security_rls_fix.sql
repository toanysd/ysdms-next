-- ============================================================================
-- Migration: Security Hardening — RLS Policy Fix & RPC Permission Revocation
-- Date: 2026-09-25
-- Author: AN (Antigravity Agent)
-- Context: System Audit Phase 0 — Critical security fixes
--
-- Fixes:
-- 1. equipment_loans RLS policies were open to PUBLIC (including anon role)
--    → Restrict to authenticated users only
-- 2. fn_get_wo_equipment_set() was callable by anon
--    → Revoke from anon and public
-- ============================================================================

BEGIN;

-- ─── 1. Fix equipment_loans RLS: Restrict to authenticated only ─────────

-- Drop overly permissive policies (these applied to PUBLIC including anon)
DROP POLICY IF EXISTS "Allow public read equipment_loans" ON public.equipment_loans;
DROP POLICY IF EXISTS "Allow all insert equipment_loans" ON public.equipment_loans;
DROP POLICY IF EXISTS "Allow all update equipment_loans" ON public.equipment_loans;

-- Recreate with proper role restriction
CREATE POLICY "Allow authenticated read equipment_loans"
  ON public.equipment_loans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert equipment_loans"
  ON public.equipment_loans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update equipment_loans"
  ON public.equipment_loans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── 2. Fix loan_photos RLS if similar issue exists ─────────────────────

-- Drop overly permissive policies on loan_photos (if they exist)
DROP POLICY IF EXISTS "Allow public read loan_photos" ON public.loan_photos;
DROP POLICY IF EXISTS "Allow all insert loan_photos" ON public.loan_photos;

-- Recreate with proper role restriction
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'loan_photos') THEN
    EXECUTE 'CREATE POLICY "Allow authenticated read loan_photos" ON public.loan_photos FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "Allow authenticated insert loan_photos" ON public.loan_photos FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;
END $$;

-- ─── 3. Revoke anon access from sensitive RPCs ─────────────────────────

REVOKE EXECUTE ON FUNCTION public.fn_get_wo_equipment_set(UUID) FROM anon, public;

-- Verify only authenticated can call it
GRANT EXECUTE ON FUNCTION public.fn_get_wo_equipment_set(UUID) TO authenticated;

COMMIT;
