-- Migration 079: fix_public_rls_high
-- Fix HIGH: auxiliary_equipments, company_calendar, equipment_photos, equipment_ship_logs, 
-- equipment_status_logs, processing_codes, processing_statuses, standard_process_times, quotation_lines

DO $$
DECLARE
    t_name text;
    p_name text;
BEGIN
    FOR t_name IN 
        SELECT unnest(ARRAY[
            'auxiliary_equipments',
            'company_calendar',
            'equipment_photos',
            'equipment_ship_logs',
            'equipment_status_logs',
            'processing_codes',
            'processing_statuses',
            'standard_process_times',
            'quotation_lines'
        ])
    LOOP
        -- Enable RLS on the table
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t_name);
        
        -- Drop all existing policies on this table to clean up 'public' and bad policies
        FOR p_name IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = t_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p_name, t_name);
        END LOOP;
        
        -- Create standard authenticated policy
        EXECUTE format('
            CREATE POLICY "authenticated_all_%s" ON public.%I
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
        ', t_name, t_name);
    END LOOP;
END $$;
