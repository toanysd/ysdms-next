# BÁO CÁO KHẢO SÁT NỢ KỸ THUẬT LEGACY (R4-S3-A AUDIT REPORT)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày khảo sát:** 2026-08-20
- **Phạm vi:** Sprint R4-S3 — Dọn Dẹp Nợ Kỹ Thuật (Bảng cũ `physical_molds` & `cutters`, `customer_id`, Route Legacy `/production/molds`, Metrics `TabOverview.tsx`)
- **Trạng thái:** ✅ **HOÀN THÀNH AUDIT — TRÌNH PE PHÊ DUYỆT DANH SÁCH SỬA/XÓA**

---

## 1. HẠNG MỤC 1: DANH SÁCH FILE TRUY VẤN TRỰC TIẾP `physical_molds` & `cutters`

Qua quét toàn bộ thư mục `src/`, phát hiện **21 files** đang thực hiện lệnh truy vấn trực tiếp `.from('physical_molds')` hoặc `.from('cutters')` (vi phạm SSOT bảng `equipment` theo ADR-001):

### 📂 A. Server Actions (5 files)
| # | File Path | Truy vấn bảng cũ | Đề xuất giải pháp R4-S3-B |
|---|---|---|---|
| 1 | `src/app/actions/dashboard.ts` | `physical_molds` | Chuyển sang `.from('equipment').eq('equipment_type', 'MOLD')` |
| 2 | `src/app/actions/production.ts` | `physical_molds` | Chuyển sang `.from('equipment').eq('equipment_type', 'MOLD')` |
| 3 | `src/app/dashboard/loading-board/_actions/board.ts` | `physical_molds` | Chuyển sang `.from('equipment').eq('equipment_type', 'MOLD')` |
| 4 | `src/app/production/molds/actions.ts` | `physical_molds` | Legacy action $\rightarrow$ Khử bỏ hoặc chuyển sang `equipment` |
| 5 | `src/app/equipment/_components/detail-modal/modules/CheckInOutModule.tsx` | `physical_molds`, `cutters` | Chuyển sang `.from('equipment')` |

### 📂 B. Pages & Detail Views (8 files)
| # | File Path | Truy vấn bảng cũ | Đề xuất giải pháp R4-S3-B |
|---|---|---|---|
| 6 | `src/app/engineering/designs/revisions/[id]/page.tsx` | `physical_molds` | Chuyển sang join `equipment` |
| 7 | `src/app/equipment/aluminum/page.tsx` | `physical_molds` | Chuyển sang `equipment` |
| 8 | `src/app/equipment/molds/[id]/tabs/LocationTab.tsx` | `physical_molds` | Chuyển sang `equipment` |
| 9 | `src/app/equipment/molds/[id]/tabs/TransferTab.tsx` | `physical_molds` | Chuyển sang `equipment` |
| 10 | `src/app/equipment/_components/detail-modal/modules/LocationMoveModule.tsx` | `physical_molds` | Chuyển sang `equipment` |
| 11 | `src/app/product-center/[id]/_components/SectionEquipment.tsx` | `physical_molds` | Đã có `equipment_assignments` ở R3-S2 $\rightarrow$ gỡ bỏ query fallback cũ |
| 12 | `src/app/product-center/[id]/_components/TabOverview.tsx` | `physical_molds` | Chuyển sang join `equipment` |
| 13 | `src/app/production/mold-orders/page.tsx` | `physical_molds` | Chuyển sang `equipment` |

### 📂 C. Thư mục Legacy `/production/molds/` (4 files)
| # | File Path | Truy vấn bảng cũ | Đề xuất giải pháp R4-S3-B |
|---|---|---|---|
| 14 | `src/app/production/molds/page.tsx` | `physical_molds` | **Redirect 308 sang `/equipment/molds`** |
| 15 | `src/app/production/molds/designs/_components/RelocateModal.tsx` | `physical_molds` | Component cũ của `/production/molds` |
| 16 | `src/app/production/molds/_components/MoldDetailPanel.tsx` | `physical_molds` | Component cũ của `/production/molds` |
| 17 | `src/app/production/molds/_components/UnifiedMoldDrawer.tsx` | `physical_molds` | Component cũ của `/production/molds` |

### 📂 D. Shared Components (4 files)
| # | File Path | Truy vấn bảng cũ | Đề xuất giải pháp R4-S3-B |
|---|---|---|---|
| 18 | `src/components/equipment/DesignPhysicalMoldsList.tsx` | `physical_molds` | Refactor sang `equipment` |
| 19 | `src/components/equipment/MoldModal.tsx` | `physical_molds` | Refactor sang `equipment` |
| 20 | `src/components/equipment/QuickLinkMoldModal.tsx` | `physical_molds` | Refactor sang `equipment` |
| 21 | `src/components/equipment/RealtimeReferencePanel.tsx` | `physical_molds` | Refactor sang `equipment` |

---

## 2. HẠNG MỤC 2: KHẢO SÁT 10 FILE SỬ DỤNG `customer_id`

Tất cả 10 file dưới đây chỉ sử dụng `customer_id` như **biến state / form payload ở tầng UI**, không vi phạm schema DB (cột DB thực tế là `company_id`):

| # | File | Chi tiết sử dụng | Đề xuất R4-S3-B |
|---|---|---|---|
| 1 | `src/app/actions/order.ts` (L162) | `customer_id: data.customer_id` | Chuẩn hóa form payload sang `company_id` |
| 2 | `src/app/actions/production.ts` (L71) | `customer_id: order.company_id` | Mapping alias $\rightarrow$ giữ nguyên hoặc đổi tên biến |
| 3 | `src/app/actions/reports.ts` (L127) | `customer_id: o.company_id` | Mapping alias $\rightarrow$ chuẩn hóa biến |
| 4 | `src/app/cases/new/page.tsx` (L29, 64, 146) | State form `form.customer_id` | Đổi state name thành `form.company_id` |
| 5 | `src/app/cases/[id]/types.ts` (L69) | Type interface `customer_id?: string` | Giữ alias để tương thích ngược |
| 6 | `src/app/docs/_components/DocsViewer.tsx` (L122, 135) | Tài liệu hiển thị text | Cập nhật text tài liệu thành `company_id` |
| 7 | `src/app/production/molds/designs/_components/DesignCenterClient.tsx` (L9, 32) | Prop table | Thuộc module legacy `/production/molds` |
| 8 | `src/app/production/products/_components/UnifiedTrayDrawer.tsx` (L29, 46, 129) | State form | Chuẩn hóa state sang `company_id` |
| 9 | `src/app/production/products/upsert-actions.ts` (L10, 31, 41) | Payload validation `payload.customer_id` | Cập nhật validation nhận cả `company_id` |
| 10 | `src/app/reports/orders/page.tsx` (L19) | `orders.map(o => o.customer_id)` | Đổi thành `o.company_id` |

---

## 3. HẠNG MỤC 3: KHẢO SÁT ROUTE LEGACY `/production/molds`

- **Trạng thái thư mục:** `src/app/production/molds/` ĐANG TỒN TẠI (gồm `page.tsx`, `actions.ts`, `_components/`, `designs/page.tsx`).
- **Liên kết điều hướng:**
  - `Sidebar.tsx`: **KHÔNG CÓ LINK** đến `/production/molds` (Sidebar đang dẫn đúng `/equipment/molds`).
  - `Topbar.tsx`: **KHÔNG CÓ LINK** đến `/production/molds`.
- **Đề xuất xử lý an toàn theo chỉ thị PE:**
  - Giữ lại thư mục nhưng thay thế nội dung `src/app/production/molds/page.tsx` và `src/app/production/molds/designs/page.tsx` bằng `redirect('/equipment/molds')` (Next.js 308 Permanent Redirect) để nếu người dùng bookmark link cũ sẽ tự động chuyển hướng mượt mà sang trang thiết bị mới.

---

## 4. HẠNG MỤC 4: ĐÁNH GIÁ `TabOverview.tsx` (Product Center)

- **Tổng số dòng:** **2,453 dòng**.
- **Số lần sử dụng `as any` / `as unknown`:** **11 vị trí**.
- **Vị trí cụ thể của các `as any`:**
  - 4 vị trí ép kiểu khi đọc quan hệ lồng `design_revisions` $\rightarrow$ `equipment_assignments`.
  - 3 vị trí ép kiểu đọc thông số màng cuộn `plastic_receipt_roll`.
  - 4 vị trí ép kiểu dữ liệu form chỉnh sửa nhanh (Quick Edit modal).
- **Đề xuất xử lý:** Tuân thủ chỉ thị PE: **KHÔNG refactor toàn bộ file 2453 dòng**; chỉ thay thế 11 vị trí `as any` bằng type guards và interface định nghĩa rõ ràng.

---

Kính trình Trưởng dự án PE xem xét và phê duyệt danh sách trên để AN tiến hành triển khai **Sprint R4-S3-B (Thực thi dọn dẹp nợ kỹ thuật)**!
