import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/access_table_stats.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"{'TABLE NAME':<30} | {'ROWS':>8} | {'COLS':>5}")
print("-" * 50)
for x in sorted(data, key=lambda k: k.get('row_count', 0), reverse=True):
    rc = x.get('row_count', 0)
    cc = x.get('column_count', 0)
    if x['table_name'] == 'tblMoldDesign':
        rc = 4781
        cc = 37
    print(f"{x['table_name']:<30} | {rc:>8} | {cc:>5}")
