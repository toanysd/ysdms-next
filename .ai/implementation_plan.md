# Phase 4B: Kết nối đơn hàng thực tế (Orders & Order Items)

Sau khi dọn dẹp và kết nối thành công dữ liệu Master (Product ↔ Mold), Bước 4B sẽ là nạp dữ liệu Giao dịch/Đơn hàng (Transactional Data) vào hệ thống.

## User Review Required
> [!IMPORTANT]
> **Hỏi ý kiến:** Để hoàn thành việc nạp Dữ liệu Đơn hàng, chúng ta cần duyệt qua file Excel `YSDトレー受注一覧（改2）4-22.xlsx` từ thư mục `source_data`. File này dường như không có header chuẩn (header=None cần đọc từng dòng logic). 
> Liệu tôi có nên viết 1 Python script (như các file import cũ) để đọc Excel này, làm sạch và tạo ra script SQL migrate tự động không? Hay chúng ta đã có script Python đổ Order có sẵn rồi?

## Proposed Changes

### Target: Seed Order & Order Items
Quy trình sẽ tạo ra script `20260423_041_seed_orders.sql`:
1. **Orders**: Tao header đơn hàng. Gán type là `molding`.
2. **Order_Items**: 
   - Liên kết tới `orders.id`.
   - Kết nối với `product_master` thông qua mã sản phẩm (Part No / Khay Code).
   - Kiểm tra chuỗi Foreign Key: `order_items` → `product_master`. Nhờ bảng `product_mold_map` đã có ở 4A-2, tự động đơn hàng sẽ link được xuống tận `mold_design_revision` và khoanh vùng được `mold_physical` cần dùng.

## Verification Plan
1. Xác nhận bảng `orders` tăng số lượng từ `6 rows` ban đầu.
2. Xác nhận bảng `order_items` có dữ liệu và Foreign Key trỏ đúng ID của `product_master`.
3. Kiểm tra thử 1 query END-TO-END mô phỏng: Từ `order` -> map tới `product` -> sang `mold_revision`.
