-- Migration: 20260424_043_update_production_plans_for_grid.sql
-- Mục tiêu: Thêm các cột cho UI Lưới Kế Hoạch & Bảng Operator

-- 1. Bổ sung các cột cho production_plans
ALTER TABLE public.production_plans 
ADD COLUMN IF NOT EXISTS quantity_note TEXT,
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- 2. Tạo bảng Operator Master (Nhân viên vận hành)
CREATE TABLE IF NOT EXISTS public.operator_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật RLS cho operator_master
ALTER TABLE public.operator_master ENABLE ROW LEVEL SECURITY;

-- Policy: Ai cũng đọc được, chỉ Admin được sửa
CREATE POLICY "Cho phép tất cả đọc operator"
ON public.operator_master FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Chỉ ADMIN được quản lý operator"
ON public.operator_master FOR ALL
TO authenticated
USING (public.get_my_role() = 'ADMIN')
WITH CHECK (public.get_my_role() = 'ADMIN');

-- 3. Seed dữ liệu Operator từ Excel thực tế
INSERT INTO public.operator_master (code, name, display_name) VALUES
('OP-001', 'ヒュウ担当', 'ヒュウ担当 (Huu)'),
('OP-002', '工藤担当', '工藤担当 (Kudou)'),
('OP-003', '野口担当', '野口担当 (Noguchi)'),
('OP-004', 'クオック担当', 'クオック担当 (Quoc)'),
('OP-005', '中川担当', '中川担当 (Nakagawa)'),
('OP-006', '谷口担当', '谷口担当 (Taniguchi)')
ON CONFLICT (code) DO NOTHING;
