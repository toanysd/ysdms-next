# Sổ Tay Hướng Dẫn Thao Tác: Chu Trình Đơn Hàng Mới

Tài liệu này hướng dẫn chi tiết từng bước thao tác trên giao diện hệ thống **YSDMS-NextGen** để nhập liệu một đơn hàng hoàn chỉnh, xuyên suốt từ khâu tiếp nhận đến khi xuất hàng.

> [!NOTE]
> **Quy tắc cốt lõi:** Dữ liệu trong hệ thống có tính kế thừa. Dữ liệu tạo ở Bước trước sẽ tự động liên kết và làm cơ sở cho Bước sau. Tuyệt đối không nhảy cóc các bước để tránh đứt gãy luồng thông tin.

---

## 🧭 Bức Tranh Tổng Quan (Workflow)
Luồng nghiệp vụ chuẩn được chia làm 4 giai đoạn chính, tương ứng với các Menu trên thanh Sidebar bên trái:
1. **Kinh doanh:** Tạo Khách hàng ➡️ Lên Đơn hàng (PO).
2. **Kỹ thuật (R&D):** Yêu cầu Thiết kế Khay ➡️ Chế tạo Khuôn / Dao cắt.
3. **Kế hoạch & Sản xuất:** Lên lịch Sản xuất ➡️ Định hình Khay ➡️ Nhập kho.
4. **Kho & Xuất hàng:** Cấn trừ tồn kho ➡️ Xuất hàng cho khách.

---

## 🛠 Hướng Dẫn Thao Tác Chi Tiết

### Bước 1: Tiếp nhận Khách hàng (Customer)
**📍 Menu:** `得意先 (Khách Hàng)`
Khi có một yêu cầu/đơn hàng mới, việc đầu tiên là xác định Khách hàng.
1. Nhập tên khách hàng vào thanh tìm kiếm.
2. Nếu khách hàng **đã tồn tại**, chuyển sang Bước 2.
3. Nếu là khách hàng **mới**, bấm nút **"Tạo mới (新規作成)"**.
4. Điền các thông tin bắt buộc:
   - Tên công ty (VD: 興和江守株式会社).
   - Địa chỉ & Mã số thuế (nếu có).
   - Thông tin người liên hệ (Người phụ trách, Email, SĐT).
5. Bấm **Lưu**.

### Bước 2: Khởi tạo Đơn hàng (Order & Items)
**📍 Menu:** `受注・指示書 (Đơn Hàng / Chỉ thị)`
Đây là thao tác quan trọng nhất để kích hoạt toàn bộ chu trình.
1. Bấm **"Tạo Đơn Hàng Mới"**.
2. **Chọn Khách hàng** vừa tìm/tạo ở Bước 1.
3. **Nhập thông tin PO (Purchase Order):**
   - Mã PO (VD: 4125887).
   - Ngày đặt hàng & Ngày giao hàng dự kiến (L/T).
4. **Thêm Hạng mục Đơn hàng (Order Items):**
   - Chọn **Loại đơn hàng (Order Type)**: Tùy theo yêu cầu mà chọn *Thiết kế khay (design_tray)*, *Sản xuất khay (molding)*, hoặc *Làm khuôn (mold_base)*.
   - Chọn Sản phẩm/Mã khay (VD: KWE-005). *Nếu là khay mới chưa từng thiết kế, gõ tên mã mới vào.*
   - Nhập **Số lượng (Quantity)** và **Đơn giá / Thành tiền**.
5. Bấm **Lưu Đơn Hàng**. Hệ thống sẽ tự động phát sinh các Chỉ thị (Chỉ thị thiết kế, Chỉ thị sản xuất) tùy theo Loại đơn hàng vừa chọn.

### Bước 3: Xử lý Yêu cầu Thiết kế (Engineering)
**📍 Menu:** `設計依頼 (Yêu cầu Thiết kế)`
*Bước này chỉ áp dụng nếu Đơn hàng ở Bước 2 là Đơn thiết kế khay mới.*
1. Mở danh sách Yêu cầu Thiết kế, hệ thống đã tự động đẩy thẻ việc từ Bước 2 sang đây.
2. Trưởng phòng Kỹ thuật phân công nhân sự (VD: Assign cho "Quan").
3. Nhân viên Kỹ thuật tiến hành thiết kế. Cập nhật trạng thái thành **"Đang thực hiện"**.
4. Cập nhật thông số kỹ thuật (Vật liệu PET xanh, kích thước...).
5. Sau khi khách hàng chốt bản vẽ 3D, cập nhật trạng thái thành **"Đã duyệt"**.

### Bước 4: Tạo hồ sơ Khuôn & Dao cắt
**📍 Menu:** `金型マスター (Khuôn Vật lý)` & `抜型 (Dao Cắt)`
Khi đã có bản vẽ, tiến hành gia công công cụ sản xuất.
1. Từ bản vẽ đã duyệt, bấm nút **"Tạo Chỉ thị làm Khuôn"**.
2. Nhập thông số Khuôn (Kích thước: 355x240).
3. **Lưu ý đặc biệt:** Nếu khuôn cần xử lý thêm (VD: Mạ Teflon chống dính), phải ghi rõ vào mục **Ghi chú Kỹ thuật (Remarks)** để xưởng khuôn nắm được.
4. Tương tự, chuyển sang Menu Dao cắt để tạo mã Dao cắt tương ứng cho Khay này.

### Bước 5: Lập Kế hoạch Sản xuất
**📍 Menu:** `生産計画 (Lập Kế hoạch SX)`
1. Quản lý sản xuất mở màn hình Kế hoạch. Hệ thống sẽ hiển thị các Đơn hàng Khay (molding) đang chờ sản xuất.
2. Bấm **"Lên lịch"** cho đơn hàng (VD: 80 pcs).
3. Chọn Máy định hình, chọn Ngày chạy máy, và Ca làm việc.
4. Chọn đúng mã Khuôn và Dao cắt đã tạo ở Bước 4.
5. Bấm **Chốt Kế hoạch**. Lệnh sản xuất sẽ được đẩy xuống xưởng.

### Bước 6: Định hình & Nhập kho (Xưởng)
**📍 Menu:** `生産現場 (成形) (Xưởng Định Hình)`
1. Công nhân dưới xưởng mở màn hình, thấy lệnh chạy máy của mình.
2. Bấm **"Bắt đầu"** khi máy chạy.
3. Khi xong ca, nhập **Nhật ký Sản xuất (Production Log)**:
   - Số lượng khay đạt chuẩn (OK).
   - Số lượng khay lỗi (NG) và Phế liệu nhựa (Waste).
4. Bấm **Hoàn thành**. Hệ thống tự động đẩy số lượng khay OK vào Kho Thành Phẩm.

### Bước 7: Cấn trừ Tồn kho & Xuất hàng
**📍 Menu:** `受注・指示書 (Đơn Hàng / Chỉ thị)` ➡️ Tab: Xuất Hàng
1. Bộ phận kho / Kinh doanh kiểm tra lại Đơn hàng. Trạng thái kho lúc này sẽ báo "Đủ hàng".
2. Bấm **"Tạo Phiếu Xuất Hàng (Shipment)"**.
3. Điền thông tin giao hàng (VD: Ship tới Adogawa Electronics).
4. Bấm **Xác nhận Xuất Kho**. 
5. Hệ thống sẽ tự động trừ kho thành phẩm, chốt trạng thái Đơn hàng thành **"Hoàn thành"** và xuất file Báo cáo giao hàng (Delivery Note) nếu cần.

> [!WARNING]
> **Xử lý sự cố:** Nếu nhập sai số lượng ở Bước Khách hàng / Đơn hàng, tuyệt đối không tạo đơn mới đè lên. Hãy vào đúng Đơn hàng đó bấm "Chỉnh sửa" để hệ thống tự động đồng bộ lại dữ liệu cho các khâu phía sau.
