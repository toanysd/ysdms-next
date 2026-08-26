# Phân Tích & Nhận Định — YSDMS-Next V3 Description/Instructions

> Ngày phân tích: 2026-08-21  
> Phân tích bởi: AN (Antigravity) — dựa trên khảo sát thực tế 10+ file quy tắc trong repo

---

## 1. ĐÁNH GIÁ TỔNG QUAN

Nội dung v3 do PE soạn **đúng về hướng, chặt chẽ về vai trò**, nhưng **thiếu ~40% quy tắc kỹ thuật** mà AN và PE đã xây dựng suốt 63 phase. Nếu dùng v3 y nguyên cho space mới, agent sẽ **không biết** nhiều convention đã chốt → gây regression.

### Điểm mạnh ✅
| # | Điểm | Nhận xét |
|---|------|----------|
| 1 | Phân vai PE/AN/Thoan rõ ràng | Khớp 100% với `PE_AN_COORDINATION_LOG.md` |
| 2 | Source of Truth hierarchy | Đúng: SCHEMA_REFERENCE.md > README.md |
| 3 | Cảnh báo README.md lỗi thời | Rất cần thiết — đã từng gây lỗi nhiều lần |
| 4 | ADR-001 + ADR-002 được nêu rõ | Kiến trúc cốt lõi chính xác |
| 5 | Product-Centric model | Đúng sự thật dự án |
| 6 | Luồng nghiệp vụ 6 bước | Đúng thứ tự, đúng logic |
| 7 | RULE-DATA & RULE-UI tóm tắt | Bao quát đúng tinh thần |

---

## 2. SAI SỰ THẬT CẦN SỬA (Critical Corrections)

> [!CAUTION]
> Các lỗi dưới đây nếu không sửa sẽ khiến agent mới tra cứu sai nguồn hoặc viết code lỗi.

### 2.1. `CLAUDE.md` dòng 25 — Sai tên cột

```diff
- 2. `products.product_name_ja` (KHÔNG phải `product_name`)
+ 2. `products.product_name` (KHÔNG phải `product_name_ja` — đã đổi tên trong schema V3)
```

**File thực tế:** [CLAUDE.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/CLAUDE.md#L25) ghi `product_name_ja` nhưng **schema thực tế** (trong SCHEMA_REFERENCE.md và database.types.ts) đã đổi thành `product_name`. Chính `.agents/AGENTS.md` dòng "SAI thường gặp" cũng ghi rõ: `products(product_name_ja) → Đúng: products(product_name)`.

> [!IMPORTANT]
> **Khuyến nghị:** Cập nhật `CLAUDE.md` dòng 25 cho khớp schema hiện tại.

### 2.2. `BUSINESS_PROCESS_MASTER.md` — Tên file sai

Instructions v3 ghi:
> *"Business process gốc: `BUSINESS_PROCESS_MASTER.md` (nằm trong `docs/` hoặc `ThaoLuan/`)"*

**Thực tế:** Không có file nào tên chính xác `BUSINESS_PROCESS_MASTER.md` trong `docs/`. Các file thực tế:

| Đường dẫn thật | Nội dung |
|----------------|----------|
| `ThaoLuan/20260715_Tong_Hop_Tu_Claude_BUSINESS_PROCESS_MASTER.md` | Bản tổng hợp nghiệp vụ từ Claude |
| `ThaoLuan/20260715_claude_BUSINESS_PROCESS_MASTER.md` | Bản gốc Claude |
| `docs/02_BUSINESS_PROCESS.md` | Quy trình nghiệp vụ chính thức |
| `docs/02_BUSINESS_PROCESS_CATALOG.md` | Danh mục 70+ quy trình |
| `docs/technical/01_business_process.md` | Tài liệu kỹ thuật quy trình |

> [!IMPORTANT]
> **Khuyến nghị:** Sửa thành `docs/02_BUSINESS_PROCESS_CATALOG.md` (danh mục 70+ quy trình) + `docs/technical/01_business_process.md` (chi tiết kỹ thuật).

### 2.3. Luồng nghiệp vụ bước 4 — Dùng bảng deprecated

Instructions v3 ghi:
> *"tạo `physical_molds`/`equipment`"*

**Thực tế:** `physical_molds` đã DEPRECATED (ADR-001). Chỉ dùng `equipment`.

```diff
- tạo `physical_molds`/`equipment` (khuôn/dao cắt/gá lắp) liên kết mold_revision_id
+ tạo `equipment` (khuôn/dao cắt/gá lắp — 8 equipment_type) liên kết design_revision_id
```

### 2.4. ADR-003 bị thiếu

Description v3 chỉ nhắc ADR-001 và ADR-002, nhưng **ADR-003 đã được APPROVED** (2026-08-18): "Tách Job theo Equipment Type & Sửa Filter Lịch Sản Xuất". Đây là quyết định kiến trúc mới nhất, ảnh hưởng trực tiếp đến cách tạo/hiển thị Jobs.

---

## 3. THIẾU QUY TẮC QUAN TRỌNG (Missing Rules — Cần Bổ Sung)

> [!WARNING]
> Những quy tắc dưới đây đã được xây dựng qua nhiều phase, nếu thiếu sẽ khiến agent mới phạm lại lỗi cũ.

### Nhóm A — Quy tắc Dữ liệu (Đã mất rất nhiều thời gian debug)

| # | Quy tắc | File nguồn | Tóm tắt |
|---|---------|------------|---------|
| A1 | **RULE-DATA-01: Không Fallback Dữ Liệu Kỹ Thuật** | `AGENTS.md` §5.5 | Cutline ≠ kích thước vật lý. KHÔNG parse text runtime. KHÔNG tạo synthetic revData |
| A2 | **RULE-DATA-02: Schema Compliance** | `AGENTS.md` §5.6 | KHÔNG bịa tên cột/bảng. `work_logs` KHÔNG CÓ `equipment_id`. SSOT cho nhựa = `design_revisions.plastic_type_designed` |
| A3 | **Fuzzy Code Search** | `AI_SYSTEM_RULES.md` RULE-DATA-4 | Mã rút gọn bỏ gạch nối/gạch dưới: `jae312` → `%jae%312%` |
| A4 | **RULE-BIZ-CUTTER** | `AI_SYSTEM_RULES.md` | Mặc định dao cắt = `CUTTER_INLINE` (別抜き=無). Chỉ khi 別抜き=有 → `CUTTER_SEPARATE` |
| A5 | **RULE-BIZ-NAME: 5 trường tên sản phẩm** | `AI_SYSTEM_RULES.md` | `product_description`, `product_name`, `product_name_internal`, `product_code`, `customer_product_name` |

### Nhóm B — Quy tắc UI/UX (Đã thống nhất qua 63 phase)

| # | Quy tắc | File nguồn | Tóm tắt |
|---|---------|------------|---------|
| B1 | **Page Anatomy 3 lớp** | `AGENTS.md` §2 | PageHeader → FilterBar/TabBar → Content Area (flex column, 100% height) |
| B2 | **Detail Page Pattern** | `AGENTS.md` §3 | BackBar → Tab Navigation → Tab Content |
| B3 | **Paper Style Spec Layout (RULE-UI-10)** | `AI_SYSTEM_RULES.md` | Không padding/border/background cho grid thông số kỹ thuật read-only |
| B4 | **Table Sorting mặc định DESC** | `AGENTS.md` §7.1 | Mới nhất ở trên. `first_shipment_date` cũng DESC |
| B5 | **Cột chính = Hyperlink** | `.agents/AGENTS.md` §Bảng dữ liệu | Mã code bắt buộc dùng `<Link>`, không dùng `<span>` |
| B6 | **Search History** | `.agents/AGENTS.md` | Bắt buộc dùng `useSearchHistory(key)` + `<SearchSuggestions>` |
| B7 | **Back/Up Pattern** | `.agents/AGENTS.md` §Điều hướng | `← 戻る` (router.back) + `↑ 一覧` (Link cố định) |
| B8 | **URL Search Sync** | `.agents/AGENTS.md` | `?search=` từ URL sync với local state |
| B9 | **Detail Header Compact** | `.agents/AGENTS.md` | Padding 12px 16px, icon 20px, title 18px. Header ≤ 25% viewport |

### Nhóm C — Quy tắc Hệ thống & Quy trình

| # | Quy tắc | File nguồn | Tóm tắt |
|---|---------|------------|---------|
| C1 | **i18n (next-intl)** | `AGENTS.md` §i18n | KHÔNG hardcode song ngữ. Dùng `useTranslations()`. Chạy `check_translations.mjs` |
| C2 | **Sidebar Registration** | `AGENTS.md` §8 | Route mới PHẢI thêm vào `NAV_SECTIONS` trong `Sidebar.tsx` |
| C3 | **File Naming Convention** | `AGENTS.md` §4 | `_components/`, `actions.ts`, `types.ts` |
| C4 | **Implementation Plan Dual-Write** | `.agents/AGENTS.md` | Bản active + bản lưu trữ `YYYY-MM-DD_HHMM_xxx.md` |
| C5 | **Database Types Safety** | `.agents/AGENTS.md` | Generate ra file tạm → diff → mới ghi đè |
| C6 | **ADR workflow** | `.agents/AGENTS.md` §ADR | Mỗi quyết định kiến trúc → file ADR riêng → cập nhật README.md |
| C7 | **Model Switching Protocol** | `.agents/AGENTS.md` §Chuyển model | Đọc sổ cái → đọc transcript → xác nhận context → cập nhật sổ cái |
| C8 | **TRẢ LỜI TỪ AN** | `.agents/AGENTS.md` §Rule 0 | Mọi response bắt đầu và kết thúc bằng marker này |
| C9 | **Không tự Git push** | `.agents/AGENTS.md` §Rule 0 | Chỉ push khi user yêu cầu. Không push file lớn/nén |

---

## 4. KHUYẾN NGHỊ CỤ THỂ CHO ANTIGRAVITY

### 4A. Cấu trúc Rules tối ưu cho Antigravity

Antigravity đọc rules từ 2 nguồn:
1. **Workspace rules** (`.agents/AGENTS.md` — tự động load khi mở workspace)
2. **Root-level rules** (`AGENTS.md` — Antigravity cũng tự động đọc nếu ở root)

> [!TIP]
> Không cần tạo thêm file rules riêng cho Antigravity. Chỉ cần **cập nhật 2 file AGENTS.md hiện có** là đủ. CLAUDE.md hiện chỉ 38 dòng và là subset nhỏ — nên merge nội dung vào `.agents/AGENTS.md`.

### 4B. Những gì NÊN thêm vào v3 Instructions (cho PE space)

Nội dung v3 của PE dùng cho **Perplexity space** — PE không cần biết chi tiết UI patterns. Nhưng PE CẦN biết:

1. **ADR-003** — để không đề xuất giải pháp trái ngược quyết định đã có
2. **Tên file business process chính xác** — để tra cứu đúng
3. **5 trường tên sản phẩm (RULE-BIZ-NAME)** — PE review naming convention
4. **RULE-BIZ-CUTTER** — PE review phân loại thiết bị
5. **Schema V3 corrections** (`product_name` không phải `product_name_ja`)
6. **Bảng `physical_molds`, `cutters` DEPRECATED** — PE không đề xuất dùng chúng

### 4C. Những gì NÊN cập nhật trong AGENTS.md repo (cho AN)

| Hành động | Chi tiết |
|-----------|---------|
| **Sửa CLAUDE.md dòng 25** | `product_name_ja` → `product_name` |
| **Cập nhật `📁 Cấu trúc src/app`** | Hiện tại đã có thêm nhiều route mới (63 phase) mà cấu trúc chưa phản ánh |
| **Cập nhật Session Handoff** | Phiên 63 là bản cuối. Nên append tóm tắt trạng thái Phase R5 |
| **Kiểm tra Open Questions §9** | Q1, Q2 có thể đã được trả lời trong quá trình phát triển |

### 4D. File nên LOẠI BỎ hoặc MERGE

| File | Khuyến nghị | Lý do |
|------|-------------|-------|
| `CLAUDE.md` (38 dòng) | **MERGE vào `.agents/AGENTS.md`** | Nội dung trùng lặp, có 1 dòng sai (`product_name_ja`). CLAUDE.md chỉ hữu ích nếu dùng Claude Code CLI — Antigravity đọc AGENTS.md |
| `AI_SYSTEM_RULES.md` (241 dòng) | **GIỮ NGUYÊN** | Có nhiều rule chi tiết (RULE-UI-1→10, RULE-BIZ) mà AGENTS.md chỉ tóm tắt. Đây là reference doc |
| `PROJECT.md` | **Nên cập nhật** | Kiểm tra xem có lỗi thời không |

---

## 5. BẢN ĐỀ XUẤT BỔ SUNG CHO V3 INSTRUCTIONS

Đề xuất thêm 3 block vào v3 Instructions của PE:

### Block bổ sung 1: ADR đã xác lập (KHÔNG đảo ngược)

```text
## KIẾN TRÚC ĐÃ CHỐT (ADR — Architecture Decision Records)
- ADR-001 (2026-08-05, APPROVED): Unified Equipment table — gộp physical_molds + cutters → equipment (8 loại). Bảng cũ DEPRECATED.
- ADR-002 (2026-08-10, APPROVED): Work Order Model 4 tầng — work_orders → jobs → job_steps → work_logs.
- ADR-003 (2026-08-18, APPROVED): Tách Job theo Equipment Type (mỗi equipment 1 job riêng) & Filter Lịch Sản Xuất theo date range.
- KHÔNG đề xuất giải pháp đi ngược ADR đã APPROVED trừ khi Thoan yêu cầu tạo ADR mới.
```

### Block bổ sung 2: Bảng deprecated

```text
## BẢNG DỮ LIỆU DEPRECATED (KHÔNG DÙNG CHO CODE MỚI)
- `mold_masters` → dùng `products` (Product = MoldMaster, đã gộp)
- `physical_molds` → dùng `equipment` (equipment_type = 'MOLD')
- `cutters` → dùng `equipment` (equipment_type = 'CUTTER_INLINE' hoặc 'CUTTER_SEPARATE')
- `design_masters`, `design_projects`, `mold_designs` → ĐÃ DROP
```

### Block bổ sung 3: Tên file tài liệu chính xác

```text
## TÊN FILE TÀI LIỆU CHÍNH XÁC (KHÔNG SUY ĐOÁN)
- Schema DB: `SCHEMA_REFERENCE.md` (SSOT) + `src/types/database.types.ts` (generated types)
- Coding rules: `AGENTS.md` (root) + `.agents/AGENTS.md` + `AI_SYSTEM_RULES.md` + `CLAUDE.md`
- Business process: `docs/02_BUSINESS_PROCESS_CATALOG.md` (danh mục 70+ quy trình) + `docs/technical/01_business_process.md`
- Business flow detail: `business_docs/00_BUSINESS_FLOW_DETAIL.md`
- ADR: `docs/adr/ADR-001_unified-equipment-table.md`, `ADR-002_work-order-option-c.md`, `ADR-003_separate-equipment-jobs-and-schedule-filter.md`
- Nhật ký PE-AN: `PE_AN_COORDINATION_LOG.md`
- Knowledge base: `.agents/mempalace/knowledge/` (5 files: architecture, business_rules, data_mapping, mold_manufacturing_process, thermoforming_equipment_set)
```

---

## 6. TÓM TẮT HÀNH ĐỘNG

| # | Hành động | Ai thực hiện | Ưu tiên |
|---|-----------|-------------|---------|
| 1 | Sửa 3 lỗi sự thật trong v3 Instructions (§2.1–2.4) | PE tự sửa | 🔴 Cao |
| 2 | Thêm 3 block bổ sung (§5) vào v3 | PE tự thêm | 🟡 Trung bình |
| 3 | Sửa CLAUDE.md dòng 25 (`product_name_ja` → `product_name`) | AN thực hiện khi Thoan duyệt | 🔴 Cao |
| 4 | Merge CLAUDE.md → `.agents/AGENTS.md` (tùy chọn) | AN thực hiện khi Thoan duyệt | 🟢 Thấp |
| 5 | Cập nhật `📁 Cấu trúc src/app` trong AGENTS.md | AN thực hiện | 🟡 Trung bình |
| 6 | Cập nhật Open Questions §9 trong AGENTS.md | Thoan xác nhận | 🟢 Thấp |

> [!NOTE]
> Với Antigravity, **KHÔNG cần tạo file rules mới**. Hệ thống AGENTS.md hiện tại đã bao phủ tốt. Chỉ cần sửa lỗi #3 và tùy chọn merge #4 là đủ.
