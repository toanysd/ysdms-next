import os, csv, codecs
from collections import defaultdict, Counter

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

# 1. We need the list of 688 missing molds
# In my previous analysis, these are the molds whose ItemTypeID is '' or '0',
# OR molds that do NOT have a valid chain.
# Wait, my previous analysis said: 
# "molds.csv has 4769 rows. But only 4648 had complete chain. So 121 molds DROPPED"
# Wait! In the first analysis I said:
# "Unmapped types (ItemTypeID not in mapping): 688 (400 empty, 288 '0')"
# Let's exactly find the 688 molds in molds.csv that were DROPPED from equipment!
import requests
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

# Get all legacy_ids for equipment
all_eq_legacy = set()
offset = 0
while True:
    r = requests.get(url + f"equipment?select=legacy_id&legacy_id=not.is.null&offset={offset}&limit=1000", headers=headers)
    data = r.json()
    if not data: break
    for row in data:
        all_eq_legacy.add(row['legacy_id'])
    offset += len(data)
    if len(data) < 1000: break

molds = read_csv('molds.csv')
missing_molds = {}
for m in molds:
    m_id = m.get('MoldID')
    if not m_id: continue
    legacy = f"M-{m_id}"
    if legacy not in all_eq_legacy:
        missing_molds[m_id] = m

print(f"Total missing molds from DB: {len(missing_molds)}")

# 2. Map ProcessingItemID to equipment_type
def get_equipment_type_from_proc_id(proc_id):
    pid = str(proc_id)
    # Based on get_job_mapping from import_access_legacy.py
    mold_pids = {'1', '2', '5', '12', '18', '19', '21', '24', '26'}
    if pid in mold_pids: return 'MOLD'
    if pid == '3': return 'WATER_BASE'
    if pid == '4': return 'PRESSURE_BASE'
    if pid in {'6', '33'}: return 'PLUG'
    if pid in {'11', '20'}: return 'CUTTER_SEPARATE'
    if pid in {'22', '28'}: return 'CUTTER_INLINE'
    if pid == '9': return 'STACKING'
    if pid in {'7', '10'}: return 'MOLD' # DESIGN jobs are usually for molds
    return None

# 3. Read jobs.csv and map MoldID -> list of ProcessingItemIDs
jobs = read_csv('jobs.csv')
mold_to_proc = defaultdict(list)
for j in jobs:
    m_id = j.get('MoldID')
    p_id = j.get('ProcessingItemID')
    if m_id and p_id:
        mold_to_proc[m_id].append(p_id)

# 4. Resolve the missing molds
resolved_stats = Counter()
fallback_stats = Counter()
mold_resolutions = {}

for m_id, m in missing_molds.items():
    p_ids = mold_to_proc.get(m_id, [])
    # Try to find a valid equipment type from the jobs associated with this mold
    eq_type = None
    for p_id in p_ids:
        t = get_equipment_type_from_proc_id(p_id)
        if t:
            eq_type = t
            break # Found a valid type
            
    if eq_type:
        resolved_stats[eq_type] += 1
        mold_resolutions[m_id] = (eq_type, True) # True = resolved via job
    else:
        # Fallback
        mold_resolutions[m_id] = ('MOLD', False) # False = fallback
        fallback_stats['MOLD (Fallback)'] += 1

print("\n--- RESOLUTION RESULTS ---")
print(f"Total molds to resolve: {len(missing_molds)}")
total_resolved = sum(resolved_stats.values())
total_fallback = sum(fallback_stats.values())
print(f"Resolved via job references: {total_resolved}")
print(f"Failed to resolve (Fallback needed): {total_fallback}")

print("\n--- Breakdown of Resolved Types ---")
for t, c in resolved_stats.most_common():
    print(f"  {t}: {c}")

print("\n--- Breakdown of Fallback Types ---")
for t, c in fallback_stats.most_common():
    print(f"  {t}: {c}")
