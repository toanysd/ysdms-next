# BÀI BÀN GIAO TIẾN TRÌNH YSDMS-NEXTGEN & LUỒNG NGHIỆP VỤ (BUSINESS FLOW)
**Thời điểm xuất bản:** 2026-05-29

Tài liệu này ghi nhận trạng thái mới nhất của dự án và cụ thể hóa Dòng chảy Nghiệp vụ (Business Flow) chuẩn xác từ phía khách hàng (Kowa Emori / YSD), phục vụ việc tiếp tục phát triển trên một máy khác.

---

## 1. TRẠNG THÁI TIẾN ĐỘ DỰ ÁN (PROJECT STATUS)

Chúng ta đang ở **Giai đoạn 2 (Phase 2): Xây dựng Form theo Dòng chảy nghiệp vụ (Product-Centric)**.
Các công việc đã hoàn thiện gần đây:

- ✅ **Phase 2.1:** Hoàn thiện giao diện Quản lý Khách hàng (`customer`) chuyên nghiệp, hỗ trợ phân cấp HQ / Branch / Delivery Site.
- ✅ **Phase 2.2:** Quản lý Khay (Tray / `product_master`). Hệ thống đã hỗ trợ đầy đủ các thông số chi tiết của Khay (kích thước, dung sai, vật liệu, xử lý bề mặt).
- ✅ **Phase 2.3:** Bổ sung Phân loại Đơn hàng (Order Types). Đã thêm các loại đơn hàng chuyên biệt: `design_tray`, `design_mold`, `prototype` vào schema (`order_type` enum) để đón đầu luồng phát triển.
- ✅ **Phase 2.4:** Hoàn thành module Quản lý Phiên bản Thiết kế (`mold_design_revision`). **Đặc biệt:** Đã thiết lập được mối liên kết trực tiếp giữa Khay (Tray) và Khuôn (Mold) thông qua bảng trung gian `product_mold_map`. Kỹ sư khi vẽ xong thiết kế có thể chọn ngay mã Khay để hệ thống tự động map dữ liệu. 

### Bước tiếp theo cần làm (Next Steps)
- **Phase 2.5 / Phase 3.1:** Chuyển sang chức năng **Chỉ thị Sản xuất (Production Directives) / Lệnh Sản Xuất (PO)** và **Lên Lịch (Scheduling)**. Từ Đơn hàng (Order) -> Chọn Khay -> Tự động truy xuất Khuôn đã được duyệt -> Ra Lệnh Sản Xuất.

---

## 2. LUỒNG NGHIỆP VỤ CỐT LÕI (CORE BUSINESS FLOW)

Đây là kim chỉ nam cho mọi module tiếp theo, được rút ra từ trao đổi thực tế qua Email với khách hàng (Kowa Emori):

### Luồng Lập Đơn Hàng diễn ra TRƯỚC Luồng Thiết Kế

1. **Tiếp nhận Yêu cầu / Khởi tạo Khay (Sales)**
   - Sale tiếp nhận yêu cầu từ khách hàng.
   - Sale tạo mã Sản phẩm (Khay - Tray) mới trên hệ thống tại màn hình `product_master` (VD: `KWE-005`), chưa cần bản vẽ chi tiết.

2. **Lập Đơn hàng Thiết kế / PO (Order)**
   - Khách hàng (VD: Kowa Emori) phát hành Purchase Order (PO) thanh toán Phí thiết kế khay.
   - Sale tạo Đơn hàng trên hệ thống, phân loại `order_type = design_tray`, liên kết trực tiếp với Khay `KWE-005`.

3. **Thiết kế & Phê duyệt (Engineering)**
   - Kỹ sư (VD: anh Quan) nhận thông báo từ Đơn hàng thiết kế.
   - Kỹ sư lên bản vẽ 3D.
   - Kỹ sư vào hệ thống, tạo Khuôn (Mold Base) mới và upload thông số Thiết kế (Mold Design Revision).
   - **Crucial Step:** Trong form Thiết kế, Kỹ sư chọn liên kết với Khay `KWE-005` (Tính năng vừa hoàn thành ở Phase 2.4).
   - Gửi bản vẽ cho khách hàng duyệt.

4. **Yêu cầu Sample / Làm Khuôn (Prototype / Mold Making)**
   - Khách hàng duyệt bản vẽ và chốt: "Hãy làm khuôn và cho chạy 20 sample".
   - Sale mở Đơn hàng mới (hoặc sửa đơn cũ), chuyển thành Đơn Sample (`order_type = prototype` hoặc `design_mold`).
   - Xưởng chế tạo khuôn (hoặc đặt gia công ngoài như gửi đi phủ Teflon). Trạng thái Khuôn (`mold_design_revision`) được đổi thành **APPROVED**.

5. **Chỉ thị Sản xuất (Production / Mass Production)**
   - Khi có Đơn hàng sản xuất hàng loạt (Mass Production).
   - Hệ thống (dự kiến ở Phase 3) sẽ cho phép người dùng click "Tạo Chỉ thị Sản xuất" từ Đơn hàng.
   - Nhờ mối liên kết ở Bước 3 (`product_mold_map`), hệ thống tự động biết phải dùng Khuôn nào, Vật liệu nhựa (Plastic BOM) nào để ép ra Khay `KWE-005` mà không cần người dùng phải tự tìm.

---

## 3. LƯU Ý CHO PHIÊN LÀM VIỆC TẠI MÁY MỚI (HANDOVER NOTES)

- Mọi form và UI phải tuyệt đối tuân thủ nguyên tắc **Product-Centric** (Mọi thứ xoay quanh Khay/Sản phẩm gốc) và tái sử dụng các Component đã có (`ProductSearchInput`, UI chuẩn của hệ thống).
- Cơ sở dữ liệu (`database.types.ts`) đã hoàn toàn đồng bộ, không có lỗi TypeScript.
- Khi bật máy mới, hãy chạy `npm run dev` và ưu tiên vào phát triển luồng **"Chỉ thị Sản xuất" (Production Directives)** tiếp nối các dữ liệu đã thông suốt từ Phase 2.
