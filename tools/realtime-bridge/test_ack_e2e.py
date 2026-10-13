#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/test_ack_e2e.py
Kiểm thử chuỗi Acknowledgment thực tế qua HTTP endpoints của Hub (:3956).
"""

import sys
import urllib.request
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run():
    print("[1] Kiểm tra endpoint /api/ack...")
    url = "http://127.0.0.1:3956/api/ack"
    test_req_id = f"test-req-{int(time.time()*1000)}"
    test_msg_id = f"test-pe-{int(time.time()*1000)}"
    payload = json.dumps({
        "requestId": test_req_id,
        "peMessageId": test_msg_id,
        "worker": "TEST_RUNNER",
        "ackTimestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            assert res.status == 200, f"Expected 200, got {res.status}"
            data = json.loads(res.read().decode("utf-8"))
            print(f"  ✓ PASS: /api/ack phản hồi 200 OK")
            print(f"  ✓ Data: {data}")
            assert data.get("success") is True
            assert data.get("requestId") == test_req_id
            assert data.get("peMessageId") == test_msg_id
            print(f"  ✓ PASS: Acknowledgment payload hợp lệ 100%!")
    except Exception as e:
        print(f"  ✗ FAIL: {e}")
        return False

    return True

if __name__ == "__main__":
    ok = run()
    exit(0 if ok else 1)
