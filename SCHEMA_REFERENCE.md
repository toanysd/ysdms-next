# YSDMS NextGen — Database Schema Reference
> **AI AGENT: Đọc file này TRƯỚC KHI viết bất kỳ Supabase query nào.**
> Đây là nguồn duy nhất (single source of truth) về cấu trúc DB.
> **Cập nhật lần cuối: 2026-08-20** — Phase R1-B0: Đồng bộ Schema Sự Thật (Schema Truth Alignment). Khẳng định kiến trúc SSOT: `products` (Sản phẩm), `design_revisions` (Bản vẽ CAD), `equipment` + `equipment_assignments` (Thiết bị hợp nhất & SET), `work_orders` $\rightarrow$ `jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs` (Luồng sản xuất 4 tầng).

---

## ⚠️ Lưu ý Quan trọng

1. Migration `067_schema_v2_to_v3.sql` và các migration tháng 7-8/2026 đã **DROP và tái tạo** nhiều bảng (loại bỏ `mold_masters`, `mold_revisions`, `company_pn`).
2. Thư mục `migrations/archived/` chứa file cũ **KHÔNG CÒN HIỆU LỰC** — KHÔNG ĐỌC.
3. Nguồn xác minh duy nhất: `src/types/database.types.ts` (tự sinh từ Supabase).
4. **KHÔNG tự sáng tạo cột** — nếu không thấy cột trong file này, cột đó KHÔNG TỒN TẠI.
5. **Bảng User là `employees`**: Bảng chứa thông tin nhân sự/user trong project này là `employees` (KHÔNG phải `profiles` hay `users`). Bắt buộc dùng `REFERENCES employees(employee_id)` ở tất cả các migration.

## ⚠️ CONVENTION CẢNH BÁO: Tên Primary Key

DB này KHÔNG dùng `id` làm PK chung. Quy tắc: PK = `{tên_bảng_số_ít}_id` (trừ một số ngoại lệ lịch sử):

| Bảng | Primary Key | Ghi chú |
|---|---|---|
| `products` | `product_id` | UUID |
| `design_revisions` | `revision_id` | UUID |
| `equipment` | `equipment_id` | UUID |
| `equipment_assignments`| `assignment_id` | UUID |
| `work_orders` | `wo_id` | UUID |
| `jobs` | `job_id` | UUID |
| `job_steps` | `step_id` | UUID |
| `work_logs` | `log_id` | UUID |
| `orders` | `order_id` | UUID |
| `order_lines` | `line_id` | UUID (ngoại lệ, KHÔNG phải order_line_id) |
| `employees` | `employee_id` | UUID |
| `companies` | `company_id` | UUID |

---

## 📐 Sơ đồ Quan hệ Kiến trúc Chính (SSOT 2026-08-20)

```
companies ──┬── company_contacts (1:N)
            ├── delivery_sites (1:N)
            ├── orders (company_id FK) ──┬── order_lines (order_id FK) ──→ products
            │                            └── shipments (order_id FK)
            └── products (company_id FK, NOT NULL)
                    │
                    ▼ (1:N)
            design_revisions (product_id FK)
                    │
                    ▼ (1:N)
            equipment (design_revision_id FK) ──┬── equipment_history (equipment_id FK)
                    ▲                           ├── equipment_photos (equipment_id FK)
                    │                           └── equipment_assignments (N:N SET & Shared)
                    │
            work_orders (product_id, design_revision_id, order_id FK)
                    │
                    ▼ (1:N)
            jobs (equipment_id FK 1:1, work_order_id FK)
                    │
                    ▼ (1:N)
            job_steps (job_id FK) ──┬── [M] 金型 (Mold)
                    │               ├── [P] プラグ (Plug)
                    │               ├── [C] 抜型 (Cutter)
                    │               ├── [W] 水冷盤 (Water Base)
                    │               └── [S] スタッキング (Stacking)
                    ▼ (1:N)
            work_logs (job_id FK, job_step_id FK, employee_id FK)
```

---

## 🔑 Bảng `companies` — Khách hàng / Đối tác / Nhà gia công

```
PK:  company_id        UUID
     company_code      TEXT UNIQUE NOT NULL
     company_name      TEXT NOT NULL
     company_name_romaji TEXT
     company_type      TEXT[]         ← ['CUSTOMER', 'SUPPLIER', 'OUTSOURCE', 'MANUFACTURER', 'DELIVERY_LOCATION']
     parent_company_id UUID → companies(company_id)
     is_active         BOOLEAN DEFAULT true
     tel               TEXT
     fax               TEXT
     address           TEXT
     order_folder_path TEXT
     cad_folder_path   TEXT
     notes             TEXT
```

---

## 🔑 Bảng `company_contacts` — Người liên hệ khách hàng

```
PK:  contact_id     UUID
FK:  company_id     UUID → companies(company_id) NOT NULL
     contact_name   TEXT NOT NULL
     contact_role   TEXT           ← Chức vụ
     contact_tel    TEXT
     contact_email  TEXT
     is_primary     BOOLEAN DEFAULT false
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
     is_active      BOOLEAN DEFAULT true
```

---

## 🔑 Bảng `products` — Sản phẩm / Khay (Single Source of Truth)

> **Tray = Products** — Thực thể trung tâm quản lý mã sản phẩm, khách hàng, quy cách và vòng đời.

```
PK:  product_id          UUID
FK:  company_id          UUID → companies(company_id) NOT NULL  ← BẮT BUỘC
     product_code        TEXT UNIQUE NOT NULL  ← Mã sản phẩm nội bộ YSD (có gạch ngang: ADY-071, JAE-047) — SSOT lookup key
     product_name_internal TEXT               ← Tên hiển thị nội bộ YSD (thường trùng format product_code: ADY-071, TOW-004)
     product_name        TEXT                  ← Tên SP chính thức từ KH trên hợp đồng/hóa đơn (ban đầu có thể NULL)
     product_name_en     TEXT                  ← Tên SP tiếng Anh
     customer_product_name TEXT                ← Mã part hoặc tên sản phẩm phía KH gọi (VD: PART-8802-A)
     product_description TEXT                  ← Mô tả SP / Tên làm việc do KD nhập từ đầu (品名 trên 工程票)
     product_status      TEXT                  ← Trạng thái nghiệp vụ: 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED' | 'MERGED'
     product_lifecycle_status TEXT             ← Vòng đời SP: 'DRAFT' | 'DESIGN' | 'PROTOTYPE' | 'APPROVED' | 'MASS_PRODUCTION' | 'DISCONTINUED'
     requires_prototype_mold BOOLEAN DEFAULT false ← 試作ポケット: Cần làm khuôn thử nghiệm?
     first_shipment_date DATE                  ← 初回出荷日 (Ngày xuất hàng đầu tiên)
     pocket_count        INTEGER               ← Số pocket trên 1 khay (Pockets per tray)
     pieces_per_box      INTEGER               ← Số khay đóng trong 1 thùng
     box_spec            TEXT                  ← Quy cách thùng
     notes               TEXT                  ← Ghi chú tự do
     legacy_id           TEXT                  ← Mã đối soát hệ thống Access cũ
     legacy_specs        JSONB                 ← Thông số thô Access
```

> [!IMPORTANT]
> - `product_code` = **Mã sản phẩm nội bộ YSD** (có gạch ngang, VD: `ADY-071`, `JAE-047`) ← SSOT lookup key trong ETL
> - `product_name_internal` = **Tên hiển thị nội bộ YSD** (thường trùng format với `product_code`, VD: `ADY-071`)
> - ⚠️ Lưu ý: Convention "compact không gạch ngang" (ADY071) chỉ tồn tại trong tài liệu cũ — **không có trong data thực tế**. Không dùng format compact khi lookup DB.
> - `customer_product_name` = **Mã part/tên khách hàng gọi** (thay thế hoàn toàn `company_pn`).
> - `product_description` = **Tên làm việc / mô tả sơ bộ** do KD nhập từ đầu.
> - `company_pn`, `mold_masters` = **DEPRECATED / DROPPED** — Không sử dụng trong code mới.

---


> ⚠️ **LƯU Ý QUAN TRỌNG (Cập nhật 2026-09-02)**
> - `design_revisions` KHÔNG CÓ cột `is_active`. Để kiểm tra revision active/approved, dùng `status = 'APPROVED'`.
> - `products` KHÔNG CÓ cột `design_code`. Cột `design_code` nằm ở `design_revisions`.

## 🔑 Bảng `design_revisions` — Bản Vẽ Kỹ Thuật CAD & Thông Số Thiết Kế

```
PK:  revision_id       UUID
FK:  product_id        UUID → products(product_id) NOT NULL
FK:  company_id        UUID → companies(company_id)
FK:  designer_id       UUID → employees(employee_id)
FK:  plastic_id        UUID → plastic_master(plastic_id)
FK:  cav_type_id       UUID → cav_types(cav_type_id)
FK:  shared_plug_from_design_id UUID → design_revisions(revision_id)
     design_code       TEXT          ← Mã bản vẽ (VD: 'MMT-021 R1', 'TOW-004 R2')
     design_category   TEXT          ← 'MASS_PRODUCTION' | 'PROTOTYPE_POCKET'
     plastic_type_designed TEXT      ← SSOT Nhựa thiết kế (VD: 'PET 透明 1.0t [640] 帯電防止付')
     cutline_length    NUMERIC       ← SSOT Chiều dài đường cắt (mm)
     cutline_width     NUMERIC       ← SSOT Chiều rộng đường cắt (mm)
     cavity_count      INTEGER       ← 取数: Số khay dập trên 1 chu kỳ khuôn (Pieces per mold cycle)
     cavity_pitch_mm   NUMERIC       ← Bước khuôn giữa các cavity (mm)
     machine_feed_pitch_mm NUMERIC   ← Bước tiến nhựa máy định hình (送り mm)
     tolerance_pitch   TEXT          ← Dung sai bước
     corner_r          TEXT          ← Bo góc R (VD: 'R1.5')
     chamfer_c         TEXT          ← Vát cạnh C (VD: 'C1.0')
     draft_angle       TEXT          ← Góc thoát khuôn (Góc rút)
     plug_type         TEXT          ← Loại chày ép: 'NONE' | 'OWNED' | 'SHARED'
     has_separate_cutter BOOLEAN     ← Có dao dập rời (別抜き) không?
     customer_tray_name TEXT         ← Tên khay phía khách hàng
     customer_drawing_no TEXT        ← Số bản vẽ của khách hàng
     customer_equipment_no TEXT      ← Số hiệu thiết bị khách hàng gán
     designer          TEXT          ← Tên người thiết kế (text)
     design_date       DATE          ← Ngày hoàn thành thiết kế
     approved_date     DATE          ← Ngày duyệt thiết kế
     status            TEXT          ← 'DRAFT' | 'APPROVED' | 'REVISED' | 'DISCONTINUED'
     change_summary    TEXT          ← Tóm tắt điểm thay đổi so với phiên bản trước
     cad_folder_path   TEXT          ← Thư mục CAD / DXF
     drawing_pdf_path  TEXT          ← Đường dẫn file PDF bản vẽ
     step_3d_path      TEXT          ← Đường dẫn file 3D STEP
```

---

## 🔑 Bảng `equipment` — Thiết Bị Sản Xuất Thống Nhất (Single Source of Truth)

> ✅ **Kiến trúc Unified Equipment (ADR-001)**: Bảng `equipment` quản lý TOÀN BỘ thiết bị sản xuất
> (Khuôn, Dao cắt, Đế làm mát, Đế khí nén, Khung, Stacking, Plug) trên cùng một bảng chuẩn hóa.
> Thay thế hoàn toàn `physical_molds` và `cutters`.

```
PK:  equipment_id          UUID
     equipment_code        TEXT UNIQUE NOT NULL    ← Mã hệ thống duy nhất (VD: M-TOW004R1, C-TOW004-R1, WB-ZD-01, 1042)
     display_name          TEXT NOT NULL           ← Tên hiển thị (VD: TOW-004 R1, 1042)
     equipment_type        TEXT NOT NULL           ← 'MOLD' | 'CUTTER_INLINE' | 'CUTTER_SEPARATE' | 'WATER_BASE' | 'PRESSURE_BASE' | 'FRAME' | 'STACKING' | 'PLUG'
     sub_type              TEXT                    ← 'PROTOTYPE_POCKET' | 'MASS_PRODUCTION' | ...
     physical_stamp        TEXT                    ← Ký hiệu đóng dấu trên thiết bị
     dimensions            TEXT                    ← Kích thước tổng quát (dài x rộng x cao)
     actual_length_mm      TEXT                    ← Chiều dài thực tế
     actual_width_mm       TEXT                    ← Chiều rộng thực tế
     actual_height_mm      TEXT                    ← Chiều cao thực tế
     actual_weight         TEXT                    ← Trọng lượng thực tế
     material_spec         TEXT                    ← Vật liệu (A5052, SKD11, SS400, ベニヤ木板...)
     piece_count           INTEGER                 ← Số mảnh cấu thành
     copy_number           INTEGER                 ← Số bản sao (bản 1, bản 2...)
FK:  company_id            UUID → companies(company_id)        ← Khách hàng sở hữu
FK:  keeper_company_id     UUID → companies(company_id)        ← Nơi đang bảo quản
FK:  design_revision_id    UUID → design_revisions(revision_id)← Bản vẽ thiết kế tương ứng
FK:  cav_type_id           UUID → cav_types(cav_type_id)       ← Khổ khuôn chuẩn YSD
FK:  current_rack_layer_id UUID → rack_layers(id)              ← Vị trí giá-tầng kho
     device_status         TEXT DEFAULT 'NORMAL'   ← 'NORMAL' | 'REPAIRING' | 'DAMAGED' | 'MAINTENANCE'
     usage_status          TEXT DEFAULT 'STORAGE'  ← 'STORAGE' | 'IN_USE' | 'LOAN' | 'DISPOSED'
     on_checklist          BOOLEAN DEFAULT false
     mold_type             TEXT
     manufacturing_date    DATE                    ← Ngày chế tạo hoàn thành
     entry_date            DATE                    ← Ngày nhập kho
     returned_date         DATE                    ← Ngày trả khách hàng
     disposed_date         DATE                    ← Ngày thanh lý
     qr_uuid               UUID DEFAULT gen_random_uuid()
     legacy_id             TEXT
     legacy_specs          JSONB
     shared_with_code      TEXT                    ← Mã thiết bị dùng chung dao cắt (OCR U2)
     shared_note           TEXT                    ← Ghi chú viết tay về dao cắt dùng chung (OCR U2)
     cost_note             TEXT                    ← Ghi chú đơn giá đặc biệt không phải số (OCR U3)
     notes                 TEXT
```

---

## 🔑 Bảng `equipment_assignments` — Quan Hệ N:N Thiết Bị (SET Gá Lắp & Dùng Chung)

```
PK:  assignment_id         UUID
FK:  primary_equipment_id  UUID → equipment(equipment_id) ON DELETE CASCADE
FK:  related_equipment_id  UUID → equipment(equipment_id) ON DELETE CASCADE
     relationship_type     TEXT DEFAULT 'SET_MEMBER'   ← 'SET_MEMBER' (trong cùng 1 SET máy) | 'SHARED' (dùng chung) | 'COMPATIBLE'
     is_default            BOOLEAN DEFAULT true        ← Cấu hình mặc định khi lên máy
     notes                 TEXT
UNIQUE: (primary_equipment_id, related_equipment_id)
CHECK:  primary_equipment_id <> related_equipment_id
```

---

## 🔑 Bảng `equipment_photos` — Quản Lý Ảnh Chụp Thiết Bị & Khuôn

```
PK:  photo_id          UUID
FK:  equipment_id      UUID → equipment(equipment_id) ON DELETE CASCADE NOT NULL
     storage_path      TEXT NOT NULL   ← Đường dẫn trong Bucket 'equipment-photos'
     file_name         TEXT
     file_size_bytes   BIGINT
     mime_type         TEXT DEFAULT 'image/jpeg'
     photo_type        TEXT DEFAULT 'OVERVIEW'  ← 'OVERVIEW' | 'DETAIL' | 'DAMAGE' | 'MAINTENANCE' | 'DOCUMENT'
     caption           TEXT
     taken_at          TIMESTAMPTZ DEFAULT now()
FK:  taken_by          UUID → employees(employee_id)
     sort_order        INTEGER DEFAULT 0
```

---

## 🔑 Bảng `equipment_loans` — Quản Lý Mượn / Trả / Gia Công Ngoài Khuôn & Dao Cắt (Milestone 18 - Migration 097)

Quản lý toàn diện hồ sơ và vòng đời xuất khuôn, dao cắt ra ngoài nhà máy YSD (Cho mượn `BORROW`, Trả khuôn `RETURN`, Gửi sửa chữa/gia công ngoài `REPAIR_OUT`).

```
PK:  loan_id                 UUID DEFAULT gen_random_uuid()
     loan_code               TEXT UNIQUE NOT NULL  ← Format 'LN-YYYYMMDD-NNN' (auto-generated via trigger trg_set_equipment_loan_code)
     loan_type               TEXT NOT NULL         ← 'BORROW' | 'RETURN' | 'REPAIR_OUT'
     status                  TEXT NOT NULL DEFAULT 'PENDING_APPROVAL'  ← 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'RETURNED' | 'CANCELLED'
FK:  equipment_id            UUID → equipment(equipment_id) ON DELETE RESTRICT NOT NULL
FK:  from_company_id         UUID → companies(company_id) ON DELETE RESTRICT (default YSD)
FK:  to_company_id           UUID → companies(company_id) ON DELETE RESTRICT NOT NULL
FK:  requested_by            UUID → employees(employee_id) ON DELETE SET NULL
FK:  approved_by             UUID → employees(employee_id) ON DELETE SET NULL
     approved_at             TIMESTAMPTZ
     rejection_reason        TEXT
     loan_date               DATE NOT NULL DEFAULT CURRENT_DATE
     scheduled_return_date   DATE  ← Bắt buộc với BORROW/REPAIR_OUT, NULL với RETURN (CHECK chk_scheduled_return_date)
     actual_return_date      DATE
FK:  returned_received_by    UUID → employees(employee_id) ON DELETE SET NULL
     destination_address     TEXT
     contact_person          TEXT
     contact_phone           TEXT
     purpose                 TEXT
     condition_on_loan       TEXT
     condition_on_return     TEXT
     condition_notes         TEXT
     qr_doc_code             TEXT
     created_at              TIMESTAMPTZ DEFAULT now()
     updated_at              TIMESTAMPTZ DEFAULT now()
```

### View `v_equipment_loans_summary`
- View tổng hợp JOIN `equipment`, `companies` (to/from), `employees` (requested/approved/returned_received).
- Tự động tính toán trường `days_overdue` (`INTEGER`) và `is_overdue` (`BOOLEAN`) realtime theo `scheduled_return_date < CURRENT_DATE`.

### Atomic RPC Functions:
1. `fn_dispatch_equipment_loan(p_loan_id, p_employee_id, p_notes)`: Xuất kho chuyển sang `IN_TRANSIT`, cập nhật `equipment.keeper_company_id = to_company_id` và ghi `equipment_ship_logs`.
2. `fn_complete_equipment_loan_return(p_loan_id, p_employee_id, p_new_rack_layer_id, p_condition_on_return, p_notes)`: Hoàn trả nhập kho sang `RETURNED`, cập nhật `equipment.keeper_company_id = YSD`, cập nhật vị trí tầng kệ và ghi `asset_location_logs`.

---

## 🔑 Bảng `work_orders` — Lệnh Sản Xuất / Chế Tạo Khuôn Tổng Thể (Tầng 1 - ADR-002)

> **Quy tắc WO Legacy vs. WO Mới (Cập nhật 2026-09-01)**
> - **Data di trú từ Access:** WO được sinh mã `WO-L-{legacy_no}` tự động khi ETL. Cột `jobs.work_order_id` đã được backfill đầy đủ (203 jobs legacy đã trỏ về đúng WO-L-xxxx).
> - **Khi bóc tách OCR phiếu mới (新規指示):** Nếu sản phẩm đã có WO-L-xxxx, UI bắt buộc người dùng chọn WO-L-xxxx hiện có $\rightarrow$ append thông tin 新規 (Job thiết kế/khuôn mới) vào WO cũ. Không được tạo WO mới trùng lặp.
> - **Gantt group key ưu tiên:** `work_order_id` (uuid) > `baseProdCode` > `product_id` > `job_id`.

```
PK:  wo_id              UUID
     wo_code            TEXT UNIQUE NOT NULL   ← (VD: 'WO-2026-000001')
     wo_name            TEXT NOT NULL          ← (VD: '新規金型製作: TOW-004')
FK:  product_id         UUID → products(product_id)
FK:  design_revision_id UUID → design_revisions(revision_id)
FK:  order_id           UUID → orders(order_id)
FK:  company_id         UUID → companies(company_id)
FK:  case_id            UUID → business_cases(id)
     wo_type            TEXT NOT NULL DEFAULT 'NEW_SET'  ← 'NEW_SET' | 'REPAIR' | 'REMAKE' | 'MODIFICATION' | 'OTHER'
     wo_status          TEXT NOT NULL DEFAULT 'PLANNED'  ← 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
     start_date         TIMESTAMPTZ
     deadline           TIMESTAMPTZ
     completed_at       TIMESTAMPTZ
FK:  responsible_id     UUID → employees(employee_id)
     priority           INTEGER DEFAULT 5
     notes              TEXT
```

---

## 🔑 Bảng `jobs` — Chỉ Thị Gia Công Từng Thiết Bị (Tầng 2 - ADR-002)

```
PK:  job_id              UUID
FK:  work_order_id       UUID → work_orders(wo_id)
FK:  equipment_id        UUID → equipment(equipment_id)      ← 1:1 với Thiết bị gia công
FK:  product_id          UUID → products(product_id)
FK:  design_revision_id  UUID → design_revisions(revision_id)
FK:  job_type_id         TEXT → job_types(job_type_id)
FK:  company_id          UUID → companies(company_id)
FK:  responsible_id      UUID → employees(employee_id)
FK:  outsource_company   UUID → companies(company_id)
FK:  case_id             UUID → business_cases(id)
     job_code            TEXT UNIQUE NOT NULL   ← (VD: 'JOB-TOW004-8981', 'DES-TOW004-01')
     job_name            TEXT NOT NULL          ← (VD: 'TOW-004: 新規金型製作')
     job_category        TEXT                   ← 'THERMOFORMING' | 'MOLD_NEW' | 'MOLD_MODIFY' | 'CUTTER_NEW' | 'EQUIPMENT_NEW' | 'EQUIPMENT_REPAIR' | 'MAINTENANCE' | 'DESIGN' | 'INTERNAL_OPS' | 'OTHER'
     start_date          TIMESTAMPTZ            ← Ngày bắt đầu
     target_completion_date DATE                ← 🏁 完成目標日 (3 ngày làm việc trước ngày xuất hàng khay)
     mold_deadline       TIMESTAMPTZ            ← 🚚 指示納期 / 払出期日 (Bàn giao cho xưởng định hình)
     deadline            TIMESTAMPTZ            ← Kỳ hạn chung Job (= MAX(job_steps.deadline))
     ship_date           TIMESTAMPTZ            ← 📦 出荷予定日 (Ngày xuất hàng khay cho KH)
     completed_date      TIMESTAMPTZ
     estimated_hours     NUMERIC(6,1)
     job_status          TEXT                   ← 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
     priority            INTEGER DEFAULT 5
     notes               TEXT
```

---

## 🔑 Bảng `job_steps` — Thành Phần Song Song Cấu Thành Job (Tầng 3)

```
PK:  step_id              UUID
FK:  job_id               UUID → jobs(job_id) NOT NULL
FK:  item_type_id         INTEGER → item_types(item_type_id)   ← Loại hạng mục (MOLD, PLUG, CUTTER, WATER_BASE, STACKING...)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  assigned_to          UUID → employees(employee_id)
FK:  machine_id           UUID → machines(machine_id)
FK:  outsource_company    UUID → companies(company_id)
     step_no              INTEGER NOT NULL
     step_name            TEXT NOT NULL          ← Tên component (VD: '金型製作', 'プラグ製作', '抜型製作')
     track                TEXT                   ← Component Track: 'MOLD' | 'PLUG' | 'CUTTER' | 'WATER_BASE' | 'STACKING' | 'FRAME' | 'DESIGN'
     type_code            TEXT                   ← Mã viết tắt ('M', 'P', 'C', 'W', 'S', 'F', 'D')
     material_spec        TEXT                   ← Vật liệu (A5052, SKD11, ベニヤ木板...)
     quantity             INTEGER DEFAULT 1
     arrangement          TEXT                   ← 手配: 'REQUIRED' | 'NOT_REQUIRED'
     condition            TEXT                   ← 新規/既存: 'NEW' | 'EXISTING'
     manufacture_location TEXT                   ← 内製/外注: 'IN_HOUSE' | 'OUTSOURCED'
     deadline             TIMESTAMPTZ            ← Kỳ hạn riêng của từng component
     target_completion_date DATE
     estimated_hours      NUMERIC(6,1)
     planned_hours        NUMERIC(6,1)
     actual_hours         NUMERIC(6,1)           ← Tự động tính từ SUM(work_logs.hours_spent)
     progress_percent     INTEGER DEFAULT 0
     step_status          TEXT                   ← 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
     notes                TEXT
```

---

## 🔑 Bảng `work_logs` — Nhật Ký Thao Tác & Giờ Công Thực Tế (Tầng 4)

```
PK:  log_id               UUID
FK:  job_id               UUID → jobs(job_id) NOT NULL
FK:  job_step_id          UUID → job_steps(step_id)
FK:  employee_id          UUID → employees(employee_id) NOT NULL
FK:  processing_code_id   INTEGER → processing_codes(processing_code_id)
FK:  processing_status_id INTEGER → processing_statuses(status_id)
FK:  machine_id           UUID → machines(machine_id)
     work_date            DATE NOT NULL          ← Ngày làm việc thực tế
     hours_spent          NUMERIC(6,2) NOT NULL  ← Số giờ thực tế (hỗ trợ in phiếu A4 và đóng dấu Hanko)
     planned_hours        NUMERIC(6,2)
     is_finished          BOOLEAN DEFAULT false  ← Đã hoàn thành công đoạn chưa?
     quantity_done        INTEGER                ← 良品生産数 (Bắt buộc với THERMOFORMING)
     quantity_ng          INTEGER DEFAULT 0      ← 不良数
     description          TEXT                   ← Chi tiết công việc
     notes                TEXT
```

---

## 📋 Phase Log — Order/Customer Phase (CLOSED 2026-09-01)
### Migrations đã apply production
- **070** (2026-09-01): `orders.order_status` DEFAULT → 'DRAFT', thêm CHECK constraint 6 giá trị, bật RLS
- **071** (2026-09-01): RLS policies `orders_select_authenticated` + `orders_modify_authenticated`
### Routes đã build
- `/master/customers` — Danh sách + Detail 3 tab (Thông tin | Đơn hàng | Sản phẩm), read-only
- `/orders` — Danh sách đơn hàng, filter theo status tab
- `/orders/new` — Tạo đơn Header đơn giản → redirect sang [id]
- `/orders/[id]` — Detail: OrderHeaderForm + Tab Lines (OrderLineForm) + Tab WO (WorkOrderLinker)
### Business Rules đã xác lập
- Order Type: Bán khay nhựa (products) — khuôn/thiết bị đi qua invoices (Phase R5)
- Creation Flow: WO (OCR) tạo trước, Order tạo sau → link thủ công qua WorkOrderLinker
- Status Flow: DRAFT → CONFIRMED → IN_PRODUCTION → SHIPPED → CLOSED (chỉ tiến 1 bước, CANCEL từ DRAFT/CONFIRMED)
- Legacy 1000 orders: giữ nguyên shell CONFIRMED, không backfill order_lines
- Edit lock: order_lines chỉ edit được khi status = DRAFT | CONFIRMED
### Phase tiếp theo open
- Phase R5: Invoices & Công nợ (schema đã có, UI chưa build)
- Phase Plastic WMS

## 🔑 Bảng `orders`, `order_lines`, `shipments` — Đơn Hàng & Giao Hàng

**`orders`**
```
PK:  order_id           UUID
FK:  company_id         UUID → companies(company_id) NOT NULL  ← KHÔNG CÓ customer_id
     order_no           TEXT UNIQUE NOT NULL
     order_date         DATE
     requested_delivery DATE
     order_status       TEXT DEFAULT 'DRAFT'  ('DRAFT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'CLOSED' | 'CANCELLED')
     customer_order_no  TEXT    ← Số PO khách hàng (要求No.)
     lot_no             TEXT    ← Mã Lot / 伝票No.
     notes              TEXT
```

**`order_lines`**
```
PK:  line_id          UUID
FK:  order_id         UUID → orders(order_id) ON DELETE CASCADE NOT NULL
FK:  product_id       UUID → products(product_id) NOT NULL
FK:  design_revision_id UUID → design_revisions(revision_id)  ← NULLABLE (tự lấy bản mới nhất nếu NULL)
FK:  delivery_site_id UUID → delivery_sites(site_id)
     line_no          INTEGER
     quantity         INTEGER NOT NULL
     unit             TEXT DEFAULT 'PCS'
     ship_date        DATE       ← 出荷日 — Ngày xuất hàng (dòng 1 trên phiếu)
     due_date         DATE       ← 納期 — Hạn nhận hàng phía khách (dòng 2 trên phiếu)
     is_free_sample   BOOLEAN DEFAULT false
     charge_type      TEXT       ← 'FREE' | 'PAID' | 'OFFICE_SAMPLE'
     packing_style    TEXT       ← 荷姿 — Quy cách đóng gói
     line_status      TEXT
```

**`shipments`**
```
PK:  shipment_id       UUID PRIMARY KEY
FK:  work_order_id     UUID → work_orders(wo_id) NULL (M101 / ADR-012: WO-direct shipments)
FK:  order_id          UUID → orders(order_id) NULL
FK:  order_line_id     UUID → order_lines(line_id) NULL
FK:  delivery_site_id  UUID → delivery_sites(site_id) NULL
FK:  shipped_by        UUID → employees(employee_id) NULL
     ship_date         DATE NOT NULL
     delivery_method   TEXT (Phương thức vận chuyển)
     tracking_no       TEXT (Mã vận đơn)
     delivery_note_no  TEXT (Mã số phiếu 納品書, e.g. DN-YYYYMMDD-NNN)
     invoice_no        TEXT (Mã hóa đơn)
     status            TEXT ('PREPARING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED')
     shipment_type     TEXT ('STANDARD' | 'DIRECT' | 'SAMPLE')
     service_desc      TEXT
     document_template TEXT
     notes             TEXT
     created_at        TIMESTAMPTZ DEFAULT now()
     updated_at        TIMESTAMPTZ DEFAULT now()
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

## 🔑 Bảng Kho Nhựa (Plastic WMS Phase 2)

**`plastic_master`** — Master danh mục quy cách nhựa
```
PK:  plastic_id       UUID
     plastic_code     TEXT UNIQUE NOT NULL
     plastic_family   TEXT   ← PET, PP, PS, PVC, ABS...
     plastic_subtype  TEXT   ← A-PET, G-PET, Conductive, Silicone-free...
     thickness_mm     NUMERIC
     width_mm         INTEGER
```

**`plastic_manufacturer_map`** — Mapping mã vật liệu của nhà cung cấp
```
PK:  map_id                    UUID
FK:  supplier_id               UUID → companies(company_id)
     commercial_grade_code     TEXT UNIQUE
FK:  plastic_id                UUID → plastic_master(plastic_id)
     mapping_status            TEXT DEFAULT 'needs_confirmation'
     specific_gravity_kg_m3    NUMERIC
     price_jpy_per_kg          NUMERIC
     is_active                 BOOLEAN
```

**`plastic_receipt_roll`** — Quản lý cuộn nhựa thực tế
```
PK:  id                UUID
     roll_barcode      TEXT UNIQUE NOT NULL
FK:  receipt_id        UUID → plastic_receipt(id)
FK:  plastic_id        UUID → plastic_master(plastic_id) NOT NULL
FK:  branch_id         UUID → companies(company_id)   ← Nhà máy lưu trữ (Honsha, Aomori...)
     nominal_length_m  NUMERIC
     current_length_m  NUMERIC
     status            TEXT   ← 'in_stock' | 'in_use' | 'empty' | 'returned'
     location          TEXT
```

**`plastic_adjustment_log`** — Lịch sử xuất/nhập/hao hụt cuộn nhựa
```
PK:  id                UUID
FK:  roll_id           UUID → plastic_receipt_roll(id) NOT NULL
     change_length_m   NUMERIC NOT NULL
     action_type       TEXT   ← 'PRODUCTION' | 'ADJUSTMENT' | 'RETURN'
FK:  work_log_id       UUID → work_logs(log_id)
     operator_name     TEXT
     note              TEXT
```

---

## 🔑 Bảng Tra Cứu & Danh Mục Phụ Trợ

- **`cav_types`**: Khổ kích thước bao ngoài khuôn chuẩn YSD (`cav_type_id`, `cav_code`, `length_mm`, `width_mm`).
- **`processing_codes`**: Mã thao tác kỹ thuật (`processing_code_id`, `processing_name`, `category`, `department_code`).
- **`processing_statuses`**: Trạng thái công đoạn (`status_id`, `status_name_ja`, `status_name_vi`).
- **`item_types`**: Loại hạng mục component (`item_type_id`, `item_type_code`, `item_type_name_ja`).
- **`machines`**: Danh mục máy CNC, Máy định hình, Máy dập (`machine_id`, `machine_code`, `machine_name`, `department`).
- **`racks` & `rack_layers`**: Quản lý Kệ-Tầng kho lưu trữ thiết bị (`rack_id`, `rack_code`, `zone_code`, `layer_no`).
- **`business_cases`**: Quản lý sự việc / Case thương mại (`id`, `case_code`, `title`, `company_id`, `status`).

---

## 💰 PHÂN HỆ CÔNG NỢ & THANH TOÁN (Phase R5)

**`invoices`** — Hóa đơn bán hàng / Yêu cầu thanh toán (SSOT)
```
PK:  invoice_id        UUID DEFAULT gen_random_uuid()
UK:  invoice_number    TEXT NOT NULL UNIQUE (Format: INV-YYYYMM-NNN)
FK:  order_id          UUID → orders(order_id)
FK:  shipment_id       UUID → shipments(shipment_id)
FK:  company_id        UUID → companies(company_id) NOT NULL
     invoice_date      DATE NOT NULL DEFAULT CURRENT_DATE
     due_date          DATE NOT NULL
     total_amount      NUMERIC(12,2) NOT NULL DEFAULT 0
     tax_amount        NUMERIC(12,2) NOT NULL DEFAULT 0
     net_amount        NUMERIC(12,2) GENERATED (total_amount + tax_amount)
     paid_amount       NUMERIC(12,2) NOT NULL DEFAULT 0 (Auto-synced via trigger)
     remaining_amount  NUMERIC(12,2) GENERATED (total_amount + tax_amount - paid_amount)
     status            TEXT NOT NULL DEFAULT 'DRAFT' ('DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED')
     currency          TEXT NOT NULL DEFAULT 'JPY'
     notes             TEXT
FK:  created_by        UUID → auth.users(id)
```

**`invoice_lines`** — Chi tiết dòng sản phẩm / dịch vụ trong hóa đơn
```
PK:  line_id           UUID DEFAULT gen_random_uuid()
FK:  invoice_id        UUID → invoices(invoice_id) ON DELETE CASCADE
FK:  order_line_id     UUID → order_lines(line_id)
     description       TEXT NOT NULL
     quantity          NUMERIC(10,2) NOT NULL DEFAULT 1
     unit_price        NUMERIC(12,2) NOT NULL DEFAULT 0
     line_amount       NUMERIC(12,2) GENERATED (quantity * unit_price)
     sort_order        INT DEFAULT 0
```

**`invoice_payments`** — Lịch sử thanh toán cho hóa đơn
```
PK:  payment_id        UUID DEFAULT gen_random_uuid()
FK:  invoice_id        UUID → invoices(invoice_id) ON DELETE CASCADE
     payment_date      DATE NOT NULL DEFAULT CURRENT_DATE
     amount            NUMERIC(12,2) NOT NULL
     payment_method    TEXT DEFAULT 'BANK_TRANSFER' ('BANK_TRANSFER' | 'CASH' | 'CHECK' | 'OTHER')
     reference_no      TEXT
     notes             TEXT
FK:  created_by        UUID → auth.users(id)
```

**`v_customer_debt_summary`** — View tổng hợp công nợ theo khách hàng
```
     company_id        UUID
     company_name      TEXT
     company_code      TEXT
     total_invoices    INT
     total_billed      NUMERIC
     total_paid        NUMERIC
     total_remaining   NUMERIC (Công nợ hiện tại)
     overdue_count     INT (Số hóa đơn quá hạn chưa thanh toán)
```


---

## 🗄️ QUẢN LÝ MƯỢN / TRẢ / KÝ GỬI THIẾT BỊ (Milestone 18 — ADR-009)

### `equipment_loans` — Bảng quản lý mượn, trả, ký gửi và gia công ngoài thiết bị
```
PK:  loan_id               UUID DEFAULT gen_random_uuid()
     loan_code             TEXT UNIQUE NOT NULL (LN-YYYYMMDD-NNN qua trigger)
FK:  equipment_id          UUID NOT NULL → equipment(equipment_id) ON DELETE RESTRICT
     loan_type             TEXT NOT NULL CHECK ('CUSTOMER_LOAN' | 'RETURN_TO_CUSTOMER' | 'OUTSOURCE_PROCESSING')
     status                TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK ('PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'RETURNED' | 'CANCELLED')
FK:  from_company_id       UUID → companies(company_id)
FK:  to_company_id         UUID NOT NULL → companies(company_id)
     loan_date             DATE NOT NULL DEFAULT CURRENT_DATE
     scheduled_return_date DATE (Bắt buộc với CUSTOMER_LOAN & OUTSOURCE_PROCESSING)
     actual_return_date    DATE
FK:  requested_by          UUID → employees(employee_id)
FK:  approved_by           UUID → employees(employee_id)
     approved_at           TIMESTAMPTZ
     rejection_reason      TEXT
FK:  returned_received_by  UUID → employees(employee_id)
     purpose               TEXT
     condition_on_loan     TEXT
     condition_on_return   TEXT
     condition_notes       TEXT
     photo_overall_url     TEXT (Ảnh toàn cảnh kèm biển tên Kanban)
     photo_nameplate_url   TEXT (Ảnh cận cảnh nameplate/mã khắc tài sản khách)
     qr_doc_code           TEXT (QR định danh phiếu)
     destination_address   TEXT
     contact_person        TEXT
     contact_phone         TEXT
     created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
     updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
```

### `v_equipment_loans_summary` — View tổng hợp phiếu mượn trả kèm tính toán quá hạn & cờ chứng từ
```
     loan_id, loan_code, loan_type, status, loan_date, scheduled_return_date, actual_return_date,
     purpose, condition_on_loan, condition_on_return, condition_notes, qr_doc_code,
     photo_overall_url, photo_nameplate_url, destination_address, contact_person, contact_phone,
     approved_at, rejection_reason, created_at, updated_at,
     days_overdue          INT (Số ngày quá hạn tính từ CURRENT_DATE - scheduled_return_date)
     is_overdue            BOOLEAN (TRUE nếu chưa RETURNED/CANCELLED và đã quá hạn)
     has_valid_loan_document BOOLEAN (TRUE nếu thiết bị có phiếu APPROVED hoặc IN_TRANSIT đang lưu hành — phục vụ kiểm kê hàng năm)
     equipment_id, equipment_code, equipment_name, equipment_type, current_rack_layer_id,
     equipment_current_keeper_id, equipment_owner_company_id,
     to_company_id, to_company_code, to_company_name,
     from_company_id, from_company_code, from_company_name,
     requested_by_id, requested_by_name,
     approved_by_id, approved_by_name,
     returned_received_by_id, returned_received_by_name
```

### `v_work_order_equipment_set` — View phân giải bộ thiết bị SET cho Work Order (Milestone 19 - ADR-010)
```
     wo_id, wo_code, wo_name, wo_status, product_id, design_revision_id,
     equipment_id, equipment_code, equipment_name, equipment_type,
     device_status, usage_status,
     owner_company_id, owner_company_name, keeper_company_id, keeper_company_name,
     current_rack_layer_id, layer_code, rack_code, zone_code,
     assignment_type       TEXT ('PRIMARY_MOLD' | 'SET_MEMBER' | 'CAD_REVISION_MATCH')
     readiness_status      TEXT ('READY' | 'IN_USE' | 'MAINTENANCE' | 'LOANED_OUT' | 'MISSING_RACK' | 'NOT_READY')
     active_loan_code      TEXT (Mã phiếu mượn nếu đang active)
     loan_scheduled_return_date DATE
```

### `fn_get_wo_equipment_set(p_wo_id UUID)` — RPC phân giải 3 tầng SET thiết bị và đánh giá readiness
```
     Trả về JSON:
     - wo_id, wo_code, wo_name, wo_status, product_id, product_code, product_name, design_code, plastic_type_designed, cutline_length, cutline_width
     - primary_mold: thông tin khuôn dập chính kèm vị trí tầng kệ & readiness_status
     - set_members: danh sách các thiết bị thành viên trực tiếp (dao cắt, khung, chày...)
     - suggested_shared: danh sách gợi ý các phụ trợ dùng chung (WATER_BASE, FRAME) tương thích cav_type
### `fn_get_shipment_delivery_note(p_shipment_id UUID)` — RPC lấy dữ liệu in 納品書 (Milestone 21 - Migration 103)
```
     Trả về JSONB đầy đủ để render 納品書 PDF (A4 2 liên chuẩn Nhật):
     - s.*: thông tin đợt xuất hàng (shipment_id, ship_date, shipped_quantity, delivery_note_no, delivery_method, tracking_no, notes, status)
     - WO-direct: wo_code, wo_name, wo_status, product_name, product_name_internal, product_code, plastic_type_designed (SSOT), alt_plastic_type, revision_number, wo_company_name
     - Order-based: order_no, customer_order_no, order_company_name, order_lines (array)
     - Delivery Site: site_name, site_address, site_tel
```

---

## 🔑 Bảng `shipments` & Storage `delivery-docs` — Quản Lý Giao Hàng & 納品書 (Milestone 21)

```
PK:  shipment_id          UUID DEFAULT gen_random_uuid()
FK:  work_order_id        UUID → work_orders(wo_id) ON DELETE SET NULL (Luồng WO-direct, Migration 101)
FK:  order_id             UUID → orders(order_id) ON DELETE SET NULL (Luồng Order-based)
FK:  order_line_id        UUID → order_lines(line_id) ON DELETE SET NULL
FK:  delivery_site_id     UUID → delivery_sites(site_id) ON DELETE SET NULL
FK:  shipped_by           UUID → employees(employee_id) ON DELETE SET NULL
     ship_date            DATE NOT NULL DEFAULT CURRENT_DATE
     shipped_quantity     INTEGER (Migration 102)
     delivery_note_no     TEXT (Format 'DN-YYYYMMDD-NNN')
     delivery_method      TEXT (e.g. '自社便・トラック')
     tracking_no          TEXT
     invoice_no           TEXT
     status               TEXT DEFAULT 'SHIPPED'
     shipment_type        TEXT DEFAULT 'physical' ('physical' | 'service' | 'mixed')
     notes                TEXT
```

Storage Bucket `delivery-docs`:
- Private bucket lưu trữ file PDF 納品書 (`{shipment_id}/{delivery_note_no}.pdf`).
- Giới hạn 10MB/file, MIME type: `application/pdf`.
- Quản lý metadata liên kết qua bảng `shipment_required_docs` (`doc_type = 'delivery_note'`).

---

## 📦 VIEW `v_product_stock_summary` — Finished Goods Inventory Engine (Milestone 23-A)

```
Nguồn SSOT:
- work_logs (wl.quantity_done) → jobs → work_orders → products (total_produced)
- shipments (s.shipped_quantity, status IN ('SHIPPED', 'DELIVERED')) → work_orders → products (total_shipped)
- current_stock = GREATEST(0, total_produced - total_shipped)
- low_stock_threshold = 500
- stock_status:
    - 'OUT_OF_STOCK' (current_stock = 0)
    - 'LOW_STOCK'    (current_stock <= 500)
    - 'IN_STOCK'     (current_stock > 500)
Lọc mặc định: products.product_status = 'ACTIVE'
Migration: 104-B (20260909000002_104_b_v_product_stock_summary.sql)
```

---

## ⛔ BẢNG & CỘT ĐÃ DEPRECATED / DROPPED (TUYỆT ĐỐI KHÔNG DÙNG)


| Tên Bảng / Cột | Trạng Thái | Thay Thế Bằng | Lý Do |
|---|---|---|---|
| `mold_masters` | **DROPPED** | `products` | Tray = Products (Đã gộp hoàn toàn) |
| `mold_revisions` | **DROPPED** | `design_revisions` | Bảng trung gian dư thừa đã xóa |
| `products.company_pn` | **DROPPED** | `customer_product_name` | Chuẩn hóa tên trường |
| `products.material_id` / `thickness_mm` | **DROPPED** | `design_revisions.plastic_type_designed` | SSOT thuộc về bản vẽ thiết kế CAD |
| `physical_molds` & `cutters` | **DEPRECATED** (Read-only compat) | `equipment` | Unified Equipment SSOT (ADR-001) |
| `auxiliary_equipments` | **DEPRECATED** | `equipment` (`WATER_BASE`, `PRESSURE_BASE`...) | Gộp vào `equipment` |
| `orders.customer_id` | **KHÔNG TỒN TẠI** | `orders.company_id` | FK chuẩn duy nhất là `company_id` |
