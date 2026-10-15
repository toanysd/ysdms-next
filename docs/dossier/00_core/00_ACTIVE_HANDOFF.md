# ⚡ YSDMS NextGen — Bàn Giao Phiên Hiện Hành (`00_ACTIVE_HANDOFF.md`)

- **Thời điểm cập nhật:** `2026-10-15 10:35 JST` (`db_now = 2026-10-15 01:39:47.755187+00:00`)
- **Nhánh Git:** `main` (Đồng bộ `origin/main`)

## 1. Các Work Order Đã Đóng Gần Nhất (`CLOSED`)
1. **`WO-PIPE-FIX` + `WO-SCHEMA-SAFETY-FIX` + `WO-PIPE-E2E-PILOT` + `WO-PIPE-E2E-CLEANUP` (`CLOSED`):**
   - Khôi phục chuỗi `Case -> Technical Review -> Quotation -> Order` (Method A1 trong `fn_convert_quotation_to_order`, backfill `profiles = 3/3`, dọn sạch 12 UUID pilot).
2. **`WO-MOLD-UNIFY` (`CLOSED` — Commits `8e10b6aa`, `c2d00dc9`, `9de2c64c`):**
   - Bổ sung `EquipmentSetTab.tsx` trong `/equipment/jobs/[id]`; chuyển `/product-center/[id]` & `EquipmentDetailModal` sang đọc `equipment_assignments`; sửa `/maintenance` & KPI `/equipment/lifecycle` (`6,497`) dùng `v_equipment_lifecycle_status`.
3. **`WO-EVIDENCE-INFRA` & `WO-ROUTE-CLEANUP` (`CLOSED` — Commits `817f7b34`, `013f55bf`, `42851ee3`, `0efcddb8`):**
   - Tạo bảng `public.pe_evidence_items`; sửa 22 broken route literals; chuyển 30 route trùng lặp (gồm `/production/mold-orders`) thành Server Redirect về Canonical V3.
4. **`WO-MOLD-DATA-SYNC-AUDIT` (`ACCEPTED` — `a2a90587`) & `WO-PROJECT-STATUS-REVIEW` (`181b0fae`):**
   - Hoàn tất đối chiếu Access `ysdJOB_20261006.accdb` vs Supabase, quét 100% `source_data/mail_data` (`725` unique threads / `3,856` clean CSV emails / `706,674` XLSX rows).
5. **`WO-EQUIPMENT-UI-FIX` (`CLOSED` — Code `a587a5c2`, Evidence `97116e09`):**
   - Sửa `MoldModal.tsx` (`design_revision_id`, `equipment_type`, `keeper_company_id`, `current_rack_layer_id`), `cutting-dies` (`CUTTER_INLINE`/`CUTTER_SEPARATE`), `/equipment/unified` (tab `PLUG`), `/equipment/dashboard`, và `CreateJobModal.tsx` + `mold-job.ts`.

## 2. Work Order Đang Thực Thi Hiện Tại
- **`WO-DOC-MODULAR` (Chỉ thị `d7ac6322`):** Khởi tạo 13 thư mục trong `docs/dossier/` (`00_core` + `M01`..`M12`), mỗi module gồm `business.md` và `schema.md` (`<= 120` dòng, `<= 5 KB`), chia thành 3 commits theo nhóm module. Không xóa file gốc, không sửa `src/`, không đụng DB nghiệp vụ.

## 3. Lộ Trình Kế Tiếp (Chờ PE & Minh Chủ THOAN Duyệt)
1. **`WO-MOLD-SYNC-WAVE1`:** Đã có kết quả Dry-Run chỉ-đọc tại `docs/audit_logs/2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json` (`+20` `rack_layers`, `+88` `design_revisions` mới + map `71` dòng trùng `design_code`, `+24` `M-*`, `+4` `C-*`, backfill `3,940` `keeper_company_id`, `+1,337` `equipment_assignments`).
2. **`WO-MOLD-SYNC-WAVE2` & `WAVE3`:** Đồng bộ `+262` `jobs`, `+635` `job_steps`, `LEGACY-STEP-SHOP-INTERNAL` & `+2,437` `work_logs`.
3. **`WO-MOLD-SYNC-WAVE4`:** Đồng bộ `587` `tblMoldShipLog`, `4,686` `tblTeflonLog` có `SentDate`, và hợp nhất `209` `mold_loan_certificates`.
