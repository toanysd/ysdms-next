import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, safe_int, safe_float, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

def import_tier1(supabase: Any, registry: IdRegistry, stats: ImportStats, dry_run: bool = False) -> None:
    print("Starting Tier 1 Import: Lookup Tables")
    
    # 1. Job Types (Hardcoded seed data)
    print("Importing job_types...")
    job_types = [
        {'job_type_id': 1, 'job_type_name_ja': '新規金型', 'job_type_name_vi': 'Khuôn mới', 'sort_order': 10, 'category': 'MOLD'},
        {'job_type_id': 2, 'job_type_name_ja': '金型改造', 'job_type_name_vi': 'Sửa khuôn', 'sort_order': 20, 'category': 'MOLD'},
        {'job_type_id': 3, 'job_type_name_ja': '金型保守', 'job_type_name_vi': 'Bảo dưỡng khuôn', 'sort_order': 30, 'category': 'MOLD'},
        {'job_type_id': 4, 'job_type_name_ja': '新規抜型', 'job_type_name_vi': 'Dao cắt mới', 'sort_order': 40, 'category': 'CUTTER'},
        {'job_type_id': 5, 'job_type_name_ja': '抜型保守', 'job_type_name_vi': 'Bảo dưỡng dao cắt', 'sort_order': 50, 'category': 'CUTTER'},
        {'job_type_id': 6, 'job_type_name_ja': '試作', 'job_type_name_vi': 'Thử nghiệm', 'sort_order': 60, 'category': 'PRODUCTION'},
        {'job_type_id': 7, 'job_type_name_ja': '量産', 'job_type_name_vi': 'Sản xuất hàng loạt', 'sort_order': 70, 'category': 'PRODUCTION'},
        {'job_type_id': 8, 'job_type_name_ja': 'サンプル', 'job_type_name_vi': 'Mẫu', 'sort_order': 80, 'category': 'PRODUCTION'},
        {'job_type_id': 9, 'job_type_name_ja': '設計', 'job_type_name_vi': 'Thiết kế', 'sort_order': 90, 'category': 'DESIGN'},
        {'job_type_id': 10, 'job_type_name_ja': 'その他', 'job_type_name_vi': 'Khác', 'sort_order': 100, 'category': 'OTHER'},
    ]
    if not dry_run:
        supabase.table('job_types').upsert(job_types).execute()
    for jt in job_types:
        registry.register('job_types', str(jt['job_type_id']), str(jt['job_type_id']))
        stats.record_success('job_types')

    # 2. Processing Codes
    print("Importing processing_codes...")
    try:
        df_pc = read_csv(CSV_DIR / 'processingcode.csv')
        pc_records = []
        for _, row in df_pc.iterrows():
            pc_id = safe_int(row.get('ProcessingCodeID'))
            if pc_id is None:
                continue
            record = {
                'processing_code_id': pc_id,
                'processing_name': clean_value(row.get('ProcessingName')),
                'is_active': True
            }
            pc_records.append(record)
            registry.register('processing_codes', str(pc_id), str(pc_id))
        
        if not dry_run and pc_records:
            for i in range(0, len(pc_records), BATCH_SIZE):
                chunk = pc_records[i:i+BATCH_SIZE]
                supabase.table('processing_codes').upsert(chunk).execute()
            stats.record_success('processing_codes', len(pc_records))
    except Exception as e:
        print(f"Error importing processing_codes: {e}")
        stats.record_error('processing_codes', str(e))

    # 3. Processing Statuses
    print("Importing processing_statuses...")
    try:
        df_ps = read_csv(CSV_DIR / 'processingstatus.csv')
        ps_records = []
        for _, row in df_ps.iterrows():
            status_id = safe_int(row.get('ProcessingStatusID'))
            if status_id is None:
                continue
            record = {
                'status_id': status_id,
                'status_code': clean_value(row.get('ProcessingStatus')),
                'status_name_vi': clean_value(row.get('TinhTrangGiaCong'))
            }
            ps_records.append(record)
            registry.register('processing_statuses', str(status_id), str(status_id))
            
        if not dry_run and ps_records:
            for i in range(0, len(ps_records), BATCH_SIZE):
                chunk = ps_records[i:i+BATCH_SIZE]
                supabase.table('processing_statuses').upsert(chunk).execute()
            stats.record_success('processing_statuses', len(ps_records))
    except Exception as e:
        print(f"Error importing processing_statuses: {e}")
        stats.record_error('processing_statuses', str(e))

    # 4. Item Types
    print("Importing item_types...")
    try:
        df_it = read_csv(CSV_DIR / 'itemtype.csv')
        it_records = []
        for _, row in df_it.iterrows():
            item_type_id = safe_int(row.get('ItemTypeID'))
            if item_type_id is None:
                continue
            record = {
                'item_type_id': item_type_id,
                'item_type_code': clean_value(row.get('ItemType')),
                'item_type_name_ja': clean_value(row.get('ItemTypeName'))
            }
            it_records.append(record)
            registry.register('item_types', str(item_type_id), str(item_type_id))
            
        if not dry_run and it_records:
            for i in range(0, len(it_records), BATCH_SIZE):
                chunk = it_records[i:i+BATCH_SIZE]
                supabase.table('item_types').upsert(chunk).execute()
            stats.record_success('item_types', len(it_records))
    except Exception as e:
        print(f"Error importing item_types: {e}")
        stats.record_error('item_types', str(e))

    # 5. CAV Types
    print("Importing cav_types...")
    try:
        df_cav = read_csv(CSV_DIR / 'cav.csv')
        cav_records = []
        for _, row in df_cav.iterrows():
            legacy_id = str(clean_id(row.get('CAVID')))
            if not legacy_id:
                continue
            cav_id = str(uuid.uuid4())
            cav_len = int(safe_float(row.get('CAVlength')) or 0)
            cav_wid = int(safe_float(row.get('CAVwidth')) or 0)
            cav_code = clean_value(row.get('CAVNo')) or clean_value(row.get('CAV')) or f"CAV-{legacy_id}"
            
            record = {
                'cav_type_id': cav_id,
                'cav_code': cav_code,
                'cav_length_mm': cav_len,
                'cav_width_mm': cav_wid,
                'machine_group': 'FORMING',
                'description': clean_value(row.get('CAV'))
            }
            cav_records.append(record)
            registry.register('cav_types', legacy_id, cav_id)
            
        if not dry_run and cav_records:
            for i in range(0, len(cav_records), BATCH_SIZE):
                chunk = cav_records[i:i+BATCH_SIZE]
                supabase.table('cav_types').upsert(chunk).execute()
            stats.record_success('cav_types', len(cav_records))
    except Exception as e:
        print(f"Error importing cav_types: {e}")
        stats.record_error('cav_types', str(e))

    # 6. Racks
    print("Importing racks...")
    try:
        df_racks = read_csv(CSV_DIR / 'racks.csv')
        racks_dict: Dict[str, Dict[str, Any]] = {}
        for _, row in df_racks.iterrows():
            legacy_id = clean_id(row.get('RackID'))
            if not legacy_id:
                continue
            rack_id = str(uuid.uuid4())
            rack_code = clean_value(row.get('RackSymbol')) or clean_value(row.get('RackNumber')) or f"RACK-{legacy_id}"
            if rack_code in racks_dict:
                rack_code = f"{rack_code}-{legacy_id}"
            record = {
                'id': rack_id,
                'legacy_id': legacy_id,
                'rack_code': rack_code,
                'rack_name': clean_value(row.get('RackNumber')),
                'location_in_factory': clean_value(row.get('RackLocation'))
            }
            racks_dict[rack_code] = record
            registry.register('racks', legacy_id, rack_id)
            
        rack_records = list(racks_dict.values())
        if not dry_run and rack_records:
            for i in range(0, len(rack_records), BATCH_SIZE):
                chunk = rack_records[i:i+BATCH_SIZE]
                supabase.table('racks').upsert(chunk).execute()
            stats.record_success('racks', len(rack_records))
    except Exception as e:
        print(f"Error importing racks: {e}")
        stats.record_error('racks', str(e))

    # 7. Rack Layers
    print("Importing rack_layers...")
    try:
        df_layers = read_csv(CSV_DIR / 'racklayers.csv')
        layers_dict: Dict[str, Dict[str, Any]] = {}
        for _, row in df_layers.iterrows():
            legacy_id = str(clean_id(row.get('RackLayerID')))
            rack_legacy_id = str(clean_id(row.get('RackID')))
            if not legacy_id:
                continue
            
            rack_id = registry.lookup('racks', rack_legacy_id)
            if not rack_id:
                continue
            layer_id = str(uuid.uuid4())
            layer_num = safe_int(row.get('RackLayerNumber')) or 1
            
            dedup_key = f"{rack_id}_{layer_num}"
            if dedup_key in layers_dict:
                continue # skip duplicate (rack_id, layer_number)
                
            record = {
                'id': layer_id,
                'legacy_id': legacy_id,
                'rack_id': rack_id,
                'layer_code': f"LAYER-{legacy_id}",
                'layer_number': layer_num
            }
            layers_dict[dedup_key] = record
            registry.register('rack_layers', legacy_id, layer_id)
            
        layer_records = list(layers_dict.values())
        if not dry_run and layer_records:
            for i in range(0, len(layer_records), BATCH_SIZE):
                chunk = layer_records[i:i+BATCH_SIZE]
                supabase.table('rack_layers').upsert(chunk).execute()
            stats.record_success('rack_layers', len(layer_records))
    except Exception as e:
        print(f"Error importing rack_layers: {e}")
        stats.record_error('rack_layers', str(e))

    # 8. Machines
    print("Importing machines...")
    try:
        df_machines = read_csv(CSV_DIR / 'machine.csv')
        machine_records = []
        for _, row in df_machines.iterrows():
            legacy_id = clean_id(row.get('MachineID'))
            if not legacy_id:
                continue
            machine_id = str(uuid.uuid4())
            m_name = clean_value(row.get('MachineName')) or f"Machine {legacy_id}"
            record = {
                'machine_id': machine_id,
                'machine_code': f"MACH-{legacy_id}",
                'machine_name': m_name,
                'machine_type': clean_value(row.get('MachineType')) or 'FORMING'
            }
            machine_records.append(record)
            registry.register('machines', legacy_id, machine_id)
            
        if not dry_run and machine_records:
            for i in range(0, len(machine_records), BATCH_SIZE):
                chunk = machine_records[i:i+BATCH_SIZE]
                supabase.table('machines').upsert(chunk).execute()
            stats.record_success('machines', len(machine_records))
    except Exception as e:
        print(f"Error importing machines: {e}")
        stats.record_error('machines', str(e))
    
    print("Tier 1 Import Complete.")
