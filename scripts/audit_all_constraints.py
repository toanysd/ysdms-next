import psycopg2
import os
import re
import json
from psycopg2.extras import RealDictCursor

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_ROOT, '.env.local')

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

# 1. Fetch staging data
cur.execute("SELECT * FROM staging_access_delta_b1 WHERE entity_type = 'STEP' ORDER BY source_primary_key")
steps = cur.fetchall()
cur.execute("SELECT * FROM staging_access_delta_b1 WHERE entity_type = 'WORK_LOG' ORDER BY source_primary_key")
logs = cur.fetchall()

print("=== STEP COLUMNS INSPECTION ===")
step_cols = ['job_id', 'step_no', 'step_name', 'step_status', 'processing_status_id', 
             'processing_item_id', 'assigned_to', 'machine_id', 'outsource_company', 'item_type_id']
for col in step_cols:
    vals = [s.get(col) if col in s else s.get('target_' + col, s.get('payload', {}).get(col)) for s in steps]
    # More specifically from staging columns:
    real_vals = []
    for s in steps:
        if col == 'job_id': real_vals.append(str(s['target_job_id']))
        elif col in s: real_vals.append(s[col])
        elif col in s['payload']: real_vals.append(s['payload'][col])
        else: real_vals.append(None)
    print(f"  {col}: {real_vals}")

print("\n=== WORK LOG COLUMNS INSPECTION ===")
log_cols = ['job_id', 'employee_id', 'work_date', 'hours_spent', 'is_finished', 
            'processing_code_id', 'quantity_ng', 'company_id', 'machine_id', 'processing_status_id', 'job_step_id']
for col in log_cols:
    real_vals = []
    for l in logs:
        if col == 'job_id': real_vals.append(str(l['target_job_id']))
        elif col == 'job_step_id': real_vals.append(l['payload'].get('target_step_legacy_id'))
        elif col in l: real_vals.append(l[col])
        elif col in l['payload']: real_vals.append(l['payload'][col])
        else: real_vals.append(None)
    print(f"  {col}: {real_vals}")

conn.close()
