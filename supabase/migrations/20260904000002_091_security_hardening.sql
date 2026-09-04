-- ====================================================================
-- Migration 091: Security Hardening (Post-M13 Audit Remediation)
-- Target: Fix Security Advisor findings (SECURITY DEFINER, Public Exec, RLS, Search Path)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. [URGENT] FIX 0010: SECURITY DEFINER Views -> Set SECURITY INVOKER
-- Enforce permissions & RLS of the querying user instead of the view owner
-- --------------------------------------------------------------------
ALTER VIEW public.v_tray_schedule_gantt SET (security_invoker = true);
ALTER VIEW public.v_dashboard_executive_kpis SET (security_invoker = true);

-- --------------------------------------------------------------------
-- 2. [HIGH] FIX 0001: Revoke EXECUTE from anon role on sensitive RPCs
-- Prevent unauthenticated public execution via REST API
-- --------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.fn_sync_invoice_payment() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.fn_transition_product_lifecycle(uuid, text, text, text, uuid, text, uuid, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.hide_company(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.promote_company_to_ssot(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.remap_company_fks(uuid, uuid, uuid) FROM anon, public;

-- Grant EXECUTE to authenticated users and service_role only
GRANT EXECUTE ON FUNCTION public.fn_transition_product_lifecycle(uuid, text, text, text, uuid, text, uuid, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.hide_company(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.promote_company_to_ssot(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.remap_company_fks(uuid, uuid, uuid) TO authenticated, service_role;

-- --------------------------------------------------------------------
-- 3. [MEDIUM] FIX 0008: Enable RLS with Policies on 11 orphaned tables
-- Allow authenticated staff full operational access while blocking anon
-- --------------------------------------------------------------------
-- Table 1: design_task_logs
DROP POLICY IF EXISTS "Allow authenticated full access on design_task_logs" ON public.design_task_logs;
CREATE POLICY "Allow authenticated full access on design_task_logs" ON public.design_task_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 2: employee_skills
DROP POLICY IF EXISTS "Allow authenticated full access on employee_skills" ON public.employee_skills;
CREATE POLICY "Allow authenticated full access on employee_skills" ON public.employee_skills
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 3: forming_daily_logs
DROP POLICY IF EXISTS "Allow authenticated full access on forming_daily_logs" ON public.forming_daily_logs;
CREATE POLICY "Allow authenticated full access on forming_daily_logs" ON public.forming_daily_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 4: grinding_daily_logs
DROP POLICY IF EXISTS "Allow authenticated full access on grinding_daily_logs" ON public.grinding_daily_logs;
CREATE POLICY "Allow authenticated full access on grinding_daily_logs" ON public.grinding_daily_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 5: inspection_daily_logs
DROP POLICY IF EXISTS "Allow authenticated full access on inspection_daily_logs" ON public.inspection_daily_logs;
CREATE POLICY "Allow authenticated full access on inspection_daily_logs" ON public.inspection_daily_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 6: payroll_records
DROP POLICY IF EXISTS "Allow authenticated full access on payroll_records" ON public.payroll_records;
CREATE POLICY "Allow authenticated full access on payroll_records" ON public.payroll_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 7: press_daily_logs
DROP POLICY IF EXISTS "Allow authenticated full access on press_daily_logs" ON public.press_daily_logs;
CREATE POLICY "Allow authenticated full access on press_daily_logs" ON public.press_daily_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 8: shipment_lots
DROP POLICY IF EXISTS "Allow authenticated full access on shipment_lots" ON public.shipment_lots;
CREATE POLICY "Allow authenticated full access on shipment_lots" ON public.shipment_lots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 9: sm_captures
DROP POLICY IF EXISTS "Allow authenticated full access on sm_captures" ON public.sm_captures;
CREATE POLICY "Allow authenticated full access on sm_captures" ON public.sm_captures
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 10: sm_devices
DROP POLICY IF EXISTS "Allow authenticated full access on sm_devices" ON public.sm_devices;
CREATE POLICY "Allow authenticated full access on sm_devices" ON public.sm_devices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 11: transport_daily_logs
DROP POLICY IF EXISTS "Allow authenticated full access on transport_daily_logs" ON public.transport_daily_logs;
CREATE POLICY "Allow authenticated full access on transport_daily_logs" ON public.transport_daily_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 4. [LOW] FIX 0011: Secure search_path on functions against schema injection
-- --------------------------------------------------------------------
ALTER FUNCTION public.fn_sync_invoice_payment() SET search_path = public;
ALTER FUNCTION public.fn_transition_product_lifecycle(uuid, text, text, text, uuid, text, uuid, jsonb) SET search_path = public;
ALTER FUNCTION public.hide_company(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.promote_company_to_ssot(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.remap_company_fks(uuid, uuid, uuid) SET search_path = public;
ALTER FUNCTION public.generate_case_code() SET search_path = public;
ALTER FUNCTION public.generate_wo_code() SET search_path = public;
ALTER FUNCTION public.rpc_adjust_roll(numeric, text, text, uuid, text) SET search_path = public;
