import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from config import get_supabase_client
from utils import IdRegistry
from importers import lookups_importer, master_importer, mold_importer, cutter_importer, job_importer, lifecycle_importer

# Tables in reverse dependency order
TABLES_TO_TRUNCATE = [
    # Removed mold_masters and cutter_masters as they are being dropped
    ("mold_loan_certificates", "certificate_id"),
    ("mold_location_history", "location_log_id"),
    ("mold_maintenance", "maintenance_id"),
    ("work_logs", "log_id"),
    ("job_steps", "step_id"),
    ("jobs", "job_id"),
    ("mold_design_cutters", "id"),
    ("cutters", "cutter_id"),
    ("physical_molds", "physical_mold_id"),
    ("mold_revisions", "revision_id"),
    ("design_revisions", "revision_id"),
    ("products", "product_id"),
    ("employees", "employee_id"),
    ("companies", "company_id"),
    ("rack_layers", "id"),
    ("racks", "id"),
    ("destinations", "destination_id"),
    ("machines", "machine_id"),
    ("cav_types", "cav_type_id"),
    ("item_types", "item_type_id"),
    ("processing_statuses", "status_id"),
    ("processing_codes", "processing_code_id")
]

def truncate_ysdms_tables(supabase):
    print("--- Bắt đầu dọn dẹp dữ liệu cũ (YSDMS Tables) ---")
    print("LƯU Ý: Các bảng hệ thống (như omni_*) sẽ KHÔNG BỊ XÓA.")
    
    # Confirm disabled for unattended execution
    # confirm = input("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu YSDMS hiện tại? (y/N): ")
    # if confirm.lower() != 'y':
    #     print("Đã hủy quá trình import.")
    #     sys.exit(0)

    for table, pk_col in TABLES_TO_TRUNCATE:
        print(f"Truncating {table}...")
        try:
            while True:
                try:
                    res = supabase.table(table).delete().neq(pk_col, "00000000-0000-0000-0000-000000000000").execute()
                except Exception as e:
                    res = supabase.table(table).delete().neq(pk_col, -1).execute()
                
                if len(res.data) < 1000:
                    break
        except Exception as e:
            print(f"Warning: Failed to delete {table}: {e}")
            print(f"Warning: Unexpected error when deleting {table}: {e}")

def main():
    print("===========================================")
    print("   YSDMS NEXTGEN - V5 SEED SCRIPT (PYTHON)")
    print("===========================================")
    
    supabase = get_supabase_client()
    registry = IdRegistry()
    
    # 0. Truncate
    truncate_ysdms_tables(supabase)
    
    start_time = time.time()
    
    try:
        # 1. Lookups
        lookups_importer.import_lookups(supabase, registry)
        
        # 2. Master
        master_importer.import_master_data(supabase, registry)
        
        # 3. Mold Hierarchy
        mold_importer.import_mold_hierarchy(supabase, registry)
        
        # 4. Cutters
        cutter_importer.import_cutters(supabase, registry)
        
        # 5. Jobs
        job_importer.import_jobs(supabase, registry)
        
        # 6. Lifecycle
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
