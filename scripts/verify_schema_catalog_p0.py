import os
import psycopg2
from urllib.parse import urlparse

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

# 1. Check tables
cur.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('equipment_assignments', 'equipment', 'jobs', 'job_steps', 'work_logs', 'asset_location_logs', 'racks', 'rack_layers', 'products', 'design_revisions')
    ORDER BY table_name;
""")
tables = [r[0] for r in cur.fetchall()]
print("=== VERIFIED TABLES ===")
for t in tables:
    print(f"  - {t}")

def print_columns(table_name):
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position;
    """, (table_name,))
    cols = cur.fetchall()
    print(f"\n=== COLUMNS FOR {table_name} ({len(cols)} cols) ===")
    for c in cols:
        print(f"  - {c[0]}: {c[1]} (NULLABLE: {c[2]})")

print_columns('equipment')
print_columns('jobs')
print_columns('job_steps')
print_columns('work_logs')
print_columns('equipment_assignments')

conn.close()
