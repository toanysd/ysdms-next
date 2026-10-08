import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scripts.pe_an_messenger as m

content = r"""[Stamp: 2026-10-08 10:00 JST]
AN REPORT HOÀN TẤT THI CÔNG & KIỂM THỬ WO-P1-003 (GÓI 4: CHỤP ẢNH HIỆN TRƯỜNG MOBILE, THƯỚC ĐO & BIỂN TÊN THỰC KIỂM)

Kính gửi: Kiến trúc sư trưởng PE (Perplexity Pro)
Từ: Kỹ sư thi công AN (Antigravity)
Work Order: WO-P1-003 (Thread: WO-P1-003)
Trạng thái: COMPLETED / READY FOR PE ACCEPTANCE REVIEW
Phân loại rủi ro: YELLOW (Zero DDL)
Git Commit Code: 1dc312b509ef4986348cb56667a5b3a3cceebf7e
Git Commit Docs: 27434b281f6eb2aa86f8aebf0ec689c1784ca1f2
Remote: origin/main (Đã push) & Mirror USB G:\ (Đã đồng bộ)
Artifact ID: 3dec1f27-d57a-41a7-b441-5f5327c7147f

1. CÁC HẠNG MỤC ĐÃ BÀN GIAO:
- LoanPhotoCaptureSection.tsx: 2 slot ảnh chuẩn J-SOX (Ảnh tổng thể kèm thước đo tỷ lệ + Cận cảnh biển tên/khắc chữ), gọi trực tiếp camera sau thiết bị qua capture="environment", accept="image/*", hiển thị hướng dẫn chụp ảnh hiện trường, modal xem phóng to ảnh, đổi/xóa ảnh.
- PlacardModal.tsx: Biển tên thực kiểm tài sản cố định kích thước A4 chuẩn công nghiệp (【 金型保管・現品実査票 】), tự động trích xuất mã khuôn, tên sản phẩm, mã phiếu mượn/lưu kho, chủ sở hữu tài sản (khách hàng), đơn vị lưu giữ Yoshida, ngày chụp. Có nút in nhanh A4 (window.print()) và chế độ tablet toàn màn hình.
- [id]/page.tsx: Tích hợp khối chụp ảnh và biển tên trực tiếp vào trang chi tiết phiếu lưu giữ.
- actions.ts: Bổ sung uploadLoanPhoto (tải lên bucket equipment-photos, cập nhật an toàn photo_overall_url / photo_nameplate_url vào DB) và deleteLoanPhoto.
- MoldLoanPDFDocument.tsx: Khung hiển thị 2 ảnh trong văn bản PDF A4 xuất cho khách hàng đã sẵn sàng.
- messages/ja.json & messages/vi.json: Đầy đủ 100% key đa ngữ.

2. KẾT QUẢ KIỂM THỬ:
- Suite chuyên dụng test_p1_003_photo_suite.py: 8/8 PASSED (100%).
- Hồi quy test_p1_001_loans_suite.py: 8/8 PASSED.
- Hồi quy test_p1_002_dormant_suite.py: 3/3 PASSED.
- Quality Gates: npx tsc --noEmit (0 errors), check_translations.mjs (0 missing keys).

3. CÂU LỆNH SQL ĐỂ PE TRUY VẤN TRỰC TIẾP:
SELECT content_md FROM public.pe_review_artifacts WHERE artifact_id = '3dec1f27-d57a-41a7-b441-5f5327c7147f';

AN kính đề nghị PE thẩm định độc lập và ban hành APPROVAL nghiệm thu cho WO-P1-003."""

msg_id, created = m.send_message(
    thread_id='WO-P1-003',
    sender='AN',
    message_type='REPORT',
    content_md=content
)
print(f"Message sent successfully! ID: {msg_id}, Created at: {created}")
