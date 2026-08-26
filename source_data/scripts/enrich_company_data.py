# -*- coding: utf-8 -*-
"""
Enrich company master data using:
1. \\SERVER\\ysd-folder\\YSD07バックアップ\\desktop\\資料\\得意先一覧表(20130513).xls (Official Ledger)
2. \\SERVER\\ysd-folder\\YSD07バックアップ\\desktop\\諸 文書\\得意先住所録.xls
3. Server order master files (HAE, YAE, NLC, JAE, AMP, SMK)
Output: source_data/company_normalized.json (Enriched) and Supabase DB Upsert
"""
import sys
import os
import xlrd
import json
import re
import unicodedata
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

LEDGER_FILE = r'\\SERVER\ysd-folder\YSD07バックアップ\desktop\資料\得意先一覧表(20130513).xls'
ADDRESS_BOOK_FILE = r'\\SERVER\ysd-folder\YSD07バックアップ\desktop\諸 文書\得意先住所録.xls'
COMPANIES_JSON = r'source_data/company_normalized.json'
SITES_JSON = r'source_data/delivery_sites_normalized.json'

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Hardcoded master fixes for major corporate groups (JAE, AMP, SMK, etc.)
MAJOR_ENRICHMENTS = {
    'JAE': {
        'company_name_display': '日本航空電子工業株式会社',
        'company_name': '日本航空電子工業',
        'company_suffix': '株式会社',
        'company_name_romaji': 'Japan Aviation Electronics Industry, Limited',
        'address': '東京都昭島市武蔵野3-1-1',
        'tel': '044-900-5035',
        'fax': '042-549-9111',
        'company_type': ['CUSTOMER'],
        'notes': 'HQ / Akishima Plant. Parent of HAE, YAE, NLC.'
    },
    'HAE': {
        'company_name_display': '弘前航空電子株式会社',
        'company_name': '弘前航空電子',
        'company_suffix': '株式会社',
        'company_name_romaji': 'Hirosaki JAE Ltd.',
        'address': '青森県弘前市清野袋5-5-1 (〒036-8666)',
        'tel': '0172-68-5658',
        'fax': '0172-39-1496',
        'company_type': ['CUSTOMER'],
        'parent_company_code': 'JAE',
        'order_folder_path': r'\\SERVER\ysd-folder\新HAE注文書',
        'notes': 'JAE subsidiary in Hirosaki, Aomori.'
    },
    'YAE': {
        'company_name_display': '山形航空電子株式会社',
        'company_name': '山形航空電子',
        'company_suffix': '株式会社',
        'company_name_romaji': 'Yamagata JAE Ltd.',
        'address': '山形県山形市大字漆山1020-1 (〒990-8515)',
        'tel': '023-686-2111',
        'fax': '023-686-2119',
        'company_type': ['CUSTOMER'],
        'parent_company_code': 'JAE',
        'order_folder_path': r'\\SERVER\ysd-folder\新YAE注文書',
        'notes': 'JAE subsidiary in Yamagata.'
    },
    'NLC': {
        'company_name_display': 'ニッコー・ロジスティクス株式会社',
        'company_name': 'ニッコー・ロジスティクス',
        'company_suffix': '株式会社',
        'company_name_romaji': 'Nikko Logistics Co., Ltd.',
        'address': '東京都町田市野津田町103-1 / 東京都昭島市武蔵野3-1-1',
        'tel': '042-549-9300',
        'fax': '042-549-9301',
        'company_type': ['CUSTOMER'],
        'parent_company_code': 'JAE',
        'order_folder_path': r'\\SERVER\ysd-folder\新NLC注文書',
        'notes': 'Logistics subsidiary for JAE Group.'
    },
    'AMP': {
        'company_name_display': 'タイコ エレクトロニクス ジャパン合同会社',
        'company_name': 'タイコ エレクトロニクス ジャパン',
        'company_suffix': '合同会社',
        'company_name_romaji': 'TE Connectivity Japan G.K.',
        'address': '神奈川県川崎市高津区久本3-5-8 (〒213-0011)',
        'tel': '044-844-8111',
        'fax': '044-844-8112',
        'company_type': ['CUSTOMER'],
        'order_folder_path': r'\\SERVER\ysd-folder\新AMP注文書',
        'notes': 'Major customer. TE Connectivity Japan.'
    },
    'SMK': {
        'company_name_display': 'SMK株式会社',
        'company_name': 'SMK',
        'company_suffix': '株式会社',
        'company_name_romaji': 'SMK Corporation',
        'address': '東京都品川区戸越6-5-5 (〒142-8511)',
        'tel': '03-3785-1111',
        'fax': '03-3785-1869',
        'company_type': ['CUSTOMER'],
        'order_folder_path': r'\\SERVER\ysd-folder\新SMK注文書',
        'notes': 'Major customer. SMK HQ.'
    }
}

def clean_text(val):
    if not val or val in ['*', '-', '|']:
        return None
    t = unicodedata.normalize('NFKC', str(val))
    t = t.replace('\u3000', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t if t else None

def enrich():
    print("=== ENRICHING COMPANY MASTER DATA ===")

    # 1. Parse Customer Ledger
    ledger_data = {}
    if os.path.exists(LEDGER_FILE):
        try:
            wb = xlrd.open_workbook(LEDGER_FILE)
            ws = wb.sheet_by_name('得意先台帳')
            for r in range(1, ws.nrows):
                code_raw = str(ws.cell_value(r, 0)).strip()
                name1 = clean_text(ws.cell_value(r, 1))
                name2 = clean_text(ws.cell_value(r, 2))
                zipcode = clean_text(ws.cell_value(r, 4))
                addr1 = clean_text(ws.cell_value(r, 5))
                addr2 = clean_text(ws.cell_value(r, 6))
                tel = clean_text(ws.cell_value(r, 7))
                fax = clean_text(ws.cell_value(r, 8))
                contact = clean_text(ws.cell_value(r, 9))
                dept = clean_text(ws.cell_value(r, 11))

                if not code_raw:
                    continue

                if name1:
                    name1 = re.sub(r'\s+\d+$', '', name1).strip()
                    name1 = re.sub(r'\*\*\*.*$', '', name1).strip()

                base_code = re.sub(r'\d+$', '', code_raw).strip()
                if not base_code:
                    base_code = code_raw

                full_addr = ' '.join([x for x in [zipcode, addr1, addr2] if x])
                full_name = ' '.join([x for x in [name1, name2] if x])

                if base_code not in ledger_data:
                    ledger_data[base_code] = {
                        'full_name': full_name,
                        'address': full_addr,
                        'tel': tel,
                        'fax': fax,
                        'contact': contact,
                        'dept': dept
                    }
            print(f"Loaded {len(ledger_data)} companies from Official Customer Ledger.")
        except Exception as e:
            print(f"Error loading ledger: {e}")

    # 2. Parse Address Book
    address_book = {}
    if os.path.exists(ADDRESS_BOOK_FILE):
        try:
            wb = xlrd.open_workbook(ADDRESS_BOOK_FILE)
            ws = wb.sheet_by_index(0)
            for r in range(1, ws.nrows):
                code_raw = clean_text(ws.cell_value(r, 0))
                name = clean_text(ws.cell_value(r, 1))
                zipcode = clean_text(ws.cell_value(r, 3))
                addr = clean_text(ws.cell_value(r, 4))
                tel = clean_text(ws.cell_value(r, 6))
                fax = clean_text(ws.cell_value(r, 7))

                if not code_raw:
                    continue

                base_code = re.sub(r'\d+$', '', code_raw).strip()
                full_addr = ' '.join([x for x in [zipcode, addr] if x])

                if base_code not in address_book:
                    address_book[base_code] = {
                        'name': name,
                        'address': full_addr,
                        'tel': tel,
                        'fax': fax
                    }
            print(f"Loaded {len(address_book)} companies from Address Book.")
        except Exception as e:
            print(f"Error loading address book: {e}")

    # 3. Read current normalized companies
    with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    enriched_count = 0

    for c in companies:
        code = c['company_code']

        # Apply Major Enrichments first
        if code in MAJOR_ENRICHMENTS:
            c.update(MAJOR_ENRICHMENTS[code])
            enriched_count += 1
            continue

        # Merge from Ledger
        if code in ledger_data:
            leg = ledger_data[code]
            if leg['full_name'] and (c['company_name_display'] == code or not c.get('company_name_display')):
                c['company_name_display'] = leg['full_name']
            if leg['address'] and not c.get('address'):
                c['address'] = leg['address']
            if leg['tel'] and not c.get('tel'):
                c['tel'] = leg['tel']
            if leg['fax'] and not c.get('fax'):
                c['fax'] = leg['fax']
            enriched_count += 1

        # Merge from Address Book
        if code in address_book:
            ab = address_book[code]
            if ab['address'] and not c.get('address'):
                c['address'] = ab['address']
            if ab['tel'] and not c.get('tel'):
                c['tel'] = ab['tel']
            if ab['fax'] and not c.get('fax'):
                c['fax'] = ab['fax']

    # Save enriched companies
    with open(COMPANIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(companies, f, ensure_ascii=False, indent=2)

    print(f"Enriched {enriched_count} companies with full addresses, TEL, FAX, and Japanese legal names.")

    # 4. Upsert to Supabase REST API
    print("Upserting enriched data to Supabase...")
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }

    db_companies = []
    for c in companies:
        db_companies.append({
            "company_code": c["company_code"],
            "company_name": c.get("company_name_display") or c.get("company_name"),
            "company_name_romaji": c.get("company_name_romaji"),
            "company_type": c.get("company_type", ["CUSTOMER"]),
            "is_active": c.get("is_active", True),
            "tel": c.get("tel"),
            "fax": c.get("fax"),
            "address": c.get("address"),
            "order_folder_path": c.get("order_folder_path"),
            "notes": c.get("notes")
        })

    batch_size = 50
    for i in range(0, len(db_companies), batch_size):
        batch = db_companies[i:i+batch_size]
        url = f"{SUPABASE_URL}/rest/v1/companies?on_conflict=company_code"
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(req) as resp:
            pass

    print("\n=== SUPABASE ENRICHMENT COMPLETED SUCCESSFULLY ===")

    # Verify key companies in Supabase DB
    url = f"{SUPABASE_URL}/rest/v1/companies?select=company_code,company_name,tel,address&company_code=in.(JAE,HAE,YAE,NLC,AMP,SMK,ADV,NSK)"
    req = urllib.request.Request(url, headers={'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}'})
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        print("Updated Key Companies in DB:")
        for r in rows:
            print(f"  Code: {r['company_code']:6s} | Name: {r['company_name']:35s} | Tel: {r.get('tel') or '':15s} | Addr: {r.get('address') or ''}")

if __name__ == '__main__':
    enrich()

