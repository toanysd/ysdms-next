# SESSION HANDOFF — 2026-08-10 (Antigravity Context Handoff)

## 🧠 Current Active Context & Accomplishments Summary

### 1. Operations Hub Wizard Overhaul (`CenteredQuickJobWizardModal.tsx`)
- **User Feedback Addressed**:
  1. **STEP 1 (CAD Specifications Hub)**:
     - Fixed customer info pre-fill (`products.company_id`).
     - Derived plastic material directly from `design_revisions.plastic_type_designed` (SSOT compliance per RULE-DATA-01).
     - Added revision summary notes (`version_note`) and creation dates to `既存図面・リビジョン選択` list.
     - Added active selection highlight banner (`⚡ 統合業務データセンター Wizard — 選択中: SMK218R3`). Clicking a different revision in the right panel dynamically cascades the active revision context, outer dimensions, cutline, cavity, and associated equipment to subsequent steps!
  2. **STEP 2 (Physical Mold & Auxiliary Kit Hub)**:
     - Made `+ PLUG`, `+ CUTTER`, `+ WATER_BASE`, `+ PRESSURE_BASE`, `+ FRAME` kit buttons render directly inside an active Equipment Set Table with interactive type badges, name, and material specifications.
     - Replaced global equipment list with **Revision-Specific Equipment List** filtered by active revision, with Tabbed Category Filters (`ALL`, `MOLD`, `CUTTER`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `PLUG`). Clicking an equipment item cascades context to Step 3 & Step 4!
  3. **STEP 3 (Job Directive & Target Scope Hub)**:
     - Filtered jobs strictly by the selected equipment item.
     - Added **Target Scope Selector (`対象区分`)**: `FULL_SET` (一式), `MOLD_ONLY` (金型のみ), `PLUG_ONLY` (プラグのみ), `CUTTER_ONLY` (抜型のみ). Selecting `PLUG_ONLY` automatically sets job title to `[プラグ] 修正・削り出し` and scopes steps to plug machining!
  4. **STEP 4 (Worklogs Hub)**:
     - Filtered worklogs strictly by the selected job and equipment.
     - Added inline `+ 実績ログ追加` form to add real-time worklogs tied to the job.
  5. **Step-by-Step Edit & Save**:
     - Added `💾 このステップのみ保存` button on each step header and `💾 全一括保存実行` button on the footer.

---

## 🛠️ Verification & Compilation

- `npx tsc --noEmit` ➔ **0 errors**.
- Local Git Commits: `ec64d5b`, `4248771`, `1bddc17`, `91d30d0`.

### 2. Giai ?o?n 2 - Sub-phase 5a (Jobs Core Logic & API)
- **Status:** Hoan thanh
- **Commit:** 28482cf1ba67fc37be4cdadc065307db6b2a84d7
- **Chi ti?t:** 
  - ?a fix active bug ? QuickLinkMoldModal.tsx va linkJobToPhysicalMoldAction (payload c? ghi equipment_id vao c?t physical_mold_id gay l?i FK).
  - Apply diff ??ng b? equipment_id cho 6 file core: QuickLinkMoldModal.tsx, ctions/mold-job.ts, ctions/quick-mold-job.ts, jobs/[id]/page.tsx, jobs/page.tsx, quick-create/page.tsx.
  - Khong c?n ??i DB migration, t?n d?ng c?t equipment_id ?a backfill ?? data.
  - Compile 	sc PASS (0 errors).
  - S?n sang chuy?n qua Sub-phase 5b/5c/5d.

*L?i TS t?n t?i t? tr??c: 3 file query 4 b?ng log (forming/press/grinding/inspection_daily_logs) ch?a c?p nh?t database.types.ts, c?n npm run db:types. Ch?a c?n x? ly hom nay.*

### 3. Giai ?o?n 2 - Sub-phase 5b (Equipment Detail & Modals)
- **Status:** Hoan thanh (Commit: 39eb713)
- **Chi ti?t:** ?a thay th? query physical_mold_id sang equipment_id cho 5 component.

### 4. Giai ?o?n 2 - Sub-phase 5c (Engineering & Product Center + Fix Regression)
- **Status:** Hoan thanh (Commit: 62f4a70)
- **Chi ti?t:** Fix l?i regression ng?m t?i 4 component do 5a. D?n d?p TabOverview.

### 5. Giai đoạn 2 - Sub-phase 5d (Jobs Reports)
- **Status:** Hoàn thành (Commit: 977c352)
- **Chi tiết:** Migrate alias physical_molds sang equipment trong query và logic render của daily-worklog/page.tsx.

---

## 🎯 PRIORITY 6 - Products / Design / Equipment Migration (Phase D - Nhóm B)
Dựa trên kết quả rà soát toàn cục (Grep), Priority 5 đã hoàn thành trọn vẹn và 16 file còn lại chứa physical_molds (không thuộc scope jobs) sẽ được xử lý trong Priority 6.
Danh sách chia sub-phase:

- **Sub-phase 6a: Server Actions & APIs (3 file)**
  - src/app/actions/mold-revise.ts
  - src/app/actions/production.ts
  - src/app/api/production-instructions/[id]/pdf/route.ts
- **Sub-phase 6b: Engineering & Master Data (5 file)**
  - src/app/engineering/designs/[moldMasterId]/page.tsx
  - src/app/engineering/designs/revisions/[id]/page.tsx
  - src/app/engineering/designs/revisions/[id]/tabs/OverviewTab.tsx
  - src/app/master/products/[id]/page.tsx
  - src/app/master/products/[id]/tabs/OverviewTab.tsx
- **Sub-phase 6c: Product Center & Equipment Components (5 file)**
  - src/app/product-center/[id]/_components/EquipmentQuickPreviewModal.tsx
  - src/app/product-center/[id]/_components/SectionEquipment.tsx
  - src/app/product-center/[id]/_components/TabOverview.tsx
  - src/components/equipment/DesignPhysicalMoldsList.tsx
  - src/components/equipment/MoldModal.tsx
- **Sub-phase 6d: Production & Aluminum (3 file)**
  - src/app/production/mold-orders/page.tsx
  - src/app/production/molds/actions.ts
  - src/app/equipment/aluminum/page.tsx

### Cập nhật Database Schema (Giai đoạn 3 - Migration FK)
- **Status:** Hoàn thành (Bởi PE)
- **Thời gian:** 2026-08-26
- **Chi tiết:** Constraint production_instructions_physical_mold_id_fkey đã được repoint trỏ vào bảng equipment(equipment_id). Mở khóa cho việc migrate API PDF.

### 6. Sub-phase 6a (Server Actions & APIs)
- **Status:** Hoàn thành (Commit: fcda289)
- **Chi tiết:** Update query PDF route .select('..., equipment(equipment_id, equipment_code, display_name), ...') và cập nhật component ProductionInstructionPDF. mold-revise.ts và production.ts giữ nguyên (đã khớp cấu trúc DB hiện tại).

### 7. Sub-phase 6d (Production & Aluminum)
- **Status:** Hoàn thành (Commit: 0f889d9)
- **Chi tiết:** Đã cập nhật alias query và render (từ physical_molds(system_code) sang equipment(equipment_code)) trong src/app/equipment/aluminum/page.tsx.
- **Lưu ý:** Hai file mold-orders/page.tsx và molds/actions.ts giữ nguyên do đã khớp với kiến trúc schema (FK đã trỏ đúng nhưng tên cột vẫn là physical_mold_id).

- 12:42 - Đã hoàn tất Sub-phase 6b: migrate Master/Engineering sang equipment, fix lỗi data (commit c241202).

- 13:27 - Patch bổ sung cho 6b: fix các lỗi sót physical_mold_id/system_code refs bị missed ở các thẻ link (commit 437355c).


## Session 2026-09-02 — M6 Phase A & B Completed

### Applied Migrations
- 081: work_logs.quantity_ng (applied ✅)
- 082: shipments.order_line_id FK (applied ✅)
- 083: job_qc_logs + outgoing_qc_records (applied ✅)

### UI Delivered (Phase B)
- /production/qc — list + form
- /orders/shipments — list + form

### Open Tech Debt
- TD-006: CHECK constraints quantity_ng >= 0
- TD-007: Regenerate database.types.ts
- TD-008: Verify QC page await createClient fix
- TD-009: Workflow trigger Job→QC→Shipment (Phase C)

### Rule Update
- database.types.ts KHÔNG đáng tin cậy sau M6 — bắt buộc verify qua information_schema
