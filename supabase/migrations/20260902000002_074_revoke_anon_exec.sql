-- Migration 074: revoke anon execute on sensitive functions
REVOKE EXECUTE ON FUNCTION public.fn_sync_invoice_payment() FROM anon;
REVOKE EXECUTE ON FUNCTION public.fn_transition_product_lifecycle(uuid,text,text,text,uuid,text,uuid,jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.fn_trg_product_lifecycle_audit() FROM anon;
REVOKE EXECUTE ON FUNCTION public.trg_product_lifecycle_audit() FROM anon;
