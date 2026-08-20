# SPRINT R5-S2: ORDER-TO-CASH E2E LIFECYCLE TEST REPORT

- **Ngày thực thi:** 2026-08-20
- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Mục tiêu:** Kiểm thử tích hợp tự động khép kín toàn bộ chuỗi: `Quotation` $\rightarrow$ `Order` $\rightarrow$ `Shipment` $\rightarrow$ `Invoice` $\rightarrow$ `Payment` $\rightarrow$ `v_customer_debt_summary` trên Supabase Live DB (`iirezrszalmecsslbruo`).
- **File Test Spec:** [`e2e/order-to-cash-flow.spec.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/e2e/order-to-cash-flow.spec.ts)

---

## 1. KẾT QUẢ THỰC THI TEST CASES

| # | Test Case | Mô tả kiểm thử | Kết quả | Chi tiết xác thực |
|---|---|---|:---:|---|
| **a** | **Quotation Creation & Issuance** | Tạo 1 báo giá (`DRAFT` $\rightarrow$ `ISSUED`) với 2 dòng `quotation_lines` | ✅ **PASS** | Tự động tính `amount` generated column (150,000 + 100,000 = 250,000 JPY), cập nhật status `ISSUED`. |
| **b** | **Quotation $\rightarrow$ Order Conversion** | Chuyển đổi báo giá sang đơn hàng `orders` (`order_status: NEW`) & tạo `order_lines` | ✅ **PASS** | `company_id` nhất quán 100%, 2 dòng đơn hàng được tạo với `due_date` và `product_id`. |
| **c** | **Shipment Linking** | Tạo phiếu giao hàng `shipments` gắn với `order_id` | ✅ **PASS** | Khớp `shipment_type` (`physical`), `document_template` (`standard`), status `SHIPPED`. |
| **d** | **Invoice & Generated Columns** | Tạo `invoices` & `invoice_lines` từ đợt xuất hàng | ✅ **PASS** | Xác thực `net_amount = total_amount + tax_amount` (250,000 + 25,000 = 275,000 JPY) và `line_amount` tự tính. |
| **e** | **Partial Payments & Debt Summary** | Ghi nhận 2 đợt thanh toán (100k + 175k JPY), kiểm tra trigger đồng bộ & view công nợ | ✅ **PASS** | Lần 1: `PARTIALLY_PAID`, remaining = 175k. Lần 2: `PAID`, remaining = 0. View `v_customer_debt_summary` cập nhật tức thời `total_remaining = 0`. |
| **f** | **Data Integrity Guard** | Kiểm tra ràng buộc tham chiếu & an toàn dữ liệu | ✅ **PASS** | Dòng hàng hóa đơn giữ toàn vẹn liên kết với dòng đơn hàng `order_line_id`. |

**Tổng kết:** **6 / 6 Test Cases PASS (100%)** — Thời gian chạy: **3.8s**.

---

## 2. LOG THỰC THI PLAYWRIGHT THỰC TẾ

```text
Running 6 tests using 1 worker

[1/6] [chromium] › e2e\order-to-cash-flow.spec.ts:92:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case a: Should create quotation with ≥2 lines and issue quotation
[2/6] [chromium] › e2e\order-to-cash-flow.spec.ts:158:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case b: Should convert quotation to order and maintain company_id consistency
[3/6] [chromium] › e2e\order-to-cash-flow.spec.ts:209:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case c: Should create shipment linked to order
[4/6] [chromium] › e2e\order-to-cash-flow.spec.ts:234:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case d: Should create invoice and verify generated columns (net_amount, line_amount)
[5/6] [chromium] › e2e\order-to-cash-flow.spec.ts:302:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case e: Should process partial payments, trigger auto-sync, and reflect in debt view
[6/6] [chromium] › e2e\order-to-cash-flow.spec.ts:374:7 › Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification › Case f: Should protect data integrity when order_line is referenced by invoice_line

  6 passed (3.8s)
```

---

## 3. DANH SÁCH DỮ LIỆU TEST ĐÃ TẠO TRÊN LIVE DB

Tất cả các bản ghi phục vụ test đều được gắn prefix `TEST_E2E_` để PE và đội kỹ thuật dễ dàng kiểm tra trực tiếp và dọn dẹp khi cần:

- **Khách hàng (`companies`):** `company_code LIKE 'TEST_E2E_%'`
- **Sản phẩm (`products`):** `product_code LIKE 'TEST_E2E_%'`
- **Báo giá (`quotations`):** `quotation_no LIKE 'TEST_E2E_%'`
- **Đơn hàng (`orders`):** `order_no LIKE 'TEST_E2E_%'`
- **Phiếu giao hàng (`shipments`):** `delivery_note_no LIKE 'TEST_E2E_%'`
- **Hóa đơn (`invoices`):** `invoice_number LIKE 'TEST_E2E_%'`

### 🧹 Script SQL Dọn Dẹp (Nếu PE muốn dọn dẹp Live DB):
```sql
DELETE FROM public.invoice_payments WHERE reference_no LIKE 'TEST_E2E_%';
DELETE FROM public.invoices WHERE invoice_number LIKE 'TEST_E2E_%';
DELETE FROM public.shipments WHERE delivery_note_no LIKE 'TEST_E2E_%';
DELETE FROM public.orders WHERE order_no LIKE 'TEST_E2E_%';
DELETE FROM public.quotations WHERE quotation_no LIKE 'TEST_E2E_%';
DELETE FROM public.products WHERE product_code LIKE 'TEST_E2E_%';
DELETE FROM public.companies WHERE company_code LIKE 'TEST_E2E_%';
```
