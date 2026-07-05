import os

file_path = "supabase/migrations/20260616000001_070_delivery_site_audit.sql"
with open(file_path, "r", encoding="utf-8") as f:
    data = f.read()

func = """CREATE OR REPLACE FUNCTION public.audit_trigger_func()
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

"""

data = data.replace("-- Attach Audit Trigger", func + "-- Attach Audit Trigger")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(data)

print("Added audit_trigger_func to 070")
