-- Migration to support V4 business rules

-- 1. Add genealogy to mold_revisions
ALTER TABLE mold_revisions 
ADD COLUMN inherited_from_mold_id UUID REFERENCES mold_masters(mold_master_id),
ADD COLUMN change_description TEXT;

-- 2. Add surface treatment to physical_molds
ALTER TABLE physical_molds
ADD COLUMN surface_treatment TEXT DEFAULT 'NONE'; -- e.g. 'NONE', 'TEFLON'

-- 3. Add order type to production_orders to distinguish samples
ALTER TABLE production_orders
ADD COLUMN po_type TEXT DEFAULT 'MASS'; -- 'MASS', 'SAMPLE'
