# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 17:35:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-MOLD-SYNC-WAVE2` (**CLOSED & VERIFIED BY PE** tại `3cff159d744d68daff09293d3c1479c704b6c319`).
  - `WO-CONTEXT-PALACE` (**CLOSED**), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-DOC-MODULAR` (**CLOSED**), `WO-EQUIPMENT-UI-FIX` (**CLOSED**).
- **Work Order hiện hành:** `WO-MOLD-SYNC-WAVE3` (đã gộp `Wave 4` theo Chỉ thị PE `d9fd207d`) — **ĐÃ NỘP PAYLOAD CỔNG 1 V1 (`BEGIN...ROLLBACK` DRY-RUN PASS), CHỜ PE DUYỆT & RA LỆNH `GO`**.

## 1. Hồ Sơ Cổng 1 `WO-MOLD-SYNC-WAVE3` (Payload v1 — `2,829` dòng mới, `0` biến đổi Production khi Dry-run)
1. **7 File SQL Độc Lập (`<= 78` dòng/file) tại `docs/audit_logs/wave3_payload_v1/`:**
   - `01_staging_ddl.sql`: Tạo `public.staging_mold_sync_wave3`, bật RLS (`relrowsecurity = true`, 2 policies), nạp `2,829` dòng.
   - `02_step3_1_location_to_equipment_history.sql` (`Q1`): Insert `+1,488` `tblLocationLog` vào `equipment_history` (`LOCATION_CHANGE`; `LocationLogID=1356` gán `to_location=NULL` + `'Orphan RackLayerID=840'`; giữ nguyên `asset_location_logs = 1,450`).
   - `03_step3_2_ship_logs_insert.sql` (`Q2`): Insert `+356` `tblShipLog` có `ShipDate` vào `equipment_ship_logs` (loại `2` dòng `ShipDate IS NULL`).
   - `04_step3_3_teflon_to_mold_maintenance.sql` (`Q3`): Insert `+190` `tblTeflonLog` có `SentDate IS NOT NULL` vào `mold_maintenance` (`TEFLON_COATING`).
   - `05_step3_4_mold_cutter_logs_insert.sql` (`Q4`): Insert `+35` `tblMoldLog` vào `mold_name_history` & `+56` (`35` `MODIFICATION` + `21` `CUTTER_MAINTENANCE`) vào `equipment_history` (loại `MoldLogID=24` rỗng).
   - `06_step3_5_status_logs_insert.sql` (`Q5/5A`): Insert `+352` `statuslogs` hợp lệ vào `equipment_status_logs` & `+352` vào `equipment_history` (`1,544 -> 1,896`; loại `46` dòng `Status IS NULL`).
   - `07_full_rollback_plan.sql`: Rollback định danh theo `target_pk` thứ tự ngược (`3.5B -> 3.1`), khôi phục cả 5 bảng về `0`.
2. **Điểm dừng hiện tại:** Chờ **PE** thẩm định Cổng 1 Payload v1 và phát lệnh **`GO` cho `WO-MOLD-SYNC-WAVE3`**.
