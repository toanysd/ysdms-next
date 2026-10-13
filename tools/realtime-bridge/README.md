# Cầu Nối Thời Gian Thực PE-AN Dự Án YSDMS NextGen (Realtime Bridge v2.2.0 Dedicated)

> **Dự án:** YSDMS NextGen (Smart Factory / MES Production System)  
> **Cơ chế:** Realtime State Machine (Supabase `public.pe_an_messages` SSOT + Local Node.js SSE Hub + Perplexity Userscript)  
> **Quy trình chuẩn:** **PE · THOAN · AN**  
> **Cổng mặc định:** **3856+** (Tự động nâng cổng khi trùng, hoàn toàn tách biệt khỏi cổng 3956 của OmniLinguist)

---

## 1. Vòng Đời Quy Trình Khép Kín (Workflow Lifecycle)

```
        ┌────────────────────────────────────────────────────────┐
        │ 1. THOAN phát lệnh "PE đọc Bridge." trên Perplexity   │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 2. PE đọc Supabase/GitHub, phân tích & xuất CHỈ THỊ    │
        │    có cặp thẻ đóng === PE-DIRECTIVE === ... === END ===│
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 3. Userscript nhận diện CHỈ THỊ TOÀN VẸN từ PE:        │
        │    - Chuyển CHẤM VÀNG 🟡 (Chờ AN thi công)             │
        │    - Bắn Webhook chuyển chỉ thị về Local Hub           │
        │    - Hub lưu vào .agents/PE_INBOX_LATEST.md + Bíp còi  │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 4. Kỹ sư AN thực thi nhiệm vụ trong Antigravity:       │
        │    - Sửa mã nguồn, chạy migration, kiểm thử unit/E2E...│
        │    - Nộp REPORT hoàn tất qua ysdms_bridge_messenger.py │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 5. Local Hub nhận REPORT ➔ Bắn SSE tới Trình duyệt:    │
        │    - Chuyển CHẤM XANH 🟢 (Sẵn sàng gọi PE)             │
        │    - Nút [🚀 Đổ báo cáo vào PE] bật sáng rực rỡ        │
        │    - Tự động điền text "PE đọc Bridge." vào ô chat     │
        │    - Tự động Submit ngẫu nhiên 1–4s (Auto Mode)        │
        │    - Sau khi nạp vào PE: Rơi vào trạng thái CHỜ        │
        │      (Awaiting Supabase New Row) chống đổ lặp tuyệt đối│
        └────────────────────────────────────────────────────────┘
```

---

## 2. Các Tính Năng Nổi Bật Thế Hệ v2.2.0

1. **Khắc Phục Triệt Để Lỗi Đổ Lặp Dữ Liệu Vào PE:**
   - Sau khi đổ dữ liệu vào ô chat Perplexity, Userscript lập tức chuyển sang trạng thái chờ `isAwaitingSupabaseNewRow = true` và khóa `pendingAnReport = false`.
   - Vòng lặp thăm dò (Poll 3s), SSE trùng lặp hoặc Refresh thủ công đều bị chặn bởi `getAutoInjectBlockReason = AWAITING_SUPABASE_UPDATE`.
2. **Điều Phối Chính Xác Theo Người Gửi (`sender`):**
   - Khi Supabase xuất hiện bản ghi mới:
     * `sender === 'PE'` hoặc `'THOAN'`: Giải phóng trạng thái chờ, đối tượng nhận là AN (chuyển sang `AN_TURN`).
     * `sender === 'AN'` (bản ghi mới với ID mới): Giải phóng trạng thái chờ, đối tượng nhận là PE (chuyển sang `PE_TURN`), kích hoạt đếm ngược ngẫu nhiên 1–4s để nạp báo cáo mới cho PE.
3. **Phân Tách Tuyệt Đối Giữa Các Dự Án:**
   - YSDMS NextGen sử dụng bảng SSOT `public.pe_an_messages` trên Supabase `iirezrszalmecsslbruo.supabase.co`.
   - Cổng mặc định **3856+** (không xung đột với OmniLinguist ở cổng 3956+).
   - Tự động tăng cổng `port + 1` khi phát hiện `EADDRINUSE`.
4. **Phím Tắt Tiện Ích Toàn Cục:**
   - **Alt + F9:** Đổ báo cáo và gửi ngay vào PE.
   - **Alt + F10:** Ép chuyển câu trả lời hiện tại của PE sang AN ngay lập tức.
   - **Alt + F5:** Đồng bộ lại trạng thái từ Supabase (Manual Rehydration).
   - **Alt + P:** Bật/tắt nhanh chế độ Auto-Submit (Auto / Paste-Only).

---

## 3. Danh Mục Tệp Trong Thư Mục Công Cụ

| Tên File | Vị Trí | Vai Trò & Chức Năng |
| :--- | :--- | :--- |
| `start_bridge_hub.bat` | Root `d:\...\ysdms-nextgen\` | Phím tắt khởi động Local Hub từ root dự án. |
| `Start_YSDMS_Hub.bat` | Root `d:\...\ysdms-nextgen\` | Phím tắt tương thích launcher YSDMS. |
| `START_YSDMS_HUB.bat` | `tools/realtime-bridge/` | Script kích hoạt Node.js Hub trên cổng 3856+. |
| `ysdms_realtime_hub.cjs` | `tools/realtime-bridge/` | Local Server xử lý SSE, Webhook và lưu trữ Inbox. |
| `ysdms_pe_bridge.user.js` | `tools/realtime-bridge/` | Userscript Tampermonkey v2.2.0 cài vào Chrome/Edge. |
| `ysdms_bridge_messenger.py`| `tools/realtime-bridge/` | CLI công cụ dành cho AN gửi Report & đọc Directive. |
| `watch_directive.py` | `tools/realtime-bridge/` | Sentinel watcher giám sát chỉ thị mới cho AN. |
| `USER_MANUAL.md` | `tools/realtime-bridge/` | Sổ tay hướng dẫn thao tác chi tiết dành cho Minh Chủ. |
| `data/` | `tools/realtime-bridge/data/` | Thư mục lưu trữ ledgers trạng thái, correlation và handoff. |
