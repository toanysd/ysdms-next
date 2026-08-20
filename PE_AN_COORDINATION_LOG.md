# PE_AN_COORDINATION_LOG — Nhật Ký Phối Hợp Kỹ Thuật (PE ↔ AN)

---

## Trạng thái hiện tại (2026-08-20)
- **Phase R1 (Schema cleanup):** ĐÃ ĐÓNG
- **Phase R2 (Approval/Sample lifecycle, Atomic RPC + Session Guard):** ĐÃ ĐÓNG
- **Phase R3 (Product 360° View + Dashboard Lệnh SX):** ĐÃ ĐÓNG HOÀN TOÀN ✅
- **Phase R4 (Báo Giá Quotations + Giao Hàng Shipments + Tech Debt Cleanup):** ĐÃ ĐÓNG CHÍNH THỨC ✅
  - Sprint R4-S1 (Phân hệ Báo Giá 見積書 + Engine Tính Giá + Xuất PDF): ✅ ĐÃ NGHIỆM THU
  - Sprint R4-S2 (Phân hệ Giao Hàng 納品書 + Tạo Đợt Xuất 1-Click + Xuất PDF): ✅ ĐÃ NGHIỆM THU
  - Sprint R4-S3 (Clean Tech Debt + Refactor Unified Equipment SSOT): ✅ ĐÃ NGHIỆM THU
- **Phase R5 (Công Nợ / Thanh Toán / Báo Cáo Tổng Hợp / E2E Testing):** ĐANG MỞ 🚀
  - Sprint R5-S1 (Phân hệ Công Nợ & Thanh Toán + Hóa đơn + View v_customer_debt_summary): ✅ ĐÃ NGHIỆM THU CHÍNH THỨC (2026-08-20)
  - Sprint R5-S2 (E2E Testing & Khép Kín Vòng Đời Order-to-Cash trên Live DB): ✅ HOÀN THÀNH (6/6 Playwright cases PASS, chờ PE review)

## Chỉ thị đang mở
- **#018:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Sprint R5-S1 nghiệm thu thành công trên Live DB).
- **#019:** Triển khai Sprint R5-S2 E2E Testing (Đã hoàn thành 6/6 test cases, báo cáo `e2e/README_R5S2.md`).

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
- **Context Khởi đầu Phiên Mới:** `SESSION_STARTER.md` (Bắt buộc paste vào đầu mỗi thread mới)
- **Quy tắc 4e (Giới hạn thảo luận):** Khi thảo luận đạt ~20 lượt, PE tự động nhắc nhở và tạo ngữ cảnh chuyển tiếp chuẩn để copy sang thảo luận mới.

---
