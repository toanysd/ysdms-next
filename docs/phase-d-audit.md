# Phase D Audit Report

Generated: 2026-08-21

## Summary
- Files referencing `physical_molds`: 8
- Files referencing `cutters`: 7
- Total touch points: 15

## physical_molds References
| File | Line | Pattern | Risk |
|------|------|---------|------|
| `src/app/reports/daily-worklog/page.tsx` | 122 | `log.jobs.physical_molds` | LOW |
| `src/components/equipment/DesignJobsList.tsx` | 20, 47, 128 | `.physical_molds` | MEDIUM |
| `src/components/equipment/DesignPhysicalMoldsList.tsx` | 42 | `.from('physical_molds')` | HIGH |
| `src/components/equipment/JobQuickViewDrawer.tsx` | 539, 572-574 | `.physical_molds` | MEDIUM |
| `src/components/equipment/MoldModal.tsx` | 74, 136, 146 | `.from('physical_molds')` | HIGH |
| `src/components/equipment/QuickLinkMoldModal.tsx` | 43 | `.from('physical_molds')` | HIGH |
| `src/components/equipment/RealtimeReferencePanel.tsx` | 110 | `.from('physical_molds')` | HIGH |
| `src/components/worklogs/DailyWorklogQuickModal.tsx` | 42, 164, 345 | `.physical_molds` | LOW |

## cutters References
| File | Line | Pattern | Risk |
|------|------|---------|------|
| `src/app/product-center/[id]/_components/TabOverview.tsx` | 1681, 1700, 2174 | `showCutters.map`, `isCutter` | MEDIUM |
| `src/app/production/mold-orders/page.tsx` | 20, 131, 929 | `cutters.map` | MEDIUM |
| `src/app/page.tsx` | 66 | `stats.cutters` | LOW |
| `src/components/layout/Topbar.tsx` | 143, 162 | `mold_design_cutters` | MEDIUM |
| `src/lib/actions/searchActions.ts` | 52-53, 94-95 | `data: cutters` | MEDIUM |
| `src/lib/utils/moldNaming.ts` | 337, 382 | `cutters table` comment | LOW |
| `src/lib/quotation-engine.ts` | 3 | `cutters` comment | LOW |

## Migration Risk Assessment
- **HIGH RISK**: `DesignPhysicalMoldsList.tsx`, `MoldModal.tsx`, `QuickLinkMoldModal.tsx`, `RealtimeReferencePanel.tsx`. These files directly fetch or mutate `physical_molds` table. They need full query and typing rewrites to point to `equipment` table with `equipment_type = 'MOLD'`.
- **MEDIUM RISK**: `DesignJobsList.tsx`, `JobQuickViewDrawer.tsx`, `TabOverview.tsx`, `searchActions.ts`. These rely on populated FKs (`jobs.physical_molds`) or search logic that needs to be repointed.
- **LOW RISK**: Display-only files or comments.

## Recommended Migration Order
1. Migrate `searchActions.ts` and `Topbar.tsx` (Read-only searches)
2. Migrate `DesignJobsList.tsx` and `JobQuickViewDrawer.tsx` (Read-only joins)
3. Migrate `TabOverview.tsx` and `DailyWorklogQuickModal.tsx`
4. Migrate `DesignPhysicalMoldsList.tsx` and `RealtimeReferencePanel.tsx` (Direct list views)
5. Migrate `MoldModal.tsx` and `QuickLinkMoldModal.tsx` (Mutations - Highest risk)
