# 🗄️ M12 — Schema Xác Thực (`profiles`) & Hạ Tầng Kiểm Toán PE–AN (`M12_dashboard_admin/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `profiles = 3` (`missing_profiles = 0`) | `pe_an_messages = 164` | `pe_evidence_items = 30` | `audit_logs = 4,815`.

## 1. Bảng `public.profiles` (BASE TABLE — 3 dòng, SSOT Phân Quyền UI/Auth)
- `id` (uuid*) | `role` (text*)

## 2. Bảng `public.pe_evidence_items` (BASE TABLE — 30 dòng, SSOT Bằng Chứng Nghiệm Thu)
- `evidence_id` (uuid*) | `message_id` (uuid) | `work_order` (text*) | `evidence_type` (text*)
- `status` (text*) | `commit_sha` (text) | `file_path` (text) | `url` (text)
- `command` (text) | `result_summary` (text) | `result_json` (jsonb) | `screenshot_path` (text)
- `created_at` (timestamptz*)

## 3. Bảng `public.pe_an_messages` (BASE TABLE — 164 dòng, Realtime Bridge)
- `message_id` (uuid*) | `thread_id` (text*) | `sender` (text*) | `message_type` (text*)
- `content_md` (text*) | `status` (text*) | `created_at` (timestamptz)

## 4. Khử Mâu Thuẫn Schema Cũ (`SCHEMA_REFERENCE.md` Cleanup)
- **Xác nhận `public.profiles` TỒN TẠI:** Bỏ nhận định cũ ở `SCHEMA_REFERENCE.md:14` (*"Bảng User là `employees`, KHÔNG phải `profiles`"*). Thực tế cả hai bảng đều tồn tại: `public.profiles` (`3` dòng) gắn 1:1 với `auth.users(id)` để phân quyền đăng nhập (`role`), còn `public.employees` (`25` dòng) lưu danh sách công nhân viên nhà máy phục vụ chấm công `work_logs`.
- **Ràng buộc `pe_evidence_items`:** `evidence_type IN ('TSC', 'I18N', 'GIT_GREP', 'BROWSER', 'SQL_AUDIT', 'SCREENSHOT')`, `status IN ('PASS', 'FAIL', 'INFO')`.
