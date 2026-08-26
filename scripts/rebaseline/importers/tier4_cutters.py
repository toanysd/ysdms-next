import sys
from pathlib import Path
import uuid
import math
from datetime import datetime
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, safe_int, safe_float, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

def import_tier4(supabase, registry: IdRegistry, stats: ImportStats, dry_run: bool = False):
    print("--- Importing Tier 4: Cutters & Junctions ---")
    
    # 4A. Cutters
    cutters_path = CSV_DIR / 'cutters.csv'
    if cutters_path.exists():
        df_cutters = read_csv(cutters_path)
        # Dedup logic: keep latest UpdatedAt
        df_cutters['UpdatedAt_Parsed'] = df_cutters['UpdatedAt'].apply(parse_date)
        df_cutters = df_cutters.sort_values('UpdatedAt_Parsed').groupby('CutterNo').last().reset_index()
        
        records = []
        for _, row in df_cutters.iterrows():
            cid = clean_id(row.get('CutterID'))
            legacy_id = f"CUT-{cid}"
            cutter_id = str(uuid.uuid4())
            
            company_id = registry.lookup('customers', clean_id(row.get('CustomerID')))
            if not company_id:
                company_id = registry.lookup('companies', clean_id(row.get('CustomerID'))) # try companies namespace
            
            design_revision_id = registry.lookup('design_revisions', clean_id(row.get('MoldDesignID')))
            current_rack_layer_id = registry.lookup('rack_layers', clean_id(row.get('RackLayerID')))
            
            design_code = clean_value(row.get('CutterDesignCode'))
            c_no = clean_value(row.get('CutterNo')) or f"CUT-{cid}"
            c_name = clean_value(row.get('CutterName')) or c_no

            record = {
                'equipment_id': cutter_id,
                'equipment_type': 'CUTTER_SEPARATE',
                'legacy_id': legacy_id,
                'equipment_code': c_no,
                'display_name': c_name,
                
                'company_id': company_id,
                'design_revision_id': design_revision_id,
                'current_rack_layer_id': current_rack_layer_id,
                'usage_status': clean_value(row.get('CutterStatus')),
                'notes': clean_value(row.get('CutterNotes')),
                'updated_at': parse_date(row.get('UpdatedAt'))
            }
            records.append(record)
            registry.register('equipment', cid, cutter_id)
        
        stats.log_table('cutters', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('equipment').upsert(chunk).execute()
    else:
        print(f"Warning: {cutters_path.name} not found.")

    # 4B. Mold Design Cutters
    mc_path = CSV_DIR / 'moldcutter.csv'
    if mc_path.exists():
        df_mc = read_csv(mc_path)
        records = []
        for _, row in df_mc.iterrows():
            legacy_id = clean_value(row.get('MoldCutterID'))
            
            cutter_id = registry.lookup('equipment', clean_id(row.get('CutterID')))
            design_revision_id = registry.lookup('design_revisions', clean_id(row.get('MoldDesignID')))
            
            if not cutter_id or not design_revision_id:
                stats.log_error('mold_design_cutters', legacy_id, "Missing CutterID or MoldDesignID")
                continue
                
            record = {
                'id': str(uuid.uuid4()),
                'equipment_id': cutter_id,
                'equipment_type': 'CUTTER_SEPARATE',
                'mold_design_id': design_revision_id,
                'notes': clean_value(row.get('MoldCutterNotes')),
                'date_entry': parse_date(row.get('DateEntry'))
            }
            records.append(record)
            
        stats.log_table('mold_design_cutters', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('mold_design_cutters').upsert(chunk).execute()
    else:
        print(f"Warning: {mc_path.name} not found.")
