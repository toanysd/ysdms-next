import os

filepath = r'scripts/seed_v5/importers/lifecycle.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("registry.resolve('physical_molds', row['MoldID'])", "registry.resolve('equipment', row['MoldID'])")
content = content.replace("registry.resolve('cutters', row['CutterID'])", "registry.resolve('equipment', row['CutterID'])")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
