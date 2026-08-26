import os

filepath = r'scripts/rebaseline/utils/truncator.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('    ("cutters", "cutter_id", True),\n', '')
content = content.replace('    ("physical_molds", "physical_mold_id", True),\n', '')
content = content.replace('    ("mold_revisions", "revision_id", True),\n', '')
content = content.replace('    ("mold_design_cutters", "id", True),\n', '    ("mold_design_cutters", "id", True),\n    ("equipment", "equipment_id", True),\n')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
