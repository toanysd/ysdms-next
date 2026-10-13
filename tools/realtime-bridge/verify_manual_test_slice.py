#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/verify_manual_test_slice.py
-------------------------------------------------
Kịch bản kiểm thử tự động toàn diện cho lát cắt:
- Nút "Gửi cho PE" (Kiểm tra 3 chặng: Tới Hub -> Điền ô chat PE -> Gửi trong chat)
- Nút "Gửi cho AN" (Kiểm tra 3 chặng: Tới Hub -> Ghi Inbox & Báo chuông -> Watcher ACK)
- Mã test theo dõi thống nhất (Unified Test Tracking ID)
- Không phụ thuộc Supabase hay bộ lọc từ khóa/thread cứng nhắc
"""

import os
import sys
import time
import json
import re
import subprocess
import urllib.request
import urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BRIDGE_DIR = os.path.dirname(os.path.abspath(__file__))
INBOX_JSON = os.path.join(ROOT_DIR, ".agents", "PE_INBOX_LATEST.json")
INBOX_MD = os.path.join(ROOT_DIR, ".agents", "PE_INBOX_LATEST.md")
TEST_PORT = 3988

def http_post(url, payload_dict, timeout=5):
    data = json.dumps(payload_dict).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def http_get(url, timeout=5):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.status, json.loads(res.read().decode("utf-8"))

def run_tests():
    print("=================================================================")
    print("  KIỂM THỬ LÁT CẮT: HAI NÚT TEST 'GỬI PE' VÀ 'GỬI AN'")
    print("  Đặc tả: Tách rõ 3 chặng, mã test theo dõi, độc lập bộ lọc")
    print("=================================================================\n")

    hub_script = os.path.join(BRIDGE_DIR, "omni_realtime_hub.cjs")
    print(f"[*] 1. Khởi động Hub thử nghiệm trên cổng {TEST_PORT}...")
    env = os.environ.copy()
    env["OMNI_BRIDGE_PORT"] = str(TEST_PORT)
    use_shell = (os.name == "nt")
    hub_proc = subprocess.Popen(
        ["node", hub_script, str(TEST_PORT)],
        env=env,
        cwd=BRIDGE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        shell=use_shell
    )

    # Chờ Hub khởi động
    time.sleep(1.8)
    if hub_proc.poll() is not None:
        out, err = hub_proc.communicate()
        print(f"[!] Không thể khởi động Hub: {err}")
        return False

    passed = 0
    failed = 0

    def check(name, cond, details=""):
        nonlocal passed, failed
        if cond:
            print(f"  ✓ ĐẠT: {name}")
            passed += 1
        else:
            print(f"  ✗ LỖI: {name} ({details})")
            failed += 1

    try:
        hub_url = f"http://127.0.0.1:{TEST_PORT}"

        # Kiểm tra Hub Status
        status_code, status_data = http_get(f"{hub_url}/api/status")
        check("Hub trả về HTTP 200 tại /api/status", status_code == 200)
        check("Hub báo trạng thái 'online'", status_data.get("status") == "online")

        # -----------------------------------------------------------------
        # TEST CASE 1: LÁT CẮT GỬI THỦ CÔNG CHO PE
        # -----------------------------------------------------------------
        print("\n--- [TEST CASE 1: Nút Gửi Cho PE (3 Chặng)] ---")
        test_pe_id = f"test-pe-verify-{int(time.time()*1000)}"
        pe_text = "Nội dung kiểm tra gửi cho PE từ Minh Chủ."

        # Chặng 1: Gửi tới Hub
        code, res1 = http_post(f"{hub_url}/api/send/pe", {
            "testId": test_pe_id,
            "text": pe_text,
            "autoSubmit": False
        })
        check("Gửi tới /api/send/pe trả về HTTP 200", code == 200)
        check("Hub trả về stage = 'HUB_RECEIVED'", res1.get("stage") == "HUB_RECEIVED")
        check("Hub bảo lưu đúng testId", res1.get("testId") == test_pe_id)

        # Kiểm tra status lưu vết ở Hub
        code, st1 = http_get(f"{hub_url}/api/test/status?test_id={test_pe_id}")
        check("Tra cứu /api/test/status trả về HTTP 200", code == 200)
        t_data = st1.get("test", {})
        check("Chặng 1 (Hub) ghi nhận status = 'DONE'", t_data.get("stage1_hub", {}).get("status") == "DONE")
        check("Chặng 2 (Delivered) đang ở trạng thái 'PENDING'", t_data.get("stage2_delivered", {}).get("status") == "PENDING")

        # Chặng 2: Userscript mô phỏng điền vào ô chat PE
        code, res2 = http_post(f"{hub_url}/api/test/stage-update", {
            "testId": test_pe_id,
            "stage": "PE_INJECTED"
        })
        check("Userscript báo PE_INJECTED thành công", code == 200)
        code, st2 = http_get(f"{hub_url}/api/test/status?test_id={test_pe_id}")
        check("Chặng 2 (Điền chat PE) cập nhật status = 'DONE'", st2.get("test", {}).get("stage2_delivered", {}).get("status") == "DONE")

        # Chặng 3: Userscript mô phỏng đã gửi trong chat
        code, res3 = http_post(f"{hub_url}/api/test/stage-update", {
            "testId": test_pe_id,
            "stage": "PE_SUBMITTED"
        })
        check("Userscript báo PE_SUBMITTED thành công", code == 200)
        code, st3 = http_get(f"{hub_url}/api/test/status?test_id={test_pe_id}")
        check("Chặng 3 (Gửi chat PE) cập nhật status = 'DONE'", st3.get("test", {}).get("stage3_completed", {}).get("status") == "DONE")

        # -----------------------------------------------------------------
        # TEST CASE 2: LÁT CẮT GỬI THỦ CÔNG CHO AN
        # -----------------------------------------------------------------
        print("\n--- [TEST CASE 2: Nút Gửi Cho AN (3 Chặng)] ---")
        test_an_id = f"test-an-verify-{int(time.time()*1000)}"
        an_text = "Chỉ thị test kiểm tra chuyển giao sang AN: Đọc file và xác nhận."
        custom_thread = "CUSTOM-PROJECT-SLICE-001"

        # Chặng 1 & 2: Gửi tới Hub -> Hub ghi Inbox & phát chuông
        code, res_an = http_post(f"{hub_url}/api/send/an", {
            "testId": test_an_id,
            "text": an_text,
            "threadId": custom_thread
        })
        check("Gửi tới /api/send/an trả về HTTP 200", code == 200)
        check("Hub trả về stage = 'INBOX_WRITTEN_AND_BEEPED'", res_an.get("stage") == "INBOX_WRITTEN_AND_BEEPED")
        check("Hub thông báo sẵn sàng để Thoan dán vào Antigravity", "Antigravity" in res_an.get("message", ""))

        # Kiểm tra file inbox thực tế trên đĩa
        check("Tệp .agents/PE_INBOX_LATEST.json tồn tại", os.path.exists(INBOX_JSON))
        with open(INBOX_JSON, "r", encoding="utf-8") as f:
            inbox_data = json.load(f)
        check("Inbox JSON lưu đúng messageId test", inbox_data.get("messageId") == test_an_id)
        check("Inbox JSON lưu đúng directiveText", inbox_data.get("directiveText") == an_text)
        check("Inbox JSON có cờ isTest = True", inbox_data.get("isTest") is True)
        check("Inbox JSON lưu đúng custom thread_id (không bị ràng buộc OMNI-)", inbox_data.get("threadId") == custom_thread)

        check("Tệp .agents/PE_INBOX_LATEST.md tồn tại", os.path.exists(INBOX_MD))
        with open(INBOX_MD, "r", encoding="utf-8") as f:
            md_content = f.read()
        check("Inbox MD chứa nội dung test", an_text in md_content)

        # Kiểm tra status lưu vết ở Hub
        code, st_an1 = http_get(f"{hub_url}/api/test/status?test_id={test_an_id}")
        t_an_data = st_an1.get("test", {})
        check("Chặng 1 (Hub) ghi nhận status = 'DONE'", t_an_data.get("stage1_hub", {}).get("status") == "DONE")
        check("Chặng 2 (Đưa vào Inbox) ghi nhận status = 'DONE'", t_an_data.get("stage2_delivered", {}).get("status") == "DONE")
        check("Chặng 3 (AN ACK) đang chờ ('PENDING')", t_an_data.get("stage3_completed", {}).get("status") == "PENDING")

        # Chặng 3: Sentinel Watcher ACK
        # Kiểm tra trực tiếp watcher logic với mã test (không bị từ chối)
        from watch_directive import send_explicit_ack
        ack_success = send_explicit_ack(f"req-{test_an_id}", test_an_id, custom_thread, hub_port=TEST_PORT)
        check("Watcher gửi explicit ACK tới Hub thành công", ack_success is True)

        # Kiểm tra trạng thái chặng 3 sau khi ACK
        code, st_an2 = http_get(f"{hub_url}/api/test/status?test_id={test_an_id}")
        check("Chặng 3 (Watcher đã ACK) chuyển sang status = 'DONE'", st_an2.get("test", {}).get("stage3_completed", {}).get("status") == "DONE")
        check("Chặng 3 có nhãn 'Sentinel Watcher'", "Sentinel Watcher" in st_an2.get("test", {}).get("stage3_completed", {}).get("label", ""))

        # -----------------------------------------------------------------
        # TEST CASE 3: TÍNH NĂNG DÙNG CHUNG (KHÔNG BỊ CHẶN BỞI THREAD)
        # -----------------------------------------------------------------
        print("\n--- [TEST CASE 3: Khả Năng Dùng Chung Dự Án Khác (Generic Thread)] ---")
        ysdms_test_id = f"test-an-ysdms-{int(time.time()*1000)}"
        code, res_ysdms = http_post(f"{hub_url}/api/send/an", {
            "testId": ysdms_test_id,
            "text": "Chỉ thị test cho dự án ysdms-next.",
            "threadId": "YSDMS-AUTH-PHASE1"
        })
        check("Hub chấp nhận thread của dự án khác (YSDMS-AUTH-PHASE1)", code == 200 and res_ysdms.get("success") is True)

        # -----------------------------------------------------------------
        # TEST CASE 4: TOÀN VẸN USERSCRIPT v1.0.4 VÀ CÁC HÀM TRỢ THỦ
        # -----------------------------------------------------------------
        print("\n--- [TEST CASE 4: Toàn Vẹn Userscript & Dual-Layer Clipboard] ---")
        user_js_path = os.path.join(BRIDGE_DIR, "omni_pe_bridge.user.js")
        with open(user_js_path, "r", encoding="utf-8") as f:
            user_js = f.read()

        check("Userscript có định nghĩa hàm extractInReplyTo", "function extractInReplyTo" in user_js)
        check("Userscript có định nghĩa hàm extractWorkOrderId", "function extractWorkOrderId" in user_js)
        check("Userscript có định nghĩa hàm copyToClipboardReliable", "function copyToClipboardReliable" in user_js)
        check("Userscript có hộp checkbox tự gửi test PE (#omni-test-pe-auto)", "omni-test-pe-auto" in user_js)
        check("Userscript có ô nhập Thread ID test (#omni-test-thread)", "omni-test-thread" in user_js)
        check("Userscript khai báo phiên bản hợp lệ ở metadata", bool(re.search(r"@version\s+\d+\.\d+\.\d+", user_js)))
        check("Userscript hiển thị phiên bản trên giao diện Omni Bridge", "Omni Bridge" in user_js and "SCRIPT_VERSION" in user_js)
        check("Hub trả về phiên bản v1.0 tại /api/status", "OmniLinguist Realtime Bridge Hub v1.0" in status_data.get("hub", ""))

    finally:
        # Tắt Hub an toàn
        print("\n[*] Dừng Hub thử nghiệm...")
        if os.name == "nt":
            try:
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(hub_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except Exception:
                pass
        else:
            hub_proc.terminate()
            try:
                hub_proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                hub_proc.kill()

    print("\n=================================================================")
    print(f"  TỔNG KẾT: ĐẠT {passed}/{passed + failed} KIỂM THỬ ({(passed/(passed+failed)*100):.1f}%)")
    print("=================================================================")
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
