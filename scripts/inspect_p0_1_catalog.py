import os
import psycopg2
import json

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL and os.path.exists('.env.local'):
    with open('.env.local') as f:
        for line in f:
            if line.startswith('DATABASE_URL='):
                DATABASE_URL = line.strip().split('=', 1)[1].strip('"\'')
                break

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found")

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

TARGET_TABLES = [
    'products',
    'design_revisions',
    'equipment',
    'jobs',
    'job_steps',
    'work_logs',
    'racks',
    'rack_layers',
    'asset_location_logs',
    'equipment_assignments'
]

results = {}

for tbl in TARGET_TABLES:
    # 1. Check table existence
    cur.execute("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = %s
        );
    """, (tbl,))
    exists = cur.fetchone()[0]
    if not exists:
        results[tbl] = {"exists": False}
        continue

    # 2. Get Columns
    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position;
    """, (tbl,))
    columns = [
        {
            "name": r[0],
            "type": r[1],
            "nullable": r[2] == 'YES',
            "default": r[3]
        }
        for r in cur.fetchall()
    ]

    # 3. Get Constraints (PK, Unique, FK)
    cur.execute("""
        SELECT 
            tc.constraint_name, 
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.table_schema = 'public' AND tc.table_name = %s
        ORDER BY tc.constraint_type, tc.constraint_name;
    """, (tbl,))
    raw_constraints = cur.fetchall()
    constraints = []
    for c in raw_constraints:
        constraints.append({
            "name": c[0],
            "type": c[1],
            "column": c[2],
            "foreign_table": c[3],
            "foreign_column": c[4]
        })

    results[tbl] = {
        "exists": True,
        "column_count": len(columns),
        "columns": columns,
        "constraints": constraints
    }

with open('scripts/p0_1_schema_dump.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Schema dump complete for 10 tables. File saved to scripts/p0_1_schema_dump.json")
conn.close()
