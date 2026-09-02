
import pandas as pd
import json
import os
import re
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

designs = []
page_size = 1000
for i in range(10):
    res = supabase.table('design_revisions').select('revision_id, design_code, products(product_code, product_name, legacy_id)').range(i*page_size, (i+1)*page_size-1).execute()
    designs.extend(res.data)
    if len(res.data) < page_size: break

df = pd.read_excel('./source_data/生産指示書/B. トレイデータ一覧表.xlsx', header=None, skiprows=4)

def normalize_code(code):
    return re.sub(r'[^a-zA-Z0-9]', '', str(code)).upper()

excel_pns = []
for idx, row in df.iterrows():
    pn = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    if not pn or pn == 'nan': continue
    excel_pns.append(pn)

norm_excel_pns = set([normalize_code(pn) for pn in excel_pns])
norm_excel_pns.update([f'TE{normalize_code(pn)}' for pn in excel_pns])

# Categorize Unmatched Designs
category_counts = {
    'matched_design_code': 0,
    'matched_product_code': 0,
    'matched_legacy_id': 0,
    'unmatched': 0
}

for d in designs:
    d_code = normalize_code(d['design_code'])
    p_code = normalize_code(d['products']['product_code']) if d.get('products') and d['products'].get('product_code') else ''
    l_id = normalize_code(d['products']['legacy_id']) if d.get('products') and d['products'].get('legacy_id') else ''
    
    if d_code in norm_excel_pns:
        category_counts['matched_design_code'] += 1
    elif p_code and p_code in norm_excel_pns:
        category_counts['matched_product_code'] += 1
    elif l_id and l_id in norm_excel_pns:
        category_counts['matched_legacy_id'] += 1
    else:
        category_counts['unmatched'] += 1

print(f'Total design_revisions fetched: {len(designs)}')
print(f'Total valid P/N in Excel: {len(excel_pns)}')
print('Distribution of Design Revisions:')
for k, v in category_counts.items():
    print(f'  {k}: {v}')
