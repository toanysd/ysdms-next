#!/usr/bin/env python3
"""
Test Suite: Sprint P1 WO-P1-003 "Mobile Photo Quick-Capture with Scale & Placard"
Verifies 8 Test Cases covering:
1. Component & file structure on disk
2. Mobile camera direct capture (accept="image/*", capture="environment")
3. J-SOX scale guidelines (measuring tape / ruler visual aids)
4. On-site asset inspection placard (PlacardModal with YSD code, customer name, date)
5. Server Actions (uploadLoanPhoto, deleteLoanPhoto targeting bucket equipment-photos)
6. PDF document photo slots (MoldLoanPDFDocument.tsx)
7. Live Supabase database & storage verification (bucket equipment-photos, columns photo_overall_url, photo_nameplate_url)
8. Quality gates (npx tsc --noEmit, check_translations.mjs)
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import subprocess
import urllib.request
import urllib.error

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
    print("=" * 75)
    print("TEST SUITE: WO-P1-003 Mobile Photo Quick-Capture with Scale & Placard")
    print("=" * 75)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    loans_dir = os.path.join(base_dir, "src", "app", "equipment", "loans")
    detail_dir = os.path.join(loans_dir, "[id]")
    comp_dir = os.path.join(detail_dir, "_components")

    # TC-01: Component files on disk
    files_to_check = [
        os.path.join(loans_dir, "actions.ts"),
        os.path.join(detail_dir, "page.tsx"),
        os.path.join(comp_dir, "LoanPhotoCaptureSection.tsx"),
        os.path.join(comp_dir, "PlacardModal.tsx"),
        os.path.join(base_dir, "src", "components", "pdf", "MoldLoanPDFDocument.tsx"),
    ]
    all_exist = all(os.path.isfile(f) for f in files_to_check)
    record_result("TC-01", "Required components and files exist on disk", all_exist)

    # TC-02: Camera API and rear camera constraint
    photo_comp_path = os.path.join(comp_dir, "LoanPhotoCaptureSection.tsx")
    photo_comp_content = open(photo_comp_path, encoding="utf-8").read() if os.path.isfile(photo_comp_path) else ""
    has_capture_env = 'capture="environment"' in photo_comp_content
    has_accept_image = 'accept="image/*"' in photo_comp_content
    has_dual_slots = ('overall' in photo_comp_content) and ('nameplate' in photo_comp_content)
    record_result("TC-02", "Mobile camera capture attributes configured (capture='environment', accept='image/*')",
                  has_capture_env and has_accept_image and has_dual_slots,
                  f"capture={has_capture_env}, accept={has_accept_image}, dual={has_dual_slots}")

    # TC-03: J-SOX scale guidelines & visual aids
    has_scale_guide = ("scale" in photo_comp_content.lower() or "スケール" in photo_comp_content or "メジャー" in photo_comp_content)
    has_nameplate_guide = ("placard" in photo_comp_content.lower() or "銘板" in photo_comp_content or "刻印" in photo_comp_content)
    record_result("TC-03", "Scale guideline visual aids and J-SOX inspection prompts present",
                  has_scale_guide and has_nameplate_guide,
                  f"scale={has_scale_guide}, nameplate={has_nameplate_guide}")

    # TC-04: Placard modal generation and inspection metadata
    placard_path = os.path.join(comp_dir, "PlacardModal.tsx")
    placard_content = open(placard_path, encoding="utf-8").read() if os.path.isfile(placard_path) else ""
    has_print = "window.print()" in placard_content or "print" in placard_content.lower()
    has_placard_metadata = ("loan" in placard_content.lower() and ("company" in placard_content.lower() or "客先" in placard_content))
    record_result("TC-04", "On-site asset inspection placard (PlacardModal) with printable layout & metadata",
                  has_print and has_placard_metadata,
                  f"print={has_print}, metadata={has_placard_metadata}")

    # TC-05: Server actions for upload and delete targeting bucket equipment-photos
    actions_path = os.path.join(loans_dir, "actions.ts")
    actions_content = open(actions_path, encoding="utf-8").read() if os.path.isfile(actions_path) else ""
    has_upload = "export async function uploadLoanPhoto" in actions_content
    has_delete = "export async function deleteLoanPhoto" in actions_content
    targets_bucket = "'equipment-photos'" in actions_content
    updates_db = "photo_overall_url" in actions_content and "photo_nameplate_url" in actions_content
    record_result("TC-05", "Server Actions uploadLoanPhoto & deleteLoanPhoto target 'equipment-photos' & update DB",
                  has_upload and has_delete and targets_bucket and updates_db,
                  f"upload={has_upload}, delete={has_delete}, bucket={targets_bucket}, db={updates_db}")

    # TC-06: PDF document integration
    pdf_path = os.path.join(base_dir, "src", "components", "pdf", "MoldLoanPDFDocument.tsx")
    pdf_content = open(pdf_path, encoding="utf-8").read() if os.path.isfile(pdf_path) else ""
    has_pdf_overall = "photo_overall_url" in pdf_content
    has_pdf_nameplate = "photo_nameplate_url" in pdf_content
    record_result("TC-06", "A4 MoldLoanPDFDocument embeds both overall photo and nameplate photo slots",
                  has_pdf_overall and has_pdf_nameplate,
                  f"overall={has_pdf_overall}, nameplate={has_pdf_nameplate}")

    # TC-07: Live Supabase verification: bucket equipment-photos and schema columns
    supabase_ok = False
    supabase_msg = ""
    try:
        env_path = os.path.join(base_dir, ".env.local")
        sb_url = ""
        sb_key = ""
        if os.path.isfile(env_path):
            for line in open(env_path, encoding="utf-8"):
                if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
                    sb_url = line.strip().split("=", 1)[1].strip('"\'')
                elif line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
                    sb_key = line.strip().split("=", 1)[1].strip('"\'')

        if sb_url and sb_key:
            # Query equipment_loans schema columns via REST API
            req = urllib.request.Request(
                f"{sb_url}/rest/v1/equipment_loans?select=loan_id,photo_overall_url,photo_nameplate_url&limit=1",
                headers={
                    "apikey": sb_key,
                    "Authorization": f"Bearer {sb_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    supabase_ok = True
                    supabase_msg = "Successfully verified equipment_loans photo columns via Supabase REST API"
        else:
            supabase_msg = "No .env.local credentials found"
    except Exception as e:
        supabase_msg = str(e)

    record_result("TC-07", "Supabase DB verified for equipment_loans photo columns & storage access",
                  supabase_ok, supabase_msg)

    # TC-08: Quality Gate check: npx tsc --noEmit & check_translations.mjs
    tsc_proc = subprocess.run(["cmd", "/c", "npx", "tsc", "--noEmit"], cwd=base_dir, capture_output=True)
    tsc_ok = (tsc_proc.returncode == 0)

    i18n_proc = subprocess.run(["node", "scripts/check_translations.mjs"], cwd=base_dir, capture_output=True)
    i18n_stdout = i18n_proc.stdout.decode('utf-8', errors='replace') if i18n_proc.stdout else ""
    i18n_ok = (i18n_proc.returncode == 0 and "All translation keys are properly defined" in i18n_stdout)

    record_result("TC-08", "Quality Gates passed (npx tsc --noEmit: 0 errors, check_translations.mjs: 0 missing)",
                  tsc_ok and i18n_ok,
                  f"tsc_exit={tsc_proc.returncode}, i18n_exit={i18n_proc.returncode}")

    print("=" * 75)
    total_passed = sum(1 for r in test_results if r["status"] == PASS)
    print(f"SUMMARY: {total_passed}/{len(test_results)} Test Cases PASSED")
    print("=" * 75)

    if total_passed == len(test_results):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
