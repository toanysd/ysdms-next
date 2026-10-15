# 🛠️ M05 — Thiết Bị Hợp Nhất, Khuôn, Dao Cắt, Phôi Nhôm & Bộ SET (`M05_equipment_set/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 320 Threads / 1,529 Emails & `ADR-001/004/010`)
- Mỗi lần lên máy định hình (ILLIG, Rv53B, Rv74c, Rv74d) phải tập hợp đủ **Bộ SET 8 Loại Thiết Bị (`Tooling Set`)** trong bảng `public.equipment` + `public.equipment_assignments`:
  1. **Đặc thù theo SP (`SET_MEMBER`):** `MOLD` (金型 — khuôn nhôm chính) & `PLUG` (プラグ — chày gỗ/Bakelite dán nỉ flannel).
  2. **Nhóm 1 — Dùng chung theo Cutline (`cutline_length x cutline_width`):** `CUTTER_INLINE` / `CUTTER_SEPARATE` (抜型 — dao liền máy / dao dập rời 別抜き) & `STACKING` (スタッキング — thanh dẫn xếp chồng).
  3. **Nhóm 2 — Dùng chung theo Khổ bao ngoài (`cav_type_id`):** `WATER_BASE` (水冷ベース), `PRESSURE_BASE` (圧空ベース), `FRAME` (フレーム上/下).
- **Quy tắc gá lắp:** Thiết bị phụ trợ Nhóm 2 ghép tự động theo `cav_type_id`; Dao cắt ghép theo `equipment_assignments` (`SET_MEMBER = 1,617`, `SHARED = 16`), bắt buộc KTV xác nhận.

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Routes chính:** `/equipment/unified`, `/equipment/molds`, `/equipment/molds/[id]`, `/equipment/cutting-dies`, `/equipment/aluminum`, `/equipment/dashboard`.
- **Redirect từ route cũ (`WO-ROUTE-CLEANUP`):** `/equipment` -> `/equipment/unified`; `/master/molds*` -> `/equipment/molds*`; `/master/cutters*` -> `/equipment/cutting-dies*`; `/equipment/auxiliary` -> `/equipment/unified`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Đã hoàn thành `WO-MOLD-UNIFY` (`8e10b6aa`, `c2d00dc9`) & `WO-EQUIPMENT-UI-FIX` (`a587a5c2`, `97116e09` — `CLOSED`)**.
- `MoldModal.tsx` đã ghi đúng cột `design_revision_id`, hỗ trợ chọn `equipment_type` (`MOLD`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG`), `keeper_company_id`, `current_rack_layer_id`; `CuttersClient.tsx` hỗ trợ `CUTTER_INLINE` / `CUTTER_SEPARATE`; `/equipment/unified` có tab `PLUG`.

## 4. Hạng Mục Còn Thiếu (`Backlog`)
- Thực thi `WO-MOLD-SYNC-WAVE1` (sau khi qua 2 cổng PE): nạp `+20` `rack_layers`, `+24` khuôn `M-*`, `+4` dao `C-*`, backfill `3,940` `keeper_company_id`, và `+1,337` cặp `equipment_assignments` từ Access `tblMoldCutter`.
