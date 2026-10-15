# 🔬 M09 — Quản Lý Chất Lượng KCS & Cổng Duyệt Mẫu Thử (`M09_quality_sample_gate/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 107 Threads / 961 Emails, Stage E)
- **Vai trò KCS & Duyệt mẫu (`00_BUSINESS_INSIGHTS.md:38-42, 96-100` & `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:182-204`):**
  - Luồng chuẩn khi làm khay mới hoặc sau khi cải tạo khuôn / phủ Teflon (`Minebea` Row 697):
    `Dập mẫu thử (試作成形: 1 pocket trial hoặc 24~60 tấm) -> Đo kích thước KCS (寸法測定) -> Gửi bản vẽ phê duyệt (承認図) & mẫu -> Khách hàng duyệt sản xuất hàng loạt (量産承認)`.
  - Trong thực tế, xưởng có thể dập mẫu miễn phí (`無償サンプル`) cùng lúc với lô thương mại có phí (`有償ロット`), nhưng **lô thương mại bắt buộc phải giữ lại tại kho YSD cho đến khi khách hàng xác nhận OK mẫu đầu tiên**.
- **Xử lý khiếu nại & lỗi chất lượng (`QC / Complaint Loop`):**
  - Các vấn đề thực tế từ email: Lệch vị trí khay (`トレイ位置ズレ`), kẹt xếp chồng (`スタッキング不良`), rò điện trên khay dẫn điện (`漏電報告`), lẫn dị vật (`手袋混入`), bám dính chân pin cần phủ Teflon (`XMN0P0-0020`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Routes chính:** `/quality/inspection` (Kiểm tra chất lượng & đo kích thước KCS), `/quality/defects` (Báo cáo lỗi & khiếu nại).
- **Redirect từ route cũ (`WO-ROUTE-CLEANUP`):** `/quality` & `/quality/inspections` -> `/quality/inspection`.

## 3. Trạng Thái Hiện Tại & Hạng Mục Còn Thiếu (`Backlog`)
- **Trạng thái hiện tại:** Đã có khung giao diện `/quality/inspection` & `/quality/defects` và đầy đủ các bảng dữ liệu trong Supabase (`sample_requests`, `sample_submissions`, `tray_samples`, `tray_inspections`, `inspections`, `defect_reports`), nhưng tất cả đang ở mức **`0` bản ghi** và **chưa liên thông tự động với cổng chặn xuất hàng**.
- **Backlog (`WO-SAMPLE-QC-GATE` — đang tạm dừng chờ xong đồng bộ dữ liệu Phòng Khuôn):**
  1. Liên kết yêu cầu mẫu thử (`sample_requests`) trực tiếp với `business_cases` và `jobs` (đặc biệt sau khi chế tạo khuôn mới hoặc nhận lại khuôn Teflon).
  2. Thiết lập cổng kiểm soát `SAMPLE_PENDING_APPROVAL` cảnh báo/chặn xuất lô hàng thương mại trên `/shipments` khi mẫu thử chưa có kết quả `APPROVED`.
