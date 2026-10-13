# Implementation Plan - BRIDGE v2.4.0 (Phương án 2: Kiến trúc Dual-Path Tinh Giản)

**Mã công việc:** `BRIDGE-v2.4.0` | **Thread:** `BRIDGE-ORCHESTRATION` | **Cấp độ rủi ro:** `LOW` (Tooling/DevOps - Zero DDL)  
**Tài liệu SSOT:** `docs/technical/08_pe_an_bridge_architecture.md`, `RULE-PROC-02 / QUY TẮC 0.7`  
**Chỉ thị phê duyệt từ PE:** Directive `[Stamp: 2026-10-13 19:40 JST]` (PE PHÊ DUYỆT KIẾN TRÚC BRIDGE v2.4.0 — PHƯƠNG ÁN 2)  
**Trạng thái hiện tại:** `[KẾ HOẠCH] Đệ trình Kế hoạch thi công (Chờ PE phê duyệt)`  
**Thời gian lập:** 2026-10-13 19:45 JST  

---

## 1. Bối Cảnh & Mục Tiêu

### 1.1. Bối cảnh
- Kiến trúc sư trưởng PE đã xác nhận 100% khả năng tự gọi Supabase Connector để INSERT trực tiếp vào `pe_an_messages` (đã chứng minh qua các directive `WO-P1-009`, `WO-P1-010`).
- Người dùng (Minh Chủ THOAN) và PE đã thống nhất loại bỏ việc cào DOM tự động ngầm trên trình duyệt Perplexity vì gây lộn xộn, bắt nhầm stream đang gõ dở, xung đột hash, và khiến Userscript phình to tới **3.732 dòng**.
- PE đã phê duyệt kiến trúc **Phương án 2 (Dual-Path)**:
  * **Luồng chính (Primary Path):** PE tự INSERT trực tiếp vào Supabase qua Supabase Connector. Hub nhận diện và kích hoạt Native AgentAPI đưa thẳng vào IDE cho AN.
  * **Luồng cứu hộ (Rescue Path):** Duy trì DUY NHẤT 1 nút bấm thủ công trên Userscript `⚡ Gửi ngay cho AN (Alt+F10)` để Minh Chủ chủ động gửi nếu PE gặp sự cố về connector.

### 1.2. Mục tiêu kỹ thuật
1. **XÓA BỎ 100% logic cào DOM tự động** ở chiều PE → AN trong `ysdms_pe_bridge.user.js`.
2. **Tinh giản Userscript:** Cắt giảm từ 3.732 dòng xuống **~400 - 500 dòng** (giảm > 85% dung lượng).
3. **Bảo toàn 100% chiều AN → PE:** Cơ chế nhận báo cáo AN qua SSE từ Hub, tự động đổ vào ô chat Perplexity, chuông âm thanh Web Audio, và cơ chế Minh Chủ Giữ Cổng (`[x] Chỉ dán chatbox` + Alt+F9).
4. **Nút Cứu Hộ Thủ Công duy nhất (Alt+F10):** Chỉ đọc nội dung khi Minh Chủ click hoặc bấm phím tắt, gửi qua Hub `/api/directive` để đẩy vào Supabase. Tuyệt đối không cào ngầm tự động.

---

## 2. Cam Kết An Toàn (Safety Gates)

- **ZERO DDL:** Tuyệt đối không thay đổi schema cơ sở dữ liệu `pe_an_messages` hay bất kỳ bảng nào trong dự án.
- **Zero Production Risk:** Chỉ can thiệp vào các tệp công cụ cầu nối (`tools/realtime-bridge/`), không ảnh hưởng mã nguồn Next.js (`src/app/`).
- **Phân định 3 Pha (RULE-PROC-01):**
  * Nộp Kế hoạch thi công chi tiết này (Pha 1: PLANNING).
  * Chỉ tiến hành chỉnh sửa mã nguồn sau khi PE phê duyệt kế hoạch.
  * Xuất Báo cáo nghiệm thu (Pha 3: COMPLETION) sau khi toàn bộ Test Suite đạt 100% PASS.

---

## 3. Danh Sách Tệp Can Thiệp (File List)

| STT | Tệp | Loại thay đổi | Mô tả chi tiết |
|---|---|---|---|
| 1 | `tools/realtime-bridge/ysdms_pe_bridge.user.js` | **Rewrite / Refactor** | Tinh giản từ 3.732 dòng xuống ~450 dòng. Xóa toàn bộ stream observer, hash detector, envelope parsing ngầm; giữ lại SSE receiver, input injector, toast/audio, và nút cứu hộ Alt+F10. Version: `v2.4.0`. |
| 2 | `tools/realtime-bridge/ysdms_realtime_hub.cjs` | **Cập nhật cấu hình** | Cập nhật version banner lên `v2.4.0`, đảm bảo route `/api/directive` phục vụ tốt cho nút cứu hộ thủ công và phân phối Userscript mới tại `http://127.0.0.1:3856/ysdms_pe_bridge.user.js`. |
| 3 | `scripts/test_bridge_v240_dual_path.py` | **Tạo mới (Test Suite)** | Script kiểm thử độc lập 5 tiêu chí: dung lượng dòng, loại bỏ auto-scraping, sự hiện diện của nút cứu hộ, tính tương thích của input inject, và luồng live Supabase. |

---

## 4. Chi Tiết Kế Hoạch Tinh Giản Userscript (`ysdms_pe_bridge.user.js`)

### 4.1. Những phần BẮT BUỘC XÓA BỎ (Elimination List)
- ❌ **Xóa `getLatestPeResponse()` tự động & stream detector:** Không còn quét liên tục các thẻ `.prose`, `div[dir="auto"]` trong DOM.
- ❌ **Xóa MutationObserver & Stream Timer:** Xóa bỏ `observePeStream()`, `isPeStreaming`, `timeSinceLastTextChange`, `debounceForwardTimer`, `hasObservedNewStream`.
- ❌ **Xóa `verifyDirectiveIntegrity()`:** Không cần cào và kiểm tra thẻ `=== PE-DIRECTIVE ===` hay `=== END ===` tự động nữa vì PE tự soạn bản ghi trên Supabase.
- ❌ **Xóa các bộ tính toán hash chuỗi:** `hashString()`, `baselinePeTextHash`, `omni_bridge_last_forwarded_hash`, `omni_bridge_last_forwarded_in_reply_to`.
- ❌ **Xóa logic auto-forward:** Toàn bộ lệnh gọi `forwardPeResponseToAn(false)` bị xóa vĩnh viễn.

### 4.2. Những phần BẮT BUỘC GIỮ LẠI & TỐI ƯU (Preservation List)
- ✅ **Cấu hình & Kết nối Hub (SSE Client):** Lắng nghe sự kiện `AN_REPORT_DISPATCHED` từ Hub `http://127.0.0.1:3856/api/events`.
- ✅ **React Input Injector (Chiều AN → PE):**
  * Tìm ô chat Perplexity (`textarea` / `contenteditable`).
  * Thực hiện điền văn bản an toàn bằng `Prototype Setter` hoặc `document.execCommand('insertText')` + dispatch events `input`, `change`.
  * Chuông báo hiệu Web Audio API (âm thanh notification nhẹ) khi có báo cáo mới từ AN.
- ✅ **Cơ chế Minh Chủ Giữ Cổng (Dual-Shield Gatekeeper):**
  * Tùy chọn checkbox `[x] Chỉ dán chatbox` (mặc định bật).
  * Nút bấm `🚀 Gửi ngay cho PE (Alt+F9)`.
- ✅ **Nút Cứu Hộ Thủ Công DUY NHẤT (Alt+F10 Rescue Handler):**
  * Hàm `handleManualRescueForward()`: Chỉ chạy khi người dùng bấm nút `⚡ Gửi ngay cho AN (Alt+F10)` trên panel hoặc nhấn phím tắt `Alt+F10`.
  * Đọc khối văn bản được bôi đen (selection) hoặc câu trả lời cuối cùng hiển thị trên màn hình.
  * Hiển thị xác nhận rõ ràng: *"Đang gửi chỉ thị cứu hộ sang Supabase..."* và POST về `/api/directive`.
- ✅ **Giao diện Panel Tinh Gọn (Floating UI):**
  * Nền tối phẳng, nhỏ gọn ở góc màn hình.
  * Hiển thị trạng thái lượt: `LƯỢT PE` (xanh ngọc) / `LƯỢT AN` (vàng cam).
  * 2 nút hành động duy nhất: `[Alt+F9] Gửi PE` và `[Alt+F10] Cứu hộ gửi AN`.

---

## 5. Kế Hoạch Kiểm Thử Tự Động (Test Plan)

Kỹ sư AN sẽ thi công script `scripts/test_bridge_v240_dual_path.py` để kiểm định 5 tiêu chí:

1. **TC1 - Line Count Audit:** Số dòng của `ysdms_pe_bridge.user.js` phải nằm trong khoảng 350 - 600 dòng (giảm > 80% so với 3.732 dòng ban đầu).
2. **TC2 - Zero Auto-Scraping Audit:** Quét regex toàn bộ Userscript đảm bảo không còn bất kỳ lệnh `forwardPeResponseToAn(false)` hoặc timer tự động cào DOM nào.
3. **TC3 - Rescue Action Verification:** Kiểm tra sự hiện diện của listener cho sự kiện click `omni-btn-fwd-an` và hotkey `Alt+F10` gọi đúng hàm cứu hộ thủ công.
4. **TC4 - Input Injection Integrity:** Kiểm tra đầy đủ các phương thức React input setter (`HTMLTextAreaElement.prototype`, `execCommand`, dispatch `InputEvent`).
5. **TC5 - Hub & SSE Compatibility:** Gọi API Hub `/api/status` và `/api/events` đảm bảo Hub hoạt động ổn định và phục vụ Userscript v2.4.0.

---

## 6. Lộ Trình Triển Khai (Execution Timeline)

1. **Pha 1 (Hiện tại):** Đệ trình Implementation Plan này lên Kiến trúc sư trưởng PE và Minh Chủ THOAN để phê duyệt.
2. **Pha 2 (Sau khi PE duyệt):**
   - Viết Userscript v2.4.0 tinh gọn theo đúng đặc tả.
   - Cập nhật banner Hub v2.4.0.
   - Viết và chạy Test Suite `scripts/test_bridge_v240_dual_path.py`.
3. **Pha 3:** Xuất Báo cáo nghiệm thu hoàn thành gửi PE, kèm output kiểm thử thực tế và hướng dẫn Minh Chủ bấm `Tampermonkey -> Check for updates` để áp dụng ngay.
