import uuid
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_cutters(supabase, registry: IdRegistry):
    print("--- Importing Cutters ---")
    
    # 1. cutters -> equipment
    df_cutters = clean_dataframe(read_csv_safe(CSV_DIR / 'cutters.csv'))
    cutter_records = []
    cutter_nos_seen = set()
    for _, row in df_cutters.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['CutterID'])
        registry.register('equipment', legacy_id, new_uuid)
        
        company_uuid = registry.resolve('customers', row['CustomerID'])
        
        # design_revision_id direct link if possible
        dr_uuid = None
        if 'MoldDesignID' in row:
            dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
        
        base_code = str(row['CutterNo']) if 'CutterNo' in row and row['CutterNo'] else legacy_id
        cutter_no = base_code
        counter = 1
        while cutter_no in cutter_nos_seen:
            cutter_no = f"{base_code}-{counter}"
            counter += 1
        cutter_nos_seen.add(cutter_no)

        cutter_records.append({
            'equipment_id': new_uuid,
            'equipment_type': 'CUTTER_SEPARATE',
            'legacy_id': legacy_id,
            'equipment_code': cutter_no,
            'display_name': str(row['CutterName']) if row['CutterName'] else None,
            'company_id': company_uuid,
            'design_revision_id': dr_uuid,
            'usage_status': 'ACTIVE'
        })
    if cutter_records:
        chunk_size = 500
        for i in range(0, len(cutter_records), chunk_size):
            supabase.table('equipment').insert(cutter_records[i:i+chunk_size]).execute()
        print(f"Imported {len(cutter_records)} cutters to equipment")

    # 2. mold_design_cutters (Many to many)
    df_mdc = clean_dataframe(read_csv_safe(CSV_DIR / 'moldcutter.csv'))
    mdc_records = []
    for _, row in df_mdc.iterrows():
        dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
        cutter_uuid = registry.resolve('equipment', row['CutterID'])
        
        if dr_uuid and cutter_uuid:
            mdc_records.append({
                'mold_design_id': dr_uuid,
                'cutter_id': cutter_uuid,
                'notes': str(row['Note']) if 'Note' in row and row['Note'] else None
            })
    if mdc_records:
        chunk_size = 500
        for i in range(0, len(mdc_records), chunk_size):
            supabase.table('mold_design_cutters').insert(mdc_records[i:i+chunk_size]).execute()
        print(f"Imported {len(mdc_records)} mold_design_cutters")
