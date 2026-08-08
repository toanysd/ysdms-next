-- RLS SELECT policies for client-side (anon/authenticated) access
-- These tables were previously blocked by RLS (RLS enabled but no SELECT policy for anon role)
-- This caused EquipmentDetailModal popup to show "Equipment data not found" when accessed from browser

-- Equipment (main equipment table - Single Source of Truth)
DROP POLICY IF EXISTS "anon_select_equipment" ON "public"."equipment";
CREATE POLICY "anon_select_equipment" ON "public"."equipment" FOR SELECT TO anon, authenticated USING (true);

-- Equipment assignments (N:N set assignments)
DROP POLICY IF EXISTS "anon_select_equipment_assignments" ON "public"."equipment_assignments";
CREATE POLICY "anon_select_equipment_assignments" ON "public"."equipment_assignments" FOR SELECT TO anon, authenticated USING (true);

-- Equipment history (movement/action history)
DROP POLICY IF EXISTS "anon_select_equipment_history" ON "public"."equipment_history";
CREATE POLICY "anon_select_equipment_history" ON "public"."equipment_history" FOR SELECT TO anon, authenticated USING (true);

-- Design revisions (product design specs)
DROP POLICY IF EXISTS "anon_select_design_revisions" ON "public"."design_revisions";
CREATE POLICY "anon_select_design_revisions" ON "public"."design_revisions" FOR SELECT TO anon, authenticated USING (true);

-- Orders
DROP POLICY IF EXISTS "anon_select_orders" ON "public"."orders";
CREATE POLICY "anon_select_orders" ON "public"."orders" FOR SELECT TO anon, authenticated USING (true);

-- Rack layers (storage location info)
DROP POLICY IF EXISTS "anon_select_rack_layers" ON "public"."rack_layers";
CREATE POLICY "anon_select_rack_layers" ON "public"."rack_layers" FOR SELECT TO anon, authenticated USING (true);
