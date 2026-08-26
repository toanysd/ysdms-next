# -*- coding: utf-8 -*-
"""
Script 1: parse_products.py
Parses sheet 'トレイデータ一覧表' from source_data/生産指示書/納入先一覧表_extracted.txt.
Applies Rules 1-3 to normalize products/trays and maps them to companies in Supabase DB.
Outputs: source_data/products_normalized.json
"""
import sys
import os
import json
import re
import unicodedata
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

EXTRACTED_FILE = r'source_data/生産指示書/納入先一覧表_extracted.txt'
OUTPUT_FILE = r'source_data/products_normalized.json'

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"

def clean_text(text):
    if not text or text in ['*', '-', '|', '#N/A', '#DIV/0!']:
        return None
    t = unicodedata.normalize('NFKC', str(text))
    t = t.replace('\u3000', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t if t else None

def parse_int(val):
    if not val:
        return None
    try:
        # Extract first number
        m = re.search(r'\d+', str(val))
        return int(m.group(0)) if m else None
    except:
        return None

def fetch_company_mappings():
    print("Fetching company_code -> company_id mappings from Supabase...")
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}'
    }
    code_to_id = {}
    for page in range(5):
        url = f"{SUPABASE_URL}/rest/v1/companies?select=company_id,company_code"
        req = urllib.request.Request(url, headers={**headers, 'Range': f'{page*1000}-{(page+1)*1000-1}'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for c in data:
                if c.get('company_code'):
                    code_to_id[c['company_code']] = c['company_id']
            if len(data) < 1000:
                break
    print(f"Loaded {len(code_to_id)} company mappings from DB.")
    return code_to_id

def parse_products():
    if not os.path.exists(EXTRACTED_FILE):
        print(f"Error: {EXTRACTED_FILE} not found!")
        sys.exit(1)

    code_to_id = fetch_company_mappings()
    default_company_id = code_to_id.get('YSD') or list(code_to_id.values())[0]

    with open(EXTRACTED_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = None
    for i, line in enumerate(lines):
        if 'Sheet: トレイデータ一覧表' in line:
            start_idx = i + 1
            break

    if start_idx is None:
        print("Error: Could not locate sheet 'トレイデータ一覧表' in input file!")
        sys.exit(1)

    products = []
    seen_codes = set()

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

        pn_raw = clean_text(parts[0])
        model_no_raw = clean_text(parts[1]) if len(parts) > 1 else None
        material_raw = clean_text(parts[2]) if len(parts) > 2 else None
        thickness_raw = clean_text(parts[3]) if len(parts) > 3 else None
        width_raw = clean_text(parts[4]) if len(parts) > 4 else None
        qty_raw = clean_text(parts[8]) if len(parts) > 8 else None
        notes_raw = clean_text(parts[9]) if len(parts) > 9 else None

        if not pn_raw or pn_raw in ['P/N', '品名']:
            continue

        product_code = pn_raw
        if product_code in seen_codes:
            continue
        seen_codes.add(product_code)

        # Determine product name internal & display name
        product_name_internal = model_no_raw or product_code
        product_name = notes_raw or product_name_internal

        # Resolve Company ID
        # Extract prefix from product_code (e.g. AMP-010 -> AMP, ADY-071 -> ADY, 1279508-1 -> AMP)
        prefix_match = re.match(r'^([A-Za-z0-9]+)[-_\s]', product_code)
        c_id = None
        c_code = None

        if prefix_match:
            prefix = prefix_match.group(1).upper()
            if prefix in code_to_id:
                c_id = code_to_id[prefix]
                c_code = prefix

        if not c_id:
            # Check if product code starts with known company code
            for code, cid in code_to_id.items():
                if len(code) >= 2 and product_code.upper().startswith(code):
                    c_id = cid
                    c_code = code
                    break

        # Fallback for numeric connector P/Ns (e.g., 1279508-1 -> AMP)
        if not c_id:
            if re.match(r'^\d{6,}', product_code) or product_code.startswith('1-') or product_code.startswith('2-') or product_code.startswith('3-'):
                c_id = code_to_id.get('AMP', default_company_id)
                c_code = 'AMP'
            elif product_code.startswith('025-') or product_code.startswith('9913-'):
                c_id = code_to_id.get('JAE', default_company_id)
                c_code = 'JAE'
            else:
                c_id = default_company_id
                c_code = 'YSD'

        # Parse specs
        pieces_per_box = parse_int(qty_raw)
        
        # Try parse cavity/pocket count from model_no or notes (e.g. (×12) or 8P or 10P)
        pocket_count = None
        pocket_match = re.search(r'[×x](\d+)|(\d+)[PＰ]|(\d+)面取', (model_no_raw or '') + ' ' + (notes_raw or ''))
        if pocket_match:
            pocket_count = int(pocket_match.group(1) or pocket_match.group(2) or pocket_match.group(3))

        spec_parts = []
        if material_raw:
            spec_parts.append(f"Material: {material_raw}")
        if thickness_raw:
            spec_parts.append(f"Thickness: {thickness_raw}mm")
        if width_raw:
            spec_parts.append(f"Width: {width_raw}mm")
        if pocket_count:
            spec_parts.append(f"Cavity: {pocket_count}")
        if pieces_per_box:
            spec_parts.append(f"PackQty: {pieces_per_box}")
        if notes_raw and notes_raw != product_name:
            spec_parts.append(f"Notes: {notes_raw}")

        spec_summary = " | ".join(spec_parts) if spec_parts else None

        entry = {
            "product_code": product_code,
            "company_id": c_id,
            "company_code": c_code,
            "product_name": product_name,
            "product_name_internal": product_name_internal,
            "pocket_count": pocket_count,
            "pieces_per_box": pieces_per_box,
            "primary_plastic_code": material_raw,
            "primary_plastic_spec": f"{thickness_raw}mm x {width_raw}mm" if (thickness_raw and width_raw) else (thickness_raw or width_raw),
            "product_status": "ACTIVE",
            "notes": spec_summary
        }

        products.append(entry)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Successfully parsed and normalized {len(products)} products -> {OUTPUT_FILE}")

if __name__ == '__main__':
    parse_products()
