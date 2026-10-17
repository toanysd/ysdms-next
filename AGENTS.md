# YSDMS NextGen — AI Agent & Developer Convention Router (Consolidated SSOT)

> **Stack Thực Tế (`package.json` v0.1.9):** Next.js `16.2.3` (App Router) | React `19.2.4` | TypeScript `5` | Supabase PostgreSQL (`iirezrszalmecsslbruo`) | `next-intl ^4.13.2` | Tailwind `^3.4.19` + Custom CSS (`src/app/globals.css`) | Vitest `^5` + Playwright | Quản lý gói: `npm` (single-app repo).

## 0. QUY TẮC 0 — Khung Phản Hồi, Compact Bridge & Quy Tắc Git/GitHub (BẮT BUỘC)
1. **Khung Phản Hồi:** Mọi câu trả lời của AN PHẢI bắt đầu và kết thúc bằng `TRẢ LỜI TỪ AN [YYYY-MM-DD HH:MM JST]`; toàn bộ báo cáo gửi PE đóng gói trong **1 khối code block markdown duy nhất** đặt ở **DƯỚI CÙNG** câu trả lời.
2. **Compact Bridge ($\le 150$ dòng):** Bản tin gửi `public.pe_an_messages` tối đa 150 dòng (Timestamp, Full 40-char Commit SHA từ `git rev-parse HEAD`, kết quả truy vấn/kiểm thử thực tế, `git diff --stat`, hạng mục chờ duyệt). Không nối toàn văn nhiều file `.md`.
3. **Git & GitHub:** Chỉ commit file trong phạm vi đã duyệt; lấy đúng 40-char SHA từ `git rev-parse HEAD` (ghi rõ `local-only` nếu chưa push). **CHỈ `git push` khi có yêu cầu/phê duyệt minh thị từ Minh Chủ THOAN hoặc PE** (sau khi push đối chứng bằng `git ls-remote origin refs/heads/main`). Cấm commit file nén, dữ liệu lớn, `node_modules/`, `.next/`, hoặc `service_role` key.

## 1. QUY TẮC DỮ LIỆU & SCHEMA (`RULE-DATA-01` & `RULE-DATA-02` — BẮT BUỘC)
1. **`RULE-DATA-01` (Không Fallback Kỹ Thuật):** `cutline_length/width` (từ `design_revisions`, qua `getCutlineSpecs`) $\neq$ kích thước vật lý (`equipment.actual_*_mm` / `cutter_*_mm`). Cấm dùng regex parse text runtime (`product_description`, `display_name`, `tray_info`) để suy diễn cutline/corner R/chamfer C; nếu trống hiển thị `"—"`.
2. **`RULE-DATA-02` (Xác Minh DB Thực Tế & SSOT):**
   - Trước khi kết luận bảng/cột hoặc viết query phức tạp, BẮT BUỘC kiểm chứng qua `information_schema.tables` / `information_schema.columns` kèm `NOW()` và `docs/dossier/M01..M12/schema.md`.
   - **SSOT:** Nhựa & cutline từ `design_revisions` (`plastic_type_designed`, không lấy `products.primary_plastic_code`); thiết bị vật lý từ `equipment` & `equipment_assignments` (`SET_MEMBER`, `SHARED`).
   - **Bảng `NOT_FOUND` (cấm truy vấn):** `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`.
   - **Bảng `EXISTS` nhưng CẤM DÙNG trong code mới (không gọi là đã DROP):** `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.
   - **Khóa & Cột chuẩn V3:** `orders.company_id -> companies.company_id` (không dùng `customer_id`); `orders.order_id`, `products.product_id`, `order_lines.line_id`; `products.product_name`, `product_name_internal`, `product_code`, `product_status` (không dùng `status` hay `product_name_ja`).

## 2. QUY TRÌNH PHỐI HỢP AN–PE & KỶ LUẬT THỰC THI (`RULE-PROC-01..03` & `RULE-EXEC`)
1. **`RULE-PROC-01` (3 Pha):** Pha 1 `[KẾ HOẠCH]` (chờ PE duyệt) $\rightarrow$ Pha 2 `[THI CÔNG]` $\rightarrow$ Pha 3 `[HOÀN TẤT]` (chỉ xuất khi đạt 0 lỗi `tsc --noEmit`, 0 missing keys `node scripts/check_translations.mjs`, Test/Browser PASS, và không còn background task chạy).
2. **`RULE-PROC-02` (Strict Half-Duplex):** Lệnh đẩy báo cáo lên `public.pe_an_messages` (`:3856/api/report`) **CHỈ gọi ở TOOL CALL CUỐI CÙNG** của lượt làm việc, sau đó xuất câu trả lời và kết thúc turn ngay. Kết thúc phiên phải trình PE thẩm định trước.
3. **`RULE-PROC-03` (Evidence Pack & Phân Cổng):** Không dẫn chiếu đường dẫn local (`C:/Users/...`). Nộp Evidence Pack qua `docs/audit_logs/YYYY-MM-DD_<wo>.json` + `public.pe_evidence_items`. Thay đổi UI/Read-only được gộp Batch 2–3 commit; thay đổi DB/RPC/RLS/Backfill bắt buộc giữ đủ **2 cổng PE** (Dry-run `BEGIN...ROLLBACK` $\rightarrow$ PE hậu kiểm).
4. **`RULE-EXEC` (5 Nguyên Tắc Thực Thi):** **Read-Before-Touch** (đọc file trước khi sửa) | **Zero-Guessing** (xác minh bằng `rg`/DB trước) | **Surgical Edits** (`replace_file_content`, cấm ghi đè cả file lớn để sửa vài dòng) | **Minimal Change** (đúng phạm vi WO) | **Dual Verification** (chạy kiểm thử & đọc output thực tế trước khi báo cáo).

## 3. SƠ ĐỒ ĐIỀU HƯỚNG TÀI LIỆU (SMART MEMORY PALACE ROUTER)
| Tầng Ngữ Cảnh | Đường Dẫn Chuẩn (SSOT) | Quy Tắc Đọc & Giới Hạn |
| :--- | :--- | :--- |
| **1. Cổng Chỉ Mục 12 Module** | `docs/dossier/00_core/00_INDEX.md` | Đọc đầu tiên để định vị Module `M01`–`M12` và trạng thái bảng DB (`<= 40` dòng). |
| **2. Sổ Trực Ca Liên Phiên** | `docs/dossier/00_core/00_ACTIVE_HANDOFF.md` | Trạng thái Work Order đang mở và điểm dừng phiên gần nhất (`<= 40` dòng). |
| **3. Hồ Sơ Từng Module** | `docs/dossier/M01..M12/{business,schema}.md` | Chỉ mở đúng cặp `business.md` + `schema.md` của Module đang làm (`<= 120` dòng/file). |
| **4. Quy Tắc UI, Data & Biz** | `docs/dossier/00_core/RULES_UI_AND_DATA.md` | Đọc khi sửa UI/List/Detail/Dropdown, Paper Style (`SpecCell`), `next-intl`, Dao cắt & Tên SP. |
| **5. Bản Đồ Code & Sổ Bài Học** | `.agents/context/PROJECT_MAP.md` & `docs/SO_BAI_HOC.md` | Tra cứu tọa độ symbol/dòng (`rg -n` / `PROJECT_MAP.md`) và bài học chống tái phạm. |
| **6. Vùng Cấm Đọc Mặc Định** | `_archive/`, `node_modules/`, `.next/`, `.agents/` (trừ `context/`), `temp_ai/`, lockfiles | Tuyệt đối không mở nếu không có yêu cầu minh thị từ Minh Chủ THOAN hoặc PE. |
