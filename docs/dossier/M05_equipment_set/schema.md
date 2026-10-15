# 🗄️ M05 — Schema Thiết Bị Hợp Nhất & Bộ SET (`M05_equipment_set/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `equipment = 6,497` | `equipment_assignments = 1,633` (`SET_MEMBER = 1,617`, `SHARED = 16`) | `aluminum_blanks = 0`.

## 1. Bảng `public.equipment` (BASE TABLE — 6,497 dòng, SSOT Thiết Bị Vật Lý)
- `equipment_id` (uuid*) | `equipment_code` (text*) | `display_name` (text*) | `equipment_type` (text*)
- `sub_type` (text) | `physical_stamp` (text) | `dimensions` (text) | `actual_length_mm` (text)
- `actual_width_mm` (text) | `actual_height_mm` (text) | `actual_weight` (text) | `material_spec` (text)
- `piece_count` (integer) | `copy_number` (integer) | `company_id` (uuid) | `keeper_company_id` (uuid)
- `design_revision_id` (uuid) | `cav_type_id` (uuid) | `mold_master_id` (uuid) | `current_rack_layer_id` (uuid)
- `device_status` (text) | `usage_status` (text) | `on_checklist` (boolean) | `mold_type` (text)
- `manufacturing_date` (date) | `entry_date` (date) | `returned_date` (date) | `disposed_date` (date)
- `qr_uuid` (uuid) | `legacy_physical_mold_id` (uuid) | `legacy_cutter_id` (uuid) | `legacy_id` (text)
- `legacy_specs` (jsonb) | `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `updated_by` (uuid) | `shared_with_code` (text) | `shared_note` (text) | `cost_note` (text)
- `maintenance_shot_threshold` (integer) | `shots_at_last_maintenance` (integer)

## 2. Bảng `public.equipment_assignments` (BASE TABLE — 1,633 dòng, SSOT Quan Hệ Bộ SET)
- `assignment_id` (uuid*) | `primary_equipment_id` (uuid*) | `related_equipment_id` (uuid*) | `relationship_type` (text*)
- `is_default` (boolean) | `notes` (text) | `created_at` (timestamptz)

## 3. Quy Tắc Schema & Bảng Legacy (`RULE-DATA-01` & `RULE-DATA-02`)
1. **Phân bố `equipment_type` hiện tại (`6,497` dòng):** `MOLD` (`3,759`), `CUTTER_SEPARATE` (`2,420`), `WATER_BASE` (`145`), `PRESSURE_BASE` (`66`), `FRAME` (`65`), `STACKING` (`41`), `CUTTER_INLINE` (`1`), `PLUG` (`0`).
2. **Định dạng `legacy_id`:** Khuôn từ `tblMold` là `'M-' || MoldID`; Dao cắt từ `tblCutter` là `'C-' || CutterID`.
3. **Kích thước vật lý vs Thiết kế:** `equipment.actual_length_mm / actual_width_mm / actual_height_mm` là kích thước khối kim loại vật lý. Tuyệt đối **KHÔNG** dùng thay cho `design_revisions.cutline_length / cutline_width`.
4. **Bảng Legacy:** `mold_masters`, `physical_molds`, `cutters` **KHÔNG TỒN TẠI** (`NOT_FOUND`). `auxiliary_equipments` (`0` dòng) và `mold_design_cutters` (`0` dòng) vẫn tồn tại trong DB nhưng **CẤM DÙNG** trong code mới.
