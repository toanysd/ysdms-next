# AGENTS.md — Quy tắc bắt buộc cho AI Agent
# YSDMS NextGen / ysdms-nextgen

> 🚀 **Dự án này đã được tích hợp quy trình Virtual Software Company (Global Plugin).**
> Người dùng có thể yêu cầu: *"Hãy sử dụng `agile_flow` skill để thiết kế và phát triển..."* để kích hoạt quy trình tự động đa tác nhân (PM, Architect, UI/UX, Dev, QA, Knowledge Manager).

> Antigravity tự động nạp file này khi làm việc với project.
> Đọc file này TRƯỚC KHI làm bất kỳ việc gì.
---

## 🔒 QUY TẮC 0 — Xác nhận Áp dụng Luật (BẮT BUỘC — KHÔNG NGOẠI LỆ)

- **MỌI câu trả lời** PHẢI bắt đầu bằng: `TRẢ LỜI TỪ AN`
- **MỌI câu trả lời** PHẢI kết thúc bằng: `TRẢ LỜI TỪ AN`
- Nếu KHÔNG có dòng này → AI chưa nạp luật → Người dùng nhắc nhở ngay
- Áp dụng cho TẤT CẢ model (Gemini, Claude, bất kỳ model nào)
- **QUY TẮC GIT VÀ CẬP NHẬT GITHUB**: 
  - **MÃ NGUỒN (Code/UI/Logic):** KHÔNG tự động git push mã nguồn trừ khi có YÊU CẦU TRỰC TIẾP từ người dùng.
  - **TÀI LIỆU (Docs/Reports/Plans):** **BẮT BUỘC TỰ ĐỘNG `git add`, `git commit`, `git push`** mọi kết quả phân tích, bản kế hoạch (implementation_plan.md), báo cáo dry-run, ADR, và các file cần thảo luận lên GitHub ngay lập tức để hệ thống PE cùng đọc và phân tích chéo.
  - **Giới hạn file:** Không đẩy các file dung lượng lớn, các file dạng nén (.rar, .zip, .tar), các thư mục cài đặt (`node_modules`, `.next`).
- **Lưu ý:** Chỉ khi nào có yêu cầu mới thực hiện đẩy lên github. 
  - **Giới hạn file:** Không đẩy các file dung lượng lớn, các file dạng nén (.rar, .zip, .tar), các thư mục cài đặt (`node_modules`, `.next`). Chỉ đẩy các file mã nguồn phục vụ hoạt động web.

---

## 🛡️ QUY TẮC 0.5 — Chống Bịa Kết Quả (BẮT BUỘC — MỌI MODEL, MỌI THỜI ĐIỂM)

### Nguyên tắc cốt lõi: KHÔNG BỊA, KHÔNG ĐOÁN, KHÔNG TỰ Ý

**A. DỮ LIỆU PHẢI CÓ NGUỒN**
- Mọi thông tin về schema, tên cột, tên bảng → PHẢI đọc file thực trước (`SCHEMA_REFERENCE.md`, `docs/technical/02_data_model.md`, hoặc migration file)
- Mọi thông tin về nghiệp vụ → PHẢI đọc `docs/technical/01_business_process.md` hoặc `business_docs/`
- Mọi thông tin về cấu trúc front-end → PHẢI đọc file thực trong `src/app/`
- **KHÔNG** dùng "kiến thức" từ training data hoặc phiên trước mà không verify lại bằng file

**B. KHI KHÔNG CHẮC CHẮN → HỎI NGƯỜI DÙNG**
- Nếu tên cột/bảng không rõ → ĐỌC FILE TRƯỚC. Nếu vẫn không rõ → HỎI.
- Nếu yêu cầu mơ hồ → HỎI LẠI, liệt kê các cách hiểu có thể
- Nếu có xung đột giữa các nguồn → BÁO CHO NGƯỜI DÙNG, kèm trích dẫn 2 nguồn
- **TUYỆT ĐỐI KHÔNG** tự quyết định khi có nhiều cách hiểu

**C. KHI TẠO/SỬA TÀI LIỆU KỸ THUẬT**
- Mọi tên bảng, tên cột, FK, enum → PHẢI verify bằng cách đọc DB schema thực
- Mọi thông số máy, kích thước, model → PHẢI có nguồn (file nào, dòng nào)
- Nếu cần thêm thông tin mới chưa có trong file → ghi rõ `⚠️ CẦN XÁC NHẬN` và HỎI NGƯỜI DÙNG
- **KHÔNG** tự tạo dữ liệu mẫu rồi ghi vào tài liệu như thật
- **BẮT BUỘC**: Luôn cập nhật hồ sơ kỹ thuật (chỉ ra đúng tên file, VD: `SCHEMA_REFERENCE.md`, `01_business_process.md`) mỗi khi có sự cập nhật thông tin thiết kế hoặc schema. Đồng thời lưu lại lịch sử thay đổi của hồ sơ vào Sổ cái dự án.

**D. KHI VIẾT CODE**
- Query DB: PHẢI đọc schema trước. KHÔNG dùng tên cột từ "trí nhớ"
- Tạo migration: PHẢI đọc migration cuối cùng trước. KHÔNG tạo cột đã tồn tại
- Import data: PHẢI đọc CSV header thực. KHÔNG đoán tên cột
- **SAU KHI VIẾT**: Chạy `npx tsc --noEmit` để verify. Không báo "xong" khi chưa test

**E. CẤM HÀNH VI CỤ THỂ**
- ❌ Tự đặt tên cột/bảng rồi viết code sử dụng chúng mà không tạo migration
- ❌ Viết "đã verify" hoặc "đã kiểm tra" khi chưa thực sự đọc file
- ❌ Tự thay đổi cấu trúc dữ liệu (schema, FK, column names) mà không hỏi user
- ❌ Suy luận nghiệp vụ từ tên biến/bảng thay vì đọc tài liệu
- ❌ Bỏ qua lỗi TypeScript và báo "hoàn thành"
- ❌ Tự tạo bảng DB mới mà không có trong `docs/technical/02_data_model.md`

## 📒 SỔ CÁI DỰ ÁN — Nguồn kiến thức chính

- **Vị trí:** `d:\AntiGravity_Workspace\.agents\mempalace\blueprints\ysdms-nextgen_MASTER.md`
- **Khi bắt đầu phiên:** Đọc MỤC LỤC (30 dòng đầu) → đọc mục liên quan
- **Khi kết thúc tác vụ:** APPEND kết quả vào mục tương ứng (KHÔNG ghi đè)
- **Nếu file > 5KB:** Giao Gemini subagent đọc trước, tóm tắt cho Claude

---

## 📋 QUY TẮC LƯU TRỮ IMPLEMENTATION PLAN (BẮT BUỘC)

Mỗi Implementation Plan được phê duyệt là tài liệu kỹ thuật quan trọng, phải được bảo tồn lâu dài.

### Cơ chế Dual-Write:
1. **File hoạt động** (`<artifactDir>/implementation_plan.md`): Antigravity sử dụng file này làm bản đang xử lý. Có thể bị ghi đè khi tạo plan mới — đây là bình thường.
2. **File lưu trữ** (`<artifactDir>/implementation_plans/`): Mỗi khi tạo hoặc cập nhật plan, **BẮT BUỘC** sao lưu một bản vào thư mục này với tên:
   ```
   YYYY-MM-DD_HHMM_short-description.md
   ```
   Ví dụ: `2026-08-18_0840_schedule-filter-and-separate-equipment-jobs.md`

### Quy trình:
- **Khi tạo plan mới:** Viết vào `implementation_plan.md` → Copy vào `implementation_plans/` với tên có timestamp.
- **Khi cập nhật plan đã có:** Ghi đè `implementation_plan.md` → Copy bản mới vào `implementation_plans/` (bản cũ vẫn giữ nguyên).
- **KHÔNG xóa** các file trong `implementation_plans/` — đây là lịch sử quyết định dự án.

---

## 📚 QUY TẮC QUẢN LÝ KIẾN THỨC & ADR (BẮT BUỘC)

### A. Architecture Decision Records (ADR)
- **Vị trí:** `docs/adr/` — Mỗi quyết định kiến trúc/nghiệp vụ quan trọng được lưu dưới dạng file riêng.
- **Đặt tên:** `ADR-NNN_short-description.md` (VD: `ADR-003_separate-equipment-jobs.md`)
- **Khi nào tạo ADR:** Mỗi khi có quyết định thiết kế quan trọng được người dùng phê duyệt (schema mới, đổi kiến trúc, quy tắc nghiệp vụ mới).
- **Nội dung bắt buộc:** Bối cảnh, Quyết định, Tương thích ngược, Hệ quả.
- **Cập nhật `docs/adr/README.md`** sau mỗi ADR mới.

### B. Cập nhật Hồ sơ Kỹ thuật Sau Mỗi Tác vụ (BẮT BUỘC)
Sau mỗi tác vụ hoàn thành có thay đổi kiến trúc/nghiệp vụ, AI agent **PHẢI** cập nhật các file tương ứng:

| Loại thay đổi | File cần cập nhật |
|---|---|
| Schema DB (bảng/cột mới, FK) | `SCHEMA_REFERENCE.md`, `docs/technical/02_data_model.md` |
| Quy tắc nghiệp vụ mới | `.agents/mempalace/knowledge/` (file tương ứng hoặc tạo mới) |
| Quyết định kiến trúc | `docs/adr/ADR-NNN_xxx.md` + `docs/adr/README.md` |
| Luồng xử lý mới (actions) | `docs/technical/01_business_process.md` |
| UI/Route mới | `AGENTS.md` mục "Cấu trúc src/app" |
| Tiến độ phiên | `SESSION_HANDOFF.md` (APPEND, không ghi đè toàn bộ) |
| Tổng hợp milestone | `ysdms-nextgen_MASTER.md` (APPEND vào section tương ứng) |

### C. Nguyên tắc Chống Trùng lặp Mô tả
- **Mỗi khái niệm nghiệp vụ chỉ được định nghĩa TẠI 1 NƠI** (Single Source of Truth).
- Khi cần tham chiếu → link đến file gốc, KHÔNG copy-paste nội dung.
- Nếu phát hiện cùng 1 quy tắc được mô tả ở nhiều nơi → hợp nhất về file chính, các file khác chỉ link.
- **Bảng tra cứu nhanh:**

| Chủ đề | File SSOT |
|---|---|
| Kiến trúc Job/WO/Equipment | `docs/adr/ADR-002_work-order-option-c.md` + `knowledge/architecture_work_order_model_v1.md` |
| Quy tắc đặt tên thiết bị | `docs/technical/07_equipment_matching_and_naming_rules.md` |
| Quy trình gia công khuôn | `knowledge/mold_manufacturing_process.md` |
| Phân cấp thiết bị SET | `knowledge/thermoforming_equipment_set.md` |
| Mapping dữ liệu Excel | `knowledge/data_mapping.md` |
| Quy tắc trạng thái đơn hàng | `knowledge/business_rules.md` |

---

## 🚫 CẤM ĐỌC — Thư mục bị loại trừ

Các thư mục sau chứa code **không còn hiệu lực** hoặc quá lớn — **KHÔNG ĐỌC**:

- `supabase/migrations/archived/` — Schema cũ đã bị overwrite, gây nhầm lẫn
- `node_modules/` — Dependencies, không liên quan đến logic
- `.next/` — Build artifacts
- `.agents/` (thư mục con) — Subagent workspace cũ, không liên quan
- `temp_ai/` — File tạm thời
- `src20260502_1216.rar` — Backup cũ

---

## 📖 ĐỌC TRƯỚC — Nguồn thông tin tin cậy

Khi cần hiểu dự án, đọc theo thứ tự này:

1. **`d:\AntiGravity_Workspace\.agents\mempalace\blueprints\SESSION_HANDOFF.md`** — 🧠 Memory Bank: Briefing phiên hiện tại (ĐỌC ĐẦU TIÊN khi chuyển model hoặc bắt đầu phiên mới)
2. **`SCHEMA_REFERENCE.md`** — Schema DB hiện tại (bắt buộc trước khi viết query)
3. **`AI_SYSTEM_RULES.md`** — Quy tắc coding, performance, folder structure
4. **`PROJECT.md`** — Tổng quan dự án
5. **`src/app/globals.css`** — Design tokens (trước khi viết UI)
6. Chỉ đọc file migration **trong `supabase/migrations/`** (không phải `archived/`)
7. **`d:\AntiGravity_Workspace\.agents\mempalace\knowledge\`** — Quy tắc nghiệp vụ, data mapping (khi cần tra cứu chi tiết)

---

## 🔑 Quy tắc Database (BẮT BUỘC)

### Schema hiện tại — Quan hệ chính

```
orders.company_id → companies   ✅  (KHÔNG phải customer_id → customers)
products.product_name            ✅  (KHÔNG phải product_name_ja)
products.product_status          ✅  (KHÔNG phải status)
products.company_id              ✅  (NOT NULL — bắt buộc)
shipments → orders → companies  ✅  (join 2 cấp)
```

### ⛔ Bảng `mold_masters` — DEPRECATED

> **KHÔNG SỬ DỤNG** trong code MỚI. Tray = MoldMaster = Products.  
> Bảng giữ lại cho backward compat (32 files UI cũ). Sẽ refactor Phase 2.

```typescript
// ❌ KHÔNG viết code mới dùng mold_masters
supabase.from('mold_masters').select(...)

// ✅ Dùng products trực tiếp
supabase.from('products').select('*, design_revisions(...)')
```

### 🔑 Bảng `equipment` — Unified Equipment Entity (BẮT BUỘC)

> ✅ **Bảng `equipment` là nguồn dữ liệu sự thật duy nhất (Single Source of Truth)** cho mọi loại thiết bị (Khuôn `MOLD`, Dao cắt `CUTTER_SEPARATE`/`CUTTER_INLINE`, Đế nước `WATER_BASE`, Đế khí `PRESSURE_BASE`, Khung `FRAME`, Stacking `STACKING`, Plug `PLUG`).
> - `physical_molds` & `cutters`: **DEPRECATED** — Không dùng cho code mới.
> - `equipment_assignments`: Quản lý quan hệ N:N (Set gá lắp `SET_MEMBER` & Dùng chung `SHARED`).

```typescript
// ❌ KHÔNG viết code mới dùng cutters hoặc physical_molds
supabase.from('cutters').select(...)
supabase.from('physical_molds').select(...)

// ✅ Dùng equipment trực tiếp
supabase.from('equipment').select('*').in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])
supabase.from('equipment').select('*').eq('equipment_type', 'MOLD')
```

### Bảng `products` — Quy ước cột

```
product_code          = Mã nội bộ YSD compact (ADY071, bỏ gạch ngang)
product_name_internal = Tên nội bộ YSD hiển thị (ADY-071, giữ gạch ngang)
product_name          = Tên SP chính thức từ KH (dùng cho hóa đơn, ban đầu NULL)
company_pn            = ⚠️ DEPRECATED — không dùng trong code mới
notes                 = Ghi chú / tạm chứa mô tả SP (Phase 2: product_description)
```

### Query mẫu ĐÚNG

```typescript
// Đơn hàng
supabase.from('orders').select('*, companies(company_name, company_code)')

// Sản phẩm
supabase.from('products').select('*, companies(company_name, company_code)')

// Giao hàng
supabase.from('shipments').select('*, orders(order_no, companies(company_name))')

// Filter
.eq('company_id', id)          // ✅ trên orders
.insert({ company_id: '...' }) // ✅ khi tạo order
```

### SAI thường gặp → gây lỗi 400

```typescript
// ❌ SAI — cột đã đổi tên trong V3
products(product_name_ja)       // → Đúng: products(product_name)
products.status                 // → Đúng: products.product_status

// ❌ SAI — cột KHÔNG TỒN TẠI trong products
products.material_id
products.thickness_mm
products.sact_qr_code
products.derived_from_product_id

// ❌ SAI — bảng ĐÃ BỊ DROP hoặc DEPRECATED
design_masters, design_projects, mold_designs
mold_masters                    // → DEPRECATED: dùng products thay thế

// ❌ SAI — FK sai
.eq('customer_id', id)          // → Đúng: .eq('company_id', id)
```

---

## 🎨 Quy tắc Design System & CSS (BẮT BUỘC)

**NGUYÊN TẮC CỐT LÕI: Không Hardcode, Không Inline Style**
- **KHÔNG dùng inline style** cho padding, margin, font-size, color khi đã có CSS class tương ứng.
- **KHÔNG hardcode giá trị** (px, color hex) trực tiếp — sử dụng CSS variables hoặc class.
- **Ngoại lệ cho phép inline style**: Layout 1-lần (gap, grid cụ thể cho component), hoặc giá trị dynamic tính toán từ state.
- **Khi cần variant mới**: Thêm class vào `globals.css` thay vì dùng inline style.

Khi viết UI, luôn dùng CSS classes từ `globals.css`:

| Element | Class đúng |
|---------|-----------|
| Bảng dữ liệu | `className="data-table"` |
| Input | `className="form-input"` |
| Search Input | `className="form-input form-input-search"` (có padding cho icon) |
| Select | `className="form-input"` |
| Textarea | `className="form-textarea"` |
| Button primary | `className="btn btn-primary"` |
| Button secondary | `className="btn btn-secondary"` |
| Card | `className="card-flat"` hoặc `className="card"` |
| Grid | `className="form-grid-4"` hoặc `className="form-grid-2"` |
| Badge | `className="badge badge--info/success/warning/error/neutral"` |

**Màu accent**: `var(--accent)` (Teal)  
**Font size**: Base 14px, input 13px, table cell 13px, label 12px

---

## ⚡ Quy tắc Performance

- **Pagination**: Mọi bảng dữ liệu PHẢI dùng `.range(from, to)` + `Pagination` component
- **Page size**: 50 rows/page
- **Search**: Server-side `.ilike()`, không filter client
- **Debounce**: 300-500ms trước khi gọi API

---

## 📊 Quy tắc Bảng dữ liệu (BẮT BUỘC)

### Cột chính — Hyperlink (BẮT BUỘC)

- Mọi bảng dữ liệu PHẢI có **cột chính** (mã code hoặc tên chính) dạng **hyperlink** `<Link>`
- Cột chính: `color: var(--accent)`, `fontWeight: 700`, `fontFamily: monospace`, `fontSize: 13`
- Bấm vào cột chính → mở trang chi tiết tương ứng (KHÔNG phải plain text)
- **KHÔNG** dùng `<span>` cho cột chính — bắt buộc `<Link href="/path/[id]">`

### Lịch sử tìm kiếm (BẮT BUỘC)

- Mọi trang danh sách có ô tìm kiếm PHẢI dùng hook `useSearchHistory(key)`
- Lưu tối đa 10 từ khóa gần nhất vào `localStorage`
- Hiển thị gợi ý `<SearchSuggestions>` khi focus vào ô tìm kiếm
- Import từ: `@/hooks/useSearchHistory` và `@/components/ui/SearchSuggestions`

---

## 🏗 Quy tắc Nhất quán trang (BẮT BUỘC)

- Mọi trang danh sách PHẢI theo cùng 1 kiến trúc: Header + Search + Table + Pagination
- Mọi trang chi tiết PHẢI theo cùng 1 kiến trúc: Back/Up + Header + Tabs
- **KHÔNG** tạo trang có giao diện hoặc luồng xử lý khác biệt so với các trang cùng loại
- Popup/Modal chỉ dùng cho **tạo nhanh** hoặc **chỉnh sửa nhanh**, KHÔNG thay thế trang chi tiết

### Detail Page Header — Compact (BẮT BUỘC)

- Header trang chi tiết PHẢI compact: `padding: '12px 16px'`, icon nhỏ (20px), font title 18px
- Back/Up buttons đặt **cùng hàng** với header card (bên trái), KHÔNG chiếm riêng 1 dòng
- Thông tin phụ (loại, hạn chót, link liên quan) đặt **inline** trên cùng dòng hoặc dòng thứ 2 compact
- **KHÔNG** dùng icon lớn (48px), padding lớn (20px+), hoặc phần "関連 / Liên kết" chiếm riêng block
- Mục tiêu: Header + Back + Tabs chiếm **tối đa 25%** chiều cao viewport, để nội dung hiển thị tối đa

### Table Sorting (Sắp xếp dữ liệu bảng) (BẮT BUỘC)

- Tất cả các bảng dữ liệu (Data Tables) PHẢI có tính năng sắp xếp (sorting) trên các cột khả thi.
- Bấm vào tiêu đề cột (Header) để thay đổi chiều sắp xếp (Tăng dần -> Giảm dần -> Mặc định).
- PHẢI có biểu tượng (icon như `ArrowUp`, `ArrowDown`, hoặc `ArrowUpDown`) hiển thị trạng thái sắp xếp hiện tại của cột.
- Logic sắp xếp có thể xử lý ở Client-side (nếu dữ liệu đã tải toàn bộ trang hiện tại) hoặc Server-side (thông qua URL params `?sort=col&dir=asc`) tùy thuộc vào Pagination.
- Mặc định tất cả các bảng dữ liệu (Sản phẩm Products, Khuôn/Thiết bị Equipment, Đơn hàng Orders, Chỉ thị Jobs, v.v.) **BẮT BUỘC sắp xếp theo thứ tự TỪ MỚI ĐẾN CŨ (Mới nhất ở trên cùng - `ORDER BY created_at / date / first_shipment_date DESC`)**.
- Đối với trường Ngày xuất hàng đầu tiên (`first_shipment_date` / `出荷納期`): Khi sắp xếp theo cột này, mặc định cũng phải xếp từ **MỚI ĐẾN CŨ (`DESC`)**, các bản ghi có ngày hạn mới nhất/gần nhất nằm ở trên cùng.

---

## 📁 Cấu trúc src/app

```
src/app/
├── master/
│   ├── customers/      ← Quản lý Khách hàng (bảng companies + company_contacts + delivery_sites)
│   ├── products/       ← Quản lý Sản phẩm (bảng products)
│   ├── molds/          ← Master Khuôn (bảng mold_masters)
│   ├── plastics/       ← Nhựa nguyên liệu
│   ├── machines/       ← Máy móc
│   └── racks/          ← Kệ chứa
├── engineering/
│   └── designs/        ← Thiết kế khuôn (bảng design_revisions) — KHÔNG phải sản phẩm
├── equipment/
│   ├── molds/          ← Khuôn vật lý (bảng physical_molds)
│   ├── cutting-dies/   ← Dao cắt (bảng cutters)
│   ├── jobs/           ← Tiến độ gia công
│   └── lifecycle/      ← Kiểm kê
├── orders/
│   ├── page.tsx        ← Danh sách đơn hàng
│   ├── [id]/           ← Chi tiết đơn hàng
│   └── shipments/      ← Giao hàng
├── production/         ← Sản xuất / Kanban
└── reports/            ← Báo cáo
```

---

## 🧪 Sau mỗi thay đổi code

Luôn chạy kiểm tra TypeScript:
```bash
npx tsc --noEmit
```
Chỉ báo cáo hoàn thành khi **0 errors**.

```

---

## 🔗 Quy tắc Điều hướng (Navigation Pattern)

### Back / Up Pattern (BẮT BUỘC cho mọi trang chi tiết)

Mọi trang chi tiết (detail page) PHẢI có 2 nút điều hướng:

| Nút | Hành vi | Icon | Code |
|-----|---------|------|------|
| **← 戻る (Back)** | `router.back()` — quay lại trang trước, giữ trạng thái tìm kiếm | `ArrowLeft` | Client component |
| **↑ 一覧 (Up)** | Link cố định → trang danh sách cha | `ArrowUpFromLine` | `<Link href="...">` |

### URL Search Sync (BẮT BUỘC)

- Mọi trang danh sách PHẢI đọc `?search=` từ URL và sync với local search state
- Dùng `useSearchParams().get('search')` để khởi tạo `searchQuery` state
- Global search (Topbar) đẩy `?search=` vào URL → trang phải phản hồi

### Workflow Links (Liên kết luồng công việc)

- Trang chi tiết và modal chỉnh sửa PHẢI có thanh `関連 / Liên kết:` với các link đến khâu trước/sau
- Link đến trang chi tiết trực tiếp (VD: `/master/customers/{id}`) thay vì trang danh sách
- Modal chỉnh sửa phải có link đến khâu tiếp theo trong luồng (VD: modal thiết kế → link khuôn vật lý)

---

## 🧪 Sau mỗi thay đổi code

Luôn chạy kiểm tra TypeScript:
```bash
npx tsc --noEmit
```
Chỉ báo cáo hoàn thành khi **0 errors**.

---

## 🔄 QUY TẮC CHUYỂN MODEL (BẮT BUỘC — Claude ↔ Gemini ↔ Bất kỳ)

Khi **bắt đầu phiên mới** hoặc **phát hiện context bị truncated** (checkpoint, thiếu thông tin trước đó):

### Bước 1: ĐỌC SỔ CÁI DỰ ÁN (BẮT BUỘC)
```
d:\AntiGravity_Workspace\.agents\mempalace\blueprints\ysdms-nextgen_MASTER.md
```
- Đọc Section 9 (Backlog & TODO) — biết task nào đang dở
- Đọc Section 10 (Nhật ký phiên) — biết phiên trước làm gì
- Đọc Section 8 (Vấn đề đã giải quyết) — tránh lặp lại lỗi

### Bước 2: ĐỌC CONVERSATION TRANSCRIPT (BẮT BUỘC nếu đang ở giữa task)
```bash
# Xem tất cả yêu cầu user trong phiên hiện tại
grep "USER_INPUT" "<appDataDir>\brain\<conversation-id>\.system_generated\logs\transcript.jsonl"

# Xem 50 bước gần nhất
tail -n 50 "<appDataDir>\brain\<conversation-id>\.system_generated\logs\transcript.jsonl"
```

### Bước 3: XÁC NHẬN CONTEXT với user
- Tóm tắt: "Theo sổ cái và transcript, trước đó đã thực hiện X, Y, Z..."
- **KHÔNG bắt đầu code ngay** khi chưa xác nhận đúng context
- Nếu có artifact `task.md` hoặc `implementation_plan.md` trong conversation → đọc trước

### Bước 4: CẬP NHẬT SỔ CÁI sau mỗi tác vụ hoàn thành
- APPEND kết quả vào section phù hợp (KHÔNG ghi đè)
- Cập nhật "Cập nhật lần cuối" ở header
- Nếu có bug quan trọng đã sửa → thêm vào Section 8

### Lưu ý đặc biệt
- **Gemini** và **Claude** dùng CHUNG conversation transcript — đọc để biết model kia đã làm gì
- **KHÔNG** tự ý revert hoặc viết lại code mà model trước đã sửa đúng
- Khi nghi ngờ → hỏi user thay vì đoán

---

## 🛠️ QUY TẮC CẬP NHẬT DATABASE TYPES (BẮT BUỘC)

Để tránh sự cố mất type của các bảng khi generate lại schema (gây lỗi TypeScript hàng loạt), **TUYỆT ĐỐI KHÔNG** chạy lệnh generate đè trực tiếp lên source file nếu chưa kiểm tra. Hãy áp dụng quy trình an toàn sau:

1. **Generate ra file TẠM (KHÔNG ghi thẳng vào source):**
   ```bash
   npx supabase gen types typescript --project-id <ID> > /tmp/db_types_new.ts
   ```

2. **Diff để kiểm tra trước khi ghi đè:**
   ```bash
   diff src/types/database.types.ts /tmp/db_types_new.ts
   ```

3. **Chỉ copy/inject vào source file (`src/types/database.types.ts`) khi đã xác nhận đầy đủ số lượng bảng (tránh tình trạng schema chưa hoàn thiện làm mất các bảng khác).**
   - Hoặc có thể tự thủ công copy/paste block type của bảng cần thiết vào thay vì ghi đè cả file.

---

## 🌍 QUY TẮC ĐA NGÔN NGỮ & I18N (BẮT BUỘC)

Hệ thống sử dụng `next-intl` để xử lý đa ngôn ngữ (Tiếng Nhật / Tiếng Việt) động. Bạn **TUYỆT ĐỐI KHÔNG ĐƯỢC** sử dụng kiểu song ngữ tĩnh (hiển thị đồng thời cả 2 ngôn ngữ).

1. **Quy trình i18n:**
   - Phải khai báo keys vào `messages/ja.json` và `messages/vi.json` **TRƯỚC KHI** hoặc **TRONG KHI** viết component UI.
   - Không được copy mã JSX (ví dụ `{count}`) hoặc code logic vào file JSON.

2. **Không Hardcode UI:**
   - Tuyệt đối không sử dụng các class như `className="ja"`, `className="vi"`, `className="label-ja"`.
   - Không chèn trực tiếp các đoạn text song ngữ dạng `Tiếng Nhật / Tiếng Việt`.
   - Bắt buộc sử dụng `const t = useTranslations('Namespace')` và gọi `t('key')`. Nếu cần xử lý linh hoạt, sử dụng `useLocale()` để kiểm tra locale là `ja` hay `vi`.

3. **Kiểm tra tự động:**
   - Sau khi thay đổi code UI hoặc file dịch, bạn **PHẢI CHẠY** lệnh sau để kiểm tra xem có thiếu key không:
     `node scripts/check_translations.mjs`
   - Báo cáo lỗi sẽ hiện ra nếu thiếu key. Bạn phải sửa trước khi tiếp tục.
   - Để tìm các chỗ còn sót mã hardcode song ngữ, chạy:
     `node scripts/find_hardcoded_bilingual.mjs`
