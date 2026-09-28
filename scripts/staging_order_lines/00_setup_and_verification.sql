-- ============================================================
-- 00_setup_and_verification.sql
-- Hướng dẫn: Quy trình Staging -> Kiểm chứng -> Nạp vào order_lines
-- Tổng số dòng cần nạp: 6.279 dòng thuộc 2.396 đơn hàng
-- ============================================================

-- BƯỚC 1: Khởi tạo bảng staging trung gian
CREATE TABLE IF NOT EXISTS public.staging_order_lines_backfill (
  staging_id BIGSERIAL PRIMARY KEY,
  order_no TEXT NOT NULL,
  line_no INT NOT NULL,
  product_id UUID NOT NULL,
  product_code TEXT,
  quantity NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_staging_order_line UNIQUE (order_no, line_no)
);

-- Index phụ trợ tối ưu hóa việc đối chiếu và join
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
  ON public.staging_order_lines_backfill(order_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
  ON public.staging_order_lines_backfill(product_id);


-- BƯỚC 2: (Sau khi chạy 16 file batch_01.sql -> batch_16.sql)
-- Kiểm tra tổng số dòng đã nạp vào staging (Kỳ vọng: đúng 6.279 dòng)
SELECT 
  count(*) AS total_staging_rows,
  count(DISTINCT order_no) AS total_orders_in_staging,
  count(DISTINCT product_id) AS total_products_in_staging,
  sum(quantity) AS total_quantity_pcs
FROM public.staging_order_lines_backfill;


-- BƯỚC 3: Dry-run đối soát toàn vẹn Foreign Keys 100% với Production
SELECT 
  count(*) AS total_rows,
  count(o.order_id) AS matched_orders,
  count(p.product_id) AS matched_products,
  count(*) - count(o.order_id) AS missing_order_fks,
  count(*) - count(p.product_id) AS missing_product_fks
FROM public.staging_order_lines_backfill s
LEFT JOIN public.orders o ON o.order_no = s.order_no
LEFT JOIN public.products p ON p.product_id = s.product_id;


-- BƯỚC 4: LỆNH THỰC THI CHÍNH THỨC NẠP VÀO public.order_lines
-- (Chỉ thực hiện sau khi BƯỚC 3 đạt 100% matched, 0 missing)
/*
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
  s.quantity,
  'PCS',
  'CONFIRMED',
  s.notes,
  0,
  s.quantity
FROM public.staging_order_lines_backfill s
JOIN public.orders o ON o.order_no = s.order_no
ORDER BY o.order_id, s.line_no
ON CONFLICT (order_id, line_no) DO NOTHING;
*/


-- BƯỚC 5: Nghiệm thu kết quả sau khi nạp vào order_lines
/*
SELECT 
  (SELECT count(*) FROM public.orders) AS orders_count,
  (SELECT count(*) FROM public.order_lines) AS order_lines_count,
  (SELECT sum(quantity) FROM public.order_lines) AS total_shipped_expected_pcs;
*/


-- BƯỚC 6: Dọn dẹp bảng staging sau khi nghiệm thu thành công 100%
/*
DROP TABLE IF EXISTS public.staging_order_lines_backfill;
*/
