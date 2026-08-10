-- Migration: Add parent_company_id to companies, contact_person to delivery_sites, and enable audit tracking


ALTER TABLE public.delivery_sites
ADD COLUMN contact_person TEXT,
ADD COLUMN contact_email TEXT;

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

-- Attach Audit Trigger to track changes in delivery_sites
DROP TRIGGER IF EXISTS trigger_audit_delivery_sites ON public.delivery_sites;

CREATE TRIGGER trigger_audit_delivery_sites
AFTER INSERT OR UPDATE OR DELETE ON public.delivery_sites
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
