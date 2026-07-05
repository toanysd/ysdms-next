
import sys
sys.path.append('d:/AntiGravity_Workspace/apps/ysdms-nextgen/scripts/seed_v5')
from config import get_supabase_client

s = get_supabase_client()
item_types_res = s.table('item_types').select('item_type_id, item_type_code').execute()
item_type_map = {it['item_type_id']: it['item_type_code'] for it in item_types_res.data}

while True:
    steps = s.table('job_steps').select('step_id, item_type_id, step_name').ilike('step_name', 'Step %').limit(1000).execute()
    if not steps.data:
        break
    print(f'Found {len(steps.data)} steps to fix in this batch')

    for step in steps.data:
        item_id = step.get('item_type_id')
        if item_id and item_id in item_type_map:
            new_name = item_type_map[item_id]
        else:
            new_name = 'General'
        s.table('job_steps').update({'step_name': new_name}).eq('step_id', step['step_id']).execute()

print('Done!')
