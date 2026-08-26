-- Migration: Phase B - Design Salary, ISO, Finance Fixes & Phase A Patches

-- ==========================================
-- PATCHES FOR PHASE A (Based on AI Review)
-- ==========================================

-- 1. Make equipment_id nullable until Phase D is complete
ALTER TABLE IF EXISTS public.forming_daily_logs ALTER COLUMN equipment_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.press_daily_logs ALTER COLUMN equipment_id DROP NOT NULL;

-- 2. Add order_line_id to inspection_daily_logs for QC traceability
ALTER TABLE IF EXISTS public.inspection_daily_logs ADD COLUMN IF NOT EXISTS order_line_id UUID REFERENCES public.order_lines(line_id);

-- ==========================================
-- PHASE B: NEW TABLES & EXTENSIONS
-- ==========================================

-- 3. design_task_logs (with job_id FK)
DO $$ BEGIN
  CREATE TYPE design_task_type AS ENUM (
    'DESIGN',
    'MOLD_CAM',
    'PLUG_CAM',
    'PROTO_PLUG_CAM',
    'PROTO_MOLD_CAM',
    'MOLD_DRILLING',
    'MOLD_POLISHING',
    'PROTO_DRILLING',
    'PROTO_POLISHING',
    'MOLD_FLANNEL',
    'PROTO_FLANNEL',
    'MOLD_HAND_PLUG',
    'PROTO_HAND_PLUG',
    'MATERIAL_DISPATCH',
    'SHIPPING_WORK',
    'SHIPPING_ASSIST',
    'INSPECTION',
    'FORMING_ASSIST',
    'PRESS_ASSIST',
    'DELIVERY',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.design_task_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employee_id UUID NOT NULL REFERENCES public.employees(employee_id),
  product_id UUID REFERENCES public.products(product_id),
  job_id UUID REFERENCES public.jobs(job_id),
  task_type design_task_type NOT NULL,
  unit_price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  amount NUMERIC GENERATED ALWAYS AS (unit_price * quantity) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.design_task_logs ENABLE ROW LEVEL SECURITY;

-- 4. Extend defect_reports for ISO/NCR
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS report_type TEXT DEFAULT 'INTERNAL' CHECK (report_type IN ('INTERNAL', 'CUSTOMER_FACING', 'ISO_NCR'));
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS root_cause_analysis TEXT;
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS corrective_action TEXT;
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS preventive_action TEXT;
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS customer_response_date DATE;
ALTER TABLE public.defect_reports ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- 5. Fix quotations CHECK constraint (Clean data first)
UPDATE public.quotations SET quotation_type = 'SERVICE' WHERE quotation_type = 'standard';
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_quotation_type_check;
ALTER TABLE public.quotations ADD CONSTRAINT quotations_quotation_type_check 
  CHECK (quotation_type IN ('MOLD_NEW', 'MOLD_REMAKE', 'TRAY_REPEAT', 'SERVICE', 'STORAGE_FEE'));

-- 6. Add approval_level to design_approval_logs
ALTER TABLE public.design_approval_logs ADD COLUMN IF NOT EXISTS approval_level INT CHECK (approval_level BETWEEN 1 AND 3);

-- 7. Fix invoices (Only add tax_rate since tax_amount, currency, due_date exist)
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 0.10;
