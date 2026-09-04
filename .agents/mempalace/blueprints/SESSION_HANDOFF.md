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

## Session 2026-09-03 (sang) ? M6 FULLY CLOSED

### Tech Debt Cleared
- TD-006: CHECK quantity_ng >= 0 �� Applied migration 084 ?
- TD-007: database.types.ts regenerated ?
- TD-008: await createClient() confirmed ?
- TD-009: CLOSED �� Replaced by Server Actions C-1/C-2/C-3

### Phase C Delivered
- C-1: jobs/actions.ts patched (NEW �� IN_PROGRESS fallback)
- C-2: production/qc/actions.ts (submitOutgoingQCAction)
- C-3: orders/shipments/actions.ts (createShipmentAction)
- ShipmentForm.tsx wired to Server Action (inline client removed)

### Open Tech Debt Carry-Forward
- TD-010: JSON.parse(measurementData) c?n try/catch ? LOW priority

### Milestone 7 ? Starting Point
- Scope: TBD ? PE s? define khi m? th?o lu?n m?i
- DB: 84 migrations applied, schema stable
- T?t c? routes M6 ?a co Server Actions, khong con inline Supabase client calls tren forms

### Rule Reminder
- database.types.ts KHONG ph?i SSOT ? verify qua information_schema
- M?i FK verify trong migration: query information_schema tr??c khi push

## Milestone 7: Hybrid Sales (Quotations) & Work Orders (M7-S1, M7-S2) - CLOSED
[AN @ 2026-09-03 09:58 JST]

**Thực thi thành công #024 (Work Orders Refactor):**
- Đã đập bỏ list page cũ, áp dụng Server Component + Pagination (`.range`).
- Thêm Client FilterBar debounce 300ms.
- Update fallback logic cho khách hàng (`work_orders.company_id` -> `products.company_id`).
- Đã thêm i18n cho `ja.json` & `vi.json`.

**Thực thi thành công #025 (Quotation Module New):**
- Đã build 3 trang: `/sales/quotations`, `/sales/quotations/new`, và `/sales/quotations/[id]`.
- Form tạo báo giá mới dynamic cho lines (thêm/xóa hàng) + tính tổng tự động.
- Server action `createQuotationAction` batch insert lines.
- Tsc zero errors. Đã push thành công.

**Tech Debt tồn đọng chuyển M8:**
- TD-010: Thêm try/catch cho `JSON.parse(measurementData)` trong QC.
- Export PDF Báo Giá (Phase 2 của Quotations).
- Phân hệ Nhựa (P0 Inventory).
- Auto-create Job từ WO (ADR-003).

### M7 Closure Notes & Tech Debt
- **TD-011**: QuotationList search - Migrate from 2-step lookup to Postgres embedded filter syntax (`companies!inner(company_name.ilike.%search%)`) to avoid `.in()` scaling limits.

## Milestone 8: Sales Quotations Phase 2 (M8-S1) - COMPLETED
[AN @ 2026-09-03 11:10 JST]

**Thực thi thành công Chỉ thị #028:**
- **Migration 085** (`20260903000002_085_add_quotation_phase2_fields.sql`): Thêm `revision_no`, `customer_contact_name`, `delivery_destination` vào `quotations`; thêm `model_code`, `quantity_text` vào `quotation_lines`; tạo index `idx_quotations_revision`.
- **Safe quotation_no Generation:** Thay thế `Math.random()` bằng sequence an toàn theo ngày (`QUO-YYMMDD-NNNN`) đếm theo số lượng quotation tạo trong ngày.
- **Form Tạo Mới (`/sales/quotations/new`):**
  - Thêm 客先担当者名 (`customer_contact_name`), 送り先 (`delivery_destination`), 版数 (`revision_no`).
  - Thêm checkbox '次回価格改定時まで' -> disable và clear field `valid_until`.
  - Bảng line items: thêm cột 型番 (`model_code`) và 数量表示 (`quantity_text` như '一式').
- **QuotationTable & Detail View:**
  - Hiển thị badge `Rev.N` cạnh mã báo giá.
  - Hiển thị khách hàng kèm người phụ trách (宛先).
  - Detail overview hiển thị đủ 6 trường Phase 2, hiển thị '次回価格改定時まで' khi `valid_until` null.
  - Bảng lines hiển thị riêng cột 型番 (Model Code) và hỗ trợ text số lượng.

**Tech Debt ghi nhận:**
- **TD-012:** LOT pricing (báo giá cùng sản phẩm chia 4–8 bậc số lượng với đơn giá giảm dần) - chuyển M9+.

### ⚡ DB Migration Note (Playbook Rule)
- **Migration 085 Applied & Verified:** 5/5 columns confirmed in DB by PE via MCP. PostgREST schema cache reloaded successfully.
- **Quy tắc Playbook về Migration:** Project Supabase hiện cấu hình DNS IPv6 cho direct DB, không route qua IPv4 mạng nội bộ; pooler IPv4 chưa bật. Migration apply = luôn cần PE hoặc Thoan xác nhận qua Dashboard/MCP, AN không tự apply production DB bằng lệnh `db push` direct.

## Milestone 8: Quotation PDF Export & Tech Debt Resolution (M8-S2) - COMPLETED
[AN @ 2026-09-03 11:47 JST]

**Thực thi thành công Chỉ thị #030:**
- **[TD-010 RESOLVED]:** Bọc try/catch an toàn cho `JSON.parse(measurementData)` trong `src/app/production/qc/actions.ts`. Nếu dữ liệu lỗi hoặc rỗng, trả về `null` thay vì crash Server Action.
- **[TD-011 RESOLVED/DOCUMENTED]:** Khảo sát chi tiết PostgREST v11/v12: cú pháp `.or()` không hỗ trợ filter xuyên quan hệ (cross-resource) như `companies.company_name`. Duy trì cơ chế 2-step lookup an toàn và tài liệu hóa chi tiết trong `src/app/sales/quotations/page.tsx`.
- **[PDF TEMPLATE]:** Tạo `src/components/pdf/QuotationPDF.tsx` sử dụng `@react-pdf/renderer`, font tiếng Nhật `NotoSansJP` (Regular + Bold), thương hiệu Yoshida Package (màu xanh `#0066CC`), con dấu đỏ `stamp_yoshida.png`, đầy đủ các trường `model_code`, `quantity_text` ('一式'), thời hạn hiệu lực, điều khoản và cam kết thuế.
- **[API ROUTE]:** Tạo `src/app/api/quotations/[id]/pdf/route.ts` chạy trên Node.js runtime, xuất buffer PDF kèm `Content-Disposition: attachment; filename="QUO-xxxx_RevN.pdf"`.
- **[UI ACTION]:** Thêm nút `PDFダウンロード` kèm biểu tượng `FileDown` trong BackBar tại `src/app/sales/quotations/[id]/page.tsx`.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `780c04d` đã push lên `origin main`.

## Milestone 9: Auto Jobs Generation from Work Order Equipment Set (M9-S1) - COMPLETED
[AN @ 2026-09-03 13:30 JST]

**Thực thi thành công Chỉ thị #031:**
- **[TASK 0 - Schema Audit]:** 
  - Xác nhận `equipment.product_id` không tồn tại; `equipment.design_revision_id` tồn tại và liên kết 6,402 thiết bị.
  - Bảng `equipment_assignments` quản lý quan hệ `primary_equipment_id` (MOLD) ↔ `related_equipment_id` (SET_MEMBER).
  - 7 giá trị `equipment_type` trong DB: `MOLD`, `CUTTER_INLINE`, `CUTTER_SEPARATE`, `PRESSURE_BASE`, `WATER_BASE`, `STACKING`, `PLUG`.
- **[TASK 1 - Auto Jobs Engine]:** Tạo `src/app/production/work-orders/actions.ts`:
  - Hàm `generateJobsForWorkOrder(workOrderId)` phân giải `product_id` và `design_revision_id`.
  - Tìm khuôn chính MOLD, sau đó tìm các thiết bị phụ thuộc qua `equipment_assignments` (`relationship_type = 'SET_MEMBER'`), với fallback qua cùng `design_revision_id`.
  - Cơ chế **Idempotent**: kiểm tra `jobs(work_order_id, equipment_id)`, tự động bỏ qua các thiết bị đã được tạo Job trước đó.
  - Tự động sinh `job_steps` theo template chuẩn YSD: `JOB_STEP_TEMPLATES[equipment_type]`.
  - Tự động chuyển `work_orders.wo_status` sang `IN_PROGRESS`.
- **[TASK 2 - UI & Component]:**
  - Tạo `src/app/production/work-orders/[id]/_components/JobsListSimple.tsx`: hiển thị danh sách Jobs phân tách theo thiết bị, badge loại thiết bị, tiến độ số bước công đoạn (`completedCount / totalCount`), và trạng thái Job.
  - Trang chi tiết `src/app/production/work-orders/[id]/page.tsx`: tích hợp nút bấm chủ động `「加工指示を発行する」` (Phát hành chỉ thị gia công) khi chưa có Jobs.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `6ab36a1` đã push lên `origin main`.

## Milestone 9: Jobs Progress UI & Lifecycle Sync Trigger (M9-S2) - COMPLETED
[AN @ 2026-09-03 13:42 JST]

**Thực thi thành công Chỉ thị #032 & Phản hồi Review Kỹ Thuật M9-S1:**
- **[POINT 1 - Fallback Filter & Dedup]:** Đã thêm `VALID_EQUIPMENT_TYPES` (8 loại thiết bị chuẩn) vào `actions.ts`. Trong trường hợp fallback theo `design_revision_id`, hệ thống tự động lọc tối đa 1 thiết bị cho mỗi loại phụ thuộc (1 CUTTER, 1 STACKING, 1 PLUG...) để ngăn chặn triệt để nguy cơ tạo ra 50+ Jobs từ dữ liệu legacy trùng lặp.
- **[POINT 2 - Status Guard]:** Đã bổ sung guard check `['CONFIRMED', 'PLANNED'].includes(wo.wo_status)`. Chỉ chuyển sang `IN_PROGRESS` nếu WO đang ở trạng thái chuẩn bị; tuyệt đối không kéo ngược WO đang `COMPLETED` hay `CANCELLED`.
- **[TASK 1 - Jobs Progress UI]:** Nâng cấp `JobsListSimple.tsx`:
  - Thanh tiến độ tổng quan: hiển thị `X/Y Jobs 完了 (Z%)` kèm visual progress bar.
  - Thiết kế Pill Badge màu sắc nhận diện thiết bị (🔵 MOLD, 🟡 CUTTER, 📦 STACK, ⚪ PLUG, ⚙️ BASE).
  - Thanh tiến độ công đoạn con (Step progress bar) kèm số bước hoàn thành (`X/Y 工程`).
  - Hiển thị tên nhân sự phụ trách (`responsible:employees(full_name)`).
- **[TASK 2 - Lifecycle Sync Trigger (DB Level)]:** Tạo file migration `supabase/migrations/20260903000003_086_wo_auto_complete_trigger.sql`:
  - Function `sync_work_order_status()`: tự động đếm `total_jobs` và `completed_jobs` của `work_order_id`.
  - Khi tất cả Jobs hoàn thành (`total_jobs = completed_jobs`) ➔ tự động chuyển `work_orders.wo_status` sang `'READY_FOR_PRODUCTION'`.
  - Trigger `trg_sync_wo_status` gắn trên bảng `jobs` (`AFTER INSERT OR UPDATE OF job_status`).
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `81c34a8` đã push lên `origin main`.

## Milestone 10: Shipment & 納品書 (M10-S1) - COMPLETED
[AN @ 2026-09-03 14:24 JST]

**Thực thi thành công Chỉ thị #034:**
- **[TASK 0.5 - Schema Verification]:** Kiểm tra DB xác nhận bảng `order_lines` chưa có `remaining_qty` & `shipped_qty`. Đã tạo file migration `supabase/migrations/20260903000004_087_add_order_lines_delivery_fields.sql` để PE apply qua MCP.
- **[TASK 1 - Fix FilterBar Infinite Re-render]:** Đã sửa `ShipmentFilterBar.tsx` loại bỏ triệt để `searchParams` khỏi dependency array của `useEffect`, dùng `isMounted` ref và local state độc lập.
- **[TASK 2 - Partial Delivery Engine]:**
  - Cập nhật `src/app/orders/shipments/actions.ts`: hỗ trợ giao hàng từng phần với guard `qty_shipped <= remaining_qty`.
  - Cập nhật `order_lines.shipped_qty` lũy kế và `order_lines.remaining_qty` còn lại. Tự động set `line_status = 'PARTIALLY_SHIPPED'` hoặc `'SHIPPED'`.
  - Tự động hoàn tất đơn hàng (`orders.order_status = 'COMPLETED'`) khi tất cả các line đã xuất hết.
  - Nâng cấp `ShipmentForm.tsx`: hiển thị tổng đặt, đã xuất, tồn dư; cho phép nhập số lượng xuất đợt này kèm nút "全数出荷" và cảnh báo validation client-side.
- **[TASK 3 - PDF 納品書 Layout Audit & Patch]:**
  - Sửa thông tin nhà phát hành thành chính thức: `株式会社 吉田金型製作所` (YSD) tại Kawasaski, Kanagawa (thay cho placeholder Yamada).
  - Tích hợp con dấu đỏ YSD (`public/stamps/stamp_yoshida.png`) tại khu vực triện đóng.
  - Phân tách trang phục vụ in ấn A4 chuẩn Nhật: Nửa trên là **「納　品　書」**, nửa dưới là **「納　品　受　領　書」** có ô ký nhận và ngày nhận hàng.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `d0323c4` đã push lên `origin main`.

## Milestone 10: Shipment UI & Order-to-Shipment Flow (M10-S2) - COMPLETED
[AN @ 2026-09-03 14:52 JST]

**Thực thi thành công Chỉ thị #035:**
- **[TASK 1 - Trang Danh Sách Shipments]:**
  - Cột mã phiếu `納品書No` hiển thị hyperlink monospace dẫn trực tiếp vào trang chi tiết.
  - Bổ sung cột Thao tác (Action): Nút `📄 納品書` mở trực tiếp file PDF trong tab mới (`/api/shipments/[id]/pdf`).
  - Badge trạng thái trực quan: `PREPARING` ⏳ (chuẩn bị), `SHIPPED` 🚚 (đã xuất), `DELIVERED` ✅ (đã nhận), `CANCELLED` ❌ (hủy).
- **[TASK 2 - Trang Chi Tiết Shipment]:**
  - **Section A (Header):** Hiển thị khách hàng, địa điểm giao, mã đơn liên kết, ngày xuất, phương thức vận chuyển, mã vận đơn, nút tải PDF và nút lưu chỉnh sửa.
  - **Section B (Lô xuất kho):** Bảng chi tiết lô xuất `shipment_lots` (Lot#, Mã hàng, Tên hàng, Số lượng, Số thùng carton, Pallet, Ghi chú).
  - **Section C (Tiến độ Order Lines):** Thanh tiến độ mini cho từng dòng đơn hàng của Order liên quan, hiển thị rõ `注文総数 / 出荷済 / 未出荷残数` và badge trạng thái (`全数出荷済`, `一部出荷済`, `未出荷`).
- **[TASK 3 - Nút Liên Thông Order → Shipment]:**
  - Trang chi tiết Đơn hàng `src/app/orders/[id]/page.tsx`: Thêm nút chủ động `「納品書を発行する」` (icon `Truck`) tại PageHeader.
  - Trang tạo mới `src/app/orders/shipments/new/page.tsx`: Nhận tham số `?order_id=`, tự động pre-fill thông tin khách hàng và nạp danh sách các dòng đơn còn hàng (`remaining_qty > 0`) để xuất ngay.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `b3c155e` đã push lên `origin main`.

## Milestone 11: Production Cockpit & Urgent Alerts (M11-S1) - COMPLETED
[AN @ 2026-09-03 15:20 JST]

**Thực thi thành công Chỉ thị #037:**
- **[TASK 1 - Server Action `getDashboardData` Mở Rộng]:**
  - Thêm thống kê Work Orders theo trạng thái: `totalWorkOrders`, `inProgressCount`, `readyForProductionCount`, `plannedCount`, `completedCount`.
  - Thêm truy vấn `urgentJobs`: Lọc Jobs chưa hoàn thành (`job_status NOT IN ('COMPLETED', 'CANCELLED')`), có hạn chót trong vòng 7 ngày (`deadline <= NOW() + 7 days`), tính toán số ngày còn lại (`daysRemaining`), sắp xếp `deadline ASC`.
  - Thêm truy vấn `activeWorkOrders`: Lấy top Work Orders đang hoạt động (`IN_PROGRESS`, `READY_FOR_PRODUCTION`, `CONFIRMED`, `PLANNED`), sắp xếp `updated_at DESC`.
- **[TASK 2 - Giao Diện Dashboard `src/app/dashboard/page.tsx`]:**
  - **Widget A (Work Order Status Cards):** Bổ sung 3 thẻ KPI trạng thái sản xuất trực quan:
    - `製造指示中 (In Progress)` [Amber badge / text]
    - `出荷準備完了 (Ready for Production)` [Emerald badge / text]
    - `未着手・計画中 (Planned)` [Slate neutral badge / text]
  - **Widget B (🚨 7日以内に期限を迎える加工指示 - Urgent Jobs Alert):**
    - Bảng cảnh báo khẩn cấp với chỉ số ngày còn lại: `🔴 1日/超過`, `🟡 2-3日`, `⚪ 4-7日`.
    - Hiển thị Job Code (link mở trang Job), Tên sản phẩm, Mã thiết bị, Badge trạng thái.
    - Hiển thị thông báo hoàn thành tất cả khi danh sách trống.
  - **Widget C (製造中の製造指示 - Active Work Orders):**
    - Danh sách Work Orders đang chạy với link điều hướng nhanh đến trang chi tiết Lệnh sản xuất (`/production/work-orders/[id]`).
- **[TASK 3 - Migration 088]:**
  - Tạo file `supabase/migrations/20260903000005_088_extend_dashboard_views.sql` mở rộng view `v_dashboard_executive_kpis` với các cột đếm Work Orders và Shipments.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `d177d3d` đã push lên `origin main`.

## Milestone 11: Commercial Pipeline & Dashboard Polish (M11-S2) - COMPLETED & MILESTONE 11 CLOSED
[AN @ 2026-09-03 15:32 JST]

**Thực thi thành công Chỉ thị #038:**
- **[TASK 0 - Đồng bộ Migration 088 SQL]:**
  - Cập nhật `supabase/migrations/20260903000005_088_extend_dashboard_views.sql` khớp chính xác với SQL PE đã apply trên Supabase: Thêm `DROP VIEW IF EXISTS` và cast `COUNT(*)::int` cho tất cả 15 cột để tránh lỗi type conflict giữa bigint và integer.
  - Đã commit riêng: `fix: sync migration 088 SQL with applied version (::int cast + DROP VIEW)` (`94f4efd`).
- **[TASK 1 - Server Action Pipeline `getDashboardData`]:**
  - Thêm truy vấn `ordersPipelineData` (lọc theo `created_at >= startOfMonth`) và `shipmentsMonthData` (lọc theo `ship_date >= startOfMonth`).
  - Tổng hợp dữ liệu phân luồng thương mại `commercialPipeline`:
    - `newOrdersCount`: Đơn hàng mới (`CONFIRMED` / `DRAFT`).
    - `inProductionCount`: Đơn hàng / WO đang sản xuất (`IN_PROGRESS`).
    - `readyToShipCount`: Đơn hàng / WO hoàn tất khuôn dao sẵn sàng dập (`READY_FOR_PRODUCTION`).
    - `deliveredCount`: Đơn hàng / Giao hàng hoàn tất (`DELIVERED` / `COMPLETED`).
- **[TASK 2 - UI Widget: 今月の受注・出荷パイプライン]:**
  - Tích hợp Widget Pipeline 4 giai đoạn nối tiếp bằng mũi tên `→` trên Dashboard:
    - `① 新規受注` (Xanh dương / CONFIRMED) ➔ Link `/orders`
    - `② 生産中` (Vàng cam / IN_PROGRESS) ➔ Link `/production/work-orders`
    - `③ 出荷準備` (Xanh ngọc / READY_FOR_PRD) ➔ Link `/production/work-orders`
    - `④ 納品完了` (Xanh lục / DELIVERED) ➔ Link `/orders/shipments`
  - Mỗi thẻ card hỗ trợ hover visual, hiển thị số lượng to rõ nét và click 1 chạm mở thẳng module tương ứng.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `1fb3d5c` đã push lên `origin main`.

## Milestone 12: Material Inventory & Intake Engine (M12-S1) - COMPLETED
[AN @ 2026-09-03 17:01 JST]

**Thực thi thành công Chỉ thị #040:**
- **[TASK 0.5 - Xác nhận Schema plastic_receipt & plastic_receipt_roll]:**
  - Đã đối soát chính xác cột: `plastic_receipt` (`id`, `receipt_no`, `supplier_id`, `receipt_date`, `note`) và `plastic_receipt_roll` (`id`, `roll_barcode`, `receipt_id`, `plastic_id`, `nominal_length_m`, `received_length_m`, `current_length_m`, `status`, `location`, `lot_no`, `supplier_name`).
  - Ghi nhận: Cột trạng thái là `status` (`in_stock`, `in_use`, `empty`, `returned`), không phải `roll_status`.
- **[TASK 1 - Form Nhập Kho Cuộn Mới]:**
  - Tạo `src/app/plastics/inventory/new/page.tsx` và `ReceiptForm.tsx`:
    - Bước 1: Header phiếu nhập (`receipt_date`, `receipt_no` tự sinh, `supplier_name`, `note`).
    - Bước 2: Bảng chi tiết từng cuộn màng (`roll_barcode`, chọn loại nhựa master `plastic_id`, `received_length_m`, `lot_no`, `location`). Hỗ trợ thêm dòng, xóa dòng, tự điền chiều dài tiêu chuẩn từ master.
    - Thanh tóm tắt tổng số cuộn và tổng mét màng nhập kho.
  - Tạo Server Action `createPlasticReceiptAction` trong `actions.ts`:
    - Kiểm tra tính duy nhất của mã `roll_barcode` (ngăn trùng lặp mã barcode cuộn).
    - Insert phiếu nhập vào `plastic_receipt` ➔ Insert chi tiết N cuộn vào `plastic_receipt_roll` với `status = 'in_stock'` và `current_length_m = received_length_m`.
- **[TASK 2 - Low Stock Alert Widget]:**
  - Trong `src/app/plastics/inventory/page.tsx`:
    - Thêm Alert Banner cảnh báo: `⚠️ 残量50m以下のロールが {lowStockCount} 本あります` kèm nút bấm `残量50m以下を抽出`.
    - Thẻ StatCard `在庫低下 (≤50m)` hỗ trợ click 1 chạm để bật/tắt chế độ lọc chỉ xem các cuộn sắp hết.
    - Highlight màu nền hàng bảng dữ liệu vàng nhạt và icon ⚠️ cho các cuộn có `current_length_m <= 50m`.
- **[TASK 3 - Nút 入荷登録]:**
  - Bổ sung PageHeader và nút `[+ 入荷登録]` tại `plastics/inventory/page.tsx` dẫn sang `/plastics/inventory/new`.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit `8f428eb` đã push lên `origin main`.

- **[Fix Verification]:** Điều chỉnh path import `../../actions` cho component con `new/_components/ReceiptForm.tsx` và prop `currentPage` của `Pagination` tại `plastics/inventory/page.tsx`. Đã test `npx tsc --noEmit` hoàn toàn sạch **0 errors**. Commit: `1cae1c2` đã push lên `origin main`.

## Milestone 12: Manual Consumption Entry & Dashboard Material KPI (M12-S2) - COMPLETED & MILESTONE 12 CLOSED
[AN @ 2026-09-03 17:10 JST]

**Thực thi thành công Chỉ thị #041 (Điều chỉnh):**
- **[Audit Constraint material_consumption_logs & Migration 089]:**
  - Đã kiểm tra thực tế trên Supabase: `production_lot_id` có ràng buộc `NOT NULL` và FK `REFERENCES production_lots(lot_id)` (bảng `production_lots` hiện có 0 dòng).
  - `plastic_adjustment_log` là bảng chuẩn SSOT cho biến động màng nhựa theo `roll_id`, hỗ trợ `action_type = 'PRODUCTION'` và `change_length_m < 0`.
  - Đã tạo migration file: `supabase/migrations/20260903000006_089_material_consumption_wo_roll.sql` để nới lỏng `production_lot_id DROP NOT NULL` và bổ sung `work_order_id`, `roll_id`.
- **[TASK 1 - Form Ghi Nhận Tiêu Hao Thủ Công]:**
  - Tạo `src/app/plastics/inventory/consume/page.tsx` và `ConsumeForm.tsx`:
    - Chọn cuộn màng cần xuất dùng (chỉ hiện cuộn đang có sẵn `in_stock` hoặc `in_use` và `current_length_m > 0`).
    - Thẻ đo trực quan (Meter Gauge Card): Xem ngay số mét ban đầu, số mét hiện có, thanh tiến trình mô phỏng lượng mét còn lại sau khi trừ.
    - Nhập số mét tiêu hao (có các nút chọn nhanh +30m, +50m, +100m, +150m, +200m, Toàn bộ cuộn).
    - Liên kết Lệnh sản xuất (Work Order) và ghi nhận tên thợ/người vận hành.
  - Server Action `consumePlasticRollAction`:
    - Kiểm tra `consumed_m <= current_length_m`.
    - Trừ trực tiếp `current_length_m` trên `plastic_receipt_roll`, tự động đổi trạng thái sang `'empty'` nếu hết mét, hoặc `'in_use'` nếu còn.
    - Ghi nhận lịch sử chi tiết vào `plastic_adjustment_log` (`action_type: 'PRODUCTION'`, `change_length_m: -consumed_m`, ghi chú WO và thợ).
- **[TASK 2 - Consumption History Tab/Drawer trên Roll Detail]:**
  - Tại `plastics/inventory/page.tsx`: Bấm vào mã barcode hoặc nút `[履歴]` của bất kỳ cuộn nào sẽ mở Slide Drawer hiển thị chi tiết:
    - Quy cách màng, tỷ lệ tiêu hao % qua thanh tiến trình màu sắc.
    - Bảng lịch sử các lần xuất dùng / cắt màng theo thời gian (giờ JST, số mét trừ đỏ, người phụ trách, mã WO).
    - Nút bấm trực tiếp `[このロールを消費登録する →]` dẫn ngay sang form trừ mét cho đúng cuộn đó.
- **[TASK 3 - Dashboard Material KPI]:**
  - Mở rộng `getDashboardData()` trong `dashboard.ts` truy vấn SQL View `material_inventory_v2`.
  - Tính toán: `totalAvailableM` (tổng mét khả dụng toàn công ty), `uniqueSpecsCount` (số quy cách màng), `lowStockMaterialCount` (số quy cách dưới 500m).
  - Tích hợp hàng KPI mới **「材料在庫 (Material Inventory Cockpit)」** trên Dashboard ngay cuối Tầng 1 với 3 thẻ chỉ số và link liên thông sang kho cuộn.
- **TypeScript Check:** `npx tsc --noEmit` = 0 errors. Commit: `cdee97e` và `0540a33` đã push lên `origin main`.

## Milestone 13: Tray Production Schedule (M13-S1 Kickoff & T3/T3.5)
[AN @ 2026-09-04 09:01 JST]

- **[Xác nhận Migration 089]:** Đã kiểm tra trực tiếp trên Supabase: `production_schedules` đã có đầy đủ 6 cột mới (`scheduled_start`, `scheduled_end`, `work_order_id`, `operator_id`, `roll_id`, `actual_quantity`), và `material_consumption_logs.production_lot_id` đã gỡ bỏ NOT NULL thành công.
- **[T3 - Migration 090]:** Soạn thảo `supabase/migrations/20260904000001_090_v_tray_schedule_gantt.sql`. Fix bẫy schema: `work_orders` dùng `wo_code` (không có cột `wo_no`), view đã alias `wo.wo_code AS wo_no` và `wo.wo_code`. Đã test query thành công.
- **[T3.5 - Seed Data Thực Tế]:** Tạo `scripts/seed-tray-schedule.mjs` và thực thi seed thành công **30 bản ghi lịch dập** vào `production_schedules` phủ đều 14 máy, phân bổ ca 8 tiếng (`scheduled_start`, `scheduled_end`), shift DAY/NIGHT, kết nối động với `work_orders`, `products`, `rolls`, `employees`.
- **Commit:** `ce0004b` đã push lên `origin main`.

## Milestone 13: Tray Production Schedule (M13-S1 Complete: T4, T5, T6)
[AN @ 2026-09-04 09:10 JST]

- **[T4 - Component TrayScheduleGantt]:**
  - Xây dựng `src/components/production/TrayScheduleGantt.tsx`:
    - Truy vấn trực tiếp view `v_tray_schedule_gantt` kết hợp danh sách 14 máy dập (`machines`).
    - Render 14 dòng máy dập cố định (`MACH-1` đến `MACH-14`) với nhãn máy bên trái sticky.
    - Timeline cuộn ngang mượt mà, phân chia theo từng ngày (`110px/ngày`) kèm 2 ca 昼 (08-20h) và 夜 (20-08h).
    - Tính toán vị trí bar chính xác theo `scheduled_start` và `scheduled_end`.
    - Màu sắc trạng thái trực quan: `PLANNED` (xanh dương), `IN_PROGRESS` (vàng hổ phách), `DONE` (xanh lục), `OVERDUE` (đỏ).
    - Tooltip nổi tương tác hiển thị đầy đủ **7 trường dữ liệu bắt buộc**: WO, Mã SP, Kế hoạch/Thực tế khay, Nhựa, Cuộn màng & số mét còn lại, Deadline giao hàng, Tên thợ/operator.
    - Click vào thanh bar mở modal xem chi tiết lệnh dập.
    - Bộ lọc đa năng: Điều hướng ngày (7日前 / 7日後 / Hôm nay), chọn nhanh (今週 / 2週間 / 1ヶ月), lọc máy, lọc trạng thái, tìm kiếm tức thì.
- **[T5 - Component TrayScheduleGrid]:**
  - Xây dựng `src/components/production/TrayScheduleGrid.tsx`:
    - Bảng dữ liệu chi tiết **11 cột chuẩn spec PE**: Ngày dập (`MM/DD`), Ca dập (🌞 DAY / 🌙 NIGHT badge), Máy dập (`MACH-X X号機`), Mã SP (link sang product master), Chỉ thị No (`wo_code`), SL Kế hoạch (`#,###`), SL Thực tế + thanh tiến độ %, Nhựa & Cuộn màng, Thợ vận hành, Deadline giao hàng (badge đỏ cảnh báo nếu ≤ 3 ngày), Trạng thái badge.
    - Sắp xếp động tăng/giảm trên các cột ngày, máy, kế hoạch.
    - Ô tìm kiếm debounce 300ms theo mã SP, mã WO, cuộn màng, thợ dập.
- **[T6 - Tích hợp 3-Tab vào /production/schedule/page.tsx]:**
  - Nâng cấp `src/app/production/schedule/page.tsx` với thanh điều hướng 3 Tab:
    - **Tab 1: 🗜️ 成型機スケジュール [14機]** (Mặc định - Tray Schedule Gantt)
    - **Tab 2: 📋 成型指示一覧** (Tray Schedule Grid DataTable)
    - **Tab 3: 🛠️ 金型・設計工程** (Bảo tồn nguyên vẹn 100% component Tooling Gantt cũ)
- **[Verification]:** `npx tsc --noEmit` = 0 errors.
- **[Commit]:** `2af710f` — `feat(M13): Tray Production Schedule — Gantt + Grid + 3-tab integration` đã push lên `origin main`.

## Milestone 13: Tray Production Schedule (M13-S2 Complete: T7 + T8 + T9 + T10)
[AN @ 2026-09-04 09:38 JST]

- **[T8 - Shipment Countdown Integration]:**
  - Tích hợp logic đếm ngược `getDeadlineUrgency(requested_delivery)` hiển thị nhãn: `期限超` (đỏ đậm), `残X日` (đỏ/vàng/xanh theo độ khẩn cấp).
  - Hiển thị trực tiếp trên thanh bar Gantt, tooltip chi tiết và cột 納期 trong Grid.
  - Bổ sung thanh cảnh báo `UrgentSummaryBanner` ở đầu Tab 1 thống kê số lượng đơn hàng cần giao trong 7 ngày và số ca dập có nguy cơ trễ hạn.
- **[T7 - Plastic Roll Inventory Panel]:**
  - Tạo `src/components/production/PlasticRollPanel.tsx` (Sidebar dock bên phải 320px, có nút gập/mở).
  - Sắp xếp cuộn theo mức độ ưu tiên: Cuộn nguy cấp `current_length_m < 500m` lên đầu với badge `⚠️ 補充急`.
  - Công thức ước tính số khay còn lại qua bước dập `feed_length_mm` từ `machines`.
  - Tương tác thông minh: Click vào cuộn màng trên sidebar sẽ kích hoạt `highlightRollId`, làm nổi bật thanh bar dập tương ứng trên Gantt và làm mờ các bar khác.
  - Chỉ hiển thị ở Tab 1 và Tab 2, tự động ẩn ở Tab 3 (Tooling).
- **[T9 - Machine Utilization Heatmap]:**
  - Tạo `src/components/production/MachineHeatmap.tsx`: Ma trận 196 ô (`14 máy × 14 ngày`).
  - Phân màu mật độ sản lượng theo 5 mức từ trắng (&lt;0), xanh nhạt (&lt;5k), xanh vừa (5-8k), xanh đậm (8-15k) đến xanh navy (≥15k đầy tải 2 ca).
  - Bấm vào bất kỳ ô nào trên heatmap sẽ tự động nhảy sang Tab 2 (`tray-grid`) và lọc chính xác vào máy + ngày đó.
  - Nút chuyển đổi giao diện `[📊 ガントチャート]` ↔ `[🔥 稼働ヒートマップ]` đặt tại PageHeader.
- **[T10 - Quick Schedule Create Modal]:**
  - Tạo `src/components/production/QuickScheduleModal.tsx`: Nút `[+ 成型指示登録]` tại PageHeader mở modal tạo nhanh lịch dập.
  - Tự động tính toán `scheduled_start` và `scheduled_end` chuẩn mực theo ca ngày 昼 (08-16h) và ca đêm 夜 (20-04h).
  - Insert trực tiếp vào `production_schedules` và trigger `refreshKey` reload dữ liệu trên cả Gantt và Grid.
- **[TypeScript & Types]:**
  - Cập nhật 6 cột mới của migration 089 vào `production_schedules` (Row, Insert, Update) trong `database.types.ts`.
  - Kiểm tra `npx tsc --noEmit` = 0 errors.

## Milestone 13 Closed & Security Hardening Sprint (Migration 091 Prepared)
[AN @ 2026-09-04 09:56 JST]

- **[Milestone 13]:** Đóng chính thức trọn vẹn cả Sprint 1 (8/8 PASS) và Sprint 2 (16/16 PASS).
- **[Security Hardening Plan & Migration 091]:**
  - Soạn thảo `supabase/migrations/20260904000002_091_security_hardening.sql` xử lý toàn bộ 4 nhóm cảnh báo của Supabase Security Advisor:
    1. `[URGENT]` Chuyển `v_tray_schedule_gantt` và `v_dashboard_executive_kpis` sang `SET (security_invoker = true)` để tôn trọng RLS của người dùng gọi.
    2. `[HIGH]` `REVOKE EXECUTE ... FROM anon, public` trên 5 hàm SECURITY DEFINER nhạy cảm (`fn_sync_invoice_payment`, `fn_transition_product_lifecycle`, `hide_company`, `promote_company_to_ssot`, `remap_company_fks`). Chỉ cho phép `authenticated` và `service_role`.
    3. `[MEDIUM]` Thiết lập RLS policies `Allow authenticated full access` cho 11 bảng đang bật RLS nhưng thiếu policy (`design_task_logs`, `employee_skills`, `forming_daily_logs`, `grinding_daily_logs`, `inspection_daily_logs`, `payroll_records`, `press_daily_logs`, `shipment_lots`, `sm_captures`, `sm_devices`, `transport_daily_logs`).
    4. `[LOW]` Khóa chặt `SET search_path = public` trên các hàm/trigger chống schema injection.
  - Commit: `4670206` đã push lên `origin main`.

## Security Hardening Sprint — Migration 091 APPLIED & CLOSED
[AN @ 2026-09-04 10:33 JST]

- **[Nghiệm thu Migration 091]:**
  - PE đã apply thành công Migration 091 trên Supabase Production.
  - Sửa lỗi signature: `rpc_adjust_roll(uuid, numeric, text, text, text)` (đã cập nhật vào file migration trong repo).
  - Trạng thái bảo mật sạch toàn diện:
    - 2/2 Views chuyển sang `security_invoker = true` (`v_tray_schedule_gantt`, `v_dashboard_executive_kpis`).
    - 5/5 RPCs nhạy cảm đã thu hồi quyền `anon`, chỉ cấp cho `authenticated` và `service_role`.
    - 11/11 Bảng kích hoạt RLS đã có policy `Allow authenticated full access`.
    - 8/8 Functions đã khóa chặt `SET search_path = public`.
  - **Bài học kinh nghiệm (Lesson Learned):** Khi viết migration có `ALTER FUNCTION`, luôn truy vấn `pg_get_function_identity_arguments(p.oid)` từ `pg_proc` để đối chiếu chính xác thứ tự tham số thay vì nhớ từ code.
- **Trạng thái hệ thống:** Đạt chứng nhận **Clean Security Pass** — Toàn bộ Milestone 13 và Security Hardening Sprint đã CLOSED. Sẵn sàng khởi động **Milestone 14**.
