-- Migration: Phase R1-B1 Lifecycle, Approval Logs and Sample Requests
-- Date: 2026-08-20
-- Author: Antigravity (AN) & Perplexity (PE)

-- 1. Bổ sung product_lifecycle_status trên bảng products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_lifecycle_status TEXT NOT NULL DEFAULT 'DRAFT';

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_lifecycle_status_check'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_lifecycle_status_check 
    CHECK (product_lifecycle_status IN (
      'DRAFT', 'DESIGN', 'PROTOTYPE', 'APPROVED', 'MASS_PRODUCTION', 'DISCONTINUED'
    ));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_lifecycle_status ON products(product_lifecycle_status);

-- 2. Tạo bảng design_approval_logs (Theo dõi vòng duyệt thiết kế CAD/Layout)
CREATE TABLE IF NOT EXISTS design_approval_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_revision_id UUID NOT NULL REFERENCES design_revisions(revision_id) ON DELETE CASCADE,
  approval_round INTEGER NOT NULL DEFAULT 1,
  approval_stage TEXT NOT NULL, -- 'LAYOUT', 'SAMPLE_POCKET', 'MASS_DRAWING', 'MASS_MOLD'
  approver_id UUID REFERENCES employees(employee_id),
  customer_feedback TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED_REVISE', 'CANCELLED')),
  approved_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_design_approval_rev ON design_approval_logs(design_revision_id);
CREATE INDEX IF NOT EXISTS idx_design_approval_stage ON design_approval_logs(approval_stage);
CREATE INDEX IF NOT EXISTS idx_design_approval_status ON design_approval_logs(status);

-- 3. Tạo bảng sample_requests (Theo dõi yêu cầu làm mẫu thử Pocket/Full Tray)
CREATE TABLE IF NOT EXISTS sample_requests (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  design_revision_id UUID REFERENCES design_revisions(revision_id) ON DELETE SET NULL,
  sample_type TEXT NOT NULL CHECK (sample_type IN ('POCKET_TEST', 'FULL_TRAY_SAMPLE', 'VACUUM_SAMPLE')),
  requested_qty INTEGER NOT NULL DEFAULT 1,
  target_date DATE,
  result_status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (result_status IN ('REQUESTED', 'IN_MAKING', 'SENT_TO_CUSTOMER', 'CUSTOMER_OK', 'CUSTOMER_NG')),
  ng_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sample_requests_product ON sample_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_sample_requests_rev ON sample_requests(design_revision_id);
CREATE INDEX IF NOT EXISTS idx_sample_requests_status ON sample_requests(result_status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE design_approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_read_dal ON design_approval_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_dal ON design_approval_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_dal ON design_approval_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY p_del_dal ON design_approval_logs FOR DELETE TO authenticated USING (true);

CREATE POLICY p_read_sr ON sample_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_sr ON sample_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_sr ON sample_requests FOR UPDATE TO authenticated USING (true);
CREATE POLICY p_del_sr ON sample_requests FOR DELETE TO authenticated USING (true);
