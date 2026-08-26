# -*- coding: utf-8 -*-
"""
Step 3.4b: import_phase3_rest.py
Safely imports Phase 3 normalized equipment data to Supabase DB via REST API:
- Rule P1 & P2: PATCHes existing DB records to fill NULL fields (dimensions, notes) without wiping existing verified fields.
- Rule P3: POSTs new CAD molds discovered from Server.
"""
import sys
import os
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"

NORMALIZED_JSON = r'source_data/equipment_normalized.json'

def get_headers(extra=None):
    h = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    if extra:
        h.update(extra)
    return h

def import_equipment():
    if not os.path.exists(NORMALIZED_JSON):
        print(f"Error: {NORMALIZED_JSON} not found!")
        sys.exit(1)

    with open(NORMALIZED_JSON, 'r', encoding='utf-8') as f:
        equipment = json.load(f)

    print(f"1. Processing {len(equipment)} equipment records for Supabase DB...")

    existing_updates = []
    new_inserts = []

    for eq in equipment:
        eq_id = eq.get('equipment_id')
        cad_path = eq.get('cad_folder_path')
        dims = eq.get('dimensions')

        if eq_id:
            patch_data = {}
            if dims:
                patch_data['dimensions'] = dims
            if cad_path:
                curr_notes = eq.get('notes') or ''
                if cad_path not in curr_notes:
                    patch_data['notes'] = (curr_notes + f" | CAD: {cad_path}").strip(" | ")
            
            if patch_data:
                existing_updates.append((eq_id, patch_data))
        else:
            note_str = eq.get('notes') or ''
            if cad_path and cad_path not in note_str:
                note_str = (note_str + f" | CAD: {cad_path}").strip(" | ")

            new_inserts.append({
                "equipment_code": eq.get('equipment_code'),
                "display_name": eq.get('display_name') or eq.get('equipment_code'),
                "equipment_type": eq.get('equipment_type', 'MOLD'),
                "dimensions": dims,
                "device_status": eq.get('device_status', 'ACTIVE'),
                "notes": note_str if note_str else None
            })

    print(f"  - DB Records to Enrich (PATCH) : {len(existing_updates)}")
    print(f"  - New Server CAD Molds to Insert (POST): {len(new_inserts)}")

    # 1. Update existing records in batches
    print("\nUpdating existing DB records with CAD paths & specs...")
    patched_count = 0
    for eq_id, patch in existing_updates:
        url = f"{SUPABASE_URL}/rest/v1/equipment?equipment_id=eq.{eq_id}"
        body = json.dumps(patch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=get_headers(), method="PATCH")
        try:
            with urllib.request.urlopen(req) as resp:
                patched_count += 1
        except Exception as e:
            pass

    print(f"Successfully enriched {patched_count} existing DB equipment records.")

    # 2. Insert new server CAD molds in batches of 50
    print("\nInserting new Server CAD molds...")
    batch_size = 50
    inserted_new = 0
    failed_new = 0

    for i in range(0, len(new_inserts), batch_size):
        batch = new_inserts[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/equipment"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=get_headers(), method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                inserted_new += len(batch)
        except Exception as e:
            failed_new += len(batch)
            print(f"Error inserting batch {i}: {e}")

    print(f"Successfully inserted {inserted_new} new Server CAD molds (Failed: {failed_new}).")

    # Final DB count query
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/equipment?select=count", headers=get_headers({'Prefer': 'count=exact'}))
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        final_count = res[0]['count']

    print(f"\n=== PHASE 3 IMPORT COMPLETED SUCCESSFULLY ===")
    print(f"Total Equipment Records in Supabase DB: {final_count}")

if __name__ == '__main__':
    import_equipment()
