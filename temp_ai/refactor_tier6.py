import os

filepath = r'scripts/rebaseline/importers/tier6_lifecycle.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("registry.lookup('physical_molds', clean_id(row.get('MoldID')))", "registry.lookup('equipment', clean_id(row.get('MoldID')))")
content = content.replace("registry.lookup('cutters', clean_id(row.get('CutterID')))", "registry.lookup('equipment', clean_id(row.get('CutterID')))")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
