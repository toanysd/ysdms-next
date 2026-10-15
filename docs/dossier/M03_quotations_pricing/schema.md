# 🗄️ M03 — Schema Báo Giá & Chuyển Đổi Đơn Hàng (`M03_quotations_pricing/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `quotations = 0` | `quotation_lines = 0` (đã dọn sạch dữ liệu pilot trong `WO-PIPE-E2E-CLEANUP`).

## 1. Bảng `public.quotations` (BASE TABLE)
- `quotation_id` (uuid*) | `quotation_no` (text*) | `company_id` (uuid*) | `quote_date` (date*)
- `valid_until` (date) | `total_amount` (numeric) | `status` (text) | `file_path` (text)
- `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `case_id` (uuid)
- `raw_text_snapshot` (text) | `extra_json` (jsonb) | `quotation_type` (text) | `prepared_by` (uuid)
- `revision_no` (integer*) | `customer_contact_name` (text) | `delivery_destination` (text) | `converted_order_id` (uuid)
- `converted_at` (timestamptz)

## 2. Bảng `public.quotation_lines` (BASE TABLE)
- `line_id` (uuid*) | `quotation_id` (uuid*) | `line_no` (integer*) | `item_type` (text*)
- `description` (text) | `quantity` (integer) | `unit_price` (numeric) | `amount` (numeric)
- `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `model_code` (text)
- `quantity_text` (text) | `product_id` (uuid) | `design_revision_id` (uuid)

## 3. Ràng Buộc Enum & RPC Chuyển Đổi Chuẩn (`Method A1`)
- **`quotations.status` CHECK Constraint (Migration M28A):** `'DRAFT' | 'SENT' | 'APPROVED' | 'CONVERTED' | 'REJECTED' | 'EXPIRED'` (Bắt buộc chữ IN HOA).
- **`quotation_lines.item_type` CHECK Constraint:** `'PRODUCT' | 'MOLD' | 'SAMPLE' | 'MODIFICATION' | 'SHIPPING' | 'OTHER'`.
- **RPC `public.fn_convert_quotation_to_order(p_quotation_id UUID, p_po_number TEXT, p_order_date DATE)` (Migration `20261014143000`):**
  1. Dùng `pg_advisory_xact_lock` chống race condition khi gọi đồng thời.
  2. Chỉ xử lý các dòng `item_type = 'PRODUCT'`.
  3. **Phương án A1 nghiêm ngặt:** Chỉ ánh xạ sản phẩm qua `ql.product_id` hoặc khớp chính xác `TRIM(ql.model_code) = p.product_code` (với `COUNT(*) = 1`). Đã xóa bỏ hoàn toàn 2 nhánh `LIMIT 1` fallback cũ; nếu có dòng `PRODUCT` không xác định được `product_id` duy nhất hoặc không có dòng `PRODUCT` nào, hàm lập tức `RAISE EXCEPTION` và rollback toàn bộ transaction.
