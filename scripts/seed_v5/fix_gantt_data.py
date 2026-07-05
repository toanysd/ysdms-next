import os
import sys
from datetime import datetime, timedelta

# Add parent dir to path
sys.path.append(os.path.dirname(__file__))
from config import get_supabase_client

supabase = get_supabase_client()

print("1. Updating jobs.mold_deadline...")
# Fetch jobs with null mold_deadline
res = supabase.table('jobs').select('job_id, ship_date, start_date, deadline, created_at').is_('mold_deadline', 'null').execute()
jobs = res.data
print(f"Found {len(jobs)} jobs without mold_deadline.")

updates_jobs = []
for j in jobs:
    dl = None
    if j.get('ship_date'):
        d = datetime.strptime(j['ship_date'][:10], "%Y-%m-%d")
        dl = d - timedelta(days=2)
    elif j.get('deadline'):
        d = datetime.strptime(j['deadline'][:10], "%Y-%m-%d")
        dl = d
    elif j.get('created_at'):
        d = datetime.strptime(j['created_at'][:10], "%Y-%m-%d")
        dl = d + timedelta(days=14)
    else:
        dl = datetime.now() + timedelta(days=14)
        
    updates_jobs.append({
        'job_id': j['job_id'],
        'mold_deadline': dl.strftime("%Y-%m-%d")
    })

# Batch update jobs
updated_jobs = 0
for u in updates_jobs:
    supabase.table('jobs').update({'mold_deadline': u['mold_deadline']}).eq('job_id', u['job_id']).execute()
    updated_jobs += 1
    if updated_jobs % 100 == 0:
        print(f"Updated {updated_jobs} jobs...")
print(f"Updated {updated_jobs} jobs with mold_deadline.")

print("2. Updating job_steps (planned_start, planned_end, track)...")
# Fetch steps where planned_start or track is null
res2 = supabase.table('job_steps').select('step_id, step_name, deadline, estimated_hours, planned_start, track').is_('planned_start', 'null').execute()
steps = res2.data
print(f"Total steps to check (missing planned_start): {len(steps)}")

updates_steps = []
for s in steps:
    update_data = {'step_id': s['step_id']}
    needs_update = False
    
    # Track
    if not s.get('track'):
        name = (s.get('step_name') or '').upper()
        if 'PLUG' in name or 'プラグ' in name:
            track = 'PLUG'
        elif 'CUTTER' in name or '抜型' in name:
            track = 'CUTTER'
        elif 'FINISH' in name or '仕上げ' in name:
            track = 'FINISH'
        else:
            track = 'MOLD'
        update_data['track'] = track
        needs_update = True
        
    # Dates
    if not s.get('planned_start') or not s.get('planned_end'):
        p_end = None
        if s.get('deadline'):
            p_end = datetime.strptime(s['deadline'][:10], "%Y-%m-%d")
        else:
            # Fallback
            p_end = datetime.now() + timedelta(days=7)
            
        est_hrs = s.get('estimated_hours') or 8
        days = max(1, int(est_hrs // 8))
        p_start = p_end - timedelta(days=days)
        
        update_data['planned_start'] = p_start.strftime("%Y-%m-%d")
        update_data['planned_end'] = p_end.strftime("%Y-%m-%d")
        needs_update = True
        
    if needs_update:
        updates_steps.append(update_data)

updated_steps = 0
for u in updates_steps:
    step_id = u.pop('step_id')
    supabase.table('job_steps').update(u).eq('step_id', step_id).execute()
    updated_steps += 1
    if updated_steps % 100 == 0:
        print(f"Updated {updated_steps} job_steps...")
print(f"Updated {updated_steps} job_steps.")

print("Done.")
