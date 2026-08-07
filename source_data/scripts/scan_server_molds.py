# -*- coding: utf-8 -*-
"""
Step 3.1: scan_server_molds.py
Scans CAD directories on Server:
- \\SERVER\ysd-cad\金型データー\加工済み\ (3,560+ processed mold directories)
- \\SERVER\ysd-cad\見積案件\ (1,742 quotation project directories)
Extracts mold codes (e.g. 912XXX-Y, SMK-XXX, AMP-XXX), tray names, dimensions, CAD paths.
Output: source_data/mold_server_catalog.json
"""
import sys
import os
import json
import re
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

SERVER_MOLDS_DIR = r'\\SERVER\ysd-cad\金型データー\加工済み'
SERVER_QUOTES_DIR = r'\\SERVER\ysd-cad\見積案件'
OUTPUT_CATALOG = r'source_data/mold_server_catalog.json'

def clean_text(t):
    if not t:
        return ''
    t = unicodedata.normalize('NFKC', str(t))
    t = t.replace('\u3000', ' ').strip()
    return re.sub(r'\s+', ' ', t)

def scan_cad_server():
    print("=== STEP 3.1: SCANNING SERVER CAD DIRECTORIES ===")

    server_molds = []

    # 1. Scan 加工済み mold folders
    if os.path.exists(SERVER_MOLDS_DIR):
        print(f"Scanning {SERVER_MOLDS_DIR}...")
        try:
            entries = os.listdir(SERVER_MOLDS_DIR)
            print(f"Found {len(entries)} entries in processed molds directory.")
            for name in entries:
                full_path = os.path.join(SERVER_MOLDS_DIR, name)
                if not os.path.isdir(full_path):
                    continue

                norm_name = clean_text(name)
                # Try extract mold code patterns e.g. 912127-3, 912020-1, SMK-226, ADY-071
                m_code = None
                code_match = re.search(r'(912\d{3}[-\s]?\d+|[A-Za-z0-9]{2,6}[-\s]\d{3}[A-Za-z0-9\-]*)', norm_name)
                if code_match:
                    m_code = code_match.group(1).replace(' ', '')

                # Try extract dimensions e.g. 470x300 or 355x240
                dim_match = re.search(r'(\d{3}\s*[x×*]\s*\d{3})', norm_name, re.IGNORECASE)
                dim_str = dim_match.group(1).replace(' ', '') if dim_match else None

                server_molds.append({
                    "raw_folder_name": name,
                    "clean_folder_name": norm_name,
                    "extracted_code": m_code,
                    "extracted_dim": dim_str,
                    "cad_folder_path": full_path,
                    "source": "processed_molds"
                })
        except Exception as e:
            print(f"Error scanning processed molds: {e}")
    else:
        print(f"Warning: {SERVER_MOLDS_DIR} not found!")

    # 2. Scan 見積案件 quotation folders
    if os.path.exists(SERVER_QUOTES_DIR):
        print(f"\nScanning {SERVER_QUOTES_DIR}...")
        try:
            entries = os.listdir(SERVER_QUOTES_DIR)
            print(f"Found {len(entries)} quotation project entries.")
            for name in entries:
                full_path = os.path.join(SERVER_QUOTES_DIR, name)
                if not os.path.isdir(full_path):
                    continue

                norm_name = clean_text(name)
                code_match = re.search(r'(912\d{3}[-\s]?\d+|[A-Za-z0-9]{2,6}[-\s]\d{3}[A-Za-z0-9\-]*)', norm_name)
                m_code = code_match.group(1).replace(' ', '') if code_match else None

                server_molds.append({
                    "raw_folder_name": name,
                    "clean_folder_name": norm_name,
                    "extracted_code": m_code,
                    "cad_folder_path": full_path,
                    "source": "quotation_projects"
                })
        except Exception as e:
            print(f"Error scanning quotation projects: {e}")

    with open(OUTPUT_CATALOG, 'w', encoding='utf-8') as f:
        json.dump(server_molds, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully cataloged {len(server_molds)} CAD folders from Server -> {OUTPUT_CATALOG}")

if __name__ == '__main__':
    scan_cad_server()
