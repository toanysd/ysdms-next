import pyodbc
import psycopg2
import re
import sys
import json
import hashlib
from datetime import datetime, date
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

ACCESS_DB_PATH = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
ENV_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local'

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
pg_cur = pg_conn.cursor()

conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={ACCESS_DB_PATH};ReadOnly=1;'
acc_conn = pyodbc.connect(conn_str)
acc_conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
acc_conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
acc_conn.setencoding(encoding='utf-8')
acc_cur = acc_conn.cursor()

def serialize(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    return obj

def compute_row_hash(row_dict):
    canonical = {k: ("" if v is None else str(v)) for k, v in sorted(row_dict.items())}
    dumped = json.dumps(canonical, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(dumped.encode('utf-8')).hexdigest()

def compute_file_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(1024 * 1024 * 8):
            h.update(chunk)
    return h.hexdigest()

file_sha256 = compute_file_sha256(ACCESS_DB_PATH)

# Load candidate data
step_pks = [4275, 4276, 4238, 4241, 4251, 4226]
log_pks = [9052, 8882, 8895, 8901, 8920]

# Item types map
item_types = {
    1: 'アルミ (ALUMI)',
    2: '金型 (MOLD)',
    3: 'プラグ (PLUG)',
    4: '抜型 (CUTTER)',
    5: '水冷ベース (WATER COOLING BASE)',
    6: '受台・ベース (PRESSIER BASE)',
    7: 'スタッキング (STAKING)',
    8: 'フレーム (FRAME)',
    9: '機械など (MACHINE)',
    10: 'その他 (OTHER)',
    11: '試作型 (TEST MOLD)'
}

# Preflight Checks
checks = {}

# Check 1: 6 legacy_id Step do not exist
step_legacies = [f"LEGACY-STEP-{pk}" for pk in step_pks]
pg_cur.execute("SELECT step_id, legacy_id FROM job_steps WHERE legacy_id = ANY(%s)", (step_legacies,))
dup_steps = pg_cur.fetchall()
checks['check_1_step_legacies_not_exist'] = {
    'passed': len(dup_steps) == 0,
    'found_existing_count': len(dup_steps),
    'details': dup_steps
}

# Check 2: 5 legacy_id Log do not exist
log_legacies = [f"LEGACY-LOG-{pk}" for pk in log_pks]
pg_cur.execute("SELECT log_id, legacy_id FROM work_logs WHERE legacy_id = ANY(%s)", (log_legacies,))
dup_logs = pg_cur.fetchall()
checks['check_2_log_legacies_not_exist'] = {
    'passed': len(dup_logs) == 0,
    'found_existing_count': len(dup_logs),
    'details': dup_logs
}

# Check 3: No duplicate source primary key
checks['check_3_source_pks_unique'] = {
    'passed': len(step_pks) == len(set(step_pks)) and len(log_pks) == len(set(log_pks)),
    'step_pks_count': len(step_pks),
    'log_pks_count': len(log_pks)
}

# Check 4: No duplicate target (job_id, step_no)
# Fetch all target jobs and proposed step_nos
step_mapping_table = []
for pk in step_pks:
    acc_cur.execute("SELECT * FROM [tblProcessingDeadline] WHERE ProcessingDeadlineID = ?", (pk,))
    raw_step = dict(zip([d[0] for d in acc_cur.description], acc_cur.fetchone()))
    job_id = raw_step['JobID']
    
    pg_cur.execute("SELECT job_id, job_code, job_name, legacy_id FROM jobs WHERE legacy_id = %s", (f"LEGACY-JOB-{job_id}",))
    sb_job = pg_cur.fetchone()
    
    pg_cur.execute("SELECT step_id, step_no, step_name, legacy_id, processing_status_id, step_status FROM job_steps WHERE job_id = %s ORDER BY step_no", (sb_job['job_id'],))
    exist_steps = pg_cur.fetchall()
    
    max_step_no = max([s['step_no'] for s in exist_steps], default=0)
    proposed_step_no = max_step_no + 1
    
    # Rationale for processing_status_id
    # If step has work logs (4275, 4226): trigger will manage it (starts at 1 PENDING or 9 IN_PROGRESS upon log insertion)
    # If step has NO work logs (4276, 4238, 4241, 4251): in Access it was marked 8 (F.完了). In NextGen, outsourced completed steps use NULL or 8, step_status = 'COMPLETED'
    access_status_id = raw_step['ProcessingStatusID']
    item_type_id = raw_step['ItemTypeID']
    step_name = item_types.get(item_type_id, f"ItemType-{item_type_id}")
    
    # Target status rationale
    has_logs = pk in [4275, 4226]
    if has_logs:
        target_status_id = 9 # N.進行中 (or 1 before logs, trigger sets to 9 upon log insert)
        target_step_status = 'PENDING'
        rationale = f"Has active work logs ({1 if pk==4275 else 4} logs). Initial step_status is PENDING, processing_status_id = 9 (N.進行中) dynamically updated by trigger."
    else:
        target_status_id = None # matching 435 existing outsourced completed steps in Supabase
        target_step_status = 'COMPLETED'
        rationale = f"Outsourced tooling without internal machining logs (ItemType: {step_name}). Access status 8 (F.完了). Matches Supabase pattern for completed outsourced steps (step_status = 'COMPLETED', processing_status_id = NULL)."
    
    step_mapping_table.append({
        'access_processing_deadline_id': pk,
        'access_job_id': job_id,
        'access_item_type_id': item_type_id,
        'access_processing_status_id': access_status_id,
        'access_processing_deadline': serialize(raw_step['ProcessingDeadline']),
        'access_processing_notes': raw_step['ProcessingNotes'],
        'target_job_id': sb_job['job_id'],
        'target_job_code': sb_job['job_code'],
        'target_step_no': proposed_step_no,
        'target_step_name': step_name,
        'target_processing_item_id': None, # 99.8% of Supabase steps have NULL
        'target_processing_status_id': target_status_id,
        'target_step_status': target_step_status,
        'mapping_rationale': rationale,
        'existing_step_nos': [s['step_no'] for s in exist_steps],
        'source_row_hash': compute_row_hash({k: serialize(v) for k, v in raw_step.items()})
    })

# Verify target (job_id, step_no) unique
target_job_steps = [(s['target_job_id'], s['target_step_no']) for s in step_mapping_table]
pg_cur.execute("""
    SELECT step_id, job_id, step_no 
    FROM job_steps 
    WHERE (job_id, step_no) IN %s
""", (tuple(target_job_steps),))
dup_job_steps = pg_cur.fetchall()

checks['check_4_target_job_step_no_unique'] = {
    'passed': len(dup_job_steps) == 0 and len(target_job_steps) == len(set(target_job_steps)),
    'collisions_with_existing': dup_job_steps
}

# Check 5: Employees active
pg_cur.execute("SELECT employee_id, employee_name, legacy_id, is_active FROM employees WHERE legacy_id IN ('EMP-9', 'EMP-21')")
emp_records = pg_cur.fetchall()
checks['check_5_employees_active'] = {
    'passed': len(emp_records) == 2 and all(e.get('is_active', True) for e in emp_records),
    'employees': emp_records
}

# Check 6: Processing codes active
pg_cur.execute("SELECT processing_code_id, processing_name, is_active FROM processing_codes WHERE processing_code_id IN (10, 11, 12, 14)")
pcode_records = pg_cur.fetchall()
checks['check_6_processing_codes_active'] = {
    'passed': len(pcode_records) == 4 and all(c.get('is_active', True) for c in pcode_records),
    'codes': pcode_records
}

# Check 7: Work logs mapping table and validation
log_mapping_table = []
for pk in log_pks:
    acc_cur.execute("SELECT * FROM [tblWorkLog] WHERE WorkLogID = ?", (pk,))
    raw_log = dict(zip([d[0] for d in acc_cur.description], acc_cur.fetchone()))
    
    step_pk = raw_log['ProcessingDeadlineID']
    step_info = next(s for s in step_mapping_table if s['access_processing_deadline_id'] == step_pk)
    
    emp_raw = raw_log['EmployeeID']
    emp_sb = next(e for e in emp_records if e['legacy_id'] == f"EMP-{emp_raw}")
    
    p_code = raw_log['ProcessingCodeID']
    p_time = float(raw_log['ProcessingTime']) if raw_log['ProcessingTime'] is not None else 0.0
    p_date = serialize(raw_log['ProcessingDate'])
    is_finished = bool(raw_log.get('Finished', False))
    notes = raw_log.get('ProcessingNotes')
    
    log_mapping_table.append({
        'access_work_log_id': pk,
        'access_processing_deadline_id': step_pk,
        'target_step_legacy_id': f"LEGACY-STEP-{step_pk}",
        'target_job_id': step_info['target_job_id'],
        'target_job_code': step_info['target_job_code'],
        'target_employee_id': emp_sb['employee_id'],
        'employee_name': emp_sb['employee_name'],
        'target_processing_code_id': p_code,
        'work_date': p_date,
        'hours_spent': p_time,
        'is_finished': is_finished,
        'notes': notes,
        'source_row_hash': compute_row_hash({k: serialize(v) for k, v in raw_log.items()}),
        'validation_status': 'NEW_SAFE_TO_STAGE' if p_time > 0 and p_date else 'CONFLICT_REQUIRES_REVIEW'
    })

checks['check_7_work_log_hours_and_dates_valid'] = {
    'passed': all(l['hours_spent'] > 0 and l['work_date'] is not None for l in log_mapping_table),
    'log_count': len(log_mapping_table)
}

# Check 8: Parent Job exists
checks['check_8_parent_jobs_exist'] = {
    'passed': all(s['target_job_id'] is not None for s in step_mapping_table),
    'distinct_parent_jobs': len(set(s['target_job_id'] for s in step_mapping_table))
}

# Check 9: All target columns exist in schema
pg_cur.execute("""
    SELECT column_name FROM information_schema.columns WHERE table_name = 'job_steps'
""")
step_cols = [r['column_name'] for r in pg_cur.fetchall()]
needed_step_cols = ['job_id', 'step_no', 'step_name', 'processing_status_id', 'step_status', 'deadline', 'notes', 'legacy_id']

pg_cur.execute("""
    SELECT column_name FROM information_schema.columns WHERE table_name = 'work_logs'
""")
log_cols = [r['column_name'] for r in pg_cur.fetchall()]
needed_log_cols = ['job_id', 'job_step_id', 'employee_id', 'processing_code_id', 'work_date', 'hours_spent', 'is_finished', 'notes', 'legacy_id']

checks['check_9_target_columns_exist'] = {
    'passed': all(c in step_cols for c in needed_step_cols) and all(c in log_cols for c in needed_log_cols),
    'missing_step_cols': [c for c in needed_step_cols if c not in step_cols],
    'missing_log_cols': [c for c in needed_log_cols if c not in log_cols]
}

# Check 10: No UPDATE replacing existing data
checks['check_10_no_overwrites'] = {
    'passed': checks['check_1_step_legacies_not_exist']['passed'] and checks['check_2_log_legacies_not_exist']['passed'] and checks['check_4_target_job_step_no_unique']['passed'],
    'message': 'All records are purely additive INSERT operations with new legacy_id and unique step_no.'
}

all_passed = all(c['passed'] for c in checks.values())

output_data = {
    'preflight_metadata': {
        'timestamp': datetime.now().isoformat(),
        'source_file_path': ACCESS_DB_PATH,
        'source_file_sha256': file_sha256,
        'all_preflight_checks_passed': all_passed,
        'baseline_supabase': {
            'jobs': 1205,
            'job_steps': 2451,
            'work_logs': 7106
        }
    },
    'preflight_checks': checks,
    'step_mapping_table': step_mapping_table,
    'work_log_mapping_table': log_mapping_table
}

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\preflight_b1_verification.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"Preflight all checks passed: {all_passed}")
for name, c in checks.items():
    print(f"  - {name}: {'PASSED' if c['passed'] else 'FAILED'}")

pg_conn.close()
acc_conn.close()
