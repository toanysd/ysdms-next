import os

filepath = r'scripts/rebaseline/importers/tier5_jobs.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("registry.lookup('physical_molds', clean_id(row.get('MoldID')))", "registry.lookup('equipment', clean_id(row.get('MoldID')))")
content = content.replace("'physical_mold_id': mold_id,", "'equipment_id': mold_id,")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
