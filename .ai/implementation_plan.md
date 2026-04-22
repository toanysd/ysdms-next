# Kế hoạch Triển khai Tầng Production Planning (Lập kế hoạch Sản xuất)

Đây là bản thiết kế nền tảng để thu hẹp khoảng cách giữa Đơn hàng (`orders`) do khối Sales yêu cầu, với Lệnh thực thi dưới Xưởng (`production_plans`).

## Tái Thiết Kế & Hợp nhất Logic Lên Lịch của YSDMS 

Căn cứ vào dữ liệu Excel, lời khuyên vận hành của Sếp, và phân tích sâu sắc từ PER, đây là kiến trúc chúng ta sẽ áp dụng thay vì việc "bắt chước y hệt cái yếu điểm của Excel cũ":

1. **Phân việc Đa chiều Máy/Người (Tách biệt logic):** Mặc dù Giao diện trình bày có thể hiển thị dưới Máy có Người, trong CSDL `production_plans`, ta phải tách bạch để linh động đảo người (luân chuyển). Quản đốc gán Đơn hàng cho **Máy (Machine)**, sau đó độc lập gán **Người (Operator)**. 
2. **Chặn Lỗi Phiên Bản Khuôn (Strict Version Control):** Excel cũ KHÔNG ghi phiên bản vì Người quản lý chưa có công cụ số quản trị. Nhưng YSDMS đã số hoá toàn Cục vòng đời Khuôn Vật lý. Cần dùng hệ thống để khoanh vùng **Cố định Phiên bản Khuôn** (Chỉ định rõ thẻ định danh `mold_physical_id` cụ thể). Quy trình này giúp Triệt tiêu triệt để tình trạng công nhân nhặt nhầm một khuôn bị hư cũ.
3. **Smart Scheduling (Ma Trận Tương Thích & Tính Khả Dụng Máy móc):** Bảng kế hoạch phải biết Đơn hàng này có tính chất gì, và tự động LỌC ra CHỈ những Máy Móc "Đủ Năng Lực" xử lý nó. 

## Proposed Changes

### Cơ sở Dữ liệu (Database Schema)

#### [NEW] supabase/migrations/20260421_022_machine_master.sql
- Triển khai Kiến trúc Bảng Máy móc 3 Lớp như PER Analysis cung cấp, hỗ trợ Dynamic Specs qua JSONB:
  - `machine_type`: Phân loại (định hình/phay/dập) + JSON Schema mô tả specs.
  - `machine_model`: Dòng máy NSX (Lưu Model + Default Specs).
  - `machine_instance`: Các Máy Thực tế (Trạm vận hành tại xưởng).
  - `machine_tray_compatibility`: Bảng ma trận Gán "Đơn khay này - Máy kia hỗ trợ" cho phép Routing.
  - `v_machine_effective_specs`: Trích xuất Specs cuối cùng qua View.

#### [NEW] supabase/migrations/20260421_023_production_plans.sql
- Tạo bảng `production_plans` nối kết 3 chiều Đơn/Khuôn/Máy: 
  - `id` (UUID, Primary Key)
  - `order_item_id` (UUID, FK -> `order_items`): Nguồn Order.
  - `machine_instance_id` (UUID, FK -> Bảng máy móc thực tế): Gắn chết Đơn hàng vào khay Máy cụ thể.
  - `mold_physical_id` (UUID, FK -> Khuôn vật lý): Chỉ định đích danh Phiên bản Khuôn bắt buộc sử dụng.
  - `planned_date` (Date): Ngày khởi chạy mục tiêu.
  - `operator_name` (Text/VARCHAR): Gán người đứng máy cho ca đó.
  - `planned_quantity` (Integer): Số lượng Khay bắt buộc đẩy ra.
  - `estimated_shots` (Integer): Số lượng Shots bù hao (thông báo năng suất chu kì máy).
  - `estimated_hours` (Numeric): Khoán khung giờ ước lượng cho việc thi công của Máy.
#### [NEW] supabase/migrations/20260421_026_update_production_plans.sql
- Bổ sung các cột mới vào `production_plans` phục vụ Soft Delete và Ghi chú:
  - `notes` (Text): Ghi chú dành riêng cho sản xuất.
  - `deleted_at` (Timestamptz): Cờ đánh dấu đã xoá mềm (Soft Delete).
- Đồng thời **CREATE OR REPLACE VIEW v_production_plan_progress** thêm điều kiện `WHERE deleted_at IS NULL` để đảm bảo hệ thống phủ sóng (coverage) không cộng gộp các Lịch bị hủy hờ (Soft Deleted) vào Order ban đầu, tránh việc Order Panel Ẩm ương.

### Giao diện Bảng Điều Khiển (UI/UX)
Sẽ xây dựng cụm Module mới tại `/production/planning`.

#### [MODIFIED] src/app/production/planning/CreatePlanForm.tsx
- Loại bỏ trường chọn `Shift` (Ca kíp) vì xưởng chỉ định luôn chạy ca ngày.
- Bổ sung thanh hiển thị Read-only về Ngày Hẹn Giao (`delivery_date`) từ Đơn hàng.
- Bổ sung trường nhập liệu tự do: Ghi chú (`notes`).

#### [NEW & MODIFIED] src/app/production/planning/ExcelPlanGridView-v8.5.2-1.tsx
- Loại bỏ cột Ca (Shift).
- Thêm cột Ngày xuất hàng (`出荷日`), cột Tiến độ/Trạng thái (`進捗`) hiển thị Badge (DRAFT, SCHEDULED...), và Ghi chú (`備考`).
- Tích hợp 2 nút thao tác nhanh trên mỗi Lệnh kế hoạch: `[編集]` (Sửa) | `[削除]` (Xoá).

#### [MODIFIED] src/app/actions/production.ts
- Thêm API `updateProductionPlanAction`: Cho phép sửa kế hoạch. Bổ sung **Guard cứng**: Nếu `status IN ('IN_PROGRESS', 'COMPLETED')`, ném lỗi song ngữ: `Không thể sửa kế hoạch đang chạy hoặc đã hoàn thành (実行中・完了済みの計画は編集できません)`.
- Thêm API `deleteProductionPlanAction`: Đánh dấu `deleted_at = NOW()` (Soft Delete). Cũng kèm **Guard chặn xóa** tương tự như trên.
- Cập nhật API `getProductionPlansByDate`: Ép điều kiện `.is('deleted_at', null)`.
- Thêm đồng loạt 3 `revalidatePath`: `/production/planning`, `/order` và `/production` sau khi Đăng kí / Sửa / Xóa bảng Lịch.

## Verification Plan

### Manual Verification
- Sếp click vào một Đơn hàng chưa có lịch, lên lịch thử có Ghi chú.
- Xem giao diện Lưới Excel xuất hiện hiển thị: Ghi chú, Cột Cấp bậc Trạng thái, và Ngày Giao hàng. Không còn Cột Ca kíp.
- Test Cảnh báo chặn: Mở Database chỉnh 1 Lịch thành IN_PROGRESS, bấm Sửa hoặc Xoá trên UI -> Hệ thống ném lỗi song ngữ như kế hoạch.
- Test Soft Delete + Refresh Coverage: Xóa mềm 1 Lịch. Kiểm tra Coverage < 100% và Order gốc xuất hiện lù lù lại trên Left Panel. Danh sách biến mất nháy tức thì do `revalidatePath` làm mới.

---

## [PHASE 2] Kế hoạch Module: Tháp Điều Khiển Thời Gian Thực (Dashboard & Kanban)

**Tình trạng hiện tại:** Giao diện `/production` (Kanban Execution) hiện đang load dữ liệu theo cơ chế cũ (`order_items` và `production_log`), hoàn toàn ngắt kết nối với bảng `production_plans` mà ta vừa tạo.

**Mục tiêu:** Cải tạo Kanban Board và Tháp điều khiển để đồng bộ 100% với dữ liệu từ màn Lập Kế hoạch (`production_plans`).

### Các thay đổi dự kiến (Proposed Changes)

#### 1. Database (Migration 027)
- Tạo file `20260421_027_production_log_plan_link.sql` thêm FK `production_plan_id` vào bảng `production_log`.

#### 2. Backend Actions (`src/app/actions/production.ts`)
- Thêm action: `getTodayProductionPlans()`: Fetch `production_plans` cho cột 未着手 (DRAFT/SCHEDULED).
- Thêm action: `confirmProductionPlan(planId)`: Nâng cấp DRAFT -> SCHEDULED.
- Thêm action: `startProductionFromPlan(planId)`: Atomic xử lý SCHEDULED -> `production_plans.status = IN_PROGRESS` + `INSERT INTO production_log`.
- Thêm action: `getTodayCompletedLogs()`: Cột Hoàn Thành hôm nay.

#### 3. Kanban Board UI (`src/app/production/page.tsx`)
- Chia thành 3 cột riêng biệt:
  - **未着手 "Cần Chạy"**: Hiển thị DRAFT (Nút [確認 Xác nhận] Vàng), SCHEDULED (Nút [▶ 開始 Bắt đầu] Xanh).
  - **実行中 "Đang Chạy"**: `production_log` JOIN `production_plans` đang IN_PROGRESS. Refresh 30s.
  - **完了 "Xong Hôm Nay"**: Log đã COMPLETED hôm nay. Refresh 60s.

### Manual Verification
1. Sau khi code, vào màn Lập Kế Hoạch, tạo 1 lịch mới (DRAFT).
2. Sang màn Kanban, kiểm tra Lịch xuất hiện ở Cột 1 với nút 確認 (Confirm). Bấm nút Start từ card DRAFT → phải bị chặn, không tồn tại hoặc ném lỗi.
3. Bấm Confirm → Lịch đổi thành SCHEDULED với nút ▶ Start.
4. Bấm ▶ Start → Lịch nhảy qua Cột 2 (Đang Chạy) và record trong DB sinh ra `production_log` hợp lệ.

---

## [PHASE 3A] Tháp điều khiển trung tâm (Master Dashboard KPI)

**Tình trạng hiện tại:** Đã hoàn thiện toàn bộ luồng Planning (Phase 1) và Kanban Execution (Phase 2). Cần một trang Dashboard để Quản lý cấp cao theo dõi tình hình nhà máy theo thời gian thực mà không cần đi sâu vào chi tiết điều phối.

**Mục tiêu:** Xây dựng một Server Component `/dashboard` siêu tốc độ, tận dụng lại chính các Action đã viết trong Phase 1 & 2 để tổng hợp số liệu tổng quan.

### Các thay đổi dự kiến (Proposed Changes)

#### 1. Backend Actions (`src/app/actions/dashboard.ts`)
Tạo mới file action riêng cho Dashboard để đóng gói các queries tổng hợp:
- Dùng `getActiveProductionLogs()` để lấy số **Máy đang chạy** và dữ liệu chi tiết.
- Dùng `getTodayCompletedLogs()` để tổng hợp **Sản lượng hôm nay**.
- Dùng `getPendingOrderItemsForPlanning()` (từ `production.ts`) để đếm **Đơn chưa xếp lịch**.
- Viết query tạm để đếm **Khuôn quá hạn bảo dưỡng** (Placeholder cho Phase 3B - hiện tại có thể đếm những khuôn cán đích 1,000,000 shots).

#### 2. Giao diện Dashboard (`src/app/dashboard/page.tsx` & Các component con)
Tạo UI thành 3 hàng (Rows) bám sát chiến lược:
- **Row 1: 4 KPI Cards** (Máy đang chạy, Sản lượng, Đơn chưa lịch, Khuôn cần bảo trì).
- **Row 2: 2 Widgets Lớn**
  - Widget 1: **Biểu đồ Cột - Mức độ đáp ứng Kế hoạch (Coverage) / Chart coverage KH** (Bọc Recharts, gọi data từ `v_production_plan_progress`).
  - Widget 2: **Bảng Danh sách Các máy hiện đang chạy (Realtime 30s)**.
- **Row 3: 1 Widget Dài**
  - **Timeline/Gantt Chart (Đơn giản)** hiển thị kế hoạch dàn trải trên các Máy hôm nay. Sử dụng data từ `getProductionPlansByDate(today)`.

### Verification Plan
1. Truy cập trực tiếp url `/dashboard`.
2. Kiểm tra độ phản hồi số liệu trên 4 KPI Cards:
   - Các máy bật IN_PROGRESS ở Kanban sẽ được đếm đúng trên thẻ số 1.
   - Các log COMPLETED ở Kanban sẽ được dồn số lượng Good Qty lên thẻ số 2.
3. Kiểm tra Chart Coverage hiển thị đúng các thanh tiến độ của Order đang chạy.

_Lưu ý: Mọi giao diện Dashboard phải áp dụng tuân thủ chuẩn ngôn ngữ Nhật (Primary) / Việt (Secondary)._

---

## [PHASE 3B] Giám sát tuổi thọ Khuôn (Mold Maintenance)

**Tình trạng hiện tại:** Đã có nền tảng Database cực tốt từ Migration `012` (`v_mold_health`, `mold_shot_counter`, `mold_maintenance_schedule`). Dashboard đang dùng logic đếm tạm. Cần xây dựng màn hình chuyên biệt để kỹ thuật viên xưởng theo dõi sức khoẻ khuôn.

**Mục tiêu:** Xây dựng màn hình `/maintenance` cung cấp cái nhìn trực quan về % hao mòn Khuôn (Dựa trên số lần đập/shots).

### Các thay đổi dự kiến (Proposed Changes)

#### 1. Database (Migration `032`)
- Seed tự động `mold_maintenance_schedule` cho các Revision chưa có định mức bảo trì. Ví dụ: Chu kỳ (`interval_shots`) = 1,000,000; Ngưỡng Cảnh báo (`alert_threshold_shots`) = 900,000.
*(Lưu ý: View `v_mold_health` cũ dùng cơ chế Modulo `%` để tính `shots_since_last_maintenance`. Sẽ dùng tạm nguyên trạng, nếu xưởng có nhu cầu Bảo trì Sớm (early maintenance) làm trượt số Modulo thì sẽ đề xuất cấu trúc đổi view sau).*

#### 2. Backend Actions (`src/app/actions/maintenance.ts`)
- `getMoldHealthList()`: Lấy dữ liệu từ view `v_mold_health` order by `lifecycle_pct` DESC.
- `logMaintenanceAction()`: Ghi một bản ghi vào `mold_maintenance_log` khi xưởng thực hiện bảo dưỡng.

#### 3. Update Dashboard KPI (`src/app/actions/master-dashboard.ts`)
- Đổi query tạm sang query chuẩn: Đếm số lượng khuôn từ `v_maintenance_overdue` cho thẻ KPI **Khuôn Chờ Bảo Trì**.

#### 4. Kênh UI (`src/app/maintenance/page.tsx`)
Thiết kế Layout chuẩn Nhật:
- **KPI Row:** Tổng số khuôn, Khuôn OK (Xanh), Cảnh báo (Vàng), Quá Tải (Đỏ).
- **Data Table:** Danh sách khuôn kèm thanh Progress Bar trạng thái mài mòn. Cột Lifecycle hiển thị số Shots hiện tại / Định mức bảo trì. Giao diện Song ngữ Nhật (Primary) - Việt (Secondary).
- Tích hợp nút **[Báo cáo Bảo Trì]** bên cạnh các khuôn đang Vàng/Đỏ.

### Verification Plan
1. Xem Dashboard `/dashboard`, số liệu Khuôn bảo trì phải map đúng với dữ liệu view overdue.
2. Truy cập `/maintenance` để thấy được toàn bộ Khuôn. Progress Bar vẽ đúng tỷ lệ `< 90%` (Xanh), `90-100%` (Vàng), `> 100%` (Đỏ).
3. Record bảo trì khuôn thành công vào DB mà không sụp hệ thống.

> [!NOTE]
> **Technical Backlog (Từ Review Phase 3B):** `logMaintenanceAction()` hiện đang chạy 2 async query rời rạc (Insert Log -> Update Counter). Đối với Production, ưu tiên đóng gói 2 query này thành 1 RPC transaction `supabase.rpc('record_maintenance_and_reset')` để đảm bảo Atomicity tuyệt đối nếu mạng chập chờn.

---

## [PHASE 3C] Báo cáo Định kỳ & Phân tích Năng suất (Reporting module)

**Mục tiêu:** Xây dựng màn hình `/reports` chuyên dụng để đội ngũ QA & Quản lý Xưởng chốt số, truy xuất dữ liệu sản xuất và KPI bảo trì, xuất báo cáo phục vụ cho luồng giao ban.

### Scope định hướng (MVP)
- **Trigger:** Tích hợp nút **"Tra cứu & Xuất báo cáo"** qua UI thủ công. (Ưu tiên MVP linh hoạt chọn mốc thời gian, tránh việc setup Cronjob cứng ngắc khi ca kíp có thể xê dịch).
- **Chu kỳ hiển thị:** Cho phép tuỳ chọn lọc theo **Ngày (Daily) / Tuần (Weekly) / Tháng (Monthly)**. (Trọng tâm nhấn mạnh vào Báo cáo Tuần).
- **Format:** Liệt kê bảng Dense UI Data Grid đa chiều trực tiếp trên `/reports` (có thể Export trực tiếp ra **CSV** bằng thư viện frontend).
- **Trọng tâm (Priorities):**
  1. Sản lượng theo Máy/Người (`produced_qty` vs `planned_qty`).
  2. Báo cáo tỷ lệ hư hỏng / phế liệu (Nguyên liệu hao hụt).
  3. KPI Tuổi thọ bảo trì khuôn (Tần suất Log bảo trì).
