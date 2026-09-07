# SESSION HANDOFF — 2026-09-07 (Milestone 14 Kickoff)

> **Mục đích:** Tài liệu này là nguồn sự thật duy nhất khi bắt đầu phiên thảo luận mới.
> PE = Perplexity (Project Engineer — phân tích, kiến trúc, ra quyết định).
> AN = Antigravity / Claude (Executing Agent — viết code, commit, migrate DB).
> Anh Thoan = Product Owner (xác nhận nghiệp vụ, approve cost, DROP/archive DB).

---

## 1. TRẠNG THÁI DỰ ÁN

| Hạng mục | Trạng thái |
|---|---|
| Kiến trúc cốt lõi (ADR-001~003, ADR-007) | ✅ APPROVED & LOCKED |
| M13 — Tray Schedule Cockpit | ✅ NGHIỆM THU |
| M14-S1 — Shopfloor Tablet Cockpit (/production/floor) | ✅ NGHIỆM THU (Pushed) |
| M14-S2 — Equipment Lifecycle & Daily Logs View | ✅ NGHIỆM THU (Pushed) |
| M14 Shift Policy Lock (Day Shift Only) | ✅ LOCKED |
| Security Hardening (M091–M092) | ✅ Clean Pass (0 errors, 0 anon callable) |
| Migration 089–094 | ✅ Applied to production |
| ADR-007 (M14 Shopfloor + Lifecycle) | ✅ COMMITTED |
| Phase D — Legacy Migration | ✅ 100% DONE (physical_molds & cutters đã drop) |
| Dữ liệu thương mại | ✅ 2,396 orders / 7,299 lines / ~10M trays imported |
| Dữ liệu thiết bị | ✅ 657 orphan linked — 75 còn PENDING MANUAL REVIEW |
| TypeScript build | ✅ 0 errors (sau commit f6ac506) |
| i18n | ✅ 0 missing keys |
| Last verified commit | `f6ac506` (2026-09-07) |

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
forming_daily_logs, press_daily_logs, grinding_daily_logs, inspection_daily_logs

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
9. **Location/Transfer Module** — `LocationMoveModule.tsx`, `LocationTab.tsx`, `TransferTab.tsx` đã có Group A fallback logic. Cần hoàn chỉnh UX.
10. **QC Module mở rộng** — `inspection_daily_logs` → báo cáo NG trends.
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
| Last verified commit | `f6ac506` (M14 Sprint 1 + Sprint 2 — 2026-09-07) |

---

## 8. TÓM TẮT CHO AN KHI BẮT ĐẦU PHIÊN MỚI

Bạn là AN (Executing Agent). Đây là dự án **ysdms-next** — hệ thống quản lý sản xuất khay nhựa cho YSD (Yoshida Package).

**Kiến trúc:** Unified `equipment` table (ADR-001), luồng 4 cấp work_orders→jobs→job_steps→work_logs (ADR-002), product-centric SSOT, Shopfloor Tablet & Equipment Lifecycle (ADR-007).

**Trạng thái hiện tại:** Milestone 13 & Milestone 14 đã nghiệm thu hoàn tất. Security Hardening Sprint đã Clean Pass (0 errors). Migration 089–094 đã apply thành công trên Production. Cả 2 sprints của M14 (Sprint 1: `/production/floor` và Sprint 2: `/equipment/lifecycle`, `/production/daily-logs`) đã commit và push thành công lên GitHub `origin/main`.

**Nhiệm vụ tiếp theo:** Sẵn sàng nhận Directive tiếp theo từ PE cho Milestone 15 hoặc các hạng mục Backlog (Location/Transfer Module, QC NG Trends, hoặc Mobile-first Worklog).

**Verify trước khi commit:** `npx tsc --noEmit` (0 errors) + `node scripts/check_translations.mjs` (0 missing keys).

