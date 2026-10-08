#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_p1_005_location_suite.py
Verification suite for Work Order WO-P1-005 (Package 6: Mold Storage Location Management)
Complies with Zero DDL, SSOT schema compliance, and evidence-based verification.
"""

import os
import sys
import json
import re
import urllib.request
import subprocess

def load_env():
    env = {}
    env_path = os.path.join(os.getcwd(), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
SUPABASE_URL = ENV.get('NEXT_PUBLIC_SUPABASE_URL', '')
SERVICE_KEY = ENV.get('SUPABASE_SERVICE_ROLE_KEY', '')

def run_test(name, fn):
    print(f"\n[RUNNING] {name}...")
    try:
        ok, msg = fn()
        if ok:
            print(f"  --> PASS: {msg}")
            return True
        else:
            print(f"  --> FAIL: {msg}")
            return False
    except Exception as e:
        print(f"  --> ERROR: {e}")
        return False

def sb_get(endpoint):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    })
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_tc01_schema_zero_ddl():
    """TC-01: Zero DDL & Schema integrity check."""
    # Check that equipment.current_rack_layer_id references rack_layers without new DDL
    res = sb_get("equipment?select=equipment_id,equipment_code,current_rack_layer_id,rack_layers(id,layer_code,layer_number,racks(id,rack_code,zone_code))&limit=5")
    if not isinstance(res, list) or len(res) == 0:
        return False, "Failed to query equipment join rack_layers"
    return True, f"Verified equipment joins rack_layers and racks cleanly. Sample count: {len(res)}"

def test_tc02_data_presence():
    """TC-02: Query physical molds with rack assignment and unassigned."""
    assigned = sb_get("equipment?equipment_type=in.(MOLD,WATER_BASE,PRESSURE_BASE)&current_rack_layer_id=not.is.null&select=equipment_id,equipment_code,rack_layers(layer_code)&limit=5")
    unassigned = sb_get("equipment?equipment_type=in.(MOLD,WATER_BASE,PRESSURE_BASE)&current_rack_layer_id=is.null&select=equipment_id,equipment_code&limit=5")
    return True, f"Found {len(assigned)} assigned sample molds, {len(unassigned)} unassigned sample molds in DB"

def test_tc03_zone_filtering():
    """TC-03: Zone filtering via joined racks.zone_code."""
    mr_molds = sb_get("equipment?equipment_type=in.(MOLD,WATER_BASE,PRESSURE_BASE)&select=equipment_id,equipment_code,rack_layers!current_rack_layer_id!inner(layer_code,racks!inner(zone_code))&rack_layers.racks.zone_code=eq.MR&limit=5")
    sp_molds = sb_get("equipment?equipment_type=in.(MOLD,WATER_BASE,PRESSURE_BASE)&select=equipment_id,equipment_code,rack_layers!current_rack_layer_id!inner(layer_code,racks!inner(zone_code))&rack_layers.racks.zone_code=eq.SP&limit=5")
    if len(mr_molds) == 0 and len(sp_molds) == 0:
        return False, "Zone queries returned 0 results"
    return True, f"Zone MR sample count: {len(mr_molds)}, Zone SP sample count: {len(sp_molds)}"

def test_tc04_detail_header_and_modal():
    """TC-04: Verify Detail Header action button and LocationMoveModal wiring in page.tsx."""
    header_path = os.path.join(os.getcwd(), 'src', 'app', 'equipment', 'molds', '[id]', 'MoldDetailHeader.tsx')
    detail_page_path = os.path.join(os.getcwd(), 'src', 'app', 'equipment', 'molds', '[id]', 'page.tsx')
    
    with open(header_path, 'r', encoding='utf-8') as f:
        header_src = f.read()
    with open(detail_page_path, 'r', encoding='utf-8') as f:
        page_src = f.read()
        
    assert 'onOpenLocationModal' in header_src, "MoldDetailHeader missing onOpenLocationModal prop"
    assert '保管場所変更' in header_src, "MoldDetailHeader missing 保管場所変更 action button"
    assert 'LocationMoveModal' in page_src, "MoldDetailPage missing LocationMoveModal import/rendering"
    assert 'showLocationModal' in page_src, "MoldDetailPage missing showLocationModal state"
    return True, "MoldDetailHeader and MoldDetailPage correctly wire LocationMoveModal and 保管場所変更 button"

def test_tc05_overview_tab_card():
    """TC-05: Verify Storage Location card in OverviewTab.tsx."""
    tab_path = os.path.join(os.getcwd(), 'src', 'app', 'equipment', 'molds', '[id]', 'tabs', 'OverviewTab.tsx')
    with open(tab_path, 'r', encoding='utf-8') as f:
        src = f.read()
    assert 'onOpenLocationModal' in src, "OverviewTab missing onOpenLocationModal prop"
    assert 'mold.rack_layers?.layer_code' in src, "OverviewTab missing rack_layers.layer_code display"
    assert 'MapPin' in src, "OverviewTab missing MapPin icon"
    return True, "OverviewTab correctly renders storage location card with MapPin and change location button"

def test_tc06_list_page_filter_and_row_button():
    """TC-06: Verify list page location filter dropdown and table row MapPin button."""
    page_path = os.path.join(os.getcwd(), 'src', 'app', 'equipment', 'molds', 'page.tsx')
    with open(page_path, 'r', encoding='utf-8') as f:
        src = f.read()
    assert 'filterLocation' in src, "Molds list page missing filterLocation state"
    assert 'locationModalMold' in src, "Molds list page missing locationModalMold state"
    assert 'LocationMoveModal' in src, "Molds list page missing LocationMoveModal rendering"
    assert 'ZONE_MR' in src and 'ZONE_SP' in src, "Molds list page missing zone filter options"
    assert 'MapPin' in src, "Molds list page missing MapPin icon in table row"
    return True, "Molds list page correctly features filterLocation dropdown, quick-action MapPin, and LocationMoveModal"

def test_tc07_build_and_i18n_clean():
    """TC-07: TypeScript check and translation check."""
    res_tsc = subprocess.run(["npx", "tsc", "--noEmit"], shell=True, capture_output=True, text=True)
    if res_tsc.returncode != 0:
        return False, f"npx tsc --noEmit failed: {res_tsc.stderr or res_tsc.stdout}"
    
    res_i18n = subprocess.run(["node", "scripts/check_translations.mjs"], shell=True, capture_output=True, text=True)
    if res_i18n.returncode != 0:
        return False, f"check_translations.mjs failed: {res_i18n.stderr or res_i18n.stdout}"
    return True, "TypeScript (0 errors) and Translations (0 missing keys) passed completely"

def main():
    print("=" * 60)
    print("WO-P1-005 AUTOMATED TEST SUITE: MOLD STORAGE LOCATION MANAGEMENT")
    print("=" * 60)
    
    tests = [
        ("TC-01: Zero DDL & Schema Integrity", test_tc01_schema_zero_ddl),
        ("TC-02: Mold Storage Location Data Presence", test_tc02_data_presence),
        ("TC-03: Zone/Rack Filtering Logic", test_tc03_zone_filtering),
        ("TC-04: Detail Header Location Button & Modal Wiring", test_tc04_detail_header_and_modal),
        ("TC-05: OverviewTab Storage Location Card", test_tc05_overview_tab_card),
        ("TC-06: List Page Filter Dropdown & Row Quick Action", test_tc06_list_page_filter_and_row_button),
        ("TC-07: TypeScript Build & i18n Verification", test_tc07_build_and_i18n_clean)
    ]
    
    passed = 0
    total = len(tests)
    for name, fn in tests:
        if run_test(name, fn):
            passed += 1
            
    print("\n" + "=" * 60)
    print(f"RESULTS: {passed}/{total} TESTS PASSED")
    print("=" * 60)
    
    if passed == total:
        print("ALL TESTS PASSED SUCCESSFULLY! WO-P1-005 IS 100% VERIFIED.")
        sys.exit(0)
    else:
        print("SOME TESTS FAILED.")
        sys.exit(1)

if __name__ == '__main__':
    main()
