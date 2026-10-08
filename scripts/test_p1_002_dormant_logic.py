import os
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from supabase import create_client
from datetime import datetime, timezone

with open('.env.local') as f:
    for line in f:
        if '=' in line:
            k, v = line.strip().split('=', 1)
            os.environ[k] = v

sp = create_client(os.environ['NEXT_PUBLIC_SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

# 11 Customers from types.ts
target_ids = ['b82f6f09-fc19-419c-ad7a-10432aa9ccb4', '9a01af8b-cbac-41e0-92ac-08e353c2a76e', 'af7ab2f7-4080-4f2c-981f-a32853cf8a21', '3cabfbda-55a5-4868-bf8a-9175dbf6294e', '047c0639-23c2-4da2-bd88-a65d586b8d9d'] # Fujikura

res = sp.table('equipment').select('''
    equipment_id,
    equipment_code,
    display_name,
    entry_date,
    manufacturing_date,
    created_at,
    design_revision_id,
    design_revisions!equipment_design_revision_id_fkey!inner(
      product_id,
      products!design_revisions_product_id_fkey!inner(
        company_id
      )
    )
''').in_('design_revisions.products.company_id', target_ids).execute()

print(f"Retrieved {len(res.data)} Fujikura molds")
dormant_count = 0
active_count = 0
now_dt = datetime.now()

for eq in res.data:
    eq_id = eq['equipment_id']
    prod_id = eq['design_revisions']['product_id']
    
    # Check jobs for this equipment
    jobs = sp.table('jobs').select('start_date, ship_date, created_at').eq('equipment_id', eq_id).execute()
    # Check order_lines for this product
    ols = sp.table('order_lines').select('due_date, ship_date, created_at').eq('product_id', prod_id).execute()
    
    dates = []
    if eq.get('manufacturing_date'): dates.append(eq['manufacturing_date'][:10])
    if eq.get('entry_date'): dates.append(eq['entry_date'][:10])
    if eq.get('created_at'): dates.append(eq['created_at'][:10])
    for j in jobs.data:
        for k in ['ship_date', 'start_date', 'created_at']:
            if j.get(k): dates.append(j[k][:10])
    for o in ols.data:
        for k in ['ship_date', 'due_date', 'created_at']:
            if o.get(k): dates.append(o[k][:10])
            
    latest_str = max(dates) if dates else None
    is_dormant = False
    months_dormant = 0
    if latest_str:
        latest_dt = datetime.strptime(latest_str, '%Y-%m-%d')
        days = (now_dt - latest_dt).days
        months_dormant = round(days / 30.4375)
        if days >= 3 * 365:
            is_dormant = True
            dormant_count += 1
        else:
            active_count += 1
    else:
        # No date recorded
        pass
        
    fee = months_dormant * 307.5 if is_dormant else 0
    print(f"  {eq['equipment_code']:<10} | Last: {latest_str} | Dormant: {is_dormant} ({months_dormant} mos) | Fee: {fee:,.1f} 円")

print("-" * 60)
print(f"Fujikura Summary: Dormant >=3Y: {dormant_count}, Active <3Y: {active_count}")
