# Changelog

## [Phase 2.3] - 2026-07-18
### Added
- Complete codebase i18n refactoring: Full integration of multi-language support (JA / VI) using `next-intl`.
- Created translation dictionaries in `messages/ja.json` and `messages/vi.json` supporting all core business modules:
  - `Common`: Shared controls and buttons (back, list, save, cancel, edit, search, actions).
  - `Navigation`: Localized labels for sidebar and application routes.
  - `Cases` & `Orders`: Complete i18n mapping for business case lifecycle states, case types, quotation items, and order details.
  - `Customers`: Multi-language labels for client details, contact persons, type distinctions (customer vs. vendor), and delivery site maps.
  - `Plastics`: Localization for production logging (meters consumed, remaining, wasted, roll details, feed length).
  - `Login`: User interface translations and error messaging for authentication.
- Refactored frontend pages and components (under `/cases`, `/orders`, `/master`, `/mrp`, `/production`, and login page) to consume translations dynamically via `next-intl` (using the `useTranslations` hook).

## [Phase 2.1] - 2026-07-17
### Added
- MRP by Meters: Implemented logic and UI to calculate plastic requirement in meters instead of sheets.
- Updated `plastic_master` and `inventory_txn` schema to support meter units (Migration 060).
- Extended `machine_type` spec schema for `THERMOFORM` with `feed_length_mm` (Bước tiến nhựa, 送り).
- Added snapshot of `material_feed_length_mm` to `production_plans` based on selected machine's `effective_specs`.
- Production logs now track `meters_consumed`, `meters_remaining`, `meters_wasted`, and `roll_barcode`.
- Backend actions and views (`mrp.ts`, `production.ts`, `plastic_stock`) updated to aggregate and calculate demand based on meters.
- Frontend components (`MrpDashboardClient`, `CreatePlanForm`, `track` page) updated to reflect meter metrics (feed length shown as read-only, derived from selected machine).

## [Phase 0] - 2026-07-17
### Added
- Internationalization (i18n): Set up Japanese (JA) and Vietnamese (VI) translations throughout the application using `next-intl`.
- Translation dictionaries configured and implemented in components.

