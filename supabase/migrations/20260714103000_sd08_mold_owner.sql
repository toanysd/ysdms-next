-- Add mold_owner and mold_owner_customer_id to physical_molds to track customer-owned molds
ALTER TABLE physical_molds 
  ADD COLUMN IF NOT EXISTS mold_owner TEXT DEFAULT 'YSD',
  ADD COLUMN IF NOT EXISTS mold_owner_customer_id UUID REFERENCES companies(company_id);

-- Add comments for documentation
COMMENT ON COLUMN physical_molds.mold_owner IS 'Owner of the mold: YSD or Customer';
COMMENT ON COLUMN physical_molds.mold_owner_customer_id IS 'Reference to the customer company if mold_owner is Customer';
