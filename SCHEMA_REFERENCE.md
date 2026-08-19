# YSDMS NextGen — Database Schema Reference
> **AI AGENT: Đọc file này TRƯỚC KHI viết bất kỳ Supabase query nào.**
> Đây là nguồn duy nhất (single source of truth) về cấu trúc DB.
> **Cập nhật lần cuối: 2026-08-10** — Phase C Schema Cleanup: DROP `products.primary_plastic_code/primary_plastic_spec` (SSOT = `design_revisions.plastic_type_designed`). DROP `design_revisions.version_note` (consolidated → `change_summary`). ADD `mold_design_cutters.equipment_id` FK → `equipment(equipment_id)`.

---

## ⚠️ Lưu ý Quan trọng

1. Migration `067_schema_v2_to_v3.sql` đã **DROP và tái tạo** nhiều bảng.
2. Thư mục `migrations/archived/` chứa file cũ **KHÔNG CÒN HIỆU LỰC** — KHÔNG ĐỌC.
3. Nguồn xác minh duy nhất: `src/types/database.types.ts` (tự sinh từ Supabase).
4. **KHÔNG tự sáng tạo cột** — nếu không thấy cột trong file này, cột đó KHÔNG TỒN TẠI.
5. **Bảng User là `employees`**: Bảng chứa thông tin user trong project này là `employees` (KHÔNG phải `profiles` hay `users`). Bắt buộc dùng `REFERENCES employees(employee_id)` ở tất cả các migration tương lai.

## ⚠️ CONVENTION CẢNH BÁO: Tên Primary Key

DB này KHÔNG dùng `id` làm PK. Quy tắc: PK = `{tên_bảng_số_ít}_id`

| Bảng | Primary Key |
|---|---|
| `order_lines` | `line_id` |  ← ngoại lệ, KHÔNG phải order_line_id
| `employees` | `employee_id` |
| `physical_molds` | `physical_mold_id` |
| `orders` | `order_id` |
| `products` | `product_id` |

Khi viết FK mới: LUÔN kiểm tra bằng câu query:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = '{tên_bảng}' AND ordinal_position = 1;
```

---

## 📐 Sơ đồ Quan hệ Chính

```
companies ──┬── company_contacts (1:N)
            ├── delivery_sites (1:N)
            ├── orders (company_id FK) ──┬── order_lines (order_id FK) → products
            │                            └── shipments (order_id FK)
            └── products (company_id FK, NOT NULL)
                    └── mold_masters (via products.mold_master_id FK)

mold_masters ── mold_revisions ──┬── design_revisions (via design_revision_id FK)
                                 └── physical_molds (via mold_revision_id FK)

cutter_masters ── cutters (cutter_master_id FK)

equipment ──┬── equipment_history (equipment_id FK)
            └── equipment_assignments (primary/related equipment_id FK, N:N)

jobs ──── equipment (equipment_id FK, optional)
     ──── business_cases (case_id FK, optional)
```

---

## 🔑 Bảng `companies` — Khách hàng / Đối tác

```
PK:  company_id        UUID
     company_code      TEXT UNIQUE
     company_name      TEXT
     company_name_romaji TEXT
     company_type      TEXT[]         ← ['CUSTOMER', 'SUPPLIER', 'OUTSOURCE', 'MANUFACTURER', 'DELIVERY_LOCATION']
     parent_company_id UUID → companies(company_id)
     is_active         BOOLEAN
     tel               TEXT
     fax               TEXT
     address           TEXT
     order_folder_path TEXT
     cad_folder_path   TEXT
     notes             TEXT
```

---

## 🔑 Bảng `company_contacts` — Người liên hệ

```
PK:  contact_id     UUID
FK:  company_id     UUID → companies(company_id) NOT NULL
     contact_name   TEXT NOT NULL
     contact_role   TEXT           ← Chức vụ
     contact_tel    TEXT
     contact_email  TEXT
     is_primary     BOOLEAN        ← Liên hệ chính?
```

---

## 🔑 Bảng `delivery_sites` — Địa điểm giao hàng

```
PK:  site_id        UUID
FK:  company_id     UUID → companies(company_id) NOT NULL
     site_code      TEXT NOT NULL           ← UNIQUE(company_id, site_code)
     site_name      TEXT NOT NULL
     site_address   TEXT
     site_tel       TEXT
     site_fax       TEXT
     contact_person TEXT
     contact_email  TEXT
     delivery_notes TEXT
     is_active      BOOLEAN
```

---

## 🔑 Bảng `products` — Sản phẩm / Khay (= MoldMaster)

> **Tray = MoldMaster = Products** — là MỘT thực thể. Bảng `mold_masters` đã DEPRECATED.

```
PK:  product_id          UUID
FK:  company_id          UUID → companies(company_id) NOT NULL  ← BẮT BUỘC
FK:  mold_master_id      UUID → mold_masters(mold_master_id)   ← DEPRECATED, giữ tạm
     product_code        TEXT UNIQUE   ← Mã nội bộ YSD (compact, bỏ gạch ngang: ADY071)
     product_name        TEXT          ← Tên SP chính thức từ KH (NULL nếu chưa có chứng từ, dùng xuất hóa đơn)
     product_name_en     TEXT          ← Tên SP tiếng Anh
     product_name_internal TEXT        ← Tên nội bộ YSD (hiển thị có gạch ngang: ADY-071)
     customer_product_name TEXT        ← Tên hoặc mã part khách hàng gọi (VD: PART-8802-A)
     product_description TEXT          ← Mô tả SP cho KD/SX / Tên ban đầu (nguồn: 品名 trên 工程票). Luôn có dữ liệu.
     company_pn          TEXT          ← ⚠️ DEPRECATED — Phase 2 sẽ xóa/rename
     product_status      TEXT          ← (KHÔNG phải 'status')
     pocket_count        INTEGER
     pieces_per_box      INTEGER
     box_spec            TEXT
     notes               TEXT          ← Ghi chú tự do (KHÔNG dùng cho mô tả SP)
     first_shipment_date DATE          ← 初回出荷日 (denormalized từ jobs.ship_date). Added 2026-08-03
     date_entry          DATE
     legacy_id           TEXT
     legacy_specs        JSONB
```

> [!CAUTION]
> - `product_code` = **mã nội bộ YSD compact** (ADY071, bỏ gạch ngang). KHÔNG phải tên sản phẩm.
> - `product_name_internal` = **tên nội bộ YSD hiển thị** (ADY-071, giữ gạch ngang)
> - `product_description` = **mô tả sản phẩm / tên làm việc** do KD nhập (luôn có ngay từ đầu).
> - `product_name` = **tên chính thức từ khách hàng trên hóa đơn/hợp đồng** (ban đầu có thể NULL).
> - `customer_product_name` = **mã part hoặc tên sản phẩm phía khách hàng gọi**.
> - `company_pn` = **DEPRECATED** — không dùng trong code mới
> - `company_id` là **NOT NULL** — bắt buộc có khách hàng
> - **KHÔNG CÓ**: `material_id`, `thickness_mm`, `sact_qr_code`, `derived_from_product_id`

---

## ⛔ Bảng `mold_masters` — DEPRECATED

> **KHÔNG SỬ DỤNG** bảng này trong code mới.  
> Tray = MoldMaster = Products. Mọi thông tin khuôn master đã gộp vào `products`.  
> Bảng giữ lại cho backward compat với UI hiện tại (32 files). Sẽ refactor trong Phase 2.
> 
> ❌ KHÔNG: `supabase.from('mold_masters')`  
> ✅ ĐÚNG: `supabase.from('products')`

---

## 🔑 Bảng `orders` — Đơn hàng

```
PK:  order_id           UUID
FK:  company_id         UUID → companies(company_id)   ← ĐÚNG, KHÔNG phải customer_id
     order_no           TEXT UNIQUE
     order_date         DATE
     requested_delivery DATE
     order_status       TEXT  ('NEW' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'CANCELLED')
     order_type         TEXT
     customer_order_no  TEXT    ← Số PO / 要求No. phía khách hàng (VD: IP0000153229)
     lot_no             TEXT    ← 伝票/LOT No. — Mã phiếu xuất hàng
     notes              TEXT
```

> [!CAUTION]
> `orders` **KHÔNG CÓ** cột `customer_id`. FK duy nhất là `company_id → companies`.

---

## 🔑 Bảng `order_lines` — Chi tiết đơn hàng

```
PK:  line_id          UUID
FK:  order_id         UUID → orders(order_id) ON DELETE CASCADE
FK:  product_id       UUID → products(product_id)
FK:  design_revision_id UUID → design_revisions(revision_id) ← NULLABLE, chỉ định khi cần
FK:  delivery_site_id UUID → delivery_sites(site_id)
     line_no          INTEGER
     quantity         INTEGER
     unit             TEXT  (default 'PCS')
     due_date         DATE       ← Ngày nhận hàng (dòng 2 trong ô 納期)
     ship_date        DATE       ← 出荷日 — Ngày xuất hàng (dòng 1 trong ô 納期)
     is_free_sample   BOOLEAN    ← Miễn phí? (無償)
     charge_type      TEXT       ← Loại phí (FREE/PAID/OFFICE_SAMPLE)
     packing_style    TEXT       ← 荷姿 — Quy cách đóng gói
     shipping_notes   TEXT       ← Ghi chú đóng gói đặc biệt
     line_status      TEXT
```

> [!IMPORTANT]
> `design_revision_id` **NULLABLE** — Mặc định NULL = tự lấy revision mới nhất từ product.
> Chỉ chỉ định khi có nhiều revision cùng active (VD: 2 phiên bản cho 2 loại nhựa khác nhau).

> [!CAUTION]
> Bảng `order_lines` có Primary Key là `line_id` (KHÔNG PHẢI `order_line_id`). Bắt buộc dùng `REFERENCES order_lines(line_id)` khi thiết lập khóa ngoại từ các bảng khác.

---

## 🔑 Bảng `shipments` — Giao hàng

```
PK:  shipment_id      UUID
FK:  order_id         UUID → orders(order_id)
FK:  delivery_site_id UUID → delivery_sites(site_id)
     ship_date        DATE
     delivery_date    DATE
     delivery_note_no TEXT
     carrier          TEXT
     tracking_no      TEXT
     status           TEXT  ('SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED')
```

---

## 🔑 Bảng `mold_masters` — Master Khuôn

```
PK:  mold_master_id    UUID
FK:  company_id        UUID → companies(company_id)
     mold_master_code  TEXT UNIQUE
     mold_master_name  TEXT
     mold_class        TEXT
     notes             TEXT
```

---

## 🔑 Bảng `design_revisions` — Thiết kế Khuôn

```
PK:  revision_id       UUID
FK:  mold_master_id    UUID → mold_masters(mold_master_id)
FK:  company_id        UUID → companies(company_id)
FK:  product_id        UUID → products(product_id)
FK:  shared_plug_from_design_id UUID → design_revisions(revision_id)
     design_code       TEXT
     design_length     NUMERIC
     design_width      NUMERIC
     design_height     NUMERIC
     design_depth      NUMERIC
     design_weight     TEXT
     cutline_length    NUMERIC
     cutline_width     NUMERIC
     cavity_count      INTEGER       ← 取数 = Pieces per mold cycle (1サイクルで何枚のトレイを成形するか). ※ Pocket数ではない → products.pocket_count
     corner_r          TEXT
     chamfer_c         TEXT
     draft_angle       TEXT
     cavity_pitch_mm   NUMERIC       ← Bước khuôn (Khoảng cách tâm giữa các cavity trên khuôn)
     machine_feed_pitch_mm NUMERIC   ← Bước tiến nhựa (送り) - Dùng tính hao phí vật liệu
     orientation       TEXT
     setup_type        TEXT
     plug_type         TEXT          ← ['NONE', 'OWNED', 'SHARED']
     has_separate_cutter BOOLEAN
     customer_tray_name TEXT        ← Tên khay từ khách hàng (CustomerTrayName)
     plastic_type_designed TEXT     ← Loại nhựa thiết kế (DesignForPlasticType)
     tray_info         TEXT          ← Thông tin khay cho chỉ thị (TrayInfoForMoldDesign)
     change_summary    TEXT          ← Tóm tắt điểm thay đổi so với phiên bản trước (Added 2026-08-04)
     customer_equipment_no TEXT
     customer_drawing_no TEXT
     designer          TEXT
     design_date       DATE
     approved_date     DATE
     cad_folder_path   TEXT
     drawing_pdf_path  TEXT
     status            TEXT          ← ('DRAFT' | 'APPROVED' | ...)
     legacy_id         TEXT
     legacy_specs      JSONB
```

---

## ❌ Bảng `mold_revisions` — DELETED / DROPPED (2026-08-05)

> ⚠️ **ĐÃ XÓA KHỎI SYSTEM** — Bảng trung gian dư thừa đã bị DROP CASCADE.
> `equipment` và `physical_molds` liên kết trực tiếp tới `design_revisions` qua `design_revision_id`.

---

## 🔑 Bảng `physical_molds` — Khuôn Vật lý

```
PK:  physical_mold_id    UUID
FK:  mold_revision_id    UUID → mold_revisions(mold_revision_id)  ← NULLABLE (DEC-008: Quick Entry cho phép NULL)
FK:  keeper_company_id   UUID → companies(company_id)
FK:  current_rack_layer_id UUID → rack_layers(rack_layer_id)
FK:  cav_type_id         UUID → cav_types(cav_type_id)
     system_code         TEXT UNIQUE     ← Mã hệ thống (ví dụ: "K-0123")
     display_name        TEXT NOT NULL   ← Tên hiển thị
     physical_stamp      TEXT            ← Ký hiệu đóng dấu trên khuôn thực
     mold_type           TEXT            ← Loại khuôn
     copy_number         INTEGER         ← Số bản sao (nếu có)
     piece_count         INTEGER         ← Số mảnh
     device_status       TEXT            ← Tình trạng thiết bị (Default 'NORMAL')
     usage_status        TEXT            ← Trạng thái sử dụng ('ACTIVE' | 'LOAN' | 'DISPOSED' | ...)
     on_checklist        BOOLEAN         ← Có nằm trong DS kiểm tra? (Default False)
     manufacturing_date  DATE            ← Ngày sản xuất khuôn (import từ jobs.DeliveryDeadline)
     mold_entry_date     DATE            ← Ngày nhập kho
     actual_length_mm    TEXT            ← Kích thước thực (dài)
     actual_width_mm     TEXT            ← Kích thước thực (rộng)
     actual_height_mm    TEXT            ← Kích thước thực (cao)
     actual_weight       TEXT            ← Trọng lượng thực
     returned_date       DATE            ← Ngày trả khuôn
     disposed_date       DATE            ← Ngày thanh lý
     qr_uuid             UUID            ← UUID cho QR code
     notes               TEXT
     legacy_id           TEXT
     legacy_specs        JSONB
```

---

## 🔑 Bảng `jobs` — Lịch trình & Công việc

```
PK:  job_id              UUID
FK:  job_type_id         TEXT → job_types(job_type_id) NOT NULL
FK:  mold_master_id      UUID → mold_masters(mold_master_id)
FK:  physical_mold_id    UUID → physical_molds(physical_mold_id)
FK:  design_revision_id  UUID → design_revisions(revision_id)
FK:  mold_work_order_id  UUID → mold_work_orders(mwo_id)
FK:  company_id          UUID → companies(company_id)
FK:  responsible_id      UUID → employees(employee_id)
FK:  outsource_company   UUID → companies(company_id)
FK:  equipment_id        UUID → equipment(equipment_id)
FK:  work_order_id       UUID → work_orders(wo_id)
     job_code            TEXT UNIQUE NOT NULL
     job_name            TEXT NOT NULL
     start_date          TIMESTAMPTZ    ← Ngày bắt đầu
     ship_date           TIMESTAMPTZ    ← Ngày xuất hàng khay (出荷納期)
     mold_deadline       TIMESTAMPTZ    ← Kỳ hạn bàn giao chỉ thị (指示納期 / 払出期日)
     target_completion_date DATE        ← Kỳ hạn mục tiêu hoàn thành khuôn (完成目標日 — Trước 3 ngày làm việc)
     deadline            TIMESTAMPTZ    ← Hạn chung Job (Tự động = MAX(job_steps.deadline))
     completed_date      TIMESTAMPTZ
     estimated_hours     NUMERIC(6,1)
     job_status          TEXT
     approved            BOOLEAN
     priority            INTEGER
     year_period         INTEGER
     month_period        INTEGER
     notes               TEXT
```

---

## 🔑 Bảng `company_calendar` — Lịch Làm Việc & Ngày Nghỉ Công Ty

```
PK:  calendar_date       DATE PRIMARY KEY
     day_type            TEXT NOT NULL DEFAULT 'WORKDAY' ('WORKDAY' | 'HOLIDAY' | 'PUBLIC_HOLIDAY' | 'SPECIAL_WORKDAY' | 'COMPANY_OFF')
     is_working_day      BOOLEAN NOT NULL DEFAULT true
     working_hours       NUMERIC(4,1) DEFAULT 8.0
     notes               TEXT (Tên ngày lễ / Sự kiện / 'お盆休み' / '特別出勤日')
     created_at          TIMESTAMPTZ DEFAULT now()
     updated_at          TIMESTAMPTZ DEFAULT now()
```

---

## 🔑 Bảng `work_orders` — Lệnh Sản Xuất / Gia Công Khuôn (Option C)

```
PK:  wo_id              UUID
     wo_code            TEXT UNIQUE NOT NULL   ← (VD: 'WO-2026-000001')
     wo_name            TEXT NOT NULL          ← (VD: 'Chế tạo bộ khuôn ABY-123')
FK:  product_id         UUID → products(product_id)
FK:  design_revision_id UUID → design_revisions(revision_id)
FK:  order_id           UUID → orders(order_id)
FK:  company_id         UUID → companies(company_id)
FK:  case_id            UUID → business_cases(id)
     wo_type            TEXT NOT NULL DEFAULT 'NEW_SET' -- 'NEW_SET'|'REPAIR'|'REMAKE'|'MODIFICATION'|'OTHER'
     wo_status          TEXT NOT NULL DEFAULT 'PLANNED' -- 'PLANNED'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED'
     start_date         TIMESTAMPTZ
     deadline           TIMESTAMPTZ
     completed_at       TIMESTAMPTZ
FK:  responsible_id     UUID → employees(employee_id)
     priority           INTEGER DEFAULT 5
     notes              TEXT
     created_at         TIMESTAMPTZ DEFAULT now()
     updated_at         TIMESTAMPTZ DEFAULT now()
FK:  created_by         UUID → employees(employee_id)
```

---

## 🔑 Bảng `job_steps` — Thành phần (Components) của Job
> ⚠️ **Kiến trúc:** `job_steps` = **Components/Thành phần** của Job, KHÔNG phải công đoạn tuần tự.
> - Với Job khuôn: MOLD, PLUG, CUTTER, WATER_BASE... (thiết bị phụ kiện)
> - Các components thực hiện **SONG SONG**, chỉ cần đúng kỳ hạn.
> - Tên bảng giữ nguyên `job_steps` để tránh phá vỡ triggers/RLS hiện tại.
> - UI gọi là "Components" hoặc "Cấu thành Bộ khuôn" (Section 5 trong quick-create).

## 🔑 Bảng `item_types` — Loại Hạng mục (Level 2)

```
PK:  item_type_id         INTEGER
     item_type_code       TEXT          ← (VD: 'MOLD', 'PLUG', 'CUTTER'...)
     item_type_name_ja    TEXT          ← Tên tiếng Nhật (VD: '金型', 'プラグ'...)
     item_type_name_vi    TEXT          ← Tên tiếng Việt
     description          TEXT
```

---

## 🔑 Bảng `processing_codes` — Mã Thao tác (Level 3)

```
PK:  processing_code_id   INTEGER
     processing_name      TEXT          ← (VD: '本型演算＆加工', '本型穴あけ'...)
     category             TEXT          ← Nhóm thao tác (MOLD_MILLING, MOLD_EDM...)
     is_active            BOOLEAN
```

---

## 🔑 Bảng `job_steps` — Thành phần (Level 2) của Job

```
PK:  step_id              UUID
FK:  job_id               UUID → jobs(job_id) NOT NULL
FK:  item_type_id         INTEGER → item_types(item_type_id)   ← Loại hạng mục (MOLD, PLUG...)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  outsource_company    UUID → companies(company_id)
FK:  assigned_to          UUID → employees(employee_id)
FK:  machine_id           UUID → machines(machine_id)
     step_no              INTEGER NOT NULL
     step_name            TEXT NOT NULL
     step_status          TEXT
     track                TEXT          ← (MOLD, PLUG, CUTTER...) — component track
     type_code            TEXT          ← (MOLD, PLUG, CUTTER...) — component type code
     material_spec        TEXT          ← Vật liệu/quy cách (A5052, SKD11, ベニヤ木板...)
     quantity             INTEGER       ← Số lượng (default 1)
     arrangement          TEXT          ← 手配 ('REQUIRED' / 'NOT_REQUIRED')
     condition            TEXT          ← 新規/既存 ('NEW' / 'EXISTING')
     manufacture_location TEXT          ← 内製/外注 ('IN_HOUSE' / 'OUTSOURCED')
     deadline             TIMESTAMPTZ   ← Kỳ hạn riêng của từng component
     drawing_receipt_date TIMESTAMPTZ   ← Ngày nhận bản vẽ
     estimated_hours      NUMERIC(6,1)
     planned_hours        NUMERIC(6,1)
     actual_hours         NUMERIC(6,1)  ← Tự động tính từ SUM(work_logs.hours_spent)
     planned_start        TIMESTAMPTZ
     planned_end          TIMESTAMPTZ
     baseline_start       TIMESTAMPTZ
     baseline_end         TIMESTAMPTZ
     progress_percent     INTEGER
     machining_location   TEXT
     set_info             TEXT
     tehai_info           TEXT
     notes                TEXT
```

### Quan hệ job_steps ↔ work_logs
```
work_logs.job_step_id → job_steps.step_id   (FK — liên kết chính)
work_logs KHÔNG CÓ trường track/step_no — phải JOIN qua job_step_id
```

---

## 🔑 Bảng `work_logs` — Nhật ký Thao tác (Level 3)

```
PK:  log_id               UUID
FK:  job_id               UUID → jobs(job_id) NOT NULL
FK:  job_step_id          UUID → job_steps(step_id)              ← NULLABLE (DB thực tế)
FK:  employee_id          UUID → employees(employee_id) NOT NULL
FK:  processing_code_id   INTEGER → processing_codes(processing_code_id)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  machine_id           UUID → machines(machine_id)
     work_date            DATE NOT NULL
     hours_spent          NUMERIC(6,2)
     planned_hours        NUMERIC(6,2)
     planned_date         DATE
     quantity_done        INTEGER
     is_finished          BOOLEAN
     description          TEXT             ← Mô tả chi tiết công việc
     notes                TEXT
     contact_content      TEXT
```

---

## ✅ Query mẫu ĐÚNG

```typescript
// Danh sách đơn hàng với tên công ty
supabase.from('orders').select('*, companies(company_name, company_code)')

// Sản phẩm với tên công ty
supabase.from('products').select('*, companies(company_name, company_code)')

// Giao hàng (join 2 cấp)
supabase.from('shipments').select('*, orders(order_no, companies(company_name))')

// Lọc đơn hàng theo công ty
supabase.from('orders').select('*').eq('company_id', companyId)

// Người liên hệ của công ty
supabase.from('company_contacts').select('*').eq('company_id', companyId)

// Địa điểm giao hàng
supabase.from('delivery_sites').select('*').eq('company_id', companyId)
```

---

## ❌ Sai thường gặp — BẮT BUỘC TRÁNH

| Sai | Đúng | Lý do |
|-----|------|-------|
| `products(product_name_ja)` | `products(product_name)` | Cột đã đổi tên trong V3 |
| `products.status` | `products.product_status` | Tên cột thực tế |
| `products.material_id` | ❌ Không tồn tại | Không có cột này |
| `products.thickness_mm` | ❌ Không tồn tại | Không có cột này |
| `products.sact_qr_code` | ❌ Không tồn tại | Không có cột này |
| `products.derived_from_product_id` | ❌ Không tồn tại | Không có cột này |
| `orders.customer_id` | `orders.company_id` | Cột đúng là company_id |
| `.eq('customer_id', id)` trên orders | `.eq('company_id', id)` | FK là company_id |
| `design_masters` | ❌ Bảng đã bị DROP | Dùng `mold_masters` |
| `design_projects` | ❌ Bảng đã bị DROP | Dùng `design_revisions` |
| `mold_designs` | ❌ Bảng đã bị DROP | Dùng `design_revisions` |
| `cutter_master` | `cutter_masters` (có s) | Tên bảng số nhiều |
| `physical_molds.id` | `physical_molds.physical_mold_id` | PK đúng |
| `cutters.id` | `cutters.cutter_id` | PK đúng |

---

## 🔑 Bảng `departments` — Phòng ban (Phase 2 WMS)

```
PK:  id             UUID
     code           TEXT UNIQUE    ← MOLDING, CUTTING, RECYCLING, OFFICE...
     name           TEXT           ← Tên hiển thị
     description    TEXT
     is_active      BOOLEAN
```

*(Note: `department_id` được thêm vào `jobs` và `job_steps`)*

---

## 🔑 Bảng Kho Nhựa (Plastic WMS Phase 2)

**`plastic_master`** — Cấu hình vật tư nhựa
```
PK:  plastic_id       UUID
     plastic_code     TEXT UNIQUE
     plastic_family   TEXT
     plastic_subtype  TEXT
     thickness_mm     NUMERIC
     width_mm         INTEGER
     ...
```

**`plastic_receipt`** — Phiếu nhập kho nhựa
```
PK:  id             UUID
FK:  supplier_id    UUID → suppliers(supplier_id)
     receipt_no     TEXT UNIQUE
     receipt_date   DATE
     note           TEXT
```

**`plastic_receipt_roll`** — Cuộn nhựa (Roll)
```
PK:  id                UUID
     roll_barcode      TEXT UNIQUE
FK:  receipt_id        UUID → plastic_receipt(id)
FK:  plastic_id        UUID → plastic_master(plastic_id)
FK:  branch_id         UUID → companies(company_id)   ← Nơi đang lưu trữ (Aomori, Honsha...)
     nominal_length_m  NUMERIC
     received_length_m NUMERIC
     current_length_m  NUMERIC
     status            TEXT   ← 'in_stock', 'in_use', 'empty', 'returned'
     location          TEXT
```

**`plastic_adjustment_log`** — Lịch sử xuất/nhập/hao hụt cuộn nhựa
```
PK:  id                UUID
FK:  roll_id           UUID → plastic_receipt_roll(id)
     change_length_m   NUMERIC
     action_type       TEXT   ← 'PRODUCTION', 'ADJUSTMENT', 'RETURN'
FK:  work_log_id       UUID → work_logs(id)
     operator_name     TEXT
     note              TEXT
```

---

## 🔑 Bảng `equipment` — Thiết Bị Sản Xuất Thống Nhất (Single Source of Truth)

> ✅ **Kiến trúc V3 (Đã hoàn thành 2026-08-05)**: Bảng `equipment` quản lý TOÀN BỘ thiết bị sản xuất
> (khuôn, dao cắt, đế làm mát, đế khí nén, khung, stacking, plug) ngang hàng.
> Bảng `equipment` là nguồn dữ liệu sự thật duy nhất (Single Source of Truth).
> Các bảng legacy `physical_molds` và `cutters` được giữ lại duy nhất cho backward compatibility.
>
> 📌 **QUY TẮC CAV & DÙNG CHUNG THIẾT BỊ (BẮT BUỘC):**
> 1. **`CAV` = Mã khổ Kích thước ngoài của Khuôn** (`actual_length_mm` × `actual_width_mm`) theo tiêu chuẩn YSD (Khổ A: 470x300, Khổ ZD: 470x347...). **KHÔNG PHẢI Pocket Count / Cavity nhỏ!**
> 2. **Dùng chung theo Kích thước ngoài Sản phẩm (Dao cắt & Stacking):** Dao cắt (`CUTTER_SEPARATE`/`CUTTER_INLINE`) gợi ý theo kích thước bao ngoài sản phẩm, nhưng **KHÔNG TỰ ĐỘNG GÁN HOÀN TOÀN** do biên dạng thực tế có thể có góc uốn cong hoặc lỗ khoét phụ. Hệ thống đưa ra GỢI Ý KÈM CẢNH BÁO để KTV xác nhận.
> 3. **Dùng chung theo Mã CAV Khuôn:** Đế làm mát (`WATER_BASE`), Đế khí nén (`PRESSURE_BASE`), Khung (`FRAME`).
> 4. **Mã CutterNo:** Dãy số tự nhiên (VD: `1042`), không ghép `CT-` vào tên hiển thị để tránh nhầm với mã khuôn `CT-1042`.

```
PK:  equipment_id          UUID
     equipment_code        TEXT UNIQUE NOT NULL    ← Mã hệ thống duy nhất (VD: MOLD-0123, WB-ZD-01, 1042)
     display_name          TEXT NOT NULL           ← Tên hiển thị (VD: TDW-001 R3, 1042)
     equipment_type        TEXT NOT NULL           ← 'MOLD','CUTTER_INLINE','CUTTER_SEPARATE','WATER_BASE','PRESSURE_BASE','FRAME','STACKING','PLUG'
     sub_type              TEXT                    ← Phân loại phụ ('PROTOTYPE_POCKET', 'MASS_PRODUCTION'...)
     physical_stamp        TEXT                    ← Ký hiệu đóng dấu trên thiết bị
     dimensions            TEXT                    ← Kích thước tổng quát
     actual_length_mm      TEXT
     actual_width_mm       TEXT
     actual_height_mm      TEXT
     actual_weight         TEXT
     material_spec         TEXT                    ← Vật liệu (A5052, SKD11...)
     piece_count           INTEGER
     copy_number           INTEGER
FK:  company_id            UUID → companies(company_id)
FK:  keeper_company_id     UUID → companies(company_id)
FK:  design_revision_id    UUID → design_revisions(revision_id)
FK:  cav_type_id           UUID → cav_types(cav_type_id)
     mold_master_id        UUID                   ← Backward compat (no FK, mold_masters DROPped)
FK:  current_rack_layer_id UUID → rack_layers(id)
     device_status         TEXT DEFAULT 'NORMAL'
     usage_status          TEXT DEFAULT 'STORAGE'
     on_checklist          BOOLEAN DEFAULT FALSE
     mold_type             TEXT
     manufacturing_date    DATE
     entry_date            DATE
     returned_date         DATE
     disposed_date         DATE
     qr_uuid               UUID
     legacy_physical_mold_id UUID
     legacy_cutter_id      UUID
     legacy_id             TEXT
     legacy_specs          JSONB
     notes                 TEXT
```

---

## 🔑 Bảng `equipment_history` — Lịch Sử IN/OUT & Sửa Chữa

```
PK:  history_id            UUID
FK:  equipment_id          UUID → equipment(equipment_id) ON DELETE CASCADE
     action_type           TEXT NOT NULL    ← 'IN','OUT','LOAN','RETURN','REPAIR','MAINTENANCE','DISPOSE','TRANSFER'
     action_date           DATE NOT NULL
     from_location         TEXT
     to_location           TEXT
FK:  from_company_id       UUID → companies(company_id)
FK:  to_company_id         UUID → companies(company_id)
FK:  job_id                UUID → jobs(job_id)
     description           TEXT
FK:  performed_by          UUID → employees(employee_id)
```

---

## 🔑 Bảng `equipment_assignments` — Quan Hệ N:N Thiết Bị

> Set lắp máy & Dùng chung: Khuôn A đi kèm Dao X + Đế Y; Đế Y dùng cho nhiều khuôn.

```
PK:  assignment_id         UUID
FK:  primary_equipment_id  UUID → equipment(equipment_id) ON DELETE CASCADE
FK:  related_equipment_id  UUID → equipment(equipment_id) ON DELETE CASCADE
     relationship_type     TEXT DEFAULT 'SET_MEMBER'   ← 'SET_MEMBER' | 'COMPATIBLE'
     is_default            BOOLEAN DEFAULT TRUE
     notes                 TEXT
UNIQUE: (primary_equipment_id, related_equipment_id)
CHECK:  primary_equipment_id <> related_equipment_id
```

---

## 🔑 Bảng `equipment_photos` — Quản Lý Ảnh Thiết Bị & Khuôn (Supabase Storage)

> Quản lý ảnh chụp thực tế của thiết bị, khuôn, dao cắt lưu trên Bucket `equipment-photos`.
> Hỗ trợ chụp trực tiếp từ camera di động (nén canvas tự động) và phân loại ảnh.

```
PK:  photo_id          UUID
FK:  equipment_id      UUID → equipment(equipment_id) ON DELETE CASCADE NOT NULL
     storage_path      TEXT NOT NULL   ← Đường dẫn trong Bucket 'equipment-photos' (VD: 'uuid/timestamp_name.jpg')
     file_name         TEXT
     file_size_bytes   BIGINT
     mime_type         TEXT DEFAULT 'image/jpeg'
     photo_type        TEXT DEFAULT 'OVERVIEW'  ← 'OVERVIEW'|'DETAIL'|'DAMAGE'|'MAINTENANCE'|'DOCUMENT'|'OTHER'
     caption           TEXT
     taken_at          TIMESTAMPTZ DEFAULT now()
FK:  taken_by          UUID → employees(employee_id)
     sort_order        INTEGER DEFAULT 0
     created_at        TIMESTAMPTZ DEFAULT now()
     updated_at        TIMESTAMPTZ DEFAULT now()
```

---

## 🔑 Cột mới trên bảng `jobs` (2026-07-31)

```
     job_category          TEXT    ← 'MOLD_NEW','MOLD_MODIFY','CUTTER_NEW','EQUIPMENT_NEW','EQUIPMENT_REPAIR','MAINTENANCE','INTERNAL_OPS','OTHER'
FK:  equipment_id          UUID → equipment(equipment_id)
FK:  case_id               UUID → business_cases(id)
```

---

## 🏷️ QUY TẮC MÃ HÓA VỊ TRÍ GIÁ-TẦNG (棚・段位置) & KHU VỰC XƯỞNG (2026-08-06)

### 1. Nguyên Tắc Thiết Kế Mã Vị Trí Địa Lý & Chức Năng (Zone & Area Naming)
- **KHÔNG cố định ký tự theo loại thiết bị** (không dùng M=Mold, C=Cutter): Một giá/kệ có thể chứa linh hoạt nhiều loại thiết bị (Khuôn, Dao cắt, Đế khí, Đế nước, Stacking).
- **Mã tiền tố đại diện cho Vị Trí Địa Lý Thực Tế trong Xưởng hoặc Khu Vực Chức Năng**:
  - **Mã vị trí địa lý xưởng**:
    - **`OFF`** / **`A`**: Trước Văn phòng (Office / 前事務所)
    - **`ENT`** / **`E`**: Cửa ra vào (Entrance / 出入口)
    - **`WH`** / **`W`**: Kho tổng / Nhà kho (Warehouse / 倉庫)
    - **`2F`**: Tầng 2 xưởng (2nd Floor / 2階)
    - **`PAC`**: Kệ khuôn đóng gói cất đi - ít dùng (Packed Storage / 梱包保管)
    - **`M06`**, **`M08`**: Gần Máy định hình số 6 / số 8 (Forming Machine #6/#8)
    - **`TW`**: Gần Máy định hình Đài Loan (Taiwan Machine)
    - **`PRS`**: Phía trên các Máy dập (Press area / プレス機上部)
  - **Mã khu vực chức năng**:
    - **`TEF`**: Khu vực Chờ / Mạ Teflon (Teflon Staging)
    - **`REP`**: Khu vực Bảo trì / Sửa chữa khuôn (Repair & Maintenance)
    - **`NEW`**: Khu vực Tiếp nhận khuôn mới (New Tooling Receiving)

### 2. Định Dạng Mã Hiển Thị (`RackLocation`)
- **Tương thích ngược 100% mã cũ**: `71-1`, `70-0` (Kệ 71 - Tầng 1).
- **Cấu trúc linh hoạt mới**: `[MãKhuVực]-[SốGiá]-[SốTầng]` (VD: `OFF-01-2`, `M08-01-1`, `TW-02-1`, `2F-03-1`, `TEF-01`).


