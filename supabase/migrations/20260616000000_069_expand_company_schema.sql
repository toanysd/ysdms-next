-- Migration: Add parent_company_id for hierarchical structure

ALTER TABLE companies
ADD COLUMN parent_company_id UUID REFERENCES companies(company_id) ON DELETE SET NULL;

-- Enable indexing for the new column for performance
CREATE INDEX IF NOT EXISTS idx_companies_parent_id ON companies(parent_company_id);
