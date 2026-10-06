# Báo cáo Vòng A: Audit & Dry-Run Delta Access (Read-Only) — Hoàn thành vòng kiểm toán, chờ PE/THOAN phê duyệt ánh xạ
*(Round A audit completed — pending PE/THOAN mapping approval)*

- **Tập tin nguồn:** `docs/ysdJOB_20261006.accdb`  
- **Thời điểm thực hiện:** 2026-10-06 18:51 JST (2026-10-06T18:51:34.314Z)  
- **Mã băm SHA-256 động:** `0ec0f23e05a08178f0294b7f6e6de1bb5ede75feda54cf1bb8d1bb64cbd0cd66`  
- **Kích thước tệp:** 612,442,112 bytes  
- **Trạng thái thực thi:** 100% Chỉ-đọc (0 writes to Supabase Production, 0 staging tables created for Access delta)  
- **Kiểm tra bảng Staging trên Supabase:** Có 1 bảng staging hiện hữu duy nhất `staging_order_lines_backfill` (lịch sử từ giai đoạn backfill order lines trước đó); **0 bảng staging mới** được tạo cho Access delta.
- **Baseline Supabase Production (Bảo toàn 100%):**  
  `jobs: 1,205` | `job_steps: 2,451` | `work_logs: 7,106`

---

## 1. TỔNG QUAN ĐỐI SOÁT DELTA

| Thực thể | Tổng số Access | Đã có trên Supabase (MATCHED) | Delta phát sinh mới | Tỷ lệ đã nạp |
|---|---|---|---|---|
| **Jobs (`tblJOB`)** | 1,230 | 1,203 | **27** | 97.8% |
| **Steps (`tblProcessingDeadline`)** | 2,527 | 2,446 | **81** | 96.8% |
| **Work Logs (`tblWorkLog`)** | 7,416 | 7,105 | **311** (604.00 giờ) | 95.8% |

---

## 2. PHÂN LOẠI 6 TRẠNG THÁI THEO SECTION 29 APPROVED SPEC

### A. Phân loại 27 Jobs Delta (`tblJOB`)
- `MATCHED_ALREADY`: **1,203** jobs.
- `CONFLICT_REQUIRES_REVIEW`: **27** jobs (JobIDs: 1251..1278, ngoại trừ 1267).
  * **Đặc điểm dữ liệu nguồn:** Cả 27 jobs trong Access đều có `JobNo = NULL` và `CompanyID = NULL`.
  * **Ranh giới thẩm tra:** Tách bạch tuyệt đối giữa *khảo sát ứng viên (Candidate resolution)* và *phê duyệt ánh xạ chính thức (Approved mapping)*.
  * **Kết quả khảo sát ứng viên:**
    * 26/27 jobs có thể phân giải được công ty khách hàng thông qua tiền tố mã khuôn trong `JobName` (ví dụ: `ADY` -> ADVANTEC, `JAE` -> 日本航空電子工業, `DIC` -> 大一, `CHG` -> CHUO KAGAKU, `MTM` -> ミツミ電機...).
    * 8 jobs khớp trực tiếp với sản phẩm đang có trong bảng `products` (`YKW-009`, `TOW-005D`, `DIC-064`, `MTM-194`, `JAE-193`, `ASH-005`, `DIC-165D`, `YCM-082`).
    * Duy nhất 1 job `COB-001` (JobID 1276) chưa tìm thấy tiền tố trong danh mục khách hàng hiện có.
  * **Quyết định phân loại:** Toàn bộ 27 jobs delta giữ nguyên trạng thái `CONFLICT_REQUIRES_REVIEW` (Ánh xạ ứng viên — chờ Minh Chủ Thoan phê duyệt tiền tố).
- `NEW_SAFE_TO_STAGE`: **0** jobs (Chưa chuyển bất kỳ Job nào sang an toàn cho đến khi có quyết định phê duyệt).

---

### B. Phân loại 81 Steps Delta (`tblProcessingDeadline`)
- `MATCHED_ALREADY`: **2,446** steps.
- `NEW_SAFE_TO_STAGE`: **61** steps.
  * **6 steps bổ sung cho các Job cũ đã tồn tại trên Supabase:**
    1. StepID `4275` (Deadline: 2026-10-01) -> JobID `623` (`ZA水冷ベース` - UUID: `249439b2-e1c6-4b42-ba99-54910d1f8a14`)
    2. StepID `4276` (Deadline: 2026-10-02) -> JobID `1170` (`ASH021R2` - UUID: `dcaa2eb8-f66b-426d-9bb0-5a4ec7e18d00`)
    3. StepID `4238` (Deadline: 2026-09-04) -> JobID `1248` (`JAE380` - UUID: `39dbbc91-c7b4-4a90-bdd8-8c894b782092`)
    4. StepID `4241` (Deadline: 2026-09-03) -> JobID `1250` (`KSP227` - UUID: `17131b0b-3f8c-40dd-988a-fc1d1c9888bc`)
    5. StepID `4251` (Deadline: NULL) -> JobID `1247` (`MMT021R2` - UUID: `c33e3f71-d3b0-48dd-8c34-11ad76a4a195`)
    6. StepID `4226` (Deadline: 2026-09-04) -> JobID `1249` (`JAE381` - UUID: `f536c3e9-f4a8-4578-837b-174d9f96a7b3`)
  * **55 steps thuộc 27 Jobs delta mới** (Phụ thuộc vào quyết định phê duyệt Job cha).
- `UNRESOLVED_PARENT`: **20** steps (Gắn cờ `HOLD_STAGING_UNRESOLVED_PARENT`).
  * **Nguyên nhân:** `JobID IS NULL` trong bảng `tblProcessingDeadline` của Access (Steps mồ côi).
  * **Danh sách StepID mồ côi:** `3892, 2970, 2971, 3024, 3065, 3066, 3099, 3107, 3242, 3284, 3325, 3329, 3347, 3379, 3380, 3381, 3390, 3404, 3554, 3612`.
  * **Quy tắc xử lý:** Tuyệt đối không tạo Job giả, giữ cách ly ngoài staging chính.
- `CONFLICT_REQUIRES_REVIEW`: **0**.
- `INTERNAL_TASK`: **0**.
- `SKIP_DUPLICATE`: **0**.

---

### C. Phân loại 311 Work Logs Delta (`tblWorkLog`) — Tổng cộng: 604.00 giờ

#### 1. Nhóm An toàn (`NEW_SAFE_TO_STAGE`): 143 logs (286.75 giờ)
- Tất cả 143 logs đều có đầy đủ thông tin: nhân viên, mã gia công hợp lệ, ngày làm việc, số giờ, và tham chiếu đến step cha xác định.
- **Phân bổ theo đối tượng đích:**
  * **5 logs** tham chiếu đến các step thuộc Job cũ đã có trên Supabase:
    1. `WorkLogID 9052` (1.50h, 2026-10-01) -> Step `4275` (JobID 623 `ZA水冷ベース`) | NV: グエン　ダン　トアン (ID 9) | Mã 14: 演算＆加工
    2. `WorkLogID 8882` (2.00h, 2026-08-31) -> Step `4226` (JobID 1249 `JAE381`) | NV: グエン　ダン　トアン (ID 9) | Mã 10: 金型演算＆加工
    3. `WorkLogID 8895` (1.00h, 2026-09-01) -> Step `4226` (JobID 1249 `JAE381`) | NV: グエン　ダン　トアン (ID 9) | Mã 10: 金型演算＆加工
    4. `WorkLogID 8901` (2.50h, 2026-09-02) -> Step `4226` (JobID 1249 `JAE381`) | NV: ダオ　ティ　ジェン (ID 21) | Mã 11: 本型穴あけ
    5. `WorkLogID 8920` (2.00h, 2026-09-04) -> Step `4226` (JobID 1249 `JAE381`) | NV: ダオ　ティ　ジェン (ID 21) | Mã 12: 本型ミガキ
  * **138 logs** (277.75h) tham chiếu đến 55 steps thuộc 27 Jobs delta mới (sẽ được mở khóa sau khi phê duyệt Jobs delta).

#### 2. Nhóm Công việc Nội bộ (`INTERNAL_TASK`): 118 logs (223.50 giờ)
- **Ánh xạ vào 4 Step của `JOB-INTERNAL-SHOP` (93 logs, 181.75 giờ):**
  * **Step 1 (`5S・工場清掃`, UUID: `6ba5c7b9-4ec3-4d41-bbd2-057613287bff`):**
    - Mã gia công 50: **33 logs** (43.50 giờ).
  * **Step 2 (`設備・コンプレッサー保全`, UUID: `60072b5b-1209-4581-b334-f34431347307`):**
    - Mã gia công 54: **1 log** (2.00 giờ).
  * **Step 3 (`金型・治具修理`, UUID: `d8cff65d-2ffd-49ad-82e7-08a0b4624a47`):**
    - Mã gia công 42: **15 logs** (38.00 giờ).
  * **Step 4 (`スタッキング木板製作`, UUID: `d002b455-e5f5-4a34-b83f-9b5db94aba48`):**
    - Mã gia công 40: **44 logs** (98.25 giờ).
- **Nhóm Mã 888 (`その他`): 25 logs (41.75 giờ) — Phân loại: `INTERNAL_TASK_UNMAPPED` / `CONFLICT_REQUIRES_REVIEW`:**
  * Hiện tại `JOB-INTERNAL-SHOP` chỉ có 4 bước trên, chưa có bước cho công việc "Khác / その他 (Code 888)".
  * Tuyệt đối **KHÔNG tự ý gán bừa** vào 4 bước hiện có.
  * Đề xuất: Giữ cờ `INTERNAL_TASK_UNMAPPED` chờ Minh Chủ Thoan quyết định bổ sung Step 5 cho Job nội bộ hoặc xử lý riêng.
- **Kiểm tra tính toàn vẹn dữ liệu (Missing Fields Validation):**
  * Nhân viên (`EmployeeID`): 0 dòng thiếu.
  * Mã công đoạn (`ProcessingCodeID`): 0 dòng thiếu.
  * Ngày làm việc (`ProcessingDate`): 0 dòng thiếu.
  * Số giờ (`ProcessingTime`): 0 dòng thiếu.
  * **100% dữ liệu của 118 logs nội bộ hợp lệ về mặt cú pháp.**

#### 3. Nhóm Thiếu Bước Cha (`UNRESOLVED_PARENT`): 50 logs (93.75 giờ)
- Các log có mã gia công cơ khí (10, 11, 13, 14, 15, 20, 23, 24...) nhưng `ProcessingDeadlineID IS NULL`.
- Không thuộc công việc xưởng nội bộ, không có liên kết bước công đoạn.
- Giữ cách ly ngoài staging chính.

*(Xác nhận kiểm toán nhóm 94 logs không có step trong Access: Gồm đúng 44 logs thuộc Step 4 Stacking + 50 logs thuộc UNRESOLVED_PARENT = chính xác 94 logs).*

---

## 3. TỔNG HỢP TRẠNG THÁI VÀ BẰNG CHỨNG LƯU TRỮ

| Đối tượng | MATCHED_ALREADY | NEW_SAFE_TO_STAGE | CONFLICT_REQUIRES_REVIEW | UNRESOLVED_PARENT | INTERNAL_TASK | SKIP_DUPLICATE | TỔNG DELTA |
|---|---|---|---|---|---|---|---|
| **Jobs** | 1,203 | 0 | **27** (Ứng viên) | 0 | 0 | 0 | **27** |
| **Steps** | 2,446 | **61** (6 cũ + 55 delta) | 0 | **20** (Step mồ côi) | 0 | 0 | **81** |
| **Work Logs** | 7,105 | **143** (286.75h) | 0 | **50** (93.75h) | **118** (93 map + 25 unmap) | 0 | **311** |

### Hồ sơ Bằng chứng Kỹ thuật
- Báo cáo kiểm toán tổng thể JSON: `scripts/access_delta_round_a_audit.json`
- Báo cáo kiểm toán bổ sung chi tiết: `scripts/access_delta_round_a_supplement.json`
- Bảng khảo sát ứng viên 27 Jobs: `scripts/jobs_27_delta_resolved_candidates.json`
- Script thực thi kiểm toán: `scripts/audit_round_a_access_delta.py` & `scripts/generate_round_a_supplement.py`
