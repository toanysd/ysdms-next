# Kế hoạch Chuẩn hóa Chỉ thị Sản xuất (Work Order) & Biểu đồ Tiến độ Gia công (Gantt Schedule)

## Bối cảnh & Mục tiêu

Theo quy trình chuẩn của YSD:
$$\text{Sản phẩm (products)} \longrightarrow \text{Thiết kế CAD (design\_revisions)} \longrightarrow \text{Chỉ thị sản xuất (work\_orders)} \longrightarrow \text{Thiết bị vật lý (equipment)} \longrightarrow \text{Lệnh gia công (jobs)} \longrightarrow \text{Công đoạn (job\_steps)}$$

* Một **Chỉ thị sản xuất (`work_orders` — 製作指示書)** đại diện cho 1 lần nhận yêu cầu chế tạo bộ khuôn/dao (`WO-YYYY-XXXXXX`).
* Một Chỉ thị sản xuất có thể chỉ thị nhiều thiết bị cần gia công (VD: 1 Job Khuôn chính `MOLD`, 1 Job Dao cắt `CUTTER`...).
* Các thiết bị dùng chung có sẵn (`WATER_BASE`, `FRAME`, `PRESSURE_BASE`) chỉ liên kết bộ gá (`equipment_assignments`), **không sinh Job / Step gia công mới**.
* Biểu đồ tiến độ gia công (**Gantt Schedule**) chỉ tập trung hiển thị các **Chỉ thị sản xuất và các Job của thiết bị thực sự cần chế tạo mới (có hạn gia công)**, loại bỏ triệt để các track/step rác của thiết bị có sẵn.

---

## Các Thay Đổi Cụ Thể

### 1. Tách & Chuẩn hóa Tạo Job từ Chỉ thị Sản xuất (`src/app/api/ocr/save/route.ts`)

* **Tạo Chỉ thị sản xuất gốc (`work_orders`)**:
  - Mã lệnh: `WO-YYYY-XXXXXX`
  - Tên: `新規金型製作: [Product Code]`
  - Liên kết: `product_id`, `design_revision_id`, `company_id`, `deadline = MAX(deadlines)`.
* **Tạo Lệnh gia công (`jobs`) tách biệt theo từng thiết bị cần chế tạo**:
  - **Job 1 (Khuôn chính - MOLD)**: Gán `equipment_id = moldEquipmentId`, `job_type_id = '1'`, `deadline = mold_deadline`. Insert các `job_steps` thuộc công đoạn chế tạo khuôn.
  - **Job 2 (Dao cắt - CUTTER)**: *Chỉ tạo khi Dao cắt là NEW (`condition !== 'EXISTING'`).* Gán `equipment_id = cutterEquipmentId`, `job_type_id = '3'` (hoặc `CUTTER_NEW`), `deadline = cutter_deadline`.
* **Thiết bị dùng chung (`WATER_BASE`, `FRAME`...)**:
  - Tự động tra cứu và lưu quan hệ gá lắp vào `equipment_assignments`.
  - **KHÔNG insert `job_steps` rác vào các Job gia công**.

---

### 2. Chuẩn hóa Biểu đồ Kế hoạch Gantt Chart (`src/components/equipment/MoldJobGantt.tsx` & `src/app/equipment/schedule/page.tsx`)

* **Cấu trúc Cây Gantt theo Chỉ thị sản xuất (`work_orders`)**:
  - **Cấp 1 - Work Order Header**: `📋 WO-YYYY-XXXXXX: [Mã SP / Tên khuôn] | Hạn: dd/mm`
  - **Cấp 2 - Lệnh gia công theo thiết bị**:
    - `🔧 Khuôn chính (M-TOW004)`
    - `✂️ Dao cắt (C-TOW004)` (nếu có chế tạo mới)
  - **Cấp 3 - Công đoạn gia công thực tế (`job_steps`)**: Phay CNC, Cắt dây EDM, Đánh bóng, v.v.
* **Lọc bỏ triệt để thiết bị dùng chung (`condition: 'EXISTING'`)**:
  - Ẩn các track/step của thiết bị có sẵn trên biểu đồ Gantt để không gây rối mắt và không làm hiểu lầm là công việc trễ hạn.
* **Đồng bộ KPI & Bộ lọc**:
  - Tổng số Job, Đang làm, Hoàn thành, Trễ hạn chỉ tính trên các Job chế tạo thực tế.

---

## Kế hoạch Kiểm thử & Xác thực

1. **Kiểm tra TypeScript**: Chạy `npx tsc --noEmit` (0 errors).
2. **Kiểm tra Đa ngôn ngữ (i18n)**: Chạy `node scripts/check_translations.mjs` (0 missing keys).
3. **Kiểm thử Luồng OCR Save & Schedule**:
   - Lưu 1 phiếu chỉ thị sản xuất mới (có Khuôn mới, Dao mới, Đế nước có sẵn).
   - Kiểm tra DB: `work_orders` tạo đúng 1 bản ghi, `jobs` chỉ tạo cho Khuôn và Dao, `equipment_assignments` liên kết Đế nước.
   - Kiểm tra `/equipment/schedule`: Gantt chart hiển thị gọn gàng theo cây `Work Order` $\rightarrow$ `Job Khuôn / Job Dao` $\rightarrow$ `Công đoạn`, không còn dòng Đế nước / Khung rác.
