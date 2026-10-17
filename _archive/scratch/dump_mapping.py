import os, json, csv, codecs
import sys
sys.stdout.reconfigure(encoding='utf-8')

try:
    with codecs.open('source_data/csv-access-data/itemtype.csv', 'r', encoding='utf-8-sig') as f:
        text = f.read()
except UnicodeDecodeError:
    with codecs.open('source_data/csv-access-data/itemtype.csv', 'r', encoding='shift_jis') as f:
        text = f.read()
        
mapping = {}
for row in csv.DictReader(text.splitlines()):
    mapping[row['ItemTypeID']] = f"{row['ItemTypeName']} ({row['ItemType']})"
print("ITEM TYPE MAPPING:")
print(json.dumps(mapping, ensure_ascii=False, indent=2))

try:
    with codecs.open('source_data/csv-access-data/processingcode.csv', 'r', encoding='utf-8-sig') as f:
        text = f.read()
except UnicodeDecodeError:
    with codecs.open('source_data/csv-access-data/processingcode.csv', 'r', encoding='shift_jis') as f:
        text = f.read()

proc_mapping = {}
for row in csv.DictReader(text.splitlines()):
    proc_mapping[row['ProcessingCodeID']] = row['ProcessingName']
print("\nPROCESSING CODE MAPPING:")
print(json.dumps(proc_mapping, ensure_ascii=False, indent=2))
