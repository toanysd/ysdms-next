# -*- coding: utf-8 -*-
"""
Import Phase 1 normalized data to Supabase via REST API using SERVICE_ROLE_KEY.
"""
import sys
import os
import json
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

COMPANIES_JSON = r"source_data/company_normalized.json"
SITES_JSON = r"source_data/delivery_sites_normalized.json"

def get_headers(extra=None):
    h = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    if extra:
        h.update(extra)
    return h

def import_via_rest():
    if not os.path.exists(COMPANIES_JSON) or not os.path.exists(SITES_JSON):
        print("Error: Input JSON files not found!")
        sys.exit(1)

    with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    with open(SITES_JSON, 'r', encoding='utf-8') as f:
        sites = json.load(f)

    print(f"1. Upserting {len(companies)} companies to Supabase...")
    db_companies = []
    for c in companies:
        db_companies.append({
            "company_code": c["company_code"],
            "company_name": c.get("company_name_display") or c.get("company_name"),
            "company_name_romaji": c.get("company_name_romaji"),
            "company_type": c.get("company_type", ["CUSTOMER"]),
            "is_active": c.get("is_active", True),
            "tel": c.get("tel"),
            "fax": c.get("fax"),
            "address": c.get("address"),
            "order_folder_path": c.get("order_folder_path"),
            "notes": c.get("notes")
        })

    batch_size = 50
    for i in range(0, len(db_companies), batch_size):
        batch = db_companies[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/companies?on_conflict=company_code"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=get_headers({'Prefer': 'resolution=merge-duplicates'}), method="POST")
        with urllib.request.urlopen(req) as resp:
            pass

    print("Companies upserted successfully!")

    # Fetch mapping of ALL company_code -> company_id using pagination
    print("Fetching complete company_id mapping from Supabase...")
    code_to_id = {}
    for page in range(5):
        url = f"{SUPABASE_URL}/rest/v1/companies?select=company_id,company_code"
        req = urllib.request.Request(url, headers=get_headers({'Range': f'{page*1000}-{(page+1)*1000-1}'}))
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for c in data:
                if c.get("company_code"):
                    code_to_id[c["company_code"]] = c["company_id"]
            if len(data) < 1000:
                break

    print(f"Loaded {len(code_to_id)} company_id mappings.")

    # Fetch existing delivery_sites (to avoid duplicate inserts)
    existing_site_codes = set()
    for page in range(5):
        url = f"{SUPABASE_URL}/rest/v1/delivery_sites?select=site_code"
        req = urllib.request.Request(url, headers=get_headers({'Range': f'{page*1000}-{(page+1)*1000-1}'}))
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for s in data:
                if s.get("site_code"):
                    existing_site_codes.add(s["site_code"])
            if len(data) < 1000:
                break

    print(f"Loaded {len(existing_site_codes)} existing delivery site codes from DB.")

    # Prepare delivery_sites records
    print(f"2. Processing {len(sites)} delivery sites...")
    db_sites = []
    unmapped_count = 0
    skipped_existing = 0

    for s in sites:
        c_code = s["company_code"]
        c_id = code_to_id.get(c_code)
        if not c_id:
            unmapped_count += 1
            continue

        if s["site_code"] in existing_site_codes:
            skipped_existing += 1
            continue

        db_sites.append({
            "company_id": c_id,
            "site_code": s["site_code"],
            "site_name": s["site_name"],
            "site_address": s.get("site_address"),
            "site_tel": s.get("site_tel"),
            "site_fax": s.get("site_fax"),
            "contact_person": s.get("contact_person"),
            "is_active": s.get("is_active", True)
        })

    print(f"New delivery sites to insert: {len(db_sites)} (Skipped existing: {skipped_existing}, Unmapped: {unmapped_count})")

    for i in range(0, len(db_sites), batch_size):
        batch = db_sites[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/delivery_sites"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=get_headers(), method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                pass
        except Exception as err:
            print(f"Error inserting site batch {i}: {err}")

    # Count final delivery sites
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/delivery_sites?select=count", headers=get_headers({'Prefer': 'count=exact'}))
    with urllib.request.urlopen(req) as resp:
        final_site_count = json.loads(resp.read().decode('utf-8'))

    print("\n=== IMPORT COMPLETED SUCCESSFULLY ===")
    print(f"Total Companies in DB     : {len(code_to_id)}")
    print(f"Total Delivery Sites in DB: {final_site_count[0]['count']}")

if __name__ == '__main__':
    import_via_rest()

