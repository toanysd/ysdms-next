# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 18:19:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-DATA-AUDIT-SUMMARY` (**CLOSED & VERIFIED BY PE** tại `33ea19e197266fabff4a83f1a004fef457e2e9bd`, Directive `65ffb9df`; `WO-MATERIAL-SYNC-WAVE4` đã hủy theo lệnh Minh Chủ **THOAN**).
  - `WO-MOLD-SYNC-WAVE3` (**CLOSED** tại `8a6b7db922cfbc58f73a3c9a9c5b32475ea55dec`), `WO-MOLD-SYNC-WAVE2` (**CLOSED** tại `3cff159d744d68daff09293d3c1479c704b6c319`), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-CONTEXT-PALACE` (**CLOSED**).
- **Work Order hiện hành:** `WO-AI-EXTRACTION-AUDIT` (Gate 1 — Read-Only theo Chỉ thị PE `65ffb9df`) — **ĐÃ HOÀN TẤT BÁO CÁO KIỂM TOÁN (`docs/audit_logs/2026-10-17_WO-AI-EXTRACTION-AUDIT.{md,json}`), CHỜ PE DUYỆT KẾ HOẠCH CẢI TIẾN**.

## 1. Tóm Tắt Phát Hiện Cốt Lõi `WO-AI-EXTRACTION-AUDIT` (Gate 1 Read-Only)
1. **Pipeline Trích xuất AI & Tạo mới (`ysdms-nextgen`):** Đang chia thành 3 luồng rời rạc (`/api/ocr/save`, `createFastToolingJobAction`, `createQuickMoldJobWorkflow`). Trong `/api/ocr/save`: (a) fallback lấy dòng đầu tiên bất kỳ trong `companies` khi không khớp khách hàng, (b) gán `equipment.company_id` bằng Khách hàng thay vì Nhà gia công khuôn, (c) bỏ sót tạo dòng `equipment` cho `PLUG` (`plugEquipId = NULL`), (d) tạo Job `DESIGN` (`DES-JAE380`) có `equipment_id = NULL` và thiếu `start_date` trên các Job thiết bị.
2. **Kiểm toán Bảng Kế hoạch Khuôn (`/equipment/schedule`):**
   - `work_orders` (`1,230`): `product_id/design_revision_id` thiếu `0`, nhưng `company_id = NULL` (`1,131`), `deadline = NULL` (`1,202`), `start_date = NULL` (`1,203`).
   - `jobs` (`1,232`): chỉ 2 dòng thiếu `equipment_id` (`DES-JAE380` và `JOB-INTERNAL-SHOP`), nhưng `mold_deadline = NULL` (`1,166` — trong khi `deadline` có `1,134` dòng), `company_id = NULL` (`1,131`), `job_type_id = NULL` (`28`).
   - `job_steps` (`2,512`): `track = NULL` (`2,507` dòng), `item_type_id = NULL` (`2,457` dòng).
3. **Đứt gãy giữa 4 Module Vận hành Thiết bị (`ysdms-nextgen`) và dữ liệu Wave 3 (`2,386` dòng lịch sử bị ẩn trên UI):**
   - `TeflonCoatingModule` đọc `jobs (EQUIPMENT_REPAIR)` thay vì `mold_maintenance` (`190` dòng Wave 3).
   - `TransportModule` chỉ lọc `TRANSFER` thay vì đọc `equipment_ship_logs` (`356` dòng Wave 3) & `SHIP_*`.
   - `LocationMoveModule` chỉ lọc `RELOCATE` thay vì `LOCATION_CHANGE` (`1,488` dòng Wave 3).
   - `CheckInOutModule` chưa lọc `STATUS_*` / đọc `equipment_status_logs` (`352` dòng Wave 3).
4. **Điểm dừng hiện tại:** Chờ **PE** duyệt lộ trình 3 WO đề xuất (`WO-EQUIP-OPS-WAVE3-WIRING`, `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT`, `WO-AI-OCR-PIPELINE-HARDENING`).
