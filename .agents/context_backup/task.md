# YSDMS Next-Gen: Execution Checklist

Tiến trình thực thi dựa trên `implementation_plan.md` cho việc xây dựng YSDMS bằng công nghệ Next.js và Supabase.

## Giai đoạn 1: Core Foundation (Đang thực hiện)

- `[x]` Xem trước tùy chọn (help) của cấu trúc Next.js để sẵn sàng non-interactive scaffolding.
- `[x]` Tạo bộ source code khung (scaffold) Next.js vào thư mục `f:\AntiGravity\ysdms-nextgen`.
- `[x]` Thiết lập cấu hình TypeScript, TailwindCSS và App Router.

## Giai đoạn 2: Supabase Base Setup (Đang thực hiện)

- `[x]` Tạo cấu hình môi trường `.env.local`.
- `[x]` Khởi tạo Supabase Browser Client (`src/lib/supabase/client.ts`).
- `[x]` Khởi tạo Supabase Server Client (`src/lib/supabase/server.ts`).

## Các giai đoạn tiếp theo (Pending)

## Giai đoạn 2: Master Data CRUD
- `[x]` Danh mục Nhựa (plastic_master)
- `[x]` Danh mục Khuôn gốc (mold_base)
- `[x]` Danh mục Dao cắt (cutter_master)
- `[x]` Danh mục Khay sản phẩm (product_master)
- `[ ]` Danh mục Máy đúc (machine_master) & Lớp Khuôn con (Revision, Physical)
