BEGIN;

-- 1. Create whitelist Cavity Model table
CREATE TABLE IF NOT EXISTS public.cav_model (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Cavity Model Whitelist
INSERT INTO public.cav_model (id, code, description) VALUES
(gen_random_uuid(), 'ZF', 'Zone Fixture small ~300x285 mm'),
(gen_random_uuid(), 'ZD', 'ZD Dimension modifier'),
(gen_random_uuid(), '74C', 'ILLIG 74C base 470x347 mm'),
(gen_random_uuid(), '74D', 'ILLIG 74D base 530x400 mm'),
(gen_random_uuid(), 'RV53', 'ILLIG RV53b 500x350 mm'),
(gen_random_uuid(), 'RV74', 'ILLIG RV74D 704x530 mm')
ON CONFLICT (code) DO NOTHING;

-- 3. Extend mold_base (B3, B4)
ALTER TABLE public.mold_base
ADD COLUMN IF NOT EXISTS cav_model_id UUID REFERENCES public.cav_model(id),
ADD COLUMN IF NOT EXISTS part_qualifier TEXT;

-- 4. Extend mold_design_revision (B5)
ALTER TABLE public.mold_design_revision
ADD COLUMN IF NOT EXISTS revision_num INTEGER DEFAULT 0;

-- 5. Extend mold_physical (B7 + part_role)
ALTER TABLE public.mold_physical
ADD COLUMN IF NOT EXISTS unit_index INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS part_role TEXT;

-- 6. Bảo vệ Data Integrity: Chặn hai khuôn cùng 1 physical_code mà ACTIVE
CREATE UNIQUE INDEX IF NOT EXISTS uq_mold_physical_active_code
  ON public.mold_physical (physical_code)
  WHERE status = 'ACTIVE';

COMMIT;
