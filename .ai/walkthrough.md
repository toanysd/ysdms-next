# Tổng kết & Walkthrough: Cụm Kế Hoạch Sản Xuất v8.5.2

## Những thay đổi chính (What was accomplished)
Dự án đã hoàn tất việc quy hoạch kiến trúc cốt lõi cho module Lập Kế Hoạch Sản Xuất (Production Planning) và Quản lý Máy móc, đạt tiêu chuẩn của một APS thu nhỏ (Advanced Planning and Scheduling).

### Database (PostgreSQL / Supabase)
- Triển khai kiến trúc **Máy Móc 3 Lớp**: `machine_type` -> `machine_model` -> `machine_instance`.
- Thiết lập tính năng **Dynamic Machine Specs**: Cấu trúc jsonb sinh Form nhập động dựa trên `spec_schema`.
- Tạo cơ chế **Smart Routing**: Bảng `machine_tray_compatibility` giúp lọc máy phù hợp cho đơn hàng.
- Bảng **Lệnh Sản Xuất (`production_plans`)**: Nối kết đơn hàng, khuôn, và máy. Áp dụng Strict Version Control bằng cách khoá chặt vào `mold_physical_id`.
- **Soft Delete an toàn**: Nâng cấp `026_update_production_plans.sql` bổ sung cột `notes` và `deleted_at`. View báo cáo tiến độ `v_production_plan_progress` được tích hợp luôn logic `.is_deleted IS NULL`.

### Backend Action (Next.js server actions)
- Cung cấp đủ hàm **CRUD**: `create`, `update`, `delete` (xoá mềm) cho dữ liệu Plan.
- Xây dựng hệ thống rào chắn **(Protective Guards)**:
  1. Không cho phép xóa/sửa khi kế hoạch đã chuyển sang `IN_PROGRESS` (đang chạy máy) hoặc `COMPLETED`.
  2. Bắt chéo qua `orders` Header, chặn thao tác nếu đơn hàng mẹ đã `completed/shipped`.
- Tự động gọi `revalidatePath` đồng loại cho `/production/planning`, `/order`, và `/production`.

### Giao diện Điều khiển (UI v8.5.2)
- **Chuẩn Dense Industrial Teal**: Tuân thủ tuyệt đối quy tắc Song Ngữ Nhật-Việt (Nhật `Primary`), độ nén cao (dense).
- Tạo **Excel Grid View**: Mô phỏng layout Kế hoạch nền vàng đặc trưng quen thuộc của nhà máy, nhóm (group) dữ liệu một cách thông minh THEO THỢ (担当者) -> RỒI TỚI MÁY (機番).
- **Badge Trạng Thái Tiến Độ (進捗)** đa tầng cho từng Dòng Kế hoạch.
- Tích hợp Edit/Delete bằng Icon nhỏ với trạng thái disabled tự động xử lý bởi Security Guard.

## Xác nhận Tính toàn vẹn (Validation Results)
- [x] Lên kế hoạch đơn hàng đúng logic và hiển thị Grid Excel thành công.
- [x] Tính năng Soft Delete chạy mượt mà: Dữ liệu CSDL chuyển trạng thái mất ở UI nhưng còn trong DB. 
- [x] Thanh Progress Bar (Tỷ lệ phân bổ đơn hàng) chớp tắt thời gian thực sau các thao tác sửa xoá.
- [x] Cảnh báo lỗi 2 tầng hiển thị tiếng Nhật khi thao tác sai quy tắc.
- [x] Lỗi division-by-zero và React key constraint duplicate được fix triệt để.

---

## Mở Rộng: Phase 2 - Kanban Dashboard (Realtime)
Tiếp nối chuẩn hóa Dữ Liệu ở Phase 1, Phase 2 đã nối trực tiếp dữ liệu Lập Lịch (`production_plans`) vào giao diện theo dõi Thực Thi (`/production`).

### Kiến trúc & Đồng bộ Logic
- Thêm `production_plan_id` (FK) vào `production_log` qua Migration 27 để Audit Trail.
- Phân tách luồng Trạng thái: DRAFT -> (Xác nhận) -> SCHEDULED -> (Bắt đầu) -> IN_PROGRESS -> (Chốt) -> COMPLETED.
- Thay đổi `startProductionFromPlan` thành API Atomic: Update trạng thái Plan VÀ sinh Log trong 1 transaction an toàn.

### Giao diện Kanban 3 Cột
- Cột 1 (未着手): Hiển thị Lịch đợi chạy (Chỉ có Nút Xác Nhận Vàng cho DRAFT, Lịch nào SCHEDULED mới được Bắt Đầu).
- Cột 2 (実行中): Đếm thời gian thực Máy Đang Chạy, Tự động Refresh 30 giây/lần mà không lag máy.
- Cột 3 (完了): Tổng kết Sản lượng thành công & Hàng Hỏng trong ngày của kíp trực. Refresh 60 giây/lần.

## Phát triển tiếp theo
- [ ] Xây dựng /maintenance: Giám sát hao mòn Khuôn cắt tự động mượn từ cơ sở DL đã có.
- [ ] Báo cáo Bơm Ép định kì hằng tuần tự động.
