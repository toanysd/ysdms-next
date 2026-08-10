-- =================================================================================
-- Migration 055: Expand Master Tables for Full Access Compatibility (MoldCutterSearch)
-- =================================================================================

-- 1. MOLD BASE (tblMoldMaster)
ALTER TABLE public.mold_base
  ADD COLUMN IF NOT EXISTS mold_class TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. MOLD DESIGN REVISION (tblMoldDesign)
ALTER TABLE public.mold_design_revision
  ADD COLUMN IF NOT EXISTS cutline_x NUMERIC,
  ADD COLUMN IF NOT EXISTS cutline_y NUMERIC,
  ADD COLUMN IF NOT EXISTS corner_r TEXT,
  ADD COLUMN IF NOT EXISTS chamfer_c TEXT,
  ADD COLUMN IF NOT EXISTS pocket_numbers INTEGER,
  ADD COLUMN IF NOT EXISTS pitch NUMERIC,
  ADD COLUMN IF NOT EXISTS under_depth NUMERIC,
  ADD COLUMN IF NOT EXISTS under_angle TEXT,
  ADD COLUMN IF NOT EXISTS draft_angle TEXT,
  ADD COLUMN IF NOT EXISTS mold_orientation TEXT,
  ADD COLUMN IF NOT EXISTS mold_setup_type TEXT,
  ADD COLUMN IF NOT EXISTS separate_cutter BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS customer_drawing_no TEXT,
  ADD COLUMN IF NOT EXISTS customer_equipment_no TEXT,
  ADD COLUMN IF NOT EXISTS plug BOOLEAN DEFAULT false,
  -- Bổ sung thông tin Khay/Sản phẩm liên kết trực tiếp:
  ADD COLUMN IF NOT EXISTS customer_tray_name TEXT,
  ADD COLUMN IF NOT EXISTS tray_info TEXT,
  ADD COLUMN IF NOT EXISTS legacy_tray_id INTEGER,
  -- Bổ sung các trường thiết kế chi tiết:
  ADD COLUMN IF NOT EXISTS design_length NUMERIC,
  ADD COLUMN IF NOT EXISTS design_width NUMERIC,
  ADD COLUMN IF NOT EXISTS design_height NUMERIC,
  ADD COLUMN IF NOT EXISTS design_depth NUMERIC,
  ADD COLUMN IF NOT EXISTS design_weight NUMERIC,
  ADD COLUMN IF NOT EXISTS piece_count INTEGER,
  ADD COLUMN IF NOT EXISTS cavid TEXT,
  ADD COLUMN IF NOT EXISTS data_input TEXT,
  ADD COLUMN IF NOT EXISTS text_content TEXT,
  ADD COLUMN IF NOT EXISTS version_note TEXT,
  ADD COLUMN IF NOT EXISTS design_for_plastic_type TEXT;

-- 3. MOLD PHYSICAL (tblMold)
ALTER TABLE public.mold_physical
  ADD COLUMN IF NOT EXISTS keeper_company TEXT,
  ADD COLUMN IF NOT EXISTS modified_length NUMERIC,
  ADD COLUMN IF NOT EXISTS modified_width NUMERIC,
  ADD COLUMN IF NOT EXISTS modified_height NUMERIC,
  ADD COLUMN IF NOT EXISTS actual_weight NUMERIC,
  ADD COLUMN IF NOT EXISTS usage_status TEXT,
  ADD COLUMN IF NOT EXISTS device_status TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. CUTTER MASTER (tblCutterMaster + tblCutter)
ALTER TABLE public.cutter_master
  ADD COLUMN IF NOT EXISTS cutter_no TEXT,
  ADD COLUMN IF NOT EXISTS cutter_name TEXT,
  ADD COLUMN IF NOT EXISTS cutter_note TEXT,
  ADD COLUMN IF NOT EXISTS usage_status TEXT,
  ADD COLUMN IF NOT EXISTS mold_shared BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS blade_count INTEGER,
  ADD COLUMN IF NOT EXISTS pitch NUMERIC,
  ADD COLUMN IF NOT EXISTS plastic_cut_type TEXT,
  ADD COLUMN IF NOT EXISTS post_cut_length NUMERIC,
  ADD COLUMN IF NOT EXISTS post_cut_width NUMERIC,
  ADD COLUMN IF NOT EXISTS cutline_length NUMERIC,
  ADD COLUMN IF NOT EXISTS cutline_width NUMERIC,
  ADD COLUMN IF NOT EXISTS cutter_length NUMERIC,
  ADD COLUMN IF NOT EXISTS cutter_width NUMERIC,
  ADD COLUMN IF NOT EXISTS cutter_height NUMERIC,
  ADD COLUMN IF NOT EXISTS cutter_thickness NUMERIC,
  ADD COLUMN IF NOT EXISTS cutter_corner TEXT,
  ADD COLUMN IF NOT EXISTS cutter_chamfer TEXT,
  ADD COLUMN IF NOT EXISTS cutter_type TEXT,
  ADD COLUMN IF NOT EXISTS cutter_dim TEXT,
  ADD COLUMN IF NOT EXISTS pp_cushion_use TEXT;

-- 5. PRODUCT MASTER (tblTray)
ALTER TABLE public.product_master
  ADD COLUMN IF NOT EXISTS internal_product_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_product_name TEXT;
