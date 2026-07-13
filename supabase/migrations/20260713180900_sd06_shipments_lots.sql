-- ============================================================
-- SD-06: Extend Shipments & Production Lots
-- File: 20260713_sd06_shipments_lots.sql
-- ============================================================

-- 1. Mở rộng production_lots: thêm liên kết Physical Mold
--    và LOT NO tách biệt cho truy xuất nguồn gốc
ALTER TABLE production_lots
  ADD COLUMN IF NOT EXISTS lot_no          TEXT NULL,
  ADD COLUMN IF NOT EXISTS physical_mold_id TEXT NULL
    REFERENCES physical_molds(physical_mold_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS good_qty        INTEGER NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS defective_qty   INTEGER NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ng_reason       TEXT NULL;

COMMENT ON COLUMN production_lots.lot_no
  IS 'SD-06: LOT NO tách biệt cho truy xuất nguồn gốc & in phiếu giao hàng';
COMMENT ON COLUMN production_lots.physical_mold_id
  IS 'SD-06: Liên kết Lot → Khuôn vật lý (SMK yêu cầu in Mold No trên phiếu)';
COMMENT ON COLUMN production_lots.good_qty
  IS 'SD-06: Số lượng hàng đạt (Good Qty)';
COMMENT ON COLUMN production_lots.defective_qty
  IS 'SD-06: Số lượng hàng lỗi (NG Qty) — Delivered = Good + Defective';

-- 2. Mở rộng shipments: hỗ trợ Non-Physical Deliverables
--    và template tài liệu theo từng khách hàng
ALTER TABLE shipments
  ADD COLUMN IF NOT EXISTS shipment_type   TEXT NULL DEFAULT 'physical'
    CHECK (shipment_type IN ('physical', 'service', 'mixed')),
  ADD COLUMN IF NOT EXISTS service_desc    TEXT NULL,
  ADD COLUMN IF NOT EXISTS document_template TEXT NULL
    CHECK (document_template IN ('standard', 'smk', 'kyd', 'mitsubishi', NULL));

COMMENT ON COLUMN shipments.shipment_type
  IS 'SD-06: physical=khay nhựa | service=phí 3D/lưu kho/hủy khuôn | mixed';
COMMENT ON COLUMN shipments.document_template
  IS 'SD-06: Template phiếu giao hàng theo khách (SMK 指定納品書, KYD...)';

-- 3. Bảng mới: shipment_required_docs
--    Quản lý giấy tờ bắt buộc đi theo từng lô giao hàng
--    (KYD: 試験成績書 | SMK: 量産検査表)
CREATE TABLE IF NOT EXISTS shipment_required_docs (
  doc_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id     TEXT NOT NULL
    REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  doc_type        TEXT NOT NULL
    CHECK (doc_type IN (
      'inspection_cert',    -- 試験成績書 (KYD)
      'mass_prod_check',    -- 量産検査表 (SMK)
      'delivery_note',      -- 標準納品書
      'other'
    )),
  doc_label       TEXT NULL,        -- Tên tài liệu tùy chỉnh
  is_attached     BOOLEAN DEFAULT false,
  file_path       TEXT NULL,
  required_by     TEXT NULL REFERENCES companies(company_id) ON DELETE SET NULL, -- company_id của khách hàng yêu cầu
  created_at      TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE shipment_required_docs
  IS 'SD-06: Giấy tờ bắt buộc đi kèm lô giao hàng theo yêu cầu từng khách hàng';
