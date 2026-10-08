# Implementation Plan: WO-BRIDGE-HARDENING (Cứng hóa Bridge Event-Driven PE–AN)

## 1. Thông Tin Chung & Bối Cảnh
- **Mã Work Order:** `WO-BRIDGE-HARDENING`
- **Mã Message Chỉ thị:** `8c5751f2-5520-4898-bbe9-2f952bc34037`
- **Phân loại rủi ro:** 🟡 **YELLOW** (Chỉ đọc + Củng cố Event Delivery)
- **Mục tiêu:** Củng cố toàn bộ hạ tầng cầu nối 2 chiều giữa Perplexity (PE), Minh Chủ (THOAN) và Antigravity (AN) theo kiến trúc Event-driven thuần túy (Không Polling nghiệp vụ), bảo mật Localhost, chống trùng lặp (Idempotency) và cung cấp bảng điều khiển an toàn (Toggle On/Off).
- **Ràng buộc phạm vi tuyệt đối:**
  - ❌ KHÔNG chạy migration DDL schema trong WO này.
  - ❌ KHÔNG ghi đè / chỉnh sửa dữ liệu domain production (chỉ đọc & cập nhật trạng thái delivery trên `pe_an_messages`).
  - ❌ KHÔNG tự động click nút Send trên giao diện Perplexity (giữ quyền kiểm soát của THOAN).
  - ❌ KHÔNG tự động hóa migration hoặc production write.

---

## 2. Kiến Trúc Chi Tiết Đề Xuất (PE Approved Spec)

```
┌──────────────────────────────────────────────────────────┐
│              Supabase public.pe_an_messages              │
│       (Nguồn sự thật SSOT & Hàng đợi trạng thái)         │
└──────────────┬────────────────────────────▲──────────────┘
               │ postgres_changes (Realtime)│
               │ (Chỉ thị mới INSERT)       │ REPORT / ACK
               ▼                            │
┌───────────────────────────────────────────┴──────────────┐
│   Local Bridge Hub (Node.js @ 127.0.0.1:3456)            │
│   - Bind duy nhất 127.0.0.1, Token & Origin verification │
│   - Idempotency Cache (message_id deduplication)         │
│   - State Machine & Local Audit Logging                  │
└───────┬────────────────────────────────────▲─────────────┘
        │ SSE (AN_REPORT_DONE / DIRECTIVE)   │ /api/report (AN done)
        ▼                                    │
┌───────────────────────────────┐ ┌──────────┴─────────────┐
│ Userscript v3.11 (Console)    │ │ Antigravity Sentinel   │
│ - Toggle Auto-forward (Def:OFF│ │ (Background Worker)    │
│ - Trạng thái Hub / Realtime   │ │ - Long-polling gateway │
│ - Nút "Đổ báo cáo vào PE"    │ │ - Reactive Wakeup      │
│ - THOAN tự bấm Send PE        │ │ - Chống trùng lặp      │
└───────────────────────────────┘ └────────────────────────┘
```

---

## 3. Danh Sách File Cần Cập Nhật / Tạo Mới (File List)

| STT | Đường dẫn File | Mục đích & Trách nhiệm |
|---|---|---|
| 1 | `scripts/local_realtime_hub.js` | Nâng cấp Gateway Hub: Tích hợp `@supabase/supabase-js` Realtime client (không polling), bảo mật token phiên cục bộ (`.agents/hub_token.json`), kiểm tra Origin, xác minh `message_id` tồn tại trong Supabase, chống trùng lặp, ghi Audit Log (`.agents/bridge_audit.log`). |
| 2 | `scripts/bridge_sentinel.py` | Worker ngầm cho Antigravity: Chờ tín hiệu từ Hub qua long-polling xác thực, cập nhật trạng thái message sang `READ` (ACK), nạp vào inbox, thoát mã 0 để kích hoạt Reactive Wakeup tự nhiên. |
| 3 | `docs/realtime-bridge/Bridge_Userscript_v3.11.js` | Console Userscript chuẩn: Mặc định Toggle OFF (`localStorage.getItem('pe_an_auto_forward') === 'true'`), hiển thị trạng thái Hub/Realtime (Connected/DEGRADED), nút gửi thủ công có timestamp + message_id, nút "Đổ báo cáo vào PE" không tự động Send. |
| 4 | `scripts/notify_pe_done.py` | Script nộp báo cáo chuẩn: Gửi tín hiệu hoàn tất kèm token bảo mật tới Local Hub để kích hoạt sự kiện SSE `AN_REPORT_DONE`. |
| 5 | `scripts/test_bridge_hardening.py` | Bộ test suite tự động kiểm thử toàn diện các yêu cầu kỹ thuật của PE. |
| 6 | `docs/technical/08_pe_an_bridge_architecture.md` | Tài liệu kỹ thuật cập nhật kiến trúc Bridge chuẩn hóa. |

---

## 4. Xử Lý Ràng Buộc State Machine & Schema

### Vấn đề:
- Cột `status` của `pe_an_messages` trong schema hiện tại có CHECK constraint:
  `CHECK (status IN ('PENDING', 'READ', 'APPROVED', 'REJECTED'))`
- PE yêu cầu state machine: `PENDING → DISPATCHED → ACKNOWLEDGED → IN_PROGRESS → REPORT_SUBMITTED → PE_REVIEWED → CLOSED`.
- Vì WO này có ràng buộc **KHÔNG DDL**, chúng ta không thể mở rộng enum/check constraint ở DB trong giai đoạn này.

### Giải pháp kỹ thuật:
1. **Ở cấp Supabase DB:**
   - Sử dụng các trạng thái hợp lệ hiện có: `PENDING` (mới tạo) → `READ` (Hub & AN đã ACK và nhận việc) → `APPROVED` / `REJECTED` (PE nghiệm thu).
2. **Ở cấp Local Hub & Sentinel (Granular State Machine):**
   - Lưu trữ state machine chi tiết 7 bước tại `.agents/bridge_state_machine.json` và `.agents/bridge_audit.log`.
   - Đính kèm metadata có cấu trúc (YAML header) trong nội dung `content_md` khi gửi REPORT:
     ```yaml
     ---
     protocol: PE_AN_V2
     message_id: <uuid>
     thread_id: WO-BRIDGE-HARDENING
     state: REPORT_SUBMITTED
     timestamp: 2026-10-08T14:30:00Z
     actor: AN
     ---
     ```

---

## 5. Kế Hoạch Kiểm Thử Chi Tiết (Test Plan)

| Test Case | Mục tiêu kiểm tra | Phương pháp thực hiện | Tiêu chí đạt (Pass Criteria) |
|---|---|---|---|
| **TC-01** | Localhost Network Binding | Kiểm tra cổng mở bằng socket/netstat | Chỉ bind trên `127.0.0.1`, tuyệt đối không bind `0.0.0.0`. |
| **TC-02** | Token & Origin Authentication | Gửi request không có token / sai token / sai Origin | Trả về `401 Unauthorized` hoặc `403 Forbidden`. |
| **TC-03** | Fake Message Rejection | Gửi `message_id` ngẫu nhiên không có trên Supabase | Hub tra cứu Supabase và trả về `400 Bad Request` (Từ chối lệnh giả). |
| **TC-04** | Idempotency & Deduplication | Gửi cùng 1 `message_id` 2 lần liên tiếp trong 30s | Lần 1 xử lý, lần 2 bị chặn `409 Conflict` hoặc `200 Ignored Duplicate`. |
| **TC-05** | Supabase Realtime Reception | Kích hoạt sự kiện INSERT trên `pe_an_messages` | Local Hub nhận sự kiện qua WebSocket Realtime mà không có request polling. |
| **TC-06** | Toggle OFF Behavior | Đặt Toggle = OFF trong Userscript, gửi directive | Directive được giữ Pending, hiển thị nút thủ công, không tự động kích hoạt AN. |
| **TC-07** | Toggle ON Behavior | Đặt Toggle = ON trong Userscript, gửi directive | Directive tự động chuyển sang Hub và đánh thức AN qua Sentinel. |
| **TC-08** | Offline / DEGRADED Handling | Tắt Local Hub, tải Userscript | UI hiển thị trạng thái `DEGRADED / Disconnected`, không báo ảo "đã gửi". |
| **TC-09** | Audit Log Integrity | Kiểm tra file `.agents/bridge_audit.log` | Mọi sự kiện đều có message_id, thread_id, actor, timestamp, status. |

---

## 6. Trình Tự Thực Hiện Sau Khi PE Phê Duyệt Kế Hoạch
1. **Bước 1:** Nâng cấp `scripts/local_realtime_hub.js` (Realtime, Auth, Idempotency, Audit log).
2. **Bước 2:** Cập nhật `scripts/bridge_sentinel.py` (Background worker có xác thực token).
3. **Bước 3:** Cập nhật `docs/realtime-bridge/Bridge_Userscript_v3.11.js` (UI toggle default OFF, status indicators).
4. **Bước 4:** Viết và thực thi test suite `scripts/test_bridge_hardening.py` để lấy log kiểm thử thực tế.
5. **Bước 5:** Báo cáo nghiệm thu đầy đủ kèm Commit SHA, log chạy thật và bằng chứng cho PE.
