import os

filepath = r'scripts/rebaseline/importers/tier3_design_mold.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove mold_revision logic
content = content.replace('''            # Mold Revision bridge record for physical_molds FK constraint
            mold_rev_record = {
                'revision_id': uuid_id,
                'design_revision_id': uuid_id,
                'product_id': product_id,
                'revision_name': d_code,
                'is_active': True
            }
            mold_revision_records.append(mold_rev_record)''', '')

content = content.replace('''        if not dry_run and mold_revision_records:
            for i in range(0, len(mold_revision_records), BATCH_SIZE):
                chunk = mold_revision_records[i:i+BATCH_SIZE]
                supabase.table('mold_revisions').upsert(chunk).execute()
            print(f"  Inserted {len(mold_revision_records)} mold revisions")
            stats.record_success('mold_revisions', len(mold_revision_records))''', '')

# Replace physical_molds -> equipment
content = content.replace("'physical_mold_id': uuid_id,", "'equipment_id': uuid_id,\n                'equipment_type': 'MOLD',")
content = content.replace("'system_code': sys_code,", "'equipment_code': sys_code,")
content = content.replace("'mold_revision_id': mold_revision_id,", "'design_revision_id': mold_revision_id,")
content = content.replace("registry.register('physical_molds', mold_id_val, uuid_id)", "registry.register('equipment', mold_id_val, uuid_id)")
content = content.replace("supabase.table('physical_molds').upsert(chunk).execute()", "supabase.table('equipment').upsert(chunk).execute()")
content = content.replace("stats.record_success('physical_molds'", "stats.record_success('equipment'")
content = content.replace("stats.record_error('physical_molds'", "stats.record_error('equipment'")
content = content.replace("physical molds", "equipment molds")
content = content.replace("Physical Molds", "Equipment Molds")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
