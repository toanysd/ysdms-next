# 02_BUSINESS_PROCESS — Luồng Nghiệp Vụ Thực Tế
# YSDMS | YSD Manufacturing System
**Phiên bản:** 1.0-partial
**Ngày ban hành:** 2026-07-13
**Người phê duyệt:** Thoan (Product Owner)
**Trạng thái:** ACTIVE (Phần 1 & 2 đã duyệt — Phần 3 & 4 chờ SD-08/SD-09)

> **Ghi chú phân biệt với 01_BRD.md:**
> - `01_BRD.md` = Yêu cầu nghiệp vụ (PHẢI làm gì)
> - `02_BUSINESS_PROCESS.md` = Luồng vận hành thực tế (Hệ thống THỰC SỰ hoạt động như thế nào — đã implemented)

---

## Section 1: Luồng Giao Hàng & Đóng Gói
*(Nguồn: Phân tích form mẫu SMK, KYD và toanysdmail.CSV)*

### BR-P01: Phân loại Giao hàng (Shipment Type)
Giao dịch giao hàng không chỉ giới hạn ở vật lý (khay nhựa), mà còn bao gồm các hạng mục dịch vụ:

| Loại | Giá trị DB | Mô tả |
|---|---|---|
| Hàng vật lý | `physical` | Giao khay nhựa định hình |
| Dịch vụ | `service` | Phí thiết kế 3D, phí lưu kho, phí hủy khuôn |
| Hỗn hợp | `mixed` | Bao gồm cả hai loại trên |

### BR-P02: Phân loại Mẫu thử (Sample Type)
Trong quá trình đặt hàng/giao hàng, hệ thống nhận diện 4 loại mẫu đặc thù:

| Loại mẫu | Giá trị DB | JA | Tính phí |
|---|---|---|---|
| Mẫu miễn phí | `FREE` | 無償サンプル | Không |
| Mẫu kiểm định đầu vào | `QC_INSPECT` | 入検用 | Không |
| Mẫu điều chỉnh máy | `MACHINE_ADJUST` | 設備調整用 | **Có** |
| Mẫu lưu văn phòng | `OFFICE` | 事務所用 | Không |

> `NULL` = Không phải mẫu thử (đơn hàng sản xuất thông thường)

### BR-P03: Giấy tờ & Template Giao hàng (Delivery Documents)
Tùy thuộc vào khách hàng, lô hàng bắt buộc phải đính kèm các chứng từ kỹ thuật đặc thù:

| Khách hàng | Template | Giấy tờ bắt buộc đi kèm |
|---|---|---|
| Mitsubishi KYD | `kyd` | Chứng nhận kiểm tra (試験成績書) |
| SMK | `smk` | Bảng kiểm tra sản xuất hàng loạt (量産検査表) + **In Mold No trên phiếu** |
| Tiêu chuẩn | `standard` | Phiếu giao hàng tiêu chuẩn (標準納品書) |

### BR-P04: Quản lý Lô & Chất lượng (Lot & QC Tracking)
- **Công thức phân tách QC:** `Delivered Qty = Good Qty + Defective Qty`
- **Chuỗi truy xuất (Traceability):** `Shipment → Production Lot → Physical Mold`
- Mã khuôn (Mold No) phải có thể in ra trực tiếp trên phiếu giao hàng của SMK

---

## Section 2: Luồng Quản lý Vật Tư & Sản Xuất
*(Nguồn: 482 file Excel tồn kho hàng ngày — quy trình 指示書連動)*

### BR-M01: Định mức Vật tư (BOM)
- Mọi Lệnh Sản Xuất (`production_orders`) đều tự động liên kết định mức tiêu hao nhựa từ `mold_material_bom` dựa trên khuôn đang sử dụng (`bom_reference_mold_id`)
- BOM cấu hình rõ: **Loại nhựa**, **Khổ cuộn (Width)**, **Độ dày (Thickness)**, **Tiêu hao mỗi lần dập (Consumption per shot)**

### BR-M02: Trạng thái Kho Kanban (Kanban Status)
Kho vật tư vận hành theo mô hình trạng thái tương tác với máy sản xuất:

| Trạng thái | Giá trị DB | JA | Ý nghĩa |
|---|---|---|---|
| Đủ vật tư | `ok` | — | Tồn kho trên ngưỡng an toàn |
| Cảnh báo thấp | `low` | — | Dưới ngưỡng `min_stock_alert` |
| Chờ cấp vật tư | `waiting_supply` | ZN.材料待ち | Lệnh SX đang treo chờ cấp nhựa ra máy |
| Yêu cầu mua | `request_purchase` | ZR.材料Request | Cần đặt mua thêm từ nhà cung cấp |

### BR-M03: Logic Giữ Chỗ & Trừ Lùi (Reservation & Consumption)
1. Khi Lệnh SX được tạo → vật tư chuyển sang `quantity_reserved`
2. Khi máy bắt đầu chạy → tạo `material_consumption_logs` theo từng Lot
3. Tồn kho thực tế (`quantity_current`) bị trừ lùi dần theo log tiêu hao
4. **Công thức cảnh báo:** Nếu `(quantity_current - quantity_reserved) < min_stock_alert` → chuyển sang `low`

### BR-M04: Báo cáo Môi trường PPWR (EU Compliance)
- Vật tư đóng gói được đánh dấu `ppwr_reportable = true` tại cấp BOM
- Khi tiêu hao các vật tư này, log ghi `is_packaging = true`
- **Xuất báo cáo PPWR:** Filter `material_consumption_logs WHERE is_packaging = true` theo kỳ báo cáo

---

## Sections Chờ Bổ Sung

| Section | Nội dung | Phụ thuộc | Trạng thái |
|---|---|---|---|
| Section 3 | Luồng Chỉ thị Sản Xuất → Xuất PDF | SD-08 | ⏳ Chờ thiết kế |
| Section 4 | Luồng QC & Truy xuất Lô chi tiết | SD-09 | ⏳ Chờ thiết kế |
