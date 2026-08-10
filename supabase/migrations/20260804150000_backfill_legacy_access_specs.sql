-- ============================================================================
-- MIGRATION: 20260804150000_backfill_legacy_access_specs.sql
-- PURPOSE: Backfill legacy MS Access design specifications (CutLine, MoldOrientation, 
--          SetupType, Undercut Depth, Corner R, Chamfer C, Pocket Numbers) into 
--          design_revisions table.
--
-- BUSINESS TERMINOLOGY DEFINITIONS:
-- 1. pocket_numbers (Integer) = Pocket count (ポケット数量 / Số lượng ô đặt sản phẩm trên 1 khuôn).
--    EXAMPLE: 56 Pocket for JAE-352A tray.
-- 2. cavity_count (Integer)   = Cavity count (面数 / Số khuôn/mặt trên 1 thiết kế).
--    EXAMPLE: 1-cavity mold vs 2-cavity mold.
-- 3. cutline_length & cutline_width = CutLine dimensions L x W (mm) (Kích thước đường cắt).
-- 4. orientation              = MoldOrientation (方向) -> '1. 普通' (Normal).
-- 5. setup_type               = SetupType (金型固定) -> '1. 下型' (Bottom Mold).
-- 6. under_depth              = Undercut depth in mm (アンダー深さ).
-- 7. corner_r & chamfer_c     = Corner Radius R (mm) & Chamfer C (mm).
-- ============================================================================

-- Add descriptive column comments for future developers
COMMENT ON COLUMN public.design_revisions.pocket_numbers IS 'Number of product pockets per tray/mold (ポケット数量). NOT cavity count.';
COMMENT ON COLUMN public.design_revisions.cavity_count IS 'Number of mold cavities/faces per design (面数 / Cavity count).';
COMMENT ON COLUMN public.design_revisions.cutline_length IS 'Separate cutter cutline length in mm (CutLine L).';
COMMENT ON COLUMN public.design_revisions.cutline_width IS 'Separate cutter cutline width in mm (CutLine W).';
COMMENT ON COLUMN public.design_revisions.orientation IS 'Mold mounting orientation (MoldOrientation / 方向 e.g. 1. 普通).';
COMMENT ON COLUMN public.design_revisions.setup_type IS 'Mold setup type (SetupType / 金型固定 e.g. 1. 下型).';
COMMENT ON COLUMN public.design_revisions.under_depth IS 'Undercut depth in mm (アンダー深さ).';

-- ----------------------------------------------------------------------------
-- BACKFILL RECORD: JAE352A (Access MoldDesignID 4461 / TrayID 4168)
-- ----------------------------------------------------------------------------
UPDATE public.design_revisions
SET 
  cutline_length = 510,
  cutline_width = 270,
  orientation = '1. 普通',
  setup_type = '1. 下型',
  under_depth = 11.5,
  corner_r = '21',
  chamfer_c = '0',
  has_separate_cutter = true,
  pocket_numbers = 56
WHERE design_code = 'JAE352A' OR legacy_id = 'DESIGN-4460';

-- ----------------------------------------------------------------------------
-- BACKFILL RECORD: JAE352B (Access MoldDesignID 4461 / TrayID 4168)
-- ----------------------------------------------------------------------------
UPDATE public.design_revisions
SET 
  cutline_length = 510,
  cutline_width = 270,
  orientation = '1. 普通',
  setup_type = '1. 下型',
  under_depth = 11.5,
  corner_r = '21',
  chamfer_c = '0',
  has_separate_cutter = true,
  pocket_numbers = 56
WHERE design_code = 'JAE352B' OR legacy_id = 'DESIGN-4461';

-- ----------------------------------------------------------------------------
-- BACKFILL RECORD: CHG009AB (Access MoldDesignID 4836)
-- ----------------------------------------------------------------------------
UPDATE public.design_revisions
SET 
  pocket_numbers = 15,
  draft_angle = '15.0'
WHERE design_code = 'CHG009AB' OR legacy_id = 'DESIGN-4836';
