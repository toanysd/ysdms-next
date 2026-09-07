# Implementation Plan — Milestone 16 Sprint 1: Location Browser (`/equipment/locations`)

Xây dựng hệ thống Trực quan hóa và Quản lý Kệ - Tầng kho lưu trữ thiết bị (`/equipment/locations`) theo chuẩn định danh ADR-008 (`{ZONE}-{NUMBER}` và `{RACK_CODE}-L{N}`) kết nối trực tiếp với 90 kệ, 380 tầng và 4,549 thiết bị thực tế tại xưởng YSD.

## User Review Required

> [!IMPORTANT]
> - **Migration 096** (`20260907000003_096_rack_code_new_convention.sql`) đã được AN tạo, commit và đẩy lên nhánh `main` (commit `bf539e4`). PE cần chạy lệnh apply migration qua MCP trên Supabase Production.
> - Sau khi Migration 096 được áp dụng, 90 kệ sẽ có `zone_code` (12 zone) và `rack_code_new` (VD: `MR-01`), 380 tầng có `layer_code` (VD: `MR-01-L1`), và 4,549 thiết bị sẽ được tự động liên kết `current_rack_layer_id`.
> - Giao diện hiển thị `rack_code` cũ (ký tự vòng tròn `①`, `②`...) dạng badge phụ bên cạnh mã mới `MR-01` để nhân viên xưởng đối chiếu chuyển tiếp không bị bỡ ngỡ.

---

## Proposed Changes

### Phân hệ Kệ - Tầng Kho Thiết Bị (Equipment Locations)

#### [NEW] `src/app/equipment/locations/page.tsx`
- **Mục đích:** Trang tổng quan Danh mục Vị trí Kệ - Tầng kho YSD.
- **Tính năng:**
  - **4 KPI Cards:** Tổng số Kệ (90), Tổng số Tầng (380), Tổng thiết bị đang lưu trữ, Tỷ lệ lấp đầy (% Occupancy).
  - **Filter Bar:** Dropdown lọc 12 Zone xưởng (`MR`, `M8`, `TW`, `OF`, `MD`, `TC`, `GT`, `PS`, `MT`, `SC`, `2F`, `CS`, `SP`), ô tìm kiếm nhanh mã thiết bị / tên khuôn / mã kệ, bộ lọc trạng thái (Tất cả / Đang có khuôn / Còn trống).
  - **Rack Grid View:** Lưới hiển thị các kệ theo Zone. Mỗi Card kệ hiển thị:
    - Mã mới `rack_code_new` (VD: `MR-01`) nổi bật.
    - Mã cũ `① (01)` mờ nhỏ bên cạnh.
    - Tên khu vực `location_in_factory`.
    - Thanh đo sức chứa mini (Visual layer dots/bars).
    - Số lượng thiết bị đang cất giữ.
    - Nút / Link click vào chi tiết kệ `/equipment/locations/[rackId]`.

#### [NEW] `src/app/equipment/locations/[rackId]/page.tsx`
- **Mục đích:** Trang chi tiết Kệ & Mô phỏng Kệ đứng nhiều tầng (Visual Shelf View).
- **Tính năng:**
  - **BackBar:** `← 戻る (Back)` + `↑ 一覧 (Vị trí kho)`.
  - **Kệ Header:** `rack_code_new`, mã cũ `rack_code`, `zone_code`, `location_in_factory`, sức chứa & tỷ lệ sử dụng.
  - **Visual Shelf Layout:** Mô phỏng kệ thực tế (xếp tầng từ Tầng N ở trên cùng xuống Tầng 1 ở dưới cùng).
  - **Mỗi tầng kệ (`rack_layer`):**
    - Nhãn tầng: `MR-01-L1` (Tầng 1), số lượng thiết bị.
    - Danh sách thẻ thiết bị đang đặt tại tầng đó: Mã thiết bị (`equipment_code` hyperlink tới `/equipment/[id]`), Tên hiển thị (`display_name`), Loại (`equipment_type`), Tình trạng (`device_status`).
    - Nút thao tác nhanh "Đổi vị trí" (chuẩn bị cho Sprint 2).

#### [NEW] `src/app/equipment/locations/actions.ts`
- **Mục đích:** Server Actions truy vấn dữ liệu Kệ, Tầng, Thiết bị và Zone.
- **Functions:**
  - `getLocationOverview(filters)`: Lấy danh sách 90 kệ kèm count tầng và count thiết bị, thống kê KPI tổng hợp.
  - `getRackDetailWithLayers(rackId)`: Lấy chi tiết 1 kệ, toàn bộ các tầng (`rack_layers`) và danh sách thiết bị (`equipment`) đang đặt tại từng tầng.

#### [NEW] Components hỗ trợ
- `src/app/equipment/locations/_components/LocationFilterBar.tsx`: Thanh lọc Zone, tìm kiếm và trạng thái.
- `src/app/equipment/locations/_components/LocationKpiCards.tsx`: 4 thẻ chỉ số KPI vị trí kho.
- `src/app/equipment/locations/_components/RackCardGrid.tsx`: Lưới hiển thị danh sách kệ.
- `src/app/equipment/locations/[rackId]/_components/VisualShelfView.tsx`: Giao diện mô phỏng kệ đứng trực quan.

#### [MODIFY] `src/components/layout/Sidebar.tsx`
- Đăng ký route `/equipment/locations` trong Section `d3` (Phòng Khuôn) với icon `MapPin`.

#### [MODIFY] `messages/ja.json` & `messages/vi.json`
- Bổ sung namespace `EquipmentLocations` phục vụ đa ngôn ngữ hoàn chỉnh.

---

## Verification Plan

### Automated Tests & Quality Gates
- **TypeScript:** `npx tsc --noEmit` $\rightarrow$ 0 errors.
- **i18n Check:** `node scripts/check_translations.mjs` $\rightarrow$ 0 missing keys.
- **Bilingual Scan:** Đảm bảo không hardcode text song ngữ trong các component mới.

### Manual Verification
1. Truy cập `/equipment/locations`: Xác nhận hiển thị đủ 90 kệ phân bổ vào đúng 12 Zone (`MR`, `M8`, `TW`, `OF`, `MD`, `TC`, `GT`, `PS`, `MT`, `SC`, `2F`, `CS`, `SP`).
2. Lọc Zone: Bấm lọc `MR` $\rightarrow$ hiển thị đúng 12 kệ của Phòng máy 6 (`MR-01` $\rightarrow$ `MR-12`).
3. Click vào Kệ `MR-01` $\rightarrow$ navigate `/equipment/locations/[rackId]`: Xác nhận hiển thị các tầng `MR-01-L1` $\rightarrow$ `MR-01-L5` dạng kệ đứng trực quan và các khuôn/dao đang đặt tại đó.
4. Click mã khuôn $\rightarrow$ chuyển hướng chính xác đến trang chi tiết thiết bị `/equipment/[id]`.
