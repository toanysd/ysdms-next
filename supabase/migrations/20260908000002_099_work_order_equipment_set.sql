-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: 099_work_order_equipment_set.sql
-- Description: Milestone 19 - View & RPC for Work Order Equipment SET Resolution
-- ADR Reference: ADR-010 (Approved 2026-09-08)
-- Author: AN (Antigravity Architect)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. DROP EXISTING IF ANY
DROP FUNCTION IF EXISTS public.fn_get_wo_equipment_set(UUID);
DROP VIEW IF EXISTS public.v_work_order_equipment_set;

-- 2. VIEW: v_work_order_equipment_set
-- Phân giải thiết bị trực tiếp: MOLD chính + Tầng 1 (equipment_assignments) + Tầng 2 Fallback (CUTTER cùng revision)
CREATE OR REPLACE VIEW public.v_work_order_equipment_set AS
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

  -- 2. Tầng 1: Các thiết bị liên kết cố định trong equipment_assignments (SET_MEMBER)
  SELECT 
    w.wo_id,
    ea.related_equipment_id AS equipment_id,
    COALESCE(ea.relationship_type, 'SET_MEMBER')::text AS assignment_type
  FROM wo_primary_mold w
  JOIN public.equipment_assignments ea 
    ON ea.primary_equipment_id = w.mold_equipment_id 
    AND ea.relationship_type = 'SET_MEMBER'

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
      AND ea2.relationship_type = 'SET_MEMBER'
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

-- Quyền truy cập View
GRANT SELECT ON public.v_work_order_equipment_set TO authenticated, anon;


-- 3. RPC: fn_get_wo_equipment_set
-- Hàm phân giải trọn vẹn 3 tầng SET thiết bị, trả về cấu trúc JSON phân cấp cho Work Order
CREATE OR REPLACE FUNCTION public.fn_get_wo_equipment_set(p_wo_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wo RECORD;
  v_primary_mold JSONB := NULL;
  v_set_members JSONB := '[]'::jsonb;
  v_suggested_shared JSONB := '[]'::jsonb;
  v_mold_cav_type_id UUID := NULL;
  v_total_items INT := 0;
  v_ready_items INT := 0;
  v_has_mold BOOLEAN := FALSE;
  v_has_cutter BOOLEAN := FALSE;
  v_is_all_ready BOOLEAN := FALSE;
BEGIN
  -- 1. Lấy thông tin Work Order
  SELECT 
    wo.wo_id,
    wo.wo_code,
    wo.wo_name,
    wo.wo_status,
    wo.product_id,
    wo.design_revision_id,
    p.product_code,
    p.product_name,
    p.product_name_internal,
    dr.design_code,
    dr.revision_number,
    dr.plastic_type_designed,
    dr.cutline_length,
    dr.cutline_width,
    dr.cav_type_id AS dr_cav_type_id
  INTO v_wo
  FROM public.work_orders wo
  LEFT JOIN public.products p ON p.product_id = wo.product_id
  LEFT JOIN public.design_revisions dr ON dr.revision_id = wo.design_revision_id
  WHERE wo.wo_id = p_wo_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'error', 'WORK_ORDER_NOT_FOUND',
      'wo_id', p_wo_id
    );
  END IF;

  -- 2. Lấy Khuôn chính (Primary MOLD) từ View
  SELECT jsonb_build_object(
    'equipment_id', v.equipment_id,
    'equipment_code', v.equipment_code,
    'equipment_name', v.equipment_name,
    'equipment_type', v.equipment_type,
    'device_status', v.device_status,
    'usage_status', v.usage_status,
    'owner_company_name', v.owner_company_name,
    'keeper_company_name', v.keeper_company_name,
    'current_rack_layer_id', v.current_rack_layer_id,
    'layer_code', v.layer_code,
    'rack_code', v.rack_code,
    'zone_code', v.zone_code,
    'assignment_type', v.assignment_type,
    'readiness_status', v.readiness_status,
    'active_loan_code', v.active_loan_code,
    'loan_scheduled_return_date', v.loan_scheduled_return_date
  ) INTO v_primary_mold
  FROM public.v_work_order_equipment_set v
  WHERE v.wo_id = p_wo_id AND v.assignment_type = 'PRIMARY_MOLD'
  LIMIT 1;

  IF v_primary_mold IS NOT NULL THEN
    v_has_mold := TRUE;
    v_total_items := v_total_items + 1;
    IF (v_primary_mold->>'readiness_status') = 'READY' THEN
      v_ready_items := v_ready_items + 1;
    END IF;

    -- Lấy cav_type_id của khuôn
    SELECT cav_type_id INTO v_mold_cav_type_id
    FROM public.equipment
    WHERE equipment_id = (v_primary_mold->>'equipment_id')::uuid;
  END IF;

  -- Fallback cav_type_id từ bản vẽ thiết kế nếu khuôn chưa có
  IF v_mold_cav_type_id IS NULL THEN
    v_mold_cav_type_id := v_wo.dr_cav_type_id;
  END IF;

  -- 3. Lấy các thành viên SET (Tầng 1 & Tầng 2 Fallback) từ View
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'equipment_id', v.equipment_id,
      'equipment_code', v.equipment_code,
      'equipment_name', v.equipment_name,
      'equipment_type', v.equipment_type,
      'device_status', v.device_status,
      'usage_status', v.usage_status,
      'owner_company_name', v.owner_company_name,
      'keeper_company_name', v.keeper_company_name,
      'current_rack_layer_id', v.current_rack_layer_id,
      'layer_code', v.layer_code,
      'rack_code', v.rack_code,
      'zone_code', v.zone_code,
      'assignment_type', v.assignment_type,
      'readiness_status', v.readiness_status,
      'active_loan_code', v.active_loan_code,
      'loan_scheduled_return_date', v.loan_scheduled_return_date
    )
  ), '[]'::jsonb) INTO v_set_members
  FROM public.v_work_order_equipment_set v
  WHERE v.wo_id = p_wo_id AND v.assignment_type <> 'PRIMARY_MOLD';

  -- Cập nhật thống kê từ set_members
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE (item->>'readiness_status') = 'READY'),
    BOOL_OR((item->>'equipment_type') IN ('CUTTER_INLINE', 'CUTTER_SEPARATE'))
  INTO 
    v_total_items,
    v_ready_items,
    v_has_cutter
  FROM (
    SELECT jsonb_array_elements(v_set_members) AS item
  ) s;

  -- Bù lại khuôn chính vào biến đếm nếu có
  IF v_has_mold THEN
    v_total_items := COALESCE(v_total_items, 0) + 1;
    IF (v_primary_mold->>'readiness_status') = 'READY' THEN
      v_ready_items := COALESCE(v_ready_items, 0) + 1;
    END IF;
  END IF;

  -- 4. Tầng 3 (RPC Only): Gợi ý các bộ phụ trợ dùng chung (WATER_BASE, PRESSURE_BASE, FRAME)
  -- Tìm các phụ trợ dùng chung của YSD tương thích với cav_type_id của khuôn hoặc bản vẽ
  IF v_mold_cav_type_id IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'equipment_id', eq.equipment_id,
        'equipment_code', eq.equipment_code,
        'equipment_name', eq.display_name,
        'equipment_type', eq.equipment_type,
        'device_status', eq.device_status,
        'usage_status', eq.usage_status,
        'current_rack_layer_id', eq.current_rack_layer_id,
        'layer_code', rl.layer_code,
        'rack_code', r.rack_code_new,
        'match_reason', 'CAV_TYPE_MATCH',
        'readiness_status', CASE
          WHEN eq.device_status IN ('MAINTENANCE', 'REPAIRING', 'DAMAGED') THEN 'MAINTENANCE'
          WHEN eq.usage_status = 'IN_USE' THEN 'IN_USE'
          WHEN (eq.device_status = 'NORMAL' OR eq.device_status IS NULL) 
               AND (eq.usage_status IS NULL OR eq.usage_status IN ('STORAGE', 'IN_STOCK', 'ACTIVE')) 
               AND eq.current_rack_layer_id IS NOT NULL THEN 'READY'
          ELSE 'NOT_READY'
        END
      )
    ), '[]'::jsonb) INTO v_suggested_shared
    FROM public.equipment eq
    LEFT JOIN public.rack_layers rl ON rl.id = eq.current_rack_layer_id
    LEFT JOIN public.racks r ON r.id = rl.rack_id
    WHERE eq.cav_type_id = v_mold_cav_type_id
      AND eq.equipment_type IN ('WATER_BASE', 'PRESSURE_BASE', 'FRAME', 'STACKING')
      AND (eq.device_status = 'NORMAL' OR eq.device_status IS NULL)
      -- Không trùng với các thiết bị đã được gán trực tiếp
      AND eq.equipment_id NOT IN (
        SELECT (elem->>'equipment_id')::uuid 
        FROM jsonb_array_elements(v_set_members) elem
      )
    LIMIT 10;
  END IF;

  -- Tính toán cờ sẵn sàng toàn diện
  v_is_all_ready := (v_has_mold AND v_has_cutter AND v_ready_items = v_total_items AND v_total_items > 0);

  -- 5. Trả về kết quả JSON hoàn chỉnh
  RETURN jsonb_build_object(
    'wo_id', v_wo.wo_id,
    'wo_code', v_wo.wo_code,
    'wo_name', v_wo.wo_name,
    'wo_status', v_wo.wo_status,
    'product_id', v_wo.product_id,
    'product_code', v_wo.product_code,
    'product_name', v_wo.product_name,
    'product_name_internal', v_wo.product_name_internal,
    'design_revision_id', v_wo.design_revision_id,
    'design_code', v_wo.design_code,
    'revision_number', v_wo.revision_number,
    'plastic_type_designed', v_wo.plastic_type_designed,
    'cutline_length', v_wo.cutline_length,
    'cutline_width', v_wo.cutline_width,
    'primary_mold', v_primary_mold,
    'set_members', v_set_members,
    'suggested_shared', v_suggested_shared,
    'summary', jsonb_build_object(
      'total_items', v_total_items,
      'ready_items', v_ready_items,
      'has_mold', v_has_mold,
      'has_cutter', v_has_cutter,
      'is_all_ready', v_is_all_ready
    )
  );
END;
$$;

-- Cấp quyền thực thi RPC
GRANT EXECUTE ON FUNCTION public.fn_get_wo_equipment_set(UUID) TO authenticated, anon;

-- Ghi chú kiểm tra
COMMENT ON VIEW public.v_work_order_equipment_set IS 'View tổng hợp bộ thiết bị SET cho Work Order (Tầng 1 explicit N:N + Tầng 2 CAD Revision fallback)';
COMMENT ON FUNCTION public.fn_get_wo_equipment_set(UUID) IS 'RPC phân giải 3 tầng SET thiết bị và đánh giá readiness cho Work Order (Milestone 19)';
