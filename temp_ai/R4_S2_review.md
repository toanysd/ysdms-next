# BÁO CÁO REVIEW SPRINT R4-S2 (CHỈ THỊ #016)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày hoàn thành:** 2026-08-20
- **Phạm vi:** Sprint R4-S2 — Phân Hệ Giao Hàng 納品書 (Quản Lý Xuất Hàng + Tạo Đợt Giao Hàng 1-Click + Tự Động Tính Backlog + Xuất PDF 納品書 / 受領書 Chuẩn Nhật Bản)
- **Trạng thái:** ✅ **HOÀN THÀNH 100% — SẴN SÀNG CHO PE NGHIỆM THU**

---

## 1. HẠNG MỤC 1: TRANG DANH SÁCH GIAO HÀNG (`/orders/shipments`)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/app/orders/shipments/page.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/shipments/page.tsx)
- **Luồng Query:**
  ```typescript
  supabase.from('shipments')
    .select(`
      shipment_id, delivery_note_no, ship_date, status,
      delivery_method, tracking_no, shipment_type, notes,
      orders:orders!shipments_order_id_fkey (
        order_id, order_no,
        companies:companies!orders_company_id_fkey ( company_name, company_code )
      ),
      delivery_sites:delivery_sites!shipments_delivery_site_id_fkey ( site_id, site_name, site_address ),
      employees:employees!shipments_shipped_by_fkey ( employee_name )
    `)
    .order('ship_date', { ascending: false })
  ```
- **Giao diện & Tiện ích:**
  - 3 thẻ KPI đầu trang: Tổng Số Đợt Xuất (`totalShipments`), Đang Chuẩn Bị (`PREPARING`), Đã Xuất / Đã Giao (`SHIPPED` / `DELIVERED`).
  - Bộ lọc: Tìm kiếm theo mã phiếu `delivery_note_no`, mã đơn `order_no`, tên khách hàng hoặc xưởng giao, lọc theo trạng thái.
  - Bảng dữ liệu: Cột mã phiếu giao hàng dạng clickable monospace link sang trang chi tiết, nút 1-click **納品書** tải file PDF.
  - Nút **+ 新規出荷登録 (Tạo đợt xuất hàng)** mở `CreateShipmentModal`.

---

## 2. HẠNG MỤC 2: MODAL XUẤT HÀNG 1-CLICK (`CreateShipmentModal.tsx`)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/app/orders/shipments/_components/CreateShipmentModal.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/shipments/_components/CreateShipmentModal.tsx)
- **Luồng 3 Bước Tích Hợp & Atomic Commit:**
  - *Bước 1:* Chọn Đơn hàng đang mở (`orders`).
  - *Bước 2:* Checkbox chọn các dòng `order_lines` cần xuất lần này (hiển thị mã sản phẩm, tên, số lượng, quy cách đóng gói).
  - *Bước 3:* Xác nhận Địa điểm nhà máy nhận hàng `delivery_sites`, Phương thức vận chuyển (Xe tải YSD / Tuyến chuyển phát), Mã vận đơn / Biển số xe, Ngày xuất hàng.
- **Thực thi Atomic:**
  1. `INSERT INTO shipments` với mã phiếu tự sinh chuẩn `DN-YYMM-XXX`.
  2. `UPDATE order_lines SET line_status = 'DELIVERED', ship_date = shipDate` cho các dòng được chọn.
  3. Tự động kiểm tra: Nếu toàn bộ dòng của đơn hàng đã chuyển sang `DELIVERED` $\rightarrow$ `UPDATE orders SET order_status = 'COMPLETED'`.
  4. Cơ chế Rollback an toàn: Tự động xóa bản ghi `shipments` nếu cập nhật dòng thất bại.

---

## 3. HẠNG MỤC 3: TRANG CHI TIẾT & XUẤT PDF 納品書 / 納品受領書 CHUẨN NHẬT BẢN

### 🎯 Vị trí & Chức năng
- **Mã nguồn:**
  - Trang chi tiết: [`src/app/orders/shipments/[id]/page.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/shipments/[id]/page.tsx)
  - PDF Template: [`src/app/orders/shipments/_components/ShipmentPDFDocument.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/shipments/_components/ShipmentPDFDocument.tsx)
  - API Route: [`src/app/api/shipments/[id]/pdf/route.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/shipments/[id]/pdf/route.ts)
- **Thiết kế Đôi (Dual-Section) A4 Portrait Chuẩn Nhật Bản:**
  - **Nửa trên:** **納 品 書 (Delivery Note - Bản lưu/giao)**.
  - **Đường cắt (Dashed Line):** Phân chia 2 liên tiện xé rời.
  - **Nửa dưới:** **納 品 受 領 書 (Delivery Receipt - Bản ký nhận gửi lại YSD)**.
  - Thông tin khách hàng + Địa chỉ xưởng giao hàng (`delivery_sites`) + Kính ngữ **御中**.
  - Bảng danh mục sản phẩm: `No | 品番・製品コード | 品名・仕様 | 出荷数量 | 単位 | 荷姿・梱包`.
  - Khung đóng dấu Hanko 3 ô: **承認 (Phê duyệt) | 出荷担当 (Thủ kho) | 受領印 (Chữ ký khách nhận)**.
  - Dòng cam kết nhận hàng và ngày ký nhận.

---

## 4. KIỂM THỬ KỸ THUẬT & ĐA NGÔN NGỮ

| Kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | ✅ **0 errors** | Tuân thủ 100% schema và types từ `database.types.ts` |
| **Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` | ✅ **0 missing keys** | Đã khai báo đầy đủ các keys trong namespace `Shipments` |

---

Kính trình Trưởng dự án PE nghiệm thu Sprint R4-S2 để chuẩn bị bước sang **Sprint R4-S3 (Dọn Dẹp Nợ Kỹ Thuật Bảng Cũ `physical_molds` $\rightarrow$ Unified `equipment`)**!
