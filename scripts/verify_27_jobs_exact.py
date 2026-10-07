import os, psycopg2

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL and os.path.exists('.env.local'):
    with open('.env.local') as f:
        for line in f:
            if line.startswith('DATABASE_URL='):
                DATABASE_URL = line.strip().split('=', 1)[1].strip('"\'')
                break

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Supabase Production jobs count
cur.execute("SELECT count(*) FROM public.jobs;")
total_jobs = cur.fetchone()[0]

cur.execute("SELECT count(*) FROM public.jobs WHERE legacy_id IS NOT NULL;")
legacy_jobs = cur.fetchone()[0]

cur.execute("SELECT count(*) FROM public.jobs WHERE legacy_id LIKE 'LEGACY-JOB-%';")
legacy_prefix_jobs = cur.fetchone()[0]

print(f"SUPABASE PRODUCTION:")
print(f"  - Total jobs: {total_jobs}")
print(f"  - Jobs with legacy_id: {legacy_jobs}")
print(f"  - Jobs with LEGACY-JOB- prefix: {legacy_prefix_jobs}")

# Also check pyodbc if accessible on local machine for ysdJOB_20261006.accdb
accdb_path = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
print(f"\nACCESS FILE CHECK:")
print(f"  - Path: {accdb_path}")
print(f"  - Exists: {os.path.exists(accdb_path)}")
if os.path.exists(accdb_path):
    print(f"  - File size: {os.path.getsize(accdb_path)} bytes")

try:
    import pyodbc
    conn_str = f"DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={accdb_path};ReadOnly=1;"
    access_conn = pyodbc.connect(conn_str)
    access_cur = access_conn.cursor()
    access_cur.execute("SELECT count(*) FROM tblJOB")
    access_job_count = access_cur.fetchone()[0]
    print(f"  - Access tblJOB count: {access_job_count}")
    
    # Query distinct JobIDs in Access
    access_cur.execute("SELECT JobID FROM tblJOB")
    access_job_ids = set(f"LEGACY-JOB-{r[0]}" for r in access_cur.fetchall())
    
    # Query legacy_ids in Supabase
    cur.execute("SELECT legacy_id FROM public.jobs WHERE legacy_id IS NOT NULL")
    supabase_job_legacy_ids = set(r[0] for r in cur.fetchall())
    
    delta_job_ids = access_job_ids - supabase_job_legacy_ids
    print(f"  - Delta Job count (in Access but NOT in Supabase): {len(delta_job_ids)}")
    print(f"  - Delta Job IDs sample: {list(delta_job_ids)[:10]}")
    access_conn.close()
except Exception as e:
    print(f"  - pyodbc query note: {e}")

conn.close()
