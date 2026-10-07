# Báo Cáo Kiểm Toán Bổ Sung Chỉ-Đọc: Phân Loại entity_type trong Bảng staging_access_delta_b1
## (Giải trình chi tiết kết quả truy vấn Postflight B1 của PE)

- **Thời điểm thực hiện:** 2026-10-07 10:15 JST  
- **Đối tượng kiểm tra:** `public.staging_access_delta_b1` trên Supabase Production  
- **Tính chất kiểm toán:** 100% Chỉ-đọc (Read-Only), 0 cập nhật DB, 0 insert Production  
- **Người thực hiện:** Kỹ sư thi công AN  
- **Gửi đến:** Minh Chủ Thoan & Kiến trúc sư trưởng / Kiểm toán viên độc lập PE  

---

## 1. NGUYÊN NHÂN GỐC CỦA SAI LỆCH `staging_step_rows = 0` VÀ `staging_work_log_rows = 0`

Trong phiên kiểm toán độc lập lúc 19:30 JST (2026-10-06), PE sử dụng truy vấn với điều kiện chữ thường:
* `WHERE entity_type = 'job_step'` ➔ kết quả: `0`
* `WHERE entity_type = 'work_log'` ➔ kết quả: `0`

**Nguyên nhân gốc (Root Cause):**
Trong quá trình nạp staging tại `scripts/execute_staging_b1.py`, trường `entity_type` được gán theo quy ước ENUM in hoa (Uppercase):
* **6 dòng bước công đoạn:** `entity_type = 'STEP'` (nguồn `tblProcessingDeadline`)
* **5 dòng nhật ký công việc:** `entity_type = 'WORK_LOG'` (nguồn `tblWorkLog`)

Do Postgres phân biệt hoa thường (`Case-Sensitive`) trong so sánh chuỗi (`=`), điều kiện so sánh chuỗi thường của PE trả về 0 dòng, mặc dù 11 dòng thực tế đều đã được nạp chính xác và phân loại trọn vẹn 6/5.

---

## 2. KẾT QUẢ CÁC TRUY VẤN CHỈ-ĐỌC THEO YÊU CẦU CỦA PE

### 2.1. Phân nhóm theo `entity_type` và `source_table`:
```sql
SELECT entity_type, source_table, count(*) AS row_count 
FROM public.staging_access_delta_b1 
GROUP BY entity_type, source_table 
ORDER BY entity_type, source_table;
```
**Kết quả thực tế từ Supabase Production:**
| entity_type | source_table | row_count |
|---|---|---|
| **STEP** | `tblProcessingDeadline` | **6** |
| **WORK_LOG** | `tblWorkLog` | **5** |

### 2.2. Danh sách các giá trị `DISTINCT entity_type`:
```sql
SELECT DISTINCT entity_type 
FROM public.staging_access_delta_b1 
ORDER BY entity_type;
```
**Kết quả thực tế:**
* `STEP`
* `WORK_LOG`

---

## 3. SCHEMA VÀ CONSTRAINTS THẬT CỦA BẢNG STAGING

### 3.1. Ràng buộc toàn vẹn (Constraints):
* `staging_access_delta_b1_pkey`: `PRIMARY KEY (staging_id)`
* `uq_staging_b1_legacy_id`: `UNIQUE (legacy_id)` — Đảm bảo Idempotency chống nạp trùng.
* `uq_staging_b1_source_key`: `UNIQUE (source_table, source_primary_key)` — Chống trùng dòng từ file nguồn Access.

### 3.2. Cấu trúc các cột (Columns):
| Column Name | Data Type | Nullable | Default | Mục đích |
|---|---|---|---|---|
| `staging_id` | `uuid` | NO | `gen_random_uuid()` | Khóa chính của dòng staging |
| `source_table` | `text` | NO | — | Bảng nguồn Access (`tblProcessingDeadline` / `tblWorkLog`) |
| `source_primary_key` | `bigint` | NO | — | PK nguồn Access (4275, 4276... / 9052, 8882...) |
| `source_file_sha256` | `text` | NO | — | Mã băm file Access thời điểm audit |
| `source_row_hash` | `text` | NO | — | Mã băm SHA-256 nội dung dòng nguồn |
| `legacy_id` | `text` | NO | — | Khóa định danh liên kết (`LEGACY-STEP-...` / `LEGACY-LOG-...`) |
| `entity_type` | `text` | NO | — | Loại thực thể (`STEP` / `WORK_LOG`) |
| `target_candidate_id`| `uuid` | YES| — | UUID mục tiêu nếu có |
| `target_job_id` | `uuid` | YES| — | UUID Job cha trên Supabase |
| `parent_job_code` | `text` | YES| — | Mã Job cha hiển thị (JAE381, KSP227...) |
| `step_no` | `integer`| YES| — | Số thứ tự bước (2, 3, 4) cho STEP |
| `step_name` | `text` | YES| — | Tên bước công đoạn cho STEP |
| `processing_status_id`| `integer`| YES| — | Trạng thái kỹ thuật (9: N.進行中 hoặc NULL) |
| `step_status` | `text` | YES| — | Trạng thái nghiệp vụ (PENDING / COMPLETED) |
| `deadline` | `timestamptz` | YES | — | Hạn chót công đoạn |
| `employee_id` | `uuid` | YES| — | UUID nhân viên cho WORK_LOG |
| `employee_name` | `text` | YES| — | Tên nhân viên hiển thị |
| `processing_code_id` | `integer`| YES| — | Mã công đoạn (10, 11, 12, 14) |
| `work_date` | `timestamptz` | YES | — | Ngày làm việc cho WORK_LOG |
| `hours_spent` | `numeric`| YES| — | Giờ công thực tế (1.00h - 2.50h) |
| `is_finished` | `boolean`| YES| `false` | Cờ hoàn thành công đoạn từ log |
| `notes` | `text` | YES| — | Ghi chú |
| `payload` | `jsonb` | NO | — | Toàn bộ bản ghi thô dạng JSONB |
| `validation_status` | `text` | NO | `'NEW_SAFE_TO_STAGE'` | Trạng thái hợp lệ kiểm toán |
| `validation_error` | `text` | YES| — | Chi tiết lỗi nếu có |
| `created_at` | `timestamptz` | YES | `now()` | Thời điểm tạo |

---

## 4. BẢNG DỮ LIỆU ĐỐI SOÁT CHI TIẾT 11 DÒNG TRONG STAGING

| # | Staging ID | Source Table & PK | Legacy ID | Entity Type | Target Job Code & UUID | Step / Hours | Validation |
|---|---|---|---|---|---|---|---|
| 1 | `e3ad0672-3ffc-43c8-bfc0-65a058120b9c` | `tblProcessingDeadline`<br>4226 | `LEGACY-STEP-4226` | `STEP` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | Step 3: 金型 (MOLD)<br>Status: 9 (PENDING) | `NEW_SAFE_TO_STAGE` |
| 2 | `fa4936df-877a-4213-9e60-d08820fb479a` | `tblProcessingDeadline`<br>4238 | `LEGACY-STEP-4238` | `STEP` | `JAE380`<br>`39dbbc91-c7b4-4a90-bdd8-8c894b782092` | Step 3: 抜型 (CUTTER)<br>Status: COMPLETED | `NEW_SAFE_TO_STAGE` |
| 3 | `e597070c-f80e-42d6-89b5-1fddd868b27d` | `tblProcessingDeadline`<br>4241 | `LEGACY-STEP-4241` | `STEP` | `KSP227`<br>`17131b0b-3f8c-40dd-988a-fc1d1c9888bc` | Step 3: 抜型 (CUTTER)<br>Status: COMPLETED | `NEW_SAFE_TO_STAGE` |
| 4 | `380e5491-3b65-4e40-a1cd-bd260f4446eb` | `tblProcessingDeadline`<br>4251 | `LEGACY-STEP-4251` | `STEP` | `MMT021R2`<br>`c33e3f71-d3b0-48dd-8c34-11ad76a4a195` | Step 3: 抜型 (CUTTER)<br>Status: COMPLETED | `NEW_SAFE_TO_STAGE` |
| 5 | `96e10b04-2124-429d-bd28-a2052cc8616c` | `tblProcessingDeadline`<br>4275 | `LEGACY-STEP-4275` | `STEP` | `ZA水冷ベース`<br>`249439b2-e1c6-4b42-ba99-54910d1f8a14` | Step 2: 金型 (MOLD)<br>Status: 9 (PENDING) | `NEW_SAFE_TO_STAGE` |
| 6 | `0f0c4301-0561-40c6-a68e-f75ad9b24e61` | `tblProcessingDeadline`<br>4276 | `LEGACY-STEP-4276` | `STEP` | `ASH021R2`<br>`dcaa2eb8-f66b-426d-9bb0-5a4ec7e18d00` | Step 4: スタッキング (STAKING)<br>Status: COMPLETED | `NEW_SAFE_TO_STAGE` |
| 7 | `c7f83103-aca3-4bab-a61c-c44195529f85` | `tblWorkLog`<br>8882 | `LEGACY-LOG-8882` | `WORK_LOG` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | 2.00h (Nguyễn Đăng Thoan)<br>Mã 10: 金型演算＆加工 | `NEW_SAFE_TO_STAGE` |
| 8 | `0e5c147e-5c50-4eca-a140-6ce4429d258a` | `tblWorkLog`<br>8895 | `LEGACY-LOG-8895` | `WORK_LOG` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | 1.00h (Nguyễn Đăng Thoan)<br>Mã 10: 金型演算＆加工 | `NEW_SAFE_TO_STAGE` |
| 9 | `fd506549-8674-43b1-bcc5-755fb6b7e218` | `tblWorkLog`<br>8901 | `LEGACY-LOG-8901` | `WORK_LOG` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | 2.50h (Đào Thị Diên)<br>Mã 11: 本型穴あけ | `NEW_SAFE_TO_STAGE` |
| 10 | `708e9c65-23bc-4fd9-980c-e9b9bf809269` | `tblWorkLog`<br>8920 | `LEGACY-LOG-8920` | `WORK_LOG` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | 2.00h (Đào Thị Diên)<br>Mã 12: 本型ミガキ | `NEW_SAFE_TO_STAGE` |
| 11 | `dbdb53e7-03be-4188-8849-fd1aa8e8d45c` | `tblWorkLog`<br>9052 | `LEGACY-LOG-9052` | `WORK_LOG` | `ZA水冷ベース`<br>`249439b2-e1c6-4b42-ba99-54910d1f8a14` | 1.50h (Nguyễn Đăng Thoan)<br>Mã 14: 演算＆加工 | `NEW_SAFE_TO_STAGE` |

---

## 5. ĐỀ XUẤT XỬ LÝ VÀ BƯỚC TIẾP THEO

1. **Tuân thủ kỷ luật nghiêm ngặt:** AN tuyệt đối **KHÔNG tự ý chạy lệnh UPDATE staging**, **KHÔNG tự ý ghi vào Production**, không thay đổi trạng thái trước khi Minh Chủ Thoan và PE chốt giải pháp.
2. **Hai phương án lựa chọn:**
   * **Phương án A (Khuyên nghị — Tiết kiệm và an toàn):** PE cập nhật câu truy vấn kiểm toán độc lập sang điều kiện:
     ```sql
     -- Truy vấn theo entity_type in hoa
     SELECT count(*) FROM public.staging_access_delta_b1 WHERE entity_type = 'STEP';     -- Ra 6
     SELECT count(*) FROM public.staging_access_delta_b1 WHERE entity_type = 'WORK_LOG'; -- Ra 5

     -- Hoặc truy vấn theo source_table
     SELECT count(*) FROM public.staging_access_delta_b1 WHERE source_table = 'tblProcessingDeadline'; -- Ra 6
     SELECT count(*) FROM public.staging_access_delta_b1 WHERE source_table = 'tblWorkLog';            -- Ra 5
     ```
     *Ưu điểm:* Dữ liệu Staging giữ nguyên vẹn 100%, không phát sinh thao tác ghi nào trên DB.
   * **Phương án B (Chuẩn hóa convention chuỗi thường):** Nếu PE muốn bắt buộc chuẩn hóa `entity_type` thành `'job_step'` và `'work_log'`, Minh Chủ Thoan phê duyệt, AN sẽ chạy một lệnh UPDATE duy nhất có kiểm soát trong Staging:
     ```sql
     UPDATE public.staging_access_delta_b1 SET entity_type = 'job_step' WHERE entity_type = 'STEP';
     UPDATE public.staging_access_delta_b1 SET entity_type = 'work_log' WHERE entity_type = 'WORK_LOG';
     ```
3. **Bảo toàn Production Baseline:**
   * `jobs`: **1,205** (không đổi)
   * `job_steps`: **2,451** (không đổi)
   * `work_logs`: **7,106** (không đổi)
