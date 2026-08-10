-- 20260716000000_create_quotations_table.sql

CREATE TABLE IF NOT EXISTS public.quotations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES public.business_cases(id) ON DELETE CASCADE,
  quotation_no          TEXT NOT NULL,
  version               INTEGER NOT NULL DEFAULT 1,
  issued_date           DATE,
  valid_until           DATE,
  total_amount          NUMERIC(15, 2) NOT NULL DEFAULT 0,
  tax_amount            NUMERIC(15, 2) NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'JPY',
  items_json            JSONB NOT NULL DEFAULT '[]'::jsonb,
  status                TEXT NOT NULL DEFAULT 'draft',
  notes                 TEXT,
  prepared_by           UUID REFERENCES public.profiles(id),
  approved_by           UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(case_id, quotation_no, version)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_quotations_case_id ON public.quotations(case_id);

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can read
CREATE POLICY "Allow read access for all authenticated users" 
ON public.quotations FOR SELECT 
TO authenticated 
USING (true);

-- 2. Authenticated users can insert
CREATE POLICY "Allow insert for authenticated users" 
ON public.quotations FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Authenticated users can update
CREATE POLICY "Allow update for authenticated users" 
ON public.quotations FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. Managers can delete
CREATE POLICY "Allow delete for managers" 
ON public.quotations FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('manager', 'admin')
  )
);
