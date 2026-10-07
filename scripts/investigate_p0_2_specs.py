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

print("=== 1. CHECK CONSTRAINTS ON job_steps.step_status & jobs.job_status ===")
cur.execute("""
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname IN ('job_steps', 'jobs') AND c.contype = 'c';
""")
for r in cur.fetchall():
    print(f"  {r[0]}: {r[1]}")

print("\n=== 2. CHECK SEQUENCES IN DATABASE ===")
cur.execute("""
    SELECT sequence_schema, sequence_name 
    FROM information_schema.sequences 
    WHERE sequence_schema = 'public';
""")
for r in cur.fetchall():
    print(f"  {r[0]}.{r[1]}")

print("\n=== 3. CHECK RLS POLICIES ON CORE TABLES ===")
cur.execute("""
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE tablename IN ('products', 'design_revisions', 'equipment', 'jobs', 'job_steps', 'work_logs')
    ORDER BY tablename, policyname;
""")
policies = cur.fetchall()
print(f"Total RLS policies on core tables: {len(policies)}")
for p in policies:
    print(f"  [{p[1]}] {p[2]} ({p[5]} for {p[4]}) -> {p[6]}")

cur.execute("""
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE tablename IN ('products', 'design_revisions', 'equipment', 'jobs', 'job_steps', 'work_logs')
    ORDER BY tablename;
""")
for r in cur.fetchall():
    print(f"  Table {r[0]}: RLS enabled = {r[1]}")

conn.close()
