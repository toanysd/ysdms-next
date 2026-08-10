-- Migration: Enable public select RLS policy on core search entities
ALTER TABLE IF EXISTS physical_molds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_public_select_physical_molds ON physical_molds;
CREATE POLICY allow_public_select_physical_molds ON physical_molds FOR SELECT USING (true);

ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_public_select_products ON products;
CREATE POLICY allow_public_select_products ON products FOR SELECT USING (true);

ALTER TABLE IF EXISTS cutters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_public_select_cutters ON cutters;
CREATE POLICY allow_public_select_cutters ON cutters FOR SELECT USING (true);

ALTER TABLE IF EXISTS mold_design_cutters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_public_select_mdc ON mold_design_cutters;
CREATE POLICY allow_public_select_mdc ON mold_design_cutters FOR SELECT USING (true);
