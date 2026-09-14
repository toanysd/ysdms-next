# BÁO CÁO KHẢO SÁT TOÀN DIỆN MỨC ĐỘ SẴN SÀNG VẬN HÀNH 5 NHÓM NGHIỆP VỤ
**Hệ thống:** YSDMS NextGen v3.0  
**Thời điểm thực hiện:** 2026-09-14 16:15 JST  
**Thực hiện:** AI Agent AN (theo chỉ thị khảo sát trực tiếp của PE)  
**Phương pháp:** Truy vấn thực chứng trực tiếp trên Supabase production, schema reference, mã nguồn Server Actions và cây thư mục `src/app`.

---

## I. TỔNG QUAN PHÁT HIỆN THỰC CHỨNG (EMPIRICAL OVERVIEW)

Kết quả truy vấn trực tiếp cơ sở dữ liệu Supabase xác nhận 100% nhận định ban đầu của PE về sự phân tầng sâu sắc giữa các module lõi và các module mới. Cụ thể:

1. **Khối Lõi Sản Xuất (Import từ Access):**
   - `products`: 8,489 dòng.
   - `design_revisions`: 4,694 dòng (kích thước thiết kế CAD SSOT).
   - `equipment`: 6,497 dòng (gồm 4,736 khuôn, 1,731 dao cắt, 23 đế nước/khí, 6 chày ép, 1 stacking).
   - `orders`: 2,396 dòng.
   - `work_orders`: 1,203 dòng.
   - `jobs`: 1,256 dòng.
   - `job_steps`: 2,447 dòng.
   - `work_logs`: 7,105 dòng.
   - `plastic_master`: 818 dòng.
   - `plastic_receipt_roll`: 321 dòng.
   - `material_stock`: 180 dòng.

2. **Khối Mới / Chưa có giao dịch thực tế (0 dòng dữ liệu):**
   - `order_lines`: **0 dòng** (dù `orders` có 2,396 dòng!).
   - `quotations`: **0 dòng** (1 dòng test dev đã được dọn sạch).
   - `quotation_lines`: **0 dòng**.
   - `business_cases`: **0 dòng**.
   - `equipment_loans`: **0 dòng**.
   - `shipments`: **0 dòng**.
   - `delivery_notes` & `shipment_lots`: **0 dòng**.
   - `invoices`, `invoice_lines`, `invoice_payments`: **0 dòng**.
   - `inspections`, `job_qc_logs`, `outgoing_qc_records`, `defect_reports`: **0 dòng**.
   - `forming_daily_logs`, `inspection_daily_logs`: **0 dòng**.
   - `materials`, `material_inventory`, `aluminum_blanks`: **0 dòng**.

---

## II. BÁO CÁO CHI TIẾT 5 NHÓM NGHIỆP VỤ

### 1. NHÓM 1 — SALES & ORDER (`cases`, `orders`, chuỗi `quotations→orders` M24-M27A)

#### (a) Schema thật:
- **`business_cases`**: 0 dòng. PK `id` (UUID), `case_code` (TEXT UNIQUE), `title`, `company_id` (FK `companies`), `sales_owner_id` (FK `employees`), `status`. RPC `generate_case_code`.
- **`orders`**: 2,396 dòng. PK `order_id` (UUID), `order_no` (TEXT UNIQUE NOT NULL), `company_id` (FK `companies` NOT NULL), `converted_from_quotation_id` (FK `quotations` ON DELETE SET NULL), `order_date`, `requested_delivery`, `order_status` ('DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED', 'CANCELLED'), `order_type`, `notes`.
- **`order_lines`**: **0 dòng!** PK `line_id` (UUID), FK `order_id`, `product_id`, `design_revision_id`, `quotation_line_id`, `delivery_site_id`, `line_no`, `quantity`, `unit`, `unit_price`, `total_amount`, `line_status`.
- **`quotations` & `quotation_lines`**: 0 dòng. PK `quotation_id`, `quotation_no`, FK `company_id`, `converted_order_id` (FK `orders`), `status` ('DRAFT', 'SENT', 'APPROVED', 'CONVERTED', 'REJECTED', 'EXPIRED').
- **Trigger / RPC**: Atomic RPC `fn_convert_quotation_to_order(p_quotation_id, p_user_id)` (bổ sung trong Migration 105 ngày 2026-09-09).
- **Trọng tâm PE yêu cầu giải trình:** *Vì sao 2,396 `orders` thật mà `quotations` chỉ có 0 dòng — luồng nhập Order hiện tại có thực sự đi qua Quotation không?*
  - **Chứng cứ dữ liệu:** Truy vấn trường `notes` của 2,396 đơn hàng cho thấy 100% bản ghi đều có định dạng: `Imported from YSDトレー受注一覧 | X lines` với timestamp tạo đồng loạt vào ngày **24/08/2026**.
  - **Bản chất kỹ thuật:** 2,396 đơn hàng này chỉ là **"Vỏ đơn hàng" (Shell Header)** được import thô từ bảng tổng hợp đơn hàng của Access cũ để phục vụ tra cứu số hiệu. Kịch bản ETL cũ đã **KHÔNG import chi tiết vào bảng `order_lines`** (dẫn đến `order_lines` = 0 dòng). Đồng thời, 100% bản ghi có `converted_from_quotation_id = NULL`.
  - **Kết luận:** Chuỗi `quotations→orders` (M24) mới được ban hành Migration 105 vào ngày **09/09/2026** (cách đây 5 ngày). Do đó, **đây là 2 luồng hoàn toàn độc lập**. Luồng 2,396 đơn hàng là dữ liệu lịch sử nạp thẳng dạng shell; còn luồng Báo giá → Đơn hàng mới xây dựng, chỉ mới test chức năng dev chứ chưa có giao dịch thực tế nào từ phía kinh doanh.

#### (b) Server Actions:
- `src/app/orders/[id]/actions.ts`: Hoàn thiện cao với `updateOrderHeaderAction`, `updateOrderStatusAction` (chặn nhảy cóc trạng thái), `saveOrderLinesAction` (upsert lines an toàn), `linkWorkOrderAction`.
- `src/app/orders/quotations/actions.ts`: Hoàn thiện cao với `convertQuotationToOrderAction` (gọi RPC `fn_convert_quotation_to_order` qua Service Role client), `updateQuotationStatusAction`.
- `src/app/cases/[id]/actions.ts`: Hoàn thiện form Technical Review nhưng còn tồn tại lỗi phụ thuộc vào bảng `profiles` (thay vì `employees` theo SSOT).

#### (c) UI & Kiểm tra Mồ côi (Orphaned Routes):
- **Sidebar**: Đã đăng ký đầy đủ `/cases`, `/orders`, `/orders/quotations`.
- **Trang mồ côi phát hiện:** Thư mục `src/app/orders/create` (chứa `OrderForm` cũ) bị mồ côi vì nút "+ Thêm mới" trên trang danh sách `/orders` đã trỏ về `/orders/new` (chứa `OrderCreateForm`).
- **Trải nghiệm trang:** Danh sách `/orders` lọc tab trạng thái mượt mà. Tuy nhiên, khi click vào bất kỳ đơn hàng nào trong 2,396 đơn lịch sử, Tab Lines đều trống trơn do DB không có `order_lines`.

#### (d) Kết luận Sẵn sàng:
- **Đơn hàng (`orders`):** `SẴN SÀNG VẬN HÀNH` (ở mức quản lý vỏ đơn hàng và tạo đơn hàng mới độc lập).
- **Chuỗi `quotations→orders`:** `CẦN HOÀN THIỆN` (Đã có đủ Schema, RPC và UI, nhưng cần 1 buổi kiểm thử tích hợp End-to-End với nhân viên kinh doanh để xác nhận luồng nghiệp vụ trước khi go-live).
- **Sự việc (`cases`):** `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` (0 dữ liệu, còn vướng join `profiles`).

---

### 2. NHÓM 2 — ENGINEERING & EQUIPMENT (`engineering`, `equipment`, `equipment_assignments`)

#### (a) Schema thật:
- **`design_revisions`**: 4,694 dòng. Chứa đầy đủ thông số kỹ thuật CAD SSOT: `cutline_length`, `cutline_width`, `corner_r`, `chamfer_c`, `cavity_count`, `plastic_type_designed`.
- **`equipment`**: 6,497 dòng. Phân bổ:
  - Khuôn chính (`MOLD`): 4,736 dòng.
  - Dao cắt rời (`CUTTER_SEPARATE`): 1,726 dòng.
  - Dao cắt dập liền (`CUTTER_INLINE`): 5 dòng.
  - Đế làm mát nước (`WATER_BASE`): 9 dòng.
  - Đế khí nén (`PRESSURE_BASE`): 14 dòng.
  - Stacking: 1 dòng; Chày ép (`PLUG`): 6 dòng; Khung (`FRAME`): 0 dòng.
  - Liên kết bản vẽ: 6,402 / 6,497 thiết bị đã có `design_revision_id`.
- **`equipment_assignments`**: **Đúng 2 dòng!**
- **Trọng tâm PE yêu cầu giải trình:** *Vì sao `equipment_assignments` chỉ có 2 dòng trong khi `equipment` có 6,497 — cơ chế SET gá lắp N:N có đang được dùng thật trong vận hành hàng ngày không?*
  - **Chứng cứ dữ liệu:** Cả 2 dòng duy nhất trong bảng này đều có `created_at = 2026-09-01` và trường `notes = "AI OCR 工程票取込 自動セット設定"` (gán cặp Khuôn `YKW-009` với Dao `C-YKW-009`, và Khuôn `JAE380` với Dao `C-JAE-380`).
  - **Bản chất kỹ thuật:** Trong cơ sở dữ liệu Access cũ, quan hệ Khuôn - Dao cắt **chưa từng tồn tại dưới dạng bảng quan hệ N:N**. Mối liên hệ lịch sử thực chất được duy trì gián tiếp qua:
    1. Cùng trỏ chung một bản vẽ `design_revision_id` (6,402 thiết bị).
    2. Quy ước đặt mã tương đồng (Khuôn `XXX` đi với Dao `C-XXX`).
    3. Ghi chú viết tay thô trong cột `shared_with_code` (chỉ có 3 bản ghi) và `notes`.
  - **Kết luận:** Bảng `equipment_assignments` (ADR-001/ADR-010) là kiến trúc mới ban hành đầu tháng 09/2026 và **chưa từng được chạy script backfill** để tự động kết nối 1,731 dao cắt vào 4,736 khuôn. Trong vận hành hàng ngày, xưởng vẫn đang quản lý gá lắp theo trí nhớ/kinh nghiệm của thợ khuôn hoặc tra cứu thủ công ngoài hệ thống. Cơ chế SET N:N tự động của hệ thống **chưa đi vào vận hành thực tế**.

#### (b) Server Actions:
- `src/app/actions/engineering.ts`: Hoàn chỉnh cho CRUD bản vẽ và metadata CAD.
- `src/app/production/work-orders/actions.ts`: Đã cài đặt logic truy vấn và gán thiết bị theo SET (`equipment_assignments`), tuy nhiên khi chạy thực tế sẽ rơi vào fallback do bảng assignments rỗng.
- `src/app/equipment/loans/actions.ts`: Triển khai đầy đủ 2 RPC nguyên tử `fn_dispatch_equipment_loan` và `fn_complete_equipment_loan_return`.

#### (c) UI & Kiểm tra Mồ côi:
- **Sidebar**: Đầy đủ `/engineering`, `/engineering/designs`, `/equipment/unified`, `/equipment/molds`, `/equipment/cutting-dies`, `/equipment/loans`, `/equipment/lifecycle`, `/equipment/schedule`.
- Không có trang mồ côi. Các màn hình danh sách thiết bị hiển thị dữ liệu thật rất tốt.
- Tuy nhiên: Tab "Bộ thiết bị gá lắp (SET)" trong `EquipmentDetailModal.tsx` và `EquipmentSetMatrix.tsx` trên thực tế sẽ hiển thị trống cho 99.97% thiết bị cũ vì thiếu dữ liệu bảng `equipment_assignments`.

#### (d) Kết luận Sẵn sàng:
- **Bản vẽ & Master Thiết bị (`design_revisions`, `equipment`):** `SẴN SÀNG VẬN HÀNH` (Dữ liệu lớn, chuẩn hóa sạch sẽ, tra cứu ổn định).
- **Cơ chế SET gá lắp N:N (`equipment_assignments`):** `CẦN HOÀN THIỆN` (Thiếu script ETL backfill tự động ghép cặp Khuôn-Dao dựa trên tiền tố mã `C-` và chung `design_revision_id`).
- **Mượn trả thiết bị (`equipment_loans`):** `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` (Code và RPC hoàn chỉnh nhưng 0 dòng dữ liệu thực tế).

---

### 3. NHÓM 3 — PRODUCTION (WO → Job → Step → Worklog)

#### (a) Schema thật:
- **`work_orders`**: 1,203 dòng (Mã `WO-L-xxxx` từ Access và WO mới).
- **`jobs`**: 1,256 dòng (Liên kết 1:1 với `equipment_id` và `work_orders`).
- **`job_steps`**: 2,447 dòng (Các bước gia công khuôn: MOLD, CUTTER, PLUG, WATER_BASE...).
- **`work_logs`**: 7,105 dòng (Nhật ký công việc, giờ công, số lượng OK/NG).
- **Trọng tâm PE yêu cầu giải trình:** *UI thật hiện tại có đang được nhân viên xưởng dùng để nhập Nippo (`work_logs`) hàng ngày không, hay 7105 dòng chủ yếu là dữ liệu import từ Access cũ?*
  - **Chứng cứ dữ liệu timestamp tuyệt đối:**
    - Phân tích cột `created_at` của bảng `work_logs`: **100% (7,105/7,105 bản ghi) được tạo vào đúng 2 ngày: 28/08/2026 và 29/08/2026** (thời điểm chạy script ETL import dữ liệu từ file Access cũ).
    - Phân tích cột ngày làm việc thực tế (`work_date`): Trải dài từ năm 2022 đến ngày 27/08/2026 (Năm 2022: 451, 2023: 1,557, 2024: 1,752, 2025: 1,867, 2026: 1,478 dòng).
    - **Từ ngày 30/08/2026 đến ngày khảo sát (14/09/2026): CÓ ĐÚNG 0 BẢN GHI MỚI ĐƯỢC TẠO** trong bảng `work_logs`!
  - **Kết luận:** Nhân viên xưởng **HOÀN TOÀN CHƯA DÙNG WEB UI ĐỂ NHẬP NIPPO HÀNG NGÀY**. Toàn bộ 7,105 dòng hiện tại là dữ liệu di trú lịch sử.

#### (b) Server Actions:
- `src/app/worklogs/_actions/createWorklog.ts`: Triển khai cực kỳ hoàn chỉnh Core Step Completion Engine (ADR-011): Khi nhập Nippo có `is_finished = true`, tự động tính tổng `actual_hours` của `job_steps`, cascade cập nhật trạng thái `COMPLETED` lên `jobs`, và cascade tiếp lên `work_orders` bằng Service Role client.
- `src/app/production/work-orders/actions.ts`: Đầy đủ chuyển đổi trạng thái WO.

#### (c) UI & Kiểm tra Mồ côi:
- **Sidebar**: Đăng ký đầy đủ `/worklogs`, `/production/work-orders`, `/production/kanban`, `/production/floor`, `/reports/daily-worklog`.
- **Form nhập liệu**: Trang `/worklogs/new` và modal `WorklogForm.tsx` tồn tại thật, code hoàn chỉnh, liên kết đầy đủ danh mục máy, nhân viên, jobs, steps. Không bị mồ côi.

#### (d) Kết luận Sẵn sàng:
- **Khối Sản xuất & Worklog:** `CẦN HOÀN THIỆN` (Về mặt kiến trúc, schema và server actions đã đạt độ chín rất cao. Tuy nhiên, do chưa từng được công nhân xưởng sử dụng thực tế dù chỉ 1 ngày, cần tổ chức giai đoạn Pilot (thí điểm) 1 tuần tại xưởng để kiểm chứng độ thân thiện của UX form nhập Nippo trước khi tuyên bố go-live).

---

### 4. NHÓM 4 — SHIPMENT & INVOICE (`shipments`, `delivery_notes`, `invoices`)

#### (a) Schema thật:
- **`shipments`**: **0 dòng**. PK `shipment_id`, FK `work_order_id` (WO-direct ADR-012), `order_id` (Order-based), `order_line_id`, `delivery_site_id`, `shipped_by`, `ship_date`, `shipped_quantity`, `delivery_note_no`, `status`.
- **`delivery_notes`**: **0 dòng**. Bảng legacy cũ. Trong kiến trúc hiện tại, số phiếu giao hàng được lưu trực tiếp trong cột `shipments.delivery_note_no` và xuất PDF qua RPC `fn_get_shipment_delivery_note`.
- **`shipment_lots`**: **0 dòng**.
- **`invoices`**: **0 dòng**. PK `invoice_id`, `invoice_number` (UNIQUE, format `INV-YYYYMM-NNN`), FK `order_id`, `shipment_id`, `company_id`, `due_date`, `total_amount`, `tax_amount`, `paid_amount`, `remaining_amount`, `status` ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED').
- **`invoice_lines` & `invoice_payments`**: **0 dòng**.
- **View:** `v_customer_debt_summary` (Tổng hợp công nợ khách hàng).
- **Trọng tâm PE yêu cầu giải trình:** *Code/UI có tồn tại thật và chạy được không, hay đây là tính năng đã thiết kế ADR nhưng chưa từng code xong/chưa nối UI?*
  - **Kiểm tra biên dịch & mã nguồn:** Toàn bộ code của Nhóm 4 **HOÀN TOÀN CÓ THẬT và biên dịch sạch 100% (`npx tsc --noEmit` 0 errors)**.
  - **Server Actions hiện hữu:**
    1. `src/app/shipments/_actions/createShipment.ts`: Code đầy đủ xử lý Luồng A (WO-direct) và Luồng B (Order-based), tự động sinh mã phiếu `DN-YYYYMMDD-NNN`.
    2. `src/app/actions/invoice.ts`: Code hoàn chỉnh 467 dòng (hàm `generateNextInvoiceNumber`, `getInvoices`, `createInvoice`, `addInvoicePayment`).
  - **UI hiện hữu:**
    1. `/shipments`: Bảng danh sách xuất hàng, KPI card, nút mở sang Work Order.
    2. `/orders/invoices`: Danh sách hóa đơn, `InvoiceDrawer.tsx`, modal thanh toán `AddPaymentModal.tsx`.
    3. `/orders/debt`: Báo cáo công nợ theo khách hàng.
    4. `TabShipment.tsx` bên trong `/production/work-orders/[id]`: Cho phép tạo đợt xuất hàng trực tiếp từ Work Order.
  - **Nguyên nhân dẫn đến 0 dòng dữ liệu:**
    1. **Phân mảnh mã nguồn:** Tồn tại song song 2 thư mục route:
       - `src/app/shipments/` (route mới M21 trên Sidebar, nhưng chỉ cho tạo shipment thông qua tab của Work Order).
       - `src/app/orders/shipments/` (route cũ, có form tạo độc lập `new/page.tsx`, trang in `print/page.tsx`, nhưng KHÔNG có link từ Sidebar).
    2. **Đứt gãy dữ liệu đầu vào:** Vì 2,396 đơn hàng cũ hoàn toàn không có `order_lines`, người dùng không thể tạo hóa đơn hoặc xuất hàng theo dòng đơn hàng.

#### (b) Server Actions:
- Hoàn thiện tốt về mặt cú pháp và nghiệp vụ, nhưng chưa từng được kích hoạt trong môi trường runtime với dữ liệu thật.

#### (c) UI & Kiểm tra Mồ côi:
- Sidebar có link `/shipments`, `/orders/invoices`, `/orders/debt`.
- Bị mồ côi toàn bộ thư mục `src/app/orders/shipments` (chứa các tính năng xem chi tiết đợt xuất và in ấn PDF riêng).

#### (d) Kết luận Sẵn sàng:
- **Khối Giao hàng & Hóa đơn (`shipments`, `invoices`):** `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG`.
- Cần hợp nhất thư mục `src/app/orders/shipments` vào `src/app/shipments`, bổ sung nút tạo xuất hàng trực tiếp trên trang `/shipments`, và chạy 1 kịch bản kiểm thử End-to-End từ WO → Xuất hàng → Hóa đơn → Thanh toán công nợ.

---

### 5. NHÓM 5 — QUALITY & MATERIALS (`quality`, `materials`, `plastics`)

#### (a) Schema thật:
- **Nhựa định hình (Plastics):**
  - `plastic_master`: **818 dòng** (Master quy cách màng cuộn: PET, PP, PS, PVC, độ dày, khổ màng).
  - `plastic_receipt_roll`: **321 dòng** (Tồn kho thực tế các cuộn nhựa có mã vạch barcode, chiều dài, vị trí).
  - `plastic_receipt`: **3 dòng** (Các đợt nhập màng nhựa).
  - `plastic_manufacturer_map`, `plastic_adjustment_log`: 0 dòng.
- **Tồn kho thành phẩm khay (Finished Goods):**
  - View `v_product_stock_summary`: Tính toán tự động realtime giữa sản lượng hoàn thành (`work_logs.quantity_done`) và số lượng xuất giao (`shipments.shipped_quantity`).
- **Vật tư thô cũ (Materials):**
  - `materials`, `material_inventory`, `aluminum_blanks`: **0 dòng**.
  - `material_stock`: 180 dòng.
- **Chất lượng (Quality):**
  - `inspections`, `job_qc_logs`, `outgoing_qc_records`, `defect_reports`, `tray_inspections`, `ng_detail_logs`, `forming_daily_logs`, `inspection_daily_logs`: **100% đều 0 dòng dữ liệu**.

#### (b) Server Actions:
- `src/app/plastics/inventory/actions.ts`: Hoàn thiện cho quản lý cuộn màng nhựa, ghi nhận tiêu hao khi dập.
- `src/app/inventory/actions.ts`: Hoàn thiện cho tính toán KPI tồn kho thành phẩm.
- `src/app/quality/ng-trends/actions.ts` & `src/app/quality/inspection/actions.ts`:
  - **Vấn đề cốt lõi:** Viết code xử lý biểu đồ Pareto, xu hướng lỗi rất công phu, nhưng lại query vào bảng `forming_daily_logs` và `production_schedules`. Đây là các bảng từ thiết kế cũ của Phase R0 và **hoàn toàn có 0 dòng dữ liệu**.
  - Server actions của Quality hiện tại **hoàn toàn không kết nối với bảng `work_logs`** (nơi duy nhất có dữ liệu lỗi phế phẩm `quantity_ng` thực tế).

#### (c) UI & Kiểm tra Mồ côi:
- **Thư mục `src/app/materials/`:** **MỒ CÔI HOÀN TOÀN** (không có trên Sidebar, code truy vấn bảng `material_thicknesses` không hề tồn tại trong database).
- **Thư mục `src/app/plastics/` & `src/app/inventory/`:** Đã đăng ký Sidebar (`/inventory`, `/plastics/inventory`, `/plastics/master`), hoạt động ổn định trên 818 master và 321 cuộn nhựa thật.
- **Thư mục `src/app/quality/`:** Đã đăng ký Sidebar (`/quality/ng-trends`, `/quality/inspection`...), giao diện Recharts rất đẹp nhưng khi mở ra luôn hiển thị "Trống / Không có dữ liệu" do bảng nguồn rỗng.

#### (d) Kết luận Sẵn sàng:
- **Quản lý Màng nhựa (`plastics`):** `SẴN SÀNG VẬN HÀNH` (Có dữ liệu thật 818 master, 321 cuộn, UI nhập xuất rõ ràng).
- **Tồn kho thành phẩm (`inventory`):** `SẴN SÀNG VẬN HÀNH` (Chạy realtime trên View tổng hợp).
- **Vật tư thô cũ (`materials`):** `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` (Mồ côi, kiến trúc cũ, kiến nghị loại bỏ để tránh gây nhầm lẫn).
- **Quản lý Chất lượng (`quality`):** `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` (0 dòng dữ liệu, action trỏ nhầm bảng nguồn cũ thay vì `work_logs`).

---

## III. MA TRẬN SẴN SÀNG VẬN HÀNH TỔNG HỢP (READINESS MATRIX)

| Nhóm | Phân hệ / Module | Dữ liệu thật (Rows) | Đánh giá Sẵn sàng | Vấn đề then chốt & Hành động tiếp theo |
|---|---|---|---|---|
| **1. Sales & Order** | Đơn hàng (`orders`) | 2,396 headers / 0 lines | `SẴN SÀNG VẬN HÀNH` | Dữ liệu cũ là shell header. Cần dùng `/orders/new` để tạo đơn đầy đủ lines cho các đơn mới. Xóa route mồ côi `/orders/create`. |
| | Báo giá → Đơn hàng (`quotations`) | 0 | `CẦN HOÀN THIỆN` | Code RPC Migration 105 đã xong. Cần 1 buổi kiểm thử thực tế với Sales để nghiệm thu luồng chuyển đổi. |
| | Quản lý Sự việc (`cases`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | 0 dữ liệu. Code action cần sửa lỗi truy vấn `profiles` sang `employees`. |
| **2. Engineering & Equipment** | Bản vẽ CAD (`design_revisions`) | 4,694 | `SẴN SÀNG VẬN HÀNH` | Đầy đủ thông số kỹ thuật SSOT, tra cứu tốt. |
| | Master Thiết bị (`equipment`) | 6,497 | `SẴN SÀNG VẬN HÀNH` | Hợp nhất 4,736 khuôn + 1,731 dao cắt sạch sẽ. |
| | Quản lý SET gá lắp (`equipment_assignments`) | 2 | `CẦN HOÀN THIỆN` | Cần viết script tự động ghép cặp Khuôn-Dao lịch sử theo mã để kích hoạt cơ chế SET N:N. |
| | Mượn trả khuôn (`equipment_loans`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | Schema và RPC atomic rất chuẩn (M18), nhưng cần nhập thử chứng từ thật để vận hành. |
| **3. Production** | Lệnh & Chỉ thị (`work_orders`, `jobs`, `job_steps`) | 1,203 WO / 1,256 Jobs / 2,447 Steps | `SẴN SÀNG VẬN HÀNH` | Cấu trúc 3 tầng chuẩn ADR-002, liên kết thiết bị 1:1 chính xác. |
| | Nhập Nippo (`work_logs`) | 7,105 | `CẦN HOÀN THIỆN` | 100% dữ liệu import cũ. Cần triển khai thử nghiệm thực địa (Pilot) 1 tuần cho công nhân xưởng nhập hàng ngày. |
| **4. Shipment & Invoice** | Xuất hàng & 納品書 (`shipments`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | Code Server Action và PDF hoàn tất nhưng phân mảnh 2 thư mục route (`/shipments` vs `/orders/shipments`). Cần gộp route và test tạo đợt xuất thật. |
| | Hóa đơn & Công nợ (`invoices`, `debt`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | Code CRUD và View công nợ hoàn chỉnh. Cần tạo hóa đơn đầu tiên từ đợt xuất hàng thật để kiểm chứng. |
| **5. Quality & Materials** | Quản lý Cuộn nhựa (`plastics`) | 818 master / 321 cuộn | `SẴN SÀNG VẬN HÀNH` | Dữ liệu thật, kiểm kê và trừ mét màng nhựa khi dập hoạt động tốt. |
| | Tồn kho Thành phẩm (`inventory`) | Realtime View | `SẴN SÀNG VẬN HÀNH` | Tự động cân đối giữa sản xuất và xuất hàng. |
| | Quản lý Chất lượng (`quality`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | Actions đang trỏ nhầm bảng cũ `forming_daily_logs`. Cần refactor để đọc trực tiếp từ `work_logs.quantity_ng`. |
| | Quản lý Vật tư cũ (`materials`) | 0 | `CHỈ LÀ KHUNG, CHƯA KIỂM CHỨNG` | Module mồ côi ngoài Sidebar, schema lỗi thời. Cần dọn dẹp lưu trữ. |

---
**Ký tên xác nhận:** AI Agent AN — Đã hoàn thành khảo sát thực chứng theo chỉ thị của PE.
