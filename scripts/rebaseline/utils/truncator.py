from typing import Dict, Any

TABLES_TO_TRUNCATE = [
    ("technical_reviews", "id", True),
    ("sample_submissions", "submission_id", True),
    ("production_lots", "lot_id", True),
    ("production_orders", "po_id", True),
    ("shipments", "shipment_id", True),
    ("order_lines", "line_id", True),
    ("orders", "order_id", True),
    ("production_instructions", "id", True),
    ("quotation_lines", "line_id", True),
    ("quotations", "quotation_id", True),
    ("business_cases", "id", True),
    ("mold_loan_certificates", "certificate_id", True),
    ("mold_location_history", "location_log_id", True),
    ("asset_location_logs", "id", True),
    ("mold_maintenance", "maintenance_id", True),
    ("work_logs", "log_id", True),
    ("job_steps", "step_id", True),
    ("jobs", "job_id", True),
    ("mold_design_cutters", "id", True),
    ("cutters", "cutter_id", True),
    ("physical_molds", "physical_mold_id", True),
    ("mold_revisions", "revision_id", True),
    ("design_revisions", "revision_id", True),
    ("products", "product_id", True),
    ("delivery_sites", "site_id", True),
    ("employees", "employee_id", True),
    ("mold_owners", "owner_id", True),
    ("companies", "company_id", True),
    ("rack_layers", "id", True),
    ("racks", "id", True),
    ("machines", "machine_id", True),
    ("cav_types", "cav_type_id", True),
    ("item_types", "item_type_id", False),
    ("processing_statuses", "status_id", False),
    ("processing_codes", "processing_code_id", False),
    ("job_types", "job_type_id", False)
]

def truncate_all(supabase: Any, dry_run: bool = False) -> Dict[str, int]:
    """Truncate tables in reverse FK order for clean slate import."""
    counts = {}
    
    for table_name, pk_col, is_uuid in TABLES_TO_TRUNCATE:
        counts[table_name] = 0
        if dry_run:
            print(f"[DRY RUN] Would truncate {table_name}")
            continue
            
        print(f"Truncating {table_name}...")
        
        while True:
            try:
                if is_uuid:
                    res = supabase.table(table_name).delete().neq(pk_col, '00000000-0000-0000-0000-000000000000').execute()
                else:
                    res = supabase.table(table_name).delete().neq(pk_col, -1).execute()
            except Exception as e:
                print(f"Error truncating {table_name}: {e}")
                break
                    
            if not getattr(res, 'data', None):
                break
                
            counts[table_name] += len(res.data)
            if len(res.data) < 1000:
                break
                
    return counts
