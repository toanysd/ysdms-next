# TỌA ĐỘ PHỐI HỢP PE & AN (COORDINATION LOG)

## PENDING SECURITY ITEM (chưa xử lý, cần quay lại)
- **Vấn đề:** Supabase service_role key (`sb_secret_C2xqkH1...`) đã từng xuất hiện trong local Git commit history và bị chặn lại khi push lên GitHub public repo. Dù push thất bại, nhưng theo nguyên tắc an toàn, key này vẫn cần được coi là compromised do đã nằm trên local file system và history chưa được rebase hoàn chỉnh (nếu push force).
- **Hành động cần làm:** 
  1. Thoan vào Supabase Dashboard -> Settings -> API -> Rotate Service Role Key.
  2. Revoke key cũ.
  3. Kiểm tra secret scanning alert trên GitHub (nếu có).
  4. Báo lại cho AN để AN cập nhật biến môi trường `.env` cục bộ.
- **Trạng thái:** **PENDING** (Đang chờ Anh Thoan thực hiện bước 1 & 2 trên giao diện web).

## BACKLOG: XỬ LÝ 75 THIẾT BỊ MỒ CÔI TỪ ACCESS
- **Vấn đề:** Sau đợt Remediation #031, còn 75 record equipment (khuôn, dao cắt) không thể tìm thấy sản phẩm hoặc bản vẽ gốc trong CSDL Access (`TrayID` bị rỗng).
- **Hành động cần làm:** Anh Thoan cần review thủ công danh sách 75 thiết bị này (Xem chi tiết tại `docs/reports/live_remediation_result_031.md`). Xác nhận xem đây là khuôn thật ngoài xưởng hay dữ liệu rác từ hệ thống cũ.
- **Trạng thái:** **PENDING MANUAL REVIEW**.

## ĐÃ HOÀN THÀNH
- **Remediation #031:** Xử lý liên kết 657 orphan equipment thành công. Đã đóng.
