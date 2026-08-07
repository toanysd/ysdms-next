# -*- coding: utf-8 -*-
"""
Script 4: import_phase2_rest.py
Upserts source_data/products_normalized.json directly into Supabase DB via REST API using SERVICE_ROLE_KEY.
"""
import sys
import os
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"

PRODUCTS_JSON = r"source_data/products_normalized.json"

def get_headers(extra=None):
    h = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    if extra:
        h.update(extra)
    return h

def import_products():
    if not os.path.exists(PRODUCTS_JSON):
        print(f"Error: {PRODUCTS_JSON} not found!")
        sys.exit(1)

    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)

    print(f"1. Upserting {len(products)} products to Supabase DB...")

    db_products = []
    for p in products:
        db_products.append({
            "product_code": p["product_code"],
            "company_id": p["company_id"],
            "product_name": p.get("product_name"),
            "product_name_internal": p.get("product_name_internal"),
            "pocket_count": p.get("pocket_count"),
            "pieces_per_box": p.get("pieces_per_box"),
            "primary_plastic_code": p.get("primary_plastic_code"),
            "primary_plastic_spec": p.get("primary_plastic_spec"),
            "product_status": p.get("product_status", "ACTIVE"),
            "notes": p.get("notes")
        })

    batch_size = 50
    inserted_batches = 0
    failed_batches = 0

    for i in range(0, len(db_products), batch_size):
        batch = db_products[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/products?on_conflict=product_code"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=get_headers({'Prefer': 'resolution=merge-duplicates'}), method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                inserted_batches += 1
        except Exception as e:
            failed_batches += 1
            print(f"Batch {i} error: {e}")

    print(f"Finished upserting: {inserted_batches} batches succeeded, {failed_batches} batches failed.")

    # Check total products count in Supabase DB
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/products?select=count", headers=get_headers({'Prefer': 'count=exact'}))
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        total_in_db = res[0]['count']

    print(f"\n=== PHASE 2 IMPORT COMPLETED SUCCESSFULLY ===")
    print(f"Total Products in Supabase DB: {total_in_db}")

    # Fetch sample records
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/products?select=product_code,product_name_internal,primary_plastic_code,primary_plastic_spec&limit=5", headers=get_headers())
    with urllib.request.urlopen(req) as resp:
        samples = json.loads(resp.read().decode('utf-8'))
        print("\nSample Imported Products:")
        for s in samples:
            print(f"  Code: {s['product_code']:15s} | Internal: {s.get('product_name_internal') or '':25s} | Mat: {s.get('primary_plastic_code') or '':10s} | Spec: {s.get('primary_plastic_spec') or ''}")

if __name__ == '__main__':
    import_products()
