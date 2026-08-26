import os

filepath = r'scripts/seed_v5/main.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('("cutters", "cutter_id")', '')

# Fix preloading physical_molds -> equipment
old_preload = '''    # 3. Physical Molds
    res = supabase.table('physical_molds').select('legacy_id, physical_mold_id').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('MOLD-'):
            registry.register('physical_molds', row['legacy_id'].replace('MOLD-',''), row['physical_mold_id'])'''

new_preload = '''    # 3. Equipment (Molds)
    res = supabase.table('equipment').select('legacy_id, equipment_id').eq('equipment_type', 'MOLD').execute()
    for row in res.data:
        if row['legacy_id'] and row['legacy_id'].startswith('MOLD-'):
            registry.register('equipment', row['legacy_id'].replace('MOLD-',''), row['equipment_id'])'''

content = content.replace(old_preload, new_preload)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
