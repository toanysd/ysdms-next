# BÁO CÁO KHẢO SÁT SCHEMA PHÂN HỆ GIAO HÀNG (R4-S2-A SCHEMA CHECK)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày khảo sát:** 2026-08-20
- **Phạm vi:** Khảo sát Schema thực tế trên Live Supabase DB cho Phân hệ Giao Hàng & In Phiếu Giao 納品書 (Sprint R4-S2)
- **Trạng thái:** ✅ **HOÀN THÀNH KHẢO SÁT — SẴN SÀNG KIẾN TRÚC TRIỂN KHAI**

---

## 1. KẾT QUẢ KHẢO SÁT BẢNG `shipments`

Bảng `shipments` đã có sẵn trên Live Database với cấu trúc đầy đủ:

| Tên cột | Kiểu dữ liệu | Nullable | Mô tả & Khóa ngoại (FK) |
|---|---|---|---|
| `shipment_id` | `uuid` (PK) | NO | Khóa chính của đợt xuất hàng |
| `order_id` | `uuid` | YES | FK $\rightarrow$ `orders.order_id` (Đơn hàng xuất xưởng) |
| `delivery_site_id` | `uuid` | YES | FK $\rightarrow$ `delivery_sites.site_id` (Địa điểm nhà máy nhận hàng) |
| `delivery_note_no` | `text` | YES | Số phiếu giao hàng / 納品書番号 (VD: `DN-2408-001`) |
| `ship_date` | `date` | NO | Ngày xuất hàng thực tế (出荷日) |
| `delivery_method` | `text` | YES | Phương thức vận chuyển (`TRUCK` Xe tải YSD, `COURIER` Yamato/Sagawa, `SELF_PICKUP`) |
| `tracking_no` | `text` | YES | Mã vận đơn / Biển số xe giao hàng |
| `invoice_no` | `text` | YES | Số hóa đơn đi kèm (nếu có) |
| `shipped_by` | `uuid` | YES | FK $\rightarrow$ `employees.employee_id` (Kỹ sư/Thủ kho phụ trách xuất hàng) |
| `status` | `text` | YES | Trạng thái: `PREPARING` (Chuẩn bị), `SHIPPED` (Đang giao), `DELIVERED` (Đã giao), `CANCELLED` |
| `shipment_type` | `text` | YES | Phân loại: `MASS_PRODUCTION` (Hàng loạt), `SAMPLE` (Mẫu thử), `MOLD` (Giao khuôn), `REPAIR` |
| `service_desc` | `text` | YES | Tóm tắt nội dung lô hàng |
| `notes` | `text` | YES | Ghi chú vận chuyển & Lưu ý cho lái xe |

---

## 2. KẾT QUẢ KIỂM TRA BẢNG `shipment_lines` & `delivery_notes`

- ❌ Không có bảng `shipment_lines` riêng trong DB.
- ✅ Bảng `delivery_notes` (Phiếu giao hàng / Biên bản ký nhận) đã có sẵn trong DB:
  - `note_id` (PK), `shipment_id` (FK `shipments`), `issued_date`, `issued_by`, `confirmed_date`, `company_confirmed`, `file_path`, `notes`.
- ✅ Bảng `delivery_sites` (Địa chỉ nhà máy nhận hàng) đã có sẵn với đầy đủ:
  - `site_id`, `company_id`, `site_code`, `site_name`, `site_address`, `site_tel`, `contact_person`.

---

## 3. CỘT LIÊN QUAN ĐẾN XUẤT HÀNG TRONG `order_lines`

Bảng `order_lines` có đầy đủ các cột phục vụ điều độ xuất hàng và tính Backlog:
- `quantity`: Số lượng đặt hàng (Số lượng kế hoạch).
- `ship_date`: Ngày xuất hàng ghi nhận trên dòng đơn.
- `line_status`: Trạng thái dòng (`PENDING`, `IN_PRODUCTION`, `READY_TO_SHIP`, `DELIVERED`).
- `delivery_site_id`: Địa điểm nhà máy giao hàng.
- `box_type`, `packing_style`: Quy cách đóng thùng và số lượng khay/thùng.

### 📊 Công Thức Tính & Cập Nhật Backlog Qty:
$$\text{Total Ordered Qty} = \sum \text{order\_lines.quantity}$$
$$\text{Delivered Qty} = \sum \text{order\_lines.quantity (khi line\_status = 'DELIVERED')}$$
$$\text{Backlog Qty (Tồn đọng)} = \text{Total Ordered Qty} - \text{Delivered Qty}$$

---

## 4. ĐỀ XUẤT KIẾN TRÚC TRIỂN KHAI SPRINT R4-S2 (KHÔNG CẦN MIGRATION)

### 🔹 Luồng Nghiệp Vụ Xuất Hàng 1-Click:
1. **Màn hình Quản Lý Xuất Hàng (`/orders/shipments`):**
   - Danh sách các đợt giao hàng kèm bộ lọc ngày xuất, khách hàng, trạng thái (`SHIPPED`, `DELIVERED`).
   - Nút **+ 新規出荷登録 (Tạo đợt xuất hàng mới)**.
2. **Modal Tạo Đợt Xuất Hàng (`CreateShipmentModal`):**
   - Chọn Đơn hàng đang mở (`orders` + `order_lines`) $\rightarrow$ Chọn các dòng sản phẩm cần xuất.
   - Tự động điền Địa điểm giao hàng `delivery_sites` của khách.
   - Khi bấm Xác nhận xuất hàng:
     - Tạo bản ghi trong `shipments` (sinh mã `delivery_note_no` tự động `DN-YYMM-XXX`).
     - Cập nhật `line_status = 'DELIVERED'` và `ship_date` trên `order_lines`.
     - Tự động cập nhật `orders.order_status = 'COMPLETED'` nếu toàn bộ các dòng đã giao xong.
3. **Mẫu In Phiếu Giao Hàng 納品書 A4 Chuẩn Nhật (`ShipmentPDFDocument.tsx`):**
   - Tiêu đề: **納 品 書** (Phiếu giao hàng) & **納 品 受 領 書** (Biên bản nhận hàng).
   - Tên khách hàng + Địa chỉ xưởng giao hàng (`delivery_sites`) + Kính ngữ **御中**.
   - Bảng chi tiết: `No | 製品名 (Product Name) | 数量 (Quantity) | 単位 (Unit) | 梱包形態 (Box/Pack) | 備考`.
   - Khung đóng dấu Hanko 3 ô (承認 / 出荷担当 / 受領印 - Chữ ký người nhận của khách).
   - Mã QR code tra cứu `shipment_id`.

---

Kính trình Trưởng dự án PE phê duyệt kết quả khảo sát schema R4-S2-A để AN tiến hành triển khai code Sprint R4-S2!
