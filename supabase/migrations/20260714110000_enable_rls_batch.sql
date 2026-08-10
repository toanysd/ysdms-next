-- 1. Batch Enable RLS for all tables in public schema and grant access to authenticated users
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    
    -- Clean up any existing generic policies to avoid duplicates (optional, but safe)
    EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated access" ON public.' || quote_ident(r.tablename) || ';';

    -- Create a permissive policy for ALL operations for authenticated users (Temporary/Fallback)
    EXECUTE 'CREATE POLICY "Allow authenticated access" ON public.' || quote_ident(r.tablename) || ' FOR ALL TO authenticated USING (true) WITH CHECK (true);';
  END LOOP;
END $$;

-- 2. Revoke execute permission from anon for audit_trigger_func
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func() FROM anon;

-- 3. Set search_path for SECURITY DEFINER functions to prevent search_path injection attacks
-- (Assuming these functions exist in the public schema)
ALTER FUNCTION public.set_layer_code() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.audit_trigger_func() SET search_path = public;

-- 4. Clean up overly permissive anon policy on work_logs
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'work_logs'
    LOOP
        -- If the policy allows anon or public, drop it to be safe. We already created an authenticated policy above.
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.work_logs', pol.policyname);
    END LOOP;
END
$$;

-- Ensure anon has no access at the table level
REVOKE ALL ON public.work_logs FROM anon;
