# -*- coding: utf-8 -*-
"""
Step 3.2: export_db_equipment.py
Exports current Supabase DB snapshot for equipment & design_revisions.
Flags verified/manually entered records according to Rule P1.
Output: source_data/equipment_db_snapshot.json
"""
import sys
import os
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"

OUTPUT_SNAPSHOT = r'source_data/equipment_db_snapshot.json'

def export_db():
    print("=== STEP 3.2: EXPORTING CURRENT SUPABASE DB EQUIPMENT SNAPSHOT ===")
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}'
    }

    equipment_list = []
    url = f"{SUPABASE_URL}/rest/v1/equipment?select=*"

    for page in range(10):
        req = urllib.request.Request(url, headers={**headers, 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            equipment_list.extend(data)
            if len(data) < 1000:
                break

    print(f"Loaded {len(equipment_list)} total equipment records from Supabase DB.")

    verified_count = 0
    placeholder_count = 0

    for eq in equipment_list:
        # Check Rule P1: Is this record verified / manually filled / job-linked?
        has_dims = bool(eq.get('dimensions') or eq.get('actual_length_mm'))
        has_rack = bool(eq.get('current_rack_layer_id'))
        has_notes = bool(eq.get('notes') and len(str(eq['notes']).strip()) > 5)
        has_design = bool(eq.get('design_revision_id'))
        is_checklist = bool(eq.get('on_checklist'))

        is_verified = has_dims or has_rack or has_notes or has_design or is_checklist
        eq['_is_verified_rule_p1'] = is_verified

        if is_verified:
            verified_count += 1
        else:
            placeholder_count += 1

    with open(OUTPUT_SNAPSHOT, 'w', encoding='utf-8') as f:
        json.dump(equipment_list, f, ensure_ascii=False, indent=2)

    print(f"Snapshot exported -> {OUTPUT_SNAPSHOT}")
    print(f"  - Verified / Manual DB records (PROTECTED Rule P1) : {verified_count}")
    print(f"  - Basic / Placeholder DB records (ENRICHABLE Rule P2): {placeholder_count}")

if __name__ == '__main__':
    export_db()
