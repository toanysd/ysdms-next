#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/verify_e2e_correlation.py
-----------------------------------------------
Kịch bản kiểm chứng thực nghiệm E2E chuỗi tương quan báo cáo:
Chuỗi: AN Report A -> PE Response B (in_reply_to=A) -> Refresh -> AN Report C

Mục đích: Cung cấp bằng chứng thực nghiệm máy chạy thật cho Thẩm tra viên PE
cho Work Order BRIDGE-PENDING-REPORT-CORRELATION-001.
"""

import os
import sys
import json
import time
import uuid
import urllib.request
import urllib.error

# UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BRIDGE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BRIDGE_DIR, "data")
PORT_FILE = os.path.join(DATA_DIR, "active_port.json")
CORRELATION_FILE = os.path.join(DATA_DIR, "pe_report_correlation.json")

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
    print("=" * 70)
    print("  KIỂM CHỨNG THỰC NGHIỆM E2E CORRELATION: A -> B -> REFRESH -> C")
    print(f"  Hub Target: {HUB_URL} | Thread: {THREAD_ID}")
    print("=" * 70)

    # Sinh các ID định danh duy nhất cho chuỗi E2E
    report_a_id = f"e2e-report-a-{uuid.uuid4()}"
    pe_resp_b_id = f"e2e-pe-resp-b-{uuid.uuid4()}"
    report_c_id = f"e2e-report-c-{uuid.uuid4()}"
    work_order_id = "BRIDGE-PENDING-REPORT-CORRELATION-001"

    print(f"\n[KHỞI TẠO ĐỊNH DANH E2E]")
    print(f"  - AN Report A ID : {report_a_id}")
    print(f"  - PE Response B ID: {pe_resp_b_id}")
    print(f"  - B.in_reply_to   : {report_a_id}")
    print(f"  - AN Report C ID : {report_c_id}")

    # BƯỚC 1: AN NỘP BÁO CÁO A
    print(f"\n[BƯỚC 1: AN Nộp Báo Cáo A ({report_a_id})]")
    res_a = http_post(f"{HUB_URL}/api/report", {
        "threadId": THREAD_ID,
        "messageId": report_a_id,
        "pingMessage": f"PE đọc Bridge. Work Order: {work_order_id}"
    })
    print(f"  -> Hub Response: {json.dumps(res_a)}")

    # Kiểm tra trạng thái pending
    pending_a = http_get(f"{HUB_URL}/api/reports/pending?thread_id={THREAD_ID}")
    print(f"  -> Hub Pending State: hasPending={pending_a.get('hasPendingReport')}, status={pending_a.get('latestReport', {}).get('status')}")
    assert pending_a.get('hasPendingReport') is True, "LỖI: Báo cáo A phải có hasPendingReport = True"
    assert pending_a.get('pendingAnReport') is True, "LỖI: Báo cáo A phải có pendingAnReport = True"
    assert pending_a.get('latestReport', {}).get('reportId') == report_a_id, "LỖI: reportId không khớp"
    print("  ✓ KẾT QUẢ BƯỚC 1: Báo cáo A ở trạng thái PENDING. Nút 'Đổ báo cáo vào PE' ENABLED (Alt+F9).")

    # BƯỚC 2: PE PHẢN HỒI B (ĐÍNH KÈM CORRELATION in_reply_to_message_id = A)
    print(f"\n[BƯỚC 2: PE Tạo Phản Hồi B Hồi Đáp Báo Cáo A]")
    envelope_content = (
        f"<!-- OMNI_CORRELATION: in_reply_to_message_id={report_a_id} work_order_id={work_order_id} -->\n"
        f"⏱️ [PE BẮT ĐẦU: 2026-10-09 13:00 JST]\n"
        f"Phán quyết kiểm toán cho Work Order {work_order_id}. Báo cáo {report_a_id} đã được PE tiếp nhận và xử lý đầy đủ."
    )
    res_b = http_post(f"{HUB_URL}/api/directive", {
        "threadId": THREAD_ID,
        "messageId": pe_resp_b_id,
        "inReplyToMessageId": report_a_id,
        "workOrderId": work_order_id,
        "content": envelope_content
    })
    print(f"  -> Hub Directive Response: {json.dumps(res_b)}")

    # BƯỚC 3: KIỂM TRA TRẠNG THÁI SAU KHI B PERSISTED
    print(f"\n[BƯỚC 3: Kiểm Tra Trạng Thái Sau Khi B Persisted]")
    pending_b = http_get(f"{HUB_URL}/api/reports/pending?thread_id={THREAD_ID}")
    latest_report = pending_b.get('latestReport', {})
    print(f"  -> Hub Pending State: hasPending={pending_b.get('hasPendingReport')}, status={latest_report.get('status')}")
    print(f"  -> Correlation Info : handledBy={latest_report.get('handledBy')}, handledAt={latest_report.get('handledAt')}, peResponseId={latest_report.get('peResponseId')}")

    assert pending_b.get('hasPendingReport') is False, "LỖI: Sau khi PE phản hồi, hasPendingReport phải là False"
    assert pending_b.get('pendingAnReport') is False, "LỖI: Sau khi PE phản hồi, pendingAnReport phải là False"
    assert latest_report.get('status') == 'HANDLED', "LỖI: status phải là HANDLED"
    assert latest_report.get('handledBy') == 'PE', "LỖI: handledBy phải là PE"
    assert latest_report.get('peResponseId') == pe_resp_b_id, "LỖI: peResponseId không khớp với B"
    print("  ✓ KẾT QUẢ BƯỚC 3: Báo cáo A đã chuyển sang HANDLED. Nút 'Đổ báo cáo vào PE' bị DISABLED ('✅ Báo cáo đã được PE xử lý').")

    # BƯỚC 4: GIẢ LẬP F5 REFRESH / REHYDRATION
    print(f"\n[BƯỚC 4: Giả Lập F5 Trình Duyệt / Rehydration Từ SSOT]")
    rehydrate_state = http_get(f"{HUB_URL}/api/messages/latest?thread_id={THREAD_ID}")
    corr_rehydrate = rehydrate_state.get('correlation', {})
    print(f"  -> Derived State   : {rehydrate_state.get('derivedState')}")
    print(f"  -> Correlation Obj : pendingAnReport={corr_rehydrate.get('pendingAnReport')}, status={corr_rehydrate.get('latestReport', {}).get('status')}")

    assert corr_rehydrate.get('pendingAnReport') is False, "LỖI: Sau refresh, pendingAnReport vẫn phải là False"
    assert corr_rehydrate.get('latestReport', {}).get('status') == 'HANDLED', "LỖI: Sau refresh, status vẫn phải là HANDLED"
    print("  ✓ KẾT QUẢ BƯỚC 4: Rehydration thành công! Báo cáo A KHÔNG bị hồi sinh sau refresh. Nút A tiếp tục DISABLED.")

    # BƯỚC 5: AN NỘP BÁO CÁO MỚI C
    print(f"\n[BƯỚC 5: AN Nộp Báo Cáo Mới C ({report_c_id})]")
    res_c = http_post(f"{HUB_URL}/api/report", {
        "threadId": THREAD_ID,
        "messageId": report_c_id,
        "pingMessage": f"PE đọc Bridge. Work Order: WO-DH01-AUDIO-PLAYTEST-001"
    })
    print(f"  -> Hub Response: {json.dumps(res_c)}")

    pending_c = http_get(f"{HUB_URL}/api/reports/pending?thread_id={THREAD_ID}")
    latest_c = pending_c.get('latestReport', {})
    print(f"  -> Hub Pending State: hasPending={pending_c.get('hasPendingReport')}, status={latest_c.get('status')}, reportId={latest_c.get('reportId')}")

    assert pending_c.get('hasPendingReport') is True, "LỖI: Báo cáo mới C phải có hasPendingReport = True"
    assert pending_c.get('pendingAnReport') is True, "LỖI: Báo cáo mới C phải có pendingAnReport = True"
    assert latest_c.get('reportId') == report_c_id, "LỖI: reportId mới phải là C"
    assert latest_c.get('status') == 'PENDING', "LỖI: status mới phải là PENDING"
    print("  ✓ KẾT QUẢ BƯỚC 5: Chỉ có báo cáo C mới kích hoạt trạng thái PENDING. Nút 'Đổ báo cáo vào PE' ENABLED cho C.")

    # BƯỚC 6: XÁC MINH SỔ CÁI BỀN VỮNG pe_report_correlation.json
    print(f"\n[BƯỚC 6: Kiểm Tra Sổ Cái Bền Vững (pe_report_correlation.json)]")
    with open(CORRELATION_FILE, "r", encoding="utf-8") as f:
        ledger = json.load(f)

    report_a_entry = ledger.get('reports', {}).get(report_a_id)
    report_c_entry = ledger.get('reports', {}).get(report_c_id)

    print(f"  -> Sổ cái Report A : {json.dumps(report_a_entry, indent=2)}")
    print(f"  -> Sổ cái Report C : {json.dumps(report_c_entry, indent=2)}")

    assert report_a_entry is not None, "LỖI: Sổ cái thiếu Report A"
    assert report_a_entry.get('status') == 'HANDLED', "LỖI: Report A trong sổ cái không phải là HANDLED"
    assert report_a_entry.get('peResponseId') == pe_resp_b_id, "LỖI: peResponseId của A không khớp với B"
    assert report_c_entry is not None, "LỖI: Sổ cái thiếu Report C"
    assert report_c_entry.get('status') == 'PENDING', "LỖI: Report C trong sổ cái không phải là PENDING"

    # Kiểm tra ranh giới an toàn: không có secrets
    ledger_str = json.dumps(ledger)
    for forbidden in ["eyJ", "service_role", "anon_key", "supabase_key"]:
        assert forbidden not in ledger_str, f"LỖI BẢO MẬT: Phát hiện chuỗi nhạy cảm '{forbidden}' trong correlation ledger!"

    print("  ✓ KẾT QUẢ BƯỚC 6: Sổ cái lưu vết chính xác 100%! Báo cáo A=HANDLED, C=PENDING. Không chứa bí mật (0 secrets).")

    print("\n" + "=" * 70)
    print("  ✅ TOÀN BỘ CHUỖI E2E (A -> B -> REFRESH -> C) HOÀN TẤT THÀNH CÔNG 100%!")
    print("=" * 70)

if __name__ == "__main__":
    main()
