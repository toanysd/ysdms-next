import os, re

filepath = r'scripts/seed_v5/importers/mold.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace mold_revisions section
old_mr_section = '''    # 3. mold_revisions
    df_mr = clean_dataframe(read_csv_safe(CSV_DIR / 'moldrevision.csv'))
    mr_records = []
    for _, row in df_mr.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['MoldRevisionID'])
        registry.register('mold_revisions', legacy_id, new_uuid)
        
        product_uuid = registry.resolve('mold_to_product', row['MoldMasterID'])
        dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
        
        mr_records.append({
            'revision_id': new_uuid,
            'legacy_id': legacy_id,
            'revision_code': str(row['RevisionNo']) if 'RevisionNo' in row and row['RevisionNo'] else legacy_id,
            'revision_name': str(row['RevisionName']) if 'RevisionName' in row and row['RevisionName'] else None,
            'product_id': product_uuid,
            'design_revision_id': dr_uuid,
            'is_active': True
        })
    if mr_records:
        chunk_size = 500
        for i in range(0, len(mr_records), chunk_size):
            supabase.table('mold_revisions').insert(mr_records[i:i+chunk_size]).execute()
        print(f"Imported {len(mr_records)} mold_revisions")'''

new_mr_section = '''    # 3. (mold_revisions dropped) - build lookup mapping
    df_mr = clean_dataframe(read_csv_safe(CSV_DIR / 'moldrevision.csv'))
    mr_to_dr = {}
    if df_mr is not None:
        for _, row in df_mr.iterrows():
            dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
            mr_to_dr[str(row['MoldRevisionID'])] = dr_uuid'''

content = content.replace(old_mr_section, new_mr_section)

# Replace physical_molds section
content = content.replace("# 4. physical_molds", "# 4. equipment (MOLDS)")
content = content.replace("registry.register('physical_molds', legacy_id, new_uuid)", "registry.register('equipment', legacy_id, new_uuid)")
content = content.replace("mr_uuid = registry.resolve('mold_revisions', row['MoldRevisionID'])", "dr_uuid = mr_to_dr.get(str(row['MoldRevisionID']))")

content = content.replace("'physical_mold_id': new_uuid,", "'equipment_id': new_uuid,\n            'equipment_type': 'MOLD',")
content = content.replace("'system_code': system_code,", "'equipment_code': system_code,")
content = content.replace("'mold_revision_id': mr_uuid,", "'design_revision_id': dr_uuid,")
content = content.replace("'mold_entry_date': str(row['MoldEntry'])", "'entry_date': str(row['MoldEntry'])")
content = content.replace("supabase.table('physical_molds').insert(pm_records[i:i+chunk_size]).execute()", "supabase.table('equipment').insert(pm_records[i:i+chunk_size]).execute()")
content = content.replace('print(f"Imported {len(pm_records)} physical_molds")', 'print(f"Imported {len(pm_records)} molds to equipment")')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
