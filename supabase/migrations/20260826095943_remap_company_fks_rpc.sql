-- Create RPC for safe company remapping with audit logging
CREATE OR REPLACE FUNCTION remap_company_fks(
  p_old_company_id UUID,
  p_new_company_id UUID,
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
    p_old_company_id, 
    'REMAP_AND_ARCHIVE', 
    jsonb_build_object('is_active', true, 'remapped_to', null), 
    jsonb_build_object('is_active', false, 'remapped_to', p_new_company_id), 
    p_user_id
  );

  -- 2. Transaction FKs (17 tables, 22 columns)
  UPDATE orders SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE products SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE products SET end_user_company_id = p_new_company_id WHERE end_user_company_id = p_old_company_id;
  UPDATE design_revisions SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE jobs SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE jobs SET outsource_company = p_new_company_id WHERE outsource_company = p_old_company_id;
  UPDATE equipment SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE equipment SET keeper_company_id = p_new_company_id WHERE keeper_company_id = p_old_company_id;
  UPDATE work_orders SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE invoices SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE quotations SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE cutter_orders SET supplier_id = p_new_company_id WHERE supplier_id = p_old_company_id;
  UPDATE materials SET supplier_id = p_new_company_id WHERE supplier_id = p_old_company_id;
  UPDATE aluminum_blanks SET supplier_id = p_new_company_id WHERE supplier_id = p_old_company_id;
  UPDATE plastic_receipt_roll SET branch_id = p_new_company_id WHERE branch_id = p_old_company_id;
  UPDATE job_steps SET outsource_company = p_new_company_id WHERE outsource_company = p_old_company_id;
  UPDATE work_logs SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE equipment_history SET from_company_id = p_new_company_id WHERE from_company_id = p_old_company_id;
  UPDATE equipment_history SET to_company_id = p_new_company_id WHERE to_company_id = p_old_company_id;
  UPDATE equipment_ship_logs SET from_company_id = p_new_company_id WHERE from_company_id = p_old_company_id;
  UPDATE equipment_ship_logs SET to_company_id = p_new_company_id WHERE to_company_id = p_old_company_id;
  UPDATE business_cases SET customer_id = p_new_company_id WHERE customer_id = p_old_company_id;

  -- 3. Metadata FKs (12 tables, 13 columns)
  UPDATE mold_owners SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE company_contacts SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE auxiliary_equipments SET owner_company_id = p_new_company_id WHERE owner_company_id = p_old_company_id;
  UPDATE auxiliary_equipments SET keeper_company_id = p_new_company_id WHERE keeper_company_id = p_old_company_id;
  UPDATE delivery_sites SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE employees SET company_id = p_new_company_id WHERE company_id = p_old_company_id;
  UPDATE mold_maintenance SET vendor_id = p_new_company_id WHERE vendor_id = p_old_company_id;
  UPDATE mold_inventory_items SET keeper_company_id = p_new_company_id WHERE keeper_company_id = p_old_company_id;
  UPDATE mold_disposal_logs SET requested_by_company = p_new_company_id WHERE requested_by_company = p_old_company_id;
  UPDATE mold_return_logs SET requested_by_company = p_new_company_id WHERE requested_by_company = p_old_company_id;
  UPDATE certificate_items SET keeper_company_id = p_new_company_id WHERE keeper_company_id = p_old_company_id;
  UPDATE shipment_required_docs SET required_by = p_new_company_id WHERE required_by = p_old_company_id;
  UPDATE companies SET parent_company_id = p_new_company_id WHERE parent_company_id = p_old_company_id;

  -- 4. Soft Delete old company
  UPDATE companies SET is_active = false WHERE company_id = p_old_company_id;
END;
$$;
