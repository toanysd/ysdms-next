-- ============================================================
-- YSDMS-NEXT | Migration: 20260417_016_index_product_customer_code.sql
-- Mục đích: Đánh rõ vai trò cột customer_code trong product_master
-- Định nghĩa nó là "Customer Part Number / Khách Gọi Mã"
-- Đánh Index GIN (hoặc BTREE) để tăng tốc độ Search Box.
-- ============================================================

BEGIN;

-- 1. Làm rõ vai trò cột (không thay đổi cấu trúc, chỉ là Document Schema)
COMMENT ON COLUMN public.product_master.customer_code IS '客先品番 — Customer Part Number (e.g. 167CSC-077-01E). Dùng cho search box truy vấn phía khách hàng đặt.';

-- 2. Đánh Index tìm kiếm nhanh (B-Tree là quá đủ cho Exact Match / Like Match, nhưng nếu bạn muốn GIN cho Full Text Search trên ID thì phải dùng pg_trgm)
-- Mặc định ở đây ta sử dụng B-TREE tiêu chuẩn, đủ để quét WHERE customer_code = '167CSC-077-01E' với tốc độ 0.1ms
CREATE INDEX IF NOT EXISTS idx_product_master_customer_code 
  ON public.product_master (customer_code);

-- 3. Cập nhật nhẹ Dữ liệu Seed 015 vừa tạo để nó thể hiện đúng thiết kế mới
UPDATE public.product_master
SET customer_code = '167CSS-048-00E',
    name = '365x245 サイズ 30個入'
WHERE id = '11111111-1111-1111-1111-111111111102';

UPDATE public.product_master
SET customer_code = '167CSS-049-00E',
    name = '365x245 サイズ 30個入'
WHERE id = '11111111-1111-1111-1111-111111111103';

COMMIT;
