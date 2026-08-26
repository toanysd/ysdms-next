-- Create RPC for promoting a company to SSOT with audit logging
CREATE OR REPLACE FUNCTION promote_company_to_ssot(
  p_company_id UUID,
  p_user_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Audit Log (as per PE requirement)
  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
  VALUES (
    'companies', 
    p_company_id, 
    'PROMOTE_TO_SSOT', 
    jsonb_build_object('is_manually_edited', false), 
    jsonb_build_object('is_manually_edited', true), 
    p_user_id
  );

  -- 2. Mark as manually edited to prevent overwrite
  UPDATE companies SET is_manually_edited = true, last_synced_at = now() WHERE company_id = p_company_id;
END;
$$;
