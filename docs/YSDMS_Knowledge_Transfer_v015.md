# YSDMS NextGen - Knowledge & Progress Transfer (v0.1.5)
**Lưu trữ ngày:** 02/05/2026
**Mục đích:** Bàn giao toàn bộ kiến thức, tri thức và tiến độ kỹ thuật để tiếp tục làm việc trên môi trường máy tính khác (hoặc session khác).

## 1. Tiến Độ Hiện Tại (Current Progress)
- **Module:** Quản lý Kho Thành Phẩm (Tray Inventory Management) - Phase 4.
- **Trạng thái:** Hoàn thành Stage B: Xây dựng Core Database, Server Actions (Nhập kho tự động) và Dashboard Quản lý Tồn kho.
- **Phiên bản Github:** v0.1.5 (Sắp push lên branch `main`).

## 2. Tri Thức Nghiệp Vụ (Business Logic)
1. **Khay ≠ Sản Phẩm Định Danh:** Khay được định nghĩa tại bảng `product_master`, tuy nhiên Tồn Kho của Khay phải được track riêng lẻ dưới dạng Transaction (Lịch sử Biến Động), không phải một cột tĩnh.
2. **Quy tắc tính Good Qty:** Tại máy ép nhựa, số lượng Sản xuất (Produced Qty) thường là tổng. Số lượng Nhập Kho Thành Phẩm phải trừ đi số Phế Phẩm (Scrap Qty). Công thức: `Good Qty = Produced Qty - Scrap Qty`.
3. **QC Hold (Chờ Kiểm định):** Không phải lúc nào hàng ra khỏi máy cũng nhập thẳng vào kho. Cần có tùy chọn Checkbox (QC Hold) để thủ kho/chất lượng có quyền chặn hàng lại trước khi nhập.
4. **Mức Tồn Kho An Toàn (Safety Stock):** Nhà máy sản xuất khay luôn cần quy định `min_stock` để dự phòng. Hiện tại, ngưỡng báo động đang được Hardcode là `< 50`.

## 3. Kiến Trúc Kỹ Thuật (Technical Architecture)
1. **Schema Tồn Kho (`tray_inventory_txn` & `tray_stock_summary`):**
   - Áp dụng file migration `20260502_045_create_tray_inventory_layer.sql`.
   - Sử dụng View `tray_stock_summary` để Aggregate (Tích lũy) số lượng IN/OUT/ADJUST. Giao diện Dashboard sẽ đọc trực tiếp từ View này để đạt tốc độ tối đa, thay vì tự cộng dồn trên Frontend.
2. **Phòng Chống Race Condition (Xuất Kho):**
   - Đã loại bỏ hoàn toàn pattern "check-then-act" ở tầng Next.js Server Action vì nó gây lỗi tồn kho âm khi nhiều user cùng xuất kho.
   - **Giải pháp:** Sử dụng PostgreSQL RPC Function `record_tray_out_safe` kết hợp `FOR UPDATE` (Lock row) để đảm bảo Atomic Insert & Check.
3. **Tích hợp Tự Động Nhập Kho (IN):**
   - Vị trí: `src/app/production/track/[itemId]/page.tsx` (Màn hình Chốt Ca).
   - UX: Nhập Kho = Tùy chọn Checkbox.
   - Nợ Kỹ thuật (UX Debt) trước đây đã được fix: Không dùng `throw new Error()` gây crash trắng trang, mà dùng `redirect` kèm `searchParams` (`?error=...`) để hiển thị Toast/Banner thân thiện.
4. **Inventory Dashboard (`/production/inventory`):**
   - Xây dựng 3 Tab: Tổng Quan Tồn Kho (Overview), Lịch Sử Giao Dịch (History), và Cảnh Báo Thiếu Hụt (Alerts).
   - Áp dụng UI Component chia tách: `StockTable.tsx`, `TxnHistoryTab.tsx`, `LowStockAlert.tsx`.
   - Sử dụng Modal Drill-down để xem Lịch sử chi tiết của một loại khay trực tiếp trên Client mà không cần fetch lại từ Database.

## 4. Hướng Dẫn Tiếp Quản (Next Steps for Next Machine)
Khi pull repository về máy tính mới, hãy thực hiện các bước sau:
1. `git pull origin main`
2. **Database:** Mở Supabase Dashboard -> SQL Editor, chạy file `20260502_045_create_tray_inventory_layer.sql` (Hoặc chạy lệnh `npx supabase db push` nếu Docker đang bật).
3. **Tiếp tục phát triển:**
   - **Mục tiêu tiếp theo (Phase 5):** Xây dựng Luồng Xuất Kho (OUT) gắn liền với Màn hình Quản lý Giao hàng (Delivery / Orders). 
   - **TODO trong DB:** Thêm trường `min_stock` vào bảng `product_master` để thay thế cho hằng số `50` đang bị hardcode trong `LowStockAlert.tsx`.

---
*Tài liệu này được tạo bởi Antigravity nhằm bảo đảm luật "Đại Cung Điện" (Luật Thép) về tính liên tục của hệ thống.*
