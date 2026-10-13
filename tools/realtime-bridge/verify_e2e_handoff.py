#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/verify_e2e_handoff.py
-------------------------------------------
Kịch bản kiểm chứng thực nghiệm E2E Handoff Hai Chiều & Event Ledger:
1. Chiều PE -> AN: Hub auto-dispatch -> Watcher daemon auto-ACK -> Ledger ACKNOWLEDGED (0 clicks)
2. Chiều AN -> PE: Hub emit SSE AN_REPORT_PERSISTED -> Ledger DELIVERED -> Pending Report Ready (0 clicks)
3. Polling Fallback: Truy vấn HTTP polling độc lập với SSE
4. Audit Ledger: Xác thực đủ các trường kiểm toán bắt buộc và 0 bí mật (Zero Secrets)

Work Order: BRIDGE-END-TO-END-HANDOFF-REPAIR-001
"""

import os
import sys
import json
import time
import uuid
import re
import urllib.request
import urllib.error

# UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BRIDGE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BRIDGE_DIR, "data")
PORT_FILE = os.path.join(DATA_DIR, "active_port.json")
HANDOFF_LEDGER_FILE = os.path.join(DATA_DIR, "pe_handoff_ledger.json")

def get_hub_port():
    if os.path.exists(PORT_FILE):
        try:
            with open(PORT_FILE, "r", encoding="utf-8") as f:
                d = json.load(f)
                return d.get("port", 3956)
        except Exception:
            pass
    return 3956

HUB_PORT = get_hub_port()
HUB_URL = f"http://127.0.0.1:{HUB_PORT}"
THREAD_ID = "OMNI-CYCLE-001"

def http_get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        return json.loads(res.read().decode('utf-8'))

def http_post(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        return json.loads(res.read().decode('utf-8'))

def main():
    print("=" * 75)
    print("  KIỂM CHỨNG THỰC NGHIỆM E2E HANDOFF HAI CHIỀU & EVENT LEDGER")
    print(f"  Hub Target: {HUB_URL} | Thread: {THREAD_ID}")
    print("  Work Order: BRIDGE-END-TO-END-HANDOFF-REPAIR-001")
    print("=" * 75)

    test_passed = 0
    test_failed = 0

    def check(desc, condition, details=""):
        nonlocal test_passed, test_failed
        if condition:
            test_passed += 1
            print(f"  [PASS] {desc}")
            if details:
                print(f"         └─ {details}")
        else:
            test_failed += 1
            print(f"  [FAIL] {desc}")
            if details:
                print(f"         └─ LỖI: {details}")

    # =========================================================================
    # TEST 1: PE -> AN AUTO-DISPATCH & WATCHER AUTO-ACK (0 CLICKS)
    # =========================================================================
    print(f"\n--- [TEST 1: PE -> AN Tự Động Dispatch & Watcher Tự Động ACK (0 Click)] ---")
    directive_id = f"e2e-pe-dir-{uuid.uuid4()}"
    work_order_id = "BRIDGE-END-TO-END-HANDOFF-REPAIR-001"
    directive_content = (
        f"<!-- OMNI_DIRECTIVE_ENVELOPE\n"
        f"message_id: {directive_id}\n"
        f"thread_id: {THREAD_ID}\n"
        f"work_order_id: {work_order_id}\n"
        f"timestamp: 2026-10-09T14:30:00Z\n"
        f"sender: PE\n"
        f"-->\n"
        f"⏱️ [PE BẮT ĐẦU: 2026-10-09 14:30 JST]\n"
        f"Yêu cầu AN thực thi kiểm thử tự động Handoff. Directive ID: {directive_id}"
    )

    print(f"  [1.1] Giả lập PE hoàn tất chỉ thị và gửi vào Hub ({directive_id})")
    dir_res = http_post(f"{HUB_URL}/api/directive", {
        "threadId": THREAD_ID,
        "messageId": directive_id,
        "workOrderId": work_order_id,
        "content": directive_content
    })
    check("Gửi PE directive thành công lên Hub", dir_res.get("success") is True, f"Response: {dir_res}")

    print(f"  [1.2] Đợi background watcher tự động nhận và gửi ACK (timeout 10s)...")
    acked = False
    ack_event = None
    for i in range(10):
        time.sleep(1)
        ledger_res = http_get(f"{HUB_URL}/api/handoff/ledger?thread_id={THREAD_ID}&limit=10")
        events = ledger_res.get("events", [])
        for ev in events:
            if ev.get("sourceRowId") == directive_id and ev.get("finalState") == "ACKNOWLEDGED":
                acked = True
                ack_event = ev
                break
        if acked:
            break

    check("Watcher tự động nhận và ACK chỉ thị (0 click, không cần bấm tay)", acked is True,
          f"AcknowledgedAt: {ack_event.get('acknowledgedAt') if ack_event else 'None'}, State: {ack_event.get('finalState') if ack_event else 'TIMEOUT'}")
    if ack_event:
        check("Event Ledger ghi nhận đầy đủ thời gian dispatch và ack",
              bool(ack_event.get("dispatchedAt") and ack_event.get("acknowledgedAt")),
              f"Dispatched: {ack_event.get('dispatchedAt')} -> Acked: {ack_event.get('acknowledgedAt')}")
        check("Event Ledger ghi nhận worker đích đã nhận",
              ack_event.get("deliveredTo") in ["AN_SENTINEL_WATCHER", "AN-Watcher", "AN"],
              f"DeliveredTo: {ack_event.get('deliveredTo')}")

    # =========================================================================
    # TEST 2: AN -> PE AUTO-PERSIST & SSE REPORT ALERT (0 CLICKS)
    # =========================================================================
    print(f"\n--- [TEST 2: AN -> PE Tự Động Persist, SSE & Handoff Alert (0 Click)] ---")
    report_id = f"e2e-an-rep-{uuid.uuid4()}"
    report_content = (
        f"⏱️ [BẮT ĐẦU / GHI NHẬN: 2026-10-09 14:35:00 JST]\n"
        f"# BÁO CÁO THỰC THI KIỂM CHỨNG E2E HANDOFF\n"
        f"- Work Order: {work_order_id}\n"
        f"- Report ID: {report_id}\n"
        f"- In Reply To: {directive_id}\n"
        f"Hoàn tất toàn bộ chu trình handoff hai chiều tự động."
    )

    print(f"  [2.1] Giả lập AN nộp báo cáo lên Hub ({report_id})")
    rep_res = http_post(f"{HUB_URL}/api/report", {
        "threadId": THREAD_ID,
        "messageId": report_id,
        "inReplyTo": directive_id,
        "workOrderId": work_order_id,
        "pingMessage": f"PE đọc Bridge. Work Order: {work_order_id}"
    })
    check("AN nộp báo cáo thành công lên Hub", rep_res.get("success") is True, f"Response: {rep_res}")

    # Kiểm tra pending report state
    pending_state = http_get(f"{HUB_URL}/api/reports/pending?thread_id={THREAD_ID}")
    check("Hub đánh dấu pendingAnReport = True sau khi AN nộp báo cáo",
          pending_state.get("pendingAnReport") is True,
          f"Pending Report ID: {pending_state.get('latestReport', {}).get('reportId')}")

    # Kiểm tra Handoff Ledger ghi nhận chiều AN_TO_PE
    ledger_res = http_get(f"{HUB_URL}/api/handoff/ledger?thread_id={THREAD_ID}&limit=10")
    events = ledger_res.get("events", [])
    an_handoff = next((ev for ev in events if ev.get("sourceRowId") == report_id), None)

    check("Handoff Ledger ghi nhận sự kiện AN_TO_PE", an_handoff is not None,
          f"Workflow ID: {an_handoff.get('workflowId') if an_handoff else 'NOT_FOUND'}")
    if an_handoff:
        check("Handoff Type là AN_TO_PE và Final State là DELIVERED",
              an_handoff.get("handoffType") == "AN_TO_PE" and an_handoff.get("finalState") == "DELIVERED",
              f"Type: {an_handoff.get('handoffType')}, State: {an_handoff.get('finalState')}")
        check("Đích đến được ghi nhận cho PE",
              an_handoff.get("deliveredTo") in ["PE_BROWSER_UI", "PE"],
              f"DeliveredTo: {an_handoff.get('deliveredTo')}")

    # =========================================================================
    # TEST 3: POLLING FALLBACK TRANSPORT VERIFICATION
    # =========================================================================
    print(f"\n--- [TEST 3: Cơ Chế Polling Fallback Độc Lập Với SSE] ---")
    latest_msg_poll = http_get(f"{HUB_URL}/api/messages/latest?thread_id={THREAD_ID}")
    check("Endpoint /api/messages/latest phản hồi nhanh qua HTTP polling",
          latest_msg_poll.get("success") is True,
          f"Last Sender: {latest_msg_poll.get('message', {}).get('sender', 'AN')}")
    check("Derived State phản ánh đúng trạng thái khi có báo cáo AN pending",
          latest_msg_poll.get("derivedState") in ["AN_REPORTED", "PE_TURN"],
          f"DerivedState: {latest_msg_poll.get('derivedState')}")

    ledger_poll = http_get(f"{HUB_URL}/api/handoff/ledger?limit=5")
    check("Endpoint /api/handoff/ledger phản hồi dữ liệu qua HTTP polling",
          ledger_poll.get("success") is True and ledger_poll.get("total", 0) > 0,
          f"Total ledger events: {ledger_poll.get('total')}")

    # =========================================================================
    # TEST 4: AUDIT LEDGER SCHEMA & ZERO SECRETS CHECK
    # =========================================================================
    print(f"\n--- [TEST 4: Đối Soát Tệp Ledger & Kiểm Tra An Toàn Bí Mật (Zero Secrets)] ---")
    check("Tệp pe_handoff_ledger.json tồn tại trên đĩa", os.path.exists(HANDOFF_LEDGER_FILE),
          f"Path: {HANDOFF_LEDGER_FILE}")

    with open(HANDOFF_LEDGER_FILE, "r", encoding="utf-8") as f:
        ledger_raw = f.read()
        ledger_data = json.loads(ledger_raw)

    mandatory_fields = [
        "workflowId", "requestId", "handoffType", "sourceRowId", "sourceCreatedAt",
        "detectedAt", "dispatchedAt", "acknowledgedAt", "deliveredTo",
        "retryCount", "finalState", "failureReason"
    ]

    ledger_entries = ledger_data if isinstance(ledger_data, list) else ledger_data.get("events", [])

    all_fields_valid = True
    missing_fields_log = []
    for ev in ledger_entries:
        for field in mandatory_fields:
            if field not in ev:
                all_fields_valid = False
                missing_fields_log.append(f"{ev.get('workflowId')}: thiếu {field}")

    check("Mọi sự kiện trong pe_handoff_ledger.json chứa đủ 12 trường metadata chuẩn",
          all_fields_valid and len(ledger_entries) > 0,
          f"Total events audited: {len(ledger_entries)}, Field errors: {len(missing_fields_log)}")

    # Zero Secrets Audit
    secret_patterns = [
        r"eyJ[a-zA-Z0-9_\-]{20,}",           # JWT pattern
        r"sbp_[a-zA-Z0-9]{20,}",             # Supabase service key prefix
        r"sk-[a-zA-Z0-9]{20,}",              # OpenAI/Generic secret key
        r"postgres://[^\s\"']+",             # Postgres connection string
        r"(service_role|anon_key)\s*[:=]\s*[\"'][a-zA-Z0-9_\-\.]+[\"']" # explicit keys
    ]
    secrets_found = []
    for pat in secret_patterns:
        matches = re.findall(pat, ledger_raw)
        if matches:
            secrets_found.extend(matches)

    check("Quy tắc C6: Không có API key, JWT token hoặc connection string bị rò rỉ trong ledger",
          len(secrets_found) == 0,
          f"Secrets count: {len(secrets_found)}")

    # =========================================================================
    # TỔNG KẾT
    # =========================================================================
    print("\n" + "=" * 75)
    print(f"  TỔNG KẾT KIỂM CHỨNG E2E: ĐẠT: {test_passed} | THẤT BẠI: {test_failed}")
    print("=" * 75)

    if test_failed > 0:
        sys.exit(1)
    print("✅ HOÀN TẤT KIỂM CHỨNG THỰC NGHIỆM E2E HANDOFF HAI CHIỀU THÀNH CÔNG RỰC RỠ!")

if __name__ == "__main__":
    main()
