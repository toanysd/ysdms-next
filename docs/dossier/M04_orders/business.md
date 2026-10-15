# 📦 M04 — Quản Lý Đơn Hàng & Đối Soát Dòng Chi Tiết (`M04_orders/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 207 Threads / 1,674 Emails)
- Sau khi khách hàng chấp thuận báo giá và mẫu thử, khách gửi Đơn đặt hàng (`注文書 / 発注書 / PO`, hoặc đăng ký trả lời hạn giao hàng trên cổng `Lindo`).
- Mỗi đơn hàng (`orders`) gắn với 1 khách hàng (`company_id`) và chứa nhiều dòng sản phẩm (`order_lines`), theo dõi số lượng đặt (`quantity`), đơn giá (`unit_price`), ngày giao hàng cam kết (`due_date`) và số lượng đã giao (`shipped_quantity`).
- Từ đơn hàng đã xác nhận (`CONFIRMED`), hệ thống khởi tạo Lệnh sản xuất (`work_orders` qua RPC `rpc_create_work_order_from_order`) và Phiếu giao hàng (`shipments`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Trang danh sách:** `src/app/orders/page.tsx` (`PAGE_SIZE = 50`, sắp xếp mặc định `order_date DESC`, tìm kiếm theo mã đơn/PO/khách hàng/ghi chú).
- **Trang chi tiết:** `src/app/orders/[id]/page.tsx` (hiển thị thông tin đơn hàng, danh sách `order_lines` kèm thông số kỹ thuật từ `design_revisions`, lịch sử giao hàng và liên kết Work Order).
- **Server Actions:** `src/app/actions/order.ts`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành & Đã xác minh dữ liệu Production (`CLOSED`)**.
- **Kết quả đối soát Phương án C (đã được PE xác minh độc lập lúc `2026-10-14 10:34:30 JST`):**
  - `public.orders = 2,396` dòng; `public.order_lines = 6,279` dòng; `public.staging_order_lines_backfill = 6,279` dòng.
  - Cơ chế join chuẩn: `staging_order_lines_backfill.order_no = orders.order_no`, sau đó đối chiếu `orders.order_id = order_lines.order_id`.
  - Khớp `6,279 / 6,279` dòng theo `(order_id, line_no, product_id, quantity)`; `0` trùng lặp; `0` thiếu FK; `0` khoảng trống `line_no`.
- **Backfill ghi chú & sửa UI:** Đã hoàn thành `WO-ORDER-NOTES-BACKFILL` (`1,144` dòng có notes) và `WO-ORDER-SHIPMENT-UI-FIX` (hiển thị đầy đủ ghi chú dòng đơn hàng có xuống dòng).

## 4. Hạng Mục Còn Thiếu (`Backlog`)
- Chờ quyết định của Minh Chủ THOAN & PE về thời điểm đóng/archive bảng `public.staging_order_lines_backfill` sau khi đã khớp 100%.
