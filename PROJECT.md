# Project: Implement MRP & Plastic Inventory by Meters

## Architecture
- `plastic_master` and `inventory_txn` will be updated to support meters.
- `machine_type` spec schema for `THERMOFORM` will include `feed_length_mm` (Bước tiến nhựa, 送り). Existing machine models will be updated with a default `feed_length_mm` in their `specs` JSONB.
- `production_plans` will snapshot `material_feed_length_mm`, derived from the selected machine's `effective_specs`.
- `production_log` will track `meters_consumed`, `meters_remaining`, `meters_wasted`, and `roll_barcode`.
- Backend actions and views will calculate demand based on meters.
- Frontend components will be updated to reflect the new metrics. Production Plan UI will show feed length as read-only, derived from the selected machine.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | MRP by Meters | Schema migration (060), Backend actions (mrp.ts, production.ts), Frontend components (MrpDashboardClient, CreatePlanForm, track page). Includes machine spec updates for feed length. | none | COMPLETED |
| 2 | Phase 2.3 (Di trú Quốc tế hóa i18n) | Complete codebase i18n migration utilizing `next-intl` dynamically translating all views (Common, Navigation, Cases, Orders, Customers, Plastics, Login) for Japanese (JA) and Vietnamese (VI). | none | COMPLETED |

## Interface Contracts
### Database ↔ Backend
- `plastic_stock` view must expose aggregated meters.
- `production_plans` will use `material_feed_length_mm` (numeric), snapshotted from `machine.effective_specs->>'feed_length_mm'`.

## Code Layout
- Migrations: `supabase/migrations/`
- Backend Actions: `src/app/actions/`
- Frontend: `src/app/mrp/`, `src/app/production/`
