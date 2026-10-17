import os
import csv
import json
import codecs
from collections import defaultdict
import argparse
import requests
from dotenv import load_dotenv
import math

load_dotenv('.env.local')
DATA_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\csv-access-data"
OUTPUT_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai"
EXCEPTIONS_FILE = os.path.join(OUTPUT_DIR, 'recovery_exceptions.csv')

def get_rest_headers():
    key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
    return {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }

def fetch_existing_legacy_ids(table):
    existing = set()
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + f'/rest/v1/{table}?select=legacy_id&legacy_id=not.is.null'
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
            existing.add(row['legacy_id'])
        if len(data) < limit: break
        offset += limit
    return existing

def insert_rest(table, data):
    url = f"{os.environ['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/{table}"
    headers = get_rest_headers()
    chunk_size = 800
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        print(f"Inserting {len(chunk)} rows to {table} (Chunk {i//chunk_size + 1})...")
        r = requests.post(url, headers=headers, json=chunk)
        if r.status_code not in (200, 201, 204):
            raise Exception(f"REST API Error during insert to {table}: {r.text}")

def fetch_mapping_rest(table, legacy_col='legacy_id', id_col='id'):
    mapping = {}
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + f'/rest/v1/{table}?select={legacy_col},{id_col}&{legacy_col}=not.is.null'
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
            if row.get(legacy_col):
                mapping[row[legacy_col]] = row[id_col]
        if len(data) < limit: break
        offset += limit
    return mapping

def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path): return []
    try:
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError:
        with codecs.open(path, 'r', encoding='shift_jis', errors='replace') as f:
            content = f.read()
    return list(csv.DictReader(content.splitlines()))

def get_job_mapping(proc_id):
    pid = str(proc_id).strip()
    if pid in ['1', '2']: return '1', 'MOLD_NEW'
    if pid in ['11', '20', '22']: return '4', 'CUTTER_NEW'
    if pid in ['17', '23']: return '3', 'MAINTENANCE'
    if pid == '18': return '8', 'EQUIPMENT_REPAIR'
    if pid in ['10', '12', '13', '14', '21']: return '10', 'INTERNAL_OPS'
    if pid in ['3', '4', '6', '7', '5', '15', '19']: return '7', 'EQUIPMENT_NEW'
    return '10', 'OTHER'

def clean_float(val):
    try:
        f = float(val)
        if math.isnan(f): return 0
        return f
    except (ValueError, TypeError):
        return 0

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true', help='Execute DB inserts via REST')
    parser.add_argument('--stage', choices=['A', 'B'], default='B', help='Stage to execute')
    args = parser.parse_args()

    if args.stage == 'A':
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    exceptions = []

    print("Fetching mappings from Supabase...")
    equipment_map = fetch_mapping_rest('equipment', 'legacy_id', 'equipment_id')
    employee_map = fetch_mapping_rest('employees', 'legacy_id', 'employee_id')

    jobs_data = read_csv('jobs.csv')
    steps_data = read_csv('processingdeadline.csv')
    logs_data = read_csv('worklog.csv')

    valid_wos = {}
    valid_jobs = {}
    valid_steps = {}
    valid_logs = {}
    
    seen_wo_codes = set()
    seen_job_codes = set()

    job_category_stats = defaultdict(int)
    orphan_equipment_stats = 0
    orphan_employee_stats = 0
    
    for row in jobs_data:
        j_id = row.get('JobID')
        if not j_id: continue
        
        proc_id = row.get('ProcessingItemID')
        job_type, job_category = get_job_mapping(proc_id)
        
        mold_id = row.get('MoldID')
        eq_legacy = f"M-{mold_id}" if mold_id else None
        
        eq_uuid = equipment_map.get(eq_legacy)
        if not eq_uuid:
            orphan_equipment_stats += 1
            exceptions.append({
                'table': 'jobs',
                'legacy_id': f"LEGACY-JOB-{j_id}",
                'reason': f"Unresolved equipment_id for MoldID {mold_id}"
            })
            continue 
            
        job_category_stats[job_category] += 1
        
        wo_legacy = f"LEGACY-WO-{j_id}"
        job_legacy = f"LEGACY-JOB-{j_id}"
        
        wo_code = f"WO-L-{j_id}"
        counter = 2
        while wo_code in seen_wo_codes:
            wo_code = f"WO-L-{j_id}-{counter}"
            counter += 1
        seen_wo_codes.add(wo_code)
        
        job_code = row.get('JobCode') or f"JOB-L-{j_id}"
        original_job_code = job_code
        counter = 2
        while job_code in seen_job_codes:
            job_code = f"{original_job_code}-{counter}"
            counter += 1
        seen_job_codes.add(job_code)

        valid_wos[wo_legacy] = {
            'wo_code': wo_code,
            'wo_name': row.get('JobName') or f"Legacy WO {j_id}",
            'wo_type': 'OTHER',
            'wo_status': 'COMPLETED',
            'legacy_id': wo_legacy,
            'legacy_specs': row
        }
        
        valid_jobs[job_legacy] = {
            'job_code': job_code,
            'job_name': row.get('JobName') or f"Legacy Job {j_id}",
            'job_category': job_category,
            'job_type_id': job_type,
            'job_status': 'COMPLETED',
            'legacy_id': job_legacy,
            'legacy_specs': row,
            'equipment_id': eq_uuid,
            'wo_legacy': wo_legacy
        }

    job_step_counters = defaultdict(int)
    for row in steps_data:
        s_id = row.get('ProcessingDeadlineID')
        if not s_id: continue
        
        j_id = row.get('JobID')
        job_legacy = f"LEGACY-JOB-{j_id}" if j_id else None
        if job_legacy not in valid_jobs:
            exceptions.append({
                'table': 'job_steps',
                'legacy_id': f"LEGACY-STEP-{s_id}",
                'reason': f"Parent job LEGACY-JOB-{j_id} was skipped"
            })
            continue
        
        job_step_counters[job_legacy] += 1
        step_legacy = f"LEGACY-STEP-{s_id}"
        
        valid_steps[step_legacy] = {
            'step_no': job_step_counters[job_legacy],
            'step_name': row.get('ItemTypeID') or 'Legacy Step',
            'step_status': 'COMPLETED',
            'legacy_id': step_legacy,
            'legacy_specs': row,
            'job_legacy': job_legacy
        }

    for row in logs_data:
        l_id = row.get('WorkLogID')
        if not l_id: continue
        
        s_id = row.get('ProcessingDeadlineID')
        step_legacy = f"LEGACY-STEP-{s_id}" if s_id else None
        
        if step_legacy not in valid_steps:
            exceptions.append({
                'table': 'work_logs',
                'legacy_id': f"LEGACY-LOG-{l_id}",
                'reason': f"Parent step LEGACY-STEP-{s_id} was skipped"
            })
            continue
            
        emp_id_raw = row.get('EmployeeID')
        emp_legacy = f"EMP-{emp_id_raw}" if emp_id_raw else None
        emp_uuid = employee_map.get(emp_legacy)
        
        if not emp_uuid:
            orphan_employee_stats += 1
            exceptions.append({
                'table': 'work_logs',
                'legacy_id': f"LEGACY-LOG-{l_id}",
                'reason': f"Unresolved employee_id for EmployeeID {emp_id_raw}"
            })
            continue 
        
        job_legacy = valid_steps[step_legacy]['job_legacy']
        hours = clean_float(row.get('ProcessingTime'))
        
        log_legacy = f"LEGACY-LOG-{l_id}"
        
        valid_logs[log_legacy] = {
            'work_date': row.get('ProcessingDate') or '2000-01-01',
            'hours_spent': hours,
            'description': row.get('ProcessingNotes') or 'Legacy Log',
            'legacy_id': log_legacy,
            'legacy_specs': row,
            'job_legacy': job_legacy,
            'step_legacy': step_legacy,
            'employee_id': emp_uuid
        }

    with open(EXCEPTIONS_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['table', 'legacy_id', 'reason'])
        writer.writeheader()
        writer.writerows(exceptions)

    if args.execute:
        print("\n--- EXECUTE MODE: STAGE B ---")
        
        existing_wos = fetch_existing_legacy_ids('work_orders')
        wo_payload = [d for d in valid_wos.values() if d['legacy_id'] not in existing_wos]
        if wo_payload:
            insert_rest('work_orders', wo_payload)
            
        wo_id_map = fetch_mapping_rest('work_orders', 'legacy_id', 'wo_id')
        
        existing_jobs = fetch_existing_legacy_ids('jobs')
        job_payload = []
        for j_leg, j_data in valid_jobs.items():
            if j_leg in existing_jobs: continue
            j_data['work_order_id'] = wo_id_map.get(j_data['wo_legacy'])
            del j_data['wo_legacy']
            job_payload.append(j_data)
        if job_payload:
            insert_rest('jobs', job_payload)
            
        job_id_map = fetch_mapping_rest('jobs', 'legacy_id', 'job_id')
        
        existing_steps = fetch_existing_legacy_ids('job_steps')
        step_payload = []
        for s_leg, s_data in valid_steps.items():
            if s_leg in existing_steps: continue
            s_data['job_id'] = job_id_map.get(s_data['job_legacy'])
            del s_data['job_legacy']
            step_payload.append(s_data)
        if step_payload:
            insert_rest('job_steps', step_payload)
            
        step_id_map = fetch_mapping_rest('job_steps', 'legacy_id', 'step_id')
        
        existing_logs = fetch_existing_legacy_ids('work_logs')
        log_payload = []
        for l_leg, l_data in valid_logs.items():
            if l_leg in existing_logs: continue
            l_data['job_id'] = job_id_map.get(l_data['job_legacy'])
            l_data['job_step_id'] = step_id_map.get(l_data['step_legacy'])
            del l_data['job_legacy']
            del l_data['step_legacy']
            log_payload.append(l_data)
        if log_payload:
            insert_rest('work_logs', log_payload)
            
        print("Stage B executed successfully.")

if __name__ == "__main__":
    main()
