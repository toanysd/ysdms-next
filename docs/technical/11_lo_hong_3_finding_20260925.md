# Bổ sung Lỗ hổng 3 — Phát hiện 2026-09-25 (PE)

## Tóm tắt
Tài liệu `10_mold_department_business_process_and_data_audit.md` và `SESSION_HANDOFF.md` trước đó kết luận `mold_location_history` (0 dòng) là "bảng chết hoàn toàn, an toàn DROP". Khi PE tự kiểm chứng qua `search_code` trên GitHub trước khi DROP, phát hiện đây **KHÔNG hoàn toàn đúng**.

## Phát hiện
- File `src/app/production/molds/actions.ts` có 3 hàm `export async function`: `checkInMold`, `checkOutMold`, `relocateMold`. Cả 3 đều còn code `supabase.from('mold_location_history').insert({...})` (hoặc tương đương ghi log vị trí).
- Đã `search_code` toàn repo cho tên 3 hàm này ở nơi khác — **không có file nào import/gọi** `checkInMold`, `checkOutMold`, `relocateMold` ngoài chính file định nghĩa. Tức là hàm hiện đang **không được UI nào gọi tới** (dead code về mặt runtime hiện tại), nên KHÔNG có rủi ro crash người dùng ngay lập tức nếu DROP bảng.
- Tuy nhiên, kế hoạch refactor đã có sẵn (chưa thực thi) trong `temp_ai/R4_S3_review.md`, mục 4: "Chuyển `checkInMold`, `checkOutMold`, `relocateMold` sang cập nhật trực tiếp `equipment.current_rack_layer_id` và `equipment.usage_status`", đồng thời cập nhật `revalidatePath` về `/equipment/molds`. Kế hoạch này xác nhận AN đã biết vấn đề nhưng chưa merge.

## Hành động đã thực hiện (2026-09-25)
- Đã `apply_migration` trên Supabase: `COMMENT ON TABLE mold_location_history IS 'DEPRECATED...'` — đánh dấu deprecated, **CHƯA DROP TABLE**.

## Việc cần AN thực hiện tiếp (điều kiện để PE DROP bảng)
1. Áp dụng refactor theo `temp_ai/R4_S3_review.md` mục 3–5: chuyển `checkInMold`/`checkOutMold`/`relocateMold` trong `actions.ts` sang ghi trực tiếp vào `equipment.current_rack_layer_id`/`usage_status`, bỏ hoàn toàn insert vào `mold_location_history`.
2. Đồng thời xử lý mục 5 của review: loại bỏ dual-write legacy vào `physical_molds`/`cutters` trong `CheckInOutModule.tsx` nếu còn.
3. Commit + báo SHA cho PE.

## Điều kiện PE sẽ DROP TABLE
Sau khi PE tự `search_code` xác minh **0 kết quả** cho `mold_location_history` trong thư mục `src/`, PE sẽ chạy `DROP TABLE mold_location_history;` qua `apply_migration` và cập nhật hồ sơ CLOSED.

## equipment_loans (phần còn lại của Lỗ hổng 3)
- 0 dòng, schema/UI/PDF (M18/ADR-009) đã sẵn sàng 100%. Không cần thao tác DB. Chờ quyết định của anh Thoan về việc pilot vận hành thực tế tại xưởng (Phương án B trong tài liệu chuyển giao).