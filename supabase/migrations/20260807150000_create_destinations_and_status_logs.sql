-- Migration: Add legacy_id to existing destinations, Create Status Logs and Ship Logs Tables
-- Date: 2026-08-07
-- Destinations table already exists — just add legacy_id column if missing

-- Add legacy_id to destinations if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'destinations' AND column_name = 'legacy_id'
  ) THEN
    ALTER TABLE destinations ADD COLUMN legacy_id INTEGER UNIQUE;
  END IF;
END $$;

-- Table: equipment_status_logs
CREATE TABLE IF NOT EXISTS equipment_status_logs (
    status_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('IN', 'OUT', 'DISPOSED', 'RETURNED', 'AUDIT')),
    action_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    employee_id UUID REFERENCES employees(employee_id),
    destination_id UUID REFERENCES destinations(destination_id),
    to_location TEXT,
    notes TEXT,
    legacy_mold_id INTEGER,
    legacy_cutter_id INTEGER,
    legacy_status_log_id INTEGER UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_equipment_status_logs_equipment_date ON equipment_status_logs (equipment_id, action_date DESC);

-- Table: equipment_ship_logs
CREATE TABLE IF NOT EXISTS equipment_ship_logs (
    ship_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(equipment_id) ON DELETE SET NULL,
    equipment_type TEXT,
    ship_item_name TEXT,
    ship_date DATE NOT NULL,
    from_company_id UUID REFERENCES companies(company_id),
    to_company_id UUID REFERENCES companies(company_id),
    employee_id UUID REFERENCES employees(employee_id),
    notes TEXT,
    legacy_ship_id INTEGER UNIQUE,
    legacy_mold_id INTEGER,
    legacy_cutter_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_equipment_ship_logs_equipment_date ON equipment_ship_logs (equipment_id, ship_date DESC);

-- RLS Policies (use IF NOT EXISTS pattern via DO block)

-- equipment_status_logs RLS
ALTER TABLE equipment_status_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_status_logs' AND policyname = 'Public read equipment_status_logs') THEN
    CREATE POLICY "Public read equipment_status_logs" ON equipment_status_logs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_status_logs' AND policyname = 'Authenticated insert equipment_status_logs') THEN
    CREATE POLICY "Authenticated insert equipment_status_logs" ON equipment_status_logs FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_status_logs' AND policyname = 'Authenticated update equipment_status_logs') THEN
    CREATE POLICY "Authenticated update equipment_status_logs" ON equipment_status_logs FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_status_logs' AND policyname = 'Authenticated delete equipment_status_logs') THEN
    CREATE POLICY "Authenticated delete equipment_status_logs" ON equipment_status_logs FOR DELETE USING (true);
  END IF;
END $$;

-- equipment_ship_logs RLS
ALTER TABLE equipment_ship_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_ship_logs' AND policyname = 'Public read equipment_ship_logs') THEN
    CREATE POLICY "Public read equipment_ship_logs" ON equipment_ship_logs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_ship_logs' AND policyname = 'Authenticated insert equipment_ship_logs') THEN
    CREATE POLICY "Authenticated insert equipment_ship_logs" ON equipment_ship_logs FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_ship_logs' AND policyname = 'Authenticated update equipment_ship_logs') THEN
    CREATE POLICY "Authenticated update equipment_ship_logs" ON equipment_ship_logs FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment_ship_logs' AND policyname = 'Authenticated delete equipment_ship_logs') THEN
    CREATE POLICY "Authenticated delete equipment_ship_logs" ON equipment_ship_logs FOR DELETE USING (true);
  END IF;
END $$;
