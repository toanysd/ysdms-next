-- ============================================================================
-- Migration: 20260911000003_m28b_fix_view_security_invoker.sql
-- Tên định danh: m28b_fix_view_security_invoker.sql
-- Mục đích: Thiết lập security_invoker = true và thu hồi quyền anon cho View v_work_order_progress
-- Ngăn ngừa lỗ hổng Security Definer View (Advisor security_definer_view)
-- Milestone: M28 - Giai đoạn B (Chỉ thị Step 1)
-- ============================================================================

ALTER VIEW public.v_work_order_progress SET (security_invoker = true);
REVOKE ALL ON public.v_work_order_progress FROM anon;
GRANT SELECT ON public.v_work_order_progress TO authenticated;
GRANT SELECT ON public.v_work_order_progress TO service_role;
