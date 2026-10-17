import os, requests, random, json
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'count=exact,head=true'}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. count(*) WHERE processing_code_id IS NOT NULL
print('1. work_logs (processing_code_id IS NOT NULL):', requests.head(url + 'work_logs?processing_code_id=not.is.null', headers=headers).headers.get('content-range'))

# 2. count(*) WHERE description != 'Legacy Log'
print('2. work_logs (description != Legacy Log):', requests.head(url + 'work_logs?description=not.eq.Legacy%20Log', headers=headers).headers.get('content-range'))

# 3. count(*) WHERE step_name != Legacy Step%
print('3. job_steps (step_name properly mapped):', requests.head(url + 'job_steps?step_name=not.like.Legacy%', headers=headers).headers.get('content-range'))

# 4. Random sample
headers.pop('Prefer')
r = requests.get(url + 'work_logs?processing_code_id=not.is.null&limit=100', headers=headers)
logs = r.json()
sample = random.sample(logs, 5)
print('4. Random Sample Verification:')
for log in sample:
    specs = json.loads(log['legacy_specs']) if isinstance(log['legacy_specs'], str) else log['legacy_specs']
    legacy_code = specs.get('ProcessingCodeID')
    db_code = log['processing_code_id']
    match = 'MATCH' if str(legacy_code) == str(db_code) else 'MISMATCH'
    print(f"   LogID {log['log_id'][:8]}... | Legacy Code: {legacy_code} | DB Code: {db_code} | {match} | Name: {log['description']}")
