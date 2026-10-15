# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-15 11:22:50 JST`
- **Work Order vừa đóng:** `WO-DOC-MODULAR` (**CLOSED** — PE nghiệm thu tại `2026-10-15 10:53 JST`, Commit `d7635db6`).
- **Work Order hiện hành:** `WO-MOLD-SYNC-WAVE1` — **CỔNG 1 (`GATE 1 PAYLOAD SUBMITTED`, Chờ PE duyệt)**.

## 1. Trạng Thái Cổng Kiểm Toán `WO-MOLD-SYNC-WAVE1` (Cổng 1)
- **Đã kiểm chứng Dry-Run thực tế trên PostgreSQL (`BEGIN ... ROLLBACK`, 0 mutation lưu lại):**
  1. **Step 1.1 (`public.rack_layers`):** `+20` dòng (`380 -> 400`, dùng `layer_number = RackLayerID` và `layer_code = <rack_code>-L<num>-<id>` để 0 va chạm `UNIQUE(rack_id, layer_number)`).
  2. **Step 1.2A (`71 tblMoldDesign` trùng `design_code`):** `70` dòng đã có trong PG với `legacy_id = 'DESIGN-' || id` $ightarrow$ chuẩn hóa thành `'D-' || id` (`ROW_COUNT = 70`); `1` dòng (`MoldDesignID = 4725`, `CHG001D`) trùng `D-4724` và có `0` khuôn/dao tham chiếu $ightarrow$ `SKIP_DUPLICATE_MAP_TO_D_4724`.
  3. **Step 1.2B & 1.2C (`54 products` mới cho `88 design_revisions` mới):** Chèn `+54` `public.products` mới (`8,489 -> 8,543`, `product_lifecycle_status = 'MASS_PRODUCTION'`) và `+88` `public.design_revisions` mới (`4,693 -> 4,781`, khớp 100% `tblMoldDesign`).
  4. **Step 1.3 (`24 MOLD` + `4 CUTTER` mới):** Chèn `+28` dòng `public.equipment` (`6,497 -> 6,525`; 4 dao cắt dùng hậu tố `-2` `JAE380-2`, `ADY133R1-2`, `YKW009-2`, `YCM082R1-2` thỏa mãn `UNIQUE(equipment_code)`).
  5. **Step 1.4 (`keeper_company_id` Strict Backfill):** Chỉ map 6 mã `COMP-1, 3, 4, 5, 6, 10` khớp chính xác `companies.legacy_id = 'COMP-' || KeeperCompany` $ightarrow$ cập nhật `225` khuôn + `1` dao cắt (`ROW_COUNT = 226`). Bỏ qua `KeeperCompany = 2` (`ヨシダパッケージ` nội bộ YSD, `3,714` khuôn, không có `COMP-2`, tránh gán nhầm vào `CUST-2` `MOK`) và `KeeperCompany = 1540` (`ミツミ電機☆`, `2` khuôn, không có `COMP-1540`).
  6. **Step 1.5 (`public.equipment_assignments`):** Chèn `+1,337` dòng (`1,633 -> 2,970`, gồm `265 SET_MEMBER` + `1,072 SHARED`).

## 2. Hồ Sơ Đối Chứng Cổng 1 Trên GitHub & Supabase
- **JSON Mapping đầy đủ:** `docs/audit_logs/2026-10-15_WO-MOLD-SYNC-WAVE1-GATE1.json`
- **SQL Payload & Rollback Plan:** `docs/audit_logs/2026-10-15_WO-MOLD-SYNC-WAVE1-GATE1.sql`
