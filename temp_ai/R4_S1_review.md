# BÁO CÁO REVIEW SPRINT R4-S1 (CHỈ THỊ #014)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày hoàn thành:** 2026-08-20
- **Phạm vi:** Sprint R4-S1 — Phân Hệ Báo Giá 見積書 (Danh Sách Báo Giá + Engine Tính Giá Tự Động + Xuất PDF 見積書 Chuẩn Nhật Bản)
- **Trạng thái:** ✅ **HOÀN THÀNH 100% — SẴN SÀNG CHO PE NGHIỆM THU**

---

## 1. HẠNG MỤC 1: TRANG DANH SÁCH BÁO GIÁ (`/orders/quotations`)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/app/orders/quotations/page.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/quotations/page.tsx)
- **Luồng Query:**
  ```typescript
  supabase.from('quotations')
    .select(`
      quotation_id, quotation_no, quote_date, valid_until,
      status, quotation_type, total_amount, notes,
      companies:companies!quotations_company_id_fkey ( company_id, company_name, company_code ),
      employees:employees!quotations_prepared_by_fkey ( employee_name )
    `)
    .order('quote_date', { ascending: false })
  ```
- **Giao diện & Tiện ích:**
  - 4 thẻ KPI đầu trang: Tổng Báo Giá, Tổng Giá Trị Báo Giá (¥), Báo Giá Chờ Phản Hồi (`SENT`), Báo Giá Đã Chốt/Đặt Hàng (`ACCEPTED`).
  - Thanh lọc đa năng: Tìm kiếm theo mã báo giá & tên khách hàng, lọc theo trạng thái (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`), lọc theo loại báo giá (`SET`, `MOLD`, `TRAY`).
  - Bảng dữ liệu: Cột mã báo giá dạng clickable monospace link sang trang chi tiết, nút 1-click **PDF** tải trực tiếp báo giá.
  - Nút **+ 新規見積作成 (Tạo báo giá mới)** mở Modal tạo báo giá.

---

## 2. HẠNG MỤC 2: ENGINE TÍNH GIÁ TỰ ĐỘNG (`quotation-engine.ts`)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/lib/quotation-engine.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/lib/quotation-engine.ts)
- **2 Hàm tính toán cốt lõi:**
  1. `calculateMoldPrice(designRevision)`:
     - Tính thể tích phôi nhôm: $(\text{length} \times \text{width} \times \text{height}) \div 1000 \text{ cm}^3 \times \text{đơn giá nhôm phôi}$.
     - Chi phí gia công CNC phôi nhôm: $\text{diện tích mặt} \times \text{rate CNC} + \text{cavity\_count} \times \text{phí cavity}$.
     - Phụ phí dao cắt riêng (`CUTTER_SEPARATE` vs `CUTTER_INLINE`) và phụ phí Plug trợ lực.
     - Trả về: `{ moldBasePrice, cutterPrice, plugPrice, totalToolingPrice, breakdownSummary }`.
  2. `calculateTrayUnitPrice(designRevision)`:
     - Tính diện tích màng tiêu hao/shot = $\text{machine\_feed\_pitch} \times \text{sheet\_width}$.
     - Diện tích màng/khay = $\text{diện tích/shot} \div \text{cavity\_count}$.
     - Trọng lượng khay nhựa (Gram) = $\text{diện tích} \times \text{thickness} \times \text{density} \times (1 + \text{scrap\_rate})$.
     - Chi phí nguyên vật liệu nhựa + Chi phí dập máy + Chi phí đóng gói $\rightarrow$ Đơn giá sản xuất & Đơn giá bán đề xuất.
     - Trả về: `{ weightPerPcsGrams, rawMaterialCostPerPcs, formingProcessCostPerPcs, packingCostPerPcs, suggestedSellingPrice }`.

---

## 3. HẠNG MỤC 3: XUẤT PDF BÁO GIÁ 見積書 CHUẨN NHẬT BẢN

### 🎯 Vị trí & Chức năng
- **Mã nguồn:**
  - API Route: [`src/app/api/quotations/[id]/pdf/route.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/quotations/[id]/pdf/route.ts)
  - PDF Template: [`src/app/orders/quotations/_components/QuotationPDFDocument.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/quotations/_components/QuotationPDFDocument.tsx)
- **Thiết kế chuẩn Form Nhật Bản (A4 Portrait):**
  - Tiêu đề văn bản: **御 見 積 書** (căn giữa, trang trọng).
  - Góc trái: Tên công ty khách hàng + Kính ngữ **御中 (Onchuu)**, Ngày báo giá, Tiêu đề dự án.
  - Góc phải: Thông tin Công ty YSD, Địa chỉ, Số điện thoại, Tên người phụ trách, **Khung đóng dấu Hanko 3 ô (承認 / 審査 / 担当)**.
  - Banner nổi bật: **御見積金額合計 (税込): ¥ XXX,XXX -**.
  - Bảng chi tiết hạng mục: `No | 種別 | 品名・仕様・規格 | 数量 | 単価 (¥) | 金額 (¥)`.
  - Tổng kết giá trị: Tiểu kế trước thuế (小計), Thuế tiêu thụ 10% (消費税 10%), Tổng cộng sau thuế (合計金額 税込).
  - Điều khoản thương mại chuẩn: Địa điểm giao hàng, Điều kiện thanh toán, Thời gian giao hàng, Quy định biến động giá hạt nhựa.

---

## 4. HẠNG MỤC 4: MODAL TẠO MỚI & TRANG CHI TIẾT BÁO GIÁ

- **CreateQuotationModal:** [`src/app/orders/quotations/_components/CreateQuotationModal.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/quotations/_components/CreateQuotationModal.tsx)
  - Cho phép chọn Khách hàng $\rightarrow$ Chọn Sản phẩm $\rightarrow$ Bấm nút **仕様から自動計算 (Auto-Calculate)** $\rightarrow$ Tự động sinh đầy đủ các dòng báo giá khuôn, dao, plug, khay nhựa và lưu vết thông số CAD vào `extra_json`.
- **QuotationDetailPage:** [`src/app/orders/quotations/[id]/page.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/quotations/[id]/page.tsx)
  - Xem và chỉnh sửa trực tiếp báo giá, cập nhật trạng thái (`DRAFT` $\rightarrow$ `SENT` $\rightarrow$ `ACCEPTED` / `REJECTED`), xuất PDF, hiển thị thông số CAD đã áp dụng.
- **QuotationLineEditor:** [`src/app/orders/quotations/_components/QuotationLineEditor.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/quotations/_components/QuotationLineEditor.tsx)
  - Cho phép thêm/sửa/xóa dòng chi tiết với tính năng tự động nhân thành tiền và tính thuế 10%.

---

## 5. KIỂM THỬ KỸ THUẬT & ĐA NGÔN NGỮ

| Kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | ✅ **0 errors** | Tuân thủ 100% schema và types từ `database.types.ts` |
| **Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` | ✅ **0 missing keys** | Đã khai báo đầy đủ các keys trong namespace `Quotations` |

### 📸 Kết quả Terminal Thực Tế:
```
$ node scripts/check_translations.mjs
🔍 Scanning files for missing translation keys...
✅ All translation keys are properly defined in both ja.json and vi.json
```

---

Kính trình Trưởng dự án PE nghiệm thu Sprint R4-S1 để sẵn sàng mở tiếp **Sprint R4-S2 (Phân Hệ Giao Hàng & In Phiếu Giao 納品書 `/orders/shipments`)**!
