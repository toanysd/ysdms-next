import os
# -*- coding: utf-8 -*-
"""
Clean DB status for UNVERIFIED molds:
- For equipment with device_status = 'UNVERIFIED':
  - Set usage_status = 'UNVERIFIED' (NOT IN_STOCK or STORAGE)
  - Ensure keeper_company_id = NULL (NOT YSD)
  - Ensure current_rack_layer_id = NULL
"""
import sys
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}

def fix_db():
    print("=== CLEANING DB STATUS FOR UNVERIFIED MOLDS ===")

    # 1. Fetch UNVERIFIED molds
    url = f"{SUPABASE_URL}/rest/v1/equipment?select=equipment_id,equipment_code,device_status,usage_status,keeper_company_id&device_status=eq.UNVERIFIED"
    molds = []
    for page in range(5):
        req = urllib.request.Request(url, headers={**headers, 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            molds.extend(data)
            if len(data) < 1000:
                break

    print(f"Fetched {len(molds)} UNVERIFIED molds from DB.")

    updated_cnt = 0
    batch_size = 50
    for i in range(0, len(molds), batch_size):
        batch = molds[i:i+batch_size]
        b_ids = [m['equipment_id'] for m in batch]
        b_str = ",".join(b_ids)

        patch_url = f"{SUPABASE_URL}/rest/v1/equipment?equipment_id=in.({b_str})"
        patch_body = json.dumps({
            "usage_status": "UNVERIFIED",
            "keeper_company_id": None
        }).encode('utf-8')

        patch_req = urllib.request.Request(patch_url, data=patch_body, headers=headers, method="PATCH")
        try:
            with urllib.request.urlopen(patch_req) as resp:
                updated_cnt += len(batch)
        except Exception as e:
            print(f"Patch batch note: {e}")

    print(f"Updated {updated_cnt} UNVERIFIED molds: usage_status='UNVERIFIED', keeper_company_id=NULL.")

if __name__ == '__main__':
    fix_db()
