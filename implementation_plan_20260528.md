# Kế Hoạch Định Hướng Chuyển Đổi YSDMS-NextGen (Từ MoldCutterSearch sang Full MES/ERP)

Sau khi rà soát lại toàn bộ tài liệu lịch sử (`Phase1_MoldCutter_Migration_Plan.md`, `ysdms_workflow_v2.md`), cấu trúc mã nguồn hiện tại, tôi đã hiểu rõ bức tranh toàn cảnh và định hướng mà bạn đang hướng tới.

## 1. Xác nhận hiện trạng và Tầm nhìn Dự án

1. **Bản chất Dự án:** Đây không chỉ là một ứng dụng tra cứu đơn thuần nữa. `YSDMS-NextGen` là một hệ thống **ERP/MES doanh nghiệp toàn diện**, thay thế cho hệ thống `MoldCutterSearch` cũ (vốn bị hạn chế do kiến trúc file CSV + Access + Render).
2. **Kế thừa UI/UX:** `MoldCutterSearch` có giao diện rất tốt và trực quan. Nhiệm vụ của YSDMS-NextGen là **tái hiện lại giao diện đó** nhưng nâng cấp lên thành ứng dụng **Full CRUD** (Cho phép Tạo mới, Sửa, Xóa trực tiếp trên Web) với dữ liệu lưu thẳng vào Supabase, loại bỏ sự phụ thuộc vào file CSV.
3. **Thực trạng Database:** Khung quy trình (Workflow) đã được vẽ ra, nhưng **cấu trúc bảng (Database Schema) vẫn còn sơ sài**, tên bảng/tên trường chưa được chuẩn hóa hoàn toàn theo tiêu chuẩn ERP, các mối quan hệ (Foreign Keys) giữa Khay - Khuôn - Dao - Đơn hàng chưa đủ chặt chẽ.
4. **Quy trình Nghiệp vụ (Business Flow):** Dữ liệu phải được sinh ra theo đúng trình tự tự nhiên của nhà máy: *Nhập Khách hàng/Đơn hàng -> Lên thiết kế Khay -> Duyệt -> Tạo thông tin Khuôn/Dao -> Lên Lịch sản xuất -> Thực thi (Kanban) -> Quản lý Tồn kho/Vật liệu.*

## 2. Đề xuất Lộ trình Phát triển Xuyên suốt (Comprehensive Roadmap)

Để giải quyết triệt để tình trạng "phân mảnh" và "sơ sài", tôi đề xuất lộ trình tái thiết lập và phát triển như sau:

### Giai đoạn 1: Chuẩn hóa Schema & Tái hiện MoldCutterSearch UI (Nền móng)
- **1.1 Chuẩn hóa Database Schema:** Review lại toàn bộ bảng trong Supabase. Thống nhất quy tắc đặt tên (`snake_case`), thiết lập đầy đủ khóa ngoại (Foreign Keys) giữa `customers`, `orders`, `product_master`, `mold_base`, `cutter_master`. Đảm bảo không còn dữ liệu "rác" hoặc quan hệ đứt gãy.
- **1.2 Tái hiện Giao diện Tra cứu (Read-only UI):** Phục dựng lại giao diện Search UI/UX cực tốt của MoldCutterSearch cũ bằng Next.js (Grid view, Filters, Pagination).
- **1.3 Nâng cấp thành CRUD (Write UI):** Gắn thêm các tính năng Thêm/Sửa/Xóa ngay trên giao diện Tra cứu, biến nó thành công cụ quản trị dữ liệu trực tiếp.

### Giai đoạn 2: Xây dựng Form Nhập liệu theo Dòng chảy Nghiệp vụ (Business Flow)
*Thay vì nhập liệu rời rạc, chúng ta sẽ xây dựng các Form nối tiếp nhau.*
- **2.1 Khách hàng & Đơn hàng (Sales & Order Form):** Form tiếp nhận Yêu cầu/Đơn hàng từ Khách.
- **2.2 Thiết kế Sản phẩm / Khay (Tray Design Form):** Kế thừa dữ liệu từ Đơn hàng -> Nhập thông số thiết kế Khay -> Chức năng "Duyệt (Approve)".
- **2.3 Yêu cầu Khuôn & Dao (Mold & Cutter Form):** Khi Khay được duyệt -> Form tự động gợi ý tạo Khuôn và Dao tương ứng.
- **2.4 Định mức Vật tư (BOM):** Gắn Nhựa (Plastic) vào Khuôn để làm cơ sở cho việc tính toán vật liệu.

### Giai đoạn 3: Điều hành Sản xuất & Kho (Execution & Inventory)
- **3.1 Lên lịch Sản xuất (Scheduling):** Giao diện Kéo/Thả (Drag & Drop) để xếp lịch cho Máy ép/Máy cắt dựa trên Đơn hàng đã chốt và Khuôn/Dao đã sẵn sàng.
- **3.2 Xưởng Sản xuất (Kanban Execution):** Hoàn thiện màn hình cho công nhân nhập kết quả (OK/NG).
- **3.3 Quản lý Kho & Tính toán Nhu cầu (Inventory & MRP):** Quản lý xuất/nhập Nhựa, xuất/nhập Khay thành phẩm, và Hệ thống cảnh báo tồn kho vật liệu (MRP).

## User Review Required

> [!IMPORTANT]
> **Xác nhận Định hướng:**
> Lộ trình trên đã phản ánh đúng 100% tham vọng và định hướng của dự án YSDMS-NextGen mà anh mong muốn chưa? 
> 
> Nếu anh đồng ý với lộ trình này, tôi đề xuất chúng ta **bắt tay ngay vào Giai đoạn 1.1**: Tôi sẽ tiến hành rà soát các file định nghĩa CSDL (`database.types.ts` và các bảng hiện tại) để chỉ ra những chỗ "sơ sài" cần chuẩn hóa trước khi chúng ta code tiếp giao diện. Ý anh thế nào?
