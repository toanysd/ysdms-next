-- Migration: Extend physical_molds for photo evidence and inventory date tracking
-- Based on real business workflows analysis (10_email_derived_business_workflows.md)
-- Date: 2026-07-09

-- 1. Add photo_url to physical_molds (Hình ảnh hiện trạng khuôn)
ALTER TABLE physical_molds ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Add last_inventory_date to physical_molds (Ngày kiểm kê gần nhất)
ALTER TABLE physical_molds ADD COLUMN IF NOT EXISTS last_inventory_date DATE;

-- Comments for documentation
COMMENT ON COLUMN physical_molds.photo_url IS 'URL hình ảnh hiện trạng khuôn (chụp ảnh thực tế)';
COMMENT ON COLUMN physical_molds.last_inventory_date IS 'Ngày kiểm kê khuôn gần nhất (kế hoạch SACT thực tế)';
