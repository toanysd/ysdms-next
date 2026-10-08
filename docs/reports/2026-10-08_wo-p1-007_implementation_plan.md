# Implementation Plan: WO-P1-007 (Gói 8 — Xuất Dữ Liệu Kiểm Kê Form Excel Khảo Sát Cột G/H/I/J/K JAE / NLC)

## 1. Thông Tin Chung & Bối Cảnh
- **Mã Work Order:** `WO-P1-007`
- **Mã Chỉ thị gốc:** `8468ddd9-fe4d-43cb-879e-e8733c060b7a` (Thread: `WO-P1-007`)
- **Phân loại rủi ro:** 🟡 **YELLOW** (Thêm endpoint xuất Excel, Modal chọn bộ lọc, không DDL mới, không ghi đè dữ liệu production)
- **Mục tiêu:** Xây dựng tính năng xuất dữ liệu kiểm kê Form Excel khảo sát Cột G/H/I/J/K (**貸与設備棚卸調査表**) cho các đối tác tập đoàn Nhật Bản (tiêu biểu: JAE, NLC, Canon, Panasonic, SMK), theo SSOT `MOLD_CUSTODY_BUSINESS_SPEC v1.0` (Chủ đề 2).
- **Ràng buộc:**
  - ❌ KHÔNG tạo migration DDL mới (sử dụng 100% schema hiện có của `equipment`, `companies`, `racks`, `rack_layers`, `equipment_loans`).
  - ❌ KHÔNG ghi đè dữ liệu production (chỉ đọc dữ liệu và sinh file Excel tạm thời qua stream).
  - ❌ KHÔNG tự động click submit Perplexity (THOAN giữ quyền duyệt cuối).

---

## 2. Phân Tích Nghiệp Vụ SSOT (Khảo Sát Kiểm Kê Tài Sản Ký Thác - JAE / NLC)

Căn cứ theo `docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` (Chủ đề 2: Chiến dịch Kiểm kê Tài sản Cố định Hàng năm):
1. **Bối cảnh Kế toán & Pháp lý:**
   - Hàng năm từ Tháng 10 đến Tháng 2, các tập đoàn sản xuất Nhật Bản (JAE, NLC, Canon, Rhythm) gửi file khảo sát `貸与設備棚卸調査表 (Excel)` yêu cầu nhà xưởng YSD xác nhận hiện trạng các bộ khuôn đang lưu ký.
2. **Cấu trúc 11 Cột Chuẩn Mẫu Khảo Sát:**
   - **Cột A - No. (STT):** Đánh số thứ tự dòng.
   - **Cột B - 客先資産番号 (Mã tài sản cố định khách):** Lấy từ `equipment.custom_attributes->>'customer_asset_no'` hoặc `equipment.equipment_code`.
   - **Cột C - 設備名称・金型名 (Tên thiết bị / khuôn):** `equipment.equipment_name`.
   - **Cột D - YSD管理番号 (Mã quản lý nội bộ YSD):** `equipment.equipment_code` (hoặc `products.product_code`).
   - **Cột E - 品名・製品型番 (Tên sản phẩm / quy cách):** Lấy từ sản phẩm liên kết (`products.product_name` / `product_name_internal`).
   - **Cột F - 数量 (Số lượng bộ):** Mặc định `1` bộ (`台`).
   - **Cột G - 貸出書の有無 (Giấy mượn / Biên nhận có hiệu lực):** Điền `○` (Có) nếu tồn tại bản ghi `equipment_loans` đang có hiệu lực (`ACTIVE` / `DISPATCHED`), ngược lại điền `×` (Không).
   - **Cột H - 金型の有無 (Hiện vật thực tế tại xưởng):** Điền `○` (Có) nếu thiết bị đang ở kho YSD (`equipment.device_status = 'AVAILABLE'` hoặc có vị trí kệ), ngược lại `×`.
   - **Cột I - 保管場所 (Vị trí lưu kho):** Nhà máy + Tên kệ / Vị trí tầng (Ví dụ: `川崎本社工場 [A1-02]` hoặc `八潮工場 [B-01]`).
   - **Cột J - 稼働状況 (Tình trạng hoạt động):** `稼働` (Đang hoạt động) hoặc `非稼働 (3年以上休止)` (nếu không phát sinh đơn hàng $\ge 3$ năm).
   - **Cột K - 最終使用日・今後の見通し (Ngày sử dụng gần nhất & Kế hoạch tương lai):** Lấy ngày đơn hàng/chỉ thị gần nhất, kèm ghi chú dự kiến tiếp tục sử dụng hay chờ thu hồi.

---

## 3. Danh Mục File Triển Khai (File List)

| STT | File Path | Loại | Mục đích & Trách nhiệm |
|---|---|---|---|
| 1 | `src/app/api/equipment/molds/export-survey/route.ts` | Server Route | API Endpoint sử dụng `exceljs` để truy vấn dữ liệu thiết bị, build bảng tính chuẩn Nhật Bản (header xanh navy, borders, formatting Cột G/H/I/J/K), stream về file `.xlsx`. |
| 2 | `src/app/equipment/molds/_components/InventorySurveyExportModal.tsx` | Client Component | Modal cho phép người dùng chọn phạm vi xuất: Tất cả (`ALL`), theo Khách hàng cụ thể (`BY_CUSTOMER`, hỗ trợ chọn JAE, NLC, Panasonic...), hoặc theo Vị trí lưu kho (`BY_LOCATION`). |
| 3 | `src/app/equipment/molds/page.tsx` | Client Page | Thêm nút "Xuất Excel kiểm kê" (`貸与設備棚卸調査表`) trên thanh công cụ FilterBar, mở modal xuất Excel. |
| 4 | `messages/ja.json` & `messages/vi.json` | i18n | Bổ sung các nhãn song ngữ cho Modal xuất Excel và các cột khảo sát kiểm kê (Zero hardcode). |
| 5 | `scripts/test_p1_007_excel_survey.py` | Test Suite | Bộ test tự động kiểm thử endpoint xuất Excel, tính toàn vẹn các cột G/H/I/J/K, bộ lọc khách hàng, TypeScript 0 errors, i18n 0 missing keys. |
| 6 | `docs/reports/2026-10-08_wo-p1-007_implementation_plan.md` | Tài liệu | Hồ sơ kế hoạch kỹ thuật lưu trữ vào git repository. |

---

## 4. Kế Hoạch Kiểm Thử (Test Plan)

| Test Case | Mục tiêu kiểm tra | Phương pháp thực hiện | Tiêu chí đạt |
|---|---|---|---|
| **TC-01** | Export Endpoint Execution | Gọi GET `/api/equipment/molds/export-survey` với các param | Trả về HTTP 200, Content-Type là `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, file size > 5KB. |
| **TC-02** | Validation 11 Cột & Cột G/H/I/J/K | Phân tích workbook sinh ra bằng `exceljs` | Tiêu đề cột đúng chuẩn: G (`貸出書の有無`), H (`金型の有無`), I (`保管場所`), J (`稼働状況`), K (`最終使用日・今後の見通し`). |
| **TC-03** | Filter by Customer (JAE / NLC) | Gọi export với `companyId` của JAE hoặc NLC | Danh sách chỉ chứa các khuôn thuộc sở hữu của khách hàng được lọc. |
| **TC-04** | UI Integration Check | Kiểm tra nút và Modal trên trang `/equipment/molds` | Nút hiển thị trên FilterBar, modal cho phép chọn phạm vi và tải file. |
| **TC-05** | Zero DDL Compliance Check | Kiểm tra git status & migrations | 0 file migration mới được tạo (tuân thủ nghiêm ngặt YELLOW Scope). |
| **TC-06** | i18n & TypeScript Gate | Chạy `check_translations.mjs` & `npx tsc --noEmit` | **0 missing keys**, **0 errors**. |

---

## 5. Thông Tin Commit & Baseline
- **Baseline Commit:** `b2c6631` (Đã cập nhật Userscript v3.13 + Local Hub v4.0 + Reactive Wakeup)
- **Trạng thái:** Chờ Kiến trúc sư trưởng PE phê duyệt Kế hoạch để AN tiến hành viết code.
