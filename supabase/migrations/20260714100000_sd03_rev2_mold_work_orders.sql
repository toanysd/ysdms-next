-- ============================================================
-- Migration: 20260714100000_sd03_rev2_mold_work_orders.sql
-- SD-03 Rev 2: Tách luồng Chỉ thị Khuôn mới ra khỏi production_orders
-- PO Approved: Thoan — 2026-07-14
-- ============================================================

-- BƯỚC 1: Dọn dẹp production_orders (các cột thuộc về khuôn, không thuộc khay)
ALTER TABLE production_orders
  DROP COLUMN IF EXISTS cut_method,
  DROP COLUMN IF EXISTS instruction_notes,
  DROP COLUMN IF EXISTS instruction_status,
  DROP COLUMN IF EXISTS bom_reference_mold_id,
  DROP COLUMN IF EXISTS req_mold_date,
  DROP COLUMN IF EXISTS req_molding_date,
  DROP COLUMN IF EXISTS approved_by_mold_shop,
  DROP COLUMN IF EXISTS approved_by_molding_shop;

-- BƯỚC 2: Tạo bảng mold_work_orders (新規金型製造工程票)
CREATE TABLE IF NOT EXISTS mold_work_orders (
  mwo_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mwo_code            TEXT UNIQUE NOT NULL,

  -- Liên kết 2 chân
  physical_mold_id    UUID NOT NULL REFERENCES physical_molds(physical_mold_id) ON DELETE RESTRICT,
  order_line_id       UUID NULL     REFERENCES order_lines(line_id)       ON DELETE SET NULL,

  -- Thông tin kỹ thuật khuôn (phần trên form 工程票)
  material_type       TEXT,                        -- 材質 (PS(N), PP, ...)
  sheet_width_mm      NUMERIC(6,1),                -- シート巾
  mold_size_x_mm      NUMERIC(7,1),                -- 型寸法 X
  mold_size_y_mm      NUMERIC(7,1),                -- 型寸法 Y
  product_size_x_mm   NUMERIC(7,1),                -- 製品寸法 X
  product_size_y_mm   NUMERIC(7,1),                -- 製品寸法 Y
  cavities            SMALLINT,                    -- 取数
  sample_count        INT,                         -- 出荷サンプル数

  -- Thiết bị đi kèm
  plug_exists         BOOLEAN DEFAULT FALSE,       -- プラグ: 有/無
  cut_method          TEXT,                        -- カッター: 新規/既存/NULL
  water_cooling_type  TEXT,                        -- 水冷盤: 新規/既存
  frame_type          TEXT,                        -- 枠: 新規/既存

  -- Ngày mốc (手配 section)
  req_material_date   DATE,                        -- アルミ材納期
  req_plug_date       DATE,                        -- プラグ納期
  req_cutter_date     DATE,                        -- カッター納期

  -- Ngày mốc sản xuất khuôn (金型製造 section)
  req_mold_date       DATE,                        -- 本型納期
  mold_shop_type      TEXT DEFAULT 'internal'
    CHECK (mold_shop_type IN ('internal','external')), -- 社内/外注

  -- Ngày mốc định hình (成形 section)
  req_molding_date    DATE,                        -- 出荷納期 (thành phẩm)
  shipping_date       DATE,                        -- 出荷納期 (giao khách)
  molding_shop_type   TEXT DEFAULT 'internal'
    CHECK (molding_shop_type IN ('internal','external')),

  -- Approval chain (担当者終了印)
  approved_procurement  BOOLEAN NOT NULL DEFAULT FALSE, -- 手配完了
  approved_mold_shop    BOOLEAN NOT NULL DEFAULT FALSE, -- 金型完了
  approved_molding_shop BOOLEAN NOT NULL DEFAULT FALSE, -- 成形完了

  -- Thông tin bổ sung
  instruction_notes   TEXT,
  mwo_status          TEXT NOT NULL DEFAULT 'draft'
    CHECK (mwo_status IN ('draft','in_progress','mold_done','completed')),

  -- Metadata
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BƯỚC 3: Indexes
CREATE INDEX IF NOT EXISTS idx_mwo_physical_mold  ON mold_work_orders(physical_mold_id);
CREATE INDEX IF NOT EXISTS idx_mwo_order_line      ON mold_work_orders(order_line_id);
CREATE INDEX IF NOT EXISTS idx_mwo_status          ON mold_work_orders(mwo_status);

-- BƯỚC 4: RLS
ALTER TABLE mold_work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_mwo"  ON mold_work_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_mwo" ON mold_work_orders
  FOR ALL USING (auth.role() = 'authenticated');

-- BƯỚC 5: Comments
COMMENT ON TABLE  mold_work_orders IS 'SD-03 Rev2: 新規金型製造工程票 — Chỉ thị làm khuôn mới. Tạo thủ công. Tách biệt hoàn toàn với production_orders (注文書).';
COMMENT ON COLUMN mold_work_orders.order_line_id IS 'NULLABLE: Khuôn mới phục vụ cho order_line nào. NULL nếu làm khuôn cải tiến không có đơn hàng đi kèm.';
COMMENT ON COLUMN mold_work_orders.mwo_status IS 'draft → in_progress → mold_done → completed';
