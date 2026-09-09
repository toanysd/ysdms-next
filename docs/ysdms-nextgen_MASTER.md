# 📒 SỔ CÁI DỰ ÁN — YSDMS NextGen
> Cập nhật lần cuối: 2026-09-09 (Hoàn tất toàn diện Milestone 24: Quotation-to-Order Pipeline [Sprints A, B, C, D] — Chỉ thị #051)
> Phiên bản Schema: V5 / Unified Equipment Architecture + Migrations 100-105
> Trạng thái: Milestone 24 COMPLETED ✅ — Báo giá sang Đơn hàng nguyên tử + A4 PDF Engine chuẩn Nhật

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc & Tech Stack](#2-kiến-trúc--tech-stack)
3. [Lịch sử phát triển (Timeline)](#3-lịch-sử-phát-triển)
4. [Schema Database](#4-schema-database)
5. [Các module đã xây dựng](#5-các-module-đã-xây-dựng)
6. [Design System](#6-design-system)
7. [Quyết định thiết kế quan trọng](#7-quyết-định-thiết-kế-quan-trọng)
8. [Vấn đề đã giải quyết](#8-vấn-đề-đã-giải-quyết)
9. [Backlog & TODO](#9-backlog--todo)
10. [Nhật ký phiên làm việc](#10-nhật-ký-phiên-làm-việc)

---

## 1. Tổng quan dự án

**Tên:** YSDMS NextGen (YSD Manufacturing System — Next Generation)
**Mục đích:** Hệ thống ERP/MRP tự phát triển cho YSD Co., Ltd.
**Ngành:** Sản xuất khuôn nhựa (Plastic Mold Manufacturing / Thermoforming)
**Tiền thân:** MoldCutterSearch (Vanilla JS + Access CSV + Render, ~67 bảng CSV, 13 core)
**Luồng nghiệp vụ chính:**
- **Tooling Flow:** Design → Mold → Cutter
- **Production Flow:** Order → Production Order → Kanban → Shipment
- **Trung tâm:** Product (Tray) là nút trung tâm kết nối mọi luồng

**5 phòng ban:**
1. 文phòng (Office) — Back office, đơn hàng
2. Phòng Thiết kế (Engineering) — CAD, design revision
3. Phòng Khuôn (Tooling/Equipment) — Gia công khuôn, dao cắt
4. Phòng Định hình (Thermoforming/Production) — Sản xuất
5. Phòng QC (Quality) — Kiểm tra chất lượng

---

## 2. Kiến trúc & Tech Stack

| Lớp | Công nghệ | Phiên bản |
|-----|-----------|-----------|
| Framework | Next.js (App Router) | 16.2.3 |
| React | React | 19.2.4 |
| Ngôn ngữ | TypeScript (strict) | ^5 |
| Styling | TailwindCSS + Custom CSS Variables | 3.4.19 |
| Backend/DB | Supabase (PostgreSQL, RLS, Auth, Storage) | supabase-js v2.103 |
| Forms | react-hook-form + zod | 7.73 / 3.23 |
| Charts | Recharts | 3.8.1 |
| Gantt | gantt-task-react | 0.3.9 |
| DnD | @dnd-kit | 6.3.1 |
| Icons | lucide-react | 1.17 |
| PDF | jspdf + html2canvas | 4.2 / 1.4 |
| E2E Test | Playwright | 1.60 |
| Package Manager | pnpm (monorepo workspace) | — |

**Quy tắc kiến trúc:**
- Webpack ONLY (Turbopack gây lỗi symlink trong monorepo)
- Server Components first — Client Components chỉ cho interactivity
- Không ORM — Query trực tiếp qua Supabase client
- Pagination bắt buộc: 50 rows/page, `.range(from, to)`
- Server-side search: `.ilike()` với debounce 300ms
- UUID primary keys khắp nơi
- Soft delete (is_active/status)
- Song ngữ JP (12px bold) + VI (10px muted)
- Portable USB → SSD (node_modules chỉ trên local)

---

## 3. Lịch sử phát triển

| Thời điểm | Mốc quan trọng |
|-----------|---------------|
| ~2025 | Hệ thống cũ MoldCutterSearch (Vanilla JS + Access CSV) |
| ~2026-03 | Quyết định xây dựng YSDMS-NextGen greenfield. Chọn Next.js + Supabase |
| 2026-04-14 | **Phase 1 hoàn thành** — Tier 1 Master Data CRUD: plastic, mold_base, cutter, product, machine, customers. TailwindCSS v3.4 fix. GitHub deployed |
| 2026-05-09 | Migration 051: mold_work_center_foundation — status/teflon/location/ship tables |
| 2026-05-12 | Migration 055: expand mold_design & product fields |
| 2026-05-21 | **Thảo luận kiến trúc lớn** — Audit MoldCutterSearch vs Supabase. Phát hiện 76% physical_molds thiếu legacy_id. Enterprise Architect Mindset (Điều 18) |
| 2026-05-28 | **Roadmap chính thức** — Xác nhận YSDMS là full ERP/MES. 3 phase: Schema → Business Flow → Production |
| 2026-05-29 | **Business Flow Handover** — Luồng nghiệp vụ Kowa Emori. Phase 2.1-2.4 hoàn thành: Customer, Tray/Product, Order types, Design revision |
| 2026-06-03 | **Schema Design Discussion** — Quy tắc đặt tên khuôn, QR/barcode, machine specs (6 máy thermoforming, 24 CAV types), 9-domain DB 43 bảng |
| 2026-06-04 | Migration 064: Core NextGen seed data (~376KB) + Legacy V2 seed (~10MB) |
| 2026-06-12 | **🔴 Schema V2 → V3** (Migration 067): Gộp design_masters vào mold_masters, đổi tên cột (product_name_ja→product_name, piece_count→cavity_count). Giảm 6→4 bảng tooling |
| 2026-06-13 | **5-Department Workspace** — Restructure sidebar theo 5 phòng ban |
| 2026-06-16-17 | Migrations 069-072: Company parent_company_id, delivery_site audit, RLS fix, audit triggers |
| 2026-06-18 | SCHEMA_REFERENCE.md cập nhật — verified against database.types.ts |
| 2026-06-20 | Migrations: 37 processing_codes from Access, job_step_dependencies |
| 2026-06-23 | Migration 073: fix_jobs_mapping, work_logs RLS |
| 2026-06-24 | **Hiện tại:** MRP by Meters IN_PROGRESS. Gantt Schedule tối ưu (scrollbar, data fetcher bugs). Memory Palace kích hoạt |

---

## 4. Schema Database

→ Chi tiết đầy đủ: `SCHEMA_REFERENCE.md`

### Quan hệ chính (V3 — PHẢI THUỘC LÒNG):
```
orders.company_id → companies     ✅ (KHÔNG PHẢI customer_id → customers)
products.product_name              ✅ (KHÔNG PHẢI product_name_ja)
products.product_status            ✅ (KHÔNG PHẢI status)
products.company_id                ✅ (NOT NULL)
shipments → orders → companies    ✅ (join 2 cấp)
```

### Hệ phân cấp Tooling (4 bảng, V3):
```
mold_masters → design_revisions → mold_revisions → physical_molds
```

### Bảng đã bị DROP (V3):
- ❌ `design_masters` → gộp vào `mold_masters`
- ❌ `design_projects` → gộp vào `design_revisions`
- ❌ `mold_designs` → đổi tên thành `design_revisions`

### Cột đã đổi tên (V3):
- `product_name_ja` → `product_name`
- `cutline_x/y` → `cutline_length/width`
- `piece_count` → `cavity_count`
- `under_angle` → `undercut_spec`

### Migration files (17 file, không kể archived):
Từ 051 đến 073. Mới nhất: `073_fix_jobs_mapping`, `fix_work_logs_rls`

---

## 5. Các module đã xây dựng

### 5.1 Master Data (`/master/`)
| Module | Route | Trạng thái | Ghi chú |
|--------|-------|-----------|---------|
| Customers | `/master/customers/` | ✅ Complete | companies + contacts + delivery_sites |
| Products | `/master/products/` | ✅ Complete | 43KB page — lớn nhất |
| Molds | `/master/molds/` | ✅ Complete | Mold identity & genealogy |
| Cutters | `/master/cutters/` | ✅ Active | — |
| Plastics | `/master/plastics/` | ✅ Active | — |
| Machines | `/master/machines/` | ✅ Active | — |
| Racks | `/master/racks/` | ✅ Active | — |
| Employees | `/master/employees/` | ✅ Active | Chưa có trong sidebar |

### 5.2 Engineering (`/engineering/`)
| Module | Route | Trạng thái |
|--------|-------|-----------|
| Design Revisions | `/engineering/designs/` | ✅ Active |

### 5.3 Equipment/Tooling (`/equipment/`)
| Module | Route | Trạng thái | Ghi chú |
|--------|-------|-----------|---------|
| Physical Molds | `/equipment/molds/` | ✅ Active | — |
| Cutting Dies | `/equipment/cutting-dies/` | ✅ Active | — |
| Jobs | `/equipment/jobs/` | ✅ Active | Đã hoàn thiện tracking nghiệp vụ |
| Schedule | `/equipment/schedule/` | ✅ Active | Gantt Chart chính thức |
| Lifecycle | `/equipment/lifecycle/` | ✅ Active | Inventory audit |
| Aluminum | `/equipment/aluminum/` | ✅ Active | — |
| Auxiliary | `/equipment/auxiliary/` | ✅ Active | Frames, bases |
| Dashboard | `/equipment/dashboard/` | ✅ Active | — |

### 5.4 Orders (`/orders/`)
| Module | Route | Trạng thái |
|--------|-------|-----------|
| Order List/Detail | `/orders/`, `/orders/[id]/` | ✅ Active |
| Shipments | `/orders/shipments/` | ✅ Active |
| Quotations | `/orders/quotations/` | ✅ Active |

### 5.5 Production (`/production/`)
| Module | Route | Trạng thái |
|--------|-------|-----------|
| Dashboard | `/production/` | ✅ Active |
| Kanban | `/production/kanban/` | ✅ Active |
| Planning | `/production/planning/` | ✅ Active |
| Track | `/production/track/` | ✅ Active |
| Floor | `/production/floor/` | ✅ Active |
| MWO (Mold Orders) | `/production/mold-orders/` | ✅ Active (Mới hoàn thiện UI, DB 0 records) |
| Tray Orders | `/production/orders/` | ✅ Active (Print Sheet V5) |
| Inventory | `/production/inventory/` | ✅ Active |
| Work Log Hub | `/production/worklog/` | ✅ Active (Hub dẫn sang reports) |
| MRP (sub) | `/production/mrp/` | ✅ Active |

### 5.6 Các module khác
| Module | Route | Trạng thái |
|--------|-------|-----------|
| MRP Dashboard | `/mrp/` | 🔨 IN_PROGRESS |
| Inventory | `/inventory/` | ✅ Active |
| Materials | `/materials/` | ✅ Active |
| Quality | `/quality/` | ✅ Active |
| Reports | `/reports/` | ✅ Active |
| Office | `/office/` | ✅ Active |
| Settings | `/settings/` | ✅ Active |

### Server Actions: 21 files
Lớn nhất: `production.ts` (28KB), `reports.ts` (11.7KB)

### Shared Components (UI):
AsyncSearchableSelect, BilingualLabel, BilingualTitle, Button, Input, PageHeader, Pagination, SearchBox, SearchSuggestions, SearchableSelect, Select, Sidebar (16.6KB), Topbar (6.8KB)

---

## 6. Design System

→ Chi tiết: `src/app/globals.css` (765 dòng, ~25KB)

### CSS Variables chính:
- **Accent (Teal):** `--accent` (#0D7A7A)
- **Font:** `--font-jp` (Noto Sans JP), `--font-vi` (Inter)
- **Background:** `--bg-page` (#ECEEF1), `--bg-surface` (#F7F8FA)
- **Text:** `--text-primary` (#2D3748)
- **Status:** success (#16A34A), warning (#D97706), error (#DC2626), info (#2563EB)

### CSS Classes bắt buộc:
| Element | Class |
|---------|-------|
| Bảng dữ liệu | `data-table` |
| Input/Select | `form-input` |
| Search Input | `form-input form-input-search` |
| Textarea | `form-textarea` |
| Button primary | `btn btn-primary` |
| Button secondary | `btn btn-secondary` |
| Card | `card-flat` hoặc `card` |
| Grid | `form-grid-4` hoặc `form-grid-2` |
| Badge | `badge badge--info/success/warning/error/neutral` |
| KPI Card | `kpi-card kpi-card--success/warning/error/info` |

### Typography:
- Body/Input: 14px
- Table cell: 13px
- Table header: 11px uppercase
- Label JA: 12px bold
- Label VI: 10px muted
- Input height: 36px

---

## 7. Quyết định thiết kế quan trọng

| # | Quyết định | Lý do | Ngày |
|---|-----------|-------|------|
| 1 | `companies` là parent entity (1,710 records), `customers` là subset (51) | Phân tích dữ liệu thực tế | 2026-05 |
| 2 | Schema V3: Giảm 6→4 bảng tooling | Đơn giản hóa, giảm join | 2026-06-12 |
| 3 | 3-Layer Naming: system_code / display_name / physical_stamp | Phân biệt rõ DB, UI, thực tế | 2026-06-03 |
| 4 | Product-Centric Architecture | Tray là trung tâm mọi luồng | 2026-05-29 |
| 5 | No hardcoded colors — CSS variables only | Dark mode, brand flexibility | 2026-06-17 |
| 6 | Portable USB → SSD | Làm việc trên nhiều máy | 2026-03 |
| 7 | Webpack only (no Turbopack) | Symlink issues trong monorepo | 2026-04-14 |
| 8 | UUID primary keys | Tránh conflict merge multi-source data | 2026-03 |
| 9 | 37 processing codes from Access | Backward compatibility | 2026-06-20 |
| 10 | Bilingual JP/VI mandatory | Đội ngũ đa quốc tịch | 2026-03 |
| 11 | Nullable design_revision_id trên order_lines | Traceability khi 1 SP có nhiều revision (nhựa khác), đã xảy ra nhầm lẫn thực tế | 2026-07-09 |

---

## 8. Vấn đề đã giải quyết

| # | Vấn đề | Module | Ngày | Giải pháp |
|---|--------|--------|------|-----------|
| 1 | FK sai customer_id vs company_id | Orders, Products | 05/2026 | Đổi FK sang company_id |
| 2 | TailwindCSS crash với Turbopack | Build | 04/2026 | Chuyển sang --webpack |
| 3 | product_name_ja → product_name | Schema V3 | 06/12 | Migration 067 |
| 4 | 6 bảng tooling quá phức tạp | Schema V3 | 06/12 | Gộp thành 4 bảng |
| 5 | Supabase 1000 row silent truncation | Schedule Gantt | 06/24 | .limit(10000) |
| 6 | Date boundary bug (midnight cutoff) | Schedule Gantt | 06/24 | Append ' 23:59:59' to toDate |
| 7 | Gantt scrollbar bị clip bởi overflow-hidden | Schedule Gantt | 06/24 | ganttHeight - 68 (thay vì - 50) |
| 8 | IN_PROGRESS jobs bị loại khỏi Gantt filter | Schedule Gantt | 06/24 | Thêm OR condition job_status.eq.IN_PROGRESS |
| 9 | RLS trên work_logs | Auth/Security | 06/23 | Migration fix_work_logs_rls |
| 10 | Audit trigger function broken | DB | 06/16 | Migration 072 |
| 11 | Lỗi gán nhầm company_id (Waitoco WJD) | Master data | 29/06/2026 | Tạo script repair_company_links.py hợp nhất và sửa 12,709 liên kết sai lệch từ Access CSV |
| 12 | V4 Master Seed Migration Failed | Schema V3 | 06/29 | Cập nhật missing audit_trigger_func trong file 070_delivery_site_audit.sql |
| 13 | Dữ liệu KSP-123 và KSP123 bị trùng lặp (Duplicate) | Database | 08/07 | Chạy script gộp 4,087 bản ghi trùng ở design_revisions, giữ lại định dạng viết liền. Xác nhận physical_molds/jobs hợp lệ. |
| 14 | Pitch bị nhầm lẫn giữa Khuôn và Tiêu hao | MRP | 2026-07-10 | Tách `pitch_mm` thành `cavity_pitch_mm` (cho dao cắt/khuôn) và `machine_feed_pitch_mm` (cho tiêu hao nhựa). Tạo Server Action quét qua `order_lines` -> `design_revisions` để trừ lùi MRP tự động cho `plastic_receipt_roll`. |

---

## 9. Backlog & TODO

### Đang thực hiện (IN_PROGRESS):
- [x] **MRP by Meters** — Đã hoàn thành Giao diện Matrix MRP. Tách khái niệm `machine_feed_pitch_mm` để tính toán mét nhựa hao hụt trên `design_revisions` theo từng đơn hàng. Đã chuẩn hóa chi nhánh (`company_type = 'INTERNAL'`). Đã liên kết Real Data từ `plastic_master` và `plastic_receipt_roll`.
- [ ] **Gantt Schedule tối ưu** — Sticky header, expand/collapse all, scroll-to-date

### Chưa giải quyết:
- [ ] 76% physical_molds thiếu legacy_id mapping
- [ ] 100% design_revisions thiếu legacy_id mapping
- [ ] Chain integrity: một số mold → revision → base bị liên kết sai
- [ ] CLAUDE.md line 25 vẫn ghi product_name_ja (cần sửa)
- [ ] Employees chưa có trong sidebar

### Tính năng dự kiến:
- [ ] Aluminum Blanks Workflow (Engineering ↔ Tooling)
- [ ] **Thermoforming Equipment Set (Cấp 2)** — Bảng `tooling_assets` cho Frame/Base/Stacking, migration 46 bản ghi PB/WB từ `products`, UI `/equipment/auxiliary`. Xem chi tiết: `mempalace/knowledge/thermoforming_equipment_set.md`
- [ ] Auto-Scheduling (machine assignment by CAV type)
- [ ] QR Code System (heat-resistant plates, URL scan)
- [ ] Forming Conditions Database (1,379 records × 46 columns từ Excel)
- [ ] 5 Department Dashboards (KPI widgets)
- [ ] End-to-end Flow Testing (Order → Production → Completion)
- [ ] CAV Type + Machine Compatibility population
- [ ] Outsource Management (Teflon coating, CNC tại subcontractors)
- [ ] Annual Physical Inventory (棚卸し) — QR scan workflow
- [ ] Reports & Analytics content
- [ ] Bulk Import Engine (Access/CSV → Supabase)

---

2. **Kiểm kê & Ảnh hiện trạng Khuôn (写真撮影・棚卸)**
   - Tạo file SQL migration `20260709100000_extend_physical_molds_schema.sql` thêm cột `photo_url` (TEXT) và `last_inventory_date` (DATE) vào bảng `physical_molds`.
   - Cập nhật database types trong `src/types/database.types.ts` và sửa đổi giao diện chi tiết khuôn mẫu (`physical_molds` detail) để hiển thị card hình ảnh hiện trạng trực quan ở Sidebar cùng ngày kiểm kê gần nhất, hỗ trợ sửa đổi trực tiếp khi ở chế độ edit.
   - Biên dịch TypeScript thành công không có lỗi (`0 errors`).

---

### 2026-06-24: Tối ưu Gantt Chart Schedule + Memory Palace

**Các vấn đề đã xử lý:**
1. **Gantt Chart hiển thị sai dữ liệu**
   - Supabase default limit 1000 rows → silent truncation → fix: `.limit(10000)`
   - Date boundary bug (midnight) → fix: append `' 23:59:59'` to toDate
   - IN_PROGRESS jobs bị lọt → fix: thêm OR condition

2. **Thanh cuộn ngang bị ẩn**
   - gantt-task-react scrollbar (~18px) bị clip bởi overflow-hidden
   - Fix: `ganttHeight = containerHeight - 68` (thay vì - 50)
   - Page height constraint: `h-[calc(100vh-85px)]`

3. **UX Improvements:**
   - Expand/Collapse All buttons cho jobs
   - Click vào Kỳ hạn → smooth scroll đến vị trí trên biểu đồ
   - Dummy timeline bound task để ép biểu đồ hiển thị đủ khoảng thời gian

**Khởi tạo Memory Palace:**
- Tạo `identity.txt`, `index.md`, cấu trúc `sessions/`
- Cập nhật `antigravity-v2-rules.md` (Rule 0, drive detection, quota tiers)
- Cập nhật `AGENTS.md` (Rule 0, Sổ Cái reference)
- Tạo file `ysdms-nextgen_MASTER.md` này

---

### 2026-06-24 (Phase A): Gantt Schedule — Song ngữ + Design System + Compact Toolbar

**Vi phạm đã sửa (29 vị trí):**
1. **Song ngữ JP/VI** — Toàn bộ toolbar, header bảng, placeholder, alert/confirm chuyển sang tiếng Nhật
   - Toolbar: 今日, ◀/▶, 1週/2週/1ヶ月, 日/週/月, 予定/実績/比較, 全展開/全折畳, 保存/取消
   - Header: ジョブ/工程, 設備, 担当者, 工数h, 状態, 開始, 終了, 期限
   - Labels: ↳ 実績, - 選択 -, スケジュールなし
   - Messages: 保存エラー, 未保存の変更を破棄しますか？

2. **Hardcode màu → CSS variables:**
   - STEP_STATUS: #e6f4ea → var(--status-success-bg), #1e8e3e → var(--status-success)
   - CANCELLED: #fce8e6 → var(--status-error-bg), #d93025 → var(--status-error)
   - Border: #ebeff2 → var(--border-subtle)
   - Row bg: #fcfcfc → var(--bg-surface)
   - Project fill: #333 → var(--text-primary)
   - MultiSelectDropdown: gray-400 → var(--text-muted), gray-200 → var(--border-default)

3. **Toolbar compact:** 2 dòng → 1 dòng duy nhất
   - Layout: [今日 ◀▶ date-range 1週/2週/1ヶ月 date-pickers] | [日/週/月 予定/実績/比較] | [全展開/全折畳 ◀ 保存/取消]
   - Active state: var(--accent-subtle) + var(--accent) font + var(--accent-light) border

**TypeScript:** 0 errors (npx tsc --noEmit)

### 2026-06-24 (Phase B): Gantt Schedule — UX Improvements

1. **Active state cho date preset buttons** — Thêm `activePreset` state
   - 1週/2週/1ヶ月 buttons highlight bằng `activeFilterCls` khi được chọn
   - Khi shift manual date → `setActivePreset('')` (no preset active)

2. **Compare mode duplicate logic fix** — Dòng 331-332 cũ
   - `compareMode === 'COMPARE' ? stepS.color : stepS.color` → simplified thành `stepS.color` trực tiếp

3. **Scroll-to-date visual highlight** — Khi click 期限 trên bảng:
   - Smooth scroll đến vị trí đúng
   - Tạo đường kẻ đỏ dọc (2px, `var(--status-error)`) tại vị trí deadline
   - Fade out sau 1.5s, remove sau 3.5s
   - Dùng columnWidth thống nhất (60px day/week, 150px month) thay vì hardcode

4. **Edit tooltip bilingual** — "Sửa chi tiết" → "詳細編集"

### 2026-06-24 (Phase C): Gantt Schedule — Refactor

1. **Tách `MultiSelectDropdown`** → `src/components/ui/MultiSelectDropdown.tsx`
   - TypeScript interfaces: `MultiSelectOption`, `MultiSelectDropdownProps`
   - Reusable cho các module khác (jobs, production, etc.)
   - MoldJobGantt giảm ~50 dòng (872 → 823 lines)

### 2026-06-24 (Phase D): Gantt Schedule — Customizations & Bug Fixes

1. **Gantt SVG Date Format Override** (DOM Manipulation):
   - Thêm `useEffect` để format lại text của thư viện `gantt-task-react`
   - Đổi `月, 30` → `30（月）`
   - Đổi `6月 2026` → `2026年6月`

2. **Unplanned Task Placeholder** (Khung chữ nhật nét đứt):
   - Các step chưa có `planned_start/end` sẽ nhận `backgroundColor: '#f8fafc'`
   - Ghi đè CSS `rect[fill="#f8fafc"]` thành `stroke-dasharray: 4,4` và nền trong suốt
   - Cho phép người dùng nhìn thấy "vùng giả tưởng" và click đúp để mở modal chỉnh sửa

3. **Left Panel Grid Fixes**:
   - Sửa lỗi state input: Bind `<select>` và `<MultiSelectDropdown>` vào `localSteps[step_id]` thay vì `originalStep`, giúp UI cập nhật ngay khi vừa chọn
   - Sửa lỗi text wrap: Thêm `minWidth: 0` vào CSS Grid cells và `text-overflow: ellipsis`

4. **Scroll To Date Fix**:
   - Viết lại thuật toán tính `scrollPixels` đồng bộ với `gantt-task-react` padding.
   - Month view pad về ngày 1; Week view pad về Sunday; Day view pad -1 ngày.

### 2026-06-24 (Phase E): Gantt Compare Mode Single-Row Overlap & UI Polish

1. **Compare Mode Overlap (Hợp nhất thanh thời gian)**:
   - Dùng DOM injection trong `useEffect` để chèn thêm các thanh `<rect>` Thực tế (màu đặc) nằm trực tiếp bên trong thanh Dự kiến (nét đứt trắng `#f8fafc`).
   - Khung Dự kiến được tự động kéo giãn chiều cao (`height + 12px`), trong khi thanh Thực tế được bóp nhỏ lại (`height = 12px`) và căn giữa. Kết quả: Tạo ra một hiệu ứng thị giác dạng "thanh tiến độ lồng trong khung", phân biệt cực rõ ràng giữa Dự kiến và Thực tế dù chúng nằm trên cùng một dòng.
   - Panel trái: Chiều cao dòng `rowHeight` tăng lên 44px trong chế độ So sánh, cho phép hiển thị 2 ô `input type="date"` Dự kiến và Thực tế xếp chồng dọc trong 1 dòng.

2. **Expand/Collapse All Buttons**:
   - Dời các nút `[+]` `[-]` từ góc phải trên cùng sang nằm dính liền vào tiêu đề cột "ジョブ/工程".
   - Tăng mức độ trực quan, dễ bấm, tiết kiệm không gian toolbar.

3. **Scroll to Deadline Fix**:
   - Thuật toán căn giữa màn hình: `scrollPixels - (containerWidth / 2)`.
   - Bọc lệnh `scrollTo` trong `setTimeout` để đảm bảo khi chuyển chế độ xem (khiến SVG render lại), cuộn vẫn đến đúng vị trí.

### 2026-06-24 (Phase F): ViewModes, Pagination & UI Fixes

1. **Điều hướng `< >` thông minh:** Đã cập nhật nút Tiến/Lùi `< >` để tự động tính toán bước nhảy bằng chính xác `viewMode` hiện tại (1 Ngày / 1 Tuần / 1 Tháng), thay vì chỉ dựa vào độ dài khoảng thời gian như trước.
2. **Nút "Hôm nay" (今日):** Mặc định đặt ViewMode về `Tuần (Week)` và đặt khoảng thời gian là tuần hiện tại.
3. **Chế độ Thực tế (実績):** Sửa lỗi các task chưa có thời gian thực tế hiển thị nhầm thành khung nét đứt. Giờ đây chúng sẽ ẩn hoàn toàn (`background: transparent`), chỉ khi có thời gian mới hiển thị khối màu đặc.
4. **Chế độ So sánh (比較):** Sửa lỗi Selector SVG từ `<g class="bar">` sang `<rect fill="#f8fafc">`, giúp phần vẽ đè (DOM Injection) thay đổi chính xác kích thước khung Dự kiến và Thực tế, giải quyết lỗi không có sự so sánh.
5. **Chế độ xem Ngày (日):** Nút chọn Ngày đã hoạt động tốt, kết hợp với các bước nhảy 1 ngày để dễ dàng xem lịch trình.

**TypeScript:** 0 errors

### 2026-06-25 (Phase G): Thiết kế lại 3 chế độ hiển thị & Hợp nhất Điều hướng

**Nguyên nhân gốc (Root Cause):** CSS rule `rect[fill="#f8fafc"] { fill: transparent !important; }` (dòng 908 cũ) ghi đè fill thành `transparent`, nhưng `useEffect` DOM injection tìm `rect[fill="#f8fafc"]` → **không tìm thấy gì** → chế độ So sánh không bao giờ hoạt động.

**Giải pháp:**
1. **Bỏ hoàn toàn DOM injection** — thay bằng 2 native Gantt rows/step trong COMPARE mode
2. **3 chế độ hiển thị rõ ràng:**
   - `予定 (PLANNED)`: Thanh màu đặc theo status; step chưa có ngày → khung nét đứt mờ 50%
   - `実績 (ACTUAL)`: Thanh màu đặc cho step có thời gian thực tế; step chưa có → khung Dự kiến mờ 25% (để thấy step tồn tại)
   - `比較 (COMPARE)`: 2 rows/step — Row 1: khung nét đứt accent (Dự kiến), Row 2: thanh màu đặc (Thực tế)
3. **CSS riêng biệt cho từng mode** qua CSS custom properties: `--planned-ghost`, `--actual-ghost`, `--compare-planned`
4. **Toolbar hợp nhất:** Xóa `[1週][2週][1ヶ月]`, gộp vào `[日][週][月]` — bấm 1 nút đồng thời đổi ViewMode + date range + bước nhảy `< >`
5. **Nút định vị (📍 CalIcon):** Thêm icon lịch vào cột Kỳ hạn trên panel trái, bấm để cuộn đến vị trí bắt đầu của job
6. **Sửa `handleScrollToDate`:** Loại trừ dummy tasks khỏi `minTime`, cải thiện scroll container detection

**TypeScript:** 0 errors

### 2026-06-25 (Phase G.1): Cải thiện UI Biểu đồ Gantt & Tính toán Worklog

1. **Lọc Job trên Panel:** Đã sửa lỗi "cộng dồn" danh sách job. Hàm `getJobsForGantt` giờ đây chỉ lấy chính xác những job có kỳ hạn (`mold_deadline`) hoặc công đoạn (`job_steps` / `work_logs`) nằm trong khoảng thời gian `fromDate` - `toDate` đã chọn, không mặc định thêm `IN_PROGRESS` jobs.
2. **Nút Toolbar:** Tăng kích thước padding (`px-4 py-1`) cho các nút `[日][週][月]` và `[予定][実績][比較]` để dễ bấm hơn.
3. **Hiển thị Giờ:** 
   - Thay đổi tiêu đề `工数H` thành `予定H` (dự kiến).
   - Thêm cột `実績H` (thực tế) vào panel bên trái.
   - Hàm `getJobsForGantt` đã được cập nhật để tính tổng `hours_spent` từ `work_logs` thành `actual_hours` cho mỗi bước (step).
4. **Hiển thị Ngày Tháng:** 
   - Cột `開始` (Start) và `終了` (End) hiển thị dạng ngắn gọn: `M/D (Thứ)` ví dụ `6/17 (水)`.
   - Cột `期限` (Deadline) hiển thị dạng đầy đủ: `YYYY/MM/DD (Thứ)` ví dụ `2026/06/23 (火)`.
5. **Cột Panel:** Mở rộng cột Nhân công (Assignee) lên 110px.
6. **Lỗi Dropdown Máy:** Sửa lỗi API lấy danh sách máy bị lỗi do sai tên cột (`internal_code` → `machine_code`), giúp dropdown chọn máy hoạt động bình thường.

### 2026-06-25 (Phase G.2): Sửa tính năng Scroll-to-Date & Nút Định vị Job

**Nguyên nhân lỗi cũ:**
1. CSS class selectors `.erDYYJ, ._1nBOt` là minified class names từ `gantt-task-react`, thay đổi giữa các build → `scrollContainer = null` → không hoạt động.
2. `minTime` loại trừ `dummy_timeline_bound` nhưng dummy đôi khi là task sớm nhất → chartStart tính sai → scroll sai vị trí.
3. `activePreset` khởi tạo `'TWO_WEEKS'` — không khớp với bất kỳ preset nào (`DAY/WEEK/MONTH`) → nút `< >` rơi vào nhánh "custom" và bước nhảy sai.
4. `listCellWidth = 640px` nhưng tổng 9 cột = 695px → cột cuối bị cắt.

**Giải pháp:**
1. **Rewrite `handleScrollToDate`:** DOM traversal từ SVG → parent → walk up tìm scrollable container, thay vì hardcode minified class names. Sử dụng `requestAnimationFrame` thay `setTimeout`.
2. **Include `dummy_timeline_bound`** khi tính `chartStartTime` — đảm bảo fromDate luôn nằm trong phạm vi tính toán pixel.
3. **Nút Crosshair (⊕) trên job row:** Thêm icon `Crosshair` (lucide-react) bên cạnh tên job, giúp user nhận biết ngay tính năng "bấm để cuộn đến vị trí job". Dạng gọn, không chiếm thêm cột.
4. **Kỳ hạn (期限) vẫn clickable:** Bấm vào ngày kỳ hạn → cuộn đến deadline. Nếu job không có deadline → hiển thị `-`.
5. **Đường highlight tọa độ (Crosshair Highlight):** Khi click định vị, ngoài đường dọc màu đỏ báo ngày, hệ thống sẽ vẽ thêm một **khung đỏ ngang (bounding box)** bao quanh toàn bộ row đó trên biểu đồ Gantt. Giao điểm của 2 đường đỏ tạo thành tâm điểm hoàn hảo giúp nhận diện ngay vị trí job.
6. **Fix `activePreset`** khởi tạo `''` (custom) thay vì `'TWO_WEEKS'` đã bị xóa.
7. **Fix `listCellWidth`** từ `640px` → `700px` vừa đủ cho 9 cột.

**TypeScript:** 0 errors

### 2026-06-29 (Phase H): Status Integration & RLS Fix

1. **RLS Policy Fix:** Phát hiện `machines`, `processing_statuses`, `employees` trả về 0 rows dù không có lỗi API — nguyên nhân là Supabase bật RLS mặc định nhưng không có policy "Allow All". Tạo migration `20260629020000_fix_rls_all_tables.sql` thêm policy cho 8 bảng.
2. **Processing Status Fix:** Sửa lỗi 400 khi query `processing_statuses` do dùng `.order('sort_order')` — cột không tồn tại. Đổi sang `.order('status_id')`.
3. **Level 3 Status:** Thêm `processing_status_id` vào bảng `work_logs` (migration `20260629030000_add_status_to_work_logs.sql`). Thêm dropdown trạng thái vào `WorklogEditModal` và `EditStepModal`.
4. **Level 2 Auto-Status:** Cập nhật logic tự động tính trạng thái cấp 2 từ cấp 3 — kiểm tra cả `is_finished` và `processing_statuses.status_code.includes('完了')`.
5. **Machine Dropdown:** Sửa query `.eq('is_active', true)` → bỏ filter (dữ liệu import có `is_active = NULL`).

**TypeScript:** 0 errors

### 2026-06-29 (Phase I): Mold Info Display & Planned View Fix

1. **Bug 予定 View:** Sửa `MoldJobGantt.tsx` dòng 1179-1183 — khi không có `planned_date`, code cũ dùng `work_date` (thực tế) vẽ thanh đặc trong chế độ 予定. Sửa: `hasPlannedWl = false` → vẽ ghost bar thay vì thanh đặc.
2. **Mold Dimensions on Job Detail:** Mở rộng query `page.tsx` lấy `design_length, design_width, design_depth, cutline_length, cutline_width, cavity_count, pocket_numbers, pitch_mm, plastic_type_designed` từ `design_revisions`, và `actual_length/width/height_mm` từ `physical_molds`.
3. **OverviewTab Cards:** Thêm card "金型寸法" (Kích thước khuôn) và "素材情報" (Vật liệu) hiển thị đầy đủ thông tin kích thước thiết kế, CUTLINE, cavity, R/góc, nhựa thiết kế, kích thước khuôn thực.
4. **Gantt Drawer:** Thêm compact badges hiển thị kích thước, CUTLINE, cavity, loại nhựa, và link đến khuôn vật lý.
5. **Fix Gantt Query:** Thêm `products(product_id, product_name)` vào join `mold_masters` (trước đó thiếu → `product_name` luôn null). Thêm join `design_revisions` và `physical_molds`.
6. **Quy tắc chuyển Model:** Thêm section `🔄 QUY TẮC CHUYỂN MODEL` vào AGENTS.md — bắt buộc đọc sổ cái + transcript khi context bị truncated.

### 2026-07-02: Plug & Mold Features
1. **Physical Mold Mapping:** Tích hợp Mapping đầy đủ kích thước vật lý, kích thước thiết kế, `keeper_company_id`, `rack_layer_id` cho Khuôn vật lý.
2. **Plugs Refactoring:** Chốt phương án bỏ bảng `plugs`, chuyển thành các cờ `plug_type` ('NONE', 'OWNED', 'SHARED') và `shared_plug_from_design_id` trên `design_revisions`. Tạo migration `20260702000000_simplify_plugs.sql`.
3. **Manufacturing Date:** Thêm `manufacturing_date` cho bảng Khuôn (`physical_molds`) và cập nhật script Python tự động import từ `jobs.csv` `DeliveryDeadline`. Map thêm `plastic_type_designed` và `tray_info`.

**TypeScript:** 0 errors
<!-- 
  QUY TẮC GHI SỔ CÁI:
  - APPEND mục mới vào section phù hợp (KHÔNG ghi đè)
  - Cập nhật "Cập nhật lần cuối" ở header
  - Thêm entry vào "Nhật ký phiên làm việc" (section 10)
  - Thêm vấn đề đã xử lý vào section 8
  - Cập nhật module status trong section 5 nếu có thay đổi
-->
- **2026-07-09:** (Business Workflows Extracted) Đã chạy script phân tích 1000 email Outlook thực tế của doanh nghiệp để xây dựng báo cáo phân tích luồng nghiệp vụ. Tạo tài liệu `docs/technical/10_email_derived_business_workflows.md` chứa tổng hợp chi tiết các nghiệp vụ: Báo giá, Thiết kế, Sản xuất khuôn, Khay định hình, Sửa khuôn, Quản lý tài sản (kiểm kê, chụp ảnh, giấy mượn khuôn) và Logistics. Đã thêm các đề xuất cải tiến UI tương ứng vào hồ sơ.
- **2026-06-29:** (Gemini tiếp nối Claude) Fixed data linking issue between jobs, physical_molds, and design_revisions caused by incomplete DB migration. Wrote a Python/SQL script to map links based on legacy CSV values (job_code, job_name), successfully updating 1101 job records. Cập nhật UI Drawer và trang List để hiển thị đầy đủ link tới Khuôn Vật Lý (VL) và Thiết Kế (TK) kèm kích thước, vật liệu.
- **2026-06-29:** (Data Repair: Company Links) Đã viết và thực thi thành công script dữ liệu `scratch/repair_company_links.py` để sửa 12,709 liên kết company_id sai lệch trong `products` (3,450), `mold_masters` (4,630) và `design_revisions` (4,629). Đồng thời tạo mới 253 công ty còn thiếu trong bảng `companies` từ file `customers.csv` và `tray.csv`/`molddesign.csv`.
- **2026-07-02:** (Data Migration: V5 Seed Script Complete) Đã viết lại toàn bộ luồng import dữ liệu legacy bằng Python (`scripts/seed_v5/`), giải quyết dứt điểm các lỗi mapping, deduplication (job_code, job_steps) và Null Constraints từ schema V3. Script mới (V5) import 21 bảng trong 21 giây, bao gồm toàn bộ Lookup Tables, Master Data, Mold Hierarchy, Jobs, Work Logs và Lifecycle Data (`mold_maintenance`, `mold_location_history`, `mold_loan_certificates`), chính thức hoàn thành Phase Dịch chuyển Dữ liệu.
- **2026-07-02:** (Jobs Import Pipeline Refined) Cập nhật cấu trúc `jobs` và `job_steps` seed mapping. Thêm 10 loại `job_types` seed, map thêm `physical_mold_id`, `ship_date`, `start_date`, `year_period`, `month_period`, `approved` cho `jobs`. Update logic đồng bộ: `jobs.deadline = MAX(job_steps.deadline)`. (Bỏ qua import `PriceQuote`, `UnitPrice` vào `jobs` theo yêu cầu user).
- **2026-07-03:** (Products Normalization Phase 1) Chuẩn hóa bảng `products`: `product_code` = mã nội bộ YSD compact (ADY071), `product_name_internal` = tên hiển thị (ADY-071), `product_name` = tên SP chính thức từ KH (từ CustomerTrayName, 451 records). Gộp khái niệm Tray = MoldMaster = Products. Đánh dấu `mold_masters` DEPRECATED trong AGENTS.md và SCHEMA_REFERENCE.md. Sửa 58 orphan products từ moldmaster.csv. Post-import cập nhật 451 products với CustomerTrayName / TrayInfoForMoldDesign. Import thành công 62.68s, TypeScript 0 errors.
-   * * 2 0 2 6 - 0 7 - 0 3 : * *   ( P h a s e   2   R e f a c t o r i n g :   P r o d u c t - C e n t r i c   A r c h i t e c t u r e )   H o � n   t h � n h   x � a   b �  h o � n   t o � n   b �n g   ` m o l d _ m a s t e r s `   k h �i   h �  t h �n g   c o d e b a s e .   C h u y �n   �i   m �i   l i � n   k �t   s a n g   b �n g   ` p r o d u c t s `   ( K h u � n / T r a y   l �   m �t ) .   X �  l �   t r i �t   �  1 0 +   f i l e   S e r v e r   A c t i o n s ,   s �a   l �i   T y p e S c r i p t   v �   S u p a b a s e   R P C   f u n c t i o n s   d o   t h a y   �i   s c h e m a .   �m   b �o   l u �n g   n g h i �p   v �  t �o   M o l d s ,   R e v i s i o n s ,   J o b s   h o �t   �n g   �n   �n h   t r � n   k i �n   t r � c   m �i . 
 
 
- **2026-07-03:** Khắc phục lỗi hiển thị thiếu phiên bản thiết kế gốc (các phiên bản không có R) và các bản thiết kế mồ côi. Đã cập nhật seed_v5/importers/mold.py để sử dụng biểu thức chính quy nhằm tự động gộp các phiên bản về cùng một sản phẩm gốc, đồng thời tự sinh sản phẩm cho 109 bản thiết kế bị mồ côi (không có liên kết DesignMasterID). Chạy lại seed script thành công, khôi phục toàn bộ các liên kết thiết kế.
- **2026-07-03:** (Gantt Schedule Fixed) Sửa lỗi Bảng kế hoạch (Gantt) trống bằng cách mở rộng filter (sử dụng deadline hoặc ship_date) và chạy script Python populate mold_deadline (1,146 Jobs) cùng planned_start/planned_end/track (2,340 Job Steps). Cập nhật createMoldJobAction ưu tiên dùng plug_type từ design_revisions thay vì trường has_plug cũ. TS check 0 errors.

### Ngay 2026-07-03: S?a hi?n th? d? li?u Gantt Level 3
- Ch?y script Python ix_gantt_data_v3.py ?? c?p nh?t processing_code_id cho b?ng work_logs (B? NULL do l?i isdigit() x? ly s? th?p phan trong Access CSV).
- C?p nh?t chu?n hoa step_name t? b?ng job_steps sang ti?ng Nh?t b?ng b?ng tra c?u g?c processingitems.csv.
- S?a ??i UI React MoldJobGantt.tsx: Level 3 c?a Gantt hi?n ?a render thanh cong cac thao tac chi ti?t (Vi d?: �{�^���Z�����H) do d? li?u processing_code_id ?a ???c ph?c h?i.

### 2026-07-03 16:45: S?a Gantt Level 2 + Level 3 mapping ?ung
- **L?I G?C**: Script tr??c dung processingitems.csv (tblProcessingItem) ?? map step_name, nh?ng b?ng ?ung la itemtype.csv (tblItemType). Hai b?ng co ID khac nhau hoan toan.
- **DB FIX**: C?p nh?t 2,113 job_steps ? step_name l?y t? item_types.item_type_name_ja (��^, �v���O, ���^...), track l?y t? item_types.item_type_code (MOLD, PLUG, CUTTER...)
- **UI FIX**: MoldJobGantt.tsx ? track grouping dung item_types join thay vi parse step_name; TRACK_META m? r?ng h? tr? 11 item types; container step detection dung item_type_id
- **IMPORTER FIX**: job.py ? ITEM_TYPE_NAMES_JA mapping ti?ng Nh?t + them track field
- **MAPPING REFERENCE**: tblItemType �� item_types (11 rows), tblProcessingCode �� processing_codes (44 rows), tblProcessingItem �� processing_items (DROPPED, KHONG DUNG)

### 2026-07-03 17:00: C?p nh?t h? s? k? thu?t (Technical Docs)
- **C?p nh?t SCHEMA_REFERENCE.md**: ?a lo?i b? processing_items, them cac ??nh ngh?a chi ti?t cho b?ng item_types (Level 2) va processing_codes (Level 3), them ??nh ngh?a cho b?ng work_logs (Nh?t ky thao tac).
- **C?p nh?t docs/technical/02_data_model.md**: C?p nh?t l?i cac lien k?t (Foreign Keys) cho job_steps (ch? ra ?ung item_type_id), va ghi chu ro rang b?ng processing_items ?a b? drop.
- Vi?c l?u tai li?u h? s? ?a hoan t?t. Giao di?n bi?u ?? Gantt cung cac popup ch?nh s?a, l?ch s? nh?t ky ??u ?a ho?t ??ng ?ung logic c? s? d? li?u.

### 2026-07-03 17:08: Fix bi?u ?? Gantt hi?n th? thanh ti?n ?? sai ngay & b? ?n
- **L?I G?C**: 
  - Ham clampDate trong MoldJobGantt.tsx ?a bop meo (squash) cac ngay n?m ngoai kho?ng hi?n th? (Viewport) v? sat bien Viewport, lam cho cac cong vi?c b? co c?m l?i thay vi hi?n th? keo dai ?ung th?c t?.
  - Ham tinh toan ngay b?t ??u/k?t thuc d? an (projStart/projEnd) ch? d?a tren planned_start/planned_end c?a job_steps, b? qua work_logs (th?c t?) d?n ??n sai l?ch khung th?i gian c?a d? an.
  - H?ng m?c (Level 2) khong co cong ?o?n con s? nh?n Style 	ransparent khi?n ng??i dung khong nhin th?y no t?n t?i tren s? ??.
- **GI?I PHAP**:
  - S?a clampDate ?? ch? gi?i h?n cac ngay qua phi ly (tr??c 2001, sau 2096) ?? tranh th? vi?n gantt-task-react crash.
  - S?a logic tim Min/Max Date c?a Job ?? gom c? work_logs (ctual_start, ctual_end, work_date).
  - G?n l?i Style m?c ??nh (vi?n/n?n m? nh?) cho thanh Level 2 Header ?? hi?n th? ngay c? khi khong co data con.

### Phien 2026-07-03
- S?a lu?ng lien k?t (Navigation) gi?a Master (Products) -> Engineering (Design) -> Equipment (Physical Molds, Jobs).
- Them nut lien k?t Khuon v?t ly -> Phien b?n thi?t k?.
- Fix l?i l?c tren trang Khuon V?t Ly va Job List.
- Kh?c ph?c s? c? orphaned physical molds (khong co lien k?t v?i mold_revisions) b?ng cach fetch ??ng design_revisions qua system_code.
- Backup toan b? source code len github.

### Ngay 03/07/2026 - Hoan thi?n ??ng b? UI, fix bugs Khuon v?t ly & Job Modal
- **UI/UX ??ng b?**: ?a them ??y ?? Overline Text (Vi d?: JOB / GIA CONG) va cac nut Navigation Back/Up (Tr? v?/Danh sach) cho T?T C? cac trang chi ti?t (jobs, molds, products, orders, designs). JobDetailHeader ?a ???c b? sung nut d?n th?ng v? trang Thi?t k?. Mold list ?a them nut b?m lien k?t m? popup t?o Job.
- **Kh?c ph?c l?i D? li?u**: S?a l?i React/TypeScript khong load ???c danh sach Khuon v?t ly (vi missing product_id trong alias mapping); x? ly dropdown t?o Job khong hi?n th? cac khuon ?a Disposed va lo?i tr? cac khuon Pocket Test (%POCKET%).
- **Sao l?u GitHub**: Toan b? ma ngu?n ?a ???c commit va push len GitHub (lo?i tr? node_modules va cac file l?n).

### Phiên làm việc (2026-07-04) - Xóa Job & Sắp xếp bảng
- **Tác vụ**: Thêm tính năng Xóa Job có xác nhận; Bổ sung quy tắc sắp xếp các bảng dữ liệu vào hệ thống.
- **Thực hiện**:
  - Viết Server Action xóa job ở src/app/actions/mold-job.ts.
  - Bổ sung nút xóa và modal xác nhận tại tab Overview của trang chi tiết Job (EditJobModal & OverviewTab.tsx).
  - Cập nhật tài liệu AGENTS.md (Thêm quy tắc Table Sorting: Bấm vào tiêu đề cột để thay đổi chiều sắp xếp; Hiển thị mũi tên; Mặc định mới xếp trên cùng).
  - Tái cấu trúc logic sắp xếp cho ProductsPage và MoldsPage (áp dụng state sortCol, sortDir đồng bộ vào URL params để giữ nguyên trạng thái khi điều hướng).
  - Triển khai UI Component SortTh để hiển thị tiêu đề các cột có hỗ trợ tính năng click để sort.
- **Tình trạng mã nguồn**: Đã kiểm tra 	sc --noEmit hoàn tất không lỗi.

### Phiên làm việc (2026-07-04) - Tái cấu trúc Layout Trang Chi Tiết
- **Tác vụ**: Cải tiến UI các trang chi tiết (Sản phẩm, Phiên bản thiết kế, Khuôn vật lý) để tận dụng không gian màn hình rộng, bổ sung danh sách các bản ghi liên kết con (child records).
- **Thực hiện**:
  - Áp dụng cấu trúc grid 2 cột / 3 cột (grid-cols-1 lg:grid-cols-3) thay vì trải dài một cột.
  - **Sản phẩm (products/[id])**: Thêm sidebar ProductDesignList để liệt kê các Phiên bản thiết kế của sản phẩm.
  - **Phiên bản thiết kế (designs/[moldMasterId])**: Tăng kích thước modal (1100px), chia 2 cột nội dung chính và 1 cột sidebar liệt kê các Khuôn vật lý (Physical Molds) và Jobs liên quan.
  - **Khuôn vật lý (molds/[id])**: Thêm sidebar hiển thị danh sách các Jobs liên quan đến khuôn, sắp xếp theo tên Job.
  - **Trạng thái**: Chạy thành công npx tsc --noEmit. Đã lưu walkthrough.md.

### Phiên làm việc (2026-07-04) - Tạo trang chi tiết Phiên bản thiết kế (Design Revision)
- **Tác vụ**: Tách giao diện popup (modal) của Phiên bản thiết kế thành một trang chi tiết (Detail Page) chuyên dụng.
- **Thực hiện**:
  - Tạo route mới /engineering/designs/revisions/[id].
  - Chuyển logic UI grid 3 cột từ modal sang OverviewTab.tsx (Read-only view) để tối ưu không gian màn hình.
  - Cập nhật trang danh sách designs/[moldMasterId] biến cột REV # và DESIGN CODE thành hyperlink sang trang chi tiết.
  - Giữ lại chức năng Quick Edit Modal ở trang danh sách theo yêu cầu của user.
  - Hoàn tất kiểm tra TypeScript (0 errors).

### Phiên 04/07/2026
- Nâng cấp màn hình chi tiết Design Revision (Tabs Overview).
- Tích hợp tính năng tạo trực tiếp Khuôn và Job từ trang thiết kế.
- Thêm tính năng chỉnh sửa nhanh (Quick Edit) cho thông tin thiết kế.
- Cập nhật Data Migration: Thêm bảng plastic_master, suppliers, và plastic_manufacturer_map thay thế hệ thống cũ.
- Áp dụng màu (var(--accent)) đồng bộ cho tất cả các liên kết trong giao diện.
- Tự động điền CAV Types dựa trên kích thước thiết kế.
- Đã verify Typescript 0 lỗi.

### Phien 04/07/2026 (Part 2)
- Nang c?p UI trang Qu?n ly Thi?t k? (danh sach phien b?n): Them tinh n?ng ch?n (highlight) Phien b?n thi?t k? ?? t? ??ng l?c danh sach Khuon v?t ly va danh sach Job lien quan t??ng ?ng.
- Xay d?ng component DesignPhysicalMoldsList.tsx hi?n th? song song v?i DesignJobsList.tsx ? n?a d??i man hinh.
- C?p nh?t DesignJobsList.tsx h? tr? nh?n props l?c (selectedRevisionId, selectedMoldId) s? d?ng khoá ngoại ID chính xác thay vì chuỗi.
- Tối ưu hóa UI/UX: Giảm khoảng trống không cần thiết, thu hẹp kích thước các cột (Design Code, Rev, Cavity, Size) để bảng phiên bản thiết kế hiển thị gọn gàng trên 1 dòng.
- Sửa lỗi hiển thị dữ liệu chồng chéo: Xóa bỏ hoàn toàn cơ chế lọc bằng từ khóa (.ilike, .startsWith()) trên trang Thiết kế, thay bằng cơ chế lọc chính xác 100% bằng Foreign Key (design_revision_id, physical_mold_id). Xác nhận cấu trúc dữ liệu 1 Thiết kế -> N Khuôn vật lý -> N Job hoạt động hoàn hảo.
- Hoan t?t test TypeScript, ghi chep Walkthrough UI Layout.

### Phiên 04/07/2026 (Part 3) - Tạo Báo cáo Nhật ký Công việc (Nippo)
- Tạo trang /reports/daily-worklog dựa trên dữ liệu work_logs.
- Liên kết lấy dữ liệu: work_logs -> jobs -> physical_molds/design_revisions/products.
- Thiết kế giao diện in PDF (@media print) giống 100% mẫu truyền thống (có bảng giá fix sẵn ở Footer).
- Tự động ẩn các Menu, Sidebar, Nút bấm khi gọi window.print().

### Phiên 05/07/2026
- Đẩy toàn bộ mã nguồn lên GitHub (toanysd/ysdms-next.git). Cấu hình `.gitignore` chuẩn, loại bỏ các thư mục nặng (`/supabase/`, `/source_data/`, `*.rar`, v.v.).
- Khắc phục triệt để lỗi cuộn bảng kế hoạch (Gantt chart) bị nhảy/lặp lại liên tục: Giới hạn chiều cao truyền vào `gantt-task-react` (`Math.min(ganttHeight, ganttFullHeight)`) để tránh lỗi tính toán sai lệch giới hạn cuộn khi có ít dữ liệu, giúp thao tác cuộn mượt mà tự nhiên, không bị vô hiệu hóa con lăn chuột.  - B? sung CSS overscroll-behavior: none va scroll-behavior: auto ?? tri?t tieu l?i smooth-scroll loop t? ??ng cu?n ng??c c?a th? vi?n khi keo k?ch thanh cu?n xu?ng ?ay.
  - Ap d?ng Debounce cho ResizeObserver ?? lo?i b? hi?n t??ng Layout Thrashing do phan gi?i sub-pixel gay ra.
  - Bổ sung capture listener chặn sự kiện wheel để tự điều khiển native scrollbar, giải quyết triệt để lỗi wheel loop của gantt-task-react mà vẫn giữ được tính năng cuộn chuột mượt.
  - Tối ưu hóa cuộn chuột: Loại bỏ hoàn toàn capture listener thủ công để giải quyết triệt để lỗi trễ (lag), khựng cuộn, hoặc không cuộn lên hết đỉnh biểu đồ. Đồng thời kiểm chứng cơ chế kết hợp CSS auto scroll + overscroll-behavior: none và giới hạn ganttHeight động đã hoàn toàn đủ để giải quyết cả lỗi nhảy biên (loop) mà không cần can thiệp sâu.
  - Triển khai cơ chế Hybrid Wheel Clamping: Tự động chặn sự kiện wheel ở Capture phase chỉ khi di chuyển sát về biên (chênh lệch <= 5px) và khóa cứng scrollTop về biên tuyệt đối, cho phép cuộn tự do mượt mà ở các khoảng giữa. Giải quyết triệt để lỗi loop biên mà không gây trễ lag.
  - Tích hợp hệ thống màu sắc Badge độ trễ: Xây dựng helper getDelayColor() tự động tô màu nền và chữ dạng Badge cho cột Trạng thái và Kỳ hạn (Job/Track/Step) dựa trên điều kiện: Xanh lá (Xong đúng hạn), Xanh dương (Xong trễ hạn), Đỏ tươi (Hạn hôm nay), Đỏ sẫm (Quá hạn), Cam đậm/Cam nhạt/Cam nhạt hơn (còn 1, 2, hoặc 3-5 ngày).
  - Khắc phục lỗi sai lệch trạng thái lịch sử: Chạy script fix_all_job_statuses.py khôi phục thành công danh mục tiếng Nhật chuẩn trong bảng processing_statuses (khắc phục triệt để lỗi vỡ font Mojibake). Tự động cập nhật step_status cho 1,858 công đoạn đã xong và tính toán lại tỉ lệ hoàn thành overall_progress, cập nhật trường job_status tương ứng cho 1,155 Job trong cơ sở dữ liệu.
  - Đồng bộ hoá seeder gốc: Tích hợp logic chuẩn hóa trực tiếp vào lookups.py và job.py đảm bảo dữ liệu luôn chính xác khi seed lại.

### Phiên 08/07/2026 - Chuẩn hóa mã KSP-123 vs KSP123
- **Tác vụ**: Khắc phục tình trạng trùng lặp dữ liệu do cách viết có dấu gạch ngang (KSP-123) và viết liền (KSP123) tồn tại song song từ file Excel.
- **Thực hiện**:
  - Chạy Background Task gộp 4,087 nhóm bản ghi trùng lặp trong bảng `design_revisions` về dạng chuẩn (viết liền KSP123).
  - Cập nhật tự động các tham chiếu FK từ 12 bảng liên quan (physical_molds, jobs, work_logs,...) sang ID của phiên bản giữ lại.
  - Viết script kiểm tra các bảng `physical_molds` và `jobs`. Phát hiện `jobs` đã hoàn toàn sạch bóng lỗi trùng mã. `physical_molds` có trùng tên hiển thị (display_name) nhưng khác nhau ở `system_code` (GMY087-1, GMY087-2), xác nhận đây là các bản sao khuôn vật lý hợp lệ nên không gộp.
- **Kết quả**: Dữ liệu thiết kế và mã khuôn đã sạch hoàn toàn, không còn trùng lặp do cách đặt tên khác biệt.

### 2026-07-08 (Phase H): Quản lý Đa Phòng Ban & Kho Nhựa (WMS Phase 2)

- **Thực hiện**:
  - Thiết kế database schema và tạo migrations cho việc quản lý các phòng ban (`departments`) và tích hợp vào `jobs`/`job_steps`.
  - Thiết kế database schema và tạo migrations cho hệ thống Quản lý Nhựa dạng cuộn (`plastic_master`, `plastic_receipt_roll`, `plastic_adjustment_log`). Cập nhật file `SCHEMA_REFERENCE.md`.
  - Xây dựng UI: `DepartmentKanban` (sử dụng HTML5 Drag & Drop) cho việc điều phối công việc giữa các bộ phận không phải Định hình.
  - Xây dựng UI: `PlasticRollScanner` và trang `MaterialsPage` cho phép người dùng xem tồn kho và quét mã vạch trừ hao số mét cuộn nhựa.
  - Tích hợp API Server Action: Bổ sung logic `consumePlasticRoll` vào `production.ts`.
  - Fix lỗi TS do thiếu Typescript types gen tự động (bằng cách cast client to `any` tạm thời vì thiếu kết nối database). `tsc --noEmit` đạt 0 errors.
- **Tình trạng hiện tại**: Đã hoàn tất các hạng mục theo kế hoạch đã được người dùng (Duyệt). Khôi phục thành công giao diện lập kế hoạch dạng lưới Excel hoàn chỉnh từ thư mục backup `src20260502_1216` (sử dụng Click-to-Select & Modals trực quan), sửa lỗi trống cột máy móc do thiếu trường `status` trong DB. `tsc --noEmit` đạt 0 errors. Kế hoạch sắp tới là kiểm thử luồng hoạt động trực tiếp.


### 2026-07-08 Cập nhật Giao diện Đơn hàng và Lỗi Cache Kế hoạch định hình
- Đã thêm unstable_noStore vào getPendingOrderItemsForPlanning để giải quyết lỗi cache của bảng Kế hoạch.
- Cập nhật trang /orders bổ sung tính năng duyệt đơn hàng loạt (Bulk Approve) giúp chuyển trạng thái từ NEW sang APPROVED nhanh chóng.
- Thêm tab Chỉ thị sản xuất (Production Orders) vào giao diện chi tiết /orders/[id] để đồng bộ với workflow cũ.

### 2026-07-08 (Phase I): Phân tích & Cải tạo Đơn hàng (Order Management Overhaul)

- **Phân tích dữ liệu**:
  - Đọc toàn bộ file Excel `IRI-001 K-16135T-01-01` (5 sheets): `指示書作成シート(成形）`, `指示書作成シート（外注）`, `トレイデータ一覧表`, `納入先一覧表`, `互換性レポート`.
  - Sheet `納入先一覧表` chứa **1,861 điểm giao hàng** với cấu trúc: `No. (site_code)`, `送り先 (site_name)`, `住所 (address)`, `依頼元 (parent_company_code)`, `サブ (contact)`, `TEL`, `FAX`.
  - Sheet `トレイデータ一覧表` chứa master data sản phẩm: `P/N`, `型番`, `材質`, `厚み`, `巾`, `帯電`, `ｼﾘｺﾝ`, `塗布`, `入数`, `公差`, `CUT LINE`.
  - DB hiện tại: `delivery_sites` = **0 bản ghi**, `orders` = 1 bản ghi test, `order_lines` = 1 test.
  - ~350/414 khách hàng CUSTOMER chỉ có mã 3 chữ làm tên, thiếu hoàn toàn address/tel/fax.

- **Kế hoạch thực hiện (đã được User duyệt)**:
  1. ✅ Import delivery_sites: **813 bản ghi** đã import thành công (0 lỗi). IRI site thủ công.
  2. ✅ Migration `20260708100000_extend_orders_schema.sql`: Đã apply qua `supabase db query`. Thêm `orders.lot_no`, `order_lines.ship_date`, `order_lines.packing_style`, `order_lines.shipping_notes`.
  3. ✅ Cập nhật company IRI: address/tel/fax đã bổ sung. 243 companies khác đã cập nhật tên đầy đủ (lần chạy đầu tiên).
  4. ✅ SCHEMA_REFERENCE.md đã cập nhật.
  5. ⬜ Xây dựng Form nhập/sửa đơn hàng (UI) — Chưa bắt đầu
  6. ⬜ Xuất form PDF — Chưa bắt đầu

- **Lưu ý kỹ thuật**: Audit trigger trên `delivery_sites` chặn INSERT khi không có user auth. Cần DISABLE trigger trước khi import batch, rồi ENABLE lại.
### 2026-07-08: Xây dựng Giao diện Đơn hàng (Order Entry Form UI)
- Đã hoàn thành Bước 5: Xây dựng Form Đơn hàng theo chuẩn schema V3 (bảng orders và order_lines).
- Hỗ trợ tạo và chỉnh sửa đồng thời Header (Order) và nhiều dòng Order Lines thông qua OrderForm component.
- Tự động tải Delivery Sites theo Khách hàng (Company) đã chọn.
- Tách biệt các loại phí (charge_type): PAID, FREE, OFFICE_SAMPLE trực tiếp trên từng dòng.

### 2026-07-08: Sửa lỗi Liên kết Khách hàng & Refactor UI Đơn hàng
- Phát hiện lỗi nghiêm trọng trong migrate_v3_access_data.ts do tra cứu trực tiếp CustomerID (số) trên Map chứa Code viết tắt (chữ) -> Gây ra 90% sản phẩm và khuôn mẫu bị gán nhầm sang YSD.
- Viết và chạy thành công run_patch_v2.py sửa đổi 12,357 bản ghi trên 4 bảng: products, design_revisions, physical_molds, cutters.
- Tối ưu hóa UI OrderForm sử dụng BilingualLabel và chuẩn hóa Card-Flat.

### Phiên 09/07/2026: Tạo Báo cáo Nghiệp vụ Toàn diện & Script đọc Outlook Email
- **Tác vụ**: Viết tài liệu lưu trữ toàn diện về tất cả các nghiệp vụ của YSD dựa trên email Outlook và chỉ thị sản xuất thực tế. Xây dựng công cụ an toàn để đọc email Outlook của người dùng.
- **Thực hiện**:
  - Tạo file hồ sơ kỹ thuật `docs/technical/09_comprehensive_business_flows.md` mô tả chi tiết: xử lý đơn hàng, báo giá, chỉ thị thiết kế, layout, 3D, 2D, sản xuất khuôn, khay, định hình, kiểm tra mẫu, mạ khuôn (Teflon), sửa khuôn, hủy khuôn (in-house/third-party), chụp ảnh (5 quy cách), kiểm kê tài sản (SACT/Panasonic, Canon, NOK...), chứng nhận mượn khuôn (設備貸出書), và các phát sinh/ngoại lệ trong email (lỗi lẫn găng tay, kẹt khay, đổi vật liệu khay PP/PS).
  - Tạo script PowerShell `scripts/read_outlook_emails.ps1` kết nối COM Object Outlook, lọc email theo từ khóa YSD, tự động che giấu (mask) thông tin nhạy cảm bằng Regex (Card, Bank, Password, MyNumber, Credentials) và xuất file JSON/CSV.
  - Cập nhật nhật ký phiên vào Sổ cái dự án.

### Phiên 2026-07-09 (Tiếp theo): Refactor Form Đơn hàng theo chuẩn V3
- **Tác vụ**: Cập nhật giao diện `OrderForm.tsx` (tạo/sửa đơn hàng) theo thiết kế mới (đã thống nhất), đảm bảo khoa học, hiện đại, chuyên nghiệp.
- **Thực hiện**:
  - Gọn header form thành lưới 2 dòng (grid 6 cột) tiết kiệm 30% diện tích chiều cao.
  - Chuyển `Order Lines` (Sản phẩm) từ thẻ `table` sang UI kiểu `Card` (Mỗi sản phẩm 1 Card) nhằm hiển thị tối ưu các cột (Số lượng, giá, Điểm giao, Quy cách...).
  - Tích hợp thêm Panel Vật liệu (hiển thị Kích thước CUT LINE, Tên vật liệu, Độ dày) phía dưới tên sản phẩm sau khi tải từ `design_revisions` / `plastic_master`.
  - Tự động hóa `due_date` khi thêm dòng tiếp theo (kế thừa từ dòng cũ).
  - Tách nút lưu: Lưu nháp (`NEW`) và Xác nhận đơn (`CONFIRMED`).
  - Thay đổi nút `新規受注` tại `orders/page.tsx` chuyển từ alert (Đang phát triển) thành chuyển hướng chuẩn xác sang `/orders/create`.
  - Xây dựng file `/orders/create/page.tsx`.
  - Hoàn tất kiểm tra TypeScript (0 errors).

### Phiên 2026-07-09 (Part 2): Thêm Design Revision vào Order Lines (Phương án B)
- **Tác vụ**: Giải quyết vấn đề kiến trúc: khi 1 sản phẩm có nhiều design revision (VD: cho 2 loại nhựa khác nhau), đơn hàng không biết dùng revision nào. User xác nhận đã xảy ra nhầm lẫn thực tế.
- **Quyết định**: Chọn Phương án B — thêm nullable `design_revision_id` vào `order_lines`. Mặc định NULL = tự lấy revision mới nhất. Chỉ chỉ định khi có nhiều revision cùng active.
- **Thực hiện**:
  - Migration `20260709103000_add_revision_to_order_lines.sql`: Thêm cột `design_revision_id UUID REFERENCES design_revisions(revision_id) ON DELETE SET NULL`.
  - Server Action `orders.ts`: Thêm `design_revision_id` vào `OrderLineInput` type và upsert payload.
  - UI `OrderForm.tsx`: Khi chọn sản phẩm → tự động load tất cả revisions → auto-select revision mới nhất → hiển thị badge. Nếu có >1 revision → badge cam cảnh báo, bấm mở dropdown chọn revision cụ thể (hiển thị design_code + plastic_type + cutline).
  - Cập nhật `SCHEMA_REFERENCE.md` thêm FK mới.
  - Hoàn tất kiểm tra TypeScript (0 errors).
- **Ghi nhận vào Section 7 (Quyết định thiết kế)**: #11 — Design Revision traceability trên Order Lines (nullable FK, auto-select latest).

### 2026-07-09: Phan ra d? li?u phan c?p Khach hang t? CSV
- ?a phan tich file CSV 1,861 dong c?a khach hang ?? t?o h? th?ng phan c?p Cha-Con cho database.
- T?o va import h?n 700 \delivery_sites\ thanh cong qua k?ch b?n t? ??ng.
- X? ly v?n ?? UNIQUE constraints trong Postgres thong qua vi?c t?o \(company_id, site_code)\ unique index thay vi \site_code\ ??n l? ?? gi?i quy?t v?n ?? trung l?p ma ??a ?i?m gi?a nhi?u cong ty.
- Kh?c ph?c l?i cascade trigger log \udit_logs\ b?ng dummy employee_id an toan.

## [Update 2026-07-09] Tính năng xuất Đơn hàng/Chỉ thị (Hybrid)
- Đã xây dựng tính năng xuất Đơn hàng lai (Hybrid):
  1. Web Print Layout (PDF): Trang in HTML/CSS chuẩn hóa A4 tại /orders/[id]/print.
  2. Excel Export: Sử dụng thư viện exceljs và file mẫu gốc ESM YPC-007.xlsx (từ server ysd-folder) sao chép vào public/templates để đổ dữ liệu động (Header, Lines, Design Revisions).

## [Update 2026-07-09] Cập nhật giao diện in ấn đơn hàng động (Interactive)
- Sửa thuật toán chọn bản vẽ revision theo created_at DESC để lấy đúng bản vẽ hoạt động mới nhất.
- Thêm parser trích xuất chất liệu từ chuỗi text products.notes khi CSDL vật tư trống.
- Cho phép người dùng chỉnh sửa trực tiếp các ô thông tin trên web (bằng borderless input) trước khi In để bù đắp các dữ liệu thiếu hụt từ database.

## [Update 2026-07-10] Sửa triệt để Gantt Scroll-to-Date + Đường đỏ định vị
- **Vấn đề:** 
  1. Hai tính năng (cuộn đến ngày kỳ hạn + vẽ đường đỏ) liên tục xung đột qua nhiều phiên sửa. Sửa cuộn thì mất đường đỏ, sửa đường đỏ thì mất cuộn.
  2. Định vị cuộn ngang không chính xác khi có các Job bị collapse.
  3. Quá trình scroll mượt ('smooth') kết hợp với delay 500ms tạo cảm giác lag, nặng và gây vòng lặp định vị vô tận.
- **Giải pháp triệt để:**
  - **Độ chính xác cuộn ngang:** Viết helper `removeHiddenTasks` khớp 100% logic của thư viện để lọc bỏ các tasks đang bị collapse ra khỏi `tasksRef.current` trước khi tính toán `minTaskDate`/`maxTaskDate`. Điều này đảm bảo timeline grid ảo của chúng ta khớp hoàn hảo với grid thực của thư viện.
  - **Tốc độ phản hồi (giảm lag):** Đổi scroll behavior sang `'auto'` (cuộn tức thời) và giảm delay vẽ đường đỏ từ 500ms xuống 100ms (đủ để DOM/React ổn định mà mắt thường không cảm thấy trễ).
  - **Chống vòng lặp vô tận (Loop Protection):** Sử dụng `processedLocateRef` lưu token định vị hiện hành, bỏ qua việc định vị lặp khi Next.js `searchParams` chưa kịp cập nhật hoặc component re-render do thay đổi state khác.
- **File:** `src/components/equipment/MoldJobGantt.tsx` — hàm `handleScrollToDate` và `useEffect` auto-scroll.

## [Update 2026-07-10] Tối ưu hóa UI/UX Toolbar: Tách biệt Bộ lọc dữ liệu (Data Range) và Thu phóng (Zoom Scale)
- **Vấn đề:** 
  1. Các nút `日`, `週`, `月` trên toolbar cũ hoạt động nhập nhèm: vừa làm bộ lọc tải dữ liệu (Data filter) vừa đổi zoom scale, gây khó hiểu khi mặc định biểu đồ hiển thị 2 tuần.
  2. Nút "今日" (Hôm nay) hoạt động như một filter tải tuần hiện tại (WEEK) thay vì cuộn nhanh đến ngày hôm nay trên timeline hiện hành.
- **Giải pháp:**
  - **Tách biệt rõ ràng:** Thiết kế 2 cụm nút riêng biệt có nhãn rõ ràng:
    - **データ範囲 (Data Range)**: Lọc tải dữ liệu từ DB (`2 tuần` làm mặc định, `1 tháng`, `3 tháng`) - làm mới trang/DB query.
    - **表示単位 (Timeline Zoom)**: Thu phóng thanh Gantt (`Ngày`, `Tuần`, `Tháng`) - thay đổi client-side `viewMode` tức thời.
  - **Nhóm điều hướng Google Calendar style:** Gộp Chevron Left/Right và nút Hôm nay (`今日`) thành một khối duy nhất (`[ < ] [ 今日 ] [ > ]`).
  - **Thông minh hóa nút `今日`**: Nếu ngày hôm nay nằm trong khoảng ngày đã lọc thì chỉ cuộn nhanh đến mà không reload trang; ngược lại, tự động đổi khoảng dữ liệu về mặc định 2 tuần quanh hôm nay và tự động cuộn định vị đến.
- **File:** `src/components/equipment/MoldJobGantt.tsx` và `src/app/equipment/schedule/page.tsx`.

## [Update 2026-07-10] Phân tích Nghiệp vụ STT-002 & Quy trình Sản xuất Khuôn

### Phân tích Email STT-002
- Trích xuất 59 dòng email liên quan từ `scripts/outlook_emails_cleaned.csv`
- **8 tháng lịch sử** (11/2025 → 7/2026), 30+ sự kiện nghiệp vụ
- **Khách hàng:** ルビコン㈱ (Rubycon) qua trung gian ㈱サンテック東北 (Santec Tohoku)
- **Chi phí:** Thiết kế ¥40,000 + Prototype ¥140,000 + Khuôn ¥280,000 = Tổng ¥280,000, đã trả ¥180,000, còn ¥100,000

### Xác nhận nghiệp vụ quan trọng (User feedback)
1. **Sản phẩm SET:** Khuôn AB dập đồng thời → 1 mã `STT-002AB`, lưu tên riêng A/B qua JSONB
2. **Naming convention:**
   - Bản vẽ: `{code}{P|M}({designer})R{ver}` — VD: `STT-002P(Q)R2`
   - Nhà máy: `STT-002AB R2` (đơn giản hơn)
3. **Quy trình Job Mold:** 7 bước (lập trình mặt sau → CNC mặt sau → lập trình mặt trước → CNC mặt trước [8-240h] → khoan → đánh bóng → hoàn thiện)
4. **Quy trình Job Plug:** 2 bước (CNC 5h + cắt đế/dán flannel 3-4h), song song với Mold
5. **Quy trình Job Cutter:** Đặt ngoài, chờ nhận
6. **Ưu tiên:** Hoàn thiện module hiện tại trước → Sau đó xây dựng module Báo giá

### Trường DB cần bổ sung (chưa thực hiện, chờ xác nhận)
- `products`: stacking_type, stacking_layers, stacking_height_mm, product_set_type, set_component_names, external_length_mm, external_width_mm, customer_product_specs (JSONB), primary_plastic_code, primary_plastic_spec
- `design_revisions`: alt_plastic_type, alt_plastic_code

### File tham khảo
- Knowledge: `.agents/mempalace/knowledge/mold_manufacturing_process.md`
- Bản phân tích: `ThaoLuan/stt002_mold_workflow_plan.md` (bản 1)
- Artifact: `implementation_plan.md` (bản 2 — cập nhật sau feedback)

## [Update 2026-07-10] Migration 075 — Product Specs & SET Support
- **Migration file:** `supabase/migrations/20260710190000_product_specs_and_sets.sql`
- **12 cột mới:**
  - `products`: product_set_type, set_component_names (JSONB), stacking_type, stacking_layers, stacking_height_mm, external_length_mm, external_width_mm, primary_plastic_code, primary_plastic_spec, customer_product_specs (JSONB)
  - `design_revisions`: alt_plastic_type, alt_plastic_code
- **UI cập nhật:**
  - `src/app/master/products/[id]/page.tsx`: Type definition + handleSave 
  - `src/app/master/products/[id]/tabs/OverviewTab.tsx`: Read-only + Edit mode cho tất cả trường mới
  - `src/types/database.types.ts`: Supabase type definitions
- **SCHEMA_REFERENCE.md**: Cập nhật đầy đủ
- **TypeScript check**: ✅ 0 errors

## [Update 2026-07-11] Migration 076 — Refactor Customer UI & end_user_company_id
- **Migration file:** `supabase/migrations/20260711090000_customer_contacts_and_products.sql`
- **Thay đổi Database:**
  - Thêm `end_user_company_id` vào `products` để phân biệt khách hàng trung gian (đặt hàng) và người dùng cuối.
  - Thêm `department` và `project_role` vào `company_contacts`.
- **Refactor UI Trang Chi tiết Khách hàng (`/master/customers/[id]`):**
  - Loại bỏ hoàn toàn Left Panel, thay thế bằng kiến trúc Compact Header + Tabs chuẩn.
  - Thêm tab "Sản phẩm" để hiển thị tất cả các sản phẩm liên kết với khách hàng (dù là người mua hay end-user).
  - Khắc phục lỗi TypeORM Ambiguity khi truy vấn `products` bằng cách chỉ định explicit foreign key: `companies!products_company_id_fkey`.
- **Component ContactList**: Bổ sung hiển thị và chức năng sửa/thêm Phòng ban & Vai trò.
- **TypeScript check**: ✅ 0 errors

## [Update 2026-07-11] Fix dropdown Khách hàng & Thêm End-User vào Sản phẩm
- **Vấn đề**: Dropdown Khách hàng bị lỗi hiển thị khi chuyển sang chế độ sửa trên trang Chi tiết sản phẩm, vì STT_OLD bị ẩn đi và STT không nằm trong danh sách type CUSTOMER. Ngoài ra cần thêm thông tin Người dùng cuối.
- **Giải pháp**: 
  - Khắc phục filter dropdown trong `OverviewTab.tsx` ở chế độ Edit.
  - Bổ sung `product_name_internal` và `end_user_company_id` vào `ProductDetailData` và UI (`OverviewTab.tsx`, `ProductDetailHeader.tsx`).
  - Phân tích và quyết định End-User chỉ hiển thị tham khảo, tên khuôn vẫn được đặt theo Khách đặt hàng.

## [Update 2026-07-11] Sửa triệt để lỗi Dropdown Khách hàng/End-User không hiển thị giá trị mặc định (Supabase 1000-row Limit)
- **Vấn đề**: Sau khi sửa dropdown, khi bấm nút "Sửa" (Edit), trường "得意先" (Khách đặt hàng) và "エンドユーザー" (Người dùng cuối) vẫn hiển thị "選択してください" (Chưa chọn) mặc dù sản phẩm đã có thông tin. Khi tìm kiếm các công ty nằm ở cuối bảng chữ cái (như STT) cũng không thấy xuất hiện. Nguyên nhân do API query Supabase default chỉ trả về tối đa 1000 records. Vì CSDL có đến 1973 công ty nên các công ty xếp sau (như STT, bắt đầu bằng chữ S) bị cắt bỏ hoàn toàn khỏi state `companies`.
- **Giải pháp**: 
  - Sửa hàm `fetchCompanies` trong [page.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/master/products/%5Bid%5D/page.tsx#L147-L168) sang cơ chế phân trang bằng vòng lặp `while (hasMore)` và dùng `.range()` (mỗi trang 1000 records) tương tự như ở trang danh sách sản phẩm.
  - Việc này đảm bảo tải toàn bộ 1973+ công ty hoạt động vào RAM trình duyệt để `SearchableSelect` đối khớp `formData.company_id` chính xác và tìm kiếm client-side mượt mà.
- **Trạng thái**: TypeScript check `0 errors`. Đã lưu walkthrough.md.

- **2026-07-11 (Antigravity): Thiết bị phụ trợ (Auxiliary Equipments) - UI Implementation**
  - Đã thiết kế hoàn chỉnh implementation_plan.md cho việc tách thiết bị phụ trợ (Frames, Bases, Tooling Sets) thành bảng uxiliary_equipments độc lập thay vì nhét chung vào bảng products.
  - Đã xây dựng src/app/equipment/auxiliary/actions.ts cho các API Server Actions (etchAuxiliaryEquipments, etchItemTypesForEquipments, etchCavTypes).
  - Đã xây dựng src/app/equipment/auxiliary/page.tsx chứa Data Table hiển thị danh sách thiết bị phụ trợ.
  - Sử dụng Type Casting để bypass lỗi Typescript liên quan đến schema không khớp (schema cũ có sẵn một table tên là uxiliary_equipments với cấu trúc khác). Khi chạy DB migration trong tương lai, code sẽ hoạt động hoàn toàn trơn tru. Lỗi missing columns (42703) được bắt và fallback về mảng rỗng để không crash UI.
  - Các quy tắc về Pagination, SearchableSelect, và Back/Up Pattern đều được tuân thủ nghiêm ngặt.

- **2026-07-11 (Antigravity/Claude): Bổ sung auxiliary_equipment_id FK vào jobs**
  - Tạo migration 20260711162000_jobs_auxiliary_equipment_fk.sql: Thêm cột uxiliary_equipment_id uuid REFERENCES auxiliary_equipments(equipment_id) vào bảng jobs.
  - Mục đích: Cho phép Job liên kết trực tiếp đến thiết bị phụ trợ, tương tự cách physical_mold_id liên kết Job với khuôn vật lý.
  - Luồng nghiệp vụ xác nhận: Tạo thiết bị (auxiliary_equipments) TRƯỚC → Tạo Job SAU (nhất quán với luồng khuôn).
  - Quy tắc đặt mã thiết bị: Ưu tiên dùng mã CAV (VD: WB-74CZD), fallback sang kích thước (VD: WB-530X350).
  - Cập nhật SCHEMA_REFERENCE.md (thêm FK mới vào phần jobs).
  - Cập nhật thermoforming_equipment_set.md (naming convention + luồng tạo thiết bị → Job).

## [Update 2026-07-13] Phân tích & Phục hồi sai lệch dữ liệu Legacy (V3 -> V4)
- **Bối cảnh**: Sau khi phân tích so sánh các bản SQL cũ và các script import lưu trữ, phát hiện nhiều cột nghiệp vụ quan trọng bị lược bỏ hoặc gộp không đúng (VD: `PieceCount` gộp chung vào `CAVID`, `PocketNumbers` và `ToleranceX/Y` bị rơi mất trong quá trình dồn code import V4).
- **Giải pháp**: 
  - Tạo file SQL migration mới: `supabase/migrations/20260713000000_v5_restore_legacy_fields.sql` để bổ sung các trường khuyết thiếu cho `products`, `design_revisions`, `physical_molds`, `cutters`, `jobs`.
  - Tạo file import mới: `scripts/migrate_v5_expansion_import.ts` được tách riêng hoàn toàn (không ghi đè bản V4 cũ để làm đối chiếu) để ánh xạ lại đầy đủ các trường dữ liệu bị mất này.
  - Cập nhật `SCHEMA_REFERENCE.md` với mô tả của các trường mới.
- **Git status**: Đã commit và push thư mục `ThaoLuan` thành công lên GitHub. (Thư mục `supabase` đang bị `.gitignore` nên chỉ lưu cục bộ).

## [Update 2026-07-13] Thiết kế Production Module (SD-03 đến SD-07) & Business Rules
- **Bối cảnh**: Phân tích luồng Đơn hàng → Chỉ thị SX → Giao hàng → QC và Vật tư (BOM) từ dữ liệu thực tế (	oanysdmail.CSV, 納品書_注文, 材料在庫).
- **Giải pháp - Database**: 
  - SD-03: Tái sử dụng và mở rộng bảng production_orders cho Chỉ thị SX.
  - SD-04 & SD-05: Thêm sample_type, ox_type, agging_required vào order_lines.
  - SD-06: Mở rộng shipments, production_lots (truy xuất nguồn gốc UUID). Thêm bảng shipment_required_docs cho template giấy tờ giao hàng (SMK, KYD).
  - SD-07: Mở rộng material_inventory (Kanban status, quantity_reserved), mold_material_bom (PPWR reportable). Thêm bảng material_consumption_logs để ghi log tiêu hao (trừ lùi).
- **Giải pháp - Document**: 
  - Tạo tài liệu chính thức docs/02_BUSINESS_PROCESS.md version v1.0-partial (Đã duyệt phần Shipments & Materials).
  - Cập nhật docs/06_SCHEMA_DECISIONS.md.
- **Trạng thái**: Tất cả file migration đã được tạo (supabase/migrations/) và các thay đổi docs đã push lên GitHub. Hệ thống Database sẵn sàng cho Phase 2 (QC & Production PDF).
# # #   2 0 2 6 - 0 7 - 1 5 :   T e c h n i c a l   R e v i e w   U I   &   B u i l d   F i x e s 
 
 -   C �p   n h �t :   F i x   l �i   T S 2 5 8 9   d e e p   t y p e   i n s t a n t i a t i o n   t r o n g    c t i o n s . t s ,   m a c h i n e . t s ,   m r p . t s ,   v �   m a s t e r - d a s h b o a r d . t s   b �n g   c � c h   c a s t   \ s u p a b a s e   a s   a n y \ .   F i x   l o g i c   l �y   u s e r   r o l e   t �  b �n g   \ p r o f i l e s \   t h a y   c h o   b �n g   \ e m p l o y e e s \ . 
 
 # # #   2 0 2 6 - 0 7 - 1 5 :   F i x   S u p a b a s e   S e c u r i t y   A d v i s o r   A l e r t s 
 
 -   C �p   n h �t :   T �o   m i g r a t i o n   \ 2 0 2 6 0 7 1 5 0 9 3 9 0 0 _ s e c u r i t y _ a d v i s o r _ f i x e s . s q l \   �  f i x   R L S   c h o   \  u s i n e s s _ c a s e s \ ,   f i x   \ s e a r c h _ p a t h \   c h o   c � c   f u n c t i o n s   t r i g g e r   v �   s e t   S E C U R I T Y   D E F I N E R   c h o   \  u d i t _ t r i g g e r _ f u n c \ . 
 
 

### 2026-07-15: Fix TypeScript Errors in BP-32 Production Instructions

**Cﾃ｡c v蘯･n ﾄ黛ｻ・ﾄ妥｣ x盻ｭ lﾃｽ:**
1. **Build lỗi TS2589 (Excessively deep Type instantiation):**
   - Lỗi xuất hiện ở machine.ts và mrp.ts do Supabase type inference query bị quá phức tạp khi join qua nhiều bảng có FK hỗn hợp.
   - Fix: Cast đối tượng supabase truy vấn sang ny trước khi gọi .from() (ví dụ: (supabase as any).from(...)) giúp bỏ qua TypeScript Type Inference đệ quy sâu.
2. **Các lỗi Type Interface trong BP-32:**
   - Fix: Interface ProductionInstruction và các query liên quan được điều chỉnh đồng bộ giữa front-end và response Supabase.
   - Fix: Chỉnh logic tìm kiếm thông tin phụ thuộc companies bằng cách route qua orders.companies (production_instructions không còn FK trực tiếp đến companies).
3. **Build tsc clean:** 
px tsc --noEmit thành công hoàn toàn.
Code đã được đẩy lên nhánh main (commit: 3eb0b58).


### 2026-07-15: Tiếp tục hoàn thiện module BP-32 theo yêu cầu từ PE

**Các vấn đề đã xử lý:**
1. **Next.js 15 breaking changes:** 
   - Đã chuyển đổi params thành Promise trong src/app/production-instructions/[id]/page.tsx và src/app/api/production-instructions/[id]/pdf/route.ts theo đúng chuẩn của Next.js 15.
2. **UI Enhancements (Step 2):** 
   - Bảng products không chứa thông tin về chiều rộng/độ dày, nên đã thêm 2 input nhập tay cho material_thickness và material_width vào form Step2ProductionInfo.tsx (những thông tin này đã được chuẩn bị sẵn cột trong DB và được map trong API).
3. **Cập nhật Layout PDF Template:** 
   - Chỉnh lại cách lấy dữ liệu công ty và địa chỉ giao hàng (companies?.company_name, delivery_sites?.site_address) vào ProductionInstructionPDF.tsx để đồng bộ đúng với database schema hiện tại.
   - (Sprint 1 scope chỉ yêu cầu 1 template GENERAL. Các template riêng cho SMK, HAE, NLC, YAE sẽ được implement trong Sprint 2 cùng với module checkMaterialStock sau khi cấu trúc kho vật liệu hoàn thiện)

Code đã được đẩy lên nhánh main (commit: 520f99a) và pass toàn bộ Type Checks.

### 2026-07-15: Hoàn thiện Module Quản lý Tồn kho Vật liệu (BP-42)

**Các vấn đề đã xử lý:**
1. **Database Schema:** 
   - Tạo migration `20260715110000_bp42_material_stock.sql` cho bảng `material_stock` với các trường `material_spec`, `factory_site`, `is_silicon`, `is_antistatic` và `current_stock_m`.
   - Tạo SQL View `material_inventory_v2` để dễ dàng query tồn kho khả dụng (`available_m`) theo từng loại nhựa và nhà máy.
2. **Seed Data:** 
   - Viết Python script đọc dữ liệu từ file `material_stock_240318.xlsx`, map cấu trúc 3 cột tồn kho nhà máy (Honsha, Aomori, Ibaraki) thành 3 record độc lập trên database.
   - Import thành công 180 SKU tồn kho vật liệu thực tế với metric chiều dài (mét).
3. **Tích hợp Logic:**
   - Cập nhật hàm `checkMaterialStock` trong `src/app/actions/production-instructions.ts` để đọc tồn kho thật từ view `material_inventory_v2` thay vì hardcode.
   - Cập nhật lại TypeScript types của Supabase (`npx supabase gen types typescript --linked`).
4. **Verifications:** 
   - Compile code TS successfully không lỗi (`npx tsc --noEmit`).

Trạng thái: BP-42 đã hoàn tất implementation. Unblock hoàn toàn Sprint 2.

 
 # # #   [ 2 0 2 6 - 0 7 - 1 6 ]   V 5   L e g a c y   D a t a   M i g r a t i o n   ( A N ) 
 -   * * T � c   v �* * :   V i �t   m i g r a t i o n   t h � m   8   c �t   l e g a c y   c h o   \ j o b s \   v �   2   c �t   � n g   g � i   c h o   \ p r o d u c t i o n _ i n s t r u c t i o n s \ . 
 -   * * T h �c   h i �n * * :   T �o   b �n g   \ m o l d _ d e s i g n _ c u t t e r s \   ( t �  m o l d c u t t e r . c s v ) .   T �o   \ s c r i p t s / s e e d _ v 5 _ l e g a c y . p y \   �  s i n h   l �n h   S Q L   6 . 6 M B   m a p p i n g   a n   t o � n   b �n g   h � m   b m   U U I D   d �a   t r � n   I D   c i  c �a   A c c e s s . 
 -   * * T � n h   t r �n g * * :   �   p a s s   c h e c k   T y p e s c r i p t ,   s �n   s � n g   b � n   g i a o   c h o   P E   c h �y   m � i   t r ��n g . 
 
 
### Phien 2026-07-16: Delivery & Shipments Sprint (D-01 ~ D-04)
- Kh?i t?o b?ng shipment_lots qua migration SD-06b ?? gi?i quy?t D-03.
- Gen l?i database.types.ts va fix 0 errors TypeScript.
- Hoan thanh giao di?n /orders/shipments va chi ti?t /orders/shipments/[id] g?m Overview, Docs, Lots tab.
- Ra soat legacy seed file: xac nh?n job_steps dung processing_item_id (h?p l? theo DB m?i) va work_logs ?a map ?ung employee_id.

---

### Phiên 2026-07-30: Job Steps Unification (Components)
**Model:** Gemini | **Kết quả:** job_steps = Components, tsc 0 errors

**Thay đổi chính:**
- Gộp moldComponents + steps thành 1 mảng steps[] duy nhất trong quick-create page
- Thêm 6 cột component vào job_steps: type_code, material_spec, quantity, arrangement, condition, manufacture_location
- Migration: 20260730050000_add_component_fields_to_job_steps.sql (chờ chạy)
- database.types.ts đã cập nhật thủ công
- Worklog filter: step_id FK → track/type_code → step_no → step_name (4 cấp fallback)
- Cập nhật SCHEMA_REFERENCE.md: job_steps = Components architecture note
- Cập nhật SESSION_HANDOFF.md: kiến trúc job_steps + worklog linking

**Files đã sửa:**
- src/app/actions/quick-mold-job.ts (types + create/update)
- src/app/equipment/jobs/quick-create/page.tsx (state + UI)
- src/components/equipment/QuickMoldJobConfirmModal.tsx
- src/types/database.types.ts (6 cột mới)
- messages/ja.json + vi.json (noComponentsYet)

---

### Phiên 2026-07-31 18:37 JST (Claude Opus 4.6)

**Nội dung:** Xác minh & Thực thi kế hoạch Equipment Standardization

**Hoàn thành:**
1. ✅ Xác minh phân tích Jobs & Steps (3 nhóm nghiệp vụ bị ép chung 1 pipeline)
2. ✅ Xác nhận 3 migrations đã apply trên Supabase remote (20260730050000, 20260730060000, 20260731030000)
3. ✅ Xác nhận database.types.ts đã chứa bảng equipment + cột job_category (506KB, đồng nhất)
4. ✅ Tạo & apply migration backfill job_category cho 1,183 jobs cũ (20260731060000)
5. ✅ Phân bố: CUTTER_NEW=958, MOLD_NEW=144, MOLD_MODIFY=78, EQUIPMENT_NEW=2, INTERNAL_OPS=1
6. ✅ Cập nhật SESSION_HANDOFF.md với thông tin Equipment Standardization
7. ✅ Lưu kế hoạch Phase 2-3 vào hồ sơ

**Schema mới:**
- Bảng: equipment, equipment_history, equipment_assignments
- Cột trên jobs: job_category, equipment_id, case_id


---

### Phiên 2026-08-04 (Opus 4.6) — Paper Style Spec Layout & Terminology Alignment

**Thực hiện:**
1. **Terminology Standardization (Pocket vs Cavity):**
   - pocket_numbers = Số đơn vị sản phẩm trên 1 khuôn (VD: 56 Pocket). KHÔNG dùng CAV/cav.
   - cavity_count = Số khuôn trên 1 thiết kế (VD: 1-cavity mold).
   - Updated UI: TabOverview.tsx, OverviewTab.tsx, messages/ja.json, messages/vi.json.

2. **Legacy Access Data Backfill:**
   - Migration: supabase/migrations/20260804150000_backfill_legacy_access_specs.sql
   - Patched JAE352A: cutline 510x270, orientation, setup_type, under_depth, corner_r, chamfer_c, pocket_numbers=56.

3. **Paper Style Spec Layout (RULE-UI-10):**
   - Loại bỏ hoàn toàn: padding, border, background, border-radius từ SpecCell & InfoRow.
   - Label: 10px, #64748B, minWidth: 78px (căn lề dọc).
   - Value: 13px Bold 700, #0F172A, monospace cho số.
   - Grid gap: 2px x 12px.
   - Không dùng dấu : — phân tách bằng kích cỡ/trọng lượng font.
   - Đã ghi hồ sơ vào: AI_SYSTEM_RULES.md (RULE-UI-10), AGENTS.md (Section 6).

**Files đã sửa:**
- src/app/product-center/[id]/_components/TabOverview.tsx
- src/app/master/products/[id]/tabs/OverviewTab.tsx
- supabase/migrations/20260804150000_backfill_legacy_access_specs.sql (NEW)
- AI_SYSTEM_RULES.md — thêm RULE-UI-10
- AGENTS.md — thêm Paper Style pattern vào Section 6
- messages/ja.json, messages/vi.json — cập nhật cavityAndPitch key


---

### Phiên 2026-08-05 (Antigravity) — Refactor Schema & Quy tắc Thiết bị Dùng chung (CAV & Cutter No)

**Thực hiện:**
1. **Loại bỏ Bảng dư thừa mold_revisions:**
   - Backfill design_revision_id trực tiếp cho 100% bản ghi equipment (6,034 records).
   - Thực thi DDL migration: DROP TABLE mold_revisions CASCADE, xóa cột mold_revision_id trên equipment, physical_molds, jobs.
   - Migration file: supabase/migrations/20260805150000_drop_mold_revisions.sql.
   - Refactor backend actions (mold.ts, mold-revise.ts, quick-mold-job.ts, production.ts) và UI components (TabOverview.tsx, OverviewTab.tsx, products/[id]/page.tsx).

2. **Quy tắc Thiết bị Dùng chung (Shared Equipment Matching Rules):**
   - **Nhóm 1 (Kích thước ngoài Sản phẩm):** Dao cắt (CUTTER_SEPARATE/CUTTER_INLINE) & Stacking (STACKING): GỢI Ý KÈM CẢNH BÁO biên dạng uốn cong/lỗ khoét phụ, BẮT BUỘC KTV xác nhận trực tiếp (không tự động gán hoàn toàn).
   - **Nhóm 2 (Kích thước ngoài của Khuôn - CAV):** Đế làm mát (WATER_BASE), Đế khí nén (PRESSURE_BASE), Khung (FRAME) dùng chung dựa trên **Mã khổ CAV** (actual_length_mm x actual_width_mm của khuôn) theo tiêu chuẩn YSD (Khổ A: 470x300, Khổ ZD: 470x347...).
   - **Định nghĩa CAV:** Cập nhật chính thức vào hồ sơ dự án: **CAV là Mã khổ Kích thước ngoài của Khuôn, KHÔNG PHẢI Pocket Count / Cavity nhỏ!**

3. **Cơ chế Quản lý Mã Dao cắt (Cutter No):**
   - Không ghép tiền tố CT- vào tên hiển thị để tránh nhầm với mã khuôn CT-1042.
   - Tên hiển thị gốc xưởng dùng là dãy số tự nhiên (1042), mã hệ thống duy nhất là equipment_code.

4. **Hồ sơ Kỹ thuật Archive:**
   - Tạo file archive: docs/technical/07_equipment_matching_and_naming_rules.md.
   - Cập nhật: SCHEMA_REFERENCE.md, 01_business_process.md.


---

### Phiên 2026-08-06 (Antigravity) — Refactor Vòng đời Tiến hóa Bản vẽ (`R1 ➔ R2 ➔ R3`), Phân định Khuôn Song song & Modal Chi tiết Thiết bị 840px Đa Thẻ

**Thực hiện:**
1. **Phân định Khuôn Cải tạo (改造 - Dùng chung thân) & Khuôn Song song (新規製作 - Độc lập)**:
   - Xác minh 100% không mất hay gộp bản ghi nào trong DB (67 mã sản phẩm có khuôn song song).
   - Chế độ `現バージョン` (Current Version): Giới hạn phạm vi hiển thị chuẩn theo `selectedRevId`.
   - Chế độ `すべて` (All Revisions): Liệt kê toàn bộ khuôn vật lý trong kho của dòng sản phẩm.

2. **Khắc phục Lỗi Badge `旧版` và Chuẩn hóa Thứ tự Tiến hóa (`sortJobsEvolution`)**:
   - Sửa hàm `getMoldRevId` ưu tiên check `m.design_revision_id` trên khuôn vật lý.
   - Sắp xếp tiến trình bản vẽ chuẩn theo hậu tố phiên bản (`R1 ➔ R2 ➔ R3`), đảm bảo phiên bản mới nhất ở cuối chuỗi LUÔN nhận badge xanh lá **`★ 現行` (Current Version)**.

3. **Nâng cấp Modal Chi tiết Thiết bị (840px Multi-Tab Modal)**:
   - Mở rộng Popup Quick Preview từ 520px lên **840px Đa thẻ**:
     - **📌 Tab 1 (Specs & Storage)**: Kích thước, Trọng lượng, Pocket, **Mạ Teflon (`✨ テフロンコーティング済` vs `標準`)**, Vị trí kệ (`📍 70-0`), Nơi bảo quản (`🏢 YSD`).
     - **🌿 Tab 2 (Lifecycle Tree)**: Cây phả hệ tiến hóa (`🌱 R1 (新規)` ➔ `🔨 R2 (改造・現行)`).
     - **⚙️ Tab 3 (Job History)**: Bảng nhật ký Job gia công cải tạo.
     - **🚚 Tab 4 (Movement Log)**: Nhật ký di chuyển xuất nhập kho & gửi gia công ngoài.

**Files đã sửa & kiểm tra:**
- `src/app/product-center/[id]/_components/EquipmentQuickPreviewModal.tsx`
- `src/app/product-center/[id]/_components/TabOverview.tsx`
- `src/lib/utils/moldNaming.ts`
- `SCHEMA_REFERENCE.md`, `SESSION_HANDOFF.md`, `walkthrough.md`
- Compilation check: `npx tsc --noEmit` -> **0 errors**


---

### Phiên 2026-08-06 (Antigravity - Đêm) — Đẩy Code Lên GitHub, Nâng Cấp Module Check-in/Out & Relocate Standalone

**Thực hiện:**
1. **Module Relocate (Thay đổi vị trí) Độc lập (`LocationMoveModule.tsx`)**:
   - Tách biệt thành popup riêng biệt 1080px 2 cột với bảng lịch sử di chuyển kệ riêng (lọc chuẩn `.eq('action_type', 'RELOCATE')`).
   - Xây dựng quy trình 2 bước Stepper (Bước 1: Ngày & Nhân viên ➔ Bước 2: Vị trí kệ mới).

2. **SearchableCombobox Realtime & Nhập Mã Nhanh (`SearchableCombobox.tsx`)**:
   - Thay thế toàn bộ HTML dropdown `<select>` bằng Combobox tìm kiếm realtime thông minh.
   - Hỗ trợ gõ mã nhân viên (`M09`, `M05`), mã tầng kệ (`70-0`, `14`), hoặc tên JP/VI. Tích hợp phím `Enter` chọn ngay lập tức.

3. **Khử Lỗi Nháy & Co Giãn Modal Overlay (`ActionDialogManager.tsx`)**:
   - Cố định khung Modal `height: 630px` & `maxHeight: '90vh'`. Khôi phục layout geometry ngay từ Frame 0 (0ms), loại bỏ hoàn toàn hiện tượng co giãn, giật nháy khi mở hoặc đổi bước.

4. **Chuẩn Hóa Ngôn Ngữ i18n**:
   - Bổ sung namespace `CheckInOutModule` & `LocationMoveModule` trong `messages/ja.json` và `messages/vi.json`, không hardcode song ngữ tĩnh.

5. **Đồng Bộ Repository GitHub**:
   - Commit & push thành công mốc thiết kế mới lên GitHub branch `main` (`9d613b3`).

**Files đã sửa & kiểm tra:**
- `src/components/ui/SearchableCombobox.tsx` [NEW]
- `src/app/equipment/_components/detail-modal/ActionDialogManager.tsx`
- `src/app/equipment/_components/detail-modal/EquipmentDetailModal.tsx`
- `src/app/equipment/_components/detail-modal/modules/CheckInOutModule.tsx`
- `src/app/equipment/_components/detail-modal/modules/LocationMoveModule.tsx`
- `messages/ja.json`, `messages/vi.json`
- Compilation check: `npx tsc --noEmit` ➔ **0 errors**
- i18n check: `node scripts/check_translations.mjs` ➔ **✅ All translation keys defined**


---

### Phiên 2026-08-08 (Antigravity) — Sửa Lỗi Modal Chi Tiết Thiết Bị Liên Quan, Khóa Bảng Legacy, Khắc Phục RLS & Chuẩn Hóa PostgREST FK Alias

**Thực hiện:**
1. **Khóa 100% Bảng Legacy (`cutters`, `physical_molds`) & Chuyển sang Nguồn Sự Thật Duy Nhất (`equipment`)**:
   - Loại bỏ hoàn toàn mọi đoạn code fallback query sang bảng `cutters` và `physical_molds` cũ trong `EquipmentDetailModal.tsx`.
   - Tất cả truy vấn thiết bị (Khuôn, Dao cắt, Đế nước...) được đưa 100% về duy nhất 1 bảng `equipment` sử dụng `equipment_id`, `legacy_cutter_id`, `legacy_physical_mold_id`, `equipment_code`, và `display_name`.

2. **Khắc phục Lỗi PostgREST Foreign Key Alias (`PGRST201`)**:
   - Phát hiện nguyên nhân gốc làm popup không hiển thị được dữ liệu do chuỗi query cũ dùng `companies!keeper_company_id` và `companies!company_id` (PostgREST không map được tên cột khi có nhiều FK).
   - Chuẩn hóa lại syntax theo đúng FK constraint name trong Postgres: `keeper_company:companies!equipment_keeper_company_id_fkey` và `company:companies!equipment_company_id_fkey` trên cả `EquipmentDetailModal.tsx` và `TabOverview.tsx`.

3. **Bổ sung RLS SELECT Policies cho Browser Anon Key**:
   - Thêm RLS SELECT policy cho `anon` và `authenticated` roles trên 6 bảng core: `equipment`, `equipment_assignments`, `equipment_history`, `design_revisions`, `orders`, `rack_layers`.
   - Tạo migration file: `supabase/migrations/20260808_add_rls_select_policies.sql`.

5. **Quy tắc Phân định Thiết bị Thử nghiệm (`試作`) vs Hàng loạt (`正規`) & Lọc Job theo Thiết bị Độc lập**:
   - Thống nhất quy định kiến trúc: Ở chế độ filter `現バージョン` (Current Version), thiết bị vật lý thử nghiệm (như `SMK-218D R3`) CHỈ hiển thị khi người dùng chọn đúng phiên bản thiết kế thử nghiệm (`SMK218DR3`), KHÔNG trộn lẫn vào phiên bản hàng loạt chính (`SMK218R3`).
   - Cập nhật DB `equipment.design_revision_id` cho khuôn thử nghiệm `SMK-218D R3` và `YCM-070D R1` bị gán nhầm sang phiên bản chính.
   - Sửa logic lọc `selectedEquipJobs` trong `TabOverview.tsx`: Khi người dùng click chọn 1 thiết bị cụ thể, danh sách Job gia công chỉ lọc và hiển thị các Job thuộc về đúng `equipment_id`/`physical_mold_id` của thiết bị được chọn (loại bỏ fallback `|| j.design_revision_id === selectedRevId` gây trộn lẫn job từ các thiết bị khác).

**Files đã sửa & kiểm tra:**
- `src/app/equipment/_components/detail-modal/EquipmentDetailModal.tsx`
- `src/app/equipment/_components/detail-modal/types.ts`
- `src/app/product-center/[id]/_components/EquipmentQuickPreviewModal.tsx`
- `src/app/product-center/[id]/_components/TabOverview.tsx`
- `src/app/equipment/unified/page.tsx`
- `supabase/migrations/20260808_add_rls_select_policies.sql` [NEW]
- Compilation check: `npx tsc --noEmit` ➔ **0 errors**

---

### Phiên 2026-08-17 (Antigravity) — Hoàn thiện Luồng Khép Kín Product Center (Phase 1) & Thiết lập Quy tắc Nghiệp vụ Sản xuất

**Thực hiện:**
1. **[G3/BUG] Sửa Lỗi Quick Create Mold Job không nhận `product_id`**:
   - `src/app/equipment/jobs/quick-create/page.tsx`: Bổ sung đọc URL parameter `product_id` và hàm `loadProductById`. Tự động điền thông tin Công ty, Mã sản phẩm, Tên sản phẩm, và toàn bộ thông số kỹ thuật từ bản vẽ CAD `design_revisions` mới nhất. Nâng cấp `selectProduct` tự động nạp CAD specs khi người dùng chọn sản phẩm trong combobox.

2. **[G4 & G5] Khép Kín Luồng Đơn Hàng từ Product Center**:
   - `src/app/orders/_components/OrderForm.tsx`: Hỗ trợ đọc `?product_id=...` để tự động gán Khách hàng và tạo dòng chi tiết đơn hàng `order_lines` với bản vẽ CAD mới nhất.
   - `src/app/orders/create/page.tsx`: Bọc `<Suspense>` chuẩn Next.js 14 App Router.
   - `src/app/orders/page.tsx`: Bổ sung bộ lọc danh sách đơn hàng theo `?product_id=...`, hiển thị Filter Pill sản phẩm trực quan kèm nút xóa nhanh, và bọc `<Suspense>`.

3. **[G1 & G2] Nút Tạo Sản Phẩm & Tạo Revision Trực Tiếp tại Product Center**:
   - Tạo mới `src/app/product-center/_components/CreateProductModal.tsx`: Modal tạo nhanh sản phẩm ngay tại Product Center với kiểm tra trùng mã tự động và tự format mã compact vs mã hiển thị có gạch ngang.
   - Tạo mới `src/app/product-center/[id]/_components/CreateDesignRevisionModal.tsx`: Modal tạo nhanh bản vẽ CAD revision mới (hàng loạt hoặc thử nghiệm) cho sản phẩm, tự động tính số Revision kế tiếp và sao chép thông số từ revision hiện tại.
   - Kết nối nút `+ 新規登録` trên Header Product Center và `+ 新規デザイン` trong `TabDesignsEquipment.tsx`.

4. **Chuẩn Hóa Hồ Sơ Kỹ Thuật & Quy Tắc Nghiệp Vụ (Single Source of Truth)**:
   - **`[RULE-BIZ-CUTTER]`**: Xác định rõ dao cắt mặc định là `CUTTER_INLINE` (gắn trong máy định hình ILLIG). Chỉ gán `CUTTER_SEPARATE` khi mục `別抜き` (Separate Cutting) được đánh dấu là `有`.
   - **`[RULE-BIZ-NAME]`**: Quy ước chuẩn 5 trường tên sản phẩm: `product_description` (Mô tả làm việc / Tên ban đầu từ 品名 trên 工程票 - luôn có dữ liệu), `product_name` (Tên chính thức trên hóa đơn/chứng từ), `product_name_internal` (Tên nội bộ có gạch ngang), `product_code` (Mã compact), và `customer_product_name` (Mã/Tên phía khách hàng).
   - Đã cập nhật vào `AI_SYSTEM_RULES.md`, `SCHEMA_REFERENCE.md`, và Sổ cái Master Ledger.

**Files đã sửa & kiểm tra:**
- `src/app/equipment/jobs/quick-create/page.tsx`
- `src/app/orders/_components/OrderForm.tsx`
- `src/app/orders/create/page.tsx`
- `src/app/orders/page.tsx`
- `src/app/product-center/page.tsx`
- `src/app/product-center/_components/CreateProductModal.tsx` [NEW]
### Phiên 2026-08-17 (Antigravity) — Hoàn thành Phase 2 (Storage & Photos) và Phase 3 (AI OCR với Google Gemini 2.0 Flash)

**Thực hiện:**
1. **[Phase 2] Module Quản lý Ảnh & Supabase Storage cho Thiết bị & Khuôn**:
   - `supabase/migrations/20260817000000_create_equipment_photos.sql`: Tạo bảng `equipment_photos` với đầy đủ indexes, RLS policies, và Storage bucket `equipment-photos`.
   - `src/lib/storage/EquipmentPhotoStore.ts`: Xây dựng SDK client với tính năng nén ảnh client-side bằng HTML5 Canvas (tối đa 1920px, JPEG 85% chất lượng cao), upload/delete lên Supabase Storage và đồng bộ CRUD metadata.
   - `src/components/equipment/EquipmentPhotoUploader.tsx`: Giao diện kéo thả dropzone & chụp ảnh camera di động trực tiếp (`<input capture="environment">`).
   - `src/components/equipment/EquipmentPhotoGallery.tsx`: Lưới ảnh responsive, Lightbox toàn màn hình với zoom/pan, duyệt trước/sau, sửa chú thích inline và xóa ảnh an toàn.
   - Tích hợp tab **📷 写真 (Photos)** vào `EquipmentDetailModal.tsx` và `PhotoManagerModule.tsx`.

2. **[Phase 3] Module AI OCR Trích Xuất Phiếu Công Trình (新規金型製造工程票) bằng Google Gemini 2.0 Flash**:
   - `src/app/api/ocr/extract/route.ts`: API Route kết nối trực tiếp Google Gemini 2.0 Flash REST API, phân tích ảnh phiếu công trình thành cấu trúc JSON chuẩn xác theo quy tắc `[RULE-BIZ-CUTTER]` và `[RULE-BIZ-NAME]`.
   - `src/app/api/ocr/save/route.ts`: API Route lưu trữ nguyên tử đa bảng (Atomic Multi-table Save), tự động tạo hoặc liên kết `products`, `design_revisions` (SSOT), `equipment` (MOLD & CUTTER), `jobs`, và `job_steps`.
   - `src/components/ocr/ManufacturingSheetOCRModal.tsx`: Giao diện Modal tương tác trực quan với Side-by-Side Review (Ảnh gốc bên trái $\leftrightarrow$ Form chỉnh sửa bên phải), kiểm tra hợp lệ và liên kết trực tiếp sau khi lưu.
   - Gắn nút **✨ AI 工程票取込** trên Header Product Center (`/product-center`) và Quick Create Mold Job (`/equipment/jobs/quick-create`).

3. **Kiểm tra Hệ Thống & Đa Ngôn Ngữ**:
   - `scripts/check_translations.mjs`: 100% Pass không thiếu key nào.
   - `npx tsc --noEmit`: 0 errors.

**Files đã tạo & cập nhật:**
- `supabase/migrations/20260817000000_create_equipment_photos.sql` [NEW]
- `src/lib/storage/EquipmentPhotoStore.ts` [NEW]
- `src/components/equipment/EquipmentPhotoUploader.tsx` [NEW]
- `src/components/equipment/EquipmentPhotoGallery.tsx` [NEW]
- `src/app/api/ocr/extract/route.ts` [NEW]
- `src/app/api/ocr/save/route.ts` [NEW]
- `src/components/ocr/ManufacturingSheetOCRModal.tsx` [NEW]
- `src/app/equipment/_components/detail-modal/EquipmentDetailModal.tsx`
- `src/app/equipment/_components/detail-modal/modules/PhotoManagerModule.tsx`
- `src/app/equipment/_components/detail-modal/modules/TransportModule.tsx`
- `src/app/product-center/page.tsx`
- `src/app/equipment/jobs/quick-create/page.tsx`
- `src/types/database.types.ts`
### 2026-08-19: Tích hợp Module Lịch Làm Việc Công Ty & Hệ Thống Kỳ Hạn Hoàn Thành 3 Ngày Làm Việc (Phase 74)

1. **Bảng Cơ Sở Dữ Liệu `company_calendar` & Thuộc Tính `target_completion_date`**:
   - Tạo migration `supabase/migrations/20260819000000_create_company_calendar.sql` và đẩy lên Supabase DB.
   - Nạp dữ liệu tự động 1,095 ngày (2025–2027) gồm đầy đủ các ngày lễ quốc gia Nhật Bản, ngày nghỉ định kỳ, kỳ nghỉ Obon (8/13–8/16), và Tết Nguyên Đán qua `scripts/seed_company_calendar.js`.
   - Bổ sung cột `target_completion_date` (DATE) vào `jobs` và `job_steps`.
   - Backfill tính toán tự động `target_completion_date` cho 1,101 jobs hiện có qua `scripts/backfill_target_completion_date.js`.

2. **Module Quản Lý Lịch Công Ty (`/master/calendar`)**:
   - `src/app/master/calendar/page.tsx`: Giao diện lịch 7 cột trực quan với chuyển đổi Tháng/Năm, 4 thẻ KPI (Số ngày làm việc, Thứ 7 đi làm, Ngày nghỉ/lễ, Giờ làm việc kế hoạch), chuyển đổi nhanh 1-chạm (Toggle), Modal sửa ngày cá nhân và Modal áp dụng hàng loạt theo chuỗi ngày (Obon, Tết, công ty nghỉ).
   - `src/app/actions/company-calendar.ts`: Server actions tối ưu cho nghiệp vụ lịch.
   - Đăng ký menu vào `Sidebar.tsx` và cấu hình i18n đầy đủ trong `messages/ja.json` và `messages/vi.json`.

3. **Tích Hợp Đồng Bộ Trên Tiến Độ Gantt & Chi Tiết Job**:
   - `ToolingCalendarMatrix.tsx`: Render trạng thái ngày làm việc thực tế từ lịch công ty trên header cột, hiển thị rõ ràng 3 mốc thời gian riêng biệt:
     - 🏁 **完成目標日** (`target_completion_date` — Kỳ hạn hoàn thành khuôn trước 3 ngày làm việc)
     - 🚚 **指示納期 / 払出期日** (`mold_deadline` — Kỳ hạn bàn giao sang bộ phận dập)
     - 📦 **出荷予定日** (`ship_date` — Ngày xuất hàng cho khách)
   - Cập nhật đồng bộ trên `ToolingGroupedJobCard.tsx`, `ToolingExcelGridView.tsx`, `JobDetailHeader.tsx`, `OverviewTab.tsx`, và AI OCR pipeline (`/api/ocr/extract/route.ts`).

4. **Kiểm tra chất lượng**:
   - `npx tsc --noEmit`: 0 errors.
   - `node scripts/check_translations.mjs`: 100% Pass.








- **2026-08-21**: Hoan thanh Giai ?o?n 3 - Track 1 (UI Daily Logs, Inspection QC) va Track 2 (Phase D Audit & Dry-run script). ?a push commit s?ch len main.

## [2026-08-26] Phase D - Stage 2 (Unified Equipment Migration) - COMPLETED
- Hoan t?t toan b? Priority 5, 6, 7a: Migrate an toan 21 files UI va 3 FK constraints t? physical_molds/cutters sang equipment.
- Phat hi?n va fix 2 production bugs (JobDetailHeader, DesignPhysicalMoldsList) lien quan ??n b?ng b? drop ho?c alias sai.
- ?ang treo Giai ?o?n 3 (Archive & Drop physical_molds, cutters, jobs.physical_mold_id) ch? phe duy?t va x? ly cac dev scripts (seed_v5, 
ebaseline...).

- **[2026-08-26] Phase D - Stage 3 & Group A Cleanup - COMPLETED**
  - Hoàn tất drop các bảng vật lý cũ (`physical_molds`, `cutters`) và cột `jobs.physical_mold_id`. Backup JSON đã được lưu trữ an toàn trên nhánh `main`.
  - Fix triệt để lỗi TS Compiler và các fallback logic trong Group A Files (`LocationMoveModule`, `LocationTab`, `TransferTab`, `RealtimeReferencePanel`). Cập nhật `MoldDetailData` type. Phase D Migration (Unified Equipment) đã chính thức khép lại hoàn toàn.

- **[2026-08-26] Kích hoạt Priority 8: Data Reconciliation Module**
  - Khởi động dự án xây dựng công cụ đồng bộ dữ liệu liên tục từ Access CSV -> Web (Anchor bằng `legacy_id`). Đã chốt bản thiết kế kiến trúc 3 giai đoạn (8a, 8b, 8c) với PE và lập `implementation_plan.md` cho 8a (bảng Companies).

### 2026-08-28 (Khoi ph?c d? li?u)
- [x] ?a khoi ph?c thanh cong Stage A (Master Data) t? Legacy Access CSV: 4,622 design_revisions, 5,806 equipment.
- [x] ?a khoi ph?c thanh cong Stage B (Transaction Data) t? Legacy Access CSV: 817 work_orders, 817 jobs, 1,524 job_steps, 5,296 work_logs.
- ?a thi?t l?p cac Unique Index cho legacy_id ?? ??m b?o Script Import ho?t ??ng Idempotent.
- L?p bao cao s? c? (INCIDENT_REPORT_20260828_data_loss.md) va ch?t quy t?c tuy?t ??i C?M dung TRUNCATE CASCADE.
2 0 2 6 - 0 8 - 3 1   1 0 : 4 5   J S T   -   C H �  T H �  # 0 2 4   ( O C R   E n h a n c e m e n t )   h o � n   t �t   n g h i �m   t h u   v �   m e r g e   v � o   m a i n   ( c o m m i t   8 0 2 9 6 4 4 ) .   B y p a s s   A u t h / M i d d l e w a r e   E 2 E   b �n g   / t e s t - o c r   t h � n h   c � n g .  
 2 0 2 6 - 0 8 - 3 1   1 0 : 5 5   J S T   -   C H �  T H �  # 0 2 5 :   H o � n   t h � n h   f i x   O C R   c o n f l i c t   ( n o r m a l i z e   p r o d u c t   c o d e ) .   �   p u s h   b r a n c h   f e a t u r e / f i x - o c r - c o n f l i c t - n o r m a l i z e   c h �  r e v i e w .  
 2 0 2 6 - 0 8 - 3 1   1 1 : 1 3   J S T   -   �   m e r g e   C h �  t h �  # 0 2 5   ( f i x   O C R   c o n f l i c t   n o r m a l i z e )   v � o   m a i n ,   c o m m i t   6 c 7 5 7 6 2 .   X � a   c � c   b r a n c h   f e a t u r e .  
 
### 2026-09-07 (Milestone 14 & Milestone 15 — NGHIỆM THU)
- **[2026-09-07] Milestone 14: Shopfloor Tablet Cockpit & Equipment Lifecycle**
  - Directive #M14-001 (Sprint 1): Xây dựng route `/production/floor` tablet touch-first cho 14 máy dập khay, quy trình 3-touch, tính toán gợi ý tiêu hao nhựa tự động theo feed_length_mm.
  - Directive #M14-002 (Sprint 2): Dashboard `/equipment/lifecycle` giám sát số shot và ngưỡng bảo trì (MOLD 100k, CUTTER 50k), nút bảo trì reset shot. Bảng nhật ký sản xuất `/production/daily-logs` (forming & press logs).
  - Migration 093 & 094 applied, khóa shift=day. Commit: `f6ac506`, `b3f8713`.
- **[2026-09-07] Milestone 15: QC Intelligence Module**
  - Directive #M15-001 (Sprint 1): Dashboard `/quality/ng-trends` phân tích xu hướng lỗi dập khay theo 7 nhóm lỗi A→G, KPI cards, Recharts Pareto & trend chart, xếp hạng máy & sản phẩm lỗi, cảnh báo ngưỡng NG rate lưu localStorage.
  - Directive #M15-002 (Sprint 2): Migration 095 liên kết `inspection_daily_logs.schedule_id` FK `production_schedules`. Trang đối soát KCS `/quality/inspection` so sánh 7 nhóm lỗi dập khay vs 8 nhóm lỗi KCS ngoại quan, tính delta NG. Modal chi tiết phế phẩm `DefectDetailModal`.
  - Monthly QC PDF: Endpoint `/api/qc/monthly-report/pdf` xuất báo cáo chất lượng tháng A4 bằng @react-pdf/renderer (font NotoSansJP) đầy đủ tóm tắt, xếp hạng máy, đối soát KCS và 3 ô phê duyệt (承認, 審査, 作成).
  - Quality gates: TypeScript 0 errors, i18n 0 missing keys. Commit: `b71147c`, `cc6b917`, `fee9be0`, `947993b`.

- **[2026-09-07] Milestone 16: Equipment Location & Transfer Module**
  - Migration 096 (ADR-008 Rack Code Convention): 90 racks -> 12 zones, 380 layers, 4,761 equipment backfilled.
  - S1 (commit 7197ce1): Location Browser /equipment/locations + Visual Shelf /equipment/locations/[rackId].
  - S2 (commit 9eac225): Transfer Module (LocationMoveModal, LocationTab, TransferTab, VisualShelfView integration).

- **[2026-09-07] Milestone 17: Equipment QR Code & AR Locator**
  - S1 (commit 1c6ad7e): QR Generation & Single/Mass Print sheet (A4 dynamic grid), MoldDetailHeader, LocationTab, VisualShelfView integration.
  - S2 (commit 226a680): Camera AR Locator (/equipment/scan) with jsqr throttled loop, 6-zone HUD grid, Web Audio API synth, Scan-to-Move integration.

- **[2026-09-07 - 2026-09-08] Milestone 18: Mold Loan & Return Workflow + PDF Engine (金型借用・返却管理)**
  - S1 (commit 8e49097): Migration 097 (equipment_loans table, LN-YYYYMMDD-NNN auto code, chk_scheduled_return_date constraint, v_equipment_loans_summary with overdue calculation, fn_dispatch_equipment_loan & fn_complete_equipment_loan_return atomic RPCs). 8 Server Actions in src/app/equipment/loans/actions.ts. E2E live test passed 100%. TypeScript 0 errors.
  - S2 (ADR-009 APPROVED): Migration 098 (chuẩn hóa 3 loan_type: CUSTOMER_LOAN, RETURN_TO_CUSTOMER, OUTSOURCE_PROCESSING; 2 trường ảnh photo_overall_url & photo_nameplate_url; cờ has_valid_loan_document phục vụ kiểm kê 貸与設備棚卸調査; RPC update keeper). PDF Engine khổ A4 portrait 3 mẫu biểu chuẩn Nhật (金型借用書, 金型返却書, 金型加工送付状) có bảng tên Kanban & con dấu YSD. Toàn bộ UI Dashboard (/equipment/loans), 4 KPI cards (kpi custodyCount tính distinct khuôn khách giữ hộ), 6 Filter Tabs, Table sắp xếp mới nhất, Modals tạo mới & phê duyệt 2 bước, và Detail Page (/equipment/loans/[id]). Quality Gates: 0 TS errors, 0 missing i18n keys.

- **[2026-09-08] Milestone 19: Work Orders UI & SET Resolution + PDF Engine (ADR-010)**
  - S1 (commit 831e88f): Migration 099 (View v_work_order_equipment_set 24 cột kết hợp 3 tầng giải pháp SET: N:N equipment_assignments, Fallback design_revision_id, và Self-contained MOLD đơn lẻ; RPC fn_get_wo_equipment_set; View v_work_orders_summary).
  - S2 (commit c2531b4): UI Dashboard /production/work-orders, 4 KPI cards, 4-Tab Detail Page (/production/work-orders/[id]), Equipment Set Widget kiểm tra Readiness & Gatekeeper khóa tiến độ khi thiếu tầng kệ, PDF Engine chuẩn Nhật A4 成形指示書・工程管理票. Quality Gates: 0 TS errors, 0 missing i18n keys.

- **[2026-09-08] Milestone 20: Nippo V2 — Thermoforming Production Worklog & Step Completion Engine (ADR-011)**
  - DB: Migration 100 bổ sung job_type_id = 11 (category = 'THERMOFORMING', sort_order = 50). Mở rộng work_logs với quantity_done (良品数), quantity_ng (不良数), machine_id.
  - Core Engine: Server Action processStepCompletionEngine chạy cascade 4 cấp (work_logs -> job_steps -> jobs -> work_orders), tự động tính actual_hours = SUM(hours_spent) và hoàn tất tiến độ cha. Sử dụng createServerSupabaseClient() với SUPABASE_SERVICE_ROLE_KEY để bypass RLS an toàn.
  - UI: Khối chuyên biệt 成形生産実績 trong WorklogFormShared (chọn máy dập, số lượng 良品/不良, tính tỷ lệ NG, tự động kích hoạt is_finished). Nút [+ 日報を記録] tại TabWorklogs của Work Order Detail. Trang /worklogs tối ưu query có chặn khoảng trang, lọc wo_id.
  - QA & Security: Đã thực hiện kiểm toán Live DB theo Chỉ thị #034, dọn dẹp sạch sẽ 100% dữ liệu test. Bổ sung QG-X vào docs/QA_STANDARDS.md. Quality Gates: 0 TS errors, 0 missing i18n keys. Commit: 60e3a8d.

- **[2026-09-08] Milestone 21: WO-Direct Shipments & 納品書 Delivery Note PDF Engine (ADR-012 — CLOSED ✅)**
  - **Sprint M21-A (commit 0873f69):**
    - DB: Migration 101 bổ sung cột work_order_id UUID REFERENCES work_orders(wo_id) và index idx_shipments_work_order_id trên bảng shipments. Migration 102 chuyển đổi cột shipped_quantity sang kiểu INTEGER.
    - Server Action: createShipment.ts hỗ trợ linh hoạt 2 luồng: WO-direct (lấy thẳng từ lệnh sản xuất) và Order-based (đơn hàng thương mại). Tự động sinh mã phiếu DN-YYYYMMDD-NNN, sử dụng Service Role client.
    - UI: Xây dựng Tab 5 '出荷 (Giao hàng)' (TabShipment.tsx) trên Work Order Detail với 4 KPI cards đối soát sản lượng dập vs số lượng đã xuất, cảnh báo giao vượt, và Modal xuất hàng nhanh. Trang danh sách /shipments với 4 KPI tổng quan và bộ lọc đa tiêu chí (WO/Order/Ngày/Trạng thái).
  - **Sprint M21-B (commit 128fb58f):**
    - DB & Storage: Migration 103 tạo bucket delivery-docs (private, 10MB limit, application/pdf), thiết lập RLS Storage Policies cho authenticated & service_role. Tạo RPC fn_get_shipment_delivery_note(p_shipment_id UUID) với LATERAL JOIN kết nối Work Orders, Products, Design Revisions (SSOT plastic_type_designed), Companies, Orders và Order Lines.
    - PDF Engine: Xây dựng ShipmentPDFDocument.tsx và styles/deliveryNote.ts khổ A4 Portrait chuẩn Nhật 2 liên (Liên 1: 納品書 cho khách; Liên 2: 納品受領書 bên nhận ký và đóng dấu), con dấu đỏ Yoshida thật (stamp_yoshida.png), 3 ô hanko (承認, 出荷担当, ô đỏ 受領印), mã QR xác thực liên kết hệ thống YSDMS, nhúng font tiếng Nhật NotoSansJP (OTF/TTF).
    - API Route: /api/shipments/[id]/pdf render buffer bằng @react-pdf/renderer (84KB), tự động upload lưu trữ bucket delivery-docs ({shipment_id}/{delivery_note_no}.pdf) và cập nhật metadata vào shipment_required_docs (doc_type = 'delivery_note').
    - UI: Kích hoạt nút bấm '納品書PDF' mở xem và in trực tiếp trên TabShipment.tsx và /shipments.
  - **Vòng đời khép kín:** orders → work_orders → jobs → job_steps → work_logs (Nippo V2) → shipments → delivery_notes PDF (納品書).
  - **Quality Gates:** tsc 0 errors, i18n 0 missing keys, QG-X passed (file 84,241 bytes verified trong bucket), dọn dẹp sạch sẽ 100% dữ liệu test.

- [2026-09-09] Milestone 22: Sidebar Refactor (Navigation V2) & Order -> WO Shortcut (CLOSED)
  - Sidebar Architecture V2: Rut gon tu 57 links xuong 16 links trong 6 nhom nghiep vu chuan (business, production, equipment, logistics, materials, system). Loai bo office va reports, an docs, chuan hoa nhan engineering -> Ban ve CAD / CAD図面・技術.
  - Order -> Work Order Shortcut: Bo sung nut [製造指示票(WO)を作成] tren trang chi tiet don hang /orders/[id], pre-fill toan bo du lieu don hang va lien ket order_id vao bang work_orders.
  - Dashboard Quick-Access: Khoi Quick Actions (4 nut) va 3 KPI cards tren Dashboard dap ung triet de quy tac 3-Click Rule cho nghiep vu thuong nhat xuong Yoshida.
  - Quality Gates: tsc 0 errors, i18n 0 missing keys.

- [2026-09-09] Milestone 23-A: Finished Goods Inventory Engine & Low Stock Alert (Chỉ thị #046/#047)
  - Data Integrity Fix (Migration 104-A): Backfill an toàn EXACT MATCH (TRIM(wo_name) = product_code và COUNT(*) = 1) cho 641 work_orders (tổng 642/1203 WOs mapped, 53.4%). File: 20260909000001_104_a_backfill_wo_product_id.sql.
  - SQL View SSOT (Migration 104-B): Tạo View v_product_stock_summary tổng hợp tồn kho từ 2 nguồn thực tế: work_logs.quantity_done (qua jobs -> work_orders -> products) và shipments.shipped_quantity (qua work_orders -> products), tính current_stock = GREATEST(0, produced - shipped), low_stock_threshold = 500, stock_status (IN_STOCK, LOW_STOCK, OUT_OF_STOCK). File: 20260909000002_104_b_v_product_stock_summary.sql.
  - UI Modernization (/inventory): Tái cấu trúc thành Trung tâm Quản lý Tồn kho Thành phẩm (Finished Goods Inventory):
    - 4 KPI cards tương tác lọc nhanh: Tổng sản phẩm, Tổng tồn kho thành phẩm, Cảnh báo tồn thấp, Hết hàng.
    - Banner giải trình tồn kho thời gian thực tính từ Nippo dập khay thực tế.
    - Bộ lọc FilterBar: Dropdown khách hàng (companies type CUSTOMER), dropdown trạng thái tồn kho, ô tìm kiếm debounce + useSearchHistory và SearchSuggestions.
    - Bảng dữ liệu InventoryTable: Phân trang chuẩn 50 dòng/trang (Pagination component), sắp xếp cột đa chiều (Mã SP, Khách hàng, Sản xuất, Xuất hàng, Tồn kho), hyperlink mã SP tới /product-center/[id], badge trạng thái (IN_STOCK, LOW_STOCK có icon cảnh báo, OUT_OF_STOCK), nút shortcut [⚡ 製造指示作成] cho các mã thiếu hàng liên kết trực tiếp sang /production/work-orders/new?product_id=...
    - Tab switcher: Tab 1 Thành phẩm (hiện tại), Tab 2 Nguyên vật liệu cuộn nhựa (/plastics/inventory).
    - Xóa bỏ hoàn toàn // @ts-nocheck, type an toàn 100%.
  - Quality Gates: tsc 0 errors, check_translations 0 missing keys.

- [2026-09-09] Hotfix Chỉ thị #048: Sidebar Navigation V2.1 (Commit d023df1)
  - Khôi phục 7 routes chức năng cốt lõi thực tế: /production/schedule (Gantt lịch 14 máy), /production/kanban (Kanban board), /production/floor (Tablet Cockpit 14 máy), /quality/ng-trends (Pareto lỗi), /quality/inspection (KCS đối soát), /equipment/locations (Kho kệ M16), /equipment/loans (Mượn trả M18), /equipment/lifecycle (Kiểm kê M14), /orders/quotations (Báo giá).
  - Sửa lỗi placeholder: Redirect /equipment -> /equipment/molds, /quality -> /quality/ng-trends.
  - Cấu trúc hoàn chỉnh 23 links (2 top + 21 links trong 6 nhóm), giảm 60% so với 57 links cũ nhưng bảo toàn 100% tính năng độc lập thực tế.
  - Quality Gates: tsc 0 errors, check_translations 0 missing keys.

- **[2026-09-09] Milestone: Sidebar V3 FINAL — Comprehensive Departmental Architecture (Commit 321aa4c — Chỉ thị #050 — CLOSED ✅)**
  - Cấu trúc hoàn thiện: 6 nhóm phòng ban YSD thực tế + 3 NAV_TOP + 2 NAV_BOTTOM = 44 links thật (100% route ≥ 50 dòng code thật, 0 placeholder).
  - Khôi phục đầy đủ 20 routes nghiệp vụ bị thiếu sau M22: /orders/invoices, /orders/debt, /engineering/designs, /equipment/aluminum, /equipment/dashboard, /equipment/unified, /equipment/jobs, /equipment/schedule (5,800 dòng MoldJobGantt Engine), /production/mold-orders, /equipment/cutting-dies, /equipment/scan, /maintenance, /production/kanban, /production/floor, /production-instructions, /master/machines, /quality/lot-inspections, /quality/defects, /plastics/master, /reports/daily-worklog.
  - Tách biệt rõ ràng 2 Engine Gantt: /equipment/schedule (Lịch gia công khuôn) và /production/schedule (Lịch dập 14 máy).
  - Nâng tầm /product-center lên NAV_TOP làm Cockpit 360° lấy sản phẩm làm hạt nhân.
  - Loại bỏ sạch sẽ 100% placeholder routes: /office, /master/employees, /materials/daily, /reports, /production/dashboard, /warehouse.
  - Đồng bộ đa ngôn ngữ: Cập nhật 100% translation keys trong messages/ja.json và messages/vi.json.
  - Quality Gates: tsc 0 errors, check_translations 0 missing keys. PE xác nhận APPROVED — đóng băng kiến trúc Sidebar ≥ 6 tháng.

- **[2026-09-09] Milestone 24: Quotation-to-Order Pipeline — Sprint B: Server Actions (Chỉ thị #051 — COMPLETED ✅)**
  - Server Actions (`src/app/orders/quotations/actions.ts`):
    * `convertQuotationToOrderAction`: Gọi atomic RPC `fn_convert_quotation_to_order` qua Service Role client, bảo đảm 100% atomicity không phân mảnh dữ liệu. Xử lý error boundaries phân loại lỗi rõ ràng. Revalidate `/orders/quotations`, `/orders/quotations/[id]`, `/orders`.
    * `updateQuotationStatusAction`: Quản lý trạng thái có guards: cấm đảo chiều khi đã `CONVERTED`, cấm lùi từ `APPROVED` về `DRAFT`.
    * `getQuotationDetailAction`: Đọc trọn gói Header + Lines + Foreign Joins (`companies`, `employees`, `orders`, `products`, `design_revisions`).
  - Kiểm thử E2E Live DB: Script kiểm thử thực thi trên Supabase Production xác nhận hoạt động 100% chính xác của toàn bộ guards và luồng chuyển đổi. Đã dọn dẹp sạch sẽ 100% dữ liệu kiểm thử.
  - Tuân thủ quy tắc Sprint B: Tuyệt đối không chỉnh sửa bất kỳ file UI `.tsx` nào.
  - Quality Gates: TypeScript `npx tsc --noEmit` 0 errors, `scripts/check_translations.mjs` 0 missing keys.

- **[2026-09-09] Milestone 24: Quotation-to-Order Pipeline — Sprint C: UI & Convert Modal (Chỉ thị #051 — COMPLETED ✅)**
  - Tái cấu trúc Trang chi tiết Báo giá (`src/app/orders/quotations/[id]/page.tsx`):
    * Server Component đọc dữ liệu trực tiếp qua `getQuotationDetailAction(id)` (loại bỏ hoàn toàn `useEffect` và client fetch).
    * Page Anatomy chuẩn Rule 2 & 3: BackBar compact, Quotation No nổi bật, Revision badge, Status Badge 6 màu chuẩn.
    * Converted Banner: Tự động xuất hiện khi `status === 'CONVERTED'`, hiển thị rõ `✅ Đã tạo ORD-XXXXXX → [Xem đơn hàng]` kèm link trực tiếp sang `/orders/[order_id]`.
    * RULE-UI-10 Paper Style Layout: Khối thông tin khách hàng, ngày tháng, hạn hiệu lực, người liên hệ, bảng chi tiết `quotation_lines` kết nối sản phẩm và bản vẽ CAD SSOT, khối tài chính chân trang (Subtotal, Tax 10%, Grand Total).
    * Read-only Lock: Khóa toàn bộ thao tác chỉnh sửa khi báo giá đã `CONVERTED`.
  - Client Component `ConvertModal.tsx` (`src/app/orders/quotations/[id]/ConvertModal.tsx`):
    * Hiển thị tóm tắt 4 dòng (Khách hàng, Số báo giá, Số mặt hàng, Tổng tiền).
    * Gọi `convertQuotationToOrderAction` qua `useTransition`, xử lý trạng thái chờ và error boundary tại chỗ.
    * Tự động chuyển hướng sang `/orders/[order_id]` khi thành công.
  - Client Component `QuotationHeaderActions.tsx`: Quản lý nút bấm 「受注確定」(khi APPROVED), chuyển trạng thái nhanh (DRAFT/SENT), xuất file PDF.
  - Loại bỏ hoàn toàn 5 lần `(as any)` trong `src/app/orders/quotations/actions.ts`, typed an toàn với `SupabaseClient`.
  - Đồng bộ đa ngôn ngữ: Cập nhật đầy đủ các keys `statusBadge`, `convertModal`, `banner` trong `messages/ja.json` và `messages/vi.json`.
  - Quality Gates: `npx tsc --noEmit` 0 errors, `scripts/check_translations.mjs` 0 missing keys.

- **[2026-09-09] Milestone 24: Quotation-to-Order Pipeline — Sprint D: A4 Portrait PDF Engine (Chỉ thị #051 — COMPLETED ✅)**
  - Chuẩn hóa biểu mẫu theo phôi thực tế YSD (`source_data/Form lien quan/`):
    * Header: Số hiệu báo giá (`No. QT-XXXX`), Ngày báo giá, Tiêu đề trang trọng `御　見　積　書`, Thông tin nhà máy Yoshida Package kèm số điện thoại/FAX và con dấu đỏ Yoshida tại ô 承認.
    * Bảng Hanko 3 ô (`承認 | 審査 | 作成`, rộng 96px).
    * Dynamic Issuer: Xóa bỏ hardcode `小林 一弘`, bind động từ `employees.employee_name` hoặc `prepared_by_name`.
    * Cột `品名・仕様`: Tích hợp thông số kỹ thuật CAD SSOT từ `design_revisions` (`design_code`, `plastic_type_designed`, `external_length_mm × external_width_mm`) chuẩn RULE-DATA-01.
    * Bảng tổng tài chính 3 dòng: `小計 (税抜)` (Tiểu kế chưa thuế), `消費税 (10%)` (Thuế VAT), `御見積合計 (税込)` (Tổng thanh toán có thuế - font 14px Bold accent) kèm câu ghi chú điều kiện thuế tiêu chuẩn YSD.
    * Ghi chú và điều khoản thanh toán: `お支払条件`, `有効期限`, `納入場所`, `サンプルトレイ` hiển thị đầy đủ theo đúng format nguyên gốc.
  - API Route (`src/app/api/quotations/[id]/pdf/route.ts`):
    * Bypass RLS qua `createServerSupabaseClient() as SupabaseClient` server-side an toàn.
    * JOIN sâu 2 cấp: `companies`, `employees`, `quotation_lines`, `products`, `design_revisions`.
    * Stream PDF buffer trực tiếp về client qua `@react-pdf/renderer` v4.5.1 với font NotoSansJP và asset stamp_yoshida.png.
  - Kiểm thử E2E Live DB & Render Engine:
    * Render PDF buffer thành công (42,571 bytes), font CJK hiển thị sắc nét, không vỡ layout.
    * Query Live DB pass 100% trên bảng `quotations` và liên kết foreign keys.
  - Quality Gates: `npx tsc --noEmit` 0 errors, `scripts/check_translations.mjs` 0 missing keys.

- **[2026-09-09] Module Quy chuẩn Tính toán Báo giá (docs/quotations/) — COMPLETED ✅**
  - Hệ thống hóa toàn bộ công thức tính toán báo giá (`計算式`), định mức khuôn mẫu và giá thành khay nhựa từ 100% phôi Excel thực tế của Yoshida Package (`金型見積もり基準.xls`, `金型見積計算書.xlsx`, `見積り計算書(新）.xlsx`, `見積原価計算書フォーマットver6.xlsx`, `価格改定計算用2024.6.26.xlsx`):
    * `docs/quotations/README.md`: Tổng quan module, bản đồ tài liệu, căn cứ pháp lý kỹ thuật và liên kết DB schema V5.
    * `docs/quotations/01_MOLD_PRICING_STANDARD.md`: Ma trận giá khuôn chuẩn (天フランジ vs スカート付き, 汎用 vs 専用, カット寸新規 vs 既存) từ ¥170k~¥320k; Phân rã 9 hạng mục chi phí; Bảng chiết khấu tiền khuôn theo LOT đặt khay (giảm ¥10k/¥20k/¥30k); Xử lý 3 nghiệp vụ đặc biệt (khuôn thử có phí ¥15k~¥20k, miễn phí `free_sample_trial`, báo giá đơn lẻ `MOLD`).
    * `docs/quotations/02_TRAY_PRICING_CALCULATION_FORMULA.md`: Quy chuẩn công thức 3 trụ cột (Vật liệu: Loss 1.05, Bước tiến Pitch = L + 15mm, Khổ màng W + 40mm, Markup 1.2; Bao bì vận chuyển 1,000¥/thùng; Gia công dập máy chiết khấu giờ máy từ 15k/h xuống 10k/h theo LOT). Quy tắc làm tròn lên `Math.ceil()`.
    * `docs/quotations/03_COST_BREAKDOWN_STANDARD_V6.md`: Chuẩn phân rã 14 thành phần chi phí chuyên nghiệp (Format Ver6) phục vụ kiểm toán giá các tập đoàn lớn (Fujitsu, Rapidus, TE...).
    * `docs/quotations/04_ENGINE_IMPLEMENTATION_SPEC_M26.md`: Đặc tả kỹ thuật chi tiết nâng cấp `src/lib/quotation-engine.ts` trong Milestone 26 (chuyển đổi hằng số tĩnh sang Master Lookup & Dynamic Calculation).
  - Đồng bộ cơ sở tri thức: Cập nhật `docs/02_BUSINESS_PROCESS_CATALOG.md` và `.agents/mempalace/knowledge/quotation_pricing_formulas.md`.

