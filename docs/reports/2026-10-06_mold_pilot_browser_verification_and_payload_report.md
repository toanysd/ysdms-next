# BÁO CÁO KIỂM THỬ TRÌNH DUYỆT CHỈ-ĐỌC 6 ROUTES & DỰ THẢO PAYLOAD JOB NỘI BỘ
**Mã báo cáo:** `2026-10-06_mold_pilot_browser_verification_and_payload_report`  
**Thời gian thực hiện:** 2026-10-06 16:45 JST  
**Người thực hiện:** AN (Senior Software Engineer)  
**Cơ chế thực thi:** 100% Chế độ Chỉ-Đọc (Strictly Read-Only Browser Verification)  
**Phê duyệt chỉ đạo:** Minh Chủ Thoan [Stamp: 2026-10-06 16:35 JST] & PE [Stamp: 2026-10-06 16:35 JST]  

---

## 1. THÔNG SỐ KIỂM TRA HỆ THỐNG & REPOSITORY

| Chỉ số kiểm tra | Giá trị thực tế đã xác minh | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Commit SHA cục bộ (HEAD)** | `f3fa7a6f09c6793413e6900aeeeb69522818b9c0` | Đã commit toàn bộ tài liệu & Section 24 handoff |
| **Commit SHA remote (`origin/main`)** | `45bd20a76f9cbd25a0cfecd5ad20ccc31b34fcbc` | Cần Minh Chủ Thoan duyệt xác thực GCM để push |
| **Trạng thái TypeScript** | `npx tsc --noEmit` $\rightarrow$ **0 errors** | 100% hợp lệ |
| **Trạng thái Đa ngôn ngữ (i18n)** | `node scripts/check_translations.mjs` $\rightarrow$ **0 missing keys** | Khớp 100% giữa `ja.json` và `vi.json` |
| **Cơ chế xác thực thử nghiệm** | Phiên đăng nhập thật (`admin@ysd-pack.co.jp`) | Sử dụng cookie SSR chuẩn `sb-iirezrszalmecsslbruo-auth-token` |
| **Cam kết an toàn Production** | **0 ghi Supabase, 0 submit form, 0 migration** | Tuyệt đối tuân thủ chỉ-đọc |

---

## 2. KẾT QUẢ KIỂM THỬ TRÌNH DUYỆT (BROWSER RECONNAISSANCE) — 6 ROUTES

Toàn bộ 6 routes được tự động hóa kiểm tra bằng Playwright Chromium ở độ phân giải 1440x900 (locale `ja-JP`):

| # | Route kiểm tra | Mục đích nghiệp vụ | HTTP Status | Dữ liệu hiển thị thực tế | Lỗi Console | Lỗi Network | Thời gian tải | Kết quả |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | `/equipment/jobs` | Danh sách Job khuôn | **200 OK** | **50 records/trang** (tổng 1,204 jobs), phân trang 1/25, đầy đủ hyperlink & status badge | **0** | **0** | 4,507 ms | **PASS** |
| **2** | `/equipment/jobs/[id]` (`SMK-227D`) | Chi tiết Job & Steps | **200 OK** | Tiêu đề `SMK227D`, 3 Tab (Overview, Steps, Logs), thông số kích thước, 22 buttons | **0** | **0** | 4,227 ms | **PASS** |
| **3** | `/equipment/schedule` | Lịch gia công & Gantt | **200 OK** | Tiêu đề `金型加工スケジュール`, Toolbar lọc 1-2 tuần / 1 tháng, nút chuyển Grid/Gantt, 55 buttons | **0** | **0** | 5,568 ms | **PASS** |
| **4** | `/worklogs/new` | Form nhập Nippo | **200 OK** | Form `作業ログ — 新規登録`, Ngày làm, Dropdown Thợ, Dropdown Job, Chọn nhanh số giờ, 7 inputs | **0** | **0** | 4,218 ms | **PASS** |
| **5** | `/worklogs` | Danh sách Nippo đã nhập | **200 OK** | **50 records/trang** (tổng 7,105 logs), phân trang 1/143, hiển thị thợ, số giờ, công đoạn | **0** | **0** | 5,333 ms | **PASS** |
| **6** | `/reports/daily-worklog` | Phiếu in Nippo A4 | **200 OK** | Biểu mẫu in `日報記録書 【設計＆金型部門】`, khung đóng dấu Hanko, bảng đơn giá nhân công, nút Xuất PDF | **0** | **0** | 4,298 ms | **PASS** |

### Chi tiết tệp bằng chứng ảnh chụp màn hình (Screenshots Evidence):
1. `docs/reports/screenshots/pilot_route_1_equipment_jobs.png` (51,709 bytes): Hiển thị bảng 50 Jobs với cột mã khuôn, tên sản phẩm, thanh tiến độ 100%, badge 完了.
2. `docs/reports/screenshots/pilot_route_2_equipment_job_detail.png` (68,969 bytes): Hiển thị chi tiết Job SMK-227D với các khối 基本情報, 金型寸法, 計画.
3. `docs/reports/screenshots/pilot_route_3_equipment_schedule.png` (81,055 bytes): Hiển thị màn hình lập lịch và timeline gia công khuôn theo ngày.
4. `docs/reports/screenshots/pilot_route_4_worklogs_new.png` (108,123 bytes): Hiển thị đầy đủ form nhập nhật ký Nippo với các trường chọn và nút lưu.
5. `docs/reports/screenshots/pilot_route_5_worklogs_list.png` (106,666 bytes): Hiển thị bảng 50 dòng nhật ký công việc thực tế từ phân xưởng.
6. `docs/reports/screenshots/pilot_route_6_reports_daily_worklog.png` (47,530 bytes): Hiển thị phiếu in A4 chuẩn Nhật kèm khung dấu kiểm nhận Hanko.

---

## 3. KẾT QUẢ ĐỐI SOÁT TRUY VẤN CHỈ-ĐỌC SCHEMA CHO JOB NỘI BỘ

Đã thực hiện truy vấn trực tiếp từ Supabase Production để xác minh toàn bộ các ràng buộc và định danh:

### 3.1. Kiểm tra Xung đột Mã (Conflict Check)
- Truy vấn: `SELECT job_id, job_code FROM jobs WHERE job_code = 'JOB-INTERNAL-SHOP' OR job_code ILIKE '%INTERNAL%'`
- Kết quả: **0 dòng** (Hoàn toàn chưa tồn tại, 0 xung đột khóa chính hoặc unique).

### 3.2. Ràng buộc Bảng `jobs`
- **Số cột:** 46 cột.
- **Cột bắt buộc (NOT NULL, không default):** Chỉ có duy nhất 2 cột: `job_code` (TEXT) và `job_name` (TEXT).
- **Ràng buộc kiểm tra `job_status`:** `CHECK (job_status = ANY (ARRAY['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']))`. Giá trị hợp lệ cho Job đang chạy: `'IN_PROGRESS'`.
- **Ràng buộc `job_category`:** Đã xác minh có sẵn 10 bản ghi mang danh mục `'INTERNAL_OPS'` trên Production. Đây là danh mục SSOT chuẩn cho công việc nội bộ xưởng.
- **Công ty nội bộ YSD:** `company_id = '1b234ffe-deeb-46a3-8408-47285e7ec1e9'` (`company_code: 'YSD'`, `(株)ヨシダ成形`).
- Các trường `equipment_id` và `work_order_id`: Cho phép `NULL`.

### 3.3. Ràng buộc Bảng `job_steps` & 4 Bước Chuẩn
- **Cột bắt buộc (NOT NULL, không default):** `job_id` (UUID), `step_no` (INTEGER), `step_name` (TEXT).
- **Ràng buộc kiểm tra `step_status`:** `CHECK (step_status = ANY (ARRAY['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']))`.
- **4 Bước công đoạn chuẩn đã ánh xạ chính xác với ID thực tế:**
  1. **Bước 1 (`step_no = 1`):** `5S・工場清掃`
     * `processing_code_id`: `50` (Tên thực tế trong DB: `'5S'`, `category: 'GENERAL'`, `department_code: 'GENERAL'`).
     * `processing_item_id`: `10` (Tên thực tế trong DB: `'社内作業'`).
  2. **Bước 2 (`step_no = 2`):** `設備・コンプレッサー保全`
     * `processing_code_id`: `54` (Tên thực tế trong DB: `'メンテナンス'`, `category: 'EQUIPMENT'`, `department_code: 'MOLD_SHOP'`).
     * `processing_item_id`: `10` (Tên thực tế trong DB: `'社内作業'`).
  3. **Bước 3 (`step_no = 3`):** `金型・治具修理`
     * `processing_code_id`: `42` (Tên thực tế trong DB: `'金型・プラグ・ベース修理、穴あけなど'`, `category: 'EQUIPMENT'`, `department_code: 'MOLD_SHOP'`).
     * `processing_item_id`: `1` (Tên thực tế trong DB: `'金型'`).
  4. **Bước 4 (`step_no = 4`):** `スタッキング木板製作`
     * `processing_code_id`: `40` (Tên thực tế trong DB: `'スタッキング木板製作'`, `category: 'EQUIPMENT'`, `department_code: 'MOLD_SHOP'`).
     * `processing_item_id`: `7` (Tên thực tế trong DB: `'スタッキング'`).

---

## 4. DỰ THẢO PAYLOAD TẠO JOB NỘI BỘ (UNEXECUTED / CHƯA CHẠY)
*Tệp lưu trữ: `scripts/payload_create_job_internal_shop.sql`*

```sql
-- ==============================================================================
-- DỰ THẢO PAYLOAD CHUẨN BỊ CHO JOB NỘI BỘ (CHƯA CHẠY - PENDING THOAN & PE DUYỆT)
-- ==============================================================================

DO $$
DECLARE
    v_job_id UUID;
    v_company_id UUID;
    v_count INT;
BEGIN
    -- 1. Kiểm tra an toàn chống trùng lặp
    SELECT count(*) INTO v_count FROM public.jobs WHERE job_code = 'JOB-INTERNAL-SHOP';
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Job code JOB-INTERNAL-SHOP already exists! Aborting.';
    END IF;

    -- Lấy ID công ty nội bộ YSD
    SELECT company_id INTO v_company_id 
    FROM public.companies 
    WHERE company_code = 'YSD' 
    LIMIT 1;

    -- 2. Tạo bản ghi Job nội bộ
    INSERT INTO public.jobs (
        job_code,
        job_name,
        job_category,
        job_status,
        company_id,
        is_facility_job,
        overall_progress,
        notes,
        created_at,
        updated_at
    ) VALUES (
        'JOB-INTERNAL-SHOP',
        '社内作業・5S・保全',
        'INTERNAL_OPS',
        'IN_PROGRESS',
        v_company_id,
        TRUE,
        0,
        '社内作業・設備保全・5S・治具修理用パイロットジョブ (Internal Shop Pilot Job)',
        NOW(),
        NOW()
    ) RETURNING job_id INTO v_job_id;

    -- 3. Tạo 4 bước công đoạn chuẩn (job_steps)
    -- Step 1: 5S / Vệ sinh xưởng
    INSERT INTO public.job_steps (
        job_id, step_no, step_name, step_status, track, processing_code_id, processing_item_id, progress_percent, actual_hours, notes, created_at, updated_at
    ) VALUES (
        v_job_id, 1, '5S・工場清掃', 'IN_PROGRESS', 'FINISH', 50, 10, 0, 0, '工場環境整備、清掃、整理整頓 (5S & Factory Cleaning)', NOW(), NOW()
    );

    -- Step 2: Bảo trì máy móc & thiết bị
    INSERT INTO public.job_steps (
        job_id, step_no, step_name, step_status, track, processing_code_id, processing_item_id, progress_percent, actual_hours, notes, created_at, updated_at
    ) VALUES (
        v_job_id, 2, '設備・コンプレッサー保全', 'IN_PROGRESS', 'FINISH', 54, 10, 0, 0, '機械設備点検、コンプレッサー給油、定期保全 (Equipment Maintenance)', NOW(), NOW()
    );

    -- Step 3: Sửa khuôn / Đồ gá
    INSERT INTO public.job_steps (
        job_id, step_no, step_name, step_status, track, processing_code_id, processing_item_id, progress_percent, actual_hours, notes, created_at, updated_at
    ) VALUES (
        v_job_id, 3, '金型・治具修理', 'IN_PROGRESS', 'MOLD', 42, 1, 0, 0, '金型溶接補修、プラグ手直し、治具修理 (Mold & Jig Repair)', NOW(), NOW()
    );

    -- Step 4: Gia công ván gỗ Stacking
    INSERT INTO public.job_steps (
        job_id, step_no, step_name, step_status, track, processing_code_id, processing_item_id, progress_percent, actual_hours, notes, created_at, updated_at
    ) VALUES (
        v_job_id, 4, 'スタッキング木板製作', 'IN_PROGRESS', 'FINISH', 40, 7, 0, 0, 'スタッキング用木板加工・組み立て (Stacking Board Fabrication)', NOW(), NOW()
    );

    RAISE NOTICE 'Successfully prepared 4 internal steps for JOB-INTERNAL-SHOP.';
END $$;
```

---
*Báo cáo kiểm thử trình duyệt và chuẩn bị payload hoàn tất ở chế độ 100% chỉ-đọc. Sẵn sàng để PE thẩm tra.*
