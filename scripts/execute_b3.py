import pandas as pd
import os
import re
import uuid
import hashlib
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

df = pd.read_excel('temp_inventory.xlsx', header=None)

res_pm = supabase.table('plastic_master').select('plastic_id, plastic_family, thickness_mm, width_mm').execute()
pm_list = res_pm.data

SPEC_PATTERN = re.compile(
    r'(?P<family>[A-Za-z\-]+)'
    r'(?:\((?P<subtype>[^)]+)\))?'
    r'(?P<thickness>[\d.]+)'
    r'[×xX](?P<width>\d+)'
    r'(?:[×xX](?P<roll_len>\d+))?'
    r'\s*(?P<additive>.*)?'
)

def normalize_family(f):
    f = str(f).upper()
    if 'PST' in f: return 'PS'
    if 'A-PET' in f or 'APET' in f: return 'PET'
    if 'PET' in f: return 'PET'
    if 'PP' in f: return 'PP'
    if 'PS' in f: return 'PS'
    if 'PVC' in f: return 'PVC'
    if 'DNF' in f: return 'DNF'
    return f

receipt_no = "LEGACY-20260421"
res_rec = supabase.table('plastic_receipt').select('id').eq('receipt_no', receipt_no).execute()
if len(res_rec.data) > 0:
    receipt_id = res_rec.data[0]['id']
else:
    ins_rec = supabase.table('plastic_receipt').insert({
        'receipt_no': receipt_no,
        'receipt_date': '2026-04-21',
        'supplier_id': None,
        'note': '在庫一覧表 棚4-21 — Migrated by ETL B3'
    }).execute()
    receipt_id = ins_rec.data[0]['id']

unmatched_specs = []
inserted_rolls = []

for col in df.columns:
    col_data = df[col].values
    for r_idx in range(len(col_data) - 1):
        cell_val = str(col_data[r_idx]).strip() if pd.notna(col_data[r_idx]) else ''
        if not cell_val: continue
        
        m = SPEC_PATTERN.search(cell_val)
        if m:
            qty_cell = str(col_data[r_idx + 1]).strip() if pd.notna(col_data[r_idx + 1]) else ''
            if 'm' in qty_cell.lower() or 'ｍ' in qty_cell:
                # Use regex to find the first valid number
                num_match = re.search(r'(\d+(?:\.\d+)?)', qty_cell)
                if not num_match: continue
                try:
                    qty = float(num_match.group(1))
                except ValueError:
                    continue
                
                family = normalize_family(m.group('family'))
                thickness = float(m.group('thickness'))
                width = float(m.group('width'))
                
                search_families = [family]
                if family == 'PET': search_families.append('A-PET')
                
                matched_pm = None
                for pm in pm_list:
                    if pm['plastic_family'] in search_families and float(pm['thickness_mm']) == thickness and float(pm['width_mm']) == width:
                        matched_pm = pm
                        break
                
                if matched_pm:
                    spec_hash = hashlib.md5(cell_val.encode('utf-8')).hexdigest()[:6]
                    barcode = f"LEGACY-{matched_pm['plastic_family']}-{thickness}x{width}-{spec_hash}".upper()
                    
                    chk_roll = supabase.table('plastic_receipt_roll').select('id').eq('roll_barcode', barcode).execute()
                    if len(chk_roll.data) == 0:
                        ins_roll = supabase.table('plastic_receipt_roll').insert({
                            'receipt_id': receipt_id,
                            'plastic_id': matched_pm['plastic_id'],
                            'roll_barcode': barcode,
                            'nominal_length_m': qty,
                            'received_length_m': qty,
                            'current_length_m': qty,
                            'status': 'in_stock',
                            'location': '棚'
                        }).execute()
                        inserted_rolls.append({
                            'barcode': barcode,
                            'spec': cell_val,
                            'length': qty
                        })
                    else:
                        inserted_rolls.append({
                            'barcode': barcode,
                            'spec': cell_val,
                            'length': qty
                        })
                else:
                    unmatched_specs.append(cell_val)

import json
print(f"Total inserted rolls: {len(inserted_rolls)}")
print(f"Total unmatched specs: {len(unmatched_specs)}")

with open('b3_output.json', 'w', encoding='utf-8') as f:
    json.dump({
        'inserted': inserted_rolls,
        'unmatched': unmatched_specs
    }, f, ensure_ascii=False, indent=2)
