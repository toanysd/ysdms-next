# 🗄️ M01 — Schema Quản Lý Sự Việc (`M01_cases/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production hiện tại:** `public.business_cases = 0` (sau khi đã chạy `WO-PIPE-E2E-CLEANUP`).

## 1. Bảng `public.business_cases` (BASE TABLE)
- `id` (uuid*) | `case_code` (text*) | `title` (text*) | `case_type` (text*)
- `status` (text*) | `customer_id` (uuid) | `contact_person_id` (uuid) | `sales_owner_id` (uuid)
- `design_owner_id` (uuid) | `operations_owner_id` (uuid) | `requested_due_date` (date) | `parent_case_id` (uuid)
- `raw_text_snapshot` (text) | `extra_json` (jsonb) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `instruction_notes` (text)

## 2. Khóa Chính, Khóa Ngoại & Ràng Buộc Chuẩn
- **Khóa chính (PK):** `id` (`UUID`, default `gen_random_uuid()`).
- **Khóa ngoại (FK):**
  - `company_id` -> `public.companies(company_id)` (Khách hàng yêu cầu).
  - `created_by` / `assigned_to` -> `auth.users(id)` / `public.profiles(id)`.
- **Các bảng con tham chiếu tới `business_cases(id)`:**
  1. `public.technical_reviews.case_id` -> `business_cases(id)`.
  2. `public.quotations.case_id` -> `business_cases(id)`.
  3. `public.work_orders.case_id` -> `business_cases(id)`.
  4. `public.jobs.case_id` -> `business_cases(id)`.
  5. `public.sample_requests.case_id` -> `business_cases(id)`.

## 3. Quy Tắc Truy Vấn & Bảo Toàn Dữ Liệu (`RULE-DATA-02`)
- Luôn bảo toàn nội dung gốc email khách hàng trong cột `raw_text_snapshot` khi khởi tạo sự việc mới.
- Phân quyền hiển thị nút thao tác trên `/cases/[id]` đọc trực tiếp `role` từ `public.profiles` (đã có trigger `on_auth_user_created_sync_profile` đồng bộ tự động từ `auth.users`).
