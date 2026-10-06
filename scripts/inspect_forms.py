import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_form_report_inventory.json', 'r', encoding='utf-8') as f:
    forms = json.load(f)

target_forms = ['BangDuDinhFrm', 'frmMOLDProcessing', 'frmKHUONNHAPDULIEU', 'frmShipLog', 'frmTeflonLog', 'frmDaiLyWorkLog']

for f in forms:
    if f['object_name'] in target_forms:
        print("="*60)
        print(f"Object: {f['object_name']} ({f['object_type']})")
        print(f"RecordSource: {f['record_source']}")
        print(f"Subforms: {f['subforms']}")
        print(f"Buttons count: {f['buttons_count']}, Buttons: {f['buttons']}")
        print(f"Event bindings: {f['event_bindings']}")
