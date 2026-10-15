# 🚚 M10 — Giao Hàng, Chứng Từ Khách Hàng, Kho Nhựa/Khay & Hóa Đơn (`M10_shipments_billing/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 464 Threads / 3,049 Emails, Stage H)
1. **Giao hàng & Bộ chứng từ đặc thù theo khách hàng (`Stage H — Delivery & Document Exchange`):**
   - Xuất hàng không chỉ có Phiếu giao hàng chuẩn YSD (`納品書`) mà nhiều khách hàng bắt buộc dùng biểu mẫu riêng (`source_data/納品書_注文/`):
     - **SMK:** Mẫu `SMK指定納品書` (cập nhật 2025/04, 3 liên, kèm tem QR và phiếu hiện vật `現品票`).
     - **KYD / Shin-Ei Hitec:** Mẫu phiếu giao hàng chuyên dụng (`専用伝票`).
   - Đính kèm **Phiếu kiểm tra xuất xưởng (`検査票 / 検査表`)** in rõ mã khuôn (`Mold No`) và tỷ lệ nhựa tái chế; hỗ trợ dữ liệu vật liệu đóng gói theo quy định môi trường EU (`PPWR`).
2. **Quản lý Kho Cuộn Nhựa (`Plastics WMS`) & Tồn kho Khay thành phẩm (`Tray Inventory`):**
   - Theo dõi danh mục nhựa (`plastic_master = 818`), lô nhập cuộn nhựa (`plastic_receipt_roll = 321` cuộn) và tồn kho vật tư thực tế (`material_stock = 180` SKUs, đã seed từ Excel trong `seed_material_stock.py`).
3. **Hóa đơn & Công nợ (`Invoices & Billing`):**
   - Tổng hợp các đợt giao hàng trong tháng để phát hành Hóa đơn (`請求書`) và theo dõi công nợ khách hàng (`v_customer_debt_summary`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Giao hàng:** `/shipments` (redirect từ `/orders/shipments*`).
- **Kho cuộn nhựa & vật tư:** `/plastics/inventory`, `/plastics/inventory/new`, `/plastics/master` (redirect từ `/warehouse/rolls*`, `/inventory/inbound*`, `/materials*`, `/master/plastics*`).
- **Kho khay thành phẩm:** `/inventory` (đọc `v_product_stock_summary`; redirect từ `/production/inventory*`, `/inventory/finished-goods*`).
- **Hóa đơn:** `/invoices`.

## 3. Trạng Thái Hiện Tại & Hạng Mục Còn Thiếu (`Backlog`)
- **Đã hoàn thành:** Import `818` `plastic_master`, `321` `plastic_receipt_roll`, `180` `material_stock`; sửa lỗi hiển thị `/shipments` trong `WO-ORDER-SHIPMENT-UI-FIX`; hợp nhất toàn bộ route kho và giao hàng trong `WO-ROUTE-CLEANUP`.
- **Còn thiếu:** Kiểm thử E2E luồng tạo Phiếu giao hàng (`shipments`) -> Xuất PDF `納品書` (chuẩn YSD & form SMK) -> Tạo Hóa đơn (`invoices`).
