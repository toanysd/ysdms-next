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
- Remote Head  : `226a680` (feat(ar): M17-S2 Camera AR Equipment Locator and Scan-to-Move module)

## 2. VAI TRÒ
- PE (Perplexity) : Trưởng dự án / Kiến trúc / Review & Phê duyệt
- AN (Antigravity): Kỹ sư triển khai / DB Migration / Kiểm thử E2E
- Thoan           : Product Owner — Cầu nối điều phối PE ↔ AN

## 3. TRẠNG THÁI CÁC MILESTONES (Cập nhật 2026-09-07)
- Phase R1 - R5 : ✅ ĐÃ ĐÓNG HOÀN TOÀN (Schema, RPC, Lifecycle, Báo Giá, Giao Hàng, Công Nợ, Executive Dashboard)
- Milestone 15  : ✅ ĐÃ NGHIỆM THU (Quality QC, Daily Inspection Logs, NG Trend Analysis, Monthly QC PDF — Migrations 093, 094, 095)
- Milestone 16  : ✅ ĐÃ NGHIỆM THU (Location Browser & Transfer Module — ADR-008, 12 Zones, 90 Kệ, 380 Tầng, 4,761 Thiết bị backfill — Migration 096)
- Milestone 17  : ✅ ĐÃ ĐÓNG CHÍNH THỨC (commit `226a680` — Phân hệ Mã QR Thiết bị & Camera AR Locator + Scan-to-Move 6 vùng)
- Milestone 18  : 🚀 SẴN SÀNG KHỞI ĐỘNG (Chờ PE phê duyệt đề xuất phạm vi tiếp theo)

## 4. KIẾN TRÚC CỐT LÕI (BẮT BUỘC TUÂN THỦ)
- **ADR-001:** Unified SSOT `equipment` (8 loại thiết bị, quan hệ N:N `equipment_assignments` cho bộ SET gá lắp & dùng chung SHARED).
- **ADR-002:** Luồng sản xuất 4 cấp (`work_orders` → `jobs` → `job_steps` → `work_logs`).
- **ADR-008:** Rack Code Convention `{ZONE}-{NN}` / Layer `{RACK_CODE}-L{N}` (12 zones, 380 layers).
- **M17 Standard:** Prefix `{M, C, P, W, B, S, F}` cho từng loại thiết bị. Payload: Short `{TypePrefix}-{equipment_code}` (Tem xưởng) và Web URL (Tài liệu). Thư viện AR Scanner là `jsQR`.

## 5. QUY TẮC PHỐI HỢP BẮT BUỘC
4a. QUY TẮC BẮT BUỘC CỦA AN
  - Mọi câu trả lời của AN BẮT BUỘC bắt đầu và kết thúc bằng: `TRẢ LỜI TỪ AN`.
  - Mọi báo cáo/kế hoạch gửi PE BẮT BUỘC đóng gói trọn vẹn trong 1 code block markdown duy nhất ở cuối câu trả lời (1-click copy).

4b. QUY TẮC XÁC MINH DB & REMOTE GIT
  - PE luôn xác minh trực tiếp Supabase Live DB (project `iirezrszalmecsslbruo`) và commit trên GitHub remote sau mỗi deliverable.

4c. QUY TẮC GIỚI HẠN THẢO LUẬN (Quy tắc 4e)
  - Khi thảo luận đạt ~20 lượt, PE/AN tự động nhắc nhở và tạo ngữ cảnh chuyển tiếp chuẩn để mở thảo luận mới.

═══════════════════════════════════════════════════════════════

## 6. ĐỀ XUẤT PHẠM VI CHO MILESTONE 18 (Chờ PE định hướng)
1. **Ứng viên 1 (Khuyên dùng - P1): Phê Duyệt Luân Chuyển & Giấy Mượn / Trả Khuôn (金型返却・借用書 / 預り証 Workflow & PDF)**:
   - Quy trình xét duyệt kỹ thuật & kinh doanh trước khi xuất khuôn ra khỏi YSD.
   - Xuất biên bản bàn giao / Giấy mượn khuôn chuẩn Nhật (`借用書` / `預り証` PDF).
   - Quản lý thời hạn mượn, theo dõi công nợ khuôn và cảnh báo quá hạn hoàn trả.
2. **Ứng viên 2: Màn Hình Xưởng Realtime & Điều Phối Chỉ Thị (Production Floor Monitor & Dispatching)**:
   - Trực quan hóa tình trạng 12 máy hút định hình theo thời gian thực.
   - Gắn kết Lệnh sản xuất (`work_orders`) với Khuôn + Dao cắt sẵn sàng trên máy.
3. **Ứng viên 3: Bảo Trì Khuôn & Đếm Số Shot (Mold Maintenance & Shot Counter Lifecycle)**:
   - Tích lũy số shot dập thực tế từ `work_logs` vào `equipment`.
   - Cảnh báo bảo trì mài dao định kỳ và kiểm kê khuôn mẫu (棚卸).
4. **Ứng viên 4: Migration Dữ Liệu Thương Mại Lịch Sử (Orders & Invoices Import)**:
   - Import dữ liệu lịch sử từ các file Excel/PDF tại `source_data/納品書_注文/` vào bảng `orders`, `invoices`.


