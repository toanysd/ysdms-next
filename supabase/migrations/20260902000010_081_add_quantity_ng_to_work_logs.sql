-- Migration 081: add_quantity_ng_to_work_logs
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS quantity_ng INTEGER NOT NULL DEFAULT 0;
COMMENT ON COLUMN work_logs.quantity_ng IS 'Số lượng NG (không đạt) ghi nhận trong work log này';
