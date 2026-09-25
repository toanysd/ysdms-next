# Báo Cáo Khắc Phục Lỗ Hổng 3 & Dọn Bảng Deprecated — 2026-09-25 (AN)

## 1. Tóm tắt
Thực hiện theo chỉ đạo của PE tại `docs/technical/11_lo_hong_3_finding_20260925.md` và `temp_ai/R4_S3_review.md`:
- Đã refactor toàn bộ `src/app/production/molds/actions.ts` (`checkInMold`, `checkOutMold`, `relocateMold`), loại bỏ hoàn toàn các lệnh insert vào `mold_location_history` và `mold_loan_certificates`.
- Đã chuyển sang ghi log vị trí vào bảng chuẩn `asset_location_logs` (ADR-008) và cập nhật trực tiếp `equipment.current_rack_layer_id` / `usage_status`.
- Đã khắc phục 2 lỗi schema active:
  * `src/app/production/track/[itemId]/page.tsx`: Thay thế câu query bảng đã drop `physical_molds` bằng query `design_revisions` -> `equipment` (SSOT).
  * `src/app/equipment/jobs/[id]/page.tsx`: Sửa điều kiện banner cảnh báo chưa gá khuôn từ `!job.physical_molds` thành `!job.equipment && !job.physical_molds`.
- Đã xác minh `src/app/equipment/_components/detail-modal/modules/CheckInOutModule.tsx`: Không còn bất kỳ mã dual-write nào vào `physical_molds` hay `cutters`.

## 2. Kết quả kiểm tra
- `search_code` cho `mold_location_history` trong thư mục `src/app/` và `src/components/`: **0 kết quả** (chỉ còn lại trong `database.types.ts` chờ PE DROP table trên Supabase).
- `npx tsc --noEmit`: **0 errors**.
- `node scripts/check_translations.mjs`: **0 missing keys**.

## 3. Commit SHA
- **Commit:** `a49064aac204a87aeb0503c3bfe42c6b4285bf66` (`a49064a`)
- **Branch:** `origin/main`

## 4. Điều kiện để PE DROP TABLE
Hiện tại code ứng dụng đã hoàn toàn sạch 0 tham chiếu tới `mold_location_history`. Kính mời PE tự `search_code` xác minh và thực thi `DROP TABLE mold_location_history;` trên Supabase production để chính thức ĐÓNG Lỗ hổng 3.
