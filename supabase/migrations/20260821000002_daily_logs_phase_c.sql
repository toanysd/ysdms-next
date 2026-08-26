-- Migration: Phase C - HR/Payroll + Waste Management

-- 1. transport_daily_logs
CREATE TABLE IF NOT EXISTS public.transport_daily_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employee_id UUID NOT NULL REFERENCES public.employees(employee_id),
  vehicle_type TEXT CHECK (vehicle_type IN ('TRUCK_2T', 'TRUCK_3T', 'VAN', 'OTHER')),
  destination TEXT NOT NULL,
  purpose TEXT,
  start_time TIME,
  end_time TIME,
  mileage_start NUMERIC,
  mileage_end NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. grinding_daily_logs (waste management)
CREATE TABLE IF NOT EXISTS public.grinding_daily_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employee_id UUID NOT NULL REFERENCES public.employees(employee_id),
  material_type TEXT NOT NULL, -- e.g., 'PS_WHITE'
  weight_kg NUMERIC NOT NULL,
  machine_id UUID, -- Optional equipment reference
  bag_count INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. payroll_records
CREATE TABLE IF NOT EXISTS public.payroll_records (
  payroll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(employee_id),
  payroll_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  base_salary NUMERIC NOT NULL DEFAULT 0,
  design_task_total NUMERIC NOT NULL DEFAULT 0, -- NEW from AI review
  allowance_total NUMERIC NOT NULL DEFAULT 0,
  overtime_pay NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'PAID')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, payroll_month)
);

-- 4. employee_skills
CREATE TABLE IF NOT EXISTS public.employee_skills (
  skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(employee_id),
  skill_category TEXT NOT NULL CHECK (skill_category IN ('FORMING', 'PRESS', 'DESIGN', 'INSPECTION', 'OTHER')),
  skill_name TEXT NOT NULL,
  proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
  certified_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grinding_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_skills ENABLE ROW LEVEL SECURITY;
