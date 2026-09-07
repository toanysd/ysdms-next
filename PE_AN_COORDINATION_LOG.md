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
  - Sprint R5-S2 (E2E Testing & Khép Kín Vòng Đời Order-to-Cash trên Live DB): ✅ ĐÃ NGHIỆM THU CHÍNH THỨC (2026-08-20)
  - Sprint R5-S3 (Executive Dashboard 2 Tầng: Sản Xuất Live DB & Thương Mại/Công Nợ): ✅ ĐÃ NGHIỆM THU CHÍNH THỨC (2026-08-20)

## Chỉ thị đã hoàn thành & đóng
- **#018:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Sprint R5-S1 nghiệm thu thành công trên Live DB).
- **#019:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Sprint R5-S2 E2E 6/6 test cases pass 100%).
- **#020:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Đã xóa sạch 100% test data `TEST_E2E_%` trên Live DB, verify COUNT = 0).
- **#021:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Executive Dashboard R5-S3 hoàn thành Phần A & Phần B, kèm Empty State & Demo Mode).
- **#022:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Sửa triệt để lỗi giới hạn 1.000 dòng bằng Server SQL Views `v_equipment_type_summary`, `v_job_status_summary`, `v_dashboard_executive_kpis`).
- **#023:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Đồng bộ SESSION_STARTER.md chuẩn bị chuyển giao sang thread thảo luận mới theo Quy tắc 4e).

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

## Milestone 16 — Equipment Location & Transfer Module
**Status: COMPLETED** | 2026-09-07

### Deliverables
- Migration 096: ADR-008 Rack Code Convention (90 racks → 12 zones, 380 layers, 4,761 equipment backfilled)
- S1 commit `7197ce1`: Location Browser `/equipment/locations` + Visual Shelf `/equipment/locations/[rackId]`
- S2 commit `9eac225`: Transfer Module (LocationMoveModal, LocationTab, TransferTab, VisualShelfView integration)

### Architecture decisions recorded
- ADR-008 (2026-09-07, APPROVED): Rack Code Convention `{ZONE}-{NN}` / Layer `{RACK_CODE}-L{N}`
  - 12 zones: MR, 2F, CS, GT, OF, MD, PS, TC, MT, M8, TW, SC, SP
  - Backward-compatible: `rack_code` legacy (①②...) preserved in DB

### Schema changes (Migration 096)
- `racks`: +`rack_code_new` TEXT, +`zone_code` TEXT
- `rack_layers`: +`layer_code` TEXT
- `equipment`: backfilled `current_rack_layer_id` (4,761 rows)
- 4 indexes created

### Next milestone candidate
- M17: QR Code scan integration (gắn QR lên khuôn → scan di chuyển tầng kệ)
- M17 alt: Transfer approval workflow (phê duyệt trước khi 金型返却)

---

## Milestone 17 — Equipment QR Code & AR Locator
**Status: COMPLETED (S1 + S2)** | 2026-09-07

### Sprint 1: QR Generation & Single/Mass Print
- Zero DB migration (Frontend 100%).
- Type Prefix Standard: M=MOLD, C=CUTTER, P=PLUG, W=WATER_BASE, B=PRESSURE_BASE, S=STACKING, F=FRAME.
- Dual Payload Modes: Short `{TypePrefix}-{equipment_code}` (Tem xưởng) & Web URL `{BASE_URL}/equipment/molds/{equipment_id}` (Tài liệu).
- `QRCodeDisplay.tsx`: Local canvas generator (`qrcode`), crisp rendering, 30/40/50mm responsive sizes, standardized 4-line label anatomy.
- `QRCodeModal.tsx`: Single tag modal with 3 action buttons (🖨️ In lẻ qua popup độc lập, ⬇️ Tải ảnh PNG, 📋 Sao chép clipboard).
- `QRBatchPrintSheet.tsx`: Multi-selection A4 batch print sheet with dynamic CSS grid, automatic pagination (`page-break-inside: avoid`), toggle columns (code, name, location).
- Header & Tab integrations:
  - `MoldDetailHeader.tsx`: Nút `QRコード` mở modal trực tiếp.
  - `LocationTab.tsx`: Thumbnail QR 64×64 bấm để phóng to / in.
  - `VisualShelfView.tsx`: Nút `一括印刷 (全段)` trên Rack Header, nút `In tầng này` trên mỗi Layer Bar, nút `QR` trên từng thiết bị.
- Scanner Stub: `/equipment/scan/page.tsx` (Route placeholder sẵn sàng cho M17-S2 Camera AR scanner).

### Sprint 2: Camera AR Equipment Locator & Scan-to-Move
- Zero DB migration (Frontend 100% + Server Action).
- Library: `jsqr` pure JavaScript/Canvas QR decoder (thay thế hoàn toàn `html5-qrcode`).
- `CameraARScanner.tsx`: Engine camera với throttled loop (~70ms interval), ma trận 6 vùng HUD Grid trực quan, Web Audio API Synthesizer (880Hz/1760Hz beep), điều khiển đèn Flash/Torch và đổi camera trước/sau.
- `ScannerAROverlay.tsx`: Giao diện HUD 6 vùng, Target Locate Mode (`?find=CODE` hoặc ô tìm kiếm với hiệu ứng Emerald Glow & `MATCH FOUND`), AR Drawer chi tiết thiết bị / tầng kệ kèm nút hành động.
- `MiniLayerQRScannerModal.tsx`: Modal quét QR mini tối ưu hóa thao tác gán tầng kệ nhanh.
- `LocationMoveModal.tsx`: Tích hợp Scan-to-Move tự động nhận diện và gán tức thì Zone, Rack, Layer khi quét tem tầng kệ.
- `actions.ts`: Bổ sung Server Action `resolveScannedQRCode` tuân thủ nghiêm ngặt thứ tự ưu tiên: UUID -> Layer Code (`^[A-Z0-9]{2}-\d{2}-L\d+$`) -> Short Code (`^[MCPWBSF]-[A-Z0-9_\-]+$`) -> Fallback Unknown.
- Navigation: Thêm link `ARスキャナー / Quét QR AR` (`/equipment/scan`) vào Sidebar nhóm Thiết bị (`sections.equipment`).

### Quality Gates Verified:
- TypeScript `npx tsc --noEmit`: ✅ 0 errors
- Translations `check_translations.mjs`: ✅ 0 missing keys
- Bilingual hardcode scan: ✅ Clean


