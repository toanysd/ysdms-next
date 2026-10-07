# Báo Cáo Kiểm Toán & Thử Nghiệm Dry-Run: Payload INSERT B1 (6 Steps & 5 Work Logs)
## (Nguồn: public.staging_access_delta_b1 ➔ Đích: public.job_steps & public.work_logs)
### Cập nhật nâng cấp toàn diện giải quyết 5 Audit Points theo thẩm tra của PE (Commit ec65b69 Audit)

- **Thời điểm thực hiện:** 2026-10-07 11:00 JST  
- **Cơ chế thực thi:** Live In-Transaction Dry-Run (`BEGIN ... ROLLBACK`), Fail-Closed 100%  
- **Quyết định phê duyệt:** Minh Chủ Thoan [Stamp: 2026-10-07 10:54 JST]  
- **Thẩm định kỹ thuật:** PE [Stamp: 2026-10-07 10:57 JST]  
- **Cam kết an toàn tuyệt đối:**  
  * 0 dòng ghi vĩnh viễn vào `public.job_steps`.  
  * 0 dòng ghi vĩnh viễn vào `public.work_logs`.  
  * 0 dòng cập nhật bảng chính ngoài giao dịch thử nghiệm.  
  * Bảo toàn 100% baseline Production: `jobs: 1,205`, `job_steps: 2,451`, `work_logs: 7,106`.  

---

## 1. GIẢI TRÌNH KHẮC PHỤC 5 AUDIT POINTS TỪ BÁO CÁO CỦA PE

| # | Điểm Kiểm toán (PE Audit Point) | Giải pháp Đã Triển khai & Kiểm chứng | Trạng thái |
|:---:|---|---|:---:|
| **P1** | **Dynamic metrics chưa hoàn toàn theo catalog**<br>(Cần kiểm tra toàn bộ NOT NULL, `pg_constraint`, `company_id`, `quantity_ng`, FK `job_step_id`) | Truy vấn trực tiếp từ `information_schema.columns` và `pg_constraint` (18 constraints):<br>- `company_id`: `is_nullable = YES`, lịch sử Production có 7,106/7,106 dòng (100%) là NULL, B1 nạp 5/5 dòng NULL (hoàn toàn tương thích).<br>- `quantity_ng`: `is_nullable = NO`, default `'0'`, check `quantity_ng >= 0`. Toàn bộ 5 work logs nạp `0`.<br>- FK `job_step_id`: preflight chứng minh 5/5 work logs match staging step; in-transaction chứng minh 5/5 work logs join thành công sang `job_steps.step_id`. | ✅ RESOLVED |
| **P2** | **Phân định rõ cơ chế đếm dòng**<br>(Không gọi Python `cursor.rowcount` là `GET DIAGNOSTICS`) | Tách biệt tuyệt đối:<br>- Trong SQL Payload: Dùng `GET DIAGNOSTICS v_inserted_steps = ROW_COUNT;` và `GET DIAGNOSTICS v_inserted_logs = ROW_COUNT;`<br>- Trong Python script: Dùng `cursor.rowcount` (ghi nhận `inserted_steps_cursor_count = 6`, `inserted_work_logs_cursor_count = 5`). | ✅ RESOLVED |
| **P3** | **Preflight duplicate bên trong staging**<br>(Kiểm tra uniqueness nội bộ staging) | Bổ sung 2 kiểm tra nội bộ trong cả SQL Payload và Python script:<br>- `staging_internal_dup_legacies`: `count(*) - count(DISTINCT legacy_id) = 0`<br>- `staging_internal_dup_sources`: `count(*) - count(DISTINCT (source_table, source_primary_key)) = 0` | ✅ RESOLVED |
| **P4** | **Bổ sung Per-row checks**<br>(Mọi work log match active employee, active code, resolve step, match job_id) | Thực hiện kiểm tra per-row trên từng dòng Work Log:<br>- `unmatched_work_log_employees = 0` (match `is_active = true`)<br>- `unmatched_work_log_processing_codes = 0` (match `is_active = true`)<br>- `unmatched_work_log_steps = 0` (resolve đúng Step cha)<br>- `mismatched_work_log_job_ids = 0` (Job ID của Log khớp với Step) | ✅ RESOLVED |
| **P5** | **Định nghĩa trigger & Chứng minh side effects**<br>(Trích xuất definition từ catalog `pg_trigger` & `pg_proc`) | Trích xuất định nghĩa đầy đủ qua `pg_get_triggerdef` và `pg_get_functiondef` cho 3 triggers/functions. Chứng minh logic: `trg_update_job_status_from_steps` chỉ đổi trạng thái khi có step nội bộ `processing_status_id = 8` (F.完了); vì B1 chỉ có outsource (`NULL`) và internal pending (`9`), `v_completed_steps = 0` nên không trigger đổi `job_status` (giữ nguyên `COMPLETED`). Trigger `sync_job_overall_progress` tính lại tiến độ chuẩn xác. | ✅ RESOLVED |

---

## 2. BẢNG TỔNG HỢP TOÀN BỘ CHỈ SỐ KIỂM TOÁN (JSON METRICS)

*(Dữ liệu trích xuất từ `scripts/dry_run_b1_validation_result.json`)*

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
  "rollback_verified": true,
  "production_jobs_after": 1205,
  "production_job_steps_after": 2451,
  "production_work_logs_after": 7106
}
```

---

## 3. BẰNG CHỨNG ĐỊNH NGHĨA TRIGGER VÀ GIẢI MÃ LOGIC

Trích xuất trực tiếp từ PostgreSQL catalog Production qua `scripts/inspect_trigger_defs.py`:

### 3.1. Trigger `trg_sync_job_progress` trên bảng `job_steps`
```sql
CREATE TRIGGER trg_sync_job_progress 
AFTER INSERT OR DELETE OR UPDATE OF step_status ON public.job_steps 
FOR EACH ROW EXECUTE FUNCTION sync_job_overall_progress();
```
**Function logic (`public.sync_job_overall_progress`):**
```sql
UPDATE jobs
SET overall_progress = (
  SELECT ROUND(
    100.0 * COUNT(*) FILTER (WHERE step_status = 'COMPLETED') 
    / NULLIF(COUNT(*), 0)
  , 1)
  FROM job_steps
  WHERE job_id = COALESCE(NEW.job_id, OLD.job_id)
)
WHERE job_id = COALESCE(NEW.job_id, OLD.job_id);
```
- **Hệ quả thực tế:**
  * `ASH021R2`: 3/3 hoàn thành ➔ nạp thêm 1 outsource step hoàn thành ➔ 4/4 hoàn thành = **100.0%**
  * `JAE380`: 2/2 hoàn thành ➔ nạp thêm 1 outsource step hoàn thành ➔ 3/3 hoàn thành = **100.0%**
  * `MMT021R2`: 2/2 hoàn thành ➔ nạp thêm 1 outsource step hoàn thành ➔ 3/3 hoàn thành = **100.0%**
  * `KSP227`: 1/2 hoàn thành ➔ nạp thêm 1 outsource step hoàn thành ➔ 2/3 hoàn thành = **66.7%**
  * `ZA水冷ベース`: 1/1 hoàn thành ➔ nạp thêm 1 step nội bộ PENDING ➔ 1/2 hoàn thành = **50.0%**
  * `JAE381`: 2/2 hoàn thành ➔ nạp thêm 1 step nội bộ PENDING ➔ 2/3 hoàn thành = **66.7%**

### 3.2. Trigger `trigger_update_job_status` trên bảng `job_steps`
```sql
CREATE TRIGGER trigger_update_job_status 
AFTER INSERT OR DELETE OR UPDATE ON public.job_steps 
FOR EACH ROW EXECUTE FUNCTION trg_update_job_status_from_steps();
```
**Function logic (`public.trg_update_job_status_from_steps`):**
```sql
SELECT COUNT(*), 
       COUNT(CASE WHEN processing_status_id = 8 THEN 1 END) -- 8 is F.完了
INTO v_total_steps, v_completed_steps
FROM job_steps
WHERE job_id = v_job_id;

IF v_total_steps > 0 AND v_total_steps = v_completed_steps THEN
    UPDATE jobs SET job_status = 'COMPLETED', updated_at = NOW() WHERE job_id = v_job_id;
ELSIF v_completed_steps > 0 THEN
    UPDATE jobs SET job_status = 'IN_PROGRESS', updated_at = NOW() WHERE job_id = v_job_id;
END IF;
```
- **Giải mã toán học vì sao `job_status` không đổi:**
  * Trigger chỉ đếm `processing_status_id = 8` (`F.完了`).
  * 3 step gia công ngoài (outsource) có `processing_status_id = NULL`.
  * 3 step nội bộ có `processing_status_id = 9` (`N.進行中`).
  * Các step cũ của 6 Job này cũng không có step nào mang `processing_status_id = 8`.
  * Do đó `v_completed_steps = 0`.
  * Điều kiện `v_completed_steps > 0` KHÔNG thỏa mãn ➔ Lệnh `UPDATE jobs SET job_status` KHÔNG được gọi.
  * Vì vậy, trạng thái lịch sử đã có từ trước của cả 6 Job (`job_status = 'COMPLETED'`) được bảo toàn nguyên vẹn.

### 3.3. Trigger `trigger_update_step_status` trên bảng `work_logs`
```sql
CREATE TRIGGER trigger_update_step_status 
AFTER INSERT OR DELETE OR UPDATE ON public.work_logs 
FOR EACH ROW EXECUTE FUNCTION trg_update_step_status_from_worklogs();
```
**Function logic:**
Đếm số processing group hoàn thành (`HAVING bool_or(is_finished) = true`).
- 5 work logs nạp vào đều có `is_finished = false`.
- Do đó `v_finished_groups = 0`, trigger gán `processing_status_id = 9` (`N.進行中`) cho các step cha (`LEGACY-STEP-4226` và `LEGACY-STEP-4275`).

---

## 4. TÀI LIỆU VÀ TỆP BẰNG CHỨNG LƯU TRỮ

- Tệp kết quả kiểm toán JSON: `scripts/dry_run_b1_validation_result.json`
- Script thực thi dry-run: `scripts/dry_run_b1_validation.py`
- Payload SQL chính thức (9 preflight assertions & GET DIAGNOSTICS): `scripts/official_insert_payload_b1.sql`
- Script trích xuất trigger: `scripts/inspect_trigger_defs.py`
- Sổ bài học kinh nghiệm: `docs/SO_BAI_HOC.md` (L001 - L004)
- Sổ giao ban: `docs/SESSION_HANDOFF.md` (Section 34, 35, 36)
- **Trạng thái hiện tại:** Đã giải quyết toàn diện 100% các điểm kiểm toán của PE. AN ở chế độ Silent Standby, sẵn sàng cho vòng quyết định của Minh Chủ Thoan.
