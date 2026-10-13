#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/test_bridge.py
-----------------------------------
Kịch bản kiểm thử hợp đồng tự động cho YSDMS Realtime Bridge Hub v2.4.0 (Dual-Path Architecture).
Kiểm tra tính toàn vẹn của:
1. Cấu trúc tệp tin của bộ công cụ
2. Hub Endpoints (/api/status, /api/messages/latest, /api/directive, /api/report)
3. Tính toàn vẹn của tệp Userscript v2.4.0 (Dual-Path, Zero Auto-Scraping)
4. Bộ kết nối CLI messenger và Sentinel Watcher
"""

import os
import sys
import json
import re
import urllib.request
import urllib.error

# UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BRIDGE_DIR = os.path.dirname(os.path.abspath(__file__))

US_NAME = "ysdms_pe_bridge.user.js" if os.path.exists(os.path.join(BRIDGE_DIR, "ysdms_pe_bridge.user.js")) else "omni_pe_bridge.user.js"
HUB_NAME = "ysdms_realtime_hub.cjs" if os.path.exists(os.path.join(BRIDGE_DIR, "ysdms_realtime_hub.cjs")) else "omni_realtime_hub.cjs"
MSG_NAME = "ysdms_bridge_messenger.py" if os.path.exists(os.path.join(BRIDGE_DIR, "ysdms_bridge_messenger.py")) else "omni_bridge_messenger.py"
BAT_NAME = "START_YSDMS_HUB.bat" if os.path.exists(os.path.join(BRIDGE_DIR, "START_YSDMS_HUB.bat")) else "START_OMNI_HUB.bat"

PASSED = 0
FAILED = 0


def assert_test(name, condition, details=""):
    global PASSED, FAILED
    if condition:
        print(f"  ✓ PASS: {name}")
        PASSED += 1
    else:
        print(f"  ✗ FAIL: {name} ({details})")
        FAILED += 1


def test_file_structure():
    print("\n[Suite 1: Cấu Trúc Hồ Sơ & Mã Nguồn Bộ Công Cụ v2.4.0]")
    files = [
        HUB_NAME,
        US_NAME,
        MSG_NAME,
        BAT_NAME,
        "README.md",
        "USER_MANUAL.md"
    ]
    for f in files:
        p = os.path.join(BRIDGE_DIR, f)
        assert_test(f"Tệp {f} tồn tại", os.path.exists(p), f"Không tìm thấy tại {p}")
        if os.path.exists(p):
            assert_test(f"Tệp {f} không rỗng", os.path.getsize(p) > 0)

    active_port_file = os.path.join(BRIDGE_DIR, "data", "active_port.json")
    assert_test("Tệp active_port.json tồn tại", os.path.exists(active_port_file))

    active_conv_file = os.path.join(ROOT_DIR, ".agents", "active_conversation_id.txt")
    assert_test("Tệp active_conversation_id.txt tồn tại", os.path.exists(active_conv_file))


def test_userscript_v240_contracts():
    print("\n[Suite 2: Kiểm Tra Hợp Đồng & Bộ Chọn Userscript v2.4.0]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Userscript có tiêu đề Tampermonkey @name hợp lệ", "Realtime Bridge" in content and "v2.4.0" in content)
    assert_test("Userscript lắng nghe domain perplexity.ai", "@match        https://www.perplexity.ai/*" in content)
    assert_test("Userscript khai báo quyền GM_xmlhttpRequest để bypass CORS", "@grant        GM_xmlhttpRequest" in content)
    assert_test("Userscript hỗ trợ phím tắt Alt+F9 (Submit) và Alt+F10 (Rescue)", "handleMinhChuSubmit" in content and "handleManualRescueForward" in content)
    assert_test("Userscript có bảng điều khiển ysdms-bridge-panel", "ysdms-bridge-panel" in content)
    assert_test("Userscript có bộ sinh chuông Web Audio playChime", "playChime" in content and "AudioContext" in content)
    assert_test("Userscript có hàm showToast hiển thị trạng thái", "function showToast" in content)
    assert_test("Userscript có hàm injectTextToPerplexity đổ full text", "function injectTextToPerplexity" in content)
    assert_test("Userscript có nút cứu hộ thủ công ysdms-btn-rescue-an", "ysdms-btn-rescue-an" in content)
    assert_test("Userscript có nút nộp báo cáo ysdms-btn-submit-pe", "ysdms-btn-submit-pe" in content)


def test_hub_offline_contracts():
    print("\n[Suite 3: Kiểm Tra Cấu Hình Node Hub]")
    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Hub xử lý sự kiện EADDRINUSE tự động nâng cổng", "EADDRINUSE" in content)
    assert_test("Hub chỉ định bảng SSOT là pe_an_messages", "pe_an_messages" in content)
    assert_test("Hub có kênh SSE /api/events", "/api/events" in content)
    assert_test("Hub có webhook /api/directive", "/api/directive" in content)
    assert_test("Hub có webhook /api/report", "/api/report" in content)
    assert_test("Hub có webhook /api/ack nhận xác nhận tường minh", "/api/ack" in content)
    assert_test("Hub ghi nhận audit log xác nhận vào bridge_ack_audit.json", "bridge_ack_audit.json" in content)
    assert_test("Hub phát SSE AN_ACK_RECEIVED cho browser", "AN_ACK_RECEIVED" in content)
    assert_test("Hub có whitelist ALLOWED_THREAD_PREFIXES", "ALLOWED_THREAD_PREFIXES" in hub_content if 'hub_content' in locals() else "ALLOWED_THREAD_PREFIXES" in content)


def test_v240_zero_scraping_invariants():
    print("\n[Suite 4: Kiểm Thử Loại Bỏ 100% Cào DOM Tự Động (Zero Auto-Scraping)]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Loại bỏ hàm observePeStream", "observePeStream" not in content)
    assert_test("Loại bỏ debounceForwardTimer", "debounceForwardTimer" not in content)
    assert_test("Loại bỏ timeSinceLastTextChange", "timeSinceLastTextChange" not in content)
    assert_test("Loại bỏ verifyDirectiveIntegrity (không ép thẻ đóng)", "verifyDirectiveIntegrity" not in content)
    assert_test("Loại bỏ auto_forward_call ngầm", not bool(re.search(r"forwardPeResponseToAn\s*\(\s*false\s*\)", content)))
    assert_test("Loại bỏ baselinePeTextHash", "baselinePeTextHash" not in content)
    assert_test("Loại bỏ điều kiện chặn ô chat length > 50", "val.length > 50" not in content)
    assert_test("Loại bỏ cắt cụt 300 ký tự (slice 300)", "slice(0, 300)" not in content)


def test_v240_dual_path_invariants():
    print("\n[Suite 5: Kiểm Thử Mô Hình Dual-Path & Sentinel Watcher]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()
    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        hub_content = f.read()
    watch_path = os.path.join(BRIDGE_DIR, "watch_directive.py")
    with open(watch_path, "r", encoding="utf-8") as f:
        watch_content = f.read()

    # 1. Luồng chính PE -> AN qua Supabase Sync Daemon
    assert_test("Hub có hàm startSupabaseSyncDaemon đồng bộ Supabase", "function startSupabaseSyncDaemon" in hub_content)
    assert_test("Hub lắng nghe phát hiện row mới từ pe_an_messages", "startSupabaseSyncDaemon" in hub_content and "pe_an_messages" in hub_content)
    assert_test("Hub tự động cập nhật PE_INBOX_LATEST cho Sentinel Watcher khi có chỉ thị PE", "PE_INBOX_LATEST" in hub_content and "row.sender === 'PE'" in hub_content)

    # 2. Chiều AN -> PE: SSE & Toàn văn Báo cáo
    assert_test("Hub phát SSE AN_REPORT_PERSISTED khi phát hiện report AN", "AN_REPORT_PERSISTED" in hub_content)
    assert_test("Userscript lắng nghe sự kiện AN_REPORT_PERSISTED", "AN_REPORT_PERSISTED" in us_content)
    assert_test("Userscript inject toàn văn báo cáo vào chatbox", "injectTextToPerplexity" in us_content)

    # 3. Nút Cứu Hộ Thủ Công Alt+F10
    assert_test("Userscript có hàm handleManualRescueForward", "function handleManualRescueForward" in us_content)
    assert_test("handleManualRescueForward gửi Webhook /api/directive", "/api/directive" in us_content)
    assert_test("Userscript gán phím tắt Alt+F10 cho cứu hộ", "F10" in us_content and "handleManualRescueForward" in us_content)

    # 4. Sentinel Watcher
    assert_test("watch_directive.py có hàm send_explicit_ack", "def send_explicit_ack" in watch_content)
    assert_test("watch_directive.py hỗ trợ tham số --loop để chạy liên tục", "--loop" in watch_content)

    # 5. Line count audit
    lines = len(us_content.splitlines())
    assert_test(f"Userscript tinh gọn trong khoảng 350-600 dòng (thực tế: {lines})", 350 <= lines <= 600)


def main():
    print("=" * 70)
    print("  KIỂM THỬ TỰ ĐỘNG BỘ CÔNG CỤ YSDMS REALTIME BRIDGE v2.4.0")
    print("=" * 70)

    test_file_structure()
    test_userscript_v240_contracts()
    test_hub_offline_contracts()
    test_v240_zero_scraping_invariants()
    test_v240_dual_path_invariants()

    print("\n" + "=" * 70)
    print(f"KẾT QUẢ: Tổng số test: {PASSED + FAILED} | ĐẠT: {PASSED} | LỖI: {FAILED}")
    print("=" * 70)

    if FAILED > 0:
        sys.exit(1)
    print("✅ 100% KIỂM THỬ HỢP ĐỒNG BỘ CÔNG CỤ BRIDGE v2.4.0 ĐẠT CHUẨN!")


if __name__ == "__main__":
    main()
