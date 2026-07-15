# KẾ HOẠCH TÁI ĐỊNH HƯỚNG YSDMS-NEXTGEN (ERP/MES REALIGNMENT PLAN)

**Ngày cập nhật:** 2026-05-28
**Phiên bản thảo luận:** Kế thừa từ MoldCutterSearch sang Full MES/ERP.

---

## 1. TÓM TẮT LỊCH SỬ THẢO LUẬN

1. **Vấn đề đã nhận diện:** 
   - YSDMS-NextGen ban đầu được phát triển với mục tiêu thay thế MoldCutterSearch (chỉ có tính năng đọc/tra cứu dữ liệu qua CSV/GitHub).
   - Tuy nhiên, trong quá trình phát triển các module (như Kanban, MRP), dự án đã đi chệch hướng khi tập trung vào phần ngọn (Giao diện hiển thị, Xưởng) mà bỏ qua phần gốc (Cấu trúc cơ sở dữ liệu và Luồng khởi tạo dữ liệu đầu vào - CRUD).
   - Quan hệ giữa các bảng hiện tại còn sơ sài, tên bảng/trường chưa chuẩn hóa.

2. **Quyết định định hướng lại:**
   - Hệ thống phải là một **Ứng dụng Doanh nghiệp toàn diện (Full ERP/MES)**.
   - Bắt buộc phải **tái hiện lại UI/UX xuất sắc của MoldCutterSearch** nhưng nâng cấp lên thành giao diện nhập liệu (CRUD) tương tác trực tiếp với Supabase.
   - Dữ liệu phải được khởi tạo tuân thủ nghiêm ngặt **Dòng chảy Nghiệp vụ (Business Flow)**: `Khách hàng/Đơn hàng -> Thiết kế Khay -> Tạo thông tin Khuôn/Dao -> Lên lịch -> Thực thi Sản xuất (Kanban) -> Kho/MRP`.

---

## 2. LỘ TRÌNH TRIỂN KHAI MỚI (COMPREHENSIVE ROADMAP)

### GIAI ĐOẠN 1: CHUẨN HÓA SCHEMA & TÁI HIỆN UI NỀN TẢNG
- **1.1 Chuẩn hóa Database Schema:** Review lại toàn bộ bảng trong Supabase. Thống nhất quy tắc đặt tên (`snake_case`), thiết lập đầy đủ khóa ngoại (Foreign Keys) giữa `customers`, `orders`, `product_master`, `mold_base`, `cutter_master`. Khắc phục mọi liên kết đứt gãy.
- **1.2 Tái hiện Giao diện Tra cứu (Read-only UI):** Phục dựng lại giao diện Search UI/UX Grid view, Filters, Pagination của MoldCutterSearch cũ bằng Next.js.
- **1.3 Nâng cấp thành CRUD (Write UI):** Tích hợp tính năng Thêm/Sửa/Xóa ngay trên giao diện Tra cứu, biến hệ thống thành công cụ quản trị dữ liệu trực tiếp thay vì phụ thuộc CSV.

### GIAI ĐOẠN 2: XÂY DỰNG FORM THEO DÒNG CHẢY NGHIỆP VỤ
- **2.1 Khách hàng & Đơn hàng (Sales & Order Form):** Form tiếp nhận Yêu cầu/Đơn hàng.
- **2.2 Thiết kế Sản phẩm / Khay (Tray Design Form):** Kế thừa dữ liệu từ Đơn hàng -> Nhập thông số thiết kế Khay -> Duyệt.
- **2.3 Yêu cầu Khuôn & Dao (Mold & Cutter Form):** Gợi ý tự động tạo thông số Khuôn/Dao từ Khay đã duyệt.
- **2.4 Định mức Vật tư (BOM):** Liên kết Nhựa (Plastic) với Khuôn để phục vụ MRP.

### GIAI ĐOẠN 3: ĐIỀU HÀNH SẢN XUẤT & KHO
- **3.1 Lên lịch Sản xuất (Scheduling):** Xếp lịch cho Máy ép/Cắt dựa trên đơn hàng và trạng thái khuôn.
- **3.2 Xưởng Sản xuất (Kanban Execution):** Màn hình cho công nhân nhập kết quả (OK/NG).
- **3.3 Quản lý Kho & MRP:** Quản lý xuất/nhập, tự động tính toán nhu cầu vật liệu (MRP).

---

## 3. BƯỚC TIẾP THEO SẼ THỰC HIỆN KHI TIẾP TỤC PHIÊN LÀM VIỆC

Khi mở lại dự án trên máy khác, hãy bắt đầu ngay vào **GIAI ĐOẠN 1.1 (Chuẩn hóa Schema)**:
1. Chạy script trích xuất toàn bộ cấu trúc bảng hiện tại (`database.types.ts`).
2. Vẽ sơ đồ quan hệ (ERD) hoặc lập danh sách các bảng/cột cần đổi tên/cập nhật Foreign Key.
3. Tạo các file SQL Migration để cập nhật Supabase theo chuẩn ERP.
