import pandas as pd
import os
import re
import json
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

print('Fetching design_revisions...')
designs = []
page_size = 1000
for i in range(10):
    res = supabase.table('design_revisions').select('revision_id, design_code, plastic_id, products(product_code, legacy_id)').range(i*page_size, (i+1)*page_size-1).execute()
    designs.extend(res.data)
    if len(res.data) < page_size: break
    
print('Fetching plastic_master...')
res_pm = supabase.table('plastic_master').select('plastic_id, plastic_code, plastic_family').execute()
pm_map = {p['plastic_code']: p for p in res_pm.data}

df = pd.read_excel('temp_tray.xlsx', header=None, skiprows=4)

def normalize_code(code):
    return re.sub(r'[^a-zA-Z0-9]', '', str(code)).upper()

excel_pns = {}
for idx, row in df.iterrows():
    pn = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    if not pn or pn == 'nan': continue
    
    zaisitsu = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    thickness = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    width = str(row.iloc[4]) if pd.notna(row.iloc[4]) else ''
    taiden = str(row.iloc[5]) if pd.notna(row.iloc[5]) else ''
    silicon = str(row.iloc[6]) if pd.notna(row.iloc[6]) else ''
    tofu = str(row.iloc[7]) if pd.notna(row.iloc[7]) else ''
    
    plastic_code = f'{zaisitsu}_{thickness}_{width}_{taiden}_{silicon}_{tofu}'
    plastic_text = f'{zaisitsu} {thickness}t [{width}] 帯電:{taiden} ｼﾘｺﾝ:{silicon} 塗布:{tofu}'
    
    nPn = normalize_code(pn)
    excel_pns[nPn] = { 'plastic_code': plastic_code, 'plastic_text': plastic_text }
    excel_pns[f'TE{nPn}'] = { 'plastic_code': plastic_code, 'plastic_text': plastic_text }

updates = []
for d in designs:
    if d.get('plastic_id'): continue
    
    d_code = normalize_code(d['design_code'])
    p_code = normalize_code(d['products']['product_code']) if d.get('products') and d['products'].get('product_code') else ''
    l_id = normalize_code(d['products']['legacy_id']) if d.get('products') and d['products'].get('legacy_id') else ''
    
    match = None
    if d_code in excel_pns: match = excel_pns[d_code]
    elif p_code in excel_pns: match = excel_pns[p_code]
    elif l_id in excel_pns: match = excel_pns[l_id]
    
    if match and match['plastic_code'] in pm_map:
        updates.append({
            'revision_id': d['revision_id'],
            'plastic_id': pm_map[match['plastic_code']]['plastic_id'],
            'plastic_type_designed': match['plastic_text'],
            'design_code': d['design_code'],
            'plastic_family': pm_map[match['plastic_code']]['plastic_family']
        })

print(f'Ready to update {len(updates)} records.')

success_count = 0
for i, u in enumerate(updates):
    try:
        res = supabase.table('design_revisions').update({
            'plastic_id': u['plastic_id'],
            'plastic_type_designed': u['plastic_type_designed']
        }).eq('revision_id', u['revision_id']).is_('plastic_id', 'null').execute()
        if len(res.data) > 0:
            success_count += 1
    except Exception as e:
        pass
    if (i+1) % 100 == 0:
        print(f'Processed {i+1} / {len(updates)}')

print(f'Successfully updated {success_count} records.')

with open("b2_samples.json", "w", encoding="utf-8") as f:
    json.dump(updates[:5], f, ensure_ascii=False, indent=2)
