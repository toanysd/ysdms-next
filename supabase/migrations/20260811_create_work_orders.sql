-- ═══════════════════════════════════════════════════════
-- PHASE 1.1: Tạo bảng work_orders & liên kết jobs
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS work_orders (
  wo_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wo_code            TEXT UNIQUE NOT NULL,          -- 'WO-2026-000001'
  wo_name            TEXT NOT NULL,                  -- 'Chế tạo bộ khuôn ABY-123'
  
  -- Context links
  product_id         UUID REFERENCES products(product_id),
  design_revision_id UUID REFERENCES design_revisions(revision_id),
  order_id           UUID REFERENCES orders(order_id),
  company_id         UUID REFERENCES companies(company_id),
  case_id            UUID REFERENCES business_cases(id),
  
  -- Classification
  wo_type            TEXT NOT NULL DEFAULT 'NEW_SET',  
  -- Enum values: 'NEW_SET' | 'REPAIR' | 'REMAKE' | 'MODIFICATION' | 'OTHER'
  
  wo_status          TEXT NOT NULL DEFAULT 'PLANNED',
  -- Enum values: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  
  -- Schedule
  start_date         TIMESTAMPTZ,
  deadline           TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  
  -- Assignment
  responsible_id     UUID REFERENCES employees(employee_id),
  priority           INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  
  -- Metadata
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now(),
  created_by         UUID REFERENCES employees(employee_id)
);

-- Index cho query performance
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(wo_status);
CREATE INDEX IF NOT EXISTS idx_work_orders_deadline ON work_orders(deadline);
CREATE INDEX IF NOT EXISTS idx_work_orders_product ON work_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_company ON work_orders(company_id);

-- ═══════════════════════════════════════════════════════
-- PHASE 1.2: Thêm work_order_id vào jobs
-- ═══════════════════════════════════════════════════════

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_order_id UUID REFERENCES work_orders(wo_id);
CREATE INDEX IF NOT EXISTS idx_jobs_work_order ON jobs(work_order_id);

-- ═══════════════════════════════════════════════════════
-- PHASE 1.3: Trigger tự động cập nhật updated_at
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_work_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_work_orders_updated_at ON work_orders;
CREATE TRIGGER trg_work_orders_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_work_orders_updated_at();

-- ═══════════════════════════════════════════════════════
-- PHASE 1.4: Function tự sinh mã WO
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_wo_code()
RETURNS TEXT AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM now());
  next_seq INTEGER;
  new_code TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(wo_code FROM 'WO-\d{4}-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM work_orders
  WHERE wo_code LIKE 'WO-' || current_year || '-%';
  
  new_code := 'WO-' || current_year || '-' || LPAD(next_seq::TEXT, 6, '0');
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
