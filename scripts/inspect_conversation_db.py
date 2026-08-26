import sqlite3
import os
import sys

# Set stdout encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

app_data = os.path.expanduser('~')
db_path = os.path.join(app_data, r'.gemini\antigravity\conversations\9c56ba47-776e-4b8f-8ba9-a8943fc5d0e8.db')

if not os.path.exists(db_path):
    print(f"File not found: {db_path}")
    sys.exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
tables = cur.fetchall()

print("--- TABLES AND SCHEMAS ---")
for name, sql in tables:
    print(f"\nTable: {name}")
    print(sql)

for name, _ in tables:
    cur.execute(f"SELECT COUNT(*) FROM {name};")
    count = cur.fetchone()[0]
    print(f"Row count in {name}: {count}")

conn.close()
