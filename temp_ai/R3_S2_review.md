# BÁO CÁO REVIEW SPRINT R3-S2 (CHỈ THỊ #010)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày hoàn thành:** 2026-08-20
- **Phạm vi:** Sprint R3-S2 — `EquipmentSetMatrix` trong Tab 3 & `MatchingMaterialStock` trong Tab 6
- **Trạng thái:** ✅ **HOÀN THÀNH 100% — SẴN SÀNG CHO PE REVIEW**

---

## 1. HẠNG MỤC 1: COMPONENT `EquipmentSetMatrix.tsx` (TAB 3)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/app/product-center/[id]/_components/EquipmentSetMatrix.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/EquipmentSetMatrix.tsx)
- **Tích hợp:** Đặt ngay bên dưới cây phả hệ CAD trong [`TabDesignsEquipment.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/TabDesignsEquipment.tsx).
- **Luồng Query Chuẩn Xác (Không có `product_id` trong `equipment_assignments`):**
  1. `products` $\rightarrow$ `design_revisions` (lấy `revision_id`).
  2. Lấy `equipment_id` của khuôn chính `MOLD` từ bảng `equipment`.
  3. Query `equipment_assignments` với `primary_equipment_id = moldEquipmentId` và `relationship_type IN ('SET_MEMBER', 'SHARED')`.
- **Hiển thị Lưới 8 Ô Chuẩn Hóa (`MOLD_TYPES_ORDER`):**
  `['MOLD', 'CUTTER_SEPARATE', 'CUTTER_INLINE', 'WATER_BASE', 'PRESSURE_BASE', 'FRAME', 'STACKING', 'PLUG']`
  - 🟢 **Có thiết bị + `SET_MEMBER` (hoặc Khuôn chính):** Badge xanh `専用 (Riêng)`.
  - 🟠 **Có thiết bị + `SHARED`:** Badge cam `共用 (Mượn dùng chung)`.
  - 🔴 **Không có thiết bị:** Badge đỏ `未装備 (Chưa trang bị)` kèm icon cảnh báo.
  - Mỗi ô hiển thị: Icon loại thiết bị, mã thiết bị (clickable link sang trang chi tiết thiết bị), tên hiển thị, trạng thái thiết bị.

---

## 2. HẠNG MỤC 2: COMPONENT `MatchingMaterialStock.tsx` (TAB 6)

### 🎯 Vị trí & Chức năng
- **Mã nguồn:** [`src/app/product-center/[id]/_components/MatchingMaterialStock.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/MatchingMaterialStock.tsx)
- **Tích hợp:** Đặt ngay trên đầu [`TabRelatedInfo.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/TabRelatedInfo.tsx).
- **Luồng Query:**
  - Lấy `plastic_type_designed` từ bản vẽ thiết kế mới nhất của sản phẩm.
  - Query `plastic_receipt_roll` (`status = 'in_stock'`) join `plastic_master` (`plastic_code`, `plastic_family`, `thickness_mm`, `width_mm`).
- **Xử lý Edge Cases:**
  - Nếu sản phẩm chưa có mã nhựa thiết kế $\rightarrow$ Hiển thị thông báo `材料コード未設定` dạng cảnh báo vàng, không query rỗng.
  - Nếu không có cuộn phù hợp trong kho $\rightarrow$ Hiển thị thông báo `該当する在庫ロールなし (Hết hàng/Thiếu cuộn)`.
- **Tổng hợp & Chi tiết:**
  - Ribbon tổng hợp: Tổng số cuộn khả dụng + Tổng chiều dài mét (`Σ current_length_m`) + Trạng thái sẵn sàng.
  - Bảng chi tiết cuộn: Mã barcode, quy cách nhựa, độ dày (mm), khổ (mm), chiều dài hiện tại (m), số Lot, vị trí kho kệ.

---

## 3. KIỂM THỬ KỸ THUẬT & ĐA NGÔN NGỮ

| Kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
|---|---|---|---|
| **TypeScript Compilation** | `npx tsc --noEmit` | ✅ **0 errors** | Tuân thủ 100% schema và types |
| **Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` | ✅ **0 missing keys** | Đã khai báo các keys `equipmentSetMatrix`, `matchingMaterialStock`, `equipmentOwned`, `equipmentShared`, `equipmentMissing`, `materialStockAvailable`, `materialCodeNotSet`, `totalRollsCount`, `totalLengthMeters`, `rollBarcode`, `materialSpec`, `currentLength`, `noMatchingRolls`, `setMatrixSubtitle` |

---

## 4. BƯỚC TIẾP THEO (CHỜ PE REVIEW)

Sau khi PE xác nhận nghiệm thu Sprint R3-S2, AN sẵn sàng chuyển sang:
- **Sprint R3-S3 (🟡 Trung bình):**
  - Nâng cấp toàn diện Tab 4 `TabJobs.tsx`: Chuyển đổi từ hiển thị phẳng sang Dashboard Lệnh Sản Xuất 4 cấp (`jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs`), tính toán % hoàn thành và so sánh Giờ kế hoạch (`estimated_hours`) vs Giờ thực tế (`actual_hours`).
