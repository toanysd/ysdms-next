# Báo Cáo Kiểm Toán & Thử Nghiệm Dry-Run: Payload INSERT B1 (6 Steps & 5 Work Logs)
## (Nguồn: public.staging_access_delta_b1 ➔ Đích: public.job_steps & public.work_logs)

- **Thời điểm thực hiện:** 2026-10-07 10:40 JST  
- **Cơ chế thực thi:** Live In-Transaction Dry-Run (`BEGIN ... ROLLBACK`), Fail-Closed 100%  
- **Quyết định phê duyệt:** Minh Chủ Thoan [Stamp: 2026-10-07 10:37 JST]  
- **Thẩm định kỹ thuật:** PE [Stamp: 2026-10-07 10:37 JST]  
- **Cam kết an toàn tuyệt đối:**  
  * 0 dòng ghi vĩnh viễn vào `public.job_steps`.  
  * 0 dòng ghi vĩnh viễn vào `public.work_logs`.  
  * 0 dòng cập nhật bảng chính ngoài giao dịch thử nghiệm.  
  * Bảo toàn 100% baseline Production: `jobs: 1,205`, `job_steps: 2,451`, `work_logs: 7,106`.  

---

## 1. BẢNG TỔNG HỢP 14 CHỈ SỐ KIỂM TOÁN DRY-RUN (KỲ VỌNG VS THỰC TẾ)

| STT | Chỉ số Kiểm toán (Metric) | Kỳ vọng (PE & Thoan) | Kết quả Thực tế (AN) | Đánh giá |
|:---:|---|:---:|:---:|:---:|
| 1 | `dry_run_step_rows` | **6** | **6** | ✅ ĐẠT 100% |
| 2 | `dry_run_work_log_rows` | **5** | **5** | ✅ ĐẠT 100% |
| 3 | `duplicate_target_legacy_ids` | **0** | **0** | ✅ ĐẠT 100% |
| 4 | `existing_target_rows` | **0** | **0** | ✅ ĐẠT 100% |
| 5 | `missing_parent_jobs` | **0** | **0** | ✅ ĐẠT 100% |
| 6 | `missing_employees` | **0** | **0** | ✅ ĐẠT 100% |
| 7 | `missing_processing_codes` | **0** | **0** | ✅ ĐẠT 100% |
| 8 | `invalid_step_values` | **0** | **0** | ✅ ĐẠT 100% |
| 9 | `invalid_work_log_values` | **0** | **0** | ✅ ĐẠT 100% |
| 10 | `fk_conflicts` | **0** | **0** | ✅ ĐẠT 100% |
| 11 | `unique_conflicts` | **0** | **0** | ✅ ĐẠT 100% |
| 12 | `not_null_conflicts` | **0** | **0** | ✅ ĐẠT 100% |
| 13 | `rollback_verified` | **true** | **true** | ✅ ĐẠT 100% |
| 14 | `production_jobs_after` | **1,205** | **1,205** | ✅ ĐẠT 100% |
| 15 | `production_job_steps_after` | **2,451** | **2,451** | ✅ ĐẠT 100% |
| 16 | `production_work_logs_after` | **7,106** | **7,106** | ✅ ĐẠT 100% |

---

## 2. PHÂN TÍCH CHI TIẾT TÁC ĐỘNG TRIGGER (TRIGGER SIDE EFFECTS)

Trong quá trình thực thi thử nghiệm bên trong Transaction, hệ thống đã kích hoạt 3 trigger hiện hữu:

1. **Trigger `sync_job_overall_progress` (sau khi chèn `job_steps`):**
   - Tự động tính toán lại tỷ lệ hoàn thành `%` dựa trên số bước `COMPLETED` chia tổng số bước của từng Job.
   - Kết quả:
     * `ASH021R2`: 4/4 bước hoàn thành ➔ `overall_progress = 100.0%`
     * `JAE380`: 3/3 bước hoàn thành ➔ `overall_progress = 100.0%`
     * `MMT021R2`: 3/3 bước hoàn thành ➔ `overall_progress = 100.0%`
     * `KSP227`: 2/3 bước hoàn thành ➔ `overall_progress = 66.7%`
     * `JAE381`: 2/3 bước hoàn thành ➔ `overall_progress = 66.7%`
     * `ZA水冷ベース`: 1/2 bước hoàn thành ➔ `overall_progress = 50.0%`

2. **Trigger `trg_update_job_status_from_steps` (sau khi chèn `job_steps`):**
   - Đánh giá trạng thái Job dựa trên `processing_status_id = 8` (F.完了):
     * Các Job có toàn bộ các bước hoàn thành chuyển sang `job_status = 'COMPLETED'`.
     * Các Job có ít nhất 1 bước hoàn thành và còn bước đang xử lý giữ `job_status = 'IN_PROGRESS'` hoặc `COMPLETED`.

3. **Trigger `trg_update_step_status_from_worklogs` (sau khi chèn `work_logs`):**
   - Đánh giá cờ `is_finished` của các work log gắn với từng Step:
     * `LEGACY-STEP-4226` (Job `JAE381`): Có 4 work log nạp vào đều có `is_finished = false`. Trigger tự động duy trì `processing_status_id = 9` (N.進行中).
     * `LEGACY-STEP-4275` (Job `ZA水冷ベース`): Có 1 work log nạp vào có `is_finished = false`. Trigger tự động duy trì `processing_status_id = 9` (N.進行中).

---

## 3. THÔNG SỐ PAYLOAD INSERT VÀ LIÊN KẾT KHÓA NGOẠI

### 3.1. 6 Steps sẽ được INSERT vào `public.job_steps`:
1. `LEGACY-STEP-4226` ➔ Job: `JAE381` (`f536c3e9...`) \| StepNo: 3 \| 金型 (MOLD) \| Status ID: 9 \| `PENDING`
2. `LEGACY-STEP-4238` ➔ Job: `JAE380` (`39dbbc91...`) \| StepNo: 3 \| 抜型 (CUTTER) \| Status ID: NULL \| `COMPLETED`
3. `LEGACY-STEP-4241` ➔ Job: `KSP227` (`17131b0b...`) \| StepNo: 3 \| 抜型 (CUTTER) \| Status ID: NULL \| `COMPLETED`
4. `LEGACY-STEP-4251` ➔ Job: `MMT021R2` (`c33e3f71...`) \| StepNo: 3 \| 抜型 (CUTTER) \| Status ID: NULL \| `COMPLETED`
5. `LEGACY-STEP-4275` ➔ Job: `ZA水冷ベース` (`249439b2...`) \| StepNo: 2 \| 金型 (MOLD) \| Status ID: 9 \| `PENDING`
6. `LEGACY-STEP-4276` ➔ Job: `ASH021R2` (`dcaa2eb8...`) \| StepNo: 4 \| スタッキング (STAKING) \| Status ID: NULL \| `COMPLETED`

### 3.2. 5 Work Logs sẽ được INSERT vào `public.work_logs`:
1. `LEGACY-LOG-8882` ➔ Gắn Step `LEGACY-STEP-4226` (Job `JAE381`) \| Thoan \| Mã 10: 金型演算＆加工 \| 2.00h \| `2026-08-31`
2. `LEGACY-LOG-8895` ➔ Gắn Step `LEGACY-STEP-4226` (Job `JAE381`) \| Thoan \| Mã 10: 金型演算＆加工 \| 1.00h \| `2026-09-01`
3. `LEGACY-LOG-8901` ➔ Gắn Step `LEGACY-STEP-4226` (Job `JAE381`) \| Diên \| Mã 11: 本型穴あけ \| 2.50h \| `2026-09-02`
4. `LEGACY-LOG-8920` ➔ Gắn Step `LEGACY-STEP-4226` (Job `JAE381`) \| Diên \| Mã 12: 本型ミガキ \| 2.00h \| `2026-09-04`
5. `LEGACY-LOG-9052` ➔ Gắn Step `LEGACY-STEP-4275` (Job `ZA水冷ベース`) \| Thoan \| Mã 14: 演算＆加工 \| 1.50h \| `2026-10-01`

---

## 4. TÀI LIỆU VÀ TỆP BẰNG CHỨNG LƯU TRỮ

- Tệp kết quả kiểm toán JSON: `scripts/dry_run_b1_validation_result.json`
- Script thực thi dry-run: `scripts/dry_run_b1_validation.py`
- Tệp SQL payload chính thức có preflight & postflight fail-closed: `scripts/official_insert_payload_b1.sql`
- Sổ bài học kinh nghiệm: Đã cập nhật mục `L003` trong `docs/SO_BAI_HOC.md`.
- Sổ giao ban phiên: Đã cập nhật Section 34 trong `docs/SESSION_HANDOFF.md`.
- **Trạng thái hiện tại:** Thử nghiệm Dry-Run đã thành công 100%, bảo toàn baseline Production. AN chuyển sang chế độ Silent Standby, chờ lệnh phê duyệt thực thi chính thức từ Minh Chủ Thoan và PE.
