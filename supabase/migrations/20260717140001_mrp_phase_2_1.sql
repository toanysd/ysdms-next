-- Phase 2.1 - MRP & Plastic Inventory

-- 1. Add feed_length_mm to machines
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS feed_length_mm NUMERIC;

-- 2. Create plastic WMS tables if they don't exist
CREATE TABLE IF NOT EXISTS public.plastic_master (
    plastic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plastic_code TEXT UNIQUE NOT NULL,
    plastic_family TEXT NOT NULL,
    thickness_mm NUMERIC NOT NULL,
    width_mm INTEGER NOT NULL
);

-- Add color and properties if not already there
ALTER TABLE public.plastic_master 
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS properties TEXT;

CREATE TABLE IF NOT EXISTS public.plastic_receipt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.companies(company_id),
    receipt_no TEXT UNIQUE NOT NULL,
    receipt_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plastic_receipt_roll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID REFERENCES public.plastic_receipt(id),
    plastic_id UUID REFERENCES public.plastic_master(plastic_id),
    branch_id UUID REFERENCES public.companies(company_id),
    roll_barcode TEXT UNIQUE NOT NULL,
    nominal_length_m NUMERIC NOT NULL,
    received_length_m NUMERIC NOT NULL,
    current_length_m NUMERIC NOT NULL,
    status TEXT NOT NULL,
    location TEXT
);

-- 3. Create production_log
CREATE TABLE IF NOT EXISTS public.production_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(job_id),
    roll_id UUID REFERENCES public.plastic_receipt_roll(id),
    meters_consumed NUMERIC NOT NULL,
    meters_remaining NUMERIC NOT NULL,
    meters_wasted NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.production_log ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'production_log' AND policyname = 'production_log_all'
  ) THEN
    CREATE POLICY "production_log_all" ON public.production_log FOR ALL USING (true);
  END IF;
END $$;
