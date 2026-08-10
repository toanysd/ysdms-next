-- Migration: Update company_contacts and products schema
-- Description: Thêm department, project_role vào company_contacts. Thêm end_user_company_id vào products.

-- 1. Thêm cột mới vào bảng company_contacts
ALTER TABLE public.company_contacts 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS project_role TEXT;

-- Ghi chú cho các cột
COMMENT ON COLUMN public.company_contacts.department IS 'Phòng ban (VD: 購買部, PML技術課)';
COMMENT ON COLUMN public.company_contacts.project_role IS 'Vai trò trong dự án (VD: Mua hàng, Kỹ thuật, Kinh doanh)';

-- 2. Thêm cột mới vào bảng products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS end_user_company_id UUID REFERENCES public.companies(company_id) ON DELETE SET NULL;

-- Ghi chú cho cột
COMMENT ON COLUMN public.products.end_user_company_id IS 'Liên kết đến khách hàng cuối/nơi nhận (nếu khác với khách hàng trung gian đặt hàng)';

-- Force schema reload for PostgREST
NOTIFY pgrst, 'reload schema';
