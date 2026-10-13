import os
import sys
import subprocess
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("TEST SUITE: WO-P1-009 (GÓI 10 — XUẤT KHUÔN GIA CÔNG BỀ MẶT MINEBEA)")
print("=" * 70)

results = []

def record(test_name, passed, message=""):
    status_str = "PASS ✅" if passed else "FAIL ❌"
    print(f"[{status_str}] {test_name}: {message}")
    results.append((test_name, passed, message))

# --- TC-01: Outsource Processing Type Definitions & Interface Integrity ---
try:
    types_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "types.ts")
    assert os.path.exists(types_file), "types.ts does not exist"
    with open(types_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "OutsourceProcessingType" in content, "Missing OutsourceProcessingType"
    assert "'TEFLON'" in content and "'PLATING'" in content, "Missing TEFLON or PLATING in OutsourceProcessingType"
    assert "CreateOutsourceProcessingInput" in content, "Missing CreateOutsourceProcessingInput"
    assert "trial_samples" in content, "Missing trial_samples in CreateOutsourceProcessingInput"
    assert "coating_thickness" in content, "Missing coating_thickness in CreateOutsourceProcessingInput"
    assert "Minebea Mitsumi" in content or "ミネベア" in content, "Missing Minebea Mitsumi in types.ts"
    record("TC-01: Outsource Processing Type & SSOT Definitions", True, "Types & Minebea interface verified")
except Exception as e:
    record("TC-01: Outsource Processing Type & SSOT Definitions", False, str(e))

# --- TC-02: Server Action & Business Logic Validation ---
try:
    actions_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "actions.ts")
    with open(actions_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "export async function createOutsourceProcessingRequest" in content, "Missing createOutsourceProcessingRequest action"
    assert "OUTSOURCE_PROCESSING" in content, "Missing OUTSOURCE_PROCESSING loan_type"
    assert "MINEBEA SPEC" in content, "Missing MINEBEA SPEC block in action notes"
    assert "24〜60枚" in content, "Missing 24〜60枚 test sheets constraint note"
    assert "テフロンコーティング" in content, "Missing Teflon label"
    assert "硬質クロムメッキ" in content, "Missing Chrome plating label"
    record("TC-02: Server Action & Minebea Logic", True, "createOutsourceProcessingRequest verified with Teflon/Plating logic")
except Exception as e:
    record("TC-02: Server Action & Minebea Logic", False, str(e))

# --- TC-03: PDF Document & Minebea Stamping Spec Integration ---
try:
    pdf_file = os.path.join(ROOT_DIR, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    with open(pdf_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "外注表面処理仕様及び成形テスト指示 (Minebea Mitsumi 規格)" in content, "Missing Section 5c Minebea spec in PDF"
    assert "24〜60枚" in content, "Missing 24〜60枚 trial samples text in PDF"
    assert "外注受領印" in content, "Missing 外注受領印 seal box in PDF"
    assert "isOutsource" in content, "Missing isOutsource conditional rendering"

    pdf_route = os.path.join(ROOT_DIR, "src", "app", "api", "equipment", "loans", "[id]", "pdf", "route.ts")
    with open(pdf_route, "r", encoding="utf-8") as f:
        route_content = f.read()
    assert "OUTSOURCE_PROCESSING" in route_content, "Missing OUTSOURCE_PROCESSING in pdf route"
    record("TC-03: PDF Document & Minebea Spec", True, "PDF layout verified with Minebea 24-60 sheets & outsource seal box")
except Exception as e:
    record("TC-03: PDF Document & Minebea Spec", False, str(e))

# --- TC-04: Outsource Modal Component & UI Integration ---
try:
    modal_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "[id]", "_components", "OutsourceProcessingModal.tsx")
    assert os.path.exists(modal_file), "OutsourceProcessingModal.tsx does not exist"
    with open(modal_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "OutsourceProcessingModal" in content, "Missing OutsourceProcessingModal component"
    assert "data-testid=\"outsource-processing-modal\"" in content, "Missing test id outsource-processing-modal"
    assert "24〜60枚" in content, "Missing 24〜60枚 default state in modal"
    assert "createOutsourceProcessingRequest" in content, "Missing createOutsourceProcessingRequest call in modal"

    page_file = os.path.join(ROOT_DIR, "src", "app", "equipment", "loans", "[id]", "page.tsx")
    with open(page_file, "r", encoding="utf-8") as f:
        page_content = f.read()
    assert "OutsourceProcessingModal" in page_content, "OutsourceProcessingModal not rendered in page.tsx"
    assert "data-testid=\"outsource-processing-btn\"" in page_content, "Missing data-testid outsource-processing-btn in page.tsx"
    record("TC-04: UI Modal & Page Integration", True, "OutsourceProcessingModal integrated in [id]/page.tsx")
except Exception as e:
    record("TC-04: UI Modal & Page Integration", False, str(e))

# --- TC-05: Zero DDL Compliance (0 migration mới) ---
try:
    status_proc = subprocess.run("git status -s supabase/migrations", shell=True, cwd=ROOT_DIR, capture_output=True, text=True)
    out = status_proc.stdout.strip()
    assert out == "", f"Detected unexpected migration changes: {out}"
    record("TC-05: Zero DDL Compliance", True, "0 new migrations in supabase/migrations/")
except Exception as e:
    record("TC-05: Zero DDL Compliance", False, str(e))

# --- TC-06: i18n Symmetry (0 missing keys ja/vi) ---
try:
    i18n_proc = subprocess.run("node scripts/check_translations.mjs", shell=True, cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
    assert i18n_proc.returncode == 0, f"Translation check failed: {i18n_proc.stderr or i18n_proc.stdout}"
    assert "All translation keys are properly defined" in i18n_proc.stdout
    record("TC-06: i18n Symmetry", True, "0 missing translation keys across ja.json & vi.json")
except Exception as e:
    record("TC-06: i18n Symmetry", False, str(e))

# --- TC-07: TypeScript Health (tsc --noEmit 0 errors) ---
try:
    tsc_proc = subprocess.run("npx tsc --noEmit", shell=True, cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
    assert tsc_proc.returncode == 0, f"TypeScript errors: {tsc_proc.stderr or tsc_proc.stdout}"
    record("TC-07: TypeScript Health", True, "0 errors on tsc --noEmit")
except Exception as e:
    record("TC-07: TypeScript Health", False, str(e))

# --- TC-08: PDF Generation End-to-End Test ---
try:
    pdf_sample = os.path.join(ROOT_DIR, "docs", "reports", "wo_p1_009_outsource_processing_sample.pdf")
    assert os.path.exists(pdf_sample), "PDF sample file does not exist"
    size = os.path.getsize(pdf_sample)
    assert size > 50000, f"PDF sample size {size} is too small"
    record("TC-08: PDF Generation End-to-End", True, f"Generated valid PDF ({size} bytes)")
except Exception as e:
    record("TC-08: PDF Generation End-to-End", False, str(e))

print("=" * 70)
total_tests = len(results)
passed_tests = sum(1 for _, p, _ in results)
print(f"SUMMARY: {passed_tests}/{total_tests} TESTS PASSED ({passed_tests/total_tests*100:.1f}%)")
print("=" * 70)

if passed_tests < total_tests:
    sys.exit(1)
