# Tóm tắt Phiên làm việc (Session Context)
**Dự án:** ysdms-nextgen
**Ngày giờ lưu:** 2026.04.21
**Kiến trúc Local Context:** Hệ thống đã chuyển sang sử dụng bộ nhớ cục bộ (`.ai/`) để cô lập ngữ cảnh giữa các dự án.

## Trạng thái hiện tại
* **Hoàn thành Phase 3A & 3D**: Master Dashboard (active machines, output, timeline, coverage plan chart) hoạt động ổn định trơn tru, hiển thị theo cơ chế song ngữ Nhật (mặc định) - Việt.
* **Hoàn thành Phase 3B**: Giám sát tuổi thọ khuôn (Mold Maintenance).
  * Viết Migration 032 đổ định mức chu kỳ bảo trì (Interval: 1M, Alert: 900k).
  * Backend: View `v_mold_health` (tự xử lý modulo), Trigger cập nhật reset `total_shots` = 0 sau khi bảo trì hoạt động chuẩn xác (Tripmeter pattern).
  * Frontend: Dashboard Bảo trì `/maintenance` với 3 màu xanh/vàng/đỏ cảnh báo trực quan kèm tính năng report log. Dashboard chính đã trỏ data maintenance về view `v_maintenance_overdue`.
  
## Kế hoạch tiếp theo (Phase 3C - Reporting MVP)
* **Status**: Chờ triển khai.
* **Mục tiêu**: Xây dựng UI `/reports` báo cáo định kỳ.
* **Scope MVP**: Lọc và hiển thị dữ liệu Production + Maintenance logs theo Ngày/Tuần/Tháng. Cơ chế truy vấn thủ công với tính năng Xuất CSV trên lưới Data Grid UI. Giao diện Industrial Dense JP. Tóm tắt nhanh: `produced_qty` vs `planned_qty`.

**Hành động để Resume:** AI đọc file này và tự ghim vào đầu mục tiêu Phase 3C. Hướng ban đầu sẽ là soạn API Endpoint tổng hợp Data cho báo cáo.
