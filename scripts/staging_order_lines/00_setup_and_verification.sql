-- ============================================================
-- 00_setup_and_verification.sql
-- Hướng dẫn: Quy trình Staging -> 7 Kiểm định PE -> Nạp vào order_lines
-- Tổng số dòng cần nạp: 6.279 dòng thuộc 2.396 đơn hàng
-- Đã tích hợp đầy đủ yêu cầu kiểm định 3.1 & 3.2 từ PE (2026-10-06)
-- ============================================================

-- BƯỚC 1: Khởi tạo bảng staging trung gian (kèm tracking batch và dòng nguồn)
CREATE TABLE IF NOT EXISTS public.staging_order_lines_backfill (
  staging_id BIGSERIAL PRIMARY KEY,
  batch_no INT NOT NULL,
  source_row_no INT NOT NULL,
  order_no TEXT NOT NULL,
  line_no INT NOT NULL,
  product_id UUID NOT NULL,
  product_code TEXT,
  product_code_source TEXT,
  quantity NUMERIC NOT NULL,
  quantity_source NUMERIC,
  quantity_normalized INT NOT NULL,
  notes TEXT,
  validation_status TEXT DEFAULT 'PENDING',
  validation_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_staging_order_line UNIQUE (order_no, line_no)
);

-- Index phụ trợ tối ưu hóa việc đối chiếu và join
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
  ON public.staging_order_lines_backfill(order_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
  ON public.staging_order_lines_backfill(product_id);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_batch 
  ON public.staging_order_lines_backfill(batch_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_source_row 
  ON public.staging_order_lines_backfill(source_row_no);


-- ============================================================
-- BƯỚC 2: 7 TRUY VẤN KIỂM ĐỊNH BẮT BUỘC THEO QUY CHUẨN PE (A -> G)
-- (Thực hiện sau khi đã nạp đủ 16 lô batch_01.sql -> batch_16.sql)
-- ============================================================

-- A. Đếm tổng staging (Kỳ vọng: 6.279 dòng, 8.701.481 PCS normalized hoặc 8.701.479 PCS source)
SELECT 
  count(*) AS total_staging_rows,
  count(DISTINCT order_no) AS total_orders_in_staging,
  count(DISTINCT product_id) AS total_products_in_staging,
  sum(quantity_normalized) AS total_quantity_pcs
FROM public.staging_order_lines_backfill;

-- B. Duplicate khóa nguồn (Kỳ vọng: 0 dòng)
SELECT order_no, line_no, count(*) 
FROM public.staging_order_lines_backfill 
GROUP BY order_no, line_no 
HAVING count(*) > 1;

-- C. Missing order (Kỳ vọng: 0 dòng)
SELECT s.order_no, count(*) 
FROM public.staging_order_lines_backfill s 
LEFT JOIN public.orders o ON o.order_no = s.order_no 
WHERE o.order_id IS NULL 
GROUP BY s.order_no;

-- D. Missing product (Kỳ vọng: 0 dòng)
SELECT s.product_id, count(*) 
FROM public.staging_order_lines_backfill s 
LEFT JOIN public.products p ON p.product_id = s.product_id 
WHERE p.product_id IS NULL 
GROUP BY s.product_id;

-- E. Mismatch product code (Kỳ vọng: 0 dòng)
SELECT s.product_id, s.product_code, p.product_code AS db_product_code
FROM public.staging_order_lines_backfill s 
JOIN public.products p ON p.product_id = s.product_id 
WHERE s.product_code IS DISTINCT FROM p.product_code;

-- F. Quantity không hợp lệ (<= 0 hoặc không phải số nguyên) (Kỳ vọng: 0 dòng)
SELECT * 
FROM public.staging_order_lines_backfill 
WHERE quantity_normalized <= 0 OR quantity_normalized <> trunc(quantity_normalized);

-- G. Kiểm tra line_no liên tục theo từng order (Kỳ vọng: 0 dòng)
WITH x AS ( 
  SELECT order_no, line_no, row_number() OVER (PARTITION BY order_no ORDER BY line_no) AS expected_line_no 
  FROM public.staging_order_lines_backfill 
) 
SELECT * FROM x WHERE line_no <> expected_line_no;


-- ============================================================
-- BƯỚC 3: THỰC THI CHÍNH THỨC NẠP VÀO public.order_lines
-- (TUYỆT ĐỐI CHỈ CHẠY KHI ĐƯỢC THOAN VÀ PE PHÊ DUYỆT CHÍNH THỨC)
-- ============================================================
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
  s.quantity_normalized,
  'PCS',
  'CONFIRMED', -- Lưu ý: schema default là 'NEW', 'CONFIRMED' phù hợp cho đơn hàng đã xác nhận từ Excel lịch sử
  s.notes,
  0,
  s.quantity_normalized
FROM public.staging_order_lines_backfill s
JOIN public.orders o ON o.order_no = s.order_no
ORDER BY o.order_id, s.line_no
ON CONFLICT (order_id, line_no) DO NOTHING;
*/


-- ============================================================
-- BƯỚC 4: ĐỐI SOÁT SAU BACKFILL (Theo yêu cầu 3.4 của PE)
-- ============================================================
/*
-- 1. Tổng số dòng trong order_lines (kỳ vọng: 6.279, tổng quantity: 8.701.481 PCS)
SELECT count(*) AS total_order_lines, sum(quantity) AS total_quantity_pcs FROM public.order_lines;

-- 2. Kiểm tra không có duplicate (order_id, line_no) (kỳ vọng: 0 dòng)
SELECT order_id, line_no, count(*) FROM public.order_lines GROUP BY order_id, line_no HAVING count(*) > 1;

-- 3. Kiểm tra orphan FK (kỳ vọng: 0 dòng)
SELECT count(*) AS orphan_orders FROM public.order_lines ol LEFT JOIN public.orders o ON o.order_id = ol.order_id WHERE o.order_id IS NULL;
SELECT count(*) AS orphan_products FROM public.order_lines ol LEFT JOIN public.products p ON p.product_id = ol.product_id WHERE p.product_id IS NULL;

-- 4. Kiểm tra remaining_qty = quantity và shipped_qty = 0 (kỳ vọng: 0 dòng lỗi)
SELECT count(*) AS invalid_quantities FROM public.order_lines WHERE remaining_qty <> quantity OR shipped_qty <> 0;
*/


-- ============================================================
-- BƯỚC 5: DỌN DẸP BẢNG STAGING (Sau khi nghiệm thu hoàn tất 100%)
-- ============================================================
/*
DROP TABLE IF EXISTS public.staging_order_lines_backfill;
*/
