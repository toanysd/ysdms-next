
import pandas as pd
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

df = pd.read_excel('./source_data/生産指示書/B. トレイデータ一覧表.xlsx', header=None, skiprows=4)

unique_plastics = {}
for idx, row in df.iterrows():
    zaisitsu = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    if zaisitsu == 'nan' or not zaisitsu or zaisitsu.strip() == '':
        continue
        
    thickness = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    width = str(row.iloc[4]) if pd.notna(row.iloc[4]) else ''
    taiden = str(row.iloc[5]) if pd.notna(row.iloc[5]) else ''
    silicon = str(row.iloc[6]) if pd.notna(row.iloc[6]) else ''
    tofu = str(row.iloc[7]) if pd.notna(row.iloc[7]) else ''
    
    code = f'{zaisitsu}_{thickness}_{width}_{taiden}_{silicon}_{tofu}'
    
    if code not in unique_plastics:
        family = zaisitsu.split('(')[0].split(' ')[0].strip()
        
        try:
            thick_val = float(thickness) if thickness.replace('.', '', 1).isdigit() else 0
        except: thick_val = 0
            
        try:
            width_val = int(float(width)) if width.replace('.', '', 1).isdigit() else 0
        except: width_val = 0
        
        unique_plastics[code] = {
            'plastic_code': code,
            'plastic_family': family,
            'plastic_subtype': zaisitsu,
            'thickness_mm': thick_val,
            'width_mm': width_val,
            'additive_text_raw': f'帯電:{taiden} ｼﾘｺﾝ:{silicon} 塗布:{tofu}',
            'is_active': True
        }

records = list(unique_plastics.values())
print(f'Total unique plastics to insert: {len(records)}')
families = list(set([r['plastic_family'] for r in records]))
print(f'Families: {families}')

try:
    res = supabase.table('plastic_master').upsert(records, on_conflict='plastic_code').execute()
    print(f'Successfully inserted {len(res.data)} records.')
except Exception as e:
    print(f'Error: {e}')
