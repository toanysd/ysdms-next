# 🗄️ M07 — Schema Lưu Giữ, Mượn Trả, Vòng Đời & Bảo Trì Khuôn (`M07_mold_custody/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `equipment_loans = 1` | `v_equipment_lifecycle_status = 6,497` | `equipment_history = 0` | `mold_maintenance = 0` | `mold_loan_certificates = 209` | `asset_location_logs = 1,450`.

## 1. Bảng `public.equipment_loans` (BASE TABLE — 1 dòng, SSOT Mượn/Trả/Gia Công Ngoài)
- `loan_id` (uuid*) | `loan_code` (text*) | `loan_type` (text*) | `status` (text*)
- `equipment_id` (uuid*) | `from_company_id` (uuid) | `to_company_id` (uuid*) | `requested_by` (uuid)
- `approved_by` (uuid) | `approved_at` (timestamptz) | `rejection_reason` (text) | `loan_date` (date*)
- `scheduled_return_date` (date) | `actual_return_date` (date) | `returned_received_by` (uuid) | `destination_address` (text)
- `contact_person` (text) | `contact_phone` (text) | `purpose` (text) | `condition_on_loan` (text)
- `condition_on_return` (text) | `condition_notes` (text) | `qr_doc_code` (text) | `created_at` (timestamptz*)
- `updated_at` (timestamptz*) | `photo_overall_url` (text) | `photo_nameplate_url` (text)

## 2. Bảng `public.equipment_history` (BASE TABLE — 0 dòng) & `public.mold_maintenance` (0 dòng)
### `public.equipment_history`:
- `history_id` (uuid*) | `equipment_id` (uuid*) | `action_type` (text*) | `action_date` (date*)
- `from_location` (text) | `to_location` (text) | `from_company_id` (uuid) | `to_company_id` (uuid)
- `job_id` (uuid) | `description` (text) | `performed_by` (uuid) | `created_at` (timestamptz)
### `public.mold_maintenance`:
- `maintenance_id` (uuid*) | `physical_mold_id` (uuid*) | `maintenance_type` (text*) | `request_date` (timestamptz)
- `completed_date` (timestamptz) | `vendor_id` (uuid) | `employee_id` (uuid) | `reason` (text)
- `result` (text) | `cost` (numeric) | `status` (text) | `notes` (text)
- `created_at` (timestamptz) | `updated_at` (timestamptz)

## 3. View `public.v_equipment_lifecycle_status` (VIEW — 6,497 dòng)
- `equipment_id` (uuid) | `equipment_code` (text) | `display_name` (text) | `equipment_type` (text)
- `maintenance_shot_threshold` (integer) | `shots_at_last_maintenance` (integer) | `total_shots` (bigint) | `current_shots_since_service` (bigint)
- `pct_life_used` (numeric) | `lifecycle_status` (text)

## 4. Khử Mâu Thuẫn Schema Cũ (`SCHEMA_REFERENCE.md` Cleanup)
1. **`equipment_loans.loan_type` chuẩn duy nhất (Migration 098):** `CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING'))`. Bỏ hoàn toàn định nghĩa cũ ở `SCHEMA_REFERENCE.md:280-320` (`BORROW / RETURN / REPAIR_OUT`).
2. **Các object KHÔNG TỒN TẠI (`NOT_FOUND`):** `v_mold_health`, `v_maintenance_overdue`, `mold_maintenance_log`, và RPC `record_maintenance_and_reset`.
3. **Quyết định 3.D (Phương án B — PE duyệt `2026-10-14 18:50 JST`):** Không đổ tràn 4,692 dòng `tblTeflonLog` vào `mold_maintenance`; chỉ các dòng có `SentDate` (`4,686` dòng) mới đủ điều kiện đưa vào lớp lịch sử di chuyển/xử lý bề mặt trong Wave 4.
