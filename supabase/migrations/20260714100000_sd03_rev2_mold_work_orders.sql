-- ============================================================
-- Migration: 20260714100000_sd03_rev2_mold_work_orders.sql
-- SD-03 Rev 2: Tách luồng Chỉ thị Khuôn mới ra khỏi production_orders
-- Fixes: order_lines(line_id), employees thay profiles
-- PO Approved: Thoan — 2026-07-14
-- ============================================================

-- BƯỚC 1: Dọn dẹp các cột khuôn đã nhầm sang production_orders
ALTER TABLE production_orders
  DROP COLUMN IF EXISTS cut_method,
  DROP COLUMN IF EXISTS instruction_notes,
  DROP COLUMN IF EXISTS instruction_status;

-- BƯỚC 2: Tạo bảng mold_work_orders (新規金型製造工程票)
CREATE TABLE IF NOT EXISTS mold_work_orders (
  mwo_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mwo_code            TEXT UNIQUE NOT NULL,

  -- FK 2 chân
  physical_mold_id    UUID NOT NULL REFERENCES physical_molds(physical_mold_id) ON DELETE RESTRICT,
  order_line_id       UUID NULL     REFERENCES order_lines(line_id)             ON DELETE SET NULL,

  -- Thông tin kỹ thuật khuôn
  material_type       TEXT,
  sheet_width_mm      NUMERIC(6,1),
  mold_size_x_mm      NUMERIC(7,1),
  mold_size_y_mm      NUMERIC(7,1),
  product_size_x_mm   NUMERIC(7,1),
  product_size_y_mm   NUMERIC(7,1),
  cavities            SMALLINT,
  sample_count        INT,

  -- Thiết bị đi kèm
  plug_exists         BOOLEAN DEFAULT FALSE,
  cut_method          TEXT,
  water_cooling_type  TEXT,
  frame_type          TEXT,

  -- Ngày mốc 手配
  req_material_date   DATE,
  req_plug_date       DATE,
  req_cutter_date     DATE,

  -- Ngày mốc 金型製造
  req_mold_date       DATE,
  mold_shop_type      TEXT DEFAULT 'internal'
    CHECK (mold_shop_type IN ('internal','external')),

  -- Ngày mốc 成形
  req_molding_date    DATE,
  shipping_date       DATE,
  molding_shop_type   TEXT DEFAULT 'internal'
    CHECK (molding_shop_type IN ('internal','external')),

  -- Approval chain 担当者終了印
  approved_procurement  BOOLEAN NOT NULL DEFAULT FALSE,
  approved_mold_shop    BOOLEAN NOT NULL DEFAULT FALSE,
  approved_molding_shop BOOLEAN NOT NULL DEFAULT FALSE,

  -- Meta
  instruction_notes   TEXT,
  mwo_status          TEXT NOT NULL DEFAULT 'draft'
    CHECK (mwo_status IN ('draft','in_progress','mold_done','completed')),

  -- ✅ FIX #2: dùng employees thay vì profiles
  created_by          UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BƯỚC 3: Indexes
CREATE INDEX IF NOT EXISTS idx_mwo_physical_mold ON mold_work_orders(physical_mold_id);
CREATE INDEX IF NOT EXISTS idx_mwo_order_line    ON mold_work_orders(order_line_id);
CREATE INDEX IF NOT EXISTS idx_mwo_status        ON mold_work_orders(mwo_status);

-- BƯỚC 4: RLS
ALTER TABLE mold_work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_mwo"  ON mold_work_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_mwo" ON mold_work_orders
  FOR ALL USING (auth.role() = 'authenticated');

-- BƯỚC 5: Comments
COMMENT ON TABLE  mold_work_orders IS 'SD-03 Rev2: 新規金型製造工程票 — Chỉ thị làm khuôn mới. Tạo thủ công.';
COMMENT ON COLUMN mold_work_orders.order_line_id IS 'NULLABLE: FK → order_lines(line_id). NULL nếu làm khuôn cải tiến không có đơn hàng đi kèm.';
COMMENT ON COLUMN mold_work_orders.mwo_status IS 'draft → in_progress → mold_done → completed';
