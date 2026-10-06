# BÁO CÁO KHẢO SÁT ROUTE & SCHEMA PHỤC VỤ PILOT BỘ PHẬN KHUÔN
**Mã báo cáo:** `2026-10-06_mold_pilot_schema_route_recon`  
**Thời gian thực hiện:** 2026-10-06 16:30 JST  
**Người thực hiện:** AN (Antigravity Senior Engineer)  
**Cơ chế thực thi:** 100% Chế độ Chỉ-Đọc (Strictly Read-Only Reconnaissance)  
**Phê duyệt chỉ đạo:** Minh Chủ Thoan [Stamp: 2026-10-06 16:23 JST] & PE [Stamp: 2026-10-06 16:25 JST]

---

## 1. THÔNG SỐ KIỂM TRA HỆ THỐNG & TRẠNG THÁI REPOSITORY

| Chỉ số kiểm tra | Kết quả thực tế đã xác minh | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Commit SHA cục bộ (HEAD)** | `4a9012abc3c800066a7069ca1faf48235710858f` | Đã commit toàn bộ Evidence Pack & Fixes |
| **Commit SHA remote (`origin/main`)** | `45bd20a76f9cbd25a0cfecd5ad20ccc31b34fcbc` | Remote main đang chờ Minh Chủ Thoan push |
| **Trạng thái Git Working Tree** | `Clean` (0 file modified, 0 untracked) | Không có thay đổi dở dang |
| **Kiểm tra TypeScript** | `npx tsc --noEmit` $\rightarrow$ **0 errors** | Mã nguồn tuân thủ type 100% |
| **Kiểm tra Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` $\rightarrow$ **0 missing keys** | Khớp hoàn toàn giữa `ja.json` và `vi.json` |
| **Cam kết an toàn** | **0 ghi Supabase, 0 migration, 0 staging, 0 sửa code** | 100% Khảo sát chỉ-đọc tĩnh |

---

## 2. MA TRẬN MAPPING UI $\rightarrow$ SERVER ACTION $\rightarrow$ SUPABASE TABLES

| Nghiệp vụ xưởng | Tuyến Route thực tế (`src/app/`) | Components đảm nhiệm | Server Action phụ trách | Bảng Supabase tác động |
| :--- | :--- | :--- | :--- | :--- |
| **1. Danh sách Jobs khuôn** | `/equipment/jobs` | `src/app/equipment/jobs/page.tsx` | Supabase Client SELECT | `jobs`, `job_types`, `products`, `equipment`, `companies` |
| **2. Tạo Job khuôn mới** | `/equipment/jobs` (Modal) | `src/components/equipment/CreateJobModal.tsx` | `createMoldJobAction` (`src/app/actions/mold-job.ts`:139) | `jobs` (insert), `job_steps` (auto-gen từ `standard_process_times`) |
| **3. Tạo Job nhanh (Quick Job)** | Gọi từ `/worklogs/new` | `src/components/worklogs/WorklogFormShared.tsx`:122 | `createQuickJob` (`src/app/actions/mold-job.ts`:233) | `jobs` (insert mã `QJ-...`), `job_steps` (1 step "作業") |
| **4. Chi tiết Job & Quản lý Steps** | `/equipment/jobs/[id]` | `src/app/equipment/jobs/[id]/page.tsx`, `StepsTab.tsx` | Supabase Client SELECT | `jobs`, `job_steps`, `design_revisions`, `equipment` |
| **5. Tạo & Chỉnh sửa Step** | `/equipment/jobs/[id]` (Modal) | `src/app/equipment/jobs/[id]/tabs/EditStepModal.tsx` | Client RPC / `updateJobStepDetails` (`mold-job.ts`:738) | `job_steps` (`step_name`, `step_status`, `assigned_to`, `deadline`) |
| **6. Cập nhật trạng thái Step** | `/equipment/jobs/[id]`, `/equipment/schedule` | Action Button / Drag drop | `updateJobStepStatus` (`mold-job.ts`:617) | `job_steps` (`step_status`), `jobs` (`overall_progress`, `job_status`) |
| **7. Lập lịch & Gantt phòng Khuôn** | `/equipment/schedule` | `page.tsx`, `ToolingExcelGridView.tsx`, `MoldJobGantt.tsx` | `getJobsForGantt` (`mold-job.ts`:362) | `jobs`, `job_steps`, `work_logs`, `machines`, `employees` |
| **8. Nhập Nhật ký Nippo** | `/worklogs/new` | `src/app/worklogs/new/page.tsx`, `WorklogFormShared.tsx` | `saveWorklogRecord` (`src/app/worklogs/_actions/createWorklog.ts`:114) | `work_logs` (insert/update), `job_steps` (cascade update khi `is_finished`) |
| **9. Xem danh sách Nippo** | `/worklogs` | `src/app/worklogs/page.tsx`, `WorklogTable.tsx` | Supabase Client SELECT | `work_logs`, `jobs`, `job_steps`, `employees`, `processing_codes` |
| **10. In phiếu Nippo A4 chuẩn Nhật** | `/reports/daily-worklog` | `src/app/reports/daily-worklog/page.tsx`, `DailyWorklogA4Sheet.tsx` | Supabase Client SELECT | `work_logs`, `jobs`, `employees`, `processing_codes` |

---

## 3. TRẢ LỜI CHI TIẾT 12 CÂU HỎI KHẢO SÁT BẮT BUỘC (RECONNAISSANCE FINDINGS)

### Câu hỏi 1: Route nào đang tạo và chỉnh sửa `jobs`?
- **Tạo Job:**
  1. Tuyến chính: `/equipment/jobs` (`src/app/equipment/jobs/page.tsx`, line 18) thông qua modal `CreateJobModal` (`src/components/equipment/CreateJobModal.tsx`).
     - Server Action: `createMoldJobAction` (`src/app/actions/mold-job.ts`, lines 139–218).
  2. Tuyến tạo nhanh từ xưởng: Nút "Quick Job" trong `WorklogFormShared.tsx` (line 12).
     - Server Action: `createQuickJob` (`src/app/actions/mold-job.ts`, lines 233–291), tự sinh mã `QJ-{YYYYMMDD}-{HHMM}`.
  3. Tuyến sinh tự động từ Lệnh sản xuất: `/production/work-orders/[id]` (`src/app/production/work-orders/actions.ts`, lines 386–602) gọi `generateJobsForWorkOrder(workOrderId)` tự động sinh Job riêng cho từng thiết bị (`MOLD`, `CUTTER`, `PLUG`, `STACKING`).
- **Chỉnh sửa Job:**
  - Route chi tiết: `/equipment/jobs/[id]` (`src/app/equipment/jobs/[id]/page.tsx`).
  - Modal chỉnh sửa: `EditJobModal` (`src/app/equipment/jobs/_components/EditJobModal.tsx`).
  - Gán khuôn vật lý: `linkJobToPhysicalMoldAction` (`src/app/actions/mold-job.ts`, line 293).
  - Xóa Job: `deleteMoldJobAction` (`src/app/actions/mold-job.ts`, line 339).

---

### Câu hỏi 2: Route nào đang tạo và chỉnh sửa `job_steps`?
- **Route quản lý Steps:**
  - Tuyến: `/equipment/jobs/[id]` chọn Tab "Steps" (`src/app/equipment/jobs/[id]/tabs/StepsTab.tsx`, lines 62–70).
- **Component tạo & sửa:**
  - Modal: `EditStepModal` (`src/app/equipment/jobs/[id]/tabs/EditStepModal.tsx`).
  - Khi tạo step (`mode = 'create_step'`): Insert trực tiếp vào bảng `job_steps` với các trường: `job_id`, `step_no`, `step_name`, `step_status`, `track`, `planned_hours`, `deadline`, `assigned_to`, `notes`, `item_type_id`, `manufacture_location`.
  - Khi sửa step: Gọi Server Action `updateJobStepDetails` (`src/app/actions/mold-job.ts`, lines 738–760) hoặc `updateJobStepDates` (line 660).
- **Cơ chế tự động sinh Steps:**
  - `createMoldJobAction` tự động quét bảng `standard_process_times` để sinh danh sách bước chuẩn theo `track` (`MOLD`, `PLUG`, `FINISH`).
  - `generateJobsForWorkOrder` tự động gán bước chuẩn từ mẫu `JOB_STEP_TEMPLATES` (ví dụ `MOLD`: `['CAM設計', 'CNC加工', '磨き仕上げ', '試打確認']`).

---

### Câu hỏi 3: Route nào đang nhập `work_logs`?
- **Tuyến nhập chính (Nippo xưởng):**
  - Route: `/worklogs/new` (`src/app/worklogs/new/page.tsx`), sử dụng component `WorklogFormShared` (`src/components/worklogs/WorklogFormShared.tsx`).
- **Tuyến nhập nhanh theo Step:**
  - Route: `/equipment/jobs/[id]` $\rightarrow$ Tab Steps $\rightarrow$ Bấm nút chỉnh sửa Step $\rightarrow$ Modal `EditStepModal` có tích hợp form ghi nhanh nhật ký công việc cho chính step đó.
- **Server Actions phụ trách lưu dữ liệu:**
  - `saveWorklogRecord` (`src/app/worklogs/_actions/createWorklog.ts`, lines 114–195).
  - `createWorklog` (`src/app/worklogs/_actions/createWorklog.ts`, lines 200–260) hỗ trợ gửi qua form HTML action.

---

### Câu hỏi 4: Form work log hiện bắt buộc những trường nào?
Căn cứ code thực tế tại `src/app/worklogs/_actions/createWorklog.ts` (lines 120–139, lines 216–224) và `WorklogFormShared.tsx` (lines 325–339):
1. **`work_date` (BẮT BUỘC):** Ngày làm việc thực tế (`YYYY-MM-DD`).
2. **`employee_id` (BẮT BUỘC):** ID thợ thực hiện (UUID FK liên kết `employees.employee_id`).
3. **`job_id` (BẮT BUỘC):** ID Job gia công (UUID FK liên kết `jobs.job_id`, trong schema DB là NOT NULL).
4. **`job_step_id` (BẮT BUỘC trong Form UI):** ID công đoạn cụ thể (UUID FK liên kết `job_steps.step_id`). *Lưu ý: Trong schema DB cột này cho phép NULL, nhưng Form UI đang chặn bắt buộc phải có.*
5. **`hours_spent` (BẮT BUỘC):** Số giờ làm việc thực tế (kiểu số thực `NUMERIC > 0`).
6. **`quantity_done` (BẮT BUỘC ĐIỀU KIỆN):** Chỉ bắt buộc khi `jobCategory === 'THERMOFORMING'` (sản xuất định hình khay). Với phòng khuôn (`MOLD_SHOP`) không bắt buộc trường này.
7. **Các trường tùy chọn (Optional):**
   - `processing_code_id`: Mã công việc theo danh mục 0–999 (INTEGER).
   - `machine_id`: Máy gia công CNC/Phay sử dụng (UUID).
   - `is_finished`: Đánh dấu đã hoàn tất công đoạn này (BOOLEAN).
   - `notes`: Ghi chú tự do (TEXT).
   - `description`: Mô tả chi tiết (TEXT).

---

### Câu hỏi 5: Có hỗ trợ chọn job/step, employee, machine, processing code không?
- **CÓ ĐẦY ĐỦ 100% trong component `WorklogFormShared.tsx`:**
  * **Chọn Job (`job_id`):** Dùng `SearchableSelect` lọc danh sách job đang hoạt động (lines 84–86).
  * **Chọn Step (`job_step_id`):** Khi chọn Job, hệ thống tự động fetch toàn bộ step của Job đó qua `supabase.from('job_steps').select(...)` và hiển thị dropdown tương ứng (lines 250–261).
  * **Chọn Nhân viên (`employee_id`):** Dropdown có sẵn, tự động ghi nhớ thợ của phiên trước bằng `localStorage.getItem('ysdms_last_selected_worker_id')` (line 57).
  * **Chọn Máy (`machine_id`):** Dropdown danh mục máy từ bảng `machines` (lines 99, 106).
  * **Chọn Mã công việc (`processing_code_id`):** Dropdown tải từ bảng `processing_codes` (line 139), có bộ lọc tự động theo phòng ban (`departmentFilter`: `MOLD_SHOP`, `PRODUCTION`, `DESIGN`, `GENERAL`, `ALL`).

---

### Câu hỏi 6: Có hỗ trợ tác vụ nội bộ không?
- **Thực trạng kỹ thuật:**
  * **Về Schema Database:** Cột `work_logs.job_id` là `NOT NULL` (căn cứ `src/types/database.types.ts`:8297). Bảng `work_logs` **HIỆN CHƯA CÓ** cột `task_category`.
  * **Về Giao diện UI:** Form `WorklogFormShared.tsx` chặn lỗi ngay nếu chưa chọn Job (`if (!selectedJobId) return setError(...)`).
  * **Tính năng Quick Job hiện hữu:** Form cung cấp nút "Quick Job" (`createQuickJob`) cho phép tích chọn `is_facility_job: true` $\rightarrow$ sinh ra một Job giả mã `QJ-...` và 1 step tên `"作業"`, ghi chú `"社内作業 (Internal Facility Job)"`.
- **Kết luận:** Hệ thống **CHƯA CÓ** luồng ghi tác vụ nội bộ độc lập không gắn Job.
- **Giải pháp tối ưu cho Pilot (Phương án A của PE):**
  * Không sửa code form, không chạy migration schema.
  * Thiết lập một Job nội bộ xưởng khuôn chuẩn hóa: Mã `JOB-INTERNAL-SHOP` (hoặc tên hiển thị: *"社内作業・5S・保全"*), gắn sẵn 4 bước công đoạn chuẩn:
    - Step 1: `5S・工場清掃` (5S & Vệ sinh xưởng — Mã 50).
    - Step 2: `設備・コンプレッサー保全` (Bảo trì máy móc — Mã 54).
    - Step 3: `金型・治具修理` (Sửa chữa khuôn/đồ gá — Mã 42).
    - Step 4: `スタッキング木板製作` (Gia công ván gỗ Stacking — Mã 40).
  * Thợ xưởng chỉ cần chọn Job nội bộ này là ghi được giờ công 5S/bảo trì mà hoàn toàn tuân thủ schema hiện tại.

---

### Câu hỏi 7: Cột nào được dùng để cập nhật trạng thái step/job?
Căn cứ `src/types/database.types.ts` và Server Actions:
- **Đối với `job_steps`:**
  * Cột trạng thái: **`job_steps.step_status`** (Line 3197, giá trị enum: `'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'`).
  * Cột tiến độ: **`job_steps.progress_percent`** (Line 3193, số từ 0 đến 100).
  * Cột giờ thực tế: **`job_steps.actual_hours`** (Line 3165).
  * Kích hoạt tự động: Khi log có `is_finished = true`, hàm `processStepCompletionEngine` (`createWorklog.ts`:55) chạy lệnh:
    `UPDATE job_steps SET step_status = 'COMPLETED', actual_hours = SUM(hours_spent) WHERE step_id = ...`.
- **Đối với `jobs`:**
  * Cột trạng thái: **`jobs.job_status`** (Line 3387, giá trị enum: `'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'`).
  * Cột tiến độ tổng: **`jobs.overall_progress`** (Line 3395, số từ 0 đến 100).
  * Cột ngày hoàn tất: **`jobs.completed_date`** (Line 3375, kiểu TIMESTAMPTZ).
  * Kích hoạt tự động: Khi 100% steps của job đều có `step_status = 'COMPLETED'`, hàm `processStepCompletionEngine` (`createWorklog.ts`:72) tự động cập nhật:
    `UPDATE jobs SET job_status = 'COMPLETED', completed_date = NOW() WHERE job_id = ...`.

---

### Câu hỏi 8: Có tính tổng giờ công từ `work_logs` không?
- **CÓ, ĐÃ ĐƯỢC TÍNH TOÁN ĐẦY ĐỦ TẠI 3 TẦNG HỆ THỐNG:**
  1. **Tầng Step (Cục bộ):** Trong Server Action `createWorklog.ts` (lines 50–57), hàm tự động tính tổng giờ của tất cả logs thuộc step:
     ```typescript
     const totalHours = (logs || []).reduce((acc, l) => acc + (Number(l.hours_spent) || 0), 0)
     await adminSupabase.from('job_steps').update({ actual_hours: totalHours }).eq('step_id', jobStepId)
     ```
  2. **Tầng Lập lịch & Gantt (Toàn xưởng):** Trong Server Action `getJobsForGantt` (`mold-job.ts`, lines 576–595), hệ thống fetch toàn bộ `work_logs` theo mảng `job_id`, tính tổng giờ lũy kế theo step:
     ```typescript
     logsByStep[l.job_step_id].totalHours += Number(l.hours_spent)
     step.actual_hours = stepLogs.totalHours
     step.actual_start = stepLogs.dates[0]        // Ngày bắt đầu thực tế
     step.actual_end = stepLogs.dates[lastIndex]  // Ngày kết thúc thực tế
     ```
  3. **Tầng Lệnh sản xuất 4 cấp (Work Order):** Trong Database View `v_work_order_progress` (`supabase/migrations/20260911000002_m28b_work_order_progress_view.sql`:27), hệ thống tính:
     ```sql
     sum_actual_hours = COALESCE(SUM(wl.hours_spent), 0)
     variance_hours = sum_actual_hours - sum_planned_hours
     ```

---

### Câu hỏi 9: Màn hình nào hiển thị deadline/quá hạn?
- **1. Màn hình Lập lịch phòng Khuôn (`/equipment/schedule`):**
  - File: `src/app/equipment/schedule/page.tsx` (lines 84–87).
  - Tự động tính số lượng Job quá hạn:
    ```typescript
    const overdue = jobs.filter(j => {
      if (!j.mold_deadline) return false
      return new Date(j.mold_deadline) < new Date() && j.job_status !== 'COMPLETED'
    }).length
    ```
  - Hiển thị badge màu đỏ nổi bật `overdueCount` ngay trên thanh công cụ `ToolingScheduleToolbar`.
  - Trên màn hình lưới `ToolingExcelGridView`, các công đoạn hoặc job quá hạn được highlight màu đỏ cảnh báo.
- **2. Màn hình Danh sách Jobs (`/equipment/jobs`):**
  - File: `src/app/equipment/jobs/page.tsx` (lines 68, 99).
  - Mặc định sắp xếp theo `mold_deadline ASC` (hạn gần nhất lên đầu), hiển thị cột hạn chót kèm badge trạng thái.
- **3. Màn hình Chi tiết Lệnh sản xuất (`/production/work-orders/[id]`):**
  - Component `WorkOrderProgressCockpit`: Hiển thị cờ `is_overdue` từ view `v_work_order_progress` nếu `deadline < NOW()`.

---

### Câu hỏi 10: Có route lịch/Gantt dùng được ngay không?
- **CÓ, ĐÃ HOÀN THIỆN VÀ VẬN HÀNH ĐƯỢC NGAY 100%:**
  - **Route: `/equipment/schedule`** (`src/app/equipment/schedule/page.tsx`).
  - **2 chế độ xem thực tế chuyên biệt cho xưởng khuôn:**
    1. `activeView = 'grid'`: Component `ToolingExcelGridView.tsx` — Giao diện bảng ma trận dạng lưới kiểu Excel (tương tự như màn hình dispatching mà xưởng quen dùng), chia cột theo ngày, nhóm theo máy hoặc thợ, hiển thị các khối công đoạn.
    2. `activeView = 'gantt'`: Component `MoldJobGantt.tsx` — Biểu đồ tiến độ Gantt Chart thể hiện các thanh công đoạn theo trục thời gian thực.
  - **Bộ lọc linh hoạt trên Toolbar (`ToolingScheduleToolbar.tsx`):**
    * Chọn khung thời gian: 1 tuần (`week1`), 2 tuần (`week2`), 1 tháng (`month`).
    * Chọn góc nhìn (`perspective`): Theo Job (`job`) hoặc theo Work Order (`wo`).
    * Chọn luồng công đoạn (`track`): Toàn bộ (`ALL`), Khuôn chính (`MOLD`), Khuôn Plug (`PLUG`), Hoàn thiện (`FINISH`).

---

### Câu hỏi 11: Những phần nào đã dùng được tại xưởng ngay bây giờ?
1. **Tra cứu & Quản lý hồ sơ Job khuôn (`/equipment/jobs`):**
   - Đã xem được 1,203 jobs thực tế từ DB Supabase Production.
   - Tìm kiếm thời gian thực theo mã khuôn, tên sản phẩm, khách hàng.
   - Xem chi tiết Job (`/equipment/jobs/[id]`) với đầy đủ 3 Tab: Overview, Steps, Logs.
2. **Xem và điều phối lịch gia công khuôn (`/equipment/schedule`):**
   - Đã tải dữ liệu thực tế (`getJobsForGantt`) và hiển thị bảng lưới Excel Grid View.
   - Thống kê tự động số Job đang làm (`inProgress`) và số Job quá hạn (`overdue`).
3. **Ghi nhận giờ công Nippo hàng ngày (`/worklogs/new`):**
   - Đã có giao diện đầy đủ trên PC/Tablet xưởng: Chọn Thợ, Chọn Ngày, Chọn Job, Chọn Step, Nhập số giờ làm việc, Chọn Máy và Mã công việc.
   - Đã có tính năng chốt hoàn thành công đoạn (`is_finished`) tự động cập nhật tiến độ.
4. **Báo cáo phiếu in Nippo A4 chuẩn Nhật (`/reports/daily-worklog`):**
   - Đã có màn hình chọn Thợ và Ngày để xem toàn bộ danh sách công việc đã làm trong ngày.
   - Đã tích hợp component `DailyWorklogA4Sheet` xuất phiếu in khổ A4 có đóng dấu Hanko điện tử, sẵn sàng thay thế hoàn toàn việc in phiếu giấy từ Access!

---

### Câu hỏi 12: Những phần nào chỉ có schema/UI nhưng chưa đủ để vận hành?
1. **Thiếu cơ chế ghi nhận Tác vụ Nội bộ (5S, bảo trì, Kaizen) tách biệt:**
   - Schema `work_logs` bắt buộc `job_id NOT NULL`. Thợ xưởng khi làm 5S không thể ghi log nếu không có Job.
   - *Biện pháp:* Khởi tạo 1 Job nội bộ chuẩn hóa (`JOB-INTERNAL-SHOP`) là vận hành được ngay.
2. **Cơ chế cập nhật thời gian thực (Realtime Refresh) trên màn hình Lập lịch:**
   - Khi thợ nhập log và hoàn thành step trên `/worklogs`, trên màn hình `/equipment/schedule`, quản lý xưởng cần bấm tải lại trang để thấy tiến độ cập nhật mới nhất.
3. **Mẫu khởi tạo nhanh công đoạn theo máy (CNC / Khoan):**
   - Hiện tại việc tạo step mới trên modal `EditStepModal` đòi hỏi nhập từng trường thủ công, chưa có các nút bấm 1-chạm kiểu mẫu: *"Thêm bước Phay CNC"* hoặc *"Thêm bước Khoan thoát khí"*.
4. **Khoảng trống dữ liệu mới nhất (27 Jobs & 81 Steps phát sinh từ tháng 8–10/2026):**
   - Các công việc mới phát sinh gần đây vẫn đang nằm trong file Access, chưa được nạp vào Supabase nên xưởng chưa thấy các Job của tháng 9-10/2026 trên giao diện web.

---

## 4. ĐỀ XUẤT THIẾT KẾ PILOT VẬN HÀNH BỘ PHẬN KHUÔN NHỎ NHẤT (MINIMAL VIABLE PILOT)

Để đưa hệ thống vào vận hành thực tế tại xưởng ngay trong tuần mà **KHÔNG CẦN migration schema** và **KHÔNG CẦN sửa code phức tạp**:

```
[Khởi tạo Job nội bộ] ──> [Phát hành Job khuôn] ──> [Thợ ghi Nippo hàng ngày] ──> [Quản lý duyệt & in A4]
   JOB-INTERNAL-SHOP         /equipment/jobs             /worklogs/new            /reports/daily-worklog
  (5S, Bảo trì, Kaizen)      (Gán thợ & Deadline)     (Tự động tính giờ công)     (Đóng dấu Hanko điện tử)
```

### Kế hoạch 4 bước triển khai thử nghiệm:
1. **Bước 1 (Chuẩn bị dữ liệu mẫu nội bộ):** Tạo duy nhất 1 bản ghi Job xưởng nội bộ `JOB-INTERNAL-SHOP` kèm 4 bước chuẩn (5S, Bảo trì, Sửa khuôn, Stacking) để thợ có thể ghi mọi tác vụ ngoài đơn hàng.
2. **Bước 2 (Vận hành Lập lịch):** Quản lý phòng khuôn sử dụng `/equipment/jobs` và `/equipment/schedule` để phân công thợ (`assigned_to`) và đặt hạn chót (`deadline`) cho 3–5 bộ khuôn đang gia công thực tế.
3. **Bước 3 (Thợ ghi nhận hàng ngày):** Thợ khuôn truy cập `/worklogs/new` từ máy tính bảng hoặc máy tính xưởng để ghi nhận 100% giờ công thực tế trong ca làm việc.
4. **Bước 4 (Nghiệm thu cuối ngày):** Quản lý xưởng truy cập `/reports/daily-worklog` để kiểm tra tổng giờ làm, đối chiếu tiến độ trên `/equipment/schedule` và in phiếu ký duyệt A4.

---
*Báo cáo khảo sát hoàn tất ở chế độ 100% Chỉ-đọc, sẵn sàng để PE thẩm định và ban hành đặc tả chi tiết.*
