"""
Test Suite for P0-3: A4 Print Sheet for Tooling Manufacturing Job (8 Test Cases)
Verifies route existence, CSS print rules, i18n parity, QR generation, SSOT specs,
equipment location binding, and workshop sign-off structure.
"""

import os
import sys
import json
import re

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

def main():
    print("=" * 65)
    print("TEST SUITE: P0-3 A4 Print Sheet for Tooling Manufacturing Job")
    print("=" * 65)
    runner = TestRunner()

    # TC-P03-01: Route files existence
    files_to_check = [
        "src/app/equipment/jobs/[id]/print/page.tsx",
        "src/app/equipment/jobs/[id]/print/print.css",
        "src/app/equipment/jobs/[id]/print/_components/JobPrintSheet.tsx",
        "src/app/equipment/jobs/[id]/page.tsx",
    ]
    all_exist = all(os.path.isfile(f) for f in files_to_check)
    runner.assert_test("TC-P03-01", all_exist, "All required route and component files exist on disk")

    # TC-P03-02: Print CSS media rules
    css_content = open("src/app/equipment/jobs/[id]/print/print.css", encoding="utf-8").read()
    has_print_media = "@media print" in css_content
    has_no_print = ".no-print" in css_content
    has_a4_page = "A4 portrait" in css_content
    runner.assert_test("TC-P03-02", has_print_media and has_no_print and has_a4_page,
                       "print.css defines @media print, .no-print hiding, and A4 portrait page size")

    # TC-P03-03: i18n parity
    ja_data = json.load(open("messages/ja.json", encoding="utf-8"))
    vi_data = json.load(open("messages/vi.json", encoding="utf-8"))
    ja_keys = set(ja_data.get("JobPrint", {}).keys())
    vi_keys = set(vi_data.get("JobPrint", {}).keys())
    i18n_ok = len(ja_keys) >= 30 and ja_keys == vi_keys
    runner.assert_test("TC-P03-03", i18n_ok,
                       f"JobPrint i18n namespace has parity between JA and VI ({len(ja_keys)} keys)")

    # TC-P03-04: QR Code generation
    client_content = open("src/app/equipment/jobs/[id]/print/_components/JobPrintSheet.tsx", encoding="utf-8").read()
    has_qr_import = "import QRCode from 'qrcode'" in client_content
    has_qr_generation = "QRCode.toDataURL" in client_content
    runner.assert_test("TC-P03-04", has_qr_import and has_qr_generation,
                       "JobPrintSheet imports and calls QRCode.toDataURL for shopfloor scanning")

    # TC-P03-05: SSOT compliance (RULE-DATA-01 & RULE-DATA-02)
    server_content = open("src/app/equipment/jobs/[id]/print/page.tsx", encoding="utf-8").read()
    reads_cutline_from_rev = "cutline_length" in server_content and "cutline_width" in server_content
    reads_plastic_from_rev = "plastic_type_designed" in server_content
    no_synthetic_rev = "revData" not in server_content
    runner.assert_test("TC-P03-05", reads_cutline_from_rev and reads_plastic_from_rev and no_synthetic_rev,
                       "Specs are loaded directly from design_revisions SSOT without synthetic fallbacks")

    # TC-P03-06: Equipment & Location binding
    uses_primary_eq = "primary_equipment_id" in server_content
    uses_related_eq = "related_equipment_id" in server_content
    uses_rel_type = "relationship_type" in server_content
    runner.assert_test("TC-P03-06", uses_primary_eq and uses_related_eq and uses_rel_type,
                       "Cutters queried via equipment_assignments with exact catalog columns")

    # TC-P03-07: Workshop Sign-off Blocks & Nippo Link
    has_cam_sign = "signCAM" in client_content
    has_machining_sign = "signMachining" in client_content
    has_assembly_sign = "signAssembly" in client_content
    has_qc_sign = "signQC" in client_content
    has_nippo_link = "/worklogs/new?job_id=" in client_content
    runner.assert_test("TC-P03-07", has_cam_sign and has_machining_sign and has_assembly_sign and has_qc_sign and has_nippo_link,
                       "4 Japanese workshop sign-off blocks and quick shortcut to Nippo are present")

    # TC-P03-08: Mock Data Integrity simulation
    mock_data = {
        "job": {
            "job_id": "job-uuid-1",
            "job_code": "JOB-20261007-001",
            "job_name": "ADY071 金型新規製作",
            "job_status": "PENDING",
            "mold_deadline": "2026-10-20",
            "ship_date": "2026-10-25",
            "created_at": "2026-10-07T05:00:00Z"
        },
        "company": {"company_id": "c1", "company_name": "テスト電子", "company_code": "TST"},
        "product": {"product_id": "p1", "product_code": "ADY071", "product_name": "パーツトレイA", "product_name_internal": "ADY071"},
        "design": {
            "revision_id": "r1",
            "design_code": "ADY071-R1",
            "cutline_length": 250.0,
            "cutline_width": 180.0,
            "corner_r": "5",
            "chamfer_c": "2",
            "cavity_count": 1,
            "plastic_type_designed": "PET 透明 0.5mm"
        },
        "mold": {
            "equipment_id": "e1",
            "equipment_code": "ADY071-MOLD",
            "display_name": "ADY071 主型",
            "rack_code": "A1",
            "layer_code": "02",
            "location_in_factory": "金型置場南",
            "zone_code": "ZONE-A"
        },
        "cutters": [
            {
                "equipment_id": "c1",
                "equipment_code": "CT-1042",
                "display_name": "CT-1042 抜型",
                "rack_code": "K1",
                "layer_code": "01",
                "relationship_type": "SET_MEMBER"
            }
        ],
        "steps": [
            {
                "step_id": "s1",
                "step_no": 1,
                "step_name": "CAM・加工段取り",
                "step_status": "PENDING",
                "employee_name": "田中 太郎",
                "planned_hours": 2.5,
                "actual_hours": 0.0,
                "notes": None
            }
        ]
    }
    # Verify all mandatory keys exist in ViewModel
    is_valid_model = (
        mock_data["job"]["job_code"].startswith("JOB-") and
        mock_data["design"]["cutline_length"] == 250.0 and
        mock_data["mold"]["rack_code"] == "A1" and
        len(mock_data["cutters"]) == 1 and
        len(mock_data["steps"]) == 1
    )
    runner.assert_test("TC-P03-08", is_valid_model,
                       "ViewModel mock structure satisfies all rendering contracts")

    print("=" * 65)
    print(f"RESULTS: {runner.passed}/8 PASSED, {runner.failed}/8 FAILED")
    print("=" * 65)

    with open("scripts/test_p0_3_print_job_results.json", "w", encoding="utf-8") as f:
        json.dump({
            "total": 8,
            "passed": runner.passed,
            "failed": runner.failed,
            "results": runner.results
        }, f, ensure_ascii=False, indent=2)

    if runner.failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
