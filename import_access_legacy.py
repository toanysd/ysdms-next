import os
import csv
import json
import codecs
from collections import defaultdict
import argparse
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')
DATA_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\csv-access-data"
OUTPUT_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai"

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL not found in .env.local")
    return psycopg2.connect(db_url)

def fetch_products_rest():
    product_map = {}
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/products?select=legacy_id,product_id'
    headers = {
        'apikey': os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        'Authorization': 'Bearer ' + os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    }
    # Supabase pagination
    offset = 0
    limit = 1000
    while True:
        headers['Range-Unit'] = 'items'
        headers['Range'] = f"{offset}-{offset+limit-1}"
        r = requests.get(url, headers=headers)
        if r.status_code != 200:
            print(f"Error fetching products via REST: {r.text}")
            break
        data = r.json()
        if not data:
            break
        for row in data:
            if row.get('legacy_id'):
                product_map[row['legacy_id']] = row['product_id']
        if len(data) < limit:
            break
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
    print(f"Loaded {filename} with encoding {encoding}")
    return list(csv.DictReader(content.splitlines()))

def get_job_mapping(processing_item_id):
    mapping = {
        '1': ('1', 'MOLD_NEW', 'MOLD'),
        '2': ('1', 'MOLD_NEW', 'MOLD'),
        '3': ('5', 'EQUIPMENT_NEW', 'WATER_BASE'),
        '4': ('6', 'EQUIPMENT_NEW', 'PRESSURE_BASE'),
        '5': ('7', 'EQUIPMENT_NEW', 'UNKNOWN_EQ'),
        '6': ('7', 'EQUIPMENT_NEW', 'PLUG'),
        '7': ('7', 'EQUIPMENT_NEW', 'STACKING'),
        '10': ('10', 'INTERNAL_OPS', None),
        '11': ('4', 'CUTTER_NEW', 'CUTTER_INLINE_OR_FRAME'),
        '12': ('10', 'INTERNAL_OPS', None),
        '13': ('10', 'INTERNAL_OPS', None),
        '14': ('10', 'INTERNAL_OPS', None),
        '15': ('7', 'EQUIPMENT_NEW', 'UNKNOWN_EQ'),
        '17': ('3', 'MAINTENANCE', 'MOLD'),
        '18': ('8', 'EQUIPMENT_REPAIR', 'MOLD'),
        '19': ('7', 'EQUIPMENT_NEW', 'UNKNOWN_EQ'),
        '20': ('4', 'CUTTER_NEW', 'CUTTER_SEPARATE'),
        '21': ('10', 'INTERNAL_OPS', None),
        '22': ('4', 'CUTTER_NEW', 'CUTTER_SEPARATE'),
        '23': ('3', 'MAINTENANCE', 'MOLD')
    }
    return mapping.get(str(processing_item_id))

def get_equipment_mapping(item_type_id):
    mapping = {
        '2': 'MOLD', '11': 'MOLD', '3': 'PLUG', '4': 'CUTTER_INLINE',
        '5': 'WATER_BASE', '6': 'PRESSURE_BASE', '7': 'STACKING', '8': 'FRAME'
    }
    return mapping.get(str(item_type_id))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true', help='Execute DB inserts (WARNING: modifies DB)')
    parser.add_argument('--stage', choices=['A', 'B'], default='A', help='Stage to execute (A: designs+equipment, B: wo+jobs+steps+logs)')
    args = parser.parse_args()

    print(f"Starting Parsing... Execute={args.execute}, Stage={args.stage}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Fetching products legacy_id mapping from REST API...")
    product_map = fetch_products_rest()
    print(f"Loaded {len(product_map)} products.")

    molds_data = read_csv('molds.csv')
    cutters_data = read_csv('cutters.csv')
    designs_data = read_csv('molddesign.csv')
    jobs_data = read_csv('jobs.csv')
    job_steps_data = read_csv('processingdeadline.csv')
    worklogs_data = read_csv('worklog.csv')
    
    summary = {
        'source_records': {
            'molds': len(molds_data), 'cutters': len(cutters_data),
            'designs': len(designs_data), 'jobs': len(jobs_data),
            'job_steps': len(job_steps_data), 'worklogs': len(worklogs_data)
        },
        'valid_imports': defaultdict(int),
        'mapping_stats': defaultdict(int),
        'ignored_records': defaultdict(int)
    }
    exceptions = []
    
    # 1. Parse Designs
    valid_designs = {} # legacy_id -> data
    for row in designs_data:
        d_id = row.get('MoldDesignID')
        if not d_id: continue
        
        tray_id = row.get('TrayID')
        product_legacy = f"TRAY-{tray_id}" if tray_id else None
        product_id = product_map.get(product_legacy)
        
        if not product_id:
            summary['ignored_records']['design_revisions'] += 1
            exceptions.append({'file': 'molddesign.csv', 'legacy_id': d_id, 'reason': f'product_id not resolved for TrayID {tray_id}'})
            summary['mapping_stats']['design_missing_product'] += 1
            continue
            
        legacy_id = f"D-{d_id}"
        valid_designs[legacy_id] = {
            'design_code': row.get('MoldDesignCode') or f"DES-{d_id}",
            'legacy_id': legacy_id,
            'legacy_specs': json.dumps(row),
            'product_id': product_id
        }
        summary['valid_imports']['design_revisions'] += 1
        summary['mapping_stats']['design_resolved_product'] += 1
            
    # 2. Parse Equipment
    equipment_type_dist = defaultdict(int)
    valid_equipment = {}
    
    for row in molds_data:
        m_id = row.get('MoldID')
        if not m_id: continue
        item_type = row.get('ItemTypeID')
        eq_type = get_equipment_mapping(item_type)
        if not eq_type:
            summary['ignored_records']['equipment'] += 1
            exceptions.append({'file': 'molds.csv', 'legacy_id': m_id, 'reason': f'Ignored or Unknown ItemTypeID {item_type}'})
            continue
            
        legacy_id = f"M-{m_id}"
        design_id = row.get('MoldDesignID')
        
        # Determine design resolution and pass down product_id if found
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
        equipment_type_dist[eq_type] += 1
        summary['valid_imports']['equipment'] += 1

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
        equipment_type_dist['CUTTER_SEPARATE'] += 1
        summary['valid_imports']['equipment'] += 1
        
    # 3. Parse Jobs & Work Orders
    job_cat_dist = defaultdict(int)
    valid_jobs = {}
    work_orders = {}
    
    for row in jobs_data:
        j_id = row.get('JobID')
        if not j_id: continue
        proc_item_id = row.get('ProcessingItemID')
        mapping = get_job_mapping(proc_item_id)
        if not mapping:
            summary['ignored_records']['jobs'] += 1
            exceptions.append({'file': 'jobs.csv', 'legacy_id': j_id, 'reason': f'Unmapped ProcessingItemID {proc_item_id}'})
            continue
            
        job_type_id, job_category, expected_eq = mapping
        job_cat_dist[job_category] += 1
        
        mold_id = row.get('MoldID')
        eq_legacy_id = f"M-{mold_id}" if mold_id else None
        has_eq = eq_legacy_id in valid_equipment
        
        if expected_eq and expected_eq not in ('UNKNOWN_EQ', 'CUTTER_INLINE_OR_FRAME') and expected_eq != 'CUTTER_SEPARATE':
            if not has_eq:
                exceptions.append({'file': 'jobs.csv', 'legacy_id': j_id, 'reason': f'Expected {expected_eq} but MoldID {mold_id} not found in equipment'})
                
        if has_eq:
            summary['mapping_stats']['jobs_with_equipment'] += 1
        else:
            summary['mapping_stats']['jobs_without_equipment'] += 1
            
        instr_id = row.get('InstructionID')
        wo_code = f"LEGACY-INST-{instr_id}" if instr_id else f"LEGACY-JOB-{j_id}"
        if wo_code not in work_orders:
            work_orders[wo_code] = {
                'wo_code': wo_code,
                'wo_name': f"Legacy Work Order {wo_code}",
                'wo_type': 'OTHER'
            }
            
        valid_jobs[j_id] = {
            'job_code': row.get('JobCode') or f"JOB-{j_id}",
            'job_name': row.get('JobName') or "Unknown Job",
            'job_type_id': job_type_id,
            'job_category': job_category,
            'legacy_id': j_id,
            'wo_code': wo_code,
            'equipment_legacy_id': eq_legacy_id if has_eq else None,
            'legacy_specs': json.dumps(row)
        }
        summary['valid_imports']['jobs'] += 1
        
    summary['valid_imports']['work_orders'] = len(work_orders)
    
    with open(os.path.join(OUTPUT_DIR, 'recovery_dry_run_summary.json'), 'w') as f: json.dump(summary, f, indent=2)
    with open(os.path.join(OUTPUT_DIR, 'equipment_type_distribution.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Equipment_Type', 'Count'])
        for k, v in equipment_type_dist.items(): writer.writerow([k, v])
    with open(os.path.join(OUTPUT_DIR, 'job_category_distribution.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Job_Category', 'Count'])
        for k, v in job_cat_dist.items(): writer.writerow([k, v])
    with open(os.path.join(OUTPUT_DIR, 'recovery_exceptions.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['file', 'legacy_id', 'reason'])
        writer.writeheader()
        writer.writerows(exceptions)
        
    print("Parsed data. Artifacts saved to temp_ai directory.")

    if args.execute:
        print(f"--- EXECUTE MODE: STAGE {args.stage} ---")
        try:
            conn = get_db_connection()
            conn.autocommit = False
            cur = conn.cursor()
            
            if args.stage == 'A':
                print(f"Inserting {len(valid_designs)} design_revisions...")
                cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_design_revisions_legacy_id ON design_revisions(legacy_id) WHERE legacy_id IS NOT NULL;")
                design_query = """
                    INSERT INTO design_revisions (design_code, legacy_id, legacy_specs, product_id)
                    VALUES %s
                    ON CONFLICT (legacy_id) DO UPDATE SET 
                        design_code = EXCLUDED.design_code,
                        legacy_specs = EXCLUDED.legacy_specs,
                        product_id = EXCLUDED.product_id
                    RETURNING revision_id, legacy_id;
                """
                design_values = [(d['design_code'], d['legacy_id'], d['legacy_specs'], d['product_id']) for d in valid_designs.values()]
                execute_values(cur, design_query, design_values, fetch=True)
                design_rows = cur.fetchall()
                design_legacy_map = {row[1]: row[0] for row in design_rows}
                
                print(f"Inserting {len(valid_equipment)} equipment...")
                cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_legacy_id ON equipment(legacy_id) WHERE legacy_id IS NOT NULL;")
                eq_query = """
                    INSERT INTO equipment (equipment_code, display_name, equipment_type, legacy_id, legacy_specs, design_revision_id)
                    VALUES %s
                    ON CONFLICT (legacy_id) DO UPDATE SET
                        display_name = EXCLUDED.display_name,
                        equipment_type = EXCLUDED.equipment_type,
                        legacy_specs = EXCLUDED.legacy_specs,
                        design_revision_id = EXCLUDED.design_revision_id
                """
                eq_values = [
                    (e['equipment_code'], e['display_name'], e['equipment_type'], e['legacy_id'], e['legacy_specs'], design_legacy_map.get(e['design_revision_legacy_id']))
                    for e in valid_equipment.values()
                ]
                execute_values(cur, eq_query, eq_values)
                
            elif args.stage == 'B':
                print("Stage B is currently a placeholder until A is approved.")
                pass
                
            conn.commit()
            print("Transaction committed successfully.")
        except Exception as e:
            if 'conn' in locals(): conn.rollback()
            print(f"Transaction failed and rolled back. Error: {e}")
            raise
        finally:
            if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
