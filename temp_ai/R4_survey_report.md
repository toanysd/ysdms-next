# BÁO CÁO KHẢO SÁT TOÀN DIỆN HỆ THỐNG & ĐỀ XUẤT ĐỊNH HƯỚNG PHASE R4 (R4-A SURVEY REPORT)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày lập:** 2026-08-20
- **Mục tiêu:** Rà soát toàn bộ nợ kỹ thuật (Technical Debt), đánh giá các module nghiệp vụ còn thiếu/yếu trong hệ thống, và đề xuất danh mục ưu tiên triển khai cho **Phase R4**.

---

## 1. DANH SÁCH NỢ KỸ THUẬT (TECHNICAL DEBT)

### 1.1. Tồn đọng bảng DEPRECATED (`physical_molds`, `cutters`, `auxiliary_equipments`)
Mặc dù kiến trúc **Unified SSOT `equipment` (ADR-001)** đã được áp dụng triệt để trong Phase R1, R2, R3 (ở `Product Center`, `EquipmentSetMatrix`, `ToolingGroupedJobCard`, `MoldJobGantt`), qua rà soát toàn bộ codebase, AN phát hiện **18 files legacy** vẫn còn query trực tiếp bảng `physical_molds` hoặc `cutters`:

- **Actions & Backend:**
  - `src/app/actions/dashboard.ts` (query `physical_molds`)
  - `src/app/actions/production.ts` (query `physical_molds`)
  - `src/app/dashboard/loading-board/_actions/board.ts` (query `physical_molds`)
  - `src/app/production/molds/actions.ts` (query `physical_molds`)
- **Pages & Components Cũ:**
  - `src/app/production/molds/page.tsx` & `UnifiedMoldDrawer.tsx`
  - `src/app/equipment/aluminum/page.tsx` & `LocationTab.tsx`
  - `src/app/engineering/designs/revisions/[id]/page.tsx`
  - `src/components/equipment/DesignPhysicalMoldsList.tsx`, `MoldModal.tsx`, `QuickLinkMoldModal.tsx`

👉 **Đánh giá rủi ro:** Tạo ra 2 màn hình quản lý khuôn song song (`/equipment/unified` chuẩn ADR-001 vs `/production/molds` cũ), gây phân mảnh dữ liệu nếu người dùng thao tác ở trang cũ.

### 1.2. Biến đặt tên `customer_id` thay vì `company_id`
- Schema database V3 đã chuẩn hóa `company_id` là khóa ngoại duy nhất trỏ tới `companies` (loại bỏ bảng `customers` cũ).
- Tuy nhiên tại một số form như `src/app/cases/new/page.tsx`, `src/app/production/products/upsert-actions.ts`, biến form và interface TypeScript vẫn khai báo `customer_id` rồi map thủ công sang `company_id`.

### 1.3. Chuỗi Hardcoded chưa qua `next-intl` (i18n)
- Một số trang cũ trong `/reports/orders/page.tsx`, `/equipment/aluminum/page.tsx`, `/docs/_components/DocsViewer.tsx` vẫn còn lẫn text song ngữ hardcode thay vì gọi `t('key')`.

### 1.4. Ép kiểu TypeScript (`any` / `unknown`)
- Tại `src/app/product-center/[id]/_components/TabOverview.tsx` (hơn 2400 dòng code tích lũy từ các phase trước), còn tồn tại nhiều vị trí ép kiểu `as unknown as OrderLineItem[]` hoặc `any` khi xử lý nested joins của Supabase.

---

## 2. CÁC MODULE CHƯA CÓ HOẶC CÒN YẾU (BUSINESS PROCESS GAPS)

Đối chiếu với quy trình nghiệp vụ thực tế nhà máy YSD (`docs/technical/01_business_process.md` & email thảo luận), các phân hệ sau đang cần được nâng cấp:

| Phân hệ / Route | Hiện trạng mã nguồn | Khoảng trống nghiệp vụ (Gaps) | Tác động vận hành |
|---|---|---|---|
| **1. Quản Lý Báo Giá (`/orders/quotations`)** | Mới có giao diện danh sách cơ bản, chưa có form tính giá động. | • Chưa có công cụ tính tự động giá khuôn (dựa trên kích thước, số cavity, loại nhôm A5052/SKD11).<br>• Chưa tính tự động đơn giá khay nhựa (dựa trên khổ màng, bước tiến máy, định mức cuộn nhựa).<br>• Chưa xuất được file PDF Báo Giá (見積書) theo form chuẩn Nhật Bản. | 🔴 **Rất cao** (Kinh doanh phải làm báo giá Excel thủ công ngoài hệ thống). |
| **2. Quản Lý Giao Hàng & Xuất Hàng (`/orders/shipments`)** | Bảng `shipments` đã có trong DB nhưng UI trang còn sơ khai. | • Chưa có luồng tạo đợt xuất hàng 1-click từ đơn hàng (`order_lines`).<br>• Chưa trừ lũy kế tồn đọng (Backlog Qty).<br>• Chưa xuất và in Phiếu Giao Hàng (納品書 / 納品受領書) kèm dấu Hanko và QR Code bàn giao tài xế xe tải. | 🔴 **Rất cao** (Kho vận và giao hàng cần phiếu giấy ký nhận). |
| **3. Lịch Trình Ép Định Hình (`/production/schedule` - Thermoforming Machine Planning)** | Hiện mới chỉ có Gantt lịch gia công khuôn (`MoldJobGantt.tsx`). | • Chưa có Gantt lịch chạy máy ép định hình dập khay (Máy ép 1, Máy ép 2, Máy ép 3...).<br>• Chưa kết nối Lệnh dập khay với cuộn nhựa xuất xưởng (`plastic_receipt_roll`) và bộ khuôn SET (`equipment_assignments`). | 🟠 **Cao** (Điều độ xưởng ép nhựa định hình). |
| **4. Kiểm Kê Tài Sản Khuôn & Thiết Bị (`/equipment/lifecycle` - 棚卸)** | Đã có màn hình hiển thị danh sách kiểm kê. | • Chưa tối ưu giao diện quét mã QR trên điện thoại thông minh khi thủ kho đi kiểm kê thực tế tại các giá kệ tầng kho. | 🟡 **Trung bình** (Kiểm kê định kỳ hàng tháng/quý). |
| **5. Mobile / Tablet Responsive** | Các bảng dữ liệu lớn (Gantt, Data Tables) hiển thị tốt trên Desktop. | • Cần bổ sung chế độ Card View compact khi xem trên điện thoại hoặc máy tính bảng của đốc công xưởng. | 🟡 **Trung bình**. |

---

## 3. ĐỀ XUẤT DANH MỤC ƯU TIÊN CHO PHASE R4

Dựa trên phân tích tác động nghiệp vụ thực tế và độ phức tạp kỹ thuật, AN đề xuất **3 Hạng mục ưu tiên cao nhất cho Phase R4**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHƯƠNG ÁN TRIỂN KHAI PHASE R4 ĐỀ XUẤT (3 SPRINTS TUẦN TỰ)                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔴 SPRINT R4-S1: Phân Hệ Báo Giá & Xuất PDF 見積書 (/orders/quotations)               │
│  → Động cơ tính giá khuôn & giá khay từ CAD specs + Xuất PDF Báo Giá chuẩn Nhật Bản    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔴 SPRINT R4-S2: Phân Hệ Giao Hàng & In Phiếu Giao 納品書 (/orders/shipments)          │
│  → Tạo đợt xuất hàng, trừ Backlog + In Phiếu giao hàng (納品書 / 領収書)              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🟠 SPRINT R4-S3: Xóa Dứt Điểm Nợ Kỹ Thuật (physical_molds → Unified equipment)        │
│  → Refactor 18 file cũ, xóa bỏ hoàn toàn /production/molds cũ, đưa về 1 SSOT equipment │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết các Sprint đề xuất:

#### 🌟 Sprint R4-S1 (P0): Phân Hệ Báo Giá Bán Hàng & Xuất PDF Báo Giá (`/orders/quotations`)
- **Mục tiêu:** Xây dựng công cụ Báo giá hoàn chỉnh từ Khảo sát kỹ thuật CAD $\rightarrow$ Tính chi phí $\rightarrow$ Xuất bản in PDF 見積書.
- **Tính năng:**
  1. *Form Tính Giá Khuôn & Dao:* Tự động gợi ý chi phí theo diện tích phôi nhôm (`actual_length/width`), số cavity, và số giờ công thiết kế.
  2. *Form Tính Đơn Giá Khay Nhựa:* Tính toán lượng nhựa tiêu hao (Gram/khay = `cutline_length` $\times$ `cutline_width` $\times$ `thickness_mm` $\times$ tỷ trọng nhựa $\div$ `cavity_count`), cộng chi phí ép định hình và chi phí đóng thùng carton (`pieces_per_box`).
  3. *Xuất PDF 見積書 Chuẩn Form Nhật:* Hỗ trợ logo YSD, điều khoản thanh toán, thuế VAT 10% / 8%, và nút tải PDF trực tiếp.

#### 🌟 Sprint R4-S2 (P0): Phân Hệ Giao Hàng & In Phiếu Giao 納品書 (`/orders/shipments`)
- **Mục tiêu:** Quản lý vòng đời giao hàng khép kín từ Đơn hàng $\rightarrow$ Xuất xưởng $\rightarrow$ Biên bản bàn giao.
- **Tính năng:**
  1. *Giao diện Tạo Lô Giao Hàng (Shipment Dispatcher):* Chọn các dòng đơn hàng `order_lines` cần xuất, nhập số lượng xuất thực tế, tự động cập nhật trạng thái `SHIPPED` và tính lại `Backlog Qty`.
  2. *In Phiếu Giao Hàng (納品書 & 納品受領書):* Định dạng A4 chuẩn Nhật, hiển thị thông tin địa chỉ giao hàng (`delivery_sites`), số PO khách hàng (`customer_order_no`), số Lot, mã QR tra cứu, và ô đóng dấu Hanko người nhận.

#### 🌟 Sprint R4-S3 (P1): Dứt Điểm Nợ Kỹ Thuật (Clean Legacy `physical_molds` $\rightarrow$ Unified `equipment`)
- **Mục tiêu:** Xóa bỏ 100% việc sử dụng các bảng cũ trong 18 file, quy về duy nhất `equipment` theo đúng ADR-001.
- **Tính năng:**
  1. Refactor các trang `/production/molds` và `/equipment/molds` chuyển hướng trực tiếp sang `/equipment/unified` và `/product-center`.
  2. Rà soát chuẩn hóa toàn bộ `customer_id` $\rightarrow$ `company_id`.
  3. Quét sạch các chuỗi hardcode còn sót bằng `check_translations.mjs`.

---

Kính trình Trưởng dự án PE đánh giá báo cáo khảo sát R4-A để phê duyệt định hướng triển khai Phase R4!
