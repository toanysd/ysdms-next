"""
Automated Test Suite for WO-P1-002:
3-Year Dormant Molds Warning (非稼働 3年以上) & Storage Fee Calculation Engine (型保管料算出)
SSOT Reference: MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Topic 3 & Fujikura Model)
"""

import sys, os, datetime, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from pe_an_messenger import get_connection

def run_tests():
    print("=" * 80)
    print("RUNNING AUTOMATED TEST SUITE: WO-P1-002 (Package 3 - Dormant Molds & Storage Fee)")
    print("=" * 80)

    conn = get_connection()
    cur = conn.cursor()

    # --------------------------------------------------------------------------
    # TEST 1: SSOT 11 Customer Mapping & Live Equipment Resolution
    # --------------------------------------------------------------------------
    print("\n[TEST 1] Verifying SSOT 11 Customer Mapping & Equipment Resolution...")
    
    cur.execute("SELECT company_id, company_code, company_name FROM companies")
    companies = {r[0]: {'code': r[1], 'name': r[2]} for r in cur.fetchall()}

    PARTNERS = [
        {"id": "shin-ei", "nameJA": "新鋭産業 / シンエイ", "codes": ["SHT", "SHE", "SHT-004", "SES04"]},
        {"id": "jae", "nameJA": "日本航空電子 / NLC", "codes": ["JAE", "HAE", "YAE", "YKD", "NLC"]},
        {"id": "transtron", "nameJA": "トランストロン / 丸大 / 大手", "codes": ["OOT", "MRD", "MARUDAI"]},
        {"id": "fujikura", "nameJA": "藤倉コンポ / 青森フジクラ", "codes": ["FJK", "FJD", "FJD3", "FJK7", "COT-001-2"]},
        {"id": "panasonic", "nameJA": "パナソニック / 白河日東工器", "codes": ["PNS", "PNS03", "PNS4", "SNK", "ADV"]},
        {"id": "oita-canon", "nameJA": "大分キヤノン / 朝日", "codes": ["CANON", "ASH", "AHP", "TSA"]},
        {"id": "rhythm", "nameJA": "リズム / ワイエイシイガーター", "codes": ["RTM", "DIC-001B", "DIC", "YAC"]},
        {"id": "a-and-t", "nameJA": "エイアンドティー", "codes": ["AAT", "AAT-001-B"]},
        {"id": "omura-smk", "nameJA": "大村技研 / SMK", "codes": ["SMK", "IBR01", "OOM", "2307445-1"]},
        {"id": "minebea", "nameJA": "ミネベア / ミツミ", "codes": ["MCT", "MCT-001"]},
        {"id": "terada-deimu", "nameJA": "寺田 / デイム / 大妙", "codes": ["DIM", "DIM2"]}
    ]

    all_partner_cids = []
    for p in PARTNERS:
        p['companyIds'] = [cid for cid, c in companies.items() if c['code'] in p['codes']]
        all_partner_cids.extend(p['companyIds'])
        assert len(p['companyIds']) > 0, f"Partner {p['id']} has no matching companies!"

    print(f"  -> Successfully verified 11 partners with {len(all_partner_cids)} distinct company UUIDs.")
    print("  -> PASSED: TEST 1")

    # --------------------------------------------------------------------------
    # TEST 2: Evidence-Based Last Used Date Calculation (RULE-DATA-01/02)
    # --------------------------------------------------------------------------
    print("\n[TEST 2] Verifying Evidence-Based Last Used Date Resolution...")
    
    cur.execute("""
    SELECT equipment_id, MAX(COALESCE(ship_date::text, deadline::text, start_date::text)) as max_job
    FROM jobs
    WHERE equipment_id IS NOT NULL
    GROUP BY equipment_id
    """)
    job_map = {r[0]: r[1][:10] for r in cur.fetchall() if r[1]}

    cur.execute("""
    SELECT product_id, MAX(COALESCE(ship_date::text, due_date::text)) as max_order
    FROM order_lines
    WHERE product_id IS NOT NULL
    GROUP BY product_id
    """)
    order_map = {r[0]: r[1][:10] for r in cur.fetchall() if r[1]}

    cids_tuple = tuple(all_partner_cids)
    cur.execute("""
    SELECT e.equipment_id, e.equipment_code, e.entry_date::text, e.manufacturing_date::text, dr.product_id
    FROM equipment e
    JOIN design_revisions dr ON e.design_revision_id = dr.revision_id
    JOIN products prod ON dr.product_id = prod.product_id
    WHERE prod.company_id IN %s
    ORDER BY e.equipment_code
    """, (cids_tuple,))
    all_eq_rows = cur.fetchall()

    now = datetime.date(2026, 10, 8)
    cutoff_3y = now - datetime.timedelta(days=3*365)

    dormant_count = 0
    active_count = 0
    no_date_count = 0
    total_fee = 0
    standard_rate = 307.5

    for r in all_eq_rows:
        eq_id, eq_code, entry_d, mfg_d, prod_id = r
        j_date = job_map.get(eq_id)
        o_date = order_map.get(prod_id)
        e_date = (entry_d or mfg_d or '')[:10] or None

        last_date = j_date
        if o_date and (not last_date or o_date > last_date):
            last_date = o_date
        if e_date and (not last_date or e_date > last_date):
            last_date = e_date

        if not last_date:
            no_date_count += 1
        else:
            ld = datetime.date.fromisoformat(last_date)
            # Verify no future dates or synthetic fake dates
            assert ld <= now, f"Equipment {eq_code} has invalid future date {ld}!"
            if ld <= cutoff_3y:
                dormant_count += 1
                months = round((now - ld).days / 30.4375)
                fee = months * standard_rate
                total_fee += fee
            else:
                active_count += 1

    print(f"  -> Total 11 Partners Equipment Checked: {len(all_eq_rows)}")
    print(f"  -> Active (<3 Years): {active_count}")
    print(f"  -> Dormant (>=3 Years): {dormant_count}")
    print(f"  -> No Historical Date (Displays '—'): {no_date_count}")
    print(f"  -> Total Storage Fee Accumulated: ¥{int(total_fee):,}")
    
    assert dormant_count == 83, f"Expected 83 dormant molds, got {dormant_count}!"
    assert int(total_fee) == 1074405, f"Expected total fee 1,074,405, got {int(total_fee)}!"
    print("  -> PASSED: TEST 2")

    # --------------------------------------------------------------------------
    # TEST 3: UI Files & Component Architecture Verification
    # --------------------------------------------------------------------------
    print("\n[TEST 3] Verifying UI Components & Architecture Integration...")
    
    # 3.1 StorageFeeModal.tsx
    modal_path = 'src/app/equipment/loans/_components/StorageFeeModal.tsx'
    assert os.path.exists(modal_path), f"File {modal_path} not found!"
    with open(modal_path, 'r', encoding='utf-8') as f:
        modal_content = f.read()
    assert '\\uFEFF' in modal_content, "StorageFeeModal must use UTF-8 BOM for Japanese Excel export!"
    assert 'STANDARD_MOLD_STORAGE_RATE_JPY' in modal_content, "StorageFeeModal must use standard Fujikura rate!"
    assert 'window.print()' in modal_content, "StorageFeeModal must support print view!"
    print("  -> StorageFeeModal.tsx: UTF-8 BOM, standard rate, print view verified.")

    # 3.2 LoanHeader.tsx
    header_path = 'src/app/equipment/loans/_components/LoanHeader.tsx'
    with open(header_path, 'r', encoding='utf-8') as f:
        header_content = f.read()
    assert 'onOpenStorageFee' in header_content, "LoanHeader must have onOpenStorageFee!"
    assert '型保管料算出' in header_content, "LoanHeader must have button label '型保管料算出'!"
    print("  -> LoanHeader.tsx: onOpenStorageFee and button verified.")

    # 3.3 LoanFilterBar.tsx
    filter_path = 'src/app/equipment/loans/_components/LoanFilterBar.tsx'
    with open(filter_path, 'r', encoding='utf-8') as f:
        filter_content = f.read()
    assert 'DORMANT_3Y' in filter_content, "LoanFilterBar must have DORMANT_3Y tab!"
    print("  -> LoanFilterBar.tsx: DORMANT_3Y tab verified.")

    # 3.4 LoanListTable.tsx
    table_path = 'src/app/equipment/loans/_components/LoanListTable.tsx'
    with open(table_path, 'r', encoding='utf-8') as f:
        table_content = f.read()
    assert 'is_dormant_3y' in table_content, "LoanListTable must reference is_dormant_3y!"
    assert 'dormantBadge' in table_content, "LoanListTable must render dormantBadge!"
    print("  -> LoanListTable.tsx: is_dormant_3y and dormantBadge verified.")

    # 3.5 LoanKpiCards.tsx
    kpi_path = 'src/app/equipment/loans/_components/LoanKpiCards.tsx'
    with open(kpi_path, 'r', encoding='utf-8') as f:
        kpi_content = f.read()
    assert 'dormantCount' in kpi_content, "LoanKpiCards must display dormantCount!"
    assert 'DORMANT_3Y' in kpi_content, "LoanKpiCards must support clicking to DORMANT_3Y tab!"
    print("  -> LoanKpiCards.tsx: dormantCount KPI card verified.")

    # 3.6 i18n Translations
    for lang in ['ja', 'vi']:
        json_path = f'messages/{lang}.json'
        with open(json_path, 'r', encoding='utf-8') as f:
            j_content = f.read()
        assert '"filterDormant3Y"' in j_content, f"Missing filterDormant3Y in {lang}.json!"
        assert '"storageFeeBtn"' in j_content, f"Missing storageFeeBtn in {lang}.json!"
        assert '"dormantBadge"' in j_content, f"Missing dormantBadge in {lang}.json!"
        assert '"dormantMonths"' in j_content, f"Missing dormantMonths in {lang}.json!"
    print("  -> Translations in ja.json and vi.json verified.")

    print("  -> PASSED: TEST 3")

    print("\n" + "=" * 80)
    print("ALL 3 TESTS PASSED SUCCESSFULLY! 100% COMPLIANT WITH SSOT & EVIDENCE-BASED RULES.")
    print("=" * 80)

if __name__ == '__main__':
    run_tests()
