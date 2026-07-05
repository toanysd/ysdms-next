# Original User Request

## Initial Request â€” 2026-05-31T09:25:54Z

# Project: Implement MRP & Plastic Inventory by Meters

Implement the MRP (Priority 1) feature based on the new domain logic: Plastics are tracked by METERS (m), not Kg. The machine operator manually logs meters consumed and wasted. The feed length (é€ã‚Š) is determined when scheduling the production plan.

## Tasks:
1. **Schema Migration:** Create `supabase/migrations/060_update_plastic_to_meters.sql`:
   - `plastic_master`: Add `width_mm` (numeric, e.g. 550 for PP 0.8mm).
   - `inventory_txn`: Add `qty_meters` (numeric, default 0).
   - `production_plans`: Add `material_feed_length_mm` (numeric, nullable). This is the 'BÆ°á»›c tiáº¿n nhá»±a / é€ã‚Š' per shot.
   - `production_log`: Add `roll_barcode` (text), `meters_consumed` (numeric), `meters_remaining` (numeric), `meters_wasted` (numeric).
   - Replace or update the `plastic_stock` view to aggregate `qty_meters` instead of `qty_kg`.

2. **Backend Logic (`src/app/actions/mrp.ts`):**
   - Query the updated `plastic_stock` view for actual `current_meters` (remove the `Math.random()` mock).
   - Calculate Demand in Meters = `(material_feed_length_mm / 1000) * ceil(Order_Quantity / Cavity)`. 
   - Note: You must join `production_plans` to get `material_feed_length_mm`. If a plan doesn't exist yet, you can use a fallback estimate based on tray dimensions + 50mm margin, or just 0.

3. **UI Updates:**
   - Update `MrpDashboardClient.tsx` and related components to display "MÃ©t (m)" instead of "Kg".
   - Find the Production Plan scheduling form and add an input field for `material_feed_length_mm` (BÆ°á»›c tiáº¿n nhá»±a).
   - Find the Shopfloor Production Log submission form and add the 4 new fields: `roll_barcode`, `meters_consumed`, `meters_remaining`, `meters_wasted`.

Ensure the migration applies successfully and the Next.js app builds without errors.

## Follow-up ? 2026-05-31T09:37:39Z

UPDATE TO PRIORITY 1 LOGIC:
The user has provided a critical domain constraint: "The material feed length (B??c ti?n nh?a - ‘—‚è) is FIXED for each specific forming machine."
Therefore, the planner DOES NOT input the feed length manually.

You must update your implementation as follows:
1. In supabase/migrations/060_update_plastic_to_meters.sql (or a similar migration):
   - Update the machine_type spec schema for THERMOFORM to include feed_length_mm (B??c ti?n nh?a, ‘—‚è).
   - Update the existing machine models/instances to have a default feed_length_mm (e.g., 400mm or whatever makes sense) in their specs JSONB.
2. In production_plans table: You can still add material_feed_length_mm as a column to snapshot the value, but its value must be automatically derived from the selected machine_id's effective_specs->>'feed_length_mm'.
3. In src/app/actions/mrp.ts: When calculating demand, if a plan exists, use the machine's feed length. If not, use an estimated feed length.
4. DO NOT ask the user to manually input material_feed_length_mm in the Production Plan UI. It should be automatically fetched and displayed as read-only based on the selected machine.
