═══════════════════════════════════════════════════════════════
CONTEXT KHỞI ĐẦU THẢO LUẬN — DỰ ÁN ysdms-next
(Bắt buộc paste vào đầu mỗi thảo luận mới với PE)
═══════════════════════════════════════════════════════════════

## 1. THÔNG TIN DỰ ÁN
- Repo GitHub  : https://github.com/toanysd/ysdms-next
- Supabase DB  : https://iirezrszalmecsslbruo.supabase.co
  Project ID   : iirezrszalmecsslbruo (ap-northeast-1)
- Tài liệu SSOT: SCHEMA_REFERENCE.md | PE_AN_COORDINATION_LOG.md
- Coding rules : CLAUDE.md | AGENTS.md | AI_SYSTEM_RULES.md

## 2. VAI TRÒ
- PE (Perplexity) : Nghiệp vụ / Kiến trúc / Review & Phê duyệt
- AN (Antigravity): Triển khai code / DB Migration / Kiểm thử
- Thoan           : Product Owner — cầu nối PE ↔ AN

## 3. TRẠNG THÁI PHASES (cập nhật 2026-08-20)
- Phase R1  : ✅ ĐÃ ĐÓNG (Schema Cleanup)
- Phase R2  : ✅ ĐÃ ĐÓNG (Atomic RPC + Session Guard)
- Phase R3  : ✅ ĐÃ ĐÓNG (Product 360° + Dashboard SX)
- Phase R4  : ✅ ĐÃ ĐÓNG (Báo Giá + Giao Hàng + Tech Debt)
- Phase R5  : 🚀 ĐANG MỞ
  Sprint R5-S1: ✅ ĐÃ NGHIỆM THU (Phân hệ Công Nợ & Thanh Toán, 3 bảng mới: invoices, invoice_lines, invoice_payments + view v_customer_debt_summary)
  Chỉ thị #018: ✅ ĐÃ ĐÓNG (Chờ Chỉ thị #019 mở Sprint R5-S2)

## 4. QUY TẮC PHỐI HỢP BẮT BUỘC

4a. QUY TẮC ĐÁNH SỐ CÂU TRẢ LỜI
  - PE đánh số: [PE — Câu trả lời số N]
  - AN đánh số: [AN — Câu trả lời số N]
  - Số N tiếp nối liên tục xuyên suốt các thảo luận.
  - Câu trả lời tiếp theo của AN bắt đầu từ số 22.
  - AN tự ghi [AN — Câu trả lời số N] ở ĐẦU VÀ CUỐI
    mỗi câu trả lời.

4b. QUY TẮC KHUNG CHỈ THỊ CHO AN
  - Mọi chỉ thị PE gửi AN đều phải nằm trong khung
    kẻ bằng ═══ để Thoan có thể copy nhanh toàn bộ.
  - Khung bắt đầu bằng:
    ═══════════════════════════════════════════════
    CHỈ THỊ #[số] | [TÊN SPRINT]
    Ngày: [ngày] | Từ: PE | Đến: AN
    ═══════════════════════════════════════════════
  - Khung kết thúc bằng dòng
    [AN — Câu trả lời số N+1] ở đầu và cuối
    câu trả lời tiếp theo của AN.
    Thoan mở thảo luận mới với context file
    PE_AN_COORDINATION_LOG.md + nội dung này.
    ═══════════════════════════════════════════════

4c. QUY TẮC XÁC MINH DB
  - PE luôn xác minh trực tiếp Supabase Live DB
    (project iirezrszalmecsslbruo) sau mỗi migration.
  - Không nghiệm thu chính thức nếu chưa verify DB.

4d. KHÔNG VƯỢT SCOPE
  - AN không sửa file nào ngoài danh sách DELIVERABLES.
  - Nếu tsc lỗi sau bất kỳ nhóm nào → DỪNG, báo PE.

4e. QUY TẮC GIỚI HẠN THẢO LUẬN (bổ sung 2026-08-20)
  - Khi thảo luận đạt ~20 lượt, PE tự động nhắc nhở.
  - PE soạn ngữ cảnh chuyển tiếp chuẩn để Thoan copy.
  - Thảo luận mới bắt đầu bằng SESSION_STARTER.md này.

═══════════════════════════════════════════════════════════════

## 5. SỐ THỨ TỰ HIỆN TẠI
- Câu trả lời tiếp theo của PE : số 21
- Câu trả lời tiếp theo của AN : số 22

## 6. VIỆC CẦN LÀM NGAY KHI MỞ THẢO LUẬN MỚI
1. PE verify DB live: kiểm tra 3 bảng (invoices, invoice_lines,
   invoice_payments) và view v_customer_debt_summary tồn tại
   trong project iirezrszalmecsslbruo.
2. Nếu verify pass → PE ra nghiệm thu chính thức R5-S1.
3. Nếu verify fail → PE gửi Chỉ thị sửa cho AN.
