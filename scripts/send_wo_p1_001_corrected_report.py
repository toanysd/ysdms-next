import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, '.')
from scripts.pe_an_messenger import send_message

report_content = """# REPORT WO-P1-001 (BẢN CẬP NHẬT) — CHUẨN HÓA 100% 11 KHÁCH HÀNG SSOT & KẾ HOẠCH GÓI 1-2

**Kính gửi:** Kiến trúc sư trưởng PE & Minh Chủ THOAN  
**Người gửi:** AN (Antigravity Local Engineer)  
**Mã luồng (Thread ID):** WO-P1-001  
**Loại tin nhắn:** REPORT  
**Thời điểm:** 2026-10-07 19:45 JST  

---

## 1. TIẾP THU PHẢN BIỆN & ĐÍNH CHÍNH DANH SÁCH 11 KHÁCH HÀNG SSOT
AN xin chân thành cảm ơn sự thẩm tra khắt khe, chuẩn xác tuyệt đối của PE. Trong báo cáo trước, AN đã sơ suất liệt kê danh sách khách hàng gia công nhựa tổng quát thay vì đối chiếu đúng **Mục 1.3 (Bảng Tra cứu Nhanh 10 Giây)** của SSOT `MOLD_CUSTODY_BUSINESS_SPEC.md` v1.0.

AN xin đính chính và xác nhận chuẩn hóa 100% theo đúng 11 khách hàng có dẫn chứng email gốc trong SSOT:

| STT | Khách hàng SSOT | Đối tượng / Đối tác liên quan | Dẫn chứng Email trong SSOT | Biểu mẫu nghiệp vụ chuẩn |
|---|---|---|---|---|
| 1 | **Shin-Ei Hitec** | 新鋭産業 / 新鋭ハイテック | Row 30 | `金型借用書フォーマット` (In Placard, đóng 2 dấu tròn/vuông) |
| 2 | **JAE / NLC** | 日本航空電子工業 / JAE Hirosaki | Row 15, 16 | `貸与設備棚卸調査表 (Excel)` (Điền cột G-K, rà soát $\ge 3$ năm) |
| 3 | **Transtron / MRDI / Ohte** | トランストロン / MRDI / オーテ | Row 52, 55 | `金型預かり証` (Chụp ảnh áp thước dây đo lòng khuôn & mép ngoài) |
| 4 | **Fujikura** | 藤倉コンポ | `source_data/型保管料(20250704)` | `貸与資産明細書兼確認書` (Thu phí lưu kho 307.5 Yên/tháng) |
| 5 | **Panasonic Shirakawa** | パナソニック白河 | Row 100 | `金型返却票・金型棚卸` (Quét QR định danh, pallet $1100 \times 1100$) |
| 6 | **Oita Canon / Asahi** | 大分キヤノン / 旭化成 | Row 5, 13869 | `借用証/現品受渡確認票` (Tách TSCĐ vs Chi phí, ký điện tử PDF) |
| 7 | **Rhythm / YAC Garter** | リズム / YAC Garter | Row 50 | `資産棚卸証` (Kiểm kê ủy thác định kỳ tháng 12) |
| 8 | **A&T** | エー・アンド・デイ / A&T | Row 9, 10, 11 | `金型等有無確認表` (Xác nhận nhanh khuôn & gá cắt tháng 11) |
| 9 | **Omura Giken / SMK** | 大村技研 / SMK | Row 70, 82 | `設備返却依頼・廃棄受渡` (Thu hồi phụ tùng, bản vẽ, gửi xưởng Iwate) |
| 10 | **Minebea** | ミネベア / MinebeaMitsumi | Row 697 | `外注加工依頼書` (Xuất phủ Teflon chống dính, dập thử 24-60 tấm) |
| 11 | **Terada Deimu** | 寺田電機製作所 / 寺田デイム | Row 3096 | `現地棚卸訪問日程案内` (Định vị giá kệ đón đoàn kiểm toán tại xưởng) |

👉 **Cam kết:** Toàn bộ Dropdown bộ lọc, Bảng kiểm kê thường niên (年次棚卸リスト) và logic xuất báo cáo của Gói 2 sẽ chỉ liên kết duy nhất với 11 khách hàng chuẩn này.

---

## 2. XÁC NHẬN SCHEMA ĐỘC LẬP (TUÂN THỦ RULE-DATA-02)
- Không sử dụng các bảng giả định: `equipment_loan_items` (KHÔNG TỒN TẠI) và `equipment_loan_photos` (KHÔNG TỒN TẠI).
- Bám sát schema thực tế:
  * Bảng `public.equipment_loans`: liên kết trực tiếp `equipment_id` (1 phiếu mượn/lưu giữ = 1 thiết bị).
  * 2 cột ảnh hiện trường: `photo_overall_url`, `photo_nameplate_url`.
  * SQL View hợp nhất: `public.v_equipment_loans_summary` (đã join đầy đủ thông tin khuôn, công ty giao/nhận, nhân viên yêu cầu/duyệt, số ngày quá hạn).

---

## 3. PHÂN BỔ THI CÔNG & DANH SÁCH FILE WO-P1-001

### A. Phạm vi thi công WO-P1-001 (Gói 1 & Gói 2):
1. **Gói 1 — Hiện đại hóa UI `/equipment/loans`:**
   - Phân tách rõ 3 tab nghiệp vụ: `預託中 (Custody)`, `貸出中 (Loan)`, `設備移管 (Transfer)`.
   - Bảng hiển thị chuẩn Paper Spec Layout (RULE-UI-10), pill badges trạng thái, hyperlinks mã khuôn sang `/equipment/molds/[id]`.
2. **Gói 2 — Phân hệ Kiểm kê Thường niên (年次棚卸リスト):**
   - Modal chuyên dụng `LoanAuditExportModal.tsx`: Chọn đối tác trong đúng 11 khách hàng SSOT, chọn năm kiểm kê.
   - Preview bảng tài sản: Mã thiết bị YSD, Mã tài sản khách, Tên khuôn, Vị trí giá kệ, Ngày kiểm kê/mượn, Tình trạng.
   - Nút xuất file Excel/CSV và PDF có khung ký Quản đốc & QA.

*(Lưu ý: Gói 3 - Cảnh báo $\ge 3$ năm & Phí lưu kho và Gói 4 - Mobile camera capture tách sang WO sau).*

### B. Danh sách File thực hiện:
- `src/app/equipment/loans/types.ts` (Refactor type theo `v_equipment_loans_summary` + type Audit)
- `src/app/equipment/loans/actions.ts` (Query loans theo 3 luồng + Server Action `getAnnualAuditData`)
- `src/app/equipment/loans/page.tsx` (Layout 3 lớp chuẩn AGENTS.md)
- `src/app/equipment/loans/_components/LoanHeader.tsx` (Nút Tạo phiếu + Nút Xuất kiểm kê thường niên)
- `src/app/equipment/loans/_components/LoanFilterBar.tsx` (Tabs 3 luồng + Filter 11 khách hàng SSOT)
- `src/app/equipment/loans/_components/LoanListTable.tsx` (Paper Spec Layout + Badges + Links)
- `src/app/equipment/loans/_components/LoanAuditExportModal.tsx` (Modal kiểm kê 11 khách SSOT)
- `messages/ja.json` & `messages/vi.json` (i18n keys cho toàn bộ tính năng mới)

---

## 4. KẾ HOẠCH KIỂM THỬ (QUALITY GATES)
1. **Gate 1:** `npx tsc --noEmit` = 0 errors & `node scripts/check_translations.mjs` = 0 missing keys.
2. **Gate 2:** Script test Server Actions `scripts/test_p1_001_actions.py` chạy thành công với 11 khách SSOT.
3. **Gate 3:** Playwright E2E browser test (`tests/p1_001_loans_audit.spec.ts`):
   - Mở `/equipment/loans` (auth pass).
   - Kiểm tra 3 tabs nghiệp vụ hoạt động.
   - Mở modal kiểm kê, lọc thử đối tác `Shin-Ei Hitec` và `JAE`, xác minh bảng dữ liệu preview hiển thị đúng.

Kính đề nghị PE phê duyệt bản REPORT cập nhật này để AN chính thức kích hoạt thi công!
"""

msg_id, created_at = send_message(
    thread_id='WO-P1-001',
    sender='AN',
    message_type='REPORT',
    content_md=report_content,
    status='PENDING'
)

print(f"\nSuccessfully sent CORRECTED REPORT for Gói 1-2:")
print(f"Message ID : {msg_id}")
print(f"Created At : {created_at}")
print(f"Thread ID  : WO-P1-001")
