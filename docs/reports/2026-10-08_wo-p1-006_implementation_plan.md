# Implementation Plan: WO-P1-006 (Gói 7 — Luồng Hoàn Trả Khuôn & Giao Nhận Hiện Vật)

## 1. Thông Tin Chung & Bối Cảnh
- **Mã Work Order:** `WO-P1-006`
- **Mã Chỉ thị gốc:** `f2d85bb7-fd17-4918-8eae-9d6df407cc4e` (Thread: `WO-P1-006`)
- **Phân loại rủi ro:** 🟡 **YELLOW** (Mở rộng UI & Template PDF, không DDL mới, không ghi đè ngoài domain loan)
- **Mục tiêu:** Xây dựng luồng Hoàn trả khuôn & Giao nhận Hiện vật (**金型返却票・現品受渡確認票**) cho Panasonic Shirakawa & SMK, tận dụng nền tảng Mobile Capture (Gói 4) + PDF Engine (Gói 5), theo SSOT `MOLD_CUSTODY_BUSINESS_SPEC v1.0`.
- **Ràng buộc:**
  - ❌ KHÔNG tạo migration DDL mới (sử dụng schema hiện có của `equipment_loans` và `equipment`).
  - ❌ KHÔNG ghi đè dữ liệu ngoài việc cập nhật trạng thái hoàn trả trên bản ghi mượn/trả.
  - ❌ KHÔNG tự động click submit Perplexity (THOAN giữ quyền duyệt cuối).

---

## 2. Phân Tích Nghiệp Vụ SSOT (Panasonic Shirakawa & SMK)

Dựa trên tài liệu `MOLD_CUSTODY_BUSINESS_SPEC.md`:
1. **Đối tác Panasonic Industrial Devices (Shirakawa):**
   - Đóng gói chuẩn Pallet $1,100 \times 1,100\text{ mm}$, quấn màng co, đo chiều cao tổng và trọng lượng để xe cẩu/xe tải bốc dỡ.
   - Nhãn mã QR định danh cá thể khuôn.
2. **Đối tác Omura Giken / SMK (Iwate):**
   - Bàn giao trọn bộ: Phụ tùng linh kiện khuôn (`金型部品`), Bản vẽ kỹ thuật (`型図面`), Biên bản mượn gốc (`預かり書原本`).
   - Hình thức vận chuyển cước người nhận trả (`着払い`), ghi nhận đơn vị vận tải.
3. **Chứng từ Pháp lý:**
   - **Phiếu xác nhận giao nhận hiện vật (`現品受渡確認票`)**: Bắt buộc có khung ký 3 bên:
     1. Bên giao (YSD - Quản lý xưởng & Người lập phiếu).
     2. Bên vận chuyển (Tên tài xế & Biển số xe tải).
     3. Bên nhận (Đại diện khách hàng tiếp nhận hiện vật).

---

## 3. Danh Mục File Cần Chỉnh Sửa / Tạo Mới (File List)

| STT | File Path | Mục đích & Trách nhiệm |
|---|---|---|
| 1 | `src/app/equipment/loans/_components/LoanWorkflowModals.tsx` | Nâng cấp `ReturnCheckInModal` thành **`MoldReturnHandoverModal`**: Hỗ trợ nhập ngày hoàn trả, người giao YSD, người nhận khách hàng, đơn vị vận chuyển/biển số xe, checklist phụ tùng/bản vẽ kèm theo, quy cách pallet. |
| 2 | `src/app/equipment/loans/actions.ts` | Bổ sung Server Action `completeReturnHandover`: Cập nhật bản ghi `equipment_loans` sang trạng thái `RETURNED`, ghi nhận ngày trả thực tế, ghi chú kiểm tra ngoại quan. |
| 3 | `src/components/pdf/MoldLoanPDFDocument.tsx` | Nâng cấp template `現品受渡確認票`: Tích hợp checklist bàn giao 3 mục (Phụ tùng, Bản vẽ, Biên bản gốc), thông tin kiện hàng Pallet $1,100 \times 1,100$, 2 ảnh hiện trường Mobile Capture, và khung ký 3 bên. |
| 4 | `src/app/equipment/loans/[id]/page.tsx` | Nâng cấp giao diện chi tiết: Hiển thị thẻ thông tin bàn giao hoàn trả khi status là `RETURNED`, nút mở modal bàn giao, nút in/tải PDF `現品受渡確認票`. |
| 5 | `messages/ja.json` & `messages/vi.json` | Cập nhật i18n song ngữ cho các nhãn nghiệp vụ bàn giao hoàn trả (không hardcode UI). |
| 6 | `scripts/test_p1_006_return_handover.py` | Test suite tự động kiểm thử toàn diện luồng hoàn trả và xuất PDF. |

---

## 4. Kế Hoạch Kiểm Thử Chi Tiết (Test Plan)

| Test Case | Mục tiêu kiểm tra | Phương pháp thực hiện | Tiêu chí đạt |
|---|---|---|---|
| **TC-01** | Return Handover Action Execution | Gọi server action `completeReturnHandover` trên record test | Cập nhật thành công `status = 'RETURNED'`, `actual_return_date` đúng ngày, không lỗi DB. |
| **TC-02** | Checklist & Pallet Dimensions Validation | Kiểm tra lưu trữ thông tin phụ tùng, bản vẽ, quy cách pallet | Dữ liệu được ghi nhận đầy đủ vào trường ghi chú / condition_notes. |
| **TC-03** | PDF Template `現品受渡確認票` Render | Gọi endpoint `/api/equipment/loans/[id]/pdf` với record đã trả | Trả về HTTP 200, PDF chứa tiêu đề `金型返却書 (兼 現品受渡確認票)`, 3 khung chữ ký, 2 ảnh Mobile Capture. |
| **TC-04** | Client Verification (Panasonic & SMK) | Kiểm tra hiển thị đúng thông tin khách hàng đối tác | Đúng tên công ty, mã khuôn, địa chỉ nhận hàng. |
| **TC-05** | Zero DDL Compliance Check | So sánh cấu trúc bảng database | Không có bảng mới, không có cột mới, 100% tận dụng schema hiện có. |
| **TC-06** | TypeScript & i18n Quality Gate | Chạy `npx tsc --noEmit` & `node scripts/check_translations.mjs` | **0 errors**, **0 missing keys**. |
