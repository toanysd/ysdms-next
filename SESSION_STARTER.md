═══════════════════════════════════════════════════════════════
CONTEXT KHỞI ĐẦU THẢO LUẬN — DỰ ÁN ysdms-next
(Bắt buộc paste vào đầu mỗi thảo luận mới với PE)
═══════════════════════════════════════════════════════════════

## 1. THÔNG TIN DỰ ÁN
- Repo GitHub  : https://github.com/toanysd/ysdms-next
- Supabase DB  : https://iirezrszalmecsslbruo.supabase.co
  Project ID   : iirezrszalmecsslbruo (ap-northeast-1, Tokyo)
- Tài liệu SSOT: SCHEMA_REFERENCE.md | PE_AN_COORDINATION_LOG.md
- Coding rules : CLAUDE.md | AGENTS.md | AI_SYSTEM_RULES.md

## 2. VAI TRÒ
- PE (Perplexity) : Trưởng dự án / Kiến trúc / Review & Phê duyệt
- AN (Antigravity): Kỹ sư triển khai / DB Migration / Kiểm thử E2E
- Thoan           : Product Owner — Cầu nối điều phối PE ↔ AN

## 3. TRẠNG THÁI CÁC PHASES (Cập nhật 2026-08-20)
- Phase R1  : ✅ ĐÃ ĐÓNG (Schema Truth Alignment & Cleanup)
- Phase R2  : ✅ ĐÃ ĐÓNG (Atomic RPC + Session Guard Trigger)
- Phase R3  : ✅ ĐÃ ĐÓNG (Product 360° View + Dashboard Sản Xuất)
- Phase R4  : ✅ ĐÃ ĐÓNG (Báo Giá 見積書 + Giao Hàng 納品書 + Refactor Unified Equipment SSOT)
- Phase R5  : 🚀 ĐANG MỞ (Công Nợ, Thanh Toán, Dashboard & E2E)
  - Sprint R5-S1: ✅ ĐÃ NGHIỆM THU (Phân hệ Công Nợ, Hóa Đơn & View `v_customer_debt_summary`)
  - Sprint R5-S2: ✅ ĐÃ NGHIỆM THU (E2E Testing Khép Kín Vòng Đời Order-to-Cash 6/6 cases)
  - Sprint R5-S3: ✅ ĐÃ NGHIỆM THU (Executive Dashboard 2 Tầng: Sản Xuất Live DB & Thương Mại/Công Nợ + 3 SQL Views Server-side)
  - Chỉ thị #018, #019, #020, #021, #022, #023: ✅ ĐÃ ĐÓNG HOÀN TOÀN.

## 4. GHI CHÚ BACKLOG & PHÁT HIỆN KỸ THUẬT
- **Backlog 1 (Dữ liệu tiến độ Jobs):** Cột `jobs.overall_progress` = 0 trên toàn bộ 2,197 bản ghi lịch sử — cần bổ sung trigger/logic cập nhật tiến độ khi `job_status` chuyển sang `COMPLETED`, hoặc điều chỉnh nghiệp vụ.
- **Backlog 2 (Dữ liệu thương mại lịch sử):** Toàn bộ bảng `orders`, `quotations`, `invoices` đang có 0 bản ghi do là phân hệ mới. Dữ liệu lịch sử phân tán trong các file Excel/PDF tại `source_data/納品書_注文/` (SMK, JAE, KYD, IRI, MCT, NLC, SJI) — sẵn sàng cho kế hoạch migration/import dữ liệu thật.

## 5. QUY TẮC PHỐI HỢP BẮT BUỘC

4a. QUY TẮC ĐÁNH SỐ CÂU TRẢ LỜI
  - PE đánh số: [PE — Câu trả lời số N]
  - AN đánh số: [AN — Câu trả lời số N]
  - Số N tiếp nối liên tục xuyên suốt các thảo luận.
  - AN tự ghi [AN — Câu trả lời số N] ở ĐẦU VÀ CUỐI mỗi câu trả lời.

4b. QUY TẮC KHUNG CHỈ THỊ CHO AN
  - Mọi chỉ thị PE gửi AN đều phải nằm trong khung kẻ bằng ═══ để Thoan có thể copy nhanh toàn bộ.

4c. QUY TẮC XÁC MINH DB
  - PE luôn xác minh trực tiếp Supabase Live DB (project `iirezrszalmecsslbruo`) sau mỗi migration/deliverable.
  - Không nghiệm thu chính thức nếu chưa verify DB.

4d. QUY TẮC MINH BẠCH NGUỒN TÀI LIỆU
  - Trích dẫn tài liệu nội bộ trên máy local cần ghi chú rõ `[LOCAL — chưa commit]`.

4e. QUY TẮC GIỚI HẠN THẢO LUẬN
  - Khi thảo luận đạt ~20 lượt, PE/AN tự động nhắc nhở và tạo ngữ cảnh chuyển tiếp chuẩn để mở thảo luận mới.

═══════════════════════════════════════════════════════════════

## 6. SỐ THỨ TỰ CHO THẢO LUẬN MỚI
- Câu trả lời tiếp theo của PE : **số 37 (hoặc số 38)**
- Câu trả lời tiếp theo của AN : **số 38**

## 7. ĐỊNH HƯỚNG MỞ ĐẦU THẢO LUẬN MỚI
1. Mở đầu bằng `SESSION_STARTER.md` này để nạp đầy đủ context chuẩn.
2. PE & anh Thoan định hướng nhiệm vụ tiếp theo của Phase R5 (Kế hoạch Import dữ liệu đơn hàng lịch sử hoặc Mở Sprint R5-S4 / R6).
