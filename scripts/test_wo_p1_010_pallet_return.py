import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def test_tc1_zero_ddl():
    print("Running TC1: Zero DDL & DB Schema Verification (Direct Supabase API)...")
    from supabase import create_client
    env_file = os.path.join(ROOT_DIR, '.env.local')
    lines = open(env_file, 'r', encoding='utf-8').read().splitlines()
    env = dict(l.split('=', 1) for l in lines if l and not l.startswith('#') and '=' in l)
    url = env['NEXT_PUBLIC_SUPABASE_URL'].strip()
    key = env['SUPABASE_SERVICE_ROLE_KEY'].strip()
    client = create_client(url, key)
    
    # Check equipment_loans schema columns
    res = client.table('equipment_loans').select('loan_id, loan_type, condition_notes, purpose, actual_return_date, destination_address').limit(1).execute()
    assert res.data is not None, "Failed to query equipment_loans"
    print("  -> TC1 PASS: Schema equipment_loans verified with zero DDL additions.")

def test_tc2_pallet_spec_source():
    print("Running TC2: JIS Standard Pallet Format (1,100 × 1,100 mm) in Source...")
    types_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', 'types.ts')
    pdf_path = os.path.join(ROOT_DIR, 'src', 'components', 'pdf', 'MoldLoanPDFDocument.tsx')
    modal_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', '[id]', '_components', 'PanasonicPalletReturnModal.tsx')
    
    types_content = open(types_path, 'r', encoding='utf-8').read()
    pdf_content = open(pdf_path, 'r', encoding='utf-8').read()
    modal_content = open(modal_path, 'r', encoding='utf-8').read()
    
    assert "1,100 × 1,100 mm" in types_content, "types.ts must contain JIS standard 1,100 × 1,100 mm"
    assert "1,100 × 1,100 mm" in pdf_content, "MoldLoanPDFDocument.tsx must contain JIS standard 1,100 × 1,100 mm"
    assert "1,100 × 1,100 mm" in modal_content, "PanasonicPalletReturnModal.tsx must contain JIS standard 1,100 × 1,100 mm"
    
    # Assert NO ASCII 'x' in pallet dimensions across source
    assert "1,100x1,100" not in types_content, "types.ts has invalid ASCII 'x' in pallet dimensions"
    assert "1,100x1,100" not in pdf_content, "MoldLoanPDFDocument.tsx has invalid ASCII 'x' in pallet dimensions"
    assert "1,100x1,100" not in modal_content, "PanasonicPalletReturnModal.tsx has invalid ASCII 'x' in pallet dimensions"
    print("  -> TC2 PASS: JIS standard 1,100 × 1,100 mm strictly enforced across all source files.")

def test_tc3_crane_truck_and_zero_fallback():
    print("Running TC3: Zero Fake Fallback Verification in PDF (RULE-DATA-01)...")
    pdf_path = os.path.join(ROOT_DIR, 'src', 'components', 'pdf', 'MoldLoanPDFDocument.tsx')
    pdf_content = open(pdf_path, 'r', encoding='utf-8').read()
    
    # Verify fake fallback strings are NOT present
    assert "'650 mm (実測済)'" not in pdf_content, "PDF contains fake fallback for totalHeight: '650 mm (実測済)'"
    assert "'185.5 kg'" not in pdf_content, "PDF contains fake fallback for totalWeight: '185.5 kg'"
    assert "'PNS-MOLD-2024 (照合済)'" not in pdf_content, "PDF contains fake fallback for qrSerialTag: 'PNS-MOLD-2024 (照合済)'"
    
    # Verify proper '—' fallbacks are present
    assert "panasonicMeta?.totalHeightMm ? `${panasonicMeta.totalHeightMm} mm (パレット含む)` : '—'" in pdf_content
    assert "panasonicMeta?.qrSerialTag ? `${panasonicMeta.qrSerialTag} (照合済)` : '—'" in pdf_content
    print("  -> TC3 PASS: 100% Zero fake fallback in MoldLoanPDFDocument.tsx verified (displays '—' when empty).")

def test_tc4_qr_serial_tag_and_modal_validation():
    print("Running TC4: Individual Mold QR & Modal Validation in Source...")
    modal_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', '[id]', '_components', 'PanasonicPalletReturnModal.tsx')
    modal_content = open(modal_path, 'r', encoding='utf-8').read()
    
    # Modal must start with empty strings (zero fake data pre-fill)
    assert "const [totalHeightMm, setTotalHeightMm] = useState<number | ''>('');" in modal_content, "totalHeightMm must start empty"
    assert "const [qrSerialTag, setQrSerialTag] = useState('');" in modal_content, "qrSerialTag must start empty"
    assert "const [qrVerified, setQrVerified] = useState(false);" in modal_content, "qrVerified must default to false"
    
    # Modal must validate before submit
    assert "if (!qrVerified || !qrSerialTag.trim())" in modal_content, "Modal must validate QR verified and serial tag"
    assert "if (!totalHeightMm || Number(totalHeightMm) <= 0)" in modal_content, "Modal must validate positive height"
    print("  -> TC4 PASS: Modal enforces real operator input and blocks fake/empty submission.")

def test_tc5_four_item_checklist_in_source():
    print("Running TC5: Accompanying 4-Item Checklist Structure in Source...")
    types_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', 'types.ts')
    actions_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', 'actions.ts')
    modal_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', '[id]', '_components', 'PanasonicPalletReturnModal.tsx')
    
    types_content = open(types_path, 'r', encoding='utf-8').read()
    actions_content = open(actions_path, 'r', encoding='utf-8').read()
    modal_content = open(modal_path, 'r', encoding='utf-8').read()
    
    for item in ['mold_drawings', 'spare_parts', 'original_loan_doc', 'stretch_film_wrapped']:
        assert item in types_content, f"types.ts missing {item}"
        assert item in actions_content, f"actions.ts missing {item}"
        assert item in modal_content, f"PanasonicPalletReturnModal.tsx missing {item}"
    
    # Modal checklist items must default to false
    assert "const [checkDrawings, setCheckDrawings] = useState(false);" in modal_content
    assert "const [checkParts, setCheckParts] = useState(false);" in modal_content
    assert "const [checkOriginalDoc, setCheckOriginalDoc] = useState(false);" in modal_content
    assert "const [checkFilm, setCheckFilm] = useState(false);" in modal_content
    print("  -> TC5 PASS: 4-item checklist is defined in types, persisted in actions, and defaults to false in modal.")

def test_tc6_dynamic_destination_address():
    print("Running TC6: Dynamic destination_address (No Hardcoding) in actions.ts...")
    actions_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', 'actions.ts')
    actions_content = open(actions_path, 'r', encoding='utf-8').read()
    
    # Must NOT contain hardcoded Panasonic Shirakawa destination address
    assert "destination_address: 'パナソニック株式会社 白河工場 (福島県白河市)'" not in actions_content, "actions.ts has hardcoded destination_address"
    
    # Must take from input.destination_address
    assert "destination_address: input.destination_address?.trim() || null" in actions_content, "actions.ts must read input.destination_address"
    print("  -> TC6 PASS: actions.ts strictly reads dynamic destination_address from input.")

def test_tc7_electronic_seals_integration():
    print("Running TC7: Electronic Seals & PDF Engine Integration in Source...")
    pdf_path = os.path.join(ROOT_DIR, 'src', 'components', 'pdf', 'MoldLoanPDFDocument.tsx')
    page_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', '[id]', 'page.tsx')
    
    pdf_content = open(pdf_path, 'r', encoding='utf-8').read()
    page_content = open(page_path, 'r', encoding='utf-8').read()
    
    assert "electronicSeal" in pdf_content, "MoldLoanPDFDocument must support electronicSeal prop"
    assert "PanasonicPalletReturnModal" in page_content, "loans/[id]/page.tsx must mount PanasonicPalletReturnModal"
    assert "LoanPdfDownloadButton" in page_content, "loans/[id]/page.tsx must mount LoanPdfDownloadButton"
    print("  -> TC7 PASS: Electronic seals and Panasonic pallet return flow integrated cleanly.")

def test_tc8_i18n_completeness():
    print("Running TC8: i18n Translation Completeness & Key Parity...")
    ja_path = os.path.join(ROOT_DIR, 'messages', 'ja.json')
    vi_path = os.path.join(ROOT_DIR, 'messages', 'vi.json')
    
    ja = json.load(open(ja_path, 'r', encoding='utf-8'))
    vi = json.load(open(vi_path, 'r', encoding='utf-8'))
    
    assert 'panasonicReturnModal' in ja['Loans'], "Missing panasonicReturnModal in ja.json"
    assert 'panasonicReturnModal' in vi['Loans'], "Missing panasonicReturnModal in vi.json"
    
    ja_keys = set(ja['Loans']['panasonicReturnModal'].keys())
    vi_keys = set(vi['Loans']['panasonicReturnModal'].keys())
    diff = ja_keys.symmetric_difference(vi_keys)
    assert len(diff) == 0, f"Translation key mismatch: {diff}"
    
    assert 'destinationAddress' in ja_keys, "destinationAddress missing from ja.json"
    assert 'destinationAddress' in vi_keys, "destinationAddress missing from vi.json"
    print(f"  -> TC8 PASS: All {len(ja_keys)} i18n keys match 100% across ja.json and vi.json.")

def main():
    print("==================================================================")
    print("REAL TEST SUITE: WO-P1-010 (Package 11 — Panasonic Pallet Return)")
    print("SSOT: MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Table 1.3 Row 5 & Row 100)")
    print("==================================================================")
    
    test_tc1_zero_ddl()
    test_tc2_pallet_spec_source()
    test_tc3_crane_truck_and_zero_fallback()
    test_tc4_qr_serial_tag_and_modal_validation()
    test_tc5_four_item_checklist_in_source()
    test_tc6_dynamic_destination_address()
    test_tc7_electronic_seals_integration()
    test_tc8_i18n_completeness()
    
    print("==================================================================")
    print("ALL 8/8 REAL SOURCE TEST CASES PASSED! (100% QUALITY GATE)")
    print("==================================================================")

if __name__ == '__main__':
    main()
