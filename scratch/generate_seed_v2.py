import csv
import os
import uuid
from datetime import datetime

SOURCE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_DIR = os.path.join(SOURCE_DIR, "source_data", "csv-access-data")
OUTPUT_FILE = os.path.join(SOURCE_DIR, "supabase", "migrations", "20260606000000_999_seed_legacy_data_v2.sql")

def read_csv(filename):
    path = os.path.join(CSV_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def sql_str(val):
    if not val or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    return "$$" + str(val).replace("$$", "\$\$") + "$$"

def sql_num(val):
    if not val or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    try: return str(float(val))
    except ValueError: return "NULL"

def sql_int(val):
    if not val or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    try: return str(int(float(val)))
    except ValueError: return "NULL"

def sql_bool(val):
    v = str(val).strip().upper()
    if v in ("TRUE", "1", "YES"): return "true"
    return "false"

def main():
    f = open(OUTPUT_FILE, "w", encoding="utf-8")
    f.write("BEGIN;\n\n")

    # 1. ADD LEGACY_ID COLUMNS
    f.write("-- [0] ADD LEGACY ID COLUMNS FOR MAPPING\n")
    tables = [
        "companies", "employees", "products", "design_projects", 
        "design_masters", "mold_designs", "mold_masters", 
        "mold_revisions", "physical_molds", "cutter_masters", "cutters"
    ]
    for tbl in tables:
        f.write(f"ALTER TABLE public.{tbl} ADD COLUMN IF NOT EXISTS legacy_id TEXT;\n")
    f.write("\n")

    # Mappings
    comp_map = {}
    emp_map = {}
    design_map = {} # old_id -> {'product_id', 'design_master_id'}

    # 2. COMPANIES
    f.write("-- [1] COMPANIES\n")
    for r in read_csv("companies.csv"):
        old_id = r.get("CompanyID")
        if not old_id: continue
        new_id = str(uuid.uuid4())
        comp_map[old_id] = new_id
        
        c_code = r.get("CompanyShortName") or f"COMP-{old_id}"
        c_name = r.get("CompanyName") or c_code
        c_type = "CUSTOMER" # Assume customer by default for migrated data
        
        f.write(f"INSERT INTO public.companies (company_id, company_code, company_name, company_type, legacy_id) ")
        f.write(f"VALUES ('{new_id}', {sql_str(c_code)}, {sql_str(c_name)}, '{c_type}', {sql_str(old_id)}) ")
        f.write("ON CONFLICT (company_code) DO UPDATE SET legacy_id = EXCLUDED.legacy_id RETURNING company_id;\n")

    # 3. EMPLOYEES
    f.write("\n-- [2] EMPLOYEES\n")
    for r in read_csv("employees.csv"):
        old_id = r.get("EmployeeID")
        if not old_id: continue
        new_id = str(uuid.uuid4())
        emp_map[old_id] = new_id
        
        e_code = f"EMP-{old_id}"
        e_name = r.get("EmployeeName") or "Unknown"
        
        f.write(f"INSERT INTO public.employees (employee_id, employee_code, employee_name, legacy_id) ")
        f.write(f"VALUES ('{new_id}', {sql_str(e_code)}, {sql_str(e_name)}, {sql_str(old_id)}) ")
        f.write("ON CONFLICT (employee_code) DO NOTHING;\n")

    # 4. MOLD DESIGNS (Transforms to Products, Design Projects, Design Masters, Mold Designs)
    f.write("\n-- [3] DESIGNS & PRODUCTS\n")
    default_company_id = list(comp_map.values())[0] if comp_map else "NULL"
    
    for r in read_csv("molddesign.csv"):
        old_id = r.get("MoldDesignID")
        if not old_id: continue
        
        prod_id = str(uuid.uuid4())
        proj_id = str(uuid.uuid4())
        dmaster_id = str(uuid.uuid4())
        mdesign_id = str(uuid.uuid4())
        
        design_map[old_id] = {
            'product_id': prod_id,
            'design_master_id': dmaster_id
        }
        
        d_code = r.get("MoldDesignCode") or f"DSGN-{old_id}"
        d_name = r.get("MoldDesignName") or d_code
        cust_id = comp_map.get(r.get("CustomerID"))
        cust_sql = f"'{cust_id}'" if cust_id else default_company_id
        if cust_sql == "NULL": cust_sql = "NULL" # safe fallback
        
        # Product
        f.write(f"INSERT INTO public.products (product_id, product_code, product_name_ja, customer_id, legacy_id) ")
        f.write(f"VALUES ('{prod_id}', {sql_str(d_code)}, {sql_str(d_name)}, {cust_sql}, {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Design Project
        f.write(f"INSERT INTO public.design_projects (project_id, project_code, project_name, company_id, legacy_id) ")
        f.write(f"VALUES ('{proj_id}', {sql_str(d_code)}, {sql_str(d_name)}, {cust_sql}, {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Mold Design
        f.write(f"INSERT INTO public.mold_designs (design_id, design_code, project_id, legacy_id) ")
        f.write(f"VALUES ('{mdesign_id}', {sql_str(d_code)}, '{proj_id}', {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Design Master
        f.write(f"INSERT INTO public.design_masters (design_master_id, design_code, product_id, legacy_id) ")
        f.write(f"VALUES ('{dmaster_id}', {sql_str(d_code)}, '{prod_id}', {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")

    # 5. MOLDS
    f.write("\n-- [4] MOLDS\n")
    for r in read_csv("molds.csv"):
        old_id = r.get("MoldID")
        if not old_id: continue
        
        d_id = r.get("MoldDesignID")
        m_code = r.get("MoldCode") or f"MOLD-{old_id}"
        m_name = r.get("MoldName") or m_code
        
        cust_id = comp_map.get(r.get("CustomerID"))
        cust_sql = f"'{cust_id}'" if cust_id else default_company_id
        
        # Handle Missing Design
        if not d_id or d_id not in design_map:
            # Auto-generate dummy design as requested by user
            prod_id = str(uuid.uuid4())
            proj_id = str(uuid.uuid4())
            dmaster_id = str(uuid.uuid4())
            
            dummy_code = f"AUTO-DSGN-FOR-{m_code}"
            dummy_note = "Tên thiết kế tự động được tạo ra do dữ liệu cũ bị khuyết"
            
            f.write(f"INSERT INTO public.products (product_id, product_code, product_name_ja, customer_id, legacy_id) VALUES ('{prod_id}', {sql_str(dummy_code)}, {sql_str(dummy_note)}, {cust_sql}, {sql_str(old_id+'-dummy')}) ON CONFLICT DO NOTHING;\n")
            f.write(f"INSERT INTO public.design_projects (project_id, project_code, project_name, company_id, legacy_id) VALUES ('{proj_id}', {sql_str(dummy_code)}, {sql_str(dummy_note)}, {cust_sql}, {sql_str(old_id+'-dummy')}) ON CONFLICT DO NOTHING;\n")
            f.write(f"INSERT INTO public.design_masters (design_master_id, design_code, product_id, legacy_id) VALUES ('{dmaster_id}', {sql_str(dummy_code)}, '{prod_id}', {sql_str(old_id+'-dummy')}) ON CONFLICT DO NOTHING;\n")
            
            d_info = {'product_id': prod_id, 'design_master_id': dmaster_id}
        else:
            d_info = design_map[d_id]
            
        mmaster_id = str(uuid.uuid4())
        mrev_id = str(uuid.uuid4())
        phys_id = str(uuid.uuid4())
        
        # Mold Master
        f.write(f"INSERT INTO public.mold_masters (mold_master_id, mold_master_code, mold_master_name, design_master_id, company_id, product_id, legacy_id) ")
        f.write(f"VALUES ('{mmaster_id}', {sql_str(m_code)}, {sql_str(m_name)}, '{d_info['design_master_id']}', {cust_sql}, '{d_info['product_id']}', {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Mold Revision
        f.write(f"INSERT INTO public.mold_revisions (revision_id, mold_master_id, revision_code, legacy_id) ")
        f.write(f"VALUES ('{mrev_id}', '{mmaster_id}', {sql_str(m_code+'-R1')}, {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Physical Mold
        status = r.get("DeviceStatus") or 'ACTIVE'
        storage = r.get("MoldUsageStatus") or 'IN_STOCK'
        
        f.write(f"INSERT INTO public.physical_molds (physical_mold_id, system_code, display_name, mold_revision_id, device_status, usage_status, actual_length_mm, actual_width_mm, actual_height_mm, actual_weight, legacy_id) ")
        f.write(f"VALUES ('{phys_id}', {sql_str(m_code)}, {sql_str(m_name)}, '{mrev_id}', {sql_str(status)}, {sql_str(storage)}, {sql_num(r.get('MoldLengthModified'))}, {sql_num(r.get('MoldWidthModified'))}, {sql_num(r.get('MoldHeightModified'))}, {sql_num(r.get('MoldWeight'))}, {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")

    # 6. CUTTERS
    f.write("\n-- [5] CUTTERS\n")
    for r in read_csv("cutters.csv"):
        old_id = r.get("CutterID")
        if not old_id: continue
        
        c_code = r.get("CutterCode") or f"CUT-{old_id}"
        c_name = r.get("CutterName") or c_code
        
        cmaster_id = str(uuid.uuid4())
        phys_id = str(uuid.uuid4())
        
        # Cutter Master
        f.write(f"INSERT INTO public.cutter_masters (cutter_master_id, cutter_code, cutter_name, legacy_id) ")
        f.write(f"VALUES ('{cmaster_id}', {sql_str(c_code)}, {sql_str(c_name)}, {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")
        
        # Physical Cutter
        f.write(f"INSERT INTO public.cutters (cutter_id, system_code, cutter_master_id, legacy_id) ")
        f.write(f"VALUES ('{phys_id}', {sql_str(c_code)}, '{cmaster_id}', {sql_str(old_id)}) ON CONFLICT DO NOTHING;\n")

    f.write("\nCOMMIT;\n")
    f.close()
    print(f"✅ Generated migration SQL at: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
