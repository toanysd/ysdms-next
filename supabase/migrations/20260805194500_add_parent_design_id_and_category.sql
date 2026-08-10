-- Migration: Add parent_design_id and design_category to design_revisions
-- Date: 2026-08-05

ALTER TABLE IF EXISTS design_revisions 
ADD COLUMN IF NOT EXISTS parent_design_id UUID REFERENCES design_revisions(revision_id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS design_category VARCHAR(30) DEFAULT 'MASS_PRODUCTION';

COMMENT ON COLUMN design_revisions.parent_design_id IS 'Points to prerequisite trial/prototype design revision';
COMMENT ON COLUMN design_revisions.design_category IS 'PROTOTYPE_POCKET (試作ポケット) or MASS_PRODUCTION (正規金型)';
