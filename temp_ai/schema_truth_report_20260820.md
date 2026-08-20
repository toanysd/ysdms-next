# BÁO CÁO ĐỒNG BỘ SCHEMA SỰ THẬT (SCHEMA TRUTH REPORT)
**Thời gian:** 2026-08-20  
**Người thực hiện:** Antigravity (AN) — Kỹ sư triển khai  
**Người nhận:** Perplexity (PE) — Trưởng dự án / Kiến trúc sư trưởng  
**Nguồn xác thực (Single Source of Truth):** `src/types/database.types.ts` & Runtime Codebase

---

## 1. TỔNG QUAN TÌNH TRẠNG SCHEMA NGÀY 2026-08-20

Codebase `ysdms-nextgen` đã tiến hóa qua 94 bản migration (từ tháng 6/2026 đến 20/08/2026).
- `mold_masters`, `company_pn`, `mold_revisions` đã bị **DROP / Loại bỏ hoàn toàn** khỏi database types và runtime code.
- Kiến trúc Unified Equipment (**ADR-001**) và Work Order 4 tầng (**ADR-002**) là kiến trúc lõi đang vận hành trên toàn bộ UI (Gantt, OCR AI, Schedule, Product Center, Worklog).

---

## 2. BẢNG XÁC NHẬN 1: `products` (Sản phẩm / Khay)

*Nguồn: `src/types/database.types.ts` (Dòng 6059–6120)*

### Các cột định danh và tên sản phẩm:
| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô tả Nghiệp vụ & SSOT |
|---|---|---|---|
| `product_id` | `UUID` | **PK (NOT NULL)** | Định danh duy nhất sản phẩm |
| `company_id` | `UUID` | **FK (NOT NULL)** | Khách hàng sở hữu (`companies.company_id`) |
| `product_code` | `TEXT` | **UNIQUE (NOT NULL)** | Mã nội bộ YSD compact (bỏ gạch ngang, VD: `ADY071`, `TOW004`) |
| `product_name_internal`| `TEXT` | Nullable | Tên hiển thị nội bộ YSD (có gạch ngang, VD: `ADY-071`, `TOW-004`) |
| `product_name` | `TEXT` | Nullable | Tên chính thức từ KH trên hợp đồng/hóa đơn (ban đầu có thể NULL) |
| `customer_product_name`| `TEXT` | Nullable | Mã part hoặc tên sản phẩm phía KH gọi (thay thế hoàn toàn `company_pn`) |
| `product_description` | `TEXT` | Nullable | Tên làm việc / mô tả sơ bộ do Kinh doanh nhập từ đầu |
| `product_status` | `TEXT` | Nullable | Trạng thái hiện tại: `'ACTIVE'`, `'MAINTENANCE'`, `'DISPOSED'`, `'MERGED'` |
| `requires_prototype_mold`| `BOOLEAN` | Default `false` | Có yêu cầu làm khuôn thử nghiệm (試作ポケット) không? |
| `first_shipment_date` | `DATE` | Nullable | Ngày xuất hàng đầu tiên (`初回出荷日`) |
| `pocket_count` | `INTEGER` | Nullable | Số pocket trên 1 khay (Pockets per tray) |
| `pieces_per_box` | `INTEGER` | Nullable | Số khay / thùng đóng gói |
| `box_spec` | `TEXT` | Nullable | Quy cách thùng |
| `notes` | `TEXT` | Nullable | Ghi chú tự do |
| `legacy_id` | `TEXT` | Nullable | Mã đối soát hệ thống Access cũ |
| `legacy_specs` | `JSONB` | Nullable | Thông số thô từ Access |

> 📌 **Kết luận Bảng 1:** Cột `company_pn` đã KHÔNG CÒN TỒN TẠI trong `database.types.ts`. Hệ thống dùng `customer_product_name`. Trạng thái `product_status` đang hoạt động ổn định trên UI. Chúng ta sẽ bổ sung `product_lifecycle_status` song song theo chỉ thị R1-B1.

---

## 3. BẢNG XÁC NHẬN 2: `design_revisions` (Thiết kế CAD & Thông số Kỹ thuật)

*Nguồn: `src/types/database.types.ts` (Dòng 1370–1485)*

### Cấu trúc bảng thiết kế & duyệt:
| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô tả Kỹ Thuật |
|---|---|---|---|
| `revision_id` | `UUID` | **PK (NOT NULL)** | Khóa chính phiên bản thiết kế |
| `product_id` | `UUID` | **FK** | Trỏ trực tiếp đến `products.product_id` |
| `company_id` | `UUID` | **FK** | Trỏ đến `companies.company_id` |
| `designer_id` | `UUID` | **FK** | Nhân viên thiết kế CAD (`employees.employee_id`) |
| `plastic_id` | `UUID` | **FK** | Trỏ đến danh mục nhựa (`plastic_master.plastic_id`) |
| `cav_type_id` | `UUID` | **FK** | Khổ khuôn chuẩn YSD (`cav_types.cav_type_id`) |
| `shared_plug_from_design_id`| `UUID` | **FK** | Kế thừa/dùng chung chày ép từ revision khác |
| `design_code` | `TEXT` | Nullable | Mã bản vẽ (VD: `MMT-021 R1`, `TOW-004 R2`) |
| `design_category` | `TEXT` | Nullable | Phân loại thiết kế (`'MASS_PRODUCTION'`, `'PROTOTYPE_POCKET'`) |
| `plastic_type_designed` | `TEXT` | Nullable | **SSOT Nhựa**: Tên nhựa thiết kế (VD: `PET 透明 1.0t`) |
| `cutline_length` / `width`| `NUMERIC` | Nullable | **SSOT Cutline**: Kích thước đường cắt (mm) |
| `cavity_count` | `INTEGER` | Nullable | **取数**: Số khay dập trên 1 chu kỳ khuôn |
| `corner_r` / `chamfer_c` | `TEXT` | Nullable | Bo góc R / Vát cạnh C |
| `cavity_pitch_mm` | `NUMERIC` | Nullable | Bước khuôn giữa các cavity |
| `machine_feed_pitch_mm` | `NUMERIC` | Nullable | Bước tiến nhựa máy định hình (送り) |
| `plug_type` | `TEXT` | Nullable | Loại chày ép (`'NONE'`, `'OWNED'`, `'SHARED'`) |
| `has_separate_cutter` | `BOOLEAN` | Nullable | Có dao dập rời (別抜き) không? |
| `customer_drawing_no` | `TEXT` | Nullable | Số bản vẽ của khách hàng |
| `customer_equipment_no`| `TEXT` | Nullable | Số hiệu thiết bị khách hàng gán |
| `status` | `TEXT` | Nullable | Trạng thái hiện tại (`'DRAFT'`, `'APPROVED'`, ...) |
| `approved_date` | `DATE` | Nullable | Ngày duyệt cuối cùng |
| `change_summary` | `TEXT` | Nullable | Tóm tắt thay đổi so với revision trước |
| `cad_folder_path` | `TEXT` | Nullable | Thư mục CAD / DXF |
| `drawing_pdf_path` | `TEXT` | Nullable | Đường dẫn file PDF bản vẽ |

> 📌 **Kết luận Bảng 2:** `design_revisions` chỉ có trường `status` và `approved_date` phẳng, **HOÀN TOÀN CHƯA CÓ** bảng lưu lịch sử các vòng duyệt (`design_approval_logs`). Đây chính là khoảng trống lớn cần bổ sung trong migration R1-B1.

---

## 4. BẢNG XÁC NHẬN 3: `equipment` + `equipment_assignments` (Hợp nhất Thiết bị & SET)

*Nguồn: `src/types/database.types.ts` (Dòng 1620–1840)*

### 4.1. Bảng `equipment` (Single Source of Truth cho toàn bộ thiết bị vật lý):
| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô tả & Ràng buộc |
|---|---|---|---|
| `equipment_id` | `UUID` | **PK (NOT NULL)** | Khóa chính thiết bị |
| `equipment_code` | `TEXT` | **UNIQUE (NOT NULL)** | Mã duy nhất (VD: `M-TOW004R1`, `C-TOW004-R1`, `WB-ZD-01`, `1042`) |
| `display_name` | `TEXT` | **NOT NULL** | Tên hiển thị trên tem/thẻ |
| `equipment_type` | `TEXT` | **NOT NULL** | `MOLD`, `CUTTER_INLINE`, `CUTTER_SEPARATE`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG` |
| `sub_type` | `TEXT` | Nullable | `PROTOTYPE_POCKET`, `MASS_PRODUCTION`... |
| `design_revision_id` | `UUID` | **FK** | Trỏ về `design_revisions.revision_id` |
| `company_id` | `UUID` | **FK** | Khách hàng sở hữu (`companies`) |
| `keeper_company_id` | `UUID` | **FK** | Nơi đang giữ khuôn/thiết bị (`companies`) |
| `cav_type_id` | `UUID` | **FK** | Khổ khuôn (`cav_types`) |
| `current_rack_layer_id`| `UUID` | **FK** | Vị trí giá kệ tầng (`rack_layers`) |
| `actual_length/width/height_mm`| `TEXT` | Nullable | Kích thước vật lý thực |
| `actual_weight` | `TEXT` | Nullable | Trọng lượng thực |
| `device_status` | `TEXT` | Default `'NORMAL'`| Tình trạng thiết bị (`'NORMAL'`, `'REPAIRING'`, `'DAMAGED'`) |
| `usage_status` | `TEXT` | Default `'STORAGE'`| Trạng thái sử dụng (`'STORAGE'`, `'IN_USE'`, `'LOAN'`, `'DISPOSED'`) |

### 4.2. Bảng `equipment_assignments` (Quan hệ N:N gá lắp SET & Dùng chung):
| Tên Cột | Kiểu Dữ Liệu | Nullable | Ràng buộc |
|---|---|---|---|
| `assignment_id` | `UUID` | **PK (NOT NULL)** | Khóa chính liên kết |
| `primary_equipment_id`| `UUID` | **FK (NOT NULL)** | Thiết bị chính (thường là Khuôn `MOLD`) $\rightarrow$ `equipment(equipment_id)` |
| `related_equipment_id`| `UUID` | **FK (NOT NULL)** | Thiết bị đi kèm (Dao, Đế, Khung, Plug) $\rightarrow$ `equipment(equipment_id)` |
| `relationship_type` | `TEXT` | Default `'SET_MEMBER'`| `'SET_MEMBER'` (trong cùng 1 SET) hoặc `'SHARED'` (dùng chung) |
| `is_default` | `BOOLEAN` | Default `true` | Cấu hình mặc định khi chạy máy |
| **Unique Constraint** | `(primary_equipment_id, related_equipment_id)` | — | Chống trùng lặp cặp thiết bị |
| **Check Constraint** | `primary_equipment_id <> related_equipment_id` | — | Chống tự tham chiếu chính mình |

> 📌 **Kết luận Bảng 3:** Hệ thống `equipment` + `equipment_assignments` đã xử lý toàn diện mọi quan hệ SET và dùng chung. Không cần tạo thêm bảng `equipment_types` hay `product_equipment_map`.

---

## 5. BẢNG XÁC NHẬN 4: `work_orders` + `jobs` + `job_steps` + `work_logs` (Luồng Sản Xuất / Gia Công)

*Nguồn: `src/types/database.types.ts` (Dòng 2380–2760, 7200–7320)*

### Sơ đồ 4 Tầng Thực Tế Đang Vận Hành (ADR-002):
```
Tầng 1: work_orders (Lệnh chế tạo tổng thể: WO-2026-XXXXXX)
  │    FK: product_id, design_revision_id, order_id, company_id, case_id
  ▼ (1:N)
Tầng 2: jobs (Chỉ thị gia công cho từng thiết bị: JOB-TOW004-xxx, DES-TOW004-xxx)
  │    FK: equipment_id (1:1), work_order_id, product_id, design_revision_id, job_type_id
  │    Milestones: target_completion_date (3 ngày trước), mold_deadline (chỉ thị), ship_date (xuất hàng)
  ▼ (1:N)
Tầng 3: job_steps (Các component thực hiện song song: [M] Khuôn, [P] Plug, [C] Dao, [W] Đế nước...)
  │    FK: job_id, item_type_id, processing_status_id, machine_id, assigned_to
  │    Deadlines & Hours: deadline, planned_hours, actual_hours
  ▼ (1:N)
Tầng 4: work_logs (Nhật ký thực tế hàng ngày của từng công nhân: A4 Print & Inkan Stamp)
       FK: job_id, job_step_id, employee_id, processing_code_id
       Data: work_date, hours_spent, is_finished, description
```

### Các file đang dùng trực tiếp luồng này:
1. `src/components/equipment/MoldJobGantt.tsx` (Gantt Lịch sản xuất, filter theo ngày, gom nhóm theo product row)
2. `src/components/equipment/ToolingExcelGridView.tsx` (Ma trận lịch làm việc theo ngày và nhân sự)
3. `src/app/actions/mold-job.ts` & `src/app/actions/work-orders.ts` (Server Actions truy vấn đa tầng)
4. `src/app/api/ocr/save/route.ts` (Tự động lưu từ OCR: `products` $\rightarrow$ `design_revisions` $\rightarrow$ `equipment` $\rightarrow$ `equipment_assignments` $\rightarrow$ `work_orders` $\rightarrow$ `jobs` $\rightarrow$ `job_steps`)
5. `src/components/equipment/DailyWorklogQuickModal.tsx` & `DailyWorklogA4Sheet.tsx` (In phiếu Nhật ký A4 kèm con dấu Hanko thực tế)
6. `src/app/product-center/[id]/tabs/TabDesignsEquipment.tsx` & `TabJobs.tsx` (Quản lý 360 độ Sản phẩm)

---

## 6. KẾ HOẠCH BƯỚC TIẾP THEO

1. **Cập nhật ngay `SCHEMA_REFERENCE.md`** để đồng bộ đúng 100% nội dung thực tế trên, xóa bỏ hoàn toàn phần mô tả cũ về `mold_masters`, `company_pn`, `auxiliary_equipments`.
2. **Triển khai Migration R1-B1**:
   - Thêm `products.product_lifecycle_status`
   - Tạo bảng `design_approval_logs`
   - Tạo bảng `sample_requests`
3. **Chạy `npx tsc --noEmit`** kiểm tra toàn diện.
