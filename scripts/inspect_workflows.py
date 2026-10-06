import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_query_inventory.json', 'r', encoding='utf-8') as f:
    queries = json.load(f)

with open('scripts/access_vba_inventory.json', 'r', encoding='utf-8') as f:
    vba = json.load(f)

with open('scripts/access_form_report_inventory.json', 'r', encoding='utf-8') as f:
    forms = json.load(f)

with open('scripts/access_logic_dependency_graph.json', 'r', encoding='utf-8') as f:
    graph = json.load(f)

print("="*60)
print("=== WORKFLOW 1: CHỈ THỊ & LẬP LỊCH KHUÔN ===")
print("="*60)
for q in queries:
    if 'BangDuDinh' in q['query_name'] or 'KyHan' in q['query_name']:
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("SQL:", q['sql_text'][:300].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['BangDuDinh', 'KyHan']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']} | Buttons: {f['buttons']}")

for v in vba:
    if any(k in v['component_name'] for k in ['BangDuDinh', 'KyHan']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")

print("\n" + "="*60)
print("=== WORKFLOW 2: NIPPO & GIỜ CÔNG ===")
print("="*60)
for q in queries:
    if any(k in q['query_name'] for k in ['ChamCong', 'ThoiLuong', 'Nippo', 'WorkLog']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("SQL:", q['sql_text'][:300].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['ThoiLuong', 'ChamCong', 'Nippo', 'WorkLog']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']} | Buttons: {f['buttons']}")

for v in vba:
    if any(k in v['component_name'] for k in ['ThoiLuong', 'ChamCong', 'Nippo', 'WorkLog']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")

print("\n" + "="*60)
print("=== WORKFLOW 3: ĐẶT VẬT TƯ GIA CÔNG ===")
print("="*60)
for q in queries:
    if any(k in q['query_name'] for k in ['DatHang', 'VatTu', 'Chuumonsho', 'Tehai']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("SQL:", q['sql_text'][:300].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['DatHang', 'VatTu', 'Chuumonsho', 'Tehai']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']} | Buttons: {f['buttons']}")

for v in vba:
    if any(k in v['component_name'] for k in ['DatHang', 'VatTu', 'Chuumonsho', 'Tehai']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")

print("\n" + "="*60)
print("=== WORKFLOW 4: MƯỢN/TRẢ KHUÔN (LOANS) ===")
print("="*60)
for q in queries:
    if any(k in q['query_name'] for k in ['Borrow', 'Muon', 'Tra', 'Loan']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("SQL:", q['sql_text'][:300].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['Borrow', 'Muon', 'Tra', 'Loan']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']} | Buttons: {f['buttons']}")

for v in vba:
    if any(k in v['component_name'] for k in ['Borrow', 'Muon', 'Tra', 'Loan']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")

print("\n" + "="*60)
print("=== WORKFLOW 5: BẢO DƯỠNG & LOGS ===")
print("="*60)
for q in queries:
    if any(k in q['query_name'] for k in ['Teflon', 'Location', 'MoldLog', 'CutterLog', 'ShipLog']):
        print(f"Query: {q['query_name']} | SideEffect: {q['side_effect_class']} | Tables: {q['referenced_tables']}")
        print("SQL:", q['sql_text'][:300].replace('\r', ' ').replace('\n', ' '))

for f in forms:
    if any(k in f['object_name'] for k in ['Teflon', 'Location', 'MoldLog', 'CutterLog', 'ShipLog']):
        print(f"Form: {f['object_name']} ({f['object_type']}) | RecordSource: {f['record_source']} | Subforms: {f['subforms']} | Buttons: {f['buttons']}")

for v in vba:
    if any(k in v['component_name'] for k in ['Teflon', 'Location', 'MoldLog', 'CutterLog', 'ShipLog']):
        print(f"VBA: {v['component_name']} (Lines: {v['total_lines']}, Procs: {len(v['procedures'])})")
        for p in v['procedures']:
            print(f"   - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")
