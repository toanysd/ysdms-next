# ADR-011: Nippo V2 — Production Worklog Enhancement (Nhật Ký Sản Xuất & Hoàn Thành Công Đoạn)

**Ngày đề xuất:** 2026-09-08  
**Trạng thái:** PROPOSED  
**Người đề xuất:** AN (Antigravity Architect)  
**Người phê duyệt:** PE (Perplexity Engineer), Anh Thoan (Product Owner) — *Đang chờ duyệt*  
**Chỉ thị căn cứ:** Chỉ thị #030 & #031 (Milestone 20: Nippo V2 — Production Worklog)  

---

## 1. Bối Cảnh & Hiện Trạng Dữ Liệu

### 1.1 Khảo sát Live DB
1. Toàn bộ 100% bản ghi `work_logs` trong cơ sở dữ liệu hiện tại chỉ ghi nhận `hours_spent` (giờ công).
2. Trường `quantity_done` (sản lượng đạt) bị `NULL` toàn bộ; `quantity_ng` (phế phẩm) mặc định là 0.
3. Trường `is_finished` toàn bộ là `false`, không có cơ chế hoàn tất công đoạn đồng bộ ngược lại `job_steps.step_status`.
4. **Đặc thù thực tế (Xác nhận từ Anh Thoan):** Từ trước đến nay xưởng YSD chỉ có nhật ký làm việc của **Xưởng Chế Tạo Khuôn (金型工場 - Mold Shop)** và **Phòng Thiết Kế (設計部)** để tính giờ công phay CNC, thiết kế CAD, đánh bóng. Xưởng **thực tế chưa từng có nhật ký gia công/sản xuất cho khâu dập khay định hình (Thermoforming)**.
5. Bảng `job_types` hiện chỉ có 10 loại phục vụ chế tạo khuôn/thiết bị (`MOLD_NEW`, `MOLD_MODIFY`, `CUTTER_NEW`, `WATER_BASE`, `FRAME`...). **Chưa có loại job nào cho `THERMOFORMING` (Sản xuất khay)**.

---

## 2. Các Quyết Định Kiến Trúc (Architectural Decisions)

### Quyết định 1: Không dùng Trigger DB — Step Completion Logic nằm trong Server Action
- Trigger cũ `trg_update_step_status_from_worklogs` chỉ cập nhật `processing_status_id` (trường phụ numeric), không cập nhật `job_steps.step_status` và `actual_hours`.
- Thay vì sửa trigger chạy ngầm khó kiểm soát, toàn bộ logic hoàn thành công đoạn sẽ được thực thi rõ ràng, minh bạch trong **Server Action** (`createWorklog.ts` / `actions.ts`):
  - Khi `is_finished === true`:
    1. Cập nhật `job_steps.step_status = 'COMPLETED'`.
    2. Tính tổng `hours_spent` từ `work_logs` của step đó và gán vào `job_steps.actual_hours`.
    3. Nếu tất cả `job_steps` của `job_id` đó đều `COMPLETED` $\rightarrow$ tự động cập nhật `jobs.job_status = 'COMPLETED'` và `jobs.completed_date = NOW()`.

### Quyết định 2: Phân biệt ngữ cảnh công việc (`jobCategory`) phía Server
- Không dùng cờ `isProductionContext` boolean tùy tiện.
- Phân loại 3 nhóm `jobCategory`:
  - `'MOLD_SHOP'`: Gia công khuôn mẫu, gá đặt (chỉ nhập giờ công `hours_spent`, mã công việc `processing_code_id`).
  - `'THERMOFORMING'`: Sản xuất dập khay nhựa định hình (BẮT BUỘC hiển thị khối **"生産実績"**: `quantity_done`, `quantity_ng`, chọn `machine_id`).
  - `'GENERAL'`: Nghiệp vụ chung, nội bộ, bảo trì.
- `jobCategory` được derive phía server từ thuộc tính của Job hoặc Work Order context trước khi truyền xuống Form.

### Quyết định 3: Không thêm cột `work_order_id` vào `work_logs`
- 100% bản ghi `jobs` trong hệ thống đã liên kết chặt chẽ với `work_order_id` và `equipment_id` (kết quả từ Milestone 19).
- Mọi truy vấn phân tích, lọc hay báo cáo Work Order Nippo đều join qua `work_logs.job_id = jobs.job_id` $\rightarrow$ `jobs.work_order_id`, bảo toàn nguyên tắc chuẩn hóa dữ liệu.

### Quyết định 4: Dropdown máy móc (`machine_id`) chỉ hiển thị khi `jobCategory = 'THERMOFORMING'`
- Máy dập định hình (máy hút chân không Rv53, Rv74...) chỉ có ý nghĩa khi công nhân ghi nhận sản lượng dập khay.
- Đối với khâu nguội, đánh bóng hoặc thiết kế, không bắt buộc chọn máy.

---

## 3. Thay Đổi Cơ Sở Dữ Liệu (Schema Changes)

- **Migration mới:** **KHÔNG CẦN TẠO MIGRATION MỚI** cho bảng `work_logs`.
- Các cột `quantity_done` (INTEGER), `quantity_ng` (INTEGER DEFAULT 0), `machine_id` (UUID REFERENCES machines) **đã có sẵn** trong schema của bảng `work_logs`.
- Cần bổ sung 1 bản ghi vào `job_types` (hoặc cấu hình) cho công đoạn dập khay:
  `job_type_id = '11'`, `job_type_name_ja = '成形生産'`, `job_type_name_vi = 'Sản xuất dập khay'`, `category = 'THERMOFORMING'`.

---

## 4. Danh Mục Files Ảnh Hưởng

| File | Nội dung thay đổi |
|---|---|
| `src/app/worklogs/_actions/createWorklog.ts` | Parse `quantity_done`, `quantity_ng`, `machine_id`. Thực thi Step Completion Engine (update `job_steps` & `jobs`). |
| `src/components/worklogs/WorklogFormShared.tsx` | Nhận `jobCategory`, render khối "生産実績" khi `THERMOFORMING` (máy, sản lượng đạt, phế phẩm, tỷ lệ NG realtime). |
| `src/app/production/work-orders/[id]/_components/TabWorklogs.tsx` | Nút bấm `[+ 日報を記録]` mở modal ghi nhật ký pre-fill `work_order_id` và Job. |
| `src/app/worklogs/page.tsx` | Hỗ trợ filter theo `wo_id`, tối ưu query tính tổng giờ theo nhóm jobs hiển thị. |

---

## 5. Kế Hoạch Kiểm Thử & Tiêu Chí Nghiệm Thu (Quality Gates)

1. `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. `node scripts/check_translations.mjs` $\rightarrow$ 0 missing keys.
3. **Thử nghiệm thực tế:** Ghi 1 work_log cho `WO-L-1248` với `quantity_done = 100`, `quantity_ng = 3` $\rightarrow$ Xác nhận DB ghi đúng số lượng và máy dập.
4. **Thử nghiệm hoàn tất:** Ghi log với `is_finished = true` $\rightarrow$ Xác nhận `job_steps.step_status = 'COMPLETED'` và `job_steps.actual_hours` được tính tổng tự động.
