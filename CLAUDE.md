# YSDMS NextGen — AI Agent Instructions
# Đây là file bắt buộc cho tất cả AI tools (Claude Code, Cursor, Antigravity, etc.)

## MUST READ FIRST (theo thứ tự)
1. `SCHEMA_REFERENCE.md` — Schema DB (bắt buộc trước khi viết bất kỳ Supabase query)
2. `AI_SYSTEM_RULES.md` — Quy tắc coding, performance, architecture
3. `src/app/globals.css` — Design tokens

## Stack
- Next.js 16.2.3 (App Router, Webpack — KHÔNG dùng Turbopack khi build)
- Supabase (PostgreSQL + RLS)
- TypeScript strict
- Custom CSS (CSS variables, KHÔNG dùng hardcoded color)
- pnpm workspaces (monorepo)

## Thư mục CẤM ĐỌC
- `.agents/` — Session files của AI subagents cũ (370+ thư mục, nhiễu loạn)
- `supabase/migrations/archived/` — Schema cũ đã bị overwrite, gây nhầm lẫn schema
- `temp_ai/`, `scratch/`, `tham_khao/` — File tạm thời
- `_trash_node_modules/`, `node_modules/`, `.next/`, `.turbo/` — Build artifacts
- `release/`, `source_data/`, `business_docs/` — Không liên quan đến code

## Critical Rules — Database
1. `orders.company_id → companies` (KHÔNG phải `customer_id → customers`)
2. `products.product_name_ja` (KHÔNG phải `product_name`)
3. Filter đơn hàng: `.eq('company_id', id)` KHÔNG phải `.eq('customer_id', id)`

## Critical Rules — Code
1. KHÔNG dùng `.select('*')` — luôn chỉ định columns cụ thể
2. LUÔN phân trang: `.range(from, to)` + `{ count: 'exact' }` (50 rows/page)
3. KHÔNG hardcode màu — dùng `var(--accent)`, `var(--text-primary)`, etc.
4. Server Components cho data fetching; Client Components chỉ cho interactivity
5. Chạy `npx tsc --noEmit` trước khi báo cáo hoàn thành (0 errors)

## Commands
- Dev: `npm run dev` hoặc `pnpm dev`
- TypeScript check: `npx tsc --noEmit`
