# 🏢 M11 — Chủ Thể Kinh Doanh, Máy Móc, Giá Kệ & Nhân Sự (`M11_companies_master/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (`ADR-005`, `ADR-008` & `WO-MOLD-DATA-SYNC-AUDIT`)
1. **Hợp nhất Chủ thể Kinh doanh (`public.companies` — `ADR-005`):**
   - Mọi tổ chức bên ngoài và nội bộ (Khách hàng `is_customer`, Nhà cung cấp/Thầu phụ gia công `is_supplier`, Đơn vị lưu giữ khuôn `KeeperCompany` như YSD Kawasaki `本社工場`, Yashio `八潮工場`, Saitama `埼玉工場`, Marudai `MRDI`) đều được lưu hợp nhất trong bảng `public.companies` (`2,214` dòng).
   - Kèm danh bạ người liên hệ (`company_contacts = 859` dòng, VD: Nakamura, Uchida, Yodogawa...) và địa điểm giao hàng (`delivery_sites = 1,169` dòng).
2. **Hệ thống Giá – Tầng Kệ Lưu Trữ Khuôn & Dao Cắt (`racks` & `rack_layers` — `ADR-008`):**
   - Định vị chính xác vị trí lưu kho của từng thiết bị (`equipment.current_rack_layer_id`) tại xưởng để phục vụ tra cứu nhanh dưới xưởng và đón đoàn kiểm toán hiện trường của khách hàng (`現地棚卸訪問` — Terada Deimu).
3. **Danh mục Máy móc (`machines`), Khổ khuôn (`cav_types`), Lịch làm việc (`company_calendar`) & Nhân sự (`employees`):**
   - `machines` (`14` máy định hình & gia công: ILLIG 4号機~9号機, Rv53B, Rv74c, Rv74d...); `cav_types` (`52` khổ khuôn chuẩn); `employees` (`25` nhân sự xưởng và văn phòng).

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Chủ thể (Khách hàng / Đối tác):** `/companies`, `/companies/[id]` (redirect từ `/master/customers*` và `/master`).
- **Dữ liệu Master kỹ thuật:** `/master/machines`, `/master/racks`, `/master/calendar`.

## 3. Trạng Thái Hiện Tại & Hạng Mục Còn Thiếu (`Backlog`)
- **Trạng thái:** **Hoàn thành & Đã xác minh trên Production (`CLOSED`)**.
- Trong `WO-MOLD-SYNC-WAVE1` (Dry-Run đã kiểm chứng tại `docs/audit_logs/2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json`):
  - Toàn bộ `3,940 / 3,940` khuôn `M-*` có `KeeperCompany` trong Access đã ánh xạ 100% (`0` unresolved) sang `public.companies.company_id`.
  - Chỉ còn bổ sung `+20` tầng kệ (`rack_layers`) từ Access `tblRackLayer` (cả 20 dòng đều đã khớp `20/20` với `public.racks` hiện có).
