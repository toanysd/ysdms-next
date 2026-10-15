# 📁 M01 — Quản Lý Sự Việc Khách Hàng (`M01_cases/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 95 Threads / 895 Emails)
- Hoạt động kinh doanh tại YSD bắt đầu từ **Sự việc (`business_cases`)**, không bắt đầu trực tiếp từ Đơn hàng (`01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:20-70`).
- **10 kịch bản kích hoạt thực tế (`Business Archetypes`):**
  1. Yêu cầu báo giá khay mới + chế tạo khuôn mới (`New tray + new mold`, VD: `JAE-357..365`).
  2. Đặt hàng lặp lại cho khay đã có (`Repeat order`).
  3. Cải tạo / sửa đổi khuôn hiện có (`Mold modification`).
  4. Thay đổi vật liệu nhựa khi đang sản xuất (VD: chuyển sang HIPS `5-912159-*`).
  5. Đẩy nhanh tiến độ giao hàng khẩn cấp (`Urgent delivery acceleration`).
  6. Làm mẫu thử trước rồi mới sản xuất hàng loạt (`Sample-first then mass production`).
  7. Quản trị tài sản khuôn thuộc sở hữu khách hàng (`Customer-owned mold governance`).
  8. Yêu cầu chụp ảnh khuôn / kiểm kê tài sản định kỳ (`Mold inventory / photo`).
  9. Phát hành Giấy mượn khuôn / Biên bản thỏa thuận sở hữu (`借用書 / 覚書`).
  10. Khiếu nại lỗi chất lượng / kẹt xếp chồng / rò điện (`Complaint / defect loop`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Trang danh sách:** `src/app/cases/page.tsx` (tìm kiếm, lọc trạng thái/ưu tiên, phân trang `PAGE_SIZE = 50`, sắp xếp `DESC`).
- **Trang tạo mới:** `src/app/cases/new/page.tsx` (lưu `raw_text_snapshot` từ email khách hàng).
- **Trang chi tiết:** `src/app/cases/[id]/page.tsx` gồm 4 Tabs: `Overview`, `TechnicalReviewTab`, `SalesTab` (`QuotationFormModal`), `Production` (`work_orders` & `jobs`).

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành & Đã kiểm thử E2E (`CLOSED`)**.
- **Commits:** `c6f20b9848636b2c6df552ef55365cb814210742` (`WO-PIPE-FIX`), `d51b5609014ba1583db6955ff73a3d214e7597fd` (`WO-SCHEMA-SAFETY-FIX`).
- Đã đồng bộ bảng `profiles` (`3/3` tài khoản active), gỡ bỏ hoàn toàn workaround phân quyền tạm thời trong `cases/[id]/page.tsx` và `actions.ts`.

## 4. Hạng Mục Còn Thiếu (`Backlog`)
- Bổ sung cơ chế tạo sự kiện con hậu giao hàng (`child_events`: `repeat_order`, `material_change`, `mold_modification`, `complaint`) gắn với `parent_case_id` (Stage I trong `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:310-338`).
