import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_query_inventory.json', 'r', encoding='utf-8') as f:
    queries = json.load(f)
with open('scripts/access_vba_inventory.json', 'r', encoding='utf-8') as f:
    vba = json.load(f)

for q in queries:
    if q['query_name'] == 'qryMOLDprocessing':
        print("=== QUERY: qryMOLDprocessing ===")
        print("Tables:", q['referenced_tables'])
        print("SQL:\n", q['sql_text'])

for m in vba:
    if m['component_name'] == 'Form_frmMOLDProcessing':
        print("\n=== VBA: Form_frmMOLDProcessing ===")
        print("Lines:", m['total_lines'], "Procedures:", len(m['procedures']))
        for p in m['procedures']:
            print(f"  - {p['procedure_name']} ({p['procedure_type']}, {p['side_effect_class']}) - Tables: {p['referenced_tables']}")
