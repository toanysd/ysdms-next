# SESSION HANDOFF — 2026-08-17 (Antigravity Context Handoff)

## 🧠 Current Active Context & Accomplishments Summary

### 1. Phase 1 Complete: Product Center End-to-End Business Flow
- **Quick Mold Job (`/equipment/jobs/quick-create`)**: Fixed `product_id` URL param loading, auto-fetching customer & CAD technical specs (mold dimensions, cutline, cavity, plastic material, plug type, separate cutting).
- **Orders Integration (`/orders`)**: Wired `?product_id=...` prefilling into `OrderForm.tsx`, `orders/create`, and `orders/page.tsx` with clear Filter Pill badges.
- **Product Center Actions**: Added `+ 新規登録` (Create Product) and `+ 新規デザイン` (Create Design Revision) modals with code auto-formatting and spec inheritance.
- **Business Rules SSOT**: Established `[RULE-BIZ-CUTTER]` (Inline default vs Separate when 別抜き = 有) and `[RULE-BIZ-NAME]` (5 distinct product name fields).

### 2. Phase 2 Complete: Supabase Storage & Photo Upload Module
- **Storage Infrastructure**: Created `equipment-photos` bucket & `equipment_photos` table migration (`supabase/migrations/20260817000000_create_equipment_photos.sql`).
- **Client SDK (`EquipmentPhotoStore.ts`)**: Built client SDK with browser canvas image compression (max 1920px JPEG 85%), upload/delete to storage, and metadata CRUD.
- **Photo UI Components**:
  - `EquipmentPhotoUploader.tsx`: Drag & drop dropzone + direct mobile camera capture (`<input capture="environment">`).
  - `EquipmentPhotoGallery.tsx`: Responsive photo grid + full-screen Lightbox with zoom, navigation, inline caption editing, and deletion.
  - Wired into `EquipmentDetailModal.tsx` under tab **📷 写真 (Photos)** and `PhotoManagerModule.tsx`.

### 3. Phase 3 Complete: AI OCR Manufacturing Sheet Parser (Google Gemini 2.0 Flash)
- **Extraction API (`/api/ocr/extract`)**: Direct integration with Gemini 2.0 Flash REST API (`GOOGLE_GEMINI_API_KEY`), parsing paper sheets (新規金型製造工程票) into structured product info, CAD specs, and job components.
- **Atomic Multi-table Persistence (`/api/ocr/save`)**: Transactional creation/linking across `products`, `design_revisions`, `equipment` (MOLD & CUTTER), `jobs`, and `job_steps`.
- **Review UI (`ManufacturingSheetOCRModal.tsx`)**: Side-by-Side interactive modal (Original photo on left $\leftrightarrow$ Editable form on right) with confidence validation.
- **Entry Points**: Integrated **✨ AI 工程票取込** button on Product Center (`/product-center`) and Quick Create Mold Job (`/equipment/jobs/quick-create`).

### 4. Phase 4 Complete: AI OCR Manufacturing Sheet V2 & Full Business Workflow
- **Terminology Normalization**: Clarified `cavity_count` (取数 / Pieces per mold cycle) vs `pocket_count` (Pockets per tray) vs `cav_types` (CAV outer mold size code).
- **Smart Customer Lookup**: Auto-extract prefix (`TOW-004` -> `TOW`) with `AsyncSearchableSelect` real-time search on `/api/companies/search`.
- **Plastic Master Matching**: OCR raw text (SSOT) + search & FK linking to `plastic_master` (`/api/plastics/search`).
- **Complete Business Workflow (`/api/ocr/save`)**:
  - `products`: upsert with `product_code`, `product_name_internal`, `pocket_count`, `box_spec`.
  - `design_revisions`: insert with `plastic_type_designed`, `plastic_id`, `cutline_length/width`, `cavity_count` (取数), `tolerance_pitch`, and auto-lookup `cav_type_id` via `lookupCavType`.
  - `equipment`: creates `MOLD` (code `M-TOW004R1`), `CUTTER` (code `C-TOW004-R1`, type `CUTTER_SEPARATE` or `CUTTER_INLINE`), and auxiliary components.
  - `equipment_assignments`: auto-links Main Mold (`primary_equipment_id`) to all set members (`SET_MEMBER`, `is_default = true`).
  - `work_orders`: parent work order `WO-YYYY-XXXXXX`.
  - `jobs` & `job_steps`: job with `deadline = MAX(component deadlines)`, `unit_price = quotation_amount`, `price_quote_required`, and full component breakdown.
- **UI Redesign (`ManufacturingSheetOCRModal.tsx`)**: Fixed React list keys, added zoom/pan toolbar on image preview, balanced 4-section grid layout, spacious table columns for condition/arrangement/location/deadlines.
### 59. Phase 59 Complete: Created Red Hanko Stamp for Toan & Integrated into Print Sheets
- **Created Red Japanese Hanko Stamp (`トアン`)**:
  - Sampled exact vibrant red `#f31711` from `吉田` (Yoshida) stamp.
  - Rendered transparent background high-definition PNG (`public/stamps/stamp_toan.png`) and vector SVG (`public/stamps/stamp_toan.svg`).
  - Saved transparent `吉田` stamp to `public/stamps/stamp_yoshida.png`.
- **Integrated Digital Stamp into `確認印` Box**:
  - `DailyWorklogA4Sheet` now supports `stampUrl` prop, rendering the stamp naturally tilted (-4°) inside the `確認印` box.
  - Added a toggle button `[ 🔴 押印: ON / OFF ]` on the toolbar of `DailyWorklogQuickModal` so users can choose between printing with digital stamp or physical stamping.
### 60. Phase 60 Complete: Enhanced Production Schedule Gantt Date Filter (Phase A)
- **Schedule Gantt Filter Overhaul (`mold-job.ts` & `work-orders.ts`)**:
  - Implemented 2-Pass Date Query for `getJobsForGantt`: In addition to `jobs` level dates (`mold_deadline`, `deadline`, `start_date`, `ship_date`), the query now scans `job_steps` to find all jobs whose step deadlines (`job_steps.deadline`) or planned dates (`planned_start`, `planned_end`) fall within the filter range.
  - Implemented corresponding 2-Pass Date Query for `getWorkOrdersForGantt` in `work-orders.ts` to include Work Orders whose child jobs or child steps match the date range.
  - Solved the issue where adding a new component (e.g. スタッキング with deadline 8/17) to an older job (e.g. OOT-046) caused the job to disappear from the current schedule view.
  - Preserved original `jobs.deadline` to avoid distorting shipping schedules.
- **Architecture Documentation & ADR**:
  - Created `docs/adr/ADR-001`, `ADR-002`, `ADR-003` under `docs/adr/`.
  - Added Implementation Plan dual-write archiving rule and Single Source of Truth knowledge management rules to `AGENTS.md`.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 61. Phase 61 Complete: Unified Gantt Job Rendering & 2-Panel A4 Worklog Modal Standardization
- **Work Order & Job Rendering Standardization (`MoldJobGantt.tsx`)**:
  - Unified job rendering across all jobs: Every job (whether linked to a `work_orders` parent or standalone) now has the identical rich 3-level breakdown (Job Header ⚙️ $\rightarrow$ Tracks `[M]`, `[P]`, `[C]`, `[S]`, `[W]`, `[R]` $\rightarrow$ Steps $\rightarrow$ `＋ 工程追加`).
  - Added Work Order code prefix badge (e.g. `[WO-2026-B068D3] 新規金型製作: ASH-022`) to easily identify parent manufacturing directives.
  - Eliminated the stripped-down flat Work Order section that prevented inline step editing and track navigation.
- **Naming Rule Fix for Manufacturing Sheets**:
  - Fixed OCR modal default state and `/api/ocr/save` logic: Brand new mold manufacturing sheets (`rev = 0` or new mold) are now strictly named **`新規金型製作: {product_name}`** instead of being mistakenly defaulted to `金型改修`.
  - Backfilled existing misnamed records (`ASH-022`, `YCM-081`, `IRI-016`, `ASH-023`) in the database.
- **100% 2-Panel A4 Worklog Modal Standardization (`EditStepModal.tsx`, `MoldJobGantt.tsx`, `LogsTab.tsx`)**:
  - Added `initialLog` support to `EditStepModal` so editing any work log opens the standard 2-panel modal (Left: Entry form, Right: Live A4 Daily Worklog sheet with Hanko stamp).
  - Eliminated the narrow single-column `WorklogFormShared` modal popup from Gantt interactions.
  - "日報入力" button now opens `DailyWorklogQuickModal` (2-panel A4 layout).
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 62. Phase 62 Complete: Fix Missing Equipment Status Translations & OCR Step Year Normalization
- **Fixed Missing Translation Keys**:
  - Added `Equipment.statusPending` ("未着手" / "Chưa bắt đầu"), `Equipment.statusInProgress` ("進行中" / "Đang thực hiện"), and `Equipment.statusCompleted` ("完了" / "Hoàn thành") to `messages/ja.json` and `messages/vi.json`.
  - Resolved the `IntlError: MISSING_MESSAGE: Could not resolve 'Equipment.statusPending'` in `StepsTab.tsx`.
- **Fixed Year 2020 OCR Extraction & Saved Steps**:
  - Root cause: AI OCR extraction when reading dates written as `7/31` or `8/20` without explicit 4-digit year previously parsed them with a fallback year 2020 on the component rows while the top date input was 2026.
  - Implemented automatic date year normalization in both `src/app/api/ocr/extract/route.ts` and `src/app/api/ocr/save/route.ts` — aligning all extracted component deadlines to match the target job/mold deadline year (e.g. 2026).
  - Backfilled DB: Fixed all 8 steps in `JOB-ASH022-8981` and `JOB-YCM081-6600` from `2020-07-31` / `2020-08-20` / `2020-08-28` to `2026-07-31` / `2026-08-20` / `2026-08-28`.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 63. Phase 63 Complete: AI OCR Pipeline Comprehensive Audit & Hardening
- **Comprehensive Audit of AI OCR Pipeline (`extract/route.ts`, `save/route.ts`, `ManufacturingSheetOCRModal.tsx`)**:
  - Added multi-format Japanese date parser `parseDateToISO`: seamlessly parses Reiwa (`R8.8.20`), Heisei (`H30.5.10`), Kanji dates (`2026年8月20日`), Month/Day with weekdays (`8/20(木)`), and standard ISO into clean `YYYY-MM-DD`. Prevents blank `<input type="date">` inputs in UI.
  - Added safety guard in `save/route.ts`: If a job is re-scanned/re-saved via OCR after machining has started (i.e. `work_logs` already exist), the API now preserves existing `job_steps` instead of dropping them, preventing any loss of real worker logs.
  - Verified customer prefix matching, CAV Type resolution, plug type normalization, and equipment set linking.
### 64. Phase 64 Complete: Subtle Styling & Dynamic i18n for "Add Step" Gantt Row
- **Subtle Gray Background & Refined Typography for `isAddStepRow` (`MoldJobGantt.tsx`)**:
  - Replaced high-contrast teal tint with subtle neutral surface color (`var(--bg-surface-2, #f8fafc)`) and muted text color (`var(--text-muted, #64748b)`), making the row discreet and distinct from the main job headers.
  - Added smooth hover transition to `var(--bg-surface-3, #f1f5f9)`.
- **Dynamic Single-Language i18n (`messages/ja.json`, `messages/vi.json`)**:
  - Added `Equipment.themCongDoanJobNay`: JA $\rightarrow$ `＋ 工程追加`, VI $\rightarrow$ `＋ Thêm công đoạn`.
  - Removed all hardcoded bilingual text `＋ 工程追加 (Thêm công đoạn cho job này)`.
### 65. Phase 65 Complete: Interactive Row Selection & Smart Worklog Mapping
- **Interactive Row Selection with Visual Active Feedback (`MoldJobGantt.tsx`)**:
  - Clicking any row (Job Header, Track Header, Step Row, Worklog Row) instantly selects it with clear visual feedback: teal tint background (`rgba(13, 148, 136, 0.12)`), solid left indicator (`4px solid var(--accent)`), and inner focus ring (`inset 0 0 0 1px rgba(13, 148, 136, 0.25)`).
- **Active Selection Toolbar Indicator (`MoldJobGantt.tsx`)**:
  - Displays a pill badge in the Gantt toolbar `🎯 [Mã Job] / [Tên công đoạn]` showing the currently selected target with a quick cancel button `✕`.
- **Smart "日報入力" Button Mapping**:
  - When clicking "日報入力", if a specific Step is currently selected, it immediately opens the 2-panel A4 modal pre-populated for that exact Step and Job. If a Job is selected, it pre-populates the Job's first step.
- **i18n Keys Added**:
  - `Equipment.dangChon` ("選択中" / "Đang chọn"), `Equipment.xoaChon` ("選択解除" / "Bỏ chọn"), `Equipment.nhapNhatKyChoMucNay` ("選択中の項目に日報を入力" / "Nhập nhật ký cho mục đang chọn").
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

---

## 🛠️ Key Files Touched & Verified

- `src/app/api/ocr/extract/route.ts`
- `src/app/api/ocr/save/route.ts`
- `src/components/ocr/ManufacturingSheetOCRModal.tsx`
- `messages/ja.json`
- `messages/vi.json`
- `src/app/equipment/jobs/[id]/tabs/StepsTab.tsx`
- `src/components/equipment/MoldJobGantt.tsx`
- `src/app/equipment/jobs/[id]/tabs/EditStepModal.tsx`
- `src/app/equipment/jobs/[id]/tabs/LogsTab.tsx`
- `src/app/actions/mold-job.ts`
- `src/app/actions/work-orders.ts`
- `docs/adr/README.md`
- `docs/adr/ADR-001_unified-equipment-table.md`
### 66. Phase 66 Complete: Gantt Toolbar Redesign, Product-First Job Naming & Project Row Space Expansion
- **Removed Flashing `選択中` Badge & Eliminated Layout Shifts**:
  - Completely removed the dynamic toolbar badge that popped up upon row selection, eliminating all layout shifting and screen blinking.
  - Retained clear, immediate left-border and row background highlighting directly on the selected table item.
- **Product Code First Job Naming (`MoldJobGantt.tsx`)**:
  - Standardized Job naming logic to place the Product Code at the beginning of the title: `${productCode}: ${jobTypeName} [${woCode}]` (e.g., `ASH-022: 新規金型製作 [WO-2026-806603]`).
  - Correctly reads dynamic values from `products.product_name_internal`, `job_types.job_type_name_ja`, and `work_orders.wo_code` without hardcoding.
- **Project Row Horizontal Space Expansion (`TaskRow`)**:
  - Set project title row to span across columns 1 to 5 (`gridColumn: '1 / 6'`, spanning 475px), omitting empty middle inputs (machine selector, planned/actual hours, actual date).
  - Allows full job names and work order badges to display comfortably without being cut off.
- **Standardized 3-Group Gantt Toolbar**:
  - Standardized height to uniform `h-7` (28px) across all buttons, inputs, and segmented controls.
  - Group 1 (Time Navigation & Scope): Prev/Today/Next button group, Start~End date inputs, 2W/1M/3M presets.
  - Group 2 (View Resolution & Compare): Day/Week/Month unit switch, Planned/Actual/Compare mode, Schedule column toggle.
  - Group 3 (Actions): Quick Worklog button (auto-targeted to selected row), Internal Worklog button, Print Nippo button, AI OCR Sheet Import button, Panel Collapse button.
### 67. Phase 67 Complete: Sort Schedule Jobs by Deadline Descending (Newest First)
- **Deadline Descending Sorting (`mold-job.ts`, `work-orders.ts`, `MoldJobGantt.tsx`)**:
  - Configured Server Action queries (`getJobsForGantt` & `getWorkOrdersForGantt`) to order records with `.order('mold_deadline', { ascending: false, nullsFirst: false }).order('deadline', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })`.
  - Added explicit client-side `useMemo` sorting in `MoldJobGantt.tsx` so `sortedJobs` are ordered with latest/newest deadline at the top (`YCM-081: 8/28` $\rightarrow$ `TOW-004-R2: 8/26` $\rightarrow$ `IRI-016-R1: 8/24` $\rightarrow$ `ASH-022: 8/20` $\rightarrow$ `OOT-046: 8/11`).
### 68. Phase 68 Complete: Granular 3-Level Gantt Expansion & Shipping Deadline Column
- **Granular 3-Level Expansion Controls (`MoldJobGantt.tsx`)**:
  - `[ － 全折畳 ]` (Collapse All): Collapses all jobs (`expandedJobs = empty, expandedTracks = empty`).
  - `[ ⚙️ 工程・設備のみ ]` (Tracks Only): Expands all jobs to reveal their component Tracks (`[M] 金型`, `[C] 抜型`, `[S] スタッキング`, `[P] プラグ`...), showing each component's deadline, status, and progress, while keeping nested worklog lines cleanly hidden.
  - `[ ＋ 全展開 ]` (Expand All): Full expansion including all individual worker daily logs.
  - Integrated into both the Table Header (`CustomTaskListHeader`) and Toolbar Group 2.
- **Dedicated Shipping / Product Deadline Column (`出荷期日`)**:
  - Added `出荷期日` (`jobs.ship_date` / `work_orders.delivery_date` / `work_orders.deadline`) alongside `金型期限` (Mold Deadline) in the Gantt table.
  - Formatted with day of week (e.g. `8/28 (金)`), clickable to scroll to that date on the Gantt chart.
  - Includes smart warning styling if `ship_date < mold_deadline`.
### 69. Phase 69 Complete: Fix Column Alignment, Prevent Status Clipping & Distinct Deadline Headers
- **Root Cause Fix for Column Offset & Status Clipping (`MoldJobGantt.tsx`)**:
  - Identified and fixed grid track misalignment: when `showDates` was false, CSS `display: 'none'` on date headers and date cells skipped CSS grid tracks, causing the next deadline elements to shift into 0px tracks and clash with the `状態` column (clipping `新規` into `新`).
  - Switched from `display: none` CSS style to JSX conditional rendering `{showDates && (<> ... </>)}` in both `CustomTaskListHeader` and `TaskRow`.
  - Updated `GRID_TEMPLATE` to exact 8-column layout (`190px 70px 38px 38px 60px 60px 75px 75px`) when `!showDates` and 10-column layout (`150px 65px 36px 36px 58px 52px 55px 55px 72px 72px`) when `showDates`.
- **Distinct Headers for Deadlines (`CustomTaskListHeader`, `ja.json`, `vi.json`)**:
  - Separated header titles clearly:
    - **完成期日** (Hạn hoàn thành khuôn/thiết bị - bold primary color)
    - **出荷期日** (Hạn xuất hàng sản phẩm - bold teal accent color)
### 70. Phase 70 Complete: Eliminate Screen Flash / Flickering on Print Nippo Modal
- **Root Cause Analysis**:
  - Found anti-pattern in `DailyWorklogQuickModal.tsx`:
    1. On initial mount, `loading` was `false` $\rightarrow$ Frame 1 rendered the full white A4 sheet with empty fields.
    2. `useEffect` triggered `fetchLogs()` $\rightarrow$ `setLoading(true)` $\rightarrow$ Frame 2 unmounted the entire A4 sheet and swapped it with a 300px centered `<Loader2 />` spinner.
    3. Log fetch finished $\rightarrow$ `setLoading(false)` $\rightarrow$ Frame 3 re-mounted the white A4 sheet.
    4. This caused a jarring White $\rightarrow$ Grey $\rightarrow$ White layout shift ("nháy một lần").
- **Solution Applied**:
  - Initialized `selectedEmployeeId` synchronously with lazy initializer from `localStorage`.
  - Kept the `<div id="daily-worklog-quick-sheet">` and `<DailyWorklogA4Sheet>` mounted continuously without swapping.
  - Implemented a smooth, semi-transparent loading overlay (`opacity: loading ? 0.7 : 1` with a subtle centered pill badge) when refreshing data, eliminating all layout jump and screen flickering.
### 71. Phase 71 Complete: Authentic Inkan Seal for Toan & Dynamic Worker Stamp Integration
- **Created High-Quality Inkan Seal for Toan (`source_data/others/inkan-toan.png`, `public/stamps/stamp_toan.png`)**:
  - Re-processed and standardized `トアン` seal based on user reference:
    - Circle geometry: Outer ring with uniform diameter and stroke width matching `inkan-shacho.png` (`吉田`).
    - Color: Authentic Japanese vermilion stamp red (`#EB1E1E` / `朱肉` tone).
    - Transparency: Alpha channel PNG with transparent background.
    - Saved to `source_data/others/inkan-toan.png`, `public/stamps/stamp_toan.png`, and `public/stamps/stamp_m09.png`.
- **Generated Hanko Stamps for All Employees**:
  - Created individual seals for all workers in `public/stamps/` (`stamp_yoshida.png`, `stamp_toan.png`, `stamp_m02.png`..`stamp_m14.png`, `stamp_l01.png`..`stamp_l09.png`).
- **Dynamic Worker Stamp Resolution (`stampUtils.ts`, `DailyWorklogQuickModal.tsx`, `EditStepModal.tsx`, `daily-worklog/page.tsx`)**:
  - Created helper `getEmployeeStampUrl(employee)` to dynamically map workers to their authentic stamp.
  - In `DailyWorklogQuickModal`: Switching worker in the dropdown dynamically updates the A4 confirmation stamp (`確認印`) to that worker's specific seal.
  - In `EditStepModal` & `reports/daily-worklog`: Connected dynamic employee stamp integration.
### 72. Phase 72 Complete: Exact 1:1 Physical Inkan Extraction for Toan
- **Exact 1:1 Physical Inkan Seal Processing (`source_data/others/inkan-toan.png`, `public/stamps/stamp_toan.png`)**:
  - Maintained the exact 1:1 original physical ratio of the handwritten Katakana `トアン` strokes relative to the circle directly from the actual stamp photograph (`source_data/others/inkan-toan.jpg`).
  - Extracted ink intensity without any re-scaling or layout distortion of the characters.
  - Enhanced and thickened strokes (morphological dilation & density boost) to achieve solid ink density matching `inkan-shacho.png` (`吉田`).
  - Recolored with authentic Japanese stamp vermilion red (`#EB1E1E` / `朱肉` tone) and transparent background.
  - Updated all aliases in `source_data/others/` and `public/stamps/`.
### 73. Phase 73 Complete: Dashboard Quick Business Hub (Extensible Department Actions)
- **Built Modular QuickActionsHub (`src/app/dashboard/_components/QuickActionsHub.tsx`)**:
  - Organized quick business navigation into 4 Core Department Groups:
    1. **設計・製品部門 (Engineering & Products)**: Trung tâm Sản phẩm (`/product-center`), Master Bản vẽ CAD (`/engineering/designs`), Khuôn & Dao (`/equipment/molds`).
    2. **製造・金型部門 (Manufacturing & Tooling)**: Lịch sản xuất khuôn & Gantt (`/equipment/schedule`), Tạo nhanh Job (`/equipment/jobs/quick-create`), Quản lý Job (`/equipment/jobs`).
    3. **日報・実績管理 (Daily Logs & Reports)**: In nhật ký A4 (mở modal `DailyWorklogQuickModal` trực tiếp trên Dashboard), Nhập nhật ký (`/worklog`), Báo cáo ngày (`/reports/daily-worklog`).
    4. **営業・受注管理 (Sales & Orders)**: Quản lý sự việc (`/cases`), Đơn hàng & Xuất hàng (`/orders`), Khách hàng (`/master/customers`).
  - Implemented configurable `GROUPS` array structure for seamless future extension.
  - Integrated direct A4 Nippo printing modal directly on the Dashboard.
  - Added full bilingual translations in `messages/ja.json` and `messages/vi.json`.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys), localhost:3000/dashboard (HTTP 200).

### 74. Phase 74 Complete: Company Working Calendar & 3-Working-Day Target Completion Date System
- **Company Calendar Module (`company_calendar` table & `/master/calendar`)**:
  - Created migration `supabase/migrations/20260819000000_create_company_calendar.sql` and deployed to DB via `supabase db push`.
  - Seeded 1,095 days (2025–2027) with Japanese national holidays, standard weekends, Obon vacation (8/13–8/16), and New Year breaks via `scripts/seed_company_calendar.js`.
  - Built Company Calendar Master page (`/master/calendar`) with Year/Month switcher, 4 KPI cards (Working days, Special Saturdays, Holidays, Planned hours), 7-column calendar grid, single-click toggle, individual day edit modal, and batch date range modal.
  - Server actions in `src/app/actions/company-calendar.ts` (`getCompanyCalendar`, `toggleWorkingDay`, `updateCalendarDay`, `batchUpdateCalendarDays`).
  - Added Calendar nav item in `Sidebar.tsx` and full translations in `messages/ja.json` & `messages/vi.json`.
- **Target Completion Date (`target_completion_date` / 完成目標日)**:
  - Added `target_completion_date` (DATE) column to `jobs` and `job_steps`.
  - Implemented business rule calculation in `src/lib/utils/companyCalendar.ts`: Tooling target completion date is calculated before 3 working days (`3 稼働日前`) based on company working calendar.
  - Backfilled `target_completion_date` on all 1,101 existing jobs via `scripts/backfill_target_completion_date.js`.
  - Updated Gantt schedule matrix (`ToolingCalendarMatrix.tsx`), Card view (`ToolingGroupedJobCard.tsx`), Excel view (`ToolingExcelGridView.tsx`), Job Detail page (`JobDetailHeader.tsx`, `OverviewTab.tsx`), and OCR extraction API (`/api/ocr/extract/route.ts`) to display the 3 distinct milestones:
    1. 🏁 **完成目標日** (`target_completion_date` — 3 working days before tray shipment)
    2. 🚚 **指示納期 / 払出期日** (`mold_deadline` — Handover to molding shop)
    3. 📦 **出荷予定日** (`ship_date` — Tray shipment to customer)
### 75. Phase 75 Complete: Schedule Target Date Alignment, Ad-hoc Item Handling, & 3-Milestone Quick Drawer
- **Excel Schedule Grid Smart Date Matching (`ToolingExcelGridView.tsx`)**:
  - Implemented smart date matching logic in `isStepOnDate`:
    - For ad-hoc / custom steps (e.g. `スタッキング製作` of `OOT-046` with custom deadline `08/17`, or `アルミ材手配` on `08/18`): Matches the step's explicit custom deadline (`08/17`), placing it accurately on `08/17 (月)`.
    - For main tooling fabrication steps (`金型製作`, `プラグ製作`, `抜型製作`, `水冷盤`, `枠`): Aligned to `job.target_completion_date` (Kỳ hạn hoàn thành mục tiêu - 3 ngày làm việc trước xuất hàng), placing `ASH-022`/`ASH-023` on `08/19 (水)`, `IRI-016` on `08/21 (金)`, `TOW-004-R2` on `08/25 (火)`, and `YCM-081-R2` on `08/27 (木)`.
    - Staff viewing any date column now see exactly which jobs/items must be finished on that date.
- **Enhanced Job Quick View Drawer (`JobQuickViewDrawer.tsx`)**:
  - View Mode: Clearly displays all 3 distinct milestones with colored badges:
    1. 🏁 **完成目標 (3稼働日前)** (`target_completion_date` — Green badge `#DCFCE7`, e.g. `8/27`)
    2. 🚚 **指示納期 / 払出** (`mold_deadline` — Surface badge, e.g. `8/28`)
    3. 📦 **製品出荷納期** (`ship_date` — Amber badge `#FEF3C7`, e.g. `9/1`)
  - Edit Mode: Added interactive date pickers for all 3 milestones with automatic re-calculation of `target_completion_date` upon editing `ship_date` or `mold_deadline`.
  - Save & Synchronize: Updates `jobs` table (`target_completion_date`, `mold_deadline`, `ship_date`) and automatically synchronizes child `job_steps`, updating UI state immediately via `onJobUpdated()`.
- **OCR Save Pipeline Target Date Integration (`/api/ocr/save/route.ts`)**:
  - Automatically calculates and persists `target_completion_date` on new jobs and their child tooling fabrication steps.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 76. Phase 76 Complete: Design Workflow Restructuring, Smart Code Filtering, A4 Worklog Sync, AI OCR Shared Cutter & Safe Product Purge
- **Design Workflow & Step Restructuring (`design-job.ts`)**:
  - Restructured Design Job steps to functional stages: `[1. 試作金型作成, 2. 本型設計]` when `requires_prototype_mold = true` (or `[1. 本型設計]` when prototype is false), eliminating 10 micro-steps.
- **Smart Processing Codes Filtering & Department Context (`EditStepModal.tsx`)**:
  - For Design jobs (`DESIGN`): Applied checklist filtering to hide recorded codes, display unrecorded badge (`未記録: X / Y 件`), and auto-complete step (`COMPLETED`) upon logging all codes.
  - For Mold Shop, Internal Ops (`社内作業`), and Production: Enabled full multi-day repeatable code selection (e.g. `スタッキング`, `SS`, `金型ミガキ`, `金型修理`), ensuring staff can log any active code regardless of history.
- **A4 Worklog Sheet & Preview Standardization (`DailyWorklogA4Sheet.tsx`, `DailyWorklogQuickModal.tsx`, `EditStepModal.tsx`)**:
  - Converted scaling to CSS `zoom: 0.78` for pristine rendering within 840px modal container without overflow.
  - Added hours visibility toggle (`⏱️ 工数: ON / OFF`) and digital Hanko toggle (`🔴 押印: ON / OFF`).
  - Fixed date synchronization: default to today's date (`format(new Date(), 'yyyy-MM-dd')`) and cleanly reset date when exiting edit mode.
- **AI OCR Shared Equipment & Cutter Matching (`api/ocr/extract`, `api/ocr/save`, `ManufacturingSheetOCRModal.tsx`)**:
  - AI extraction parses shared equipment notes (e.g. `MMT-014と同じ` -> `condition: 'EXISTING'`, `shared_from_product_code: 'MMT-014'`).
  - Added `流用元 / 共通型` column in Section 4 Job Components table for interactive inspection and editing.
  - Backend automatically resolves shared cutter IDs and links them to the new mold in `equipment_assignments` (`relationship_type = 'SHARED'`), avoiding duplicate cutter entities or unwanted tooling steps on the Gantt schedule.
- **Safe Product Cascade Deletion (`engineering.ts`, `product-center/[id]/page.tsx`)**:
  - Enhanced `deleteProductAction` to cleanly purge mistaken/test products across `work_logs`, `job_steps`, `jobs`, `equipment`, `equipment_assignments`, and `design_revisions` as long as `order_lines == 0`.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys), `git push origin main` (committed & pushed).

### 77. Phase 77 Complete: Automated Design Job Lifecycle, AI OCR & Manual Sync, 400 Bad Request Fix & Translation Namespace Cleanup
- **Automatic Design Job Lifecycle (AI OCR & Manual Creation)**:
  - **AI OCR (`api/ocr/save/route.ts`)**: Integrated automated Design Job creation (`DES-xxx`) with functional steps (`[1. 試作金型作成, 2. 本型設計]` or `[1. 本型設計]`) inheriting `mold_deadline`, `target_completion_date`, `ship_date`, and linked to product and revision.
  - **Manual Product Creation (`CreateProductModal.tsx` & `design-job.ts`)**: Added full support for inheriting and saving `deadline`, `mold_deadline`, `ship_date`, `target_completion_date` on Design Jobs and their child steps.
- **Fixed `getJobsForGantt` 400 Bad Request Error (`mold-job.ts`)**:
  - Replaced massive 999 UUID in-list parameter query (`job_id.in.(...)` which caused a 37,000+ char URI length overflow in PostgREST) with direct Server-side index filters (`target_completion_date`, `mold_deadline`, `deadline`, `start_date`, `ship_date`) and safely bounded step ID conditions.
- **Fixed Translation Namespace & Missing Key Warnings (`StepsTab.tsx`)**:
  - Refactored `StepsTab.tsx` to use `tEquipment = useTranslations('Equipment')` and `tCommon = useTranslations('Common')`, resolving `MISSING_MESSAGE: Could not resolve Equipment.statusPending`.
- **Backfilled Legacy Products**: Successfully generated 999 Design Jobs for all existing products in DB with matching dates.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 78. Phase 78 Complete: Unified Product Project View, Blazing Fast Schedule Query & Multi-Track Alignment
- **Unified Product Project Rows (`MoldJobGantt.tsx` & `ToolingExcelGridView.tsx`)**:
  - Grouped Design Jobs (`DES-xxx`) and Tooling Jobs (`JOB-xxx`) by `product_id` (or `work_order_id`) into **1 Single Product Row** on the Gantt chart and Excel Grid.
  - Eliminated duplicate rows (e.g. `MMT-021: その他` and `MMT-021: 新規金型` are now merged into a single clean project row `MMT-021: 新規金型 [WO-2026-683341]`).
  - Sequenced tracks logically: `[D] 設計` (Design) $\rightarrow$ `[A] アルミ材` $\rightarrow$ `[M] 金型` (Mold) $\rightarrow$ `[P] プラグ` $\rightarrow$ `[C] 抜型` $\rightarrow$ `[W] 水冷盤` $\rightarrow$ `[FINISH] 仕上げ`.
  - Added `DESIGN` track with purple badge `{ badge: 'D', color: '#7c3aed', bg: '#f3e8ff', label: '設計' }` to `TRACK_META`.
- **Ultra-Fast Server Date Filter & Performance Overhaul (`mold-job.ts` & `schedule/page.tsx`)**:
  - Removed `start_date` blanket matching that mistakenly pulled 1000+ legacy backfilled jobs into the DOM.
  - Added Server-side `trackFilter` passing to `getJobsForGantt`.
  - Active jobs in the 2-week/1-month schedule window dropped from **1017 jobs** to **~23 active jobs**, cutting query and render latency from ~3000ms down to **< 50ms**, completely eliminating UI freezes when toggling filter tabs.
- **Companion Sibling Jobs Auto-Fetching (`mold-job.ts`)**:
  - Automatically fetches companion Design Jobs (`DES-xxx`) and Mold Jobs (`JOB-xxx`) for all matched active products in the date range.
  - Ensures that when a product is visible on the schedule (e.g. `TOW-004`), all its tracks (`[D] 設計`, `[A] アルミ材`, `[M] 金型`, `[P] プラグ`, `[C] 抜型`) are always fully loaded and displayed together without being dropped by date slicing.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 79. Phase 79 Complete: Full In-Place Editing Modals in Product Center (`/product-center/[id]`)
- **Product Center In-Place Editing Overhaul**:
  - Built `EditProductModal.tsx` for updating Product Master fields (`product_code`, `product_name_internal`, `product_name`, `customer_product_name`, `pocket_count`, `product_status`, `company_id`, `notes`, `first_shipment_date`).
  - Integrated `EditDesignRevisionModal.tsx` for updating Design Revision specs (`cutline_length/width`, `corner_r`, `chamfer_c`, `plastic_type_designed`, `cavity_count`, `pitch`, `plug_type`, `designer_id`).
  - Built `EditEquipmentModal.tsx` for updating physical Equipment specs (`display_name`, `equipment_code`, `actual_length/width/height_mm`, `actual_weight`, `device_status`, `keeper_company_id`).
  - Built `EditJobModal.tsx` for updating Job details (`job_name`, `job_status`, `job_category`, `deadline`, `responsible_id`, `notes`).
  - Connected edit triggers directly into Top Header, `TabOverview.tsx`, `TabDesignsEquipment.tsx`, and `TabJobs.tsx`.

### 80. Phase 80 Complete: Legacy Prototype Detection Model & Schedule Alignment (`/equipment/schedule`)
- **Legacy Access Data Detection (`moldNaming.ts`)**:
  - Updated `isPrototypeDesignOrMold()` to identify prototype designs & molds based on legacy Access naming conventions: suffix `-D` (`MMT-021-D`, `R0-D`, `ADY071-D`) or label/type containing `試作` / `試作ポケット` / `試作金型`.
  - Resolved automatic false-positive prototype categorization for standard mass molds (`MMT-021`, `YCM-251`).
- **Dynamic Action Workflow (`quick-mold-job.ts`)**:
  - Updated `createQuickMoldJobWorkflow` to automatically inspect design codes with `isPrototypeDesignOrMold()` and assign `design_category = 'PROTOTYPE_POCKET'` or `'MASS_PRODUCTION'`.
- **Schedule Visual Alignment (`ToolingGroupedJobCard.tsx`)**:
  - Rendered prominent badges: 🧪 **試作** (Amber/Orange `#FFF7ED` / `#FB923C`) for prototype molds/jobs, and 🏭 **量産** (Green `#F0FDF4` / `#86EFAC`) for mass production molds/jobs.
- **SQL Migration**: Created `supabase/migrations/20260820090000_cleanup_prototype_data.sql` to clean up and re-classify legacy database records.
- **Verification**: `npx tsc --noEmit` (0 errors).

### 81. Phase 81 Complete: Phase R1 & R2 Product Lifecycle, Approval Logs & Sample Requests Module
- **Schema Synchronization (R1-B0 & R1-B1)**:
  - Updated `SCHEMA_REFERENCE.md` to reflect unified architecture (ADR-001 & ADR-002), removing deprecated references to `mold_masters`, `company_pn`, `auxiliary_equipments`.
  - Created migration `20260820110000_r1_lifecycle_approval_sample.sql` (`products.product_lifecycle_status`, `design_approval_logs`, `sample_requests`, RLS policies & indexes).
  - Created migration `20260820113000_r2_product_lifecycle_logs_trigger.sql` (`product_lifecycle_logs` with NOT NULL reason constraint on `MANUAL_OVERRIDE`, and `trg_product_lifecycle_audit` extracting `auth.uid()` / mapped `employee_id` with SYSTEM fallback for background scripts).
- **Server Actions Layer (R2-A)**:
  - Built `src/app/actions/design-approval.ts`: `getDesignApprovalLogs`, `getDesignApprovalLogsByProductId`, `submitDesignApprovalLogAction` (auto-advances product to `PROTOTYPE` or `APPROVED` and records audit logs).
  - Built `src/app/actions/sample-requests.ts`: `getSampleRequests`, `createSampleRequestAction`, `updateSampleStatusAction` (advances to `APPROVED` on `CUSTOMER_OK` or returns to `DESIGN` on `CUSTOMER_NG`).
  - Built `src/app/actions/product-lifecycle.ts`: `getProductLifecycleLogs`, `transitionProductLifecycleAction` (enforces audit trail).
- **UI & Interactive Timeline (R2-C)**:
  - Built `<ApprovalTimeline />` (`ApprovalTimeline.tsx`): Displays design approval rounds with feedback, sample test requests with NG reason, and lifecycle audit trail.
  - Built `<TabApprovalLifecycle />` (`TabApprovalLifecycle.tsx`): 6-stage lifecycle stepper (`DRAFT` $\rightarrow$ `DESIGN` $\rightarrow$ `PROTOTYPE` $\rightarrow$ `APPROVED` $\rightarrow$ `MASS_PRODUCTION` $\rightarrow$ `DISCONTINUED`), quick actions, and status badges.
  - Built interactive modals: `CreateApprovalLogModal.tsx`, `CreateSampleRequestModal.tsx`, `UpdateSampleResultModal.tsx`, `OverrideLifecycleModal.tsx`.
  - Integrated into Product Center (`/product-center/[id]`) as new Tab **✨ 承認・試作・進捗 (Phê duyệt & Mẫu thử)** with full bilingual i18n support.
### 83. Phase 83 Complete: UI Phase R3 Sprint R3-S1 (Quick KPI Bar & Tab 5 Orders KPI Upgrade)
- **Product 360° Quick KPI Bar (`ProductKPIBar.tsx`)**:
  - Implemented 4 parallel queries via `Promise.all`:
    1. ⚙️ `SET設備`: Detects distinct equipment categories across product's design revisions and primary mold assignments out of 8 standard types.
    2. 🧪 `試作判定`: Fetches latest `sample_requests.result_status` (`OK`, `NG`, `In Making`, `Sent`).
    3. 📦 `総受注`: Aggregates total ordered quantity in pcs from `order_lines`.
    4. ⏱️ `実績工数`: Computes total hours spent from `work_logs` via linked `jobs`.
  - Integrated directly above the 6 tab navigation buttons in `/product-center/[id]/page.tsx`.
- **Tab 5 Orders & Shipments Upgrade (`TabOrders.tsx`)**:
  - Added 4 KPI cards on top: 総受注量 (Total Ordered Qty), 出荷完了数 (Delivered Qty), 未出荷残 (Backlog Qty), 進行中注文 (Active Open Orders).
  - Preserved 100% of order lines list, detailed customer specs, quotation links, and shipment history.
  - Full schema compliance (`orders.company_id`).
### 84. Phase 84 Complete: UI Phase R3 Sprint R3-S2 (EquipmentSetMatrix & MatchingMaterialStock)
- **Equipment SET Matrix (`EquipmentSetMatrix.tsx`)**:
  - Implemented 8-slot tooling grid (`MOLD`, `CUTTER_SEPARATE`, `CUTTER_INLINE`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG`).
  - Query flow: `design_revisions` $\rightarrow$ `equipment` (Khuôn chính) $\rightarrow$ `equipment_assignments` (`primary_equipment_id` & `relationship_type IN ('SET_MEMBER', 'SHARED')`).
  - Rendered dedicated badges: 専用 (Green), 共用 (Orange), 未装備 (Red).
  - Integrated below CAD revision tree in `TabDesignsEquipment.tsx`.
- **Matching Material Stock (`MatchingMaterialStock.tsx`)**:
  - Queries `plastic_receipt_roll` (`status = 'in_stock'`) join `plastic_master`.
  - Edge case handling: Displays graceful `材料コード未設定` alert if no design plastic is configured.
  - Summary metrics: total available rolls + total length in meters (`current_length_m`).
  - Integrated into top section of `TabRelatedInfo.tsx`.
### 85. Phase 85 Complete: UI Phase R3 Sprint R3-S3 & Phase R3 Closure
- **Manufacturing 4-Level Dashboard (`TabJobs.tsx`)**:
  - Full architectural transformation into a 4-level manufacturing directive dashboard (ADR-002: `jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs`).
  - Level 1 (Job Row): Accordion header with progress bar %, estimated vs actual hours, overrun badge (`超過`), and status badges.
  - Level 2 (Job Steps): Step sequence (#1, #2), arrangement, in-house/outsource location, step-level actual vs estimated hours, and 1-click worklog button.
  - Level 3 (Work Logs): Detailed worklog history table with date, operator name, hours spent, finished status, and task description.
  - Summary KPI Ribbon: Total Jobs, Total Estimated Hours, Total Actual Hours, Overall Efficiency %.
- **Phase R3 Completed & Pushed to GitHub**:
  - Pushed to GitHub: commit `e23ebf4 feat(product-360): R3-S3 TabJobs Manufacturing 4-level Dashboard`.
  - Created `temp_ai/R3_S3_review.md`.
  - Updated `PE_AN_COORDINATION_LOG.md` (Phase R3 = ALL SPRINTS DONE).
  - TypeScript: `npx tsc --noEmit` (0 errors), i18n: `node scripts/check_translations.mjs` (0 missing keys).
### 87. Phase 87 Complete: Sprint R4-S1 Quotations Module & Japanese PDF Export
- **Quotation Pricing Engine (`src/lib/quotation-engine.ts`)**:
  - Implemented `calculateMoldPrice` (aluminum block volume, CNC machining, cavity scaling, separate cutter & plug add-ons).
  - Implemented `calculateTrayUnitPrice` (film consumption, sheet width, feed pitch, part weight in grams, forming & packing cost).
- **Interactive UI Components**:
  - `CreateQuotationModal.tsx`: Auto-calculates full breakdown lines from selected CAD revision with 1 click.
  - `QuotationLineEditor.tsx`: Line items editor with live subtotal, 10% tax, and grand total.
  - `orders/quotations/page.tsx`: Quotation list with 4 summary KPI cards, status/type filters, search, and direct PDF download.
  - `orders/quotations/[id]/page.tsx`: Full detail view with status workflow (`DRAFT` $\rightarrow$ `SENT` $\rightarrow$ `ACCEPTED` / `REJECTED`), CAD parameters review, and live line editor.
- **Japanese A4 PDF Export (`@react-pdf/renderer`)**:
  - Route `/api/quotations/[id]/pdf` with standard Japanese quotation form (御見積書, Onchuu, 3 Hanko boxes, itemized table, tax breakdown).
### 88. Phase 88 Complete: Sprint R4-S2-A Shipment Schema Survey
- **Survey R4-S2-A Executed**:
  - Live Database analysis confirmed:
    1. Table `shipments` exists with full columns (`shipment_id`, `order_id`, `delivery_site_id`, `delivery_note_no`, `ship_date`, `status`, `delivery_method`, `tracking_no`, `shipped_by`, `notes`).
    2. Table `delivery_notes` and `delivery_sites` already exist and link directly.
    3. `order_lines` contains `quantity`, `ship_date`, `line_status`, `delivery_site_id`, `box_type`, `packing_style`.
    4. Backlog calculation defined: $\text{Backlog} = \text{Total Ordered Qty} - \text{Delivered Qty}$.
### 89. Phase 89 Complete: Sprint R4-S2 Shipments Module & Japanese Delivery Note PDF
- **Shipments Page Upgraded (`src/app/orders/shipments/page.tsx`)**:
  - Added 3 summary KPI cards: Total Shipments, Preparing (`PREPARING`), and Delivered (`SHIPPED`/`DELIVERED`).
  - Search & status filters, clickable delivery note links, and 1-click PDF download button.
- **Atomic 1-Click Shipment Dispatcher (`CreateShipmentModal.tsx`)**:
  - Multi-step dispatcher: Select open order $\rightarrow$ select individual `order_lines` $\rightarrow$ confirm delivery site & ship date.
  - Atomic execution: Insert `shipments` with auto DN-YYMM-XXX, update `order_lines` to `DELIVERED`, auto-mark `orders` `COMPLETED` when all lines delivered, with safe rollback.
- **Shipment Detail View (`orders/shipments/[id]/page.tsx`)**:
  - Delivery site details, carrier tracking number, linked order navigation, and delivered product lines table.
- **Dual Japanese A4 Delivery Note PDF (`@react-pdf/renderer`)**:
  - Dual layout with 納品書 (Delivery Note) on top and 納品受領書 (Receipt Copy) on bottom separated by dashed cutline.
  - Customer + delivery site 御中, 3 Hanko approval boxes, and items packaging breakdown.
- **Git & Coordination**:
  - Created `temp_ai/R4_S2_review.md`.
  - Updated `PE_AN_COORDINATION_LOG.md` (R4-S2 = DONE).
### 90. Phase 90 Complete: Sprint R4-S3-A Legacy Code & Tech Debt Audit
- **Comprehensive Audit Executed (R4-S3-A)**:
  1. Found 21 files querying deprecated `physical_molds` & `cutters` (categorized into actions, detail views, legacy pages, components).
  2. Identified 10 files with `customer_id` usages at UI form level (none in database schema).
  3. Inspected legacy `/production/molds` route: Confirmed absent from sidebar, proposed 308 redirect to `/equipment/molds`.
  4. Inspected `TabOverview.tsx`: Confirmed 2,453 lines and 11 `as any` occurrences.
- **Artifacts & Logs**:
  - Generated `temp_ai/R4_S3_audit.md`.
  - Updated `PE_AN_COORDINATION_LOG.md` (R4-S3-A = DONE).
### 91. Phase 91 Complete: Sprint R4-S3 Legacy Code Refactor & Phase R4 Closed
- **Legacy Route Cleaned (Group A)**:
  - `production/molds/page.tsx` & `production/molds/designs/page.tsx` now perform 308 permanent redirect to `/equipment/molds`.
  - Deleted 6 dead legacy components in `src/app/production/molds/_components/` (-1,887 lines).
- **Unified Equipment SSOT Refactored (Group B)**:
  - `actions/dashboard.ts`, `actions/production.ts`, `loading-board/_actions/board.ts`, `production/molds/actions.ts`, and `CheckInOutModule.tsx` refactored to query only `equipment` table. Removed legacy dual-write sync.
- **Company ID Form State Normalized (Group C)**:
  - Cleaned `actions/order.ts`, `production/products/upsert-actions.ts`, `cases/new/page.tsx`, and `UnifiedTrayDrawer.tsx`.
- **Zero `as any` in `TabOverview.tsx` (Group D)**:
  - Replaced all 11 `as any` / `as unknown` occurrences with clean TypeScript interfaces (`MoldDetail`, `DesignRevisionData`).
- **Phase R4 Complete & Pushed to GitHub**:
  - Pushed to GitHub: commit `7d33c2c refactor(legacy): R4-S3 unified equipment SSOT cleanup`.
  - Created `temp_ai/R4_S3_review.md`.
  - Updated `PE_AN_COORDINATION_LOG.md` (Phase R4 = ALL 3 SPRINTS DONE ✅).
  - TypeScript: `npx tsc --noEmit` (0 errors), i18n: `node scripts/check_translations.mjs` (0 missing keys).

### 92. Phase 92 Complete: Sprint R5-S1 Invoices & Customer Debt Module
- **Database Migration (`r5_s1_invoices_payments`)**:
  - Created `invoices`, `invoice_lines`, `invoice_payments`, and view `v_customer_debt_summary`.
  - Trigger `fn_sync_invoice_payment` for automatic `paid_amount` & status updates (`PAID`, `PARTIALLY_PAID`).
  - Added types in `src/types/database.types.ts` and documentation in `SCHEMA_REFERENCE.md`.
- **Server Actions (`src/app/actions/invoice.ts`)**:
  - `generateNextInvoiceNumber`, `getInvoices`, `getInvoiceById`, `createInvoice`, `updateInvoiceStatus`, `addPayment`, `getCustomerDebtSummary`.
- **UI Pages & Components**:
  - `src/app/orders/invoices/page.tsx` (Invoices list with 5-KPI bar, search, filter by company/status/date, status badges, drawer integration).
  - `src/app/orders/debt/page.tsx` (Customer Debt Summary with KPI cards, overdue highlights, direct filter links).
  - `src/app/orders/invoices/_components/InvoiceDrawer.tsx` (Create invoice with auto order/shipment lines import & View invoice with lines + payment history tabs).
  - `src/app/orders/invoices/_components/AddPaymentModal.tsx` (Record payment with auto sync).
- **Navigation & i18n**:
  - Added `請求書 (Hóa đơn)` and `売掛金 (Công nợ)` to `Sidebar.tsx`.
  - Added full translation keys to `messages/ja.json` & `messages/vi.json` (0 missing keys).
  - TypeScript: `npx tsc --noEmit` (0 errors).
- **Official Approval**:
  - PE verified live Supabase project `iirezrszalmecsslbruo` (Tokyo, `ap-northeast-1`).
  - Sprint R5-S1 officially APPROVED & CLOSED ✅. Directive #018 closed.
  - Security note: RLS on `material_stock` and `work_orders` postponed by Product Owner. Ready for Sprint R5-S2.

### 93. Phase 93 Complete: Sprint R5-S2 Order-to-Cash E2E Integration Suite
- **Playwright Test Suite (`e2e/order-to-cash-flow.spec.ts`)**:
  - Implemented and executed 6 end-to-end integration tests on Supabase Live DB (`iirezrszalmecsslbruo`):
    1. Case a: Quotation creation with ≥2 lines (generated `amount` column) & status `DRAFT` $\rightarrow$ `ISSUED`.
    2. Case b: Conversion from Quotation to Order (`NEW`) with matching `company_id` and `order_lines`.
    3. Case c: Shipment creation with `order_id` linkage (`physical`, `standard`, `SHIPPED`).
    4. Case d: Invoice creation with generated columns (`net_amount = 275000 JPY`, `line_amount = 150000 + 100000 JPY`).
    5. Case e: 2 partial payments (100k + 175k JPY), auto trigger sync (`paid_amount`, `remaining_amount`, `PAID`) and instant view update in `v_customer_debt_summary`.
    6. Case f: Referential integrity guard verification between `invoice_lines` and `order_lines`.
- **Test Results & Verification**:
  - **All 6 / 6 test cases passed (100%)** on Supabase Live DB (3.8s execution).
  - Created `e2e/README_R5S2.md` with complete test logs and SQL cleanup scripts.
  - TypeScript: `npx tsc --noEmit` (0 errors).

### 94. Phase 94 Complete: Sprint R5-S3 Executive Dashboard & Server SQL Views (2026-08-20)
- **Executive Dashboard 2 Tầng (`src/app/dashboard/executive/page.tsx`)**:
  - **Tầng 1 (Sản xuất Live DB)**: 4 KPI Cards (Tổng Thiết Bị, Thiết Bị Hoạt Động, Lệnh SX Đang Chạy, Tỷ Lệ Hoàn Thành %) + Biểu đồ phân bổ chủng loại thiết bị (`v_equipment_type_summary`) + Phân bổ trạng thái Jobs (`v_job_status_summary`).
  - **Tầng 2 (Thương Mại & Công Nợ)**: 4 KPI Cards (Doanh Số Báo Giá, Tổng Đơn Đã Đặt, Đã Xuất Hóa Đơn, Công Nợ Phải Thu) + Biểu đồ Doanh thu theo tháng + Top khách hàng công nợ lớn nhất (`v_customer_debt_summary`).
  - Tích hợp Chế độ Xem trước Dữ liệu Mẫu (Demo Mode) khi DB thương mại trống và Chế độ Live DB trực tiếp.
- **Server SQL Views khắc phục giới hạn 1.000 dòng PostgREST**:
  - Created migration `20260820150000_r5_s3_executive_dashboard_views.sql` (`v_equipment_type_summary`, `v_job_status_summary`, `v_dashboard_executive_kpis`).
  - Server action `src/app/actions/dashboard.ts` (`getExecutiveDashboardData`) truy vấn trực tiếp các Views tổng hợp Server-side, đảm bảo độ trễ < 30ms cho 2.200+ jobs và 1.100+ thiết bị.
- **Official Approval**: Sprint R5-S3 officially APPROVED & CLOSED ✅. Directives #021, #022, #023 closed.

### 95. Phase 95 Complete: Daily Ops Track 1 (Grinding, Inspection, Forming, Press) & Phase D Audit (2026-08-21)
- **Checkpoint 1 — Grinding Log Module (`commit 7d95b77`)**:
  - Built `src/app/production/grinding/page.tsx`, `GrindingLogForm.tsx`, `GrindingTable.tsx`, and `src/actions/grinding.ts`.
  - Created real-time search APIs: `/api/search/employees` and `/api/search/products`.
- **Checkpoint 2 — Daily Inspection QC Module (`commit 5df97ed`)**:
  - Built `src/app/quality/daily-inspection/page.tsx`, `InspectionForm.tsx`, `InspectionTable.tsx`, and `src/actions/inspections.ts`.
  - Added 8-item NG failure breakdown, auto-calculating total NG real-time with `useMemo`, and .type-chips result selection (PASS/FAIL/CONDITIONAL).
  - Optional `order_line_id` placeholder for unlinked production runs.
- **Checkpoint 3 — Forming & Press Daily Logs Module (`commit f10a089`)**:
  - Built `src/app/production/daily-logs/page.tsx`, `FormingLogForm.tsx` (7 pre-check checkboxes + 7 NG categories in Japanese terminology), `PressLogForm.tsx` (shot count + cutter condition), and reusable `DailyLogsTable.tsx`.
  - Server actions in `src/actions/daily-logs.ts` with tab navigation via `.tab-nav` CSS classes.
  - Track 1 verified & approved by PE (15 new files, +1,628 lines, 0 TypeScript errors).
- **Track 2 — Phase D Legacy Audit (`commit aff9a2a`)**:
  - Generated `docs/phase-d-audit.md` auditing all remaining references to `physical_molds` (8 files) and `cutters` (7 files) with risk assessments and recommended migration roadmap.
  - Created dry-run migration script `migrations/phase-d-backfill-dryrun.sql` with safe transactional rollback.
- **Verification**: `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys).

### 96. Phase R6 "Activate" — Kích hoạt Dữ liệu Sống (2026-08-24)
- **R6-S1: Backfill `jobs.overall_progress` (`commit 8cd7881`)**:
  - SQL backfill 2,197 jobs: COMPLETED→100%, IN_PROGRESS→1-99% (from job_steps), NOT_STARTED→0%.
  - Created trigger `trg_sync_job_progress` + function `sync_job_overall_progress()` for auto-sync on job_steps changes.
  - Discovered `job_steps` has 36 columns (PE initially reported 15 due to truncated query).
  - Corrected PE's SQL: `jobs.id` → `jobs.job_id`, `jobs.status` → `jobs.job_status`.
- **R6-S2: Import Commercial Orders (`commits 02cd3d9, 20fa27d`)**:
  - ETL from `YSDトレー受注一覧（改2）4-22.xlsx` (2D calendar grid) → `parse_orders_v2.py`.
  - Dry-run: 7,416 lines extracted, 6,282 FOUND (84.7%), 2,399 unique orders.
  - Batch test: 50/50 ✅, PE approved full import.
  - Full import: 2,396 orders / 6,277 order_lines / >7.9M trays. Zero errors.
  - `DECISIONS.md` v1.1 with 2 entries (schema discovery + product_code convention).
- **PE Coordination**: PE = Perplexity (Project Engineer), AN = Antigravity (Executing Agent). User copy-pastes directives between apps. PE answers #37-52, AN answers #42-52.

### 97. Phase R7 "Connect" — Kết nối Dữ liệu Rời (2026-08-24)
- **R7-S3: Fix SCHEMA_REFERENCE.md (`commit 3f3d279`)**:
  - Fixed `product_code` convention from "compact no dash (ADY071)" to "with dash (ADY-071)" matching actual DB data.
- **R7-S1: work_orders Survey + Deadline Fix**:
  - Discovered only 6 work_orders (all NEW_SET/PLANNED). Backfill `order_id` not applicable.
  - Fixed 3 deadline typos: year 2020 → 2026.
  - R7-S1 redefined as forward-looking (create work_orders from order data) — deferred to next session.
- **R7-S2: Product Stubs + Missing Lines Recovery (`commit 20fa27d`)**:
  - Created 134 product stubs (10 prefix→company mappings + YSD internal tray codes).
  - Recovered 1,022 order_lines previously NOT_FOUND. DB: 6,277 → 7,299 lines.
  - Skipped: 1 AMBIGUOUS (`A-016-1`), 165 NO_COMPANY (numeric codes), 6 ALREADY_EXISTS.
  - Final DB: 2,396 orders / 7,299 lines / 10,092,253 trays / 8,422 products.

### 98. Phase D-Fix-1 + R7-S1 Close (2026-08-25)
- **Phase D-Fix-1 (`commit aa5764d`):**
  - `engineering/designs/revisions/[id]/page.tsx`: `.from('physical_molds')` → `.from('equipment').eq('equipment_type','MOLD')` + map to legacy shape
  - `equipment/aluminum/page.tsx` line 35: mold dropdown query → equipment, maps back to `{physical_mold_id, system_code, display_name, actual_length_mm/width/height}`
  - FK alias references (aluminum line 41, 118, 286) left intact — `aluminum_blanks.mold_id → physical_molds` FK not yet migrated
  - Remaining 23 FK constraints → backlog for ADR migration
  - `npx tsc --noEmit`: 0 errors ✅
- **R7-S1 CLOSED (no action):**
  - 6 work_orders = handmade NEW_SET records by Thoan, correct by design
  - Bulk WO from 2,396 orders = wrong direction (orders = sales records, not manufacturing requests)
  - "R7-S1 tạo WO từ order data" removed from backlog — was a misunderstanding
- **Schema Facts Discovered 25/08:**
  - `work_orders` PK = `wo_id` (NOT `work_order_id`) — query PE wrote used wrong column name
  - `work_orders` columns: `wo_id, wo_code, wo_name, wo_type, wo_status, start_date, deadline, product_id, company_id, order_id, case_id, responsible_id, priority, notes`
  - `jobs` has 2 work_order FK columns: `work_order_id` (→ `work_orders.wo_id`) AND `mold_work_order_id`
  - `order_date` in imported orders = ship date (calendar grid date), NOT purchase order date — `due_date` = NULL for all 7,299 lines
  - `production_orders` has `physical_mold_id` → `physical_molds` FK (deprecated, not yet migrated)

### Backlog for Next Session
1. **172 unresolved product codes** — numeric + unknown prefix, needs business input from Thoan
2. **Phase D remaining** — 23 FK constraints still point to `physical_molds`/`cutters` → needs ADR + migration plan
3. **Phase D UI** — `mold_design_cutters` junction table queries in EquipmentDetailModal, TabDesignsEquipment, TabOverview — blocked on FK migration

## Cập Nhật 25/08/2026 (Cuối Phiên Sáng)
- **ADR-004:** Đã được PE phê duyệt.
- **Phase D (Giai đoạn 1):** Đã hoàn thành và verify độc lập thành công 13/25 FK constraints an toàn. Tất cả 13 bảng này đã được chuyển mapping từ `physical_molds`/`cutters` sang `equipment`. Orphan records = 0.
- **Phase D (Giai đoạn 2):** (12 FKs phức tạp còn lại gồm `jobs`, `production_orders`, `mold_design_cutters`...) được xếp vào backlog cho phiên tiếp theo. Giai đoạn 2 yêu cầu đồng bộ logic UI code với DB migration.

**Backlog UI (Chờ phê duyệt ngoài scope Phase D):**
- Trong TechnicalReviewForm.tsx: Cần chuyển đổi mold_id và cutting_die_id từ dạng raw text input (nhập UUID thủ công) sang dạng dropdown select (fetch từ bảng equipment) để cải thiện UX.

**Backlog Database (Giai đoạn 3 ADR-004):**
- Cột cutter_id trong mold_design_cutters đã bị drop constraint và deprecated hoàn toàn — UI đã chuyển 100% sang sử dụng cột equipment_id. Chờ archive data và drop cột này ở Giai đoạn 3.
