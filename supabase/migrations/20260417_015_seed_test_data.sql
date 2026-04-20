-- ============================================================
-- YSDMS-NEXT | Migration: 20260417_015_seed_test_data.sql
-- Mục đích: Bơm dữ liệu Mẫu Real-World từ dự án SMK-228
-- Update: Fix lỗi NULL Revision_id do bảng Thiết kế đang rỗng
-- ============================================================

BEGIN;

-- 1. Khách Hàng (Dựa trên thông tin Email)
INSERT INTO public.customers (id, customer_code, delivery_name, contact_person, phone, is_active)
VALUES (
  '11111111-1111-1111-1111-111111111101', 
  'SMK', 
  'ＳＭＫ㈱ ＣＳ事業部富山生産部', 
  '延澤 将嘉', 
  '076-455-1215', 
  true
)
ON CONFLICT (id) DO UPDATE 
SET delivery_name = EXCLUDED.delivery_name, 
    contact_person = EXCLUDED.contact_person, 
    is_active = EXCLUDED.is_active;

-- 2. Khay Sản Phẩm
INSERT INTO public.product_master (id, code, name, remarks)
VALUES 
  ('11111111-1111-1111-1111-111111111102', 'SMK-227', '167CSS-048-00E', 'B-Size 365x245, PP 0.6mm, 56 pockets'),
  ('11111111-1111-1111-1111-111111111103', 'SMK-228', '167CSS-049-00E', 'B-Size 365x245, PP 0.6mm, 56 pockets')
ON CONFLICT (id) DO NOTHING;

-- 3. Máy đúc (Machine Master)
INSERT INTO public.machine_master (id, code, name, process_type, status)
VALUES
  ('11111111-1111-1111-1111-111111111104', 'M08', 'Máy dập 80T (Chạy SMKB)', 'MOLDING', 'ACTIVE'),
  ('11111111-1111-1111-1111-111111111105', 'M12', 'Máy dập 120T', 'MOLDING', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 4. Khuôn Gốc & Phiên bản Thiết kế
INSERT INTO public.mold_base (id, code, name, customer_id, is_active)
VALUES (
  '11111111-1111-1111-1111-111111111110',
  'BASE-SMK-245',
  'Khuôn Gốc Khay SMK B-Size',
  '11111111-1111-1111-1111-111111111101',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mold_design_revision (id, mold_base_id, revision_code, version_label)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111110', 'BASE-SMK-245-R1', 'R1 (0.8mm)'),
  ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111110', 'BASE-SMK-245-R2', 'R2 (0.6mm)')
ON CONFLICT (id) DO NOTHING;

-- 5. Khuôn Vật lý (Mold Physical)
INSERT INTO public.mold_physical (id, physical_code, revision_id, cavity, storage_location, status)
VALUES
  ('11111111-1111-1111-1111-111111111121', 'MOLD-PHYS-SMK227', '11111111-1111-1111-1111-111111111111', 4, 'Kệ SMK - Tầng 1', 'ACTIVE'),
  ('11111111-1111-1111-1111-111111111122', 'MOLD-PHYS-SMK228', '11111111-1111-1111-1111-111111111112', 4, 'Kệ SMK - Tầng 2', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 6. Dao Cắt (Cutter Master)
INSERT INTO public.cutter_master (id, code, status, width_rule)
VALUES
  ('11111111-1111-1111-1111-111111111106', 'CUT-SMK-245', 'ACTIVE', '365x245')
ON CONFLICT (id) DO NOTHING;

COMMIT;
