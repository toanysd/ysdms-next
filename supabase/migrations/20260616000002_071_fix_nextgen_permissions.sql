-- Migration: 071_fix_nextgen_permissions.sql
-- Description: Re-enable RLS and add basic policies to recreated NextGen schema tables

-- 1. Enable RLS explicitly
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_sites ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow all for companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all for company_contacts" ON public.company_contacts;
DROP POLICY IF EXISTS "Allow all for delivery_sites" ON public.delivery_sites;

-- 3. Create full access policies for authenticated and anon roles (since it's an internal tool)
CREATE POLICY "Allow all for companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for company_contacts" ON public.company_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for delivery_sites" ON public.delivery_sites FOR ALL USING (true) WITH CHECK (true);

-- 4. Grant privileges just in case
GRANT ALL ON public.companies TO authenticated, anon;
GRANT ALL ON public.company_contacts TO authenticated, anon;
GRANT ALL ON public.delivery_sites TO authenticated, anon;
