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

print("=== CHECK DELETE POLICIES ON 6 CORE TABLES ===")
cur.execute("""
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies
    WHERE tablename IN ('products', 'design_revisions', 'equipment', 'jobs', 'job_steps', 'equipment_assignments', 'work_logs')
      AND cmd IN ('DELETE', 'ALL')
    ORDER BY tablename, policyname;
""")
for r in cur.fetchall():
    print(f"  [{r[1]}] {r[2]} ({r[5]} for {r[4]}) -> QUAL: {r[6]}")

print("\n=== TEST ADVISORY LOCK CAPABILITY ===")
cur.execute("SELECT pg_advisory_xact_lock(123456789);")
print("pg_advisory_xact_lock executed successfully!")

conn.close()
