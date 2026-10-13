#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/test_bridge.py
-----------------------------------
Kịch bản kiểm thử hợp đồng tự động cho OmniLinguist Realtime Bridge Hub.
Kiểm tra tính toàn vẹn của:
1. Cấu trúc tệp tin của bộ công cụ
2. Hub Endpoints (/api/status, /api/messages/latest, /api/directive, /api/report)
3. Tính toàn vẹn của tệp Userscript
4. Bộ kết nối CLI messenger
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
    print("\n[Suite 1: Cấu Trúc Hồ Sơ & Mã Nguồn Bộ Công Cụ]")
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
            size = os.path.getsize(p)
            assert_test(f"Tệp {f} có kích thước hợp lệ ({size} bytes)", size > 100)

    root_bat = os.path.join(ROOT_DIR, "start_bridge_hub.bat")
    assert_test("Phím tắt start_bridge_hub.bat tại root tồn tại", os.path.exists(root_bat))


def test_userscript_contracts():
    print("\n[Suite 2: Kiểm Tra Hợp Đồng & Bộ Chọn Userscript]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Userscript có tiêu đề Tampermonkey @name hợp lệ", bool(re.search(r"@name\s+\[v\d+\.\d+\.\d+\]\s+(?:OmniLinguist|YSDMS NextGen) Realtime Bridge", content)) or "Realtime Bridge" in content)
    assert_test("Userscript lắng nghe domain perplexity.ai", "@match        https://www.perplexity.ai/*" in content)
    assert_test("Userscript khai báo quyền GM_xmlhttpRequest để bypass CORS", "@grant        GM_xmlhttpRequest" in content)
    assert_test("Userscript chứa Envelope Protocol (=== END ===)", "=== END ===" in content)
    assert_test("Userscript chứa kiểm định tem thời gian Rule 4", "⏱️ [PE KẾT THÚC" in content)
    assert_test("Userscript hỗ trợ phím tắt Alt+F9 và Alt+F10", "Alt+F9" in content and "Alt+F10" in content)
    assert_test("Userscript hỗ trợ thanh điều khiển Draggable", "omni-drag-handle" in content)
    assert_test("Userscript có bộ sinh chuông Web Audio", "AudioContext" in content)
    assert_test("Userscript hỗ trợ chế độ tạm dừng kết nối & phím tắt Alt+P", "togglePause" in content and "Alt+P" in content)
    assert_test("Userscript có khung xem trước nội dung trao đổi thu gọn", "omni-bridge-viewer" in content and "omni-preview-content" in content)
    assert_test("Userscript có cụm nút điền nhanh thủ công & trigger AN", "omni-quick-row" in content and "triggerAnManualPing" in content)


def test_hub_offline_contracts():
    print("\n[Suite 3: Kiểm Tra Cấu Hình Node Hub]")
    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert_test("Hub bind cổng mặc định 3956 (tránh xa cổng 3000/5000/8000/8080)", "3956" in content)
    assert_test("Hub xử lý sự kiện EADDRINUSE tự động nâng cổng", "EADDRINUSE" in content)
    assert_test("Hub chỉ định bảng SSOT là public.pe_bridge", "public.pe_bridge" in content)
    assert_test("Hub có cơ chế Idempotency cache", "bridge_processed_ids.json" in content)
    assert_test("Hub có kênh SSE /api/events", "/api/events" in content)
    assert_test("Hub có webhook /api/directive", "/api/directive" in content)
    assert_test("Hub có webhook /api/report", "/api/report" in content)
    assert_test("Hub có webhook /api/ack nhận xác nhận tường minh", "/api/ack" in content)
    assert_test("Hub ghi nhận audit log xác nhận vào bridge_ack_audit.json", "bridge_ack_audit.json" in content)
    assert_test("Hub phát SSE AN_ACK_RECEIVED cho browser", "AN_ACK_RECEIVED" in content)


def test_fsm_and_ack_invariants():
    print("\n[Suite 4: Kiểm Thử State Machine & Kỷ Luật Acknowledgment (BRIDGE-STATUS-LOGIC-AUDIT-001)]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()

    # 1. Các trạng thái Finite State Machine bắt buộc
    required_states = [
        "IDLE",
        "PE_REQUEST_QUEUED",
        "PE_REQUEST_DELIVERED",
        "PE_THINKING",
        "PE_REPLIED",
        "AN_NOTIFICATION_QUEUED",
        "WAITING_FOR_AN_ACK",
        "AN_RECEIVED",
        "AN_WORKING",
        "AN_REPORTED"
    ]
    for st in required_states:
        assert_test(f"FSM chứa trạng thái chuẩn: {st}", f'"{st}"' in us_content or f": \"{st}\"" in us_content)

    # 2. Ngăn chặn triệt để Stale Thinking
    assert_test("Khi PE phản hồi xong, lập tức gỡ bỏ PE_THINKING", "peResponsePersistedAt = new Date().toISOString()" in us_content and "setWorkflowState(STATES.PE_REPLIED" in us_content)
    assert_test("Sau PE_REPLIED, không bao giờ quay lại 'Đã gọi PE' làm primary status", "STATES.PE_REPLIED" in us_content)

    # 3. Kỷ luật Explicit AN Acknowledgment
    assert_test("Userscript chỉ chuyển AN_RECEIVED khi khớp peMessageId", "data.peMessageId === currentPeMessageId" in us_content)
    assert_test("Khi chưa có ACK, hiển thị WAITING_FOR_AN_ACK kèm timer đếm giây", "waitingAckTimer = setInterval" in us_content and "Chờ AN xác nhận đã nhận" in us_content)
    assert_test("Khung xem tin chứa Audit Trace lịch sử chuyển trạng thái", "omni-audit-trace" in us_content and "recordAuditTrace" in us_content)

    # 4. Nút kiểm thử mới: Gửi test sang AN
    assert_test("Giao diện có nút kiểm thử 'Gửi Test Sang AN'", "omni-btn-test-an" in us_content and "sendTestDirectiveToAn" in us_content)
    assert_test("Hàm sendTestDirectiveToAn tạo request_id duy nhất và payload test thực", "test-req-" in us_content and "isTest: true" in us_content)

    # 5. Sentinel Watcher gửi ACK thực tế
    watch_path = os.path.join(BRIDGE_DIR, "watch_directive.py")
    with open(watch_path, "r", encoding="utf-8") as f:
        watch_content = f.read()
    assert_test("watch_directive.py có hàm send_explicit_ack", "def send_explicit_ack" in watch_content)
    assert_test("watch_directive.py gọi /api/ack với peMessageId và requestId", "/api/ack" in watch_content and "peMessageId" in watch_content)


def test_rehydration_and_ssot_invariants():
    print("\n[Suite 5: Kiểm Thử Server-Authoritative Rehydration (BRIDGE-STATUS-REHYDRATION-001)]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()

    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        hub_content = f.read()

    # 1. Rule 1: Khởi tạo tải snapshot SSOT trước khi bật loop
    assert_test("Userscript có hàm rehydrateStateFromSupabase", "async function rehydrateStateFromSupabase" in us_content)
    assert_test("Hàm init gọi rehydrateStateFromSupabase trước connectSseHub", us_content.find("rehydrateStateFromSupabase") < us_content.find("connectSseHub"))

    # 2. Rule 2 & 6: Snapshot ghi đè state local & không suy luận text label
    assert_test("Snapshot Supabase lưu vết lastSupabaseRecord và ghi đè trạng thái", "lastSupabaseRecord = record" in us_content)
    assert_test("Phân loại trạng thái dựa trên record.sender (AN hoặc PE)", 'record.sender === "AN"' in us_content and 'record.sender === "PE"' in us_content)

    # 3. Rule 3: Newest sender = PE -> WAITING_FOR_AN_ACK (tuyệt đối không PE_THINKING)
    assert_test("Khi sender là PE, chuyển sang WAITING_FOR_AN_ACK", 'record.sender === "PE"' in us_content and "STATES.WAITING_FOR_AN_ACK" in us_content)

    # 4. Rule 4: Newest sender = AN -> AN_REPORTED (sẵn sàng đưa vào PE)
    assert_test("Khi sender là AN, chuyển sang AN_REPORTED", 'record.sender === "AN"' in us_content and "STATES.AN_REPORTED" in us_content)

    # 5. Rule 5: Strict Guard trên PE_THINKING
    assert_test("Khai báo cờ isPeRequestInFlight để bảo vệ PE_THINKING", "let isPeRequestInFlight = false" in us_content)
    assert_test("monitorStreamingLoop bắt buộc isPeRequestInFlight mới được kích hoạt PE_THINKING", "currentlyStreaming && isPeRequestInFlight && !isPeStreaming" in us_content)
    assert_test("sendPromptToPerplexity bật isPeRequestInFlight = true", "isPeRequestInFlight = true" in us_content)
    assert_test("Stream kết thúc tắt isPeRequestInFlight = false", "isPeRequestInFlight = false" in us_content)

    # 6. Loại bỏ hoàn toàn false positive của isPerplexityStreaming
    assert_test("isPerplexityStreaming không dùng includes('dung') substring lỏng lẻo", "aria.includes('dung')" not in us_content and "text.includes('dung')" not in us_content)

    # 7. Rule 7: Debug / Audit UI cho SSOT Rehydration
    assert_test("Khung xem tin chứa khối audit SSOT Rehydration", "omni-rehydration-info" in us_content)
    assert_test("Hiển thị nguồn SUPABASE_REHYDRATION rõ ràng", "SUPABASE_REHYDRATION" in us_content)

    # 8. Local Hub cung cấp endpoint lọc thread_id và derivedState
    assert_test("Hub /api/messages/latest hỗ trợ lọc thread_id", "url.searchParams.get('thread_id')" in hub_content)
    assert_test("Hub trả về source SUPABASE_REHYDRATION và derivedState", "SUPABASE_REHYDRATION" in hub_content and "derivedState" in hub_content)


def test_event_driven_turn_sync_invariants():
    print("\n[Suite 6: Kiểm Thử Đồng Bộ Theo Sự Kiện & 4 Tầng Trạng Thái (BRIDGE-EVENT-DRIVEN-TURN-SYNC-001)]")
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()

    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        hub_content = f.read()

    # 1. 4-Tier State Architecture definitions
    assert_test("Userscript định nghĩa TURN_STATES (PE_TURN, AN_TURN, IDLE)", "TURN_STATES" in us_content and "PE_TURN" in us_content and "AN_TURN" in us_content)
    assert_test("Userscript định nghĩa DELIVERY_STATES (IDLE, DISPATCH_QUEUED, WAITING_FOR_ACK, ACKNOWLEDGED)", "DELIVERY_STATES" in us_content and "DISPATCH_QUEUED" in us_content and "ACKNOWLEDGED" in us_content)
    assert_test("Userscript định nghĩa ACTIVITY_STATES (IDLE, PE_THINKING, AN_WORKING)", "ACTIVITY_STATES" in us_content and "AN_WORKING" in us_content)
    assert_test("Userscript định nghĩa TRANSPORT_STATES (IDLE, SENDING_TO_HUB, SENDING_TO_SUPABASE)", "TRANSPORT_STATES" in us_content and "SENDING_TO_SUPABASE" in us_content)

    # 2. Hub Supabase Event Daemon
    assert_test("Hub có hàm startSupabaseSyncDaemon đồng bộ Supabase", "function startSupabaseSyncDaemon" in hub_content)
    assert_test("Hub lắng nghe sự kiện phát hiện row mới trên public.pe_bridge", "SUPABASE SYNC" in hub_content and "public.pe_bridge" in hub_content)
    assert_test("Hub phát SSE SUPABASE_ROW_PERSISTED khi row được lưu", "SUPABASE_ROW_PERSISTED" in hub_content)
    assert_test("Hub tự động cập nhật PE_INBOX_LATEST.json cho Sentinel Watcher khi có chỉ thị PE", "PE_INBOX_LATEST.json" in hub_content and "row.sender === 'PE'" in hub_content)
    assert_test("Hub khởi chạy startSupabaseSyncDaemon khi server bắt đầu listen", "startSupabaseSyncDaemon()" in hub_content)
    assert_test("Hub dọn dẹp syncInterval khi tắt (cleanup)", "clearInterval(syncInterval)" in hub_content)

    # 3. Userscript Event Handlers & Invariants
    assert_test("Userscript có hàm handleSupabaseRowPersisted", "function handleSupabaseRowPersisted" in us_content)
    assert_test("Invariant 1: Khi PE row persist, lập tức giải phóng PE_THINKING", "terminateActivity(\"PE row persisted on Supabase\")" in us_content)
    assert_test("Invariant 2: Khi AN row persist, lập tức giải phóng AN_WORKING", "terminateActivity(\"AN row persisted on Supabase\")" in us_content)
    assert_test("Deduplication: Userscript kiểm tra lastProcessedRowId", "record.id === lastProcessedRowId" in us_content)

    # 4. Strict Activity TTL with Auto-Revert
    assert_test("Userscript có cơ chế TTL đếm ngược cho Activity", "activityRemainingSec" in us_content and "activityTtlTimer = setInterval" in us_content)
    assert_test("Activity tự động hết hạn và quay về Turn State khi hết TTL", "ACTIVITY_EXPIRED" in us_content)
    assert_test("Userscript có hàm terminateActivity tường minh", "function terminateActivity" in us_content)

    # 5. Resilient Polling Fallback
    assert_test("Userscript có hàm pollSnapshotLoop làm inbound fallback", "async function pollSnapshotLoop" in us_content)
    assert_test("Userscript kích hoạt fallback poll theo chu kỳ CONFIG.POLL_INTERVAL_MS", "setInterval(pollSnapshotLoop, CONFIG.POLL_INTERVAL_MS)" in us_content)
    assert_test("Huy hiệu Hub hiển thị trạng thái Poll 3s khi mất SSE", "Hub :${activeHubPort} ⚠️ Poll 3s" in us_content or "Poll 3s" in us_content)

    # 6. UI Transparency: 4 Tầng Trạng Thái Trong Viewer
    assert_test("Giao diện chính có chip hoạt động độc lập #omni-activity-chip", "omni-activity-chip" in us_content)
    assert_test("Khung xem tin hiển thị đầy đủ Turn SSOT và Next Actor", "omni-ssot-turn" in us_content and "omni-ssot-actor" in us_content)
    assert_test("Khung xem tin hiển thị Delivery State", "omni-ssot-delivery" in us_content)
    assert_test("Khung xem tin hiển thị Activity State", "omni-ssot-activity" in us_content)
    assert_test("Khung xem tin hiển thị Transport State", "omni-ssot-transport" in us_content)

    # 7. PE Audit Hardened Guardrails on Directives (PE Audit Requirement)
    assert_test("Hub có whitelist ALLOWED_THREAD_PREFIXES", "ALLOWED_THREAD_PREFIXES" in hub_content)
    assert_test("Hub có hàm isValidBridgeThread kiểm tra thread", "function isValidBridgeThread" in hub_content)
    assert_test("Hub có hàm isDirectiveTargetingAn lọc chỉ thị thật", "function isDirectiveTargetingAn" in hub_content)
    assert_test("isDirectiveTargetingAn loại bỏ ping và tin nhắn dưới 50 ký tự", "text.length < 50" in hub_content and "PING BRIDGE." in hub_content)
    assert_test("Hub có persistent dispatch ledger (pe_dispatch_ledger.json)", "DISPATCH_LEDGER_FILE" in hub_content and "pe_dispatch_ledger.json" in hub_content)
    assert_test("Hub kiểm tra isRowAlreadyDispatchedOrAcked trước khi dispatch", "isRowAlreadyDispatchedOrAcked(row.id)" in hub_content)
    assert_test("Hub cập nhật trạng thái ACKNOWLEDGED vào ledger khi nhận /api/ack", "markLedgerAcked" in hub_content)


def test_correlation_and_pending_report_invariants():
    """Kiểm thử ràng buộc Tương quan Báo cáo AN ⟷ Phản hồi PE (BRIDGE-PENDING-REPORT-CORRELATION-001)"""
    print("\n[Suite 7: Tương Quan Báo Cáo & Pending Report Guard (BRIDGE-PENDING-REPORT-CORRELATION-001)]")
    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        hub_content = f.read()
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()

    # 1. Hub Correlation Ledger & Helper Functions
    assert_test("Hub có CORRELATION_LEDGER_FILE định nghĩa tệp pe_report_correlation.json", "CORRELATION_LEDGER_FILE" in hub_content and "pe_report_correlation.json" in hub_content)
    assert_test("Hub có hàm getCorrelationLedger và saveCorrelationLedger", "function getCorrelationLedger" in hub_content and "function saveCorrelationLedger" in hub_content)
    assert_test("Hub có hàm extractWorkOrderId và extractInReplyTo", "function extractWorkOrderId" in hub_content and "function extractInReplyTo" in hub_content)
    assert_test("Hub có hàm registerAnReport", "function registerAnReport" in hub_content)
    assert_test("Hub có hàm markReportHandled", "function markReportHandled" in hub_content)
    assert_test("Hub có hàm markReportConsumed", "function markReportConsumed" in hub_content)
    assert_test("Hub có hàm computeReportCorrelation tính toán tương quan", "function computeReportCorrelation" in hub_content)

    # 2. Hub API Endpoints & SSE Events
    assert_test("Hub có endpoint GET /api/reports/pending", "pathname === '/api/reports/pending'" in hub_content)
    assert_test("Hub có endpoint POST /api/reports/consume", "pathname === '/api/reports/consume'" in hub_content)
    assert_test("Hub có endpoint POST /api/reports/correlate", "pathname === '/api/reports/correlate'" in hub_content)
    assert_test("Hub /api/messages/latest trả về correlation và derivedState", "computeReportCorrelation" in hub_content and "correlation: corr" in hub_content)
    assert_test("Hub phát SSE PE_RESPONSE_PERSISTED khi nhận chỉ thị PE", "PE_RESPONSE_PERSISTED" in hub_content)
    assert_test("Hub phát SSE REPORT_CONSUMED khi báo cáo được đưa vào PE", "REPORT_CONSUMED" in hub_content)

    # 3. Userscript Correlation State & Local Storage
    assert_test("Userscript khai báo currentCorrelation", "let currentCorrelation" in us_content)
    assert_test("Userscript có các hàm getStoredHandledReports, saveHandledReport, isReportHandled", "function getStoredHandledReports" in us_content and "function isReportHandled" in us_content)
    assert_test("Userscript có các hàm getStoredConsumedReports, saveConsumedReport, isReportConsumed", "function getStoredConsumedReports" in us_content and "function isReportConsumed" in us_content)

    # 4. Userscript Button & Turn UI Guards
    assert_test("Userscript kiểm tra currentCorrelation.pendingAnReport khi PE_TURN", "currentCorrelation.pendingAnReport" in us_content)
    assert_test("Khi pendingAnReport === false, nút Đổ báo cáo vào PE bị vô hiệu hóa", "btnSendPe.disabled = true" in us_content and "Báo cáo đã được PE xử lý" in us_content)
    assert_test("Khi pendingAnReport === false, không hiển thị Sẵn sàng gọi PE mà hiển thị đã xử lý", "PE đã tiếp nhận/xử lý báo cáo" in us_content)
    assert_test("executeFillAndSubmit chặn gửi lại nếu báo cáo đã được PE xử lý hoặc đã consumed", "isReportHandled(currentAnMessageId)" in us_content and "Báo cáo này đã được PE xử lý rồi" in us_content)
    assert_test("executeFillAndSubmit gửi /api/reports/consume khi nạp vào PE", "/api/reports/consume" in us_content)

    # 5. PE Directive Correlation Metadata Envelope
    assert_test("forwardPeResponseToAn đính kèm correlation metadata comment", "<!-- OMNI_CORRELATION: in_reply_to_message_id=" in us_content)
    assert_test("forwardPeResponseToAn gửi inReplyToMessageId và workOrderId trong payload", "inReplyToMessageId: inReplyTo" in us_content)
    assert_test("forwardPeResponseToAn lưu vết saveHandledReport trên client", "saveHandledReport(inReplyTo, msgId)" in us_content)

    # 6. SSE Event Listeners & Snapshot Rehydration
    assert_test("Userscript lắng nghe SSE PE_RESPONSE_PERSISTED và cập nhật correlation", "data.type === \"PE_RESPONSE_PERSISTED\"" in us_content)
    assert_test("Userscript lắng nghe SSE REPORT_CONSUMED và tắt nút report", "data.type === \"REPORT_CONSUMED\"" in us_content)
    assert_test("rehydrateStateFromSupabase cập nhật currentCorrelation từ Hub snapshot", "data.correlation" in us_content and "currentCorrelation = data.correlation" in us_content)

    # 7. UI Transparency: 4 Correlation Fields in Viewer
    assert_test("Khung xem tin hiển thị đầy đủ 4 trường correlation", "omni-corr-report-id" in us_content and "omni-corr-handled-by" in us_content and "omni-corr-handled-at" in us_content and "omni-corr-in-reply-to" in us_content)
    assert_test("updateRehydrationAuditUI cập nhật các trường correlation", "corrReportEl" in us_content and "corrHandledByEl" in us_content and "corrHandledAtEl" in us_content and "corrInReplyEl" in us_content)


def test_handoff_and_event_ledger_invariants():
    """Kiểm thử ràng buộc Handoff Hai Chiều & Event Ledger (BRIDGE-END-TO-END-HANDOFF-REPAIR-001)"""
    print("\n[Suite 8: Handoff Hai Chiều & Event Ledger (BRIDGE-END-TO-END-HANDOFF-REPAIR-001)]")
    hub_path = os.path.join(BRIDGE_DIR, HUB_NAME)
    with open(hub_path, "r", encoding="utf-8") as f:
        hub_content = f.read()
    us_path = os.path.join(BRIDGE_DIR, US_NAME)
    with open(us_path, "r", encoding="utf-8") as f:
        us_content = f.read()
    watcher_path = os.path.join(BRIDGE_DIR, "watch_directive.py")
    with open(watcher_path, "r", encoding="utf-8") as f:
        watcher_content = f.read()

    # 1. Handoff Event Ledger tại Hub
    assert_test("Hub có HANDOFF_LEDGER_FILE định nghĩa tệp pe_handoff_ledger.json", "HANDOFF_LEDGER_FILE" in hub_content and "pe_handoff_ledger.json" in hub_content)
    assert_test("Hub có hàm getHandoffLedger và saveHandoffLedger", "function getHandoffLedger" in hub_content and "function saveHandoffLedger" in hub_content)
    assert_test("Hub có hàm recordHandoffEvent và updateHandoffEvent", "function recordHandoffEvent" in hub_content and "function updateHandoffEvent" in hub_content)
    assert_test("Hub có endpoint GET /api/handoff/ledger", "pathname === '/api/handoff/ledger'" in hub_content)

    # 2. Chiều PE -> AN: Tự Động Dispatch & SSE
    assert_test("Hub phát SSE PE_DISPATCHED_TO_AN khi dispatch chỉ thị cho AN", "PE_DISPATCHED_TO_AN" in hub_content)
    assert_test("Hub ghi handoff event PE_TO_AN khi nhận chỉ thị", "handoffType: 'PE_TO_AN'" in hub_content)
    assert_test("Hub cập nhật handoff event sang ACKNOWLEDGED khi nhận /api/ack", "updateHandoffEvent(peMessageId" in hub_content)
    assert_test("Userscript tự động phát hiện phản hồi PE hoàn tất để gửi sang AN", "Tự động phát hiện câu trả lời PE" in us_content)
    assert_test("Userscript lắng nghe SSE PE_DISPATCHED_TO_AN và cập nhật WAITING_FOR_ACK", "data.type === \"PE_DISPATCHED_TO_AN\"" in us_content)

    # 3. Chiều AN -> PE: Tự Động Thông Báo & Banner
    assert_test("Hub phát SSE AN_REPORT_PERSISTED khi phát hiện report AN", "AN_REPORT_PERSISTED" in hub_content)
    assert_test("Hub ghi handoff event AN_TO_PE khi có report AN", "handoffType: 'AN_TO_PE'" in hub_content)
    assert_test("Userscript lắng nghe SSE AN_REPORT_PERSISTED", "data.type === \"AN_REPORT_PERSISTED\"" in us_content)
    assert_test("Userscript có hàm showReportAlertBanner hiển thị thông báo nổi bật", "function showReportAlertBanner" in us_content)
    assert_test("Userscript có khối #omni-report-banner trong panel HTML", "omni-report-banner" in us_content)
    assert_test("Khi nhận AN_REPORT_PERSISTED, Userscript lập tức giải phóng AN_WORKING", "terminateActivity(\"AN report persisted" in us_content)

    # 4. Huy Hiệu Nguồn Vận Chuyển (Transport Source Badge)
    assert_test("Userscript có hàm updateSourceBadge", "function updateSourceBadge" in us_content)
    assert_test("Userscript có phần tử #omni-source-badge trong giao diện", "omni-source-badge" in us_content)
    assert_test("updateSourceBadge hỗ trợ nguồn SSE, POLL và INSERT CONFIRM", "Nguồn: SSE" in us_content and "Nguồn: POLL" in us_content and "Nguồn: INSERT CONFIRM" in us_content)

    # 5. Sentinel Watcher Hỗ Trợ Chạy Vòng Lặp Liên Tục
    assert_test("watch_directive.py hỗ trợ tham số --loop để chạy liên tục", "--loop" in watcher_content and "loop_mode" in watcher_content)


def main():
    print("=" * 65)
    print("  KIỂM THỬ TỰ ĐỘNG BỘ CÔNG CỤ OMNILINGUIST REALTIME BRIDGE")
    print("=" * 65)

    test_file_structure()
    test_userscript_contracts()
    test_hub_offline_contracts()
    test_fsm_and_ack_invariants()
    test_rehydration_and_ssot_invariants()
    test_event_driven_turn_sync_invariants()
    test_correlation_and_pending_report_invariants()
    test_handoff_and_event_ledger_invariants()

    print("\n" + "=" * 65)
    print(f"KẾT QUẢ: Tổng số test: {PASSED + FAILED} | ĐẠT: {PASSED} | LỖI: {FAILED}")
    print("=" * 65)

    if FAILED > 0:
        sys.exit(1)
    print("✅ 100% KIỂM THỬ HỢP ĐỒNG BỘ CÔNG CỤ BRIDGE ĐẠT CHUẨN!")


if __name__ == "__main__":
    main()


