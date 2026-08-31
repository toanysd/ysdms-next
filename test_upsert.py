import os, requests, json
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'resolution=merge-duplicates,return=representation'}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

# Get one work_log
r = requests.get(url + 'work_logs?limit=1', headers={'apikey': key, 'Authorization': 'Bearer ' + key})
log = r.json()[0]
print('Before update:', log['employee_id'], log['description'])

# Try upsert with only log_id and description
payload = {
    'log_id': log['log_id'],
    'description': 'TEST_UPSERT'
}
r2 = requests.post(url + 'work_logs', headers=headers, json=[payload])
if r2.status_code not in [200, 201]:
    print('Upsert failed:', r2.status_code, r2.text)
else:
    print('Upsert response:', r2.status_code)

# Verify if employee_id was lost
r3 = requests.get(url + f"work_logs?log_id=eq.{log['log_id']}", headers={'apikey': key, 'Authorization': 'Bearer ' + key})
log_after = r3.json()[0]
print('After update:', log_after['employee_id'], log_after['description'])

# Revert
r_revert = requests.patch(url + f"work_logs?log_id=eq.{log['log_id']}", headers={'apikey': key, 'Authorization': 'Bearer ' + key}, json={'description': log['description']})
print('Revert status:', r_revert.status_code)
