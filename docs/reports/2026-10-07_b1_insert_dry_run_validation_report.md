# Báo Cáo Kiểm Toán & Thử Nghiệm Dry-Run: Payload INSERT B1 (6 Steps & 5 Work Logs)
## (Nguồn: public.staging_access_delta_b1 ➔ Đích: public.job_steps & public.work_logs)
### Cập nhật nâng cấp toàn diện: Bảng Mapping 19 Ràng Buộc Catalog & Fail-Closed Trigger Assertions
### Phạm vi áp dụng: Đã xử lý trong phạm vi 5 audit point và payload B1

- **Thời điểm thực hiện:** 2026-10-07 11:10 JST  
- **Cơ chế thực thi:** Live In-Transaction Dry-Run (`BEGIN ... ROLLBACK`), Fail-Closed 100%  
- **Quyết định phê duyệt:** Minh Chủ Thoan [Stamp: 2026-10-07 10:54 JST]  
- **Thẩm định kỹ thuật:** PE [Stamp: 2026-10-07 11:04 JST]  
- **Cam kết an toàn tuyệt đối:**  
  * 0 dòng ghi vĩnh viễn vào `public.job_steps`.  
  * 0 dòng ghi vĩnh viễn vào `public.work_logs`.  
  * 0 dòng cập nhật bảng chính ngoài giao dịch thử nghiệm.  
  * Bảo toàn 100% baseline Production: `jobs: 1,205`, `job_steps: 2,451`, `work_logs: 7,106`.  

---

## 1. BẢNG MAPPING TOÀN BỘ 19 CONSTRAINTS TỪ PG_CATALOG (AUDIT POINT A)

Bao phủ 100% các ràng buộc thật từ `pg_constraint` của hai bảng `public.job_steps` (10 ràng buộc) và `public.work_logs` (9 ràng buộc), phân định rõ ràng giữa các trường `NOT APPLICABLE — payload inserts NULL` và các trường có giá trị đã được kiểm chứng thực tế:

| # | Tên Constraint (`conname`) | Bảng Đích | Cột Đích | Loại Ràng Buộc | Giá Trị Trong Payload B1 | Phương Pháp Kiểm Chứng (Validation Method) | Kết Quả |
|:---:|---|---|---|:---:|---|---|:---:|
| 1 | `job_steps_pkey` | `job_steps` | `step_id` | PRIMARY KEY | 6 UUID hợp lệ sinh mới | Assert UUID duy nhất và NOT NULL | `PASS_VERIFIED` |
| 2 | `job_steps_job_id_step_no_key` | `job_steps` | `(job_id, step_no)` | UNIQUE | 6 cặp `(job_id, step_no)` phân biệt | Truy vấn kiểm tra xung đột với `job_steps` hiện hữu (count = 0) | `PASS_VERIFIED` |
| 3 | `job_steps_step_status_check` | `job_steps` | `step_status` | CHECK | 3 `'PENDING'`, 3 `'COMPLETED'` | Assert mọi giá trị thuộc tập enum cho phép | `PASS_VERIFIED` |
| 4 | `job_steps_job_id_fkey` | `job_steps` | `job_id` | FOREIGN KEY | 6 UUID Job cha | `SELECT count(*) FROM jobs WHERE job_id = s.target_job_id` (6/6 tồn tại, active) | `PASS_VERIFIED` |
| 5 | `job_steps_processing_status_id_fkey` | `job_steps` | `processing_status_id` | FOREIGN KEY | 2 dòng giá trị `9`, 4 dòng giá trị `NULL` | Với dòng có giá trị: kiểm tra `status_id = 9` tồn tại trong `processing_statuses`; Với dòng NULL: KHÔNG ÁP DỤNG | `PASS_VERIFIED` |
| 6 | `job_steps_processing_item_id_fkey` | `job_steps` | `processing_item_id` | FOREIGN KEY | 6/6 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 7 | `job_steps_assigned_to_fkey` | `job_steps` | `assigned_to` | FOREIGN KEY | 6/6 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 8 | `job_steps_machine_id_fkey` | `job_steps` | `machine_id` | FOREIGN KEY | 6/6 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 9 | `job_steps_outsource_company_fkey` | `job_steps` | `outsource_company` | FOREIGN KEY | 6/6 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 10 | `job_steps_item_type_id_fkey` | `job_steps` | `item_type_id` | FOREIGN KEY | 6/6 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 11 | `work_logs_pkey` | `work_logs` | `log_id` | PRIMARY KEY | 5 UUID hợp lệ sinh mới | Assert UUID duy nhất và NOT NULL | `PASS_VERIFIED` |
| 12 | `work_logs_quantity_ng_check` | `work_logs` | `quantity_ng` | CHECK | 5/5 dòng giá trị `0` (default) | Assert `quantity_ng >= 0` | `PASS_VERIFIED` |
| 13 | `work_logs_job_id_fkey` | `work_logs` | `job_id` | FOREIGN KEY | 5 UUID Job cha | `SELECT count(*) FROM jobs WHERE job_id = l.target_job_id` (5/5 tồn tại, active) | `PASS_VERIFIED` |
| 14 | `work_logs_employee_id_fkey` | `work_logs` | `employee_id` | FOREIGN KEY | 5 UUID nhân viên | `SELECT count(*) FROM employees WHERE employee_id = l.employee_id AND is_active = true` (2 nhân viên active) | `PASS_VERIFIED` |
| 15 | `work_logs_processing_code_id_fkey` | `work_logs` | `processing_code_id` | FOREIGN KEY | 5 mã `[10, 10, 11, 12, 14]` | `SELECT count(*) FROM processing_codes WHERE processing_code_id = l.processing_code_id AND is_active = true` (4 mã active) | `PASS_VERIFIED` |
| 16 | `work_logs_job_step_id_fkey` | `work_logs` | `job_step_id` | FOREIGN KEY | 5 giá trị trỏ đến 2 Step | Preflight: resolve 100% sang `staging_access_delta_b1`; In-transaction: join thành công sang `job_steps.step_id` | `PASS_VERIFIED` |
| 17 | `work_logs_company_id_fkey` | `work_logs` | `company_id` | FOREIGN KEY | 5/5 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** (100% dòng lịch sử Production 7,106/7,106 cũng là NULL) | `PASS_NOT_APPLICABLE` |
| 18 | `work_logs_machine_id_fkey` | `work_logs` | `machine_id` | FOREIGN KEY | 5/5 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |
| 19 | `work_logs_processing_status_id_fkey` | `work_logs` | `processing_status_id` | FOREIGN KEY | 5/5 dòng là `NULL` | **NOT APPLICABLE — payload inserts NULL** | `PASS_NOT_APPLICABLE` |

---

## 2. KẾT QUẢ KIỂM TOÁN TRIGGER FAIL-CLOSED (AUDIT POINT B)

Script `scripts/inspect_trigger_defs.py` và `scripts/dry_run_b1_validation.py` đã tích hợp cơ chế tự động assert fail-closed trực tiếp từ catalog:
- **Tồn tại đúng trigger kỳ vọng:** `trg_sync_job_progress`, `trigger_update_job_status`, `trigger_update_step_status`.
- **Gắn đúng bảng:** `trg_sync_job_progress` và `trigger_update_job_status` trên `job_steps`; `trigger_update_step_status` trên `work_logs`.
- **Đúng sự kiện:** Toàn bộ trigger bắt các sự kiện `INSERT, DELETE, UPDATE`.
- **Gọi đúng Function:**
  * `trg_sync_job_progress` ➔ `public.sync_job_overall_progress()`
  * `trigger_update_job_status` ➔ `public.trg_update_job_status_from_steps()`
  * `trigger_update_step_status` ➔ `public.trg_update_step_status_from_worklogs()`
- **Độc nhất overload:** Truy vấn `pg_proc` xác nhận mỗi hàm chỉ có **duy nhất 1 overload** (`overload_count = 1`), không gây mơ hồ khi kích hoạt.

---

## 3. BẢNG TỔNG HỢP CHỈ SỐ DRY-RUN B1 (scripts/dry_run_b1_validation_result.json)

```json
{
  "dry_run_step_rows": 6,
  "dry_run_work_log_rows": 5,
  "inserted_steps_cursor_count": 6,
  "inserted_work_logs_cursor_count": 5,
  "row_count_assertion_method": {
    "sql_payload": "GET DIAGNOSTICS ROW_COUNT",
    "python_dry_run": "cursor.rowcount"
  },
  "staging_internal_dup_legacies": 0,
  "staging_internal_dup_sources": 0,
  "duplicate_target_legacy_ids": 0,
  "existing_target_rows": 0,
  "missing_parent_jobs": 0,
  "unmatched_work_log_employees": 0,
  "unmatched_work_log_processing_codes": 0,
  "unmatched_work_log_steps": 0,
  "mismatched_work_log_job_ids": 0,
  "fk_conflicts": 0,
  "unique_conflicts": 0,
  "not_null_conflicts": 0,
  "company_id_audit": {
    "is_nullable": true,
    "historical_production_null_count": "7106/7106 (100%)",
    "b1_staging_null_count": "5/5 (100% NULL, aligns with existing schema)",
    "status": "VALID_COMPLIANT"
  },
  "quantity_ng_audit": {
    "column_name": "quantity_ng",
    "is_nullable": "NO",
    "column_default": "0",
    "check_constraint": "CHECK (quantity_ng >= 0)",
    "b1_staging_values": "All 5 work logs default/set to 0, satisfying NOT NULL and CHECK (>= 0)",
    "status": "VALID_COMPLIANT"
  },
  "trigger_audit_status": "FAIL_CLOSED_ASSERTIONS_PASSED",
  "rollback_verified": true,
  "production_jobs_after": 1205,
  "production_job_steps_after": 2451,
  "production_work_logs_after": 7106
}
```

---

## 4. KẾT LUẬN & PHẠM VI ÁP DỤNG (AUDIT POINT C)

1. **Phạm vi kết luận:** 5 audit point B1 đã được xử lý đầy đủ trong phạm vi payload hiện tại (`public.staging_access_delta_b1`). Không suy rộng ra toàn bộ các bảng khác ngoài phạm vi B1.
2. **Trạng thái Production:** Giữ nguyên vẹn 100% baseline:
   - `jobs`: **1,205**
   - `job_steps`: **2,451**
   - `work_logs`: **7,106**
   - `staging_access_delta_b1`: **11**
3. **Trạng thái thực thi:** Payload `scripts/official_insert_payload_b1.sql` giữ mặc định `ROLLBACK;`. Chưa thực thi bất kỳ thao tác INSERT/UPDATE/DELETE nào lên bảng chính của Supabase Production.
