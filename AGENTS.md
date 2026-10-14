# YSDMS NextGen — AI Agent & Developer Convention Guide (Consolidated SSOT)

> **Mọi AI Agent (AN, PE, Claude, Gemini…) và Developer BẮT BUỘC tuân thủ tài liệu này.**
> Đây là Nguồn Sự Thật Duy Nhất (Single Source of Truth — hợp nhất từ `AGENTS.md` và `.agents/AGENTS.md`, tối ưu hóa Token Economy $\le 12\text{ KB}$).

---

## 0. QUY TẮC 0 — Xác Nhận Luật, Đóng Gói Báo Cáo & Quy Tắc Git/GitHub (BẮT BUỘC)

1. **Khung Phản Hồi Bắt Buộc:**
   - **MỌI câu trả lời của AN** PHẢI bắt đầu và kết thúc bằng dòng `TRẢ LỜI TỪ AN` kèm nhãn thời gian `[YYYY-MM-DD HH:MM JST]`.
   - **Khối Báo Cáo 1-Click Copy:** Toàn bộ báo cáo/kế hoạch gửi PE phải đóng gói trọn vẹn trong **1 khối code block markdown duy nhất** đặt ở **DƯỚI CÙNG** câu trả lời.
2. **Quy Tắc Compact Bridge Payload ($\le 150$ dòng):**
   - Bản tin gửi qua `public.pe_an_messages` (Realtime Bridge) **tối đa 150 dòng**, chỉ gồm: Timestamp, Full Commit SHA (40 ký tự từ `git rev-parse HEAD`), kết quả truy vấn/kiểm thử thực tế, `git diff --stat`, và danh sách hạng mục bị từ chối/chờ duyệt. Tuyệt đối KHÔNG nối toàn văn nhiều file `.md` vào `content_md`.
3. **Quy Tắc Git & Cập Nhật GitHub (Đã Xử Lý Triệt Để Mâu Thuẫn Cũ):**
   - **Commit cục bộ (`git commit`):** Chỉ commit các file nằm trong phạm vi chỉ thị đã duyệt. BẮT BUỘC lấy full 40-char SHA trực tiếp từ lệnh `git rev-parse HEAD` (cấm gõ tay hoặc ước đoán). Nếu commit chưa đẩy lên remote, báo cáo BẮT BUỘC ghi rõ cờ `local-only / remote-not-verified`.
   - **Đẩy lên GitHub (`git push`):** Cả mã nguồn (`src/`, `supabase/`) lẫn tài liệu (`docs/`, `AGENTS.md`) **CHỈ thực hiện `git push` khi có yêu cầu/phê duyệt minh thị từ Minh Chủ THOAN hoặc nằm trong phạm vi chỉ thị thi công đã duyệt của PE/THOAN**. Sau khi push, phải đối chứng bằng `git ls-remote origin refs/heads/main`.
   - **Giới hạn file:** Cấm commit/push file nén (`.rar`, `.zip`, `.tar`), dữ liệu lớn, `node_modules/`, `.next/`, hoặc thông tin nhạy cảm (`service_role` key, token, mật khẩu).

---

## 1. QUY TẮC DỮ LIỆU & SCHEMA (RULE-DATA-01 & RULE-DATA-02 — BẮT BUỘC)

### 1.1. RULE-DATA-01: Không Fallback Dữ Liệu Kỹ Thuật
1. **Cutline $\neq$ Kích thước vật lý:** `cutline_length/width` (từ `design_revisions`) KHÔNG ĐƯỢC fallback từ `actual_length_mm/width` (khuôn vật lý) hoặc `cutter_length_mm/width` (thân dao cắt).
2. **Không parse text runtime:** Cấm dùng regex quét `product_description`, `cutter_name`, `display_name`, `tray_info` để trích xuất cutline, corner R, chamfer C. Nếu DB trống $\rightarrow$ hiển thị `"—"`.
3. **Sửa tại nguồn:** Thiếu dữ liệu kỹ thuật phải xử lý bằng migration/backfill DB (sau khi được duyệt), cấm tạo synthetic `revData` từ bảng `products`.
4. **Nguồn chuẩn (SSOT):**
   - Cutline / Corner R / Chamfer C: `design_revisions` (`getCutlineSpecs(designRevision)` từ `@/lib/utils/moldNaming`).
   - Kích thước thiết bị vật lý: `equipment.actual_length_mm / actual_width_mm / actual_height_mm`.

### 1.2. RULE-DATA-02: Schema Compliance — Không Bịa Dữ Liệu & Xác Minh DB Thực Tế
1. **Xác minh Schema từ DB thực tế:** Trước khi kết luận một bảng/cột tồn tại hay không hoặc trước khi viết truy vấn phức tạp, BẮT BUỘC đối chiếu `SCHEMA_REFERENCE.md` / `src/types/database.types.ts` VÀ kiểm chứng bằng truy vấn chỉ-đọc `information_schema.tables` / `information_schema.columns` trên PostgreSQL kèm `NOW()`.
2. **Không tự bịa tên bảng/cột/FK:** Nếu cột không tồn tại (VD: `work_logs` không có `equipment_id`), tuyệt đối không dùng trong query/filter.
3. **Single Source of Truth (SSOT) cho từng thực thể:**
   - Nhựa & kích thước thiết kế: **CHỈ từ `design_revisions`** (`plastic_type_designed`, `cutline_length/width`). Không lấy từ `products.primary_plastic_code`.
   - Thiết bị vật lý: **CHỈ từ `equipment`** (`MOLD`, `CUTTER_SEPARATE`, `CUTTER_INLINE`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG`) và `equipment_assignments` (`SET_MEMBER`, `SHARED`).
   - Các bảng `mold_masters`, `physical_molds`, `cutters`: **DEPRECATED** — cấm dùng trong code mới.
4. **Quan hệ & Cột chuẩn V3:**
   - `orders.company_id -> companies.company_id` (KHÔNG dùng `customer_id`).
   - `orders.order_id`, `products.product_id`, `order_lines.line_id` là các khóa chính UUID tương ứng.
   - `products.product_name` (tên KH), `products.product_name_internal` (tên nội bộ có gạch ngang), `products.product_code` (mã compact), `products.product_status` (KHÔNG dùng `status` hay `product_name_ja`).

---

## 2. QUY TRÌNH PHỐI HỢP AN–PE (RULE-PROC-01 & RULE-PROC-02 — BẮT BUỘC)

### 2.1. RULE-PROC-01: Chặn Báo Cáo Nghiệm Thu Sớm (Anti-Premature Completion)
1. **Phân định 3 Pha bắt buộc:**
   - **PHA 1 (PLANNING):** Trạng thái `[KẾ HOẠCH] Đệ trình Kế hoạch thi công (Chờ PE phê duyệt)`. Cấm dùng từ "Hoàn tất công việc".
   - **PHA 2 (EXECUTION):** Trạng thái `[THI CÔNG] AN đang sửa code & chạy kiểm thử (Chưa nghiệm thu)`. Cấm phát tín hiệu hoàn tất.
   - **PHA 3 (COMPLETION):** Chỉ xuất Báo cáo Nghiệm thu gửi PE khi thỏa mãn đủ các cổng chất lượng trong phạm vi Work Order: Code hoàn chỉnh, `npx tsc --noEmit` (0 errors), `node scripts/check_translations.mjs` (0 missing keys), Test/Audit PASS, Browser Verification (nếu sửa UI), và không còn background task đang chạy.

### 2.2. RULE-PROC-02: Chuyển Giao Tuần Tự & Chống Race Condition (Strict Half-Duplex)
1. **Gửi Supabase ở Tool Call Cuối Cùng:** Lệnh đẩy báo cáo lên `public.pe_an_messages` (hoặc qua `http://127.0.0.1:3856/api/report`) **CHỈ được gọi ở TOOL CALL CUỐI CÙNG** của lượt làm việc. Ngay sau đó, AN phải xuất câu trả lời và kết thúc turn.
2. **Dual-Shield Gatekeeper:** Userscript trên Perplexity mặc định ở chế độ `[x] Chỉ dán chatbox` (không auto-submit). Minh Chủ THOAN là người duyệt và bấm gửi cho PE.
3. **Thẩm Quyền Đóng Phiên:** AN không được tự ý đóng phiên hoặc đề nghị Minh Chủ chọn gói tiếp theo bỏ qua PE. Mọi báo cáo và đề xuất phải trình PE thẩm định trước để PE khuyến nghị lên Minh Chủ THOAN.

---

## 3. KIẾN TRÚC ROUTE, GIAO DIỆN & COMPONENT (UI/UX CONVENTIONS)

### 3.1. Routing & Sidebar
- Mọi route có sidebar nằm trực tiếp dưới `src/app/` (cùng cấp `/dashboard`, `/cases`, `/orders`, `/equipment`…), không tạo route group `(main)`.
- Khi thêm route mới (đã được duyệt), đăng ký vào `src/components/layout/Sidebar.tsx`.
- Quy ước đặt tên: `page.tsx` (Server ưu tiên hoặc Client), `actions.ts`, `types.ts`, và thư mục `_components/` (`XxxTable.tsx`, `XxxForm.tsx`, `XxxHeader.tsx`, `XxxTabs.tsx`).

### 3.2. Giải Phẫu Trang (Page Anatomy) & Nhất Quán Điều Hướng
1. **Trang Danh Sách (List Page):**
   - 3 lớp dọc (`display: flex; flex-direction: column; height: 100%; gap: 12px`): `PageHeader` (`flexShrink: 0`) $\rightarrow$ `FilterBar / TabBar` (`flexShrink: 0`) $\rightarrow$ `Content Area` (`flex: 1, overflow: auto` chứa `card-flat` + `data-table` + `<Pagination />`).
   - **Cột chính — Hyperlink:** Mã code hoặc tên chính BẮT BUỘC dùng `<Link href="/path/[id]">` (`color: var(--accent)`, `fontWeight: 700`, `fontFamily: monospace`, `fontSize: 13`).
   - **Tìm kiếm & Phân trang:** `PAGE_SIZE = 50` với `.range(from, to)`, debounce `300-500ms`, đồng bộ `?search=` trên URL (`useSearchParams`), và lưu lịch sử bằng `useSearchHistory` + `<SearchSuggestions>`.
   - **Sắp xếp bảng (Table Sorting):** Bắt buộc hỗ trợ sort trên header cột kèm icon (`ArrowUp`/`ArrowDown`/`ArrowUpDown`). Mặc định mọi bảng sắp xếp **TỪ MỚI ĐẾN CŨ (`DESC`)**, kể cả `first_shipment_date`.
2. **Trang Chi Tiết (Detail Page):**
   - Header compact (`padding: '12px 16px'`, icon `20px`, title `18px`), chiếm tối đa 25% chiều cao viewport.
   - Bắt buộc có 2 nút điều hướng cùng hàng bên trái Header: `← 戻る` (`router.back()`) và `↑ 一覧` (`<Link>` về trang danh sách cha), kèm thanh liên kết luồng công việc (`Workflow Links`).

### 3.3. CSS / Design System & Đa Ngôn Ngữ (i18n)
1. **CSS Tokens & Classes (`src/app/globals.css`):**
   - Dùng CSS variables (`var(--accent)`, `var(--text-primary)` `#0F172A`, `--tint-teal-bg`…) và classes (`card-flat`, `data-table`, `form-input`, `btn-primary`, `badge badge--success/warning/error/info/neutral`).
   - **Cấm dùng:** Tailwind color classes (`bg-blue-500`, `text-red-600`…), hardcode màu/font-size tùy tiện, hoặc tạo file `.module.css` riêng.
   - **Font size dữ liệu:** Giá trị chính `13px-14px Bold` (`monospace` cho số/mã/kích thước); nhãn `11px-12px Semi-bold` (`#475569`).
   - **Paper Style Spec Layout (`RULE-UI-10`):** Các grid thông số kỹ thuật read-only hiển thị phẳng trên trang giấy (không border/padding/background, label `10px` `#64748B` `minWidth: 78px`, value `13px Bold` `#0F172A`, gap `2px 12px`, không dùng dấu `:`).
2. **Đa Ngôn Ngữ (`next-intl`):**
   - Cấm hardcode song ngữ tĩnh (`JA / VI`) hoặc dùng class `.ja`/`.vi`.
   - Khai báo đầy đủ keys trong `messages/ja.json` và `messages/vi.json`, dùng `useTranslations('Namespace')`.
   - Sau khi sửa UI/i18n, bắt buộc chạy `node scripts/check_translations.mjs` (đạt 0 missing keys).

---

## 4. QUẢN LÝ KIẾN THỨC, SỔ CÁI, DATABASE TYPES & VÙNG CẤM ĐỌC

1. **Vùng Cấm Đọc (Token Economy — Do-Not-Read Zones):**
   - Không đọc `node_modules/`, `.next/`, `dist/`, `.git/`, `supabase/migrations/archived/`, `temp_ai/`, lockfiles (`package-lock.json`…), hoặc các bản nén backup (`.rar`, `.zip`).
   - Với file $>300$ dòng, chỉ đọc đúng đoạn cần thiết (`StartLine`/`EndLine`).
2. **Lưu Trữ Hồ Sơ & Sổ Bài Học:**
   - **Implementation Plan (Dual-Write):** Lưu bản hiện hành tại `<artifactDir>/implementation_plan.md` và bản sao có timestamp tại `<artifactDir>/implementation_plans/YYYY-MM-DD_HHMM_slug.md`.
   - **Sổ Bài Học (`docs/SO_BAI_HOC.md`):** Mọi sai sót quy trình, mâu thuẫn tài liệu hoặc lỗi cú pháp phải được ghi nhận theo bảng chuẩn 6 cột (`Ngày | Sự việc | Nguyên nhân gốc | Bằng chứng | Quy tắc đề xuất | Trạng thái`).
   - **Cập nhật Database Types an toàn:** Tuyệt đối không ghi đè trực tiếp `src/types/database.types.ts` khi chưa kiểm tra; phải xuất ra file tạm, chạy `diff` kiểm chứng đủ số bảng rồi mới cập nhật.
