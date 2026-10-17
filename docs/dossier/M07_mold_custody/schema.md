# 🗄️ M07 — Schema Lưu Giữ, Mượn Trả, Vòng Đời & Bảo Trì Khuôn (`M07_mold_custody/schema.md`)

- **Đối chiếu `information_schema.columns` & Post-Wave 3 lúc:** `2026-10-17 08:41:46+00:00`
- **Số bản ghi Production:** `equipment_loans = 1` | `v_equipment_lifecycle_status = 6,525` | `equipment_history = 1,896` | `equipment_ship_logs = 356` | `mold_maintenance = 190` | `mold_name_history = 35` | `equipment_status_logs = 352` | `mold_loan_certificates = 209` | `asset_location_logs = 1,450`.

## 1. Bảng `public.equipment_loans` (BASE TABLE — 1 dòng, SSOT Mượn/Trả/Gia Công Ngoài)
- `loan_id` (uuid*) | `loan_code` (text*) | `loan_type` (text*) | `status` (text*)
- `equipment_id` (uuid*) | `from_company_id` (uuid) | `to_company_id` (uuid*) | `requested_by` (uuid)
- `approved_by` (uuid) | `approved_at` (timestamptz) | `rejection_reason` (text) | `loan_date` (date*)
- `scheduled_return_date` (date) | `actual_return_date` (date) | `returned_received_by` (uuid) | `destination_address` (text)
- `contact_person` (text) | `contact_phone` (text) | `purpose` (text) | `condition_on_loan` (text)
- `condition_on_return` (text) | `condition_notes` (text) | `qr_doc_code` (text) | `created_at` (timestamptz*)
- `updated_at` (timestamptz*) | `photo_overall_url` (text) | `photo_nameplate_url` (text)

## 2. Nhóm 5 Bảng Lịch Sử Vòng Đời & Bảo Trì (`WO-MOLD-SYNC-WAVE3` — `2,829` dòng mới)
### `public.equipment_history` (`1,896` dòng: `1,488 LOCATION_CHANGE` + `35 MODIFICATION` + `21 CUTTER_MAINTENANCE` + `352 STATUS_*`):
- `history_id` (uuid*) | `equipment_id` (uuid*) | `action_type` (text*) | `action_date` (date*)
- `from_location` (text) | `to_location` (text) | `from_company_id` (uuid) | `to_company_id` (uuid)
- `job_id` (uuid) | `description` (text) | `performed_by` (uuid) | `created_at` (timestamptz)
### `public.equipment_ship_logs` (`356` dòng — từ `tblShipLog` có `ShipDate IS NOT NULL`):
- `ship_log_id` (uuid*) | `legacy_ship_log_id` (integer UNIQUE) | `equipment_id` (uuid*) | `from_company_id` (uuid) | `to_company_id` (uuid)
- `ship_date` (date*) | `handler_name` (text) | `ship_notes` (text) | `performed_by` (uuid) | `legacy_date_entry` (timestamptz) | `created_at` (timestamptz*)
### `public.mold_maintenance` (`190` dòng — `TEFLON_COATING` từ `tblTeflonLog` có `SentDate IS NOT NULL`):
- `maintenance_id` (uuid*) | `physical_mold_id` (uuid*) | `maintenance_type` (text*) | `request_date` (timestamptz)
- `completed_date` (timestamptz) | `vendor_id` (uuid) | `employee_id` (uuid) | `reason` (text)
- `result` (text) | `cost` (numeric) | `status` (text) | `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
### `public.mold_name_history` (`35` dòng — từ `tblMoldLog` loại `MoldLogID=24` rỗng) & `public.equipment_status_logs` (`352` dòng — từ `statuslogs` có `Status IS NOT NULL`):
- `mold_name_history`: `name_history_id` (uuid*) | `equipment_id` (uuid*) | `old_mold_name` (text) | `new_mold_name` (text*) | `changed_at` (date*) | `changed_by` (uuid) | `change_notes` (text)
- `equipment_status_logs`: `status_log_id` (uuid*) | `legacy_status_log_id` (integer UNIQUE) | `equipment_id` (uuid*) | `status_code` (text*) | `audit_type` (text) | `logged_at` (timestamptz*) | `employee_id` (uuid) | `destination_id` ( text) | `notes` (text) | `session_id` (text)

## 3. View `public.v_equipment_lifecycle_status` (VIEW — 6,525 dòng)
- `equipment_id` (uuid) | `equipment_code` (text) | `display_name` (text) | `equipment_type` (text)
- `maintenance_shot_threshold` (integer) | `shots_at_last_maintenance` (integer) | `total_shots` (bigint) | `current_shots_since_service` (bigint) | `pct_life_used` (numeric) | `lifecycle_status` (text)

## 4. Khử Mâu Thuẫn Schema Cũ (`SCHEMA_REFERENCE.md` Cleanup)
1. **`equipment_loans.loan_type` chuẩn duy nhất (Migration 098):** `CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING'))`.
2. **Các object KHÔNG TỒN TẠI (`NOT_FOUND`):** `v_mold_health`, `v_maintenance_overdue`, `mold_maintenance_log`, và RPC `record_maintenance_and_reset`.
3. **Quyết định `Q1–Q5` (`WO-MOLD-SYNC-WAVE3` — PE duyệt `2026-10-17 JST`):** Giữ nguyên `asset_location_logs = 1,450`; gộp `Wave 4` vào `Wave 3`, đồng bộ đủ `2,829` dòng lịch sử vào 5 bảng (`equipment_history`, `equipment_ship_logs`, `mold_maintenance`, `mold_name_history`, `equipment_status_logs`).
