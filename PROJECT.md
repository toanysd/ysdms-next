# PROJECT: YSDMS NextGen Multi-Language & High-Contrast UI Synchronization

## Architecture
- **Framework**: Next.js App Router (100 routes across 14 business domains)
- **Internationalization (i18n)**: `next-intl` with JSON dictionaries in `messages/ja.json` and `messages/vi.json` (1,949 symmetric keys across 33 namespaces). Dynamic translation hook: `useTranslations('Namespace')`.
- **Design System & CSS**: Strict enforcement of `AGENTS.md` Section 6 & Rule 6:
  - Text primary color: `#0F172A` Slate 900 (`var(--text-primary)`).
  - Data values: 13px - 14px Bold (`fontFamily: monospace` for codes, specs, quantities).
  - Data labels: 11px - 12px Semi-bold (`var(--text-muted)` `#475569`).
  - Visual anchors: Tinted section header backgrounds (`--tint-teal-bg`, `--tint-blue-bg`, `--tint-orange-bg`, `--tint-purple-bg`, `--tint-green-bg`).
  - Standard CSS classes from `globals.css`: `data-table`, `card-flat`, `badge`, `form-input`, `form-select`, `form-section`, `tab-nav`, `tab-item`.
  - Zero hardcoded bilingual static slash text (e.g. `JA / VI`, raw Vietnamese or raw Japanese strings).
  - Zero forbidden Tailwind color classes (`bg-blue-500`, `text-red-600`, `text-slate-400`, `text-gray-500`) or hardcoded inline hex colors (`#3B82F6`).

## Feature Inventory
| # | Feature / Component | Description | Milestone | Source |
|---|-------------------|-------------|-----------|--------|
| 1 | Shared Modals i18n & High Contrast | `WorklogEditModal`, `UnsavedChangesModal`, `QuickLinkMoldModal`, `QuickMoldJobConfirmModal`, `CompanyFormModal`, `ShipModal` | M1 | Survey |
| 2 | Shared UI Core Components | `BilingualTitle`, `SearchableSelect`, `WorklogFormShared`, `Sidebar` layout styling | M1 | Survey |
| 3 | Production & Planning Refactoring | `ExcelPlanGridView`, `PendingOrderPanel`, `DayPlanContainer`, `OrderSelectionModal`, `PlanningToolbar` | M2 | Survey |
| 4 | Equipment Operations Refactoring | `CuttersClient`, `MoldDetailPanel`, `QuickCreate`, `JobsTab`, `TransferTab`, `LocationTab`, `EditStepModal` | M2 | Survey |
| 5 | Inventory & Instructions Refactoring | `StockTable`, `LowStockAlert`, `CustomerBento`, `ProductionInstructionPDF`, Step 1-3 wizard forms | M2 | Survey |
| 6 | Master Data Modules Refactoring | `CustomerForm`, `ContactList`, `DeliverySiteList`, `ProductDetailHeader`, `DesignsTab`, `OrdersTab`, Machine cards | M3 | Survey |
| 7 | Business Cases & Product Center Refactoring | Case detail headers (`fontSize: 10` fix), `SalesTab`, `TechnicalReviewTab`, `ProductCenter` section tabs | M3 | Survey |
| 8 | Orders & Shipments Refactoring | `OrderForm`, `OrderLinesManager`, `OrderDetailHeader`, `ShipmentDetailHeader`, `LotsTab`, `RequiredDocsTab` | M3 | Survey |
| 9 | Dashboard & Dynamic Keys Fix | Refactor `MasterDashboard-v8.5.2-1.tsx` contrast & fix dynamic key concatenation in `src/app/page.tsx` | M4 | Survey |
| 10 | Quality, Maintenance & Worklogs Refactoring | `Defects`, `Inspections`, `WorklogTable`, `WorklogForm`, `RecordMaintenanceButton`, `Admin/Ingest` | M4 | Survey |
| 11 | Full Verification & Audit | Run `check_translations.mjs`, `find_hardcoded_bilingual.mjs`, `npx tsc --noEmit`, Reviewer, Challenger, Forensic Auditor | M5 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Modals & Shared UI Core | `src/components/ui/`, `src/components/equipment/`, `src/components/master/`, `src/components/order/`, `src/components/worklogs/`, `src/components/layout/` | None | DONE |
| M2 | Production, Planning & Equipment | `src/app/production/`, `src/app/equipment/`, `src/app/production-instructions/` | M1 | DONE |
| M3 | Master Data, Cases & Orders | `src/app/master/`, `src/app/cases/`, `src/app/orders/`, `src/app/product-center/` | M1 | DONE |
| M4 | Dashboard, Quality, Worklogs & Reports | `src/app/dashboard/`, `src/app/quality/`, `src/app/maintenance/`, `src/app/worklogs/`, `src/app/reports/`, `src/app/admin/ingest/`, `src/app/page.tsx` | M1 | DONE |
| M5 | E2E Verification & Forensic Audit | Entire codebase: scripts, tsc --noEmit, Reviewers, Challengers, Forensic Auditor | M1, M2, M3, M4 | DONE |


## Interface Contracts
### i18n Contract (`next-intl`)
- All components MUST import `useTranslations` from `next-intl` (or `useLocale` for locale-specific branching).
- Keys MUST be retrieved from `messages/ja.json` and `messages/vi.json`.
- Dynamic key lookups MUST pass static namespace or valid mapped string enum, avoiding raw key prefix concatenation warnings.

### Design System Contract (`globals.css`)
- Header text color: `#0F172A` (`var(--text-primary)`).
- Data values: 13-14px Bold (`fontFamily: monospace` for numbers/codes).
- Labels: 11-12px Semi-bold (`var(--text-muted)` `#475569`).
- Section cards: Header background MUST apply `--tint-teal-bg`, `--tint-blue-bg`, `--tint-orange-bg`, or `--tint-purple-bg`.
- Zero raw Tailwind text gray (`text-slate-400`, `text-gray-500`) or hardcoded hex colors (`#3B82F6`).

## Code Layout
```
src/
├── app/                  ← Next.js App Router (100 routes)
│   ├── page.tsx          ← Top-level Dashboard
│   ├── cases/            ← Business Cases
│   ├── dashboard/        ← Master Dashboard & Loading Board
│   ├── engineering/      ← Design Revisions & Mold Engineering
│   ├── equipment/        ← Molds, Jobs, Cutting-dies, Plastics
│   ├── master/           ← Customers, Products, Molds, Machines, Plastics, Racks, Cutters
│   ├── orders/           ← Orders, Quotations, Shipments
│   ├── product-center/   ← Product Center Detail & Tabs
│   ├── production/       ← Planning, Kanban, Inventory, Floor Monitor
│   ├── production-instructions/ ← Wizard & PDF Generator
│   ├── quality/          ← Defects & Inspections
│   ├── reports/          ← Production Reports
│   └── worklogs/         ← Worklog Table & Form
├── components/           ← Shared UI Components
│   ├── equipment/        ← WorklogEditModal, QuickLinkMoldModal, MoldModal, Gantt
│   ├── layout/           ← Sidebar, Topbar
│   ├── master/           ← CompanyFormModal, CustomerForm, ContactList
│   ├── order/            ← OrderForm, OrderLinesManager, ShipModal
│   ├── ui/               ← BilingualTitle, SearchableSelect, UnsavedChangesModal
│   └── worklogs/         ← WorklogFormShared
└── messages/             ← JSON Dictionaries
    ├── ja.json           ← Japanese (1,949 keys)
    └── vi.json           ← Vietnamese (1,949 keys)
```
