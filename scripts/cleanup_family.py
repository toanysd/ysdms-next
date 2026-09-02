
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

res = supabase.table('plastic_master').select('plastic_id, plastic_family').execute()

def normalize(family):
    f = str(family).upper().replace('（', '(').replace('）', ')')
    if 'A-PET' in f or 'APET' in f: return 'A-PET'
    if 'PET' in f: return 'PET'
    if 'PP' in f or 'ＰＰ' in f: return 'PP'
    if 'PS' in f or 'ＰＳ' in f: return 'PS'
    if 'PVC' in f or 'ＰＶＣ' in f: return 'PVC'
    if 'DNF' in f or 'ＤＮＦ' in f: return 'DNF'
    if f.strip() in ['-', '材質', 'UNKNOWN', '']: return 'UNKNOWN'
    return 'OTHER'

updates = []
for row in res.data:
    new_fam = normalize(row['plastic_family'])
    if new_fam != row['plastic_family']:
        updates.append({ 'plastic_id': row['plastic_id'], 'plastic_family': new_fam })

print(f'Need to update {len(updates)} records.')

# Group updates by family to see the new distribution
from collections import Counter
new_dist = Counter([normalize(row['plastic_family']) for row in res.data])
print('New distribution:', dict(new_dist))

# Perform update
for u in updates:
    supabase.table('plastic_master').update({'plastic_family': u['plastic_family']}).eq('plastic_id', u['plastic_id']).execute()

print('Cleanup completed.')
