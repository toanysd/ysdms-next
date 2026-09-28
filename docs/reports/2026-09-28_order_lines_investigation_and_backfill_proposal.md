# Báo cáo Điều tra Dữ liệu Đơn hàng & Kế hoạch Backfill `order_lines`

> **Ngày thực hiện:** 2026-09-28  
> **Người thực hiện:** AN  
> **Người thẩm định:** PE & Anh Thoan  
> **Phạm vi:** Điều tra hiện trạng `orders` (2.396 dòng) và `order_lines` (0 dòng) trên Supabase Production.

---

## 1. Hiện trạng Xác minh Thực tế trên Supabase Production

| Bảng | Số lượng dòng (Count) | Tình trạng | Ghi chú |
|---|---|---|---|
| `orders` | **2.396 dòng** | Chỉ có thông tin Header | Cột `notes` ghi: `Imported from YSDトレー受注一覧 \| X lines` |
| `order_lines` | **0 dòng** | Trống 100% | Nguyên nhân khiến autocomplete và tạo Shipment lỗi |
| `shipments` | **0 dòng** | Trống 100% | Bị chặn do `order_lines` rỗng |
| `delivery_notes` | **0 dòng** | Trống 100% | Chưa có dữ liệu phát sinh |
| `work_orders` | **1.203 dòng** | Không liên kết đơn hàng | 100% `order_id = NULL` (Khuôn/Sửa khuôn từ Access `db_Khuon_be`) |
| `jobs` | **1.204 dòng** | Tiến độ gia công khuôn | Không lưu chi tiết sản phẩm của đơn hàng bán |

---

## 2. Truy nguyên Nguồn Dữ liệu Gốc (Root Cause Tracing)

### 2.1. Nguồn gốc của 2.396 đơn hàng trong `orders`
- **Tập tin Excel nguồn:** `YSDトレー受注一覧（改2）4-22.xlsx` (được cập nhật đến bản `9-28.xlsx` trên file share `\\SERVER\ysd-folder\社長データ\6）成形関連\成形工程表\`).
- **Lịch sử ETL (Phase R6-S2 / Chỉ đạo #40, #41 - 2026-08-24):**
  - Script trích xuất: `source_data/scripts/parse_orders_v2.py`.
  - Kết quả phân tích được lưu tại: `source_data/parse_output_dryrun_v2.json`.
  - Dữ liệu lịch sử đã gom nhóm theo `(Ngày đặt hàng + Mã công ty)` để tạo mã đơn `ORD-{YYYYMMDD}-{CompanyCode}`.
  - Tổng số đơn trong JSON: **2.399 đơn**.
  - Trong đó, **2.396 đơn** đã được nạp thành công vào bảng `orders` trên Supabase (3 đơn còn lại là các dòng ghi chú mẫu trống của AON, RYK, MRY).

### 2.2. Chi tiết các dòng sản phẩm (`order_lines`) ở đâu?
- Trong file `source_data/parse_output_dryrun_v2.json`, toàn bộ thông tin chi tiết của các đơn hàng đã được bóc tách và phân giải:
  - Tổng số dòng sản phẩm: **6.282 dòng**.
  - Số dòng thuộc 2.396 đơn hàng đang có trong DB: **6.279 dòng**.
  - **Tỷ lệ ánh xạ `product_id`:** **100% (6.279/6.279 dòng)** đã có sẵn `product_id` hợp lệ.
  - Tổng số sản phẩm duy nhất được tham chiếu: **713 sản phẩm**.
  - **Kiểm chứng toàn vẹn FK:** Đã đối soát 713 `product_id` này trực tiếp với bảng `products` trên Supabase Production $\rightarrow$ **713/713 tồn tại 100% (0 lỗi FK)**.
  - Số dòng có số lượng cụ thể: **6.277 dòng** (tổng số lượng: **8.701.479 PCS**).
  - Số dòng mẫu không ghi số lượng: **2 dòng** (đều có ghi chú `サンプル棚補充` - bổ sung kệ mẫu, tạm gán số lượng = 1).

### 2.3. Vì sao `order_lines` hiện tại lại 0 dòng?
1. Vào ngày 2026-08-24, script `insert_orders_batch.py` chỉ thực hiện nạp thử nghiệm lô nhỏ (`BATCH_SIZE=50`).
2. Trong quá trình phát triển tiếp theo từ cuối tháng 8 đến tháng 9/2026, hàng loạt migration đã làm thay đổi và bổ sung cấu trúc của bảng `order_lines`:
   - Migration 087 (`20260903000004_087_add_order_lines_delivery_fields.sql`): Thêm `shipped_qty`, `remaining_qty`.
   - Migration 105 (`20260909000003_105_quotation_to_order_pipeline.sql`): Thêm `unit_price`, `total_amount`, `design_revision_id`, `quotation_line_id`.
3. Bảng `order_lines` đã bị xóa trống (reset/truncate) trong quá trình tinh chỉnh schema, trong khi bảng cha `orders` vẫn được bảo toàn nguyên vẹn 2.396 bản ghi header.

---

## 3. Kết quả Dry-Run Đối chiếu Độc lập (Chỉ đọc, không ghi)

Script kiểm tra: `scripts/dry_run_backfill_order_lines.mjs`

```
=== DRY-RUN VERIFICATION: ORDER_LINES BACKFILL ===

[Source JSON] Total orders parsed: 2399
[Supabase DB] Total orders in database: 2396
[Matching] Matched orders: 2396 / 2396 (100.0%)
[Matching] Unmatched orders from JSON: 3
   (Unmatched: ORD-20260422-AON, ORD-20261014-RYK, ORD-20261014-MRY)
[Candidate Lines] Total candidate order_lines: 6279
[Candidate Lines] Unique product_ids: 713
[Candidate Lines] Lines with null original quantity (defaulted to 1): 2
[Candidate Lines] Total quantity sum across all lines: 8,701,479 PCS

--- Validating Product FKs in Supabase ---
[Product FK Check] Valid product references: 713 / 713
[Product FK Check] ✅ 100% of product references exist in products table!

[Current DB State] Current order_lines row count: 0

=== DRY-RUN VERIFICATION SUMMARY ===
- Target DB table: public.order_lines
- Ready to backfill: 6279 rows across 2396 orders
- Idempotency key: (order_id, line_no)
- Foreign Key Integrity: 100% Orders exist, 100% Products exist
- Verification status: PASSED ✅ (Ready for PE review)
```

---

## 4. Đề xuất Phương án Kỹ thuật Backfill Dữ liệu

### 4.1. Quy cách Dữ liệu Chèn vào `order_lines`
- `order_id`: UUID của đơn hàng tương ứng trong bảng `orders` (khớp theo `order_no`).
- `line_no`: Số thứ tự tăng dần từ 1 trong mỗi đơn hàng.
- `product_id`: UUID sản phẩm đã chuẩn hóa từ `source_data/parse_output_dryrun_v2.json`.
- `quantity`: Số lượng đặt hàng (PCS). Với 2 dòng mẫu đặc biệt, gán mặc định = 1.
- `unit`: Mặc định `'PCS'`.
- `line_status`: Mặc định `'CONFIRMED'`.
- `shipped_qty`: `0`.
- `remaining_qty`: Bằng `quantity`.
- `notes`: Ghi chú kèm theo dòng (nếu có).

### 4.2. Tính Bất biến & An toàn (Idempotency)
- Sử dụng lệnh `upsert` với khóa xung đột `onConflict: 'order_id,line_no', ignoreDuplicates: true`.
- Chia nhỏ nạp theo từng lô (Batch chunks of 500 rows) để tránh quá tải kết nối REST API hoặc vượt giới hạn payload.
- File thực thi đã được chuẩn bị sẵn kèm cơ chế bảo vệ: `scripts/execute_backfill_order_lines.mjs` (bắt buộc phải có cờ `--execute` mới ghi dữ liệu).

---

## 5. Kiến nghị Tiếp theo
1. Kính trình PE và Anh Thoan phê duyệt phương án backfill 6.279 dòng vào `order_lines`.
2. Sau khi PE phê duyệt, AN sẽ kích hoạt script `node scripts/execute_backfill_order_lines.mjs --execute`.
3. Kiểm tra kiểm chứng:
   - `order_lines` đạt đủ 6.279 dòng.
   - Thử nghiệm chức năng `searchOrderLinesAction()` trong `src/app/shipments/actions.ts` để thông luồng tạo Shipment tại `/shipments/new`.
