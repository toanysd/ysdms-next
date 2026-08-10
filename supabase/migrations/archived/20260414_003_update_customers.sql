-- Xóa bảng cũ vừa tạo (do chưa có data nên an toàn)
ALTER TABLE public.mold_base DROP CONSTRAINT IF EXISTS mold_base_customer_id_fkey;
DROP TABLE IF EXISTS public.customers;

-- Cấu trúc MỚI chuẩn xác xuất phát trực tiếp từ File Excel 納入先一覧表
CREATE TABLE public.customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code    TEXT NOT NULL UNIQUE,  -- Mã ngắn: AAK, AMP, OWG (từ No.)
  
  -- Thông tin nhận hàng (送り先)
  delivery_name    TEXT NOT NULL,         -- Tên nơi giao
  delivery_address TEXT,                  -- Địa chỉ giao hàng đầy đủ
  
  -- Bên đặt hàng (依頼元) 
  requester_code   TEXT,                  -- Mã bên đặt: AAK01, AMP01
  requester_name   TEXT,                  
  
  -- Liên lạc
  contact_person   TEXT,                  -- Người nhận (サブ)
  phone            TEXT,
  fax              TEXT,
  
  -- Nhóm/phân loại
  parent_code      TEXT,                  -- Gom nhóm chi nhánh
  
  is_active        BOOLEAN NOT NULL DEFAULT true,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bổ sung lại khóa ngoại
ALTER TABLE public.mold_base 
ADD CONSTRAINT mold_base_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);
