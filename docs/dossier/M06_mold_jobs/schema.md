# 🗄️ M06 — Schema Work Orders, Jobs & Job Steps (`M06_mold_jobs/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `work_orders = 1,203` | `jobs = 1,205` | `job_steps = 2,457` | `mold_work_orders = 0` (Legacy, cấm dùng).

## 1. Bảng `public.work_orders` (BASE TABLE — 1,203 dòng)
- `wo_id` (uuid*) | `wo_code` (text*) | `wo_name` (text*) | `product_id` (uuid)
- `design_revision_id` (uuid) | `order_id` (uuid) | `company_id` (uuid) | `case_id` (uuid)
- `wo_type` (text*) | `wo_status` (text*) | `start_date` (timestamptz) | `deadline` (timestamptz)
- `completed_at` (timestamptz) | `responsible_id` (uuid) | `priority` (integer) | `notes` (text)
- `created_at` (timestamptz) | `updated_at` (timestamptz) | `created_by` (uuid) | `legacy_id` (text)
- `legacy_specs` (jsonb)

## 2. Bảng `public.jobs` (BASE TABLE — 1,205 dòng)
- `job_id` (uuid*) | `job_code` (text*) | `job_name` (text*) | `job_type_id` (text)
- `design_revision_id` (uuid) | `company_id` (uuid) | `responsible_id` (uuid) | `outsource_company` (uuid)
- `start_date` (timestamptz) | `deadline` (timestamptz) | `completed_date` (timestamptz) | `estimated_hours` (numeric)
- `job_status` (text) | `approved` (boolean) | `priority` (integer) | `year_period` (integer)
- `month_period` (integer) | `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `updated_by` (text) | `ship_date` (date) | `mold_deadline` (date) | `has_plug` (boolean)
- `mold_track_status` (text) | `plug_track_status` (text) | `overall_progress` (numeric) | `legacy_id` (text)
- `processing_item_id` (integer) | `product_id` (uuid) | `auxiliary_equipment_id` (uuid) | `mold_work_order_id` (uuid)
- `quantity` (integer) | `release_type` (text) | `separate_cutter` (boolean) | `inventory_check_on_repro` (boolean)
- `drawing_check_on_repro` (boolean) | `qty_sent_to_office` (integer) | `price_quote_required` (boolean) | `unit_price` (numeric)
- `job_category` (text) | `equipment_id` (uuid) | `case_id` (uuid) | `work_order_id` (uuid)
- `target_completion_date` (date) | `legacy_specs` (jsonb)

## 3. Bảng `public.job_steps` (BASE TABLE — 2,457 dòng)
- `step_id` (uuid*) | `job_id` (uuid*) | `step_no` (integer*) | `processing_item_id` (integer)
- `processing_status_id` (integer) | `step_name` (text*) | `step_status` (text) | `deadline` (timestamptz)
- `estimated_hours` (numeric) | `outsource_company` (uuid) | `machining_location` (text) | `set_info` (text)
- `tehai_info` (text) | `drawing_receipt_date` (timestamptz) | `notes` (text) | `created_at` (timestamptz)
- `updated_at` (timestamptz) | `track` (text) | `machine_id` (uuid) | `assigned_to` (uuid)
- `planned_start` (timestamptz) | `planned_end` (timestamptz) | `planned_hours` (numeric) | `actual_hours` (numeric)
- `is_overtime` (boolean) | `progress_percent` (integer) | `baseline_start` (timestamptz) | `baseline_end` (timestamptz)
- `item_type_id` (integer) | `type_code` (text) | `material_spec` (text) | `quantity` (integer)
- `arrangement` (text) | `condition` (text) | `manufacture_location` (text) | `target_completion_date` (date)
- `legacy_id` (text) | `legacy_specs` (jsonb)

## 4. Views, RPCs & Quy Tắc Liên Kết (`ADR-002` & `ADR-010`)
- **Views:** `v_work_order_progress` (`1,203` dòng), `v_work_order_equipment_set` (`2` dòng), `v_job_status_summary` (`2` dòng).
- **RPCs:** `fn_get_wo_equipment_set(p_wo_id UUID)` (truy xuất Bộ SET 8 thiết bị cho Work Order/Job từ `equipment_assignments` + `cav_type_id`), `rpc_confirm_work_order`, `rpc_create_work_order_from_order`.
- **Quyết định Kiến trúc 3.C (Phương án A — PE duyệt `2026-10-14 18:50 JST`):** Giữ nguyên ràng buộc `work_logs.job_step_id NOT NULL`; sử dụng 1 system Job/Step cố định `LEGACY-STEP-SHOP-INTERNAL` cho `118` dòng nhật ký nội bộ xưởng (`ProcessingDeadlineID IS NULL`) khi chạy Wave 2/3.
