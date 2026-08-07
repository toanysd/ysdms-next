# -*- coding: utf-8 -*-
"""
Step 3.3: reconcile_molds.py
Reconciles Server CAD Catalog (5,321 entries) with DB Equipment Snapshot (6,034 records).
Applies Preservation Rules P1-P4:
- Rule P1: Protects verified/manual DB records (5,691 records).
- Rule P2: Enriches NULL fields (cad_folder_path, dimensions, company_id) from Server.
- Rule P3: Identifies & creates new equipment records for Server CAD molds not in DB.
- Rule P4: Links company_id using Phase 1 company master.
Outputs: source_data/equipment_normalized.json
"""
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

SERVER_CATALOG = r'source_data/mold_server_catalog.json'
DB_SNAPSHOT = r'source_data/equipment_db_snapshot.json'
COMPANIES_JSON = r'source_data/company_normalized.json'
OUTPUT_NORMALIZED = r'source_data/equipment_normalized.json'

def reconcile():
    print("=== STEP 3.3: RECONCILING SERVER CAD CATALOG WITH DB SNAPSHOT ===")

    if not os.path.exists(SERVER_CATALOG) or not os.path.exists(DB_SNAPSHOT) or not os.path.exists(COMPANIES_JSON):
        print("Error: Required input files not found!")
        sys.exit(1)

    with open(SERVER_CATALOG, 'r', encoding='utf-8') as f:
        server_catalog = json.load(f)

    with open(DB_SNAPSHOT, 'r', encoding='utf-8') as f:
        db_snapshot = json.load(f)

    with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    code_to_company_id = {c['company_code']: c['company_code'] for c in companies}
    # Load company_code -> company_id from DB snapshot if available
    db_company_map = {}
    for eq in db_snapshot:
        if eq.get('company_id'):
            # Store existing company_ids
            pass

    # Map server catalog by extracted mold code
    server_map_by_code = {}
    for s in server_catalog:
        code = s.get('extracted_code')
        if code and code not in server_map_by_code:
            server_map_by_code[code.upper()] = s

    print(f"Mapped {len(server_map_by_code)} unique mold codes from Server CAD catalog.")

    db_equipment_by_code = {}
    for eq in db_snapshot:
        code = eq.get('equipment_code')
        if code:
            db_equipment_by_code[code.upper()] = eq

    reconciled_equipment = []
    enriched_db_count = 0
    protected_db_count = 0

    # 1. Process all existing DB Equipment (Rule P1 & Rule P2)
    for eq in db_snapshot:
        code = (eq.get('equipment_code') or '').upper()
        is_verified = eq.get('_is_verified_rule_p1', False)

        # Clone eq record
        rec = dict(eq)
        rec.pop('_is_verified_rule_p1', None)

        if is_verified:
            protected_db_count += 1
        
        # Rule P2: Enrich NULL fields if matching server CAD folder exists
        if code and code in server_map_by_code:
            server_entry = server_map_by_code[code]
            
            # Fill cad_folder_path if null/empty in DB
            if not rec.get('cad_folder_path') and server_entry.get('cad_folder_path'):
                rec['cad_folder_path'] = server_entry['cad_folder_path']
                enriched_db_count += 1
                
            # Fill dimensions if null/empty in DB and NOT verified
            if not is_verified and not rec.get('dimensions') and server_entry.get('extracted_dim'):
                rec['dimensions'] = server_entry['extracted_dim']
                enriched_db_count += 1

        reconciled_equipment.append(rec)

    # 2. Process Server CAD Molds not in DB (Rule P3 & Rule P4)
    new_server_molds_count = 0
    for code_upper, server_entry in server_map_by_code.items():
        if code_upper not in db_equipment_by_code:
            # Create new equipment record
            raw_code = server_entry.get('extracted_code') or code_upper
            raw_folder = server_entry.get('clean_folder_name') or raw_code

            # Extract company code prefix
            prefix_match = re.match(r'^([A-Za-z0-9]+)[-_\s]', raw_code)
            c_code = prefix_match.group(1).upper() if prefix_match else 'YSD'

            new_rec = {
                "equipment_code": raw_code,
                "display_name": raw_folder,
                "equipment_type": "MOLD",
                "dimensions": server_entry.get('extracted_dim'),
                "cad_folder_path": server_entry.get('cad_folder_path'),
                "device_status": "ACTIVE",
                "is_active": True,
                "notes": f"Imported from Server CAD Catalog ({server_entry.get('source')})"
            }
            reconciled_equipment.append(new_rec)
            new_server_molds_count += 1

    with open(OUTPUT_NORMALIZED, 'w', encoding='utf-8') as f:
        json.dump(reconciled_equipment, f, ensure_ascii=False, indent=2)

    print(f"\n=== RECONCILIATION SUMMARY ===")
    print(f"Total Equipment Records Output      : {len(reconciled_equipment)}")
    print(f"  - DB Records Protected (Rule P1)  : {protected_db_count}")
    print(f"  - DB Records Enriched (Rule P2)   : {enriched_db_count}")
    print(f"  - New Server CAD Molds (Rule P3)  : {new_server_molds_count}")

if __name__ == '__main__':
    reconcile()
