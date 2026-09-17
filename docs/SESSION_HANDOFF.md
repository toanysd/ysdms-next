# SESSION HANDOFF — 2026-09-08 (Milestone 18 Closed)

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
| Migration 089–105 + Migration M28A (v2.1) | ✅ Applied to production |
| TypeScript build | ✅ 0 errors |
| i18n | ✅ 0 missing keys |
| Next Step | Đợi quyết định từ Anh Thoan: Option B (Work Order Cockpit) hoặc Option C (Nghiệp vụ mới) |

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





