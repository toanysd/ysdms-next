# BÁO CÁO KẾ HOẠCH & NGHIỆM THU THI CÔNG: WO-P1-008
## GÓI 9: TÍCH HỢP CON DẤU ĐIỆN TỬ YSD (電子社判: 丸印・角印) LÊN CHỨNG TỪ PDF CHO OITA CANON & SHIN-EI HITEC

- **Thời gian lập:** 2026-10-08 17:50 JST
- **Người thực hiện:** Kỹ sư thi công AN (Antigravity)
- **Người thẩm định:** Kiến trúc sư trưởng PE & Minh Chủ THOAN
- **Chỉ thị tham chiếu:** DIRECTIVE WO-P1-008 (`bafcd4dd-663f-4ef1-bbe2-d9f97a2d847b`)
- **Phê duyệt kế hoạch:** APPROVAL WO-P1-008 (`1c2207e7-dbcc-45f2-a9e4-c6f1c9237f8d`)
- **Phạm vi an toàn:** YELLOW Scope (Zero DDL, Zero unintended production writes)

---

## 1. Mục Tiêu & Cơ Sở Nghiệp Vụ SSOT

Căn cứ theo `docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` v1.0 (mục 4.2 & mục 5 - Gói 9):
Các khách hàng lớn như **Oita Canon** (Đại diện: Asahi / Takimoto) và **Shin-Ei Hitec** (Đại diện: Nozawa) yêu cầu phiếu mượn tài sản khuôn (`金型借用書`) và bàn giao hoàn trả (`金型返却票`) phải có đóng dấu hợp thức:
1. **丸印 (Maruin - Dấu tròn / 代表者印):** Con dấu tròn đại diện pháp luật đường kính ~38-40px, viền kép (`borderWidth: 1.2 / 0.8`), màu đỏ chu sa (`#DC2626`), khắc chức danh `代表取締役之印` và tên công ty `株式会社ヨシダPKG`.
2. **角印 (Kakuin - Dấu vuông / 社印):** Con dấu vuông 40x40px, viền đơn (`borderWidth: 1.4`), khắc theo chuẩn truyền thống Nhật Bản 3 cột dọc từ phải qua trái: Cột 1 `株式会社`, Cột 2 `吉田金型`, Cột 3 `工業之印`.
3. **Quy trình ký điện tử (`電子社判`):** Cho phép đối soát trước bằng file PDF có gắn dấu điện tử để gửi email duyệt nhanh, hoặc tùy chọn bỏ dấu để in bản giấy đóng mộc đỏ vật lý gửi bưu điện.

---

## 2. Danh Mục Tệp Đã Triển Khai (File List)

1. `src/components/pdf/ElectronicSeal.tsx` (Mới):
   - Định nghĩa kiểu `ElectronicSealType = 'NONE' | 'MARUIN' | 'KAKUIN' | 'BOTH'`.
   - Cung cấp component vector thuần React-PDF: `<MaruinSeal />` và `<KakuinSeal />` sử dụng font chuẩn Nhật `NotoSansJP` và màu đỏ chu sa `#DC2626`.
2. `src/components/pdf/MoldLoanPDFDocument.tsx` (Cập nhật):
   - Bổ sung prop `electronicSeal?: ElectronicSealType` (mặc định `'BOTH'`).
   - Tích hợp render `<MaruinSeal />` (vào ô 代表取締役) và `<KakuinSeal />` (vào ô 管理責任者 / 社印) trong khối `sealBoxContainer` góc phải trên/dưới đơn vị phát hành.
   - Mở rộng chiều cao `sealBox` (52px) để con dấu hiển thị trọn vẹn, sắc nét.
3. `src/app/api/equipment/loans/[id]/pdf/route.ts` (Cập nhật):
   - Đọc query param `?seal=both|maruin|kakuin|none`.
   - Chuyển tiếp cấu hình dấu sang `MoldLoanPDFDocument`.
4. `src/app/equipment/loans/[id]/_components/LoanPdfDownloadButton.tsx` (Mới):
   - Dropdown chọn 4 chế độ con dấu điện tử YSD kèm badge trạng thái `電子社判適用中`.
   - Nút In chứng từ trực tiếp (`帳票印刷 (PDF)`) và Tải về (`PDFダウンロード`).
5. `src/app/equipment/loans/[id]/page.tsx` (Cập nhật):
   - Thay thế các nút PDF tĩnh bằng component tương tác `LoanPdfDownloadButton`.
6. `messages/ja.json` & `messages/vi.json` (Cập nhật):
   - Bổ sung cụm dịch ngữ `Loans.detail.sealSelector` cho cả tiếng Nhật và tiếng Việt.
7. `scripts/test_p1_008_electronic_seal.py` (Mới):
   - Bộ kiểm thử tự động 6 Test Cases.
8. `scripts/verify_p1_008_browser.mjs` (Mới):
   - Kịch bản Playwright Browser Verification tự động chụp màn hình UI.

---

## 3. Kết Quả Kiểm Thử Toàn Diện (Quality Gates)

### 3.1. TypeScript Health
- Lệnh: `npx tsc --noEmit`
- Kết quả: **0 errors ✅**

### 3.2. Đa Ngôn Ngữ (i18n)
- Lệnh: `node scripts/check_translations.mjs`
- Kết quả: **0 missing keys ✅** (Tất cả keys `sealSelector` đã đồng bộ hoàn hảo ja/vi).

### 3.3. Test Suite Tự Động (`scripts/test_p1_008_electronic_seal.py`)
- **TC-01: Electronic Seal Component Rendering:** PASS ✅ (MaruinSeal & KakuinSeal đúng quy cách)
- **TC-02: PDF Integration:** PASS ✅ (MoldLoanPDFDocument & API route nhận prop seal)
- **TC-03: UI Toggle Button:** PASS ✅ (LoanPdfDownloadButton tích hợp vào trang chi tiết)
- **TC-04: Zero DDL Compliance:** PASS ✅ (0 migration mới)
- **TC-05: i18n Symmetry:** PASS ✅ (100% đối xứng song ngữ)
- **TC-06: TypeScript Health:** PASS ✅ (0 compile errors)
- **Tổng kết:** **6/6 PASSED (100% PASS ✅)**

### 3.4. Kiểm Thử API & Render PDF Thực Tế
- `seal=both`: HTTP 200 | Size: 108,511 bytes (Đủ 2 dấu 丸印 + 角印)
- `seal=maruin`: HTTP 200 | Size: 107,675 bytes (Chỉ dấu tròn)
- `seal=kakuin`: HTTP 200 | Size: 105,887 bytes (Chỉ dấu vuông)
- `seal=none`: HTTP 200 | Size: 104,756 bytes (Để trống đóng mộc tay)
- File lưu kiểm chứng: `docs/reports/wo_p1_008_mold_loan_sample.pdf`

### 3.5. Playwright Browser Verification
- Script: `scripts/verify_p1_008_browser.mjs`
- Kết quả: **ALL CHECKS PASSED ✅**
- Ảnh chụp màn hình: `docs/reports/screenshots/wo_p1_008_electronic_seal_ui.png` (Hiển thị trọn vẹn dropdown chọn con dấu và nút xuất chứng từ).
