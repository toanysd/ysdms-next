# 🗄️ M09 — Schema Mẫu Thử, Kiểm Tra KCS & Báo Cáo Lỗi (`M09_quality_sample_gate/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `sample_requests = 0` | `sample_submissions = 0` | `inspections = 0` | `tray_inspections = 0` | `defect_reports = 0`.

## 1. Bảng `public.sample_requests` (BASE TABLE — 0 dòng)
- `request_id` (uuid*) | `product_id` (uuid*) | `design_revision_id` (uuid) | `sample_type` (text*)
- `requested_qty` (integer*) | `target_date` (date) | `result_status` (text*) | `ng_reason` (text)
- `notes` (text) | `created_at` (timestamptz*)

## 2. Bảng `public.inspections` (BASE TABLE — 0 dòng)
- `inspection_id` (uuid*) | `po_id` (uuid) | `lot_id` (uuid) | `inspector_id` (uuid)
- `inspection_date` (date*) | `result` (text) | `notes` (text) | `file_path` (text)
- `created_at` (timestamptz) | `updated_at` (timestamptz) | `production_lot_id` (uuid) | `inspected_qty` (integer)
- `good_qty` (integer) | `ng_qty` (integer) | `ng_category` (text) | `inspection_stage` (text)

## 3. Bảng `public.tray_inspections` (BASE TABLE — 0 dòng) & `public.defect_reports` (0 dòng)
### `public.tray_inspections`:
- `inspection_id` (uuid*) | `job_id` (uuid) | `product_id` (uuid) | `inspection_type` (text*)
- `inspection_stage` (text) | `measurement_data` (jsonb) | `tolerance_data` (jsonb) | `pass_fail` (text)
- `inspected_by` (uuid) | `inspected_date` (date) | `certificate_type` (text) | `certificate_no` (text)
- `certificate_file` (text) | `issued_by` (uuid) | `issued_date` (date) | `company_approved` (boolean)
- `company_approved_date` (timestamptz) | `notes` (text) | `created_at` (timestamptz)
### `public.defect_reports`:
- `report_id` (uuid*) | `report_code` (text*) | `report_type` (text*) | `severity` (text)
- `product_id` (uuid) | `mold_code` (text) | `defect_type` (text) | `defect_description` (text)
- `root_cause` (text) | `root_cause_analysis` (text) | `corrective_action` (text) | `preventive_action` (text)
- `translated_language` (text) | `translation_confirmed` (boolean) | `translation_confirmed_by` (text) | `reported_by` (uuid)
- `reported_date` (date) | `approved_by` (uuid) | `approved_date` (timestamptz) | `company_notified` (boolean)
- `company_response` (text) | `report_file` (text) | `status` (text) | `notes` (text)
- `created_at` (timestamptz) | `customer_response_date` (date) | `closed_at` (timestamptz)

## 4. Lưu Ý Xác Minh Schema (`information_schema.tables`)
- Tên bảng kiểm tra chất lượng trong DB Production là **`public.inspections`**, **`public.tray_inspections`**, và **`public.outgoing_qc_records`** (bảng tên `quality_inspections` **KHÔNG TỒN TẠI** trong `information_schema.tables`).
- Các bảng mẫu thử đã tồn tại sẵn trong DB gồm: `public.sample_requests`, `public.sample_submissions`, và `public.tray_samples`.
