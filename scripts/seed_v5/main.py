import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from config import get_supabase_client
from utils import IdRegistry
from importers import cutter_importer, job_importer, lifecycle_importer

TABLES_TO_TRUNCATE = [
    ("mold_loan_certificates", "certificate_id"),
    ("mold_location_history", "location_log_id"),
    ("mold_maintenance", "maintenance_id"),
    ("work_logs", "log_id"),
    ("job_steps", "step_id"),
    ("jobs", "job_id"),
    ("mold_design_cutters", "id"),
    ("cutters", "cutter_id")
]

def truncate_ysdms_tables(supabase):
    print("--- Bắt đầu dọn dẹp dữ liệu cũ (YSDMS Tables) ---")
    for table, pk_col in TABLES_TO_TRUNCATE:
        print(f"Truncating {table}...")
        try:
            while True:
                try:
                    res = supabase.table(table).delete().neq(pk_col, "00000000-0000-0000-0000-000000000000").execute()
                except Exception as e:
                    res = supabase.table(table).delete().neq(pk_col, -1).execute()
                if len(res.data) < 1000: break
        except Exception as e:
            print(f"Warning: Failed to delete {table}: {e}")

def preload_registry_from_db(supabase, registry):
    print("--- Preloading Registry from DB ---")
    
    # 1. Companies
    res = supabase.table('companies').select('legacy_id, company_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('COMP-'):
            registry.register('companies', row['legacy_id'].replace('COMP-',''), row['company_id'])
            registry.register('machining_customers', row['legacy_id'].replace('COMP-',''), row['company_id'])
    
    res = supabase.table('companies').select('legacy_id, company_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('CUST-'):
            registry.register('machining_customers', row['legacy_id'].replace('CUST-',''), row['company_id'])
            
    # 2. Employees
    res = supabase.table('employees').select('legacy_id, employee_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('EMP-'):
            registry.register('employees', row['legacy_id'].replace('EMP-',''), row['employee_id'])
            
    # 3. Physical Molds
    res = supabase.table('physical_molds').select('legacy_id, physical_mold_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('MOLD-'):
            registry.register('physical_molds', row['legacy_id'].replace('MOLD-',''), row['physical_mold_id'])
            
    # 4. Design Revisions
    res = supabase.table('design_revisions').select('legacy_id, revision_id, product_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('DESIGN-'):
            legacy_id = row['legacy_id'].replace('DESIGN-','')
            registry.register('design_revisions', legacy_id, row['revision_id'])
            if row['product_id']:
                registry.register('mold_design_to_product', legacy_id, row['product_id'])

def main():
    print("===========================================")
    print("   YSDMS NEXTGEN - V5 SEED (PARTIAL RUN)")
    print("===========================================")
    
    supabase = get_supabase_client()
    registry = IdRegistry()
    
    # 0. Truncate specific tables
    truncate_ysdms_tables(supabase)
    
    # 1. Preload
    preload_registry_from_db(supabase, registry)
    
    start_time = time.time()
    
    try:
        # Run specific importers for missing data
        cutter_importer.import_cutters(supabase, registry)
        job_importer.import_jobs(supabase, registry)
        lifecycle_importer.import_lifecycle(supabase, registry)
        
        print("\n===========================================")
        print(f"   IMPORT HOÀN TẤT THÀNH CÔNG! ({time.time() - start_time:.2f}s)")
        print("===========================================")
    except Exception as e:
        print(f"\n[ERROR] Quá trình import bị lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
