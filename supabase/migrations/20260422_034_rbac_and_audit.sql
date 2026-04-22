-- Migration: 20260422_034_rbac_and_audit.sql
-- Mục tiêu: 
-- 1. Bảng User Roles mapping với auth.users
-- 2. Hàm helper đọc Role
-- 3. Tạo bảng audit_logs tracking
-- 4. Ví dụ áp dụng RLS cho production_plans và trigger Audit

-------------------------------------------------------------------------------
-- 1. USER ROLES SCHEMA
-------------------------------------------------------------------------------
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('ADMIN', 'OPERATOR', 'TECH')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Bật RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể đọc Role của chính mình, ADMIN được đọc của người khác
CREATE POLICY "Users can read own role or Admins can read all"
ON public.user_roles FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR
    (SELECT role_name FROM public.user_roles WHERE user_id = auth.uid()) = 'ADMIN'
);

-- Chỉ admin được Gán/Sửa vai trò
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
    (SELECT role_name FROM public.user_roles WHERE user_id = auth.uid()) = 'ADMIN'
);

-------------------------------------------------------------------------------
-- 2. HELPER FUNCTION - GET CURRENT ROLE
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS VARCHAR AS $$
    SELECT role_name FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-------------------------------------------------------------------------------
-- 3. AUDIT LOGS SCHEMA
-------------------------------------------------------------------------------
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID NULL, -- user_id nếu có
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs chỉ đọc, không ai được xóa (kể cả Admin)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.get_my_role() = 'ADMIN');

-- Hàm Trigger tự động ghi Audit Data
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, new_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, NEW.id, 'INSERT', row_to_json(NEW)::JSONB, auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, NEW.id, 'UPDATE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, OLD.id, 'DELETE', row_to_json(OLD)::JSONB, auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------------------------------------------------------
-- 4. ÁP DỤNG RLS & AUDIT LÊN PRODUCTION_PLANS (MẪU)
-------------------------------------------------------------------------------

-- Kích hoạt RLS
ALTER TABLE public.production_plans ENABLE ROW LEVEL SECURITY;

-- Cho phép TẤT CẢ mọi người đọc (SELECT) Kế hoạch (Operator cần nhìn thấy để làm)
CREATE POLICY "Select is allowed for all authenticated users"
ON public.production_plans FOR SELECT
TO authenticated
USING (true);

-- Cho phép Chỉ Quản Đốc (ADMIN) mới được Thêm/Sửa/Xóa Kế hoạch
CREATE POLICY "Insert allowed for ADMIN only"
ON public.production_plans FOR INSERT
TO authenticated
WITH CHECK (public.get_my_role() = 'ADMIN');

CREATE POLICY "Update allowed for ADMIN only"
ON public.production_plans FOR UPDATE
TO authenticated
USING (public.get_my_role() = 'ADMIN');

CREATE POLICY "Delete allowed for ADMIN only"
ON public.production_plans FOR DELETE
TO authenticated
USING (public.get_my_role() = 'ADMIN');

-- Gắn Trigger gọi hàm Audit vào bảng production_plans
CREATE TRIGGER trigger_audit_production_plans
AFTER INSERT OR UPDATE OR DELETE ON public.production_plans
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-------------------------------------------------------------------------------
-- 5. SEED ACCOUNT (Dữ liệu Test Cục bộ)
-------------------------------------------------------------------------------
-- (Chỉ dành cho môi trường Local DB dev, push trực tiếp lên supabase sẽ failed nếu thiếu PGCrypto)
-- Vui lòng dùng thư viện hoặc Supabase Dashboard để chèn test users thực tế.
