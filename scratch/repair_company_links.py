#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script: repair_company_links.py
Description: Connects legacy CustomerIDs from Access CSV files to company_id UUIDs 
             in the Supabase database. Updates products, mold_masters, and design_revisions.
Usage: python scratch/repair_company_links.py [--dry-run]
"""

import os
import csv
import sys
import uuid
import argparse
from supabase import create_client

# Path Configuration
ENV_FILE = ".env.local"
CUSTOMERS_CSV = "source_data/csv-access-data/customers.csv"
TRAY_CSV = "source_data/csv-access-data/tray.csv"
MOLDDESIGN_CSV = "source_data/csv-access-data/molddesign.csv"


def load_env(env_path=ENV_FILE):
    """Loads required environment variables from .env.local."""
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip()
    return env_vars


def fetch_all_rows(client, table, columns):
    """Fetches all rows for specified columns from a table using range-based pagination."""
    rows = []
    page_size = 1000
    start = 0
    while True:
        end = start + page_size - 1
        res = client.table(table).select(columns).range(start, end).execute()
        if not res.data:
            break
        rows.extend(res.data)
        if len(res.data) < page_size:
            break
        start += page_size
    return rows


def sql_escape(text):
    """Escapes single quotes for raw SQL safety."""
    if text is None:
        return "NULL"
    return "'" + str(text).replace("'", "''") + "'"


def main():
    parser = argparse.ArgumentParser(description="Repair company links in Supabase based on Access CSV files.")
    parser.add_argument("--dry-run", action="store_true", help="Print updates and mismatch statistics without writing to database.")
    args = parser.parse_args()
    dry_run = args.dry_run

    print("=== STARTING COMPANY LINK REPAIR PROCESS ===")
    if dry_run:
        print("[DRY-RUN MODE] No database writes or updates will be executed.")

    # 1. Initialize Supabase configurations
    try:
        env = load_env()
        supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
        service_key = env.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not service_key:
            raise ValueError("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
            
        supabase = create_client(supabase_url, service_key)
        print(f"Connected to Supabase: {supabase_url}")
    except Exception as e:
        print(f"Configuration error: {e}")
        sys.exit(1)

    # 2. Parse customers.csv to build CustomerID -> CustomerShortName mapping
    print(f"Parsing {CUSTOMERS_CSV}...")
    customer_map = {}  # CustomerID -> CustomerShortName
    if not os.path.exists(CUSTOMERS_CSV):
        print(f"Error: File not found: {CUSTOMERS_CSV}")
        sys.exit(1)
        
    with open(CUSTOMERS_CSV, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cust_id = row.get('CustomerID')
            short_name = row.get('CustomerShortName')
            if cust_id and short_name:
                cust_id = cust_id.strip()
                short_name = short_name.strip()
                if cust_id and short_name:
                    customer_map[cust_id] = short_name
                
    print(f"Loaded {len(customer_map)} customer mappings from CSV.")

    # 3. Parse tray.csv to build TrayID -> CustomerID mapping
    print(f"Parsing {TRAY_CSV}...")
    tray_customer_map = {}  # TrayID -> CustomerID
    if not os.path.exists(TRAY_CSV):
        print(f"Error: File not found: {TRAY_CSV}")
        sys.exit(1)
        
    with open(TRAY_CSV, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            tray_id = row.get('TrayID')
            cust_id = row.get('CustomerID')
            if tray_id and cust_id:
                tray_id = tray_id.strip()
                cust_id = cust_id.strip()
                if tray_id and cust_id:
                    tray_customer_map[tray_id] = cust_id

    print(f"Loaded {len(tray_customer_map)} tray mappings from CSV.")

    # 4. Parse molddesign.csv to build MoldDesignID -> CustomerID mapping (with fallback)
    print(f"Parsing {MOLDDESIGN_CSV}...")
    mold_design_customer_map = {}  # MoldDesignID -> CustomerID
    if not os.path.exists(MOLDDESIGN_CSV):
        print(f"Error: File not found: {MOLDDESIGN_CSV}")
        sys.exit(1)
        
    with open(MOLDDESIGN_CSV, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for row in reader:
            mold_design_id = row.get('MoldDesignID')
            cust_id = row.get('CustomerID')
            tray_id = row.get('TrayID')
            if mold_design_id:
                mold_design_id = mold_design_id.strip()
                if not mold_design_id or mold_design_id.lower() == 'none':
                    continue
                
                final_cust_id = None
                if cust_id and cust_id.strip():
                    final_cust_id = cust_id.strip()
                elif tray_id and tray_id.strip():
                    # Fallback: look up TrayID in tray.csv
                    final_cust_id = tray_customer_map.get(tray_id.strip())
                
                if final_cust_id:
                    mold_design_customer_map[mold_design_id] = final_cust_id

    print(f"Loaded {len(mold_design_customer_map)} mold design mappings from CSV.")

    # 5. Fetch existing companies from database
    print("Fetching existing companies from database...")
    companies = fetch_all_rows(supabase, "companies", "company_id, company_code")
    company_uuid_map = {item['company_code'].strip(): item['company_id'] for item in companies if item.get('company_code')}
    print(f"Loaded {len(company_uuid_map)} companies from database.")

    # 6. Check for missing companies
    missing_companies = []
    for cust_id, short_name in customer_map.items():
        if short_name not in company_uuid_map:
            # Generate a UUID for this company (used as mock in dry-run, actual if written)
            new_uuid = str(uuid.uuid4())
            missing_companies.append((cust_id, short_name, new_uuid))
            
    print(f"Identified {len(missing_companies)} missing companies.")

    # 7. Insert missing companies
    if missing_companies:
        if dry_run:
            print(f"[Dry Run] Would insert {len(missing_companies)} missing companies:")
            for cust_id, short_name, new_uuid in missing_companies[:10]:
                print(f"  - code={short_name}, name={short_name}, legacy_id=CUST-{cust_id}, uuid={new_uuid}")
            if len(missing_companies) > 10:
                print(f"  ... and {len(missing_companies) - 10} more")
            
            # Map mock UUIDs so we can run downstream dry-run simulation
            for _, short_name, new_uuid in missing_companies:
                company_uuid_map[short_name] = new_uuid
        else:
            print(f"Inserting {len(missing_companies)} missing companies using Supabase client...")
            inserts = []
            for cust_id, short_name, new_uuid in missing_companies:
                inserts.append({
                    "company_id": new_uuid,
                    "company_code": short_name,
                    "company_name": short_name,
                    "company_type": ["CUSTOMER"],
                    "legacy_id": f"CUST-{cust_id}",
                    "is_active": True
                })
            
            try:
                res = supabase.table("companies").insert(inserts).execute()
                for inserted in res.data:
                    company_uuid_map[inserted["company_code"].strip()] = inserted["company_id"]
                print(f"Successfully inserted {len(res.data)} companies.")
            except Exception as e:
                print(f"Error inserting companies: {e}")
                sys.exit(1)
    else:
        print("No missing companies to insert.")

    # 8. Retrieve products and identify mismatches
    print("Fetching products from database...")
    products = fetch_all_rows(supabase, "products", "product_id, company_id, legacy_id")
    print(f"Fetched {len(products)} products.")

    product_updates = []
    product_warning_count = 0
    for prod in products:
        legacy_id = prod.get("legacy_id")
        if not legacy_id:
            continue
        legacy_id = legacy_id.strip()
        
        cust_id = tray_customer_map.get(legacy_id)
        if not cust_id:
            product_warning_count += 1
            continue
        short_name = customer_map.get(cust_id)
        if not short_name:
            product_warning_count += 1
            continue
        expected_uuid = company_uuid_map.get(short_name)
        if expected_uuid:
            if prod.get("company_id") != expected_uuid:
                sql = f"UPDATE public.products SET company_id = '{expected_uuid}' WHERE product_id = '{prod['product_id']}';"
                product_updates.append(sql)

    print(f"Products: {len(product_updates)} mismatches found. (Unmapped legacy IDs: {product_warning_count})")

    # 9. Retrieve mold_masters and identify mismatches
    print("Fetching mold_masters from database...")
    mold_masters = fetch_all_rows(supabase, "mold_masters", "mold_master_id, company_id, legacy_id")
    print(f"Fetched {len(mold_masters)} mold masters.")

    mold_master_updates = []
    mm_warning_count = 0
    for mm in mold_masters:
        legacy_id = mm.get("legacy_id")
        if not legacy_id:
            continue
        legacy_id = legacy_id.strip()
        
        cust_id = mold_design_customer_map.get(legacy_id)
        if not cust_id:
            mm_warning_count += 1
            continue
        short_name = customer_map.get(cust_id)
        if not short_name:
            mm_warning_count += 1
            continue
        expected_uuid = company_uuid_map.get(short_name)
        if expected_uuid:
            if mm.get("company_id") != expected_uuid:
                sql = f"UPDATE public.mold_masters SET company_id = '{expected_uuid}' WHERE mold_master_id = '{mm['mold_master_id']}';"
                mold_master_updates.append(sql)

    print(f"Mold Masters: {len(mold_master_updates)} mismatches found. (Unmapped legacy IDs: {mm_warning_count})")

    # 10. Retrieve design_revisions and identify mismatches
    print("Fetching design_revisions from database...")
    design_revisions = fetch_all_rows(supabase, "design_revisions", "revision_id, company_id, legacy_id")
    print(f"Fetched {len(design_revisions)} design revisions.")

    design_revision_updates = []
    dr_warning_count = 0
    for dr in design_revisions:
        legacy_id = dr.get("legacy_id")
        if not legacy_id:
            continue
        legacy_id = legacy_id.strip()
        
        cust_id = mold_design_customer_map.get(legacy_id)
        if not cust_id:
            dr_warning_count += 1
            continue
        short_name = customer_map.get(cust_id)
        if not short_name:
            dr_warning_count += 1
            continue
        expected_uuid = company_uuid_map.get(short_name)
        if expected_uuid:
            if dr.get("company_id") != expected_uuid:
                sql = f"UPDATE public.design_revisions SET company_id = '{expected_uuid}' WHERE revision_id = '{dr['revision_id']}';"
                design_revision_updates.append(sql)

    print(f"Design Revisions: {len(design_revision_updates)} mismatches found. (Unmapped legacy IDs: {dr_warning_count})")

    # 11. Execute Batch SQL Updates
    all_updates = product_updates + mold_master_updates + design_revision_updates
    print(f"Total SQL update statements to execute: {len(all_updates)}")

    if all_updates:
        if dry_run:
            print(f"[Dry Run] Simulation complete. Would execute {len(all_updates)} updates in batches of 200.")
        else:
            print(f"Executing {len(all_updates)} updates in batches of 200 via exec_sql...")
            batch_size = 200
            success_count = 0
            for i in range(0, len(all_updates), batch_size):
                batch = all_updates[i:i+batch_size]
                batch_sql = "\n".join(batch)
                
                try:
                    res = supabase.rpc('exec_sql', {'query': batch_sql}).execute()
                    if res.data and res.data.get('status') == 'ok':
                        success_count += len(batch)
                        print(f"Executed updates: {success_count}/{len(all_updates)}")
                    else:
                        print(f"Warning: Unexpected response during batch starting at {i}: {res.data}")
                except Exception as e:
                    print(f"Error executing batch starting at index {i}: {e}")
                    print("Attempting to continue with next batches...")
            
            print(f"Completed link repair. Successfully executed {success_count} / {len(all_updates)} updates.")
    else:
        print("No mismatches found. Everything is already up to date.")

    print("=== PROCESS COMPLETED SUCCESSFULLY ===")


if __name__ == "__main__":
    main()
