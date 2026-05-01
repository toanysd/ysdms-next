# Walkthrough: Phase 4A & Phase 4B

## Kết quả đạt được trong phiên:

1. **Chuẩn hóa chiến lược Phase 4A-1 (Trays):**
   - Đã thống nhất dùng `product_master` là "Single Source of Truth" thay cho `trays` và `tray_master`.
   - Viết kế hoạch và migrate remarks (ghi chú) thành công. File `tray_master` được đổi tên thành `tray_master_legacy`, xóa file uuid `trays` trống.

2. **Ánh xạ Product & Mold (Phase 4A-2):**
   - Rà soát schema, thêm thành công constraint `UNIQUE (product_id, revision_id)` vào bảng `product_mold_map`.
   - Kết nối thành công 2,312 bản ghi Khay ↔ Khuôn (mapping 52.2% trên tổng mold_base).

3. **Giai đoạn Đơn hàng - Phase 4B (Đang chờ):**
   - Đã test cung cấp script parse dữ liệu từ Excel (`parse_orders_excel.py`).
   - Sửa thành công metadata gọi REST Supabase (fix `site_code` thành `customer_code`).
   - Đã phát hiện ra file Excel lệnh sản xuất thực tế có format Lịch biểu ngang phi cấu trúc (Không có header tuần tự). Kế hoạch tạm dừng chờ lấy File chuẩn, hoặc phải viết lại script riêng cho format lịch biểu.
