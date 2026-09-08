# Implementation Plan — Milestone 18 Sprint 2: Mold Custody, Loans & Return UI + 3 PDF Engines + Migration 098

Triển khai **Milestone 18 Sprint 2: Hoàn thiện Giao diện Quản lý Mượn / Giữ hộ / Trả Khuôn (`/equipment/loans`), Bộ 3 Template PDF Chuẩn Nhật (`借用書` / `金型返却書` / `加工送付状`), và Migration 098** theo **ADR-009 (APPROVED)** và **3 điều chỉnh bắt buộc từ PE**.

---

## 1. User Review Required

> [!IMPORTANT]
> - **Migration 098 Điều chỉnh Semantic & Bổ sung Cột (Không Rollback Migration 097):**
>   1. **PE Adjustment #1 (Strict loan_type values):**
>      - Cập nhật dứt khoát 3 nhãn nghiệp vụ mới chuẩn hóa:
>        `CUSTOMER_LOAN` (Khách giao khuôn vào YSD giữ / YSD mượn),
>        `RETURN_TO_CUSTOMER` (YSD hoàn trả khuôn về khách),
>        `OUTSOURCE_PROCESSING` (Gửi khuôn sang vendor ngoài mài dao/phủ teflon).
>      - Drop constraint cũ, tạo CHECK constraint mới chỉ chấp nhận 3 nhãn này (không giữ nhãn cũ).
>   2. **PE Adjustment #2 (Photo fields for Japanese Accounting):**
>      - Thêm 2 cột ảnh kế toán tài sản cố định: `photo_overall_url TEXT` (Ảnh toàn cảnh / 全体写真) và `photo_nameplate_url TEXT` (Ảnh cận cảnh nameplate / 銘板・型番写真).
>   3. **PE Adjustment #3 (Annual Consignment Audit Support `貸与設備棚卸調査`):**
>      - Thêm cột `has_valid_loan_document BOOLEAN` trong View `v_equipment_loans_summary` để phục vụ kỳ kiểm kê tài sản hàng năm của khách hàng (JAE, NLC, SHI...).
>   4. **Cập nhật 2 RPC Functions:**
>      - `fn_dispatch_equipment_loan`: Xử lý phân nhánh `keeper_company_id` chuẩn (CUSTOMER_LOAN $\rightarrow$ YSD, RETURN_TO_CUSTOMER $\rightarrow$ to_company_id & clear rack layer, OUTSOURCE_PROCESSING $\rightarrow$ vendor).
>      - `fn_complete_equipment_loan_return`: Xử lý nhập kho hoàn trả và cập nhật vị trí tầng kệ.

> [!TIP]
> - **Bộ 3 Template PDF A4 Chuẩn Nhật (`@react-pdf/renderer`):**
>   1. `金型借用書 (兼 預り証)`: Dành cho `CUSTOMER_LOAN` — YSD cam kết mượn/giữ hộ tài sản của khách, có khung chữ ký mộc tròn đại diện pháp luật YSD (`代表者印 / 社判`), 2 khung ảnh (Toàn cảnh & Nameplate), mã QR tra cứu.
>   2. `金型返却書 (現品受渡確認票)`: Dành cho `RETURN_TO_CUSTOMER` — Biên bản bàn giao hoàn trả khuôn cho khách, quy cách đóng kiện pallet, số vận đơn (`送り状No.`), chữ ký xác nhận 2 bên.
>   3. `金型外注加工・修理依頼書 (兼 送付状)`: Dành cho `OUTSOURCE_PROCESSING` — Phiếu gửi gia công ngoài (mài dao, phủ teflon, sửa CNC), yêu cầu kỹ thuật và ngày hẹn bàn giao.

---

## 2. Proposed Changes & Architecture

### Database Migration

#### [NEW] `supabase/migrations/20260908000001_098_equipment_loans_semantic_and_photos.sql`
- Update existing rows in `equipment_loans`:
  ```sql
  UPDATE public.equipment_loans SET loan_type = 'CUSTOMER_LOAN' WHERE loan_type = 'BORROW';
  UPDATE public.equipment_loans SET loan_type = 'RETURN_TO_CUSTOMER' WHERE loan_type = 'RETURN';
  UPDATE public.equipment_loans SET loan_type = 'OUTSOURCE_PROCESSING' WHERE loan_type = 'REPAIR_OUT';
  ```
- Drop old check constraints and create new strict constraint:
  ```sql
  ALTER TABLE public.equipment_loans DROP CONSTRAINT IF EXISTS equipment_loans_loan_type_check;
  ALTER TABLE public.equipment_loans ADD CONSTRAINT equipment_loans_loan_type_check 
    CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING'));

  ALTER TABLE public.equipment_loans DROP CONSTRAINT IF EXISTS chk_scheduled_return_date;
  ALTER TABLE public.equipment_loans ADD CONSTRAINT chk_scheduled_return_date 
    CHECK (scheduled_return_date IS NOT NULL OR loan_type = 'RETURN_TO_CUSTOMER');
  ```
- Add photo columns:
  ```sql
  ALTER TABLE public.equipment_loans ADD COLUMN IF NOT EXISTS photo_overall_url TEXT;
  ALTER TABLE public.equipment_loans ADD COLUMN IF NOT EXISTS photo_nameplate_url TEXT;
  ```
- Recreate View `v_equipment_loans_summary` with `photo_overall_url`, `photo_nameplate_url`, and `has_valid_loan_document`.
- Update RPC functions `fn_dispatch_equipment_loan` and `fn_complete_equipment_loan_return`.

---

### Backend & Server Actions

#### [MODIFY] `src/app/equipment/loans/types.ts`
- Cập nhật `LoanType = 'CUSTOMER_LOAN' | 'RETURN_TO_CUSTOMER' | 'OUTSOURCE_PROCESSING'`.
- Bổ sung `photo_overall_url: string | null`, `photo_nameplate_url: string | null`, `has_valid_loan_document: boolean`.
- Bổ sung type cho PDF generation props.

#### [MODIFY] `src/app/equipment/loans/actions.ts`
- Đồng bộ các Server Actions theo `LoanType` mới.
- Hỗ trợ lưu trữ/cập nhật URL ảnh và kiểm tra chứng từ hợp lệ.

#### [MODIFY] `src/types/database.types.ts`
- Cập nhật định nghĩa Table `equipment_loans` (thêm 2 cột ảnh), View `v_equipment_loans_summary` (thêm 2 cột ảnh và `has_valid_loan_document`), và 2 hàm RPC.

---

### UI Module `/equipment/loans`

#### [NEW] `src/app/equipment/loans/page.tsx`
- Layout chuẩn 3 lớp theo AGENTS.md:
  - Header: `LoanHeader` (Title `金型借用・預託・返却管理 / Quản lý Mượn・Giữ hộ・Trả khuôn`, Action Button `+ 新規登録 / Tạo phiếu mới`).
  - FilterBar & KPI: `LoanKpiCards` + `LoanFilterBar` (5 tabs trạng thái: Tất cả, Đang xử lý, Chờ duyệt, Quá hạn, Đã hoàn tất; dropdown loại nghiệp vụ, tìm kiếm).
  - Content Area: `LoanListTable` bọc trong `card-flat` với pagination 50 rows/page.

#### [NEW] `src/app/equipment/loans/_components/LoanHeader.tsx`
- Header compact, nút tạo mới mở modal `CreateLoanModal`.

#### [NEW] `src/app/equipment/loans/_components/LoanKpiCards.tsx`
- 4 KPI cards:
  1. `預託保管中 (Giữ hộ tại YSD)`: Tổng số khuôn đang mượn/giữ tại YSD.
  2. `承認待ち (Chờ duyệt)`: Số phiếu chờ quản lý duyệt.
  3. `期日超過 (Quá hạn hoàn trả)`: Số phiếu quá hạn trả kèm badge đỏ.
  4. `今月完了 (Đã hoàn tất trong tháng)`: Số phiếu đã hoàn thành trong tháng hiện tại.

#### [NEW] `src/app/equipment/loans/_components/LoanFilterBar.tsx`
- Tabs trạng thái, ô tìm kiếm debounce 400ms, filter theo `loan_type` và `company_id`.

#### [NEW] `src/app/equipment/loans/_components/LoanListTable.tsx`
- Bảng dữ liệu chuẩn:
  - Cột `loan_code`: Link monospace bold $\rightarrow$ trang chi tiết `/equipment/loans/[id]`.
  - Cột `loan_type`: Badge màu phân biệt trực quan:
    - `CUSTOMER_LOAN`: Badge Teal (`金型借用 / Giữ hộ`)
    - `RETURN_TO_CUSTOMER`: Badge Purple (`金型返却 / Trả khách`)
    - `OUTSOURCE_PROCESSING`: Badge Amber (`外注加工 / Sửa ngoài`)
  - Cột `equipment`: Mã khuôn, tên khuôn, loại thiết bị.
  - Cột `counterparty`: Đối tác đối ứng (Khách hàng hoặc Vendor).
  - Cột `scheduled_return_date`: Hạn trả kèm badge quá hạn `+N ngày` nếu trễ.
  - Cột `status`: Badge trạng thái vòng đời.
  - Cột `actions`: Nút Xem, Nút Xuất PDF nhanh.

#### [NEW] `src/app/equipment/loans/_components/CreateLoanModal.tsx`
- Modal tạo phiếu thông minh:
  - Chọn 1 trong 3 nghiệp vụ: Tự động điều chỉnh nhãn `from` và `to` tương ứng chiều di chuyển.
  - Tìm kiếm khuôn/dao cắt nhanh.
  - Nhập ngày lập, hạn trả dự kiến.
  - Đính kèm URL hoặc upload ảnh toàn cảnh & nameplate.
  - Ghi nhận tình trạng ban đầu của khuôn.

#### [NEW] `src/app/equipment/loans/_components/LoanWorkflowModals.tsx`
- `ApproveModal`: Quản lý duyệt phiếu.
- `RejectModal`: Quản lý từ chối phiếu kèm lý do.
- `DispatchModal`: Xuất kho (chuyển sang `IN_TRANSIT`, cập nhật keeper).
- `ReturnModal`: Nhập hoàn trả (chuyển sang `RETURNED`, chọn tầng kệ cất kho).

#### [NEW] `src/app/equipment/loans/[id]/page.tsx`
- Trang chi tiết phiếu:
  - Back/Up header compact.
  - Paper style spec layout hiển thị thông tin 2 bên, thông số khuôn.
  - Khung xem ảnh toàn cảnh & nameplate.
  - Action buttons: In PDF, Duyệt/Từ chối, Xuất kho, Nhập hoàn trả.

---

### PDF Engine

#### [NEW] `src/components/pdf/MoldLoanPDFDocument.tsx`
- Document React-PDF hỗ trợ 3 layout mẫu chuẩn Nhật khổ A4 portrait (font `NotoSansJP`):
  - **Mẫu 1 (`CUSTOMER_LOAN`):** `金型借用書 (兼 預り証)`
  - **Mẫu 2 (`RETURN_TO_CUSTOMER`):** `金型返却書 (現品受渡確認票)`
  - **Mẫu 3 (`OUTSOURCE_PROCESSING`):** `金型外注加工・修理依頼書 (兼 送付状)`

#### [NEW] `src/app/api/equipment/loans/[id]/pdf/route.ts`
- API GET stream PDF trực tiếp với caching header hợp lý.

---

### Navigation & Internationalization

#### [MODIFY] `src/components/layout/Sidebar.tsx`
- Thêm mục `金型借用・返却 / Mượn・Trả khuôn` (`/equipment/loans`, icon `ArrowLeftRight`) vào section Thiết bị (`sections.equipment`).

#### [MODIFY] `messages/ja.json` & `messages/vi.json`
- Bổ sung 100% keys dịch đối xứng cho namespace `loans`.

---

## 3. Verification Plan

### Automated Checks
1. **Migration 098 Execution:**
   - Chạy script áp dụng Migration 098 lên Supabase Live DB (`iirezrszalmecsslbruo`).
   - Kiểm tra ràng buộc `loan_type` mới và các cột ảnh `photo_overall_url`, `photo_nameplate_url`.
2. **E2E Live DB Workflow Test:**
   - Chạy test script tạo 3 loại phiếu (`CUSTOMER_LOAN`, `RETURN_TO_CUSTOMER`, `OUTSOURCE_PROCESSING`).
   - Verify chuyển đổi trạng thái và logic cập nhật `keeper_company_id`.
3. **Quality Gates:**
   - `npx tsc --noEmit` $\rightarrow$ Bắt buộc **0 errors**.
   - `node scripts/check_translations.mjs` $\rightarrow$ Bắt buộc **0 missing keys**.
   - `node scripts/find_hardcoded_bilingual.mjs` $\rightarrow$ Clean.

### Manual / Visual Verification
1. Truy cập `/equipment/loans` kiểm tra giao diện bảng, tabs lọc và 4 thẻ KPI.
2. Thử nghiệm tạo mới phiếu mượn/trả qua modal và thực hiện phê duyệt.
3. Bấm xuất PDF kiểm tra hiển thị 3 mẫu biểu chuẩn Nhật (`借用書`, `金型返却書`, `加工送付状`) trên trình xem PDF.
