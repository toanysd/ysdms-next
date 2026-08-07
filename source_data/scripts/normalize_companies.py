# -*- coding: utf-8 -*-
"""
Script 1: normalize_companies.py
Reads source_data/company_master_data.json and applies rules 1-5 to produce source_data/company_normalized.json
"""
import sys
import os
import json
import re
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

INPUT_FILE = r'source_data/company_master_data.json'
OUTPUT_FILE = r'source_data/company_normalized.json'

# Special company type mapping (Rule 5)
COMPANY_TYPES = {
    'AMP': ['CUSTOMER'],
    'HAE': ['CUSTOMER'],
    'NLC': ['CUSTOMER'],
    'SMK': ['CUSTOMER'],
    'YAE': ['CUSTOMER'],
    'NSK': ['OUTSOURCE'],
    'MRD': ['OUTSOURCE'],
    'YSD': ['MANUFACTURER'],
}

# Special order folder paths
ORDER_FOLDERS = {
    'AMP': r'\\SERVER\ysd-folder\新AMP注文書',
    'HAE': r'\\SERVER\ysd-folder\新HAE注文書',
    'NLC': r'\\SERVER\ysd-folder\新NLC注文書',
    'SMK': r'\\SERVER\ysd-folder\新SMK注文書',
    'YAE': r'\\SERVER\ysd-folder\新YAE注文書',
}

def clean_text(text):
    if not text:
        return ''
    # NFKC converts half-width katakana -> full-width, （株） -> (株), ㈱ -> (株), etc.
    t = unicodedata.normalize('NFKC', text)
    t = t.replace('\u3000', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    t = t.rstrip('|').strip()
    return t

def parse_company_name(raw_name):
    """
    Apply Rule 1 (Suffix), Rule 2 (Katakana), Rule 3 (Whitespace), Rule 4 (Site Note)
    Returns: (company_name_display, company_name_base, company_suffix, site_note)
    """
    clean = clean_text(raw_name)
    if not clean:
        return '', '', None, None

    # Check Suffix (Rule 1)
    suffix = None
    suffix_pos = None # 'prefix' or 'suffix'
    
    # Prefix check
    m_pre = re.match(r'^\((株|有|合|組|財|社|福)\)|^(株式会社|有限会社|合同会社|合資会社)', clean)
    if m_pre:
        suffix = m_pre.group(0)
        suffix_pos = 'prefix'
    else:
        # Suffix check
        m_post = re.search(r'\((株|有|合|组|財|社|福)\)$|(株式会社|有限会社|合同会社|合資会社)$', clean)
        if m_post:
            suffix = m_post.group(0)
            suffix_pos = 'suffix'

    # Check Site Note (Rule 4)
    site_note = None
    site_patterns = [
        r'\s+(本社|本社工場|第[一二三四五12345]工場|.*工場|.*営業所|.*事業所|.*支店|.*支社|.*センター|.*事務所)$'
    ]
    temp_clean = clean
    for pat in site_patterns:
        m_site = re.search(pat, temp_clean)
        if m_site:
            site_note = m_site.group(0).strip()
            temp_clean = temp_clean[:m_site.start()].strip()
            break

    # Calculate Base Name
    base_name = temp_clean
    if suffix:
        if suffix_pos == 'prefix' and base_name.startswith(suffix):
            base_name = base_name[len(suffix):].strip()
        elif suffix_pos == 'suffix' and base_name.endswith(suffix):
            base_name = base_name[:-len(suffix)].strip()

    display_name = clean

    return display_name, base_name, suffix, site_note

def normalize():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found!")
        sys.exit(1)

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    normalized_list = []

    for code, info in master_data.items():
        raw_name = info.get('company_name_ja', info.get('company_name', ''))
        display_name, base_name, suffix, site_note = parse_company_name(raw_name)

        # Addresses, Tel, Fax cleanup
        addrs = [clean_text(a) for a in info.get('addresses', []) if clean_text(a) and clean_text(a) != '*']
        tels = [clean_text(t) for t in info.get('tel', []) if clean_text(t) and clean_text(t) != '*']
        faxes = [clean_text(f) for f in info.get('fax', []) if clean_text(f) and clean_text(f) != '*' and clean_text(f) != '|']

        main_addr = addrs[0] if addrs else None
        main_tel = tels[0] if tels else None
        main_fax = faxes[0] if faxes else None

        # Company type (Rule 5)
        c_type = COMPANY_TYPES.get(code, ['CUSTOMER'])

        # Folder path
        folder_path = ORDER_FOLDERS.get(code, info.get('folder_path', None))

        entry = {
            "company_code": code,
            "company_name": base_name if base_name else display_name,
            "company_suffix": suffix,
            "company_name_display": display_name,
            "company_name_romaji": info.get('company_name_en', None),
            "company_type": c_type,
            "parent_company_code": None,
            "is_active": True,
            "tel": main_tel,
            "fax": main_fax,
            "address": main_addr,
            "order_folder_path": folder_path,
            "site_note": site_note,
            "notes": info.get('notes', None)
        }
        normalized_list.append(entry)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(normalized_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully normalized {len(normalized_list)} companies -> {OUTPUT_FILE}")

if __name__ == '__main__':
    normalize()
