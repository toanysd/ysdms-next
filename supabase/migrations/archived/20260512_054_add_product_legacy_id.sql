-- =================================================================================
-- Migration 054: Add legacy_id to product_master
-- =================================================================================

ALTER TABLE public.product_master ADD COLUMN IF NOT EXISTS legacy_id INTEGER UNIQUE;
