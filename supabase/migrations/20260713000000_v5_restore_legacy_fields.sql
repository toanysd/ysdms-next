-- ============================================================================
-- Migration: V5 Restore Legacy Fields (Mất mát từ V3->V4)
-- ============================================================================

-- 1. Bảng products: Thêm khối lượng, bản vẽ, thiết bị KH
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS tray_weight_g NUMERIC,
  ADD COLUMN IF NOT EXISTS customer_equipment_no TEXT,
  ADD COLUMN IF NOT EXISTS customer_drawing_no TEXT;

-- 2. Bảng design_revisions: Thêm PieceCount, Dung sai, Góc vát
ALTER TABLE design_revisions
  ADD COLUMN IF NOT EXISTS piece_count INTEGER,
  ADD COLUMN IF NOT EXISTS under_angle TEXT,
  ADD COLUMN IF NOT EXISTS under_depth TEXT,
  ADD COLUMN IF NOT EXISTS data_input TEXT,
  ADD COLUMN IF NOT EXISTS tolerance_x NUMERIC,
  ADD COLUMN IF NOT EXISTS tolerance_y NUMERIC;

-- 3. Bảng physical_molds: Tracking vòng đời
ALTER TABLE physical_molds
  ADD COLUMN IF NOT EXISTS on_checklist BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS returned_date DATE,
  ADD COLUMN IF NOT EXISTS disposed_date DATE;

-- 4. Bảng cutters: Đặc tính dao cắt
ALTER TABLE cutters
  ADD COLUMN IF NOT EXISTS manufacture_date DATE,
  ADD COLUMN IF NOT EXISTS sato_code TEXT,
  ADD COLUMN IF NOT EXISTS pp_cushion_use BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cutter_thickness_mm NUMERIC DEFAULT 1.0;

-- 5. Bảng jobs: Gia công & Outsourcing
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS outsourced_company_id UUID REFERENCES companies(company_id),
  ADD COLUMN IF NOT EXISTS outsourcing_price NUMERIC,
  ADD COLUMN IF NOT EXISTS forming_location TEXT;
