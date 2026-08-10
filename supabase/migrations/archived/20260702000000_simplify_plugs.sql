-- Migration: Simplify Plugs
-- Xóa bảng plugs dư thừa
DROP TABLE IF EXISTS public.plugs CASCADE;

-- Cập nhật bảng design_revisions
ALTER TABLE public.design_revisions
  DROP COLUMN IF EXISTS has_plug,
  ADD COLUMN plug_type TEXT DEFAULT 'NONE' CHECK (plug_type IN ('NONE', 'OWNED', 'SHARED')),
  ADD COLUMN shared_plug_from_design_id UUID REFERENCES public.design_revisions(revision_id);

-- Thêm cột Ngày sản xuất khuôn vào bảng physical_molds
ALTER TABLE public.physical_molds
  ADD COLUMN manufacturing_date DATE;
