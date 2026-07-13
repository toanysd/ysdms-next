-- ============================================================
-- SD-08: Extend QC / Inspections
-- File: 20260714090000_sd08_extend_inspections.sql
-- ============================================================

-- 1. Mở rộng bảng inspections: thêm QC Split + Lot link
ALTER TABLE inspections
  ADD COLUMN IF NOT EXISTS production_lot_id  UUID NULL
    REFERENCES production_lots(lot_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS inspected_qty      INTEGER NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS good_qty           INTEGER NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ng_qty             INTEGER NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ng_category        TEXT NULL
    CHECK (ng_category IN (
      'dimension',      -- Lỗi kích thước
      'appearance',     -- Lỗi ngoại quan
      'material',       -- Lỗi vật liệu
      'packaging',      -- Lỗi đóng gói
      'other'
    )),
  ADD COLUMN IF NOT EXISTS inspection_stage   TEXT NULL DEFAULT 'in_process'
    CHECK (inspection_stage IN (
      'in_process',     -- Kiểm tra trong quá trình SX
      'final',          -- Kiểm tra thành phẩm trước giao hàng
      'incoming'        -- Kiểm tra đầu vào (入検)
    ));

COMMENT ON COLUMN inspections.production_lot_id
  IS 'SD-08: Liên kết Inspection → Production Lot (hoàn thiện chuỗi truy xuất)';
COMMENT ON COLUMN inspections.good_qty
  IS 'SD-08: Số lượng đạt — inspected_qty = good_qty + ng_qty';
COMMENT ON COLUMN inspections.ng_qty
  IS 'SD-08: Số lượng lỗi (NG)';
COMMENT ON COLUMN inspections.ng_category
  IS 'SD-08: Phân loại lỗi có cấu trúc — nguồn dữ liệu cho báo cáo QC trend';
COMMENT ON COLUMN inspections.inspection_stage
  IS 'SD-08: in_process | final | incoming (入検用 map với sample_type=QC_INSPECT)';

-- 2. Bảng ng_detail_logs: Chi tiết từng lỗi NG (1 inspection → nhiều lỗi)
CREATE TABLE IF NOT EXISTS ng_detail_logs (
  ng_log_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id   UUID NOT NULL
    REFERENCES inspections(inspection_id) ON DELETE CASCADE,
  ng_category     TEXT NOT NULL
    CHECK (ng_category IN ('dimension','appearance','material','packaging','other')),
  ng_description  TEXT NULL,          -- Mô tả lỗi tự do
  ng_qty          INTEGER NOT NULL DEFAULT 1,
  photo_path      TEXT NULL,          -- Đường dẫn ảnh lỗi
  created_at      TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE ng_detail_logs
  IS 'SD-08: Chi tiết từng lỗi NG — 1 inspection có thể có nhiều loại lỗi';
