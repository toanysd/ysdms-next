CREATE INDEX IF NOT EXISTS idx_design_revisions_product_id ON design_revisions(product_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_design_revision_id ON equipment(design_revision_id);
CREATE INDEX IF NOT EXISTS idx_equipment_equipment_type ON equipment(equipment_type);
