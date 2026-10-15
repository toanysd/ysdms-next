# 🗄️ M10 — Schema Giao Hàng, Kho Cuộn Nhựa/Khay & Hóa Đơn (`M10_shipments_billing/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `plastic_master = 818` | `plastic_receipt_roll = 321` | `material_stock = 180` | `v_product_stock_summary = 8,488` | `shipments = 0` | `invoices = 0` | `invoice_lines = 0`.

## 1. Bảng `public.shipments` (BASE TABLE — 0 dòng) & `public.shipment_lots` (0 dòng)
### `public.shipments`:
- `shipment_id` (uuid*) | `order_id` (uuid) | `ship_date` (date*) | `delivery_site_id` (uuid)
- `shipped_by` (uuid) | `delivery_method` (text) | `tracking_no` (text) | `delivery_note_no` (text)
- `invoice_no` (text) | `status` (text) | `notes` (text) | `created_at` (timestamptz)
- `updated_at` (timestamptz) | `shipment_type` (text) | `service_desc` (text) | `document_template` (text)
- `order_line_id` (uuid) | `work_order_id` (uuid) | `shipped_quantity` (integer)
### `public.shipment_lots`:
- `shipment_lot_id` (uuid*) | `shipment_id` (uuid*) | `lot_id` (uuid*) | `qty_shipped` (numeric*)
- `carton_count` (integer) | `pallet_no` (text) | `notes` (text) | `created_at` (timestamptz*)
- `created_by` (uuid)

## 2. Bảng Kho Nhựa: `public.plastic_master` (818 dòng), `public.plastic_receipt_roll` (321 dòng), `public.material_stock` (180 dòng)
### `public.plastic_receipt_roll`:
- `id` (uuid*) | `roll_barcode` (text*) | `receipt_id` (uuid) | `plastic_id` (uuid)
- `nominal_length_m` (numeric*) | `received_length_m` (numeric*) | `current_length_m` (numeric*) | `status` (text)
- `location` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `lot_no` (text)
- `commercial_grade_code` (text) | `supplier_name` (text) | `warehouse_location` (text) | `notes` (text)
- `branch_id` (uuid)
### `public.material_stock`:
- `id` (uuid*) | `material_spec` (text*) | `factory_site` (text*) | `is_silicon` (boolean)
- `is_antistatic` (boolean) | `supplier_name` (text) | `current_stock_m` (numeric) | `reserved_m` (numeric)
- `snapshot_date` (date) | `created_at` (timestamptz) | `updated_at` (timestamptz)

## 3. Bảng `public.invoices` (0 dòng) & `public.invoice_lines` (0 dòng)
### `public.invoices`:
- `invoice_id` (uuid*) | `invoice_number` (text*) | `order_id` (uuid) | `shipment_id` (uuid)
- `company_id` (uuid*) | `invoice_date` (date*) | `due_date` (date*) | `total_amount` (numeric*)
- `tax_amount` (numeric*) | `net_amount` (numeric) | `paid_amount` (numeric*) | `remaining_amount` (numeric)
- `status` (text*) | `currency` (text*) | `notes` (text) | `created_by` (uuid)
- `created_at` (timestamptz) | `updated_at` (timestamptz) | `tax_rate` (numeric)

## 4. Khử Mâu Thuẫn Schema Cũ (`SCHEMA_REFERENCE.md` Cleanup)
- **Lưu ý bảng không tồn tại (`NOT_FOUND`):** Không có bảng tên `plastics`, `plastic_master_roll` hay `shipment_lines`; trong DB Production tên chuẩn là `public.plastic_master`, `public.plastic_receipt_roll`, `public.material_stock` (kèm view `public.material_inventory_v2 = 180` dòng) và `public.shipment_lots`.
- **Views tồn kho & công nợ:** `public.v_product_stock_summary` (`8,488` dòng) và `public.v_customer_debt_summary` (`2,214` dòng).
