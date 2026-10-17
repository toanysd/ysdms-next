import os
import csv
import json
import codecs
from collections import defaultdict
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')
DATA_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\csv-access-data"
OUTPUT_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai"
CHUNK_SIZE = 500

def get_rest_headers():
    return {
        'apikey': os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        'Authorization': 'Bearer ' + os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    }

def fetch_products_rest():
    product_map = {}
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/products?select=legacy_id,product_id'
    headers = get_rest_headers()
    offset = 0
    limit = 1000
    while True:
        headers['Range-Unit'] = 'items'
        headers['Range'] = f"{offset}-{offset+limit-1}"
        r = requests.get(url, headers=headers)
        if r.status_code != 200: break
        data = r.json()
        if not data: break
        for row in data:
            if row.get('legacy_id'):
                product_map[row['legacy_id']] = row['product_id']
        if len(data) < limit: break
        offset += limit
    return product_map

def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path): return []
    try:
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
            encoding = 'utf-8-sig'
    except UnicodeDecodeError:
        with codecs.open(path, 'r', encoding='shift_jis', errors='replace') as f:
            content = f.read()
            encoding = 'shift_jis'
    return list(csv.DictReader(content.splitlines()))

def get_equipment_mapping(item_type_id):
    mapping = {
        '2': 'MOLD', '11': 'MOLD', '3': 'PLUG', '4': 'CUTTER_INLINE',
        '5': 'WATER_BASE', '6': 'PRESSURE_BASE', '7': 'STACKING', '8': 'FRAME'
    }
    return mapping.get(str(item_type_id))

def escape_sql(val):
    if val is None:
        return 'NULL'
    if isinstance(val, str):
        return "'" + val.replace("'", "''") + "'"
    return str(val)

def write_chunks(data_list, prefix, index_ddl):
    total = len(data_list)
    part = 1
    for i in range(0, total, CHUNK_SIZE):
        chunk = data_list[i:i + CHUNK_SIZE]
        filename = f"{prefix}_part{part}.sql"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with codecs.open(filepath, 'w', encoding='utf-8') as f:
            f.write("BEGIN;\n")
            if part == 1 and index_ddl:
                f.write(index_ddl + "\n\n")
            for q in chunk:
                f.write(q + "\n")
            f.write("COMMIT;\n")
        print(f"Generated {filename}")
        part += 1

def generate_sql():
    product_map = fetch_products_rest()
    molds_data = read_csv('molds.csv')
    cutters_data = read_csv('cutters.csv')
    designs_data = read_csv('molddesign.csv')
    
    valid_designs = {}
    for row in designs_data:
        d_id = row.get('MoldDesignID')
        if not d_id: continue
        tray_id = row.get('TrayID')
        product_legacy = f"TRAY-{tray_id}" if tray_id else None
        product_id = product_map.get(product_legacy)
        if not product_id: continue
        legacy_id = f"D-{d_id}"
        valid_designs[legacy_id] = {
            'design_code': row.get('MoldDesignCode') or f"DES-{d_id}",
            'legacy_id': legacy_id,
            'legacy_specs': json.dumps(row),
            'product_id': product_id
        }

    valid_equipment = {}
    for row in molds_data:
        m_id = row.get('MoldID')
        if not m_id: continue
        item_type = row.get('ItemTypeID')
        eq_type = get_equipment_mapping(item_type)
        if not eq_type: continue
        legacy_id = f"M-{m_id}"
        design_id = row.get('MoldDesignID')
        d_legacy = f"D-{design_id}" if design_id else None
        linked_design = valid_designs.get(d_legacy)
        valid_equipment[legacy_id] = {
            'equipment_code': row.get('MoldCode') or f"EQ-{m_id}",
            'display_name': row.get('MoldName') or "Unknown",
            'equipment_type': eq_type,
            'legacy_id': legacy_id,
            'legacy_specs': json.dumps(row),
            'design_revision_legacy_id': d_legacy if linked_design else None
        }

    for row in cutters_data:
        c_id = row.get('CutterID')
        if not c_id: continue
        legacy_id = f"C-{c_id}"
        design_id = row.get('MoldDesignID')
        d_legacy = f"D-{design_id}" if design_id else None
        linked_design = valid_designs.get(d_legacy)
        valid_equipment[legacy_id] = {
            'equipment_code': row.get('CutterCode') or row.get('CutterNo') or f"CT-{c_id}",
            'display_name': row.get('CutterName') or "Unknown Cutter",
            'equipment_type': 'CUTTER_SEPARATE',
            'legacy_id': legacy_id,
            'legacy_specs': json.dumps(row),
            'design_revision_legacy_id': d_legacy if linked_design else None
        }

    # Prepare Design SQLs
    design_sqls = []
    for d in valid_designs.values():
        q = f"INSERT INTO design_revisions (design_code, legacy_id, legacy_specs, product_id) VALUES ({escape_sql(d['design_code'])}, {escape_sql(d['legacy_id'])}, {escape_sql(d['legacy_specs'])}, {escape_sql(d['product_id'])}) ON CONFLICT (legacy_id) DO UPDATE SET design_code = EXCLUDED.design_code, legacy_specs = EXCLUDED.legacy_specs, product_id = EXCLUDED.product_id;"
        design_sqls.append(q)

    write_chunks(
        design_sqls, 
        'stage_a_1_design_revisions', 
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_design_revisions_legacy_id ON design_revisions(legacy_id) WHERE legacy_id IS NOT NULL;'
    )

    # Prepare Equipment SQLs
    eq_sqls = []
    for e in valid_equipment.values():
        d_lookup = f"(SELECT revision_id FROM design_revisions WHERE legacy_id = {escape_sql(e['design_revision_legacy_id'])})" if e['design_revision_legacy_id'] else "NULL"
        q = f"INSERT INTO equipment (equipment_code, display_name, equipment_type, legacy_id, legacy_specs, design_revision_id) VALUES ({escape_sql(e['equipment_code'])}, {escape_sql(e['display_name'])}, {escape_sql(e['equipment_type'])}, {escape_sql(e['legacy_id'])}, {escape_sql(e['legacy_specs'])}, {d_lookup}) ON CONFLICT (legacy_id) DO UPDATE SET display_name = EXCLUDED.display_name, equipment_type = EXCLUDED.equipment_type, legacy_specs = EXCLUDED.legacy_specs, design_revision_id = EXCLUDED.design_revision_id;"
        eq_sqls.append(q)

    write_chunks(
        eq_sqls, 
        'stage_a_2_equipment', 
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_legacy_id ON equipment(legacy_id) WHERE legacy_id IS NOT NULL;'
    )

if __name__ == "__main__":
    generate_sql()
