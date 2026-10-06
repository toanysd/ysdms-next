import json
import psycopg2
from psycopg2.extras import RealDictCursor
import pyodbc
import re
import sys
import hashlib
from datetime import datetime, date

sys.stdout.reconfigure(encoding='utf-8')

ACCESS_DB_PATH = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb"

def serialize(val):
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    return val

def compute_row_hash(row_dict):
    canonical = {k: ("" if v is None else str(v)) for k, v in sorted(row_dict.items())}
    dumped = json.dumps(canonical, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(dumped.encode('utf-8')).hexdigest()

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local', 'r', encoding='utf-8') as f:
    m = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE)
    db_url = m.group(1).strip()

# 1. Connect Access
conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={ACCESS_DB_PATH};ReadOnly=1;'
access_conn = pyodbc.connect(conn_str)
access_conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
access_conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
access_conn.setencoding(encoding='utf-8')
cur = access_conn.cursor()

# Read tblJOB
cur.execute("SELECT * FROM [tblJOB]")
job_cols = [d[0] for d in cur.description]
access_jobs = [{job_cols[i]: serialize(val) for i, val in enumerate(row)} for row in cur.fetchall()]

# Read tblProcessingDeadline
cur.execute("SELECT * FROM [tblProcessingDeadline]")
step_cols = [d[0] for d in cur.description]
access_steps = [{step_cols[i]: serialize(val) for i, val in enumerate(row)} for row in cur.fetchall()]

# Read tblWorkLog
cur.execute("SELECT * FROM [tblWorkLog]")
log_cols = [d[0] for d in cur.description]
access_logs = [{log_cols[i]: serialize(val) for i, val in enumerate(row)} for row in cur.fetchall()]

# Master
cur.execute("SELECT * FROM [tblCompany]")
comp_cols = [d[0] for d in cur.description]
access_companies = {r[comp_cols.index('CompanyID')]: r[comp_cols.index('CompanyName')] for r in cur.fetchall() if r[comp_cols.index('CompanyID')]}

cur.execute("SELECT * FROM [tblEmployee]")
emp_cols = [d[0] for d in cur.description]
access_employees = {r[emp_cols.index('EmployeeID')]: r[emp_cols.index('EmployeeName')] for r in cur.fetchall() if r[emp_cols.index('EmployeeID')]}

cur.execute("SELECT * FROM [tblProcessingCode]")
pc_cols = [d[0] for d in cur.description]
access_pcodes = {r[pc_cols.index('ProcessingCodeID')]: r[pc_cols.index('ProcessingName')] for r in cur.fetchall() if r[pc_cols.index('ProcessingCodeID')]}

access_conn.close()

# 2. Connect Supabase
pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
pg_cur = pg_conn.cursor()

# Check staging tables
pg_cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%staging%'")
staging_tables = [r['table_name'] for r in pg_cur.fetchall()]

pg_cur.execute("SELECT job_id, job_code, job_name, legacy_id FROM jobs")
sb_jobs = pg_cur.fetchall()

pg_cur.execute("SELECT step_id, job_id, step_no, step_name, legacy_id FROM job_steps")
sb_steps = pg_cur.fetchall()

pg_cur.execute("SELECT log_id, job_id, job_step_id, employee_id, legacy_id FROM work_logs")
sb_logs = pg_cur.fetchall()

pg_cur.execute("SELECT step_id, step_no, step_name FROM job_steps WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202' ORDER BY step_no")
shop_steps = pg_cur.fetchall()
shop_steps_by_no = {s['step_no']: s for s in shop_steps}

pg_conn.close()

# Maps
sb_jobs_by_legacy = {j['legacy_id']: j for j in sb_jobs if j.get('legacy_id')}
sb_steps_by_legacy = {s['legacy_id']: s for s in sb_steps if s.get('legacy_id')}
sb_logs_by_legacy = {l['legacy_id']: l for l in sb_logs if l.get('legacy_id')}

access_jobs_by_pk = {j['JobID']: j for j in access_jobs if j.get('JobID')}
access_steps_by_pk = {s['ProcessingDeadlineID']: s for s in access_steps if s.get('ProcessingDeadlineID')}

# 3. Analyze Steps
delta_steps_existing_parent = []
delta_steps_delta_parent = []
delta_steps_orphan = []

for s in access_steps:
    pk = s['ProcessingDeadlineID']
    legacy_id = f"LEGACY-STEP-{pk}"
    matched = sb_steps_by_legacy.get(legacy_id) or sb_steps_by_legacy.get(f"STEP-{pk}") or sb_steps_by_legacy.get(str(pk))
    if matched:
        continue
    
    parent_job_id = s.get('JobID')
    if parent_job_id is None or str(parent_job_id).strip() in ('', '0'):
        delta_steps_orphan.append(s)
    else:
        sb_parent = sb_jobs_by_legacy.get(f"JOB-{parent_job_id}") or sb_jobs_by_legacy.get(f"LEGACY-JOB-{parent_job_id}")
        if sb_parent:
            s['parent_sb_job_id'] = sb_parent['job_id']
            s['parent_sb_job_code'] = sb_parent['job_code']
            delta_steps_existing_parent.append(s)
        else:
            s['parent_access_job_id'] = parent_job_id
            delta_steps_delta_parent.append(s)

print(f"Delta Steps: {len(delta_steps_existing_parent) + len(delta_steps_delta_parent) + len(delta_steps_orphan)}")
print(f"  - Existing Supabase Parent: {len(delta_steps_existing_parent)}")
print(f"  - Delta Access Job Parent: {len(delta_steps_delta_parent)}")
print(f"  - Orphan (JobID = NULL): {len(delta_steps_orphan)}")

# 4. Analyze Work Logs
safe_work_logs = []
internal_work_logs = []
orphan_work_logs = []

for l in access_logs:
    pk = l['WorkLogID']
    legacy_id = f"LEGACY-LOG-{pk}"
    matched = sb_logs_by_legacy.get(legacy_id) or sb_logs_by_legacy.get(f"LOG-{pk}") or sb_logs_by_legacy.get(str(pk))
    if matched:
        continue
    
    deadline_id = l.get('ProcessingDeadlineID')
    proc_code_id = l.get('ProcessingCodeID')
    p_time = l.get('ProcessingTime')
    try:
        hours = float(p_time) if p_time is not None else 0.0
    except ValueError:
        hours = 0.0

    is_internal_code = proc_code_id in [50, 54, 42, 40, 888, '50', '54', '42', '40', '888']
    
    if deadline_id is None or str(deadline_id).strip() in ('', '0'):
        if is_internal_code:
            internal_work_logs.append(l)
        else:
            orphan_work_logs.append(l)
    else:
        sb_step = sb_steps_by_legacy.get(f"LEGACY-STEP-{deadline_id}") or sb_steps_by_legacy.get(f"STEP-{deadline_id}")
        access_step = access_steps_by_pk.get(deadline_id)
        
        if is_internal_code:
            internal_work_logs.append(l)
        elif sb_step:
            l['target_job_step_type'] = 'EXISTING_SUPABASE_STEP'
            l['target_job_step_id'] = sb_step['step_id']
            l['target_job_id'] = sb_step['job_id']
            l['hours'] = hours
            l['employee_name'] = access_employees.get(l.get('EmployeeID'))
            l['processing_name'] = access_pcodes.get(proc_code_id)
            safe_work_logs.append(l)
        elif access_step:
            l['target_job_step_type'] = 'DELTA_ACCESS_STEP'
            l['target_job_step_legacy'] = f"LEGACY-STEP-{deadline_id}"
            l['target_job_id'] = f"JOB-{access_step.get('JobID')}"
            l['hours'] = hours
            l['employee_name'] = access_employees.get(l.get('EmployeeID'))
            l['processing_name'] = access_pcodes.get(proc_code_id)
            safe_work_logs.append(l)
        else:
            orphan_work_logs.append(l)

print(f"\nDelta Work Logs: {len(safe_work_logs) + len(internal_work_logs) + len(orphan_work_logs)}")
print(f"  - Safe Work Logs: {len(safe_work_logs)} (hours: {sum(l['hours'] for l in safe_work_logs):.2f})")
print(f"  - Internal Work Logs: {len(internal_work_logs)}")
print(f"  - Orphan Work Logs: {len(orphan_work_logs)}")

# Breakdown internal logs
code_to_step = {
    50: (1, 'Step 1: 5S・工場清掃'),
    54: (2, 'Step 2: 設備・コンプレッサー保全'),
    42: (3, 'Step 3: 金型・治具修理'),
    40: (4, 'Step 4: スタッキング木板製作')
}

internal_mapped = []
internal_code_888 = []
internal_missing = []

for l in internal_work_logs:
    p_code = l.get('ProcessingCodeID')
    p_time = l.get('ProcessingTime')
    emp = l.get('EmployeeID')
    p_date = l.get('ProcessingDate')
    
    missing = []
    if not emp: missing.append('EmployeeID')
    if not p_date: missing.append('ProcessingDate')
    if not p_code: missing.append('ProcessingCodeID')
    if p_time is None or float(p_time) <= 0: missing.append('ProcessingTime')
    if missing:
        internal_missing.append({'WorkLogID': l['WorkLogID'], 'missing': missing})

    if p_code in code_to_step:
        s_no, s_label = code_to_step[p_code]
        l['candidate_step_no'] = s_no
        l['candidate_step_id'] = shop_steps_by_no[s_no]['step_id']
        l['candidate_step_name'] = shop_steps_by_no[s_no]['step_name']
        internal_mapped.append(l)
    elif p_code == 888:
        l['status'] = 'INTERNAL_TASK_UNMAPPED (Code 888 - Needs Step or Review)'
        internal_code_888.append(l)

print(f"\nInternal Logs Mapping Breakdown:")
print(f"  - Mapped to JOB-INTERNAL-SHOP (Codes 50, 54, 42, 40): {len(internal_mapped)}")
for s_no in [1, 2, 3, 4]:
    count = len([x for x in internal_mapped if x['candidate_step_no'] == s_no])
    print(f"    * Step {s_no} ({shop_steps_by_no[s_no]['step_name']}): {count} logs")
print(f"  - Unmapped Code 888: {len(internal_code_888)} logs")
print(f"  - Missing Required Fields: {len(internal_missing)} logs")

# Save detailed output
out_data = {
    'audit_metadata': {
        'timestamp': datetime.now().isoformat(),
        'staging_tables_in_supabase': staging_tables,
        'staging_tables_created_for_delta': 0
    },
    'delta_jobs_status_reaffirmation': {
        'total_delta_jobs': 27,
        'status': 'CONFLICT_REQUIRES_REVIEW (Candidate Mapping Only - Pending Minh Chu Thoan Approval)',
        'safe_to_stage': 0
    },
    'steps_breakdown': {
        'total_delta_steps': 81,
        'existing_supabase_parent_steps_count': len(delta_steps_existing_parent),
        'existing_supabase_parent_steps': [{
            'ProcessingDeadlineID': s['ProcessingDeadlineID'],
            'JobID': s['JobID'],
            'parent_sb_job_id': s['parent_sb_job_id'],
            'parent_sb_job_code': s['parent_sb_job_code'],
            'Deadline': s.get('ProcessingDeadline')
        } for s in delta_steps_existing_parent],
        'delta_access_parent_steps_count': len(delta_steps_delta_parent),
        'orphan_steps_count': len(delta_steps_orphan)
    },
    'safe_work_logs_summary': {
        'count': len(safe_work_logs),
        'total_hours': sum(l['hours'] for l in safe_work_logs),
        'by_target_type': {
            'EXISTING_SUPABASE_STEP': len([l for l in safe_work_logs if l['target_job_step_type'] == 'EXISTING_SUPABASE_STEP']),
            'DELTA_ACCESS_STEP': len([l for l in safe_work_logs if l['target_job_step_type'] == 'DELTA_ACCESS_STEP'])
        },
        'items': [{
            'WorkLogID': l['WorkLogID'],
            'legacy_id': f"LEGACY-LOG-{l['WorkLogID']}",
            'JobID': l.get('target_job_id'),
            'ProcessingDeadlineID': l.get('ProcessingDeadlineID'),
            'target_job_step': l.get('target_job_step_id') or l.get('target_job_step_legacy'),
            'target_type': l.get('target_job_step_type'),
            'employee_id': l.get('EmployeeID'),
            'employee_name': l.get('employee_name'),
            'processing_code_id': l.get('ProcessingCodeID'),
            'processing_name': l.get('processing_name'),
            'processing_date': l.get('ProcessingDate'),
            'hours': l.get('hours'),
            'validation': 'NEW_SAFE_TO_STAGE (Valid parent step & job reference)'
        } for l in safe_work_logs]
    },
    'internal_work_logs_summary': {
        'total_count': len(internal_work_logs),
        'total_hours': sum(float(l.get('ProcessingTime', 0)) for l in internal_work_logs),
        'mapped_to_shop_job': {
            'step_1_5s_code_50': len([x for x in internal_mapped if x['candidate_step_no'] == 1]),
            'step_2_maintenance_code_54': len([x for x in internal_mapped if x['candidate_step_no'] == 2]),
            'step_3_repair_code_42': len([x for x in internal_mapped if x['candidate_step_no'] == 3]),
            'step_4_stacking_code_40': len([x for x in internal_mapped if x['candidate_step_no'] == 4]),
            'total_mapped': len(internal_mapped)
        },
        'unmapped_code_888': {
            'count': len(internal_code_888),
            'status': 'INTERNAL_TASK_UNMAPPED (Flagged for Review / Needs Step Definition)',
            'hours': sum(float(l.get('ProcessingTime', 0)) for l in internal_code_888),
            'items': [{
                'WorkLogID': l['WorkLogID'],
                'EmployeeID': l.get('EmployeeID'),
                'employee_name': access_employees.get(l.get('EmployeeID')),
                'ProcessingCodeID': 888,
                'ProcessingDate': l.get('ProcessingDate'),
                'hours': float(l.get('ProcessingTime', 0)),
                'notes': l.get('ProcessingNotes')
            } for l in internal_code_888]
        },
        'missing_fields_validation': {
            'missing_count': len(internal_missing),
            'details': internal_missing
        }
    }
}

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\access_delta_round_a_supplement.json', 'w', encoding='utf-8') as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("\nHoàn tất xuất file bổ sung: scripts/access_delta_round_a_supplement.json")
