# Kế hoạch Hoàn thiện Tầng 1 và Xây dựng Tầng 2 (Khuôn)

Dựa trên phân tích từ dữ liệu thực tế và kiến trúc ERP, đây là kế hoạch triển khai tiếp theo nhằm thiết lập môi trường dữ liệu sạch trước khi xử lý logic phức tạp nhất của hệ thống.

## User Review Required

> [!IMPORTANT]
> - Tool AI của tôi hiện không thể đọc trực tiếp file Excel đính kèm qua khung chat nếu file đó không nằm trong ổ cứng máy tính bạn (Ví dụ: `F:\AntiGravity\...`).
> - Do đó, đối với file `toreiteta-Zhi-Shi-Shu.xlsx`, tôi sẽ viết sẵn Script chuẩn Python. Bạn chỉ cần thả file đó chung thư mục với script và ấn chạy là file `.sql` đẩy dữ liệu sẽ tự động được sinh ra!

## Proposed Changes

### 1. Hoàn thiện Giao diện Tầng 1 (Cơ bản)
Thực hiện bổ sung nhanh Form CRUD cho 2 đối tượng cốt lõi còn thiếu trước khi bước vào Tầng 2:

#### [NEW] `src/app/actions/machine.ts` & `src/app/actions/customer.ts`
- Cấu hình Server Actions xử lý lưu Form.
#### [NEW] `src/app/master/machine` & `src/app/master/customers`
- Cấu hình Table giao diện cho Máy đúc và form thông tin Khách hàng (Nhà phân phối).
#### [MODIFY] `src/components/layout/Sidebar.tsx`
- Bổ sung menu điều hướng cho Khách hàng và Máy đúc.

### 2. Xử lý Dữ liệu Thực tế (Script Mở rộng Excel)
#### [NEW] `import_customers.py`
Tạo Script dọn dẹp và trích xuất dữ liệu tự động từ file Excel chỉ định (`toreiteta-Zhi-Shi-Shu.xlsx`).
- Đọc sheet `納入先一覧表` (Khách hàng) và ánh xạ tới bảng `customers` (theo đúng phân tích No., 送り先, 住所, 依頼元, サブ...).
- Gom nhóm theo `parent_code` để phân tách chi nhánh.
- Sinh ra câu lệnh `INSERT ... ON CONFLICT DO UPDATE` (Upsert logic).

### 3. Chuẩn bị Tầng 2: Bảng Thiết kế Khuôn (`mold_design_revision`)
#### [NEW] Bổ sung Schema (Nếu chưa có)
- Lớp 2 là xương sống nối Khuôn gốc (JAE-001) với Thực tế sản xuất (Máy, Nhựa, Khay).
#### [NEW] Component Nested Form `mold_design_revision`
- Xây dựng cụm Parent-Child state management. Yêu cầu chọn Khuôn Gốc (Dropdown) → Trả về danh sách Revision → Form Thêm Revision Mới.

## Open Questions
- File `toreiteta-Zhi-Shi-Shu.xlsx` hiện đang nằm gộp ở màn hình ngoài Desktop hay trong thư mục `Data` của dự án cũ? Hãy đặt nó vào `F:\AntiGravity\ysdms-nextgen\scripts\migration\` để tôi có thể chủ động Code đường dẫn cứng (hard-code) nếu cần.

## Verification Plan
1. Chạy tay `python import_customers.py` để sinh ra file `customers_upsert.sql`.
2. Kiểm tra dữ liệu trên Supabase Studio để xác nhận bảng `customers` đã được đổ ~1800 bản ghi.
3. Test UI nhập xuất Máy đúc và test giao diện load Khuôn Tầng 2.
