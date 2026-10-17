import sys
sys.stdout.reconfigure(encoding="utf-8")
import os, csv, codecs, argparse, json
from collections import defaultdict, Counter
from datetime import datetime
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')
DATA_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\csv-access-data"

def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    try:
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError:
        with codecs.open(path, 'r', encoding='shift_jis', errors='replace') as f:
            content = f.read()
    return list(csv.DictReader(content.splitlines()))

def parse_date(date_str):
    if not date_str or not date_str.strip(): return None
    return date_str.strip()

def get_equipment_type_from_proc_id(proc_id):
    pid = str(proc_id)
    mold_pids = {'1', '2', '5', '12', '18', '19', '21', '24', '26', '7', '10'}
    if pid in mold_pids: return 'MOLD'
    if pid == '3': return 'WATER_BASE'
    if pid == '4': return 'PRESSURE_BASE'
    if pid in {'6', '33'}: return 'PLUG'
    if pid in {'11', '20'}: return 'CUTTER_SEPARATE'
    if pid in {'22', '28'}: return 'CUTTER_INLINE'
    if pid == '9': return 'STACKING'
    return None

def get_job_mapping(proc_id):
    pid = str(proc_id).strip()
    if pid in ['1', '2']: return '1', 'MOLD_NEW'
    if pid in ['11', '20', '22']: return '4', 'CUTTER_NEW'
    if pid in ['17', '23']: return '3', 'MAINTENANCE'
    if pid == '18': return '8', 'EQUIPMENT_REPAIR'
    if pid in ['10', '12', '13', '14', '21']: return '10', 'INTERNAL_OPS'
    if pid in ['3', '4', '6', '7', '5', '15', '19']: return '7', 'EQUIPMENT_NEW'
    return '10', 'OTHER'


def chunk_list(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    args = parser.parse_args()

    key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
    headers = {'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'resolution=merge-duplicates,return=representation'}
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

    print("Fetching existing data from DB...")
    existing_equipment = set()
    existing_eq_codes = set()
    offset = 0
    while True:
        r = requests.get(url + f"equipment?select=legacy_id,equipment_code&offset={offset}&limit=1000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        data = r.json(); 
        if not data: break
        for row in data:
            if row['legacy_id']: existing_equipment.add(row['legacy_id'])
            if row['equipment_code']: existing_eq_codes.add(row['equipment_code'])
        offset += len(data); 
        if len(data) < 1000: break

    existing_jobs = set()
    offset = 0
    while True:
        r = requests.get(url + f"jobs?select=legacy_id&legacy_id=not.is.null&offset={offset}&limit=1000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        data = r.json()
        if not data: break
        for row in data: existing_jobs.add(row['legacy_id'])
        offset += len(data); 
        if len(data) < 1000: break

    existing_wos = set()
    r = requests.get(url + "work_orders?select=legacy_id&legacy_id=not.is.null&limit=3000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
    for row in r.json(): existing_wos.add(row['legacy_id'])
    
    existing_steps = set()
    offset = 0
    while True:
        r = requests.get(url + f"job_steps?select=legacy_id&legacy_id=not.is.null&offset={offset}&limit=1000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        data = r.json()
        if not data: break
        for row in data: existing_steps.add(row['legacy_id'])
        offset += len(data); 
        if len(data) < 1000: break
        
    existing_logs = set()
    offset = 0
    while True:
        r = requests.get(url + f"work_logs?select=legacy_id&legacy_id=not.is.null&offset={offset}&limit=2000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        data = r.json()
        if not data: break
        for row in data: existing_logs.add(row['legacy_id'])
        offset += len(data); 
        if len(data) < 2000: break

    molds_data = read_csv('molds.csv')
    jobs_data = read_csv('jobs.csv')
    steps_data = read_csv('processingdeadline.csv')
    logs_data = read_csv('worklog.csv')

    mold_to_proc = defaultdict(list)
    for j in jobs_data:
        m_id = j.get('MoldID')
        p_id = j.get('ProcessingItemID')
        if m_id and p_id: mold_to_proc[m_id].append(p_id)

    equipment_payloads = []
    for m in molds_data:
        m_id = m.get('MoldID')
        if not m_id: continue
        legacy_id = f"M-{m_id}"
        if legacy_id in existing_equipment: continue
        
        p_ids = mold_to_proc.get(m_id, [])
        eq_type = None
        for p_id in p_ids:
            t = get_equipment_type_from_proc_id(p_id)
            if t: eq_type = t; break
            
        legacy_specs = m.copy()
        if not eq_type:
            eq_type = 'MOLD'
            legacy_specs['import_note'] = 'loai suy doan, can xac minh'
            
        eq_code = m.get('MoldCode') or f"EQ-{m_id}"
        original_eq_code = eq_code
        counter = 2
        while eq_code in existing_eq_codes:
            eq_code = f"{original_eq_code}-{counter}"
            counter += 1
        existing_eq_codes.add(eq_code)
        
        equipment_payloads.append({
            'equipment_code': eq_code,
            'display_name': m.get('MoldName') or "Unknown",
            'equipment_type': eq_type,
            'legacy_id': legacy_id,
            'legacy_specs': json.dumps(legacy_specs)
        })

    if args.execute:
        print(f"Inserting Equipment ({len(equipment_payloads)})...")
        for chunk in chunk_list(equipment_payloads, 200):
            r = requests.post(url + 'equipment', headers=headers, json=chunk)
            if r.status_code not in [200, 201]: print(f"Eq err: {r.text}")

        # Map newly inserted equipment
        eq_id_map = {}
        offset = 0
        while True:
            r = requests.get(url + f"equipment?select=legacy_id,equipment_id&legacy_id=not.is.null&offset={offset}&limit=1000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
            data = r.json()
            if not data: break
            for row in data: eq_id_map[row['legacy_id']] = row['equipment_id']
            offset += len(data); 
            if len(data) < 1000: break
    
    # 2. Prepare jobs and WOs
    wo_payloads = []
    job_payloads = []
    seen_wo_codes = set()
    seen_job_codes = set()
    
    for j in jobs_data:
        j_id = j.get('JobID')
        if not j_id: continue
        job_legacy = f"LEGACY-JOB-{j_id}"
        if job_legacy in existing_jobs: continue
        
        wo_legacy = f"LEGACY-WO-{j_id}"
        wo_code = f"WO-L-{j_id}"
        counter = 2
        while wo_code in seen_wo_codes:
            wo_code = f"WO-L-{j_id}-{counter}"; counter += 1
        seen_wo_codes.add(wo_code)
        
        if wo_legacy not in existing_wos:
            wo_payloads.append({
                'wo_code': wo_code,
                'wo_name': j.get('JobName') or f"Legacy WO {j_id}",
                'wo_type': 'OTHER',
                'wo_status': 'COMPLETED',
                'legacy_id': wo_legacy,
                'legacy_specs': json.dumps(j)
            })
            
        job_code = j.get('JobCode') or f"JOB-L-{j_id}"
        counter = 2
        while job_code in seen_job_codes:
            job_code = f"{job_code}-{counter}"; counter += 1
        seen_job_codes.add(job_code)
        
        job_type, job_category = get_job_mapping(j.get('ProcessingItemID'))
        eq_legacy = f"M-{j.get('MoldID')}"
        eq_uuid = None
        if args.execute:
            eq_uuid = eq_id_map.get(eq_legacy)
            if not eq_uuid:
                print(f"Warning: eq_uuid not found for legacy {eq_legacy}")
        
        job_payloads.append({
            'job_code': job_code,
            'job_name': j.get('JobName') or f"Legacy Job {j_id}",
            'job_category': job_category,
            'job_type_id': job_type,
            'job_status': 'COMPLETED',
            'legacy_id': job_legacy,
            'start_date': parse_date(j.get('JobStartDate')),
            'deadline': parse_date(j.get('DeliveryDeadline')),
            'mold_deadline': parse_date(j.get('MoldShippingDate')),
            'legacy_specs': json.dumps(j),
            'equipment_id': eq_uuid,
            'wo_legacy': wo_legacy
        })

    if args.execute:
        print(f"Inserting WOs ({len(wo_payloads)})...")
        for chunk in chunk_list(wo_payloads, 200):
            r = requests.post(url + 'work_orders', headers=headers, json=chunk)
            if r.status_code not in [200, 201]: print(f"WO err: {r.text}")
        
        # Get WOs mapped
        wo_id_map = {}
        r = requests.get(url + "work_orders?select=legacy_id,wo_id&legacy_id=not.is.null&limit=3000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        for row in r.json(): wo_id_map[row['legacy_id']] = row['wo_id']
        
        for j in job_payloads:
            j['work_order_id'] = wo_id_map.get(j.pop('wo_legacy', None))
            
        print(f"Inserting Jobs ({len(job_payloads)})...")
        for chunk in chunk_list(job_payloads, 200):
            r = requests.post(url + 'jobs', headers=headers, json=chunk)
            if r.status_code not in [200, 201]: print(f"Job err: {r.text}")
            
        # Get jobs mapped
        job_id_map = {}
        offset = 0
        while True:
            r = requests.get(url + f"jobs?select=legacy_id,job_id&legacy_id=not.is.null&offset={offset}&limit=2000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
            data = r.json()
            if not data: break
            for row in data: job_id_map[row['legacy_id']] = row['job_id']
            offset += len(data)
            if len(data) < 2000: break
            
        # Prepare Steps
        step_payloads = []
        valid_step_legacies = set()
        job_step_counters = defaultdict(int)
        for s in steps_data:
            s_id = s.get('ProcessingDeadlineID')
            j_id = s.get('JobID')
            if not s_id or not j_id: continue
            step_legacy = f"LEGACY-STEP-{s_id}"
            if step_legacy in existing_steps: continue
            
            job_legacy = f"LEGACY-JOB-{j_id}"
            job_uuid = job_id_map.get(job_legacy)
            if job_uuid:
                valid_step_legacies.add(step_legacy)
                job_step_counters[job_uuid] += 1
                step_payloads.append({
                    'step_name': f'Legacy Step {s_id}',
                    'step_no': job_step_counters[job_uuid],
                    'job_id': job_uuid,
                    'step_status': 'COMPLETED',
                    'legacy_id': step_legacy,
                    'legacy_specs': json.dumps(s),
                    'deadline': parse_date(s.get('ProcessingDeadline')),
                    'estimated_hours': parse_date(s.get('EstimatedHours'))
                })
                
        print(f"Inserting Steps ({len(step_payloads)})...")
        for chunk in chunk_list(step_payloads, 200):
            r = requests.post(url + 'job_steps', headers=headers, json=chunk)
            if r.status_code not in [200, 201]: print(f"Step err: {r.text}")
            
        # Get Steps mapped
        step_id_map = {}
        offset = 0
        while True:
            r = requests.get(url + f"job_steps?select=legacy_id,step_id&legacy_id=not.is.null&offset={offset}&limit=3000", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
            data = r.json()
            if not data: break
            for row in data: step_id_map[row['legacy_id']] = row['step_id']
            offset += len(data)
            if len(data) < 3000: break
            
        # Fetch employees
        emp_code_map = {}
        r = requests.get(url + 'employees?select=employee_code,employee_id', headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        for row in r.json():
            emp_code_map[row['employee_code']] = row['employee_id']

        log_payloads = []
        for l in logs_data:
            s_id = l.get('ProcessingDeadlineID')
            l_id = l.get('WorkLogID')
            if not s_id or not l_id: continue
            log_legacy = f"LEGACY-LOG-{l_id}"
            if log_legacy in existing_logs: continue
            
            step_legacy = f"LEGACY-STEP-{s_id}"
            step_uuid = step_id_map.get(step_legacy)
            if step_uuid:
                job_uuid = next((s['job_id'] for s in step_payloads if s['legacy_id'] == step_legacy), None)
                emp_code = l.get('EmployeeCode')
                emp_uuid = emp_code_map.get(emp_code) if emp_code else None
                if not emp_uuid:
                    continue # PE rule: do not insert with NULL
                    
                log_payloads.append({
                    'job_id': job_uuid,
                    'job_step_id': step_uuid,
                    'legacy_id': log_legacy,
                    'legacy_specs': json.dumps(l),
                    'employee_id': emp_uuid,
                    'log_date': parse_date(l.get('WorkDate')) or parse_date(l.get('WorkStartTime')),
                    'actual_hours': float(l.get('WorkTime')) if l.get('WorkTime') else 0,
                    'status': 'COMPLETED'
                })
                
        print(f"Inserting Logs ({len(log_payloads)})...")
        for chunk in chunk_list(log_payloads, 200):
            r = requests.post(url + 'work_logs', headers=headers, json=chunk)
            if r.status_code not in [200, 201]: print(f"Log err: {r.text}")
            
        print("Done!")

if __name__ == "__main__":
    main()
