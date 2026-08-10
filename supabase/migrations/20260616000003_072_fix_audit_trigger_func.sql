-- Migration: 072_fix_audit_trigger_func.sql
-- Description: Update audit_trigger_func to use changed_by instead of performed_by, and handle tables without an "id" column.

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    v_actor UUID;
    v_record_id UUID;
    v_row_json JSONB;
BEGIN
    v_actor := COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID);

    IF TG_OP = 'INSERT' THEN
        v_row_json := row_to_json(NEW)::JSONB;
        v_record_id := COALESCE(v_row_json->>'id', v_row_json->>'company_id', v_row_json->>'site_id', v_row_json->>'contact_id', v_row_json->>'mold_id')::UUID;
        INSERT INTO public.audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (TG_TABLE_NAME::TEXT, v_record_id, 'INSERT', v_row_json, v_actor);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        v_row_json := row_to_json(NEW)::JSONB;
        v_record_id := COALESCE(v_row_json->>'id', v_row_json->>'company_id', v_row_json->>'site_id', v_row_json->>'contact_id', v_row_json->>'mold_id')::UUID;
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
        VALUES (TG_TABLE_NAME::TEXT, v_record_id, 'UPDATE', row_to_json(OLD)::JSONB, v_row_json, v_actor);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        v_row_json := row_to_json(OLD)::JSONB;
        v_record_id := COALESCE(v_row_json->>'id', v_row_json->>'company_id', v_row_json->>'site_id', v_row_json->>'contact_id', v_row_json->>'mold_id')::UUID;
        INSERT INTO public.audit_logs (table_name, record_id, action, old_data, changed_by)
        VALUES (TG_TABLE_NAME::TEXT, v_record_id, 'DELETE', v_row_json, v_actor);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
