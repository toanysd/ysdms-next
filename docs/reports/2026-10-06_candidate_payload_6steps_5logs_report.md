# Báo cáo Vòng B1: Khảo sát Kỹ thuật & Bảng Ánh xạ Chính thức Staging Local
## (Nhóm nhỏ: 6 job_steps & 5 work_logs thuộc Job cũ đã tồn tại trên Supabase)

- **Thời điểm thực hiện:** 2026-10-06 19:22 JST  
- **Tập tin nguồn:** `docs/ysdJOB_20261006.accdb`  
- **Mã băm SHA-256 động:** `0ec0f23e05a08178f0294b7f6e6de1bb5ede75feda54cf1bb8d1bb64cbd0cd66`  
- **Kích thước tệp:** 612,442,112 bytes  
- **Trạng thái thực thi:** 100% Chỉ-đọc / Khảo sát Local (0 writes to Supabase Production, 0 staging tables created)  
- **Mã Git Commit Đầy đủ (Full SHAs):**  
  * Commit mới nhất: `e084ad9ad864be66791c9712f518178a37571cfb`  
  * Commit trước đó: `17a910aab87718f3ed0c9909d5878d6fb5f320f9`  
  * Trạng thái Git Remote: Nhánh local `main` bảo tồn nguyên vẹn (đi trước `origin/main` 24 commits).  
- **Baseline Supabase Production (Bảo toàn 100%):**  
  `jobs: 1,205` | `job_steps: 2,451` | `work_logs: 7,106` | `staging_tables: 1` (`staging_order_lines_backfill` - lịch sử)

---

## 1. PHÂN TÍCH CHUYÊN SÂU THEO YÊU CẦU CỦA PE

### 1.1. Về `processing_status_id` và Tương quan Trigger Supabase
- **Trong Access (`tblProcessingStatus`):** Mã `8` là `F.完了` (Hoàn thành), mã `9` là `N.進行中` (Đang tiến hành), mã `1` là `0.未確認` (Chưa xác nhận).
- **Trong Supabase (`processing_statuses`):** Bảng trạng thái của Supabase khớp 1:1 với Access:
  * `status_id = 1`: `0.未確認`
  * `status_id = 8`: `F.完了`
  * `status_id = 9`: `N.進行中`
- **Cơ chế Trigger tự động `trg_update_step_status_from_worklogs` trên Supabase:**
  ```sql
  IF v_total_groups = 0 THEN
      v_status_id := 1; -- 0.未確認
  ELSIF v_total_groups = v_finished_groups THEN
      v_status_id := 8; -- F.完了
  ELSE
      v_status_id := 9; -- N.進行中
  END IF;
  UPDATE job_steps SET processing_status_id = v_status_id, updated_at = NOW() WHERE step_id = v_step_id;
  ```
- **Hệ quả ánh xạ kỹ thuật:**
  * **Đối với 2 Steps có Work Logs (4275, 4226):**
    - Tất cả 5 work logs gốc trong Access đều có `Finished = False` (`is_finished = false`).
    - Khi các log này được nạp, trigger tự động cập nhật `processing_status_id = 9` (`N.進行中`) và `step_status = 'PENDING'`. Trạng thái này phản ánh chính xác thực tế: công đoạn đang có giờ công ghi nhận nhưng chưa đánh dấu kết thúc.
  * **Đối với 4 Steps không có Work Logs (4276, 4238, 4241, 4251):**
    - Đây là các công đoạn gia công ngoài (Outsourced: 抜型 CUTTER, スタッキング STAKING). Trong Access, người vận hành đã hoàn tất và gán `ProcessingStatusID = 8` (`F.完了`).
    - Trong Supabase hiện hữu, có **435 bước gia công ngoài đã hoàn thành** có đặc điểm đồng nhất: `step_status = 'COMPLETED'` và `processing_status_id = NULL`.
    - Do đó, target chuẩn cho 4 bước này là: `step_status = 'COMPLETED'` và `processing_status_id = NULL` (hoặc `8` nếu muốn lưu mã Access gốc), hoàn toàn không làm sai lệch logic tiến độ công việc.

---

### 1.2. Về `item_type_id` và `processing_item_id`
- **Khảo sát Supabase `job_steps` hiện tại:**
  * Toàn bộ 2,447 / 2,451 bước cũ đều có `processing_item_id = NULL` và `item_type_id = NULL`. (Chỉ duy nhất 4 bước của `JOB-INTERNAL-SHOP` vừa tạo nội bộ là có giá trị `processing_item_id`).
  * Danh pháp và chủng loại bước công đoạn được chuẩn hóa qua cột `step_name`:
    - `ItemTypeID = 2` -> `step_name = '金型 (MOLD)'`
    - `ItemTypeID = 3` -> `step_name = 'プラグ (PLUG)'`
    - `ItemTypeID = 4` -> `step_name = '抜型 (CUTTER)'`
    - `ItemTypeID = 7` -> `step_name = 'スタッキング (STAKING)'`
  * Vì vậy, để duy trì 100% tính nhất quán với 2,447 bước hiện hữu, target `processing_item_id` của 6 bước mới được gán `NULL`, và tên chuẩn hóa được ghi vào `step_name`.

---

### 1.3. Về Thứ tự Bước (`step_no`)
- **Trong bảng nguồn Access (`tblProcessingDeadline`):** Hoàn toàn KHÔNG CÓ cột số thứ tự `StepNo`. Thứ tự các bước được quản lý theo `ProcessingDeadlineID` tăng dần và thời gian `ProcessingDeadline`.
- **Đối chiếu với thứ tự quy trình khuôn mẫu Thermoforming:**
  * Quy trình chế tạo bộ khuôn chuẩn YSD: **`金型 (MOLD)` -> `プラグ (PLUG)` -> `抜型 (CUTTER)` -> `スタッキング (STAKING)`**.
  * **Job 1170 (`ASH021R2`):** Đã có 3 bước (1: MOLD, 2: PLUG, 3: CUTTER). Bước mới 4276 là `STAKING` (スタッキング) -> Gán **`step_no = 4`** là hoàn toàn chuẩn xác theo công nghệ.
  * **Job 1247 (`MMT021R2`):** Đã có 2 bước (1: MOLD, 2: PLUG). Bước mới 4251 là `CUTTER` (抜型) -> Gán **`step_no = 3`** là đúng công đoạn tiếp theo.
  * **Job 1248 (`JAE380`):** Đã có 2 bước (1: MOLD, 2: PLUG). Bước mới 4238 là `CUTTER` (抜型) -> Gán **`step_no = 3`** là đúng công đoạn tiếp theo.
  * **Job 1250 (`KSP227`):** Đã có 2 bước (1: MOLD, 2: PLUG). Bước mới 4241 là `CUTTER` (抜型) -> Gán **`step_no = 3`** là đúng công đoạn tiếp theo.
  * **Job 623 (`ZA水冷ベース`):** Bước 1 tạo năm 2023. Bước mới 4275 phát sinh năm 2026 (ngoại chu vi gọt 1mm) -> Gán **`step_no = 2`** là chuẩn xác theo trình tự thời gian.
  * **Job 1249 (`JAE381`):** Bước 1 bị lỗi (`不具合発生`). Bước mới 4226 là làm lại/bổ sung khuôn sau sự cố -> Gán **`step_no = 3`** là chuẩn xác.
- *Kết luận:* Đề xuất `step_no = max(step_no) + 1` vừa thỏa mãn ràng buộc khóa Unique `(job_id, step_no)`, vừa khớp 100% với thứ tự ID/thời gian trong Access và chuỗi công nghệ gia công thực tế.

---

## 2. BẢNG MAPPING CHÍNH THỨC 6 STEP CANDIDATES

| Access ProcessingDeadlineID | Access JobID | Access ItemTypeID | Access ProcessingStatusID | Access ProcessingDeadline | Access ProcessingNotes | Target job_id | Target step_no | Target step_name | Target processing_item_id | Target processing_status_id | Target step_status | Mapping Rationale | source_row_hash |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **4275** | 623 | 2 (MOLD) | 8 (F.完了) | 2026-10-01 | 外周削り1mm | `249439b2-e1c6-4b42-ba99-54910d1f8a14` | **2** | 金型 (MOLD) | `NULL` | **9** (N.進行中) | `PENDING` | Có 1 work log đang làm (Finished=False). Trigger tự động cập nhật status sang 9 khi nạp log. | `540a9208953a2920b19c7f2b7052d0023877c51af945b130b49dd3df7a819441` |
| **4276** | 1170 | 7 (STAKING) | 8 (F.完了) | 2026-10-02 | *(null)* | `dcaa2eb8-f66b-426d-9bb0-5a4ec7e18d00` | **4** | スタッキング (STAKING) | `NULL` | `NULL` | `COMPLETED` | Gia công ngoài không có log nội bộ. Access status 8 (F.完了). Khớp pattern 435 bước hoàn thành trong Supabase. | `366c32a4193ef31285854c957732abed8ad9ee1c7d2c1a0e548c2da7ec91cb65` |
| **4238** | 1248 | 4 (CUTTER) | 8 (F.完了) | 2026-09-04 | *(null)* | `39dbbc91-c7b4-4a90-bdd8-8c894b782092` | **3** | 抜型 (CUTTER) | `NULL` | `NULL` | `COMPLETED` | Gia công ngoài không có log nội bộ. Access status 8 (F.完了). Khớp pattern 435 bước hoàn thành trong Supabase. | `a86bf841117095a2ae99506ebfbc1c9487aef777b8b2003280d5403a31748417` |
| **4241** | 1250 | 4 (CUTTER) | 8 (F.完了) | 2026-09-03 | KSP-209 | `17131b0b-3f8c-40dd-988a-fc1d1c9888bc` | **3** | 抜型 (CUTTER) | `NULL` | `NULL` | `COMPLETED` | Gia công ngoài không có log nội bộ. Access status 8 (F.完了). Khớp pattern 435 bước hoàn thành trong Supabase. | `89759915bb7365ff195065b7e5d57892c0806e7acfca322905f29553a4140b43` |
| **4251** | 1247 | 4 (CUTTER) | 8 (F.完了) | *(null)* | MMT-014 | `c33e3f71-d3b0-48dd-8c34-11ad76a4a195` | **3** | 抜型 (CUTTER) | `NULL` | `NULL` | `COMPLETED` | Gia công ngoài không có log nội bộ. Access status 8 (F.完了). Khớp pattern 435 bước hoàn thành trong Supabase. | `29f153a545c72fad631ac4a609fa8dd53c38b459461a4600227b9be515b6ca4d` |
| **4226** | 1249 | 2 (MOLD) | 8 (F.完了) | 2026-09-04 | *(null)* | `f536c3e9-f4a8-4578-837b-174d9f96a7b3` | **3** | 金型 (MOLD) | `NULL` | **9** (N.進行中) | `PENDING` | Có 4 work logs đang làm (Finished=False). Trigger tự động cập nhật status sang 9 khi nạp log. | `7c47f4bda2bc7f16ef5ccc2aaf4951223444f9b7a94f67d234b3e36d015ceb57` |

---

## 3. BẢNG MAPPING CHÍNH THỨC 5 WORK LOG CANDIDATES

| Access WorkLogID | Access ProcessingDeadlineID | Target step_legacy_id | Target job_id | Target employee_id | Target employee_name | Target processing_code_id | work_date | hours_spent | is_finished | notes | source_row_hash | validation_status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **9052** | 4275 | `LEGACY-STEP-4275` | `249439b2-e1c6-4b42-ba99-54910d1f8a14` | `abe82154-2f81-44ec-b76e-11a2db247fca` | グエン　ダン　トアン | 14 (演算＆加工) | 2026-10-01 | 1.50 | `false` | *(null)* | `aff1491b49be03d25ceb3591aad0a4d27a0424577b90fd9027669009fadd5be1` | `NEW_SAFE_TO_STAGE` |
| **8882** | 4226 | `LEGACY-STEP-4226` | `f536c3e9-f4a8-4578-837b-174d9f96a7b3` | `abe82154-2f81-44ec-b76e-11a2db247fca` | グエン　ダン　トアン | 10 (金型演算＆加工) | 2026-08-31 | 2.00 | `false` | *(null)* | `11218faed01e50324acb1f36a128c55dd3b6ad02049273bb4309e8d8244c74ba` | `NEW_SAFE_TO_STAGE` |
| **8895** | 4226 | `LEGACY-STEP-4226` | `f536c3e9-f4a8-4578-837b-174d9f96a7b3` | `abe82154-2f81-44ec-b76e-11a2db247fca` | グエン　ダン　トアン | 10 (金型演算＆加工) | 2026-09-01 | 1.00 | `false` | *(null)* | `a97d15cbee130708658595947cd7de7b642a0bc6f8e5749c03d69e4c296ac66b` | `NEW_SAFE_TO_STAGE` |
| **8901** | 4226 | `LEGACY-STEP-4226` | `f536c3e9-f4a8-4578-837b-174d9f96a7b3` | `44d2d142-4173-4e1b-baa3-c888edc7777c` | ダオ　ティ　ジェン | 11 (本型穴あけ) | 2026-09-02 | 2.50 | `false` | *(null)* | `bf9c02073c7b08a63220cce67439a9b6b48157f62794f2f78f5cd89ffee93cd5` | `NEW_SAFE_TO_STAGE` |
| **8920** | 4226 | `LEGACY-STEP-4226` | `f536c3e9-f4a8-4578-837b-174d9f96a7b3` | `44d2d142-4173-4e1b-baa3-c888edc7777c` | ダオ　ティ　ジェン | 12 (本型ミガキ) | 2026-09-04 | 2.00 | `false` | *(null)* | `ec6c0ae8f11b1e68fe0954586b1c61a28c38ef5839c6b65f20c08b17dc0684e1` | `NEW_SAFE_TO_STAGE` |

---

## 4. KẾT QUẢ KIỂM CHỨNG PREFLIGHT LOCAL (10/10 ĐẠT)

Tất cả 10 tiêu chí preflight đều đã được kiểm tra trực tiếp qua code đối chiếu với DB Supabase Production:

| # | Tiêu chí Preflight | Kết quả Thẩm định | Chi tiết Kiểm tra |
|---|---|---|---|
| 1 | 6 `legacy_id` Step chưa tồn tại | **PASSED** | Truy vấn `WHERE legacy_id = ANY(...)` trả về **0 dòng**. |
| 2 | 5 `legacy_id` Log chưa tồn tại | **PASSED** | Truy vấn `WHERE legacy_id = ANY(...)` trả về **0 dòng**. |
| 3 | Không duplicate source primary key | **PASSED** | 6 Step PKs và 5 Log PKs đều là duy nhất tuyệt đối. |
| 4 | Không duplicate target `(job_id, step_no)` | **PASSED** | 0 xung đột với các bước hiện hữu, 0 xung đột trong payload. |
| 5 | Employee active | **PASSED** | Cả 2 nhân viên (ID 9 & 21) đều active trong bảng `employees`. |
| 6 | Processing code active | **PASSED** | Cả 4 mã công đoạn (10, 11, 12, 14) đều active trong `processing_codes`. |
| 7 | Quantity/Giờ công hợp lệ | **PASSED** | 100% số giờ > 0 (1.0h, 1.5h, 2.0h, 2.5h), ngày làm việc đầy đủ. |
| 8 | Parent Job tồn tại | **PASSED** | Cả 6 Job cha đều tồn tại hợp lệ trên Supabase với mã `LEGACY-JOB-{id}`. |
| 9 | Tất cả cột đích tồn tại trong Schema | **PASSED** | Không thiếu bất kỳ cột nào trên bảng `job_steps` và `work_logs`. |
| 10 | Không có UPDATE thay thế dữ liệu hiện tại | **PASSED** | 100% thao tác là INSERT bản ghi mới, độc lập, bảo toàn dữ liệu cũ. |

---

## 5. TỆP BẰNG CHỨNG LƯU TRỮ LOCAL
- Báo cáo kết quả kiểm tra Preflight JSON: `scripts/preflight_b1_verification.json`
- Script thực thi kiểm tra Preflight: `scripts/preflight_verify_b1.py`
- Payload ứng viên JSON: `scripts/candidate_payload_6steps_5logs.json`
- Baseline Production được bảo toàn tuyệt đối: `jobs: 1,205`, `job_steps: 2,451`, `work_logs: 7,106`.
