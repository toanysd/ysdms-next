import uuid
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_lookups(supabase, registry: IdRegistry):
    print("--- Importing Lookup Tables ---")
    
    # 0. Seed job_types
    job_types_seed = [
        {'job_type_id': '1', 'job_type_name_ja': '新規金型', 'job_type_name_vi': 'Khuôn mới', 'sort_order': 10, 'category': 'MOLD'},
        {'job_type_id': '2', 'job_type_name_ja': '金型改造', 'job_type_name_vi': 'Sửa khuôn', 'sort_order': 20, 'category': 'MOLD'},
        {'job_type_id': '3', 'job_type_name_ja': '金型保守', 'job_type_name_vi': 'Bảo dưỡng khuôn', 'sort_order': 30, 'category': 'MOLD'},
        {'job_type_id': '4', 'job_type_name_ja': '新規抜型', 'job_type_name_vi': 'Dao cắt mới', 'sort_order': 40, 'category': 'CUTTER'},
        {'job_type_id': '5', 'job_type_name_ja': '抜型保守', 'job_type_name_vi': 'Bảo dưỡng dao cắt', 'sort_order': 50, 'category': 'CUTTER'},
        {'job_type_id': '6', 'job_type_name_ja': '試作', 'job_type_name_vi': 'Thử nghiệm', 'sort_order': 60, 'category': 'PRODUCTION'},
        {'job_type_id': '7', 'job_type_name_ja': '量産', 'job_type_name_vi': 'Sản xuất hàng loạt', 'sort_order': 70, 'category': 'PRODUCTION'},
        {'job_type_id': '8', 'job_type_name_ja': 'サンプル', 'job_type_name_vi': 'Mẫu', 'sort_order': 80, 'category': 'PRODUCTION'},
        {'job_type_id': '9', 'job_type_name_ja': '設計', 'job_type_name_vi': 'Thiết kế', 'sort_order': 90, 'category': 'DESIGN'},
        {'job_type_id': '10', 'job_type_name_ja': 'その他', 'job_type_name_vi': 'Khác', 'sort_order': 100, 'category': 'OTHER'}
    ]
    supabase.table('job_types').upsert(job_types_seed).execute()
    print(f"Imported {len(job_types_seed)} job_types")

    # 1. processing_codes
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'processingcode.csv'))
    records = []
    for _, row in df.iterrows():
        records.append({
            'processing_code_id': int(row['ProcessingCodeID']),
            'processing_name': str(row['ProcessingName']),
            'is_active': True
        })
    if records:
        supabase.table('processing_codes').upsert(records).execute()
        print(f"Imported {len(records)} processing_codes")



    # 3. processing_statuses
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'processingstatus.csv'))
    
    clean_status_map = {
        1: {'code': '0.未確認', 'vi': '0.Chưa xác nhận'},
        2: {'code': '1.予定', 'vi': '1.Kế hoạch'},
        3: {'code': '2.図面・プログラム', 'vi': '2.Bản vẽ/Lập trình'},
        4: {'code': '3.材料', 'vi': '3.Nguyên liệu'},
        5: {'code': '4.加工中', 'vi': '4.Gia công'},
        6: {'code': '5.仕上げ', 'vi': '5.Hoàn thiện'},
        7: {'code': '6.検査', 'vi': '6.Kiểm tra'},
        8: {'code': 'F.完了', 'vi': 'F.Hoàn thành'},
        9: {'code': 'N.進行中', 'vi': 'N.Đang chạy'},
        10: {'code': 'R.REQUEST', 'vi': 'R.Yêu cầu'},
        11: {'code': 'ZF.材料完了', 'vi': 'ZF.Nguyên liệu xong'},
        12: {'code': 'ZN.材料手配中', 'vi': 'ZN.Đang chuẩn bị NL'},
        13: {'code': 'ZR.材料 Request', 'vi': 'ZR.Yêu cầu nguyên liệu'}
    }

    records = []
    for _, row in df.iterrows():
        try:
            status_id = int(float(row['ProcessingStatusID']))
        except (ValueError, TypeError):
            continue
        status_data = clean_status_map.get(status_id, {
            'code': str(row['ProcessingStatus']) if row['ProcessingStatus'] else str(status_id),
            'vi': str(row['TinhTrangGiaCong']) if row['TinhTrangGiaCong'] else None
        })
        records.append({
            'status_id': str(status_id),
            'status_code': status_data['code'],
            'status_name_vi': status_data['vi']
        })
    if records:
        supabase.table('processing_statuses').upsert(records).execute()
        print(f"Imported {len(records)} processing_statuses")

    # 4. item_types
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'itemtype.csv'))
    records = []
    for _, row in df.iterrows():
        records.append({
            'item_type_id': int(row['ItemTypeID']),
            'item_type_code': str(row['ItemType']),
            'item_type_name_ja': str(row['ItemTypeName']) if row['ItemTypeName'] else None
        })
    if records:
        supabase.table('item_types').upsert(records).execute()
        print(f"Imported {len(records)} item_types")

    # 5. cav_types
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'cav.csv'))
    records_dict = {}
    for _, row in df.iterrows():
        legacy_id = str(row['CAVID'])
        cav_code = str(row['CAV']) if row['CAV'] else legacy_id
        
        # Deduplicate by cav_code
        if cav_code not in records_dict:
            new_uuid = str(uuid.uuid4())
            registry.register('cav_types', legacy_id, new_uuid)
            records_dict[cav_code] = {
                'cav_type_id': new_uuid,
                'cav_code': cav_code,
                'cav_length_mm': int(float(row['CAVlength'])) if row['CAVlength'] and str(row['CAVlength']).replace('.','',1).isdigit() else 0,
                'cav_width_mm': int(float(row['CAVwidth'])) if row['CAVwidth'] and str(row['CAVwidth']).replace('.','',1).isdigit() else 0,
                'notes': str(row['CAVnotes']) if row['CAVnotes'] else None,
                'is_active': True,
                'machine_group': 'TBD'
            }
        else:
            # If it already exists, just register the legacy_id to the existing uuid
            existing_uuid = records_dict[cav_code]['cav_type_id']
            registry.register('cav_types', legacy_id, existing_uuid)
            
    records = list(records_dict.values())
    if records:
        supabase.table('cav_types').upsert(records).execute()
        print(f"Imported {len(records)} cav_types")

    # 6. machines
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'machine.csv'))
    records = []
    for _, row in df.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['MachineID'])
        registry.register('machines', legacy_id, new_uuid)
        records.append({
            'machine_id': new_uuid,
            'machine_code': str(row['MachineName']), # Usually name acts as code in legacy
            'machine_name': str(row['MachineName']),
            'machine_type': str(row['MachineType']) if row['MachineType'] else None,
            'location': str(row['MachineLocation']) if row['MachineLocation'] else None,
            'notes': str(row['MachineNotes']) if row['MachineNotes'] else None,
            'is_active': True
        })
    if records:
        supabase.table('machines').insert(records).execute()
        print(f"Imported {len(records)} machines")

    # 7. destinations
    df = clean_dataframe(read_csv_safe(CSV_DIR / 'destinations.csv'))
    records = []
    for _, row in df.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['DestinationID'])
        registry.register('destinations', legacy_id, new_uuid)
        records.append({
            'destination_id': new_uuid,
            'destination_name': str(row['DestinationName']),
            'destination_type': str(row['DestinationType']) if row['DestinationType'] else None,
            'is_active': bool(row['IsActive']) if row['IsActive'] is not None else True
        })
    if records:
        supabase.table('destinations').upsert(records).execute()
        print(f"Imported {len(records)} destinations")

    # 8. racks & rack_layers
    df_racks = clean_dataframe(read_csv_safe(CSV_DIR / 'racks.csv'))
    rack_records = []
    rack_uuid_to_code = {}
    for _, row in df_racks.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['RackID'])
        registry.register('racks', legacy_id, new_uuid)
        rack_code = str(row['RackNumber']) if row['RackNumber'] else legacy_id
        rack_uuid_to_code[new_uuid] = rack_code
        rack_records.append({
            'id': new_uuid,
            'legacy_id': legacy_id,
            'rack_code': rack_code,
            'rack_name': str(row['RackName']) if row['RackName'] else None,
            'location_in_factory': str(row['RackLocation']) if row['RackLocation'] else None,
            'notes': str(row['RackNotes']) if row['RackNotes'] else None
        })
    if rack_records:
        supabase.table('racks').insert(rack_records).execute()
        print(f"Imported {len(rack_records)} racks")

    df_layers = clean_dataframe(read_csv_safe(CSV_DIR / 'racklayers.csv'))
    layer_records = []
    layer_codes_seen = set()
    rack_layer_nums_seen = set()
    for _, row in df_layers.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_layer_id = str(row['RackLayerID'])
        legacy_rack_id = str(row['RackID'])
        rack_uuid = registry.resolve('racks', legacy_rack_id)
        if rack_uuid:
            registry.register('rack_layers', legacy_layer_id, new_uuid)
            
            base_code = f"{rack_uuid_to_code.get(rack_uuid, 'R')}-{str(row['RackLayerNumber']) if row['RackLayerNumber'] else legacy_layer_id}"
            layer_code = base_code
            counter = 1
            while layer_code in layer_codes_seen:
                layer_code = f"{base_code}-{counter}"
                counter += 1
            layer_codes_seen.add(layer_code)
            
            layer_number = int(row['RackLayerNumber']) if str(row['RackLayerNumber']).isdigit() else 1
            while (rack_uuid, layer_number) in rack_layer_nums_seen:
                layer_number += 1
            rack_layer_nums_seen.add((rack_uuid, layer_number))
            
            layer_records.append({
                'id': new_uuid,
                'legacy_id': legacy_layer_id,
                'rack_id': rack_uuid,
                'layer_code': layer_code,
                'layer_number': layer_number,
                'notes': str(row['RackLayerNotes']) if row['RackLayerNotes'] else None
            })
    if layer_records:
        # Batch insert if large
        supabase.table('rack_layers').insert(layer_records).execute()
        print(f"Imported {len(layer_records)} rack_layers")

