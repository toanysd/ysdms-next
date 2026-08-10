-- Migration: Create unified Equipment management tables
-- Date: 2026-07-31
-- Tables created: equipment, equipment_history, equipment_assignments
-- Columns added to jobs: job_category, equipment_id, case_id

-- 1. TABLE: equipment
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_code       TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL,
  equipment_type       TEXT NOT NULL,
  sub_type             TEXT,
  physical_stamp       TEXT,
  dimensions           TEXT,
  actual_length_mm     TEXT,
  actual_width_mm      TEXT,
  actual_height_mm     TEXT,
  actual_weight        TEXT,
  material_spec        TEXT,
  piece_count          INTEGER,
  copy_number          INTEGER,
  company_id           UUID REFERENCES companies(company_id),
  keeper_company_id    UUID REFERENCES companies(company_id),
  design_revision_id   UUID REFERENCES design_revisions(revision_id),
  cav_type_id          UUID REFERENCES cav_types(cav_type_id),
  mold_master_id       UUID,  -- No FK: mold_masters was DROPped
  mold_revision_id     UUID REFERENCES mold_revisions(revision_id),
  current_rack_layer_id UUID REFERENCES rack_layers(id),
  device_status        TEXT DEFAULT 'NORMAL',
  usage_status         TEXT DEFAULT 'STORAGE',
  on_checklist         BOOLEAN DEFAULT FALSE,
  mold_type            TEXT,
  manufacturing_date   DATE,
  entry_date           DATE,
  returned_date        DATE,
  disposed_date        DATE,
  qr_uuid              UUID DEFAULT gen_random_uuid(),
  legacy_physical_mold_id UUID,
  legacy_cutter_id     UUID,
  legacy_id            TEXT,
  legacy_specs         JSONB,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now(),
  updated_by           UUID REFERENCES employees(employee_id)
);

CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_equipment_company ON equipment(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(usage_status);
CREATE INDEX IF NOT EXISTS idx_equipment_rack ON equipment(current_rack_layer_id);
CREATE INDEX IF NOT EXISTS idx_equipment_code ON equipment(equipment_code);

-- 2. TABLE: equipment_history
CREATE TABLE IF NOT EXISTS equipment_history (
  history_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id         UUID NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
  action_type          TEXT NOT NULL,
  action_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  from_location        TEXT,
  to_location          TEXT,
  from_company_id      UUID REFERENCES companies(company_id),
  to_company_id        UUID REFERENCES companies(company_id),
  job_id               UUID REFERENCES jobs(job_id),
  description          TEXT,
  performed_by         UUID REFERENCES employees(employee_id),
  created_at           TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_equip_history_equipment ON equipment_history(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equip_history_date ON equipment_history(action_date);
CREATE INDEX IF NOT EXISTS idx_equip_history_action ON equipment_history(action_type);

-- 3. TABLE: equipment_assignments (N:N relationship)
CREATE TABLE IF NOT EXISTS equipment_assignments (
  assignment_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_equipment_id UUID NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
  related_equipment_id UUID NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
  relationship_type    TEXT NOT NULL DEFAULT 'SET_MEMBER',
  is_default           BOOLEAN DEFAULT TRUE,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_equipment_pair UNIQUE (primary_equipment_id, related_equipment_id),
  CONSTRAINT chk_no_self_ref CHECK (primary_equipment_id <> related_equipment_id)
);

CREATE INDEX IF NOT EXISTS idx_equip_assign_primary ON equipment_assignments(primary_equipment_id);
CREATE INDEX IF NOT EXISTS idx_equip_assign_related ON equipment_assignments(related_equipment_id);
CREATE INDEX IF NOT EXISTS idx_equip_assign_type ON equipment_assignments(relationship_type);

-- 4. ALTER jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_category TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES equipment(equipment_id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES business_cases(id);

CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(job_category);
CREATE INDEX IF NOT EXISTS idx_jobs_equipment ON jobs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_jobs_case ON jobs(case_id);

-- 5. RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_read_eq ON equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_eq ON equipment FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_eq ON equipment FOR UPDATE TO authenticated USING (true);
CREATE POLICY p_del_eq ON equipment FOR DELETE TO authenticated USING (true);

CREATE POLICY p_read_eh ON equipment_history FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_eh ON equipment_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_eh ON equipment_history FOR UPDATE TO authenticated USING (true);

CREATE POLICY p_read_ea ON equipment_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_ea ON equipment_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_ea ON equipment_assignments FOR UPDATE TO authenticated USING (true);
CREATE POLICY p_del_ea ON equipment_assignments FOR DELETE TO authenticated USING (true);
