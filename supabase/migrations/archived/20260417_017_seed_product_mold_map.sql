-- ============================================================
-- YSDMS-NEXT | Migration: 20260417_017_seed_product_mold_map.sql
-- Mục đích: Khép kín Mắt xích Liên kết giữa Mã Sản phẩm (Khay) 
-- và Phiên bản Thiết kế Khuôn tĩnh (Revision)
-- ============================================================

BEGIN;

-- Khớp nối Product (Khay) với Revision Khuôn tương ứng
-- SMK-227 (1111...1102) -> R1 (1111...1111)
-- SMK-228 (1111...1103) -> R2 (1111...1112)
INSERT INTO public.product_mold_map (id, product_id, revision_id, priority)
VALUES 
  ('11111111-1111-1111-1111-111111111131', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 1),
  ('11111111-1111-1111-1111-111111111132', '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111112', 1)
ON CONFLICT (id) DO NOTHING;

COMMIT;
