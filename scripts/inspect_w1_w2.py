import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_query_inventory.json', 'r', encoding='utf-8') as f:
    queries = json.load(f)
with open('scripts/access_form_report_inventory.json', 'r', encoding='utf-8') as f:
    forms = json.load(f)
with open('scripts/access_vba_inventory.json', 'r', encoding='utf-8') as f:
    vba = json.load(f)

print("=== WORKFLOW 1: CHỈ THỊ & LẬP LỊCH KHUÔN ===")
for q in queries:
    if any(k in q['query_name'] for k in ['BangDuDinh', 'KyHan']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("  SQL:", q['sql_text'][:200].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['BangDuDinh', 'KyHan']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']}")

for v in vba:
    if any(k in v['component_name'] for k in ['BangDuDinh', 'KyHan']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']})")

print("\n=== WORKFLOW 2: NIPPO & GIỜ CÔNG ===")
for q in queries:
    if any(k in q['query_name'] for k in ['ChamCong', 'ThoiLuong', 'Nippo', 'WorkLog']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("  SQL:", q['sql_text'][:200].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['ThoiLuong', 'ChamCong', 'Nippo', 'WorkLog']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']}")

for v in vba:
    if any(k in v['component_name'] for k in ['ThoiLuong', 'ChamCong', 'Nippo', 'WorkLog']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']})")
