# BÁO CÁO REVIEW SPRINT R3-S1 (CHỈ THỊ #009)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày hoàn thành:** 2026-08-20
- **Phạm vi:** Sprint R3-S1 — Quick KPI Bar + Tab 5 Orders/Shipments (4 thẻ KPI)
- **Trạng thái:** ✅ **HOÀN THÀNH 100% — SẴN SÀNG CHO PE REVIEW**

---

## 1. HẠNG MỤC 1: TẠO COMPONENT `ProductKPIBar.tsx`

### 🎯 Vị trí & Chức năng
- **Vị trí:** Được gắn ngay trên thanh 6 Tab buttons tại [`src/app/product-center/[id]/page.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/page.tsx).
- **Mã nguồn component:** [`src/app/product-center/[id]/_components/ProductKPIBar.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/ProductKPIBar.tsx).
- **Cơ chế tải dữ liệu:** 4 truy vấn song song bất đồng bộ qua `Promise.all`:
  1. **⚙️ SET設備 (Độ đầy đủ bộ gá lắp):** Quét qua `design_revisions` $\rightarrow$ `equipment` (Khuôn chính) $\rightarrow$ `equipment_assignments` để đếm số loại thiết bị khả dụng trên 8 loại chuẩn (`MOLD`, `CUTTER_SEPARATE`, `CUTTER_INLINE`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG`). Hiển thị `X/8`.
  2. **🧪 試作判定 (Đánh giá mẫu thử):** Đọc bản ghi mới nhất từ `sample_requests.result_status` (`✓ 合格 (OK)`, `✕ 不合格 (NG)`, `🚚 送付済`, `⚙️ 試作中`, hoặc `—`).
  3. **📦 総受注 (Tổng đặt lũy kế):** Tính `SUM(order_lines.quantity)` theo `product_id`.
  4. **⏱️ 実績工数 (Tổng giờ công thực tế):** Tính `SUM(work_logs.hours_spent)` từ tất cả các `jobs` của sản phẩm.

---

## 2. HẠNG MỤC 2: NÂNG CẤP TAB 5 `TabOrders.tsx` VỚI 4 THẺ KPI

### 🎯 Vị trí & Chức năng
- **Mã nguồn component:** [`src/app/product-center/[id]/_components/TabOrders.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/TabOrders.tsx).
- **4 Thẻ KPI Phía Trên Bảng Đơn Hàng:**
  1. **📦 総受注量 (Tổng Đặt):** `totalOrderedQty` (pcs) kèm tổng số dòng đơn hàng `order_lines`.
  2. **🚚 出荷完了数 (Đã Xuất):** `totalShippedQty` (pcs) từ các đơn đã có trạng thái `SHIPPED`.
  3. **⏳ 未出荷残 (Tồn Đọng / Backlog):** `backlogQty = Math.max(0, totalOrderedQty - totalShippedQty)` (pcs) — Tự động cảnh báo `⚠️ 未出荷残あり` khi còn tồn đọng hoặc `✓ 残なし` khi đã xuất đủ.
  4. **📋 進行中注文 (Đơn Hàng Đang Mở):** Đếm số đơn hàng có trạng thái `NEW`, `CONFIRMED`, `IN_PRODUCTION`.
- **Tuân thủ Schema SSOT:** Sử dụng `orders.company_id` (không dùng `customer_id`), liên kết 2 cấp chuẩn xác.

---

## 3. KIỂM THỬ KỸ THUẬT & ĐA NGÔN NGỮ

| Kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | ✅ **0 errors** | Tuân thủ 100% schema types từ `database.types.ts` |
| **Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` | ✅ **0 missing keys** | Đã khai báo đầy đủ keys `kpiTotalOrders`, `kpiDelivered`, `kpiBacklogOrders`, `kpiOpenOrdersCount`, `kpiSetCompleteness`, `kpiSampleVerdict` trong cả `ja.json` và `vi.json` |

---

## 4. BƯỚC TIẾP THEO (CHỜ PE REVIEW)

Sau khi PE xác nhận nghiệm thu Sprint R3-S1, AN sẵn sàng chuyển sang:
- **Sprint R3-S2 (🟠 Cao):**
  - Tab 3 `TabDesignsEquipment.tsx`: Thêm Ma Trận Gá Lắp Bộ Thiết Bị 8 Món (`EquipmentSetMatrix` từ `equipment_assignments` theo ADR-001).
  - Tab 6 `TabRelatedInfo.tsx`: Thêm Thẻ Tồn Kho Cuộn Nhựa Khả Dụng (`MatchingMaterialStock` từ `plastic_receipt_roll`).
