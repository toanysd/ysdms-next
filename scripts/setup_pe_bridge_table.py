import os
import psycopg2

def setup_table():
    env = {}
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

    db_url = env.get('DATABASE_URL')
    if not db_url:
        print("Error: DATABASE_URL not found.")
        return False

    with open('supabase/migrations/20261007_099_pe_review_artifacts.sql', 'r', encoding='utf-8') as f:
        sql = f.read()

    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(db_url, connect_timeout=10)
    cur = conn.cursor()
    print("Executing Migration 099 DDL...")
    cur.execute(sql)
    conn.commit()

    # Verify table existence
    cur.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'pe_review_artifacts';
    """)
    cols = cur.fetchall()
    print("Table 'pe_review_artifacts' verified columns:")
    for c in cols:
        print(f"  - {c[0]} ({c[1]})")

    conn.close()
    return True

if __name__ == '__main__':
    setup_table()
