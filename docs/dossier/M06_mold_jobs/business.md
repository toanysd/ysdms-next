# ⚙️ M06 — Gia Công Chế Tạo Khuôn, Lịch Biểu Gantt & Work Orders (`M06_mold_jobs/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 142 Threads / 1,515 Emails & `ysdJOB_20261006.accdb`)
- Mô hình thực thi 4 tầng chuẩn (`ADR-002`): `work_orders` (Lệnh SX) -> `jobs` (1:1 với từng `equipment`) -> `job_steps` (Công đoạn) -> `work_logs` (Nhật ký giờ công).
- **3 Nhánh gia công song song tại Phòng Khuôn (`mold_manufacturing_process.md:28-56`):**
  1. **Track `MOLD` (7 bước — đường găng):** `裏面プログラム` (~3h) -> `裏面加工` (~5h CNC) -> `表面プログラム` (~1-2h) -> `表面加工` (**8h~240h CNC**) -> `金型穴あけ` (~4h) -> `磨き・仕上げ` (~4h) -> `洗浄・刻印` (~2h).
  2. **Track `PLUG` (2 bước):** `プラグ加工` (~5h CNC gỗ/Bakelite) -> `ベース切断・ネル貼り` (~3-4h dán nỉ flannel).
  3. **Track `CUTTER` (2 bước thuê ngoài):** `外注手配` -> `抜型受取` (~1h nghiệm thu).
- **Kỷ luật thời hạn:** Khuôn phải hoàn thành (`target_completion_date`) trước ngày xuất hàng khay 3 ngày làm việc và bàn giao sang xưởng định hình đúng hạn `mold_deadline` (`払出期日`).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Routes chính:** `/equipment/jobs`, `/equipment/jobs/[id]` (gồm 4 Tabs: `OverviewTab`, `StepsTab`, `EquipmentSetTab`, `LogsTab`), `/equipment/jobs/[id]/print` (Phiếu A4 kèm QR), `/equipment/schedule` (Gantt), `/production/work-orders`.
- **Redirect từ route cũ (`WO-ROUTE-CLEANUP`):** `/production/mold-orders` -> `/equipment/jobs`; `/production/jobs*` -> `/equipment/jobs*`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành UI & Đã nghiệm thu `WO-PIPE-FIX` (`c6f20b98`), `WO-MOLD-UNIFY` (`8e10b6aa`), `WO-ROUTE-CLEANUP` (`42851ee3`), `WO-EQUIPMENT-UI-FIX` (`a587a5c2`)**.
- Đã khôi phục trang chi tiết `/equipment/jobs/[id]`, bổ sung `EquipmentSetTab.tsx`, và sửa `CreateJobModal.tsx` + `createMoldJob` tự động lưu `design_revision_id`, `product_id`, `company_id`.

## 4. Hạng Mục Còn Thiếu (`Backlog`)
- Đồng bộ `WO-MOLD-SYNC-WAVE2` (`+262` `jobs`, `+635` `job_steps`, tạo `LEGACY-STEP-SHOP-INTERNAL` theo Quyết định 3.C Phương án A) và `WAVE3` (`+2,437` `work_logs`) từ Access.
