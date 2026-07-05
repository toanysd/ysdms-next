# YSDMS NextGen — Database Schema Reference
> **AI AGENT: Đọc file này TRƯỚC KHI viết bất kỳ Supabase query nào.**
> Đây là nguồn duy nhất (single source of truth) về cấu trúc DB.
> **Cập nhật lần cuối: 2026-07-02** — Bổ sung manufacturing_date (physical_molds), plastic_type_designed/tray_info (design_revisions), plug_type refactoring.

---

## ⚠️ Lưu ý Quan trọng

1. Migration `067_schema_v2_to_v3.sql` đã **DROP và tái tạo** nhiều bảng.
2. Thư mục `migrations/archived/` chứa file cũ **KHÔNG CÒN HIỆU LỰC** — KHÔNG ĐỌC.
3. Nguồn xác minh duy nhất: `src/types/database.types.ts` (tự sinh từ Supabase).
4. **KHÔNG tự sáng tạo cột** — nếu không thấy cột trong file này, cột đó KHÔNG TỒN TẠI.

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
     site_code      TEXT NOT NULL
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
     product_name        TEXT          ← Tên SP chính thức từ KH (NULL nếu chưa xác nhận)
     product_name_en     TEXT          ← Tên SP tiếng Anh
     product_name_internal TEXT        ← Tên nội bộ YSD (hiển thị: ADY-071)
     company_pn          TEXT          ← ⚠️ DEPRECATED — Phase 2 sẽ xóa/rename
     product_status      TEXT          ← (KHÔNG phải 'status')
     pocket_count        INTEGER
     pieces_per_box      INTEGER
     box_spec            TEXT
     notes               TEXT          ← Ghi chú / tạm chứa mô tả SP (Phase 2: product_description)
     date_entry          DATE
     legacy_id           TEXT
     legacy_specs        JSONB
```

> [!CAUTION]
> - `product_code` = **mã nội bộ YSD compact** (ADY071, bỏ gạch ngang). KHÔNG phải tên sản phẩm.
> - `product_name_internal` = **tên nội bộ YSD hiển thị** (ADY-071, giữ gạch ngang)
> - `product_name` = **tên chính thức từ khách hàng** (dùng cho hóa đơn). Ban đầu NULL.
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
     customer_order_no  TEXT    ← Số PO phía khách hàng
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
FK:  delivery_site_id UUID → delivery_sites(site_id)
     line_no          INTEGER
     quantity         INTEGER
     unit             TEXT  (default 'PCS')
     due_date         DATE
     line_status      TEXT
```

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
     cavity_count      INTEGER
     corner_r          TEXT
     chamfer_c         TEXT
     draft_angle       TEXT
     pitch_mm          NUMERIC
     orientation       TEXT
     setup_type        TEXT
     plug_type         TEXT          ← ['NONE', 'OWNED', 'SHARED']
     has_separate_cutter BOOLEAN
     customer_tray_name TEXT        ← Tên khay từ khách hàng (CustomerTrayName)
     plastic_type_designed TEXT     ← Loại nhựa thiết kế (DesignForPlasticType)
     tray_info         TEXT          ← Thông tin khay cho chỉ thị (TrayInfoForMoldDesign)
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

## 🔑 Bảng `mold_revisions` — Phiên bản Khuôn

```
PK:  mold_revision_id    UUID
FK:  mold_master_id      UUID → mold_masters(mold_master_id)
FK:  design_revision_id  UUID → design_revisions(revision_id)
     revision_code       TEXT
     revision_name       TEXT
```

---

## 🔑 Bảng `physical_molds` — Khuôn Vật lý

```
PK:  physical_mold_id    UUID
FK:  mold_revision_id    UUID → mold_revisions(mold_revision_id)
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
FK:  production_order_id UUID → production_orders(po_id)
FK:  company_id          UUID → companies(company_id)
FK:  responsible_id      UUID → employees(employee_id)
FK:  outsource_company   UUID → companies(company_id)
     job_code            TEXT UNIQUE NOT NULL
     job_name            TEXT NOT NULL
     start_date          TIMESTAMPTZ    ← Ngày bắt đầu
     ship_date           TIMESTAMPTZ    ← Ngày xuất hàng khay (Tham khảo)
     mold_deadline       TIMESTAMPTZ    ← Kỳ hạn Khuôn (Thường là ship_date - 2 ngày)
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

## 🔑 Bảng `job_steps` — Các công đoạn của Job

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

## 🔑 Bảng `job_steps` — Các Hạng mục (Level 2) của Job

```
PK:  step_id              UUID
FK:  job_id               UUID → jobs(job_id) NOT NULL
FK:  item_type_id         INTEGER → item_types(item_type_id)   ← Loại hạng mục (MOLD, PLUG...)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  outsource_company    UUID → companies(company_id)
     step_no              INTEGER NOT NULL
     step_name            TEXT NOT NULL
     step_status          TEXT
     track                TEXT          ← (MOLD, PLUG, CUTTER...)
     deadline             TIMESTAMPTZ   ← Kỳ hạn riêng của từng hạng mục
     drawing_receipt_date TIMESTAMPTZ   ← Ngày nhận bản vẽ
     estimated_hours      NUMERIC(6,1)
     planned_hours        NUMERIC(6,1)
     actual_hours         NUMERIC(6,1)
     machining_location   TEXT
     set_info             TEXT
     tehai_info           TEXT
     notes                TEXT
```

---

## 🔑 Bảng `work_logs` — Nhật ký Thao tác (Level 3)

```
PK:  log_id               UUID
FK:  job_step_id          UUID → job_steps(step_id) NOT NULL
FK:  job_id               UUID → jobs(job_id)
FK:  employee_id          UUID → employees(employee_id)
FK:  processing_code_id   INTEGER → processing_codes(processing_code_id)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  machine_id           UUID → machines(machine_id)
     work_date            DATE NOT NULL
     hours_spent          NUMERIC(6,2)
     planned_hours        NUMERIC(6,2)
     planned_date         DATE
     quantity_done        INTEGER
     is_finished          BOOLEAN
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
