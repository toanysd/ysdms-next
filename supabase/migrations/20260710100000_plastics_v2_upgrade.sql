-- ============================================================
-- Migration: Nâng cấp hệ sinh thái Nhựa v2
-- 1. Thêm cột chi tiết lô hàng vào plastic_receipt_roll
-- 2. Tạo bảng plastic_manufacturer_map (Mapping NCC ↔ Mã YSD)
-- ============================================================

-- 1. Bổ sung cột vào plastic_receipt_roll
ALTER TABLE plastic_receipt_roll
  ADD COLUMN IF NOT EXISTS lot_no TEXT,
  ADD COLUMN IF NOT EXISTS commercial_grade_code TEXT,
  ADD COLUMN IF NOT EXISTS supplier_name TEXT,
  ADD COLUMN IF NOT EXISTS warehouse_location TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Bảng mapping mã hãng sản xuất ↔ mã chuẩn YSD
CREATE TABLE IF NOT EXISTS plastic_manufacturer_map (
  map_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Nhà cung cấp
  supplier_id UUID REFERENCES companies(company_id),
  supplier_code TEXT,           -- Mã NCC rút gọn
  supplier_name TEXT,           -- Tên NCC (cache)
  
  -- Mã hãng (Grade)
  commercial_grade_code TEXT NOT NULL,  -- VD: "C-APET 0.7mm 640W CL"
  
  -- Liên kết mã chuẩn YSD
  plastic_id UUID REFERENCES plastic_master(plastic_id),
  mapping_status TEXT DEFAULT 'needs_confirmation' 
    CHECK (mapping_status IN ('confirmed','provisional_confirmed','needs_confirmation','rejected')),
  
  -- Thông số kỹ thuật từ NCC
  specific_gravity_kg_m3 NUMERIC(8,2),  -- Tỉ trọng (dùng tính giá khay)
  
  -- Giá
  price_jpy_per_kg NUMERIC(10,2),       -- Giá nội bộ (JPY/kg)
  price_effective_date DATE,             -- Ngày áp dụng giá
  
  -- Quản lý
  status_review TEXT DEFAULT 'draft' CHECK (status_review IN ('draft','checked','confirmed')),
  note TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Unique: 1 NCC + 1 mã hãng = 1 record
  UNIQUE(supplier_id, commercial_grade_code)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_manufacturer_map_plastic ON plastic_manufacturer_map(plastic_id);
CREATE INDEX IF NOT EXISTS idx_manufacturer_map_supplier ON plastic_manufacturer_map(supplier_id);

-- Bổ sung cột thiếu cho plastic_master (nếu chưa có từ migration cũ)
DO $$ BEGIN
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS plastic_family TEXT NOT NULL DEFAULT 'OTHER';
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS plastic_subtype TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS color_code_raw TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS color_name_normalized TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS electrical_property TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS silicone_status_normalized TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS additive_flags TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS additive_text_raw TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS appearance_text_raw TEXT;
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS standard_length_m NUMERIC(8,1);
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS status_review TEXT DEFAULT 'draft';
  ALTER TABLE plastic_master ADD COLUMN IF NOT EXISTS remarks_raw TEXT;
END $$;
