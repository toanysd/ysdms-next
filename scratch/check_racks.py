import csv

with open('source_data/csv-access-data/racks.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Check rack_code uniqueness
codes = []
for r in rows:
    code = r.get('RackSymbol') or r.get('RackNumber') or f"R-{r.get('RackID')}"
    codes.append(code)

print(f"Total racks: {len(codes)}")
print(f"Unique codes: {len(set(codes))}")

# Find duplicates
from collections import Counter
dups = {k:v for k,v in Counter(codes).items() if v > 1}
if dups:
    print(f"DUPLICATES: {dups}")
else:
    print("No duplicates")

# Check rack 94
for r in rows:
    if r.get('RackID') == '94':
        print(f"\nRack 94: Symbol={repr(r.get('RackSymbol'))}, Location={repr(r.get('RackLocation'))}")
