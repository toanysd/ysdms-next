-- Create RPC for safe company hiding (Group 4) with audit logging
CREATE OR REPLACE FUNCTION hide_company(
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
    'HIDE', 
    jsonb_build_object('is_active', true), 
    jsonb_build_object('is_active', false), 
    p_user_id
  );

  -- 2. Set is_active = false (No parent_company_id or field deletion as per PE rules)
  UPDATE companies SET is_active = false WHERE company_id = p_company_id;
END;
$$;
