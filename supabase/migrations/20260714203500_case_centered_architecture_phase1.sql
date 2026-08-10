-- ============================================================
-- MIGRATION: case_centered_architecture_phase1
-- Ngày: 2026-07-14
-- Tác giả: An + PE
-- ============================================================

-- 1. TẠO MỚI: business_cases (Luồng sự việc trung tâm)
CREATE TABLE public.business_cases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_code             TEXT NOT NULL UNIQUE,          -- VD: CASE-2607-0001
  title                 TEXT NOT NULL,
  case_type             TEXT NOT NULL CHECK (case_type IN (
                          'new_tray','repeat_order','mold_modification',
                          'material_change','complaint','inventory_audit','other')),
  status                TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
                          'open','in_review','quoted','ordered','completed','closed')),
  customer_id           UUID REFERENCES public.companies(company_id),
  contact_person_id     UUID REFERENCES public.company_contacts(contact_id),
  sales_owner_id        UUID REFERENCES public.employees(employee_id),
  design_owner_id       UUID REFERENCES public.employees(employee_id),
  operations_owner_id   UUID REFERENCES public.employees(employee_id),
  requested_due_date    DATE,
  parent_case_id        UUID REFERENCES public.business_cases(id),
  raw_text_snapshot     TEXT,
  extra_json            JSONB,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.business_cases ENABLE ROW LEVEL SECURITY;

-- 2. TẠO MỚI: technical_reviews (Hồ sơ review kỹ thuật trước báo giá)
CREATE TABLE public.technical_reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES public.business_cases(id),
  requested_by          UUID REFERENCES public.employees(employee_id),
  reviewed_by           UUID REFERENCES public.employees(employee_id),
  review_date           TIMESTAMPTZ,
  mold_decision_type    TEXT CHECK (mold_decision_type IN ('reuse','modify','remake','new')),
  technical_constraints TEXT,
  machine_candidate     TEXT,
  mold_size_x           NUMERIC,
  mold_size_y           NUMERIC,
  cavity_count          INTEGER,
  cut_method            TEXT CHECK (cut_method IN ('inline','bekkinuki','tbd')),
  plug_required         BOOLEAN DEFAULT false,
  die_required          BOOLEAN DEFAULT false,
  result_status         TEXT DEFAULT 'pending' CHECK (result_status IN (
                          'pending','approved','rejected','needs_info')),
  raw_text_snapshot     TEXT,
  extra_json            JSONB,
  created_at            TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.technical_reviews ENABLE ROW LEVEL SECURITY;

-- 3. ALTER: physical_molds — thêm các flag còn thiếu
ALTER TABLE public.physical_molds
  ADD COLUMN IF NOT EXISTS photo_required_flag       BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS latest_photo_date         DATE,
  ADD COLUMN IF NOT EXISTS inventory_required_flag   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS latest_inventory_date     DATE,
  ADD COLUMN IF NOT EXISTS loan_required_flag        BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS latest_loan_doc_date      DATE,
  ADD COLUMN IF NOT EXISTS agreement_required_flag   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS latest_agreement_date     DATE,
  ADD COLUMN IF NOT EXISTS return_due_date           DATE;

-- 4. ALTER: production_orders — thêm phân loại số lượng & mẫu
ALTER TABLE public.production_orders
  ADD COLUMN IF NOT EXISTS quantity_free             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_office           INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sample_condition          TEXT,
  ADD COLUMN IF NOT EXISTS case_id                   UUID REFERENCES public.business_cases(id);

-- 5. ALTER: quotations — liên kết với business_cases + thêm trường thiếu
ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS case_id                   UUID REFERENCES public.business_cases(id),
  ADD COLUMN IF NOT EXISTS raw_text_snapshot         TEXT,
  ADD COLUMN IF NOT EXISTS extra_json                JSONB,
  ADD COLUMN IF NOT EXISTS quotation_type            TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS prepared_by               UUID REFERENCES public.employees(employee_id);

-- 6. Index tối ưu cho truy vấn case
CREATE INDEX IF NOT EXISTS idx_business_cases_customer   ON public.business_cases(customer_id);
CREATE INDEX IF NOT EXISTS idx_business_cases_status     ON public.business_cases(status);
CREATE INDEX IF NOT EXISTS idx_technical_reviews_case    ON public.technical_reviews(case_id);
CREATE INDEX IF NOT EXISTS idx_prod_orders_case          ON public.production_orders(case_id);
