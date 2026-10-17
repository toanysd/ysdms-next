# YSDMS NextGen — Claude & AI Agent Entry Point (Thin Wrapper)

> **Single Source of Truth (SSOT):** Toàn bộ quy tắc bắt buộc của dự án được hợp nhất tại [`AGENTS.md`](./AGENTS.md). Không đọc các bản lưu trữ trong `_archive/`.

## 1. Thứ Tự Nạp Ngữ Cảnh Tinh Gọn (Token Economy)
1. [`AGENTS.md`](./AGENTS.md) — Luật lõi (`QUY TẮC 0`, `RULE-DATA-01/02`, `RULE-PROC-01..03`, `RULE-EXEC`) & Sơ đồ Router.
2. [`docs/dossier/00_core/00_INDEX.md`](./docs/dossier/00_core/00_INDEX.md) & [`00_ACTIVE_HANDOFF.md`](./docs/dossier/00_core/00_ACTIVE_HANDOFF.md) — Chỉ mục 12 Module & Bàn giao phiên hiện hành.
3. `docs/dossier/M01..M12/{business,schema}.md` — Chỉ đọc đúng Module thuộc phạm vi Work Order đang thực thi (`<= 120` dòng/file).
4. [`docs/dossier/00_core/RULES_UI_AND_DATA.md`](./docs/dossier/00_core/RULES_UI_AND_DATA.md) — Quy chuẩn UI/UX (`src/app/globals.css`), Pagination 50 dòng, Fuzzy Search, Paper Style `SpecCell`.

## 2. Stack & Lệnh Kiểm Chứng Thực Tế (`package.json` v0.1.9)
- **Stack:** Next.js `16.2.3` (`dev: next dev --turbo`, `build: next build`) | React `19.2.4` | TypeScript `5` | Supabase PostgreSQL + RLS | `next-intl ^4.13.2` | Quản lý gói: `npm` (single-app repo).
- **Kiểm chứng bắt buộc:** `node ".\node_modules\typescript\bin\tsc" --noEmit` (0 errors) & `node scripts/check_translations.mjs` (0 missing keys).
