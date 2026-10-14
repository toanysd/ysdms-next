# 🔍 NHIỆM VỤ 3: ĐỐI CHIẾU 3 CHIỀU (NGHIỆP VỤ THỰC TẾ $\leftrightarrow$ KẾ HOẠCH ĐÃ LẬP $\leftrightarrow$ SCHEMA & MÃ NGUỒN / UI HIỆN TẠI)

- **Mã tài liệu:** `YSDMS-MPV2-03-THREE-WAY-AUDIT`
- **Ngày lập:** `2026-10-14 JST`
- **Phạm vi kiểm toán:** Đối chiếu chéo giữa Hồ sơ Nghiệp vụ Thực tế (`docs/mail_analysis/`, `docs/business/`, `docs/quotations/`), Các bản Kế hoạch cũ (`docs/00..02`, `Phase1`, `Phase2`, `PROJECT_STATUS.md`, `TECH_DEBT.md`, `ADR-001..014`), Schema DB (`SCHEMA_REFERENCE.md`), và 106 routes trong `src/app/` + `Sidebar.tsx`.

---

## PHẦN 0: KẾT QUẢ XÁC MINH SCHEMA THỰC TẾ (`information_schema`) & ĐỐI SOÁT PHƯƠNG ÁN C

1. **Danh sách bảng đã xác minh trực tiếp qua `information_schema.tables` (`table_schema = 'public'`, 127 bảng trên Supabase Production `iirezrszalmecsslbruo`):**
   - **TỒN TẠI (Đang sử dụng chính thức):** `profiles`, `employees`, `equipment`, `equipment_assignments`, `orders`, `order_lines`, `products`, `staging_order_lines_backfill`.
   - **TỒN TẠI trong Production nhưng CẤM DÙNG trong code mới (KHÔNG gọi là "đã DROP"):** `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.
   - **KHÔNG TỒN TẠI trong Production (`NOT_FOUND`):** `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`.
2. **Cơ chế Join & Đối soát chuẩn của Phương án C (`staging_order_lines_backfill` $\leftrightarrow$ `order_lines`):**
   - Cột `resolved_order_id` **KHÔNG tồn tại** trong `staging_order_lines_backfill`.
   - Cơ chế join đúng: `staging_order_lines_backfill.order_no = orders.order_no`, sau đó dùng `orders.order_id` để đối chiếu `order_lines.order_id`.
   - Kết quả đối soát chỉ-đọc (AN và PE đã xác minh độc lập lúc `2026-10-14 10:34:30 JST`): `staging_order_lines_backfill = 6,279` dòng; `order_lines = 6,279` dòng; `orders = 2,396`; `products = 8,489`; khớp `6,279 / 6,279` dòng theo `(order_id, line_no, product_id, quantity)`; `0` trùng lặp; `0` thiếu FK; `0` khoảng trống `line_no`; `PENDING = 6,277`, `NORMALIZED = 2`.

---

## PHẦN A: CÁC ĐIỂM CHƯA PHÙ HỢP / LỖI THỜI TRONG KẾ HOẠCH CŨ SO VỚI THỰC TẾ VẬN HÀNH

| STT | Tài liệu Kế hoạch Cũ (`file:line`) | Nội dung trong Kế hoạch Cũ | Thực tế Vận hành & Kiến trúc Hiện tại | Đánh giá Mức độ Lệch |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `docs/Phase1_MoldCutter_Migration_Plan.md:13-68, 103-164` | Lập kế hoạch trên các bảng V1: `mold_base`, `mold_design_revision`, `mold_physical`, `cutter_master`, `product_master`, `mold_teflon_logs`, `cutter_status_logs`. | Toàn bộ các bảng V1 này đã bị thay thế bởi kiến trúc V3 & Unified Equipment (`products`, `design_revisions`, `equipment`, `equipment_assignments`, `equipment_loans` theo `ADR-001`, `ADR-004`, `ADR-009`). | 🔴 **Lỗi thời** (Gây nhiễu nặng nếu AI đọc phải) |
| 2 | `docs/Phase2_ERP_Realignment_Plan.md:18-39` | Thiết kế luồng một chiều cứng nhắc: `Khách hàng/Đơn hàng -> Thiết kế Khay -> Tạo Khuôn/Dao -> Lên lịch -> Kanban -> Kho/MRP` trên bảng `product_master`, `mold_base`, `cutter_master`. | Thực tế tại YSD (`01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:20-36, 90-91`): Luồng bắt đầu từ **Sự việc (`business_cases`) $\rightarrow$ Thẩm định Kỹ thuật & Thiết kế sơ bộ $\rightarrow$ Báo giá $\rightarrow$ Chế tạo khuôn / Dập thử mẫu $\rightarrow$ Duyệt mẫu KCS $\rightarrow$ Đơn hàng & Sản xuất hàng loạt**, có nhánh lặp lại/cải tạo liên tục. | 🔴 **Sai lệch mô hình nghiệp vụ cốt lõi** |
| 3 | `docs/00_PROJECT_CHARTER.md:16-26`<br>`docs/01_BRD.md:49-55, 88-103, 172-176` | • Vẫn tách `Master Mold` và `Physical Mold` riêng biệt.<br>• Ghi nhận luồng `Email KH -> Đơn hàng (Order) -> Bản vẽ Design Revision` (đặt Order trước Design/Quote).<br>• Đặt mục Kế toán/Thu phí và chi nhánh Aomori vào `Out of Scope`. | • `Master Mold` đã hợp nhất vào `products`; `Physical Mold` hợp nhất vào `equipment` (`SCHEMA_REFERENCE.md:868-873`).<br>• Thực tế phải qua `Technical Review` + `Quotation` trước khi có `Order` chính thức.<br>• Nghiệp vụ Hóa đơn (`invoices`) và Thu phí bảo quản khuôn (`型保管料` Fujikura 307.5¥/tháng) đã được đưa vào phạm vi cốt lõi. | 🟠 **Lạc hậu so với kiến trúc V3 & Sprint P1** |
| 4 | `docs/02_BUSINESS_PROCESS.md:58-60, 84-90` | • Mô tả bảng `production_orders` liên kết `mold_material_bom` qua `bom_reference_mold_id`.<br>• Section 3 (Chỉ thị SX) và Section 4 (QC & Truy xuất Lô) để trống `⏳ Chờ thiết kế`. | Các bảng `mold_material_bom` không phải là SSOT trong `SCHEMA_REFERENCE.md`; luồng sản xuất chuẩn đã chuyển sang mô hình 4 tầng `work_orders` $\rightarrow$ `jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs` (`ADR-002`). | 🟠 **Chưa hoàn thiện & lệch tên bảng SSOT** |
| 5 | `docs/PROJECT_STATUS.md:1-87`<br>`docs/TECH_DEBT.md:1-20` | • `PROJECT_STATUS.md` đóng băng từ **2026-07-16** (vẫn ghi chờ Rotate key, chờ V5 Seed, chờ làm BP-32, mượn khuôn, phiếu giao hàng).<br>• `TECH_DEBT.md` dừng ở **2026-09-02** (ghi `TD-005: work_logs.quantity_ng` chưa có cột). | Thực tế dự án đã hoàn thành tới **Milestone 28** và **Sprint P1 (`WO-P1-001` $\rightarrow$ `WO-P1-010`)** tính đến `2026-10-14` (`docs/SESSION_HANDOFF_GEMINI4_ARGON.md:38-40`), cột `work_logs.quantity_ng` đã có từ Migration 100 (`SCHEMA_REFERENCE.md:426`). | 🔴 **Đóng băng 3 tháng, không phản ánh thực trạng** |
| 6 | `.agents/mempalace/knowledge/` (`mold_manufacturing_process.md:64-65`, `thermoforming_equipment_set.md:50, 82-104`, `business_rules.md:8`) | • Chỉ định lấy nhựa/kích thước từ `products.primary_plastic_code`, `external_length_mm`.<br>• Đề xuất dùng bảng `auxiliary_equipments` và `jobs.physical_mold_id`.<br>• Ghi trạng thái đơn hàng là `NEW -> APPROVED -> COMPLETED`. | • Vi phạm `RULE-DATA-02` (`AGENTS.md`: Nhựa và kích thước thiết kế CHỈ lấy từ `design_revisions`).<br>• Bảng `auxiliary_equipments` **TỒN TẠI** trong DB nhưng đã ngừng dùng cho tính năng mới (`SCHEMA_REFERENCE.md:872-873`), còn bảng `physical_molds` **KHÔNG TỒN TẠI** trong DB.<br>• Trạng thái đơn hàng thực tế là `DRAFT -> CONFIRMED -> IN_PRODUCTION -> SHIPPED -> CLOSED | CANCELLED` (`SCHEMA_REFERENCE.md:488`). | 🔴 **Mâu thuẫn với `RULE-DATA-02` & `SCHEMA_REFERENCE.md`** |

---

## PHẦN B: 7 ĐIỂM ĐỨT GÃY LUỒNG LIÊN THÔNG & TÍNH NĂNG CÒN THIẾU (CẦN KIỂM THỬ TRÌNH DUYỆT / TRUY VẤN TRƯỚC KHI SỬA)

Đối chiếu luồng nghiệp vụ thực tế xuyên suốt từ đầu đến cuối với mã nguồn hiện tại trong `src/app/`:

```
[1. Sự việc /cases] ──(ĐỨT #1, #2)──> [2. Báo giá /orders/quotations] ──(ĐỨT #3)──> [3. Đơn hàng /orders]
   ──> [4. Lệnh SX /production/work-orders] ──(ĐỨT #4, #5)──> [5. Thiết kế /engineering/designs]
   ──> [6. Thiết bị & Gia công /equipment, /equipment/jobs] ──(ĐỨT #6, #7)──> [7. Nhật ký & Giao hàng & Lưu giữ khuôn]
```

### 1. Đứt gãy #1 — Tab Thẩm định Kỹ thuật trong Sự việc (`/cases/[id]`) lệch bảng User (`profiles` vs `employees`) & bắt nhập UUID thô
- **Vị trí ghi nhận:**
  - `src/app/cases/[id]/page.tsx:92-97` & `src/app/cases/[id]/actions.ts:16`: Truy vấn `.from('profiles').select('role')`. Qua xác minh `information_schema.tables`, cả hai bảng `profiles` và `employees` đều **TỒN TẠI** trong DB (tuy nhiên `SCHEMA_REFERENCE.md:14` quy định *"Bảng User là `employees`, KHÔNG phải `profiles`"*). Nếu user không có dòng/role khớp trong `profiles`, `currentUserRole` bị gán mặc định thành `'sales'`, khiến nút **"Tạo đánh giá kỹ thuật"** tại `src/app/cases/[id]/_components/TechnicalReviewTab.tsx:57-61` bị ẩn.
  - `src/app/cases/[id]/_components/TechnicalReviewForm.tsx:115, 124, 177, 231, 240`: Các trường liên kết `product_id`, `design_revision_id`, `mold_id`, `cutting_die_id`, `machine_id` đang dùng thẻ `<input type="text" placeholder="FK product_id" />` bắt kỹ thuật viên **tự copy-paste chuỗi UUID 36 ký tự** thay vì dùng `AsyncSearchableSelect`!
  - Chưa có nút tạo nhanh Sản phẩm (`products`) hoặc Bản vẽ (`design_revisions`) trực tiếp từ kết quả Thẩm định kỹ thuật của Case.

### 2. Đứt gãy #2 — Tab Báo giá trong Sự việc (`/cases/[id]`) lệch chuẩn Enum DB & tách rời khỏi Engine Báo giá Chuẩn
- **Vị trí lỗi:**
  - `src/app/cases/[id]/_components/QuotationFormModal.tsx:53, 106, 130` & `SalesTab.tsx:20-25`: Ghi `status: 'draft'` (chữ thường) và `item_type: 'DESIGN_FEE' | 'PROTOTYPE' | 'PRODUCT'` (`:26-32`). Trong khi đó, Migration M28A (`supabase/migrations/20260911000001_m28a_db_enum_integrity_v2_1.sql:228`) và `SCHEMA_REFERENCE.md:446, 465` khóa chặt `CHECK (status IN ('DRAFT', 'SENT', 'APPROVED', 'CONVERTED', 'REJECTED', 'EXPIRED'))` (chữ hoa!). Bấm lưu báo giá trong `/cases/[id]` sẽ gây lỗi vi phạm CHECK constraint của PostgreSQL.
  - `SalesTab.tsx:54-66` trong `/cases/[id]` vẫn gọi hàm xuất PDF client-side cũ (`@/lib/utils/pdfExport`), không kết nối với **Auto-Pricing Engine 3 Trụ cột & Ma trận Giá khuôn** (`src/lib/pricing/quotation-engine.ts`) và PDF Engine chuẩn (`/api/quotations/[id]/pdf`) của `/orders/quotations`.

### 3. Đứt gãy #3 — Tạo Báo giá tại `/orders/quotations` bỏ sót FK `product_id` & `design_revision_id` khi lưu dòng chi tiết
- **Vị trí lỗi:** `src/app/orders/quotations/_components/CreateQuotationModal.tsx:331-340`.
- **Chi tiết:** Mặc dù người dùng đã chọn sản phẩm (`selectedProductId` tại dòng `:44`) và hệ thống đã đọc `design_revisions` để tính giá tự động, nhưng khi `.insert(linesPayload)` vào bảng `quotation_lines` (dòng `:331-340`), code chỉ ghi `quotation_id, line_no, item_type, model_code, description, quantity, unit_price, amount, notes` mà **bỏ quên không truyền `product_id` và `design_revision_id`**!
- **Hậu quả dây chuyền:**
  1. Trang chi tiết `/orders/quotations/[id]` và bản in PDF không đọc được thông số kỹ thuật SSOT từ `quotation_lines.design_revision_id`.
  2. Khi chuyển Báo giá thành Đơn hàng (`fn_convert_quotation_to_order`), `order_lines` yêu cầu `product_id NOT NULL` (`SCHEMA_REFERENCE.md:504`) nên bị đứt luồng liên kết tự động.

### 4. Đứt gãy #4 — Tab Sản xuất trong `/cases/[id]` là khung rỗng tĩnh
- **Vị trí lỗi:** `src/app/cases/[id]/page.tsx:373-387`.
- **Chi tiết:** Dù bảng `work_orders` (`SCHEMA_REFERENCE.md:337`) và bảng `jobs` (`SCHEMA_REFERENCE.md:362`) đều có cột khóa ngoại `case_id UUID → business_cases(id)`, Tab `production` trong `/cases/[id]` hoàn toàn không query dữ liệu mà chỉ render dòng chữ tĩnh `{t('Cases.noProductionOrders')}`.

### 5. Đứt gãy #5 — Trang Chi tiết Thiết kế `/engineering/designs/[moldMasterId]` hiển thị `'—'` & thiếu trạng thái `'APPROVED'`
- **Vị trí lỗi:** `src/app/engineering/designs/[moldMasterId]/page.tsx:142, 208-216, 263-268`.
- **Chi tiết:**
  1. Dòng `:208-216` truy vấn `.from('products').select('*, companies(...)').eq('product_id', moldMasterId).single()`, nhưng dòng `:263` lại viết `const firstProduct = moldMaster?.products?.[0] ?? null` (tàn dư từ thời bảng `mold_masters` join `products`). Vì `moldMaster` chính là `products`, thuộc tính `.products` luôn là `undefined`, làm cho Mã SP, Tên SP và Khách hàng trên Header trang thiết kế luôn hiển thị `'—'`!
  2. Dòng `:142` khai báo `const STATUS_OPTIONS = ['DRAFT', 'SUBMITTED', 'RELEASED', 'REJECTED', 'SUPERSEDED']` — **không có `'APPROVED'`**, trong khi `SCHEMA_REFERENCE.md:160, 193` và RPC `rpc_confirm_work_order` bắt buộc kiểm tra `design_revisions.status = 'APPROVED'`!

### 6. Đứt gãy #6 — Trang Chi tiết Job `/equipment/jobs/[id]` bị ghi đè thành lệnh Redirect thẳng sang trang In A4
- **Vị trí lỗi:** `src/app/equipment/jobs/[id]/page.tsx:1-11`.
- **Chi tiết:** Toàn bộ nội dung `src/app/equipment/jobs/[id]/page.tsx` đã bị thay bằng `redirect('/equipment/jobs/${id}/print')`. Trong khi đó, bộ 6 component chi tiết Job đầy đủ (`JobDetailHeader.tsx`, `JobTabNavigation.tsx`, `tabs/OverviewTab.tsx`, `tabs/StepsTab.tsx`, `tabs/LogsTab.tsx`, `tabs/EditStepModal.tsx`) vẫn nằm ngay trong thư mục `src/app/equipment/jobs/[id]/` nhưng bị bỏ mồ côi không thể truy cập được! Người dùng bấm vào mã Job từ bảng `/equipment/jobs` hoặc `/worklogs` chỉ thấy bản in giấy mà không thể cập nhật công đoạn (`job_steps`) hay xem nhật ký giờ công (`work_logs`).

### 7. Đứt gãy #7 — Thiếu Luồng Duyệt Mẫu Thử KCS (`Sample Request & Approval Gate`) & Phân mảnh Quản trị Phòng Khuôn
- **Thiếu cổng duyệt mẫu thử (`Sample Gate`):** Trong thực tế (`01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:182-204, 223` & `MOLD_CUSTODY_BUSINESS_SPEC.md:300-303`), sau khi chế tạo khuôn mới hoặc sau khi khuôn đi phủ Teflon về, xưởng phải dập mẫu thử (`試作成形`), đo kích thước KCS và chờ khách hàng duyệt (`量産承認`) mới được xuất lô hàng thương mại. Hiện tại trên UI chưa có trạng thái/cổng kiểm soát `SAMPLE_PENDING_APPROVAL` liên kết giữa Job khuôn $\rightarrow$ KCS Inspection (`/quality/inspection`) $\rightarrow$ Cho phép xuất hàng (`/shipments`).
- **Phân mảnh bảng quan hệ Dao cắt & Phụ trợ trong Phòng Khuôn:**
  - `/production/work-orders` (RPC `fn_get_wo_equipment_set`) đọc bộ SET từ bảng chuẩn **`equipment_assignments`** (`SCHEMA_REFERENCE.md:787-806`).
  - Nhưng `/product-center/[id]` (`TabDesignsEquipment.tsx:227, 351, 366`, `TabOverview.tsx:579`), `/equipment/unified` (`EquipmentDetailModal.tsx:236, 269`) và `Topbar.tsx:162` vẫn đang đọc/ghi vào bảng cũ **`mold_design_cutters`**!
  - Trang `/equipment/molds/page.tsx:185` (Khuôn vật lý) lại gộp `.in('equipment_type', ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'])`, trong khi `/equipment/unified/page.tsx:18` lại thiếu loại `'PLUG'` trong bộ lọc `EquipmentType`, còn `/equipment/auxiliary/page.tsx:37-76` là trang tĩnh báo "Đang phát triển".

---

## PHẦN C: BẤT CẬP VỀ CẤU TRÚC ROUTE, SIDEBAR & BẢNG DEPRECATED TRONG CODEBASE

### 1. Bốn (04) Hệ thống "Chỉ thị / Lệnh sản xuất" Đang Tồn Tại Song Song Gây Nhầm Lẫn
1. **`/production/work-orders` (`work_orders` — SSOT theo ADR-002):** Quản lý Work Order 4 tầng chuẩn, nhưng trên `Sidebar.tsx:84` lại đang đặt ở mục `4. 成形部 (Phòng Định hình)` thay vì `3. 金型部 (Phòng Khuôn)`.
2. **`/production/mold-orders` (`mold_work_orders` — Bảng cũ Legacy 1,426 dòng code):** Vẫn đang được gắn trên `Sidebar.tsx:71` (mục `3. 金型部`) và truy vấn bảng cũ `mold_work_orders` (`src/app/production/mold-orders/page.tsx:101, 277, 393, 498`).
3. **`/production-instructions` (`production_instructions` — BP-32):** Nằm ở `Sidebar.tsx:88`, dùng Tailwind màu cứng (`bg-blue-600`, `bg-gray-100`, `text-gray-900` tại `src/app/production-instructions/page.tsx:28-33, 67, 74`) vi phạm `RULE-UI-1` và không dùng `next-intl` (hardcode tiếng Nhật/Anh tại `:62-63, 78-119`), vi phạm Quy tắc Đa ngôn ngữ!
4. **`/production/jobs` (`src/app/production/jobs/page.tsx`):** Trang danh sách Job mồ côi (không có trên Sidebar), dùng enum cũ `PLANNED` (`:35, 68`), trùng lặp với `/equipment/jobs`.

### 2. Bốn (04) Cụm Route Trùng Lặp / Mồ Côi Cần Hợp Nhất (`106 page.tsx` vs `35 Sidebar items`)
- **Cụm Sản phẩm:** `/product-center` (trên Sidebar) trùng lặp với `/master/products` (`994 dòng`), `/master/molds` (`349 dòng` — thực chất query `products` tại `src/app/master/molds/page.tsx:68` và dùng cột không tồn tại `end_user_company_id` tại `:72, 90`), và `/production/products` (`30 dòng`).
- **Cụm Dao cắt:** `/equipment/cutting-dies` (trên Sidebar) trùng lặp 100% với `/master/cutters` (`src/app/master/cutters/page.tsx:22` — không phân trang, không có link chi tiết, sắp xếp `ASC` vi phạm Rule 7.1).
- **Cụm Nhật ký (Worklogs / Nippo):** `/worklogs` và `/reports/daily-worklog` (trên Sidebar, dùng `work_logs` SSOT) tồn tại song song với `/production/worklog` (`268 dòng` — ghi vào bảng cũ `production_logs` với UUID giả `00000000-0000-0000-0000-000000000000` tại `:48`) và `/production/daily-logs` (`361 dòng` — query `forming_daily_logs` & `press_daily_logs` nhưng bị ẩn khỏi Sidebar).
- **Cụm Kho & Bảo trì:** `/inventory` (dùng `v_product_stock_summary`) trùng với `/production/inventory` (dùng bảng cũ `tray_stock_summary` & `product_master` tại `TxnHistoryTab.tsx:15`); `/plastics/inventory` trùng với `/warehouse/rolls`; `/equipment/lifecycle` (dùng `v_equipment_lifecycle_status`) tách rời khỏi `/maintenance` (dùng `mold_physical_id` tại `src/app/actions/maintenance.ts:12, 81`).
- **Nút `/master` ở đáy Sidebar (`Sidebar.tsx:116`):** Trỏ vào `/master/page.tsx` nhưng trang này chỉ hiển thị danh sách `companies` (Khách hàng/Đối tác), không có menu hay tab dẫn vào `/master/machines`, `/master/racks`, `/master/calendar`, `/master/plastics`, khiến toàn bộ các trang Master con bị cô lập!
