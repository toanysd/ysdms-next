import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_logic_dependency_graph.json', 'r', encoding='utf-8') as f:
    graph = json.load(f)

for item in graph:
    if item['object_name'] in ['BangDuDinhFrm', 'frmMOLDProcessing', 'frmDaiLyWorkLog', 'frmShipLog', 'frmTeflonLog']:
        print("="*60)
        print("OBJECT:", item['object_name'])
        print("RecordSource:", item['record_source'])
        print("VBA Module:", item['vba_module'], "Lines:", item['vba_line_count'])
        print("VBA Side effects:", item['vba_side_effects'])
        print("Referenced Queries:", item['referenced_queries'])
        print("All Affected Tables:", item['all_affected_tables'])
        print("Subforms:", item['subforms'])
