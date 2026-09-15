-- ============================================================================
-- Migration: 20260915000001_support_shared_equipment_in_work_orders.sql
-- Description: Ưu tiên 4 - Mở rộng View v_work_order_equipment_set hỗ trợ quan hệ 'SHARED'
-- Context: Hỗ trợ dao cắt dùng chung (SHARED) tự động xuất hiện trong SET thiết bị của Work Order
-- Reference: ADR-010, Ưu tiên 4 (Pha 2 Tiền đề)
-- ============================================================================

CREATE OR REPLACE VIEW public.v_work_order_equipment_set 
WITH (security_invoker = true) AS
WITH wo_primary_mold AS (
  SELECT 
    wo.wo_id,
    wo.wo_code,
    wo.wo_name,
    wo.wo_status,
    wo.product_id,
    wo.design_revision_id,
    m.equipment_id AS mold_equipment_id
  FROM public.work_orders wo
  LEFT JOIN public.equipment m 
    ON m.design_revision_id = wo.design_revision_id 
    AND m.equipment_type = 'MOLD'
),
resolved_equipment AS (
  -- 1. Khuôn chính (MOLD)
  SELECT 
    w.wo_id,
    w.mold_equipment_id AS equipment_id,
    'PRIMARY_MOLD'::text AS assignment_type
  FROM wo_primary_mold w
  WHERE w.mold_equipment_id IS NOT NULL

  UNION ALL

  -- 2. Tầng 1: Các thiết bị liên kết cố định trong equipment_assignments (SET_MEMBER hoặc SHARED)
  SELECT 
    w.wo_id,
    ea.related_equipment_id AS equipment_id,
    COALESCE(ea.relationship_type, 'SET_MEMBER')::text AS assignment_type
  FROM wo_primary_mold w
  JOIN public.equipment_assignments ea 
    ON ea.primary_equipment_id = w.mold_equipment_id 
    AND ea.relationship_type IN ('SET_MEMBER', 'SHARED')

  UNION ALL

  -- 3. Tầng 2: Fallback CUTTER cùng design_revision_id khi Tầng 1 chưa có bản ghi assignment
  SELECT 
    w.wo_id,
    c.equipment_id,
    'CAD_REVISION_MATCH'::text AS assignment_type
  FROM wo_primary_mold w
  JOIN public.equipment c 
    ON c.design_revision_id = w.design_revision_id 
    AND c.equipment_type IN ('CUTTER_INLINE', 'CUTTER_SEPARATE')
  WHERE NOT EXISTS (
    SELECT 1 
    FROM public.equipment_assignments ea2
    JOIN public.equipment eq2 ON eq2.equipment_id = ea2.related_equipment_id
    WHERE ea2.primary_equipment_id = w.mold_equipment_id 
      AND ea2.relationship_type IN ('SET_MEMBER', 'SHARED')
      AND eq2.equipment_type IN ('CUTTER_INLINE', 'CUTTER_SEPARATE')
  )
)
SELECT
  wo.wo_id,
  wo.wo_code,
  wo.wo_name,
  wo.wo_status,
  wo.product_id,
  wo.design_revision_id,
  -- Thông tin thiết bị
  eq.equipment_id,
  eq.equipment_code,
  eq.display_name AS equipment_name,
  eq.equipment_type,
  eq.device_status,
  eq.usage_status,
  eq.company_id AS owner_company_id,
  owner_comp.company_name AS owner_company_name,
  eq.keeper_company_id,
  keeper_comp.company_name AS keeper_company_name,
  eq.current_rack_layer_id,
  -- Vị trí kệ kho
  rl.layer_code,
  r.rack_code_new AS rack_code,
  r.zone_code,
  re.assignment_type,
  -- Đánh giá trạng thái sẵn sàng (Readiness)
  CASE
    WHEN loan.loan_id IS NOT NULL OR (eq.keeper_company_id IS NOT NULL AND eq.keeper_company_id <> ysd.company_id) THEN 'LOANED_OUT'
    WHEN eq.device_status IN ('MAINTENANCE', 'REPAIRING', 'DAMAGED') THEN 'MAINTENANCE'
    WHEN eq.usage_status = 'IN_USE' THEN 'IN_USE'
    WHEN (eq.device_status = 'NORMAL' OR eq.device_status IS NULL) 
         AND (eq.usage_status IS NULL OR eq.usage_status IN ('STORAGE', 'IN_STOCK', 'ACTIVE')) 
         AND eq.current_rack_layer_id IS NOT NULL THEN 'READY'
    WHEN eq.current_rack_layer_id IS NULL THEN 'MISSING_RACK'
    ELSE 'NOT_READY'
  END AS readiness_status,
  -- Thông tin phụ trợ phục vụ hiển thị
  loan.loan_code AS active_loan_code,
  loan.scheduled_return_date AS loan_scheduled_return_date
FROM resolved_equipment re
JOIN public.work_orders wo ON wo.wo_id = re.wo_id
JOIN public.equipment eq ON eq.equipment_id = re.equipment_id
LEFT JOIN public.companies owner_comp ON owner_comp.company_id = eq.company_id
LEFT JOIN public.companies keeper_comp ON keeper_comp.company_id = eq.keeper_company_id
LEFT JOIN public.rack_layers rl ON rl.id = eq.current_rack_layer_id
LEFT JOIN public.racks r ON r.id = rl.rack_id
LEFT JOIN public.companies ysd ON ysd.company_code = 'YSD'
LEFT JOIN public.equipment_loans loan 
  ON loan.equipment_id = eq.equipment_id AND loan.status IN ('APPROVED', 'IN_TRANSIT');

-- Thiết lập bảo mật và quyền truy cập
ALTER VIEW public.v_work_order_equipment_set SET (security_invoker = true);
REVOKE ALL ON public.v_work_order_equipment_set FROM anon;
GRANT SELECT ON public.v_work_order_equipment_set TO authenticated;
GRANT SELECT ON public.v_work_order_equipment_set TO service_role;

COMMENT ON VIEW public.v_work_order_equipment_set IS 'View tổng hợp bộ thiết bị SET cho Work Order (Tầng 1 explicit N:N SET_MEMBER & SHARED + Tầng 2 CAD Revision fallback)';
