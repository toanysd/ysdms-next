# TÀI LIỆU BÀN GIAO BỐI CẢNH & CHỈ THỊ KHỞI ĐỘNG PHIÊN MỚI (GEMINI 4 ARGON + BRIDGE v2.5.0)

- **Mã tài liệu:** `HANDOFF-GEMINI4-ARGON-20261014`
- **Thời gian bàn giao:** `2026-10-14 09:42 JST`
- **Phiên nguồn (Old Conversation ID):** `ea29e76a-2997-4bd1-8861-33849f2d98f8`
- **Mô hình thực thi ở phiên mới:** **Gemini 4 Argon**
- **Hệ thống Cầu nối điều phối:** **YSDMS Realtime Bridge v2.5.0 (Unified Gold Edition)** — Cổng `3856`

---

## I. BỐI CẢNH HIỆN TẠI & TRẠNG THÁI HỆ THỐNG TRƯỚC KHI CHUYỂN PHIÊN

### 1. Trạng thái Cầu nối Realtime Bridge v2.5.0 (Unified Gold Edition)
- **Local Hub (`tools/realtime-bridge/ysdms_realtime_hub.cjs`):**
  - Đang chạy nền (Online) tại địa chỉ `http://127.0.0.1:3856`.
  - Hỗ trợ kiến trúc **Dual-Path**:
    - **Chiều AN $\rightarrow$ PE:** Khi AN hoàn tất công việc và đẩy bản ghi (`sender='AN'`) vào bảng `public.pe_an_messages` trên Supabase ở **tool call cuối cùng** (`RULE-PROC-02`), Hub phát sự kiện SSE (`SUPABASE_ROW_PERSISTED` / `AN_REPORT_PERSISTED`) xuống trình duyệt Perplexity.
    - **Chiều PE $\rightarrow$ AN:** Khi PE ghi trực tiếp bản ghi (`sender='PE'`) vào bảng `public.pe_an_messages` qua `@Supabase` MCP (hoặc khi Minh Chủ THOAN bấm nút `📥 Cứu hộ: Bắn PE sang AN (Alt+F10)`), Hub tự động kiểm tra:
      - Nếu PE ghi *"Chờ THOAN chốt / duyệt"* $\rightarrow$ Hub phát trạng thái `WAITING_THOAN_APPROVAL` chờ Minh Chủ quyết định.
      - Nếu là chỉ thị / thẩm định kỹ thuật cho AN $\rightarrow$ Hub gọi **Native AgentAPI** (`language_server.exe agentapi send-message`) bơm thẳng vào khung chat của Antigravity IDE theo ID lưu tại `.agents/active_conversation_id.txt`.
- **Userscript (`tools/realtime-bridge/ysdms_pe_bridge.user.js` v2.5.0):**
  - Giao diện **Light Theme**, kéo thả tự do (**Draggable**), thu gọn thành viên thuốc (**Mini Pill**), có ngăn kéo **`👁️ Xem tin (SSOT Feed)`**.
  - Tách biệt rõ 2 chế độ: `[x] Chỉ dán chatbox` (mặc định an toàn — Dual-Shield Gatekeeper) và `[ ] Đổ & Submit (1.8s)`.
  - Đã tích hợp bộ lọc `stripConnectorTokens` và `isExcludedButton` chống kẹt/bấm nhầm vào chip `@Supabase`, `@GitHub` và bộ khóa `injectedMap` / `submittedMap` chống đổ lặp hoặc báo trạng thái ảo.

> ⚠️ **THAO TÁC BẮT BUỘC SỐ 0 KHI BẮT ĐẦU PHIÊN THẢO LUẬN MỚI:**
> Ngay ở lượt đầu tiên của phiên thảo luận mới, AN **PHẢI** ghi `<conversation-id>` của phiên mới vào tệp:
> `d:\AntiGravity_Workspace\apps\ysdms-nextgen\.agents\active_conversation_id.txt`
> để Local Hub `:3856` bơm lệnh Native AgentAPI vào đúng cửa sổ chat của phiên mới!

---

### 2. Tiến độ Nghiệp vụ & Kỹ thuật Đã Triển Khai Tính Đến `2026-10-14`
1. **Kiến trúc Dữ liệu Cốt lõi (Database & SSOT):**
   - Hợp nhất bảng thiết bị vật lý về **`equipment`** (`ADR-001`, `ADR-004` — không dùng `physical_molds`, `cutters`, `mold_masters` cho code mới).
   - Mô hình **Work Order / Job Option C** (`ADR-002`, `ADR-003`, `ADR-010`, `ADR-014`).
   - Tuân thủ nghiêm ngặt `RULE-DATA-01` (Không fallback dữ liệu kỹ thuật / không regex parse text runtime) và `RULE-DATA-02` (Schema Compliance tuyệt đối theo `SCHEMA_REFERENCE.md`).
2. **Chuỗi 11 Gói Công Việc Quản Trị & Lưu Giữ Khuôn (Mold Custody Phase 1 — `WO-P1-001` $\rightarrow$ `WO-P1-010`):**
   - Đã hoàn thành thi công từ `WO-P1-001` đến `WO-P1-010` (mới nhất là `WO-P1-010`: Hoàn trả khuôn trên Pallet chuẩn Nhật $1,100 \times 1,100$ mm & Quét QR định danh tại Panasonic Shirakawa, commit `55c4fea` / `84e5591` trên `origin/main`).
   - Toàn bộ chứng từ bàn giao/mượn/trả/gia công ngoài đã tích hợp con dấu điện tử kép của YSD (`丸印` + `角印` — `WO-P1-008`), biểu mẫu Excel kiểm kê JAE/NLC (`WO-P1-007`), phiếu đặt gia công Teflon/Xi mạ Minebea (`WO-P1-009`).

---

## II. BẢN ĐỒ TÀI LIỆU CỐT LÕI CẦN ĐỌC TRONG PHIÊN MỚI (SSOT DOCUMENT MAP)

Để phục vụ việc rà soát toàn diện dự án mà không lãng phí token (tuân thủ `token-economy`), phiên mới cần tập trung đối chiếu các nhóm hồ sơ sau:

### Nhóm 1 — Quy tắc Hệ thống & Kiến trúc Cầu nối
1. `AGENTS.md` và `.agents/AGENTS.md` — Quy tắc bắt buộc (`QUY TẮC 0`, `RULE-DATA-01`, `RULE-DATA-02`, `RULE-PROC-01`, `RULE-PROC-02`).
2. `SCHEMA_REFERENCE.md` — Nguồn sự thật duy nhất về cấu trúc bảng, cột và khóa ngoại Supabase.
3. `docs/realtime-bridge/BRIDGE_COMPREHENSIVE_AUDIT_AND_SPEC.md` — Đặc tả hoạt động của Bridge `v2.5.0`.

### Nhóm 2 — Nghiệp vụ Thực tế Rút ra từ Email (`toanysdmail`) & Phòng Khuôn / Thiết Bị
1. `docs/mail_analysis/00_BUSINESS_INSIGHTS.md` & `docs/mail_analysis/01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md` — Toàn bộ luồng nghiệp vụ thực tế được bóc tách từ lịch sử email giao dịch thật của YSD với khách hàng và nhà cung cấp.
2. `docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` — Đặc tả nghiệp vụ quản lý, mượn trả, lưu kho, kiểm kê, gia công ngoài và thanh lý khuôn/dao cắt.
3. `d:\AntiGravity_Workspace\.agents\mempalace\knowledge\mold_manufacturing_process.md` — Quy trình thiết kế và gia công chế tạo khuôn thực tế tại xưởng.
4. `d:\AntiGravity_Workspace\.agents\mempalace\knowledge\thermoforming_equipment_set.md` — Cấu trúc bộ thiết bị gá lắp đồng bộ (SET: Khuôn `MOLD`, Dao cắt `CUTTER`, Đế nước `WATER_BASE`, Đế khí `PRESSURE_BASE`, Khung `FRAME`, `STACKING`, `PLUG`).
5. `d:\AntiGravity_Workspace\.agents\mempalace\knowledge\architecture_work_order_model_v1.md` & `d:\AntiGravity_Workspace\.agents\mempalace\knowledge\business_rules.md` — Quy tắc đơn hàng, lệnh sản xuất (Job/WO) và luồng trạng thái.
6. `docs/quotations/01_MOLD_PRICING_STANDARD.md` & `docs/quotations/02_TRAY_PRICING_CALCULATION_FORMULA.md` — Công thức tính giá khuôn và khay nhựa.

### Nhóm 3 — Hồ sơ Kế hoạch Đã Lập & Kiến trúc Hiện tại
1. `docs/00_PROJECT_CHARTER.md`, `docs/01_BRD.md`, `docs/02_BUSINESS_PROCESS.md`, `docs/02_BUSINESS_PROCESS_CATALOG.md`.
2. `docs/Phase1_MoldCutter_Migration_Plan.md` & `docs/Phase2_ERP_Realignment_Plan.md`.
3. `docs/PROJECT_STATUS.md`, `docs/TECH_DEBT.md`, `docs/adr/README.md` (`ADR-001` $\rightarrow$ `ADR-014`).
4. Cây thư mục mã nguồn thực tế tại `src/app/` và `src/components/layout/Sidebar.tsx`.

---

## III. NHIỆM VỤ TRỌNG TÂM CỦA AN (MÔ HÌNH GEMINI 4 ARGON) TRONG PHIÊN THẢO LUẬN MỚI

Theo chỉ thị của **Minh Chủ THOAN**, phiên thảo luận mới phải thực hiện bài bản **4 nhiệm vụ lớn** theo thứ tự sau và phối hợp qua **Bridge v2.5.0** với **Kiến trúc sư trưởng PE**:

### Nhiệm vụ 1: Đánh giá Mô hình Mới `Gemini 4 Argon` & So sánh Đối chuẩn
- Phân tích năng lực cốt lõi của mô hình **Gemini 4 Argon** (khả năng suy luận kiến trúc sâu, độ rộng cửa sổ ngữ cảnh, tốc độ xử lý tool calls, độ chính xác khi đọc hiểu tài liệu nghiệp vụ đa ngôn ngữ Nhật - Việt - Anh, khả năng tuân thủ kỷ luật kỹ thuật).
- So sánh trực tiếp với:
  1. Các thế hệ Gemini trước đây (Gemini 2.5 Pro / Flash, Gemini 3.x).
  2. Các mô hình đối trọng tương đương trong hệ sinh thái (Claude Sonnet 4.x / Opus 4.x Thinking của PE, GPT-5 / o3).
- Xác lập cách phân công tối ưu giữa **AN (Gemini 4 Argon)** và **PE (Claude Sonnet Thinking)** thông qua **Bridge v2.5.0**.

### Nhiệm vụ 2: Rà soát Toàn diện Nghiệp vụ Thực tế (Đặc biệt từ Email Thực tế & Phòng Khuôn/Thiết Bị)
- Đọc và tổng hợp toàn bộ luồng nghiệp vụ thực tế từ:
  - Hồ sơ phân tích email thực tế (`docs/mail_analysis/00_BUSINESS_INSIGHTS.md`, `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md`, `MOLD_CUSTODY_BUSINESS_SPEC.md`).
  - Nghiệp vụ thực tế tại **Phòng Khuôn & Thiết Bị** (Từ khâu tiếp nhận yêu cầu/bản vẽ $\rightarrow$ Báo giá khuôn/khay $\rightarrow$ Thiết kế `design_revisions` $\rightarrow$ Đặt gia công phôi/chế tạo khuôn & bộ SET thiết bị $\rightarrow$ Dập thử mẫu `成形テスト` $\rightarrow$ Gửi mẫu chờ KH duyệt $\rightarrow$ Sản xuất hàng loạt $\rightarrow$ Lưu kho/Gá lắp/Bảo trì/Sửa chữa/Cải tạo khuôn $\rightarrow$ Gia công bề mặt Teflon/Xi mạ $\rightarrow$ Kiểm kê định kỳ `棚卸` & Mượn trả khuôn `借用書・返却`).

### Nhiệm vụ 3: Đối chiếu 3 Chiều (Nghiệp vụ Thực tế $\leftrightarrow$ Kế hoạch Đã Lập $\leftrightarrow$ Mã nguồn & Giao diện Hiện tại)
- Đối chiếu trực tiếp với cấu trúc database (`SCHEMA_REFERENCE.md`), cây route (`src/app/`), menu điều hướng (`Sidebar.tsx`) và giao diện các trang hiện có trong hệ thống `ysdms-nextgen` để chỉ ra rõ ràng:
  1. **Các điểm chưa phù hợp trong kế hoạch cũ:** Những chỗ thiết kế hoặc kế hoạch trước đây hiểu sai/lệch so với luồng vận hành thực tế của nhà máy YSD.
  2. **Các nội dung còn thiếu so với kế hoạch & logic nghiệp vụ:** Những bước đứt gãy giữa các phân hệ (VD: từ Sự việc `cases` $\rightarrow$ Báo giá `quotations` $\rightarrow$ Thiết kế `design_revisions` $\rightarrow$ Chế tạo/Mua sắm `equipment` $\rightarrow$ Chỉ thị sản xuất `jobs` $\rightarrow$ Nhật ký `worklog` $\rightarrow$ Giao hàng `shipments` $\rightarrow$ Vòng đời/Lưu giữ khuôn `equipment/loans`, `lifecycle`).
  3. **Các vấn đề về cấu trúc dữ liệu & UI/UX hiện tại:** Các trang còn dùng bảng cũ deprecated (`mold_masters`, `physical_molds`, `cutters`), các trang mồ côi chưa gắn vào luồng liên thông, hoặc hiển thị chưa đúng chuẩn.

### Nhiệm vụ 4: Lập Kế hoạch Tái cấu trúc Hồ sơ Dự án & Lộ trình Triển khai Tiếp theo
- Đề xuất **Kế hoạch viết lại bộ Kế hoạch tổng thể (Master Plan) và Hồ sơ Kỹ thuật/Nghiệp vụ của dự án** cho khớp 100% với thực tế vận hành.
- Đóng gói toàn bộ báo cáo phân tích và bản kế hoạch đề xuất gửi qua **Bridge v2.5.0** (ở tool call cuối cùng) để **Kiến trúc sư trưởng PE** thẩm định chéo và **Minh Chủ THOAN** phê duyệt trước khi bắt tay vào viết code các đề mục tiếp theo.
