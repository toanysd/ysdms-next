-- 1. Update design_revisions
ALTER TABLE design_revisions DROP COLUMN IF EXISTS mold_master_id CASCADE;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(product_id) ON DELETE CASCADE;

-- 2. Update mold_revisions
ALTER TABLE mold_revisions DROP COLUMN IF EXISTS mold_master_id CASCADE;
ALTER TABLE mold_revisions ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(product_id) ON DELETE CASCADE;

-- 3. Update jobs
ALTER TABLE jobs DROP COLUMN IF EXISTS mold_master_id CASCADE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(product_id) ON DELETE CASCADE;

-- 4. Update cutters
ALTER TABLE cutters DROP COLUMN IF EXISTS cutter_master_id CASCADE;

-- 5. DROP old tables (Cascade to drop any remaining views/constraints)
DROP TABLE IF EXISTS cutter_masters CASCADE;
DROP TABLE IF EXISTS mold_masters CASCADE;
