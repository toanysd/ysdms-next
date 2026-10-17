# YSDMS NextGen — AI Agent & Developer Convention Router (Consolidated SSOT)

> **Stack (`package.json` v0.1.9):** Next.js `16.2.3` (App Router) | React `19.2.4` | TypeScript `5` | Supabase PG (`iirezrszalmecsslbruo`) | `next-intl ^4.13.2` | Tailwind `^3.4.19` + `globals.css` | Vitest `^5` + Playwright | `npm`.

## 0. QUY TẮC 0 — Khung Phản Hồi, Compact Bridge & Git/GitHub (BẮT BUỘC)
1. **Khung Phản Hồi:** Mở đầu & kết thúc bằng `TRẢ LỜI TỪ AN [YYYY-MM-DD HH:MM JST]`; báo cáo gửi PE đóng gói trong **1 khối code block markdown duy nhất** ở **DƯỚI CÙNG**.
2. **Compact Bridge ($\le 150$ dòng):** Gửi `public.pe_an_messages` $\le 150$ dòng (Timestamp, Full 40-char SHA từ `git rev-parse HEAD`, kết quả test/query, `git diff --stat`, mục chờ duyệt).
3. **Git & GitHub:** Chỉ commit đúng phạm vi duyệt; ghi `local-only` nếu chưa push. **CHỈ `git push` khi THOAN hoặc PE yêu cầu/duyệt minh thị** (đối chứng bằng `git ls-remote`).

## 1. QUY TẮC DỮ LIỆU & SCHEMA (`RULE-DATA-01` & `RULE-DATA-02` — BẮT BUỘC)
1. **`RULE-DATA-01` (Không Fallback Kỹ Thuật):** `cutline_length/width` (`design_revisions` / `getCutlineSpecs`) $\neq$ kích thước vật lý (`equipment`). Cấm regex parse text runtime; trống hiển thị `"—"`.
2. **`RULE-DATA-02` (Xác Minh DB Thực Tế & SSOT):** Kiểm chứng `information_schema.tables/columns` + `NOW()` và `docs/dossier/M01..M12/schema.md` trước khi query.
   - **SSOT & Cột V3:** Nhựa/cutline từ `design_revisions`; thiết bị từ `equipment` & `equipment_assignments` (`SET_MEMBER`, `SHARED`); FK `orders.company_id`; cột `product_status`, `product_name_internal`, `product_code`.
   - **Bảng Legacy:** `NOT_FOUND` (cấm query): `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`. `EXISTS` nhưng cấm dùng: `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.

## 2. QUY TRÌNH PHỐI HỢP AN–PE & KỶ LUẬT THỰC THI (`RULE-PROC-01..03` & `RULE-EXEC`)
1. **`RULE-PROC-01` (3 Pha):** `[KẾ HOẠCH]` (chờ PE duyệt) $\rightarrow$ `[THI CÔNG]` $\rightarrow$ `[HOÀN TẤT]` (0 lỗi `tsc --noEmit`, 0 missing keys `check_translations.mjs`, Test/Browser PASS).
2. **`RULE-PROC-02` (Strict Half-Duplex):** Đẩy báo cáo lên `public.pe_an_messages` (`:3856/api/report`) ở cuối lượt, bật Watcher nhận tin PE và kết thúc turn ngay.
3. **`RULE-PROC-03` (Evidence & Phân Cổng):** Không dùng path local (`C:/Users/...`); nộp `docs/audit_logs/YYYY-MM-DD_<wo>.json` + `pe_evidence_items`. DB/RPC/RLS/Backfill giữ đủ **2 cổng PE** (`BEGIN...ROLLBACK` $\rightarrow$ hậu kiểm).
4. **`RULE-EXEC` (5 Nguyên Tắc):** **Read-Before-Touch** | **Zero-Guessing** (`rg`/DB) | **Surgical Edits** (`replace_file_content`) | **Minimal Change** | **Dual Verification**.

## 3. SƠ ĐỒ ĐIỀU HƯỚNG TÀI LIỆU (SMART MEMORY PALACE ROUTER)
| Tầng Ngữ Cảnh | Đường Dẫn Chuẩn (SSOT) | Quy Tắc Đọc & Giới Hạn |
| :--- | :--- | :--- |
| **1. Cổng Chỉ Mục 12 Module** | `docs/dossier/00_core/00_INDEX.md` | Đọc đầu tiên để định vị `M01`–`M12` & trạng thái bảng (`<= 40` dòng). |
| **2. Sổ Trực Ca Liên Phiên** | `docs/dossier/00_core/00_ACTIVE_HANDOFF.md` | Trạng thái Work Order đang mở & điểm dừng gần nhất (`<= 40` dòng). |
| **3. Hồ Sơ Từng Module** | `docs/dossier/M01..M12/{business,schema}.md` | Chỉ mở đúng cặp `business.md` + `schema.md` của Module đang làm (`<= 120` dòng). |
| **4. Quy Tắc UI, Data & Biz** | `docs/dossier/00_core/RULES_UI_AND_DATA.md` | Đọc khi sửa UI/List/Detail/Dropdown, Paper Style, `next-intl`, Dao cắt & Tên SP. |
| **5. Bản Đồ Code & Bài Học** | `.agents/context/PROJECT_MAP.md` & `docs/SO_BAI_HOC.md` | Tra cứu tọa độ symbol/dòng (`PROJECT_MAP.md`) và bài học chống tái phạm. |
| **6. Vùng Cấm Đọc Mặc Định** | `_archive/`, `node_modules/`, `.next/`, `.agents/` (trừ `context/`), `temp_ai/`, lockfiles | Tuyệt đối không mở nếu không có yêu cầu minh thị từ THOAN hoặc PE. |
