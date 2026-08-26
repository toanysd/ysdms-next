-- Migration: Phase A - Core Daily Logs (P0)
-- Creates forming_daily_logs, press_daily_logs, inspection_daily_logs
-- Extends employees

-- 1. Extend employees table
ALTER TABLE IF EXISTS public.employees ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE IF EXISTS public.employees ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'FULL_TIME';
ALTER TABLE IF EXISTS public.employees ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC;
ALTER TABLE IF EXISTS public.employees ADD COLUMN IF NOT EXISTS join_date DATE;

-- 2. forming_daily_logs
CREATE TABLE IF NOT EXISTS public.forming_daily_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(equipment_id),
  product_id UUID REFERENCES public.products(product_id),
  operator_id UUID NOT NULL REFERENCES public.employees(employee_id),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  check_heater BOOLEAN DEFAULT false,
  check_mold BOOLEAN DEFAULT false,
  check_cutter BOOLEAN DEFAULT false,
  check_plug BOOLEAN DEFAULT false,
  check_frame BOOLEAN DEFAULT false,
  check_stacking BOOLEAN DEFAULT false,
  check_water_base BOOLEAN DEFAULT false,
  roll_barcode TEXT,
  plastic_id UUID REFERENCES public.plastic_master(plastic_id),
  qty_ok INT NOT NULL DEFAULT 0,
  qty_ng_a INT DEFAULT 0,
  qty_ng_b INT DEFAULT 0,
  qty_ng_c INT DEFAULT 0,
  qty_ng_d INT DEFAULT 0,
  qty_ng_e INT DEFAULT 0,
  qty_ng_f INT DEFAULT 0,
  qty_ng_g INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.forming_daily_logs ENABLE ROW LEVEL SECURITY;

-- 3. press_daily_logs
CREATE TABLE IF NOT EXISTS public.press_daily_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(equipment_id),
  product_id UUID REFERENCES public.products(product_id),
  operator_id UUID NOT NULL REFERENCES public.employees(employee_id),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  shot_count INT DEFAULT 0,
  qty_ok INT NOT NULL DEFAULT 0,
  qty_ng INT DEFAULT 0,
  cutter_condition TEXT,
  notes_ja TEXT,
  notes_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.press_daily_logs ENABLE ROW LEVEL SECURITY;

-- 4. inspection_daily_logs
CREATE TABLE IF NOT EXISTS public.inspection_daily_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  product_id UUID REFERENCES public.products(product_id),
  inspector_id UUID NOT NULL REFERENCES public.employees(employee_id),
  lot_size INT,
  sample_size INT,
  qty_wc INT DEFAULT 0,
  qty_bh INT DEFAULT 0,
  qty_sc INT DEFAULT 0,
  qty_dt INT DEFAULT 0,
  qty_br INT DEFAULT 0,
  qty_fm INT DEFAULT 0,
  qty_sd INT DEFAULT 0,
  qty_ot INT DEFAULT 0,
  result TEXT CHECK (result IN ('PASS', 'FAIL', 'CONDITIONAL')),
  disposition TEXT CHECK (disposition IN ('DISCARD', 'SPECIAL_ACCEPT', 'STOP_PRODUCTION')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inspection_daily_logs ENABLE ROW LEVEL SECURITY;
