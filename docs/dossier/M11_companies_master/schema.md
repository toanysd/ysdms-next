# 🗄️ M11 — Schema Chủ Thể, Máy Móc, Giá Kệ & Nhân Sự (`M11_companies_master/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `companies = 2,214` | `company_contacts = 859` | `delivery_sites = 1,169` | `employees = 25` | `machines = 14` | `racks = 90` | `rack_layers = 380` | `cav_types = 52` | `company_calendar = 1,095`.

## 1. Bảng `public.companies` (BASE TABLE — 2,214 dòng, SSOT Chủ Thể)
- `company_id` (uuid*) | `company_code` (text*) | `company_name` (text*) | `company_name_romaji` (text)
- `company_type` (ARRAY) | `order_folder_path` (text) | `cad_folder_path` (text) | `address` (text)
- `tel` (text) | `fax` (text) | `is_active` (boolean) | `notes` (text)
- `created_at` (timestamptz) | `updated_at` (timestamptz) | `updated_by` (text) | `legacy_id` (text)
- `legacy_specs` (jsonb) | `parent_company_id` (uuid) | `last_synced_at` (timestamptz) | `is_manually_edited` (boolean)

## 2. Bảng `public.racks` (90 dòng) & `public.rack_layers` (380 dòng)
### `public.racks`:
- `id` (uuid*) | `rack_code` (text*) | `rack_name` (text) | `location_in_factory` (text)
- `notes` (text) | `created_at` (timestamptz) | `legacy_id` (text) | `rack_code_new` (text)
- `zone_code` (text)
### `public.rack_layers`:
- `id` (uuid*) | `rack_id` (uuid) | `layer_number` (integer*) | `layer_code` (text*)
- `notes` (text) | `legacy_id` (text)

## 3. Bảng `public.machines` (14 dòng) & `public.employees` (25 dòng)
### `public.machines`:
- `machine_id` (uuid*) | `machine_code` (text*) | `machine_name` (text*) | `machine_type` (text*)
- `manufacturer` (text) | `model` (text) | `max_mold_length` (integer) | `max_mold_width` (integer)
- `max_sheet_width` (integer) | `location` (text) | `machine_group` (text) | `is_active` (boolean)
- `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `machine_series` (text)
- `feed_length_mm` (numeric)
### `public.employees`:
- `employee_id` (uuid*) | `employee_code` (text*) | `employee_name` (text*) | `employee_name_short` (text)
- `company_id` (uuid) | `department` (text) | `role` (text) | `order_code` (text)
- `joining_date` (date) | `is_active` (boolean) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `legacy_id` (text) | `employment_type` (text) | `hourly_rate` (numeric) | `join_date` (date)

## 4. Quy Tắc Định Danh & Khóa Ngoại (`RULE-DATA-02`)
1. **Khóa chính `companies`:** `company_id` (`UUID`). Mọi bảng tham chiếu khách hàng/đối tác (`orders.company_id`, `products.company_id`, `equipment.keeper_company_id`) đều trỏ về `public.companies(company_id)`.
2. **Định dạng `legacy_id`:**
   - `companies.legacy_id`: `'COMP-' || CompanyID` hoặc `'CUST-' || CustomerID`.
   - `racks.legacy_id`: `RackID::text` (VD: `'38'`, `'48'`).
   - `rack_layers.legacy_id`: `RackLayerID::text` (VD: `'0'`, `'10'`).
