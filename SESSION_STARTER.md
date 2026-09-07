═══════════════════════════════════════════════════════════════
CONTEXT KHỞI ĐẦU THẢO LUẬN — DỰ ÁN ysdms-next
(Bắt buộc paste vào đầu mỗi thảo luận mới với PE)
═══════════════════════════════════════════════════════════════

## 1. THÔNG TIN DỰ ÁN
- Repo GitHub  : https://github.com/toanysd/ysdms-next
- Supabase DB  : https://iirezrszalmecsslbruo.supabase.co
  Project ID   : iirezrszalmecsslbruo (ap-northeast-1, Tokyo)
- Tài liệu SSOT: SCHEMA_REFERENCE.md | PE_AN_COORDINATION_LOG.md
- Coding rules : CLAUDE.md | AGENTS.md | AI_SYSTEM_RULES.md
- Remote Head  : `1c6ad7e` (feat(qr): M17-S1 Equipment QR Code generation and print module)

## 2. VAI TRÒ
- PE (Perplexity) : Trưởng dự án / Kiến trúc / Review & Phê duyệt
- AN (Antigravity): Kỹ sư triển khai / DB Migration / Kiểm thử E2E
- Thoan           : Product Owner — Cầu nối điều phối PE ↔ AN

## 3. TRẠNG THÁI CÁC MILESTONES (Cập nhật 2026-09-07)
- Phase R1 - R5 : ✅ ĐÃ ĐÓNG HOÀN TOÀN (Schema, RPC, Lifecycle, Báo Giá, Giao Hàng, Công Nợ, Executive Dashboard)
- Milestone 15  : ✅ ĐÃ NGHIỆM THU (Quality QC, Daily Inspection Logs, NG Trend Analysis, Monthly QC PDF — Migrations 093, 094, 095)
- Milestone 16  : ✅ ĐÃ NGHIỆM THU (Location Browser & Transfer Module — ADR-008, 12 Zones, 90 Kệ, 380 Tầng, 4,761 Thiết bị backfill — Migration 096)
- Milestone 17 — Equipment QR Code & AR Locator:
  - Sprint M17-S1: ✅ ĐÃ NGHIỆM THU CHÍNH THỨC (commit `1c6ad7e` — Engine QR `qrcode`, 3 kích thước 30/40/50mm, In tem lẻ, In A4 hàng loạt, Tích hợp Header, LocationTab, VisualShelfView)
  - Sprint M17-S2: ✅ ĐÃ HOÀN THÀNH TRIỂN KHAI (Chỉ thị #025 — Camera AR Equipment Locator dùng `jsQR`, Multi-region 6 vùng, Visual Locator AR Overlay, Tích hợp Scan-to-Move trong `LocationMoveModal`, Sidebar link `/equipment/scan`)

## 4. KIẾN TRÚC CỐT LÕI (BẮT BUỘC TUÂN THỦ)
- **ADR-001:** Unified SSOT `equipment` (8 loại thiết bị, quan hệ N:N `equipment_assignments` cho bộ SET gá lắp & dùng chung SHARED).
- **ADR-002:** Luồng sản xuất 4 cấp (`work_orders` → `jobs` → `job_steps` → `work_logs`).
- **ADR-008:** Rack Code Convention `{ZONE}-{NN}` / Layer `{RACK_CODE}-L{N}` (12 zones, 380 layers).
- **M17 Standard:** Prefix `{M, C, P, W, B, S, F}` cho từng loại thiết bị. Payload: Short `{TypePrefix}-{equipment_code}` (Tem xưởng) và Web URL (Tài liệu). Thư viện S2 là `jsQR` (không dùng `html5-qrcode`).

## 5. QUY TẮC PHỐI HỢP BẮT BUỘC
4a. QUY TẮC BẮT BUỘC CỦA AN
  - Mọi câu trả lời của AN BẮT BUỘC bắt đầu và kết thúc bằng: `TRẢ LỜI TỪ AN`.
  - Mọi báo cáo/kế hoạch gửi PE BẮT BUỘC đóng gói trọn vẹn trong 1 code block markdown duy nhất ở cuối câu trả lời (1-click copy).

4b. QUY TẮC XÁC MINH DB & REMOTE GIT
  - PE luôn xác minh trực tiếp Supabase Live DB (project `iirezrszalmecsslbruo`) và commit trên GitHub remote sau mỗi deliverable.

4c. QUY TẮC GIỚI HẠN THẢO LUẬN (Quy tắc 4e)
  - Khi thảo luận đạt ~20 lượt, PE/AN tự động nhắc nhở và tạo ngữ cảnh chuyển tiếp chuẩn để mở thảo luận mới.

═══════════════════════════════════════════════════════════════

## 6. NHIỆM VỤ TIẾP THEO CHO THẢO LUẬN MỚI
1. Mở đầu bằng nội dung tài liệu này để nạp đầy đủ context.
2. AN trình bày bản Kế hoạch Triển khai (Implementation Plan) cho **Milestone 17 Sprint 2: Camera AR Equipment Locator** theo **Chỉ thị #025**.
3. PE phê duyệt kế hoạch để AN tiến hành code, verify Quality Gates (TypeScript 0 error, i18n clean), commit và push main.

