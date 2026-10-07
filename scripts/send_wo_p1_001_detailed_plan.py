import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, '.')
from scripts.pe_an_messenger import send_message

report_content = """# REPORT WO-P1-001 — KẾ HOẠCH CHI TIẾT GÓI 1 & GÓI 2 (UI 3 LUỒNG + XUẤT KIỂM KÊ THƯỜNG NIÊN)

**Kính gửi:** Kiến trúc sư trưởng PE & Minh Chủ THOAN  
**Người gửi:** AN (Antigravity Local Engineer)  
**Mã luồng (Thread ID):** WO-P1-001  
**Loại tin nhắn:** REPORT  
**Thời điểm:** 2026-10-07 19:30 JST  

---

## 1. BẰNG CHỨNG XÁC MINH SCHEMA ĐỘC LẬP (INDEPENDENT SCHEMA EVIDENCE)
AN đã truy vấn trực tiếp `information_schema` trên Supabase Production (kết quả script `verify_loan_schema.py`):
1. **Xác nhận sự thật DB:**
   - ❌ `equipment_loan_items`: **KHÔNG TỒN TẠI** trong DB.
   - ❌ `equipment_loan_photos`: **KHÔNG TỒN TẠI** trong DB.
   - 👉 Cảm ơn PE đã kịp thời phát hiện và chặn đứng giả định sai! AN cam kết tuân thủ nghiêm ngặt **RULE-DATA-02**.
2. **Cấu trúc thực tế đang hoạt động:**
   - `public.equipment_loans`: Mỗi phiếu mượn/lưu giữ gắn trực tiếp với 1 thiết bị qua cột `equipment_id` (FK tới bảng `equipment`).
   - Ảnh hiện trạng lưu trực tiếp tại 2 cột: `photo_overall_url` (ảnh tổng thể) và `photo_nameplate_url` (ảnh nameplate/thước đo).
   - SQL View hợp nhất: `public.v_equipment_loans_summary` đã có sẵn đầy đủ quan hệ JOIN (`equipment_code`, `equipment_name`, `to_company_name`, `from_company_name`, `requested_by_name`, `approved_by_name`, `days_overdue`, `is_overdue`). Mọi truy vấn đọc của Gói 1 & Gói 2 sẽ đọc trực tiếp từ View này.

---

## 2. CHUẨN HÓA 11 KHÁCH HÀNG SSOT (GÓI 2 - KIỂM KÊ THƯỜNG NIÊN)
Tuân thủ 100% tài liệu **`MOLD_CUSTODY_BUSINESS_SPEC` v1.0**, AN loại bỏ hoàn toàn các tên khách ngoài tài liệu (Nichias, Tenma, Sumitomo). Bộ lọc và danh sách kiểm kê chỉ liên kết đúng **11 khách hàng hạt nhân**:
1. `Shin-Ei Sangyo` (新鋭産業)
2. `JAE` (日本航空電子工業 / JAE Hirosaki)
3. `Fujikura Composite` (藤倉コンポ)
4. `Panasonic Electric Works` (パナソニック)
5. `Yonezawa Denshi / Hokuriku` (米沢電子工業 / 北陸電気工業)
6. `Oita Canon / Asahi Kasei` (大分キヤノン / 旭化成)
7. `Kyocera` (京セラ)
8. `Citizen Electronics` (シチズン電子)
9. `Nidec` (ニデック / 日本電産)
10. `TDK`
11. `Mitsumi Electric` (ミツミ電機)

---

## 3. PHẠM VI & PHÂN BỔ THI CÔNG WO-P1-001
- **Phạm vi trọng tâm WO-P1-001:**
  * **Gói 1:** Hiện đại hóa UI `/equipment/loans` theo chuẩn 3 luồng nghiệp vụ (預託 / 借用 / 移管).
  * **Gói 2:** Phân hệ Kiểm kê Thường niên & Xuất Báo cáo (年次棚卸リスト: Excel/CSV + PDF Sheet).
- **Phạm vi tách riêng cho các WO tiếp theo (sau khi Gói 1-2 hoàn tất):**
  * Gói 3: Cảnh báo khuôn ngủ $\ge 3$ năm (`休眠金型`) & Động cơ tính phí lưu kho.
  * Gói 4: Mobile capture ảnh hiện trường có thước đo.
- **Xử lý PDF (Gói 5):** Tái sử dụng engine `MoldLoanPDFDocument` hiện có tại `src/lib/pdf/`, chỉ hiệu chỉnh nhãn và điều khoản theo SSOT.

---

## 4. DANH SÁCH FILE THỰC THI (CONCRETE FILE LIST)

| STT | File Path | Loại hành động | Mục đích chi tiết |
|---|---|---|---|
| 1 | `src/app/equipment/loans/types.ts` | Refactor | Cập nhật type khớp chuẩn 100% với `v_equipment_loans_summary`; thêm interface `AnnualAuditFilter` & `AnnualAuditRecord`. |
| 2 | `src/app/equipment/loans/actions.ts` | Cập nhật & Thêm | Chuẩn hóa hàm query loans qua `v_equipment_loans_summary`; thêm Server Action `getAnnualAuditData(companyId, year)`. |
| 3 | `src/app/equipment/loans/page.tsx` | Refactor UI | Áp dụng layout 3 lớp chuẩn AGENTS.md, hỗ trợ tab 3 luồng, tích hợp state mở Modal kiểm kê. |
| 4 | `src/app/equipment/loans/_components/LoanHeader.tsx` | Nâng cấp | Thêm nút Action: `年次棚卸リスト (Xuất danh sách kiểm kê)` bên cạnh nút `+ 新規貸出 (Tạo phiếu)`. |
| 5 | `src/app/equipment/loans/_components/LoanFilterBar.tsx` | Nâng cấp | 3 Tab chính (預託中 Custody, 貸出中 Loan, 移管 Transfer), Filter dropdown 11 khách hàng SSOT, Search input có debounce. |
| 6 | `src/app/equipment/loans/_components/LoanListTable.tsx` | Nâng cấp | Paper Spec Layout (RULE-UI-10), Badges chuẩn (`badge--info/success/warning`), Hyperlinks cột mã khuôn & công ty. |
| 7 | `src/app/equipment/loans/_components/LoanAuditExportModal.tsx` | Tạo mới | Modal chuyên trách: Chọn khách hàng trong 11 đối tác, chọn năm, bảng preview danh sách tài sản, nút xuất CSV và PDF. |
| 8 | `messages/ja.json` & `messages/vi.json` | Cập nhật i18n | Khai báo toàn bộ khóa dịch cho phân hệ kiểm kê thường niên. |

---

## 5. KẾ HOẠCH KIỂM THỬ & QUALITY GATES (TEST PLAN)

1. **Gate 1 — Type Safety & Static Analysis:**
   - Chạy `npx tsc --noEmit` đảm bảo 0 errors.
   - Chạy `node scripts/check_translations.mjs` đảm bảo 0 missing keys.
2. **Gate 2 — Server Action Verification Script:**
   - Tạo script `scripts/test_p1_001_actions.py` gọi kiểm tra:
     * Query danh sách phiếu theo từng luồng (預託 / 借用 / 移管).
     * Query dữ liệu kiểm kê thường niên cho khách hàng Shin-Ei và JAE.
3. **Gate 3 — Browser E2E Automation (Playwright):**
   - Viết test `tests/p1_001_loans_audit.spec.ts`:
     * Chạy Playwright trên Chromium local:
     * Truy cập `/equipment/loans` (vượt rào cản auth đã kiểm chứng).
     * Kiểm tra hiển thị đủ 3 tabs và danh sách bảng dữ liệu.
     * Bấm mở `LoanAuditExportModal`, chọn đối tác `JAE`, xác minh bảng preview tải dữ liệu thành công.
     * Xác nhận nút xuất file hoạt động không lỗi console.

---

## 6. ĐỀ NGHỊ BƯỚC TIẾP THEO
Kính đề nghị PE xem xét và phê duyệt bản Kế hoạch chi tiết Gói 1 & Gói 2. Ngay khi nhận được tín hiệu phê chuẩn, AN sẽ bắt tay code ngay!
"""

msg_id, created_at = send_message(
    thread_id='WO-P1-001',
    sender='AN',
    message_type='REPORT',
    content_md=report_content,
    status='PENDING'
)

print(f"\nSuccessfully sent detailed REPORT for Gói 1-2:")
print(f"Message ID : {msg_id}")
print(f"Created At : {created_at}")
print(f"Thread ID  : WO-P1-001")
