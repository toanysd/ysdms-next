-- Migration 083: create_qc_tables
-- Created for M6 Phase A (Data Foundation)

-- 1. In-Process QC Table (BP-49)
CREATE TABLE IF NOT EXISTS job_qc_logs (
    qc_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_step_id UUID NOT NULL REFERENCES job_steps(job_step_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    recorded_by UUID NOT NULL REFERENCES employees(employee_id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    quantity_checked INTEGER NOT NULL,
    quantity_pass INTEGER NOT NULL,
    quantity_ng INTEGER NOT NULL DEFAULT 0,
    defect_category TEXT,
    defect_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Final/Outgoing QC Table (BP-50, BP-51)
CREATE TABLE IF NOT EXISTS outgoing_qc_records (
    qc_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_line_id UUID NOT NULL REFERENCES order_lines(line_id) ON DELETE RESTRICT,
    inspector_id UUID NOT NULL REFERENCES employees(employee_id),
    inspected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    qty_submitted INTEGER NOT NULL,
    qty_pass INTEGER NOT NULL,
    qty_ng INTEGER NOT NULL DEFAULT 0,
    result TEXT NOT NULL DEFAULT 'PASS',
    measurement_data JSONB,
    customer_form_ref TEXT,
    recycled_material_pct NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_qc_logs_job_id ON job_qc_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_qc_logs_job_step_id ON job_qc_logs(job_step_id);
CREATE INDEX IF NOT EXISTS idx_outgoing_qc_records_order_line_id ON outgoing_qc_records(order_line_id);

-- RLS for job_qc_logs
ALTER TABLE job_qc_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_job_qc_logs" ON job_qc_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for outgoing_qc_records
ALTER TABLE outgoing_qc_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_outgoing_qc_records" ON outgoing_qc_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Comments
COMMENT ON TABLE job_qc_logs IS 'In-Process QC logs recording NG during manufacturing job steps (BP-49)';
COMMENT ON TABLE outgoing_qc_records IS 'Final/Outgoing QC records linking to order lines for customer delivery (BP-50, BP-51)';
