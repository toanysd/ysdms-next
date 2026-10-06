import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_query_inventory.json', 'r', encoding='utf-8') as f:
    queries = json.load(f)
with open('scripts/access_vba_inventory.json', 'r', encoding='utf-8') as f:
    vba = json.load(f)

print("="*70)
print("FULL SQL FOR KEY QUERIES:")
print("="*70)

target_queries = [
    'BangDuDinh_FullQry', 'ChuumonshoQry', 'ChamCongQry', 'Nippo_FullQry',
    'qryTeflonTuJobSangMold', 'qryTeflon', 'PhieuMuonKhuonQry', 'BaoCaoNoiDungGcQry'
]

for q in queries:
    if q['query_name'] in target_queries:
        print(f"\n--- QUERY: {q['query_name']} ---")
        print(f"Side-effect: {q['side_effect_class']}, Tables: {q['referenced_tables']}")
        print(q['sql_text'])

print("\n" + "="*70)
print("MODULE CODE EXAMINATION:")
print("="*70)

target_modules = [
    'ModCopyDataToMoldBorrow', 'ModTeflonSync', 'ModCutterLogRackLayerChange',
    'Form_KyHanGcFrms', 'Form_ThoiLuongGcFrms3', 'Form_DatHangvtSubFrm',
    'UpdateMoldBorrowFromJAEmoldCheck'
]

# Note: We need to see if we stored full module text or if we need to inspect from Access or if we can dump it.
for m in vba:
    if m['component_name'] in target_modules:
        print(f"\nModule: {m['component_name']} (Lines: {m['total_lines']}, Procs: {m['procedure_count']})")
        for p in m['procedures']:
            print(f"  Proc: {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']})")
