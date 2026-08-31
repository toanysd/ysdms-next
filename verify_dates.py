import os, requests, random, json
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

h = dict(headers)
h['Prefer'] = 'count=exact,head=true'
r = requests.head(url + 'jobs?or=(deadline.not.is.null,start_date.not.is.null,mold_deadline.not.is.null)', headers=h)
count = int(r.headers.get('content-range').split('/')[1])
print(f'Count of NOT NULLs: {count}')

if count >= 767:
    r2 = requests.get(url + 'jobs?select=start_date,deadline,mold_deadline,legacy_specs,job_code&or=(deadline.not.is.null,start_date.not.is.null,mold_deadline.not.is.null)', headers=headers)
    data = r2.json()
    starts = [d['start_date'] for d in data if d['start_date']]
    deadlines = [d['deadline'] for d in data if d['deadline']]
    mold_deadlines = [d['mold_deadline'] for d in data if d['mold_deadline']]
    print(f'Start Dates: {min(starts)} to {max(starts)}')
    print(f'Deadlines: {min(deadlines)} to {max(deadlines)}')
    print(f'Mold Deadlines: {min(mold_deadlines) if mold_deadlines else "None"} to {max(mold_deadlines) if mold_deadlines else "None"}')
    
    samples = random.sample(data, min(5, len(data)))
    print('\n--- SAMPLES ---')
    for s in samples:
        orig = s['legacy_specs']
        print(f"Job: {s['job_code']}")
        print(f"  [DB] start: {s['start_date']} | deadline: {s['deadline']} | mold_deadline: {s['mold_deadline']}")
        print(f"  [CSV] start: {orig.get('JobStartDate')} | deadline: {orig.get('DeliveryDeadline')} | mold_deadline: {orig.get('MoldShippingDate')}")
