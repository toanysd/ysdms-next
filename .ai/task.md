# Nhiệm vụ: Xây dựng Kế hoạch Sản xuất (Production Planning)

- [x] Lập kế hoạch, thống nhất hướng đi và Data Schema
- [x] DB: Tạo migration `machine_master` (Kiến trúc Máy móc 3 Lớp & Ma trận tương thích)
- [x] DB: Tạo migration `production_plans` (Chốt Mold Physical, Machine Instance, Tách Operator)
- [x] Backend: Viết Action `machine.ts` để đọc danh sách cấu hình và Matrix máy móc
- [x] Backend: Viết Action `production.ts` cho các luồng Lên lịch & Phân việc
- [x] UI: Setup Màn hình Master Data `/master/machine` quản lý Trạm máy & Capacity
- [x] UI: Ráp giao diện `/production/planning` với cơ chế Bộ Lọc Thông minh: Đơn hàng chỉ kéo thả được vào Máy tương thích
- [x] Verification: Ráp E2E Khởi tạo thiết bị, lập Lịch, test Cảnh báo chặn khuôn & máy sai.

## Phase 2: Execution Module (Kanban Realtime) [DONE]
- [x] Xây dựng /production (Dashboard & Kanban): Tháp điều khiển thời gian thực
  - [x] 1. Truy xuất DB: Tạo migration 027 và 028 (liên kết kế hoạch và máy instance).
  - [x] 2. Actions: Cập nhật API lấy dữ liệu và logic Atomic Insert log/update Status.
  - [x] 3. Giao diện: Ráp Kanban 3 Cột và Form theo dõi chuẩn Nhật/Việt (Bilingual).

## Phase 3A: Tháp điều khiển trung tâm (Master Dashboard KPI)
- [x] Xây dựng `/dashboard` (Server Component tổng hợp)
  - [x] 1. Backend: Tạo `actions/dashboard.ts` để đếm KPI.
  - [x] 2. Row 1: 4 KPI Cards (Máy đang chạy, Sản lượng, Đơn chưa xếp lịch, Khuôn bảo trì).
  - [x] 3. Row 2: Bảng Máy Đang Chạy và Biểu đồ mức độ đáp ứng (Coverage).
  - [x] 4. Row 3: Gantt Timeline các Lịch hôm nay.

## Phase 3B: Giám sát tuổi thọ Khuôn (Mold Maintenance)
- [x] 1. Migration `032`: Seed `mold_maintenance_schedule` tự động cho mọi khuôn.
- [x] 2. Actions: Tạo `src/app/actions/maintenance.ts` xử lý `getMoldHealthList` và `logMaintenanceAction`.
- [x] 3. Dashboard KPI: Sửa file `actions/master-dashboard.ts` để móc KPI Khuôn từ `v_maintenance_overdue`.
- [x] 4. Giao diện: Thiết kế `/maintenance/page.tsx` với Layout chuẩn Nhật (Progress bar hao mòn vòng đời).

## Phase 3C: Báo cáo Định kỳ & Phân tích Năng suất (Reporting module)
- [ ] 1. Sửa Schema (Nếu có lưu thông tin cấu hình Report).
- [ ] 2. Actions: Tạo API Server Action tổng hợp dữ liệu (Sản lượng, Hao hụt, KPI Khuôn).
- [ ] 3. Design UI: Tạo trang `/reports` chuẩn Dense UI với lưới Data Grid đa chiều trực quan, hỗ trợ filter Ngày/Tuần/Tháng.
- [ ] 4. Tích hợp tính năng Xuất file ra CSV ngay trên giao diện Client.
