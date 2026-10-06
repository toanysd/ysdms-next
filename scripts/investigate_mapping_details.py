import pyodbc
import psycopg2
import re
import sys
import json
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

ACCESS_DB_PATH = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
ENV_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local'

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

pg_conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
pg_cur = pg_conn.cursor()

# 1. Supabase processing_statuses
print('=== 1. SUPABASE processing_statuses ===')
try:
    pg_cur.execute('SELECT * FROM processing_statuses ORDER BY status_id')
    for r in pg_cur.fetchall():
        print(dict(r))
except Exception as e:
    print('Error query processing_statuses:', e)
    pg_conn.rollback()

# 2. Supabase tables with processing
print('\n=== 2. SUPABASE tables matching processing ===')
pg_cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%processing%'")
for r in pg_cur.fetchall():
    print(r['table_name'])

# 3. Check processing_item_id / item_type_id in job_steps
print('\n=== 3. job_steps processing_item_id & item_type_id distribution ===')
pg_cur.execute("SELECT processing_item_id, item_type_id, count(*) FROM job_steps GROUP BY processing_item_id, item_type_id ORDER BY count(*) DESC LIMIT 10")
for r in pg_cur.fetchall():
    print(dict(r))

# 4. Check processing_status_id & step_status distribution in job_steps
print('\n=== 4. job_steps processing_status_id & step_status distribution ===')
pg_cur.execute("SELECT processing_status_id, step_status, count(*) FROM job_steps GROUP BY processing_status_id, step_status ORDER BY count(*) DESC")
for r in pg_cur.fetchall():
    print(dict(r))

# 5. Connect Access
conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={ACCESS_DB_PATH};ReadOnly=1;'
acc_conn = pyodbc.connect(conn_str)
acc_conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
acc_conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
acc_conn.setencoding(encoding='utf-8')
acc_cur = acc_conn.cursor()

# 6. Access tblProcessingStatus
print('\n=== 5. ACCESS tblProcessingStatus ===')
acc_cur.execute('SELECT * FROM [tblProcessingStatus]')
cols = [d[0] for d in acc_cur.description]
for r in acc_cur.fetchall():
    print(dict(zip(cols, r)))

# 7. Access tblProcessingItem
print('\n=== 6. ACCESS tblProcessingItem ===')
acc_cur.execute('SELECT * FROM [tblProcessingItem]')
cols = [d[0] for d in acc_cur.description]
for r in acc_cur.fetchall():
    print(dict(zip(cols, r)))

# 8. Access tblItemType
print('\n=== 7. ACCESS tblItemType ===')
acc_cur.execute('SELECT * FROM [tblItemType]')
cols = [d[0] for d in acc_cur.description]
for r in acc_cur.fetchall():
    print(dict(zip(cols, r)))

# 9. Check how existing steps in those 6 jobs were originally stored in Access
print('\n=== 8. Existing steps in Access for those 6 Jobs ===')
acc_cur.execute('''
    SELECT ProcessingDeadlineID, JobID, ItemTypeID, ProcessingStatusID, ProcessingDeadline, ProcessingNotes
    FROM [tblProcessingDeadline]
    WHERE JobID IN (623, 1170, 1248, 1250, 1247, 1249)
    ORDER BY JobID, ProcessingDeadlineID
''')
cols = [d[0] for d in acc_cur.description]
for r in acc_cur.fetchall():
    print(dict(zip(cols, r)))

pg_conn.close()
acc_conn.close()
