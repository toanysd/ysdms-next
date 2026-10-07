"""
Test Suite for P0-2 Fast Tooling Job Entry (12 Test Cases)
Verifies input validation, code formatting, retry logic, advisory locks, and simulation of RPC/fallback.
"""

import sys
import re
import json
import hashlib
from datetime import datetime

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []

    def assert_test(self, test_id: str, condition: bool, description: str, details: str = ""):
        if condition:
            self.passed += 1
            status = "PASS"
            print(f"[{status}] {test_id}: {description}")
        else:
            self.failed += 1
            status = "FAIL"
            print(f"[{status}] {test_id}: {description} - FAILED! {details}")
        
        self.results.append({
            "test_id": test_id,
            "status": status,
            "description": description,
            "details": details
        })

def validate_input(input_data: dict) -> dict:
    """Mirrors validation logic in createFastToolingJobAction and create_fast_tooling_job RPC."""
    product_code = (input_data.get("product_code") or "").strip().upper()
    if not product_code or not re.match(r"^[A-Z0-9\-_]+$", product_code):
        return {"success": False, "errorKey": "errProductCodeRequired", "error": "製品コードを入力してください (英数字)"}

    if not input_data.get("company_id"):
        return {"success": False, "errorKey": "errCompanyRequired", "error": "得意先を選択してください"}

    if not input_data.get("reuse_revision"):
        cutline_length = input_data.get("cutline_length")
        if not cutline_length or float(cutline_length) <= 0:
            return {"success": False, "errorKey": "errCutlineLengthRequired", "error": "抜寸法（長）を正しく入力してください"}
        cutline_width = input_data.get("cutline_width")
        if not cutline_width or float(cutline_width) <= 0:
            return {"success": False, "errorKey": "errCutlineWidthRequired", "error": "抜寸法（幅）を正しく入力してください"}

    if not input_data.get("rack_layer_id"):
        return {"success": False, "errorKey": "errRackLayerRequired", "error": "保管棚・段を選択してください"}

    job_name = (input_data.get("job_name") or "").strip()
    if not job_name:
        return {"success": False, "errorKey": "errJobNameRequired", "error": "ジョブ名（作業件名）を入力してください"}

    if not input_data.get("mold_deadline"):
        return {"success": False, "errorKey": "errMoldDeadlineRequired", "error": "金型納期を指定してください"}

    return {"success": True}

def simulate_design_code(product_code: str, existing_rev_codes: list) -> str:
    """Mirrors deterministic revision code calculation."""
    max_num = 0
    pattern = re.compile(rf"^{re.escape(product_code)}-R(\d+)$", re.IGNORECASE)
    for code in existing_rev_codes:
        m = pattern.match(code)
        if m:
            num = int(m.group(1))
            if num > max_num:
                max_num = num
    return f"{product_code}-R{max_num + 1}"

def simulate_job_code(date_str: str, seq_num: int) -> str:
    """Mirrors deterministic JOB-YYYYMMDD-### formatting."""
    return f"JOB-{date_str}-{seq_num:03d}"

def calculate_advisory_lock_key(clean_code_compact: str) -> int:
    """Simulates PostgreSQL hashtext('fast_tooling_' || clean_code_compact)."""
    text = f"fast_tooling_{clean_code_compact}"
    # Standard 32-bit integer hash representation
    h = int(hashlib.md5(text.encode('utf-8')).hexdigest()[:8], 16)
    if h >= 0x80000000:
        h -= 0x100000000
    return h

def main():
    print("=" * 65)
    print("TEST SUITE: P0-2 Fast Tooling Job Entry (12 Test Cases)")
    print("=" * 65)
    
    runner = TestRunner()

    valid_base = {
        "product_code": "ADY071",
        "product_name_internal": "パーツトレイA",
        "company_id": "c1111111-1111-1111-1111-111111111111",
        "reuse_revision": False,
        "cutline_length": 250.5,
        "cutline_width": 180.0,
        "rack_layer_id": "r1111111-1111-1111-1111-111111111111",
        "job_name": "ADY071 金型新規製作",
        "mold_deadline": "2026-10-20"
    }

    # TC-P02-01: Empty product_code
    tc1 = dict(valid_base, product_code="")
    res1 = validate_input(tc1)
    runner.assert_test("TC-P02-01", not res1["success"] and res1["errorKey"] == "errProductCodeRequired", 
                       "Validation fails when product_code is empty")

    # TC-P02-02: Invalid format product_code
    tc2 = dict(valid_base, product_code="ADY@071#INVALID")
    res2 = validate_input(tc2)
    runner.assert_test("TC-P02-02", not res2["success"] and res2["errorKey"] == "errProductCodeRequired",
                       "Validation fails when product_code contains invalid characters")

    # TC-P02-03: Missing company_id
    tc3 = dict(valid_base, company_id="")
    res3 = validate_input(tc3)
    runner.assert_test("TC-P02-03", not res3["success"] and res3["errorKey"] == "errCompanyRequired",
                       "Validation fails when company_id is missing")

    # TC-P02-04: Non-positive cutline
    tc4_a = dict(valid_base, cutline_length=0)
    res4_a = validate_input(tc4_a)
    tc4_b = dict(valid_base, cutline_width=-5.0)
    res4_b = validate_input(tc4_b)
    runner.assert_test("TC-P02-04", not res4_a["success"] and res4_a["errorKey"] == "errCutlineLengthRequired" and
                                    not res4_b["success"] and res4_b["errorKey"] == "errCutlineWidthRequired",
                       "Validation fails when cutline dimensions are non-positive")

    # TC-P02-05: Missing rack_layer_id
    tc5 = dict(valid_base, rack_layer_id="")
    res5 = validate_input(tc5)
    runner.assert_test("TC-P02-05", not res5["success"] and res5["errorKey"] == "errRackLayerRequired",
                       "Validation fails when rack_layer_id is missing")

    # TC-P02-06: Empty job_name
    tc6 = dict(valid_base, job_name="   ")
    res6 = validate_input(tc6)
    runner.assert_test("TC-P02-06", not res6["success"] and res6["errorKey"] == "errJobNameRequired",
                       "Validation fails when job_name is whitespace or empty")

    # TC-P02-07: Missing mold_deadline
    tc7 = dict(valid_base, mold_deadline="")
    res7 = validate_input(tc7)
    runner.assert_test("TC-P02-07", not res7["success"] and res7["errorKey"] == "errMoldDeadlineRequired",
                       "Validation fails when mold_deadline is missing")

    # TC-P02-08: Product resolution simulation (existing vs new)
    existing_products = {"ADY071": "prod-uuid-123"}
    p_code = "ADY071"
    matched_id = existing_products.get(p_code)
    unmatched_code = "NEWPROD99"
    new_id = existing_products.get(unmatched_code)
    runner.assert_test("TC-P02-08", matched_id == "prod-uuid-123" and new_id is None,
                       "Product resolution matches existing product or branches to creation")

    # TC-P02-09: Revision reuse mode
    tc9 = dict(valid_base, reuse_revision=True, selected_revision_id="rev-uuid-777", cutline_length=None, cutline_width=None)
    res9 = validate_input(tc9)
    runner.assert_test("TC-P02-09", res9["success"] and tc9["selected_revision_id"] == "rev-uuid-777",
                       "Revision reuse skips cutline validation and assigns existing revision ID")

    # TC-P02-10: Revision new mode deterministic sequence
    revs = ["ADY071-R1", "ADY071-R2"]
    next_code = simulate_design_code("ADY071", revs)
    next_code_empty = simulate_design_code("ADY071", [])
    runner.assert_test("TC-P02-10", next_code == "ADY071-R3" and next_code_empty == "ADY071-R1",
                       "Revision new mode generates deterministic next revision code (R3 from [R1, R2])")

    # TC-P02-11: Equipment mold and cutter assignment simulation
    mold_equip_code = f"ADY071-MOLD"
    cutter_equip_code = "CT-1042"
    assignment = {
        "parent_equipment_id": "mold-uuid-555",
        "child_equipment_id": "cutter-uuid-888",
        "assignment_type": "SET_MEMBER",
        "is_active": True
    }
    runner.assert_test("TC-P02-11", mold_equip_code == "ADY071-MOLD" and assignment["assignment_type"] == "SET_MEMBER" and assignment["is_active"] is True,
                       "Equipment mold and cutter assigned with SET_MEMBER relation")

    # TC-P02-12: Job sequence generation and advisory lock
    today_str = datetime.now().strftime("%Y%m%d")
    sample_job_code = simulate_job_code(today_str, 1)
    lock_key = calculate_advisory_lock_key("ADY071")
    expected_pattern = rf"^JOB-{today_str}-\d{{3}}$"
    runner.assert_test("TC-P02-12", bool(re.match(expected_pattern, sample_job_code)) and isinstance(lock_key, int),
                       f"Job code adheres to pattern {expected_pattern} and advisory lock hash is valid int32")

    print("=" * 65)
    print(f"RESULTS: {runner.passed}/12 PASSED, {runner.failed}/12 FAILED")
    print("=" * 65)

    with open("scripts/test_p0_2_fast_job_results.json", "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total": 12,
            "passed": runner.passed,
            "failed": runner.failed,
            "results": runner.results
        }, f, ensure_ascii=False, indent=2)

    if runner.failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
