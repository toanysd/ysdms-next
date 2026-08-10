-- ============================================================
-- YSDMS-NEXT | Migration: 20260417_019_refine_mold_physical_names.sql
-- Mục đích: Chuẩn hóa Mã Khuôn Vật Lý (Physical Mold)
-- Áp dụng nguyên tắc "Cắt bỏ Hậu tố cồng kềnh", cho phép Mã Vật lý 
-- trùng khớp hoàn toàn với Mã Thiết kế (Ví dụ: SMK-227-R1)
-- ============================================================

BEGIN;

UPDATE public.mold_physical
SET physical_code = 'SMK-227-R1'
WHERE physical_code = 'SMK-227-R1-PHYS' OR id = '11111111-1111-1111-1111-111111111121';

UPDATE public.mold_physical
SET physical_code = 'SMK-228-R1'
WHERE physical_code = 'SMK-228-R1-PHYS' OR id = '11111111-1111-1111-1111-111111111122';

COMMIT;
