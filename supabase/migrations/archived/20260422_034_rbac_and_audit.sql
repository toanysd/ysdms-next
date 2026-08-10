-- Migration: 20260422_034_rbac_and_audit.sql (v2 — Fixed)
-- Mục tiêu: 
-- 1. Bảng User Roles mapping với auth.users
-- 2. Hàm helper đọc Role (SECURITY DEFINER bypass RLS)
-- 3. Tạo bảng audit_logs tracking
-- 4. Áp dụng RLS cho production_plans và trigger Audit

-------------------------------------------------------------------------------
-- 1. USER ROLES SCHEMA
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('ADMIN', 'OPERATOR', 'TECH')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- 2. HELPER FUNCTION - GET CURRENT ROLE (Phải tạo TRƯỚC khi dùng trong Policy)
-- SECURITY DEFINER: bypass RLS để tránh infinite recursion
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS VARCHAR AS $$
    SELECT role_name FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-------------------------------------------------------------------------------
-- 3. RLS POLICIES CHO USER_ROLES (Dùng get_my_role() thay vì subquery trực tiếp)
-------------------------------------------------------------------------------

-- User đọc role của chính mình, Admin đọc tất cả
CREATE POLICY "Users can read own role or Admins can read all"
ON public.user_roles FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR public.get_my_role() = 'ADMIN'
);

-- Chỉ Admin được Gán/Sửa/Xóa vai trò
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.get_my_role() = 'ADMIN')
WITH CHECK (public.get_my_role() = 'ADMIN');

-------------------------------------------------------------------------------
-- 4. AUDIT LOGS SCHEMA
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID NULL,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs chỉ đọc — không ai được xóa/sửa (kể cả Admin)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.get_my_role() = 'ADMIN');

-------------------------------------------------------------------------------
-- 5. AUDIT TRIGGER FUNCTION
-- COALESCE fallback: phân biệt "user thật" vs "system/migration action"
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    v_actor UUID;
BEGIN
    v_actor := COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID);

    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, new_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, NEW.id, 'INSERT', row_to_json(NEW)::JSONB, v_actor);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, NEW.id, 'UPDATE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, v_actor);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, performed_by)
        VALUES (TG_TABLE_NAME::TEXT, OLD.id, 'DELETE', row_to_json(OLD)::JSONB, v_actor);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-------------------------------------------------------------------------------
-- 6. ÁP DỤNG RLS & AUDIT LÊN PRODUCTION_PLANS (MẪU)
-------------------------------------------------------------------------------
ALTER TABLE public.production_plans ENABLE ROW LEVEL SECURITY;

-- Tất cả authenticated user được đọc Kế hoạch
CREATE POLICY "Select is allowed for all authenticated users"
ON public.production_plans FOR SELECT
TO authenticated
USING (true);

-- Chỉ ADMIN mới được Thêm/Sửa/Xóa
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

-- Gắn Trigger Audit
CREATE TRIGGER trigger_audit_production_plans
AFTER INSERT OR UPDATE OR DELETE ON public.production_plans
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
