import json
with open('scripts/p0_1_schema_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for tbl in ['products', 'design_revisions', 'equipment']:
    info = data[tbl]
    print(f'=== TABLE: public.{tbl} ({info["column_count"]} cols) ===')
    for c in info['columns']:
        null_str = 'NULL' if c['nullable'] else 'NOT NULL'
        print(f'  {c["name"]}: {c["type"]} {null_str}')
    print('CONSTRAINTS:')
    for c in info['constraints']:
        if c['type'] == 'FOREIGN KEY':
            print(f'  [{c["type"]}] {c["name"]} ({c["column"]}) -> {c["foreign_table"]}({c["foreign_column"]})')
        else:
            print(f'  [{c["type"]}] {c["name"]} ({c["column"]})')
    print()
