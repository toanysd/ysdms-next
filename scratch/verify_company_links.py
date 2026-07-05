import os
import sys
from supabase import create_client

ENV_FILE = ".env.local"

def load_env(env_path=ENV_FILE):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip()
    return env_vars

def fetch_all_rows(client, table, columns):
    rows = []
    page_size = 1000
    start = 0
    while True:
        end = start + page_size - 1
        res = client.table(table).select(columns).range(start, end).execute()
        if not res.data:
            break
        rows.extend(res.data)
        if len(res.data) < page_size:
            break
        start += page_size
    return rows

def main():
    print("=== STARTING VERIFICATION CLIENT-SIDE ORPHAN CHECK ===")
    
    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not service_key:
        print("Missing SUPABASE credentials in .env.local")
        sys.exit(1)
        
    supabase = create_client(supabase_url, service_key)
    
    # Fetch all company_ids
    print("Fetching companies...")
    companies = fetch_all_rows(supabase, "companies", "company_id")
    company_ids = {c['company_id'] for c in companies}
    print(f"Loaded {len(company_ids)} company IDs.")
    
    # 1. Check products
    print("Fetching products...")
    products = fetch_all_rows(supabase, "products", "product_id, company_id")
    orphaned_prod = [p for p in products if p.get("company_id") and p.get("company_id") not in company_ids]
    print(f"Products check: {len(orphaned_prod)} orphaned records out of {len(products)}")
    
    # 2. Check mold_masters
    print("Fetching mold_masters...")
    mold_masters = fetch_all_rows(supabase, "mold_masters", "mold_master_id, company_id")
    orphaned_mm = [m for m in mold_masters if m.get("company_id") and m.get("company_id") not in company_ids]
    print(f"Mold Masters check: {len(orphaned_mm)} orphaned records out of {len(mold_masters)}")
    
    # 3. Check design_revisions
    print("Fetching design_revisions...")
    design_revisions = fetch_all_rows(supabase, "design_revisions", "revision_id, company_id")
    orphaned_dr = [d for d in design_revisions if d.get("company_id") and d.get("company_id") not in company_ids]
    print(f"Design Revisions check: {len(orphaned_dr)} orphaned records out of {len(design_revisions)}")
    
    # 4. Verify specific mapping results
    # - TrayID = 2 (TE-1-078-9) -> Expected company_code = 'TE'.
    print("\nVerifying specific mapping: TrayID = 2 -> company_code = 'TE' in products")
    prod_res = supabase.table("products").select("product_id, company_id, legacy_id").eq("legacy_id", "2").execute()
    if prod_res.data:
        for prod in prod_res.data:
            comp_id = prod.get("company_id")
            if comp_id:
                comp_res = supabase.table("companies").select("company_code").eq("company_id", comp_id).execute()
                if comp_res.data:
                    code = comp_res.data[0].get("company_code")
                    print(f"Product ID: {prod['product_id']}, legacy_id: {prod['legacy_id']} -> company_id: {comp_id} -> company_code: '{code}'")
                    if code == 'TE':
                        print("SUCCESS: Product with legacy_id='2' correctly mapped to 'TE'")
                    else:
                        print(f"FAIL: Product with legacy_id='2' mapped to '{code}' (expected 'TE')")
                else:
                    print(f"FAIL: Company with ID {comp_id} not found in companies table.")
            else:
                print(f"FAIL: Product with legacy_id='2' has company_id = NULL.")
    else:
        print("Product with legacy_id = '2' not found in database.")

    # - MoldDesignID = 1 (12X356X460) -> Expected company_code = 'Other' (CustomerID = 244 in customers.csv).
    print("\nVerifying specific mapping: MoldDesignID = 1 -> company_code = 'Other' in mold_masters")
    mm_res = supabase.table("mold_masters").select("mold_master_id, company_id, legacy_id").eq("legacy_id", "1").execute()
    if mm_res.data:
        for mm in mm_res.data:
            comp_id = mm.get("company_id")
            if comp_id:
                comp_res = supabase.table("companies").select("company_code").eq("company_id", comp_id).execute()
                if comp_res.data:
                    code = comp_res.data[0].get("company_code")
                    print(f"Mold Master ID: {mm['mold_master_id']}, legacy_id: {mm['legacy_id']} -> company_id: {comp_id} -> company_code: '{code}'")
                    if code == 'Other':
                        print("SUCCESS: Mold Master with legacy_id='1' correctly mapped to 'Other'")
                    else:
                        print(f"FAIL: Mold Master with legacy_id='1' mapped to '{code}' (expected 'Other')")
                else:
                    print(f"FAIL: Company with ID {comp_id} not found in companies table.")
            else:
                print(f"FAIL: Mold Master with legacy_id='1' has company_id = NULL.")
    else:
        print("Mold Master with legacy_id = '1' not found in database.")

    print("\nVerifying specific mapping: MoldDesignID = 1 -> company_code = 'Other' in design_revisions")
    dr_res = supabase.table("design_revisions").select("revision_id, company_id, legacy_id").eq("legacy_id", "1").execute()
    if dr_res.data:
        for dr in dr_res.data:
            comp_id = dr.get("company_id")
            if comp_id:
                comp_res = supabase.table("companies").select("company_code").eq("company_id", comp_id).execute()
                if comp_res.data:
                    code = comp_res.data[0].get("company_code")
                    print(f"Design Revision ID: {dr['revision_id']}, legacy_id: {dr['legacy_id']} -> company_id: {comp_id} -> company_code: '{code}'")
                    if code == 'Other':
                        print("SUCCESS: Design Revision with legacy_id='1' correctly mapped to 'Other'")
                    else:
                        print(f"FAIL: Design Revision with legacy_id='1' mapped to '{code}' (expected 'Other')")
                else:
                    print(f"FAIL: Company with ID {comp_id} not found in companies table.")
            else:
                print(f"FAIL: Design Revision with legacy_id='1' has company_id = NULL.")
    else:
        print("Design Revision with legacy_id = '1' not found in database.")

    if len(orphaned_prod) == 0 and len(orphaned_mm) == 0 and len(orphaned_dr) == 0:
        print("\nOVERALL STATUS: PASS - All links are valid and correct!")
    else:
        print("\nOVERALL STATUS: FAIL - Found orphaned links!")

if __name__ == "__main__":
    main()
