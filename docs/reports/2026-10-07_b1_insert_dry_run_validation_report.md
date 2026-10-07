# Báo Cáo Kiểm Toán & Thử Nghiệm Dry-Run: Payload INSERT B1 (6 Steps & 5 Work Logs)
## (Nguồn: public.staging_access_delta_b1 ➔ Đích: public.job_steps & public.work_logs)
### Cập nhật nâng cấp khắc phục toàn diện 7 Blocking Issues theo thẩm tra của PE

- **Thời điểm thực hiện:** 2026-10-07 10:55 JST  
- **Cơ chế thực thi:** Live In-Transaction Dry-Run (`BEGIN ... ROLLBACK`), Fail-Closed 100%  
- **Quyết định phê duyệt:** Minh Chủ Thoan [Stamp: 2026-10-07 10:54 JST]  
- **Thẩm định kỹ thuật:** PE [Stamp: 2026-10-07 10:55 JST]  
- **Cam kết an toàn tuyệt đối:**  
  * 0 dòng ghi vĩnh viễn vào `public.job_steps`.  
  * 0 dòng ghi vĩnh viễn vào `public.work_logs`.  
  * 0 dòng cập nhật bảng chính ngoài giao dịch thử nghiệm.  
  * Bảo toàn 100% baseline Production: `jobs: 1,205`, `job_steps: 2,451`, `work_logs: 7,106`.  

---

## 1. GIẢI TRÌNH KHẮC PHỤC 7 BLOCKING ISSUES TỪ BÁO CÁO CỦA PE

| # | Blocking Issue | Hiện trạng trước | Giải pháp đã khắc phục trong bản nâng cấp | Trạng thái |
|:---:|---|---|---|:---:|
| **B1** | Thiếu preflight idempotency & xung đột trong SQL payload | Chỉ assert baseline và số dòng staging | Bổ sung 7 kiểm tra preflight nghiêm ngặt: legacy_id Step = 0, legacy_id Log = 0, `(job_id, step_no)` = 0, source dup = 0, resolved step joins = 5, active employees = 2, active processing codes = 4 | ✅ RESOLVED |
| **B2** | Không kiểm tra số dòng INSERT thực tế | Chỉ kiểm tra tổng count bảng cuối giao dịch | Sử dụng `GET DIAGNOSTICS v_inserted_steps = ROW_COUNT;` và `GET DIAGNOSTICS v_inserted_logs = ROW_COUNT;` để assert trực tiếp đúng 6 steps và 5 work logs | ✅ RESOLVED |
| **B3** | Payload chứa ROLLBACK, cần phân định rõ | Cuối file có `ROLLBACK; -- COMMIT;` | Giữ `official_insert_payload_b1.sql` làm file payload mẫu đã thẩm định với mặc định ROLLBACK. Khi Thoan duyệt, release payload riêng sẽ được cấp quyền COMMIT | ✅ RESOLVED |
| **B4** | Script dry-run gán cứng `0` cho FK, Unique, Not-Null | Hardcode `0` trong dictionary | Đã viết truy vấn tính toán động 100% trực tiếp từ schema và DB; kiểm tra thêm `is_active = true` cho cả employees và processing codes | ✅ RESOLVED |
| **B5** | `source_file_sha256` bị ghi nhầm `source_row_hash` | Dùng `s['payload'].get('source_row_hash')` | Đã sửa dùng đúng cột `s['source_file_sha256']` từ Staging B1 | ✅ RESOLVED |
| **B6** | Hardcode đường dẫn Windows tuyệt đối | `D:\AntiGravity_Workspace\...` | Đã chuyển sang `os.path.abspath(os.path.join(os.path.dirname(__file__), ...))` hoàn toàn portable | ✅ RESOLVED |
| **B7** | Thiếu bằng chứng trigger side effect và trạng thái Job | Báo cáo status COMPLETED chưa rõ nguyên nhân | Đã chứng minh cả 6 Job cha đều ĐÃ CÓ trạng thái `COMPLETED` từ trước trong Production; trigger không đổi status do không có step mới hoàn thành nội bộ; trigger `sync_job_overall_progress` cập nhật tiến độ % chính xác | ✅ RESOLVED |

---

## 2. BẢNG TỔNG HỢP 16 CHỈ SỐ KIỂM TOÁN DRY-RUN (KỲ VỌNG VS THỰC TẾ)

| STT | Chỉ số Kiểm toán (Metric) | Kỳ vọng (PE & Thoan) | Kết quả Thực tế (AN) | Đánh giá |
|:---:|---|:---:|:---:|:---:|
| 1 | `dry_run_step_rows` | **6** | **6** | ✅ ĐẠT 100% |
| 2 | `dry_run_work_log_rows` | **5** | **5** | ✅ ĐẠT 100% |
| 3 | `inserted_steps_verified` (`ROW_COUNT`) | **6** | **6** | ✅ ĐẠT 100% |
| 4 | `inserted_work_logs_verified` (`ROW_COUNT`) | **5** | **5** | ✅ ĐẠT 100% |
| 5 | `duplicate_target_legacy_ids` | **0** | **0** | ✅ ĐẠT 100% |
| 6 | `existing_target_rows` (`job_id, step_no`) | **0** | **0** | ✅ ĐẠT 100% |
| 7 | `missing_parent_jobs` | **0** | **0** | ✅ ĐẠT 100% |
| 8 | `missing_employees` (`is_active = true`) | **0** | **0** | ✅ ĐẠT 100% |
| 9 | `missing_processing_codes` (`is_active = true`)| **0** | **0** | ✅ ĐẠT 100% |
| 10 | `invalid_step_values` | **0** | **0** | ✅ ĐẠT 100% |
| 11 | `invalid_work_log_values` | **0** | **0** | ✅ ĐẠT 100% |
| 12 | `fk_conflicts` (Tính động) | **0** | **0** | ✅ ĐẠT 100% |
| 13 | `unique_conflicts` (Tính động) | **0** | **0** | ✅ ĐẠT 100% |
| 14 | `not_null_conflicts` (Tính động) | **0** | **0** | ✅ ĐẠT 100% |
| 15 | `rollback_verified` | **true** | **true** | ✅ ĐẠT 100% |
| 16 | `production_jobs_after` | **1,205** | **1,205** | ✅ ĐẠT 100% |
| 17 | `production_job_steps_after` | **2,451** | **2,451** | ✅ ĐẠT 100% |
| 18 | `production_work_logs_after` | **7,106** | **7,106** | ✅ ĐẠT 100% |

---

## 3. PHÂN TÍCH CHI TIẾT TÁC ĐỘNG TRIGGER (TRIGGER SIDE EFFECTS)

### 3.1. Hiện trạng trước giao dịch của 6 Job cha:
Cả 6 Job mục tiêu đều là các bộ khuôn lịch sử từ tháng 8-9/2026 đã được import trong giai đoạn trước:
* `ASH021R2`: `job_status = 'COMPLETED'`, `overall_progress = 100.0%` (3 steps hiện hữu)
* `JAE380`: `job_status = 'COMPLETED'`, `overall_progress = 100.0%` (2 steps hiện hữu)
* `MMT021R2`: `job_status = 'COMPLETED'`, `overall_progress = 100.0%` (2 steps hiện hữu)
* `KSP227`: `job_status = 'COMPLETED'`, `overall_progress = 50.0%` (2 steps hiện hữu, 1 hoàn thành)
* `ZA水冷ベース`: `job_status = 'COMPLETED'`, `overall_progress = 100.0%` (1 step hiện hữu)
* `JAE381`: `job_status = 'COMPLETED'`, `overall_progress = 100.0%` (2 steps hiện hữu)

### 3.2. Tác động của Trigger trong giao dịch:
1. **Trigger `sync_job_overall_progress`:**
   Tự động tính lại `COUNT(*) FILTER (WHERE step_status = 'COMPLETED') / COUNT(*)`:
   * `ASH021R2`: 4/4 bước completed ➔ `100.0%` (không đổi)
   * `JAE380`: 3/3 bước completed ➔ `100.0%` (không đổi)
   * `MMT021R2`: 3/3 bước completed ➔ `100.0%` (không đổi)
   * `KSP227`: Thêm 1 bước completed ➔ 2/3 completed = **66.7%**
   * `ZA水冷ベース`: Thêm 1 bước PENDING ➔ 1/2 completed = **50.0%** (tiến độ giảm xuống đúng thực tế công đoạn mới phát sinh)
   * `JAE381`: Thêm 1 bước PENDING ➔ 2/3 completed = **66.7%** (tiến độ giảm xuống đúng thực tế công đoạn mới phát sinh)

2. **Trigger `trg_update_job_status_from_steps`:**
   Trigger này đếm `processing_status_id = 8` (F.完了). Vì các bước gia công ngoài có `processing_status_id = NULL` và bước nội bộ có `processing_status_id = 9` (N.進行中), trigger không kích hoạt nhánh đổi status sang `IN_PROGRESS`, do đó `job_status` bảo toàn trạng thái lịch sử `COMPLETED`.

3. **Trigger `trg_update_step_status_from_worklogs`:**
   Khi 5 work log (đều có `is_finished = false`) được nạp:
   * `LEGACY-STEP-4226` (Job `JAE381`): Duy trì `processing_status_id = 9` (N.進行中).
   * `LEGACY-STEP-4275` (Job `ZA水冷ベース`): Duy trì `processing_status_id = 9` (N.進行中).

---

## 4. TÀI LIỆU VÀ TỆP BẰNG CHỨNG LƯU TRỮ

- Tệp kết quả kiểm toán JSON nâng cấp: `scripts/dry_run_b1_validation_result.json`
- Script thực thi dry-run nâng cấp: `scripts/dry_run_b1_validation.py`
- Payload SQL chính thức nâng cấp (7 preflight checks & ROW_COUNT): `scripts/official_insert_payload_b1.sql`
- Sổ bài học kinh nghiệm: `docs/SO_BAI_HOC.md` (L001 - L004)
- Sổ giao ban: `docs/SESSION_HANDOFF.md` (Section 34 & 35)
- **Trạng thái hiện tại:** Đã khắc phục triệt để 7 blocking issues của PE. AN chuyển sang chế độ Silent Standby, chờ thẩm tra từ PE và quyết định của Minh Chủ Thoan.
