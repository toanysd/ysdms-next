# Sổ Tay Hướng Dẫn Vận Hành Hệ Thống PE-AN Bridge v3.3

> **Dành cho:** Minh Chủ THOAN  
> **Quy trình chuẩn:** 🟡 Vàng (Chờ AN) ➔ 🟢 Xanh (AN xong) ➔ Bấm nút 'Điền vào PE' ➔ Nhấn Enter.

---

## 1. Cài Đặt Userscript v3.3 (Chỉ Cần Làm 1 Lần)

1. Mở tiện ích **Tampermonkey** trên trình duyệt Chrome / Edge.
2. Chọn **Dashboard** (Bảng điều khiển) ➔ Chọn Userscript `Perplexity Bridge...`.
3. Xóa toàn bộ nội dung cũ và dán toàn bộ nội dung file:  
   `G:/AntiGravity/apps/ysdms-nextgen/scripts/pe_an_bridge_two_way_toast.user.js`  
   *(hoặc file `G:/AntiGravity/apps/omnilinguist/tools/userscript/pe_an_bridge_two_way_toast.user.js`)*.
4. Nhấn `Ctrl + S` để lưu lại.

---

## 2. Quy Trình Vận Hành Hàng Ngày (Chuẩn Minh Chủ)

### Bước 1: Khởi động Local Hub
- Nhấp đúp file: `G:/AntiGravity/START_REALTIME_HUB.bat` (giữ cửa sổ mở).

### Bước 2: Vòng lặp làm việc trên Perplexity
1. **Thoan gọi PE:** Gõ `"PE đọc Bridge."` và nhấn Enter trên Perplexity.
2. **PE phân tích & nộp chỉ thị:** 
   - PE đọc Supabase, phân tích và tự gửi chỉ thị lên bảng `pe_an_messages`.
   - Ngay lập tức, thanh điều khiển chuyển sang **CHẤM VÀNG 🟡** (`Chờ AN xử lý`).
   - Nút `[Điền vào PE]` mờ đi, Local Hub phát tiếng bíp báo động trên máy tính.
3. **Kỹ sư AN thi công thật sự:**
   - AN trong Antigravity đọc chỉ thị từ Supabase, tiến hành code tính năng, chạy test và nộp REPORT lên Supabase.
4. **Hệ thống chuyển CHẤM XANH 🟢:**
   - Khi AN nộp REPORT xong, thanh điều khiển chuyển sang **CHẤM XANH 🟢**.
   - Nút **`[🔔 Điền vào PE]`** bật sáng rực rỡ màu xanh ngọc.
   - Trình duyệt phát tiếng chuông êm `ding~`.
5. **Thoan duyệt & bấm nút:**
   - Thoan nhấp chuột vào nút **`[🔔 Điền vào PE]`**.
   - Ô nhập liệu Perplexity được điền ngay ngắn dòng chữ: `"PE đọc Bridge."`.
   - Thoan nhấn **Enter** để chuyển lượt cho PE!

---

## 3. Các Tính Năng Hỗ Trợ Trên Màn Hình

- **Kéo thả tùy ý (Draggable):** Nhấn giữ biểu tượng `⋮⋮` ở đầu thanh để kéo đến bất kỳ vị trí nào trên màn hình. Vị trí sẽ tự động được ghi nhớ.
- **Tạm dừng / Bật lại:** Nhấp nút `Tạm dừng` nếu muốn tạm ngừng quét Supabase.
