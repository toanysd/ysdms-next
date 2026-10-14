# 🤖 NHIỆM VỤ 1: ĐÁNH GIÁ MÔ HÌNH GEMINI 4 ARGON, SO SÁNH ĐỐI CHUẨN & GIAO THỨC PHỐI HỢP AN-PE QUA BRIDGE v2.5.0

- **Mã tài liệu:** `YSDMS-MPV2-01-MODEL-BENCHMARK`
- **Ngày lập:** `2026-10-14 JST`
- **Mô hình tự kiểm toán & thực thi:** **Gemini 4 Argon (High)**

---

## I. ĐÁNH GIÁ CHI TIẾT NĂNG LỰC VẬN HÀNH CỦA MÔ HÌNH `GEMINI 4 ARGON`

Qua thực chiến trực tiếp trên kho mã nguồn và hồ sơ dự án `ysdms-nextgen` (quy mô >120 routes, 875 dòng schema, 10,427 luồng email thực tế đa ngôn ngữ Nhật - Việt - Anh), mô hình **Gemini 4 Argon (High)** thể hiện 5 đặc tính kỹ thuật cốt lõi sau:

### 1. Khả năng Suy luận Kiến trúc Sâu & Phát hiện Mâu thuẫn Chéo (Cross-Document Conflict Detection)
- **Điểm mạnh vượt trội:** Gemini 4 Argon không chỉ đọc văn bản theo nghĩa đen mà tự động xây dựng đồ thị quan hệ thực thể (Entity-Relationship Graph) trong bộ nhớ suy luận.
- **Bằng chứng thực tế ngay trong phiên này:**
   - Phát hiện sự trùng lặp bên trong `SCHEMA_REFERENCE.md` (bảng `equipment_loans` xuất hiện 2 lần ở dòng `280` và dòng `738` với `CHECK constraint` khác nhau; bảng `shipments` xuất hiện 2 lần ở dòng `575` và `818` với kiểu `shipment_type` khác nhau).
   - Phát hiện mâu thuẫn giữa `.agents/mempalace/knowledge/mold_manufacturing_process.md:64-65` (lấy nhựa từ `products.primary_plastic_code`) với `RULE-DATA-02` trong `AGENTS.md` (lấy từ `design_revisions.plastic_type_designed`).
   - Bài học rút ra qua kiểm toán độc lập của PE: Không được kết luận một bảng tồn tại hay không chỉ dựa vào tài liệu `SCHEMA_REFERENCE.md` (ví dụ bảng `profiles` và `auxiliary_equipments` thực tế **TỒN TẠI** trong `information_schema.tables`, còn `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master` **KHÔNG TỒN TẠI**). Mọi khẳng định về schema bắt buộc phải kèm kết quả truy vấn `information_schema` thực tế.

### 2. Xử lý Ngữ cảnh Lớn & Tuân thủ Kỷ luật Token Economy (Context Precision & L-N-R-E-V)
- **Kỷ luật gọi công cụ (Tool-Call Discipline):**
  - Thực hiện song song hóa (Parallel Tool Execution) các lệnh đọc/kiểm tra độc lập trong một bước suy luận.
  - Phối hợp với các `research` subagents chạy nền để quét diện rộng trong khi luồng chính đọc kiểm chứng (verify) các lát cắt (slices) quan trọng.
  - Tuân thủ `RULE-PROC-01` (không báo cáo sớm khi còn subagent đang chạy), `RULE-PROC-02` (chỉ đẩy bản ghi lên Supabase `pe_an_messages` ở tool call cuối cùng của lượt trả lời) và giới hạn **Compact Bridge Payload ($\le 150$ dòng)**.

### 3. Phân tích Nghiệp vụ Đa ngôn ngữ Nhật – Việt – Anh (JA/VI/EN Manufacturing Domain)
- **Thuật ngữ chuyên ngành định hình nhiệt & khuôn mẫu Nhật Bản:**
  - Phân biệt bản chất kế toán và kỹ thuật của các thuật ngữ:
    - `金型借用書 (兼 預り証)` (`CUSTOMER_LOAN` — Giấy biên nhận lưu giữ khuôn khách) $\neq$ `社内移管 / 設備移動` (`INTERNAL_TRANSFER` — Điều chuyển nội bộ giữa các xưởng Kawasaki/Yashio/Saitama).
    - `非稼働金型` (Khuôn ngưng hoạt động $\ge 3$ năm) gắn liền với chế tài của `下請代金支払遅延等防止法` (Đạo luật Chống chậm trả tiền cho nhà thầu phụ Nhật Bản) và `寄託契約書` / `型保管料` (Hợp đồng ký thác & Phí lưu kho khuôn).
    - `別抜き` (`CUTTER_SEPARATE` — Dao dập rời trên máy Press) $\neq$ `インライン抜型` (`CUTTER_INLINE` — Dao cắt liền trong máy định hình ILLIG/Asano).
    - `天フランジ` (Khuôn gờ phẳng) vs `スカート付き` (Khuôn có váy ôm hạ bậc), `汎用` (Phổ thông - cấm gia công ngoài) vs `専用` (Chuyên dụng - cho phép gia công ngoài).

---

## II. PHÂN VAI PHỐI HỢP GIỮA AN (GEMINI 4 ARGON) VÀ PE (CLAUDE SONNET THINKING) QUA BRIDGE v2.5.0

*(Ghi chú: Đã lược bỏ bảng tự đánh giá chủ quan chưa có số đo thực nghiệm theo yêu cầu kiểm toán của PE).*

### 1. Phân vai theo Trách nhiệm trong Quy trình PE – THOAN – AN
- **Minh Chủ THOAN (Product Owner & Dual-Shield Gatekeeper):**
  - Giữ quyền quyết định về định hướng nghiệp vụ nhà máy YSD, ưu tiên Sprint và phê duyệt các thay đổi kiến trúc/dữ liệu.
  - Kiểm soát chốt chặn an toàn trên Userscript Bridge v2.5.0 (`[x] Chỉ dán chatbox`).
- **Kiến trúc sư trưởng PE (Claude Sonnet Thinking — Independent Chief Architect & Auditor):**
  - Thực hiện kiểm toán độc lập (Adversarial Audit) đối với mọi bản Kế hoạch (`PLAN`), câu lệnh SQL và Báo cáo Nghiệm thu (`REPORT`) từ AN; đối chứng trực tiếp trên GitHub (`get_commit`) và Supabase Production; giữ quyền đề xuất đóng phiên và trình phương án lên Minh Chủ THOAN.
- **Kỹ sư Thực thi AN (Gemini 4 Argon — Local Engineer):**
  - Khảo sát mã nguồn cục bộ kèm bằng chứng `file:line`, chạy truy vấn chỉ-đọc `information_schema` kèm `NOW()`, thi công đúng phạm vi Work Order đã duyệt, kiểm tra `tsc --noEmit`, `check_translations.mjs`, Playwright và báo cáo Compact ($\le 150$ dòng).

### 2. Giao thức Vận hành Chuẩn qua `Bridge v2.5.0 (Unified Gold Edition)`
1. **Chuẩn hóa Kênh truyền tải:**
   - **Tài liệu dài / Hồ sơ thiết kế / Báo cáo kiểm toán chi tiết:** AN ghi thành các file module nhỏ trong `docs/` và `git push` lên GitHub để lưu trữ vĩnh viễn và giúp PE tra cứu qua `@GitHub` khi cần.
   - **Bản tin điều phối qua Supabase (`public.pe_an_messages`):** Ở **tool call cuối cùng** của lượt làm việc (`RULE-PROC-02`), AN đẩy bản báo cáo tổng hợp đầy đủ (kèm mã commit và đường dẫn file) lên `public.pe_an_messages` (`sender='AN'`, `thread_id='YSDMS-ORCHESTRATION'`).
2. **Cơ chế Đánh thức Tự động 2 Chiều (Dual-Path Wakeup):**
   - **Chiều AN $\rightarrow$ PE:** Local Hub (`:3856`) phát SSE (`SUPABASE_ROW_PERSISTED`) xuống trình duyệt Perplexity $\rightarrow$ Userscript `v2.5.0` tự động điền vào ô chat (lọc sạch chip `@Supabase`/`@GitHub` nhờ `isExcludedButton` và chống đổ lặp nhờ `injectedMap`) + phát chuông báo cho Minh Chủ THOAN.
   - **Chiều PE $\rightarrow$ AN:** Khi PE ghi chỉ thị/phê duyệt lên `public.pe_an_messages` (`sender='PE'`) hoặc khi Minh Chủ bấm `Alt+F10`, Local Hub tự động đọc `.agents/active_conversation_id.txt` và gọi **Native AgentAPI** bơm thẳng chỉ thị vào cửa sổ chat của phiên Gemini 4 Argon hiện tại (trừ khi PE ghi rõ *"Chờ THOAN chốt/duyệt"* thì Hub dừng ở `WAITING_THOAN_APPROVAL`).
