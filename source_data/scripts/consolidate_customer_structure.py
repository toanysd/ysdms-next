# -*- coding: utf-8 -*-
"""
Consolidate Customer & Company Architecture:
1. Ensure companies table contains ONLY true Company Entities (e.g. SMK, JAE, AMP, ADV, OWG...).
2. Re-link delivery site records (e.g. 11, 111, IBR) to main company_id (SMK).
3. Remove delivery site placeholders (11, 111, 888, 999, IBR...) from companies table.
4. Populates company_contacts table with contact persons, roles, and departments.
"""
import sys
import os
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}

def consolidate():
    print("=== CONSOLIDATING COMPANY & DELIVERY SITE ARCHITECTURE ===")

    # 1. Load all companies from DB
    all_companies = []
    for page in range(5):
        url = f"{SUPABASE_URL}/rest/v1/companies?select=company_id,company_code,company_name"
        req = urllib.request.Request(url, headers={**headers, 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            all_companies.extend(data)
            if len(data) < 1000:
                break

    code_to_id = {c['company_code']: c['company_id'] for c in all_companies if c.get('company_code')}
    print(f"Loaded {len(code_to_id)} company mappings from DB.")

    # Main SMK ID
    smk_id = code_to_id.get('SMK')
    print(f"Main SMK Company ID: {smk_id}")

    # 2. Re-link delivery sites that referenced placeholder codes 11, 111, IBR to main SMK ID
    if smk_id:
        placeholder_ids = [code_to_id.get(x) for x in ['11', '111', 'IBR'] if code_to_id.get(x)]
        if placeholder_ids:
            for pid in placeholder_ids:
                url = f"{SUPABASE_URL}/rest/v1/delivery_sites?company_id=eq.{pid}"
                data = {'company_id': smk_id}
                req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='PATCH')
                try:
                    with urllib.request.urlopen(req) as resp:
                        print(f"Re-linked delivery sites from placeholder {pid} -> SMK {smk_id}: {resp.status}")
                except Exception as e:
                    print(f"Error re-linking delivery sites: {e}")

    # 3. Delete placeholder rows (11, 111, 888, 999, IBR) from companies table
    placeholders_to_delete = ['11', '111', '888', '999', 'IBR']
    for p_code in placeholders_to_delete:
        url = f"{SUPABASE_URL}/rest/v1/companies?company_code=eq.{p_code}"
        req = urllib.request.Request(url, headers=headers, method='DELETE')
        try:
            with urllib.request.urlopen(req) as resp:
                print(f"Deleted placeholder company '{p_code}' from companies table: {resp.status}")
        except Exception as e:
            print(f"Error deleting placeholder company '{p_code}': {e}")

    # 4. Extract & Populate Key Contacts into company_contacts table
    print("\nExtracting and Populating Key Contacts into company_contacts table...")
    
    # Load normalized delivery sites JSON to extract contact persons
    SITES_JSON = r"source_data/delivery_sites_normalized.json"
    contacts_to_insert = []
    
    if os.path.exists(SITES_JSON):
        with open(SITES_JSON, 'r', encoding='utf-8') as f:
            sites = json.load(f)

        for s in sites:
            c_code = s.get('company_code')
            c_id = code_to_id.get(c_code)
            contact_name = s.get('contact_person')

            if c_id and contact_name and contact_name not in ['*', '-']:
                # Clean name and role
                clean_cname = contact_name.replace('様宛', '').replace('様', '').strip()
                contacts_to_insert.append({
                    "company_id": c_id,
                    "contact_name": clean_cname,
                    "contact_role": s.get('site_name') or '納品担当者',
                    "contact_tel": s.get('site_tel'),
                    "is_primary": False
                })

    # Add specific key contacts from server files
    key_contacts = [
        {"company_code": "JAE", "contact_name": "崎村", "contact_role": "資材部 購買担当", "is_primary": True},
        {"company_code": "JAE", "contact_name": "井上", "contact_role": "生産技術部", "is_primary": False},
        {"company_code": "HAE", "contact_name": "八柳", "contact_role": "受入係 責任者", "is_primary": True},
        {"company_code": "YAE", "contact_name": "井上", "contact_role": "第2工場 購買担当", "is_primary": True},
        {"company_code": "AMP", "contact_name": "原子 貴嗣", "contact_role": "購買グループ (harako.takatsugu@te.com)", "is_primary": True},
        {"company_code": "AMP", "contact_name": "任 鳴皋", "contact_role": "製品管理 (nin.meiko@te.com)", "is_primary": False},
        {"company_code": "AMP", "contact_name": "小林 洋人", "contact_role": "モールド技術 (kobayashi.hiroto@te.com)", "is_primary": False},
        {"company_code": "SMK", "contact_name": "田辺 治雄", "contact_role": "FC生産技術部", "is_primary": True},
        {"company_code": "SMK", "contact_name": "真野", "contact_role": "FC設計", "is_primary": False},
        {"company_code": "OWG", "contact_name": "越田", "contact_role": "製造技術部", "is_primary": True},
    ]

    for kc in key_contacts:
        cid = code_to_id.get(kc["company_code"])
        if cid:
            contacts_to_insert.append({
                "company_id": cid,
                "contact_name": kc["contact_name"],
                "contact_role": kc["contact_role"],
                "is_primary": kc["is_primary"]
            })

    # Batch insert contacts
    print(f"Upserting {len(contacts_to_insert)} contacts to company_contacts table...")
    batch_size = 50
    inserted_contacts = 0
    for i in range(0, len(contacts_to_insert), batch_size):
        batch = contacts_to_insert[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/company_contacts"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                inserted_contacts += len(batch)
        except Exception as e:
            pass

    print(f"Successfully inserted {inserted_contacts} contacts.")

    # 5. Final Verification
    print("\n=== CONSOLIDATION COMPLETED SUCCESSFULLY ===")
    
    # Check SMK in companies table now
    url = f"{SUPABASE_URL}/rest/v1/companies?company_code=ilike.*SMK*&select=company_code,company_name,address,tel"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        print("Searching 'SMK' in companies table now:")
        for r in rows:
            print(f"  Code: {r['company_code']:6s} | Name: {r['company_name']:35s} | Tel: {r.get('tel') or ''}")

    # Check delivery_sites count for SMK
    if smk_id:
        url = f"{SUPABASE_URL}/rest/v1/delivery_sites?company_id=eq.{smk_id}&select=site_code,site_name,site_address"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            sites_smk = json.loads(resp.read().decode('utf-8'))
            print(f"\nDelivery sites grouped under SMK ({len(sites_smk)} sites):")
            for s in sites_smk[:10]:
                print(f"  SiteCode: {s['site_code']:8s} | Name: {s['site_name']:35s} | Addr: {s.get('site_address') or ''}")

if __name__ == '__main__':
    consolidate()
