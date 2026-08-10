-- Migration: Drop redundant mold_revisions table and FK columns
-- Date: 2026-08-05

ALTER TABLE IF EXISTS equipment DROP COLUMN IF EXISTS mold_revision_id;
ALTER TABLE IF EXISTS physical_molds DROP COLUMN IF EXISTS mold_revision_id;
ALTER TABLE IF EXISTS jobs DROP COLUMN IF EXISTS mold_revision_id;
DROP TABLE IF EXISTS mold_revisions CASCADE;
