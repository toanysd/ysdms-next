import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, safe_int, safe_float, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

def import_tier2(supabase: Any, registry: IdRegistry, stats: ImportStats, dry_run: bool = False) -> None:
    print("Starting Tier 2 Import: Master Data")
    
    # 2A. Companies (Merge 2 sources)
    print("Importing companies (customers first)...")
    companies_dict: Dict[str, Dict[str, Any]] = {}
    
    try:
        # Customers
        df_customers = read_csv(CSV_DIR / 'customers.csv')
        for _, row in df_customers.iterrows():
            customer_id = clean_id(row.get('CustomerID'))
            if not customer_id:
                continue
            
            comp_id = str(uuid.uuid4())
            legacy_id = f"CUST-{customer_id}"
            company_code = clean_value(row.get('CustomerShortName')) or f"CUST{customer_id}"
            
            record = {
                'company_id': comp_id,
                'legacy_id': legacy_id,
                'company_code': company_code,
                'company_name': company_code, # Fallback
                'company_name_romaji': clean_value(row.get('CustomerRomajiName')),
                'company_type': ['CUSTOMER']
            }
            companies_dict[company_code] = record
            registry.register('customers', customer_id, comp_id)
            registry.register('companies', legacy_id, comp_id)
            
        # Companies
        df_comp = read_csv(CSV_DIR / 'companies.csv')
        for _, row in df_comp.iterrows():
            comp_legacy = clean_id(row.get('CompanyID'))
            if not comp_legacy:
                continue
                
            legacy_id = f"COMP-{comp_legacy}"
            company_code = clean_value(row.get('CompanyShortName'))
            
            if company_code and company_code in companies_dict:
                # Merge logic
                existing = companies_dict[company_code]
                if existing.get('company_name') == existing.get('company_code') and row.get('CompanyName'):
                    existing['company_name'] = clean_value(row.get('CompanyName'))
                
                existing['address'] = clean_value(row.get('CompanyAddress'))
                existing['tel'] = clean_value(row.get('CompanyTEL'))
                existing['fax'] = clean_value(row.get('CompanyFAX'))
                
                registry.register('companies', legacy_id, existing['company_id'])
            else:
                code_to_use = company_code or f"COMP-{comp_legacy}"
                new_id = str(uuid.uuid4())
                record = {
                    'company_id': new_id,
                    'legacy_id': legacy_id,
                    'company_code': code_to_use,
                    'company_name': clean_value(row.get('CompanyName')) or code_to_use,
                    'company_name_romaji': clean_value(row.get('CompanyRomajiName')),
                    'address': clean_value(row.get('CompanyAddress')),
                    'tel': clean_value(row.get('CompanyTEL')),
                    'fax': clean_value(row.get('CompanyFAX')),
                    'company_type': []
                }
                companies_dict[f"{code_to_use}_{comp_legacy}"] = record
                registry.register('companies', legacy_id, new_id)
                
        # Ensure strict company_code uniqueness before upserting
        seen_codes = set()
        company_records = []
        for r in companies_dict.values():
            base_code = r['company_code']
            code = base_code
            counter = 1
            while code in seen_codes:
                counter += 1
                code = f"{base_code}-{counter}"
            r['company_code'] = code
            seen_codes.add(code)
            company_records.append(r)

        if not dry_run and company_records:
            for i in range(0, len(company_records), BATCH_SIZE):
                chunk = company_records[i:i+BATCH_SIZE]
                supabase.table('companies').upsert(chunk).execute()
                print(f"  Inserted {min(i+BATCH_SIZE, len(company_records))} / {len(company_records)} companies")
            stats.record_success('companies', len(company_records))

        mold_owner_records = [{
            'owner_id': r['company_id'],
            'company_id': r['company_id'],
            'owner_code': r['company_code'],
            'owner_name_ja': r['company_name'],
            'is_active': True
        } for r in company_records]

        if not dry_run and mold_owner_records:
            for i in range(0, len(mold_owner_records), BATCH_SIZE):
                chunk = mold_owner_records[i:i+BATCH_SIZE]
                supabase.table('mold_owners').upsert(chunk).execute()
            print(f"  Inserted {len(mold_owner_records)} mold_owners")
            stats.record_success('mold_owners', len(mold_owner_records))
            
    except Exception as e:
        print(f"Error importing companies: {e}")
        stats.record_error('companies', str(e))

    # 2B. Employees
    print("Importing employees...")
    try:
        df_emp = read_csv(CSV_DIR / 'employees.csv')
        emp_records = []
        for _, row in df_emp.iterrows():
            emp_id = clean_id(row.get('EmployeeID'))
            if not emp_id:
                continue
            
            uuid_id = str(uuid.uuid4())
            emp_code = clean_value(row.get('EmployeeOrderCode')) or f"EMP{emp_id.zfill(2)}"
            emp_name = clean_value(row.get('EmployeeName')) or f"Employee {emp_id}"
            
            record = {
                'employee_id': uuid_id,
                'legacy_id': f"EMP-{emp_id}",
                'employee_code': emp_code,
                'employee_name': emp_name,
                'employee_name_short': clean_value(row.get('EmployeeNameShort')),
                'joining_date': parse_date(row.get('JoiningDate')),
                'is_active': True
            }
            emp_records.append(record)
            registry.register('employees', emp_id, uuid_id)
            if emp_code:
                registry.register('employees_by_code', emp_code, uuid_id)
            if emp_name:
                registry.register('employees_by_name', emp_name, uuid_id)
            
        if not dry_run and emp_records:
            for i in range(0, len(emp_records), BATCH_SIZE):
                chunk = emp_records[i:i+BATCH_SIZE]
                supabase.table('employees').upsert(chunk).execute()
                print(f"  Inserted {min(i+BATCH_SIZE, len(emp_records))} / {len(emp_records)} employees")
            stats.record_success('employees', len(emp_records))
    except Exception as e:
        print(f"Error importing employees: {e}")
        stats.record_error('employees', str(e))
        
    # 2C. Delivery Sites
    print("Importing delivery sites...")
    try:
        df_sites = read_csv(CSV_DIR / 'traycustomer.csv')
        site_records = []
        for _, row in df_sites.iterrows():
            legacy_id = clean_id(row.get('TrayCustomerID'))
            if not legacy_id:
                continue
            
            customer_no = clean_id(row.get('CustomerNo'))
            company_id = registry.lookup('customers', customer_no)
            if not company_id:
                continue
            
            site_id = str(uuid.uuid4())
            site_name = clean_value(row.get('Destination')) or f"Site-{legacy_id}"
            record = {
                'site_id': site_id,
                'site_code': f"SITE-{legacy_id}",
                'site_name': site_name,
                'site_address': clean_value(row.get('Address')),
                'company_id': company_id,
                'site_tel': clean_value(row.get('PhoneNumber')),
                'site_fax': clean_value(row.get('FAX'))
            }
            site_records.append(record)
            registry.register('delivery_sites', legacy_id, site_id)
            
        if not dry_run and site_records:
            for i in range(0, len(site_records), BATCH_SIZE):
                chunk = site_records[i:i+BATCH_SIZE]
                supabase.table('delivery_sites').upsert(chunk).execute()
            stats.record_success('delivery_sites', len(site_records))
    except Exception as e:
        print(f"Error importing delivery sites: {e}")
        stats.record_error('delivery_sites', str(e))

    # 2D. Products (Tray = Mold Master)
    print("Importing products...")
    try:
        df_products = read_csv(CSV_DIR / 'tray.csv')
        product_records = []
        seen_product_codes = {}
        for _, row in df_products.iterrows():
            tray_id = clean_id(row.get('TrayID'))
            if not tray_id:
                continue
                
            customer_id = clean_id(row.get('CustomerID'))
            company_id = registry.lookup('customers', customer_id)
            if not company_id:
                continue # NOT NULL constraint
                
            product_id = str(uuid.uuid4())
            mold_tray_name = clean_value(row.get('MoldTrayName'))
            tray_name = clean_value(row.get('TrayName'))
            tray_code_val = clean_value(row.get('TrayCode'))
            customer_tray_name = clean_value(row.get('CustomerTrayName'))

            base_code = mold_tray_name or tray_code_val or f"TRAY-{tray_id}"
            if base_code in seen_product_codes:
                seen_product_codes[base_code] += 1
                p_code = f"{base_code}-{seen_product_codes[base_code]}"
            else:
                seen_product_codes[base_code] = 1
                p_code = base_code

            p_name_internal = mold_tray_name or tray_name or p_code
            p_name = customer_tray_name or p_name_internal

            record = {
                'product_id': product_id,
                'legacy_id': f"TRAY-{tray_id}",
                'product_code': p_code,
                'product_name_internal': p_name_internal,
                'product_name': p_name,
                'customer_product_name': customer_tray_name,
                'company_id': company_id,
                'date_entry': parse_date(row.get('TrayDateEntry')),
                'product_status': 'ACTIVE'
            }
            product_records.append(record)
            registry.register('products', tray_id, product_id)
            if p_code:
                registry.register('products_by_code', p_code, product_id)
                
        if not dry_run and product_records:
            for i in range(0, len(product_records), BATCH_SIZE):
                chunk = product_records[i:i+BATCH_SIZE]
                supabase.table('products').upsert(chunk).execute()
                print(f"  Inserted {min(i+BATCH_SIZE, len(product_records))} / {len(product_records)} products")
            stats.record_success('products', len(product_records))
    except Exception as e:
        print(f"Error importing products: {e}")
        stats.record_error('products', str(e))

    print("Tier 2 Import Complete.")
