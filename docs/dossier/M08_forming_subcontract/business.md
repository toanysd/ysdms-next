# 🏭 M08 — Sản Xuất Định Hình, Chỉ Thị SX, Nhật Ký Xưởng & Thầu Phụ (`M08_forming_subcontract/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 468 Threads / 2,966 Emails, Stage F & G)
1. **Chỉ thị Sản xuất Nội bộ (`Stage F — Production Instruction` / `BP-32`):**
   - Phát hành cho bộ phận vận hành (`gyoumu`), thiết kế (`quan`, `toan`), kinh doanh (`eigyo`).
   - Nội dung bắt buộc từ email thực tế (`01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:207-250`): Ngày xuất hàng (`ship_date`), ngày dập (`forming_date`), quy cách nhựa + độ dày + tính chất đặc biệt (dẫn điện `導電`, chống tĩnh điện `帯電防止`, phủ silicone), **tách số lượng 3 cột (`Free sample / Paid lot / Office reserve`)**, chỉ định máy (ILLIG / Rv74), điều kiện giữ lô thương mại tại kho chờ khách duyệt mẫu đầu tiên (`初回サンプル承認待ち`).
2. **Điều phối Thầu phụ Định hình (`Stage G — External Manufacturing Coordination`):**
   - Phối hợp lịch chạy máy từng ngày với thầu phụ định hình (điển hình **Marudai `MRDI`**), theo dõi ngày gửi khuôn, ngày nguyên liệu cuộn nhựa về, và giờ cắt hàng xuất trong ngày (`15:00 cutoff`).
3. **Nhật ký Công việc Xưởng (`Nippo / Worklogs`):**
   - Ghi nhận giờ công thực tế (`duration_minutes`), số lượng đạt (`quantity_ok`), số lượng lỗi (`quantity_ng`) theo từng công đoạn (`job_steps`) và nhân viên (`employees`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Routes chính:** `/production` (Lịch kế hoạch định hình), `/production-instructions` (Chỉ thị SX BP-32), `/worklogs` (Nhật ký công việc SSOT), `/reports/daily-worklog` (Báo cáo A4 Nippo).
- **Redirect từ route cũ (`WO-ROUTE-CLEANUP`):** `/production/worklog*` -> `/worklogs`; `/production/planning*`, `/production/schedule*`, `/production/calendar*`, `/production/floor*`, `/production/kanban*` -> `/production`.

## 3. Trạng Thái Hiện Tại & Hạng Mục Còn Thiếu (`Backlog`)
- **Đã hoạt động:** `/worklogs` & `/reports/daily-worklog` (`work_logs = 7,111` dòng) và `/production` (`production_schedules = 30` dòng).
- **Còn thiếu:**
  1. Đồng bộ `+2,437` dòng `tblWorkLog` từ Access trong `WO-MOLD-SYNC-WAVE3`.
  2. Chuẩn hóa `/production-instructions` (sửa Tailwind màu cứng & i18n, tách số lượng `Free / Paid / Office`, gắn cờ chờ duyệt mẫu).
  3. Thiết kế tính năng theo dõi lịch máy thầu phụ (`Marudai MRDI` — Stage G).
