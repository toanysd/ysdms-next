# -*- coding: utf-8 -*-
"""
Script 3: generate_migration_sql.py
Reads company_normalized.json and delivery_sites_normalized.json,
generates PostgreSQL INSERT statements with ON CONFLICT clauses for Supabase.
Output: source_data/company_migration.sql
"""
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

COMPANIES_JSON = r'source_data/company_normalized.json'
SITES_JSON = r'source_data/delivery_sites_normalized.json'
OUTPUT_SQL = r'source_data/company_migration.sql'

def sql_quote(val):
    if val is None:
        return 'NULL'
    # Escape single quote
    v_str = str(val).replace("'", "''")
    return f"'{v_str}'"

def sql_array(val_list):
    if not val_list:
        return "'{}'::text[]"
    escaped = [v.replace("'", "''") for v in val_list]
    joined = ",".join([f'"{e}"' for e in escaped])
    return f"'{'{' + joined + '}'}'::text[]"

def generate_sql():
    if not os.path.exists(COMPANIES_JSON) or not os.path.exists(SITES_JSON):
        print("Error: Input JSON files not found!")
        sys.exit(1)

    with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    with open(SITES_JSON, 'r', encoding='utf-8') as f:
        sites = json.load(f)

    lines = []
    lines.append("-- ========================================================")
    lines.append("-- YSDMS NextGen - Phase 1 Company & Delivery Site Migration")
    lines.append("-- Generated automatically by generate_migration_sql.py")
    lines.append("-- ========================================================\n")

    lines.append("BEGIN;\n")

    lines.append("-- 1. Insert/Update Companies")
    lines.append("-- --------------------------------------------------------")
    for c in companies:
        code = sql_quote(c.get('company_code'))
        name = sql_quote(c.get('company_name_display') or c.get('company_name'))
        romaji = sql_quote(c.get('company_name_romaji'))
        c_type = sql_array(c.get('company_type', ['CUSTOMER']))
        is_active = 'true' if c.get('is_active', True) else 'false'
        tel = sql_quote(c.get('tel'))
        fax = sql_quote(c.get('fax'))
        addr = sql_quote(c.get('address'))
        folder = sql_quote(c.get('order_folder_path'))
        notes = sql_quote(c.get('notes'))

        stmt = (
            f"INSERT INTO companies (company_code, company_name, company_name_romaji, company_type, is_active, tel, fax, address, order_folder_path, notes)\n"
            f"VALUES ({code}, {name}, {romaji}, {c_type}, {is_active}, {tel}, {fax}, {addr}, {folder}, {notes})\n"
            f"ON CONFLICT (company_code) DO UPDATE SET\n"
            f"  company_name = EXCLUDED.company_name,\
  company_type = EXCLUDED.company_type,\
  tel = EXCLUDED.tel,\
  fax = EXCLUDED.fax,\
  address = EXCLUDED.address,\
  order_folder_path = EXCLUDED.order_folder_path,\
  notes = EXCLUDED.notes;\n"
        )
        lines.append(stmt)

    lines.append("\n-- 2. Insert/Update Delivery Sites")
    lines.append("-- --------------------------------------------------------")
    for s in sites:
        c_code = sql_quote(s.get('company_code'))
        s_code = sql_quote(s.get('site_code'))
        s_name = sql_quote(s.get('site_name'))
        s_addr = sql_quote(s.get('site_address'))
        s_tel = sql_quote(s.get('site_tel'))
        s_fax = sql_quote(s.get('site_fax'))
        s_contact = sql_quote(s.get('contact_person'))
        is_active = 'true' if s.get('is_active', True) else 'false'

        stmt = (
            f"INSERT INTO delivery_sites (company_id, site_code, site_name, site_address, site_tel, site_fax, contact_person, is_active)\n"
            f"SELECT company_id, {s_code}, {s_name}, {s_addr}, {s_tel}, {s_fax}, {s_contact}, {is_active}\n"
            f"FROM companies WHERE company_code = {c_code}\n"
            f"ON CONFLICT (company_id, site_code) DO UPDATE SET\n"
            f"  site_name = EXCLUDED.site_name,\
  site_address = EXCLUDED.site_address,\
  site_tel = EXCLUDED.site_tel,\
  site_fax = EXCLUDED.site_fax,\
  contact_person = EXCLUDED.contact_person;\n"
        )
        lines.append(stmt)

    lines.append("COMMIT;\n")

    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))

    print(f"Successfully generated SQL migration script -> {OUTPUT_SQL}")
    print(f"Total SQL Statements: {len(companies)} company inserts, {len(sites)} site inserts")

if __name__ == '__main__':
    generate_sql()
