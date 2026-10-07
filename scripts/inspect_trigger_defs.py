import psycopg2
import os
import re
from psycopg2.extras import RealDictCursor

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_ROOT, '.env.local')

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

# 1. Fetch exact trigger definitions from pg_trigger
cur.execute('''
    SELECT 
        tgname AS trigger_name,
        relname AS table_name,
        pg_get_triggerdef(t.oid) AS trigger_def
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE relname IN ('job_steps', 'work_logs')
      AND NOT tgisinternal
    ORDER BY relname, tgname;
''')
print("=== TRIGGER DEFINITIONS ===")
for r in cur.fetchall():
    print(f"[{r['table_name']}] {r['trigger_name']}:\n  {r['trigger_def']}\n")

# 2. Fetch function definitions
for fn in ['sync_job_overall_progress', 'trg_update_job_status_from_steps', 'trg_update_step_status_from_worklogs']:
    cur.execute('SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p WHERE proname = %s', (fn,))
    r = cur.fetchone()
    print(f"=== FUNCTION: {fn} ===\n{r['def']}\n")

conn.close()
