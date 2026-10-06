# SESSION HANDOFF — 2026-09-25 (Pha 1 Data Remediation Closed)

> **Mục đích:** Tài liệu này là nguồn sự thật duy nhất khi bắt đầu phiên thảo luận mới.
> PE = Perplexity (Project Engineer — phân tích, kiến trúc, ra quyết định).
> AN = Antigravity / Claude (Executing Agent — viết code, commit, migrate DB).
> Anh Thoan = Product Owner (xác nhận nghiệp vụ, approve cost, DROP/archive DB).

---

## 1. TRẠNG THÁI DỰ ÁN

| Hạng mục | Trạng thái |
|---|---|
| Kiến trúc cốt lõi (ADR-001~003, ADR-007, ADR-008, ADR-009) | ✅ APPROVED & LOCKED |
| M14 — Shopfloor Execution & Equipment Lifecycle | ✅ NGHIỆM THU (Pushed) |
| M15 — NG Trend Analysis & Inspection QC PDF | ✅ NGHIỆM THU (Pushed) |
| M16 — Equipment Location & Transfer Module (ADR-008) | ✅ NGHIỆM THU (commit `9eac225`) |
| M17 — Equipment QR Code & Camera AR Locator (Chỉ thị #025) | ✅ NGHIỆM THU (commit `226a680`) |
| M18 — Mold Custody, Loans & Return Workflow + 3 PDF Engines (Chỉ thị #026, ADR-009) | ✅ NGHIỆM THU (commit `bea1e2d`) |
| M19 — Work Orders UI & SET Resolution + PDF Engine (Chỉ thị #027, #028, #029, ADR-010) | ✅ NGHIỆM THU & PUSHED (commit `c2531b4`) |
| M20 — Nippo V2 Production Worklog & Step Completion Engine (Chỉ thị #030~034, ADR-011) | ✅ NGHIỆM THU & PUSHED |
| M21 — Work Order Direct Shipment & 納品書 Delivery Note PDF (Chỉ thị #039, ADR-012) | ✅ NGHIỆM THU & PUSHED (commit `128fb58f`) |
| M22 — Navigation Architecture V2 & Order->WO Shortcut (Chỉ thị #044, #045) | ✅ NGHIỆM THU & PUSHED |
| M23-A — Finished Goods Inventory Engine & Low Stock Alert (Chỉ thị #046, #047) | ✅ NGHIỆM THU & PUSHED |
| Sidebar V3 FINAL — Comprehensive Departmental Architecture (Chỉ thị #050) | ✅ NGHIỆM THU & PUSHED (commit `321aa4c`) |
| M24-A — DB Schema & Atomic RPC Pipeline (Chỉ thị #051, Migration 105) | ✅ NGHIỆM THU & PUSHED (commit `368af31`) |
| M24-B — Server Actions Pipeline (convert, updateStatus, getDetail) | ✅ NGHIỆM THU & PUSHED (commit `20fdba6`) |
| M24-C — Quotation Detail UI & Convert Modal (Chỉ thị #051) | ✅ NGHIỆM THU (commit `ba45b7f`) |
| M24-D — Quotation PDF Engine & Print Preview (Chỉ thị #051) | ✅ NGHIỆM THU & TESTED E2E (Sprint D) |
| Milestone 24 — Quotation-to-Order Pipeline (A+B+C+D) | ✅ CLOSED & HOÀN TẤT 100% |
| Module Quy chuẩn Tính toán Báo giá (`docs/quotations/`) | ✅ HOÀN THÀNH — 5 tài liệu SSOT căn cứ phôi Excel gốc YSD |
| M27-B — Work Order Auto-Creation from Order (ADR-014) | ✅ CLOSED & PUSHED (commit `07f51ec`) |
| M28-A — DB Enum Integrity & Agent Mailbox Setup | ✅ CLOSED & PUSHED (commit `dccda76`) |
| Ưu tiên 1 — Module QC NG Trends & Nhập liệu KCS (RULE-DATA-02) | ✅ CLOSED & PUSHED (commit `e4cbb45`) |
| Ưu tiên 2 — Hợp nhất Route Xuất hàng Canonical (`/shipments/`) | ✅ CLOSED & PUSHED (commit `fa71152`) |
| Ưu tiên 3 — Chuẩn hóa gá lắp SET N:N Tier 1 (1.575 dao) | ✅ CLOSED & PUSHED (commit `2f0be55`) |
| Ưu tiên 4 — Chuẩn hóa gá lắp SET Tier 2, 3A, 3B (1.633 dòng) & Bàn giao kiểm kê 98 dao | ✅ CLOSED & PUSHED (commit `a64c936`) |
| Pha 1 — Data Remediation (`work_orders` + `asset_location_logs`) | ✅ CLOSED & TESTED 100% (2026-09-25) |
| Migration 089–105 + Migration M28A (v2.1) + SHARED Support | ✅ Applied to production |
| TypeScript build | ✅ 0 errors |
| i18n | ✅ 0 missing keys |
| Next Step | Chờ quyết định từ Anh Thoan & PE: Lựa chọn Phương án A (Vận hành phòng Khuôn), B (Kiểm kê 98 dao), hoặc C (Nghiệp vụ mới) |

---

## 2. KIẾN TRÚC CỐT LÕI (LOCKED — KHÔNG THAY ĐỔI)

### ADR-001: Unified `equipment` Table
- Bảng duy nhất thay thế `physical_molds` + `cutters`.
- 8 loại: `MOLD`, `CUTTER_INLINE`, `CUTTER_SEPARATE`, `PRESSURE_BASE`, `WATER_BASE`, `FRAME`, `STACKING`, `PLUG`.
- Quan hệ SET/SHARED qua `equipment_assignments` (N:N).
- **`physical_molds` và `cutters` đã bị DROP hoàn toàn khỏi DB.**

### ADR-002: Luồng sản xuất 4 cấp
```
work_orders → jobs → job_steps → work_logs
```

### ADR-003: Tách Job theo Equipment Type & Gantt Date Filter
- Mỗi equipment type tạo 1 job riêng.
- Gantt dùng 2-Pass Date Query (jobs + job_steps).

### ADR-007: Shopfloor Tablet Cockpit & Equipment Lifecycle (M14 Dual-Sprint)
- **Sprint 1 (M14-S1):** Route `/production/floor` — Touch-optimized, auto nhận diện máy qua `localStorage`. Luồng 3 bước: Bắt đầu → Gá cuộn nhựa → Kết thúc & Báo sản lượng. Gợi ý tiêu hao: `suggested_m = (actual_quantity × feed_length_mm) / 1000`.
- **Sprint 2 (M14-S2):** Daily logs (`forming_daily_logs`, `press_daily_logs`) với checklist 7 thiết bị và phân loại 7 nhóm lỗi NG (A→G). Ngưỡng cảnh báo tuổi thọ dao/khuôn: CUTTER 40k/50k shots, MOLD 80k/100k shots, PLUG 60k/80k shots.

### Product-Centric SSOT
- `products` = MoldMaster (KHÔNG dùng `mold_masters` trong code mới).
- Mọi entity đều liên kết ngược về `product_id`.

---

## 3. SCHEMA KEY TABLES & VIEWS (Production State)

```
companies, products, design_revisions
equipment, equipment_assignments
work_orders, jobs, job_steps, work_logs
orders, order_lines, shipments, delivery_notes
invoices, invoice_lines, invoice_payments
quotations, quotation_lines
company_calendar
plastic_master, plastic_receipt_roll
production_schedules, material_consumption_logs
production_orders, production_lots
aluminum_blanks
design_approval_logs, sample_requests, product_lifecycle_logs
forming_daily_logs, press_daily_logs, grinding_daily_logs, inspection_daily_logs (schedule_id linked via M095)

Views (security_invoker = true):
v_tray_schedule_gantt, v_equipment_lifecycle_status, v_dashboard_executive_kpis
```

**Bảng đã DROP:** `physical_molds`, `cutters`.
**Cột đã DROP:** `jobs.physical_mold_id`.

---

## 4. CÁC MODULE ĐÃ HOÀN THÀNH

| Phase | Module | Trạng thái |
|---|---|---|
| R1~R4 | Product Center 360°, OCR AI, Gantt, Orders, Shipments, Quotations | ✅ DONE |
| R5 | Invoices, Customer Debt, E2E Tests, Executive Dashboard | ✅ DONE |
| R6 | Backfill job.overall_progress, Import 7,299 order lines thương mại | ✅ DONE |
| R7 | Product stubs (134), recover 1,022 order lines NOT_FOUND | ✅ DONE |
| Phase D | Migration toàn bộ FK physical_molds→equipment, Drop legacy tables | ✅ DONE |
| M8~M12 | Quotations PDF, Auto Jobs Engine, Shipment + 納品書, KPI Cockpit, Plastic WMS | ✅ DONE |
| M13 | Tray Production Schedule (14-Machine Gantt, Grid, Heatmap, Roll Panel, Quick Schedule) | ✅ DONE |
| Security | Security Hardening Sprint (Migrations 091 & 092 — Clean Security Pass) | ✅ DONE |
| Daily Ops | Grinding, Inspection, Forming, Press daily logs foundation (Migration 093 applied) | ✅ DONE |
| M14 | Shopfloor Execution & Equipment Lifecycle (Tablet /production/floor, /production/daily-logs, /equipment/lifecycle) | ✅ NGHIỆM THU |
| M15 | QC Intelligence Module (/quality/ng-trends, /quality/inspection, Monthly QC PDF) | ✅ NGHIỆM THU |

---

## 5. BACKLOG — VIỆC CÒN LẠI

### 🔴 PENDING MANUAL REVIEW (cần Anh Thoan)
1. **75 thiết bị mồ côi từ Access** — Review danh sách tại `docs/reports/live_remediation_result_031.md`. Xác nhận khuôn thật hay dữ liệu rác.
2. **172 product codes chưa giải quyết** — Mã số thuần số + unknown prefix, cần xác nhận nghiệp vụ.
3. **Security: Rotate Supabase service_role key** — Key cũ (`sb_secret_C2xqkH1...`) đã từng xuất hiện trong Git local history → vào Supabase Dashboard → Settings → API → Rotate Service Role Key (Anh Thoan ghi nhận: xử lý sau khi ổn định vận hành).

### 🟡 PENDING TECHNICAL (AN thực hiện khi được approve)
4. **`TechnicalReviewForm.tsx` UX upgrade** — Chuyển `mold_id` + `cutting_die_id` từ raw UUID text input → dropdown select fetch từ `equipment`.
5. **`mold_design_cutters.cutter_id` drop** — Cột đã deprecated hoàn toàn (UI đã chuyển sang `equipment_id`). Chờ archive data + sign-off Thoan trước khi DROP.
6. **RLS policies** — `material_stock`, `work_orders` chưa có RLS. Postponed bởi Product Owner.

### 🟢 FEATURE BACKLOG (ưu tiên tiếp theo)
7. **Milestone 14 Sprint 1: Shopfloor Tablet Cockpit (`/production/floor`)** — Touch-first UI cho 14 máy dập khay (`MACH-1` → `MACH-14`), auto nhận diện máy qua `localStorage`, quy trình 3-touch (Bắt đầu → Gá cuộn → Kết thúc & báo sản lượng), gợi ý tiêu hao nhựa tự động theo `feed_length_mm` | ✅ **DONE**
8. **Milestone 14 Sprint 2: Daily Logs & Equipment Lifecycle (`/production/daily-logs`, `/equipment/lifecycle`)** — Dashboard vòng đời thiết bị với ngưỡng cảnh báo CUTTER 40k/50k shots, MOLD 80k/100k shots, nút Bảo trì xong, và View tổng hợp daily logs | ✅ **DONE**
9. **Milestone 15: QC Intelligence Module (`/quality/ng-trends`, `/quality/inspection`)** — Phân tích xu hướng phế phẩm NG Trends, xếp hạng máy & sản phẩm, đối soát KCS dập vs kiểm tra ngoại quan, xuất báo cáo Monthly QC PDF | ✅ **DONE**
10. **Location/Transfer Module** — `LocationMoveModule.tsx`, `LocationTab.tsx`, `TransferTab.tsx` đã có Group A fallback logic. Cần hoàn chỉnh UX.
11. **Mobile-first Worklog** — Tối ưu UI nhập nhật ký trên điện thoại tại xưởng.

---

## 6. QUY ƯỚC LÀM VIỆC

### Workflow PE ↔ AN
1. PE viết Directive (`#NNN`) với mục tiêu và constraint rõ ràng.
2. AN phân tích, hỏi lại nếu cần, rồi thực thi.
3. AN commit với message chuẩn: `feat/fix/refactor/docs(scope): mô tả ngắn`.
4. AN cập nhật `PE_AN_COORDINATION_LOG.md` sau mỗi directive.
5. AN chạy `npx tsc --noEmit` + `node scripts/check_translations.mjs` trước mọi commit.

### Quy tắc KHÔNG vi phạm
- KHÔNG query `physical_molds` hoặc `cutters` trong bất kỳ code mới nào.
- KHÔNG dùng `mold_masters` table cho code mới (dùng `products`).
- KHÔNG hardcode UUID/ID trong migrations.
- KHÔNG DROP bảng/cột mà không có backup CSV + sign-off Thoan.
- KHÔNG commit code có TS errors.

### Nguồn sự thật
- Schema: `docs/SCHEMA_REFERENCE.md` (KHÔNG dùng README.md)
- ADR: `docs/adr/ADR-001`, `ADR-002`, `ADR-003`, `ADR-007`
- Coordination: `docs/PE_AN_COORDINATION_LOG.md`

---

## 7. THÔNG TIN KỸ THUẬT

| Item | Giá trị |
|---|---|
| Supabase Project ID | `iirezrszalmecsslbruo` |
| Region | Tokyo (`ap-northeast-1`) |
| GitHub Repo | `https://github.com/toanysd/ysdms-next` |
| Stack | Next.js 14, TypeScript, Supabase, Tailwind CSS, next-intl |
| i18n | `messages/ja.json` + `messages/vi.json` |
| Main branch | `main` |
| Last verified commit | `07f51ecd31e5d56d5dfa5e1e106677903a841d73` (Milestone 27B: Order to Work Order Auto-Creation — 2026-09-11) |


---

## 8. TÓM TẮT CHO AN KHI BẮT ĐẦU PHIÊN MỚI

Bạn là AN (Executing Agent). Đây là dự án **ysdms-next** — hệ thống quản lý sản xuất khay nhựa cho YSD (Yoshida Package).

**Kiến trúc cốt lõi:** Unified `equipment` table (ADR-001), luồng 4 cấp work_orders→jobs→job_steps→work_logs (ADR-002), Shopfloor Tablet & Equipment Lifecycle (ADR-007), QC Intelligence (M15), Rack Code Convention 12 zones (ADR-008), Mold Custody & Return Legal Workflow (ADR-009), Work Order Equipment SET Resolution 3-Tier Algorithm & Gatekeeper (ADR-010).

**Trạng thái hiện tại:** 
- Milestone 24 (Quotation-to-Order Pipeline — FULL PIPELINE CLOSED ✅):
  * Sprint A (commit `368af31`): Migration 105 applied trên Live DB, cập nhật `SCHEMA_REFERENCE.md`, dự thảo `ADR-013`, bổ sung 3 trường tiền đề cho M23-B trên `products`.
  * Sprint B (commit `20fdba6`): 3 Server Actions (`convertQuotationToOrderAction`, `updateQuotationStatusAction`, `getQuotationDetailAction`) trong `src/app/orders/quotations/actions.ts`.
  * Sprint C (commit `ba45b7f`): Giao diện chi tiết Báo giá `/orders/quotations/[id]` (Server Component theo RULE-UI-10 Paper style, Status Badge 6 màu chuẩn, Converted banner, Read-only lock) và Client Component `ConvertModal.tsx` với flow chuyển đổi nguyên tử sang Đơn hàng. Đã loại bỏ 100% `(as any)` trong `actions.ts`.
  * Sprint D (commit `06f6b66`): A4 Portrait PDF Quotation Engine (`QuotationPDF.tsx` + `/api/quotations/[id]/pdf/route.ts`) chuẩn phôi biểu mẫu thực tế Yoshida Package. Đầy đủ bảng tài chính 3 dòng (Tiểu kế, Thuế 10%, Tổng thanh toán), Hanko 3 ô 96px có dấu đỏ Yoshida, bind người phụ trách động từ DB (xóa bỏ hardcode), liên kết thông số CAD SSOT từ `design_revisions`. Đã test E2E render PDF và Live DB queries pass 100%.
- Module Quy chuẩn Tính toán Báo giá (`docs/quotations/` — HOÀN THÀNH ✅):
  * Biên soạn và hệ thống hóa 5 tài liệu kỹ thuật SSOT căn cứ 100% phôi tính toán thực tế của YSD (`金型見積もり基準.xls`, `金型見積計算書.xlsx`, `見積り計算書(新）.xlsx`, `見積原価計算書フォーマットver6.xlsx`).
  * Chuẩn hóa ma trận giá khuôn (¥170k~¥320k), chính sách chiết khấu theo LOT khay (giảm ¥10k~¥30k), công thức khay 3 trụ cột (vật liệu: Loss 1.05, Pitch L+15mm, Film W+40mm; đóng gói thùng; dập máy chiết khấu theo LOT).
  * Lập hồ sơ đặc tả nâng cấp `quotation-engine.ts` chuẩn bị sẵn sàng cho Milestone 26.
- Quality Gates: TypeScript 0 errors, i18n 0 missing keys.

---

## 9. MILESTONE 27 — GIAI ĐOẠN B: WORK ORDER → JOB LINKING (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-11 15:42 JST
- **Commit SHA đã nghiệm thu:** `07f51ecd31e5d56d5dfa5e1e106677903a841d73` (`07f51ec`)
- **HEAD Git hiện tại trên `origin/main`:** `07f51ecd31e5d56d5dfa5e1e106677903a841d73`
- **Hồ sơ kiến trúc:** `docs/adr/ADR-014_order-to-work-order-auto-creation.md` (APPROVED)

### 9.1. Trạng thái Triển khai: Order → Work Order → Jobs Auto-Creation (Đã hoàn tất)

- Đã bổ sung Server Action `createWorkOrderFromOrderAction(orderId)` tại `src/app/orders/[id]/actions.ts`:
  * Ràng buộc trạng thái: Chỉ cho phép tạo khi `orders.order_status IN ('CONFIRMED', 'IN_PRODUCTION')`.
  * Ràng buộc Idempotency: Kiểm tra không cho phép tạo trùng lặp nếu Order đã có WO liên kết.
  * Tự sinh `wo_code` chuẩn bằng RPC `generate_wo_code()` (`WO-YYYY-NNNNNN`).
  * Tự động giải quyết `product_id`, `design_revision_id`, `company_id`, `deadline` từ `orders` và `order_lines`.
  * Sau khi tạo WO, tự động gọi ngay `generateJobsForWorkOrder(newWo.wo_id)` để phát hành Jobs & Steps theo 8 loại thiết bị (ADR-002, ADR-003).
- Cập nhật giao diện `src/app/orders/[id]/_components/WorkOrderLinker.tsx`:
  * Bổ sung nút **「製造指示作成」** tại Header và Empty state của Tab Lệnh sản xuất.
  * Đổi đường dẫn router từ `/equipment/jobs/${wo.wo_id}` (sai route) thành `/production/work-orders/${wo.wo_id}` (đúng route chi tiết WO).
  * Truyền prop `orderStatus` từ `src/app/orders/[id]/page.tsx`.
- Quality Gate: `npx tsc --noEmit` pass 0 errors; `tests/pricing_engine.test.ts` pass 12/12; `check_translations.mjs` pass 0 missing keys.

### 9.2. Ghi nhận Nợ Kỹ thuật & Mâu thuẫn Cần Xử lý (Technical Debt & Discrepancies)
1. **Enum DB Chưa Enforce (CHECK constraint):**
   * Các cột `quotations.status`, `work_orders.wo_status`, `jobs.job_status`, `job_steps.step_status` không có DB CHECK constraint, chỉ được bảo vệ ở tầng TypeScript / Server Action guards. Cần bổ sung migration CHECK constraint khi chuẩn hóa.
2. **Mâu thuẫn `quotation_type`:**
   * CHECK constraint thực tế trên DB (Migration `20260821000001_daily_logs_phase_b.sql`):
     `CHECK (quotation_type IN ('MOLD_NEW', 'MOLD_REMAKE', 'TRAY_REPEAT', 'SERVICE', 'STORAGE_FEE'))`
   * Trong khi `CreateQuotationModal.tsx` chèn giá trị: `'MOLD' | 'TRAY' | 'SET'`.
   * Trong `QuotationPDF.tsx`: Điều kiện kích hoạt trang 2 phụ lục: `data.quotation_type === 'TRAY' || data.quotation_type === 'SET' || !data.quotation_type`.
   * Hiện tại PDF vẫn render được phụ lục nếu `quotation_type` để trống/null (`!data.quotation_type`), nhưng nếu DB lưu `'TRAY_REPEAT'` thì điều kiện `hasTrayCalc` sẽ bị false. Cần migration đồng bộ enum hoặc cập nhật mapper logic.
3. **Lưu ý Quy trình Làm việc (Workflow & Audit Integrity):**
   * Tuyệt đối không gán phát biểu cho PE hoặc trích dẫn tài liệu không tồn tại/chưa được kiểm chứng nguồn gốc.
   * Mọi giải trình kỹ thuật phải căn cứ trực tiếp vào dữ liệu và bằng chứng thực nghiệm (code, Git commits, DB queries, test logs) để đảm bảo tính minh bạch và độ tin cậy tuyệt đối của quy trình audit chéo.

---

## 10. MILESTONE 28 — GIAI ĐOẠN A: DB ENUM INTEGRITY & AGENT MAILBOX SETUP (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-11 18:15 JST
- **Commit SHA đã nghiệm thu:** `dccda764f1a3cb47e21da68e57ef4a96c0fa34ce` (`dccda76`)
- **HEAD Git hiện tại trên `origin/main`:** `dccda764f1a3cb47e21da68e57ef4a96c0fa34ce`
- **Hồ sơ tham chiếu:** `docs/mailbox/README.md`, Migration `20260911000001_m28a_db_enum_integrity_v2_1.sql`

### 10.1. Nội dung Triển khai & Nghiệm thu
1. **5 CHECK Constraints siết chặt Enum trên DB sống:**
   - `quotations.status IN ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'CONVERTED')`
   - `quotations.quotation_type IN ('SET', 'MOLD', 'TRAY')`
   - `work_orders.wo_status IN ('DRAFT', 'PENDING', 'IN_PROGRESS', 'READY_FOR_PRODUCTION', 'COMPLETED', 'CANCELLED')`
   - `jobs.job_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`
   - `job_steps.step_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`
2. **Chuẩn hóa 2 hàm RPC PostgreSQL:**
   - `rpc_confirm_work_order`: gán canonical `'PENDING'` (thay vì legacy `'PLANNED'`).
   - `rpc_start_job`: chấp nhận `'PENDING'` / `'IN_PROGRESS'`, gán bước đầu tiên `'PENDING'` (thay vì legacy `'NOT_STARTED'`).
3. **Chuẩn hóa dữ liệu legacy trên Supabase production:**
   - 1 job `NEW` -> `PENDING`, 1 job step `NOT_STARTED` -> `PENDING`, 0 dòng vi phạm `CONFIRMED`.
4. **Refactor Codebase (18 files):**
   - Toàn bộ frontend/backend/server actions đã loại bỏ triệt để các enum legacy (`NEW`, `NOT_STARTED`, `CONFIRMED`, `ACCEPTED` cho jobs/steps/wo).
   - Đã xác nhận `npx tsc --noEmit` đạt 0 errors.
5. **Hạ tầng Agent Mailbox qua Git:**
   - Đặt tại `docs/mailbox/` (`README.md`, `OUTBOX_PE.md`, `OUTBOX_AN.md`) theo cơ chế Single-Writer (Bất đối xứng) nhằm loại trừ 100% rủi ro Git merge conflict.
   - Đã thông tuyến thành công giữa PE và AN qua Git API.

---

## 11. ƯU TIÊN 1 — MODULE QC NG TRENDS & NHẬP LIỆU KCS (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-14 17:52 JST
- **Commit SHA đã nghiệm thu:** `e4cbb45615d7b21943357b0d9eaac0cccfb3a598`
- **Nội dung:** Refactor toàn diện module KCS/QC, loại bỏ `job_qc_logs.equipment_id` (tuân thủ RULE-DATA-02), JOIN 2 cấp `job_steps -> jobs -> equipment`, bổ sung trang nhập liệu KCS nhanh `/production/qc/new` và nút điều hướng tại `/quality/ng-trends`. Test và dọn dẹp sạch sẽ 0 dòng rác.

---

## 12. ƯU TIÊN 2 — HỢP NHẤT ROUTE XUẤT HÀNG SHIPMENTS CANONICAL (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-15 12:20 JST
- **Commit SHA đã nghiệm thu:** `fa711521cc932512958a6226d16c67b47d3334d6`
- **Mailbox Commit HEAD:** `a3ffaf5713f0d0ac308f2ad5164e595d0733a837`
- **Nội dung:** Hợp nhất `/orders/shipments/` vào route chuẩn `/shipments/` (ADR-012, AGENTS.md Rule 1), server redirects bảo toàn 100% `searchParams`. Kiểm thử thực tế thành công cả 2 luồng WO-direct (`WO-L-1248`) và Order-based (`ORD-20260108-KDS`). Dọn dẹp sạch sẽ nguyên trạng DB.

---

## 13. ƯU TIÊN 3 — CHUẨN HÓA GÁ LẮP SET N:N `equipment_assignments` (TIER 1 CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-15 17:40 JST
- **Trạng thái Database:** `equipment_assignments` đạt **1.577 bản ghi** (1.575 cặp Tier 1 được backfill an toàn).
- **Tính toàn vẹn:** `SELECT related_equipment_id ... HAVING count(*) > 1` = **0 dòng** (không trùng lặp, bảo đảm chuẩn "1 dao – 1 khuôn chính").
- **Hình thức thực thi:** Do **PE trực tiếp phân bổ và thực thi độc lập** trên Supabase (không dùng 3 file `batch_2a/2b/2c` gốc của AN do phát sinh chênh lệch tích Descartes khi JOIN):
  * `AI OCR 工程票取込 自動セット設定` (gốc): 2 dòng
  * `AUTO_BACKFILL_TIER1_PILOT`: 50 dòng
  * `AUTO_BACKFILL_TIER1_FULL_LOT1_PE`: 509 dòng
  * `AUTO_BACKFILL_TIER1_FULL_LOT2_PE`: 509 dòng
  * `AUTO_BACKFILL_TIER1_FULL_LOT3_PE`: 507 dòng
  * **Tổng cộng**: **1.577 dòng**.
- **Kiểm tra UI & View:**
  * Modal `/equipment/molds/[id]` (thẻ `関連抜型`) hiển thị đầy đủ, chính xác các dao cắt liên kết cho các mã kiểm tra ngẫu nhiên ở cả Lô 2 (`KSP050`, `KSP051`, `KSP053`) và Lô 3 (`SRD001`, `SMK183`, `YCM033`).
  * View `v_work_order_equipment_set` phân giải đúng toàn bộ các dao thuộc SET gá lắp của khuôn cho Work Order.
- **Tài liệu tham khảo lịch sử:** Thư mục `scripts/backfill_tier1/` đã được bổ sung ghi chú "HISTORICAL REFERENCE ONLY — KHÔNG PHẢI SCRIPT ĐÃ THỰC THI THẬT (Dữ liệu do PE tự viết và thực thi trực tiếp)".
- **Quyết định từ Anh Thoan về các dao tồn đọng:**
  * Ban đầu dự kiến chuyển tiếp vào Nợ kỹ thuật, nhưng sau đó **chính thức chuyển thành Ưu tiên 4 MỞ KHẨN CẤP** theo chỉ đạo trực tiếp của Anh Thoan lúc 17:53 JST 2026-09-15.

---

## 14. ƯU TIÊN 4 — XỬ LÝ 154 DAO CẮT TỒN ĐỌNG (TIER 2, 3, 4) (MỞ KHẨN CẤP 🚨)
- **Thời điểm kích hoạt:** 2026-09-15 17:53 JST (Chỉ đạo trực tiếp từ Anh Thoan và PE).
- **Mục tiêu:** Rà soát, xử lý và chuẩn hóa toàn bộ 154 dao cắt còn lại trong tổng số 1.731 dao cắt của xưởng YSD chưa có bản ghi `equipment_assignments`.
- **Phân loại Bước 0 (Khảo sát chi tiết):**
  * **Tier 2 (Revision Only - 38 dao):** Cùng bản vẽ CAD (`design_revision_id`), nhưng mã/tên mang biến thể hoặc hậu tố cải tiến (`R1`, `R2`, `Plug`, `NO1`, `xx`).
  * **Tier 3 (Code Only - 30 dao):** Trùng mã/tên xưởng nhưng CAD revision bị NULL (12 dao) hoặc lệch revision với khuôn (18 dao).
  * **Tier 4 (Unmatched - 86 dao):** Gồm 5 dao phụ trợ đặc thù (nhôm ALCUTTER, dưỡng da, dưỡng gỗ) + 81 dao mã thông thường không tìm thấy khuôn tương ứng trong DB (khuôn đã thanh lý hoặc chưa nhập).

### 14.1. Pha 1 — Tier 2 (38 dao Revision Only) (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-15 18:38 JST
- **Hình thức thực thi:** PE tự xác minh toàn bộ 38/38 cặp (100% UUID hợp lệ, `design_revision_id` khớp tuyệt đối giữa dao và khuôn), trực tiếp thực thi độc lập trên Supabase production.
- **Nhãn phân bổ:** `AUTO_BACKFILL_TIER2_PE` (38 dòng).
- **Trạng thái Database sau Pha 1:** Bảng `equipment_assignments` đạt **1.615 dòng** (2 gốc + 50 pilot + 509 lot 1 + 509 lot 2 + 507 lot 3 + 38 Tier 2).
- **Ràng buộc toàn vẹn:** `SELECT related_equipment_id ... HAVING count(*) > 1` = **0 dòng** vi phạm (chuẩn "1 dao – 1 khuôn chính").

### 14.2. Pha 2 — Tier 3 (Nhóm 3A & 3B: 18 dao) (CLOSED ✅)
- **Thời điểm nghiệm thu:** 2026-09-17 14:50 JST
- **Hạ tầng đã triển khai:**
  * Migration `20260915000001_support_shared_equipment_in_work_orders.sql` mở rộng View `v_work_order_equipment_set` hỗ trợ `IN ('SET_MEMBER', 'SHARED')`, vá `security_invoker = true`.
  * Server Action `work-orders/actions.ts` dòng 467 hỗ trợ `IN ('SET_MEMBER', 'SHARED')` (Commit `648e693`).
- **Hình thức thực thi dữ liệu:** PE tự thẩm định độc lập 100% UUID và trực tiếp thực thi trên Supabase production:
  * **Nhóm 3A (2 dao `SSJ013`, `SSJ013-2`):** Điền `design_revision_id = 54c6c767-...` từ khuôn anh em `SSJ013-3`, gán quan hệ `SET_MEMBER`.
  * **Nhóm 3B (16 dao lệch CAD revision):** Gán quan hệ `relationship_type = 'SHARED'`, nhãn `AUTO_BACKFILL_TIER3_SHARED_PE`.
- **Trạng thái Database sau Pha 2:** Bảng `equipment_assignments` đạt **1.633 dòng** (1.615 + 2 + 16).
- **Ràng buộc toàn vẹn:** `SELECT related_equipment_id ... HAVING count(*) > 1` = **0 dòng** vi phạm.

### 14.3. Đóng Chính Thức Ưu Tiên 4 (CLOSED ✅) & Bàn Giao Kiểm Kê Thủ Công
- **Tổng kết tự động hóa:** Đạt tỷ lệ **94,3%** (1.633 / 1.731 dao cắt đã có quan hệ SET gá lắp hoặc SHARED chính xác).
- **Phần tồn đọng dài hạn (5,7% - 98 dao):**
  * **Nhóm 3C (12 dao / 10 khuôn):** Khớp mã/tên xưởng nhưng thiếu CAD revision ở cả 2 phía.
  * **Tier 4A (5 dao):** Dao phụ trợ đặc thù (nhôm ALCUTTER, dưỡng da, dưỡng gỗ, dao mẫu).
  * **Tier 4B (81 dao):** Dao sản xuất thông thường không tìm thấy khuôn tương ứng trong hệ thống (khuôn đã thanh lý hoặc chưa nhập).
- **Hồ sơ bàn giao kiểm kê:** Đã xuất bản tài liệu hướng dẫn kiểm kê hiện trường chi tiết tại:  
  `docs/technical/inventory_98_unassigned_cutters.md` (bao gồm vị trí kệ kho, UUID, và hướng dẫn đo kiểm kích thước thực tế cho từng dao).
- **Kết luận:** Ưu tiên 4 chính thức hoàn thành và **ĐÓNG (CLOSED ✅)**.

---

## 15. NGHIỆP VỤ PHÂN XƯỞNG KHUÔN (金型部) — KHẢO SÁT MÃ NGUỒN & KIỂM TOÁN 3 LỖ HỔNG

> **Thời điểm thực hiện:** 2026-09-17 18:55 JST  
> **Căn cứ chỉ đạo:** Anh Thoan & PE (18:44 JST, 2026-09-17)  
> **Tài liệu SSOT:** `docs/technical/10_mold_department_business_process_and_data_audit.md`

### 15.1. Khảo sát 3 Lỗ hổng Dữ liệu Lớn
1. **`work_orders` 100% `OTHER` và `COMPLETED` (1.203 dòng):**
   - **Gốc rễ:** Do script import MS Access cũ (`import_access_legacy.py` dòng 179) tự sinh WO 1:1 theo Job và hardcode cứng.
   - **Thực tế:** 1.204 `jobs` con bên dưới phân loại rất chuẩn (`MOLD_NEW`: 911, `EQUIPMENT_NEW`: 226, `CUTTER_NEW`: 16...).
   - **Giải pháp:** Remap 1.154 dòng về `NEW_SET` (95,9%), 15 dòng về `REPAIR`, 34 dòng về `OTHER`. 1.202 dòng giữ `COMPLETED`, 1 dòng chuyển `PLANNED` (Job `DES-JAE380`).
2. **`asset_location_logs` chỉ có `MOLD` và `CUTTER` (1.450 dòng) — PHÁT HIỆN SỐC VỀ `asset_id`:**
   - **Gốc rễ:** File Access `locationlog.csv` chỉ có cột `MoldID` và `CutterID`.
   - **Phát hiện đột phá của AN:** AN query đối soát trực tiếp và phát hiện **0 / 1.450 (0.0%) bản ghi `asset_id` khớp với `equipment.equipment_id`** (do trỏ vào bảng cũ `physical_molds` & `cutters` đã bị DROP khi lên ADR-001).
   - **Kiểm chứng cứu vãn 100%:** AN đã test script map ngược qua `id_registry.json` và `equipment.legacy_id` (`M-xxx`, `C-xxx`) -> **1.450 / 1.450 (100.0%) phục hồi chính xác sang `equipment.equipment_id`**.
3. **`mold_location_history` (0 dòng) và `equipment_loans` (0 dòng):**
   - `mold_location_history`: Bảng tàn dư thời kỳ prototype sơ khai -> Đánh dấu `DEPRECATED` và DROP ở đợt dọn dẹp tới.
   - `equipment_loans`: Kiến trúc M18 (ADR-009) đã chuẩn bị xong 100% (schema, UI, PDF), 0 dòng do xưởng chưa bắt đầu thao tác mượn trả trên web -> Sẵn sàng đưa vào vận hành.

### 15.2. Phát hiện Lệch pha Giao diện (Sidebar)
- `/production/work-orders` (Chỉ thị Khuôn) đang bị đặt nhầm dưới **成形部 (Phòng Định hình)**.
- Mục **金型部 (Phòng Khuôn)** lại trỏ vào `/production/mold-orders` (trang cũ dùng bảng chết `mold_work_orders` 0 dòng).
- Cần hoán đổi điều hướng và dọn dẹp trang cũ.

---

## 16. KHẮC PHỤC DỮ LIỆU PHA 1: DRY-RUN ROLLUP VÀ BACKFILL LOCATION LOGS (CLOSED ✅)

> **Thời điểm hoàn thành:** 2026-09-25 09:24 JST  
> **Căn cứ chỉ đạo & Nghiệm thu:** PE & Anh Thoan (2026-09-21 ~ 2026-09-25)  
> **File SQL SSOT lưu trữ:** `docs/technical/remediation_phase1_dry_run.sql` (Commit `ce012a9`)

### 16.1. Giải trình Nguyên nhân Sai lệch Số liệu Rollup Work Orders
- **Hiện tượng:** AN trước đó báo kỳ vọng: 1.153 `NEW_SET/COMPLETED`, 1 `NEW_SET/PLANNED` (1 job), 34 `OTHER/COMPLETED`, 15 `REPAIR/COMPLETED`. Trong khi PE tự chạy câu SQL độc lập trên Supabase Production ra:
  * `NEW_SET / COMPLETED`: **1.152 WO** (1.152 jobs)
  * `NEW_SET / PLANNED`: **1 WO (2 jobs)** — mã `WO-L-1248` (`baa5074d-...`), chứa `DES-JAE380 (DESIGN)` + `JAE380 (MOLD_NEW)`
  * `OTHER / COMPLETED`: **35 WO** (35 jobs: 25 `OTHER` + 10 `INTERNAL_OPS`)
  * `REPAIR / COMPLETED`: **15 WO** (15 jobs)
  * **Tổng cộng: 1.203 Work Orders / 1.204 Jobs**.
- **Nguyên nhân gốc rễ (Root Cause):**
  * Do PostgREST API key legacy trên máy Windows bị vô hiệu hóa (`Legacy API keys are disabled` từ 2026-08-26) và DNS IPv6 chặn kết nối direct pooler, AN ở phiên trước không thực thi được câu `SELECT` trực tiếp trên Production mà suy luận phân nhóm bằng tay từ 1.204 jobs.
  * AN đã suy đoán nhầm rằng "cặp 2 jobs trong 1 Work Order nằm ở nhóm OTHER/INTERNAL_OPS" $\rightarrow$ dẫn đến trừ 1 WO ở nhóm OTHER (thành 34) và gán 1 WO cho DES-JAE380 ở NEW_SET (thành 1.153).
  * **Thực tế Production do PE phát hiện**: Cặp 2 jobs duy nhất trong 1 Work Order chính là `WO-L-1248` chứa `DES-JAE380` (`DESIGN`) + `JAE380` (`MOLD_NEW`). Cả 2 jobs này đều thuộc định nghĩa `NEW_SET`, và vì job `DES-JAE380` là `PLANNED` nên toàn bộ Work Order này thuộc nhóm `NEW_SET / PLANNED`!
  * Do đó, nhóm `OTHER / COMPLETED` giữ nguyên vẹn **35 WO** (không có cặp nào), còn nhóm `NEW_SET / COMPLETED` là **1.152 WO**.
- **Cam kết & Chuẩn hóa:** AN công nhận 100% kết quả thực thi độc lập của PE là Nguồn sự thật duy nhất (SSOT). File script `docs/technical/remediation_phase1_dry_run.sql` đã được chuẩn hóa lại toàn bộ các chú thích kỳ vọng khớp tuyệt đối với số liệu này.

### 16.2. Tiến độ Triển khai
1. **Spot-check 8 mẫu UUID:** Đã xác minh khớp 100% trên `equipment.legacy_id` (`M-373`, `M-5076`, `M-4494`, `M-5337`, `M-5593` + 3 mẫu ngẫu nhiên độc lập từ PE).
2. **File SQL SSOT `remediation_phase1_dry_run.sql`:** Chứa đầy đủ 1.130 cặp ánh xạ đại diện cho toàn bộ 1.450 bản ghi `asset_location_logs` + các truy vấn Rollup Work Orders đã cập nhật số liệu chuẩn.

### 16.3. Nghiệm thu Lỗ hổng 1 (work_orders) — CLOSED ✅
- **Thời điểm nghiệm thu:** 2026-09-21 10:49 JST
- **Hình thức thực thi:** PE trực tiếp chạy UPDATE remap trên Supabase production và tự xác minh độc lập 2 lần.
- **Kết quả xác minh thực tế:** Khớp chính xác 100% với kỳ vọng SSOT:
  * `NEW_SET / COMPLETED`: **1.152** work orders
  * `NEW_SET / PLANNED`: **1** work order (`WO-L-1248` / `JAE-380`, ID `baa5074d-...`)
  * `OTHER / COMPLETED`: **35** work orders
  * `REPAIR / COMPLETED`: **15** work orders
  * **Tổng cộng:** **1.203** work orders (không còn dòng nào mang giá trị `'OTHER'` mặc định vô nghĩa).
- **Kết luận:** Lỗ hổng 1 chính thức hoàn thành và **ĐÓNG (CLOSED ✅)**.

### 16.4. Nghiệm thu Lỗ hổng 2 (asset_location_logs) — CLOSED ✅
- **Thời điểm nghiệm thu:** 2026-09-25 09:24 JST
- **Hình thức thực thi:** Chuyển giao trọn vẹn 1.130 cặp mapping `(old_asset_id -> legacy_id)` qua 3 đợt SQL chat (380 + 380 + 370 dòng) nạp vào bảng staging `public.staging_legacy_asset_map` trên Supabase production.
- **Kết quả xác minh thực tế do PE tự kiểm chứng độc lập:**
  1. Nạp đủ 1.130 cặp ánh xạ, 1.130 UUID duy nhất = 1.130 legacy_id duy nhất.
  2. Dry-run trước khi update: **`match_percentage = 100.00%`** (1.450 / 1.450).
  3. Thực thi UPDATE chính thức trên 1.450 dòng `asset_location_logs.asset_id`, trỏ đúng `equipment.equipment_id` sống.
  4. Xác minh sau UPDATE: **`remaining_unmatched_logs = 0`** (0 dòng mồ côi).
  5. Dọn dẹp sạch sẽ bảng staging `staging_legacy_asset_map`.
  6. Phân bổ `asset_type`: `MOLD` 1.361 + `CUTTER` 89 = 1.450, khớp tuyệt đối nguyên trạng.
- **Kết luận:** Lỗ hổng 2 chính thức hoàn thành và **ĐÓNG (CLOSED ✅)**.

### 16.5. Tổng kết Toàn diện Pha 1 — Data Remediation (CLOSED ✅)

| Lỗ hổng | Trạng thái | Chi tiết nghiệm thu |
|---|---|---|
| 1. `work_orders.wo_type/wo_status` sai lệch | **CLOSED ✅** | 1.203 dòng remap đúng theo tính chất công việc thật (1.152 NEW_SET/COMPLETED, 1 NEW_SET/PLANNED, 35 OTHER/COMPLETED, 15 REPAIR/COMPLETED) |
| 2. `asset_location_logs.asset_id` mồ côi | **CLOSED ✅** | 1.450/1.450 dòng (100.0%) phục hồi sang UUID sống của bảng `equipment`, 0 dòng mồ côi |
| 3. `mold_location_history` / `equipment_loans` | **ĐÃ GHI NHẬN** | Bảng chết/chưa dùng, chuyển sang phạm vi Pha tiếp theo |

### 16.6. Quy chuẩn Giao tiếp & Bàn giao Dữ liệu Lớn (Operational Protocol)
- **GitHub (SSOT & Đối soát chọn mẫu):** AN tạo file script, commit và push lên GitHub làm tài liệu kỹ thuật SSOT lưu trữ lâu dài. PE sử dụng `search_code` và `get_commit` để kiểm tra sự tồn tại và đối chiếu chọn mẫu.
- **Chat SQL Chunks qua Bảng Staging (Thực thi hàng loạt):** Do công cụ GitHub của PE không thể kéo toàn văn các file lớn (>70KB), việc thực thi các payload dữ liệu lớn (hàng nghìn dòng INSERT/UPDATE) trên Supabase được chuẩn hóa bằng cách:
  * AN chia nhỏ dữ liệu thành các lô SQL vừa phải (300–400 dòng/lô), dán trực tiếp trong khung chat.
  * PE copy 1-click và chạy nạp vào bảng staging trung gian bền vững (`public.staging_xxx`).
  * Thực hiện Dry-run kiểm tra tỷ lệ khớp (100%) $\rightarrow$ Thực thi UPDATE $\rightarrow$ Xác minh 0 lỗi $\rightarrow$ DROP bảng staging.

### 16.7. Đề xuất Lộ trình Pha tiếp theo (Chờ Chỉ đạo từ Anh Thoan & PE)
1. **Phương án A — Chuẩn hóa Vận hành Phân xưởng khuôn (金型部):**
   - Xử lý dứt điểm Lỗ hổng 3: Đánh dấu `DEPRECATED` và DROP bảng tàn dư `mold_location_history` (0 dòng).
   - Đưa module mượn trả khuôn `equipment_loans` vào vận hành thực tế tại xưởng (hạ tầng UI, PDF, Schema M18 đã hoàn thiện 100%).
   - Hoán đổi điều hướng Sidebar: chuyển `/production/work-orders` (Chỉ thị gia công khuôn) về đúng menu **金型部 (Phòng Khuôn)**; dọn dẹp trang cũ `/production/mold-orders` dùng bảng rác `mold_work_orders`.
2. **Phương án B — Kiểm kê Hiện trường 98 Dao cắt Tồn đọng (Tier 3C & Tier 4):**
   - Triển khai theo tài liệu bàn giao `docs/technical/inventory_98_unassigned_cutters.md` cho 12 dao Nhóm 3C và 86 dao Tier 4.
3. **Phương án C — Tiếp tục Chuỗi Nghiệp vụ Báo giá & Xuất hàng:**
   - Hoàn thiện luồng Báo giá PDF (`/orders/quotations`) hoặc Phiếu giao hàng (`/shipments`).

---

## 17. TIẾN ĐỘ THỰC HIỆN KIỂM TOÁN HỆ THỐNG & DỌN DẸP NỢ KỸ THUẬT (2026-09-26)

| Giai đoạn | Hạng mục | Commit SHA | Trạng thái | Ghi chú nghiệm thu |
|---|---|---|---|---|
| Phase 0 | Security Hardening (Middleware, Upload, RLS) | `163a15e` | **CLOSED ✅** | PE & Supabase xác minh độc lập |
| Data | Xóa triệt để Lỗ hổng 3 (`mold_location_history`) | `a49064a` | **CLOSED ✅** | PE chạy `DROP TABLE` trên production |
| Phase 1 - P1 | Dọn dẹp version suffix `-v8.5.2` (6 files) | `5809833` | **CLOSED ✅** | Xóa rác, chuyển hướng an toàn |
| Phase 1 - P2 | Chuẩn hóa alias `equipment_id` trong modals | `84bf30c` | **CLOSED ✅** | Khớp 100% schema Single Source of Truth |
| Phase 1 - P3 | Gỡ `@ts-nocheck` cụm `master/molds/*` (4 files) | `bdc3c9c` | **CLOSED ✅** | `@ts-nocheck` giảm từ 10 xuống 6 files |
| Phase 1 - P4 | Khắc phục `select('*')`, N+1 queries, `.range()` | `67434ad` | **CLOSED ✅** | 8 files tối ưu, tsc 0 errors, i18n 0 errors |

### 📌 Ghi chú Nhắc nhở Quan trọng (Anh Thoan - Product Owner):
- **Token Rotation Reminder:** Sau khi HOÀN TOÀN HOÀN THÀNH TOÀN BỘ DỰ ÁN, thực hiện rotate/thay đổi Personal Access Token (classic) trên GitHub và cập nhật lại vào biến môi trường `GITHUB_TOKEN` trên Render (`ysd-moldcutter-backend`). Đã lưu vào Sổ cái dự án để tự động nhắc anh Thoan ở bước cuối cùng.

---

## 18. PHƯƠNG ÁN C — KẾT QUẢ ĐIỀU TRA `orders` & KẾ HOẠCH BACKFILL `order_lines` (2026-09-28)

### 18.1. Hiện trạng Xác minh Thực tế trên Supabase Production
- `orders`: 2.396 dòng (Chỉ chứa Header đơn hàng, mã dạng `ORD-{YYYYMMDD}-{CompanyCode}`, cột `notes` ghi: `Imported from YSDトレー受注一覧 | X lines`).
- `order_lines`: 0 dòng (trống 100% — nguyên nhân khiến autocomplete `searchOrderLinesAction()` rỗng và luồng tạo Shipment tại `/shipments/new` bị nghẽn).
- `work_orders`: 1.203 dòng (100% `order_id = NULL`, xuất phát từ Access `db_Khuon_be`, không liên quan đến đơn hàng dập định hình).
- `jobs`: 1.204 dòng (chỉ thị gia công khuôn).

### 18.2. Truy nguyên Nguồn Dữ liệu Gốc (Root Cause Tracing)
- Toàn bộ 2.396 đơn hàng trong `orders` được phân tích từ file Excel lịch sử `YSDトレー受注一覧（改2）4-22.xlsx` (bản mới nhất `9-28.xlsx` trên file share `\\SERVER\ysd-folder`) trong đợt chạy ETL Phase R6-S2 (Chỉ đạo #40, #41 ngày 2026-08-24).
- Toàn bộ chi tiết các dòng sản phẩm gắn liền với các đơn hàng này đã được phân giải đầy đủ trong file artifact `source_data/parse_output_dryrun_v2.json`:
  * Tổng số đơn: 2.399 đơn (trong đó 2.396 đơn đã nạp vào `orders`).
  * Tổng số dòng sản phẩm thuộc 2.396 đơn này: **6.279 dòng**.
  * Tỷ lệ khớp `product_id`: **100% (6.279/6.279 dòng)** đã có sẵn `product_id` hợp lệ.
  * Tổng số sản phẩm tham chiếu: **713 sản phẩm**.
  * Toàn vẹn Foreign Key: **100% (713/713 sản phẩm)** tồn tại thực tế trong bảng `products` trên Supabase Production (0 lỗi FK).
  * Tổng số lượng đặt hàng: **8.701.479 PCS** (6.277 dòng có số lượng cụ thể, 2 dòng mẫu đặc biệt gán mặc định = 1).

### 18.3. Kết quả Dry-Run Đối chiếu Độc lập (Chỉ đọc)
- Script kiểm chứng: `scripts/dry_run_backfill_order_lines.mjs`.
- Kết quả đối soát 100% tự động:
  * Matched orders: 2.396 / 2.396 (100.0%).
  * Candidate lines: 6.279 dòng.
  * FK Integrity check: 713 / 713 sản phẩm hợp lệ 100%.
  * Trạng thái kiểm chứng: **PASSED ✅** (Báo cáo chi tiết tại `docs/reports/2026-09-28_order_lines_investigation_and_backfill_proposal.md`).

### 18.4. Đề xuất Thực thi & An toàn
- Đã chuẩn bị sẵn script thực thi: `scripts/execute_backfill_order_lines.mjs`.
- Cơ chế bảo vệ: Bắt buộc truyền cờ `--execute` mới ghi dữ liệu.
- Chia nhỏ nạp theo lô (500 dòng/batch), cơ chế upsert với khóa chống trùng `(order_id, line_no)`.
- Chờ PE và Anh Thoan phê duyệt trước khi kích hoạt ghi vào Production.

### 18.5. Kho Lưu trữ SQL Staging Phân lô (`scripts/staging_order_lines/`)
- AN đã xuất toàn bộ 6.279 dòng ra thư mục `scripts/staging_order_lines/` gồm 19 files:
  * `00_setup_and_verification.sql`: DDL bảng `staging_order_lines_backfill`, query đối soát FK dry-run, lệnh INSERT vào `order_lines`.
  * `batch_01.sql` đến `batch_16.sql`: 16 file SQL, mỗi file 400 dòng (~36 KB/file, thấp hơn nhiều giới hạn 70 KB của PE), đảm bảo kéo toàn văn 100% qua GitHub.
  * `all_batches_combined.sql`: File gộp toàn bộ 6.279 dòng (~567 KB) cho thực thi 1-lần qua CLI/psql.
  * `README.md`: Bảng thống kê chi tiết từng file, số dòng, kích thước và quy trình thực hiện.




## 19. TRIỂN KHAI YÊU CẦU KIỂM ĐỊNH PE (2026-10-06) — NÂNG CẤP STAGING & 7 QUERY ĐỐI SOÁT

### 19.1. Tiếp thu Chỉ đạo Kỹ thuật từ PE
- **Phân loại trạng thái:** Mã đã viết (Code Written) đối với bộ script và staging SQL.
- **Trạng thái Production hiện tại:**
  * `orders`: 2.396 dòng.
  * `order_lines`: 0 dòng (READ-ONLY tuyệt đối: Chưa ghi bất kỳ dòng nào).
  * `products`: 8.489 dòng.
  * `public.staging_order_lines_backfill`: Chưa tạo (Chờ Anh Thoan phê duyệt cổng).
- **Đáp ứng mục 3.1 (Thiết kế Staging V2):** Bổ sung đầy đủ tracking: `batch_no INT`, `source_row_no INT`, `quantity_normalized INT`, `validation_status TEXT`, `validation_error TEXT`.
- **Đáp ứng mục 3.2 (7 Truy vấn Kiểm định A -> G):** Đã tích hợp trọn vẹn vào `00_setup_and_verification.sql` và xây dựng runner tự động `scripts/verify_pe_audit_queries.mjs`.

### 19.2. Kết quả Chạy Thực tế 7 Bài Kiểm định A -> G trên Supabase Production
- Script thực thi: `node scripts/verify_pe_audit_queries.mjs`.
- Kết quả đối soát 100% khớp thực tế:
  * **Query A (Đếm dòng & Sản lượng):** 6.279 dòng, 2.396 đơn hàng, 713 sản phẩm, 8.701.481 PCS normalized (8.701.479 PCS gốc + 2 dòng mẫu đặc biệt = 1) -> **PASSED ✅**.
  * **Query B (Duplicate khóa nguồn):** 0 trùng lặp `(order_no, line_no)` -> **PASSED ✅**.
  * **Query C (Missing orders FK):** 0 lỗi FK đơn hàng (2.396/2.396 khớp 100%) -> **PASSED ✅**.
  * **Query D (Missing products FK):** 0 lỗi FK sản phẩm (713/713 khớp 100%) -> **PASSED ✅**.
  * **Query E (Product code mismatch):** 0 mismatch (Mã sản phẩm nguồn khớp 100% với `products.product_code`) -> **PASSED ✅**.
  * **Query F (Quantity hợp lệ):** 0 lỗi (100% là số nguyên dương > 0) -> **PASSED ✅**.
  * **Query G (Line numbering 1..N):** 0 ngắt quãng (100% các đơn có số dòng liên tục từ 1) -> **PASSED ✅**.

### 19.3. Bàn giao Kho Lưu trữ Staging V2
- 16 file lô `batch_01.sql` đến `batch_16.sql`: Mỗi file ~54 KB (< 70 KB), chứa đầy đủ 13 cột dữ liệu.
- Script tự động: `scripts/export_staging_sql_batches.mjs` & `scripts/verify_pe_audit_queries.mjs`.
- Quyết định tiếp theo: Chờ Minh Chủ Thoan duyệt mở cổng nạp 16 batch vào bảng `staging_order_lines_backfill` trên Production.

### 19.4. Thực thi Nạp Thật vào Staging trên Supabase Production (Minh Chủ Đã Duyệt)
- **Thời điểm thực thi:** 2026-10-06 14:24 JST.
- **Lệnh phê duyệt từ Minh Chủ Thoan:** "Đồng thuận với PE, cho phép AN".
- **Script thi công:** `scripts/execute_staging_load_to_supabase.mjs --execute`.
- **Kết quả thực tế trên Supabase Production:**
  * Bảng `public.staging_order_lines_backfill` đã tạo thành công kèm 4 index (`order_no`, `product_id`, `batch_no`, `source_row_no`).
  * Đã nạp thành công trọn vẹn 16 lô SQL (từ `batch_01` đến `batch_16`), tổng cộng **đúng 6.279 dòng**.
  * PostgREST API xác nhận: `count = 6279`.
  * Đã chạy trực tiếp 7 truy vấn kiểm định A $\rightarrow$ G trên PostgreSQL Production:
    - **Query A:** 6.279 dòng, 2.396 orders, 713 products, tổng sản lượng normalized: 8.701.481 PCS (gốc 8.701.479 PCS + 2 PCS mẫu) $\rightarrow$ **PASSED ✅**.
    - **Query B (Duplicate):** 0 dòng trùng lặp $\rightarrow$ **PASSED ✅**.
    - **Query C (Missing orders):** 0 đơn hàng thiếu $\rightarrow$ **PASSED ✅**.
    - **Query D (Missing products):** 0 sản phẩm thiếu $\rightarrow$ **PASSED ✅**.
    - **Query E (Product code mismatch):** 0 dòng lệch mã sản phẩm $\rightarrow$ **PASSED ✅**.
    - **Query F (Quantity invalid):** 0 dòng có số lượng không hợp lệ $\rightarrow$ **PASSED ✅**.
    - **Query G (Line numbering continuity):** 0 dòng ngắt quãng $\rightarrow$ **PASSED ✅**.
- **Cam kết an toàn Production:**
  * Bảng `public.order_lines`: **Vẫn giữ nguyên 0 dòng (100% READ-ONLY)**. Tuyệt đối chưa ghi sang bảng chính khi chưa có chỉ đạo tiếp theo.
- **Trạng thái mới:** ĐÃ ÁP DỤNG VÀO SUPABASE (cho bảng staging) & ĐÃ KIỂM THỬ THỰC TẾ.

### 19.5. Phản hồi Yêu cầu PE (2026-10-06 14:35 JST) — Chuẩn hóa Output & Sẵn sàng Payload
- **Thực thi truy vấn JSON Scalar duy nhất:** Chạy qua `scripts/output_raw_scalar_audit.mjs` trực tiếp trên database `iirezrszalmecsslbruo.supabase.co`. Kết quả:
  * `staging_rows`: 6279
  * `order_lines_rows`: 0
  * `staging_orders`: 2396
  * `staging_products`: 713
  * `normalized_qty`: 8701481
  * `source_qty`: 8701479
  * `normalized_rows`: 2
  * `duplicate_keys`: 0
  * `missing_orders`: 0
  * `missing_products`: 0
  * `product_code_mismatches`: 0
  * `invalid_quantities`: 0
  * `line_number_gaps`: 0
- **Soạn thảo Payload INSERT chính thức (Mục 3.4 PE):**
  * File SQL: `scripts/prepare_official_backfill_payload.sql`.
  * Script thực thi: `scripts/execute_official_order_lines_insert.mjs` (kèm cờ `--execute` và bọc trong Transaction Rollback an toàn).
  * Quy tắc: Fail-Closed (không dùng `ON CONFLICT DO UPDATE`), Preflight kiểm tra staging=6279 và order_lines=0, Postflight kiểm tra tính toàn vẹn và orphan FK.
- **Trạng thái:** Dừng lại ở khâu sẵn sàng, chờ PE nghiệm thu scalar và Minh Chủ Thoan duyệt quyền ghi `order_lines`.

## 20. NGHIỆM THU THỰC THI CHÍNH THỨC: NẠP THÀNH CÔNG 6.279 DÒNG VÀO public.order_lines (2026-10-06 14:42 JST)

### 20.1. Căn cứ Phê duyệt
- **Chỉ thị từ Minh Chủ Thoan:** "Đồng ý cho AN INSERT một lần 6.279 dòng vào public.order_lines, với preflight và postflight audit, transaction fail-closed, không cập nhật xung đột."
- **Phê duyệt Kỹ thuật từ PE:** Báo cáo "Quyết định PE — Phê duyệt INSERT" lúc 2026-10-06 14:40 JST.

### 20.2. Quá trình Thực thi (Execution Log)
- **Thời gian thực thi:** 2026-10-06 14:42:25 JST (`2026-10-06T05:42:25.219Z`).
- **Script thi công:** `node scripts/execute_official_order_lines_insert.mjs --execute`.
- **Preflight Audit:**
  * `staging_rows`: 6279 (ĐẠT)
  * `order_lines_rows`: 0 (ĐẠT)
  * `missing_orders`: 0 (ĐẠT)
  * `missing_products`: 0 (ĐẠT)
  * `duplicate_keys`: 0 (ĐẠT)
  * `invalid_quantities`: 0 (ĐẠT)
  * `line_gaps`: 0 (ĐẠT)
- **Thao tác INSERT:** 1 transaction duy nhất, fail-closed, không dùng `ON CONFLICT DO UPDATE`. Insert đúng 6.279 dòng.
- **Postflight Audit:**
  * `inserted_rows`: **6279** (Kỳ vọng: 6279) $\rightarrow$ **ĐẠT**
  * `order_lines_total`: **6279** (Kỳ vọng: 6279) $\rightarrow$ **ĐẠT**
  * `quantity_total`: **8.701.481 PCS** (Kỳ vọng: 8.701.481) $\rightarrow$ **ĐẠT**
  * `duplicate_order_line_keys`: **0** $\rightarrow$ **ĐẠT**
  * `missing_order_fks`: **0** $\rightarrow$ **ĐẠT**
  * `missing_product_fks`: **0** $\rightarrow$ **ĐẠT**
  * `invalid_remaining_qty`: **0** $\rightarrow$ **ĐẠT**
  * `invalid_shipped_qty`: **0** $\rightarrow$ **ĐẠT**
  * `invalid_unit_or_status`: **0** $\rightarrow$ **ĐẠT**
- **Trạng thái Database:** Transaction đã COMMIT thành công 100%.

### 20.3. Phân loại Trạng thái Mới
- **Bảng `public.order_lines`:** **ĐÃ ÁP DỤNG VÀO SUPABASE & ĐÃ KIỂM THỬ THỰC TẾ** ✅.
- **Tình trạng nợ kỹ thuật 0 order_lines:** **CHÍNH THỨC ĐƯỢC GIẢI QUYẾT TRIỆT ĐỂ (CLOSED ✅)**.
- **Các bước tiếp theo:** Chờ PE thẩm tra độc lập trên Supabase và cấp phép mở khâu kiểm thử giao diện Tạo Phiếu Giao Hàng (`/shipments/new`).

## 21. BÁO CÁO KIỂM TOÁN CHỈ-ĐỌC: TẬP DỮ LIỆU ACCESS ysdJOB_20261006.accdb (2026-10-06 15:25 JST)

### 21.1. Căn cứ Thực hiện
- **Chỉ thị Minh Chủ Thoan:** [Stamp: 2026-10-06 15:12 JST] Phê duyệt vòng audit chỉ-đọc file `ysdJOB_20261006.accdb` (584.07 MB). Tuyệt đối không ghi Supabase, không tạo bảng staging.
- **Phê duyệt Kỹ thuật PE:** Yêu cầu 10 hạng mục chứng minh kỹ thuật độc lập.

### 21.2. Kết quả Đối soát Chính
- **Tập tin nguồn:** `D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb` (612,442,112 bytes, Last Modified: 2026-10-06 13:43:26 JST).
- **Tổng số bảng:** 82 bảng (50 bảng nghiệp vụ, 32 bảng tạm `~TMP...`).
- **Phát hiện dữ liệu Delta (Mới / Chưa nạp vào Supabase):**
  * `tblJOB`: 1,230 dòng $\rightarrow$ 1,203 đã có trên Supabase, **27 Jobs MỚI** (dải JobID 1251–1278, phát sinh từ cuối tháng 8/2026 đến 06/10/2026).
  * `tblProcessingDeadline`: 2,527 dòng $\rightarrow$ 2,446 đã có, **81 Steps MỚI** (55 thuộc 27 Jobs mới, 26 thuộc 6 Jobs cũ bổ sung và 20 step có JobID=NULL).
  * `tblWorkLog`: 7,416 dòng $\rightarrow$ 7,105 đã có, **311 Work Logs MỚI** (210 logs từ tháng 8–10/2026, 94 logs có `ProcessingDeadlineID=NULL` bị script cũ bỏ qua, 7 logs lịch sử).
  * `tblMoldBorrow`: 209 dòng $\rightarrow$ **209 Phiếu mượn khuôn CHƯA NẠP** (Supabase `equipment_loans` hiện có 0 dòng).
- **Khóa Idempotency đề xuất:**
  * `jobs` / `work_orders`: `legacy_id = 'JOB-' || JobID`
  * `job_steps`: `legacy_id = 'LEGACY-STEP-' || ProcessingDeadlineID`
  * `work_logs`: `legacy_id = 'LEGACY-LOG-' || WorkLogID`
  * `equipment_loans`: `loan_code = 'LN-BORROW-' || LPAD(MoldBorrowID, 4, '0')`
- **Cam kết an toàn:** 100% Read-Only, 0 thao tác ghi vào Supabase Production. Báo cáo đầy đủ: `docs/reports/2026-10-06_access_job_database_audit_report.md`.

## 22. TINH LỌC DỮ LIỆU ACCESS & MA TRẬN PHÂN LOẠI 82 BẢNG (2026-10-06 15:55 JST)

### 22.1. Căn cứ & Định hướng Kỹ thuật
- **Định hướng từ PE & Minh Chủ Thoan:** [Stamp: 2026-10-06 15:40 JST] Chuyển đổi mục tiêu sang **Access Delta Reconciliation**, phân loại rõ 5 nhóm bảng (A: Vận hành, B: Master đã map, C: Vật tư/nhựa, D: Lịch sử/tham chiếu, E: Bảng tạm/trống).
- **Phân định rõ 2 nhóm vật tư:**
  * Nhựa định hình sản phẩm (`tblPlastic...`, `tblPLASTICforForming`): Thuần túy là `MATERIAL_REFERENCE` & `DESIGN_SPEC` (tham chiếu thiết kế cho khay/khuôn), không thuộc WMS kho.
  * Vật tư cơ khí khuôn (`DatHangVTTbl`, `VatTuTbl`, `VatTuSDtbl`): Phôi nhôm A5052, thép, dao phay CNC và vật tư tiêu hao ca làm việc gắn với `JobID` và `WorkLogID`.

### 22.2. Kết quả Hoàn thành Vòng A
- **Ma trận 82 bảng chuẩn hóa:** Đã hoàn thành 100% với 17 trường thông tin (`classification`, `data_role`, `operational_effect`, `import_decision`...). File: `docs/reports/2026-10-06_access_classification_matrix_and_refinement_report.md` và `scripts/access_82_tables_classification_matrix.json`.
- **Hiệu chỉnh 6 điểm PE yêu cầu:**
  1. `mold_work_orders`: Đã chứng minh bằng chứng thực tế: 0 dòng trong DB, 0 dòng trong code `src/`, đã deprecated theo ADR-002 (Work Order Model Option C 4 tầng).
  2. `equipment_loans`: Đã chỉnh sửa enum chuẩn theo Migration 097/098: `loan_type IN ('BORROW', 'RETURN', 'REPAIR_OUT')`, `status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RETURNED', 'CANCELLED')`.
  3. 20 steps `JobID = null`: Phân loại `HOLD_STAGING_UNRESOLVED_PARENT`.
  4. 94 work logs `ProcessingDeadlineID = null`: Xác định chính xác là giờ công bảo trì xưởng (máy nén khí, vệ sinh khuôn, Kaizen), phân loại `HOLD_INTERNAL_TASK_NEEDS_JOB_SPEC`.
  5. Quan hệ 1:N giữa `tblTray` và `tblMoldDesign`: Kiểm chứng 3,870 khay, 296 khay có nhiều revisions.
  6. 27 Jobs mới & 81 Steps mới: Toàn bộ phát sinh từ cuối tháng 8 đến 06/10/2026.
- **Cam kết an toàn:** 100% Chỉ-đọc, 0 thao tác ghi Supabase Production. TypeScript `npx tsc --noEmit` đạt 0 errors.

## 23. AUDIT TOÀN DIỆN LOGIC ỨNG DỤNG ACCESS & TRÍCH XUẤT TĨNH (2026-10-06 16:15 JST)

### 23.1. Căn cứ & Cơ chế Thực thi
- **Phê duyệt chỉ đạo:** Minh Chủ Thoan [Stamp: 2026-10-06 16:02 JST] & PE [Stamp: 2026-10-06 16:01 JST].
- **Cơ chế thi công:** 100% Chế độ Chỉ-Đọc Tĩnh (Static Extraction — Read-Only Mode) thông qua Microsoft DAO 3.6 / ACE (`DAO.DBEngine.120`) và Access Object Model (`Access.Application.SaveAsText` & `VBE.VBProjects`).
- **An toàn tuyệt đối:** 0 Macro chạy, 0 AutoExec, 0 RunSQL/Execute, 0 UI tương tác. Tuyệt đối **0 ghi Supabase Production**, chưa tạo bảng staging, chưa chạy migration. File Access vật lý nguyên vẹn 612,442,112 bytes (SHA-256: `1cb7cb09...`).

### 23.2. Hoàn thành 4 Bộ Hồ Sơ Trích Xuất Tĩnh (Artifacts)
1. `scripts/access_query_inventory.json` (339 KB): Đầy đủ 585 QueryDefs (107 Named Queries, 478 form/report embedded queries). 569 READ_ONLY, 16 Action Queries (7 INSERT INTO, 9 UPDATE, 0 DELETE).
2. `scripts/access_vba_inventory.json` (291 KB): Đầy đủ 180 VBComponents (82 Standard, 7 Class, 91 Form/Report modules), 28,020 dòng mã nguồn VBA, 837 procedures. Phân loại tác động: 671 READ_ONLY, 60 UI_NAVIGATION, 49 RECORD_INSERT, 27 RECORD_UPDATE, 13 RECORD_DELETE, 17 EXTERNAL_FILE_IO.
3. `scripts/access_form_report_inventory.json` (76 KB): Danh mục 236 đối tượng (166 Forms, 70 Reports) kèm đầy đủ cấu trúc Subforms, nút bấm và liên kết sự kiện.
4. `scripts/access_logic_dependency_graph.json` (95 KB): Đồ thị phụ thuộc logic đa chiều (Form/Report $\rightarrow$ RecordSource $\rightarrow$ Referenced Tables/Queries $\rightarrow$ Event Handlers $\rightarrow$ Target Tables Affected).

### 23.3. Kết quả Chuyên sâu 5 Quy trình Vận hành Xưởng
- **Quy trình 1 (Chỉ thị & Lập lịch gia công):** Khám phá cockpit `BangDuDinhFrm` + `BangDuDinh_FullQry`. State machine `tblProcessingStatus` phân cấp 2 pha: Chuẩn bị phôi (`ZR` $\rightarrow$ `ZN` $\rightarrow$ `ZF`) và Gia công (`1.プログラム` $\rightarrow$ `2.機械加工` $\rightarrow$ `3.穴あけ` $\rightarrow$ `4.ミガキ` $\rightarrow$ `5.プラグ作成` $\rightarrow$ `6.ネル貼り` $\rightarrow$ `F.完了`). Thuật toán `FindCAVIDFlexible` tìm kiếm lòng khuôn với dung sai $\pm 0.1$ mm.
- **Quy trình 2 (Nippo & Giờ công):** Hệ thống mã công việc `tblProcessingCode` (0–999). Giải mã hoàn toàn 94 work logs không có JobID: là các tác vụ nội bộ 5S (50), bảo dưỡng máy (54), dọn kho khuôn (53), vệ sinh khuôn (55).
- **Quy trình 3 (Đặt phôi nhôm & Vật tư cơ khí):** Bộ 3 bảng `DatHangVTTbl` (1,396 dòng), `VatTuTbl` (723 dòng), `VatTuSDtbl` (64 dòng). Công thức tính đơn giá nhôm theo khối lượng riêng $2.8\text{ g/cm}^3$ trong `ChuumonshoQry`: `DonGia * 1000000 / (2.8 * t * W * L)`.
- **Quy trình 4 (Mượn/Trả khuôn & Bàn giao JAE/ATS):** 209 hồ sơ trong `tblMoldBorrow` chứa đầy đủ thông số bản vẽ, mã quản lý tài sản, bước tiến, tuổi thọ số lần dập, đơn giá tài sản và hình ảnh biên bản bàn giao.
- **Quy trình 5 (Bảo dưỡng, Phủ Teflon & Điều chuyển vị trí kệ):** Bắt sự kiện tự động đổi kệ tức thời trong `ModCutterLogRackLayerChange`, chu kỳ 3 bước mạ phủ Teflon xưởng ngoài (`ModTeflonSync`).

### 23.4. Tài liệu & Trạng thái Hệ thống
- **Báo cáo toàn diện:** `docs/reports/2026-10-06_access_application_logic_audit_report.md`.
- **Kiểm tra TypeScript:** `npx tsc --noEmit` đạt **0 errors**.
- **Trạng thái Git:** Sẵn sàng commit tài liệu và JSON artifacts lên kho mã nguồn.

## 24. KHẢO SÁT ROUTE & SCHEMA PHỤC VỤ PILOT BỘ PHẬN KHUÔN (2026-10-06 16:30 JST)

### 24.1. Căn cứ & Mục tiêu
- **Phê duyệt chỉ đạo:** Minh Chủ Thoan [Stamp: 2026-10-06 16:23 JST] & PE [Stamp: 2026-10-06 16:25 JST].
- **Mục tiêu:** Thực hiện Khảo sát Chỉ-Đọc (Strictly Read-Only Reconnaissance) trả lời chính xác 12 câu hỏi kỹ thuật về giao diện, route, server action và schema Supabase liên quan đến phân xưởng khuôn, phục vụ lập phương án triển khai thử nghiệm thực tế (Pilot).

### 24.2. Tóm tắt Kết quả 12 Câu hỏi Khảo sát
1. **Route Jobs:** Tạo tại `/equipment/jobs` (`createMoldJobAction`), `/worklogs/new` (`createQuickJob`), `/production/work-orders/[id]` (`generateJobsForWorkOrder`). Chi tiết & sửa tại `/equipment/jobs/[id]`.
2. **Route Steps:** Quản lý tại `/equipment/jobs/[id]` (Tab Steps $\rightarrow$ `EditStepModal.tsx`). Cập nhật qua `updateJobStepDetails` và `updateJobStepDates`. Tự động sinh từ `standard_process_times` và `JOB_STEP_TEMPLATES`.
3. **Route Work Logs:** Nhập chính tại `/worklogs/new` (`WorklogFormShared.tsx`), nhập theo step tại `/equipment/jobs/[id]`. Lưu qua `saveWorklogRecord` / `createWorklog`.
4. **Trường bắt buộc trong Form Work Log:** `work_date`, `employee_id`, `job_id`, `job_step_id` (bắt buộc trên UI), `hours_spent` (>0). `quantity_done` chỉ bắt buộc khi `jobCategory === 'THERMOFORMING'`.
5. **Dropdowns:** Hỗ trợ đầy đủ `job_id`, `job_step_id` (lọc động theo job), `employee_id` (ghi nhớ thợ qua `localStorage`), `machine_id`, `processing_code_id` (lọc theo phòng ban).
6. **Tác vụ nội bộ:** Schema `work_logs.job_id` là `NOT NULL` và chưa có cột `task_category`. Đề xuất tối ưu: Tạo Job xưởng nội bộ `JOB-INTERNAL-SHOP` kèm 4 bước chuẩn (5S, bảo trì, sửa khuôn, Stacking) để thợ chọn ghi nhận mà không cần sửa code/schema.
7. **Cột trạng thái:** `job_steps.step_status`, `progress_percent`, `actual_hours`; `jobs.job_status`, `overall_progress`, `completed_date`. Tự động hoàn thành qua `processStepCompletionEngine` khi `is_finished = true`.
8. **Tổng giờ công:** Tính toán đầy đủ tại 3 tầng: Step (`actual_hours`), Lập lịch/Gantt (`getJobsForGantt`), và Lệnh sản xuất (`v_work_order_progress`).
9. **Cảnh báo Deadline/Quá hạn:** `/equipment/schedule` (badge đỏ `overdueCount`, highlight đỏ trong Grid & Gantt), `/equipment/jobs` (sort deadline ASC), `/production/work-orders/[id]` (`WorkOrderProgressCockpit`).
10. **Route Lịch/Gantt sẵn sàng:** Tuyến `/equipment/schedule` vận hành 100% với 2 chế độ `ToolingExcelGridView` (lưới ma trận kiểu Excel) và `MoldJobGantt` (biểu đồ tiến độ Gantt), lọc linh hoạt 1-2 tuần hoặc 1 tháng.
11. **Dùng được ngay tại xưởng:** Quản lý Job (`/equipment/jobs`), Lập lịch & điều phối (`/equipment/schedule`), Ghi Nippo hàng ngày (`/worklogs/new`), In phiếu Nippo A4 chuẩn Nhật có dấu Hanko (`/reports/daily-worklog`).
12. **Cần tinh chỉnh thêm:** Cần nạp Job xưởng nội bộ (`JOB-INTERNAL-SHOP`), bổ sung auto-refresh trên `/equipment/schedule`, và nạp dữ liệu delta (27 Jobs & 81 Steps mới từ Access).

### 24.3. Hồ sơ & Trạng thái Kiểm tra
- **Tài liệu SSOT:** `docs/reports/2026-10-06_mold_pilot_schema_route_recon.md`.
- **TypeScript:** `npx tsc --noEmit` $\rightarrow$ **0 errors**.
- **Đa ngôn ngữ (i18n):** `node scripts/check_translations.mjs` $\rightarrow$ **0 missing keys**.
- **Cam kết an toàn:** 100% Chỉ-đọc, 0 ghi Supabase Production.


