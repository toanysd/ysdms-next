import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scripts.pe_an_messenger as m

content = r"""[Stamp: 2026-10-08 10:35 JST]

# REPORT KẾ HOẠCH CHI TIẾT WO-P1-004 (GÓI 5: HOÀN THIỆN PDF ENGINE / EXPORT PHIẾU MƯỢN & HOÀN TRẢ KHUÔN)

Kính gửi: Kiến trúc sư trưởng PE (Perplexity Pro) và Minh Chủ THOAN
Từ: Kỹ sư thi công AN (Antigravity)
Work Order: WO-P1-004 (Thread: WO-P1-004)
Cấp độ rủi ro: YELLOW (Front-end UI + Server Route PDF render)
Trạng thái: BÁO CÁO KẾ HOẠCH CHI TIẾT (REPORT PLAN)

AN đã tiếp nhận đầy đủ DIRECTIVE WO-P1-004 (Message ID: 198b57de-1f51-44a4-8674-76bc5f34342d) và đệ trình kế hoạch thi công chi tiết trước khi code:

## 1. Cam kết An toàn (Safety Gates) & Nguyên tắc Tuân thủ
- ZERO DDL: Tuyệt đối không can thiệp cấu trúc schema DB, không tạo bảng/cột mới.
- Zero Mock Data: Đọc trực tiếp từ view v_equipment_loans_summary và bảng equipment.
- Quality Gates: TypeScript 0 errors (npx tsc --noEmit), i18n 0 missing keys (check_translations.mjs), Test Suite 100% pass.

## 2. Giải pháp Kiến trúc & Bố cục PDF A4
- Nâng cấp MoldLoanPDFDocument.tsx (@react-pdf/renderer):
  + Layout chuẩn công nghiệp A4: Header thông tin doanh nghiệp, ngày phát hành, mã quản lý, con dấu công ty (〔 社 判 〕, 〔 印 〕).
  + Tiêu đề động 3 luồng: 金型借用書 (兼 預り証) [CUSTOMER_LOAN], 金型返却書 (現品受渡確認票) [RETURN_TO_CUSTOMER], 金型外注加工・修理依頼書 (兼 送付状) [OUTSOURCE_PROCESSING].
  + Lời cam kết trách nhiệm bảo quản tài sản chuẩn mực.
  + Section 1 (Bảng thông số khuôn): Mã khuôn, kích thước, trọng lượng, chủ sở hữu, nơi lưu giữ, hạn trả.
  + Section 2 (Hiện trường thực tế): Nhúng 2 ảnh mobile capture (photo_overall_url + photo_nameplate_url), tỷ lệ contain chuẩn, placeholder rõ nét nếu chưa có ảnh.
  + Section 3 (Khối chữ ký 3 bên): Bên giao (貸出人), Bên nhận (保管者), KCS kiểm tra (検査確認).
  + Hỗ trợ nhãn song ngữ JA/VI tinh tế, thẩm mỹ cao.
- Nâng cấp Route API Server-Side /api/equipment/loans/[id]/pdf/route.ts:
  + Dùng renderToBuffer kết xuất buffer PDF stream.
  + Tải font tiếng Nhật bản địa NotoSansJP-Regular.otf và NotoSansJP-Bold.otf.
  + Mã hóa tên file RFC 5987 tiếng Nhật: 金型預託証書_{loan_code}_{customer}.pdf.
- Trải nghiệm UI trên /equipment/loans/[id]/page.tsx:
  + Nút Xem trước A4 (Preview in tab mới) và Nút Tải về trực tiếp (Download PDF).

## 3. Danh sách Tập tin Thi công (File List)
1. src/components/pdf/MoldLoanPDFDocument.tsx (Nâng cấp layout A4, 2 ảnh mobile, chữ ký 3 bên, song ngữ)
2. src/app/api/equipment/loans/[id]/pdf/route.ts (Tối ưu render buffer, RFC 5987 filename tiếng Nhật)
3. src/app/equipment/loans/[id]/page.tsx (Thêm nút Download/Preview PDF)
4. messages/ja.json & messages/vi.json (Bổ sung đầy đủ nhãn ngôn ngữ xuất PDF)
5. scripts/test_p1_004_pdf_suite.py (Bộ kiểm thử tự động 8 Test Cases)

## 4. Kế hoạch Kiểm thử (Test Plan - 8 Test Cases)
- TC-01: Font tiếng Nhật NotoSansJP-Regular/Bold.otf sẵn có trên máy chủ.
- TC-02: Component MoldLoanPDFDocument.tsx hỗ trợ đủ 3 luồng văn bản (預り証, 返却書, 外注送付状).
- TC-03: Nhúng chính xác 2 slot ảnh (photo_overall_url, photo_nameplate_url).
- TC-04: Khối chữ ký 3 bên và ô đóng dấu社判.
- TC-05: API route /api/equipment/loans/[id]/pdf phản hồi HTTP 200 & MIME application/pdf.
- TC-06: Mã hóa tên tệp tải về RFC 5987 chuẩn tiếng Nhật.
- TC-07: TypeScript check (npx tsc --noEmit) = 0 lỗi.
- TC-08: next-intl translation check (check_translations.mjs) = 0 lỗi.

Kính trình PE xem xét phê duyệt (APPROVAL) kế hoạch để AN tiến hành thi công!"""

msg_id, created = m.send_message(
    thread_id='WO-P1-004',
    sender='AN',
    message_type='REPORT',
    content_md=content
)
print(f"Plan REPORT sent to pe_an_messages! ID: {msg_id}, Created at: {created}")
