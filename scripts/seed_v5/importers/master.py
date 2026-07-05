import uuid
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_master_data(supabase, registry: IdRegistry):
    print("--- Importing Master Data ---")
    
    # 1. companies
    company_dict = {}
    code_to_uuid = {}
    
    # customers.csv -> CUSTOMER
    df_customers = clean_dataframe(read_csv_safe(CSV_DIR / 'customers.csv'))
    for _, row in df_customers.iterrows():
        legacy_id = f"C_{row['CustomerID']}"
        company_code = str(row['CustomerShortName']) if row['CustomerShortName'] else legacy_id
        
        if company_code in code_to_uuid:
            company_uuid = code_to_uuid[company_code]
            if 'CUSTOMER' not in company_dict[company_uuid]['company_type']:
                company_dict[company_uuid]['company_type'].append('CUSTOMER')
        else:
            company_uuid = str(uuid.uuid4())
            code_to_uuid[company_code] = company_uuid
            company_dict[company_uuid] = {
                'company_id': company_uuid,
                'legacy_id': legacy_id,
                'company_code': company_code,
                'company_name': str(row['CustomerShortName']) if row['CustomerShortName'] else "Unknown",
                'company_name_romaji': str(row['CustomerRomajiName']) if row['CustomerRomajiName'] else None,
                'company_type': ['CUSTOMER'],
                'is_active': True,
                'notes': str(row['CustomerNotes']) if row['CustomerNotes'] else None
            }
            
        registry.register('companies', legacy_id, company_uuid)
        registry.register('customers', str(row['CustomerID']), company_uuid)
        
    # companies.csv -> SUPPLIER/OUTSOURCE?
    df_companies = clean_dataframe(read_csv_safe(CSV_DIR / 'companies.csv'))
    for _, row in df_companies.iterrows():
        legacy_id = f"COMP_{row['CompanyID']}"
        company_code = str(row['CompanyShortName']) if row['CompanyShortName'] else legacy_id
        
        if company_code in code_to_uuid:
            company_uuid = code_to_uuid[company_code]
        else:
            company_uuid = str(uuid.uuid4())
            code_to_uuid[company_code] = company_uuid
            company_dict[company_uuid] = {
                'company_id': company_uuid,
                'legacy_id': legacy_id,
                'company_code': company_code,
                'company_name': str(row['CompanyName']) if row['CompanyName'] else str(row['CompanyShortName']),
                'company_name_romaji': str(row['CompanyRomajiName']) if row['CompanyRomajiName'] else None,
                'address': str(row['CompanyAddress']) if row['CompanyAddress'] else None,
                'tel': str(row['CompanyTEL']) if row['CompanyTEL'] else None,
                'fax': str(row['CompanyFAX']) if row['CompanyFAX'] else None,
                'company_type': [],
                'is_active': True
            }
            
        registry.register('companies', legacy_id, company_uuid)
        registry.register('companies_raw', str(row['CompanyID']), company_uuid)

    # machiningcustomer.csv -> OUTSOURCE
    df_mc = clean_dataframe(read_csv_safe(CSV_DIR / 'machiningcustomer.csv'))
    for _, row in df_mc.iterrows():
        legacy_id = f"MC_{row['MachiningCustomerID']}"
        company_code = str(row['MachiningCustomer']) if row['MachiningCustomer'] else legacy_id
        
        if company_code in code_to_uuid:
            company_uuid = code_to_uuid[company_code]
            if 'OUTSOURCE' not in company_dict[company_uuid]['company_type']:
                company_dict[company_uuid]['company_type'].append('OUTSOURCE')
        else:
            company_uuid = str(uuid.uuid4())
            code_to_uuid[company_code] = company_uuid
            company_dict[company_uuid] = {
                'company_id': company_uuid,
                'legacy_id': legacy_id,
                'company_code': company_code,
                'company_name': str(row['MachiningCustomer']),
                'company_type': ['OUTSOURCE'],
                'address': str(row['MachiningCustomerLocation']) if row['MachiningCustomerLocation'] else None,
                'tel': str(row['TEL']) if row['TEL'] else None,
                'fax': str(row['FAX']) if row['FAX'] else None,
                'is_active': True
            }
            
        registry.register('companies', legacy_id, company_uuid)
        registry.register('machining_customers', str(row['MachiningCustomerID']), company_uuid)

    # Add an UNKNOWN company for fallbacks
    unknown_uuid = str(uuid.uuid4())
    company_dict[unknown_uuid] = {
        'company_id': unknown_uuid,
        'legacy_id': 'C_UNKNOWN',
        'company_code': 'UNKNOWN',
        'company_name': 'Unknown Customer',
        'company_type': ['CUSTOMER'],
        'is_active': True
    }
    registry.register('companies', 'UNKNOWN', unknown_uuid)
    registry.register('customers', 'UNKNOWN', unknown_uuid)

    company_records = list(company_dict.values())

    if company_records:
        # Split into chunks of 1000 if necessary, but 1000-2000 records should be fine in one go
        chunk_size = 500
        for i in range(0, len(company_records), chunk_size):
            supabase.table('companies').insert(company_records[i:i+chunk_size]).execute()
        print(f"Imported {len(company_records)} companies")

    # 2. employees
    df_emp = clean_dataframe(read_csv_safe(CSV_DIR / 'employees.csv'))
    emp_records = []
    for _, row in df_emp.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['EmployeeID'])
        registry.register('employees', legacy_id, new_uuid)
        
        emp_records.append({
            'employee_id': new_uuid,
            'legacy_id': legacy_id,
            'employee_code': str(row['EmployeeNameShort']) if row['EmployeeNameShort'] else legacy_id,
            'employee_name': str(row['EmployeeName']) if row['EmployeeName'] else "Unknown",
            'is_active': True
        })
    if emp_records:
        supabase.table('employees').insert(emp_records).execute()
        print(f"Imported {len(emp_records)} employees")

    # 3. products (from tray.csv)
    import re
    df_tray = clean_dataframe(read_csv_safe(CSV_DIR / 'tray.csv'))
    product_records = []
    product_codes_seen = set()
    for _, row in df_tray.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['TrayID'])
        registry.register('products', legacy_id, new_uuid)
        registry.register('trays', legacy_id, new_uuid)
        
        customer_uuid = registry.resolve('customers', row['CustomerID'])
        
        # MoldTrayName = tên nội bộ YSD (VD: ADY-071, JAE-036, TE-1-078-9)
        mold_tray_name = str(row['MoldTrayName']).strip() if row['MoldTrayName'] else None
        
        # product_code = mã nội bộ YSD compact (bỏ gạch ngang, cách)
        if mold_tray_name:
            base_code = re.sub(r'[\s\-]+', '', mold_tray_name)
        else:
            base_code = f"TRAY{legacy_id}"
        # Đảm bảo unique
        product_code = base_code
        counter = 1
        while product_code in product_codes_seen:
            product_code = f"{base_code}_{counter}"
            counter += 1
        product_codes_seen.add(product_code)
        
        product_records.append({
            'product_id': new_uuid,
            'legacy_id': legacy_id,
            'product_code': product_code,                    # YSD compact: ADY071
            'product_name_internal': mold_tray_name,         # YSD display: ADY-071
            'product_name': None,                            # Tên chính thức từ KH (nhập sau)
            'company_id': customer_uuid,
            'product_status': 'ACTIVE',
            'notes': str(row['TrayOrderNotes']) if row['TrayOrderNotes'] else None
        })
        
    if product_records:
        chunk_size = 500
        for i in range(0, len(product_records), chunk_size):
            supabase.table('products').insert(product_records[i:i+chunk_size]).execute()
        print(f"Imported {len(product_records)} products")


