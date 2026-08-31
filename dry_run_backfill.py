import os, requests, json
from collections import defaultdict
import argparse
from dotenv import load_dotenv

load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

parser = argparse.ArgumentParser()
parser.add_argument('--execute', action='store_true')
args = parser.parse_args()

# 1. Fetch processing_codes
print("Fetching processing_codes...")
r = requests.get(url + 'processing_codes?select=processing_code_id,processing_name', headers=headers)
proc_codes = {str(c['processing_code_id']): c['processing_name'] for c in r.json()}
print(f"Loaded {len(proc_codes)} processing codes.")

# 2. Fetch work_logs
print("Fetching work_logs...")
work_logs = []
offset = 0
while True:
    r = requests.get(url + f'work_logs?select=log_id,legacy_specs&offset={offset}&limit=1000', headers=headers)
    data = r.json()
    if not data: break
    work_logs.extend(data)
    offset += len(data)
    if len(data) < 1000: break
print(f"Loaded {len(work_logs)} work_logs.")

resolve_success = 0
resolve_failed = 0
unmatched_codes = set()

# Group logs by processing code for batch update
logs_by_proc_code = defaultdict(list)

for log in work_logs:
    legacy_specs = log.get('legacy_specs')
    if not legacy_specs or not isinstance(legacy_specs, dict):
        if isinstance(legacy_specs, str):
            legacy_specs = json.loads(legacy_specs)
    
    code_id = legacy_specs.get('ProcessingCodeID')
    if not code_id:
        resolve_failed += 1
        unmatched_codes.add("MISSING_IN_SPECS")
        continue
    
    if str(code_id) in proc_codes:
        resolve_success += 1
        logs_by_proc_code[str(code_id)].append(log['log_id'])
    else:
        resolve_failed += 1
        unmatched_codes.add(str(code_id))

print(f"--- WORK LOGS DRY RUN ---")
print(f"Resolved successfully: {resolve_success}")
print(f"Failed to resolve: {resolve_failed}")
if resolve_failed > 0:
    print(f"Unmatched codes: {unmatched_codes}")

# 3. Fetch job_steps
print("\nFetching job_steps...")
job_steps = []
offset = 0
while True:
    r = requests.get(url + f'job_steps?select=step_id,step_name,legacy_specs&offset={offset}&limit=1000', headers=headers)
    data = r.json()
    if not data: break
    job_steps.extend(data)
    offset += len(data)
    if len(data) < 1000: break
print(f"Loaded {len(job_steps)} job_steps.")

item_type_map = {
    '1': 'アルミ材 (ALUMI)',
    '2': '金型 (MOLD)',
    '3': 'プラグ (PLUG)',
    '4': '抜型 (CUTTER)',
    '5': '水冷盤 (WATER COOLING BASE)',
    '6': '圧空ベース (PRESSURE BASE)',
    '7': 'スタッキング (STAKING)',
    '8': 'フレーム (FRAME)',
    '9': '機械など (MACHINE)',
    '10': '成形・プレス・出荷など (OTHER)',
    '11': '試作金型 (TEST MOLD)'
}

step_success = 0
step_failed = 0
step_unmatched = set()

steps_by_item_type = defaultdict(list)

for step in job_steps:
    legacy_specs = step.get('legacy_specs')
    if not legacy_specs or not isinstance(legacy_specs, dict):
        if isinstance(legacy_specs, str):
            legacy_specs = json.loads(legacy_specs)
            
    item_type = legacy_specs.get('ItemTypeID')
    if not item_type:
        step_failed += 1
        step_unmatched.add("MISSING_IN_SPECS")
        continue
        
    if str(item_type) in item_type_map:
        step_success += 1
        steps_by_item_type[str(item_type)].append(step['step_id'])
    else:
        step_failed += 1
        step_unmatched.add(str(item_type))

print(f"--- JOB STEPS DRY RUN ---")
print(f"Resolved successfully: {step_success}")
print(f"Failed to resolve: {step_failed}")
if step_failed > 0:
    print(f"Unmatched ItemTypeIDs: {step_unmatched}")

def chunk_list(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]

if args.execute:
    print("\n--- EXECUTING UPDATES VIA PATCH ---")
    
    # Update work_logs
    print("Updating work_logs...")
    logs_updated = 0
    for code_id, log_ids in logs_by_proc_code.items():
        payload = {
            'processing_code_id': int(code_id),
            'description': proc_codes[code_id]
        }
        for chunk in chunk_list(log_ids, 200):
            # log_id=in.(id1,id2)
            in_clause = 'in.(' + ','.join(chunk) + ')'
            r = requests.patch(url + 'work_logs?log_id=' + in_clause, headers=headers, json=payload)
            if r.status_code not in [200, 204]:
                print(f"Error updating logs for code {code_id}: {r.text}")
            else:
                logs_updated += len(chunk)
    print(f"Updated {logs_updated} work_logs.")
    
    # Update job_steps
    print("Updating job_steps...")
    steps_updated = 0
    for item_type, step_ids in steps_by_item_type.items():
        payload = {
            'step_name': item_type_map[item_type]
        }
        for chunk in chunk_list(step_ids, 200):
            in_clause = 'in.(' + ','.join(chunk) + ')'
            r = requests.patch(url + 'job_steps?step_id=' + in_clause, headers=headers, json=payload)
            if r.status_code not in [200, 204]:
                print(f"Error updating steps for type {item_type}: {r.text}")
            else:
                steps_updated += len(chunk)
    print(f"Updated {steps_updated} job_steps.")
    print("Done!")
