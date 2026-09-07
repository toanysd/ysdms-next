# Implementation Plan — Milestone 15 Sprint 1: NG Trend Analysis (/quality/ng-trends)

Build the **QC Intelligence: NG Trend Analysis** dashboard at `/quality/ng-trends` to analyze and visualize defect data generated from thermoforming operations (`forming_daily_logs`).

## User Review Required

> [!IMPORTANT]
> - **Zero Schema Migration for Sprint 1**: All queries leverage existing tables `forming_daily_logs`, `production_schedules`, `machines`, and `products`.
> - **Threshold Persistence**: Alert threshold defaults to `3.0%` and is persisted locally in `localStorage['ysd_ng_threshold']`.
> - **Navigation Alignment**: Registered under Sidebar Section `d5` (Phòng QC) as `/quality/ng-trends` with key `items.ngTrends`.

## Proposed Changes

### 1. Internationalization (i18n)

#### [MODIFY] [messages/ja.json](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/messages/ja.json)
#### [MODIFY] [messages/vi.json](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/messages/vi.json)
- Add `items.ngTrends` under navigation items.
- Add comprehensive `"NgTrends"` namespace for title, filters, KPI cards, charts, ranking tables, threshold alert, and Pareto summary.

---

### 2. Navigation & Sidebar

#### [MODIFY] [src/components/layout/Sidebar.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/layout/Sidebar.tsx)
- Add `{ href: '/quality/ng-trends', icon: TrendingUp, tKey: 'items.ngTrends' }` to Section `d5` (Phòng QC).

---

### 3. Server Actions & Backend Queries

#### [NEW] [src/app/quality/ng-trends/actions.ts](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/actions.ts)
- `getNgTrendsInitialData(dateFrom: string, dateTo: string)`:
  - Fetches active machines for the filter dropdown.
  - Queries `forming_daily_logs` in date range with joins to `production_schedules(machine_id, machines(...))` and `products(...)`.
  - Calculates summary metrics, time series (daily/weekly), group breakdown (A→G), machine ranking, and product ranking.
- Server-side grouping by `day`, `week`, `month`.

---

### 4. UI Components

#### [NEW] [src/app/quality/ng-trends/_components/NgTrendFilterBar.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/_components/NgTrendFilterBar.tsx)
- Date range picker (30 days default, 7/30/90 presets, custom date).
- Machine selector (`ALL` + `MACH-1`..`MACH-14`).
- Defect group selector (`ALL` + `A`..`G`).
- NG threshold input (`3.0%` default, saved to `localStorage['ysd_ng_threshold']`).

#### [NEW] [src/app/quality/ng-trends/_components/NgTrendKpiCards.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/_components/NgTrendKpiCards.tsx)
- 4 KPI cards:
  1. 良品合計 / Total OK (`qty_ok`)
  2. 不良合計 / Total NG (`sum ng_a..ng_g`)
  3. 不良率 / NG Rate % (highlighted with error/warning badge when exceeding threshold)
  4. 最多不良グループ / Top Defect Group (Group name, count, % of total NG)

#### [NEW] [src/app/quality/ng-trends/_components/NgTrendCharts.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/_components/NgTrendCharts.tsx)
- Recharts Line Chart: NG rate over time with dashed red `<ReferenceLine>` for threshold.
- Recharts Stacked Bar Chart: Breakdown of 7 NG categories (`qty_ng_a` → `qty_ng_g`) over time, by machine, or by product.

#### [NEW] [src/app/quality/ng-trends/_components/NgRankingTables.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/_components/NgRankingTables.tsx)
- Side-by-side grid:
  - Machine NG Ranking table (Machine, OK, NG, NG Rate %, Alert Badge).
  - Product NG Ranking table (Product Code, Product Name, OK, NG, NG Rate %).
  - Bottom Pareto row showing cumulative percentage of defect groups A→G.

#### [NEW] [src/app/quality/ng-trends/page.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/quality/ng-trends/page.tsx)
- Main page entry point, coordinating state between FilterBar, KpiCards, Charts, and RankingTables.

---

## Verification Plan

### Automated Verification
- `npx tsc --noEmit`: Ensure 0 TypeScript errors.
- `node scripts/check_translations.mjs`: Ensure 0 missing keys in both `ja.json` and `vi.json`.
- `node scripts/find_hardcoded_bilingual.mjs`: Verify clean bilingual formatting.

### Manual Verification
- Verify that filtering by date range correctly recalculates KPIs, charts, and rankings.
- Verify that adjusting the threshold input dynamically triggers alert badges and updates the chart reference line.
- Verify that toggling between Time, Machine, and Product in the Stacked Bar Chart renders properly without runtime errors.
