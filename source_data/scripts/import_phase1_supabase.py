# -*- coding: utf-8 -*-
"""
Import Phase 1 normalized data to Supabase PostgreSQL database.
Executes source_data/company_migration.sql using psycopg2.
"""
import sys
import os
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = "postgresql://postgres:Ysd%401621toan@db.iirezrszalmecsslbruo.supabase.co:5432/postgres"
SQL_FILE = r"source_data/company_migration.sql"

def import_to_supabase():
    if not os.path.exists(SQL_FILE):
        print(f"Error: {SQL_FILE} not found!")
        sys.exit(1)

    print("Connecting to Supabase PostgreSQL database...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("Connected successfully!")

        with open(SQL_FILE, 'r', encoding='utf-8') as f:
            sql_script = f.read()

        print(f"Executing migration SQL script ({len(sql_script):,} bytes)...")
        cur.execute(sql_script)
        conn.commit()

        print("Migration executed and committed successfully!")

        # Verify updated counts
        cur.execute("SELECT COUNT(*) FROM companies;")
        total_companies = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM companies WHERE tel IS NOT NULL OR address IS NOT NULL;")
        enriched_companies = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM delivery_sites;")
        total_sites = cur.fetchone()[0]

        print("\n=== SUPABASE DATABASE UPDATE SUMMARY ===")
        print(f"Total companies in DB      : {total_companies}")
        print(f"Enriched companies (w/ info): {enriched_companies}")
        print(f"Total delivery sites in DB : {total_sites}")

        # Sample check
        cur.execute("SELECT company_code, company_name, tel, address FROM companies WHERE company_code IN ('AMP', 'SMK', 'ADV', 'NSK') ORDER BY company_code;")
        samples = cur.fetchall()
        print("\n--- Sample Updated Companies ---")
        for s in samples:
            print(f"Code: {s[0]:6s} | Name: {s[1]:40s} | Tel: {s[2] or '':15s} | Addr: {s[3] or ''}")

        cur.close()
        conn.close()
        print("\nImport completed successfully!")

    except Exception as e:
        print(f"Database error during migration: {e}")
        sys.exit(1)

if __name__ == '__main__':
    import_to_supabase()
