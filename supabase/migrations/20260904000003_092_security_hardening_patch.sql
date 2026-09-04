-- ====================================================================
-- Migration 092: Security Hardening Patch (Post-091 Residuals)
-- Target: Revoke anon on 2 trigger functions + Lock search_path on 10 functions
-- Verified against pg_proc signatures & schema reference
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. [HIGH] FIX 0001: Revoke anon EXECUTE on 2 trigger functions
-- Prevent unauthenticated public execution via PostgREST
-- --------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.fn_trg_product_lifecycle_audit() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.trg_product_lifecycle_audit() FROM anon, public;

-- --------------------------------------------------------------------
-- 2. [LOW] FIX 0011: Lock search_path = public on 10 functions
-- Prevents schema hijacking / search_path mutable attack vector
--
-- Signature Verification:
-- - rpc_confirm_work_order: (uuid, uuid)  -> (p_wo_id UUID, p_confirmed_by UUID) [Migration 076/076b]
-- - rpc_start_job:          (uuid)        -> (p_job_id UUID) [Migration 077]
-- - All trigger functions:  ()            -> RETURNS trigger (zero parameters)
-- --------------------------------------------------------------------
ALTER FUNCTION public.update_quotation_lines_updated_at() SET search_path = public;
ALTER FUNCTION public.update_material_stock_modtime() SET search_path = public;
ALTER FUNCTION public.update_work_orders_updated_at() SET search_path = public;
ALTER FUNCTION public.fn_trg_product_lifecycle_audit() SET search_path = public;
ALTER FUNCTION public.trg_product_lifecycle_audit() SET search_path = public;
ALTER FUNCTION public.sync_job_overall_progress() SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;
ALTER FUNCTION public.rpc_confirm_work_order(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.rpc_start_job(uuid) SET search_path = public;
ALTER FUNCTION public.sync_work_order_status() SET search_path = public;
