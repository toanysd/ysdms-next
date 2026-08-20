# PE_AN_COORDINATION_LOG — Nhật Ký Phối Hợp Kỹ Thuật (PE ↔ AN)

---

## Trạng thái hiện tại (2026-08-20)
- **Phase R1 (Schema cleanup):** ĐÃ ĐÓNG
- **Phase R2 (Approval/Sample lifecycle, Atomic RPC + Session Guard):** ĐÃ ĐÓNG
- **Phase R3 (Product 360° View + Dashboard Lệnh SX):** ĐÃ ĐÓNG HOÀN TOÀN ✅
- **Phase R4 (Báo Giá Quotations + Giao Hàng Shipments + Tech Debt Cleanup):** ĐANG MỞ
  - Sprint R4-S1 (Phân hệ Báo Giá 見積書 + Engine Tính Giá + Xuất PDF): ✅ ĐÃ HOÀN THÀNH (chờ PE review)
  - Sprint R4-S2 (Phân hệ Giao Hàng 納品書): CHỜ KÍCH HOẠT
  - Sprint R4-S3 (Clean Tech Debt): CHỜ KÍCH HOẠT

## Chỉ thị đang mở
- **#014:** Triển khai Sprint R4-S1 Phân hệ Báo Giá (Đã hoàn tất, chờ PE review qua báo cáo `R4_S1_review.md`).

## Kiến trúc cốt lõi đã xác lập
- **ADR-001:** Unified SSOT `equipment` (8 loại thiết bị, quan hệ N:N `equipment_assignments` cho bộ SET gá lắp & dùng chung SHARED)
- **ADR-002:** Luồng sản xuất 4 cấp (`work_orders` $\rightarrow$ `jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs`)
- **Atomic RPC:** `fn_transition_product_lifecycle` + Session Guard Trigger (`app.bypass_lifecycle_trigger`)

## Bảng dữ liệu chính sẵn sàng cho R3
- `equipment` + `equipment_assignments` (Thiết bị, Khuôn, Dao, Gá lắp SET)
- `design_approval_logs` (Lịch sử các vòng duyệt thiết kế CAD)
- `sample_requests` (Yêu cầu làm mẫu & kết quả thử nghiệm)
- `product_lifecycle_logs` (Toàn bộ audit trail vòng đời sản phẩm)
- `plastic_receipt_roll` / `plastics` (Nguyên vật liệu cuộn nhựa)
- `orders` / `order_lines` / `shipments` (Đơn hàng & Giao hàng)
- `jobs` / `job_steps` / `work_logs` (Chỉ thị gia công & Nhật ký xưởng)

## Quy tắc phối hợp PE-AN
- **PE (Perplexity):** Nghiệp vụ / Kiến trúc / Review & Phê duyệt giải pháp
- **AN (Antigravity):** Triển khai code / Database Migration / Kiểm thử thực tế trên Supabase Live DB
- **Thoan (Product Owner):** Cầu nối điều phối, copy nguyên khung chỉ thị cho AN
- **Schema thực tế (SSOT):** `SCHEMA_REFERENCE.md` (cập nhật lần cuối 2026-08-20)
- **Coding rules:** `CLAUDE.md`, `AGENTS.md`, `AI_SYSTEM_RULES.md`

---
