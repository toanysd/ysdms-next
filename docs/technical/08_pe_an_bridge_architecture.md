# KIẾN TRÚC HẠ TẦNG CẦU NỐI PE-AN (HARDENED EVENT-DRIVEN BRIDGE v4.0)

> **Dự án:** YSDMS NextGen — Hệ thống Phối hợp Tự trị PE-THOAN-AN  
> **Tài liệu SSOT:** Kiến trúc Cầu nối Realtime, Bảo mật Gateway & Bảng điều khiển

---

## 1. TỔNG QUAN LUỒNG HOẠT ĐỘNG KHÉP KÍN

Hạ tầng cầu nối PE-AN hoạt động dựa trên mô hình **Push Event-Driven** thuần túy:
1. **Nguồn sự thật & Hàng đợi trạng thái:** Bảng `public.pe_an_messages` trên Supabase PostgreSQL.
2. **Kênh phát hiện thời gian thực:** Supabase Realtime WebSocket (`postgres_changes` trên `pe_an_messages`).
3. **Gateway Cục bộ (Local Hub):** Tiến trình Node.js lắng nghe tại `http://127.0.0.1:3456` (chỉ bind loopback, tự động nâng cổng nếu `EADDRINUSE`).
4. **Bảng điều khiển Người dùng (Userscript v3.11):** Chạy trên trình duyệt Perplexity, kết nối SSE với Local Hub.
   - **Toggle Auto-forward:** Mặc định **TẮT (OFF)** khi cài đặt mới.
   - Khi OFF: Chỉ thị của PE được giữ Pending, hiển thị nút bấm kèm ID & Thời gian để THOAN duyệt thủ công.
   - Khi ON: Chỉ thị được tự động chuyển sang Local Hub kèm Token bảo mật.
   - **Nút "Đổ báo cáo vào PE":** Điền nội dung vào textarea Perplexity, **tuyệt đối không tự động bấm Send**. THOAN là người duyệt và bấm Send cuối cùng.
5. **Worker Thi công (Antigravity Sentinel):** Tiến trình Python chạy ngầm `scripts/bridge_sentinel.py`, nhận directive qua Long-polling authenticated từ Local Hub, cập nhật trạng thái `READ` (ACK) trên Supabase và thoát với mã 0 để kích hoạt **Reactive Wakeup** tự nhiên của IDE.

---

## 2. BẢO MẬT & CHỐNG TRÙNG LẶP (HARDENING)

1. **Localhost Network Isolation:**
   - Server chỉ bind trên `127.0.0.1`. Tuyệt đối không bind `0.0.0.0`.
2. **Session Token & Origin Verification:**
   - Khi khởi động, Local Hub sinh ngẫu nhiên một token 32-byte (`hub_token.json`).
   - Mọi request điều khiển (`/api/directive`, `/api/report`, `/api/wait_directive`) bắt buộc phải có header `x-bridge-token` hoặc Origin hợp lệ (`perplexity.ai` / Extension).
3. **Anti-forgery (Chống giả mạo lệnh):**
   - Khi nhận `message_id`, Local Hub truy vấn Supabase để xác minh record thật sự tồn tại trong DB và thuộc về sender `PE`.
   - Nếu không có trong DB → Trả về `400 Bad Request` và ghi log kiểm toán.
4. **Idempotency Cache (Chống trùng lặp):**
   - Duy trì cache `processed_messages.json` lưu 200 message gần nhất.
   - Tránh việc retry mạng hay click đúp gửi lệnh thi công nhiều lần.
5. **Structured Audit Log:**
   - Toàn bộ sự kiện được ghi vào `.agents/bridge_audit.log` (định dạng JSONL).

---

## 3. STATE MACHINE

Vì ràng buộc **KHÔNG DDL** trong Work Order, hệ thống ánh xạ 7 bước nghiệp vụ như sau:

| Bước nghiệp vụ PE | Trạng thái DB (`pe_an_messages`) | Trạng thái Local Hub / Sentinel |
|---|---|---|
| 1. PE tạo chỉ thị | `PENDING` | `PE_DIRECTIVE_ARRIVED` (Realtime) |
| 2. Chuyển sang Hub | `PENDING` | `DIRECTIVE_DISPATCHED` |
| 3. Sentinel tiếp nhận | `READ` (ACK) | `SENTINEL_DIRECTIVE_ACKNOWLEDGED` |
| 4. AN bắt đầu code | `READ` | `IN_PROGRESS` (Audit Log) |
| 5. AN gửi Báo cáo | `REPORT` (`PENDING`) | `AN_REPORT_SUBMITTED` (SSE) |
| 6. PE thẩm duyệt | `APPROVED` / `REJECTED` | `PE_REVIEWED` |
| 7. Đóng Work Order | `CLOSED` | `CLOSED` |
