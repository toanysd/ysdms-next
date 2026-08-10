-- Migration: Auxiliary Equipments & CAV/Machine expansion
-- Date: 2026-07-11 14:00:00

-- Định nghĩa function cập nhật updated_at nếu chưa tồn tại
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Mở rộng bảng cav_types và machines
ALTER TABLE public.machines
  ADD COLUMN IF NOT EXISTS machine_series text;

ALTER TABLE public.cav_types
  ADD COLUMN IF NOT EXISTS machine_series text,
  ADD COLUMN IF NOT EXISTS description text;

-- 2. Cập nhật item_types (Sửa typo và thêm tên tiếng Việt)
UPDATE public.item_types SET item_type_code = 'PRESSURE_BASE' WHERE item_type_id = 6;
UPDATE public.item_types SET item_type_code = 'STACKING' WHERE item_type_id = 7;

UPDATE public.item_types SET item_type_name_vi = 'Khuôn nhôm' WHERE item_type_id = 1;
UPDATE public.item_types SET item_type_name_vi = 'Khuôn' WHERE item_type_id = 2;
UPDATE public.item_types SET item_type_name_vi = 'Plug' WHERE item_type_id = 3;
UPDATE public.item_types SET item_type_name_vi = 'Dao cắt' WHERE item_type_id = 4;
UPDATE public.item_types SET item_type_name_vi = 'Đế làm mát' WHERE item_type_id = 5;
UPDATE public.item_types SET item_type_name_vi = 'Đế áp suất' WHERE item_type_id = 6;
UPDATE public.item_types SET item_type_name_vi = 'Thiết bị Xếp chồng' WHERE item_type_id = 7;
UPDATE public.item_types SET item_type_name_vi = 'Khung (Frame)' WHERE item_type_id = 8;
UPDATE public.item_types SET item_type_name_vi = 'Máy' WHERE item_type_id = 9;
UPDATE public.item_types SET item_type_name_vi = 'Khác' WHERE item_type_id = 10;
UPDATE public.item_types SET item_type_name_vi = 'Khuôn test' WHERE item_type_id = 11;

-- 3. Đổi tên bảng cũ nếu đã tồn tại để tránh xung đột
ALTER TABLE IF EXISTS public.auxiliary_equipments RENAME TO auxiliary_equipments_v1_backup;
ALTER INDEX IF EXISTS auxiliary_equipments_pkey RENAME TO auxiliary_equipments_v1_backup_pkey;

-- 4. Tạo bảng auxiliary_equipments
CREATE TABLE public.auxiliary_equipments (
  equipment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Phân loại
  item_type_id integer NOT NULL REFERENCES public.item_types(item_type_id),
  
  -- Định danh
  equipment_code text UNIQUE NOT NULL,
  equipment_name text,
  position text, -- 'UPPER' | 'LOWER' | NULL
  
  -- Kích thước & Tương thích
  cav_type_id uuid REFERENCES public.cav_types(cav_type_id),
  compatible_molds text,
  length_mm numeric,
  width_mm numeric,
  height_mm numeric,
  
  -- Sở hữu & Vị trí
  owner_company_id uuid REFERENCES public.companies(company_id),
  keeper_company_id uuid REFERENCES public.companies(company_id),
  current_rack_layer_id uuid REFERENCES public.rack_layers(id),
  
  -- Trạng thái
  device_status text DEFAULT 'NORMAL',
  usage_status text DEFAULT 'ACTIVE',
  manufacturing_date date,
  disposed_date date,
  
  -- QR & Tracking
  qr_uuid uuid DEFAULT gen_random_uuid(),
  system_code text,
  
  -- Metadata
  notes text,
  legacy_product_id uuid REFERENCES public.products(product_id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index cho hiệu suất query
CREATE INDEX IF NOT EXISTS idx_auxiliary_equipments_item_type_id ON public.auxiliary_equipments(item_type_id);
CREATE INDEX IF NOT EXISTS idx_auxiliary_equipments_cav_type_id ON public.auxiliary_equipments(cav_type_id);
CREATE INDEX IF NOT EXISTS idx_auxiliary_equipments_keeper_company_id ON public.auxiliary_equipments(keeper_company_id);

-- Enable RLS
ALTER TABLE public.auxiliary_equipments ENABLE ROW LEVEL SECURITY;

-- Tạo Policies (Cho phép đọc/ghi dựa trên authenticated user, theo chuẩn dự án)
CREATE POLICY "Cho phép tất cả đọc auxiliary_equipments"
  ON public.auxiliary_equipments FOR SELECT
  USING (true);

CREATE POLICY "Cho phép authenticated insert auxiliary_equipments"
  ON public.auxiliary_equipments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cho phép authenticated update auxiliary_equipments"
  ON public.auxiliary_equipments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cho phép authenticated delete auxiliary_equipments"
  ON public.auxiliary_equipments FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trigger cập nhật updated_at
CREATE TRIGGER update_auxiliary_equipments_updated_at
  BEFORE UPDATE ON public.auxiliary_equipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
