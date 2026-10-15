# 🗄️ M08 — Schema Nhật Ký Công Việc, Chỉ Thị SX & Lịch Định Hình (`M08_forming_subcontract/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `work_logs = 7,111` | `production_schedules = 30` (`v_tray_schedule_gantt = 30`) | `production_instructions = 0` | `forming_daily_logs = 0` | `press_daily_logs = 0`.

## 1. Bảng `public.work_logs` (BASE TABLE — 7,111 dòng, SSOT Nhật Ký Giờ Công)
- `log_id` (uuid*) | `job_step_id` (uuid) | `job_id` (uuid*) | `employee_id` (uuid*)
- `company_id` (uuid) | `work_date` (date*) | `hours_spent` (numeric) | `quantity_done` (integer)
- `is_finished` (boolean) | `contact_content` (text) | `description` (text) | `notes` (text)
- `created_at` (timestamptz) | `processing_code_id` (integer) | `planned_hours` (numeric) | `planned_date` (date)
- `machine_id` (uuid) | `processing_status_id` (integer) | `design_revision_context` (text) | `legacy_id` (text)
- `legacy_specs` (jsonb) | `quantity_ng` (integer*)

## 2. Bảng `public.production_instructions` (BASE TABLE — 0 dòng)
- `id` (uuid*) | `instruction_no` (text*) | `order_id` (uuid) | `product_id` (uuid)
- `physical_mold_id` (uuid) | `instruction_type` (text*) | `production_site` (text) | `quantity_ordered` (integer*)
- `quantity_per_stack` (integer) | `material_spec` (text) | `material_thickness` (numeric) | `material_width` (integer)
- `antistatic` (boolean) | `silicon` (boolean) | `surface_coating` (boolean) | `recycled_pct` (numeric)
- `delivery_site_id` (uuid) | `requested_date` (date*) | `lot_no` (text) | `template_type` (text*)
- `has_label` (boolean) | `is_first_time` (boolean) | `material_stock_warning` (boolean) | `material_stock_qty` (integer)
- `status` (text*) | `issued_at` (timestamptz) | `completed_at` (timestamptz) | `notes` (text)
- `created_by` (uuid) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `packaging_type` (text)
- `wrap_in_plastic_bag` (boolean) | `daily_quantity` (integer) | `plain_case` (boolean) | `plain_label` (boolean)
- `adhesive_sheet` (boolean) | `design_revision_id` (uuid)

## 3. Bảng `public.production_schedules` (BASE TABLE — 30 dòng)
- `schedule_id` (uuid*) | `machine_id` (uuid*) | `schedule_date` (date*) | `product_id` (uuid)
- `mold_id` (uuid) | `shift` (text) | `planned_quantity` (integer) | `status` (text)
- `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `order_line_id` (uuid)
- `work_order_id` (uuid) | `operator_id` (uuid) | `roll_id` (uuid) | `actual_quantity` (integer)
- `scheduled_start` (timestamptz) | `scheduled_end` (timestamptz)

## 4. Quy Tắc Schema & Ràng Buộc (`RULE-DATA-02`)
1. **Không bịa cột trên `work_logs`:** `public.work_logs` **KHÔNG** có cột `equipment_id` trực tiếp; truy vết thiết bị phải đi qua `work_logs.job_step_id -> job_steps.job_id -> jobs.equipment_id`.
2. **Ràng buộc `job_step_id NOT NULL`:** Theo Quyết định 3.C Phương án A của PE, giữ nguyên `job_step_id NOT NULL`; các dòng nhật ký nội bộ không gắn Job cụ thể được ánh xạ về `LEGACY-STEP-SHOP-INTERNAL`.
3. **Bảng Legacy không dùng:** `production_log` (`0` dòng) và `production_logs` (`0` dòng) không phải là SSOT; mọi nhật ký công việc chuẩn tập trung tại `public.work_logs`.
