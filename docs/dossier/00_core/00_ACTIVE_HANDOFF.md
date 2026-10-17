# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 16:31:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-MOLD-SYNC-WAVE2` (**CLOSED & VERIFIED BY PE** tại `3cff159d744d68daff09293d3c1479c704b6c319` — `2,785/2,785` staging rows applied; `work_orders = 1,230`, `jobs = 1,232`, `job_steps = 2,512`, `work_logs = 7,316`, `v_work_order_equipment_set = 1,833`).
  - `WO-CONTEXT-PALACE` (**CLOSED**), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-DOC-MODULAR` (**CLOSED**), `WO-EQUIPMENT-UI-FIX` (**CLOSED**).
- **Work Order hiện hành:** Đang chờ **PE** đặc tả và phát lệnh **`WO-MOLD-SYNC-WAVE3` / `WAVE4`** (theo ủy quyền `GO` từ Minh Chủ **THOAN**).

## 1. Ma Trận Dữ Liệu Còn Lại Cho `Wave 3` & `Wave 4` (`Read-Only Survey`)
1. **`tblLocationLog` (`1,488` dòng Access):** `public.asset_location_logs` hiện có `1,450` dòng (`+38` dòng mới); `public.equipment_history = 0` dòng (`1,488/1,488` khớp `equipment_id`).
2. **`tblShipLog` (`358` dòng Access):** `public.equipment_ship_logs = 0` dòng (có cột `legacy_ship_id UNIQUE`); `347/358` khớp `equipment_id` (`M-*` / `C-*`), `11` dòng thiết bị phụ/khác (`equipment_id` nullable).
3. **`tblTeflonLog` (`4,692` dòng Access):** `4,692/4,692` khớp `equipment_id` (`M-*`); có **`190` dòng `SentDate IS NOT NULL`** (và `268` dòng có ít nhất 1 ngày/trạng thái giao dịch thực tế). `public.mold_maintenance = 0` dòng (`physical_mold_id` FK trỏ thẳng tới `public.equipment(equipment_id)`).
4. **`tblMoldLog` (`36` dòng) & `tblCutterLog` (`21` dòng):** `public.mold_name_history = 0` dòng (`physical_mold_id` FK trỏ tới `public.equipment(equipment_id)`), `35/36` khuôn & `21/21` dao cắt khớp `equipment_id`.
5. **`statuslogs` (`398` dòng Access):** `public.equipment_status_logs = 0` dòng (có `legacy_status_log_id UNIQUE`, `CHECK status IN ('IN','OUT','DISPOSED','RETURNED','AUDIT')`); `398/398` khớp `equipment_id`.
6. **Điểm dừng hiện tại:** Chờ **PE** ban hành đặc tả kỹ thuật cho **`WO-MOLD-SYNC-WAVE3`**.
