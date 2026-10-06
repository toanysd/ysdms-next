import pyodbc
import json
import hashlib
import os
import sys
import re
from datetime import date, datetime
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

ACCESS_DB_PATH = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
ENV_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local'

def serialize(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    return obj

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(1024 * 1024 * 8):
            h.update(chunk)
    return h.hexdigest()

def compute_row_hash(row_dict):
    canonical_str = json.dumps(row_dict, sort_keys=True, default=serialize)
    return hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()

def get_db_url():
    with open(ENV_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'^DATABASE_URL=(.*)$', content, re.MULTILINE)
    if not m:
        raise ValueError("DATABASE_URL not found in .env.local")
    return m.group(1).strip()

def main():
    start_time = datetime.now()
    print(f"=== BẮT ĐẦU VÒNG A: AUDIT DELTA ACCESS CHỈ-ĐỌC ===")
    print(f"Thời gian: {start_time.isoformat()}")

    # 1. Tính SHA-256 động
    print("\n[1] Tính SHA-256 động của file Access...")
    file_size = os.path.getsize(ACCESS_DB_PATH)
    file_sha256 = compute_sha256(ACCESS_DB_PATH)
    print(f"File: {ACCESS_DB_PATH}")
    print(f"File size: {file_size:,} bytes")
    print(f"SHA-256: {file_sha256}")

    # 2. Đọc Access Read-Only
    print("\n[2] Đọc Access ở chế độ ReadOnly=1...")
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
    print(f"- tblJOB: {len(access_jobs)} dòng")

    # Read tblProcessingDeadline
    cur.execute("SELECT * FROM [tblProcessingDeadline]")
    step_cols = [d[0] for d in cur.description]
    access_steps = [{step_cols[i]: serialize(val) for i, val in enumerate(row)} for row in cur.fetchall()]
    print(f"- tblProcessingDeadline: {len(access_steps)} dòng")

    # Read tblWorkLog
    cur.execute("SELECT * FROM [tblWorkLog]")
    log_cols = [d[0] for d in cur.description]
    access_logs = [{log_cols[i]: serialize(val) for i, val in enumerate(row)} for row in cur.fetchall()]
    print(f"- tblWorkLog: {len(access_logs)} dòng")

    # Read Master Access
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

    # 3. Đọc Supabase Production (Read-Only)
    print("\n[3] Đọc Supabase Production ở chế độ Read-Only...")
    db_url = get_db_url()
    pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
    pg_cur = pg_conn.cursor()

    # Fetch jobs
    pg_cur.execute("""
        SELECT job_id, job_code, job_name, legacy_id, company_id, equipment_id, product_id, 
               work_order_id, job_status, created_at
        FROM jobs
    """)
    sb_jobs = pg_cur.fetchall()
    print(f"- Supabase jobs: {len(sb_jobs)} dòng")

    # Fetch job_steps
    pg_cur.execute("""
        SELECT step_id, job_id, step_no, step_name, legacy_id, processing_status_id, 
               deadline, actual_hours, step_status
        FROM job_steps
    """)
    sb_steps = pg_cur.fetchall()
    print(f"- Supabase job_steps: {len(sb_steps)} dòng")

    # Fetch work_logs
    pg_cur.execute("""
        SELECT log_id, job_id, job_step_id, employee_id, legacy_id, work_date, hours_spent, 
               processing_code_id, is_finished
        FROM work_logs
    """)
    sb_logs = pg_cur.fetchall()
    print(f"- Supabase work_logs: {len(sb_logs)} dòng")

    # Fetch companies
    pg_cur.execute("SELECT company_id, company_code, company_name, legacy_id FROM companies")
    sb_companies = pg_cur.fetchall()

    # Fetch employees
    pg_cur.execute("SELECT employee_id, employee_code, employee_name, legacy_id FROM employees")
    sb_employees = pg_cur.fetchall()

    # Fetch equipment
    pg_cur.execute("SELECT equipment_id, equipment_code, display_name, legacy_id FROM equipment")
    sb_equipment = pg_cur.fetchall()

    # Fetch work_orders
    pg_cur.execute("SELECT wo_id, wo_code, legacy_id, company_id FROM work_orders")
    sb_work_orders = pg_cur.fetchall()

    pg_conn.close()

    # Index Supabase Data
    sb_jobs_by_legacy = {j['legacy_id']: j for j in sb_jobs if j.get('legacy_id')}
    sb_jobs_by_code = {}
    for j in sb_jobs:
        code = j.get('job_code')
        if code:
            sb_jobs_by_code.setdefault(code, []).append(j)

    sb_steps_by_legacy = {s['legacy_id']: s for s in sb_steps if s.get('legacy_id')}
    sb_logs_by_legacy = {l['legacy_id']: l for l in sb_logs if l.get('legacy_id')}

    sb_comp_by_legacy = {c['legacy_id']: c for c in sb_companies if c.get('legacy_id')}
    sb_comp_by_name = {c['company_name']: c for c in sb_companies if c.get('company_name')}

    sb_emp_by_legacy = {e['legacy_id']: e for e in sb_employees if e.get('legacy_id')}
    sb_emp_by_name = {e['employee_name']: e for e in sb_employees if e.get('employee_name')}

    sb_equip_by_legacy = {eq['legacy_id']: eq for eq in sb_equipment if eq.get('legacy_id')}
    sb_equip_by_code = {eq['equipment_code']: eq for eq in sb_equipment if eq.get('equipment_code')}

    sb_wo_by_legacy = {w['legacy_id']: w for w in sb_work_orders if w.get('legacy_id')}

    print("\n[4] Tiến hành đối soát chéo và phân loại 6 trạng thái...")

    # =========================================================================
    # A. AUDIT DELTA JOBS (tblJOB vs jobs)
    # =========================================================================
    classified_jobs = []
    job_counts = {
        'MATCHED_ALREADY': 0,
        'NEW_SAFE_TO_STAGE': 0,
        'CONFLICT_REQUIRES_REVIEW': 0,
        'UNRESOLVED_PARENT': 0,
        'INTERNAL_TASK': 0,
        'SKIP_DUPLICATE': 0
    }

    seen_job_pks = set()

    for row in access_jobs:
        pk = row.get('JobID')
        legacy_id = f"JOB-{pk}"
        row_hash = compute_row_hash(row)
        
        item = {
            'source_table': 'tblJOB',
            'source_primary_key': pk,
            'source_file_sha256': file_sha256,
            'source_row_hash': row_hash,
            'legacy_id': legacy_id,
            'job_no': row.get('JobNo'),
            'job_name': row.get('JobName'),
            'company_id_raw': row.get('CompanyID'),
            'company_name_raw': access_companies.get(row.get('CompanyID')),
            'target_candidate_id': None,
            'validation_status': None,
            'validation_error': None,
            'mapping_details': {}
        }

        # Check duplicate in source
        if pk in seen_job_pks:
            item['validation_status'] = 'SKIP_DUPLICATE'
            item['validation_error'] = 'Duplicate JobID in Access source'
            classified_jobs.append(item)
            job_counts['SKIP_DUPLICATE'] += 1
            continue
        seen_job_pks.add(pk)

        # Check matched already
        matched = sb_jobs_by_legacy.get(legacy_id)
        if not matched:
            # Check old legacy format e.g. "LEGACY-JOB-xxx" or plain integer
            matched = sb_jobs_by_legacy.get(f"LEGACY-JOB-{pk}") or sb_jobs_by_legacy.get(str(pk))

        if matched:
            item['validation_status'] = 'MATCHED_ALREADY'
            item['target_candidate_id'] = matched['job_id']
            item['mapping_details'] = {
                'matched_job_code': matched['job_code'],
                'matched_legacy_id': matched['legacy_id']
            }
            job_counts['MATCHED_ALREADY'] += 1
        else:
            # Candidate for Delta!
            # Check Company
            comp_name = item['company_name_raw']
            matched_comp = sb_comp_by_legacy.get(f"COMP-{row.get('CompanyID')}") or sb_comp_by_name.get(comp_name)
            
            # Check Internal YSD
            is_internal = False
            if comp_name and ('YSD' in comp_name or '吉田' in comp_name or '社内' in comp_name):
                is_internal = True
            
            # Check JobNo conflict
            job_no = row.get('JobNo')
            same_code_jobs = sb_jobs_by_code.get(job_no, [])

            if is_internal:
                item['validation_status'] = 'INTERNAL_TASK'
                item['validation_error'] = 'Internal company work, candidates for internal operations'
                item['mapping_details']['company_resolved'] = matched_comp['company_id'] if matched_comp else None
                job_counts['INTERNAL_TASK'] += 1
            elif len(same_code_jobs) > 0:
                item['validation_status'] = 'CONFLICT_REQUIRES_REVIEW'
                item['validation_error'] = f"JobCode '{job_no}' already exists in Supabase ({len(same_code_jobs)} jobs), requires manual review"
                item['mapping_details']['conflicting_jobs'] = [j['job_id'] for j in same_code_jobs]
                job_counts['CONFLICT_REQUIRES_REVIEW'] += 1
            elif matched_comp:
                item['validation_status'] = 'NEW_SAFE_TO_STAGE'
                item['mapping_details']['company_resolved'] = matched_comp['company_id']
                item['mapping_details']['candidate_wo_code'] = f"WO-{job_no}" if job_no else None
                job_counts['NEW_SAFE_TO_STAGE'] += 1
            else:
                item['validation_status'] = 'CONFLICT_REQUIRES_REVIEW'
                item['validation_error'] = f"Company '{comp_name}' (ID: {row.get('CompanyID')}) cannot be resolved to Supabase companies"
                job_counts['CONFLICT_REQUIRES_REVIEW'] += 1

        classified_jobs.append(item)

    # =========================================================================
    # B. AUDIT DELTA STEPS (tblProcessingDeadline vs job_steps)
    # =========================================================================
    classified_steps = []
    step_counts = {
        'MATCHED_ALREADY': 0,
        'NEW_SAFE_TO_STAGE': 0,
        'CONFLICT_REQUIRES_REVIEW': 0,
        'UNRESOLVED_PARENT': 0,
        'INTERNAL_TASK': 0,
        'SKIP_DUPLICATE': 0
    }

    seen_step_pks = set()
    access_jobs_by_pk = {j['JobID']: j for j in access_jobs if j.get('JobID')}

    for row in access_steps:
        pk = row.get('ProcessingDeadlineID')
        legacy_id = f"LEGACY-STEP-{pk}"
        row_hash = compute_row_hash(row)
        parent_job_id = row.get('JobID')

        item = {
            'source_table': 'tblProcessingDeadline',
            'source_primary_key': pk,
            'source_file_sha256': file_sha256,
            'source_row_hash': row_hash,
            'legacy_id': legacy_id,
            'parent_job_id_raw': parent_job_id,
            'step_no': row.get('DeadlineIndex') or row.get('StepNo'),
            'deadline_date': row.get('ProcessingDeadlineDate'),
            'item_id_raw': row.get('ProcessingItemID'),
            'status_id_raw': row.get('ProcessingStatusID'),
            'target_candidate_id': None,
            'validation_status': None,
            'validation_error': None,
            'mapping_details': {}
        }

        # Check duplicate
        if pk in seen_step_pks:
            item['validation_status'] = 'SKIP_DUPLICATE'
            item['validation_error'] = 'Duplicate ProcessingDeadlineID in Access source'
            classified_steps.append(item)
            step_counts['SKIP_DUPLICATE'] += 1
            continue
        seen_step_pks.add(pk)

        # Check matched already
        matched = sb_steps_by_legacy.get(legacy_id) or sb_steps_by_legacy.get(f"STEP-{pk}") or sb_steps_by_legacy.get(str(pk))
        if matched:
            item['validation_status'] = 'MATCHED_ALREADY'
            item['target_candidate_id'] = matched['step_id']
            item['mapping_details'] = {
                'matched_step_id': matched['step_id'],
                'matched_job_id': matched['job_id']
            }
            step_counts['MATCHED_ALREADY'] += 1
        else:
            # Check Parent Job
            if parent_job_id is None or str(parent_job_id).strip() == '' or str(parent_job_id).strip() == '0':
                item['validation_status'] = 'UNRESOLVED_PARENT'
                item['validation_error'] = 'JobID is NULL or empty in Access (Orphan Step)'
                step_counts['UNRESOLVED_PARENT'] += 1
            else:
                # Find parent in Supabase
                parent_job_legacy = f"JOB-{parent_job_id}"
                sb_parent_job = sb_jobs_by_legacy.get(parent_job_legacy) or sb_jobs_by_legacy.get(f"LEGACY-JOB-{parent_job_id}")
                
                access_parent_job = access_jobs_by_pk.get(parent_job_id)

                if sb_parent_job:
                    # Parent job already in Supabase -> step is supplement to existing job
                    item['validation_status'] = 'NEW_SAFE_TO_STAGE'
                    item['mapping_details']['parent_resolution'] = 'EXISTING_SUPABASE_JOB'
                    item['mapping_details']['parent_job_id'] = sb_parent_job['job_id']
                    step_counts['NEW_SAFE_TO_STAGE'] += 1
                elif access_parent_job:
                    # Parent job in Access 27 Delta Jobs
                    item['validation_status'] = 'NEW_SAFE_TO_STAGE'
                    item['mapping_details']['parent_resolution'] = 'DELTA_ACCESS_JOB'
                    item['mapping_details']['parent_legacy_id'] = parent_job_legacy
                    step_counts['NEW_SAFE_TO_STAGE'] += 1
                else:
                    item['validation_status'] = 'UNRESOLVED_PARENT'
                    item['validation_error'] = f"JobID {parent_job_id} does not exist in tblJOB nor Supabase"
                    step_counts['UNRESOLVED_PARENT'] += 1

        classified_steps.append(item)

    # =========================================================================
    # C. AUDIT DELTA WORK LOGS (tblWorkLog vs work_logs)
    # =========================================================================
    classified_logs = []
    log_counts = {
        'MATCHED_ALREADY': 0,
        'NEW_SAFE_TO_STAGE': 0,
        'CONFLICT_REQUIRES_REVIEW': 0,
        'UNRESOLVED_PARENT': 0,
        'INTERNAL_TASK': 0,
        'SKIP_DUPLICATE': 0
    }

    seen_log_pks = set()
    access_steps_by_pk = {s['ProcessingDeadlineID']: s for s in access_steps if s.get('ProcessingDeadlineID')}

    total_delta_hours = 0.0

    for row in access_logs:
        pk = row.get('WorkLogID')
        legacy_id = f"LEGACY-LOG-{pk}"
        row_hash = compute_row_hash(row)
        deadline_id = row.get('ProcessingDeadlineID')
        proc_code_id = row.get('ProcessingCodeID')
        p_time = row.get('ProcessingTime')
        try:
            hours = float(p_time) if p_time is not None else 0.0
        except ValueError:
            hours = 0.0

        item = {
            'source_table': 'tblWorkLog',
            'source_primary_key': pk,
            'source_file_sha256': file_sha256,
            'source_row_hash': row_hash,
            'legacy_id': legacy_id,
            'processing_deadline_id_raw': deadline_id,
            'processing_code_id_raw': proc_code_id,
            'processing_code_name': access_pcodes.get(proc_code_id),
            'employee_id_raw': row.get('EmployeeID'),
            'employee_name_raw': access_employees.get(row.get('EmployeeID')),
            'processing_date': row.get('ProcessingDate'),
            'processing_time': hours,
            'notes': row.get('ProcessingNotes'),
            'target_candidate_id': None,
            'validation_status': None,
            'validation_error': None,
            'mapping_details': {}
        }

        # Check duplicate
        if pk in seen_log_pks:
            item['validation_status'] = 'SKIP_DUPLICATE'
            item['validation_error'] = 'Duplicate WorkLogID in Access source'
            classified_logs.append(item)
            log_counts['SKIP_DUPLICATE'] += 1
            continue
        seen_log_pks.add(pk)

        # Check matched already
        matched = sb_logs_by_legacy.get(legacy_id) or sb_logs_by_legacy.get(f"LOG-{pk}") or sb_logs_by_legacy.get(str(pk))
        if matched:
            item['validation_status'] = 'MATCHED_ALREADY'
            item['target_candidate_id'] = matched['log_id']
            item['mapping_details'] = {
                'matched_log_id': matched['log_id']
            }
            log_counts['MATCHED_ALREADY'] += 1
        else:
            # Candidate Delta Log!
            total_delta_hours += hours

            # Check Internal Codes: 50 (5S), 54 (保全), 42 (修理), 40 (スタッキング), 888
            is_internal_code = proc_code_id in [50, 54, 42, 40, 888, '50', '54', '42', '40', '888']
            
            # Check Deadline ID
            if deadline_id is None or str(deadline_id).strip() == '' or str(deadline_id).strip() == '0':
                if is_internal_code:
                    item['validation_status'] = 'INTERNAL_TASK'
                    item['validation_error'] = 'WorkLog without Step, matches internal shop task category'
                    item['mapping_details']['suggested_job'] = 'JOB-INTERNAL-SHOP'
                    log_counts['INTERNAL_TASK'] += 1
                else:
                    item['validation_status'] = 'UNRESOLVED_PARENT'
                    item['validation_error'] = 'ProcessingDeadlineID is NULL or empty (94 unlinked logs group)'
                    log_counts['UNRESOLVED_PARENT'] += 1
            else:
                # Find step in Supabase or in Access steps
                step_legacy = f"LEGACY-STEP-{deadline_id}"
                sb_step = sb_steps_by_legacy.get(step_legacy) or sb_steps_by_legacy.get(f"STEP-{deadline_id}")
                access_step = access_steps_by_pk.get(deadline_id)

                if is_internal_code:
                    item['validation_status'] = 'INTERNAL_TASK'
                    item['validation_error'] = f"ProcessingCode {proc_code_id} is an internal shop task"
                    item['mapping_details']['suggested_job'] = 'JOB-INTERNAL-SHOP'
                    log_counts['INTERNAL_TASK'] += 1
                elif sb_step:
                    item['validation_status'] = 'NEW_SAFE_TO_STAGE'
                    item['mapping_details']['parent_step_resolved'] = sb_step['step_id']
                    item['mapping_details']['parent_job_resolved'] = sb_step['job_id']
                    log_counts['NEW_SAFE_TO_STAGE'] += 1
                elif access_step:
                    item['validation_status'] = 'NEW_SAFE_TO_STAGE'
                    item['mapping_details']['parent_step_resolved'] = step_legacy
                    item['mapping_details']['parent_job_resolved'] = f"JOB-{access_step.get('JobID')}"
                    log_counts['NEW_SAFE_TO_STAGE'] += 1
                else:
                    item['validation_status'] = 'UNRESOLVED_PARENT'
                    item['validation_error'] = f"ProcessingDeadlineID {deadline_id} not found in steps"
                    log_counts['UNRESOLVED_PARENT'] += 1

        classified_logs.append(item)

    # 5. Đóng gói Artifact JSON
    export_payload = {
        'audit_metadata': {
            'timestamp': datetime.now().isoformat(),
            'source_file_path': ACCESS_DB_PATH,
            'source_file_size': file_size,
            'source_file_sha256': file_sha256,
            'supabase_baseline': {
                'jobs_total': len(sb_jobs),
                'job_steps_total': len(sb_steps),
                'work_logs_total': len(sb_logs)
            }
        },
        'summary_statistics': {
            'jobs': {
                'access_total': len(access_jobs),
                'supabase_total': len(sb_jobs),
                'delta_count': len(access_jobs) - job_counts['MATCHED_ALREADY'],
                'by_status': job_counts
            },
            'steps': {
                'access_total': len(access_steps),
                'supabase_total': len(sb_steps),
                'delta_count': len(access_steps) - step_counts['MATCHED_ALREADY'],
                'by_status': step_counts
            },
            'work_logs': {
                'access_total': len(access_logs),
                'supabase_total': len(sb_logs),
                'delta_count': len(access_logs) - log_counts['MATCHED_ALREADY'],
                'total_delta_hours': round(total_delta_hours, 2),
                'by_status': log_counts
            }
        },
        'delta_candidates_details': {
            'jobs_delta_list': [j for j in classified_jobs if j['validation_status'] != 'MATCHED_ALREADY'],
            'steps_orphan_list': [s for s in classified_steps if s['validation_status'] == 'UNRESOLVED_PARENT'],
            'work_logs_internal_list': [l for l in classified_logs if l['validation_status'] == 'INTERNAL_TASK'],
            'work_logs_orphan_list': [l for l in classified_logs if l['validation_status'] == 'UNRESOLVED_PARENT']
        }
    }

    out_file = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\access_delta_round_a_audit.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(export_payload, f, ensure_ascii=False, indent=2)

    print(f"\n[5] Đã xuất bản artifact JSON: {out_file}")
    print("\n=== TỔNG HỢP KẾT QUẢ VÒNG A ===")
    print("JOBS:")
    print(f"  - Total Access: {len(access_jobs)}, Matched: {job_counts['MATCHED_ALREADY']}, Delta: {len(access_jobs) - job_counts['MATCHED_ALREADY']}")
    print(f"  - Details: {json.dumps(job_counts, indent=2)}")
    print("STEPS:")
    print(f"  - Total Access: {len(access_steps)}, Matched: {step_counts['MATCHED_ALREADY']}, Delta: {len(access_steps) - step_counts['MATCHED_ALREADY']}")
    print(f"  - Details: {json.dumps(step_counts, indent=2)}")
    print("WORK LOGS:")
    print(f"  - Total Access: {len(access_logs)}, Matched: {log_counts['MATCHED_ALREADY']}, Delta: {len(access_logs) - log_counts['MATCHED_ALREADY']}")
    print(f"  - Delta Hours: {total_delta_hours:.2f} hrs")
    print(f"  - Details: {json.dumps(log_counts, indent=2)}")

if __name__ == '__main__':
    main()
