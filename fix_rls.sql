-- Chạy lệnh SQL này trong Supabase Dashboard -> SQL Editor để sửa lỗi 403 cho bảng Phôi nhôm

-- 1. Bật RLS
ALTER TABLE aluminum_blanks ENABLE ROW LEVEL SECURITY;

-- 2. Cho phép thao tác với mọi role (khi đang phát triển local)
CREATE POLICY "Allow ALL for authenticated" ON aluminum_blanks
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow ALL for anon" ON aluminum_blanks
FOR ALL USING (auth.role() = 'anon') WITH CHECK (auth.role() = 'anon');

-- 3. Xoá trigger hoặc các thiết lập lỗi (nếu có)
-- (Không cần thiết cho trường hợp này)
