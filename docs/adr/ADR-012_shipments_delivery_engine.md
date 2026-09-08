# ADR-012: Shipments & 納品書 Delivery Engine

- **Ngày:** 2026-09-08
- **Trạng thái:** PROPOSED
- **Người đề xuất:** AN (Antigravity Executing Agent)
- **Người phê duyệt:** PE (Project Engineer — chờ phê duyệt)
- **Tham chiếu:** Chỉ thị #036, Chỉ thị #037, Milestone 21

---

## 1. Bối cảnh (Context)
- Khảo sát thực tế Live DB theo Chỉ thị #036 cho thấy:
  - 1,203 bản ghi `work_orders` hiện tại đang ở trạng thái `COMPLETED` nhưng không có `order_id` (`order_id IS NULL`). Do đó, hệ thống bắt buộc phải hỗ trợ luồng xuất kho và giao hàng trực tiếp từ Work Order (WO-direct shipment) mà không phụ thuộc vào `orders`.
  - Bảng `shipments` (17 cột) và `delivery_notes` (10 cột) đã tồn tại trong database schema nhưng hiện tại đang có **0 bản ghi** (clean slate) — đây là cơ hội lý tưởng để triển khai tính năng giao hàng mà không vướng di trú dữ liệu cũ.
  - Tuy nhiên, bảng `shipments` hiện **CHƯA CÓ** cột liên kết với Lệnh sản xuất (`work_order_id`), chỉ có `order_id` và `order_line_id`.
  - Doanh nghiệp sản xuất YSD cần chứng từ giao nhận chuẩn Nhật Bản (納品書 — Delivery Note PDF) có mã số tự sinh `DN-YYYYMMDD-NNN`, bảng kê số lượng khay thực giao, thông tin vận chuyển và các ô ký nhận bàn giao để làm việc trực tiếp với khách hàng.

---

## 2. Quyết định Kiến trúc (Decisions)

### Quyết định 1: Thêm `shipments.work_order_id` qua Migration 101
- Bổ sung cột `work_order_id UUID REFERENCES public.work_orders(wo_id) ON DELETE SET NULL` vào bảng `shipments`.
- Đánh index `idx_shipments_work_order_id` trên `shipments(work_order_id)` để tối ưu hóa truy vấn tra cứu lịch sử giao hàng theo từng lệnh sản xuất.

### Quyết định 2: Hỗ trợ linh hoạt 2 luồng tạo Shipment
- **Luồng A (WO-direct — Ưu tiên triển khai trước):**
  - Áp dụng khi công đoạn dập khay hoàn tất (`work_orders` đạt `COMPLETED` hoặc có sản lượng `quantity_done`).
  - Cho phép quản lý xưởng bấm nút `[+ 出荷登録]` trực tiếp từ Tab Xuất hàng của Work Order để tạo phiếu giao hàng với số lượng thực tế hoàn thành.
- **Luồng B (Order-based — Đơn hàng thương mại):**
  - Tạo shipment dựa trên đơn hàng thương mại từ khách hàng (`orders` → `order_lines` → `shipments`).

### Quyết định 3: PDF Engine chuẩn Nhật A4 qua `@react-pdf/renderer`
- Render phía server (Server Action / Route Handler) tài liệu **納品書 (Phiếu Giao Hàng)** khổ giấy A4 Portrait.
- Cấu trúc phiếu:
  - **Header:** Logo Yoshida Package, tiêu đề `納品書`, mã số phiếu tự sinh `DN-YYYYMMDD-NNN`, ngày giao hàng, thông tin khách hàng & địa điểm giao hàng (`delivery_site_id`).
  - **Bảng chi tiết hàng hóa:** Tên mã khay, quy cách nhựa/kích thước, đơn vị tính, số lượng giao, đơn giá (nếu có), thành tiền và ghi chú đóng gói.
  - **Footer:** Phương thức vận chuyển (`delivery_method`), mã vận đơn (`tracking_no`), 3 ô phê duyệt/ký nhận (納品印, 受領印, 検収印).

### Quyết định 4: Quản lý file PDF qua Supabase Storage Bucket `delivery-docs`
- Phiếu giao hàng sau khi được sinh ra sẽ tự động upload lên Supabase Storage bucket `delivery-docs/`.
- Bản ghi `delivery_notes` sẽ lưu trữ `file_path` tới file PDF trong bucket, liên kết với `shipment_id`.

### Quyết định 5: Tái sử dụng triệt để Schema hiện có
- Tuyệt đối không tạo bảng mới thừa thãi (như `order_deliveries`).
- Tái sử dụng bảng `public.shipments` làm trung tâm điều phối giao hàng và `public.delivery_notes` làm nơi lưu trữ chứng từ pháp lý giao nhận.

---

## 3. Migration 101 DDL Preview

```sql
-- Migration 101: Link shipments to work_orders
ALTER TABLE public.shipments 
  ADD COLUMN IF NOT EXISTS work_order_id UUID 
  REFERENCES public.work_orders(wo_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_shipments_work_order_id 
  ON public.shipments(work_order_id);
```

---

## 4. Danh mục File thay đổi dự kiến

1. **Database:**
   - `supabase/migrations/20260908000004_101_shipments_work_order_link.sql`
2. **UI & Actions:**
   - `src/app/shipments/page.tsx` — Danh sách Shipments toàn hệ thống (bộ lọc WO/Order/Ngày giao).
   - `src/app/shipments/new/page.tsx` — Form tạo phiếu xuất hàng mới.
   - `src/app/shipments/[id]/page.tsx` — Chi tiết đợt xuất hàng & tải 納品書.
   - `src/app/shipments/_actions/createShipment.ts` — Server Action tạo shipment (Luồng A & B).
   - `src/app/shipments/_actions/generateDeliveryNote.ts` — Server Action sinh PDF & lưu Storage.
   - `src/app/production/work-orders/[id]/_components/TabShipment.tsx` — Tab 5 "出荷 (Giao hàng)" trên Work Order Detail.
   - `src/lib/pdf/deliveryNotePdf.tsx` — Template PDF 納品書 bằng `@react-pdf/renderer`.
3. **Documentation:**
   - `docs/adr/ADR-012_shipments_delivery_engine.md`
   - `docs/adr/README.md`
   - `SCHEMA_REFERENCE.md`

---

## 5. Hệ quả & Tương thích ngược (Consequences)
- Hoàn toàn tương thích ngược: Bảng `shipments` đang rỗng, việc thêm cột `work_order_id` (nullable) không gây ảnh hưởng đến bất kỳ tính năng hiện hữu nào.
- Đóng kín vòng đời sản xuất: Lần đầu tiên hệ thống kết nối xuyên suốt từ Đơn hàng/Yêu cầu → Lệnh sản xuất (WO) → Nhật ký dập (Nippo) → Phiếu xuất hàng (納品書 PDF).
