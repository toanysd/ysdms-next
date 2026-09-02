
import pandas as pd
import json
import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

# Fetch all design_revisions to match
res = supabase.table('design_revisions').select('revision_id, design_code').execute()
designs = res.data

# Fetch all plastic_master
res_pm = supabase.table('plastic_master').select('plastic_id, plastic_code').execute()
pm_map = {p['plastic_code']: p['plastic_id'] for p in res_pm.data}

df = pd.read_excel('./source_data/生産指示書/B. トレイデータ一覧表.xlsx', header=None, skiprows=4)

matched = 0
unmatched = 0

def normalize_code(code):
    return re.sub(r'[^a-zA-Z0-9]', '', str(code)).upper()

design_code_map = {normalize_code(d['design_code']): d['revision_id'] for d in designs}

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
    
    norm_pn = normalize_code(pn)
    
    found_rev_id = None
    if norm_pn in design_code_map:
        found_rev_id = design_code_map[norm_pn]
    elif f'TE{norm_pn}' in design_code_map:
        found_rev_id = design_code_map[f'TE{norm_pn}']
        
    if found_rev_id and plastic_code in pm_map:
        matched += 1
    else:
        unmatched += 1

print(f'Dry-run Backfill (B2): {matched} matched, {unmatched} unmatched')
