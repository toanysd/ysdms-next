# Đặc Tả Kiến Trúc Kỹ Thuật (PE-AN Realtime Bridge v3.3)

> **Mã tài liệu:** `ARCH-REALTIME-BRIDGE-002`  
> **Cơ chế:** State Machine (Supabase SSOT + Local SSE)

---

## 1. Sơ Đồ Tuần Tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor THOAN as Minh Chủ (THOAN)
    actor PE as Kiến trúc sư trưởng PE (Perplexity Pro)
    participant SB as Supabase SSOT (pe_an_messages)
    participant US as Userscript v3.3 (Browser)
    participant HUB as Local Realtime Hub (Port 3456+)
    participant AN as Kỹ sư thi công AN (Antigravity)

    THOAN->>PE: Chat "PE đọc Bridge."
    PE->>SB: Đọc dữ liệu, phân tích & Gửi DIRECTIVE (status=PENDING)
    US->>SB: Quét Supabase (mỗi 3s)
    SB-->>US: Phát hiện tin mới từ PE
    US->>US: Chuyển CHẤM VÀNG 🟡 (Waiting AN) & mờ nút Điền PE
    US->>HUB: Webhook POST /api/directive (thông báo tin mới)
    HUB->>HUB: Bíp chuông 880Hz & Lưu .agents/PE_INBOX_LATEST.md
    AN->>SB: Đọc chỉ thị PE, thực thi code & kiểm thử đạt 100%
    AN->>SB: Nộp REPORT hoàn tất qua pe_an_messenger
    SB-->>HUB: Gọi POST /api/report
    HUB->>US: SSE Broadcast: AN_REPORT_DONE
    US->>US: Chuyển CHẤM XANH 🟢 & Bật sáng nút [🔔 Điền vào PE]
    US->>US: Phát chuông hoàn tất (587Hz)
    THOAN->>US: Bấm nút [🔔 Điền vào PE] (tự điền ô chat)
    THOAN->>PE: Nhấn [Enter] để PE đọc Bridge và nghiệm thu!
```

---

## 2. Các Trạng Thái Vòng Đời Dữ Liệu (State Machine)

1. **`IDLE` (Xám):** Không có hoạt động hoặc đang tạm dừng.
2. **`WAITING_AN` (Vàng):** Tin nhắn gần nhất trên Supabase là của `PE`. AN đang thi công, nút `[Điền vào PE]` bị khóa.
3. **`READY_PE` (Xanh):** Tin nhắn gần nhất trên Supabase là `REPORT` của `AN`. Nút `[Điền vào PE]` phát sáng xanh ngọc, sẵn sàng để THOAN kích hoạt.
