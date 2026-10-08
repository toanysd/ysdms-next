#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automated Test Suite for WO-BRIDGE-HARDENING
Kiểm thử toàn diện 8 yêu cầu kỹ thuật cứng hóa Bridge PE-AN.
"""

import os
import sys
import time
import json
import socket
import urllib.request
import urllib.error
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT_DIR, '.agents')

# Đọc cấu hình
port_file = os.path.join(AGENTS_DIR, 'hub_port.json')
token_file = os.path.join(AGENTS_DIR, 'hub_token.json')
audit_file = os.path.join(AGENTS_DIR, 'bridge_audit.log')

def get_hub_info():
    port = 3456
    host = '127.0.0.1'
    token = ''
    if os.path.exists(port_file):
        try:
            with open(port_file, 'r', encoding='utf-8') as f:
                d = json.load(f)
                port = d.get('port', 3456)
                host = d.get('host', '127.0.0.1')
                token = d.get('token', '')
        except:
            pass
    if not token and os.path.exists(token_file):
        try:
            with open(token_file, 'r', encoding='utf-8') as f:
                token = json.load(f).get('token', '')
        except:
            pass
    return host, port, token

results = []

def record(test_id, name, passed, details=""):
    status = "PASS ✅" if passed else "FAIL ❌"
    results.append({"id": test_id, "name": name, "passed": passed, "details": details})
    print(f"[{status}] {test_id}: {name}")
    if details:
        print(f"       Chi tiết: {details}")

print("=" * 65)
print("🚀 BẮT ĐẦU TEST SUITE: WO-BRIDGE-HARDENING")
print("=" * 65)

host, port, token = get_hub_info()
base_url = f"http://{host}:{port}"
print(f"Target Hub: {base_url} (Token: {token[:8]}...)")

# TC-01: Network Binding (Chỉ 127.0.0.1)
try:
    # Thử kết nối tới 127.0.0.1
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    s.connect((host, port))
    s.close()
    
    # Kiểm tra status endpoint
    req = urllib.request.Request(f"{base_url}/api/status")
    with urllib.request.urlopen(req, timeout=3) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        is_loopback = (data.get('host') == '127.0.0.1')
        record("TC-01", "Localhost Network Binding (127.0.0.1 only)", is_loopback, f"Host report: {data.get('host')}, Port: {data.get('port')}")
except Exception as e:
    record("TC-01", "Localhost Network Binding", False, f"Lỗi kết nối Hub: {e}")

# TC-02: Auth Token Protection on /api/wait_directive
try:
    # Request KHÔNG CÓ token -> Phải bị 401
    req = urllib.request.Request(f"{base_url}/api/wait_directive")
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            record("TC-02", "Token Auth Check (Unauthorized Rejection)", False, "Request không token vẫn thành công (Lỗ hổng)")
    except urllib.error.HTTPError as e:
        if e.code == 401:
            record("TC-02", "Token Auth Check (Unauthorized Rejection)", True, f"Bị chặn đúng chuẩn HTTP {e.code} khi thiếu token")
        else:
            record("TC-02", "Token Auth Check", False, f"Mã lỗi không mong muốn: {e.code}")
except Exception as e:
    record("TC-02", "Token Auth Check", False, str(e))

# TC-03: Anti-forgery check (Từ chối message giả không có trong DB)
try:
    fake_payload = json.dumps({
        "messageId": "00000000-0000-0000-0000-000000000000",
        "threadId": "FAKE-THREAD",
        "directiveText": "Fake malicious instruction"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{base_url}/api/directive",
        data=fake_payload,
        headers={"Content-Type": "application/json", "x-bridge-token": token}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            record("TC-03", "Anti-Forgery: Reject Non-Existent message_id", False, "Message giả mạo không bị chặn")
    except urllib.error.HTTPError as e:
        if e.code == 400:
            record("TC-03", "Anti-Forgery: Reject Non-Existent message_id", True, f"Bị chặn đúng chuẩn HTTP 400 (Anti-forgery active)")
        else:
            record("TC-03", "Anti-Forgery Check", False, f"Mã lỗi: {e.code}")
except Exception as e:
    record("TC-03", "Anti-Forgery Check", False, str(e))

# TC-04: Idempotency & Deduplication
try:
    real_mid = "8c5751f2-5520-4898-bbe9-2f952bc34037" # Lệnh thật từ PE
    payload = json.dumps({
        "messageId": real_mid,
        "threadId": "WO-BRIDGE-HARDENING",
        "directiveText": "Legitimate PE instruction"
    }).encode('utf-8')

    req1 = urllib.request.Request(
        f"{base_url}/api/directive",
        data=payload,
        headers={"Content-Type": "application/json", "x-bridge-token": token}
    )
    # Lần 1
    with urllib.request.urlopen(req1, timeout=5) as resp1:
        res1 = json.loads(resp1.read().decode('utf-8'))

    # Lần 2 (Trùng lặp ngay sau đó)
    req2 = urllib.request.Request(
        f"{base_url}/api/directive",
        data=payload,
        headers={"Content-Type": "application/json", "x-bridge-token": token}
    )
    with urllib.request.urlopen(req2, timeout=5) as resp2:
        res2 = json.loads(resp2.read().decode('utf-8'))
        is_idempotent = ("Idempotent" in res2.get('message', '') or "processed" in res2.get('message', ''))
        record("TC-04", "Idempotency & Deduplication (Chống gửi trùng)", is_idempotent, f"Response lần 2: {res2.get('message')}")
except Exception as e:
    record("TC-04", "Idempotency & Deduplication", False, str(e))

# TC-05: Report endpoint & SSE trigger
try:
    report_payload = json.dumps({
        "threadId": "WO-BRIDGE-HARDENING",
        "pingMessage": "Test AN report"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{base_url}/api/report",
        data=report_payload,
        headers={"Content-Type": "application/json", "x-bridge-token": token}
    )
    with urllib.request.urlopen(req, timeout=3) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        record("TC-05", "Report Delivery & SSE Broadcast", res.get('success') == True, f"Broadcasted to {res.get('broadcastedTo')} client(s)")
except Exception as e:
    record("TC-05", "Report Delivery", False, str(e))

# TC-06: Userscript Safety Verification (Static Code Audit)
try:
    script_path = os.path.join(ROOT_DIR, 'docs', 'realtime-bridge', 'Bridge_Userscript_v3.11.js')
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    has_default_off = "localStorage.getItem('pe_an_auto_forward') === 'true'" in content
    no_auto_submit = "sendButton.click()" not in content
    has_token_support = "x-bridge-token" in content
    
    passed = has_default_off and no_auto_submit and has_token_support
    details = f"Default OFF: {has_default_off} | No Auto-Submit: {no_auto_submit} | Token Header: {has_token_support}"
    record("TC-06", "Userscript Safety Audit (Default OFF, No Auto-Submit)", passed, details)
except Exception as e:
    record("TC-06", "Userscript Safety Audit", False, str(e))

# TC-07: Audit Log Verification
try:
    has_audit = os.path.exists(audit_file)
    entry_count = 0
    if has_audit:
        with open(audit_file, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f if l.strip()]
            entry_count = len(lines)
    record("TC-07", "Structured Audit Log (.agents/bridge_audit.log)", (has_audit and entry_count > 0), f"Log exists with {entry_count} entries recorded.")
except Exception as e:
    record("TC-07", "Audit Log Verification", False, str(e))

print("=" * 65)
all_passed = all(r['passed'] for r in results)
print(f"KẾT QUẢ TEST SUITE: {'TẤT CẢ TEST ĐỀU ĐẠT (100% PASS)' if all_passed else 'CÓ TEST THẤT BẠI'}")
print(f"Tổng số test: {len(results)} | Đạt: {sum(1 for r in results if r['passed'])} | Thất bại: {sum(1 for r in results if not r['passed'])}")
print("=" * 65)

sys.exit(0 if all_passed else 1)
