import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/evidence_94_internal_logs.json', 'r', encoding='utf-8') as f:
    logs = json.load(f)

print(f"Total: {len(logs)} logs")

# Group by category
categories = {
    'SHOP_STACKING': [40],
    'SHOP_FLANNEL_STICKING': [13, 23],
    'SHOP_REPAIR_MAINTENANCE': [42, 54],
    'SHOP_5S_CLEANING': [50],
    'SHOP_MACHINING_STANDALONE': [10, 11, 14, 15, 20, 24]
}

def get_category(code_id):
    for cat, codes in categories.items():
        if code_id in codes:
            return cat
    return 'SHOP_OTHER_INTERNAL'

# Print summary table
print(f"| WorkLogID | ProcessingCodeID | ProcessingName | ProcessingNotes | ProcessingDate | ProcessingDeadlineID | Proposed category | Evidence source |")
print(f"| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
for l in logs:
    wid = l['WorkLogID']
    cid = l['ProcessingCodeID']
    pname = l['ProcessingName'] or 'NULL'
    notes = (l['ProcessingNotes'] or '').replace('\r', ' ').replace('\n', ' ').strip()
    if len(notes) > 30:
        notes = notes[:27] + '...'
    pdate = l['ProcessingDate'][:10] if l['ProcessingDate'] else 'NULL'
    cat = get_category(cid)
    print(f"| {wid} | {cid} | {pname} | {notes} | {pdate} | NULL | {cat} | tblWorkLog |")
