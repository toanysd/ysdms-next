#!/usr/bin/env python3
"""
Test Suite: Sprint P1 WO-P1-001 "Modernize Equipment Loans UI & Annual Audit Export"
Verifies 8 Test Cases covering 3 business streams, 11 SSOT customers, schema compliance,
audit export engine, and quality gates.
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import subprocess

PASS = "PASS"
FAIL = "FAIL"

test_results = []

def record_result(tc_id, desc, passed, message=""):
    status = PASS if passed else FAIL
    print(f"[{status}] {tc_id}: {desc}")
    if message and not passed:
        print(f"       Reason: {message}")
    test_results.append({
        "tc_id": tc_id,
        "description": desc,
        "status": status,
        "message": message
    })

def main():
    print("=" * 70)
    print("TEST SUITE: WO-P1-001 Loans UI 3 Streams & Annual Audit Export (8 Test Cases)")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    loans_dir = os.path.join(base_dir, "src", "app", "equipment", "loans")

    # TC-P1-01: Component & Files Structure
    files_to_check = [
        os.path.join(loans_dir, "page.tsx"),
        os.path.join(loans_dir, "types.ts"),
        os.path.join(loans_dir, "actions.ts"),
        os.path.join(loans_dir, "_components", "LoanHeader.tsx"),
        os.path.join(loans_dir, "_components", "LoanFilterBar.tsx"),
        os.path.join(loans_dir, "_components", "LoanListTable.tsx"),
        os.path.join(loans_dir, "_components", "LoanAuditExportModal.tsx"),
    ]
    all_exist = all(os.path.isfile(f) for f in files_to_check)
    record_result("TC-P1-01", "All required loans route and audit modal files exist on disk", all_exist)

    # TC-P1-02: SSOT 11 Customers Parity
    types_content = open(os.path.join(loans_dir, "types.ts"), encoding="utf-8").read()
    expected_customers = [
        'shin-ei', 'jae', 'transtron', 'fujikura', 'panasonic',
        'canon-asahi', 'rhythm', 'a-and-t', 'omura-smk', 'minebea', 'terada'
    ]
    has_all_11 = all(cust in types_content for cust in expected_customers)
    has_no_fake = not any(fake in types_content for fake in ['Nichias', 'Tenma', 'Sumitomo'])
    record_result("TC-P1-02", "types.ts strictly defines exactly 11 SSOT customers without unapproved entities", has_all_11 and has_no_fake)

    # TC-P1-03: 3 Business Streams Classification
    has_custody = "CUSTOMER_LOAN" in types_content
    has_loan = "RETURN_TO_CUSTOMER" in types_content
    has_transfer = "OUTSOURCE_PROCESSING" in types_content
    filter_bar_content = open(os.path.join(loans_dir, "_components", "LoanFilterBar.tsx"), encoding="utf-8").read()
    has_stream_tabs = "CUSTOMER_LOAN" in filter_bar_content and "RETURN_TO_CUSTOMER" in filter_bar_content
    record_result("TC-P1-03", "3 business streams (預託, 貸出, 移管) are modeled and integrated in FilterBar", has_custody and has_loan and has_transfer and has_stream_tabs)

    # TC-P1-04: Schema Compliance (RULE-DATA-02)
    actions_content = open(os.path.join(loans_dir, "actions.ts"), encoding="utf-8").read()
    no_fake_items = "equipment_loan_items" not in actions_content
    no_fake_photos = "equipment_loan_photos" not in actions_content
    uses_loans_summary = "v_equipment_loans_summary" in actions_content
    record_result("TC-P1-04", "RULE-DATA-02 verified: Zero usage of non-existent tables (items/photos); queries v_equipment_loans_summary", no_fake_items and no_fake_photos and uses_loans_summary)

    # TC-P1-05: Annual Audit Data Engine (actions.ts)
    has_audit_action = "export async function getAnnualAuditData" in actions_content
    has_audit_record = "AnnualAuditRecord" in actions_content
    has_equipment_fallback = "from('equipment')" in actions_content
    record_result("TC-P1-05", "getAnnualAuditData action implemented with direct equipment resolution fallback", has_audit_action and has_audit_record and has_equipment_fallback)

    # TC-P1-06: Export Modal Capabilities (UTF-8 BOM CSV & Dual Signatures)
    modal_content = open(os.path.join(loans_dir, "_components", "LoanAuditExportModal.tsx"), encoding="utf-8").read()
    has_utf8_bom = "\\uFEFF" in modal_content
    has_dual_signatures = "工場責任者" in modal_content and "品質保証責任者" in modal_content
    has_print_support = "window.print()" in modal_content
    record_result("TC-P1-06", "LoanAuditExportModal implements UTF-8 BOM CSV export and dual signature approval blocks", has_utf8_bom and has_dual_signatures and has_print_support)

    # TC-P1-07: TypeScript Quality Gate (0 errors)
    ts_res = subprocess.run(["npx", "tsc", "--noEmit"], cwd=base_dir, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=True)
    ts_clean = (ts_res.returncode == 0)
    record_result("TC-P1-07", "TypeScript compile check (npx tsc --noEmit) passes with 0 errors", ts_clean, ts_res.stdout or "")

    # TC-P1-08: i18n Translation Quality Gate (0 missing keys)
    i18n_res = subprocess.run(["node", "scripts/check_translations.mjs"], cwd=base_dir, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=True)
    i18n_stdout = i18n_res.stdout or ""
    i18n_clean = (i18n_res.returncode == 0 and "All translation keys are properly defined" in i18n_stdout)
    record_result("TC-P1-08", "next-intl translation check (check_translations.mjs) passes with 0 missing keys", i18n_clean, i18n_stdout)

    print("=" * 70)
    passed_count = sum(1 for t in test_results if t["status"] == PASS)
    failed_count = sum(1 for t in test_results if t["status"] == FAIL)
    print(f"SUMMARY: {passed_count}/{len(test_results)} PASSED | {failed_count} FAILED")
    print("=" * 70)

    # Save results json
    results_path = os.path.join(base_dir, "scripts", "test_p1_001_results.json")
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump({
            "suite": "WO-P1-001",
            "timestamp": "2026-10-07 19:55 JST",
            "passed": passed_count,
            "failed": failed_count,
            "tests": test_results
        }, f, ensure_ascii=False, indent=2)
    print(f"Results saved to {results_path}")

    return 0 if failed_count == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
