# -*- coding: utf-8 -*-
"""
Create Design Revisions & Minimal Products for Phase 3 Unverified Molds.
- Creates design_revisions records for ALL 1,680 unverified molds using 'design_code'.
- Creates minimal products records for 1,631 processed molds (加工済み).
- Establishes 3-tier linkage: Company -> Product -> Design Revision -> Equipment.
"""
import sys
import os
import json
import urllib.request
import urllib.parse
import re

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"

SERVER_CATALOG = r'source_data/mold_server_catalog.json'

def process():
    print("=== CREATING DESIGN REVISIONS & PRODUCTS FOR 1,680 MOLDS ===")

    # 1. Fetch company mappings
    code_to_id = {}
    for page in range(5):
        url = f"{SUPABASE_URL}/rest/v1/companies?select=company_id,company_code"
        req = urllib.request.Request(url, headers={'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for c in data:
                if c.get('company_code'):
                    code_to_id[c['company_code']] = c['company_id']

    default_company_id = code_to_id.get('YSD') or list(code_to_id.values())[0]
    print(f"Loaded {len(code_to_id)} company mappings.")

    # Load server catalog
    with open(SERVER_CATALOG, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    catalog_by_code = {c.get('extracted_code'): c for c in catalog if c.get('extracted_code')}

    # 2. Fetch UNVERIFIED molds
    query_notes = urllib.parse.quote('*quét thư mục CAD Server*')
    url = f'{SUPABASE_URL}/rest/v1/equipment?select=equipment_id,equipment_code,display_name,notes&device_status=eq.UNVERIFIED'

    unverified_molds = []
    for page in range(5):
        req = urllib.request.Request(url, headers={'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            unverified_molds.extend(data)
            if len(data) < 1000:
                break

    print(f"Fetched {len(unverified_molds)} UNVERIFIED molds from DB.")

    created_products_count = 0
    created_designs_count = 0
    updated_equipment_count = 0

    batch_size = 50

    # 3. Process in batches
    for i in range(0, len(unverified_molds), batch_size):
        batch = unverified_molds[i:i+batch_size]

        # A. Prepare & Insert Products
        products_to_insert = []
        for m in batch:
            m_code = m['equipment_code']
            m_name = m.get('display_name') or m_code
            cat_entry = catalog_by_code.get(m_code) or {}
            source_type = cat_entry.get('source', 'quotation_projects')

            prefix_match = re.match(r'^([A-Za-z0-9]+)[-_\s]', m_code)
            c_code = prefix_match.group(1).upper() if prefix_match else 'YSD'
            c_id = code_to_id.get(c_code, default_company_id)

            prod_code = f"PRD-{m_code}"

            if source_type == 'processed_molds':
                products_to_insert.append({
                    "product_code": prod_code,
                    "product_name": m_name,
                    "product_name_internal": m_name,
                    "company_id": c_id,
                    "product_status": "ACTIVE",
                    "notes": f"Khởi tạo tự động từ thư mục CAD Server gia công ({m_code})"
                })

        code_to_product_id = {}
        if products_to_insert:
            p_url = f"{SUPABASE_URL}/rest/v1/products?on_conflict=product_code"
            p_body = json.dumps(products_to_insert).encode('utf-8')
            p_headers = {'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=representation'}
            try:
                p_req = urllib.request.Request(p_url, data=p_body, headers=p_headers, method="POST")
                with urllib.request.urlopen(p_req) as resp:
                    p_res = json.loads(resp.read().decode('utf-8'))
                    for prd in p_res:
                        code_to_product_id[prd['product_code']] = prd['product_id']
                    created_products_count += len(p_res)
            except Exception as e:
                pass

        # B. Prepare & Insert Design Revisions
        designs_to_insert = []
        for m in batch:
            m_code = m['equipment_code']
            m_name = m.get('display_name') or m_code
            cat_entry = catalog_by_code.get(m_code) or {}
            cad_path = cat_entry.get('cad_folder_path')

            prefix_match = re.match(r'^([A-Za-z0-9]+)[-_\s]', m_code)
            c_code = prefix_match.group(1).upper() if prefix_match else 'YSD'
            c_id = code_to_id.get(c_code, default_company_id)

            prod_code = f"PRD-{m_code}"
            p_id = code_to_product_id.get(prod_code)

            d_code = f"REV-{m_code}"
            designs_to_insert.append({
                "design_code": d_code,
                "revision_number": 1,
                "cad_folder_path": cad_path,
                "company_id": c_id,
                "product_id": p_id,
                "tray_info": m_name,
                "status": "APPROVED",
                "version_note": f"Bản vẽ khởi tạo tự động từ thư mục CAD Server ({m_code})"
            })

        code_to_design_id = {}
        if designs_to_insert:
            d_url = f"{SUPABASE_URL}/rest/v1/design_revisions"
            d_body = json.dumps(designs_to_insert).encode('utf-8')
            d_headers = {'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'application/json', 'Prefer': 'return=representation'}
            try:
                d_req = urllib.request.Request(d_url, data=d_body, headers=d_headers, method="POST")
                with urllib.request.urlopen(d_req) as resp:
                    d_res = json.loads(resp.read().decode('utf-8'))
                    for d in d_res:
                        code_to_design_id[d['design_code']] = d['revision_id']
                    created_designs_count += len(d_res)
            except Exception as e:
                # If error, try single inserts
                for d_item in designs_to_insert:
                    try:
                        d_req_s = urllib.request.Request(d_url, data=json.dumps([d_item]).encode('utf-8'), headers=d_headers, method="POST")
                        with urllib.request.urlopen(d_req_s) as resp_s:
                            d_res_s = json.loads(resp_s.read().decode('utf-8'))
                            code_to_design_id[d_res_s[0]['design_code']] = d_res_s[0]['revision_id']
                            created_designs_count += 1
                    except Exception as e_single:
                        pass

        # C. Update equipment with design_revision_id
        for m in batch:
            m_id = m['equipment_id']
            m_code = m['equipment_code']
            d_code = f"REV-{m_code}"
            d_id = code_to_design_id.get(d_code)
            if d_id:
                eq_url = f"{SUPABASE_URL}/rest/v1/equipment?equipment_id=eq.{m_id}"
                eq_body = json.dumps({"design_revision_id": d_id}).encode('utf-8')
                eq_req = urllib.request.Request(eq_url, data=eq_body, headers={'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'application/json'}, method="PATCH")
                try:
                    with urllib.request.urlopen(eq_req) as resp:
                        updated_equipment_count += 1
                except Exception as e:
                    pass

    print(f"\n=== LINKAGE SETUP COMPLETED ===")
    print(f"Created/Linked Products         : {created_products_count}")
    print(f"Created/Linked Design Revisions : {created_designs_count}")
    print(f"Linked Equipment Records       : {updated_equipment_count}")

if __name__ == '__main__':
    process()
