-- =================================================================================
-- MIGRATION: THÊM LIÊN KẾT PHẢ HỆ CHO KHUÔN (PROTOTYPE LINEAGE)
-- Chạy file này trên giao diện SQL Editor của Supabase.
-- =================================================================================

-- 1. Bổ sung cột prototype_base_id vào bảng mold_base
ALTER TABLE public.mold_base 
ADD COLUMN IF NOT EXISTS prototype_base_id UUID REFERENCES public.mold_base(id) ON DELETE SET NULL;

-- 2. Thêm Comment giải thích cho Developers tương lai
COMMENT ON COLUMN public.mold_base.prototype_base_id IS 'Liên kết phả hệ: Chỉ ra Khuôn này được kế thừa thiết kế từ Khuôn Thử Nghiệm (Bản D) nào. Cho phép NULL.';
