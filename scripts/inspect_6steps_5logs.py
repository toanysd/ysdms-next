import pyodbc
import psycopg2
import re
import sys
import json
import hashlib
from datetime import datetime, date
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

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

ACCESS_DB_PATH = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
ENV_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local'

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

file_sha256 = compute_file_sha256(ACCESS_DB_PATH)

pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
pg_cur = pg_conn.cursor()

conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={ACCESS_DB_PATH};ReadOnly=1;'
acc_conn = pyodbc.connect(conn_str)
acc_conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
acc_conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
acc_conn.setencoding(encoding='utf-8')
acc_cur = acc_conn.cursor()

# 1. Masters
acc_cur.execute("SELECT * FROM [tblEmployee]")
emp_cols = [d[0] for d in acc_cur.description]
access_employees = {r[emp_cols.index('EmployeeID')]: r[emp_cols.index('EmployeeName')] for r in acc_cur.fetchall() if r[emp_cols.index('EmployeeID')]}

acc_cur.execute("SELECT * FROM [tblProcessingCode]")
pc_cols = [d[0] for d in acc_cur.description]
access_pcodes = {r[pc_cols.index('ProcessingCodeID')]: r[pc_cols.index('ProcessingName')] for r in acc_cur.fetchall() if r[pc_cols.index('ProcessingCodeID')]}

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

# 2. Inspect 6 steps
step_pks = [4275, 4276, 4238, 4241, 4251, 4226]
step_candidates = []

print(f"File SHA-256: {file_sha256}")
print("=== 6 STEP CANDIDATES ANALYSIS ===")

for pk in step_pks:
    acc_cur.execute("SELECT * FROM [tblProcessingDeadline] WHERE ProcessingDeadlineID = ?", (pk,))
    col_names = [d[0] for d in acc_cur.description]
    raw_row = dict(zip(col_names, acc_cur.fetchone()))
    
    row_serialized = {k: serialize(v) for k, v in raw_row.items()}
    row_hash = compute_row_hash(row_serialized)
    
    job_id = raw_row['JobID']
    legacy_id = f"LEGACY-STEP-{pk}"
    
    # Check if step legacy_id already exists in Supabase
    pg_cur.execute("SELECT step_id, step_no, step_name FROM job_steps WHERE legacy_id = %s", (legacy_id,))
    already_step = pg_cur.fetchone()
    
    # Check parent Job
    pg_cur.execute("SELECT job_id, job_code, job_name, legacy_id FROM jobs WHERE legacy_id = %s", (f"LEGACY-JOB-{job_id}",))
    sb_job = pg_cur.fetchone()
    
    # Check existing steps for that job
    pg_cur.execute("SELECT step_id, step_no, step_name, legacy_id, processing_status_id, deadline FROM job_steps WHERE job_id = %s ORDER BY step_no", (sb_job['job_id'],))
    existing_steps = pg_cur.fetchall()
    
    max_step_no = max([s['step_no'] for s in existing_steps], default=0)
    proposed_step_no = max_step_no + 1
    
    item_type_id = raw_row.get('ItemTypeID')
    step_name = item_types.get(item_type_id, f"ItemType-{item_type_id}")
    status_id = raw_row.get('ProcessingStatusID')
    deadline = raw_row.get('ProcessingDeadline')
    notes = raw_row.get('ProcessingNotes')
    
    val_status = 'NEW_SAFE_TO_STAGE'
    val_error = None
    
    if already_step:
        val_status = 'SKIP_DUPLICATE'
        val_error = f"Step legacy_id {legacy_id} already exists (step_id: {already_step['step_id']})"
    elif not sb_job:
        val_status = 'CONFLICT_REQUIRES_REVIEW'
        val_error = f"Parent job LEGACY-JOB-{job_id} not found"
        
    step_info = {
        'candidate_type': 'STEP',
        'source_table': 'tblProcessingDeadline',
        'source_primary_key': pk,
        'legacy_id': legacy_id,
        'source_file_sha256': file_sha256,
        'source_row_hash': row_hash,
        'target_job_uuid': sb_job['job_id'] if sb_job else None,
        'parent_job_code': sb_job['job_code'] if sb_job else None,
        'proposed_step_no': proposed_step_no,
        'step_name': step_name,
        'item_type_id': item_type_id,
        'processing_status_id': status_id,
        'deadline': serialize(deadline),
        'notes': notes,
        'existing_steps_count': len(existing_steps),
        'existing_step_nos': [s['step_no'] for s in existing_steps],
        'validation_status': val_status,
        'validation_error': val_error
    }
    step_candidates.append(step_info)
    print(f"Step {pk}: Job {sb_job['job_code']} (UUID: {sb_job['job_id']}) -> StepNo: {proposed_step_no}, Name: {step_name}, StatusID: {status_id}, Deadline: {deadline}, Val: {val_status}")

# 3. Inspect 5 work logs
log_pks = [9052, 8882, 8895, 8901, 8920]
log_candidates = []

print("\n=== 5 WORK LOG CANDIDATES ANALYSIS ===")

# Map of step_pk to planned target step_id or legacy
step_uuid_map = {
    4275: 'PENDING_STEP_STAGING_4275',
    4226: 'PENDING_STEP_STAGING_4226'
}

# Fetch employee mappings in Supabase
pg_cur.execute("SELECT employee_id, employee_name, legacy_id FROM employees")
sb_employees = pg_cur.fetchall()
sb_emp_by_legacy = {e['legacy_id']: e for e in sb_employees if e.get('legacy_id')}

for pk in log_pks:
    acc_cur.execute("SELECT * FROM [tblWorkLog] WHERE WorkLogID = ?", (pk,))
    col_names = [d[0] for d in acc_cur.description]
    raw_row = dict(zip(col_names, acc_cur.fetchone()))
    
    row_serialized = {k: serialize(v) for k, v in raw_row.items()}
    row_hash = compute_row_hash(row_serialized)
    
    legacy_id = f"LEGACY-LOG-{pk}"
    step_pk = raw_row.get('ProcessingDeadlineID')
    emp_pk = raw_row.get('EmployeeID')
    proc_code_id = raw_row.get('ProcessingCodeID')
    p_time = raw_row.get('ProcessingTime')
    p_date = raw_row.get('ProcessingDate')
    notes = raw_row.get('ProcessingNotes')
    
    hours = float(p_time) if p_time is not None else 0.0
    
    # Check if log legacy_id already exists in Supabase
    pg_cur.execute("SELECT log_id, job_id, job_step_id FROM work_logs WHERE legacy_id = %s", (legacy_id,))
    already_log = pg_cur.fetchone()
    
    # Check parent step candidate
    parent_step_cand = next((s for s in step_candidates if s['source_primary_key'] == step_pk), None)
    
    # Check Supabase employee
    sb_emp = sb_emp_by_legacy.get(f"EMP-{emp_pk}") or sb_emp_by_legacy.get(str(emp_pk))
    
    val_status = 'NEW_SAFE_TO_STAGE'
    val_error = None
    
    if already_log:
        val_status = 'SKIP_DUPLICATE'
        val_error = f"WorkLog legacy_id {legacy_id} already exists (log_id: {already_log['log_id']})"
    elif not parent_step_cand:
        val_status = 'CONFLICT_REQUIRES_REVIEW'
        val_error = f"Parent step ProcessingDeadlineID {step_pk} not in approved candidate list"
    elif not sb_emp:
        val_status = 'CONFLICT_REQUIRES_REVIEW'
        val_error = f"Employee {emp_pk} not found in Supabase employees"
        
    log_info = {
        'candidate_type': 'WORK_LOG',
        'source_table': 'tblWorkLog',
        'source_primary_key': pk,
        'legacy_id': legacy_id,
        'source_file_sha256': file_sha256,
        'source_row_hash': row_hash,
        'target_step_source_pk': step_pk,
        'target_step_legacy_id': f"LEGACY-STEP-{step_pk}",
        'target_job_uuid': parent_step_cand['target_job_uuid'] if parent_step_cand else None,
        'parent_job_code': parent_step_cand['parent_job_code'] if parent_step_cand else None,
        'employee_id_raw': emp_pk,
        'employee_name_raw': access_employees.get(emp_pk),
        'employee_uuid': sb_emp['employee_id'] if sb_emp else None,
        'processing_code_id_raw': proc_code_id,
        'processing_code_name': access_pcodes.get(proc_code_id),
        'processing_date': serialize(p_date),
        'hours': hours,
        'notes': notes,
        'validation_status': val_status,
        'validation_error': val_error
    }
    log_candidates.append(log_info)
    print(f"Log {pk}: Step {step_pk} (Job: {log_info['parent_job_code']}) | NV: {log_info['employee_name_raw']} ({log_info['employee_uuid']}) | Code {proc_code_id} ({log_info['processing_code_name']}) | Date: {serialize(p_date)} | Hours: {hours} | Val: {val_status}")

pg_conn.close()
acc_conn.close()

# Export candidate JSON
output_payload = {
    'audit_metadata': {
        'generated_at': datetime.now().isoformat(),
        'source_file_path': ACCESS_DB_PATH,
        'source_file_sha256': file_sha256,
        'candidate_group': '6_steps_5_logs_existing_jobs',
        'baseline_supabase': {
            'jobs': 1205,
            'job_steps': 2451,
            'work_logs': 7106
        }
    },
    'step_candidates': step_candidates,
    'work_log_candidates': log_candidates
}

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\candidate_payload_6steps_5logs.json', 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, ensure_ascii=False, indent=2)

print(f"\nĐã xuất bản tệp payload kiểm toán local: scripts/candidate_payload_6steps_5logs.json")
