-- Migration: 085_add_quotation_phase2_fields.sql
-- Description: Add revision_no, customer_contact_name, delivery_destination to quotations; model_code, quantity_text to quotation_lines

-- Bảng quotations
ALTER TABLE quotations
  ADD COLUMN IF NOT EXISTS revision_no        INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS customer_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS delivery_destination  TEXT;

-- Bảng quotation_lines  
ALTER TABLE quotation_lines
  ADD COLUMN IF NOT EXISTS model_code    TEXT,
  ADD COLUMN IF NOT EXISTS quantity_text TEXT;

-- Index hỗ trợ tìm revision
CREATE INDEX IF NOT EXISTS idx_quotations_revision
  ON quotations (quotation_no, revision_no);
