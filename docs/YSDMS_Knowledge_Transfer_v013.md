# YSDMS NextGen - Knowledge & Progress Transfer (v0.1.3)
**Lưu trữ ngày:** 01/05/2026
**Mục đích:** Bàn giao toàn bộ kiến thức, tri thức và tiến độ kỹ thuật để tiếp tục làm việc trên môi trường máy tính khác (hoặc session khác).

## 1. Tiến Độ Hiện Tại (Current Progress)
- **Module:** Quản lý Kế Hoạch Sản Xuất (Production Planning).
- **Trạng thái:** Hoàn thành kiến trúc "Click-to-Assign" thay thế cho hệ thống Drag-and-Drop cũ trên `PlanningClickWrapper.tsx` và `EditModal.tsx`.
- **Phiên bản Github:** v0.1.3 (Đã push lên branch `main`).

## 2. Tri Thức Nghiệp Vụ (Business Logic)
Đã làm rõ và thống nhất 3 quy tắc cốt lõi của xưởng sản xuất:
1. **Khay & Khuôn:** Một sản phẩm (khay) được tạo ra bởi một phiên bản thiết kế (hoặc nhiều khuôn giống hệt nhau).
2. **Khuôn & Khay:** Một khuôn vật lý chỉ tạo ra một mã khay duy nhất (có thể khác vật liệu nhưng thiết kế khuôn đã chỉ định).
3. **Locking (Chiếm dụng Khuôn):** Nếu một khuôn đang được chạy ở Máy A trong Ca X, nó **bắt buộc phải bị khóa** và không thể chạy ở máy khác trong cùng ca.

## 3. Kiến Trúc Kỹ Thuật (Technical Architecture)
1. **Xử lý `NOT NULL` của Khuôn (Database):**
   - Đã tháo gỡ ràng buộc `NOT NULL` của trường `mold_physical_id` trong bảng `production_plans` qua file migration `20260501_044_allow_null_mold_in_plans.sql`.
   - Mục đích: Cho phép tạo Kế hoạch trống (chưa có khuôn) thay vì hoảng loạn vơ đại khuôn `TE-6-156-6` khi dữ liệu khay chưa được thiết lập.
2. **Conflict Prevention (Chống xung đột khuôn) - `EditModal.tsx` & `production.ts`:**
   - Đã tạo hàm `getOccupiedMolds(dateStr, shift)` để quét database xem khuôn nào đang bận.
   - Khi mở `EditModal`, hệ thống tự quét và bôi đỏ chữ `🔒 Đang chạy ở {Tên Máy}` đối với các khuôn bận. Nút Submit sẽ tự động `disabled` nếu người dùng cố ý chọn khuôn này.
3. **Smart Mold Combobox (Tìm kiếm khuôn thông minh):**
   - Thay thế thẻ `<select>` cũ kỹ bằng `<input>` với chức năng Fuzzy Search (Bỏ qua khoảng trắng và dấu gạch ngang).
   - Hỗ trợ chọn nhanh bằng phím Enter và tự động hiển thị danh sách khuôn khi Focus.
4. **Cảnh báo thông minh (Smart Badge) - `ExcelPlanGridView-v8.5.2-1.tsx`:**
   - Những kế hoạch đang bị thiếu khuôn (Null) sẽ được gắn cờ `⚠️` ngay sát tên mã sản phẩm để nhắc nhở Tổ Trưởng (Tooltip: 金型未設定 / Chưa gán khuôn).

## 4. Hướng Dẫn Tiếp Quản (Next Steps for Next Machine)
Khi pull repository về máy tính mới, hãy thực hiện các bước sau:
1. `git pull origin main`
2. **Database:** Chạy lệnh đẩy các file Migration (Đặc biệt là file `044` vừa tạo).
   ```bash
   npx supabase db push
   ```
3. **Khởi động:**
   ```bash
   npm run dev
   ```
4. **Technical Debt (Nợ Kỹ Thuật cần làm tiếp):**
   - Cần thực hiện quy hoạch lại bảng `product_mold_map` để gán đúng Khuôn Chuẩn cho toàn bộ Khay trong xưởng, tránh việc phải dùng "Mở rộng tùy chọn" quá nhiều.
   - Xóa bỏ triệt để các mã `.rar` backup sinh ra trong repo để tối ưu dung lượng Git.

---
*Tài liệu này được tạo bởi Antigravity nhằm bảo đảm luật "Đại Cung Điện" (Luật Thép) về tính liên tục của hệ thống.*
