-- ============================================================
-- YSDMS-NEXT | Migration: 20260417_018_fix_mold_nomenclature.sql
-- Mục đích: Chuẩn hóa Danh pháp (Nomenclature) cho Khuôn
-- Dựa trên Quy tắc Bất Thành Văn (Tacit Knowledge) của Xưởng:
-- Base Mold = Tên Product Master
-- Revision = Base Mold + ' R1', ' R2'...
-- ============================================================

BEGIN;

-- 1. Tách hẳn 2 Base Mold riêng biệt cho SMK-227 và SMK-228
-- Update Base Mold cũ (ID kết thúc bằng 1110) thành Base cho SMK-227
UPDATE public.mold_base
SET code = 'SMK-227', name = 'Khuôn Gốc Khay SMK-227'
WHERE id = '11111111-1111-1111-1111-111111111110';

-- Tạo Base Mold mới cho SMK-228
INSERT INTO public.mold_base (id, code, name, customer_id, is_active)
VALUES (
  '11111111-1111-1111-1111-111111111113', 
  'SMK-228', 
  'Khuôn Gốc Khay SMK-228', 
  '11111111-1111-1111-1111-111111111101', 
  true
) ON CONFLICT (id) DO NOTHING;

-- 2. Cập nhật Revisions
-- Revision R1 thuộc về nhóm SMK-227 (ID mold base: 1110)
UPDATE public.mold_design_revision
SET revision_code = 'SMK-227-R1', version_label = 'R1', mold_base_id = '11111111-1111-1111-1111-111111111110'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Revision R1 thuộc về nhóm SMK-228 (Kéo mold_base_id sang cái mới tạo: 1113)
UPDATE public.mold_design_revision
SET revision_code = 'SMK-228-R1', version_label = 'R1', mold_base_id = '11111111-1111-1111-1111-111111111113'
WHERE id = '11111111-1111-1111-1111-111111111112';

-- 3. Cập nhật Khuôn Vật Lý (Physical Mold) ngầm định theo tên Revision
UPDATE public.mold_physical
SET physical_code = 'SMK-227-R1-PHYS'
WHERE id = '11111111-1111-1111-1111-111111111121';

UPDATE public.mold_physical
SET physical_code = 'SMK-228-R1-PHYS'
WHERE id = '11111111-1111-1111-1111-111111111122';

COMMIT;
