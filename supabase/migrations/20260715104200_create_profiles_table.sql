-- Tạo bảng profiles để quản lý phân quyền (role) cho người dùng
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL DEFAULT 'sales'
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read access for all authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- Cho phép admin hoặc chính user cập nhật
CREATE POLICY "Allow update for users" 
ON public.profiles FOR UPDATE
TO authenticated 
USING (auth.uid() = id);

-- Dữ liệu mẫu (Insert PE account - chú ý thay UUID bằng ID thực tế của user trong auth.users)
-- INSERT INTO public.profiles (id, role) VALUES ('df33230a-600a-4885-a37b-37f64a3d341a', 'pe') ON CONFLICT (id) DO UPDATE SET role = 'pe';
