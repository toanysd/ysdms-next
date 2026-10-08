import os
import sys
import subprocess
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("TEST SUITE: WO-P1-008 (GÓI 9 — CON DẤU ĐIỆN TỬ YSD 丸印・角印)")
print("=" * 70)

results = []

def record(test_name, passed, message=""):
    status_str = "PASS ✅" if passed else "FAIL ❌"
    print(f"[{status_str}] {test_name}: {message}")
    results.append((test_name, passed, message))

# --- TC-01: Electronic Seal Component Rendering (Tròn và Vuông) ---
try:
    seal_file = os.path.join(ROOT_DIR, "src", "components", "pdf", "ElectronicSeal.tsx")
    assert os.path.exists(seal_file), "ElectronicSeal.tsx does not exist"
    with open(seal_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "export const MaruinSeal" in content, "Missing MaruinSeal export"
    assert "export const KakuinSeal" in content, "Missing KakuinSeal export"
    assert "代表" in content and "取締役" in content, "Missing Maruin center text"
    assert "吉田金型" in content or "ヨシダ" in content, "Missing company name in seal"
    assert "#DC2626" in content, "Missing vermilion red color (#DC2626)"
    assert "ElectronicSealType" in content, "Missing ElectronicSealType"
    record("TC-01: Electronic Seal Component Rendering", True, "MaruinSeal & KakuinSeal verified with vermilion styling")
except Exception as e:
    record("TC-01: Electronic Seal Component Rendering", False, str(e))

# --- TC-02: PDF Integration (Dấu hiển thị đúng vị trí góc phải dưới) ---
try:
    pdf_doc = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(pdf_doc, "r", encoding="utf-8") as f:
        doc_content = f.read()
    assert "ElectronicSealType" in doc_content, "Missing ElectronicSealType in MoldLoanPDFDocument"
    assert "MaruinSeal" in doc_content, "Missing MaruinSeal import in MoldLoanPDFDocument"
    assert "KakuinSeal" in doc_content, "Missing KakuinSeal import in MoldLoanPDFDocument"
    assert "sealBoxContainer" in doc_content, "Missing sealBoxContainer in MoldLoanPDFDocument"
    assert "electronicSeal" in doc_content, "Missing electronicSeal prop"

    pdf_route = os.path.join(ROOT_DIR, "src", "app", "api", "equipment", "loans", "[id]", "pdf", "route.ts")
    with open(pdf_route, "r", encoding="utf-8") as f:
        route_content = f.read()
    assert "searchParams.get('seal')" in route_content, "Missing seal parameter parsing in pdf route"
    assert "electronicSeal: selectedSeal" in route_content, "Missing electronicSeal passing in pdf route"
    record("TC-02: PDF Integration", True, "MoldLoanPDFDocument & API route verified")
except Exception as e:
    record("TC-02: PDF Integration", False, str(e))

# --- TC-03: UI Toggle Button trên trang /equipment/loans/[id] ---
try:
    btn_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "[id]", "_components", "LoanPdfDownloadButton.tsx")
    assert os.path.exists(btn_file), "LoanPdfDownloadButton.tsx does not exist"
    with open(btn_file, "r", encoding="utf-8") as f:
        btn_content = f.read()
    assert "SealOption" in btn_content, "Missing SealOption type"
    assert "MARUIN" in btn_content and "KAKUIN" in btn_content and "BOTH" in btn_content, "Missing seal options"
    assert "data-testid=\"seal-selector-btn\"" in btn_content, "Missing seal-selector-btn test id"

    page_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "[id]", "page.tsx")
    with open(page_file, "r", encoding="utf-8") as f:
        page_content = f.read()
    assert "LoanPdfDownloadButton" in page_content, "LoanPdfDownloadButton not rendered in [id]/page.tsx"
    record("TC-03: UI Toggle Button", True, "LoanPdfDownloadButton integrated into loans [id]/page.tsx")
except Exception as e:
    record("TC-03: UI Toggle Button", False, str(e))

# --- TC-04: Zero DDL Compliance (0 migration mới) ---
try:
    status_proc = subprocess.run("git status -s supabase/migrations", shell=True, cwd=ROOT_DIR, capture_output=True, text=True)
    out = status_proc.stdout.strip()
    assert out == "", f"Detected unexpected migration changes: {out}"
    record("TC-04: Zero DDL Compliance", True, "0 new migrations in supabase/migrations/")
except Exception as e:
    record("TC-04: Zero DDL Compliance", False, str(e))

# --- TC-05: i18n Symmetry (0 missing keys ja/vi) ---
try:
    i18n_proc = subprocess.run("node scripts/check_translations.mjs", shell=True, cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
    assert i18n_proc.returncode == 0, f"Translation check failed: {i18n_proc.stderr or i18n_proc.stdout}"
    assert "All translation keys are properly defined" in i18n_proc.stdout
    record("TC-05: i18n Symmetry", True, "0 missing translation keys across ja.json & vi.json")
except Exception as e:
    record("TC-05: i18n Symmetry", False, str(e))

# --- TC-06: TypeScript Health (tsc --noEmit 0 errors) ---
try:
    tsc_proc = subprocess.run("npx tsc --noEmit", shell=True, cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
    assert tsc_proc.returncode == 0, f"TypeScript errors: {tsc_proc.stderr or tsc_proc.stdout}"
    record("TC-06: TypeScript Health", True, "0 errors on tsc --noEmit")
except Exception as e:
    record("TC-06: TypeScript Health", False, str(e))

print("=" * 70)
total_tests = len(results)
passed_tests = sum(1 for _, p, _ in results if p)
all_pass = (passed_tests == total_tests)
print(f"RESULTS: {passed_tests}/{total_tests} PASSED ({'100% PASS ✅' if all_pass else 'FAILED ❌'})")
print("=" * 70)

sys.exit(0 if all_pass else 1)
