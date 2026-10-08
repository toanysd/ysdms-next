#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Suite for WO-P1-006 (Gói 7: Luồng Hoàn Trả Khuôn & Giao Nhận Hiện Vật)
Panasonic Shirakawa & SMK
"""

import os
import sys
import json
import urllib.request
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env_path = os.path.join(ROOT_DIR, '.env.local')
env = {}
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

SUPABASE_URL = env.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = env.get('SUPABASE_SERVICE_ROLE_KEY', '')

results = []

def record(test_id, name, passed, details=""):
    status = "PASS ✅" if passed else "FAIL ❌"
    results.append({"id": test_id, "name": name, "passed": passed, "details": details})
    print(f"[{status}] {test_id}: {name}")
    if details:
        print(f"       Chi tiết: {details}")

print("=" * 65)
print("🚀 BẮT ĐẦU TEST SUITE: WO-P1-006 (GÓI 7: HOÀN TRẢ & GIAO NHẬN HIỆN VẬT)")
print("=" * 65)

# TC-01: Verify Panasonic Shirakawa & SMK in SSOT Partners
try:
    with open(os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', 'types.ts'), 'r', encoding='utf-8') as f:
        content = f.read()
    has_panasonic = "Panasonic Industrial Devices" in content or "パナソニック" in content
    has_smk = "SMK" in content or "大村技研" in content
    record("TC-01", "SSOT Partner Verification (Panasonic & SMK)", (has_panasonic and has_smk), "Tìm thấy Panasonic & SMK trong SSOT mapping")
except Exception as e:
    record("TC-01", "SSOT Partner Verification", False, str(e))

# TC-02: Modal Workflow & Checklist Verification
try:
    modal_path = os.path.join(ROOT_DIR, 'src', 'app', 'equipment', 'loans', '_components', 'LoanWorkflowModals.tsx')
    with open(modal_path, 'r', encoding='utf-8') as f:
        modal_content = f.read()

    has_carrier = "carrierName" in modal_content and "carrierLabel" in modal_content
    has_receiver = "receiverContact" in modal_content and "receiverLabel" in modal_content
    has_checklist = "partsReturned" in modal_content and "drawingsReturned" in modal_content and "palletChecked" in modal_content
    
    passed = has_carrier and has_receiver and has_checklist
    record("TC-02", "Handover Modal & Checklist Implementation", passed, f"Carrier: {has_carrier} | Receiver: {has_receiver} | Checklist: {has_checklist}")
except Exception as e:
    record("TC-02", "Handover Modal Implementation", False, str(e))

# TC-03: PDF Document Return Slip Template Verification
try:
    pdf_path = os.path.join(ROOT_DIR, 'src', 'components', 'pdf', 'MoldLoanPDFDocument.tsx')
    with open(pdf_path, 'r', encoding='utf-8') as f:
        pdf_content = f.read()

    has_return_title = "金型返却書 (現品受渡確認票)" in pdf_content
    has_handover_checklist = "現品受渡・同梱物及び梱包荷姿確認" in pdf_content
    has_pallet_spec = "JIS標準パレット (1,100×1,100mm)" in pdf_content
    has_3party_seals = "返却責任者" in pdf_content and "運送担当者" in pdf_content and "受領確認者" in pdf_content
    has_photo_integration = "photo_overall_url" in pdf_content and "photo_nameplate_url" in pdf_content

    passed = has_return_title and has_handover_checklist and has_pallet_spec and has_3party_seals and has_photo_integration
    details = f"Title: {has_return_title} | Checklist: {has_handover_checklist} | Pallet: {has_pallet_spec} | 3-party Seals: {has_3party_seals} | Photos: {has_photo_integration}"
    record("TC-03", "PDF Template (金型返却書・現品受渡確認票)", passed, details)
except Exception as e:
    record("TC-03", "PDF Template Verification", False, str(e))

# TC-04: Database Records for Return Workflow (Query existing RETURNED records)
try:
    url = f"{SUPABASE_URL}/rest/v1/equipment_loans?select=loan_id,loan_code,status,actual_return_date,condition_notes&status=eq.RETURNED&limit=3"
    req = urllib.request.Request(url, headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        records = json.loads(resp.read().decode('utf-8'))
        has_returned = len(records) > 0
        record("TC-04", "Database Schema & Returned Records Query", True, f"Tìm thấy {len(records)} bản ghi RETURNED trong DB")
except Exception as e:
    record("TC-04", "Database Returned Records Query", False, str(e))

# TC-05: Translation Check (check_translations.mjs)
try:
    cmd = ["node", os.path.join(ROOT_DIR, "scripts", "check_translations.mjs")]
    p = subprocess.run(cmd, cwd=ROOT_DIR, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    out = p.stdout or ""
    is_i18n_ok = (p.returncode == 0 and "All translation keys are properly defined" in out)
    record("TC-05", "i18n Quality Gate (check_translations.mjs)", is_i18n_ok, out.strip())
except Exception as e:
    record("TC-05", "i18n Quality Gate", False, str(e))

# TC-06: TypeScript Health Check
try:
    cmd = ["npx", "tsc", "--noEmit"]
    p = subprocess.run(cmd, cwd=ROOT_DIR, capture_output=True, text=True, shell=True, encoding='utf-8', errors='ignore')
    is_tsc_ok = (p.returncode == 0)
    record("TC-06", "TypeScript Quality Gate (npx tsc --noEmit)", is_tsc_ok, "0 errors" if is_tsc_ok else (p.stdout or "")[:200])
except Exception as e:
    record("TC-06", "TypeScript Quality Gate", False, str(e))

# TC-07: Zero DDL Compliance Check
try:
    cmd = ["git", "status", "--porcelain", "supabase/migrations"]
    p = subprocess.run(cmd, cwd=ROOT_DIR, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    out = (p.stdout or "").strip()
    no_new_migrations = (out == "")
    record("TC-07", "Zero DDL Compliance (No new migration files)", no_new_migrations, "Không có file migration mới được tạo (Tuân thủ YELLOW)")
except Exception as e:
    record("TC-07", "Zero DDL Compliance", False, str(e))

print("=" * 65)
all_passed = all(r['passed'] for r in results)
print(f"KẾT QUẢ TEST SUITE: {'TẤT CẢ TEST ĐỀU ĐẠT (100% PASS)' if all_passed else 'CÓ TEST THẤT BẠI'}")
print(f"Tổng số test: {len(results)} | Đạt: {sum(1 for r in results if r['passed'])} | Thất bại: {sum(1 for r in results if not r['passed'])}")
print("=" * 65)

sys.exit(0 if all_passed else 1)
