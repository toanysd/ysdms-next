import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, safe_int, safe_float, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats
from utils.name_parser import parse_mold_name

def import_tier3(supabase: Any, registry: IdRegistry, stats: ImportStats, dry_run: bool = False) -> None:
    print("Starting Tier 3 Import: Design Revisions & Equipment Molds")
    
    # 3A. Design Revisions & Mold Revisions
    print("Importing design revisions and mold revisions...")
    try:
        df_designs = read_csv(CSV_DIR / 'molddesign.csv')
        design_records = []
        mold_revision_records = []
        seen_design_codes: Dict[str, int] = {}
        
        for _, row in df_designs.iterrows():
            design_id = clean_id(row.get('MoldDesignID'))
            if not design_id:
                continue
            
            uuid_id = str(uuid.uuid4())
            legacy_id = f"DESIGN-{design_id}"
            
            tray_id = clean_id(row.get('TrayID'))
            product_id = registry.lookup('products', tray_id) if tray_id else None
            
            customer_id = clean_id(row.get('CustomerID'))
            company_id = registry.lookup('customers', customer_id) if customer_id else None
            if not company_id and customer_id:
                company_id = registry.lookup('companies', customer_id)
            
            cav_id_val = clean_id(row.get('CAVID'))
            cav_type_id = registry.lookup('cav_types', cav_id_val) if cav_id_val else None
            
            base_code = clean_value(row.get('MoldDesignCode')) or f"DESIGN-{design_id}"
            if base_code in seen_design_codes:
                seen_design_codes[base_code] += 1
                d_code = f"{base_code}-{seen_design_codes[base_code]}"
            else:
                seen_design_codes[base_code] = 1
                d_code = base_code
            
            record = {
                'revision_id': uuid_id,
                'legacy_id': legacy_id,
                'design_code': d_code,
                'customer_tray_name': clean_value(row.get('CustomerTrayName')),
                'tray_info': clean_value(row.get('TrayInfoForMoldDesign')),
                'product_id': product_id,
                'company_id': company_id,
                'cav_type_id': cav_type_id,
                'design_length': safe_float(row.get('DesignLength')),
                'design_width': safe_float(row.get('DesignWidth')),
                'design_height': safe_float(row.get('DesignHeight')),
                'design_depth': safe_float(row.get('DesignDepth')),
                'cutline_length': safe_float(row.get('CutlineLength')),
                'cutline_width': safe_float(row.get('CutlineWidth')),
                'draft_angle': str(safe_float(row.get('DraftAngle')) or ''),
                'pocket_numbers': safe_int(row.get('PocketNumbers')),
                'customer_drawing_no': clean_value(row.get('CustomerDrawingNo'))
            }
            design_records.append(record)
            

            
            registry.register('design_revisions', design_id, uuid_id)
            if product_id:
                registry.register('design_to_product', design_id, product_id)
                
        if not dry_run and design_records:
            for i in range(0, len(design_records), BATCH_SIZE):
                chunk = design_records[i:i+BATCH_SIZE]
                supabase.table('design_revisions').upsert(chunk).execute()
            print(f"  Inserted {len(design_records)} design revisions")
            stats.record_success('design_revisions', len(design_records))



    except Exception as e:
        print(f"Error importing design revisions: {e}")
        stats.record_error('design_revisions', str(e))

    # 3B. Equipment Molds
    print("Importing equipment molds...")
    try:
        df_molds = read_csv(CSV_DIR / 'molds.csv')
        mold_records = []
        seen_system_codes: Dict[str, int] = {}
        
        for _, row in df_molds.iterrows():
            mold_id_val = clean_id(row.get('MoldID'))
            if not mold_id_val:
                continue
                
            uuid_id = str(uuid.uuid4())
            legacy_id = f"MOLD-{mold_id_val}"
            
            mold_name = clean_value(row.get('MoldName'))
            parsed_name = parse_mold_name(mold_name) if mold_name else {}
            
            design_id_val = clean_id(row.get('MoldDesignID'))
            mold_revision_id = registry.lookup('design_revisions', design_id_val) if design_id_val else None
            
            customer_id = clean_id(row.get('CustomerID'))
            keeper_company_id = registry.lookup('customers', customer_id) if customer_id else None
            if not keeper_company_id and customer_id:
                keeper_company_id = registry.lookup('companies', customer_id)
            
            rack_layer_id = clean_id(row.get('RackLayerID'))
            current_rack_layer_id = registry.lookup('rack_layers', rack_layer_id) if rack_layer_id else None
            
            sys_code = parsed_name.get('system_code') or f"MOLD-{mold_id_val}"
            if sys_code in seen_system_codes:
                seen_system_codes[sys_code] += 1
                sys_code = f"{sys_code}-{seen_system_codes[sys_code]}"
            else:
                seen_system_codes[sys_code] = 1

            disp_name = parsed_name.get('display_name') or sys_code

            record = {
                'equipment_id': uuid_id,
                'equipment_type': 'MOLD',
                'legacy_id': legacy_id,
                'equipment_code': sys_code,
                'display_name': disp_name,
                'physical_stamp': parsed_name.get('physical_stamp'),
                'mold_type': parsed_name.get('mold_type'),
                'copy_number': parsed_name.get('copy_number'),
                'piece_count': parsed_name.get('piece_count'),
                'design_revision_id': mold_revision_id,
                'keeper_company_id': keeper_company_id,
                'current_rack_layer_id': current_rack_layer_id,
                'device_status': clean_value(row.get('DeviceStatus')) or 'ACTIVE',
                'usage_status': clean_value(row.get('UsageStatus')) or 'IN_STOCK'
            }
            mold_records.append(record)
            registry.register('equipment', mold_id_val, uuid_id)
            
        if not dry_run and mold_records:
            for i in range(0, len(mold_records), BATCH_SIZE):
                chunk = mold_records[i:i+BATCH_SIZE]
                supabase.table('equipment').upsert(chunk).execute()
                print(f"  Inserted {min(i+BATCH_SIZE, len(mold_records))} / {len(mold_records)} equipment molds")
            stats.record_success('equipment', len(mold_records))
    except Exception as e:
        print(f"Error importing equipment molds: {e}")
        stats.record_error('equipment', str(e))

    print("Tier 3 Import Complete.")
