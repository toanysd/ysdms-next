# -*- coding: utf-8 -*-
"""
Script 3: validate_products.py
Validates products_normalized.json and products_migration.sql data quality.
Output validation report.
"""
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

PRODUCTS_JSON = r'source_data/products_normalized.json'
PRODUCTS_SQL = r'source_data/products_migration.sql'

def validate():
    print("========================================================")
    print("         PHASE 2 PRODUCTS DATA VALIDATION REPORT       ")
    print("========================================================")

    errors = []
    warnings = []

    # 1. Check file existence
    for filepath in [PRODUCTS_JSON, PRODUCTS_SQL]:
        if not os.path.exists(filepath):
            errors.append(f"Missing required file: {filepath}")

    if errors:
        for err in errors:
            print(f"[FAIL] {err}")
        sys.exit(1)

    # 2. Read products JSON
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)

    total_products = len(products)
    print(f"1. Products Count: {total_products} records (Required >= 3500)")
    if total_products < 3500:
        errors.append(f"Product count ({total_products}) is less than expected minimum of 3500!")

    seen_codes = set()
    missing_company_id = 0
    empty_code_count = 0
    mapped_company_counts = {}

    for idx, p in enumerate(products):
        p_code = p.get('product_code')
        c_id = p.get('company_id')
        c_code = p.get('company_code')

        if not p_code:
            empty_code_count += 1
            errors.append(f"Product at index {idx} has empty product_code!")
        elif p_code in seen_codes:
            errors.append(f"Duplicate product_code found: {p_code}")
        else:
            seen_codes.add(p_code)

        if not c_id:
            missing_company_id += 1
            errors.append(f"Product '{p_code}' missing company_id!")
        else:
            mapped_company_counts[c_code] = mapped_company_counts.get(c_code, 0) + 1

    # 3. Check SQL file
    sql_size = os.path.getsize(PRODUCTS_SQL)
    with open(PRODUCTS_SQL, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    sql_inserts = sql_content.count("INSERT INTO products")

    print(f"2. SQL Migration File Size: {sql_size:,} bytes")
    print(f"   - Product Insert Statements: {sql_inserts}")

    print("\nTop 10 Mapped Companies for Products:")
    sorted_companies = sorted(mapped_company_counts.items(), key=lambda x: -x[1])
    for code, count in sorted_companies[:10]:
        print(f"   - {code:10s}: {count} products")

    print("\n--------------------------------------------------------")
    print("                    VALIDATION SUMMARY                  ")
    print("--------------------------------------------------------")
    print(f"Product Count Minimum Check : {'PASS' if total_products >= 3500 else 'FAIL'}")
    print(f"Product Code Uniqueness     : {'PASS' if len(seen_codes) == total_products else 'FAIL'}")
    print(f"Company ID Mapping Check    : {'PASS' if missing_company_id == 0 else 'FAIL'}")
    print(f"SQL Generation Match        : {'PASS' if sql_inserts == total_products else 'FAIL'}")

    if errors:
        print(f"\n[ERRORS ({len(errors)})]:")
        for e in errors:
            print(f" - {e}")
        print("\n=== RESULT: VALIDATION FAILED ===")
        sys.exit(1)
    else:
        print("\n=== RESULT: VALIDATION PASSED SUCCESSFULLY ===")
        sys.exit(0)

if __name__ == '__main__':
    validate()
