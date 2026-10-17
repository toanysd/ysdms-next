# 🗄️ M06 — Schema Work Orders, Jobs & Job Steps (`M06_mold_jobs/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-17 07:20:15.988565+00:00` (Post-Wave 2)
- **Số bản ghi Production:** `work_orders = 1,230` | `jobs = 1,232` | `job_steps = 2,512` | `v_work_order_equipment_set = 1,833` | `mold_work_orders = 0` (Legacy, cấm dùng).

## 1. Bảng `public.work_orders` (BASE TABLE — 1,230 dòng)
- `wo_id` (uuid*) | `wo_code` (text*) | `wo_name` (text*) | `product_id` (uuid)
- `design_revision_id` (uuid) | `order_id` (uuid) | `company_id` (uuid) | `case_id` (uuid)
- `wo_type` (text*) | `wo_status` (text*) | `start_date` (timestamptz) | `deadline` (timestamptz)
- `completed_at` (timestamptz) | `responsible_id` (uuid) | `priority` (integer) | `notes` (text)
- `created_at` (timestamptz) | `updated_at` (timestamptz) | `created_by` (uuid) | `legacy_id` (text)
- `legacy_specs` (jsonb)

## 2. Bảng `public.jobs` (BASE TABLE — 1,232 dòng)
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

## 3. Bảng `public.job_steps` (BASE TABLE — 2,512 dòng)
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

## 4. Views, RPCs & Quy Tắc Liên Kết (`ADR-002`, `ADR-010`, `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT`)
- **Views:** `v_work_order_progress` (`1,230` dòng), `v_work_order_equipment_set` (`1,833` dòng), `v_job_status_summary`.
- **RPCs:** `fn_get_wo_equipment_set(p_wo_id UUID)` (truy xuất Bộ SET 8 thiết bị cho Work Order/Job từ `equipment_assignments` + `cav_type_id`), `rpc_confirm_work_order`, `rpc_create_work_order_from_order`.
- **Quyết định Kiến trúc Wave 2 (`1B` & `2A` — PE duyệt `2026-10-15`):** Backfill `design_revision_id` cho `67` khuôn `M-*` (`0` thay đổi `company_id`), backfill FK cho `1,202` `work_orders`/`jobs`, nạp `+27` `work_orders`/`jobs`, `+55` `job_steps`, `+205` `work_logs` có `job_step_id` hợp lệ.
- **Payload Backfill Cổng 1 (`WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` — `BEGIN...ROLLBACK` verified):**
  - `jobs.company_id`: `COALESCE(wo.company_id, p.company_id, dr.company_id, dr_p.company_id)` (`+1,131` dòng $\rightarrow$ `1,232/1,232`, `0` NULL).
  - `jobs.job_type_id`: Ánh xạ tất định từ `job_category` (`+28` dòng $\rightarrow$ `1,232/1,232`, `0` NULL).
  - `work_orders`: `deadline` từ `MAX(COALESCE(j.deadline, j.mold_deadline, j.target_completion_date, j.ship_date))` (`+1,107` dòng $\rightarrow$ `1,135/1,230`), `start_date` từ `MIN(j.start_date)` (`+772` dòng $\rightarrow$ `799/1,230`), `company_id` (`+1,131` dòng $\rightarrow$ `1,230/1,230`).
  - `job_steps.track`: Chuẩn hóa từ `item_type_id` & `step_name` (`+2,507` dòng $\rightarrow$ `2,512/2,512`, `0` NULL).
