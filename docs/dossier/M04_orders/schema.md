# 🗄️ M04 — Schema Đơn Hàng & Staging Đối Soát (`M04_orders/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `orders = 2,396` | `order_lines = 6,279` | `staging_order_lines_backfill = 6,279`.

## 1. Bảng `public.orders` (BASE TABLE — 2,396 dòng)
- `order_id` (uuid*) | `order_no` (text*) | `company_id` (uuid*) | `order_date` (date*)
- `requested_delivery` (date) | `order_status` (text) | `order_type` (text) | `company_po` (text)
- `order_source` (text) | `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `updated_by` (text) | `customer_order_no` (text) | `customer_product_code` (text) | `mold_code_ref` (text)
- `recipient_name` (text) | `legacy_id` (text) | `lot_no` (text) | `converted_from_quotation_id` (uuid)

## 2. Bảng `public.order_lines` (BASE TABLE — 6,279 dòng)
- `line_id` (uuid*) | `order_id` (uuid*) | `line_no` (integer*) | `product_id` (uuid*)
- `quantity` (integer*) | `unit` (text) | `due_date` (date) | `delivery_site_id` (uuid)
- `material_spec_id` (uuid) | `line_status` (text) | `priority` (integer) | `is_free_sample` (boolean)
- `charge_type` (text) | `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `ship_date` (date) | `packing_style` (text) | `shipping_notes` (text) | `design_revision_id` (uuid)
- `sample_type` (text) | `box_type` (text) | `bagging_required` (boolean) | `shipped_qty` (numeric*)
- `remaining_qty` (numeric) | `unit_price` (numeric) | `total_amount` (numeric) | `quotation_line_id` (uuid)

## 3. Bảng `public.staging_order_lines_backfill` (BASE TABLE — 6,279 dòng)
- `staging_id` (bigint*) | `batch_no` (integer*) | `source_row_no` (integer*) | `order_no` (text*)
- `line_no` (integer*) | `product_id` (uuid*) | `product_code` (text) | `product_code_source` (text)
- `quantity` (numeric*) | `quantity_source` (numeric) | `quantity_normalized` (integer*) | `notes` (text)
- `validation_status` (text) | `validation_error` (text) | `created_at` (timestamptz)

## 4. Quy Tắc Schema Chuẩn V3 (`RULE-DATA-02`)
- **Khóa chính & Khóa ngoại:**
  - `orders.order_id` (`UUID`), `orders.company_id` -> `public.companies(company_id)` (**KHÔNG** tồn tại cột `customer_id`).
  - `order_lines.line_id` (`UUID`), `order_lines.order_id` -> `public.orders(order_id)`, `order_lines.product_id` -> `public.products(product_id)` (`NOT NULL`).
  - Lưu ý: Bảng `order_items` **KHÔNG TỒN TẠI** trong DB (`NOT_FOUND`). Cột `resolved_order_id` **KHÔNG TỒN TẠI** trong `staging_order_lines_backfill`.
- **Trạng thái đơn hàng (`orders.status`):** `'DRAFT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'PARTIAL_SHIPPED' | 'SHIPPED' | 'CLOSED' | 'CANCELLED'`.
