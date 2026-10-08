#!/usr/bin/env python3
"""
Test Suite for WO-P1-004: Industrial A4 PDF Engine / Export
Verifies all 8 Test Cases according to SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0
"""

import os
import sys
import subprocess
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def run_cmd(cmd, cwd=ROOT_DIR):
    res = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        cwd=cwd,
    )
    return res.returncode, res.stdout, res.stderr

def test_tc01_font_assets():
    print("[TC-01] Checking font assets (NotoSansJP-Regular.otf & Bold.otf)...")
    fonts_dir = os.path.join(ROOT_DIR, "public", "fonts")
    reg_font = os.path.join(fonts_dir, "NotoSansJP-Regular.otf")
    bold_font = os.path.join(fonts_dir, "NotoSansJP-Bold.otf")

    assert os.path.exists(reg_font), f"Missing {reg_font}"
    assert os.path.exists(bold_font), f"Missing {bold_font}"

    reg_size = os.path.getsize(reg_font)
    bold_size = os.path.getsize(bold_font)

    assert reg_size > 1_000_000, f"Regular font too small: {reg_size} bytes"
    assert bold_size > 1_000_000, f"Bold font too small: {bold_size} bytes"

    print(f"  -> PASS: Regular={reg_size:,} bytes, Bold={bold_size:,} bytes")
    return True

def test_tc02_document_types():
    print("[TC-02] Checking support for 3 document types and pledge statements...")
    doc_path = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "CUSTOMER_LOAN" in content
    assert "RETURN_TO_CUSTOMER" in content
    assert "OUTSOURCE_PROCESSING" in content

    # Check titles
    assert "金型借用書 (兼 預り証)" in content
    assert "金型返却書 (現品受渡確認票)" in content
    assert "金型外注加工・修理依頼書 (兼 送付状)" in content

    # Check pledge text
    assert "貴社所有の下記金型をお預かり（借用）いたしましたことを証します" in content
    assert "貴社所有の下記金型につきまして、成形トレー製造契約の終了" in content
    assert "下記金型の外注加工（再研磨・テフロン加工・修理等）を依頼いたします" in content

    print("  -> PASS: All 3 document streams and pledge statements correctly implemented")
    return True

def test_tc03_placard_banner():
    print("[TC-03] Checking Japanese accounting placard banner (SHI-HITEC standard)...")
    doc_path = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "撮影用看板 (資産特定プレート規格)" in content
    assert "placardContainer" in content
    assert "型番:" in content
    assert "品名:" in content
    assert "寸法:" in content
    assert "重量:" in content
    assert "資産所有者:" in content
    assert "保管者:" in content

    print("  -> PASS: Japanese accounting standard placard banner verified")
    return True

def test_tc04_photo_attachments():
    print("[TC-04] Checking 2 photo slots (photo_overall_url, photo_nameplate_url)...")
    doc_path = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "photo_overall_url" in content
    assert "photo_nameplate_url" in content
    assert "① 全体写真 (Overall View)" in content
    assert "② 拡大写真・刻印 (Nameplate View)" in content
    assert "photoPlaceholderText" in content
    assert "objectFit: 'contain'" in content

    print("  -> PASS: Photo attachments and fallback placeholders verified")
    return True

def test_tc05_three_party_signatures():
    print("[TC-05] Checking 3-party signatures block and seal stamps...")
    doc_path = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "3. 署名・承認欄 (Signatures & Confirmation)" in content
    assert "signatureRow" in content
    assert "signatureBlock" in content
    assert "引渡責任者 (Lender)" in content or "返却責任者 (Returning Party)" in content
    assert "受託責任者 (Custodian)" in content or "受領確認者 (Receiver)" in content
    assert "現品受渡検査員 (QC Inspector)" in content
    assert "〔 社 判 〕" in content
    assert "〔 印 〕" in content

    print("  -> PASS: 3-party signature block and seal placeholders verified")
    return True

def test_tc06_api_route_rfc5987():
    print("[TC-06] Checking API route RFC 5987 Japanese filename and ?download=1...")
    route_path = os.path.join(ROOT_DIR, "src", "app", "api", "equipment", "loans", "[id]", "pdf", "route.ts")
    with open(route_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "searchParams.get('download')" in content
    assert "attachment" in content
    assert "inline" in content
    assert "filename*=UTF-8''" in content
    assert "encodeURIComponent(japaneseFilename)" in content
    assert "金型借用書" in content
    assert "金型返却書" in content
    assert "金型外注加工依頼書" in content

    print("  -> PASS: RFC 5987 Content-Disposition header and download param verified")
    return True

def test_tc07_typescript():
    print("[TC-07] Running TypeScript compiler check (npx tsc --noEmit)...")
    code, out, err = run_cmd("npx tsc --noEmit")
    assert code == 0, f"TypeScript errors:\n{out}\n{err}"
    print("  -> PASS: TypeScript compiler verified 0 errors")
    return True

def test_tc08_translations():
    print("[TC-08] Running translation key check (node scripts/check_translations.mjs)...")
    code, out, err = run_cmd("node scripts/check_translations.mjs")
    assert code == 0, f"Translation errors:\n{out}\n{err}"
    assert "All translation keys are properly defined" in out
    print("  -> PASS: All translation keys verified in ja.json and vi.json")
    return True

def main():
    print("=" * 70)
    print("STARTING TEST SUITE FOR WO-P1-004 (Package 5: A4 PDF Engine)")
    print("=" * 70)

    tests = [
        ("TC-01", test_tc01_font_assets),
        ("TC-02", test_tc02_document_types),
        ("TC-03", test_tc03_placard_banner),
        ("TC-04", test_tc04_photo_attachments),
        ("TC-05", test_tc05_three_party_signatures),
        ("TC-06", test_tc06_api_route_rfc5987),
        ("TC-07", test_tc07_typescript),
        ("TC-08", test_tc08_translations),
    ]

    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            if test_fn():
                passed += 1
        except Exception as e:
            print(f"  -> FAIL: {e}")
            failed += 1

    print("=" * 70)
    print(f"RESULTS: {passed}/{len(tests)} PASSED, {failed} FAILED")
    print("=" * 70)

    if failed > 0:
        sys.exit(1)
    else:
        print("ALL QUALITY GATES PASSED (100% SUCCESS)!")
        sys.exit(0)

if __name__ == "__main__":
    main()
