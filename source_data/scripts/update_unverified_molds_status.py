# -*- coding: utf-8 -*-
"""
1. Export 1,680 newly added Server CAD molds to TSV/JSON for user audit.
2. Update device_status from 'ACTIVE' to 'UNVERIFIED' (Chưa kiểm kê thực tế tại xưởng).
3. Update notes to explicitly state unverified status.
4. Perform duplication and product-link analysis.
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

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}

TSV_OUTPUT = r'source_data/newly_added_server_cad_molds.tsv'
JSON_OUTPUT = r'source_data/newly_added_server_cad_molds.json'

def process():
    print("=== 1. FETCHING NEWLY ADDED SERVER CAD MOLDS ===")
    query_notes = urllib.parse.quote('*Imported from Server CAD Catalog*')
    url = f'{SUPABASE_URL}/rest/v1/equipment?select=*&notes=ilike.{query_notes}'

    new_molds = []
    for page in range(5):
        req = urllib.request.Request(url, headers={**headers, 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            new_molds.extend(data)
            if len(data) < 1000:
                break

    print(f"Total newly added Server CAD molds found: {len(new_molds)}")

    # 2. Export TSV & JSON
    tsv_lines = ["equipment_id\tequipment_code\tdisplay_name\tdimensions\tdevice_status\tcurrent_rack_layer_id\tnotes"]
    for m in new_molds:
        row = [
            m.get('equipment_id', ''),
            m.get('equipment_code', ''),
            m.get('display_name', ''),
            m.get('dimensions', '') or '',
            'UNVERIFIED',
            m.get('current_rack_layer_id', '') or '',
            "Dữ liệu khởi tạo tự động từ quét thư mục CAD Server (Chưa xác thực kiểm kê thực tế tại xưởng YSD)"
        ]
        tsv_lines.append("\t".join(row))

    with open(TSV_OUTPUT, 'w', encoding='utf-8') as f:
        f.write("\n".join(tsv_lines))

    with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(new_molds, f, ensure_ascii=False, indent=2)

    print(f"Exported TSV -> {TSV_OUTPUT}")
    print(f"Exported JSON -> {JSON_OUTPUT}")

    # 3. Update Status to 'UNVERIFIED' and update notes in Supabase DB
    print("\n=== 2. UPDATING STATUS TO 'UNVERIFIED' & NOTES IN SUPABASE DB ===")
    patch_data = {
        "device_status": "UNVERIFIED",
        "notes": "Dữ liệu khởi tạo tự động từ quét thư mục CAD Server (Chưa xác thực kiểm kê thực tế tại xưởng YSD)"
    }

    updated_count = 0
    batch_size = 50
    mold_ids = [m['equipment_id'] for m in new_molds]

    for i in range(0, len(mold_ids), batch_size):
        batch_ids = mold_ids[i:i+batch_size]
        ids_str = ",".join(batch_ids)
        patch_url = f"{SUPABASE_URL}/rest/v1/equipment?equipment_id=in.({ids_str})"
        req = urllib.request.Request(patch_url, data=json.dumps(patch_data).encode('utf-8'), headers=headers, method="PATCH")
        try:
            with urllib.request.urlopen(req) as resp:
                updated_count += len(batch_ids)
        except Exception as e:
            print(f"Patch batch {i} error: {e}")

    print(f"Successfully updated status = 'UNVERIFIED' for {updated_count} molds.")

    # 4. Perform Duplication & Linkage Analysis
    print("\n=== 3. PERFORMNIG LINKAGE & DUPLICATION ANALYSIS ===")
    
    # Check verified DB molds (current_rack_layer_id IS NOT NULL or on_checklist = true)
    url_verified = f'{SUPABASE_URL}/rest/v1/equipment?select=equipment_code,display_name,current_rack_layer_id&on_checklist=eq.true'
    req = urllib.request.Request(url_verified, headers={**headers, 'Range': '0-5000'})
    with urllib.request.urlopen(req) as resp:
        verified_molds = json.loads(resp.read().decode('utf-8'))

    verified_codes = set(m['equipment_code'].upper() for m in verified_molds if m.get('equipment_code'))
    
    duplicates_with_verified = 0
    for m in new_molds:
        code = (m.get('equipment_code') or '').upper()
        if code in verified_codes:
            duplicates_with_verified += 1

    print(f"Total physically verified molds in DB (Rack/Checklist) : {len(verified_molds)}")
    print(f"Newly added CAD molds duplicating verified molds     : {duplicates_with_verified}")

    # Check products count & design_revisions count
    url_design = f'{SUPABASE_URL}/rest/v1/design_revisions?select=count'
    req = urllib.request.Request(url_design, headers={**headers, 'Prefer': 'count=exact'})
    with urllib.request.urlopen(req) as resp:
        rev_count = json.loads(resp.read().decode('utf-8'))[0]['count']

    print(f"Total design_revisions in DB                          : {rev_count}")

if __name__ == '__main__':
    process()
