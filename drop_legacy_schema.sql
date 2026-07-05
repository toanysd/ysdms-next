-- Chạy lệnh SQL này trong Supabase Dashboard -> SQL Editor để dọn dẹp hoàn toàn schema cũ

-- 1. Xóa toàn bộ schema `legacy_archive` cùng với tất cả các bảng bên trong nó
-- Lưu ý: CASCADE sẽ tự động xóa mọi objects (tables, views, functions...) phụ thuộc vào schema này.
DROP SCHEMA IF EXISTS legacy_archive CASCADE;

-- 2. Tùy chọn: Xóa các bảng dư thừa ở public (nếu còn sót lại từ v1 chưa được move)
-- (Nếu bạn chắc chắn các bảng dưới đây không còn cần thiết)
DROP TABLE IF EXISTS public.mold_base CASCADE;
DROP TABLE IF EXISTS public.mold_design_revision CASCADE;
DROP TABLE IF EXISTS public.mold_physical CASCADE;
DROP TABLE IF EXISTS public.product_mold_map CASCADE;

-- Sau khi chạy lệnh này, database của bạn sẽ hoàn toàn sạch sẽ và chỉ còn:
-- 1. Các bảng Schema v2 mới nhất
-- 2. Các bảng omni_* của OmniLinguist
