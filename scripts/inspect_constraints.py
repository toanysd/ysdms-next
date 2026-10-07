import psycopg2, re
from psycopg2.extras import RealDictCursor

with open('.env.local', 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

for table in ['job_steps', 'work_logs']:
    cur.execute('''
        SELECT conname, pg_get_constraintdef(c.oid) as def
        FROM pg_constraint c
        JOIN pg_namespace n ON n.oid = c.connamespace
        WHERE conrelid = %s::regclass;
    ''', (f"public.{table}",))
    print(f'=== CONSTRAINTS FOR {table} ===')
    for r in cur.fetchall():
        print(f"  {r['conname']}: {r['def']}")

conn.close()
