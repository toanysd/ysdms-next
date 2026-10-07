import psycopg2
import os

env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")

db_url = env.get('DATABASE_URL')
conn = psycopg2.connect(db_url, connect_timeout=10)
cur = conn.cursor()
cur.execute("""
    SELECT artifact_id, artifact_name, version, byte_size, substring(content_md from 1 for 250), updated_at
    FROM public.pe_review_artifacts
    WHERE artifact_name = 'MOLD_CUSTODY_BUSINESS_SPEC'
    ORDER BY version DESC LIMIT 1;
""")
row = cur.fetchone()
print("Artifact ID :", row[0])
print("Name        :", row[1])
print("Version     :", row[2])
print("Byte size   :", row[3])
print("Updated at  :", row[5])
import sys
sys.stdout.reconfigure(encoding='utf-8')
print("First 250 chars of content_md:\n", row[4])
conn.close()
