-- ============================================================
-- scripts/prepare_official_backfill_payload.sql
-- KẾ HOẠCH & PAYLOAD INSERT CHÍNH THỨC TỪ STAGING SANG public.order_lines
-- Trạng thái: ĐÃ SOẠN THẢO — TUYỆT ĐỐI CHƯA CHẠY KHI CHƯA ĐƯỢC DUYỆT
-- Đáp ứng 100% tiêu chuẩn kỹ thuật mục 3.4 của PE (2026-10-06)
-- ============================================================

-- BƯỚC 1: PREFLIGHT AUDIT (Kiểm tra nghiêm ngặt trước khi ghi)
DO $$
DECLARE
  v_staging_count INT;
  v_lines_count INT;
BEGIN
  SELECT count(*) INTO v_staging_count FROM public.staging_order_lines_backfill;
  SELECT count(*) INTO v_lines_count FROM public.order_lines;

  IF v_staging_count <> 6279 THEN
    RAISE EXCEPTION 'PREFLIGHT THẤT BẠI: staging_order_lines_backfill có % dòng (kỳ vọng 6279)', v_staging_count;
  END IF;

  IF v_lines_count <> 0 THEN
    RAISE EXCEPTION 'PREFLIGHT THẤT BẠI: order_lines đang có % dòng (kỳ vọng 0)', v_lines_count;
  END IF;

  RAISE NOTICE 'PREFLIGHT ĐẠT: staging = 6279, order_lines = 0. Đủ điều kiện thực thi.';
END $$;


-- BƯỚC 2: LỆNH INSERT THỰC THI (FAIL-CLOSED THEO TIÊU CHUẨN PE)
-- Tuyệt đối không dùng ON CONFLICT DO UPDATE để bảo vệ dữ liệu
INSERT INTO public.order_lines (
  order_id,
  line_no,
  product_id,
  quantity,
  unit,
  line_status,
  notes,
  shipped_qty,
  remaining_qty
)
SELECT 
  o.order_id,
  s.line_no,
  s.product_id,
  s.quantity_normalized::integer,
  'PCS',
  'CONFIRMED',
  s.notes,
  0,
  s.quantity_normalized::integer
FROM public.staging_order_lines_backfill s
JOIN public.orders o ON o.order_no = s.order_no
ORDER BY o.order_id, s.line_no;


-- BƯỚC 3: POSTFLIGHT AUDIT (Nghiệm thu sau khi nạp)
-- 1. Tổng số dòng trong order_lines (kỳ vọng: đúng 6.279 dòng, 8.701.481 PCS)
SELECT 
  count(*) AS total_order_lines, 
  sum(quantity) AS total_quantity_pcs,
  count(DISTINCT order_id) AS distinct_orders,
  count(DISTINCT product_id) AS distinct_products
FROM public.order_lines;

-- 2. Kiểm tra trùng lặp khóa (order_id, line_no) (kỳ vọng: 0 dòng)
SELECT order_id, line_no, count(*) 
FROM public.order_lines 
GROUP BY order_id, line_no 
HAVING count(*) > 1;

-- 3. Kiểm tra Orphan Foreign Keys (kỳ vọng: 0 lỗi)
SELECT count(*) AS orphan_orders 
FROM public.order_lines ol 
LEFT JOIN public.orders o ON o.order_id = ol.order_id 
WHERE o.order_id IS NULL;

SELECT count(*) AS orphan_products 
FROM public.order_lines ol 
LEFT JOIN public.products p ON p.product_id = ol.product_id 
WHERE p.product_id IS NULL;

-- 4. Kiểm tra tính toàn vẹn trạng thái & số lượng còn lại (kỳ vọng: 0 lỗi)
SELECT count(*) AS invalid_rows 
FROM public.order_lines 
WHERE remaining_qty <> quantity OR shipped_qty <> 0 OR line_status <> 'CONFIRMED' OR unit <> 'PCS';
