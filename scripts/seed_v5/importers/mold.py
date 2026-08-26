import uuid
import re
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_mold_hierarchy(supabase, registry: IdRegistry):
    print("--- Importing Mold Hierarchy ---")
    
    # 1. products update (from moldmaster.csv)
    df_mm = clean_dataframe(read_csv_safe(CSV_DIR / 'moldmaster.csv'))
    new_product_records = []
    
    # Pre-load ALL existing product_codes to avoid duplicate key violations
    # Supabase API returns max 1000 rows by default, so paginate
    existing_codes = set()
    code_to_uuid = {}
    offset = 0
    page_size = 1000
    while True:
        resp = supabase.table('products').select('product_id, product_code').range(offset, offset + page_size - 1).execute()
        if not resp.data:
            break
        for p in resp.data:
            existing_codes.add(p['product_code'])
            code_to_uuid[p['product_code']] = p['product_id']
        if len(resp.data) < page_size:
            break
        offset += page_size
    print(f"Pre-loaded {len(existing_codes)} existing product codes")
    
    for _, row in df_mm.iterrows():
        legacy_id = str(row['MoldMasterID'])
        tray_id = str(row['TrayID']) if 'TrayID' in row and row['TrayID'] else None
        
        # Check if product already exists from tray
        product_uuid = registry.resolve('products', tray_id) if tray_id else None
        
        if not product_uuid:
            # Thử tìm product đã tồn tại theo product_code
            # Extract base name to group revisions (e.g., ADY-071 R1 -> ADY-071)
            mm_name = str(row['MoldMasterName']).strip() if row['MoldMasterName'] else None
            base_mm_name = re.sub(r'[\s\-]*R\d*$', '', mm_name, flags=re.IGNORECASE) if mm_name else None
            mm_code = re.sub(r'[\s\-]+', '', base_mm_name) if base_mm_name else f"MM{legacy_id}"
            
            if mm_code in code_to_uuid:
                # Product đã tồn tại (cùng tên khuôn, ví dụ base name giống nhau) → liên kết, không tạo mới
                product_uuid = code_to_uuid[mm_code]
            else:
                # Tạo product mới cho mold_master không có trong tray.csv
                product_uuid = str(uuid.uuid4())
                company_uuid = registry.resolve('customers', row['CustomerID'])
                if not company_uuid:
                    company_uuid = registry.resolve('customers', 'UNKNOWN')
                
                # Đảm bảo unique product_code
                base_code = mm_code
                counter = 1
                while mm_code in existing_codes:
                    mm_code = f"{base_code}_{counter}"
                    counter += 1
                existing_codes.add(mm_code)
                code_to_uuid[mm_code] = product_uuid
                
                new_product_records.append({
                    'product_id': product_uuid,
                    'legacy_id': f"MM_{legacy_id}",
                    'product_code': mm_code,                # YSD compact: ADY071
                    'product_name_internal': base_mm_name,        # YSD display: ADY-071 (base name)
                    'product_name': None,                    # Tên chính thức từ KH (nhập sau)
                    'company_id': company_uuid,
                    'product_status': 'ACTIVE',
                })
            registry.register('products', tray_id if tray_id else legacy_id, product_uuid)
            
        # Register the MoldMasterID to point directly to the product_id
        registry.register('mold_to_product', legacy_id, product_uuid)
        
        # Also register DesignMasterID if present
        if 'DesignMasterID' in row and row['DesignMasterID']:
            registry.register('mold_to_product', f"DM_{row['DesignMasterID']}", product_uuid)
        
    if new_product_records:
        chunk_size = 500
        for i in range(0, len(new_product_records), chunk_size):
            supabase.table('products').insert(new_product_records[i:i+chunk_size]).execute()
        print(f"Imported {len(new_product_records)} new products from moldmaster.csv")

    # 2. design_revisions
    df_dr = clean_dataframe(read_csv_safe(CSV_DIR / 'molddesign.csv'))
    dr_records = []
    design_codes_seen = set()
    for _, row in df_dr.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['MoldDesignID'])
        registry.register('design_revisions', legacy_id, new_uuid)
        
        dm_id = str(row['DesignMasterID']) if 'DesignMasterID' in row else ''
        product_uuid = registry.resolve('mold_to_product', f"DM_{dm_id}") if dm_id else None
        
        base_code = str(row['MoldDesignCode']) if 'MoldDesignCode' in row and row['MoldDesignCode'] else legacy_id
        
        # If still no product_uuid (orphaned design), create one
        if not product_uuid:
            # Extract base name
            dr_name = str(row['MoldDesignName']).strip() if 'MoldDesignName' in row and row['MoldDesignName'] else None
            dr_base = re.sub(r'[\s\-]*R\d*$', '', dr_name, flags=re.IGNORECASE) if dr_name else base_code
            dr_code = re.sub(r'[\s\-]+', '', dr_base) if dr_base else f"DR_ORPHAN_{legacy_id}"
            
            if dr_code in code_to_uuid:
                product_uuid = code_to_uuid[dr_code]
            else:
                product_uuid = str(uuid.uuid4())
                new_product = {
                    'product_id': product_uuid,
                    'legacy_id': f"DM_ORPHAN_{legacy_id}",
                    'product_code': dr_code,
                    'product_name_internal': dr_base,
                    'product_name': None,
                    'company_id': registry.resolve('customers', row['CustomerID']) or registry.resolve('customers', 'UNKNOWN'),
                    'product_status': 'ACTIVE',
                }
                # Insert the orphaned product immediately
                supabase.table('products').insert(new_product).execute()
                code_to_uuid[dr_code] = product_uuid
                existing_codes.add(dr_code)
        
        if product_uuid:
            registry.register('mold_design_to_product', legacy_id, product_uuid)
            
        company_uuid = registry.resolve('customers', row['CustomerID'])
        
        design_code = base_code
        counter = 1
        while design_code in design_codes_seen:
            design_code = f"{base_code}-{counter}"
            counter += 1
        design_codes_seen.add(design_code)

        dr_records.append({
            'revision_id': new_uuid,
            'legacy_id': legacy_id,
            'design_code': design_code,
            'product_id': product_uuid,
            'company_id': company_uuid,
            'cavity_count': int(row['PocketNumbers']) if 'PocketNumbers' in row and str(row['PocketNumbers']).isdigit() else None,
            'status': 'APPROVED', # Defaulting to approved for legacy data
            'design_length': float(row['MoldDesignLength']) if 'MoldDesignLength' in row and str(row['MoldDesignLength']).replace('.','',1).isdigit() else None,
            'design_width': float(row['MoldDesignWidth']) if 'MoldDesignWidth' in row and str(row['MoldDesignWidth']).replace('.','',1).isdigit() else None,
            'design_height': float(row['MoldDesignHeight']) if 'MoldDesignHeight' in row and str(row['MoldDesignHeight']).replace('.','',1).isdigit() else None,
            'design_depth': float(row['MoldDesignDepth']) if 'MoldDesignDepth' in row and str(row['MoldDesignDepth']).replace('.','',1).isdigit() else None,
            'design_weight': str(row['MoldDesignWeight']) if 'MoldDesignWeight' in row and row['MoldDesignWeight'] else None,
            'cutline_length': float(row['CutlineX']) if 'CutlineX' in row and str(row['CutlineX']).replace('.','',1).isdigit() else None,
            'cutline_width': float(row['CutlineY']) if 'CutlineY' in row and str(row['CutlineY']).replace('.','',1).isdigit() else None,
            'corner_r': str(row['CornerR']) if 'CornerR' in row and row['CornerR'] else None,
            'chamfer_c': str(row['ChamferC']) if 'ChamferC' in row and row['ChamferC'] else None,
            'draft_angle': str(row['DraftAngle']) if 'DraftAngle' in row and row['DraftAngle'] else None,
            'pitch_mm': float(row['Pitch']) if 'Pitch' in row and str(row['Pitch']).replace('.','',1).isdigit() else None,
            'orientation': str(row['MoldOrientation']) if 'MoldOrientation' in row and row['MoldOrientation'] else None,
            'setup_type': str(row['MoldSetupType']) if 'MoldSetupType' in row and row['MoldSetupType'] else None,
            'plug_type': 'OWNED' if ('Plug' in row and row['Plug']) else 'NONE',
            'has_separate_cutter': bool(row['SeparateCutter']) if 'SeparateCutter' in row and row['SeparateCutter'] else False,
            'customer_tray_name': str(row['CustomerTrayName']) if 'CustomerTrayName' in row and row['CustomerTrayName'] else None,
            'plastic_type_designed': str(row['DesignForPlasticType']) if 'DesignForPlasticType' in row and row['DesignForPlasticType'] else None,
            'tray_info': str(row['TrayInfoForMoldDesign']) if 'TrayInfoForMoldDesign' in row and row['TrayInfoForMoldDesign'] else None,
            'customer_equipment_no': str(row['CustomerEquipmentNo']) if 'CustomerEquipmentNo' in row and row['CustomerEquipmentNo'] else None,
            'customer_drawing_no': str(row['CustomerDrawingNo']) if 'CustomerDrawingNo' in row and row['CustomerDrawingNo'] else None,
            'designer': str(row['DataInput']) if 'DataInput' in row and row['DataInput'] else None,
            'design_date': str(row['DesignCreatedDate']) if 'DesignCreatedDate' in row and row['DesignCreatedDate'] else None,
        })
    if dr_records:
        chunk_size = 500
        for i in range(0, len(dr_records), chunk_size):
            supabase.table('design_revisions').insert(dr_records[i:i+chunk_size]).execute()
        print(f"Imported {len(dr_records)} design_revisions")

    # Post-import: Cập nhật products từ design_revisions data
    # CustomerTrayName → products.product_name (tên chính thức từ KH)
    # TrayInfoForMoldDesign → products.notes (tạm, Phase 2 sẽ có product_description)
    product_updates = {}  # product_uuid -> {product_name, notes}
    for rec in dr_records:
        pid = rec.get('product_id')
        if not pid:
            continue
        if pid not in product_updates:
            product_updates[pid] = {}
        # Ưu tiên giá trị đầu tiên tìm được (không ghi đè nếu đã có)
        ctn = rec.get('customer_tray_name')
        if ctn and 'product_name' not in product_updates[pid]:
            product_updates[pid]['product_name'] = ctn
        ti = rec.get('tray_info')
        if ti and 'notes' not in product_updates[pid]:
            product_updates[pid]['notes'] = ti
    
    update_count = 0
    for pid, updates in product_updates.items():
        if updates:
            supabase.table('products').update(updates).eq('product_id', pid).execute()
            update_count += 1
    if update_count:
        print(f"Updated {update_count} products with customer_tray_name / tray_info")

    # 3. (mold_revisions dropped) - build lookup mapping
    df_mr = clean_dataframe(read_csv_safe(CSV_DIR / 'moldrevision.csv'))
    mr_to_dr = {}
    if df_mr is not None:
        for _, row in df_mr.iterrows():
            dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
            mr_to_dr[str(row['MoldRevisionID'])] = dr_uuid

    # 4. equipment (MOLDS)
    df_pm = clean_dataframe(read_csv_safe(CSV_DIR / 'molds.csv'))
    
    # Pre-load jobs to get manufacturing_date
    df_jobs = clean_dataframe(read_csv_safe(CSV_DIR / 'jobs.csv'))
    mold_manufacturing_dates = {}
    if df_jobs is not None:
        for _, j_row in df_jobs.iterrows():
            m_id = str(j_row['MoldID']) if 'MoldID' in j_row else None
            dd = str(j_row['DeliveryDeadline']) if 'DeliveryDeadline' in j_row and j_row['DeliveryDeadline'] else None
            if m_id and dd and m_id not in mold_manufacturing_dates:
                mold_manufacturing_dates[m_id] = dd

    pm_records = []
    system_codes_seen = set()
    for _, row in df_pm.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['MoldID'])
        registry.register('equipment', legacy_id, new_uuid)
        
        dr_uuid = mr_to_dr.get(str(row['MoldRevisionID']))
        
        base_code = str(row['MoldCode']) if 'MoldCode' in row and row['MoldCode'] else legacy_id
        system_code = base_code
        counter = 1
        while system_code in system_codes_seen:
            system_code = f"{base_code}-{counter}"
            counter += 1
        system_codes_seen.add(system_code)

        pm_records.append({
            'equipment_id': new_uuid,
            'equipment_type': 'MOLD',
            'legacy_id': legacy_id,
            'equipment_code': system_code,
            'display_name': str(row['MoldName']) if 'MoldName' in row and row['MoldName'] else None,
            'design_revision_id': dr_uuid,
            'usage_status': str(row['MoldUsageStatus']) if 'MoldUsageStatus' in row and row['MoldUsageStatus'] else 'ACTIVE',
            'manufacturing_date': mold_manufacturing_dates.get(legacy_id),
            'current_rack_layer_id': registry.resolve('rack_layers', row['RackLayerID']) if 'RackLayerID' in row and row['RackLayerID'] else None,
            'keeper_company_id': registry.resolve('companies', row['KeeperCompany']) if 'KeeperCompany' in row and row['KeeperCompany'] else None,
            'actual_length_mm': str(row['MoldLengthModified']) if 'MoldLengthModified' in row and row['MoldLengthModified'] else None,
            'actual_width_mm': str(row['MoldWidthModified']) if 'MoldWidthModified' in row and row['MoldWidthModified'] else None,
            'actual_height_mm': str(row['MoldHeightModified']) if 'MoldHeightModified' in row and row['MoldHeightModified'] else None,
            'actual_weight': str(row['MoldWeight']) if 'MoldWeight' in row and row['MoldWeight'] else None,
            'entry_date': str(row['MoldEntry']) if 'MoldEntry' in row and row['MoldEntry'] else None,
            'device_status': str(row['DeviceStatus']) if 'DeviceStatus' in row and row['DeviceStatus'] else None,
            'notes': str(row['MoldNotes']) if 'MoldNotes' in row and row['MoldNotes'] else None,
            'on_checklist': bool(row['MoldOnCheckList']) if 'MoldOnCheckList' in row and row['MoldOnCheckList'] else False,
            'returned_date': str(row['MoldReturnedDate']) if 'MoldReturnedDate' in row and row['MoldReturnedDate'] else None,
            'disposed_date': str(row['MoldDisposedDate']) if 'MoldDisposedDate' in row and row['MoldDisposedDate'] else None,
        })
    if pm_records:
        chunk_size = 500
        for i in range(0, len(pm_records), chunk_size):
            supabase.table('equipment').insert(pm_records[i:i+chunk_size]).execute()
        print(f"Imported {len(pm_records)} molds to equipment")

