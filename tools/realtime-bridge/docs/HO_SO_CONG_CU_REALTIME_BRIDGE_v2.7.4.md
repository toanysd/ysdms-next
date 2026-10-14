# HỒ SƠ CÔNG CỤ & SỔ TAY TRIỂN KHAI PE-AN REALTIME BRIDGE [v2.7.4] TRÊN MÁY TÍNH KHÁC

> **Phiên bản:** `v2.7.4` (Hardened Autonomous Edition)  
> **Ngày cập nhật:** 2026-10-14  
> **Tác giả:** Antigravity (AN) & Perplexity (PE) — Phê duyệt bởi Minh Chủ **THOAN**  
> **Áp dụng cho:** Hệ sinh thái YSDMS NextGen (`:3856`) và OmniLinguist (`:3956`)

---

## 1. TỔNG QUAN KIẾN TRÚC & NGUYÊN LÝ HOẠT ĐỘNG (v2.7.4)

Hệ thống **PE-AN Realtime Bridge** là cầu nối thời gian thực 2 chiều tự động hóa quy trình phối hợp giữa:
- **Minh Chủ (THOAN):** Người giữ quyền duyệt tối cao, ra quyết định lớn.
- **Kiến trúc sư trưởng / Thẩm định viên (PE — Perplexity Pro Claude Sonnet Thinking):** Phân tích kiến trúc, giao việc, thẩm định kết quả.
- **Kỹ sư thi công cục bộ (AN — Antigravity):** Lập trình, sửa code, chạy test, audit trên máy tính.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   TRÌNH DUYỆT WEB (PERPLEXITY PRO)                     │
│  Tampermonkey Userscript [v2.7.4]:                                    │
│  - YSDMS Bridge (Port 3856)     - OmniLinguist Bridge (Port 3956)     │
│  - Tab Affinity: Auto-Pinned    - Next-Step Status & Auto-Resume Btn  │
└──────────────────▲───────────────────────────────▲────────────────────┘
                   │ Server-Sent Events (SSE)      │ HTTP POST Feed/Report
                   │ & REST Endpoints              │ (CORS Enabled)
┌──────────────────▼───────────────────────────────▼────────────────────┐
│                  LOCAL REALTIME HUBS (NODE.JS DAEMON)                 │
│  - YSDMS Hub (ysdms_realtime_hub.cjs: 3856+)                          │
│  - Omni Hub (omni_realtime_hub.cjs: 3956+)                            │
│  - CORS Shield: Hỗ trợ https://count.perplexity.ai, www.perplexity.ai │
│  - Auto-fallback nâng cổng khi trùng (EADDRINUSE: port + 1)           │
└──────────────────▲───────────────────────────────▲────────────────────┘
                   │ PostgreSQL REST / RPC         │ File IO Cục bộ
                   │ Service Role / Anon Key       │ (.agents/PE_INBOX_LATEST.md)
┌──────────────────▼───────────────────────────────▼────────────────────┐
│                    SUPABASE DATABASE (SSOT LEDGER)                     │
│  - Bảng public.pe_bridge / public.pe_an_messages                      │
│  - RPC push_pe_bridge_message / claim_pe_bridge_row                   │
│  - Lưu trữ lịch sử tin nhắn, trạng thái CONSUMED/PENDING              │
└───────────────────────────────────────────────────────────────────────┘
```

### Các Tính Năng Đột Phá Mới Trong `[v2.7.4]`:
1. **Hiển thị trực quan "Bước tiếp theo (`⏭️ Tiếp theo: ...`)"**:
   - Tự động tính toán hành động kế tiếp ứng với trạng thái hiện tại (Đang đợi AN chạy nốt, Chờ đổ vào PE, Chờ Minh Chủ bấm Enter, Chờ PE trả lời xong, hoặc Sẵn sàng gửi cho AN).
2. **Nút bấm thông minh `[⏸️ Tạm dừng / ▶️ Tiếp tục Tự động gửi]`**:
   - Thay thế checkbox bằng nút bấm đa trạng thái.
   - Khi đang Tạm dừng, nút tự động đổi màu và hiển thị chính xác hành động sẽ thực thi (VD: `▶️ Tiếp tục Tự động gửi (Gửi ngay cho AN)` màu xanh lá đậm). Bấm vào là bật lại Auto và lập tức kích hoạt hành động!
3. **Pha `PE_READY_TO_DISPATCH` & Nhận diện PE hoàn tất chính xác**:
   - Bộ dò DOM liên tục giám sát DOM kể cả khi đang Tạm dừng. Ngay khi PE dừng trả lời (sau 3.2s), cầu nối lập tức chuyển sang `🟢 PE đã trả lời xong — Đến lượt gửi cho AN`.
   - Kết hợp kiểm tra thứ tự DOM (`compareDocumentPosition`) và so sánh Timestamp JST (`peStamp.ms >= rowCreatedMs`), đảm bảo không bao giờ nhận nhầm câu trả lời của lượt cũ.
4. **Cơ chế chống xung đột đa Tab (Tab Affinity Auto-Pin)**:
   - Tự động nhận diện tab Perplexity nào thuộc dự án nào qua URL và SessionStorage. Tab của YSDMS tự động thu nhỏ nhường chỗ cho OmniLinguist và ngược lại.
5. **CORS Policy Toàn Diện**:
   - Đáp ứng cả origin mới `https://count.perplexity.ai` và `https://www.perplexity.ai`, ngăn chặn triệt để lỗi `ERR_FAILED` trên Console trình duyệt.

---

## 2. DANH MỤC THÀNH PHẦN HỆ THỐNG

### Thư mục `tools/realtime-bridge/` (Áp dụng cho mỗi dự án):
| Tên File | Vai trò |
| :--- | :--- |
| `ysdms_pe_bridge.user.js` / `omni_pe_bridge.user.js` | Userscript Tampermonkey v2.7.4 chạy trên Perplexity Web |
| `ysdms_realtime_hub.cjs` / `omni_realtime_hub.cjs` | Node.js Server xử lý SSE, HTTP API, CORS và kết nối Supabase |
| `START_YSDMS_HUB.bat` / `START_OMNI_HUB.bat` | File bat 1-Click khởi động Hub tương ứng |
| `ysdms_bridge_messenger.py` / `omni_bridge_messenger.py` | CLI gửi nhận tin cho kỹ sư AN qua terminal |
| `read_pe_msg.py` | Script đọc nhanh chỉ thị mới nhất của PE |
| `USER_MANUAL.md` | Hướng dẫn vận hành nhanh |

### File Điều Phối Cấp Root Trên USB (`G:\AntiGravity`):
| Tên File | Vai trò |
| :--- | :--- |
| `CHUYEN_MAY_TU_DONG.bat` | Kịch bản 1-Click thiết lập môi trường máy mới (Symlink, uv, pwm-mcp, config) |
| `USB_SMART_LAUNCHER.bat` | Công cụ đồng bộ mã nguồn giữa USB và ổ `D:` máy tính |
| `START_REALTIME_HUB.bat` | Menu 1-Click khởi chạy Hub thời gian thực từ ổ USB |
| `HUONG_DAN_CHUYEN_MAY.md` | Cẩm nang chuyển máy linh hoạt |

---

## 3. QUY TRÌNH 3 BƯỚC TRIỂN KHAI TRÊN MÁY TÍNH KHÁC (PLUG & PLAY)

Khi cắm ổ cứng USB vào bất kỳ máy tính Windows nào (máy cá nhân, máy công ty, laptop):

### Bước 1: Thiết Lập Môi Trường (Chạy 1 lần duy nhất trên máy mới)
1. Cắm USB vào máy tính.
2. Mở USB, vào thư mục `AntiGravity`.
3. Nhấp đúp chạy: 👉 **`CHUYEN_MAY_TU_DONG.bat`** (mất khoảng 5–10 giây).
   - Kịch bản sẽ tự động tạo thư mục `.gemini`, liên kết MCP token, cài đặt engine cần thiết.

### Bước 2: Đồng Bộ Mã Nguồn Dự Án (Khuyên dùng để tối ưu tốc độ)
1. Mở 👉 **`USB_SMART_LAUNCHER.bat`** trên USB.
2. Chọn dự án bạn muốn làm việc (VD: `ysdms-nextgen` hoặc `omnilinguist`).
3. Chọn `[1] Đồng bộ từ USB sang ổ D (D:\AntiGravity_Workspace)`.
   *(Nếu máy tính không có ổ D, bạn có thể chạy trực tiếp từ USB hoặc chọn thư mục làm việc tương đương).*

### Bước 3: Khởi Động Realtime Hub & Cài Userscript Trình Duyệt
1. Chạy 👉 **`START_REALTIME_HUB.bat`** trên USB (hoặc chạy `START_YSDMS_HUB.bat` / `START_OMNI_HUB.bat` trong thư mục dự án):
   - Cửa sổ Node.js mở ra hiển thị:
     - `🟢 YSDMS Realtime Hub online on port :3856`
     - Hoặc `🟢 OmniLinguist Realtime Hub online on port :3956`.
2. Mở trình duyệt Chrome/Edge (nơi đã cài tiện ích **Tampermonkey**).
3. Bấm vào link cài đặt tự động 1-Click từ Hub local:
   - Với YSDMS: 👉 **`http://127.0.0.1:3856/ysdms_pe_bridge.user.js`**
   - Với OmniLinguist: 👉 **`http://127.0.0.1:3956/omni_pe_bridge.user.js`**
   - Tampermonkey sẽ mở trang xác nhận cài đặt, bấm **Install** (hoặc **Update**).
4. Mở tab [https://www.perplexity.ai](https://www.perplexity.ai):
   - Bạn sẽ thấy hộp điều khiển **`[v2.7.4] 🌐 Bridge`** hiển thị ở góc dưới màn hình kèm chấm xanh kết nối `🟢 :3856` hoặc `🟢 :3956`!

---

## 4. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

### 1. Máy tính mới chưa có Node.js
- **Triệu chứng:** Khi chạy file `.bat`, màn hình báo `Khong tim thay Node.js tren may tinh!`.
- **Cách khắc phục:** 
  - Tải và cài đặt Node.js LTS (v20+) từ [nodejs.org](https://nodejs.org).
  - Hoặc trên máy có `winget`, chạy lệnh: `winget install OpenJS.NodeJS.LTS`.

### 2. Trình duyệt báo lỗi CORS hoặc `net::ERR_FAILED`
- **Nguyên nhân:** Perplexity vừa đổi subdomain thành `count.perplexity.ai` hoặc chặn cross-origin.
- **Cách khắc phục:**
  - Phiên bản Hub `v2.7.3+` và Userscript `v2.7.4` đã tích hợp sẵn header `Access-Control-Allow-Origin: *` cho mọi request `/api/events`, `/api/messages/feed`, `/api/report`.
  - Đảm bảo bạn đang chạy bản Hub mới nhất từ USB (`ysdms_realtime_hub.cjs` / `omni_realtime_hub.cjs`).

### 3. Cổng mạng bị chiếm dụng (`EADDRINUSE`)
- **Cơ chế tự sửa:** Hub sẽ tự động thử cổng kế tiếp (`port + 1`) và thông báo trên terminal.
- **Trên Userscript:** Nếu cổng bị đổi, nhấp vào nút hiển thị cổng `🔴 :3856` trên header của thanh công cụ và nhập số cổng mới.

### 4. Tampermonkey không tự nạp script trên trang web
- **Cách khắc phục:**
  - Vào tiện ích Tampermonkey -> Settings -> Đảm bảo `Config mode` là `Beginner` hoặc `Advanced`.
  - Trong tab Perplexity, bấm `F5` tải lại trang.

### 5. Kết thúc buổi làm việc (Chuẩn bị rút USB đi về)
1. Đóng các cửa sổ Hub (nhấn `Ctrl + C`).
2. Mở 👉 **`USB_SMART_LAUNCHER.bat`** -> Chọn dự án -> Chọn `[2] Đồng bộ từ ổ D sang USB`.
3. Khi màn hình báo đồng bộ hoàn tất 100%, bạn có thể yên tâm rút USB mang sang máy tính khác tiếp tục làm việc!
