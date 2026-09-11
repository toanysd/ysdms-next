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
| Migration 089–105 | ✅ Applied to production |
| TypeScript build | ✅ 0 errors |
| i18n | ✅ 0 missing keys |
| Next Step | Kính trình PE & Anh Thoan nghiệm thu Hồ sơ Quy chuẩn Báo giá; Tiếp nhận chỉ thị tiếp theo (M23-B / M26) |

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

