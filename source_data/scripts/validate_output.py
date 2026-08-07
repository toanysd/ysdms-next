# -*- coding: utf-8 -*-
"""
Script 4: validate_output.py
Validates company_normalized.json, delivery_sites_normalized.json, and company_migration.sql.
Reports validation results and checks all quality constraints.
"""
import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

COMPANIES_JSON = r'source_data/company_normalized.json'
SITES_JSON = r'source_data/delivery_sites_normalized.json'
MIGRATION_SQL = r'source_data/company_migration.sql'

def validate():
    print("========================================================")
    print("         PHASE 1 DATA VALIDATION REPORT                ")
    print("========================================================")

    errors = []
    warnings = []

    # 1. Check file existence
    for filepath in [COMPANIES_JSON, SITES_JSON, MIGRATION_SQL]:
        if not os.path.exists(filepath):
            errors.append(f"Missing required output file: {filepath}")

    if errors:
        for err in errors:
            print(f"[FAIL] {err}")
        sys.exit(1)

    # 2. Validate Companies JSON
    with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    total_companies = len(companies)
    print(f"1. Companies Count: {total_companies} records (Required >= 795)")
    if total_companies < 795:
        errors.append(f"Company count ({total_companies}) is less than expected minimum of 795!")

    company_codes = set()
    null_name_count = 0
    halfwidth_kana_count = 0

    for idx, c in enumerate(companies):
        code = c.get('company_code')
        name = c.get('company_name_display') or c.get('company_name')

        if not code:
            errors.append(f"Company at index {idx} has empty company_code!")
        elif code in company_codes:
            errors.append(f"Duplicate company_code found: {code}")
        else:
            company_codes.add(code)

        if not name:
            null_name_count += 1
            errors.append(f"Company '{code}' has null/empty company_name!")

        # Check half-width katakana
        if name and re.search(r'[\uff66-\uff9f]', name):
            halfwidth_kana_count += 1

    if halfwidth_kana_count > 0:
        warnings.append(f"Found {halfwidth_kana_count} company names containing half-width katakana!")

    # 3. Validate Delivery Sites JSON
    with open(SITES_JSON, 'r', encoding='utf-8') as f:
        sites = json.load(f)

    total_sites = len(sites)
    print(f"2. Delivery Sites Count: {total_sites} records")

    unmapped_sites = 0
    site_codes = set()

    for idx, s in enumerate(sites):
        s_code = s.get('site_code')
        c_code = s.get('company_code')

        if not s_code:
            errors.append(f"Delivery site at index {idx} has empty site_code!")

        if c_code not in company_codes:
            unmapped_sites += 1
            warnings.append(f"Delivery site '{s_code}' references company_code '{c_code}' which is not in companies table!")

    # 4. Validate Migration SQL
    with open(MIGRATION_SQL, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    company_inserts = sql_content.count("INSERT INTO companies")
    site_inserts = sql_content.count("INSERT INTO delivery_sites")

    print(f"3. SQL Migration File Size: {os.path.getsize(MIGRATION_SQL):,} bytes")
    print(f"   - Company Insert Statements: {company_inserts}")
    print(f"   - Delivery Site Insert Statements: {site_inserts}")

    # Summary
    print("\n--------------------------------------------------------")
    print("                    VALIDATION SUMMARY                  ")
    print("--------------------------------------------------------")
    print(f"Company Code Uniqueness : {'PASS' if len(company_codes) == total_companies else 'FAIL'}")
    print(f"Null Name Check         : {'PASS' if null_name_count == 0 else 'FAIL'}")
    print(f"Half-width Katakana     : {'PASS' if halfwidth_kana_count == 0 else 'WARN (' + str(halfwidth_kana_count) + ')'}")
    print(f"Delivery Site Mapping   : {'PASS' if unmapped_sites == 0 else 'WARN (' + str(unmapped_sites) + ' unmapped)'}")
    print(f"SQL Generation Match    : {'PASS' if company_inserts == total_companies and site_inserts == total_sites else 'FAIL'}")

    if warnings:
        print(f"\n[WARNINGS ({len(warnings)})]:")
        for w in warnings[:10]:
            print(f" - {w}")
        if len(warnings) > 10:
            print(f" ... and {len(warnings) - 10} more warnings.")

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
