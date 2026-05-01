# Phase 4A-1: Chiến lược bảng Khay (Trays)

- [x] Lập kế hoạch và phê duyệt.
- [x] Tạo file migration `20260423_038_phase4a1_retire_tray_tables.sql`.
- [x] Xác nhận database được cập nhật an toàn.

# Phase 4A-2: Ánh xạ sản phẩm và khuôn (product_mold_map) & Dọn dẹp dữ liệu

- [x] Lập kế hoạch cleanup và ánh xạ Data.
- [x] Dọn dẹp lỗi duplicate `remarks` (thực thi file 039).
- [x] Cập nhật thêm cấu trúc UNIQUE cho bảng (thực thi 040a).
- [x] Soạn script seed dữ liệu `product_mold_map` và execute thành công 2,312 rows (040b).

# Phase 4B: Đổ dữ liệu Đơn hàng (Orders & Order Items)

- [x] Phân tích cấu trúc file Excel nguồn (`YSDトレー受注一覧（改2）4-22.xlsx`).
- [x] Xây dựng Kế hoạch map sang `orders` và `order_items`.
- [x] Chờ phê duyệt blueprint Phase 4B.
- [ ] Tham chiếu script `parse_orders_excel.py` được cung cấp.
- [ ] Thực thi Script tạo SQL Seeder và kiểm tra Database.
