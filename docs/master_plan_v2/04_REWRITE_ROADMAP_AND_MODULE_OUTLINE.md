# 🗺️ NHIỆM VỤ 4: KẾ HOẠCH TÁI CẤU TRÚC HỒ SƠ DỰ ÁN THEO MODULE (MODULAR DOSSIER) & LỘ TRÌNH TRIỂN KHAI TỔNG THỂ

- **Mã tài liệu:** `YSDMS-MPV2-04-MODULAR-ROADMAP`
- **Ngày lập:** `2026-10-14 JST`
- **Mục tiêu:** Thực thi chỉ thị của **Minh Chủ THOAN** về việc xây dựng mới bộ Hồ sơ & Kế hoạch Dự án theo kiến trúc **bóc tách từng module thành file riêng trong một thư mục chuyên biệt**, tối ưu hóa tuyệt đối Token Economy và làm nền tảng vững chắc để triển khai dứt điểm các hạng mục kỹ thuật tiếp theo.

---

## PHẦN I: THIẾT KẾ CẤU TRÚC THƯ MỤC HỒ SƠ DỰ ÁN PHÂN TÁCH THEO MODULE (`docs/dossier/`)

Thay vì gom toàn bộ quy tắc, schema, kế hoạch và lịch sử phiên vào các file đơn lẻ khổng lồ (`ysdms-nextgen_MASTER.md` 149.7 KB, `SESSION_HANDOFF.md` 90.4 KB, `SCHEMA_REFERENCE.md` 46.6 KB), toàn bộ hồ sơ dự án sẽ được tổ chức tại thư mục **`docs/dossier/`** với nguyên tắc:
1. **Mỗi file $\le 150$ dòng ($\le 6\text{ KB}$, tương đương $\sim 1,500\text{ tokens}$).**
2. **Làm việc ở Module nào $\rightarrow$ Chỉ đọc đúng File Schema và File Nghiệp vụ/Kế hoạch của Module đó.**
3. **Sửa đổi Kế hoạch ở đâu $\rightarrow$ Chỉ cập nhật đúng file của Module đó (không chạm vào các module khác).**

### Sơ đồ Cây Thư mục `docs/dossier/` Đề xuất:

```
docs/dossier/
├── 00_INDEX.md                              ← Chỉ mục gốc toàn dự án + Bản đồ trạng thái 10 Modules (<= 80 dòng)
├── 00_ACTIVE_HANDOFF.md                     ← Bàn giao phiên hiện tại (<= 80 dòng, ghi đè có kiểm soát, lịch sử cũ đẩy vào archive/)
│
├── 01_rules_and_conventions/                ← Bộ quy tắc tinh gọn (Không trùng lặp)
│   ├── R01_CORE_PROTOCOL_PE_THOAN_AN.md     ← QUY TẮC 0, RULE-PROC-01, RULE-PROC-02, Bridge v2.5.0
│   ├── R02_DATA_AND_SCHEMA_COMPLIANCE.md    ← RULE-DATA-01 (No Fallback), RULE-DATA-02 (SSOT Schema), Fuzzy Search
│   └── R03_UI_DESIGN_AND_I18N.md            ← Page Anatomy, Compact Header, Paper Style (RULE-UI-10), next-intl
│
├── 02_schema_modules/                       ← Bóc tách SCHEMA_REFERENCE.md (46.6 KB) thành 6 file sạch, 0 trùng lặp
│   ├── S00_SCHEMA_ERD_INDEX.md              ← Sơ đồ quan hệ tổng thể + Bảng tra cứu PK/FK & Bảng đã DROP/DEPRECATED
│   ├── S01_COMPANIES_AND_MASTER.md          ← companies, company_contacts, delivery_sites, employees, machines, racks, calendar
│   ├── S02_CASES_QUOTES_ORDERS.md           ← business_cases, technical_reviews, quotations, quotation_lines, orders, order_lines
│   ├── S03_PRODUCTS_AND_CAD_DESIGNS.md      ← products, design_revisions, cav_types
│   ├── S04_EQUIPMENT_SET_AND_CUSTODY.md     ← equipment, equipment_assignments, equipment_photos, equipment_loans, views/RPCs
│   ├── S05_WO_JOBS_NIPPO_PRODUCTION.md      ← work_orders, jobs, job_steps, work_logs, production_instructions
│   └── S06_SHIPMENTS_INVENTORY_FINANCE.md   ← shipments, v_product_stock_summary, plastic_*, invoices, invoice_lines, debt view
│
└── 03_business_modules/                     ← 10 File Kế hoạch & Đặc tả Nghiệp vụ độc lập theo từng Phân hệ
    ├── M01_BUSINESS_CASES_AND_REVIEWS.md    ← Phân hệ 1: Quản lý Sự việc (/cases) & Thẩm định Kỹ thuật
    ├── M02_QUOTATIONS_AND_PRICING_ENGINE.md ← Phân hệ 2: Báo giá (/orders/quotations), Ma trận Giá khuôn & 3 Trụ cột Giá khay
    ├── M03_ORDERS_AND_PRODUCTION_PIPE.md    ← Phân hệ 3: Đơn hàng (/orders) & Luồng chuyển đổi sang Work Order / Chỉ thị SX
    ├── M04_PRODUCT_CENTER_AND_CAD_DESIGN.md ← Phân hệ 4: Product Center (/product-center) & Thiết kế Bản vẽ (/engineering/designs)
    ├── M05_EQUIPMENT_UNIFIED_AND_SET.md     ← Phân hệ 5: Thiết bị Hợp nhất (/equipment/unified), Bộ SET 8 loại, Đặt phôi nhôm
    ├── M06_MOLD_JOBS_AND_SCHEDULE_GANTT.md  ← Phân hệ 6: Gia công Khuôn (/equipment/jobs, /equipment/schedule) & 3 Tracks MOLD/PLUG/CUTTER
    ├── M07_MOLD_CUSTODY_AUDIT_AND_LOANS.md  ← Phân hệ 7: Lưu giữ, Mượn trả, Kiểm kê JAE/Canon, Phí lưu kho Fujikura, Teflon, Pallet QR
    ├── M08_THERMOFORMING_FLOOR_AND_NIPPO.md ← Phân hệ 8: Định hình (/production/*) & Nhật ký Công việc (/worklogs, A4 Nippo)
    ├── M09_QUALITY_KCS_AND_SAMPLE_GATE.md   ← Phân hệ 9: Duyệt mẫu thử KCS, Kiểm tra chất lượng (/quality/*) & Truy xuất nguồn gốc
    └── M10_SHIPMENTS_WMS_AND_INVOICES.md    ← Phân hệ 10: Giao hàng 納品書 (/shipments), Kho Nhựa/Khay (/plastics, /inventory) & Công nợ
```

---

## PHẦN II: CẤU TRÚC CHUẨN CỦA MỖI FILE MODULE TRONG `docs/dossier/03_business_modules/`

Mỗi file `M01` $\rightarrow$ `M10` đều tuân thủ một khuôn mẫu 5 mục thống nhất (chỉ dài 80–120 dòng):
1. **Luồng Nghiệp vụ Thực tế Chuẩn (Real-World Business Specification):** Tóm tắt các quy tắc nghiệp vụ cốt lõi và các trường hợp đặc thù theo khách hàng (JAE, Canon, Panasonic, SMK, Shin-Ei, Minebea, Fujikura).
2. **Nguồn Dữ liệu SSOT (Tables, Views, RPCs):** Chỉ định chính xác tên bảng/cột và dẫn chiếu tới file `02_schema_modules/S0x_*.md`.
3. **Cấu trúc Route & Component Chuẩn (Canonical Routes):** Đường dẫn trên `Sidebar.tsx` và các component thuộc phân hệ.
4. **Trạng thái Hiện tại (Implemented & Verified):** Những gì đã làm xong và đã qua kiểm thử.
5. **Danh sách Hạng mục Cần Sửa / Nâng cấp (Open Action Items / Backlog của riêng Module đó):** Ghi rõ mã task, file cần sửa, dòng code liên quan.

---

## PHẦN III: LỘ TRÌNH 5 GIAI ĐOẠN (MASTER EXECUTION ROADMAP) ĐỂ CHUẨN HÓA TOÀN DIỆN HỆ THỐNG

Dựa trên kết quả Đối chiếu 3 Chiều tại [`03_THREE_WAY_AUDIT_GAPS_AND_CODEBASE_ISSUES.md`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/docs/master_plan_v2/03_THREE_WAY_AUDIT_GAPS_AND_CODEBASE_ISSUES.md), AN đệ trình lộ trình thi công tiếp theo gồm **5 Giai đoạn (Phases)** được sắp xếp theo mức độ ưu tiên từ gốc đến ngọn:

### 🚀 GIAI ĐOẠN A (`WO-DOC-MODULAR`): Tái cấu trúc Bộ Quy tắc & Khởi tạo Hồ sơ Dự án Modular (`docs/dossier/`)
- **Mục tiêu:** Giải quyết ngay bài toán Token Economy theo chỉ thị của Minh Chủ THOAN trước khi sửa code quy mô lớn.
- **Hạng mục thực thi:**
  1. Tinh gọn `AGENTS.md` và `.agents/AGENTS.md` (loại bỏ 100% đoạn lặp và thông tin bảng cũ, đảm bảo không còn bị `<truncated>` trong `<user_rules>`, giảm dung lượng nạp tự động từ 67.7 KB xuống < 12 KB).
  2. Bóc tách `SCHEMA_REFERENCE.md` thành 6 file chuyên biệt trong `docs/dossier/02_schema_modules/` (khử sạch các đoạn định nghĩa trùng lặp của `equipment_loans`, `orders`, `shipments` và cập nhật đúng CHECK constraint của Migration M28A).
  3. Khởi tạo 10 file hồ sơ phân hệ `M01` $\rightarrow$ `M10` trong `docs/dossier/03_business_modules/` và归档 (archive) các file kế hoạch cũ đã lỗi thời (`Phase1_MoldCutter_Migration_Plan.md`, `Phase2_ERP_Realignment_Plan.md`) vào `docs/archive/`.

### 🔧 GIAI ĐOẠN B (`WO-PIPE-FIX`): Khắc phục 6 Điểm Đứt Gãy Luồng Liên Thông Cốt Lõi (End-to-End Pipeline Restoration)
- **Mục tiêu:** Nối thông mạch dữ liệu từ `Sự việc (/cases)` $\rightarrow$ `Thẩm định Kỹ thuật` $\rightarrow$ `Báo giá (/orders/quotations)` $\rightarrow$ `Đơn hàng (/orders)` $\rightarrow$ `Thiết kế (/engineering/designs)` $\rightarrow$ `Work Order (/production/work-orders)` $\rightarrow$ `Chi tiết Job (/equipment/jobs/[id])`.
- **Hạng mục thực thi:**
  1. **Sửa `/cases/[id]` (Đứt gãy #1, #2, #4):**
     - Đổi truy vấn phân quyền từ bảng `profiles` sang `employees` (`src/app/cases/[id]/page.tsx:93`, `actions.ts:16`).
     - Thay thế 5 ô `<input type="text">` nhập UUID thô trong `TechnicalReviewForm.tsx:115-240` bằng `AsyncSearchableSelect` chọn trực tiếp Sản phẩm, Bản vẽ CAD, Khuôn, Dao cắt, Máy định hình + nút tạo nhanh Sản phẩm/Bản vẽ.
     - Chuẩn hóa `QuotationFormModal.tsx` & `SalesTab.tsx` trong `/cases/[id]` dùng đúng enum chữ hoa (`'DRAFT'`, `'SENT'`, `'APPROVED'`, `'CONVERTED'`) và tích hợp trực tiếp với Auto-Pricing Engine + PDF Engine chuẩn của `/orders/quotations`.
     - Kết nối Tab `production` trong `/cases/[id]/page.tsx:373-387` hiển thị danh sách `work_orders` và `jobs` có `case_id` tương ứng.
  2. **Sửa `/orders/quotations` (Đứt gãy #3):**
     - Cập nhật `CreateQuotationModal.tsx:331-340` truyền đầy đủ `product_id`, `design_revision_id` và `case_id` khi lưu `quotation_lines`, đảm bảo nút `受注確定` (`Convert to Order`) hoạt động trơn tru 100%.
  3. **Sửa `/engineering/designs/[moldMasterId]` (Đứt gãy #5):**
     - Sửa lỗi đọc `moldMaster?.products?.[0]` tại dòng `:263-268` để hiển thị đúng Mã SP, Tên SP và Khách hàng trên Header.
     - Bổ sung `'APPROVED'` vào `STATUS_OPTIONS` (dòng `:142`) để kỹ thuật viên có thể duyệt bản vẽ phục vụ `rpc_confirm_work_order`.
  4. **Khôi phục `/equipment/jobs/[id]` (Đứt gãy #6):**
     - Khôi phục giao diện chi tiết Job 4 Tabs (`OverviewTab`, `StepsTab`, `LogsTab`, `EditStepModal`) tại `/equipment/jobs/[id]/page.tsx`, và đặt nút `🖨️ In phiếu công việc A4` dẫn sang `/equipment/jobs/[id]/print`.

### 🧰 GIAI ĐOẠN C (`WO-MOLD-UNIFY`): Đồng bộ Toàn diện Phân hệ Phòng Khuôn & Bộ SET Thiết bị
- **Mục tiêu:** Xóa bỏ tình trạng phân mảnh dữ liệu tại Phòng Khuôn (`金型部`).
- **Hạng mục thực thi:**
  1. Chuyển toàn bộ 7 vị trí còn truy vấn bảng cũ `mold_design_cutters` (`EquipmentDetailModal.tsx`, `TabDesignsEquipment.tsx`, `TabOverview.tsx`, `Topbar.tsx`) sang đọc/ghi bảng chuẩn **`equipment_assignments`** (`SET_MEMBER` / `SHARED`).
  2. Chuẩn hóa phân loại thiết bị trên `/equipment/unified` (bổ sung filter `'PLUG'`) và `/equipment/molds` (tách rõ Khuôn `MOLD` với Đế nước `WATER_BASE` / Đế khí `PRESSURE_BASE`), thay thế trang tĩnh `/equipment/auxiliary` bằng chế độ lọc Thiết bị phụ trợ thực tế trên bảng `equipment`.
  3. Hợp nhất `/maintenance` (đang dùng cột cũ `mold_physical_id`) vào `/equipment/lifecycle` trên nền bảng `equipment` SSOT.

### 🧹 GIAI ĐOẠN D (`WO-ROUTE-CLEANUP`): Quy hoạch Lại Menu `Sidebar.tsx` & Dọn Dẹp Các Route Trùng Lặp / Mồ Côi
- **Mục tiêu:** Đảm bảo mỗi nghiệp vụ chỉ có **1 đường dẫn chuẩn duy nhất (Single Canonical Route)**, tuân thủ 100% `RULE-UI-1`, `next-intl` và `RULE 7.1 (Sort DESC)`.
- **Hạng mục thực thi:**
  1. Đưa `/production/work-orders` (Work Order SSOT) về đúng vị trí điều hành và gỡ bỏ/redirect trang legacy `/production/mold-orders` (đang dùng bảng cũ `mold_work_orders`) sau khi đối chiếu dữ liệu.
  2. Chuẩn hóa `/production-instructions` sang CSS Design System (`globals.css`) + đa ngôn ngữ `next-intl`.
  3. Chuyển hướng (redirect) các route trùng lặp (`/master/molds`, `/master/products`, `/master/cutters`, `/production/worklog`, `/production/inventory`, `/warehouse/rolls`) về các route chuẩn trên Sidebar (`/product-center`, `/equipment/cutting-dies`, `/worklogs`, `/inventory`, `/plastics/inventory`) và xây dựng trang Dashboard danh mục chuẩn cho `/master` (kết nối `/master/customers`, `/master/machines`, `/master/racks`, `/master/calendar`, `/master/employees`).

### 🧪 GIAI ĐOẠN E (`WO-SAMPLE-QC-GATE`): Hoàn thiện Cổng Duyệt Mẫu Thử KCS (`Sample Approval Gate`) & Biểu Mẫu Kiểm Tra Theo Khách Hàng
- **Mục tiêu:** Khép kín mắt xích nghiệp vụ thực tế từ email (`00_BUSINESS_INSIGHTS.md:96-100`, `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:182-204`).
- **Hạng mục thực thi:**
  1. Liên kết luồng `Dập thử mẫu (試作成形)` $\rightarrow$ `Đo kích thước KCS (/quality/inspection)` $\rightarrow$ `Duyệt mẫu (量産承認)` trước khi giải phóng lô hàng thương mại trên `/shipments`.
  2. Tích hợp cấu hình biểu mẫu kiểm tra & phiếu giao hàng đặc thù theo khách hàng (SMK in kèm Mold No & % nhựa tái chế `粉砕材含有率`, KYD `試験成績書`, Shin-Ei `専用伝票`).

---

## PHẦN IV: ĐỆ TRÌNH KIẾN TRÚC SƯ TRƯỞNG PE & MINH CHỦ THOAN PHÊ DUYỆT

AN kính trình **Minh Chủ THOAN** và **Kiến trúc sư trưởng PE** thẩm định bộ báo cáo phân tích 4 nhiệm vụ và phê duyệt cho phép AN bắt đầu thi công ngay từ **GIAI ĐOẠN A (`WO-DOC-MODULAR`: Tinh gọn Bộ Quy tắc `<user_rules>` & Khởi tạo Bộ Hồ sơ Dự án Modular `docs/dossier/`)** tiếp nối bằng **GIAI ĐOẠN B (`WO-PIPE-FIX`: Hàn gắn 6 điểm đứt gãy luồng liên thông)**.
