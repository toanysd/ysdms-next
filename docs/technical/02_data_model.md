# 02 — MÔ HÌNH DỮ LIỆU & TỪ ĐIỂN DỮ LIỆU (Data Model & Data Dictionary)

> **Phiên bản:** 1.1  
> **Ngày tạo:** 2026-07-02  
> **Cập nhật:** 2026-07-09 (v1.1 — Thêm order_lines chi tiết + design_revision_id)  
> **Nguồn:** `src/types/database.types.ts` (auto-generated, 5283 dòng)  
> **Schema Version:** V3 (sau migration 067 + extensions)

---

## MỤC LỤC

1. [Tổng Quan Schema](#1-tổng-quan-schema)
2. [Nhóm A: Master Data](#2-nhóm-a-master-data)
3. [Nhóm B: Tooling Hierarchy](#3-nhóm-b-tooling-hierarchy)
4. [Nhóm C: Job Management](#4-nhóm-c-job-management)
5. [Nhóm D: Orders & Production](#5-nhóm-d-orders--production)
6. [Nhóm E: Equipment Lifecycle](#6-nhóm-e-equipment-lifecycle)
7. [Nhóm F: Quality & Inspection](#7-nhóm-f-quality--inspection)
8. [Nhóm G: System & Support](#8-nhóm-g-system--support)
9. [Enums & Constants](#9-enums--constants)
10. [RPC Functions](#10-rpc-functions)
11. [Quy Tắc FK & Constraints](#11-quy-tắc-fk--constraints)

---

## 1. Tổng Quan Schema

### 1.1 Thống Kê

| Metric | Giá trị |
|--------|---------|
| Tổng số bảng YSDMS | **72** |
| Bảng `omni_*` (app khác) | 8 — **CẤM CHẠM** |
| Enums | 2 (`asset_type`, `equipment_status`) |
| Views | 0 |
| RPC Functions | 10 |

### 1.2 Phân Nhóm Bảng

| Nhóm | Số bảng | Bảng chính |
|------|---------|------------|
| A. Master Data | 10 | companies, products, employees, machines, materials |
| B. Tooling Hierarchy | 20 | mold_masters, design_revisions, physical_molds, cutters |
| C. Job Management | 10 | jobs, job_steps, work_logs, processing_codes |
| D. Orders & Production | 11 | orders, order_lines, production_orders, shipments |
| E. Equipment Lifecycle | 18 | mold_maintenance, mold_photos, mold_inventory_* |
| F. Quality & Inspection | 4 | inspections, tray_inspections, defect_reports |
| G. System & Support | 5 | audit_logs, asset_location_logs, racks, rack_layers |

---

## 2. Nhóm A: Master Data

### companies — Khách hàng / Nhà cung cấp (得意先・取引先)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `company_id` | UUID | PK | ID công ty |
| `company_code` | TEXT | NOT NULL | Mã viết tắt (VD: JAE, SMK, TE) |
| `company_name` | TEXT | NOT NULL | Tên đầy đủ |
| `company_name_romaji` | TEXT | ✓ | Tên romaji |
| `company_type` | TEXT[] | ✓ | Mảng: CUSTOMER, SUPPLIER, OUTSOURCE |
| `parent_company_id` | UUID | ✓ | FK → companies (HQ/Branch) |
| `address` | TEXT | ✓ | Địa chỉ |
| `tel` | TEXT | ✓ | Số điện thoại |
| `fax` | TEXT | ✓ | Fax |
| `order_folder_path` | TEXT | ✓ | Đường dẫn thư mục đơn hàng |
| `cad_folder_path` | TEXT | ✓ | Đường dẫn thư mục CAD |
| `is_active` | BOOLEAN | ✓ | Còn hoạt động? |
| `legacy_id` | TEXT | ✓ | ID cũ từ Access |
| `legacy_specs` | JSONB | ✓ | Dữ liệu dư |
| `notes` | TEXT | ✓ | Ghi chú |
| `created_at` | TIMESTAMP | ✓ | |
| `updated_at` | TIMESTAMP | ✓ | |
| `updated_by` | TEXT | ✓ | |

**FKs:** `parent_company_id → companies.company_id` (self-ref)
**Bảng con:** company_contacts, delivery_sites

---

### products — Sản phẩm / Khay (製品・トレイ)

> **Vai trò kép:** Sản phẩm đồng thời là Master Entity cho cả khay và khuôn.
> `product_code` = mã nội bộ YSD = Master Mold Code.

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `product_id` | UUID | PK | |
| `product_code` | TEXT | NOT NULL | Mã nội bộ YSD (VD: JAE-036) |
| `product_name` | TEXT | ✓ | Tên sản phẩm (= mã khuôn) |
| `product_name_en` | TEXT | ✓ | Tên tiếng Anh |
| `product_name_internal` | TEXT | ✓ | Tên nội bộ YSD |
| `company_id` | UUID | NOT NULL | FK → companies (khách hàng sở hữu) |
| `company_pn` | TEXT | ✓ | Mã sản phẩm phía khách hàng |
| `product_status` | TEXT | ✓ | ACTIVE / ARCHIVED |
| `mold_master_id` | UUID | ✓ | FK → mold_masters (**sẽ bỏ khi merge**) |
| `pocket_count` | INT | ✓ | Số pocket trên 1 khay |
| `pieces_per_box` | INT | ✓ | Số khay/thùng |
| `box_spec` | TEXT | ✓ | Thông số đóng thùng |
| `date_entry` | TEXT | ✓ | Ngày nhập |
| `legacy_id` | TEXT | ✓ | |
| `legacy_specs` | JSONB | ✓ | |
| `notes` | TEXT | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**FKs:** `company_id → companies`, `mold_master_id → mold_masters`

---

### employees, machines, materials, cav_types, destinations

*(Bảng lookup — chi tiết đầy đủ xem `database.types.ts`)*

| Bảng | PK | Mô tả | Cột chính |
|------|----|-------|-----------|
| `employees` | employee_id | Nhân viên | employee_code, employee_name, role |
| `machines` | machine_id | Máy móc | machine_code, machine_name, machine_type |
| `materials` | material_id | Vật liệu nhựa | material_code, material_name, supplier_id→companies |
| `cav_types` | cav_type_id | Quy cách khung CAV | type_code, type_name, dimensions |
| `destinations` | destination_id | Điểm đến | destination_name |

---

## 3. Nhóm B: Tooling Hierarchy

### 3.1 Hierarchy Overview

```
products (Master Entity)
  └→ mold_masters (20 cột) ← SẼ MERGE VÀO products
      ├→ design_revisions (46 cột) — Phiên bản thiết kế
      │   ├→ cutters (36 cột) — Dao cắt
      │   └→ mold_design_cutters — Junction design↔cutter
      ├→ mold_revisions (13 cột) — Phiên bản gia công
      │   └→ physical_molds (28 cột) — Khuôn vật lý
      └→ cutter_masters (10 cột) ← SẼ BỊ LOẠI BỎ
```

### mold_masters — Master Khuôn (金型マスター) ⚠️ SẼ MERGE VÀO products

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `mold_master_id` | UUID | PK | |
| `mold_master_code` | TEXT | NOT NULL | Mã master (VD: DMID-162-MM) |
| `mold_master_name` | TEXT | NOT NULL | Tên (VD: ADY-071) |
| `company_id` | UUID | NOT NULL | FK → companies |
| `product_id` | UUID | ✓ | FK → products |
| `designer_id` | UUID | ✓ | FK → employees |
| `cad_folder_path` | TEXT | ✓ | |
| `mold_class` | TEXT | ✓ | STD / CUSTOM |
| `mold_source` | TEXT | ✓ | INTERNAL / EXTERNAL |
| `status` | TEXT | ✓ | ACTIVE / ARCHIVED |
| `legacy_id` | TEXT | ✓ | |
| `legacy_specs` | JSONB | ✓ | |
| `notes`, `created_at`, `updated_at`, `updated_by` | | ✓ | |

**FKs:** `company_id → companies`, `product_id → products`, `designer_id → employees`

---

### design_revisions — Phiên Bản Thiết Kế (設計版) ⭐ BẢNG LỚN NHẤT

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `revision_id` | UUID | PK | |
| `design_code` | TEXT | NOT NULL | Mã thiết kế (VD: JAE036R2) |
| `mold_master_id` | UUID | ✓ | FK → mold_masters |
| `company_id` | UUID | ✓ | FK → companies |
| `designer_id` | UUID | ✓ | FK → employees |
| `cav_type_id` | UUID | ✓ | FK → cav_types |
| **— Trạng thái —** | | | |
| `status` | TEXT | ✓ | DRAFT / SUBMITTED / APPROVED / REJECTED |
| `approved_date` | DATE | ✓ | Ngày khách duyệt |
| `revision_number` | INT | ✓ | Số thứ tự phiên bản |
| `version_note` | TEXT | ✓ | Ghi chú phiên bản |
| **— Kích thước (mm) —** | | | |
| `design_length` | NUMERIC | ✓ | Chiều dài khuôn |
| `design_width` | NUMERIC | ✓ | Chiều rộng khuôn |
| `design_height` | NUMERIC | ✓ | Chiều cao khuôn |
| `design_depth` | NUMERIC | ✓ | Chiều sâu khuôn |
| `design_weight` | TEXT | ✓ | Trọng lượng |
| **— Cutline (đường cắt) —** | | | |
| `cutline_length` | NUMERIC | ✓ | Chiều dài đường cắt |
| `cutline_width` | NUMERIC | ✓ | Chiều rộng đường cắt |
| **— Thông số kỹ thuật —** | | | |
| `cavity_count` | INT | ✓ | Số mặt trên khuôn (面取数) |
| `pocket_numbers` | INT | ✓ | Số pocket trên khay |
| `pitch_mm` | NUMERIC | ✓ | Khoảng cách pitch |
| `corner_r` | TEXT | ✓ | Bán kính bo (R) |
| `chamfer_c` | TEXT | ✓ | Vát góc (C) |
| `draft_angle` | TEXT | ✓ | Góc thoát |
| `undercut_spec` | TEXT | ✓ | Thông số undercut (VD: "8.6x5") |
| `under_depth` | TEXT | ✓ | Độ sâu undercut |
| **— Cấu hình —** | | | |
| `orientation` | TEXT | ✓ | 普通 (thường) / 逆型 (ngược) |
| `setup_type` | TEXT | ✓ | 上型 (trên) / 下型 (dưới) |
| `has_plug` | BOOLEAN | ✓ | Có plug hỗ trợ? |
| `has_separate_cutter` | BOOLEAN | ✓ | Có dao cắt riêng? (別抜き) |
| `plastic_type_designed` | TEXT | ✓ | Loại nhựa thiết kế |
| **— Thông tin khách hàng —** | | | |
| `customer_tray_name` | TEXT | ✓ | Tên khay phía KH |
| `customer_drawing_no` | TEXT | ✓ | Mã bản vẽ KH |
| `customer_equipment_no` | TEXT | ✓ | Mã thiết bị KH |
| `tray_info` | TEXT | ✓ | Mô tả sản phẩm cho chỉ thị |
| `text_content` | TEXT | ✓ | Chữ khắc trên khay |
| `designer` | TEXT | ✓ | Tên người thiết kế (text) |
| **— File —** | | | |
| `cad_folder_path` | TEXT | ✓ | Đường dẫn thư mục CAD |
| `drawing_pdf_path` | TEXT | ✓ | Đường dẫn PDF bản vẽ |
| `step_3d_path` | TEXT | ✓ | Đường dẫn file 3D (.step) |
| `design_date` | DATE | ✓ | Ngày thiết kế |
| `data_input_date` | TEXT | ✓ | Ngày nhập dữ liệu |
| **— Legacy —** | | | |
| `legacy_id`, `legacy_specs`, `notes` | | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**Tổng: 46 cột**
**FKs:** `mold_master_id → mold_masters`, `company_id → companies`, `designer_id → employees`, `cav_type_id → cav_types`

---

### mold_revisions — Phiên Bản Gia Công (金型改訂)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `revision_id` | UUID | PK | |
| `mold_master_id` | UUID | NOT NULL | FK → mold_masters |
| `design_revision_id` | UUID | ✓ | FK → design_revisions (bản thiết kế nào) |
| `revision_code` | TEXT | ✓ | Mã phiên bản (VD: JAE-036 R2) |
| `revision_name` | TEXT | NOT NULL | Tên phiên bản |
| `effective_date` | DATE | ✓ | Ngày bắt đầu sử dụng |
| `revision_reason` | TEXT | ✓ | Lý do: 初回製作, 追加ポケット, 金型修正 |
| `is_active` | BOOLEAN | ✓ | Phiên bản đang lưu hành |
| `legacy_id`, `legacy_specs` | | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**Tổng: 13 cột**

---

### physical_molds — Khuôn Vật Lý (金型実物)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `physical_mold_id` | UUID | PK | |
| `system_code` | TEXT | NOT NULL | Mã hệ thống (VD: JAE036R2) |
| `display_name` | TEXT | NOT NULL | Tên hiển thị (VD: JAE-036 R2) |
| `mold_revision_id` | UUID | NOT NULL | FK → mold_revisions |
| `cav_type_id` | UUID | ✓ | FK → cav_types |
| `keeper_company_id` | UUID | ✓ | FK → companies (đơn vị lưu giữ) |
| `current_rack_layer_id` | UUID | ✓ | FK → rack_layers (vị trí kệ) |
| **— Kích thước thực tế —** | | | |
| `actual_length_mm` | TEXT | ✓ | Chiều dài thực |
| `actual_width_mm` | TEXT | ✓ | Chiều rộng thực |
| `actual_height_mm` | TEXT | ✓ | Chiều cao thực |
| `actual_weight` | TEXT | ✓ | Trọng lượng thực |
| `piece_count` | INT | ✓ | Số mảnh |
| **— Trạng thái —** | | | |
| `device_status` | TEXT | ✓ | Tình trạng thiết bị |
| `usage_status` | TEXT | ✓ | Tình trạng sử dụng |
| `mold_type` | TEXT | ✓ | Loại khuôn |
| `on_checklist` | BOOLEAN | ✓ | Có trong danh sách kiểm kê |
| **— Thông tin khác —** | | | |
| `copy_number` | INT | ✓ | Số bản sao (N1, N2...) |
| `physical_stamp` | TEXT | ✓ | Tem vật lý |
| `qr_uuid` | TEXT | ✓ | UUID cho QR code |
| `mold_entry_date` | DATE | ✓ | Ngày nhập khuôn |
| `returned_date` | DATE | ✓ | Ngày trả về |
| `disposed_date` | DATE | ✓ | Ngày hủy bỏ |
| `legacy_id`, `legacy_specs`, `notes` | | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**Tổng: 28 cột**
**FKs:** `mold_revision_id → mold_revisions`, `cav_type_id → cav_types`, `keeper_company_id → companies`, `current_rack_layer_id → rack_layers`

---

### cutters — Dao Cắt (抜型 / カッター)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `cutter_id` | UUID | PK | |
| `cutter_no` | TEXT | NOT NULL | Số hiệu |
| `cutter_name` | TEXT | NOT NULL | Tên dao cắt |
| `cutter_design_code` | TEXT | ✓ | Mã thiết kế |
| `design_revision_id` | UUID | ✓ | FK → design_revisions (link trực tiếp) |
| `cutter_master_id` | UUID | ✓ | FK → cutter_masters (**sẽ bỏ**) |
| `company_id` | UUID | ✓ | FK → companies (KH sở hữu) |
| `keeper_company_id` | UUID | ✓ | FK → companies (đơn vị giữ) |
| `storage_company_id` | UUID | ✓ | FK → companies (đơn vị lưu trữ) |
| `current_rack_layer_id` | UUID | ✓ | FK → rack_layers |
| `item_type_id` | INT | ✓ | FK → item_types |
| **— Kích thước —** | | | |
| `cutter_length_mm` | NUMERIC | ✓ | Chiều dài dao |
| `cutter_width_mm` | NUMERIC | ✓ | Chiều rộng dao |
| `cutter_height_mm` | NUMERIC | ✓ | Chiều cao dao |
| `cutline_length` | NUMERIC | ✓ | Chiều dài cutline |
| `cutline_width` | NUMERIC | ✓ | Chiều rộng cutline |
| `post_cut_length` | NUMERIC | ✓ | Kích thước sau cắt |
| `post_cut_width` | NUMERIC | ✓ | |
| `pitch_mm` | NUMERIC | ✓ | Pitch |
| `corner_r` | TEXT | ✓ | Bo góc |
| `chamfer_c` | TEXT | ✓ | Vát |
| `cavity_count` | TEXT | ✓ | Số mặt cắt |
| **— Phân loại —** | | | |
| `cutter_type` | TEXT | ✓ | 別抜き, 別抜き+In-Line |
| `base_type` | TEXT | ✓ | Loại base |
| `plastic_cut_type` | TEXT | ✓ | Loại cắt nhựa |
| `cutter_presence` | BOOLEAN | ✓ | Có tại kho? |
| `usage_status` | TEXT | ✓ | Tình trạng sử dụng |
| `manufacture_date` | DATE | ✓ | Ngày sản xuất |
| `date_entry` | DATE | ✓ | Ngày nhập |
| `qr_uuid` | TEXT | ✓ | QR code UUID |
| `legacy_id`, `legacy_specs`, `notes` | | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**Tổng: 36 cột**

---

### cutter_masters — Master Dao Cắt ⚠️ SẼ BỊ LOẠI BỎ

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `cutter_master_id` | UUID | PK | |
| `cutter_master_code` | TEXT | NOT NULL | |
| `cutter_master_name` | TEXT | NOT NULL | |
| `mold_master_id` | UUID | ✓ | FK → mold_masters |
| `company_id` | UUID | ✓ | FK → companies |
| `status` | TEXT | ✓ | |
| `legacy_id`, `legacy_specs` | | ✓ | |
| `created_at`, `updated_at` | | ✓ | |

**Tổng: 10 cột — SẼ BỊ DROP trong migration tương lai**

---

## 4. Nhóm C: Job Management

### jobs — Đơn Gia Công (ジョブ)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `job_id` | UUID | PK | |
| `job_code` | TEXT | NOT NULL | Mã job (bỏ dấu: JAE036R2) |
| `job_name` | TEXT | NOT NULL | Tên job (= tên khuôn) |
| `job_type_id` | UUID | NOT NULL | FK → job_types |
| `design_revision_id` | UUID | ✓ | FK → design_revisions |
| `physical_mold_id` | UUID | ✓ | FK → physical_molds |
| `mold_master_id` | UUID | ✓ | FK → mold_masters |
| `company_id` | UUID | ✓ | FK → companies (nơi gia công) |
| `outsource_company` | UUID | ✓ | FK → companies (gia công ngoài) |
| `responsible_id` | UUID | ✓ | FK → employees (người phụ trách) |
| `production_order_id` | UUID | ✓ | FK → production_orders |
| **— Thời gian —** | | | |
| `start_date` | DATE | ✓ | Ngày bắt đầu |
| `deadline` | DATE | ✓ | Hạn chung |
| `mold_deadline` | DATE | ✓ | Hạn khuôn |
| `ship_date` | DATE | ✓ | Ngày giao |
| `completed_date` | DATE | ✓ | Ngày hoàn thành |
| `year_period` | INT | ✓ | Năm kế hoạch |
| `month_period` | INT | ✓ | Tháng kế hoạch |
| **— Trạng thái —** | | | |
| `job_status` | TEXT | ✓ | PENDING/IN_PROGRESS/COMPLETED/CANCELLED |
| `mold_track_status` | TEXT | ✓ | Tình trạng track khuôn |
| `plug_track_status` | TEXT | ✓ | Tình trạng track plug |
| `overall_progress` | INT | ✓ | Tiến độ % |
| `priority` | INT | ✓ | Độ ưu tiên |
| `approved` | BOOLEAN | ✓ | Đã phê duyệt? |
| `has_plug` | BOOLEAN | ✓ | Có plug? |
| `estimated_hours` | NUMERIC | ✓ | Giờ ước tính |
| `notes` | TEXT | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**Tổng: 30 cột**

---

### job_steps — Bước Gia Công (加工期限 / Processing Deadline)

> Tương đương `tblProcessingDeadline` trong Access

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `step_id` | UUID | PK | |
| `job_id` | UUID | NOT NULL | FK → jobs |
| `step_no` | INT | NOT NULL | Số thứ tự bước |
| `step_name` | TEXT | NOT NULL | Tên bước |
| `step_status` | TEXT | ✓ | Trạng thái bước |
| `item_type_id` | INT | ✓ | FK → item_types (loại: 金型=2, プラグ=3, 抜型=4...) |
| `processing_status_id` | INT | ✓ | FK → processing_statuses (1=未確認...F=完了) |
| `assigned_to` | UUID | ✓ | FK → employees |
| `machine_id` | UUID | ✓ | FK → machines |
| `outsource_company` | UUID | ✓ | FK → companies |
| `track` | TEXT | ✓ | Track (MOLD/PLUG) |
| **— Thời gian —** | | | |
| `deadline` | DATE | ✓ | Hạn bước |
| `planned_start` | DATE | ✓ | |
| `planned_end` | DATE | ✓ | |
| `planned_hours` | NUMERIC | ✓ | |
| `estimated_hours` | NUMERIC | ✓ | |
| `actual_hours` | NUMERIC | ✓ | |
| `drawing_receipt_date` | DATE | ✓ | Ngày nhận bản vẽ |
| **— Thông tin khác —** | | | |
| `machining_location` | TEXT | ✓ | Nơi gia công |
| `set_info` | TEXT | ✓ | Thông tin setup |
| `tehai_info` | TEXT | ✓ | Thông tin chuẩn bị |
| `is_overtime` | BOOLEAN | ✓ | Có tăng ca? |
| `notes` | TEXT | ✓ | |
| `created_at`, `updated_at` | | ✓ | |

**Tổng: 25 cột**

---

### work_logs — Nhật Ký Giờ Làm (作業日報)

> Tương đương `tblWorkLog` trong Access

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `log_id` | UUID | PK | |
| `job_id` | UUID | NOT NULL | FK → jobs |
| `job_step_id` | UUID | ✓ | FK → job_steps |
| `employee_id` | UUID | ✓ | FK → employees |
| `processing_code_id` | INT | ✓ | FK → processing_codes (nội dung công việc) |
| `processing_status_id` | INT | ✓ | FK → processing_statuses |
| `company_id` | UUID | ✓ | FK → companies |
| `machine_id` | UUID | ✓ | FK → machines |
| `hours_spent` | NUMERIC | ✓ | Số giờ làm (VD: 2.5) |
| `work_date` | DATE | ✓ | Ngày làm |
| `planned_date` | DATE | ✓ | Ngày kế hoạch |
| `planned_hours` | NUMERIC | ✓ | Giờ kế hoạch |
| `quantity_done` | INT | ✓ | Số lượng hoàn thành |
| `is_finished` | BOOLEAN | ✓ | Hoàn thành? |
| `description` | TEXT | ✓ | Mô tả |
| `contact_content` | TEXT | ✓ | Nội dung liên lạc |
| `notes` | TEXT | ✓ | |
| `created_at` | TIMESTAMP | ✓ | |

**Tổng: 18 cột**

---

### Lookup Tables (Job Management)

#### item_types — Phân loại Hạng mục / Job Item Type (Level 2)
> 11 mục (VD: MOLD, PLUG, CUTTER) tương ứng `tblItemType`. Dùng thay thế cho `processing_items` đã bị drop.

| ID | Tên tiếng Nhật | Tên tiếng Việt | Mã |
|----|----------------|----------------|----|
| 1 | アルミ材 | Nhôm | ALUMI |
| 2 | 金型 | Khuôn | MOLD |
| 3 | プラグ | Plug | PLUG |
| 4 | 抜型 | Dao cắt | CUTTER |

#### processing_codes — Nội Dung Gia Công (Level 3)

| ID | Tên | Ghi chú |
|----|-----|---------|
| 10 | 金型演算＆加工 | Mold calculation & machining |
| 11 | 本型穴あけ | Main mold drilling |
| 12 | 本型ミガキ | Main mold polishing |
| 13 | 本型ネル貼り | Main mold flannel pasting |
| 15 | 金型加工 | Mold machining |
| 20 | 試作金型演算＆加工 | Prototype mold calc & machining |
| 30 | 設計 | Design |
| 31 | プラグ演算＆加工 | Plug calc & machining |
| 40 | スタッキング | Stacking |
| 42 | 金型・プラグ・ベース修理 | Repair |
| 50 | 5S | 5S |
| 54 | メンテナンス | Maintenance |
| 250 | 事務 | Office/Admin |
| 999 | 会議 | Meeting |

*(45 mã tổng — xem CSV `processingcode.csv` cho đầy đủ)*

#### processing_items — Hạng Mục Gia Công (加工項目)

| ID | Tên JA | Tên VI/EN |
|----|--------|-----------|
| 1 | 金型 | Mold |
| 2 | 試作ポケット | Prototype Pocket |
| 3 | 水冷盤 | Water-cooling plate |
| 6 | プラグ | Plug |
| 10 | 社内作業 | In-house work |
| 12 | 成形 | Forming/Molding |
| 14 | 出荷 | Shipping |
| 17 | メンテナンス | Maintenance |
| 22 | 抜き型 | Die-cutting mold |

*(21 mục tổng)*

#### processing_statuses — Tình Trạng Gia Công (加工状況)

| ID | Mã | Tên JA | Tên VI |
|----|-----|--------|--------|
| 1 | 0 | 未確認 | Chưa xác nhận |
| 2 | 1 | プログラム | Program |
| 3 | 2 | 機械加工 | Machining |
| 4 | 3 | 穴あけ | Drilling |
| 5 | 4 | ミガキ | Polishing |
| 6 | 5 | プラグ作成 | Plug creation |
| 7 | 6 | ネル貼り | Flannel pasting |
| 8 | F | 完了 | Finished |
| 9 | N | 進行中 | In Progress |
| 10 | R | REQUEST | Request |
| 11 | ZF | 材料有 | Material available |
| 12 | ZN | 材料待ち | Waiting for material |
| 13 | ZR | 材料Request | Material Request |

---

## 5. Nhóm D: Orders & Production

### orders — Đơn Hàng (受注)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `order_id` | UUID | PK | |
| `order_no` | TEXT | NOT NULL | Mã đơn hàng |
| `company_id` | UUID | NOT NULL | FK → companies (**KHÔNG phải customer_id**) |
| `order_date` | DATE | NOT NULL | Ngày đặt |
| `order_type` | TEXT | ✓ | design_tray, design_mold, prototype, mass_production |
| `order_status` | TEXT | ✓ | |
| `customer_order_no` | TEXT | ✓ | Mã PO của khách |
| `customer_product_code` | TEXT | ✓ | Mã SP phía KH |
| `company_po` | TEXT | ✓ | |
| `mold_code_ref` | TEXT | ✓ | Mã khuôn tham chiếu |
| `recipient_name` | TEXT | ✓ | Người nhận |
| `order_source` | TEXT | ✓ | |
| `requested_delivery` | DATE | ✓ | Ngày giao yêu cầu |
| `legacy_id`, `notes` | | ✓ | |
| `created_at`, `updated_at`, `updated_by` | | ✓ | |

**FKs:** `company_id → companies` (**BẮT BUỘC**), `lot_no` TEXT (伝票/LOT No.)

### order_lines — Chi tiết Đơn Hàng (受注明細)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `line_id` | UUID | PK | |
| `order_id` | UUID | NOT NULL | FK → orders (ON DELETE CASCADE) |
| `product_id` | UUID | NOT NULL | FK → products |
| `design_revision_id` | UUID | ✓ | FK → design_revisions — **NULLABLE**: NULL = tự lấy revision mới nhất. Chỉ chỉ định khi có nhiều revision cùng active (VD: nhựa khác nhau) |
| `delivery_site_id` | UUID | ✓ | FK → delivery_sites |
| `line_no` | INTEGER | NOT NULL | Số thứ tự dòng |
| `quantity` | INTEGER | NOT NULL | Số lượng |
| `unit` | TEXT | ✓ | Đơn vị (default 'PCS') |
| `due_date` | DATE | ✓ | 納期 — Ngày nhận hàng |
| `ship_date` | DATE | ✓ | 出荷日 — Ngày xuất hàng |
| `is_free_sample` | BOOLEAN | ✓ | Miễn phí? (無償) |
| `charge_type` | TEXT | ✓ | FREE / PAID / OFFICE_SAMPLE |
| `packing_style` | TEXT | ✓ | 荷姿 — Quy cách đóng gói |
| `shipping_notes` | TEXT | ✓ | Ghi chú đóng gói |
| `line_status` | TEXT | ✓ | |
| `created_at`, `updated_at` | | ✓ | |

**FKs:** `order_id → orders`, `product_id → products`, `design_revision_id → design_revisions` (nullable), `delivery_site_id → delivery_sites`

> ⚠️ **Quyết định thiết kế #11 (2026-07-09):** `design_revision_id` được thêm để giải quyết vấn đề thực tế: 1 sản phẩm có nhiều revision cho các loại nhựa khác nhau, đã xảy ra nhầm lẫn. Mặc định NULL = hệ thống tự lấy revision mới nhất. UI tự động cảnh báo khi phát hiện nhiều revision.

### shipments, production_orders

*(Chi tiết xem `SCHEMA_REFERENCE.md`)*

---

## 9. Enums & Constants

```typescript
asset_type: "MOLD" | "CUTTER" | "EQUIPMENT" | "TRAY_SAMPLE" | "PLUG"
equipment_status: "ACTIVE" | "MAINTENANCE" | "BROKEN" | "DISPOSED"
```

---

## 10. RPC Functions

| Function | Args | Returns | Mô tả |
|----------|------|---------|-------|
| `get_dashboard_stats` | (none) | JSON | Thống kê dashboard |
| `get_inventory_dashboard_kpis` | (none) | JSON | KPIs inventory |
| `get_my_role` | (none) | string | Role user hiện tại |
| `create_order_with_items` | header, items | string | Tạo đơn hàng + items |
| `ship_order_items` | order_id, items, notes | JSON | Giao hàng |
| `auto_deduct_plastic_on_production` | order_id | JSON | Trừ nhựa tự động |
| `rpc_deduct_plastic_for_order` | order_id | JSON | Trừ nhựa cho đơn |
| `record_maintenance_and_reset` | 5 params | void | Ghi bảo dưỡng |
| `record_tray_out_safe` | 6 params | JSON | Ghi xuất khay |
| `exec_sql` | query | JSON | Chạy SQL trực tiếp |

---

## 11. Quy Tắc FK & Constraints

### 11.1 FK Quan Trọng — ĐÚNG

```typescript
// Đơn hàng
orders.company_id → companies.company_id    ✅ (NOT NULL)
order_lines.product_id → products           ✅ (NOT NULL)

// Sản phẩm
products.company_id → companies             ✅ (NOT NULL)

// Thiết kế
design_revisions.mold_master_id → mold_masters  ✅
design_revisions.company_id → companies          ✅

// Khuôn
physical_molds.mold_revision_id → mold_revisions ✅ (NOT NULL)

// Job
jobs.design_revision_id → design_revisions       ✅
jobs.job_type_id → job_types                      ✅ (NOT NULL)
job_steps.job_id → jobs                           ✅ (NOT NULL)
work_logs.job_id → jobs                           ✅ (NOT NULL)
```

### 11.2 FK Hỏng — CẦN SỬA

```
mold_design_cutters.mold_design_id → ??? 
  ❌ KHÔNG CÓ FK constraint đến design_revisions
  → CẦN: ALTER TABLE ADD CONSTRAINT mold_design_cutters_design_revision_id_fkey
          FOREIGN KEY (mold_design_id) REFERENCES design_revisions(revision_id)
```

### 11.3 SAI Thường Gặp

```typescript
// ❌ SAI — cột KHÔNG TỒN TẠI
products.product_name_ja        // → Đúng: products.product_name
products.status                 // → Đúng: products.product_status
orders.customer_id              // → Đúng: orders.company_id

// ❌ SAI — bảng ĐÃ BỊ DROP
design_masters, design_projects, mold_designs
```

---

## 12. Quy Tắc Mã Hóa Vị Trí Kệ - Tầng (棚・段位置) Theo Khu Vực Xưởng (2026-08-06)

### 12.1 Định Dạng Mã Vị Trí Địa Lý & Chức Năng (Zone & Area Naming)
- **Không gắn mã vị trí theo loại thiết bị**: Nhằm đảm bảo tính linh hoạt lưu trữ hỗn hợp nhiều loại thiết bị (Khuôn, Dao cắt, Đế nước, Đế khí, Stacking) trên cùng 1 giá.
- **Tiền tố Mã đại diện cho Vị trí Địa lý Thực tế trong Xưởng hoặc Khu vực Chức năng**:
  - **Khu vực Địa lý Xưởng**:
    - **`OFF`** / **`A`**: Trước Văn phòng (Office / 前事務所)
    - **`ENT`** / **`E`**: Cửa ra vào (Entrance / 出入口)
    - **`WH`** / **`W`**: Kho tổng / Nhà kho (Warehouse / 倉庫)
    - **`2F`**: Tầng 2 của xưởng (2nd Floor / 2階)
    - **`PAC`**: Kệ khuôn đóng gói cất đi - ít dùng (Packed Storage / 梱包保管)
    - **`M06`**, **`M08`**: Gần Máy định hình số 6 / số 8 (Forming Machine #6/#8)
    - **`TW`**: Gần Máy định hình Đài Loan (Taiwan Machine)
    - **`PRS`**: Phía trên các Máy dập (Press area / プレス機上部)
  - **Khu vực Chức năng**:
    - **`TEF`**: Khu vực Chờ / Mạ Teflon (Teflon Staging)
    - **`REP`**: Khu vực Bảo trì / Sửa chữa khuôn (Repair & Maintenance)
    - **`NEW`**: Khu vực Tiếp nhận khuôn mới (New Tooling Receiving)
- **Cấu trúc linh hoạt**: `[MãKhuVực]-[SốGiá]-[SốTầng]` (VD: `OFF-01-2`, `M08-01-1`, `TW-02-1`, `2F-03-1`, `TEF-01`).
- **Tương thích ngược 100%**: Giữ nguyên khả năng nhận diện dữ liệu cũ `71-1`, `70-0`.


---

*Cập nhật lần cuối: 2026-08-06*
*Phiên bản: 1.2*

