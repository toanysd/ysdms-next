-- Cleanup: Xóa TOÀN BỘ data để re-import sạch
-- Thứ tự xóa: con trước, cha sau (tránh FK violation)
BEGIN;
DELETE FROM rack_layers;
DELETE FROM racks;
DELETE FROM employees WHERE legacy_id IS NOT NULL;
DELETE FROM companies WHERE legacy_id IS NOT NULL;
COMMIT;
