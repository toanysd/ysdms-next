# -*- coding: utf-8 -*-
"""
Script 2: generate_products_sql.py
Reads source_data/products_normalized.json and generates PostgreSQL INSERT / UPSERT statements.
Output: source_data/products_migration.sql
"""
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

INPUT_JSON = r'source_data/products_normalized.json'
OUTPUT_SQL = r'source_data/products_migration.sql'

def sql_quote(val):
    if val is None:
        return 'NULL'
    v_str = str(val).replace("'", "''")
    return f"'{v_str}'"

def sql_num(val):
    if val is None:
        return 'NULL'
    return str(val)

def generate_sql():
    if not os.path.exists(INPUT_JSON):
        print(f"Error: {INPUT_JSON} not found!")
        sys.exit(1)

    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)

    lines = []
    lines.append("-- ========================================================")
    lines.append("-- YSDMS NextGen - Phase 2 Products & Trays Migration")
    lines.append("-- Generated automatically by generate_products_sql.py")
    lines.append("-- ========================================================\n")
    lines.append("BEGIN;\n")

    for p in products:
        p_code = sql_quote(p.get("product_code"))
        c_id = sql_quote(p.get("company_id"))
        p_name = sql_quote(p.get("product_name"))
        p_name_int = sql_quote(p.get("product_name_internal"))
        pocket = sql_num(p.get("pocket_count"))
        pack_qty = sql_num(p.get("pieces_per_box"))
        plastic_code = sql_quote(p.get("primary_plastic_code"))
        plastic_spec = sql_quote(p.get("primary_plastic_spec"))
        status = sql_quote(p.get("product_status", "ACTIVE"))
        notes = sql_quote(p.get("notes"))

        stmt = (
            f"INSERT INTO products (product_code, company_id, product_name, product_name_internal, pocket_count, pieces_per_box, primary_plastic_code, primary_plastic_spec, product_status, notes)\n"
            f"VALUES ({p_code}, {c_id}, {p_name}, {p_name_int}, {pocket}, {pack_qty}, {plastic_code}, {plastic_spec}, {status}, {notes})\n"
            f"ON CONFLICT (product_code) DO UPDATE SET\n"
            f"  company_id = EXCLUDED.company_id,\n"
            f"  product_name = EXCLUDED.product_name,\n"
            f"  product_name_internal = EXCLUDED.product_name_internal,\n"
            f"  pocket_count = EXCLUDED.pocket_count,\n"
            f"  pieces_per_box = EXCLUDED.pieces_per_box,\n"
            f"  primary_plastic_code = EXCLUDED.primary_plastic_code,\n"
            f"  primary_plastic_spec = EXCLUDED.primary_plastic_spec,\n"
            f"  product_status = EXCLUDED.product_status,\n"
            f"  notes = EXCLUDED.notes;\n"
        )
        lines.append(stmt)

    lines.append("COMMIT;\n")

    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))

    print(f"Successfully generated SQL migration script -> {OUTPUT_SQL}")
    print(f"Total Product Insert Statements: {len(products)}")

if __name__ == '__main__':
    generate_sql()
