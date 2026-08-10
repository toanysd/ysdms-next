-- ============================================================
-- YSDMS-NEXT | Migration: 20260418_020_purge_fake_seed_molds.sql
-- Mục đích: Xóa sạch dữ liệu mẫu "bịa" SMK-227/228
-- Thứ tự: Con trước → Cha sau (tôn trọng FK constraint)
-- ============================================================

BEGIN;

-- 1. Xóa liên kết Product ↔ Revision (Migration 017 đã tạo)
DELETE FROM public.product_mold_map
WHERE id IN (
  '11111111-1111-1111-1111-111111111131',
  '11111111-1111-1111-1111-111111111132'
);

-- 2. Xóa Khuôn Nhôm Vật Lý
DELETE FROM public.mold_physical
WHERE id IN (
  '11111111-1111-1111-1111-111111111121',
  '11111111-1111-1111-1111-111111111122'
);

-- 3. Xóa Phiên Bản Thiết Kế (Revision)
DELETE FROM public.mold_design_revision
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111112'
);

-- 4. Xóa Khuôn Gốc BASE-SMK-245 (cha chung giả tạo)
DELETE FROM public.mold_base
WHERE id = '11111111-1111-1111-1111-111111111110';

-- Xác nhận
DO $$
BEGIN
  RAISE NOTICE 'Migration 020 hoàn tất: Đã purge toàn bộ seed bịa. DB sạch bong!';
END $$;

COMMIT;
