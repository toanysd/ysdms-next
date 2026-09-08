# PE_AN_COORDINATION_LOG — Nhật Ký Phối Hợp Kỹ Thuật (PE ↔ AN)

---

## Trạng thái hiện tại (2026-09-08)
- **Phase R1 - R5:** ĐÃ ĐÓNG HOÀN TOÀN ✅
- **Milestone 14 (Shopfloor Tablet Cockpit & Equipment Lifecycle):** ĐÃ ĐÓNG HOÀN TOÀN ✅ (2026-09-07)
- **Milestone 15 (QC Intelligence Module & Monthly QC Report):** ĐÃ ĐÓNG HOÀN TOÀN ✅ (2026-09-07)
- **Milestone 16 (Equipment Location & Transfer Module - ADR-008):** ĐÃ ĐÓNG HOÀN TOÀN ✅ (2026-09-07)
- **Milestone 17 (Equipment QR Code & Camera AR Locator - Chỉ thị #025):** ĐÃ ĐÓNG HOÀN TOÀN ✅ (2026-09-07)
- **Milestone 18 (Mold Custody, Loans & Return Workflow + 3 PDF Engines - ADR-009 & Chỉ thị #026):** ĐÃ ĐÓNG HOÀN TOÀN ✅ (2026-09-08)
  - Sprint M18-S1 (Migration 097 + Workflow Engine): ✅ ĐÃ NGHIỆM THU (commit `8e49097`)
  - Sprint M18-S2 (Migration 098 + UI Dashboard/Detail + 3 PDF Engines): ✅ ĐÃ NGHIỆM THU (commit `bea1e2d`)

## Chỉ thị đã hoàn thành & đóng
- **#025:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Milestone 17 Sprint 2 Camera AR Equipment Locator).
- **#026:** ĐÃ ĐÓNG CHÍNH THỨC ✅ (Milestone 18 Sprint 1 & Sprint 2 Mold Custody, Loans & Return Workflow).

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

---

## Milestone 18 — Mold Custody, Loans & Return Workflow + 3 PDF Engines (金型借用・返却管理)
**Status: COMPLETED (S1 + S2)** | 2026-09-08

### Sprint 1: Database Migration 097 & Workflow Engine
- Chỉ thị: #026
- Migration 097 (`20260907000004_097_equipment_loans.sql`):
  - Bảng mới `equipment_loans` quản lý 3 loại phiếu và 6 trạng thái.
  - Function `fn_generate_equipment_loan_code(p_date)` và Trigger `trg_set_equipment_loan_code` tự động sinh mã dạng `LN-YYYYMMDD-001` per-day.
  - CHECK constraint `chk_scheduled_return_date` bắt buộc `scheduled_return_date IS NOT NULL`.
  - View SQL `v_equipment_loans_summary` tính toán `days_overdue` và cờ `is_overdue` realtime.
  - Atomic RPC Functions `fn_dispatch_equipment_loan` & `fn_complete_equipment_loan_return`.
- Commit S1: `8e49097`

### Sprint 2: Migration 098 + UI Dashboard/Detail + 3 PDF Engines (ADR-009 APPROVED)
- **ADR-009 (2026-09-08, APPROVED):** Xác lập bản chất pháp lý khuôn là tài sản cố định của khách hàng (客先固定資産); YSD là bên mượn/giữ hộ (借用者/預託先).
- **Migration 098 (`20260908000001_098_equipment_loans_semantic_and_photos.sql`):**
  - Chuẩn hóa dứt khoát 3 giá trị `loan_type`: `CUSTOMER_LOAN` (Khách → YSD), `RETURN_TO_CUSTOMER` (YSD → Khách), `OUTSOURCE_PROCESSING` (YSD → Vendor).
  - Bổ sung 2 trường ảnh kiểm toán: `photo_overall_url` (toàn cảnh kèm biển tên) và `photo_nameplate_url` (cận cảnh nameplate).
  - Bổ sung cờ `has_valid_loan_document` trong `v_equipment_loans_summary` phục vụ kiểm kê hàng năm (`貸与設備棚卸調査`).
  - Cập nhật 2 RPCs phân luồng keeper đúng chuẩn ADR-009.
- **PDF Engine (`MoldLoanPDFDocument.tsx` + `/api/equipment/loans/[id]/pdf`):**
  - Khổ A4 Portrait, font Noto Sans JP, format chuẩn Nhật Bản.
  - 3 Mẫu biểu: `金型借用書 (兼 預り証)`, `金型返却書`, `金型加工送付状`.
  - Banner định danh `撮影用看板` + 2 khung ảnh kiểm toán + Con dấu pháp nhân YSD (`株式会社 YSD`).
- **Giao diện Dashboard & Chi tiết (`/equipment/loans`):**
  - Page Anatomy 3 lớp: Header compact, 4 KPI cards (nổi bật `預託保管中 (客先型)` tính distinct khuôn khách giữ hộ), 6 Filter Tabs, Bảng dữ liệu Rule 7.1 sắp xếp mới nhất, hyperlink `loan_code`.
  - Modals: `CreateLoanModal` (tự động khóa chiều di chuyển From/To chuẩn ADR-009), `ApproveModal`, `RejectModal`, `DispatchModal`, `ReturnCheckInModal` (chọn tầng kệ kho cất giữ).
  - Trang chi tiết `/equipment/loans/[id]`: Paper Style Spec Layout (RULE-UI-10), xem ảnh kiểm toán, in/tải PDF trực tiếp.
  - Sidebar: Đăng ký menu `金型借用・返却` (icon `ArrowLeftRight`).
  - i18n: Bổ sung 100% keys dịch đối xứng trong `messages/ja.json` & `messages/vi.json`.
- Commit S2: `bea1e2d`

### Quality Gates Verified:
- TypeScript `npx tsc --noEmit`: ✅ 0 errors
- Translations `check_translations.mjs`: ✅ 0 missing keys
- Bilingual hardcode scan: ✅ Clean
- Live DB E2E Workflow Test: ✅ Passed 100% (3 flows)

### Next Milestone:
- **TBD** — Chờ PE ban hành định hướng và chỉ thị tiếp theo.



