import json
import psycopg2
from psycopg2.extras import RealDictCursor
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\access_delta_round_a_audit.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

jobs_delta = data['delta_candidates_details']['jobs_delta_list']

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local', 'r', encoding='utf-8') as f:
    m = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE)
    db_url = m.group(1).strip()

pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
pg_cur = pg_conn.cursor()
pg_cur.execute('SELECT company_id, company_code, company_name FROM companies')
companies = pg_cur.fetchall()

pg_cur.execute('SELECT product_id, product_code, product_name_internal, company_id FROM products')
products = pg_cur.fetchall()

pg_cur.execute('SELECT equipment_id, equipment_code, display_name FROM equipment')
equipment = pg_cur.fetchall()

pg_conn.close()

comp_by_code = {c['company_code']: c for c in companies if c.get('company_code')}
prod_by_internal = {p['product_name_internal']: p for p in products if p.get('product_name_internal')}
prod_by_code = {p['product_code']: p for p in products if p.get('product_code')}
equip_by_code = {eq['equipment_code']: eq for eq in equipment if eq.get('equipment_code')}

print("=== KHẢO SÁT ÁNH XẠ ỨNG VIÊN CHO 27 DELTA JOBS ===")
resolved_candidates = []
for j in jobs_delta:
    name = j['job_name']
    prefix = name.split('-')[0].strip() if '-' in name else name[:3]
    comp = comp_by_code.get(prefix)
    
    # Try finding product candidate
    # e.g. name = "ADY-133 R1" -> base product code "ADY-133"
    base_code = name.split(' ')[0].strip()
    prod = prod_by_internal.get(base_code) or prod_by_code.get(base_code.replace('-', ''))

    # Try finding equipment candidate
    equip = equip_by_code.get(base_code)

    res = {
        'job_id_access': j['source_primary_key'],
        'job_name_access': name,
        'prefix': prefix,
        'candidate_company_id': comp['company_id'] if comp else None,
        'candidate_company_name': comp['company_name'] if comp else None,
        'candidate_product_id': prod['product_id'] if prod else None,
        'candidate_product_name': prod['product_name_internal'] if prod else None,
        'candidate_equipment_id': equip['equipment_id'] if equip else None
    }
    resolved_candidates.append(res)
    print(f"JobID {j['source_primary_key']:4d}: {name:15s} | Comp: {comp['company_name'] if comp else 'CHƯA TÌM THẤY':25s} | Product: {prod['product_name_internal'] if prod else 'CHƯA CÓ':15s}")

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\jobs_27_delta_resolved_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(resolved_candidates, f, ensure_ascii=False, indent=2)

print("\nĐã lưu danh sách ứng viên vào: scripts/jobs_27_delta_resolved_candidates.json")
