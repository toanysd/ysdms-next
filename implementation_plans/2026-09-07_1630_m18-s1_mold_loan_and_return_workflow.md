# Implementation Plan — Milestone 18 Sprint 1: Mold Loan & Return DB Migration & Workflow Engine

Triển khai **Sprint M18-S1: Database Migration 097 & Workflow Engine Phê duyệt Quản lý Mượn / Trả Khuôn (金型借用・返却管理)** theo **Chỉ thị #026** của PE.

---

## 1. User Review Required

> [!IMPORTANT]
> - **Schema Mới (Migration 097):**
>   - Bảng mới `equipment_loans`: Quản lý toàn diện hồ sơ và vòng đời xuất khuôn ra ngoài nhà máy YSD.
>   - 3 loại phiếu (`loan_type`):
>     1. `BORROW` (Cho mượn ra ngoài): Khách hàng hoặc đối tác mượn khuôn/dao để thử mẫu, kiểm tra hoặc sản xuất thử.
>     2. `RETURN` (Trả khuôn chính thức): Trả khuôn về cho khách hàng sở hữu (`金型返却` — kết thúc hợp đồng hoặc khách thu hồi).
>     3. `REPAIR_OUT` (Gửi sửa chữa / gia công ngoài): Gửi khuôn sang bên thứ 3 mài dao, gia công CNC, khắc laser hoặc phủ teflon.
>   - 6 trạng thái vòng đời (`status`):
>     `PENDING_APPROVAL` (Chờ duyệt) $\rightarrow$ `APPROVED` (Đã duyệt) / `REJECTED` (Từ chối) $\rightarrow$ `IN_TRANSIT` (Đang xuất mượn / Trên đường) $\rightarrow$ `RETURNED` (Đã hoàn trả về YSD) / `CANCELLED` (Đã hủy).
>   - Tương thích ngược: Khi xuất kho mượn (`IN_TRANSIT`), hệ thống tự động đồng bộ `equipment.keeper_company_id` và ghi log vào `equipment_ship_logs`. Khi hoàn trả (`RETURNED`), hệ thống cập nhật lại `keeper_company_id = YSD` và cho phép gán lại tầng kệ kho qua `moveEquipmentLocation`.
> - **View Server-side `v_equipment_loans_summary`:**
>   - Tự động tính toán số ngày quá hạn `days_overdue` (`CURRENT_DATE - scheduled_return_date`) và cờ cảnh báo `is_overdue`.
>   - JOIN đầy đủ thông tin thiết bị (`equipment`), công ty chuyển/nhận (`companies`), nhân viên phụ trách/phê duyệt (`employees`).
> - **Quy trình Phê Duyệt 2 Bước (2-Step Approval Workflow):**
>   - Bước 1: Nhân viên xưởng/Kinh doanh tạo đề xuất phiếu mượn/trả (`status = PENDING_APPROVAL`).
>   - Bước 2: Quản lý xưởng / Trưởng bộ phận xét duyệt: Duyệt (`APPROVED`) hoặc Từ chối (`REJECTED` kèm lý do).
>   - Bước 3: Xuất kho (`dispatch`) $\rightarrow$ chuyển trạng thái sang `IN_TRANSIT`.
>   - Bước 4: Nhập kho hoàn trả (`check-in return`) $\rightarrow$ ghi nhận tình trạng khuôn thực tế và cất lên tầng kệ.

---

## 2. Proposed Changes & Architecture

### Database Migration

#### [NEW] `supabase/migrations/20260907000004_097_equipment_loans.sql`
1. **Bảng `equipment_loans`:**
   - `loan_id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - `loan_code` TEXT UNIQUE NOT NULL (Format: `LN-YYYYMMDD-NNN`)
   - `loan_type` TEXT NOT NULL CHECK IN (`BORROW`, `RETURN`, `REPAIR_OUT`)
   - `status` TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK IN (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `IN_TRANSIT`, `RETURNED`, `CANCELLED`)
   - `equipment_id` UUID NOT NULL REFERENCES `equipment(equipment_id)`
   - `from_company_id` UUID REFERENCES `companies(company_id)`
   - `to_company_id` UUID NOT NULL REFERENCES `companies(company_id)`
   - `requested_by` UUID REFERENCES `employees(employee_id)`
   - `approved_by` UUID REFERENCES `employees(employee_id)`
   - `approved_at` TIMESTAMPTZ
   - `rejection_reason` TEXT
   - `loan_date` DATE NOT NULL DEFAULT CURRENT_DATE
   - `scheduled_return_date` DATE (hạn trả dự kiến)
   - `actual_return_date` DATE (ngày trả thực tế)
   - `returned_received_by` UUID REFERENCES `employees(employee_id)`
   - `destination_address` TEXT
   - `contact_person` TEXT
   - `contact_phone` TEXT
   - `purpose` TEXT
   - `condition_on_loan` TEXT
   - `condition_on_return` TEXT
   - `condition_notes` TEXT
   - `qr_doc_code` TEXT
   - `created_at`, `updated_at` TIMESTAMPTZ DEFAULT now()
2. **Indexes:**
   - `idx_equipment_loans_equipment_id`, `idx_equipment_loans_to_company_id`, `idx_equipment_loans_status`, `idx_equipment_loans_scheduled_return_date`, `idx_equipment_loans_loan_type`.
3. **SQL View `v_equipment_loans_summary`:**
   - Tính toán `days_overdue` và `is_overdue` realtime.
   - Join `equipment`, `companies`, `employees`.
4. **Row Level Security (RLS):**
   - Kích hoạt RLS, chính sách SELECT, INSERT, UPDATE cho authenticated/anon.

---

### Backend / Server Actions & Engine

#### [NEW] `src/app/equipment/loans/types.ts`
- Khai báo TypeScript types chuẩn cho `EquipmentLoanItem`, `CreateLoanInput`, `ApproveLoanInput`, `ReturnLoanInput`, `LoanKpiSummary`.

#### [NEW] `src/app/equipment/loans/actions.ts`
- Các Server Action chuyên biệt:
  1. `getEquipmentLoans(params)`: Truy vấn danh sách phiếu mượn/trả từ View `v_equipment_loans_summary` hỗ trợ phân trang, lọc theo loại, trạng thái, quá hạn và tìm kiếm.
  2. `getEquipmentLoanDetail(loanId)`: Chi tiết đầy đủ phiếu mượn/trả.
  3. `getEquipmentLoanKpis()`: Thống kê số lượng theo KPI: Đang mượn ngoài, Chờ duyệt, Quá hạn, Đã trả trong tháng.
  4. `createEquipmentLoan(input)`: Tạo mới phiếu mượn/trả, tự động sinh mã `loan_code` chuẩn `LN-YYYYMMDD-NNN`.
  5. `approveEquipmentLoan(loanId, approvedBy)`: Phê duyệt phiếu mượn/trả.
  6. `rejectEquipmentLoan(loanId, approvedBy, reason)`: Từ chối phiếu mượn/trả.
  7. `dispatchEquipmentLoan(loanId, employeeId, notes)`: Xuất kho chuyển sang `IN_TRANSIT`, đồng thời cập nhật `equipment.keeper_company_id = to_company_id` và ghi nhận `equipment_ship_logs`.
  8. `completeEquipmentLoanReturn(loanId, returnData)`: Ghi nhận hoàn trả về YSD, cập nhật `equipment.keeper_company_id = YSD`, cập nhật tầng kệ mới (nếu có) và đóng phiếu (`RETURNED`).

---

### Documentation & Schema Reference Updates

#### [MODIFY] `SCHEMA_REFERENCE.md`
- Bổ sung định nghĩa bảng `equipment_loans` và View `v_equipment_loans_summary`.

#### [MODIFY] `PE_AN_COORDINATION_LOG.md`
- Ghi nhận bắt đầu Milestone 18 Sprint 1 theo Chỉ thị #026.

---

## 3. Verification Plan

### Automated Checks
- Áp dụng Migration 097 lên Supabase Live DB (Project `iirezrszalmecsslbruo`).
- Chạy script kiểm tra trực tiếp trên Live DB: Tạo bản ghi thử nghiệm $\rightarrow$ Chạy workflow Approval $\rightarrow$ Verify status transition $\rightarrow$ Dọn sạch test data.
- `npx tsc --noEmit` $\rightarrow$ Bắt buộc **0 errors**.
- `node scripts/check_translations.mjs` $\rightarrow$ Bắt buộc **0 missing keys**.
- `node scripts/find_hardcoded_bilingual.mjs` $\rightarrow$ Clean.

### Manual Verification
1. Verify cấu trúc bảng `equipment_loans` và View `v_equipment_loans_summary` trên Supabase Console.
2. Kiểm tra tính toán `days_overdue` với các mốc ngày trong quá khứ và tương lai.
3. Kiểm tra tính liên kết toàn vẹn khóa ngoại (FK) với `equipment`, `companies`, `employees`.
