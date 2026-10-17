# 📐 YSDMS NextGen — Quy Chuẩn Giao Diện, Truy Vấn Dữ Liệu & Nghiệp Vụ Đặc Thù (`RULES_UI_AND_DATA.md`)

> **Tài liệu Chuẩn Hóa Cổng 2 (`WO-CONTEXT-PALACE`)** — Hợp nhất nguyên vẹn từ `AGENTS.md` (Mục 3) và `AI_SYSTEM_RULES.md`.
> **Khi nào đọc:** Bắt buộc đọc trước khi thi công UI/UX, trang danh sách/chi tiết, dropdown tìm kiếm, hoặc logic sản phẩm/dao cắt.

---

## 1. Kiến Trúc Route, Giải Phẫu Trang & Điều Hướng (UI/UX Conventions)

### 1.1. Routing & Sidebar
- Mọi route có sidebar nằm trực tiếp dưới `src/app/` (cùng cấp `/dashboard`, `/cases`, `/orders`, `/equipment`…), không tạo route group `(main)`.
- Khi thêm route mới (đã được duyệt), đăng ký vào `src/components/layout/Sidebar.tsx`.
- Quy ước đặt tên: `page.tsx` (Server ưu tiên hoặc Client), `actions.ts`, `types.ts`, và thư mục `_components/` (`XxxTable.tsx`, `XxxForm.tsx`, `XxxHeader.tsx`, `XxxTabs.tsx`).

### 1.2. Giải Phẫu Trang Danh Sách (List Page)
1. **Bố cục 3 lớp dọc** (`display: flex; flex-direction: column; height: 100%; gap: 12px`):
   - `PageHeader` (`flexShrink: 0`) $\rightarrow$ `FilterBar / TabBar` (`flexShrink: 0`) $\rightarrow$ `Content Area` (`flex: 1, overflow: auto` chứa `card-flat` + `data-table` + `<Pagination />`).
2. **Cột chính — Hyperlink:** Mã code hoặc tên chính BẮT BUỘC dùng `<Link href="/path/[id]">` (`color: var(--accent)`, `fontWeight: 700`, `fontFamily: monospace`, `fontSize: 13`).
3. **Tìm kiếm & Phân trang:** `PAGE_SIZE = 50` với `.range(from, to)` + `{ count: 'exact' }`, debounce `300-500ms`, đồng bộ `?search=` trên URL (`useSearchParams`), lưu lịch sử bằng `useSearchHistory` + `<SearchSuggestions>`.
4. **Sắp xếp bảng (Table Sorting):** Bắt buộc hỗ trợ sort trên header cột kèm icon (`ArrowUp`/`ArrowDown`/`ArrowUpDown`). Mặc định mọi bảng sắp xếp **TỪ MỚI ĐẾN CŨ (`DESC`)**, kể cả `first_shipment_date`.

### 1.3. Giải Phẫu Trang Chi Tiết (Detail Page)
1. **Header compact:** `padding: '12px 16px'`, icon `20px`, title `18px`, chiếm tối đa 25% chiều cao viewport.
2. **Điều hướng bắt buộc:** 2 nút điều hướng cùng hàng bên trái Header: `← 戻る` (`router.back()`) và `↑ 一覧` (`<Link>` về trang danh sách cha), kèm thanh liên kết luồng công việc (`Workflow Links`).
3. **Detail Layout (`RULE-UI-5`):** `.detail-layout > .detail-panel-left (240px) + .detail-panel-right (flex-1)`; Tabs: `.tab-nav > .tab-item` + `.tab-item--active`; nền dùng `var(--bg-surface)` (`#FFFFFF`) trên `var(--bg-page)` (`#ECEEF1`).

---

## 2. Truy Vấn Dữ Liệu, Schema SSOT & Hiệu Năng (`RULE-DATA-01/02` & `RULE-DATA-1..6`)

- **`[RULE-DATA-01]` Không Fallback Kỹ Thuật:** `cutline_length/width` (`design_revisions` qua `getCutlineSpecs`) $\neq$ kích thước vật lý (`equipment.actual_*_mm` / `cutter_*_mm`). Cấm regex parse text runtime (`product_description`, `display_name`, `tray_info`) để suy diễn cutline/corner R/chamfer C; trống hiển thị `"—"`.
- **`[RULE-DATA-02]` Xác Minh DB Thực Tế & Khóa/Cột Chuẩn V3:**
  - Kiểm chứng `information_schema.tables/columns` kèm `NOW()` và `docs/dossier/M01..M12/schema.md` trước khi viết query.
  - **SSOT:** Nhựa & cutline từ `design_revisions` (`plastic_type_designed`, không lấy `products.primary_plastic_code`); thiết bị từ `equipment` & `equipment_assignments` (`SET_MEMBER`, `SHARED`).
  - **Bảng `NOT_FOUND` (cấm truy vấn):** `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`.
  - **Bảng `EXISTS` nhưng CẤM DÙNG trong code mới (không gọi là đã DROP):** `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.
  - **Khóa & Cột chuẩn V3:** `orders.company_id -> companies.company_id` (không dùng `customer_id`); `orders.order_id`, `products.product_id`, `order_lines.line_id`; `products.product_name`, `product_name_internal`, `product_code`, `product_status` (không dùng `status` hay `product_name_ja`).
- **`[RULE-DATA-1]` Pagination bắt buộc:** Không bao giờ dùng `.select('*')` không giới hạn cho bảng $> 100$ dòng. Luôn chỉ định cột cụ thể, dùng `.range(from, to)` + `{ count: 'exact' }` (`PAGE_SIZE = 50`) và render `@/components/ui/Pagination`.
- **`[RULE-DATA-2]` Server-side search:** Lọc trên server qua `.ilike()` hoặc `.textSearch()`. Không tải toàn bộ về `.filter()` trên JS.
- **`[RULE-DATA-3]` Default Filter + Toggle Chip:** Trang có ngữ cảnh rõ (VD: `/master/customers` mặc định `company_type.cs.{CUSTOMER}`) phải hiện Filter Chip `[Khách hàng ×]` để người dùng chủ động bật/tắt.
- **`[RULE-DATA-4]` Tìm kiếm Mã Rút gọn (Fuzzy Code Search):** Mọi ô tìm mã (`product_code`, `system_code`, `equipment_code`, `cutter_no`) phải hỗ trợ gõ liền bỏ dấu gạch ngang/khoảng trắng (VD: gõ `jae312` $\rightarrow$ SQL ILIKE `%jae%312%` khớp `JAE-312`).
- **`[RULE-DATA-5]` & `[RULE-DATA-6]` Smart Async Dropdown:**
  - Nguồn $< 50$ bản ghi: dùng `SearchableSelect` (`static`).
  - Nguồn $> 50$ bản ghi (`companies`, `products`, `employees`): BẮT BUỘC dùng `AsyncSearchableSelect` (debounce `300ms`, gọi `/api/search/[entity]?q=...&limit=20`, trả về `{ data: [{value, label}], total }`).

---

## 3. Hệ Thống Thiết Kế CSS & Đa Ngôn Ngữ (`RULE-UI-1` .. `RULE-UI-10`)

- **`[RULE-UI-1]` & `[RULE-UI-3]` CSS Variables & Teal Accent (`src/app/globals.css`):**
  - Chỉ dùng biến CSS (`var(--accent)`, `var(--text-primary)` `#0F172A`, `var(--bg-surface-2)`, `var(--status-info-bg)`…) và classes (`card-flat`, `data-table`, `form-input`, `btn-primary`, `badge badge--success/warning/error/info/neutral`).
  - **Cấm dùng:** Tailwind color classes (`bg-blue-500`, `text-red-600`, `bg-white`…), hardcode mã màu tùy tiện, hoặc tạo file `.module.css` riêng.
- **`[RULE-UI-2]` & `[RULE-UI-4]` Form & Chips:**
  - Cấu trúc Form: `.form-section > .form-section-header + .form-section-body > .form-grid-{1|2|3} > .form-field > .form-label + .form-input` (header uppercase `10px`, icon `lucide-react` `14x14`, không emoji).
  - Multi-select chips: dùng `.type-chip` và `.type-chip--active`.
- **`[RULE-UI-6]` .. `[RULE-UI-9]` Responsive, Mật Độ & Kiểm Tra TypeScript:**
  - Breakpoints đã xử lý trong `globals.css` (`<640px` 1 cột; `640-1024px` 2 cột; `>1400px` 4 cột).
  - Compact density: Header `48px`, Table row padding `6px 10px`, Input height `36px`.
  - Font size: Body/Input/Btn `14px`; Table cell `13px` (`monospace` cho mã/kích thước); Label `12px`; Table header/Section header `11px CAPS`.
  - Khi ổ C đầy (ENOSPC): chạy `node ".\node_modules\typescript\bin\tsc" --noEmit` thay cho `npx tsc --noEmit`.
- **`[RULE-UI-10]` Paper Style Spec Layout (Bố cục Thông số Kỹ thuật kiểu Trang giấy):**
  - Áp dụng cho mọi grid hiển thị thông số kỹ thuật read-only (`SpecCell` và `InfoRow`):
  - **Không padding (`0`), không border, không background** (ngoại trừ diff highlight `var(--tint-orange-bg)`), **không dùng dấu `:`**.
  - Grid container `gap: '2px 12px'`; Label `10px`, `fontWeight: 600`, `#64748B`, `minWidth: 78px`, `flexShrink: 0`; Value `13px`, `fontWeight: 700`, `#0F172A` (`monospace` cho số/kích thước; trống hiển thị `'—'` màu `#94A3B8`).
  - Không áp dụng Paper Style cho `data-table`, form nhập liệu, hoặc KPI cards.
- **Đa Ngôn Ngữ (`next-intl`):**
  - Cấm hardcode song ngữ tĩnh (`JA / VI`) hoặc class `.ja`/`.vi`. Khai báo đủ keys trong `messages/ja.json` và `messages/vi.json`, dùng `useTranslations('Namespace')`.
  - Kiểm chứng bắt buộc: `node scripts/check_translations.mjs` (0 missing keys).

---

## 4. Quy Tắc Nghiệp Vụ Sản Xuất & Môi Trường (`RULE-BIZ-*`)

### 4.1. `[RULE-BIZ-CUTTER]` Phân Loại Dao Cắt (`CUTTER_INLINE` vs `CUTTER_SEPARATE`)
1. **Mặc định là In-Line (`CUTTER_INLINE`):** Lắp trực tiếp trên máy định hình nhiệt (ILLIG, Asano) cùng khuôn, đế nước, khung. Khi mục **`別抜き`** = **`無`** $\rightarrow$ `equipment_type = 'CUTTER_INLINE'`, `design_revisions.has_separate_cutter = false`.
2. **Dao cắt dập rời (`CUTTER_SEPARATE` / 別抜型):** Chỉ khi mục **`別抜き`** = **`有`** (chuyển sang máy dập riêng + QC kiểm tra `別抜き検査`) $\rightarrow$ `equipment_type = 'CUTTER_SEPARATE'`, `design_revisions.has_separate_cutter = true`.

### 4.2. `[RULE-BIZ-NAME]` 5 Trường Tên Sản Phẩm Trong Bảng `public.products`
1. `product_description`: Mô tả làm việc / Tên ban đầu trên phiếu 工程票 (luôn có dữ liệu ngay từ đầu).
2. `product_name`: Tên chính thức trên chứng từ/hóa đơn khách hàng (có thể `NULL` lúc đầu).
3. `product_name_internal`: Mã nội bộ YSD có dấu gạch ngang (VD: `ADY-071`, `TOW-009`).
4. `product_code`: Mã nội bộ YSD compact bỏ dấu gạch ngang (`UNIQUE`, VD: `ADY071`, `TOW009`).
5. `customer_product_name`: Tên hoặc mã part phía khách hàng gọi (VD: `PART-8802-A`).

### 4.3. Môi Trường Local SSD Workspace & Dọn Rác
- Không hardcode đường dẫn ổ đĩa tuyệt đối (`C:\`, `G:\`) trong mã nguồn ứng dụng; luôn dùng đường dẫn tương đối hoặc biến môi trường.
- Mọi script nháp/debug tạm thời phải đặt trong `temp_ai/` (hoặc `<artifactDir>/scratch/`), tuyệt đối không xả ra thư mục gốc của repo.
- Cấu hình build: `"dev": "next dev --turbo"` (dùng Turbopack khi dev trên SSD), `"build": "next build"` (dùng Webpack ổn định khi build).
