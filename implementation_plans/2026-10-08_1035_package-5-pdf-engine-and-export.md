# Implementation Plan - WO-P1-004 (Gói 5: Hoàn thiện PDF Engine / Export Phiếu Mượn & Hoàn Trả Khuôn)

**Mã lệnh công tác:** `WO-P1-004` | **Thread:** `WO-P1-004` | **Cấp độ rủi ro:** `YELLOW` (Front-end UI + Server Route PDF render)  
**Tài liệu SSOT:** `docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` (Chủ đề 5)  
**Thời gian lập:** 2026-10-08 10:35 JST  

---

## 1. Mục tiêu & Cam kết An toàn (Safety Gates)

- **Mục tiêu:** Hoàn thiện PDF Engine chuẩn công nghiệp A4 cho 3 luồng biên bản mượn/lưu giữ/hoàn trả khuôn (`CUSTOMER_LOAN`, `RETURN_TO_CUSTOMER`, `OUTSOURCE_PROCESSING`), tích hợp ảnh thực tế hiện trường từ mobile capture (Gói 4), hiển thị bố cục chuẩn kiểm toán J-SOX (con dấu, chữ ký 3 bên, mã QR/Barcode).
- **Cam kết sắt (Safety Gates):**
  - **ZERO DDL:** Tuyệt đối không can thiệp schema DB, không tạo bảng hay cột mới.
  - **Zero Mock / Zero Fake Data:** Đọc trực tiếp từ view `v_equipment_loans_summary` và bảng `equipment`.
  - **Quality Gates:** `npx tsc --noEmit` = 0 errors, `check_translations.mjs` = 0 missing keys, Test Suite 100% pass.

---

## 2. Kiến trúc Kỹ thuật & Bố cục PDF A4

### 2.1. Nâng cấp `MoldLoanPDFDocument.tsx` (`@react-pdf/renderer`)
1. **Bố cục Chuẩn Công nghiệp A4 (Industrial Layout):**
   - Header: Thông tin Đơn vị tiếp nhận (`客先企業 御中`) & Đơn vị phát hành (`株式会社ヨシダパッケージ`).
   - Khối con dấu công ty (`〔 社 判 〕`, `〔 印 〕`).
   - Tiêu đề văn bản động theo 3 luồng:
     * `CUSTOMER_LOAN`: **金型借用書 (兼 預り証)** / *MOLD CUSTODY & LOAN CERTIFICATE*
     * `RETURN_TO_CUSTOMER`: **金型返却書 (現品受渡確認票)** / *MOLD RETURN & DELIVERY CONFIRMATION SLIP*
     * `OUTSOURCE_PROCESSING`: **金型外注加工・修理依頼書 (兼 送付状)** / *OUTSOURCE MACHINING DISPATCH SLIP*
   - Lời cam kết trách nhiệm bảo quản tài sản (Pledge Statement).
2. **Bảng Thông số Kỹ thuật Khuôn (Tooling Specs):**
   - Mã khuôn, Tên khuôn/sản phẩm, Kích thước ngoài ($L \times W \times H$), Trọng lượng, Khách hàng sở hữu, Nơi bảo quản, Hạn trả dự kiến.
3. **Mục 2: Hiện trường Thực tế — Tích hợp 2 Ảnh Mobile Capture (J-SOX Evidence):**
   - Ảnh ①: Toàn cảnh có thước đo tỉ lệ (`全体写真・スケール付` / `photo_overall_url`).
   - Ảnh ②: Cận cảnh biển tên / khắc chữ kim loại (`銘板・刻印・看板` / `photo_nameplate_url`).
   - Khung hình co giãn tỉ lệ chuẩn (`objectFit: 'contain'`), kèm thông báo placeholder rõ nét nếu chưa có ảnh.
4. **Khối Chữ ký & Phê duyệt (Approval & Signature Blocks):**
   - 3 khối ký rõ ràng: Bên giao (`貸出人 / Bên giao`), Bên nhận (`保管者 / Bên nhận`), Kiểm tra KCS (`検査確認 / KCS`).
5. **Đa ngữ JA / VI (Bilingual Support):**
   - Tiêu đề mục và nhãn thông số được trình bày song ngữ Nhật - Việt tinh tế, vừa đáp ứng kiểm toán Nhật Bản vừa minh bạch cho quản đốc hiện trường Việt Nam.

### 2.2. Nâng cấp Tuyến API Server-Side `/api/equipment/loans/[id]/pdf/route.ts`
- Sử dụng `@react-pdf/renderer` hàm `renderToBuffer`.
- Load font tiếng Nhật bản địa `NotoSansJP-Regular.otf` và `NotoSansJP-Bold.otf`.
- Định dạng tên file xuất chuẩn:
  * URL Encoded RFC 5987 để trình duyệt tải về đúng tên tiếng Nhật: `金型預託証書_${loan_code}_${customer}.pdf`.
  * Header HTTP: `Content-Type: application/pdf`, `Content-Disposition: inline; filename="..."`.

### 2.3. Trải nghiệm Người dùng trên Trang Chi tiết (`/equipment/loans/[id]/page.tsx`)
- Bổ sung cụm nút tác vụ chuyên biệt trên TopBar:
  * Nút **In / Xem trước A4 (Preview)**: Mở PDF trực tiếp trong tab mới để in ấn ngay.
  * Nút **Tải về PDF (Download)**: Tải trực tiếp file `.pdf` về máy tính.

---

## 3. Danh sách Tập tin Thi công (File List)

| STT | Tập tin | Thao tác | Mô tả |
|---|---|---|---|
| 1 | `src/components/pdf/MoldLoanPDFDocument.tsx` | Chỉnh sửa | Nâng cấp layout chuẩn công nghiệp, 2 slot ảnh mobile, khối chữ ký 3 bên, nhãn song ngữ JA/VI |
| 2 | `src/app/api/equipment/loans/[id]/pdf/route.ts` | Chỉnh sửa | Tối ưu hóa renderToBuffer, RFC 5987 filename tiếng Nhật, error handling |
| 3 | `src/app/equipment/loans/[id]/page.tsx` | Chỉnh sửa | Thêm nút Export/Download PDF chuyên nghiệp bên cạnh nút xem trước |
| 4 | `messages/ja.json` & `messages/vi.json` | Chỉnh sửa | Bổ sung đầy đủ nhãn ngôn ngữ cho tính năng xuất PDF |
| 5 | `scripts/test_p1_004_pdf_suite.py` | Tạo mới | Bộ kiểm thử tự động toàn diện 8 Test Cases cho PDF Engine |

---

## 4. Kế hoạch Kiểm thử Tự động (Test Plan - 8 Test Cases)

1. **TC-01:** Kiểm tra tệp font tiếng Nhật `NotoSansJP-Regular.otf` & `NotoSansJP-Bold.otf` sẵn có trên máy chủ.
2. **TC-02:** Kiểm tra component `MoldLoanPDFDocument.tsx` đầy đủ 3 loại văn bản (預り証, 返却書, 外注送付状).
3. **TC-03:** Kiểm tra 2 slot ảnh (`photo_overall_url`, `photo_nameplate_url`) được nhúng chính xác vào Section 2 của PDF.
4. **TC-04:** Kiểm tra khối chữ ký 3 bên (Bên giao, Bên nhận, KCS kiểm tra) và ô đóng dấu社判.
5. **TC-05:** Kiểm tra API route `/api/equipment/loans/[id]/pdf` phản hồi HTTP 200 và MIME `application/pdf`.
6. **TC-06:** Kiểm tra mã hóa tên tệp tải về RFC 5987 chuẩn tiếng Nhật không lỗi font.
7. **TC-07:** Kiểm thử biên dịch TypeScript (`npx tsc --noEmit`) = 0 lỗi.
8. **TC-08:** Kiểm thử đa ngữ i18n (`check_translations.mjs`) = 0 khóa thiếu.

---

## 5. Trình tự Triển khai (Execution Steps)

1. Gửi REPORT Kế hoạch qua Bridge Table `pe_an_messages` (Thread: `WO-P1-004`).
2. Tinh chỉnh `MoldLoanPDFDocument.tsx` và `route.ts`.
3. Tích hợp UI download/print trên `[id]/page.tsx`.
4. Cập nhật `messages/ja.json` & `messages/vi.json`.
5. Chạy `scripts/test_p1_004_pdf_suite.py` đạt 8/8 PASSED.
6. Chạy Playwright kiểm tra route API trả về PDF buffer hợp lệ.
7. Commit, push `origin/main`, mirror USB `G:`, và gửi REPORT hoàn tất cho PE nghiệm thu.
