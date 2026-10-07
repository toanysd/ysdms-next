import json

with open('scripts/p0_1_schema_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for tbl, info in data.items():
    print(f"\n========================================================")
    print(f"TABLE: public.{tbl} (Columns: {info['column_count']})")
    print(f"========================================================")
    print("COLUMNS:")
    for col in info['columns']:
        null_str = "NULLABLE" if col['nullable'] else "NOT NULL"
        def_str = f" DEFAULT {col['default']}" if col['default'] else ""
        print(f"  - {col['name']} ({col['type']}) {null_str}{def_str}")
    
    print("\nCONSTRAINTS:")
    for c in info['constraints']:
        if c['type'] == 'FOREIGN KEY':
            print(f"  - [{c['type']}] {c['name']} ON ({c['column']}) -> {c['foreign_table']}({c['foreign_column']})")
        else:
            print(f"  - [{c['type']}] {c['name']} ON ({c['column']})")
