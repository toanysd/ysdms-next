-- Migration for BP-32: Production Instructions and Delivery Sites

-- 1. delivery_sites (Already exists, alter to add missing columns)
ALTER TABLE delivery_sites 
  ADD COLUMN IF NOT EXISTS requester_name TEXT,
  ADD COLUMN IF NOT EXISTS is_placeholder BOOLEAN DEFAULT false;

-- 2. production_instructions
CREATE TABLE IF NOT EXISTS production_instructions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_no        TEXT UNIQUE NOT NULL,  -- 伝票No. tự sinh: "PI-2026-001234"
  order_id              UUID REFERENCES orders(order_id),
  product_id            UUID REFERENCES products(product_id),
  physical_mold_id      UUID REFERENCES physical_molds(physical_mold_id),

  -- Thông tin sản xuất
  -- Sprint 1: chềEdùng 'FORMING'. 'OUTSOURCE' đềESprint 2
  instruction_type      TEXT NOT NULL DEFAULT 'FORMING'
                          CHECK (instruction_type IN ('FORMING', 'OUTSOURCE')),
  production_site       TEXT,  -- 本社 / 青森 / 茨埁E/ 坂田
  quantity_ordered      INTEGER NOT NULL,
  quantity_per_stack    INTEGER,  -- 入数

  -- Vật liệu (tự điền từ products table)
  material_spec         TEXT,     -- VD: PS(N)0.58tÁE40ÁE50m
  material_thickness    NUMERIC(4,2),
  material_width        INTEGER,
  antistatic            BOOLEAN DEFAULT false,
  silicon               BOOLEAN DEFAULT false,
  surface_coating       BOOLEAN DEFAULT false,
  recycled_pct          NUMERIC(5,2) DEFAULT 0,

  -- Giao hàng
  delivery_site_id      UUID REFERENCES delivery_sites(site_id),
  requested_date        DATE NOT NULL,
  lot_no                TEXT,

  -- Template
  template_type         TEXT NOT NULL
                          CHECK (template_type IN ('HAE','NLC','SMK','YAE','GENERAL')),
  has_label             BOOLEAN DEFAULT false,  -- ラベル
  is_first_time         BOOLEAN DEFAULT false,  -- 初回

  -- Cảnh báo tồn kho (Sprint 1: chềElưu trạng thái cảnh báo, KHÔNG trừ kho)
  material_stock_warning BOOLEAN DEFAULT false,  -- true = đã cảnh báo thiếu khi tạo
  material_stock_qty     INTEGER,  -- Tồn kho tại thời điểm tạo (snapshot)

  -- Trạng thái
  status                TEXT NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN ('DRAFT','ISSUED','IN_PRODUCTION','COMPLETED','CANCELLED')),
  issued_at             TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  notes                 TEXT,

  created_by            UUID,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE production_instructions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "production_instructions_select" ON production_instructions; CREATE POLICY "production_instructions_select" ON production_instructions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "production_instructions_insert" ON production_instructions; CREATE POLICY "production_instructions_insert" ON production_instructions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "production_instructions_update" ON production_instructions; CREATE POLICY "production_instructions_update" ON production_instructions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "production_instructions_delete" ON production_instructions; CREATE POLICY "production_instructions_delete" ON production_instructions FOR DELETE TO authenticated USING (true);

-- Trigger updated_at
DROP TRIGGER IF EXISTS set_updated_at_production_instructions ON production_instructions; CREATE TRIGGER set_updated_at_production_instructions
  BEFORE UPDATE ON production_instructions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
