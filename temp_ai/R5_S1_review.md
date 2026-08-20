# BÁO CÁO REVIEW SPRINT R5-S1 (CHỈ THỊ #018)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày hoàn thành:** 2026-08-20
- **Phạm vi:** Sprint R5-S1 — Phân Hệ Công Nợ & Thanh Toán (Invoices, Invoice Lines, Invoice Payments, Debt View, Server Actions, UI Pages & Components, Navigation, i18n)
- **Trạng thái:** ✅ **HOÀN THÀNH 100% — SẴN SÀNG CHO PE NGHIỆM THU**

---

## 1. TỔNG QUAN TRIỂN KHAI THEO 5 PHẦN CHỈ ĐẠO

### 🔹 PHẦN 1 — DATABASE MIGRATION (`r5_s1_invoices_payments`)
- **File migration:** `supabase/migrations/20260820150000_r5_s1_invoices_payments.sql`
- **Các bảng & cấu trúc đã tạo:**
  1. **`invoices`**:
     - PK `invoice_id` (UUID), UK `invoice_number` (`INV-YYYYMM-NNN`), FK `company_id` $\rightarrow$ `companies(company_id)`, FK `order_id` $\rightarrow$ `orders(order_id)`, FK `shipment_id` $\rightarrow$ `shipments(shipment_id)`.
     - Cột tính toán `net_amount = total_amount + tax_amount`, `remaining_amount = net_amount - paid_amount`.
     - Status: `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `CANCELLED`.
  2. **`invoice_lines`**:
     - PK `line_id`, FK `invoice_id`, FK `order_line_id` $\rightarrow$ `order_lines(line_id)`, `description`, `quantity`, `unit_price`, `line_amount = quantity * unit_price`.
  3. **`invoice_payments`**:
     - PK `payment_id`, FK `invoice_id`, `payment_date`, `amount`, `payment_method` (`BANK_TRANSFER`, `CASH`, `CHECK`, `OTHER`), `reference_no`, `notes`.
  4. **Trigger & Function `fn_sync_invoice_payment`**:
     - Tự động tính tổng `paid_amount` và chuyển `status` sang `PAID` / `PARTIALLY_PAID` khi có giao dịch thanh toán.
  5. **View `v_customer_debt_summary`**:
     - Thống kê tổng hợp: `total_invoices`, `total_billed`, `total_paid`, `total_remaining`, `overdue_count`.
  6. **Indexes & RLS Policies**: Đã tạo đầy đủ index cho `company_id`, `status`, `due_date`, `invoice_id`.

---

### 🔹 PHẦN 2 — SERVER ACTIONS (`src/app/actions/invoice.ts`)
- **`generateNextInvoiceNumber`**: Tự động sinh mã hóa đơn tăng tiến theo định dạng `INV-YYYYMM-NNN`.
- **`getInvoices`**: Lấy danh sách hóa đơn hỗ trợ lọc theo `company_id`, `status`, khoảng ngày `dateRange`, tìm kiếm `search`, phân trang `range(from, to)`.
- **`getInvoiceById`**: Lấy chi tiết hóa đơn kèm thông tin công ty, đơn hàng, đợt xuất hàng, danh sách dòng hàng `invoice_lines` và lịch sử thanh toán `invoice_payments`.
- **`createInvoice`**: Tạo mới hóa đơn, tự động lấy dòng hàng từ `order_lines` nếu được liên kết với đơn hàng, tính toán thuế và tổng tiền.
- **`updateInvoiceStatus`**: Cập nhật trạng thái hóa đơn (`ISSUED`, `CANCELLED`...).
- **`addPayment`**: Ghi nhận đợt thanh toán, tự động đồng bộ số tiền đã trả và trạng thái hóa đơn.
- **`getCustomerDebtSummary`**: Tổng hợp công nợ theo khách hàng, phân loại các khoản nợ quá hạn.

---

### 🔹 PHẦN 3 — GIAO DIỆN UI & COMPONENTS
1. **Trang danh sách Hóa đơn (`src/app/orders/invoices/page.tsx`)**:
   - Header chuẩn với nút tạo HĐ và làm mới.
   - KPI Bar 5 khối: Tổng số HĐ, Tổng tiền đã lập HĐ, Tổng tiền đã thu, Tổng công nợ còn lại, Số HĐ quá hạn.
   - Thanh lọc đa năng: Ô tìm kiếm, Dropdown trạng thái, Dropdown khách hàng, Lọc từ ngày - đến ngày.
   - Bảng dữ liệu: Số HĐ (hyperlink mở Drawer), Khách hàng, Ngày lập, Hạn thanh toán (cảnh báo đỏ nếu trễ hạn), Tổng tiền, Đã thanh toán, Còn lại, Status badge, Nút thanh toán nhanh & xem chi tiết.
2. **Trang Báo cáo Công nợ Khách hàng (`src/app/orders/debt/page.tsx`)**:
   - KPI Cards: Tổng số khách hàng, Tổng tiền đã xuất HĐ, Tổng tiền đã thu, Tổng dư nợ hiện tại, Số khách hàng có nợ quá hạn.
   - Bảng tổng hợp công nợ theo đối tác: Tên & mã KH, Tổng số HĐ, Đã lập HĐ, Đã thanh toán, Dư nợ còn lại, Cảnh báo trễ hạn, Nút chuyển nhanh đến các hóa đơn của khách hàng.
3. **Component `InvoiceDrawer` (`src/app/orders/invoices/_components/InvoiceDrawer.tsx`)**:
   - Mode Tạo mới: Chọn khách hàng, tự động lấy dòng hàng từ Đơn hàng / Phiếu giao hàng, thêm/xóa dòng hàng linh hoạt, tính thuế suất (10%, 8%, 0%).
   - Mode Xem chi tiết: Tab "Chi tiết dòng hàng" (Invoice Lines) & Tab "Lịch sử thanh toán" (Payment History), nút Ghi nhận thanh toán và Phát hành HĐ.
4. **Component `AddPaymentModal` (`src/app/orders/invoices/_components/AddPaymentModal.tsx`)**:
   - Modal nhập ngày thanh toán, số tiền, phương thức (Chuyển khoản, Tiền mặt, Séc, Khác), mã tham chiếu/UNC, ghi chú.

---

### 🔹 PHẦN 4 — NAVIGATION (`src/components/layout/Sidebar.tsx`)
- Đã bổ sung 2 mục vào nhóm **"Văn phòng" (Office / Orders)**:
  - 🧾 **`請求書 (Hóa đơn)`** $\rightarrow$ `/orders/invoices`
  - 💳 **`売掛金 (Công nợ)`** $\rightarrow$ `/orders/debt`

---

### 🔹 PHẦN 5 — ĐA NGÔN NGỮ (i18n)
- Khai báo đầy đủ 100% keys trong 2 namespaces `invoices` và `debt` tại cả 2 file `messages/ja.json` và `messages/vi.json`.
- Kiểm tra tự động bằng `node scripts/check_translations.mjs` $\rightarrow$ **0 missing keys**.

---

## 2. KẾT QUẢ KIỂM THỬ KỸ THUẬT

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | ✅ **0 errors** | Toàn bộ type an toàn tuyệt đối |
| **Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` | ✅ **0 missing keys** | Đồng bộ hoàn toàn JA & VI |
| **Commit Message** | `git commit` | ✅ Chuẩn conventional | `feat(invoices): R5-S1 công nợ & thanh toán phân hệ` |

---

Kính trình Trưởng dự án PE nghiệm thu Sprint R5-S1!
