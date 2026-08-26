import os

filepath = r'scripts/seed_v5/importers/job.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'physical_mold_id': registry.resolve('physical_molds', row['MoldID'])", "'equipment_id': registry.resolve('equipment', row['MoldID'])")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
