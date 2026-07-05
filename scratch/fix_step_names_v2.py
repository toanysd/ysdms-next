"""
Fix job_steps step_name and item_type_id.
Root cause: CSV floats (228.0) vs DB strings ("228") caused lookup failures.
"""
import sys
import pandas as pd
from collections import defaultdict, Counter
sys.path.append('d:/AntiGravity_Workspace/apps/ysdms-nextgen/scripts/seed_v5')
from config import get_supabase_client, CSV_DIR

ITEM_TYPE_MAP = {
    1: 'ALUMI',
    2: 'MOLD',
    3: 'PLUG',
    4: 'CUTTER',
    5: 'WATER COOLING BASE',
    6: 'PRESSIER BASE',
    7: 'STAKING',
    8: 'FRAME',
    9: 'MACHINE',
    10: 'OTHER',
    11: 'TEST MOLD',
}

def safe_int_str(val):
    """Convert float-like value to integer string: 228.0 -> '228'"""
    if pd.isna(val):
        return None
    try:
        return str(int(float(val)))
    except (ValueError, TypeError):
        return str(val)

def safe_int(val):
    """Convert float-like value to int: 2.0 -> 2"""
    if pd.isna(val):
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None

s = get_supabase_client()

# Read CSV
df = pd.read_csv(CSV_DIR / 'processingdeadline.csv', encoding='utf-8')
print(f"CSV has {len(df)} rows")

# Get jobs legacy mapping
all_jobs = []
offset = 0
while True:
    batch = s.table('jobs').select('job_id, legacy_id').range(offset, offset + 999).execute()
    if not batch.data:
        break
    all_jobs.extend(batch.data)
    if len(batch.data) < 1000:
        break
    offset += 1000

job_legacy_map = {str(j['legacy_id']): j['job_id'] for j in all_jobs if j.get('legacy_id')}
print(f"Jobs: {len(job_legacy_map)}")

# Test: does CSV JobID match after int conversion?
test_csv_id = safe_int_str(df['JobID'].iloc[0])
print(f"CSV first JobID: {df['JobID'].iloc[0]} -> '{test_csv_id}', exists in map: {test_csv_id in job_legacy_map}")

# Build CSV rows per job (same order as original seed)
job_csv_rows = defaultdict(list)
for _, row in df.iterrows():
    job_uuid = job_legacy_map.get(safe_int_str(row['JobID']))
    if not job_uuid:
        continue
    job_csv_rows[job_uuid].append(safe_int(row['ItemTypeID']))

print(f"Jobs with CSV steps: {len(job_csv_rows)}")
print(f"Total CSV steps mapped: {sum(len(v) for v in job_csv_rows.values())}")

# Get all existing DB steps
all_steps = []
offset = 0
while True:
    batch = s.table('job_steps').select('step_id, job_id, step_no').order('step_no').range(offset, offset + 999).execute()
    if not batch.data:
        break
    all_steps.extend(batch.data)
    if len(batch.data) < 1000:
        break
    offset += 1000
print(f"DB steps: {len(all_steps)}")

# Group by job, sort by step_no
job_db_steps = defaultdict(list)
for st in all_steps:
    job_db_steps[st['job_id']].append(st)
for jid in job_db_steps:
    job_db_steps[jid].sort(key=lambda x: x['step_no'])

# Match and update
updated = 0
for job_id, csv_items in job_csv_rows.items():
    db_steps = job_db_steps.get(job_id, [])
    for i, item_type_id in enumerate(csv_items):
        if i >= len(db_steps):
            break
        step = db_steps[i]
        step_name = ITEM_TYPE_MAP.get(item_type_id, f"Track {step['step_no']}")
        
        s.table('job_steps').update({
            'step_name': step_name,
            'item_type_id': item_type_id,
        }).eq('step_id', step['step_id']).execute()
        updated += 1
        if updated % 200 == 0:
            print(f"  Updated {updated}...")

print(f"\nDone! Updated: {updated}")

# Verify
verify = []
offset = 0
while True:
    batch = s.table('job_steps').select('step_name').range(offset, offset + 999).execute()
    if not batch.data:
        break
    verify.extend(batch.data)
    if len(batch.data) < 1000:
        break
    offset += 1000

print("\nStep name distribution:")
for name, count in Counter(r['step_name'] for r in verify).most_common():
    print(f"  {name}: {count}")
