"""Cleanup all legacy data before re-import"""
import os, sys
try:
    import psycopg2
except ImportError:
    os.system(f"{sys.executable} -m pip install psycopg2-binary -q")
    import psycopg2

DB_URL = "postgresql://postgres:Ysd@1621toan@db.iirezrszalmecsslbruo.supabase.co:5432/postgres"

cleanup_sql = """
DELETE FROM cutters WHERE legacy_id IS NOT NULL;
DELETE FROM cutter_masters WHERE legacy_id IS NOT NULL;
DELETE FROM physical_molds WHERE legacy_id IS NOT NULL;
DELETE FROM mold_revisions WHERE legacy_id IS NOT NULL;
DELETE FROM design_revisions WHERE legacy_id IS NOT NULL;
DELETE FROM mold_masters WHERE legacy_id IS NOT NULL;
DELETE FROM products WHERE legacy_id IS NOT NULL;
DELETE FROM rack_layers;
DELETE FROM racks;
DELETE FROM employees WHERE legacy_id IS NOT NULL;
DELETE FROM companies WHERE legacy_id IS NOT NULL;
"""

conn = psycopg2.connect(
    host='db.iirezrszalmecsslbruo.supabase.co',
    port=5432,
    dbname='postgres',
    user='postgres',
    password='Ysd@1621toan'
)
cur = conn.cursor()
for stmt in cleanup_sql.strip().split(';'):
    stmt = stmt.strip()
    if not stmt: continue
    try:
        cur.execute(stmt + ';')
        print(f"OK: {stmt[:60]}")
    except Exception as e:
        print(f"SKIP: {stmt[:60]} -> {e}")
        conn.rollback()
        continue
conn.commit()
cur.close()
conn.close()
print("Cleanup done!")
