-- =================================================================================
-- Migration 047: Mold Workflow & Master Data Extensions
-- Purpose: Support the transition of Mold Management from Access to NextGen
-- Description: Creates companies, rack_layers, processing_codes, and adds fields 
-- to mold_physical and mold_design_revision. Creates mold_jobs and mold_work_logs.
-- =================================================================================

-- 1. TẠO CÁC BẢNG MASTER DATA CÒN THIẾU
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rack_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.item_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.processing_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BỔ SUNG CỘT CHO SCHEMA KHUÔN HIỆN TẠI
ALTER TABLE public.mold_physical 
  ADD COLUMN IF NOT EXISTS keeper_company_id UUID REFERENCES public.companies(id),
  ADD COLUMN IF NOT EXISTS rack_layer_id UUID REFERENCES public.rack_layers(id),
  ADD COLUMN IF NOT EXISTS item_type_id UUID REFERENCES public.item_types(id),
  ADD COLUMN IF NOT EXISTS entry_date DATE;

ALTER TABLE public.mold_design_revision
  ADD COLUMN IF NOT EXISTS length_mm NUMERIC,
  ADD COLUMN IF NOT EXISTS width_mm NUMERIC,
  ADD COLUMN IF NOT EXISTS height_mm NUMERIC;

-- 3. TẠO SCHEMA NGHIỆP VỤ NHẬT KÝ KHUÔN (WORKFLOW)
CREATE TABLE IF NOT EXISTS public.mold_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code TEXT UNIQUE NOT NULL,
  mold_physical_id UUID REFERENCES public.mold_physical(id),
  mold_design_id UUID REFERENCES public.mold_design_revision(id),
  status TEXT DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, CLOSED
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mold_work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.mold_jobs(id) NOT NULL,
  operator_name TEXT NOT NULL, 
  processing_code_id UUID REFERENCES public.processing_codes(id) NOT NULL,
  processing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  processing_hours NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẬT RLS & PHÂN QUYỀN CƠ BẢN
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rack_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_work_logs ENABLE ROW LEVEL SECURITY;

-- Cấp quyền truy cập cho authenticated users
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.rack_layers TO authenticated;
GRANT ALL ON public.item_types TO authenticated;
GRANT ALL ON public.processing_codes TO authenticated;
GRANT ALL ON public.mold_jobs TO authenticated;
GRANT ALL ON public.mold_work_logs TO authenticated;

-- Policies: Cho phép mọi user đã đăng nhập đọc/ghi
CREATE POLICY "Allow authenticated full access on companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on rack_layers" ON public.rack_layers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on item_types" ON public.item_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on processing_codes" ON public.processing_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on mold_jobs" ON public.mold_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on mold_work_logs" ON public.mold_work_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
