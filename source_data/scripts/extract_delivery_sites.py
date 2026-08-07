# -*- coding: utf-8 -*-
"""
Script 2: extract_delivery_sites.py
Reads source_data/生産指示書/納入先一覧表_extracted.txt, parses the '納入先一覧表' sheet line by line,
applies Rule 6 to normalize delivery sites, and outputs source_data/delivery_sites_normalized.json.
"""
import sys
import os
import json
import re
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

INPUT_FILE = r'source_data/生産指示書/納入先一覧表_extracted.txt'
COMPANY_MASTER_FILE = r'source_data/company_master_data.json'
OUTPUT_FILE = r'source_data/delivery_sites_normalized.json'

def clean_text(text):
    if not text or text in ['*', '-', '|']:
        return None
    t = unicodedata.normalize('NFKC', text)
    t = t.replace('\u3000', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    t = t.rstrip('|').strip()
    return t if t else None

def extract_delivery_sites():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found!")
        sys.exit(1)

    valid_company_codes = set()
    if os.path.exists(COMPANY_MASTER_FILE):
        with open(COMPANY_MASTER_FILE, 'r', encoding='utf-8') as f:
            valid_company_codes = set(json.load(f).keys())

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = None
    for i, line in enumerate(lines):
        if 'Sheet: 納入先一覧表' in line:
            start_idx = i + 1  # Next line is header row
            break

    if start_idx is None:
        print("Error: Could not locate 'Sheet: 納入先一覧表' in input file!")
        sys.exit(1)

    site_records = []

    for i in range(start_idx + 1, len(lines)):
        line = lines[i].strip()
        if not line or line.startswith('--- Sheet'):
            break

        m = re.match(r'R\d+\|\s*(.+)', line)
        if not m:
            continue

        parts = [p.strip() for p in m.group(1).split('|')]
        if len(parts) < 2:
            continue

        site_code = parts[0]
        if not site_code or site_code in ['*', '-']:
            continue

        site_name = clean_text(parts[1])
        if not site_name:
            continue

        address = clean_text(parts[2]) if len(parts) > 2 else None
        requester = clean_text(parts[3]) if len(parts) > 3 else None
        contact = clean_text(parts[4]) if len(parts) > 4 else None
        tel = clean_text(parts[5]) if len(parts) > 5 else None
        fax = clean_text(parts[6]) if len(parts) > 6 else None

        # Determine base company code
        base_code = re.sub(r'\d+$', '', site_code).strip()
        if not base_code:
            base_code = site_code

        if base_code not in valid_company_codes and site_code in valid_company_codes:
            base_code = site_code

        site_entry = {
            "site_code": site_code,
            "company_code": base_code,
            "site_name": site_name,
            "site_address": address,
            "site_tel": tel,
            "site_fax": fax,
            "contact_person": contact,
            "requester_code": requester,
            "is_active": True
        }

        site_records.append(site_entry)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(site_records, f, ensure_ascii=False, indent=2)

    print(f"Successfully extracted {len(site_records)} delivery sites -> {OUTPUT_FILE}")

if __name__ == '__main__':
    extract_delivery_sites()
