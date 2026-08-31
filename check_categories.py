import os, requests, json
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Check processing codes categories
r = requests.get(url + 'processing_codes?select=processing_code_id,processing_name,category', headers=headers)
codes = r.json()
print('All processing codes by category:')
from collections import defaultdict
by_cat = defaultdict(list)
for c in codes:
    cat = c.get('category') or 'NULL'
    by_cat[cat].append(c)

for cat, items in sorted(by_cat.items()):
    print(f"\n  Category: {cat}")
    for c in items:
        print(f"    [{c['processing_code_id']}] {c['processing_name']}")

# Also check equipment_id for INTERNAL_OPS and MAINTENANCE jobs
r2 = requests.get(url + 'jobs?job_category=in.(INTERNAL_OPS,MAINTENANCE)&select=job_id,job_code,job_name,job_category,equipment_id&limit=20', headers=headers)
print('\n\nINTERNAL_OPS & MAINTENANCE jobs:')
for j in r2.json():
    print(f"  {j['job_code']} | {j['job_name']} | cat={j['job_category']} | equip_id={j.get('equipment_id', 'NULL')}")
