# Báo cáo Vòng A: Audit & Dry-Run Delta Access (Read-Only)
**Tập tin nguồn:** `docs/ysdJOB_20261006.accdb`  
**Thời điểm thực hiện:** 2026-10-06 18:51 JST (2026-10-06T18:51:34.314Z)  
**Mã băm SHA-256 động:** `0ec0f23e05a08178f0294b7f6e6de1bb5ede75feda54cf1bb8d1bb64cbd0cd66`  
**Kích thước tệp:** 612,442,112 bytes  
**Trạng thái thực thi:** 100% Chỉ-đọc (0 writes to Supabase Production, 0 staging tables created)  

---

## 1. TỔNG QUAN ĐỐI SOÁT DELTA

| Thực thể | Tổng số Access | Đã có trên Supabase (MATCHED) | Delta phát sinh mới | Tỷ lệ đã nạp |
|---|---|---|---|---|
| **Jobs (`tblJOB`)** | 1,230 | 1,203 | **27** | 97.8% |
| **Steps (`tblProcessingDeadline`)** | 2,527 | 2,446 | **81** | 96.8% |
| **Work Logs (`tblWorkLog`)** | 7,416 | 7,105 | **311** (604.00 giờ) | 95.8% |

---

## 2. PHÂN LOẠI 6 TRẠNG THÁI THEO SECTION 29

### A. Phân loại 27 Jobs Delta
- `MATCHED_ALREADY`: **1,203** jobs.
- `CONFLICT_REQUIRES_REVIEW`: **27** jobs (JobIDs: 1251..1278, ngoại trừ 1267).
  * **Đặc điểm nguồn:** Cả 27 jobs trong Access đều có `JobNo = NULL` và `CompanyID = NULL`.
  * **Giải pháp khảo sát ánh xạ:**
    * 26/27 jobs có thể giải quyết được khách hàng (`company_id`) thông qua tiền tố mã khuôn trong `JobName` (ví dụ: `ADY` -> ADVANTEC, `JAE` -> 日本航空電子工業, `DIC` -> 大一, `CHG` -> CHUO KAGAKU, `MTM` -> ミツミ電機...).
    * 8 jobs khớp trực tiếp với sản phẩm đang có trong bảng `products` (`YKW-009`, `TOW-005D`, `DIC-064`, `MTM-194`, `JAE-193`, `ASH-005`, `DIC-165D`, `YCM-082`).
    * Duy nhất 1 job `COB-001` (JobID 1276) chưa tìm thấy tiền tố trong danh mục khách hàng.
- `NEW_SAFE_TO_STAGE`: **0** (Giữ nguyên ở trạng thái CONFLICT chờ PE & Thoan duyệt quy tắc mapping tiền tố).

### B. Phân loại 81 Steps Delta
- `MATCHED_ALREADY`: **2,446** steps.
- `NEW_SAFE_TO_STAGE`: **61** steps.
  * 55 steps thuộc 27 Jobs delta mới.
  * 6 steps bổ sung cho các Jobs cũ đã có trên Supabase.
- `UNRESOLVED_PARENT`: **20** steps (Gắn cờ `HOLD_STAGING_UNRESOLVED_PARENT`).
  * Danh sách StepID mồ côi (`JobID = NULL`): `3892, 2970, 2971, 3024, 3065, 3066, 3099, 3107, 3242, 3284, 3325, 3329, 3347, 3379, 3380, 3381, 3390, 3404, 3554, 3612`.
  * Tuyệt đối không tạo Job giả, giữ riêng ngoài staging chính.
- `CONFLICT_REQUIRES_REVIEW`: **0**.
- `INTERNAL_TASK`: **0**.
- `SKIP_DUPLICATE`: **0**.

### C. Phân loại 311 Work Logs Delta (Tổng: 604.00 giờ)
- `MATCHED_ALREADY`: **7,105** logs.
- `NEW_SAFE_TO_STAGE`: **143** logs (**286.75** giờ).
  * Các work log có bước công đoạn hợp lệ và mã gia công chuẩn.
- `INTERNAL_TASK`: **118** logs (**223.50** giờ).
  * Công việc xưởng nội bộ:
    - Mã 40 (`スタッキング`): 44 logs
    - Mã 50 (`5S`): 33 logs
    - Mã 888 (`その他`): 25 logs
    - Mã 42 (`金型・治具修理`): 15 logs
    - Mã 54 (`メンテナンス`): 1 log
  * Ứng viên nạp vào `JOB-INTERNAL-SHOP` theo quy chế đã phê duyệt.
- `UNRESOLVED_PARENT`: **50** logs (**93.75** giờ).
  * Có mã gia công (10, 11, 13, 14, 15, 20, 23, 24) nhưng `ProcessingDeadlineID IS NULL`.
- `SKIP_DUPLICATE`: **0**.

*(Lưu ý về nhóm 94 logs không có step: Gồm đúng 44 logs thuộc INTERNAL_TASK + 50 logs thuộc UNRESOLVED_PARENT, tổng cộng chính xác 94 logs).*

---

## 3. TỆP BẰNG CHỨNG LƯU TRỮ
- Báo cáo chi tiết JSON: `scripts/access_delta_round_a_audit.json`
- Bảng ánh xạ ứng viên 27 Jobs: `scripts/jobs_27_delta_resolved_candidates.json`
- Script thực thi audit: `scripts/audit_round_a_access_delta.py`
