# Báo cáo Vòng B1: Khảo sát Kỹ thuật & Chuẩn bị Payload Staging Local
## (Nhóm nhỏ: 6 job_steps & 5 work_logs thuộc Job cũ đã tồn tại trên Supabase)

- **Thời điểm thực hiện:** 2026-10-06 19:12 JST  
- **Tập tin nguồn:** `docs/ysdJOB_20261006.accdb`  
- **Mã băm SHA-256 động:** `0ec0f23e05a08178f0294b7f6e6de1bb5ede75feda54cf1bb8d1bb64cbd0cd66`  
- **Kích thước tệp:** 612,442,112 bytes  
- **Trạng thái thực thi:** 100% Chỉ-đọc / Khảo sát Local (0 writes to Supabase Production, 0 staging tables created)  
- **Mã Git Commit Đầy đủ:**  
  * Commit gần nhất: `17a910aab87718f3ed0c9909d5878d6fb5f320f9`  
  * Commit trước đó: `e723de516de88d058898bcddf83eb06c64b2e0d5`  
  * Trạng thái Git Remote: Nhánh local `main` đi trước `origin/main` 22 commits (được bảo tồn toàn vẹn; chờ Minh Chủ Thoan duyệt push qua browser OAuth khi cần).  
- **Baseline Supabase Production (Bảo toàn 100%):**  
  `jobs: 1,205` | `job_steps: 2,451` | `work_logs: 7,106` | `staging_tables: 1` (`staging_order_lines_backfill` - lịch sử)

---

## 1. PHẠM VI THỰC HIỆN & RANH GIỚI TUÂN THỦ
Theo quyết định của Minh Chủ Thoan [Stamp: 2026-10-06 19:10 JST] chấp thuận đề xuất của PE [Stamp: 2026-10-06 19:09 JST]:
- **Phạm vi được phép:** Chuẩn bị payload / dry-run local cho nhóm nhỏ gồm **6 job_steps** thuộc 6 Job cũ và **5 work_logs** gắn vào các step đó.
- **Ranh giới nghiêm ngặt:**
  1. Tuyệt đối KHÔNG tạo bảng staging trên Supabase.
  2. Tuyệt đối KHÔNG ghi/sửa dữ liệu Production.
  3. Tuyệt đối KHÔNG nạp 27 Jobs mới, 55 Steps mới, 138 Logs mới.
  4. Tuyệt đối KHÔNG backfill 93 internal logs lịch sử, 25 log mã 888.
  5. Tuyệt đối KHÔNG xử lý 20 orphan steps và 50 orphan logs.

---

## 2. CHI TIẾT 6 BẢN GHI STEP ỨNG VIÊN (tblProcessingDeadline)

Tất cả 6 steps đều đã được kiểm tra chéo:
- `legacy_id` chưa từng tồn tại trên Supabase (`SELECT WHERE legacy_id = ...` trả về 0 dòng).
- Bậc cha (`job_id`) đã tồn tại 100% trên Supabase với mã `LEGACY-JOB-{JobID}`.
- Thứ tự bước (`step_no`) đề xuất bằng `max(step_no) + 1` của Job cha, đảm bảo **hoàn toàn không xung đột (0 conflict)**.
- `item_type_id` và `processing_status_id` hợp lệ.

| STT | ProcessingDeadlineID | Legacy ID | Job Cha (Mã / UUID) | Bước hiện có | StepNo đề xuất | Tên bước (`step_name`) | ItemTypeID | StatusID | Hạn chót (Deadline) | Ghi chú (Notes) | SHA-256 Dòng (`source_row_hash`) | Trạng thái Thẩm định |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **4275** | `LEGACY-STEP-4275` | `ZA水冷ベース`<br>`249439b2-e1c6-4b42-ba99-54910d1f8a14` | 1 step (`[1]`) | **2** | 金型 (MOLD) | 2 | 8 | 2026-10-01 | 外周削り1mm | `540a9208953a2920b19c7f2b7052d0023877c51af945b130b49dd3df7a819441` | `NEW_SAFE_TO_STAGE` |
| 2 | **4276** | `LEGACY-STEP-4276` | `ASH021R2`<br>`dcaa2eb8-f66b-426d-9bb0-5a4ec7e18d00` | 3 steps (`[1, 2, 3]`) | **4** | スタッキング (STAKING) | 7 | 8 | 2026-10-02 | *(null)* | `366c32a4193ef31285854c957732abed8ad9ee1c7d2c1a0e548c2da7ec91cb65` | `NEW_SAFE_TO_STAGE` |
| 3 | **4238** | `LEGACY-STEP-4238` | `JAE380`<br>`39dbbc91-c7b4-4a90-bdd8-8c894b782092` | 2 steps (`[1, 2]`) | **3** | 抜型 (CUTTER) | 4 | 8 | 2026-09-04 | *(null)* | `a86bf841117095a2ae99506ebfbc1c9487aef777b8b2003280d5403a31748417` | `NEW_SAFE_TO_STAGE` |
| 4 | **4241** | `LEGACY-STEP-4241` | `KSP227`<br>`17131b0b-3f8c-40dd-988a-fc1d1c9888bc` | 2 steps (`[1, 2]`) | **3** | 抜型 (CUTTER) | 4 | 8 | 2026-09-03 | KSP-209 | `89759915bb7365ff195065b7e5d57892c0806e7acfca322905f29553a4140b43` | `NEW_SAFE_TO_STAGE` |
| 5 | **4251** | `LEGACY-STEP-4251` | `MMT021R2`<br>`c33e3f71-d3b0-48dd-8c34-11ad76a4a195` | 2 steps (`[1, 2]`) | **3** | 抜型 (CUTTER) | 4 | 8 | *(null)* | MMT-014 | `29f153a545c72fad631ac4a609fa8dd53c38b459461a4600227b9be515b6ca4d` | `NEW_SAFE_TO_STAGE` |
| 6 | **4226** | `LEGACY-STEP-4226` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | 2 steps (`[1, 2]`) | **3** | 金型 (MOLD) | 2 | 8 | 2026-09-04 | *(null)* | `7c47f4bda2bc7f16ef5ccc2aaf4951223444f9b7a94f67d234b3e36d015ceb57` | `NEW_SAFE_TO_STAGE` |

---

## 3. CHI TIẾT 5 BẢN GHI WORK LOG ỨNG VIÊN (tblWorkLog)

Tất cả 5 work logs đều đã được kiểm tra chéo:
- `legacy_id` chưa từng tồn tại trên Supabase.
- Bước công đoạn đích nằm trong danh sách 6 steps ứng viên ở trên (1 log gắn vào Step 4275; 4 logs gắn vào Step 4226).
- Nhân viên (`EmployeeID`) đã ánh xạ chính xác sang `employee_id` (UUID) trong Supabase:
  * `EmployeeID = 9`: グエン　ダン　トアン (`abe82154-2f81-44ec-b76e-11a2db247fca`)
  * `EmployeeID = 21`: ダオ　ティ　ジェン (`44d2d142-4173-4e1b-baa3-c888edc7777c`)
- Mã công đoạn (`ProcessingCodeID`) chuẩn xác: 10 (金型演算＆加工), 11 (本型穴あけ), 12 (本型ミガキ), 14 (演算＆加工).
- Ngày làm việc và số giờ hợp lệ, không có giá trị âm hoặc rỗng.

| STT | WorkLogID | Legacy ID | Step Đích (Access PK / Legacy) | Job Đích (Mã / UUID) | Nhân viên (Tên / UUID) | Mã Công đoạn | Ngày làm việc | Số giờ (h) | SHA-256 Dòng (`source_row_hash`) | Trạng thái Thẩm định |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **9052** | `LEGACY-LOG-9052` | Step 4275<br>`LEGACY-STEP-4275` | `ZA水冷ベース`<br>`249439b2-e1c6-4b42-ba99-54910d1f8a14` | グエン　ダン　トアン<br>`abe82154-2f81-44ec-b76e-11a2db247fca` | 14: 演算＆加工 | 2026-10-01 | 1.50 | `aff1491b49be03d25ceb3591aad0a4d27a0424577b90fd9027669009fadd5be1` | `NEW_SAFE_TO_STAGE` |
| 2 | **8882** | `LEGACY-LOG-8882` | Step 4226<br>`LEGACY-STEP-4226` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | グエン　ダン　トアン<br>`abe82154-2f81-44ec-b76e-11a2db247fca` | 10: 金型演算＆加工 | 2026-08-31 | 2.00 | `11218faed01e50324acb1f36a128c55dd3b6ad02049273bb4309e8d8244c74ba` | `NEW_SAFE_TO_STAGE` |
| 3 | **8895** | `LEGACY-LOG-8895` | Step 4226<br>`LEGACY-STEP-4226` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | グエン　ダン　トアン<br>`abe82154-2f81-44ec-b76e-11a2db247fca` | 10: 金型演算＆加工 | 2026-09-01 | 1.00 | `a97d15cbee130708658595947cd7de7b642a0bc6f8e5749c03d69e4c296ac66b` | `NEW_SAFE_TO_STAGE` |
| 4 | **8901** | `LEGACY-LOG-8901` | Step 4226<br>`LEGACY-STEP-4226` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | ダオ　ティ　ジェン<br>`44d2d142-4173-4e1b-baa3-c888edc7777c` | 11: 本型穴あけ | 2026-09-02 | 2.50 | `bf9c02073c7b08a63220cce67439a9b6b48157f62794f2f78f5cd89ffee93cd5` | `NEW_SAFE_TO_STAGE` |
| 5 | **8920** | `LEGACY-LOG-8920` | Step 4226<br>`LEGACY-STEP-4226` | `JAE381`<br>`f536c3e9-f4a8-4578-837b-174d9f96a7b3` | ダオ　ティ　ジェン<br>`44d2d142-4173-4e1b-baa3-c888edc7777c` | 12: 本型ミガキ | 2026-09-04 | 2.00 | `ec6c0ae8f11b1e68fe0954586b1c61a28c38ef5839c6b65f20c08b17dc0684e1` | `NEW_SAFE_TO_STAGE` |

---

## 4. TỆP BẰNG CHỨNG & HỒ SƠ LƯU TRỮ LOCAL
1. **Tệp Payload JSON Kiểm toán Local:** `scripts/candidate_payload_6steps_5logs.json`
2. **Script Thực thi Khảo sát:** `scripts/inspect_6steps_5logs.py`
3. **Báo cáo Chi tiết Markdown:** `docs/reports/2026-10-06_candidate_payload_6steps_5logs_report.md`
4. **Cam kết Nghiêm ngặt:** 0 dòng ghi Production, 0 bảng staging được tạo trên Supabase. Toàn bộ thông tin sẵn sàng chờ PE thẩm định độc lập và Minh Chủ Thoan xem xét quyết định về bước tạo staging tiếp theo.
