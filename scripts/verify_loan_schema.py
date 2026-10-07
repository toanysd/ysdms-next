import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, '.')
from scripts.pe_an_messenger import get_connection

conn = get_connection()
cur = conn.cursor()

# 1. Check existing tables related to loans or equipment
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE '%loan%';
""")
tables = cur.fetchall()
print("=== Tables matching '%loan%' in public ===")
for t in tables:
    print(f"  - {t[0]}")

# 2. For each found table, list its columns
for t in tables:
    t_name = t[0]
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position;
    """, (t_name,))
    cols = cur.fetchall()
    print(f"\n=== Columns of '{t_name}' ===")
    for c in cols:
        print(f"  * {c[0]}: {c[1]} (nullable: {c[2]})")

# 3. Check equipment table columns related to custody or loans
cur.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'equipment'
      AND (column_name LIKE '%loan%' OR column_name LIKE '%custody%' OR column_name LIKE '%owner%' OR column_name LIKE '%status%');
""")
eq_cols = cur.fetchall()
print(f"\n=== Relevant columns in 'equipment' ===")
for c in eq_cols:
    print(f"  * {c[0]}: {c[1]}")

conn.close()
