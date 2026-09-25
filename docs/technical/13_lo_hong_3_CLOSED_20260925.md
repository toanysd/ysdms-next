# Lỗ hổng 3 — CLOSED ✅ (2026-09-25, 11:59 JST)

## Trình tự xử lý đã xác minh đầy đủ
1. **2026-09-25 10:27** — PE phát hiện qua `search_code`: `mold_location_history` (0 dòng) vẫn còn code sống (`checkInMold`/`checkOutMold`/`relocateMold` trong `actions.ts`). Đánh dấu `COMMENT ON TABLE ... DEPRECATED`, chưa DROP (xem `11_lo_hong_3_finding_20260925.md`).
2. **2026-09-25 11:42** — AN push commit code `a49064a` (refactor `actions.ts`, `track/[itemId]/page.tsx`, `equipment/jobs/[id]/page.tsx` — loại bỏ insert `mold_location_history`, chuyển sang `asset_location_logs`/`equipment` theo ADR-008) + commit docs `6fe7d92`. PE xác minh độc lập qua `get_commit` (diff khớp) và `get_file_contents` (blob SHA `actions.ts` đổi thành `84b960ed...`) — xác nhận thay đổi là thật.
3. **2026-09-25 11:59** — PE kiểm tra lại: `SELECT count(*)=0`, `pg_constraint` không có bảng nào tham chiếu ngược (`confrelid`). Thực thi `DROP TABLE IF EXISTS public.mold_location_history CASCADE;` qua `apply_migration`. Xác minh lại bằng `pg_tables`: `table_still_exists = false`.

## Kết luận
`mold_location_history` đã được DROP an toàn khỏi Supabase production (`iirezrszalmecsslbruo`). Không có dữ liệu mất (0 dòng), không có bảng nào bị ảnh hưởng bởi CASCADE, code `src/` đã ngừng hoàn toàn việc insert vào bảng này trước khi DROP.

Ghi chú: `src/types/database.types.ts` vẫn còn khai báo type tĩnh cho `mold_location_history` (không gây lỗi runtime vì không còn code nào import sử dụng) — cần AN chạy lại `generate_typescript_types` / codegen ở phase dọn code tiếp theo để đồng bộ type với schema thật.

## equipment_loans (phần còn lại của Lỗ hổng 3)
Không thay đổi — 0 dòng, hạ tầng sẵn sàng, chờ anh Thoan quyết định thời điểm pilot vận hành thực tế (Phương án B).

**→ Lỗ hổng 3: CLOSED 100%.**