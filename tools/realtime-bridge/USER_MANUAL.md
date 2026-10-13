# SỔ TAY VẬN HÀNH CẦU NỐI REALTIME BRIDGE (YSDMS NEXTGEN v2.2.0)

Dành cho **Minh Chủ THOAN** và các kỹ sư hệ thống trên dự án YSDMS NextGen.

---

## 1. Cài Đặt Userscript Lần Đầu

1. Mở trình duyệt Chrome / Edge (nơi đang đăng nhập Perplexity Pro).
2. Mở tiện ích mở rộng **Tampermonkey** ➔ Chọn **Create a new script** (Tạo script mới).
3. Mở tệp [`tools/realtime-bridge/ysdms_pe_bridge.user.js`](file:///D:/AntiGravity_Workspace/apps/ysdms-nextgen/tools/realtime-bridge/ysdms_pe_bridge.user.js), sao chép toàn bộ nội dung và dán vào Tampermonkey.
4. Bấm **File ➔ Save** (Ctrl + S) để lưu script `[v2.2.0] YSDMS NextGen Realtime Bridge: PE-AN Dedicated Hub`.
5. Đảm bảo script được bật (Enabled).

---

## 2. Khởi Động Local Hub

Tại thư mục gốc dự án `D:\AntiGravity_Workspace\apps\ysdms-nextgen`:
- Nhấp đúp vào [`start_bridge_hub.bat`](file:///D:/AntiGravity_Workspace/apps/ysdms-nextgen/start_bridge_hub.bat) (hoặc [`Start_YSDMS_Hub.bat`](file:///D:/AntiGravity_Workspace/apps/ysdms-nextgen/Start_YSDMS_Hub.bat)).
- Cửa sổ Node.js sẽ khởi chạy trên cổng **3856** (hoặc tự động tăng cổng nếu 3856 bị chiếm).
- Giữ nguyên cửa sổ CMD này trong suốt phiên làm việc.

---

## 3. Quy Trình Vận Hành Thường Nhật

1. **Khi PE gửi chỉ thị mới:**
   - Userscript tự động nhận diện chỉ thị và chuyển sang **🟡 [LƯỢT AN] Chờ AN thi công**.
   - Chỉ thị được gửi về Local Hub và lưu tại `.agents/PE_INBOX_LATEST.md` cho kỹ sư AN.
2. **Khi AN hoàn thành thi công:**
   - AN chạy lệnh:
     ```bash
     python tools/realtime-bridge/ysdms_bridge_messenger.py report --thread YSDMS-AUTH-PHASE1 --message "Nội dung báo cáo..."
     ```
   - Bản ghi được lưu vào bảng `public.pe_an_messages` trên Supabase.
   - Local Hub phát tín hiệu SSE tới trình duyệt.
   - Userscript chuyển sang **🟢 [LƯỢT PE] Sẵn sàng gọi PE**, tự động nạp text và submit ngẫu nhiên 1–4s (hoặc Minh Chủ bấm `Alt + F9`).
3. **Chống đổ lặp an toàn:**
   - Sau khi đổ vào PE, hệ thống rơi vào trạng thái chờ `⏳ [ĐÃ ĐỔ VÀO PE] Đang chờ PE thẩm định và Supabase cập nhật bản ghi mới...`.
   - Hệ thống chỉ giải phóng khi PE phản hồi xong và bản ghi mới xuất hiện trên Supabase!
