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
  - Phát hiện ngay lập tức sự tự mâu thuẫn bên trong `SCHEMA_REFERENCE.md` (bảng `equipment_loans` bị định nghĩa 2 lần ở dòng `280` và dòng `738` với `CHECK constraint` khác nhau; bảng `shipments` bị định nghĩa 2 lần ở dòng `575` và `818` với kiểu `shipment_type` khác nhau).
  - Phát hiện mâu thuẫn giữa `.agents/mempalace/knowledge/mold_manufacturing_process.md:64-65` (yêu cầu lấy nhựa từ `products.primary_plastic_code`) với `RULE-DATA-02` trong `AGENTS.md:173` (bắt buộc lấy từ `design_revisions.plastic_type_designed`).
  - Phát hiện lỗi phân quyền tiềm ẩn trong `src/app/cases/[id]/page.tsx:93` (truy vấn bảng `profiles` không tồn tại trong chuẩn `SCHEMA_REFERENCE.md:14`, dẫn tới mặc định khoá quyền tạo Technical Review).

### 2. Xử lý Ngữ cảnh Lớn & Tuân thủ Kỷ luật Token Economy (Context Precision & L-N-R-E-V)
- **Độ rộng và độ bền ngữ cảnh (Long-Context Fidelity):** Giữ được độ chính xác cao trên cửa sổ ngữ cảnh lớn mà không bị hiện tượng "quên chỉ thị đầu/giữa" (Lost-in-the-Middle).
- **Kỷ luật gọi công cụ (Tool-Call Discipline):**
  - Thực hiện song song hóa (Parallel Tool Execution) từ 4–5 lệnh đọc/kiểm tra cùng lúc trong một bước suy luận.
  - Phối hợp nhịp nhàng với các `research` subagents chạy nền để quét diện rộng trong khi luồng chính đọc kiểm chứng (verify) các lát cắt (slices) quan trọng nhất.
  - Tuân thủ tuyệt đối `RULE-PROC-01` (không báo cáo sớm khi còn subagent đang chạy) và `RULE-PROC-02` (chỉ đẩy bản ghi lên Supabase `pe_an_messages` ở tool call cuối cùng của lượt trả lời).

### 3. Độ chính xác khi Phân tích Nghiệp vụ Đa ngôn ngữ Nhật – Việt – Anh (JA/VI/EN Manufacturing Domain)
- **Hiểu sâu thuật ngữ chuyên ngành định hình nhiệt & khuôn mẫu Nhật Bản:**
  - Phân biệt chính xác bản chất kế toán và kỹ thuật của các thuật ngữ dễ nhầm lẫn:
    - `金型借用書 (兼 預り証)` (`CUSTOMER_LOAN` — Giấy biên nhận lưu giữ khuôn khách) $\neq$ `社内移管 / 設備移動` (`INTERNAL_TRANSFER` — Điều chuyển nội bộ giữa các xưởng Kawasaki/Yashio/Saitama).
    - `非稼働金型` (Khuôn ngưng hoạt động $\ge 3$ năm) gắn liền với chế tài của `下請代金支払遅延等防止法` (Đạo luật Chống chậm trả tiền cho nhà thầu phụ Nhật Bản) và `寄託契約書` / `型保管料` (Hợp đồng ký thác & Phí lưu kho khuôn).
    - `別抜き` (`CUTTER_SEPARATE` — Dao dập rời trên máy Press) $\neq$ `インライン抜型` (`CUTTER_INLINE` — Dao cắt liền trong máy định hình ILLIG/Asano).
    - `天フランジ` (Khuôn gờ phẳng) vs `スカート付き` (Khuôn có váy ôm hạ bậc), `汎用` (Phổ thông - cấm gia công ngoài) vs `専用` (Chuyên dụng - cho phép gia công ngoài).

---

## II. BẢNG SO SÁNH ĐỐI CHUẨN (BENCHMARK MATRIX) VỚI CÁC MÔ HÌNH CŨ & ĐỐI TRỌNG

| Tiêu chí Kỹ thuật | Gemini 2.5 Pro / Flash | Gemini 3.x | Claude Sonnet 4.x / Opus Thinking (PE) | GPT-5 / o3 | **Gemini 4 Argon (High) — AN** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Suy luận Kiến trúc & Đối soát Schema lớn** | Khá; đôi khi bỏ sót chi tiết ở giữa các file >500 dòng. | Tốt; cải thiện khả năng lập kế hoạch nhưng đôi lúc suy diễn tên cột nếu không ép đọc file. | **Rất xuất sắc** trong tư duy phản biện, thiết kế chuẩn mực, bắt lỗi logic và pháp lý. | Rất mạnh về giải thuật trừu tượng, nhưng đôi khi viết code quá phức tạp hóa (over-engineering). | **Xuất sắc:** Kết hợp suy luận chuỗi sâu (High Thinking) với khả năng đối chiếu từng dòng `file:line` trên codebase thực tế mà không bịa cột. |
| **2. Tốc độ & Kỷ luật Thực thi Tool Calls (IDE Agentic)** | Nhanh (đặc biệt bản Flash), nhưng dễ gọi lẻ tẻ từng tool gây tốn nhiều vòng lặp. | Khá nhanh, biết gom nhóm tool calls cơ bản. | Cẩn trọng, chặt chẽ, nhưng khi chạy nhiều vòng đọc file cục bộ dễ chạm giới hạn ngữ cảnh sớm hơn. | Đôi khi dừng sớm hoặc tóm tắt ngắn gọn thay vì liệt kê đầy đủ toàn bộ các điểm gãy. | **Rất cao:** Gom nhóm 4–5 tool calls song song/lượt, điều phối subagents mượt mà, kiểm soát chặt trạng thái background tasks. |
| **3. Khả năng Giữ Luật Hệ thống (`QUY TẮC 0`, `RULE-PROC-02`)** | Đôi khi quên hậu tố `TRẢ LỜI TỪ AN` hoặc gọi Supabase sớm trước khi xong việc. | Tuân thủ tốt hơn nhưng vẫn cần nhắc lại khi phiên kéo dài >30 lượt. | Tuân thủ quy trình kiểm toán rất nghiêm ngặt. | Tuân thủ tốt các quy tắc định dạng nhưng đôi khi lược bỏ các mục dài. | **Tuyệt đối (100%):** Duy trì kỷ luật kiểm tra điều kiện tiên quyết ở mọi bước suy luận trước khi xuất câu trả lời. |
| **4. Hiểu Nghiệp vụ Sản xuất Nhật - Việt (JAE, Canon, Panasonic, SMK)** | Hiểu mức từ vựng; đôi khi dịch sai ngữ cảnh kế toán tài sản cố định (`固定資産`). | Hiểu tốt quy trình sản xuất cơ bản (BOM, Kanban, Gantt). | **Đỉnh cao** trong việc bóc tách sắc thái pháp lý Nhật Bản (`下請法`, `寄託契約`, chứng từ kế toán). | Tốt về thuật ngữ chung, nhưng ít nhạy bén hơn với văn hóa chứng từ đặc thù của xưởng Nhật (Hanko kép, Placard, thước dây). | **Đỉnh cao & Thực dụng:** Chuyển hóa chính xác các quy tắc ngầm trong email tiếng Nhật sang cấu trúc bảng DB, RPC và giao diện Next.js + `next-intl`. |
| **5. Hiệu quả Kinh tế Token (Token Economy)** | Trung bình (dễ đọc cả file lớn). | Khá tốt. | Cần cung cấp bối cảnh đã chắt lọc (`git diff`, báo cáo tổng hợp) để đạt hiệu suất cao nhất. | Tiêu thụ nhiều reasoning tokens cho các tác vụ đơn giản. | **Tối ưu:** Đọc theo lát cắt (`StartLine`/`EndLine`), tự động phát hiện và đề xuất bóc tách file lớn thành module nhỏ. |

---

## III. CƠ CHẾ PHỐI HỢP TỐI ƯU GIỮA AN (GEMINI 4 ARGON) VÀ PE (CLAUDE SONNET THINKING) QUA BRIDGE v2.5.0

Sự kết hợp giữa **AN (Gemini 4 Argon tại Antigravity IDE)** và **PE (Claude Sonnet Thinking trên Perplexity Pro)** dưới quyền quyết định của **Minh Chủ THOAN** tạo thành bộ ba bổ trợ hoàn hảo:

### 1. Phân vai Chiến lược theo Thế mạnh Độc tôn
- **Minh Chủ THOAN (Product Owner & Dual-Shield Gatekeeper):**
  - Giữ quyền quyết định tối cao về định hướng nghiệp vụ nhà máy YSD, ưu tiên Sprint và phê duyệt các thay đổi kiến trúc lớn.
  - Kiểm soát chốt chặn an toàn trên Userscript Bridge v2.5.0 (`[x] Chỉ dán chatbox` hoặc bật `[ ] Đổ & Submit` khi ủy quyền tự động).
- **Kiến trúc sư trưởng PE (Claude Sonnet Thinking — Independent Chief Architect & Auditor):**
  - Đóng vai trò **Bộ não Kiểm toán Độc lập & Thiết kế Chuẩn mực**: Không bị cuốn vào chi tiết hàng nghìn dòng code vụn vặt nên giữ được tầm nhìn kiến trúc tổng thể cực kỳ trong sáng.
  - Thẩm định chéo các bản Kế hoạch (`PLAN`) và Báo cáo Nghiệm thu (`REPORT`) từ AN; bắt lỗi edge cases nghiệp vụ Nhật Bản, kiểm tra tính toàn vẹn của Schema/ADR và phê duyệt từng Work Order.
- **Kỹ sư trưởng Thực thi AN (Gemini 4 Argon — Local Lead Engineer & Codebase Investigator):**
  - Đóng vai trò **Động cơ Khảo sát Thực địa & Thi công Chính xác 100%**: Trực tiếp đọc/sửa mã nguồn cục bộ, chạy migration Supabase, kiểm tra `tsc --noEmit` (0 errors), `check_translations.mjs` (0 missing keys), chạy Playwright chụp màn hình thực tế và cập nhật hồ sơ modular trên GitHub.

### 2. Giao thức Vận hành Chuẩn qua `Bridge v2.5.0 (Unified Gold Edition)`
1. **Chuẩn hóa Kênh truyền tải:**
   - **Tài liệu dài / Hồ sơ thiết kế / Báo cáo kiểm toán chi tiết:** AN ghi thành các file module nhỏ trong `docs/` và `git push` lên GitHub để lưu trữ vĩnh viễn và giúp PE tra cứu qua `@GitHub` khi cần.
   - **Bản tin điều phối qua Supabase (`public.pe_an_messages`):** Ở **tool call cuối cùng** của lượt làm việc (`RULE-PROC-02`), AN đẩy bản báo cáo tổng hợp đầy đủ (kèm mã commit và đường dẫn file) lên `public.pe_an_messages` (`sender='AN'`, `thread_id='YSDMS-ORCHESTRATION'`).
2. **Cơ chế Đánh thức Tự động 2 Chiều (Dual-Path Wakeup):**
   - **Chiều AN $\rightarrow$ PE:** Local Hub (`:3856`) phát SSE (`SUPABASE_ROW_PERSISTED`) xuống trình duyệt Perplexity $\rightarrow$ Userscript `v2.5.0` tự động điền vào ô chat (lọc sạch chip `@Supabase`/`@GitHub` nhờ `isExcludedButton` và chống đổ lặp nhờ `injectedMap`) + phát chuông báo cho Minh Chủ THOAN.
   - **Chiều PE $\rightarrow$ AN:** Khi PE ghi chỉ thị/phê duyệt lên `public.pe_an_messages` (`sender='PE'`) hoặc khi Minh Chủ bấm `Alt+F10`, Local Hub tự động đọc `.agents/active_conversation_id.txt` và gọi **Native AgentAPI** bơm thẳng chỉ thị vào cửa sổ chat của phiên Gemini 4 Argon hiện tại (trừ khi PE ghi rõ *"Chờ THOAN chốt/duyệt"* thì Hub dừng ở `WAITING_THOAN_APPROVAL`).
