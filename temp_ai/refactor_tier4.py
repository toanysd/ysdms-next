import os

filepath = r'scripts/rebaseline/importers/tier4_cutters.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("registry.register('cutters', cid, cutter_id)", "registry.register('equipment', cid, cutter_id)")
content = content.replace("cutter_id = registry.lookup('cutters', clean_id(row.get('CutterID')))", "cutter_id = registry.lookup('equipment', clean_id(row.get('CutterID')))")
content = content.replace("'cutter_id': cutter_id,", "'equipment_id': cutter_id,\n                'equipment_type': 'CUTTER_SEPARATE',")
content = content.replace("'cutter_no': c_no,", "'equipment_code': c_no,")
content = content.replace("'cutter_name': c_name,", "'display_name': c_name,")
content = content.replace("supabase.table('cutters').upsert(chunk).execute()", "supabase.table('equipment').upsert(chunk).execute()")
content = content.replace("'cutter_design_code': design_code,", "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
