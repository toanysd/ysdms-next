-- Bổ sung bảng Customers theo kiến trúc chuẩn
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,  -- VD: JAE, ATS, DIC
    name TEXT NOT NULL,
    name_jp TEXT,
    contact_person TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung khóa ngoại từ bảng Khuôn (mold_base) hướng về customers
ALTER TABLE public.mold_base 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);
