# Kế hoạch Triển khai Ưu tiên 1: Quản lý Vật tư (Theo Đơn vị MÉT)

Cảm ơn anh đã đính chính một nghiệp vụ cực kỳ quan trọng và sát thực tế của nhà máy: **Nhựa không quản lý vo theo Kg mà quản lý theo Cuộn (Roll) và chiều dài (Mét).** 
Việc để công nhân trực tiếp đo đếm "Số mét tiêu hao", "Số mét còn lại", và "Số mét lãng phí" ngay trên máy là quy trình chuẩn xác nhất để chống thất thoát vật tư.

Dựa trên nghiệp vụ này, tôi đã đập bỏ hoàn toàn giả định cũ và cấu trúc lại toàn bộ Kế hoạch Triển khai (Implementation Plan) như sau:

## 1. Mở rộng Cấu trúc Database (Schema Migration)
Vì hệ thống cũ đang dùng đơn vị `Kg`, chúng ta cần tạo một bản Migration mới (`060_update_plastic_to_meters.sql`) để:
- **Cập nhật Bảng `production_log` (Nhật ký SX):** Thêm các cột:
  - `roll_barcode` (Mã cuộn nhựa đang chạy - tùy chọn).
  - `meters_consumed` (Số mét đã tiêu hao).
  - `meters_remaining` (Số mét còn lại trên cuộn).
  - `meters_wasted` (Số mét lãng phí/phế liệu).
- **Cập nhật Bảng `inventory_txn` (Giao dịch Kho):** Đổi tư duy từ `qty_kg` sang `qty_meters`.
- **Cập nhật Bảng `plastic_master`:** Thêm thông số quy cách cuộn tiêu chuẩn (VD: Standard Length = 200m hoặc 250m).

## 2. Cập nhật Màn hình Công nhân Xưởng (Production UI)
- Tại màn hình **Xưởng Định Hình (Shopfloor)**: Khi công nhân bấm nút "Hoàn thành ca", Form khai báo sẽ hiện thêm khu vực **"Báo cáo Vật tư (Nhựa)"**.
- Công nhân sẽ nhập đúng 3 con số như anh yêu cầu: Số mét tiêu hao, Số mét còn lại, và Số mét lãng phí.
- (Tính năng mở rộng): Hệ thống có thể tự động tính nhẩm giúp công nhân `Số mét lãng phí = Tiêu hao - (Chiều dài 1 khay * Số khay OK)` để đối chiếu với số công nhân tự tính.

## 3. Tính toán Tồn kho & MRP (Inventory & MRP Logic)
- **View Tồn kho (`plastic_stock`):** Viết lại logic để Tổng tồn kho (Số mét hiện có) = `Tổng số mét nhập kho (Inbound)` - `Tổng số mét tiêu hao (từ các production_log)`. 
- Tồn kho sẽ được gom nhóm theo Loại nhựa (VD: PET xanh 0.5mm).
- **Màn hình MRP:** Sẽ dự báo dựa trên đơn vị Mét thay vì Kg. (Nhu cầu số mét = Chiều dài 1 khay x Số lượng khay cần sản xuất).

---

## 🙋‍♂️ Câu hỏi cho anh (Open Question)
1. Để tính toán được Nhu cầu (Demand) trên MRP, hệ thống cần biết **"1 khay tốn bao nhiêu chiều dài mét nhựa"**. Thông số này chúng ta sẽ cấu hình ở màn hình Thiết kế Khay (hoặc Thiết kế Khuôn) đúng không anh? (Ví dụ: Pitch/Bước dập là 360mm / 1 khuôn).

Nếu Kế hoạch này đã phản ánh chuẩn xác quy trình vận hành thực tế của nhà máy anh, anh hãy duyệt để tôi gọi đội ngũ Agents bắt tay vào lập trình ngay nhé!
