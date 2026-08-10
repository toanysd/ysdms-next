-- Migration: MRP Dashboard, Branches & Pitch Normalization
-- Description: 
-- 1. Thêm/Cập nhật các chi nhánh nội bộ vào bảng companies
-- 2. Đổi tên pitch_mm -> cavity_pitch_mm và thêm machine_feed_pitch_mm
-- 3. Thêm branch_id vào plastic_receipt_roll
-- 4. Tạo function tính toán dự báo nhu cầu vật liệu MRP

BEGIN;

-- 1. Chuẩn hóa Branches (INTERNAL)
-- Cập nhật MARUDAI (Ibaraki Factory)
UPDATE public.companies
SET company_type = array_append(company_type, 'INTERNAL')
WHERE company_code = 'MARUDAI' AND NOT ('INTERNAL' = ANY(COALESCE(company_type, ARRAY[]::TEXT[])));

-- Cập nhật AOMORI và VIETNAM (nếu đã có nhưng thiếu type)
UPDATE public.companies
SET company_type = array_append(company_type, 'INTERNAL')
WHERE company_code IN ('AOMORI', 'VIETNAM') AND NOT ('INTERNAL' = ANY(COALESCE(company_type, ARRAY[]::TEXT[])));

-- Thêm các chi nhánh mới (Honsha, Sakata, Sagamihara)
INSERT INTO public.companies (company_code, company_name, company_type, is_active)
VALUES 
  ('HONSHA', '本社工場', ARRAY['INTERNAL'], true),
  ('SAKATA', '坂田工場', ARRAY['INTERNAL'], true),
  ('SAGAMIHARA', '相模原倉庫', ARRAY['INTERNAL'], true)
ON CONFLICT (company_code) DO NOTHING;

-- 2. Chuẩn hóa Khái niệm Pitch trong design_revisions
ALTER TABLE public.design_revisions
  RENAME COLUMN pitch_mm TO cavity_pitch_mm;

ALTER TABLE public.design_revisions
  ADD COLUMN machine_feed_pitch_mm NUMERIC;

COMMENT ON COLUMN public.design_revisions.cavity_pitch_mm IS 'Bước khuôn (khoảng cách giữa các khoang khuôn) - Dùng thiết kế dao cắt';
COMMENT ON COLUMN public.design_revisions.machine_feed_pitch_mm IS 'Bước tiến nhựa (送り) - Dùng tính hao phí vật liệu (MRP)';

-- 3. Thêm branch_id vào quản lý kho nhựa
ALTER TABLE public.plastic_receipt_roll
  ADD COLUMN branch_id UUID REFERENCES public.companies(company_id);

COMMENT ON COLUMN public.plastic_receipt_roll.branch_id IS 'Chi nhánh/Kho đang lưu trữ cuộn nhựa này';

-- 4. Tạo Function tính toán MRP
CREATE OR REPLACE FUNCTION public.calculate_plastic_mrp_v2(p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
  plastic_id UUID,
  timeline_date DATE,
  demand_meters NUMERIC,
  supply_meters NUMERIC
) AS $$
BEGIN
  -- Logic trả về timeline nhu cầu (demand) và nhập kho dự kiến (supply)
  -- Chi tiết sẽ được query thông qua RPC hoặc View kết hợp.
  RETURN QUERY
  WITH RECURSIVE dates AS (
    SELECT p_start_date AS dt
    UNION ALL
    SELECT dt + 1 FROM dates WHERE dt < p_end_date
  ),
  daily_demand AS (
    SELECT 
      pr.plastic_id,
      ol.due_date AS target_date,
      SUM(
        (ol.quantity::numeric / COALESCE(NULLIF(dr.cavity_count, 0), 1)::numeric) 
        * (COALESCE(dr.machine_feed_pitch_mm, dr.cutline_length + 15) / 1000.0) 
        * 1.05
      ) AS daily_meters
    FROM public.order_lines ol
    JOIN public.orders o ON o.order_id = ol.order_id
    JOIN public.products pr ON pr.product_id = ol.product_id
    LEFT JOIN public.design_revisions dr ON dr.revision_id = COALESCE(ol.design_revision_id, 
      (SELECT revision_id FROM public.design_revisions WHERE product_id = pr.product_id ORDER BY created_at DESC LIMIT 1)
    )
    WHERE o.order_status IN ('NEW', 'CONFIRMED', 'IN_PRODUCTION')
      AND ol.due_date BETWEEN p_start_date AND p_end_date
      AND pr.plastic_id IS NOT NULL -- Giả sử products có liên kết plastic_id (trong WMS Phase 2, sẽ cần join rõ hơn)
    GROUP BY pr.plastic_id, ol.due_date
  )
  SELECT 
    d.plastic_id,
    dt.dt AS timeline_date,
    COALESCE(d.daily_meters, 0) AS demand_meters,
    0::NUMERIC AS supply_meters
  FROM dates dt
  CROSS JOIN (SELECT DISTINCT plastic_id FROM daily_demand) d
  LEFT JOIN daily_demand dd ON dd.plastic_id = d.plastic_id AND dd.target_date = dt.dt;
END;
$$ LANGUAGE plpgsql;

COMMIT;
