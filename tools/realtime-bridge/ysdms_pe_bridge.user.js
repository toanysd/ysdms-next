// ==UserScript==
// @name         [v2.3.0] YSDMS NextGen Realtime Bridge: PE-AN Dedicated Hub
// @namespace    https://ysdms.nextgen.local/
// @version      2.3.0
// @description  Cầu nối thời gian thực hai chiều PE - THOAN - AN chuyên dụng (v2.3.0). Đảm bảo chỉ đổ 1 lần duy nhất cho mỗi báo cáo của AN (Single Dispatch Guard), bắt sự kiện người dùng submit thủ công qua Enter/Click, tự động nhận diện và khóa ô chat khi PE đang suy nghĩ (Thinking Shield / Busy State), ngăn chặn triệt để đổ lặp nội dung vào ô chat, chiều ngược lại chỉ forward sang AN 1 lần duy nhất.
// @match        https://www.perplexity.ai/*
// @match        https://perplexity.ai/*
// @match        https://*.perplexity.ai/*
// @updateURL    http://127.0.0.1:3856/ysdms_pe_bridge.user.js
// @downloadURL  http://127.0.0.1:3856/ysdms_pe_bridge.user.js
// @run-at       document-end
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      127.0.0.1
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = "v2.3.0";
    console.log(`%c[${SCRIPT_VERSION} YSDMS Bridge Dedicated] >>> SCRIPT ĐÃ ĐƯỢC NẠP VÀO TRANG <<<`, "background: #0284c7; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;");

    // ==========================================
    // 1. CẤU HÌNH DỰ ÁN YSDMS NEXTGEN (CHUYÊN DỤNG)
    // ==========================================
    const CONFIG = {
        DEFAULT_PORT: 3856,
        CANDIDATE_PORTS: [3856, 3857, 3858, 3859, 3860],
        PING_PE_MESSAGE: "PE đọc Bridge.",
        DEFAULT_THREAD_ID: localStorage.getItem("ysdms_bridge_thread_id") || "YSDMS-AUTH-PHASE1",
        POLL_INTERVAL_MS: 3000,
        AUTO_SUBMIT_MIN_SEC: 1, // Độ trễ submit ngẫu nhiên tối thiểu (1s)
        AUTO_SUBMIT_MAX_SEC: 4, // Độ trễ submit ngẫu nhiên tối đa (4s)
        QUICK_PINGS: {
            PE_REVIEW: "PE đọc bridge xem AN đã gửi báo cáo chưa và duyệt.",
            AN_EXECUTE: "AN kiểm tra chỉ thị mới từ PE trên bridge, tiến hành thực thi và báo cáo lên bridge. Nếu đã thực thi mà chưa báo cáo thì gửi báo cáo đúng quy tắc đã thiết lập.",
            PING_BRIDGE: "PE đọc Bridge."
        }
    };

    // ==========================================
    // 1.1. FINITE STATE MACHINE & 4-TIER ARCHITECTURE (BRIDGE-EVENT-DRIVEN-TURN-SYNC-001)
    // ==========================================
    // 1. Turn State (Primary, SSOT - Derived from public.pe_bridge)
    const TURN_STATES = {
        PE_TURN: "PE_TURN",   // Row mới nhất từ AN -> Lượt PE
        AN_TURN: "AN_TURN",   // Row mới nhất từ PE -> Lượt AN
        IDLE: "IDLE"
    };

    // 2. Delivery State (Hub event delivery & ACK)
    const DELIVERY_STATES = {
        IDLE: "IDLE",
        DISPATCH_QUEUED: "DISPATCH_QUEUED",
        WAITING_FOR_ACK: "WAITING_FOR_ACK",
        ACKNOWLEDGED: "ACKNOWLEDGED"
    };

    // 3. Activity State (Live overlay with strict TTL - never masks Turn State)
    const ACTIVITY_STATES = {
        IDLE: "IDLE",
        PE_THINKING: "PE_THINKING", // Max 60s TTL
        AN_WORKING: "AN_WORKING"     // Max 120s TTL
    };

    // 4. Transport State (Optimistic local HTTP in-flight)
    const TRANSPORT_STATES = {
        IDLE: "IDLE",
        SENDING_TO_HUB: "SENDING_TO_HUB",
        SENDING_TO_SUPABASE: "SENDING_TO_SUPABASE"
    };

    // Backward compatibility mapping
    const STATES = {
        IDLE: "IDLE",
        PE_REQUEST_QUEUED: "PE_REQUEST_QUEUED",
        PE_REQUEST_DELIVERED: "PE_REQUEST_DELIVERED",
        PE_THINKING: "PE_THINKING",
        PE_REPLIED: "PE_REPLIED",
        AN_NOTIFICATION_QUEUED: "AN_NOTIFICATION_QUEUED",
        WAITING_FOR_AN_ACK: "WAITING_FOR_AN_ACK",
        AN_RECEIVED: "AN_RECEIVED",
        AN_WORKING: "AN_WORKING",
        AN_REPORTED: "AN_REPORTED",
        PAUSED: "PAUSED",
        FAILED: "FAILED"
    };

    let activeHubPort = parseInt(localStorage.getItem("omni_bridge_hub_port") || CONFIG.DEFAULT_PORT, 10);
    
    // 4-Tier State variables
    let currentTurnState = TURN_STATES.IDLE;
    let currentNextActor = "NONE";
    let currentDeliveryState = DELIVERY_STATES.IDLE;
    let currentActivityState = ACTIVITY_STATES.IDLE;
    let activityTtlTimer = null;
    let activityRemainingSec = 0;
    let currentTransportState = TRANSPORT_STATES.IDLE;
    let lastProcessedRowId = null;

    let currentWorkflowState = STATES.IDLE;
    let currentRequestId = null;
    let currentPeMessageId = null;
    let peResponsePersistedAt = null;
    let anAckReceivedAt = null;
    let waitingAckTimer = null;
    let waitingAckElapsedSec = 0;
    let auditEventHistory = [];
    let isBridgePaused = localStorage.getItem("omni_bridge_paused") === "true";
    let isSubmitting = false;
    let isForwarding = false;
    let isPeStreaming = false;
    let lastPeTextLength = 0;
    let timeSinceLastTextChange = 0;
    let isPeRequestInFlight = false; // Bắt buộc để được phép vào PE_THINKING (Rule 5)
    let baselinePeTextHash = null; // Hash của câu trả lời PE cũ đang có trên trang (chống false trigger)
    let isWaitingForNewPeResponse = false; // Chỉ bật khi vừa gửi báo cáo AN vào PE
    let hasObservedNewStream = false; // Chỉ bật khi thực sự quan sát thấy PE bắt đầu stream câu trả lời mới
    let pendingRequestId = null;
    let lastSupabaseRecord = null;
    let lastRehydrationSource = "INITIAL";
    let sseSource = null;
    let autoSubmitInterval = null;
    let debounceForwardTimer = null;
    let lastAnReportContent = "";
    let currentAnMessageId = "";
    let lastThreadId = CONFIG.DEFAULT_THREAD_ID;
    let isHubConnected = false;
    let latestMessagePreview = localStorage.getItem("omni_bridge_last_preview") || "(Chưa có nội dung trao đổi nào)";
    let lastFilledReportId = null;
    let manualSendRequiredReportId = null; // v1.0.16: Report đã khóa nhưng auto-submit thất bại -> chờ THOAN gửi thủ công (Alt+F9)

    // TRẠNG THÁI CHỜ CẬP NHẬT SUPABASE & ĐIỀU PHỐI ĐÚNG SENDER (v2.2.0)
    // Sau khi đã đổ báo cáo AN vào PE, hệ thống BẮT BUỘC rơi vào trạng thái CHỜ (Awaiting Supabase New Row).
    // Tuyệt đối không được đổ lại dữ liệu vào PE cho đến khi Supabase có bản ghi MỚI.
    // Khi Supabase có bản ghi mới, kiểm tra `sender` để xác định đối tượng nhận:
    // - sender === 'PE' / 'THOAN' -> Đối tượng nhận là AN (chuyển sang AN_TURN, giải phóng chờ).
    // - sender === 'AN' (bản ghi mới khác ID cũ) -> Đối tượng nhận là PE (chuyển sang PE_TURN, kích hoạt nạp cho PE).
    let isAwaitingSupabaseNewRow = localStorage.getItem("omni_bridge_awaiting_supabase") === "true";
    let lastSubmittedAnReportId = localStorage.getItem("omni_bridge_last_submitted_an_id") || null;
    let lastInjectedReportId = localStorage.getItem("omni_bridge_last_injected_report_id") || null;

    function getStoredInjectedReports() {
        try {
            return JSON.parse(localStorage.getItem("omni_bridge_injected_reports") || "{}");
        } catch {
            return {};
        }
    }

    function isReportInjected(reportId) {
        if (!reportId) return false;
        if (reportId === lastInjectedReportId) return true;
        const injected = getStoredInjectedReports();
        return !!injected[reportId];
    }

    function markReportInjected(reportId) {
        if (!reportId) return;
        lastInjectedReportId = reportId;
        localStorage.setItem("omni_bridge_last_injected_report_id", reportId);
        const injected = getStoredInjectedReports();
        injected[reportId] = {
            injectedAt: new Date().toISOString()
        };
        try {
            localStorage.setItem("omni_bridge_injected_reports", JSON.stringify(injected));
        } catch {}
        logStateSnapshot("MARK_REPORT_INJECTED", `reportId=${reportId}`);
    }

    function setAwaitingSupabaseNewRow(val, submittedReportId = null) {
        isAwaitingSupabaseNewRow = Boolean(val);
        localStorage.setItem("omni_bridge_awaiting_supabase", isAwaitingSupabaseNewRow ? "true" : "false");
        if (submittedReportId) {
            lastSubmittedAnReportId = submittedReportId;
            localStorage.setItem("omni_bridge_last_submitted_an_id", submittedReportId);
        }
        logStateSnapshot("SET_AWAITING_SUPABASE", `awaiting=${isAwaitingSupabaseNewRow} lastSubmitted=${lastSubmittedAnReportId}`);
    }

    function getAutoMode() {
        const mode = localStorage.getItem("omni_bridge_auto_mode");
        if (mode) return mode;
        return localStorage.getItem("omni_bridge_auto_enabled") === "true" ? "SUBMIT" : "OFF";
    }

    function isAutoSubmitEnabled() {
        const cb = document.getElementById("omni-cb-auto-submit");
        if (cb) return cb.checked;
        return getAutoMode() === "SUBMIT";
    }

    function isAutoFillEnabled() {
        const cb = document.getElementById("omni-cb-auto-fill");
        if (cb) return cb.checked;
        return getAutoMode() === "FILL_ONLY";
    }

    function isAutoForwardToAnEnabled() {
        return isAutoSubmitEnabled() || isAutoFillEnabled();
    }

    // Correlation & Pending Report Guard (BRIDGE-PENDING-REPORT-CORRELATION-001)
    let currentCorrelation = {
        reportId: null,
        pendingAnReport: false,
        handledBy: null,
        handledAt: null,
        inReplyToMessageId: null,
        workOrderId: null,
        peResponseId: null
    };

    function getStoredHandledReports() {
        try {
            return JSON.parse(localStorage.getItem("omni_bridge_handled_reports") || "{}");
        } catch {
            return {};
        }
    }

    function saveHandledReport(reportId, peMessageId) {
        if (!reportId) return;
        const handled = getStoredHandledReports();
        handled[reportId] = {
            handledBy: "PE",
            peMessageId: peMessageId || "PE_LOCAL",
            handledAt: new Date().toISOString()
        };
        localStorage.setItem("omni_bridge_handled_reports", JSON.stringify(handled));
    }

    function isReportHandled(reportId) {
        if (!reportId) return false;
        const handled = getStoredHandledReports();
        return !!handled[reportId];
    }

    function getStoredConsumedReports() {
        try {
            return JSON.parse(localStorage.getItem("omni_bridge_consumed_reports") || "{}");
        } catch {
            return {};
        }
    }

    function saveConsumedReport(reportId) {
        if (!reportId) return;
        const consumed = getStoredConsumedReports();
        consumed[reportId] = {
            consumedAt: new Date().toISOString()
        };
        localStorage.setItem("omni_bridge_consumed_reports", JSON.stringify(consumed));
    }

    function isReportConsumed(reportId) {
        if (!reportId) return false;
        const consumed = getStoredConsumedReports();
        return !!consumed[reportId];
    }

    // ==========================================
    // SINGLE-FLIGHT LOCK (v1.0.16)
    // Một báo cáo AN chỉ được đổ vào PE ĐÚNG 1 LẦN. Sau khi đổ (CONSUMED) hoặc PE đã xử lý (HANDLED),
    // mọi nguồn sự kiện (SSE / Poll 3s / Rehydrate) đều KHÔNG được bật lại cờ "chờ đổ vào PE".
    // ==========================================
    function isReportLocked(reportId) {
        return isReportHandled(reportId) || isReportConsumed(reportId) || (typeof isReportInjected === 'function' && isReportInjected(reportId)) || Boolean(reportId && reportId === lastSubmittedAnReportId);
    }

    // Lý do chặn auto-inject (trả về chuỗi rỗng nếu được phép)
    function getAutoInjectBlockReason(reportId) {
        if (isAwaitingSupabaseNewRow) return "AWAITING_SUPABASE_UPDATE";
        const effId = reportId || currentAnMessageId || (currentCorrelation && currentCorrelation.reportId);
        if (effId && (effId === lastSubmittedAnReportId || isReportHandled(effId) || isReportConsumed(effId))) {
            return "REPORT_ALREADY_SUBMITTED";
        }
        if (effId && typeof isReportInjected === 'function' && isReportInjected(effId)) {
            return "REPORT_ALREADY_INJECTED";
        }
        if (isPeRequestInFlight) return "PE_REQUEST_IN_FLIGHT";
        if (isPeStreaming) return "PE_STREAMING";
        if (isWaitingForNewPeResponse) return "WAITING_PE_RESPONSE";
        if (typeof isPerplexityBusy === "function" && isPerplexityBusy()) return "PERPLEXITY_BUSY";
        if (typeof isPerplexityStreaming === "function" && isPerplexityStreaming()) return "PERPLEXITY_BUSY";
        return "";
    }

    // Áp khóa lên correlation nhận từ Hub (Hub cũ có thể vẫn trả pendingAnReport=true cho report đã CONSUMED)
    function applyLocalLockToCorrelation() {
        if (!currentCorrelation) return;
        if (!currentCorrelation.reportId && currentCorrelation.latestReport && currentCorrelation.latestReport.reportId) {
            currentCorrelation.reportId = currentCorrelation.latestReport.reportId;
        }
        const effId = currentCorrelation.reportId || currentAnMessageId;
        if (isAwaitingSupabaseNewRow || (effId && (effId === lastSubmittedAnReportId || isReportLocked(effId)))) {
            currentCorrelation.pendingAnReport = false;
            if (effId && isReportHandled(effId)) {
                currentCorrelation.handledBy = currentCorrelation.handledBy || "PE";
            }
        }
    }

    function recordAuditTrace(state, details = "") {
        const entry = {
            timestamp: new Date().toLocaleTimeString(),
            state,
            details,
            turn: currentTurnState,
            next: currentNextActor,
            delivery: currentDeliveryState,
            activity: currentActivityState,
            requestId: currentRequestId || 'N/A',
            peMessageId: currentPeMessageId || 'N/A'
        };
        auditEventHistory.unshift(entry);
        if (auditEventHistory.length > 30) auditEventHistory.pop();
        renderAuditTrace();
    }

    function renderAuditTrace() {
        const traceEl = document.getElementById("omni-audit-trace");
        if (!traceEl) return;
        traceEl.innerHTML = auditEventHistory.map(e =>
            `<div style="padding: 2px 0; border-bottom: 1px dashed #334155;">` +
            `<span style="color:#38bdf8;">[${e.timestamp}]</span> ` +
            `<b style="color:#f59e0b;">${e.state}</b> ` +
            `<span style="color:#94a3b8;">${e.details ? '• ' + e.details : ''}</span>` +
            `</div>`
        ).join("");
    }

    function formatJstDateTime(dateInput) {
        if (!dateInput) return "Chưa rõ giờ (JST)";
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return String(dateInput);
        try {
            const timePart = d.toLocaleTimeString("en-GB", { timeZone: "Asia/Tokyo", hour12: false });
            const datePart = d.toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
            return `${datePart} ${timePart} JST`;
        } catch {
            return d.toISOString();
        }
    }

    function formatJstTime(dateInput) {
        if (!dateInput) return "--:--:-- JST";
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return String(dateInput);
        try {
            return d.toLocaleTimeString("en-GB", { timeZone: "Asia/Tokyo", hour12: false }) + " JST";
        } catch {
            return d.toLocaleTimeString() + " JST";
        }
    }

    function getHubUrl() {
        return `http://127.0.0.1:${activeHubPort}`;
    }

    /**
     * Gửi HTTP request tới Hub qua GM_xmlhttpRequest nhằm vượt qua rào cản Mixed Content và PNA trên trang HTTPS
     */
    function hubRequest(url, options = {}) {
        const method = (options.method || 'GET').toUpperCase();
        const headers = options.headers || {};
        const data = options.body || options.data || null;
        const timeout = options.timeout || 4000;

        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: headers,
                    data: data,
                    timeout: timeout,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (e) {
                                resolve(res.responseText);
                            }
                        } else {
                            reject(new Error(`HTTP ${res.status}: ${res.statusText || 'Error'}`));
                        }
                    },
                    onerror: (err) => reject(new Error("Lỗi mạng khi kết nối Hub (GM_xmlhttpRequest)")),
                    ontimeout: () => reject(new Error("Hết thời gian chờ phản hồi từ Hub"))
                });
            } else {
                fetch(url, {
                    method: method,
                    headers: headers,
                    body: data,
                    cache: "no-store"
                })
                .then(async (res) => {
                    if (res.ok) {
                        try { return resolve(await res.json()); } catch (e) { return resolve(await res.text()); }
                    }
                    reject(new Error(`HTTP ${res.status}`));
                })
                .catch(reject);
            }
        });
    }

    async function autoDiscoverHub() {
        for (const p of CONFIG.CANDIDATE_PORTS) {
            try {
                const res = await hubRequest(`http://127.0.0.1:${p}/api/status`, { timeout: 1000 });
                if (res && res.status === "online") {
                    if (activeHubPort !== p) {
                        activeHubPort = p;
                        localStorage.setItem("omni_bridge_hub_port", p);
                        console.log(`[Omni Bridge] 🔌 Tự động tìm thấy Hub tại cổng ${p}`);
                    }
                    return true;
                }
            } catch(e) {}
        }
        return false;
    }



    function logStateSnapshot(eventName, details = "") {
        const pReport = currentCorrelation ? currentCorrelation.pendingAnReport : false;
        console.log(`[Omni Bridge State Snapshot] [${eventName}] ` +
            `currentTurnState=${currentTurnState} | ` +
            `pendingAnReport=${pReport} | ` +
            `currentWorkflowState=${currentWorkflowState} | ` +
            `currentActivityState=${currentActivityState}` +
            (details ? ` | ${details}` : "")
        );
    }

    let isAtomicUpdating = false;

    function setTurnState(turnState, nextActor, reason = "") {
        currentTurnState = turnState;
        currentNextActor = nextActor;
        recordAuditTrace(`[TURN] ${turnState} (Next: ${nextActor})`, reason);
        logStateSnapshot("SET_TURN_STATE", `turn=${turnState} next=${nextActor} (${reason})`);
        if (!isAtomicUpdating) renderTurnUI();
    }

    function setDeliveryState(state, info = "") {
        currentDeliveryState = state;
        if (state === DELIVERY_STATES.WAITING_FOR_ACK) {
            if (waitingAckTimer) clearInterval(waitingAckTimer);
            waitingAckElapsedSec = 0;
            waitingAckTimer = setInterval(() => {
                waitingAckElapsedSec++;
                const statusText = document.getElementById("omni-status-text");
                if (statusText && currentTurnState === TURN_STATES.AN_TURN && currentDeliveryState === DELIVERY_STATES.WAITING_FOR_ACK) {
                    const senderName = lastSupabaseRecord && lastSupabaseRecord.sender === 'THOAN' ? 'Minh Chủ THOAN' : 'PE';
                    statusText.innerHTML = `🟡 <b>[LƯỢT AN]</b> ${senderName} đã ra chỉ thị (Chờ AN xác nhận đã nhận: ${waitingAckElapsedSec}s) — Chờ AN thi công`;
                }
                const deliveryEl = document.getElementById("omni-ssot-delivery");
                if (deliveryEl && currentDeliveryState === DELIVERY_STATES.WAITING_FOR_ACK) {
                    deliveryEl.textContent = `WAITING_FOR_ACK (${waitingAckElapsedSec}s)`;
                }
            }, 1000);
        } else {
            if (waitingAckTimer) {
                clearInterval(waitingAckTimer);
                waitingAckTimer = null;
                waitingAckElapsedSec = 0;
            }
        }
        recordAuditTrace(`[DELIVERY] ${state}`, info);
        logStateSnapshot("SET_DELIVERY_STATE", `delivery=${state} (${info})`);
        if (!isAtomicUpdating) renderTurnUI();
    }

    function setActivityState(activity, ttlSec = 60, reason = "") {
        if (activityTtlTimer) {
            clearInterval(activityTtlTimer);
            activityTtlTimer = null;
        }

        currentActivityState = activity;
        activityRemainingSec = ttlSec;

        if (activity !== ACTIVITY_STATES.IDLE && ttlSec > 0) {
            recordAuditTrace(`[ACTIVITY] ${activity} (TTL: ${ttlSec}s)`, reason);
            activityTtlTimer = setInterval(() => {
                activityRemainingSec--;
                if (activityRemainingSec <= 0) {
                    clearInterval(activityTtlTimer);
                    activityTtlTimer = null;
                    const prev = currentActivityState;
                    currentActivityState = ACTIVITY_STATES.IDLE;
                    recordAuditTrace(`[ACTIVITY_EXPIRED] ${prev}`, "Hết TTL, tự động quay về Turn State");
                    logStateSnapshot("ACTIVITY_EXPIRED", `prev=${prev}`);
                    renderTurnUI();
                } else {
                    renderActivityChip();
                }
            }, 1000);
        } else {
            recordAuditTrace(`[ACTIVITY_CLEARED]`, reason);
        }
        logStateSnapshot("SET_ACTIVITY_STATE", `activity=${activity} ttl=${ttlSec}s (${reason})`);
        if (!isAtomicUpdating) renderTurnUI();
    }

    function terminateActivity(reason = "") {
        if (activityTtlTimer) {
            clearInterval(activityTtlTimer);
            activityTtlTimer = null;
        }
        currentActivityState = ACTIVITY_STATES.IDLE;
        activityRemainingSec = 0;
        recordAuditTrace(`[ACTIVITY_TERMINATED]`, reason);
        logStateSnapshot("TERMINATE_ACTIVITY", reason);
        if (!isAtomicUpdating) renderTurnUI();
    }

    // CHUYỂN TRẠNG THÁI NGUYÊN TỬ KHI AN NỘP BÁO CÁO (TRÁNH FLICKER & ĐỒNG BỘ 1 BƯỚC)
    function transitionToAnReported(record, source = "UNKNOWN", timeStr = null) {
        if (!timeStr) {
            timeStr = formatJstTime(record.created_at || Date.now());
        }

        // SINGLE-FLIGHT (v1.0.16/v2.2.0): Sự kiện trùng cho CÙNG một báo cáo (Hub phát 3 sự kiện cho 1 lần nộp,
        // cộng Poll 3s) KHÔNG được reset cờ in-flight / streaming và KHÔNG được bật lại auto-submit.
        const isSameReport = Boolean(record.id && (record.id === currentAnMessageId || record.id === lastSubmittedAnReportId) && (currentCorrelation.reportId === record.id || !currentCorrelation.reportId));
        if (isSameReport && (isReportConsumed(record.id) || isAwaitingSupabaseNewRow)) {
            // Chỉ nâng cấp nội dung nếu bản mới đầy đủ hơn (tránh bị ghi đè bởi placeholder "Bản ghi báo cáo ID:")
            const incoming = record.content_md || "";
            if (incoming.length > (lastAnReportContent || "").length && !/^B[aả]n ghi b[aá]o c[aá]o ID:/i.test(incoming.trim())) {
                lastAnReportContent = incoming;
            }
            applyLocalLockToCorrelation();
            logStateSnapshot("TRANSITION_TO_AN_REPORTED_DUPLICATE_IGNORED", `ID=${record.id} Source=${source}`);
            renderTurnUI();
            return;
        }

        isAtomicUpdating = true;
        // Invariant 2: Khi AN row persist, lập tức giải phóng AN_WORKING, đặt ACKNOWLEDGED, đặt PE_TURN
        terminateActivity("AN row persisted on Supabase");
        setDeliveryState(DELIVERY_STATES.ACKNOWLEDGED, `AN đã nộp báo cáo`);
        setTurnState(TURN_STATES.PE_TURN, "PE", `AN đã nộp báo cáo (${timeStr}) • Msg: ${record.id.slice(0, 8)}... [${source}]`);

        currentWorkflowState = STATES.AN_REPORTED;
        currentAnMessageId = record.id;
        lastAnReportContent = record.content_md || "";

        // Chốt baseline hash của văn bản PE hiện tại để chống nhận diện nhầm văn bản cũ
        const existingPe = getLatestPeResponse();
        if (existingPe && existingPe.text) {
            baselinePeTextHash = hashString(existingPe.text);
        }

        const alreadyHandled = isReportHandled(record.id);
        const alreadyConsumed = isReportConsumed(record.id) || (record.id === lastSubmittedAnReportId);
        // Chỉ reset cờ PE khi đây là báo cáo MỚI chưa từng được đổ vào PE
        if (!alreadyConsumed && !isAwaitingSupabaseNewRow) {
            isWaitingForNewPeResponse = false;
            hasObservedNewStream = false;
            isPeRequestInFlight = false;
            isPeStreaming = false;
        }
        currentCorrelation.reportId = record.id;
        currentCorrelation.pendingAnReport = !alreadyHandled && !alreadyConsumed && !isAwaitingSupabaseNewRow;
        if (alreadyHandled) {
            currentCorrelation.handledBy = "PE";
        }

        updatePreviewFeed(record, source);
        
        if (!isBridgePaused && currentCorrelation.pendingAnReport) {
            playTone(587.33, 0.25);
            showToast(`🔔 AN đã nộp xong báo cáo [${lastThreadId}]! Sẵn sàng gọi PE.`, "success");
        }
        logStateSnapshot("TRANSITION_TO_AN_REPORTED", `ID=${record.id} Source=${source}`);

        isAtomicUpdating = false;
        renderTurnUI();
    }

    // CHUYỂN TRẠNG THÁI NGUYÊN TỬ KHI PE RA CHỈ THỊ (TRÁNH FLICKER & ĐỒNG BỘ 1 BƯỚC)
    function transitionToPeDirective(record, source = "UNKNOWN", timeStr = null) {
        if (!timeStr) {
            timeStr = formatJstTime(record.created_at || Date.now());
        }
        isAtomicUpdating = true;
        // Invariant 1: Khi PE row persist, lập tức giải phóng PE_THINKING và giải phóng chờ Supabase
        terminateActivity("PE row persisted on Supabase");
        setAwaitingSupabaseNewRow(false);
        currentPeMessageId = record.id;

        const inReplyTo = extractInReplyTo(record.content_md) || currentCorrelation.reportId || currentAnMessageId;
        if (inReplyTo) {
            saveHandledReport(inReplyTo, record.id);
        }
        currentCorrelation.pendingAnReport = false;
        currentCorrelation.handledBy = "PE";
        currentCorrelation.handledAt = record.created_at || new Date().toISOString();
        currentCorrelation.inReplyToMessageId = inReplyTo;
        currentCorrelation.peResponseId = record.id;

        setTurnState(TURN_STATES.AN_TURN, "AN", `PE đã gửi phản hồi (${timeStr}) • Msg: ${record.id.slice(0, 8)}... [${source}]`);
        setDeliveryState(DELIVERY_STATES.WAITING_FOR_ACK, `Chờ AN xác nhận (ACK) • Msg: ${record.id.slice(0, 8)}...`);
        currentWorkflowState = STATES.WAITING_FOR_AN_ACK;

        updatePreviewFeed(record, source);
        logStateSnapshot("TRANSITION_TO_PE_DIRECTIVE", `ID=${record.id} Source=${source}`);

        isAtomicUpdating = false;
        renderTurnUI();
    }

    // CHUYỂN TRẠNG THÁI NGUYÊN TỬ KHI MINH CHỦ THOAN RA CHỈ THỊ TRỰC TIẾP
    function transitionToThoanDirective(record, source = "UNKNOWN", timeStr = null) {
        if (!timeStr) {
            timeStr = formatJstTime(record.created_at || Date.now());
        }
        isAtomicUpdating = true;
        terminateActivity("THOAN directive persisted on Supabase");
        setAwaitingSupabaseNewRow(false);
        currentPeMessageId = record.id;

        currentCorrelation.pendingAnReport = false;
        currentCorrelation.handledBy = "THOAN";
        currentCorrelation.handledAt = record.created_at || new Date().toISOString();
        currentCorrelation.inReplyToMessageId = null;
        currentCorrelation.peResponseId = record.id;

        setTurnState(TURN_STATES.AN_TURN, "AN", `Minh Chủ THOAN đã ra chỉ thị (${timeStr}) • Msg: ${record.id.slice(0, 8)}... [${source}]`);
        setDeliveryState(DELIVERY_STATES.WAITING_FOR_ACK, `Chờ AN xác nhận (ACK) • Msg: ${record.id.slice(0, 8)}...`);
        currentWorkflowState = STATES.WAITING_FOR_AN_ACK;

        updatePreviewFeed(record, source);
        logStateSnapshot("TRANSITION_TO_THOAN_DIRECTIVE", `ID=${record.id} Source=${source}`);

        isAtomicUpdating = false;
        renderTurnUI();
    }

    function setTransportState(transport) {
        currentTransportState = transport;
        const transViewer = document.getElementById("omni-ssot-transport");
        if (transViewer) transViewer.textContent = transport;
    }

    function renderActivityChip() {
        const actChip = document.getElementById("omni-activity-chip");
        const actViewer = document.getElementById("omni-ssot-activity");
        if (actChip) {
            if (currentActivityState !== ACTIVITY_STATES.IDLE && activityRemainingSec > 0) {
                actChip.style.display = "inline-flex";
                if (currentActivityState === ACTIVITY_STATES.PE_THINKING) {
                    actChip.style.background = "#e0f2fe";
                    actChip.style.color = "#0369a1";
                    actChip.style.border = "1px solid #bae6fd";
                    actChip.textContent = `🔵 PE đang nghĩ (${activityRemainingSec}s)`;
                } else if (currentActivityState === ACTIVITY_STATES.AN_WORKING) {
                    actChip.style.background = "#fef3c7";
                    actChip.style.color = "#b45309";
                    actChip.style.border = "1px solid #fde68a";
                    actChip.textContent = `⚙️ AN đang làm (${activityRemainingSec}s)`;
                }
            } else {
                actChip.style.display = "none";
            }
        }
        if (actViewer) {
            actViewer.textContent = currentActivityState !== ACTIVITY_STATES.IDLE ? `${currentActivityState} (${activityRemainingSec}s)` : "IDLE";
        }
    }

    // ==========================================
    // 2. CHUÔNG ÂM THANH BÁO HIỆU (WEB AUDIO API)
    // ==========================================
    function playTone(freq = 587.33, duration = 0.22) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration * 0.6);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    }

    // ==========================================
    // 3. TOAST THÔNG BÁO GÓC MÀN HÌNH
    // ==========================================
    function showToast(msg, type = "info") {
        let el = document.getElementById("omni-bridge-toast");
        if (el) el.remove();
        el = document.createElement("div");
        el.id = "omni-bridge-toast";
        el.setAttribute("translate", "no");
        el.className = "notranslate no-katex";
        const bg = type === "success" ? "#059669" : type === "warn" ? "#d97706" : type === "error" ? "#dc2626" : "#0284c7";
        el.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bg};
            color: #ffffff;
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 13px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            z-index: 9999999;
            pointer-events: none;
            transition: all 0.3s ease;
        `;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => { if (el) el.remove(); }, 4000);
    }

    // ==========================================
    // 3.1. XỬ LÝ TIẾNG VIỆT KHÔNG DẤU & CHỐNG XUNG ĐỘT KATEX
    // ==========================================
    function removeVietnameseTones(str) {
        if (!str) return '';
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function sanitizeLatexConflicts(text) {
        if (!text) return '';
        // Thoát dấu $ đơn lẻ để tránh KaTeX parse nhầm tiếng Việt thành LaTeX gây lỗi Unicode
        return text.replace(/\$([0-9a-zA-Z\s])/g, "\\$$1");
    }

    // ==========================================
    // 4. ĐIỀN TEXT & GỬI VÀO PERPLEXITY (REACT COMPLIANT)
    // ==========================================
    function setReactInputValue(el, value) {
        if (!el) return false;
        el.focus();

        const cbNoAccents = document.getElementById("omni-cb-no-accents");
        const isNoAccents = cbNoAccents ? cbNoAccents.checked : (localStorage.getItem("omni_bridge_no_accents") === "true");
        let processedValue = value;
        if (isNoAccents) {
            processedValue = removeVietnameseTones(processedValue);
        }
        processedValue = sanitizeLatexConflicts(processedValue);

        if (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') {
            const proto = el.tagName.toLowerCase() === 'textarea' 
                ? window.HTMLTextAreaElement.prototype 
                : window.HTMLInputElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

            // 1. Dispatch beforeinput
            try {
                el.dispatchEvent(new InputEvent('beforeinput', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: processedValue
                }));
            } catch(e) {}

            if (el._valueTracker) el._valueTracker.setValue('');
            if (nativeSetter) {
                nativeSetter.call(el, '');
                el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                nativeSetter.call(el, processedValue);
            } else {
                el.value = '';
                el.value = processedValue;
            }

            // 2. Dispatch InputEvent + Event + Change + Keyup
            try {
                el.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: processedValue
                }));
            } catch(e) {}
            el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: ' ' }));
        } else {
            // Lexical / ContentEditable
            try {
                document.execCommand('selectAll', false, null);
                document.execCommand('delete', false, null);
            } catch(e) {}
            const sel = window.getSelection();
            if (sel) {
                const range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            try {
                document.execCommand('delete', false, null);
            } catch(e) {}
            if (el.textContent && el.textContent.trim().length > 0) {
                el.textContent = '';
            }
            document.execCommand('insertText', false, processedValue);
            el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
        el.focus();
        return true;
    }

    // Fail-safe alias
    const setInputValue = setReactInputValue;

    function findPerplexityInput() {
        // LOẠI TRỪ TOÀN BỘ CÁC PHẦN TỬ TRONG KHUNG GIAO DIỆN OMNI BRIDGE PANEL!
        // Tránh nhầm lẫn với textarea #omni-test-input hoặc input #omni-test-thread
        const candidates = Array.from(document.querySelectorAll('textarea, div[contenteditable="true"], div[role="textbox"]'))
            .filter(el => !el.closest('#omni-bridge-panel'));

        const visible = candidates.filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && (rect.width > 30 || rect.height > 20);
        });

        // 1. Nếu Minh Chủ đang focus vào một ô nhập Perplexity trên trang
        if (document.activeElement && candidates.includes(document.activeElement)) {
            return document.activeElement;
        }

        // 2. Ô nhập chính của Perplexity
        return visible[visible.length - 1] || candidates[0] || null;
    }

    function triggerRealisticInput(el, text) {
        el.focus();
        
        // 1. BeforeInput
        try {
            const beforeInputEvent = new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text
            });
            el.dispatchEvent(beforeInputEvent);
        } catch(e) {}

        // 2. Set value qua Prototype Setter
        if (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') {
            const proto = el.tagName.toLowerCase() === 'textarea' 
                ? window.HTMLTextAreaElement.prototype 
                : window.HTMLInputElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

            if (el._valueTracker) el._valueTracker.setValue('');
            if (nativeSetter) {
                nativeSetter.call(el, text);
            } else {
                el.value = text;
            }
        }

        // 3. InputEvent (inputType: insertText)
        try {
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text
            });
            el.dispatchEvent(inputEvent);
        } catch(e) {
            el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }

        // 4. Change & Keyup
        el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
    }

    function clickElementCompletely(el) {
        if (!el) return;
        el.focus();
        const evOpts = { bubbles: true, cancelable: true, view: window };
        try { el.dispatchEvent(new PointerEvent('pointerdown', evOpts)); } catch(e) {}
        try { el.dispatchEvent(new MouseEvent('mousedown', evOpts)); } catch(e) {}
        try { el.dispatchEvent(new PointerEvent('pointerup', evOpts)); } catch(e) {}
        try { el.dispatchEvent(new MouseEvent('mouseup', evOpts)); } catch(e) {}
        el.click();
    }

    function dispatchRealisticEnter(el) {
        if (!el) return;
        el.focus();
        const evOpts = {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            charCode: 13,
            bubbles: true,
            cancelable: true,
            composed: true,
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
            metaKey: false
        };
        el.dispatchEvent(new KeyboardEvent('keydown', evOpts));
        el.dispatchEvent(new KeyboardEvent('keypress', evOpts));
        el.dispatchEvent(new KeyboardEvent('keyup', evOpts));
    }

    function findPerplexitySubmitButton(inputEl) {
        if (!inputEl) inputEl = findPerplexityInput();

        // 1. Xác định container chứa cả input và thanh công cụ toolbar
        let root = null;
        if (inputEl) {
            root = inputEl.closest('form');
            if (!root) {
                let p = inputEl.parentElement;
                for (let i = 0; i < 7 && p; i++) {
                    const btnCount = p.querySelectorAll('button').length;
                    if (btnCount >= 3) {
                        root = p;
                        break;
                    }
                    p = p.parentElement;
                }
            }
        }
        if (!root) root = document;

        // 2. Thu thập các button hiển thị, loại trừ toàn bộ panel của OmniBridge
        const allButtons = Array.from(root.querySelectorAll('button'))
            .filter(b => !b.closest('#omni-bridge-panel'));

        // Hàm kiểm tra button thuộc danh sách cấm (connector chip, tool phụ)
        function isExcludedButton(b) {
            const text = (b.textContent || '').toLowerCase().trim();
            const aria = (b.getAttribute('aria-label') || '').toLowerCase().trim();
            const title = (b.getAttribute('title') || '').toLowerCase().trim();
            const testId = (b.getAttribute('data-testid') || '').toLowerCase().trim();
            const combined = `${text} ${aria} ${title} ${testId}`;

            // A. Loại bỏ chip connector (@ GitHub, @ Supabase)
            if (combined.includes('github') || combined.includes('supabase') || text.startsWith('@')) return true;

            // B. Loại bỏ các nút chức năng phụ trong toolbar
            const bannedKeywords = [
                'search', 'tim kiem', 'focus',
                'computer', 'may tinh',
                'draft', 'nhap',
                'model', 'mo hinh', 'claude', 'sonnet', 'thinking', 'deepseek', 'gpt',
                'attach', 'file', 'tep', 'dinh kem', 'upload',
                'mic', 'audio', 'voice', 'am thanh', 'giong noi',
                'pro', 'copilot', 'collections', 'share', 'download', 'comet',
                'close', 'dong', 'clear', 'xoa', 'cancel', 'huy'
            ];
            for (const kw of bannedKeywords) {
                if (combined.includes(kw)) return true;
            }

            // C. Nút dấu cộng (+) thêm tệp ở đầu toolbar
            if (text === '+' || text === '＋') return true;

            return false;
        }

        const validCandidates = allButtons.filter(b => {
            const rect = b.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return false;
            const style = window.getComputedStyle(b);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            return !isExcludedButton(b);
        });

        if (validCandidates.length === 0) return null;

        // Ưu tiên 1: Nút có aria-label hoặc title biểu thị submit rõ ràng
        for (const b of validCandidates) {
            const rawAria = ((b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '')).toLowerCase();
            const normAria = removeVietnameseTones(rawAria);
            if (normAria.includes('submit') || normAria.includes('send') || normAria.includes('gui') || normAria.includes('hoi') || normAria.includes('ask')) {
                return b;
            }
        }

        // Ưu tiên 2: type="submit"
        const typeSubmit = validCandidates.find(b => b.type === 'submit');
        if (typeSubmit) return typeSubmit;

        // Ưu tiên 3: Nút tròn đen [↑] ở ngoài cùng bên phải của thanh công cụ (Rightmost Bottom)
        // Perplexity đặt nút Submit ở tận cùng bên phải thanh toolbar dưới ô chat
        validCandidates.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            // Nút ở hàng dưới hơn (rect.bottom lớn hơn) được ưu tiên
            if (Math.abs(rectA.bottom - rectB.bottom) > 15) {
                return rectB.bottom - rectA.bottom;
            }
            // Trong cùng một hàng: nút ở tận cùng bên phải (rect.right lớn hơn) được ưu tiên
            return rectB.right - rectA.right;
        });

        return validCandidates[0] || null;
    }

    async function submitPerplexityInput(inputEl, maxRetries = 3) {
        if (!inputEl) inputEl = findPerplexityInput();
        if (!inputEl) return false;

        const originalText = (inputEl.value || inputEl.textContent || '').trim();
        if (originalText.length === 0) return true;

        // v1.0.16: Đọc lại ô nhập MỚI NHẤT (React/Lexical có thể render lại node sau khi gửi -> node cũ bị tách khỏi DOM
        // và vẫn giữ text cũ, khiến bản cũ tưởng "chưa gửi" rồi gõ lại + gửi lặp).
        const readCurrentVal = () => {
            const fresh = findPerplexityInput();
            const el = (fresh && fresh.isConnected) ? fresh : inputEl;
            return (el.value || el.textContent || '').trim();
        };
        const wasStreamingBefore = isPerplexityStreaming();
        const isAccepted = () => {
            const v = readCurrentVal();
            if (v === '' || v.length < originalText.length * 0.3) return true;
            // PE vừa BẮT ĐẦU trả lời sau khi gửi => tin nhắn chắc chắn đã được nhận
            if (!wasStreamingBefore && isPerplexityStreaming()) return true;
            return false;
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (isAccepted() && attempt > 1) return true;
            const submitBtn = findPerplexitySubmitButton(inputEl);
            
            // 1. Thử click nút submit
            if (submitBtn) {
                console.log(`[Omni Bridge] 🎯 Đang thử click nút Submit (Lần ${attempt}):`, submitBtn);
                try {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.disabled = false;
                    submitBtn.setAttribute('aria-disabled', 'false');
                } catch(e) {}
                clickElementCompletely(submitBtn);
                await new Promise(r => setTimeout(r, 900));
                if (isAccepted()) {
                    console.log("[Omni Bridge] ✅ Submit thành công qua click nút Submit!");
                    return true;
                }
            }

            // 2. Thử dispatch Enter
            console.log(`[Omni Bridge] ⌨️ Thử gửi qua phím Enter (Lần ${attempt})...`);
            dispatchRealisticEnter(inputEl);
            await new Promise(r => setTimeout(r, 900));
            if (isAccepted()) {
                console.log("[Omni Bridge] ✅ Submit thành công qua Enter!");
                return true;
            }

            // 3. Thử form.requestSubmit()
            const form = inputEl.closest('form');
            if (form && typeof form.requestSubmit === 'function') {
                try {
                    form.requestSubmit();
                    await new Promise(r => setTimeout(r, 900));
                    if (isAccepted()) {
                        console.log("[Omni Bridge] ✅ Submit thành công qua form.requestSubmit()!");
                        return true;
                    }
                } catch(e) {}
            }

            // Kích hoạt lại input để React reconcile — CHỈ khi ô nhập vẫn còn nguyên văn bản (chưa gửi)
            if (!isAccepted()) {
                triggerRealisticInput(inputEl, originalText);
                await new Promise(r => setTimeout(r, 400));
            } else {
                return true;
            }
        }

        // Kiểm tra lần cuối
        const isSuccess = isAccepted();
        console.log(`[Omni Bridge] 🏁 Kết quả submit cuối cùng: ${isSuccess ? 'THÀNH CÔNG' : 'CHƯA GỬI ĐƯỢC'}`);
        return isSuccess;
    }

    // Sinh độ trễ submit ngẫu nhiên trong khoảng [minSec, maxSec] (mặc định 1 - 4 giây)
    function getRandomSubmitDelayMs(minSec = CONFIG.AUTO_SUBMIT_MIN_SEC, maxSec = CONFIG.AUTO_SUBMIT_MAX_SEC) {
        const minMs = minSec * 1000;
        const maxMs = maxSec * 1000;
        return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }

    // Đóng gói nội dung tin nhắn báo cáo gửi tới PE (hỗ trợ chế độ không dấu)
    function buildAnReportPingMessage(customText = null) {
        if (customText) return customText;
        let pingMsg = "";
        if (lastAnReportContent && lastAnReportContent.trim().length > 0) {
            const reportSnippet = lastAnReportContent.trim().slice(0, 250);
            pingMsg = `AN đã nộp báo cáo [ID: ${currentAnMessageId ? currentAnMessageId.slice(0, 8) : 'LATEST'} | Thread: ${lastThreadId}]:\n\n${reportSnippet}\n\nKính mời PE thẩm định và phản hồi tiếp theo.`;
        } else {
            pingMsg = CONFIG.PING_PE_MESSAGE;
        }
        const cbNoAccents = document.getElementById("omni-cb-no-accents");
        const isNoAccents = cbNoAccents ? cbNoAccents.checked : (localStorage.getItem("omni_bridge_no_accents") === "true");
        if (isNoAccents) {
            pingMsg = removeVietnameseTones(pingMsg);
        }
        return pingMsg;
    }

    // Thực thi điền và gửi (Hỗ trợ 2 chế độ: shouldSubmit = true [Đổ & Submit] hoặc false [Chỉ dán chatbox])
    async function executeFillAndSubmit(force = false, customText = null, shouldSubmit = true) {
        if (isSubmitting) return false;

        logStateSnapshot("EXECUTE_FILL_SUBMIT_START", `force=${force} customText=${Boolean(customText)} shouldSubmit=${shouldSubmit}`);

        if (isBridgePaused && !force && !customText) {
            showToast("⏸️ Cầu nối đang tạm dừng! Hãy nhấn Tiếp tục (Alt+P) trước.", "warn");
            return false;
        }

        // 1. Kiểm tra đã xử lý xong chưa (SSOT)
        const isHandled = currentAnMessageId ? isReportHandled(currentAnMessageId) : false;
        if (shouldSubmit && !force && !customText && isHandled) {
            showToast("ℹ️ Báo cáo này đã được PE xử lý rồi! Không thể đổ lại vào PE.", "warn");
            return false;
        }

        // 1b. SINGLE-FLIGHT (v1.0.16/v2.3.0): Luồng TỰ ĐỘNG tuyệt đối không đổ lại báo cáo đã đổ, và không chen ngang khi PE đang trả lời/suy nghĩ
        if (!force && !customText) {
            if (typeof isPerplexityBusy === "function" && isPerplexityBusy()) {
                logStateSnapshot("AUTO_INJECT_BLOCKED", `reason=PERPLEXITY_BUSY report=${currentAnMessageId}`);
                console.log(`[Omni Bridge] 🔒 Chặn auto-inject (PE đang suy nghĩ / làm việc) cho report ${currentAnMessageId}`);
                return false;
            }
            if (currentAnMessageId && typeof isReportInjected === "function" && isReportInjected(currentAnMessageId) && !shouldSubmit) {
                logStateSnapshot("AUTO_INJECT_BLOCKED", `reason=REPORT_ALREADY_INJECTED report=${currentAnMessageId}`);
                console.log(`[Omni Bridge] 🔒 Báo cáo [${currentAnMessageId}] đã được dán vào ô chat 1 lần rồi. Chờ người dùng duyệt gửi hoặc bấm thủ công.`);
                currentCorrelation.pendingAnReport = false;
                return false;
            }
            const blockReason = getAutoInjectBlockReason(currentAnMessageId);
            if (blockReason) {
                logStateSnapshot("AUTO_INJECT_BLOCKED", `reason=${blockReason} report=${currentAnMessageId}`);
                console.log(`[Omni Bridge] 🔒 Chặn auto-inject (${blockReason}) cho report ${currentAnMessageId}`);
                if (blockReason === "REPORT_HANDLED" || blockReason === "REPORT_ALREADY_INJECTED" || blockReason === "REPORT_ALREADY_SUBMITTED") {
                    currentCorrelation.pendingAnReport = false; // Khóa vĩnh viễn cho report này
                }
                // Các lý do tạm thời (PE đang bận) chỉ HOÃN — renderTurnUI sẽ thử lại khi PE rảnh
                return false;
            }
        }

        // 2. SSOT: Kiểm tra currentTurnState (Bỏ hoàn toàn currentWorkflowState khỏi điều kiện chặn)
        if (!force && !customText && currentTurnState !== TURN_STATES.PE_TURN && currentTurnState !== TURN_STATES.IDLE) {
            if (currentTurnState === TURN_STATES.AN_TURN) {
                showToast("⚠️ AN đang thi công, vui lòng chờ nộp báo cáo!", "warn");
            } else {
                showToast(`ℹ️ Chưa sẵn sàng nạp vào PE (Lượt hiện tại: ${currentTurnState})`, "warn");
            }
            return false;
        }

        isSubmitting = true;

        if (autoSubmitInterval) {
            clearInterval(autoSubmitInterval);
            autoSubmitInterval = null;
        }

        currentRequestId = `req-${Date.now()}`;
        setWorkflowState(STATES.PE_REQUEST_QUEUED, currentRequestId);

        const inputEl = findPerplexityInput();
        if (!inputEl) {
            showToast("❌ Không tìm thấy ô nhập câu hỏi trên Perplexity!", "error");
            isSubmitting = false;
            setWorkflowState(STATES.FAILED, "Không tìm thấy ô nhập");
            return false;
        }

        const pingMsg = buildAnReportPingMessage(customText);

        setReactInputValue(inputEl, pingMsg);
        lastFilledReportId = currentAnMessageId;
        if (currentAnMessageId && typeof markReportInjected === 'function') {
            markReportInjected(currentAnMessageId);
        }
        updatePreviewBox(`[GỬI TỚI PE - ${new Date().toLocaleTimeString()}] (Req: ${currentRequestId} | Thread: ${lastThreadId})\n\n${pingMsg}`);

        // NẾU LÀ CHẾ ĐỘ CHỈ DÁN VÀO CHATBOX (SUBMIT THỦ CÔNG)
        if (!shouldSubmit) {
            isSubmitting = false;
            showToast("📝 Đã dán báo cáo vào ô chat — Sẵn sàng để Minh Chủ bấm gửi!", "info");
            const statusText = document.getElementById("omni-status-text");
            if (statusText) {
                statusText.innerHTML = `📝 <b>[ĐÃ DÁN]</b> Báo cáo đã ở ô chat — Chờ THOAN duyệt & bấm Gửi (Alt+F9)`;
            }
            const btnSendPe = document.getElementById("omni-btn-send-pe");
            if (btnSendPe) {
                btnSendPe.disabled = false;
                btnSendPe.textContent = "🚀 Gửi ngay cho PE (Alt+F9)";
                btnSendPe.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                btnSendPe.style.color = "#ffffff";
            }
            return true;
        }

        // NẾU LÀ CHẾ ĐỘ TỰ ĐỘNG SUBMIT:
        showToast(`⚡ Đã điền nội dung — Đang kích hoạt tự động gửi...`, "info");
        const currentPe = getLatestPeResponse();
        if (currentPe && currentPe.text) {
            baselinePeTextHash = hashString(currentPe.text);
        }
        isWaitingForNewPeResponse = true;
        hasObservedNewStream = false;

        // SINGLE-FLIGHT & WAIT STATE (v2.2.0): KHÓA báo cáo & BẬT TRẠNG THÁI CHỜ SUPABASE CẬP NHẬT NGAY TRƯỚC KHI SUBMIT
        const lockedReportId = currentAnMessageId || (currentCorrelation && currentCorrelation.reportId) || (lastSupabaseRecord && lastSupabaseRecord.sender === 'AN' ? lastSupabaseRecord.id : null);
        if (lockedReportId) {
            saveConsumedReport(lockedReportId);
        }
        setAwaitingSupabaseNewRow(true, lockedReportId);
        currentCorrelation.pendingAnReport = false;

        setTimeout(async () => {
            const sent = await submitPerplexityInput(inputEl);
            isPeRequestInFlight = true;
            pendingRequestId = currentRequestId;
            if (sent) {
                manualSendRequiredReportId = null;
                showToast("🚀 Đã gửi lệnh vào Perplexity (PE)!", "success");
                if (lockedReportId) {
                    localStorage.setItem("omni_bridge_last_sent_an_id", lockedReportId);
                    sendToHub(`${getHubUrl()}/api/reports/consume`, JSON.stringify({
                        threadId: lastThreadId,
                        reportId: lockedReportId,
                        by: 'USER_INJECTION'
                    })).catch(() => {});
                }
                setWorkflowState(STATES.PE_REQUEST_DELIVERED, currentRequestId, 'LIVE_OPTIMISTIC');
                renderTurnUI();
            } else {
                // KHÔNG bật lại pendingAnReport (tránh auto-submit lặp). Chuyển sang gửi THỦ CÔNG.
                isPeRequestInFlight = false;
                isWaitingForNewPeResponse = false;
                setAwaitingSupabaseNewRow(false); // Chưa gửi được vào PE nên chưa vào trạng thái chờ Supabase
                manualSendRequiredReportId = lockedReportId;
                showToast("📝 Đã dán vào ô chat — Vui lòng bấm nút [↑] hoặc Alt+F9 để gửi!", "warn");
                const statusText = document.getElementById("omni-status-text");
                if (statusText) {
                    statusText.innerHTML = `📝 <b>[ĐÃ DÁN VÀO CHAT]</b> Vui lòng bấm nút <b>[↑]</b> hoặc <b>Alt+F9</b> để gửi cho PE!`;
                }
                const btnSendPe = document.getElementById("omni-btn-send-pe");
                if (btnSendPe) {
                    btnSendPe.disabled = false;
                    btnSendPe.textContent = "🚀 Bấm để gửi (Alt+F9)";
                    btnSendPe.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                    btnSendPe.style.color = "#ffffff";
                    btnSendPe.style.cursor = "pointer";
                }
            }

            setTimeout(() => { isSubmitting = false; }, 1200);
        }, 800);

        return true;
    }

    // ==========================================
    // 4.1. BẮT SỰ KIỆN GỬI THỦ CÔNG CỦA MINH CHỦ & KHÓA TRẠNG THÁI CHỜ
    // ==========================================
    function markReportSubmitted(reportId) {
        if (!reportId) return;
        saveConsumedReport(reportId);
        setAwaitingSupabaseNewRow(true, reportId);
        if (typeof markReportInjected === 'function') {
            markReportInjected(reportId);
        }
        isPeRequestInFlight = true;
        isWaitingForNewPeResponse = true;
        hasObservedNewStream = false;
        currentCorrelation.pendingAnReport = false;

        const currentPe = getLatestPeResponse();
        if (currentPe && currentPe.text) {
            baselinePeTextHash = hashString(currentPe.text);
        }

        const statusText = document.getElementById("omni-status-text");
        if (statusText) {
            statusText.innerHTML = `⏳ <b>[LƯỢT PE]</b> Đã gửi báo cáo cho PE — Đang chờ PE trả lời...`;
        }
        const btnSendPe = document.getElementById("omni-btn-send-pe");
        if (btnSendPe) {
            btnSendPe.disabled = true;
            btnSendPe.textContent = "⏳ Đã gửi PE (Chờ trả lời)";
            btnSendPe.style.background = "#94a3b8";
            btnSendPe.style.color = "#ffffff";
        }
        logStateSnapshot("USER_SUBMITTED_MANUAL", `reportId=${reportId}`);
        renderTurnUI();
    }

    function onUserSubmittedToPerplexity() {
        const reportId = currentAnMessageId || lastInjectedReportId;
        if (reportId && !isReportHandled(reportId)) {
            console.log(`[Omni Bridge] 👤 Minh Chủ THOAN đã submit câu hỏi vào PE! Khóa báo cáo AN [${reportId}] để chống đổ lặp.`);
            markReportSubmitted(reportId);
        }
    }

    // Gửi chỉ thị giục AN thủ công khi kết nối bị nghẽn
    async function triggerAnManualPing() {
        showToast("⚡ Đang gửi chỉ thị giục AN thi công...", "info");
        const payload = JSON.stringify({
            threadId: lastThreadId || CONFIG.DEFAULT_THREAD_ID,
            messageId: `manual-an-${Date.now()}`,
            directiveText: CONFIG.QUICK_PINGS.AN_EXECUTE,
            sender: 'THOAN_OR_PE'
        });

        updatePreviewBox(`[CHỈ THỊ THỦ CÔNG GỬI AN - ${new Date().toLocaleTimeString()}] (Thread: ${lastThreadId})\n\n${CONFIG.QUICK_PINGS.AN_EXECUTE}`);

        try {
            await sendToHub(`${getHubUrl()}/api/directive`, payload);
            console.log("[Omni Bridge] ✅ Đã gửi chỉ thị thủ công giục AN vào Hub thành công!");
        } catch (err) {
            console.error("[Omni Bridge] ❌ Lỗi gửi chỉ thị giục AN:", err.message);
        }

        playTone(784, 0.3); // Chuông Sol (784Hz)
        setWorkflowState("WAITING_AN", lastThreadId);
        showToast(`🚀 Đã gửi chỉ thị giục AN kiểm tra bridge và thi công!`, "success");
    }

    // ==========================================
    // 5. CHIỀU 2 (PE ➔ AN): ENVELOPE PARSER & THINKING SHIELD
    // ==========================================
    function isPerplexityBusy() {
        if (typeof isPeStreaming !== 'undefined' && isPeStreaming) return true;

        // 1. Tìm nút dừng (Stop / Cancel) trong khu vực input/form hoặc thanh toolbar đáy
        const inputArea = document.querySelector('form, div[class*="bottom-"], div[class*="input"], [data-testid="chat-input"]') || document.body;
        const buttons = Array.from(inputArea.querySelectorAll('button')).filter(b => !b.closest('#omni-bridge-panel') && !b.closest('#omni-bridge-toast'));
        for (const b of buttons) {
            const aria = removeVietnameseTones(b.getAttribute('aria-label') || '').toLowerCase().trim();
            const title = removeVietnameseTones(b.getAttribute('title') || '').toLowerCase().trim();
            const tid = (b.getAttribute('data-testid') || '').toLowerCase().trim();
            const text = removeVietnameseTones(b.textContent || '').toLowerCase().trim();

            if (aria === 'stop' || aria === 'stop generating' || aria === 'dung' || aria === 'dung tao' ||
                title === 'stop' || title === 'stop generating' || title === 'dung' || title === 'dung tao' ||
                aria.includes('cancel') || title.includes('cancel') ||
                tid === 'stop-button' || tid.includes('stop') || tid.includes('cancel') ||
                text === 'stop' || text === 'dung' || text === 'dung tao') {
                return true;
            }

            // Nếu trong khu vực form/input có nút chứa icon vuông Stop (svg rect hoặc rect trong svg)
            if (b.querySelector('svg rect, rect')) {
                return true;
            }
        }

        // 2. Kiểm tra spinners / animations / loading indicators
        const spinners = document.querySelectorAll('.animate-spin, [data-testid="loading-indicator"], .animate-pulse');
        for (const s of spinners) {
            if (!s.closest('#omni-bridge-panel') && !s.closest('#omni-bridge-toast')) return true;
        }

        // 3. Kiểm tra văn bản trạng thái suy nghĩ / nghiên cứu của Perplexity (Thinking Shield)
        // Ví dụ: "Đang nghiên cứu 12 giây", "Sonnet 5.5 Đang suy nghĩ", "Thinking...", "Researching..."
        const busyKeywords = ['dang nghien cuu', 'dang suy nghi', 'thinking', 'researching', 'searching web', 'dang tim kiem'];
        const statusCandidates = Array.from(document.querySelectorAll('div, span, button, p')).filter(el => {
            if (el.closest('#omni-bridge-panel') || el.closest('#omni-bridge-toast') || el.closest('#omni-bridge-viewer')) return false;
            const txt = removeVietnameseTones(el.innerText || '').toLowerCase().trim();
            if (txt.length > 80) return false;
            return busyKeywords.some(kw => txt.includes(kw));
        });
        if (statusCandidates.length > 0) {
            return true;
        }

        // 4. Kiểm tra ô input có bị disabled không
        const input = findPerplexityInput();
        if (input && (input.disabled || input.getAttribute('aria-disabled') === 'true')) {
            return true;
        }

        return false;
    }

    function isPerplexityStreaming() {
        return isPerplexityBusy();
    }

    function getLatestPeResponse() {
        // Tìm các khối nội dung câu trả lời chính của PE (loại trừ nút bấm, câu hỏi liên quan)
        const candidates = Array.from(document.querySelectorAll('div.prose, div[class*="prose"], [data-message-author-role="assistant"], div[class*="markdown"], div[dir="auto"], div[class*="response"]'));
        const valid = candidates.filter(el => {
            if (el.closest('#omni-bridge-panel') || el.closest('#omni-bridge-toast') || el.closest('#omni-bridge-viewer')) return false;
            if (el.closest('button') || el.closest('[data-testid*="related"]') || el.closest('div[class*="related"]')) return false;
            if (el.closest('[data-message-author-role="user"]') || el.getAttribute('data-message-author-role') === 'user') return false;
            const t = (el.innerText || '').trim();
            if (t.length < 50) return false;
            if (t === CONFIG.PING_PE_MESSAGE || t === removeVietnameseTones(CONFIG.PING_PE_MESSAGE)) return false;
            // TUYỆT ĐỐI LOẠI BỎ TIN NHẮN DO AN HOẶC MINH CHỦ GỬI VÀO (USER QUERIES)
            if (t.includes('AN da nop bao cao') || t.includes('AN đã nộp báo cáo') || t.includes('Ban ghi bao cao ID:')) return false;

            // TUYỆT ĐỐI LOẠI BỎ CÁC KHỐI CHỈ LÀ CHIP CONNECTOR / BADGE (@Supabase, @GitHub, v.v.)
            const cleanText = t.replace(/(?:@|Supabase|GitHub|\s|[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)?)+/gi, '').trim();
            if (cleanText.length < 25) return false;

            return true;
        });

        if (valid.length === 0) return null;

        // Ưu tiên khối văn bản chứa từ khóa chu kỳ hoặc phản hồi của PE
        const targetEl = valid.slice().reverse().find(el => {
            const text = el.innerText || '';
            const norm = removeVietnameseTones(text).toUpperCase();
            return norm.includes("PE DOC BRIDGE") || norm.includes("PE ĐOC BRIDGE") ||
                   text.includes("PE ĐỌC BRIDGE") || text.includes("=== PE-") ||
                   norm.includes("OMNI-") || norm.includes("DH01-") ||
                   norm.includes("PE KET THUC") || text.includes("PE KẾT THÚC");
        }) || valid[valid.length - 1];

        return { element: targetEl, text: (targetEl.innerText || '').trim() };
    }

    /**
     * KIỂM ĐỊNH TÍNH TOÀN VẸN CỦA CHỈ THỊ PE:
     * Khắc phục triệt để lỗi của ysdms-next bằng 3 điều kiện:
     * 1. Thẻ Envelope: Nếu có thẻ mở '=== PE-... ===', BẮT BUỘC phải có thẻ đóng '=== END ==='
     * 2. Tem thời gian Rule 4: '⏱️ [PE KẾT THÚC ...]' hoặc '[HOÀN THÀNH: ...]' (hỗ trợ cả không dấu)
     * 3. Trạng thái Stream: Nút Stop đã tắt hoàn toàn
     */
    function verifyDirectiveIntegrity(text) {
        if (!text || text.length < 30) return { complete: false, reason: "Nội dung quá ngắn" };

        const hasOpenTag = text.includes("=== PE-DIRECTIVE") || text.includes("=== PE-VERDICT") || text.includes("=== PE-ACCEPTANCE");
        const hasCloseTag = text.includes("=== END ===");

        if (hasOpenTag) {
            if (!hasCloseTag) {
                return { complete: false, reason: "Đã phát hiện thẻ mở Envelope nhưng chưa xuất hiện thẻ đóng === END === (PE đang stream)" };
            }
            return { complete: true, reason: "Envelope Protocol hợp lệ 100%" };
        }

        // Kiểm tra tem thời gian đóng Rule 4 (hỗ trợ cả có dấu lẫn không dấu)
        const norm = removeVietnameseTones(text).toUpperCase();
        const hasEndStamp = norm.includes("[PE KET THUC") || 
                            norm.includes("[HOAN THANH") || 
                            text.includes("⏱️ [PE KẾT THÚC") || 
                            text.includes("⏱️ [HOÀN THÀNH") || 
                            text.includes("[PE KẾT THÚC");
        if (hasEndStamp) {
            return { complete: true, reason: "Đã xuất hiện tem thời gian kết thúc Rule 4" };
        }

        // CHẤP NHẬN BẤT KỲ VĂN BẢN NÀO NẾU STREAM ĐÃ DỪNG
        // Chúng ta sẽ để Auto-detector xử lý timeout
        return { complete: true, reason: "Văn bản thường, stream đã dừng" };
    }

    function extractThreadId(text, fallbackId) {
        if (!text) return fallbackId;
        const match = text.match(/(?:thread_id:\s*|thread:\s*|\[)([A-Za-z0-9_-]{4,30})(?:\]|\b)/i);
        return match ? match[1].toUpperCase() : fallbackId;
    }

    function extractWorkOrderId(text) {
        if (!text || typeof text !== 'string') return null;
        const match = text.match(/(?:Work Order|Gói công việc|Nhiệm vụ|Chỉ thị):\s*[`\*]?([A-Za-z0-9_-]{5,50})[`\*]?/i);
        return match ? match[1] : null;
    }

    function extractInReplyTo(text) {
        if (!text || typeof text !== 'string') return null;
        const match = text.match(/(?:in_reply_to_message_id|in_reply_to|Message|Bản ghi|Report|ID):\s*[`\*]?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})[`\*]?/i);
        if (match) return match[1];

        const commentMatch = text.match(/in_reply_to_message_id=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
        if (commentMatch) return commentMatch[1];

        return null;
    }

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return String(hash);
    }

    let latestFeedRecord = null;

    function updatePreviewFeed(record, source = "SSOT") {
        if (!record) return;
        const sender = (record.sender || "UNKNOWN").toUpperCase();
        const jstFull = formatJstDateTime(record.created_at);
        const jstTime = formatJstTime(record.created_at);
        const thread = record.thread_id || lastThreadId;
        const id = record.id || "--";
        const shortId = id.length > 12 ? `${id.slice(0, 8)}...` : id;
        const content = record.content_md || "";

        latestFeedRecord = { id, sender, thread_id: thread, created_at: record.created_at, content_md: content };
        try {
            localStorage.setItem("omni_bridge_latest_feed", JSON.stringify(latestFeedRecord));
        } catch {}

        const formattedPreview = `[${sender} @ ${jstFull}] (Thread: ${thread} | ID: ${id})\n\n${content}`;
        latestMessagePreview = formattedPreview;
        try {
            localStorage.setItem("omni_bridge_last_preview", formattedPreview);
        } catch {}

        // Cập nhật DOM các thành phần Feed
        const senderBadge = document.getElementById("omni-feed-sender-badge");
        if (senderBadge) {
            senderBadge.textContent = sender;
            if (sender === "AN") {
                senderBadge.style.background = "#ecfdf5";
                senderBadge.style.color = "#047857";
                senderBadge.style.borderColor = "#a7f3d0";
            } else if (sender === "PE") {
                senderBadge.style.background = "#f5f3ff";
                senderBadge.style.color = "#6d28d9";
                senderBadge.style.borderColor = "#ddd6fe";
            } else if (sender === "THOAN") {
                senderBadge.style.background = "#fffbeb";
                senderBadge.style.color = "#b45309";
                senderBadge.style.borderColor = "#fde68a";
            } else {
                senderBadge.style.background = "#f1f5f9";
                senderBadge.style.color = "#475569";
                senderBadge.style.borderColor = "#cbd5e1";
            }
        }

        const timeEl = document.getElementById("omni-feed-time");
        if (timeEl) {
            timeEl.textContent = `🕒 ${jstFull}`;
            timeEl.title = `Thời điểm ghi nhận SSOT: ${jstFull} (${source})`;
        }

        const threadEl = document.getElementById("omni-feed-thread");
        if (threadEl) {
            threadEl.textContent = `🧵 ${thread}`;
        }

        const idEl = document.getElementById("omni-feed-id");
        if (idEl) {
            idEl.textContent = `🆔 ${shortId}`;
            idEl.title = `Supabase Row ID: ${id} (${source})`;
        }

        const preEl = document.getElementById("omni-preview-content");
        if (preEl) {
            preEl.textContent = content || "(Nội dung trống)";
        }

        // Cập nhật nhãn nút "Xem tin" trên thanh điều khiển
        const btnToggleViewer = document.getElementById("omni-btn-toggle-viewer");
        if (btnToggleViewer) {
            const isViewerOpen = localStorage.getItem("omni_bridge_viewer_open") === "true";
            btnToggleViewer.textContent = isViewerOpen ? `👁️ Ẩn tin (${sender}) ▴` : `👁️ Xem tin (${sender} • ${jstTime}) ▾`;
        }
    }

    function updatePreviewBox(text) {
        latestMessagePreview = text;
        try {
            localStorage.setItem("omni_bridge_last_preview", text);
        } catch {}
        const el = document.getElementById("omni-preview-content");
        if (el) el.textContent = text;
    }

    function sendToHub(url, payload) {
        return hubRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        });
    }

    async function forwardPeResponseToAn(force = false) {
        if (isBridgePaused && !force) return false;
        if (isForwarding) return false;

        const latest = getLatestPeResponse();
        if (!latest || !latest.text || latest.text.length < 25) {
            if (force) showToast("⚠️ Chưa tìm thấy câu trả lời nào từ PE trên trang!", "warn");
            return false;
        }

        const peText = latest.text;
        const textHash = hashString(peText);
        const lastHash = localStorage.getItem("omni_bridge_last_forwarded_hash");

        logStateSnapshot("FORWARD_PE_TO_AN_START", `force=${force}`);

        if (currentTurnState === TURN_STATES.AN_TURN && !force) {
            showToast("ℹ️ Chỉ thị của PE đã được nộp vào Supabase rồi! Hiện đang ở lượt AN thi công.", "info");
            return false;
        }

        if (textHash === lastHash && !force) {
            showToast("ℹ️ Câu trả lời này đã được chuyển sang cho AN rồi! Đang ở lượt AN thi công.", "info");
            return false;
        }
        const inReplyTo = currentAnMessageId || currentCorrelation.reportId;
        const lastForwardedInReplyTo = localStorage.getItem("omni_bridge_last_forwarded_in_reply_to");
        if (!force && inReplyTo && inReplyTo === lastForwardedInReplyTo) {
            console.log(`[Omni Bridge] ℹ️ Đã chuyển tiếp phản hồi PE cho báo cáo [${inReplyTo}] rồi. Bỏ qua auto-forward.`);
            return false;
        }
        if (baselinePeTextHash && textHash === baselinePeTextHash && !force) {
            showToast("⚠️ Đây là văn bản PE cũ trên trang! Vui lòng đợi PE trả lời câu hỏi mới.", "warn");
            return false;
        }
        if (lastAnReportContent && peText === lastAnReportContent) return false;

        // KIỂM TRA TÍNH TOÀN VẸN
        const check = verifyDirectiveIntegrity(peText);
        if (!check.complete && !force) {
            console.log(`[Omni Bridge] ⏳ Đang đợi PE stream đủ: ${check.reason}`);
            return false;
        }

        isForwarding = true;
        const threadId = extractThreadId(peText, lastThreadId);
        currentPeMessageId = `pe-${Date.now()}`;
        if (!currentRequestId) currentRequestId = `req-${Date.now()}`;

        // BRIDGE-PERSIST-FIRST-DISPATCH-001: Thông báo rõ ràng trước khi gọi API persist
        setWorkflowState(STATES.AN_NOTIFICATION_QUEUED, currentPeMessageId);
        const statusTextEl = document.getElementById("omni-status-text");
        if (statusTextEl) statusTextEl.innerHTML = `⏳ <b>[LƯỢT PE]</b> Phát hiện phản hồi PE — Đang persist Supabase...`;
        showToast(`⏳ Phát hiện phản hồi PE! Đang persist vào Supabase SSOT...`, "info");
        localStorage.setItem("omni_bridge_last_forwarded_hash", textHash);
        updatePreviewBox(`[CHỈ THỊ PE - ${new Date().toLocaleTimeString()}] (Thread: ${threadId} | Đang lưu Supabase...)\n\n${peText}`);

        const workOrderId = currentCorrelation.workOrderId || extractWorkOrderId(peText) || extractThreadId(peText, lastThreadId);
        const correlationComment = inReplyTo ? `<!-- OMNI_CORRELATION: in_reply_to_message_id=${inReplyTo} work_order_id=${workOrderId || ''} handled_by=PE handled_at=${new Date().toISOString()} -->\n\n` : '';
        const nowJst = formatJstDateTime(new Date());
        let peTextWithStamp = peText;
        if (!peTextWithStamp.includes("[GỬI SUPABASE:") && !peTextWithStamp.includes("[GUI SUPABASE:")) {
            peTextWithStamp = peTextWithStamp.trim() + `\n\n⏱️ [GỬI SUPABASE: ${nowJst}]`;
        }
        const fullDirectiveText = correlationComment + peTextWithStamp;

        const payload = JSON.stringify({
            requestId: currentRequestId,
            threadId: threadId,
            messageId: currentPeMessageId,
            inReplyToMessageId: inReplyTo,
            workOrderId: workOrderId,
            directiveText: fullDirectiveText,
            sender: 'PE'
        });

        // Bắn Webhook về Local Hub để nạp Supabase trước khi dispatch
        try {
            const resData = await sendToHub(`${getHubUrl()}/api/directive`, payload);
            if (!resData || resData.success === false) {
                throw new Error(resData?.error || "Persist Supabase thất bại");
            }
            const realUuid = (resData.supabase_row_id || resData.messageId || currentPeMessageId);
            currentPeMessageId = realUuid;
            console.log("[Omni Bridge] ✅ Đã nộp chỉ thị về Hub & Supabase thành công. UUID Thật:", realUuid);
            
            if (inReplyTo) {
                const msgId = realUuid;
                saveHandledReport(inReplyTo, msgId);
                setAwaitingSupabaseNewRow(false); // PE đã phản hồi và persist Supabase -> giải phóng chờ
                currentCorrelation.pendingAnReport = false;
                currentCorrelation.handledBy = 'PE';
                currentCorrelation.handledAt = new Date().toISOString();
                currentCorrelation.inReplyToMessageId = inReplyTo;
                currentCorrelation.peResponseId = realUuid;
            } else {
                setAwaitingSupabaseNewRow(false);
            }
            renderTurnUI();

            localStorage.setItem("omni_bridge_last_forwarded_hash", textHash);
            if (inReplyTo) {
                localStorage.setItem("omni_bridge_last_forwarded_in_reply_to", inReplyTo);
            }
            updatePreviewBox(`[CHỈ THỊ PE - ${new Date().toLocaleTimeString()}] (Thread: ${threadId} | UUID: ${realUuid})\n\n${peText}`);

            playTone(784, 0.3); // Chuông Sol (784Hz)
            setWorkflowState(STATES.WAITING_FOR_AN_ACK, realUuid);
            showToast(`🚀 Đã persist chỉ thị vào Supabase (UUID: ${realUuid.slice(0, 8)})! Đang đợi AN xác nhận...`, "success");

            setTimeout(() => { isForwarding = false; }, 1500);
            return true;
        } catch (err) {
            console.error("[Omni Bridge] ❌ Lỗi persist chỉ thị sang Hub/Supabase:", err);
            setWorkflowState(STATES.FAILED, `PERSIST_FAILED: ${err.message}`);
            if (statusTextEl) statusTextEl.innerHTML = `❌ <b>[PERSIST FAILED]</b> Không thể lưu Supabase!`;
            showToast(`❌ Lỗi lưu chỉ thị vào Supabase (PERSIST_FAILED)!`, "error");
            isForwarding = false;
            return false;
        }
    }

    function monitorStreamingLoop() {
        if (isBridgePaused) return;

        let currentlyStreaming = isPerplexityStreaming();
        const latest = getLatestPeResponse();
        const currentText = latest ? latest.text : '';
        const currentLength = currentText.length;
        
        if (currentLength > 0 && currentLength !== lastPeTextLength) {
            timeSinceLastTextChange = 0;
            // Text is growing -> it must be streaming
            currentlyStreaming = true; 
        } else {
            timeSinceLastTextChange += 1000;
        }
        lastPeTextLength = currentLength;

        // Bắt đầu streaming (chỉ khi có yêu cầu in-flight được kích hoạt)
        if (currentlyStreaming && isPeRequestInFlight && !isPeStreaming) {
            isPeStreaming = true;
            hasObservedNewStream = true;
            console.log("[Omni Bridge] 🔵 PE đang phản hồi (streaming)...");
            setWorkflowState(STATES.PE_THINKING, pendingRequestId || currentRequestId || 'Stream', 'LIVE_OPTIMISTIC');
        }

        // Kết thúc streaming (stream dừng hẳn ít nhất 3 giây)
        if (!currentlyStreaming && isPeStreaming && timeSinceLastTextChange >= 3000) {
            isPeStreaming = false;
            isPeRequestInFlight = false;
            console.log("[Omni Bridge] 🏁 PE vừa dừng stream! Chuyển ngay khỏi trạng thái PE_THINKING...");

            if (debounceForwardTimer) clearTimeout(debounceForwardTimer);
            debounceForwardTimer = setTimeout(() => {
                const latestCheck = getLatestPeResponse();
                if (latestCheck && latestCheck.text) {
                    const newHash = hashString(latestCheck.text);
                    if (baselinePeTextHash && newHash === baselinePeTextHash) {
                        console.warn("[Omni Bridge] ⚠️ Văn bản PE chưa thay đổi (trùng baseline cũ) -> Bỏ qua forward.");
                        return;
                    }
                    const check = verifyDirectiveIntegrity(latestCheck.text);
                    if (!check.complete) {
                        console.log(`[Omni Bridge] ⏳ Đang đợi PE hoàn tất: ${check.reason}`);
                        return;
                    }
                    isWaitingForNewPeResponse = false;
                    peResponsePersistedAt = new Date().toISOString();
                    setWorkflowState(STATES.PE_REPLIED, currentPeMessageId || 'PE Phản Hồi Xong', 'LIVE_OPTIMISTIC');

                    const isAuto = isAutoForwardToAnEnabled();
                    if (isAuto) {
                        forwardPeResponseToAn(false);
                    } else {
                        showToast("✅ PE đã phản hồi xong! Nhấn 'Chuyển sang AN' (Alt+F10) để gửi sang Supabase.", "info");
                        const btnFwd = document.getElementById("omni-btn-fwd-an");
                        if (btnFwd) {
                            btnFwd.disabled = false;
                            btnFwd.style.background = "#0284c7";
                            btnFwd.style.color = "#ffffff";
                            btnFwd.style.borderColor = "#0284c7";
                            btnFwd.textContent = "⚡ Gửi ngay cho AN (Alt+F10)";
                        }
                    }
                }
            }, 1000);
        }
        
        // Timeout cho request in flight để chống deadlock (nếu quá 60s không đổi)
        if (isPeRequestInFlight && !currentlyStreaming && timeSinceLastTextChange >= 60000) {
            isPeRequestInFlight = false;
            isPeStreaming = false;
            isWaitingForNewPeResponse = false;
        }

        // AUTO DETECTOR (bảo vệ trường hợp F5 refresh hoặc stream hoàn tất ngoài dự kiến)
        if (!currentlyStreaming && !isPeRequestInFlight && !isForwarding && isWaitingForNewPeResponse && hasObservedNewStream && timeSinceLastTextChange >= 3000) {
            if (latest && latest.text && latest.text.length >= 50) {
                const textHash = hashString(latest.text);
                const lastHash = localStorage.getItem("omni_bridge_last_forwarded_hash");
                
                if (textHash !== baselinePeTextHash && textHash !== lastHash && (!lastAnReportContent || latest.text !== lastAnReportContent)) {
                    const check = verifyDirectiveIntegrity(latest.text);
                    if (check.complete) {
                        console.log("[Omni Bridge] ⚡ Tự động phát hiện câu trả lời PE hoàn tất trên trang! Tự động chuyển sang AN...");
                        isWaitingForNewPeResponse = false;
                        const isAuto = isAutoForwardToAnEnabled();
                        if (isAuto) {
                            forwardPeResponseToAn(false);
                        } else {
                            showToast("✅ PE đã phản hồi xong! Nhấn 'Chuyển sang AN' (Alt+F10) để gửi sang Supabase.", "info");
                            const btnFwd = document.getElementById("omni-btn-fwd-an");
                            if (btnFwd) {
                                btnFwd.disabled = false;
                                btnFwd.style.background = "#0284c7";
                                btnFwd.style.color = "#ffffff";
                                btnFwd.style.borderColor = "#0284c7";
                                btnFwd.textContent = "⚡ Gửi ngay cho AN (Alt+F10)";
                            }
                        }
                    }
                }
            }
        }
    }


    // ==========================================
    // 5.1. ĐỒNG BỘ DỰA TRÊN SỰ KIỆN SUPABASE (BRIDGE-EVENT-DRIVEN-TURN-SYNC-001)
    // ==========================================
    function handleSupabaseRowPersisted(record, source = "UNKNOWN") {
        if (!record || !record.id) return;

        // KIỂM TRA BẢN GHI ĐÃ XỬ LÝ HOẶC ĐÃ ĐƯỢC ĐỔ VÀO PE (v2.2.0)
        const isDuplicateRow = (record.id === lastProcessedRowId && source !== "MANUAL_REFRESH");
        const isAlreadySubmittedAnReport = (record.sender === "AN" && record.id === lastSubmittedAnReportId);

        if (isDuplicateRow || isAlreadySubmittedAnReport) {
            // Nếu đây là báo cáo AN mà ta đã đổ vào PE, Supabase chưa có bản ghi mới -> TIẾP TỤC CHỜ!
            if (isAlreadySubmittedAnReport) {
                setAwaitingSupabaseNewRow(true, record.id);
            }
            applyLocalLockToCorrelation();
            renderTurnUI();
            return;
        }

        console.log(`[Omni Bridge] 🔔 Supabase có bản ghi MỚI: ID=${record.id}, Sender=${record.sender}, Source=${source}`);
        lastProcessedRowId = record.id;
        lastSupabaseRecord = record;
        lastRehydrationSource = source;
        lastThreadId = record.thread_id || lastThreadId;

        const timeStr = formatJstTime(record.created_at || Date.now());

        // KIỂM TRA ĐỐI TƯỢNG GỬI VÀ ĐIỀU PHỐI ĐÚNG ĐỐI TƯỢNG NHẬN (v2.2.0)
        if (record.sender === "PE" || record.sender === "THOAN") {
            // Người gửi: PE hoặc THOAN -> Đối tượng nhận tiếp theo: AN!
            setAwaitingSupabaseNewRow(false); // Giải phóng trạng thái chờ
            isWaitingForNewPeResponse = false;
            isPeRequestInFlight = false;
            isPeStreaming = false;

            if (record.sender === "PE") {
                transitionToPeDirective(record, source, timeStr);
            } else {
                transitionToThoanDirective(record, source, timeStr);
            }
            console.log(`[Omni Bridge] 📨 Điều phối sang lượt AN: Sender=${record.sender}, Next=AN, MsgId=${record.id}`);
        } else if (record.sender === "AN") {
            // Người gửi: AN (Báo cáo mới có ID khác với lastSubmittedAnReportId) -> Đối tượng nhận tiếp theo: PE!
            setAwaitingSupabaseNewRow(false); // Giải phóng trạng thái chờ cũ vì đây là báo cáo AN mới
            transitionToAnReported(record, source, timeStr);
            console.log(`[Omni Bridge] 🔔 Điều phối sang lượt PE: Sender=AN, Next=PE, MsgId=${record.id}`);
        } else {
            setTurnState(TURN_STATES.IDLE, "NONE", "Sẵn sàng (SSOT)");
            setDeliveryState(DELIVERY_STATES.IDLE, "Idle");
            updatePreviewFeed(record, source);
            renderTurnUI();
        }

        console.log(`[Omni Bridge] ✅ Đồng bộ Turn State thành công! Sender=${record.sender}, Turn=${currentTurnState}, Next=${currentNextActor}, MsgId=${record.id}, Source=${source}`);
    }

    async function rehydrateStateFromSupabase(threadId = null) {
        console.log(`[Omni Bridge] 🔄 [SSOT Rehydration] Khôi phục trạng thái từ Supabase (Thread: ${threadId || 'TOÀN CỤC'})...`);

        let record = null;
        try {
            const queryUrl = threadId
                ? `${getHubUrl()}/api/messages/latest?thread_id=${encodeURIComponent(threadId)}`
                : `${getHubUrl()}/api/messages/latest`;
            const data = await hubRequest(queryUrl);
            if (data) {
                if (data.record) {
                    record = data.record;
                } else if (Array.isArray(data) && data.length > 0) {
                    record = data[0];
                } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                    record = data.data[0];
                }
                if (data.correlation) {
                    currentCorrelation = data.correlation;
                    applyLocalLockToCorrelation();
                }
                isHubConnected = true;
                updateHubStatusBadge(true, 'POLL');
            }
        } catch (e) {
            console.warn("[Omni Bridge] ⚠️ Không thể kết nối Local Hub để nạp snapshot:", e.message);
        }

        if (!record) {
            console.log("[Omni Bridge] ℹ️ Không tìm thấy bản ghi cho thread này. Trạng thái: IDLE");
            setTurnState(TURN_STATES.IDLE, "NONE", "Sẵn sàng (SSOT)");
            setDeliveryState(DELIVERY_STATES.IDLE, "Idle");
            updateRehydrationAuditUI(null, "SUPABASE_REHYDRATION");
            return;
        }

        if (record.thread_id) {
            lastThreadId = record.thread_id;
            localStorage.setItem("ysdms_bridge_thread_id", record.thread_id);
            const feedThread = document.getElementById("omni-feed-thread");
            if (feedThread) feedThread.textContent = record.thread_id;
        }

        handleSupabaseRowPersisted(record, "SUPABASE_REHYDRATION");
    }

    // ==========================================
    // 5.2. THỦ CÔNG TẢI LẠI TIN NHẮN TỪ SUPABASE (MANUAL REFRESH SSOT)
    // ==========================================
    async function manualRefreshFromSupabase() {
        const btn = document.getElementById("omni-btn-refresh-feed");
        const origHtml = btn ? btn.innerHTML : "🔄 Làm mới";
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = "⏳ Đang tải...";
            btn.style.opacity = "0.7";
        }
        showToast("🔄 Đang tải tin nhắn mới nhất từ Supabase...", "info");

        try {
            // Truy vấn tin mới nhất trên toàn bộ bảng pe_an_messages (không bị kẹt ở thread cũ)
            let res = await hubRequest(`${getHubUrl()}/api/messages/latest?force=1&t=${Date.now()}`);
            let rec = res && (res.record || (Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null));

            if (rec && rec.id) {
                if (rec.thread_id) {
                    lastThreadId = rec.thread_id;
                    localStorage.setItem("ysdms_bridge_thread_id", rec.thread_id);
                    const feedThread = document.getElementById("omni-feed-thread");
                    if (feedThread) feedThread.textContent = rec.thread_id;
                }
                if (res && res.correlation) {
                    currentCorrelation = res.correlation;
                    applyLocalLockToCorrelation();
                }
                // Ép buộc cập nhật lại UI bất kể deduplication
                lastProcessedRowId = null;
                handleSupabaseRowPersisted(rec, "MANUAL_REFRESH");
                showToast(`✅ Đã nạp tin mới nhất từ Supabase: [${rec.sender} | #${rec.id.slice(0, 8)} | ${rec.thread_id}]`, "success");
                playTone(880, 0.15);
            } else {
                showToast("ℹ️ Không tìm thấy tin nhắn nào trên Supabase.", "warning");
            }
        } catch (e) {
            console.error("[Omni Bridge] Lỗi tải lại từ Supabase:", e);
            showToast(`❌ Lỗi tải lại từ Supabase: ${e.message}`, "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origHtml;
                btn.style.opacity = "1";
            }
        }
    }

    // Fallback polling loop (Inbound 3s fallback khi SSE mất kết nối)
    async function pollSnapshotLoop() {
        try {
            // Poll toàn cục để luôn đồng bộ luồng công việc mới nhất
            const data = await hubRequest(`${getHubUrl()}/api/messages/latest`);
            if (data) {
                const record = data.record || (Array.isArray(data) ? data[0] : null) || (data.data && Array.isArray(data.data) ? data.data[0] : null);
                if (data.correlation) {
                    currentCorrelation = data.correlation;
                    applyLocalLockToCorrelation();
                    renderTurnUI();
                }
                if (!sseSource || sseSource.readyState !== EventSource.OPEN) {
                    isHubConnected = true;
                    updateHubStatusBadge(true, 'POLL');
                }
                if (record && record.id !== lastProcessedRowId) {
                    if (record.thread_id) {
                        lastThreadId = record.thread_id;
                        localStorage.setItem("ysdms_bridge_thread_id", record.thread_id);
                        const feedThread = document.getElementById("omni-feed-thread");
                        if (feedThread) feedThread.textContent = record.thread_id;
                    }
                    console.log(`[Omni Bridge] 📥 Polling phát hiện row mới: ${record.id} (${record.thread_id})`);
                    handleSupabaseRowPersisted(record, 'POLL_FALLBACK');
                }
            } else {
                if (!sseSource || sseSource.readyState !== EventSource.OPEN) {
                    isHubConnected = false;
                    updateHubStatusBadge(false);
                }
            }
        } catch (e) {
            if (!sseSource || sseSource.readyState !== EventSource.OPEN) {
                isHubConnected = false;
                updateHubStatusBadge(false);
            }
        }
    }

    // ==========================================
    // 6. KẾT NỐI SSE TỚI LOCAL HUB (OMNILINGUIST)
    // ==========================================
    async function connectSseHub() {
        if (sseSource) {
            sseSource.close();
            sseSource = null;
        }

        await autoDiscoverHub();

        try {
            sseSource = new EventSource(`${getHubUrl()}/api/events`);

            sseSource.onopen = () => {
                isHubConnected = true;
                updateHubStatusBadge(true, 'SSE');
                console.log(`[Omni Bridge] ⚡ Đã kết nối Realtime Hub SSE tại ${getHubUrl()}`);
            };

            sseSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "SUPABASE_ROW_PERSISTED") {
                        const rec = data.record || {
                            id: data.id,
                            thread_id: data.thread_id || data.threadId,
                            sender: data.sender,
                            created_at: data.created_at || data.timestamp,
                            content_md: data.content_md
                        };
                        handleSupabaseRowPersisted(rec, data.source || 'SSE_HUB');
                    } else if (data.type === "LATEST_STATE" && (data.record || data.id)) {
                        const rec = data.record || {
                            id: data.id,
                            thread_id: data.thread_id || data.threadId,
                            sender: data.sender,
                            created_at: data.created_at || data.timestamp,
                            content_md: data.content_md
                        };
                        handleSupabaseRowPersisted(rec, 'SSE_INITIAL');
                    } else if (data.type === "PE_REPLIED") {
                        if (data.messageId) currentPeMessageId = data.messageId;
                    } else if (data.type === "PE_DISPATCHED_TO_AN") {
                        setDeliveryState(DELIVERY_STATES.WAITING_FOR_ACK, `Đang chuyển AN [${data.peMessageId}]`);
                        showToast(`📤 Đang chuyển chỉ thị sang AN (chờ ACK)...`, "info");
                    } else if (data.type === "PE_RESPONSE_PERSISTED") {
                        if (data.inReplyToMessageId) {
                            saveHandledReport(data.inReplyToMessageId, data.peMessageId);
                        }
                        setAwaitingSupabaseNewRow(false); // PE đã ra chỉ thị và lưu Supabase -> giải phóng chờ
                        currentCorrelation.pendingAnReport = false;
                        currentCorrelation.handledBy = data.handledBy || "PE";
                        currentCorrelation.handledAt = data.handledAt || new Date().toISOString();
                        currentCorrelation.inReplyToMessageId = data.inReplyToMessageId;
                        currentCorrelation.peResponseId = data.peMessageId;
                        terminateActivity("PE response persisted on Supabase");
                        renderTurnUI();
                    } else if (data.type === "AN_REPORT_PERSISTED") {
                        console.log("[Omni Bridge] 🔔 Nhận sự kiện SSE AN_REPORT_PERSISTED:", data);
                        // v2.2.0: Bỏ qua nếu là report đã nộp vào PE, report đã khóa, hoặc đang ở trạng thái chờ Supabase cập nhật
                        if (data.reportId && (data.reportId === currentAnMessageId || data.reportId === lastSubmittedAnReportId || isReportLocked(data.reportId) || isAwaitingSupabaseNewRow)) {
                            applyLocalLockToCorrelation();
                            renderTurnUI();
                            return;
                        }
                        terminateActivity("AN report persisted on Supabase");
                        setTurnState(TURN_STATES.PE_TURN, "PE", "AN report persisted on Supabase");
                        // Báo cáo MỚI: reset cờ PE cũ + chốt baseline để đo câu trả lời mới
                        setAwaitingSupabaseNewRow(false);
                        isWaitingForNewPeResponse = false;
                        hasObservedNewStream = false;
                        isPeRequestInFlight = false;
                        isPeStreaming = false;
                        manualSendRequiredReportId = null;
                        {
                            const existingPe = getLatestPeResponse();
                            if (existingPe && existingPe.text) baselinePeTextHash = hashString(existingPe.text);
                        }
                        currentCorrelation.pendingAnReport = true;
                        currentCorrelation.reportId = data.reportId;
                        currentCorrelation.createdAt = data.createdAt;
                        currentCorrelation.workOrderId = data.workOrderId;
                        currentCorrelation.status = 'PENDING';
                        currentAnMessageId = data.reportId;
                        lastAnReportContent = data.contentSnippet || '';
                        showReportAlertBanner(data.reportId, data.createdAt, data.workOrderId);
                        renderTurnUI();
                        updateRehydrationAuditUI(null, "SSE_AN_REPORT_PERSISTED");
                        playTone(523.25, 0.35);

                        if (isAutoSubmitEnabled()) {
                            showToast("🤖 Auto Flow: [ĐỔ & SUBMIT] đang bật...", "info");
                        } else if (isAutoFillEnabled()) {
                            showToast("📝 Auto Flow: [CHỈ DÁN CHATBOX] đang bật...", "info");
                        } else {
                            showToast(`🔔 Có báo cáo AN mới (#${data.reportId ? data.reportId.slice(0, 8) : 'N/A'})! Sẵn sàng nạp vào PE.`, "info");
                        }
                    } else if (data.type === "REPORT_CONSUMED") {
                        saveConsumedReport(data.reportId);
                        if (currentCorrelation.reportId === data.reportId) {
                            currentCorrelation.pendingAnReport = false;
                            renderTurnUI();
                        }
                    } else if (data.type === "AN_ACK_RECEIVED") {
                        const isMatchCurrentPe = (data.peMessageId === currentPeMessageId) || (!currentPeMessageId && !currentCorrelation.reportId);
                        const isMatchWorkOrder = Boolean(data.workflowId && currentCorrelation.workOrderId === data.workflowId);
                        const isTestDirective = Boolean(data.peMessageId && data.peMessageId.includes("test"));

                        if (isMatchCurrentPe || isMatchWorkOrder || isTestDirective) {
                            anAckReceivedAt = data.ackTimestamp;
                            setDeliveryState(DELIVERY_STATES.ACKNOWLEDGED, `AN đã ACK [${data.peMessageId}]`);
                            showToast(`✅ AN đã xác nhận nhận chỉ thị [${data.peMessageId}]!`, "success");
                            
                            // Chỉ bật AN_WORKING nếu report của AN chưa tới cho đúng message/work order đó
                            const reportAlreadyArrived = (currentCorrelation && (
                                (data.peMessageId && currentCorrelation.inReplyToMessageId === data.peMessageId) ||
                                (data.peMessageId && currentCorrelation.peResponseId === data.peMessageId) ||
                                (data.workflowId && currentCorrelation.workOrderId === data.workflowId)
                            )) || (currentTurnState === TURN_STATES.PE_TURN) || (currentCorrelation && currentCorrelation.pendingAnReport === true);

                            if (!reportAlreadyArrived) {
                                setActivityState(ACTIVITY_STATES.AN_WORKING, 120, `AN đang thi công sau ACK`);
                                currentWorkflowState = STATES.AN_WORKING;
                            } else {
                                console.log(`[Omni Bridge] ℹ️ AN_ACK_RECEIVED nhận sau khi report AN đã tới [peMessageId=${data.peMessageId}]. Bỏ qua bật AN_WORKING.`);
                            }
                            logStateSnapshot("AN_ACK_RECEIVED", `Msg=${data.peMessageId}`);
                        } else {
                            console.log(`[Omni Bridge] ℹ️ Bỏ qua AN_ACK_RECEIVED cũ [${data.peMessageId}] không khớp peMessageId hiện tại [${currentPeMessageId}].`);
                        }
                    } else if (data.type === "AN_REPORT_DONE") {
                        // v1.0.16/v2.2.0: Sự kiện kế thừa, trùng với SUPABASE_ROW_PERSISTED. Bỏ qua nếu không có ID thật,
                        // trùng report hiện tại hoặc report đã khóa/đã nộp.
                        if (!data.messageId || data.messageId === currentAnMessageId || data.messageId === lastSubmittedAnReportId || isReportLocked(data.messageId) || isAwaitingSupabaseNewRow) {
                            applyLocalLockToCorrelation();
                            renderTurnUI();
                            return;
                        }
                        const rec = {
                            id: data.messageId,
                            thread_id: data.threadId || lastThreadId,
                            sender: 'AN',
                            content_md: data.content_md || data.reportText || `Bản ghi báo cáo ID: ${data.messageId}`,
                            created_at: data.timestamp || new Date().toISOString()
                        };
                        handleSupabaseRowPersisted(rec, 'SSE_AN_REPORT');
                    } else if (data.type === "TEST_INJECT_PE") {
                        console.log("[Omni Bridge] 🧪 Nhận lệnh TEST_INJECT_PE từ Hub:", data);
                        handleExternalTestInjectPe(data.testId, data.text, data.autoSubmit);
                    } else if (data.type === "TEST_DISPATCHED_AN") {
                        console.log("[Omni Bridge] 🧪 Nhận sự kiện TEST_DISPATCHED_AN từ Hub:", data);
                        handleExternalTestDispatchedAn(data.testId, data.text, data.inboxPath);
                    } else if (data.type === "TEST_STAGE_UPDATED") {
                        console.log("[Omni Bridge] 🧪 Nhận cập nhật TEST_STAGE_UPDATED:", data);
                        handleExternalTestStageUpdated(data.testId, data.stage, data.stageData || data);
                    }
                } catch(e) {}
            };

            sseSource.onerror = () => {
                isHubConnected = false;
                updateHubStatusBadge(false);
                if (sseSource) sseSource.close();
                sseSource = null;
                setTimeout(connectSseHub, 5000);
            };
        } catch(e) {
            isHubConnected = false;
            updateHubStatusBadge(false);
        }
    }

    function sendBrowserAckToHub(reportId, version = 'v1.0.6') {
        if (!reportId) return;
        hubRequest(`${getHubUrl()}/api/pe-browser-ack`, {
            method: 'POST',
            body: JSON.stringify({
                sourceRowId: reportId,
                renderedAt: new Date().toISOString(),
                scriptVersion: version
            })
        }).then(() => {
            console.log(`[PE_BROWSER_ACK] ✅ Đã gửi browser receipt cho report [${reportId}]`);
        }).catch(err => {
            console.warn(`[PE_BROWSER_ACK] ⚠️ Không thể gửi browser receipt:`, err.message);
        });
    }

    function showReportAlertBanner(reportId, createdAt, workOrderId) {
        let banner = document.getElementById("omni-report-banner");
        if (!banner) return;
        const timeStr = createdAt ? new Date(createdAt).toLocaleTimeString() : new Date().toLocaleTimeString();
        const shortId = reportId ? reportId.slice(0, 8) : 'N/A';
        banner.style.display = "flex";
        banner.innerHTML = `
            <span>🔔 <b>CÓ BÁO CÁO AN MỚI (#${shortId})</b> • Nhận lúc ${timeStr} ${workOrderId ? `• [${workOrderId}]` : ''} • Sẵn sàng nạp vào PE</span>
            <span style="font-size: 10px; font-weight: normal; color: #047857;">${isAutoFlowEnabled ? '🤖 Auto Flow BẬT' : '🔒 An toàn: Auto Submit TẮT'}</span>
        `;
        // Gửi Browser Receipt ACK về Hub ngay sau khi render thành công (BRIDGE-REAL-BROWSER-HANDOFF-001)
        sendBrowserAckToHub(reportId);
    }

    function updateSourceBadge(source = "SSE") {
        const badge = document.getElementById("omni-source-badge");
        if (!badge) return;
        const upper = (source || 'SSE').toUpperCase();
        if (upper.includes("SSE")) {
            badge.textContent = "Nguồn: SSE";
            badge.style.background = "#ecfdf5";
            badge.style.color = "#065f46";
            badge.style.border = "1px solid #a7f3d0";
        } else if (upper.includes("POLL")) {
            badge.textContent = "Nguồn: POLL";
            badge.style.background = "#fffbeb";
            badge.style.color = "#b45309";
            badge.style.border = "1px solid #fde68a";
        } else if (upper.includes("INSERT")) {
            badge.textContent = "Nguồn: INSERT CONFIRM";
            badge.style.background = "#f0f9ff";
            badge.style.color = "#0369a1";
            badge.style.border = "1px solid #bae6fd";
        } else {
            badge.textContent = `Nguồn: ${upper}`;
            badge.style.background = "#f8fafc";
            badge.style.color = "#475569";
            badge.style.border = "1px solid #cbd5e1";
        }
    }

    // ==========================================
    // 7. GIAO DIỆN ĐIỀU KHIỂN & HIỂN THỊ 4 TẦNG TRẠNG THÁI
    // ==========================================
    function updateRehydrationAuditUI(record, source = "SUPABASE_REHYDRATION") {
        lastRehydrationSource = source;
        updateSourceBadge(source);
        const turnEl = document.getElementById("omni-ssot-turn");
        const actorEl = document.getElementById("omni-ssot-actor");
        const deliveryEl = document.getElementById("omni-ssot-delivery");
        const actEl = document.getElementById("omni-ssot-activity");
        const transEl = document.getElementById("omni-ssot-transport");
        const sourceEl = document.getElementById("omni-ssot-source");
        const idEl = document.getElementById("omni-ssot-id");
        const senderEl = document.getElementById("omni-ssot-sender");
        const timeEl = document.getElementById("omni-ssot-time");

        if (turnEl) turnEl.textContent = currentTurnState;
        if (actorEl) actorEl.textContent = currentNextActor;
        if (deliveryEl) deliveryEl.textContent = currentDeliveryState;
        if (actEl) actEl.textContent = currentActivityState !== ACTIVITY_STATES.IDLE ? `${currentActivityState} (${activityRemainingSec}s)` : "IDLE";
        if (transEl) transEl.textContent = currentTransportState;
        if (sourceEl) sourceEl.textContent = source;

        if (record) {
            if (idEl) idEl.textContent = record.id ? record.id.slice(0, 12) + "..." : "N/A";
            if (senderEl) senderEl.textContent = record.sender || "N/A";
            if (timeEl) timeEl.textContent = record.created_at ? new Date(record.created_at).toLocaleTimeString() : "N/A";
        }

        const corrReportEl = document.getElementById("omni-corr-report-id");
        const corrHandledByEl = document.getElementById("omni-corr-handled-by");
        const corrHandledAtEl = document.getElementById("omni-corr-handled-at");
        const corrInReplyEl = document.getElementById("omni-corr-in-reply-to");

        if (corrReportEl) corrReportEl.textContent = currentCorrelation.reportId ? currentCorrelation.reportId.slice(0, 12) + "..." : (record && record.sender === "AN" ? record.id.slice(0, 12) + "..." : "N/A");
        if (corrHandledByEl) corrHandledByEl.textContent = currentCorrelation.handledBy || (currentCorrelation.pendingAnReport ? "chưa xử lý" : "PE");
        if (corrHandledAtEl) corrHandledAtEl.textContent = currentCorrelation.handledAt ? new Date(currentCorrelation.handledAt).toLocaleTimeString() : (currentCorrelation.pendingAnReport ? "chưa xử lý" : "N/A");
        if (corrInReplyEl) corrInReplyEl.textContent = currentCorrelation.inReplyToMessageId ? currentCorrelation.inReplyToMessageId.slice(0, 12) + "..." : "N/A";
    }

    function renderTurnUI() {
        const dot = document.getElementById("omni-status-dot");
        const btnSendPe = document.getElementById("omni-btn-send-pe");
        const btnFwdAn = document.getElementById("omni-btn-fwd-an");
        const statusText = document.getElementById("omni-status-text");
        const cbAuto = document.getElementById("omni-cb-auto");

        renderActivityChip();

        if (isAwaitingSupabaseNewRow || (currentAnMessageId && currentAnMessageId === lastSubmittedAnReportId && isReportConsumed(currentAnMessageId))) {
            currentCorrelation.pendingAnReport = false;
            if (autoSubmitInterval) {
                clearInterval(autoSubmitInterval);
                autoSubmitInterval = null;
            }
        }

        const pauseBadge = isBridgePaused ? `<span style="display:inline-block; padding:1px 6px; border-radius:10px; font-size:10px; font-weight:700; background:#ffedd5; color:#c2410c; border:1px solid #fdba74; margin-left:5px; vertical-align:middle;">⏸️ Tạm dừng Auto</span>` : '';

        if (currentTurnState === TURN_STATES.PE_TURN) {
            // Lượt PE
            if (currentCorrelation.pendingAnReport && !isAwaitingSupabaseNewRow && currentAnMessageId !== lastSubmittedAnReportId) {
                // Có báo cáo mới của AN đang chờ PE đọc/xử lý
                if (dot) { 
                    dot.style.background = "#10b981"; 
                    dot.style.boxShadow = isBridgePaused ? "0 0 10px rgba(249,115,22,0.8)" : "0 0 12px rgba(16,185,129,0.9)"; 
                }
                if (btnSendPe) {
                    btnSendPe.disabled = false;
                    btnSendPe.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                    btnSendPe.style.color = "#ffffff"; btnSendPe.style.cursor = "pointer";
                    btnSendPe.textContent = "🚀 Đổ báo cáo vào PE (Alt+F9)";
                }
                if (btnFwdAn) {
                    btnFwdAn.style.background = "#f1f5f9"; btnFwdAn.style.color = "#94a3b8";
                    btnFwdAn.textContent = "Lượt PE (Chờ PE duyệt)";
                }
                if (statusText) {
                    const timeInfo = lastSupabaseRecord && lastSupabaseRecord.created_at ? formatJstTime(lastSupabaseRecord.created_at) : '';
                    const timeSuffix = timeInfo ? ` (${timeInfo})` : '';
                    statusText.innerHTML = `🟢 <b>[LƯỢT PE]</b> AN đã nộp báo cáo${timeSuffix} — Sẵn sàng gọi PE${pauseBadge}`;
                }

                const isAutoSubmit = isAutoSubmitEnabled();
                const isAutoFill = isAutoFillEnabled();
                const autoBlockReason = getAutoInjectBlockReason(currentAnMessageId);
                if (autoBlockReason === "REPORT_HANDLED" || autoBlockReason === "REPORT_ALREADY_INJECTED" || autoBlockReason === "REPORT_ALREADY_SUBMITTED" || autoBlockReason === "AWAITING_SUPABASE_UPDATE") {
                    currentCorrelation.pendingAnReport = false; // Khóa vĩnh viễn -> lần render sau rơi vào nhánh "Đã nạp"
                }

                if (autoBlockReason) {
                    if (autoSubmitInterval) {
                        clearInterval(autoSubmitInterval);
                        autoSubmitInterval = null;
                    }
                    if (btnSendPe && !autoBlockReason.startsWith("REPORT_")) {
                        btnSendPe.textContent = autoBlockReason === "AWAITING_SUPABASE_UPDATE" ? "⏳ Đã gửi PE (Chờ Supabase)" : "⏳ Chờ PE trả lời xong...";
                        btnSendPe.title = `Auto-inject tạm hoãn: ${autoBlockReason}`;
                    }
                } else if (isAutoSubmit && !isBridgePaused && !autoSubmitInterval && !isSubmitting && !isAwaitingSupabaseNewRow && currentAnMessageId !== lastSubmittedAnReportId) {
                    // Random delay từ 1-4s (không chờ hết 4s mà là ngẫu nhiên trong khoảng đó)
                    const randomDelayMs = getRandomSubmitDelayMs();
                    let remainingMs = randomDelayMs;
                    const initialSecStr = (randomDelayMs / 1000).toFixed(1);
                    console.log(`[Omni Bridge] 🎲 Auto-Submit kích hoạt: Độ trễ ngẫu nhiên ${initialSecStr}s (trong khoảng 1s - 4s)`);

                    // 1. Tự động điền trước nội dung vào ô chat để người dùng nhìn thấy trực quan
                    const inputEl = findPerplexityInput();
                    if (inputEl && lastFilledReportId !== currentAnMessageId) {
                        const pingMsg = buildAnReportPingMessage();
                        setReactInputValue(inputEl, pingMsg);
                        lastFilledReportId = currentAnMessageId;
                        updatePreviewBox(`[GỬI TỚI PE (AUTO) - ${new Date().toLocaleTimeString()}] (Thread: ${lastThreadId})\n\n${pingMsg}`);
                    }

                    // 2. Cập nhật UI nút và status text
                    btnSendPe.textContent = `⏳ Tự gửi (${initialSecStr}s)...`;
                    btnSendPe.title = `Tự động gửi sau ${initialSecStr}s ngẫu nhiên (1-4s) (hoặc nhấp để gửi ngay)`;
                    if (statusText) {
                        statusText.innerHTML = `🟢 <b>[LƯỢT PE]</b> Tự gửi sau <b>${initialSecStr}s</b> (ngẫu nhiên 1-4s)${pauseBadge}`;
                    }

                    // 3. Vòng lặp đếm ngược mượt mà (tick mỗi 200ms)
                    const TICK_MS = 200;
                    autoSubmitInterval = setInterval(() => {
                        remainingMs -= TICK_MS;
                        if (currentTurnState !== TURN_STATES.PE_TURN || !currentCorrelation.pendingAnReport || isBridgePaused || isAwaitingSupabaseNewRow || currentAnMessageId === lastSubmittedAnReportId) {
                            clearInterval(autoSubmitInterval);
                            autoSubmitInterval = null;
                            renderTurnUI();
                            return;
                        }
                        if (remainingMs > 0) {
                            const secStr = (remainingMs / 1000).toFixed(1);
                            btnSendPe.textContent = `⏳ Tự gửi (${secStr}s)...`;
                            btnSendPe.title = `Tự động gửi sau ${secStr}s ngẫu nhiên (1-4s) (hoặc nhấp để gửi ngay)`;
                            if (statusText) {
                                statusText.innerHTML = `🟢 <b>[LƯỢT PE]</b> Tự gửi sau <b>${secStr}s</b> (ngẫu nhiên 1-4s)${pauseBadge}`;
                            }
                        } else {
                            clearInterval(autoSubmitInterval);
                            autoSubmitInterval = null;
                            executeFillAndSubmit(false, null, true); // true = Đổ & Submit
                        }
                    }, TICK_MS);
                } else if (isAutoFill && !isBridgePaused && !isSubmitting && !isAwaitingSupabaseNewRow && currentAnMessageId !== lastSubmittedAnReportId) {
                    // EXACTLY-ONCE DISPATCH (v2.3.0):
                    // Báo cáo của AN chỉ được tự động đổ vào chatbox ĐÚNG 1 LẦN!
                    // Tuyệt đối không kiểm tra !hasReport vì khi người dùng bấm gửi hoặc Perplexity đang suy nghĩ, ô chat bị xóa rỗng sẽ gây đổ lặp!
                    // Muốn đổ lại cùng 1 báo cáo, người dùng BẮT BUỘC PHẢI BẤM NÚT THỦ CÔNG (Alt+F9 hoặc nút Đổ báo cáo)!
                    const isAlreadyInjected = (typeof isReportInjected === 'function' && isReportInjected(currentAnMessageId)) || lastFilledReportId === currentAnMessageId;
                    const isBusy = typeof isPerplexityBusy === 'function' ? isPerplexityBusy() : false;
                    if (!isAlreadyInjected && !isBusy && !isReportLocked(currentAnMessageId)) {
                        setTimeout(() => {
                            executeFillAndSubmit(false, null, false); // false = Chỉ dán chatbox, không submit
                        }, 400);
                    }
                } else if (isBridgePaused && autoSubmitInterval) {
                    clearInterval(autoSubmitInterval);
                    autoSubmitInterval = null;
                }
            } else {
                // Báo cáo đã được PE xử lý hoặc đã consume/in-flight -> KHÔNG BẬT NÚT ĐỔ LẠI!
                if (dot) { 
                    dot.style.background = "#059669"; 
                    dot.style.boxShadow = isBridgePaused ? "0 0 8px rgba(249,115,22,0.8)" : "0 0 8px rgba(5,150,105,0.7)"; 
                }
                if (btnSendPe) {
                    if (manualSendRequiredReportId && manualSendRequiredReportId === currentAnMessageId) {
                        btnSendPe.disabled = false;
                        btnSendPe.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                        btnSendPe.style.color = "#ffffff"; btnSendPe.style.cursor = "pointer";
                        btnSendPe.textContent = "🚀 Bấm để gửi (Alt+F9)";
                        btnSendPe.title = "Auto-submit chưa gửi được — đã dán sẵn trong ô chat, bấm để gửi thủ công";
                    } else if (isAwaitingSupabaseNewRow || currentAnMessageId === lastSubmittedAnReportId) {
                        btnSendPe.disabled = true;
                        btnSendPe.style.background = "#f1f5f9"; btnSendPe.style.color = "#94a3b8"; btnSendPe.style.cursor = "not-allowed";
                        btnSendPe.textContent = "⏳ Đã gửi PE (Chờ Supabase)";
                        btnSendPe.title = "Đã đổ dữ liệu vào PE — Đang chờ PE thẩm định và Supabase cập nhật bản ghi mới";
                    } else {
                        btnSendPe.disabled = true;
                        btnSendPe.style.background = "#f1f5f9"; btnSendPe.style.color = "#94a3b8"; btnSendPe.style.cursor = "not-allowed";
                        btnSendPe.textContent = "✅ Đã nạp (Lượt PE)";
                        btnSendPe.title = "Báo cáo đã được nạp/xử lý bởi PE";
                    }
                }
                if (btnFwdAn) {
                    btnFwdAn.style.background = "#ecfdf5"; btnFwdAn.style.color = "#047857";
                    btnFwdAn.textContent = "PE đã xem báo cáo";
                }
                if (statusText) {
                    if (isAwaitingSupabaseNewRow || (!isReportHandled(currentAnMessageId) && currentAnMessageId === lastSubmittedAnReportId)) {
                        statusText.innerHTML = `⏳ <b>[ĐÃ ĐỔ VÀO PE]</b> Đang chờ PE thẩm định và Supabase cập nhật bản ghi mới...${pauseBadge}`;
                        statusText.title = "Đã đổ dữ liệu vào PE — Đang chờ PE thẩm định và Supabase cập nhật bản ghi mới";
                    } else {
                        const handledNow = isReportHandled(currentAnMessageId) || Boolean(currentCorrelation.handledAt);
                        if (!handledNow && isReportConsumed(currentAnMessageId)) {
                            statusText.innerHTML = `🔵 <b>[LƯỢT PE]</b> Đã đổ báo cáo vào PE (1 lần) — PE đang thẩm định, KHÔNG đổ lại${pauseBadge}`;
                            statusText.title = `Single-Flight: báo cáo ${currentAnMessageId ? currentAnMessageId.slice(0, 8) : ''} đã khóa, chờ PE trả lời xong`;
                        } else {
                            const timeInfo = currentCorrelation.handledAt ? formatJstTime(currentCorrelation.handledAt) : 'Đã hoàn tất';
                            statusText.innerHTML = `🟢 <b>[LƯỢT PE]</b> PE đã tiếp nhận/xử lý báo cáo (${timeInfo}) — Chờ PE ra chỉ thị${pauseBadge}`;
                            statusText.title = `PE đã tiếp nhận/xử lý báo cáo (${timeInfo}) — Chờ PE ra chỉ thị`;
                        }
                    }
                }
                if (autoSubmitInterval) {
                    clearInterval(autoSubmitInterval);
                    autoSubmitInterval = null;
                }
            }
        } else if (currentTurnState === TURN_STATES.AN_TURN) {
            // Lượt AN (Row mới nhất từ PE hoặc THOAN, AN đang nhận hoặc thi công)
            if (dot) { 
                dot.style.background = "#f59e0b"; 
                dot.style.boxShadow = isBridgePaused ? "0 0 10px rgba(249,115,22,0.8)" : "0 0 10px rgba(245,158,11,0.8)"; 
            }
            if (btnSendPe) {
                btnSendPe.disabled = true;
                btnSendPe.style.background = "#f1f5f9"; btnSendPe.style.color = "#94a3b8"; btnSendPe.style.cursor = "not-allowed";
                btnSendPe.textContent = "⏳ Chờ AN thi công";
                btnSendPe.title = "Đang trong lượt AN thi công và báo cáo";
            }
            if (btnFwdAn) {
                btnFwdAn.style.background = "#fffbeb"; btnFwdAn.style.color = "#b45309";
                btnFwdAn.textContent = currentDeliveryState === DELIVERY_STATES.WAITING_FOR_ACK ? "⏳ Chờ AN nhận..." : "✅ Đã chuyển AN";
            }
            if (statusText) {
                const ackInfo = currentDeliveryState === DELIVERY_STATES.WAITING_FOR_ACK ? ` (Chờ ACK: ${waitingAckElapsedSec}s)` : ` (Đã nhận)`;
                const senderName = lastSupabaseRecord && lastSupabaseRecord.sender === 'THOAN' ? 'Minh Chủ THOAN' : 'PE';
                const timeInfo = lastSupabaseRecord && lastSupabaseRecord.created_at ? ` (${formatJstTime(lastSupabaseRecord.created_at)})` : '';
                statusText.innerHTML = `🟡 <b>[LƯỢT AN]</b> ${senderName} đã ra chỉ thị${timeInfo}${ackInfo} — Chờ AN thi công${pauseBadge}`;
                statusText.title = `${senderName} đã ra chỉ thị${timeInfo}${ackInfo} — Chờ AN thi công`;
            }
        } else {
            // IDLE
            if (dot) { dot.style.background = "#94a3b8"; dot.style.boxShadow = "none"; }
            if (btnSendPe) {
                btnSendPe.disabled = !currentCorrelation.pendingAnReport;
                btnSendPe.style.background = currentCorrelation.pendingAnReport ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#f8fafc";
                btnSendPe.style.color = currentCorrelation.pendingAnReport ? "#ffffff" : "#64748b";
                btnSendPe.style.cursor = currentCorrelation.pendingAnReport ? "pointer" : "default";
                btnSendPe.textContent = currentCorrelation.pendingAnReport ? "🚀 Đổ báo cáo vào PE (Alt+F9)" : "⚪ OmniLinguist Bridge";
            }
            if (btnFwdAn) {
                btnFwdAn.style.background = "#f8fafc"; btnFwdAn.style.color = "#64748b";
                btnFwdAn.textContent = "⚡ Chuyển sang AN (Alt+F10)";
            }
            if (statusText) {
                statusText.innerHTML = `⚡ <b>Omni Bridge</b> — Sẵn sàng (SSOT)${pauseBadge}`;
            }
        }

        updateRehydrationAuditUI(lastSupabaseRecord, lastRehydrationSource);
    }

    function setWorkflowState(state, info = "", source = "LIVE_OPTIMISTIC") {
        currentWorkflowState = state;
        logStateSnapshot("SET_WORKFLOW_STATE", `workflow=${state} info=${info}`);
        recordAuditTrace(state, `${info}${info ? ' • ' : ''}[${source}]`);

        if (waitingAckTimer && state !== STATES.WAITING_FOR_AN_ACK && currentDeliveryState !== DELIVERY_STATES.WAITING_FOR_ACK) {
            clearInterval(waitingAckTimer);
            waitingAckTimer = null;
            waitingAckElapsedSec = 0;
        }

        if (autoSubmitInterval && state !== STATES.AN_REPORTED && currentTurnState !== TURN_STATES.PE_TURN) {
            clearInterval(autoSubmitInterval);
            autoSubmitInterval = null;
        }

        if (state === STATES.PAUSED) {
            isBridgePaused = true;
        } else if (state === STATES.PE_REQUEST_QUEUED) {
            setTransportState(TRANSPORT_STATES.SENDING_TO_HUB);
        } else if (state === STATES.PE_REQUEST_DELIVERED) {
            setTransportState(TRANSPORT_STATES.IDLE);
            setActivityState(ACTIVITY_STATES.PE_THINKING, 60, "Delivered to PE");
        } else if (state === STATES.PE_THINKING) {
            setActivityState(ACTIVITY_STATES.PE_THINKING, 60, "Thinking stream active");
        } else if (state === STATES.PE_REPLIED) {
            terminateActivity("PE replied");
            setTurnState(TURN_STATES.AN_TURN, "AN", "PE replied");
            setDeliveryState(DELIVERY_STATES.WAITING_FOR_ACK, info);
        } else if (state === STATES.AN_NOTIFICATION_QUEUED) {
            setDeliveryState(DELIVERY_STATES.DISPATCH_QUEUED, info);
        } else if (state === STATES.WAITING_FOR_AN_ACK) {
            setDeliveryState(DELIVERY_STATES.WAITING_FOR_ACK, info);
        } else if (state === STATES.AN_RECEIVED) {
            setDeliveryState(DELIVERY_STATES.ACKNOWLEDGED, info);
        } else if (state === STATES.AN_WORKING) {
            setActivityState(ACTIVITY_STATES.AN_WORKING, 120, info);
        } else if (state === STATES.AN_REPORTED) {
            terminateActivity("AN reported");
            setTurnState(TURN_STATES.PE_TURN, "PE", info);
            setDeliveryState(DELIVERY_STATES.ACKNOWLEDGED, info);
        } else if (state === STATES.IDLE) {
            terminateActivity("Idle");
            setTurnState(TURN_STATES.IDLE, "NONE", info);
            setDeliveryState(DELIVERY_STATES.IDLE, info);
        }

        renderTurnUI();
    }

    // Gửi test payload sang AN để kiểm tra chuỗi Acknowledgment thực tế
    async function sendTestDirectiveToAn() {
        const testReqId = `test-req-${Date.now()}`;
        const testMsgId = `test-pe-${Date.now()}`;
        currentRequestId = testReqId;
        currentPeMessageId = testMsgId;
        showToast(`🧪 Gửi payload test sang AN [${testReqId}]...`, "info");
        setWorkflowState(STATES.AN_NOTIFICATION_QUEUED, testReqId);

        const payload = JSON.stringify({
            requestId: testReqId,
            threadId: lastThreadId || "OMNI-CYCLE-001",
            messageId: testMsgId,
            directiveText: `⏱️ [TEST DIRECTIVE TỪ MINH CHỦ: ${new Date().toISOString()}]\nPayload kiểm tra chuỗi Acknowledgment (BRIDGE-STATUS-LOGIC-AUDIT-001).`,
            sender: 'PE_TEST',
            isTest: true
        });

        try {
            await sendToHub(`${getHubUrl()}/api/directive`, payload);
            setWorkflowState(STATES.WAITING_FOR_AN_ACK, testMsgId);
            showToast(`⏳ Payload test đã vào hàng đợi. Chờ AN ACK...`, "info");
        } catch(err) {
            setWorkflowState(STATES.FAILED, err.message);
            showToast(`❌ Lỗi gửi test sang Hub: ${err.message}`, "error");
        }
    }

    function updateHubStatusBadge(connected, mode = 'SSE') {
        const badge = document.getElementById("omni-hub-badge");
        if (badge) {
            if (connected) {
                badge.style.background = "#ecfdf5";
                badge.style.color = "#059669";
                badge.textContent = mode === 'POLL' ? `Hub Online (Poll 3s)` : `Hub Online (SSE)`;
                badge.title = `Hub đang chạy trên cổng :${activeHubPort} (${mode === 'POLL' ? 'Poll 3s Inbound Fallback' : 'SSE Realtime'})`;
            } else {
                badge.style.background = "#fef2f2";
                badge.style.color = "#dc2626";
                badge.style.border = "1px solid #fecaca";
                badge.textContent = `Hub :${activeHubPort} ○ Offline`;
            }
        }
    }

    function togglePause() {
        isBridgePaused = !isBridgePaused;
        localStorage.setItem("omni_bridge_paused", isBridgePaused ? "true" : "false");
        const btnPause = document.getElementById("omni-btn-pause");
        if (btnPause) {
            btnPause.innerHTML = isBridgePaused ? "▶️ Tiếp tục (Alt+P)" : "⏸️ Tạm dừng (Alt+P)";
            btnPause.style.background = isBridgePaused ? "#fed7aa" : "#fff7ed";
            btnPause.style.color = isBridgePaused ? "#9a3412" : "#c2410c";
            btnPause.style.borderColor = isBridgePaused ? "#ea580c" : "#fdba74";
        }
        if (isBridgePaused) {
            if (autoSubmitInterval) {
                clearInterval(autoSubmitInterval);
                autoSubmitInterval = null;
            }
            showToast("⏸️ Đã tạm dừng tự động gửi (Vẫn cập nhật trạng thái SSOT bình thường)", "warning");
        } else {
            showToast("▶️ Đã tiếp tục tự động gửi OmniBridge", "success");
        }
        renderTurnUI();
    }

    function toggleViewer(forceState = null) {
        const viewer = document.getElementById("omni-bridge-viewer");
        const btn = document.getElementById("omni-btn-toggle-viewer");
        if (!viewer || !btn) return;
        const willShow = forceState !== null ? forceState : (viewer.style.display === "none");
        viewer.style.display = willShow ? "flex" : "none";
        btn.textContent = willShow ? "👁️ Ẩn tin ▴" : "👁️ Xem tin ▾";
        btn.style.background = willShow ? "#e0e7ff" : "#f8fafc";
        localStorage.setItem("omni_bridge_viewer_open", willShow ? "true" : "false");
    }

    let isPreviewExpanded = false;
    function togglePreviewExpand(forceState = null) {
        const pre = document.getElementById("omni-preview-content");
        const btn = document.getElementById("omni-btn-expand-preview");
        if (!pre || !btn) return;
        isPreviewExpanded = forceState !== null ? forceState : !isPreviewExpanded;
        pre.style.maxHeight = isPreviewExpanded ? "450px" : "120px";
        btn.textContent = isPreviewExpanded ? "🔍 Thu nhỏ" : "🔍 Phóng to";
        btn.title = isPreviewExpanded ? "Thu nhỏ khung xem tin" : "Mở rộng khung xem tin để đọc toàn bộ";
    }

    function toggleAuditDetails(forceState = null) {
        const container = document.getElementById("omni-audit-details-container");
        const btn = document.getElementById("omni-btn-toggle-audit-details");
        if (!container || !btn) return;
        const willShow = forceState !== null ? forceState : (container.style.display === "none");
        container.style.display = willShow ? "flex" : "none";
        btn.textContent = willShow ? "⚙️ Thu gọn kỹ thuật & Audit ▴" : "⚙️ Chi tiết kỹ thuật & Audit Trace ▾";
    }

    function toggleQuickRow(forceState = null) {
        const row = document.getElementById("omni-quick-row");
        const btn = document.getElementById("omni-btn-toggle-quick");
        if (!row || !btn) return;
        const willShow = forceState !== null ? forceState : (row.style.display === "none");
        row.style.display = willShow ? "flex" : "none";
        btn.textContent = willShow ? "⚡ Thu gọn ▴" : "⚡ Mở rộng ▾";
        btn.style.background = willShow ? "#fef3c7" : "#f8fafc";
        localStorage.setItem("omni_bridge_quick_open", willShow ? "true" : "false");
    }

    function toggleMinimize(forceState = null) {
        const body = document.getElementById("omni-panel-body");
        const btn = document.getElementById("omni-btn-minimize");
        const panel = document.getElementById("omni-bridge-panel");
        if (!body || !btn || !panel) return;
        const willMinimize = forceState !== null ? forceState : (body.style.display !== "none");
        body.style.display = willMinimize ? "none" : "flex";
        btn.textContent = willMinimize ? "▲" : "▼";
        btn.title = willMinimize ? "Mở rộng bảng điều khiển" : "Thu gọn bảng điều khiển";
        btn.style.background = willMinimize ? "#e0f2fe" : "#f8fafc";
        btn.style.color = willMinimize ? "#0284c7" : "#64748b";
        panel.style.width = "760px";
        localStorage.setItem("omni_bridge_minimized", willMinimize ? "true" : "false");
    }

    function toggleTestBox(forceState = null) {
        const box = document.getElementById("omni-test-box");
        const btn = document.getElementById("omni-btn-toggle-test");
        if (!box || !btn) return;
        const willShow = forceState !== null ? forceState : (box.style.display === "none");
        box.style.display = willShow ? "block" : "none";
        btn.textContent = willShow ? "🧪 Đóng Test ▴" : "🧪 Test Hai Đầu ▾";
        btn.style.background = willShow ? "#e0f2fe" : "#f8fafc";
        localStorage.setItem("omni_bridge_test_box_open", willShow ? "true" : "false");
    }

    function copyToClipboardReliable(text) {
        if (!text) return false;
        let copied = false;
        // 1. Ưu tiên Tampermonkey GM_setClipboard (đồng bộ, đặc quyền cao, không bị chặn bởi transient activation timeout)
        try {
            if (typeof GM_setClipboard === "function") {
                GM_setClipboard(text, "text");
                copied = true;
            }
        } catch (e) {
            console.warn("[OmniBridge] GM_setClipboard failed:", e);
        }

        // 2. Thử document.execCommand('copy') qua textarea ẩn (đồng bộ trong user click event)
        if (!copied) {
            try {
                const ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.top = "-9999px";
                ta.style.left = "-9999px";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                copied = document.execCommand("copy");
                document.body.removeChild(ta);
            } catch (e) {
                console.warn("[OmniBridge] execCommand copy failed:", e);
            }
        }

        // 3. Fallback navigator.clipboard.writeText
        if (!copied && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                console.warn("[OmniBridge] navigator.clipboard.writeText failed:", err);
            });
            copied = true;
        }
        return copied;
    }

    function copyPreviewContent() {
        const pre = document.getElementById("omni-preview-content");
        const text = pre ? pre.textContent : latestMessagePreview;
        const success = copyToClipboardReliable(text);
        if (success) {
            showToast("📋 Đã sao chép nội dung vào bộ nhớ tạm!", "success");
        } else {
            showToast("⚠️ Không thể tự động sao chép, hãy bôi đen thủ công.", "warn");
        }
    }

    // ==========================================
    // MANUAL TEST SLICE (GỬI THỦ CÔNG PE & AN)
    // ==========================================
    let currentActiveTestId = null;

    function renderTestStageBox(testId, stage1Text, stage2Text, stage3Text, noticeText = "") {
        const box = document.getElementById("omni-test-stage-box");
        const idLine = document.getElementById("omni-test-id-line");
        const s1 = document.getElementById("omni-test-stage1");
        const s2 = document.getElementById("omni-test-stage2");
        const s3 = document.getElementById("omni-test-stage3");
        const notice = document.getElementById("omni-test-notice");
        const chip = document.getElementById("omni-test-chip");

        if (!box) return;
        box.style.display = "block";
        if (idLine && testId) idLine.textContent = `Mã Test: ${testId}`;
        if (s1 && stage1Text !== null) s1.innerHTML = stage1Text;
        if (s2 && stage2Text !== null) s2.innerHTML = stage2Text;
        if (s3 && stage3Text !== null) s3.innerHTML = stage3Text;
        if (notice) {
            if (noticeText) {
                notice.style.display = "block";
                notice.textContent = noticeText;
            } else {
                notice.style.display = "none";
            }
        }
        if (chip) {
            chip.textContent = testId ? "Đang test" : "Sẵn sàng";
            chip.style.background = testId ? "#dbeafe" : "#e2e8f0";
            chip.style.color = testId ? "#1e40af" : "#475569";
        }
    }

    let locallyInjectedPeTestId = null;

    async function handleManualTestSendPe() {
        const btnSendPe = document.getElementById("omni-btn-test-send-pe");
        if (btnSendPe && btnSendPe.disabled) return;
        if (btnSendPe) {
            btnSendPe.disabled = true;
            btnSendPe.style.opacity = "0.6";
            setTimeout(() => {
                if (btnSendPe) {
                    btnSendPe.disabled = false;
                    btnSendPe.style.opacity = "1";
                }
            }, 3000);
        }

        const inputArea = document.getElementById("omni-test-input");
        const text = inputArea && inputArea.value.trim() ? inputArea.value.trim() : "Test payload thủ công từ Minh Chủ gửi PE.";
        const testId = `test-pe-${Date.now()}`;
        currentActiveTestId = testId;
        locallyInjectedPeTestId = testId;

        const cbTestAuto = document.getElementById("omni-test-pe-auto");
        const autoSubmit = cbTestAuto ? cbTestAuto.checked : false;

        renderTestStageBox(
            testId,
            `1. Đã tới Hub: ⏳ Đang kết nối Hub...`,
            `2. Đã điền vào ô chat PE: ⚪ Chờ Hub`,
            `3. Đã gửi trong chat PE: ⚪ Chờ điền`,
            ""
        );
        showToast(`📤 Đang gửi test sang PE [${testId}]...`, "info");

        try {
            // Chặng 1: Gửi tới Hub
            const hubRes = await sendToHub(`${getHubUrl()}/api/send/pe`, JSON.stringify({
                testId,
                text,
                autoSubmit
            }));

            if (!hubRes || hubRes.success === false) {
                renderTestStageBox(testId, `1. Đã tới Hub: ❌ Thất bại (${hubRes?.error || "Lỗi mạng"})`, null, null);
                showToast(`❌ Không thể gửi tới Hub!`, "error");
                return;
            }

            renderTestStageBox(
                testId,
                `1. Đã tới Hub: ✅ Thành công (${new Date().toLocaleTimeString()})`,
                `2. Đã điền vào ô chat PE: ⏳ Đang tìm ô chat và điền...`,
                null,
                ""
            );

            // Chặng 2: Điền vào ô chat PE
            const inputEl = findPerplexityInput();
            if (!inputEl) {
                renderTestStageBox(testId, null, `2. Đã điền vào ô chat PE: ❌ Không tìm thấy ô nhập trên trang (Nhấp vào ô chat rồi thử lại)!`, null);
                showToast(`⚠️ Không tìm thấy ô nhập Perplexity trên trang!`, "warn");
                return;
            }

            const fillSuccess = setReactInputValue(inputEl, text);
            if (!fillSuccess) {
                renderTestStageBox(testId, null, `2. Đã điền vào ô chat PE: ❌ Lỗi khi điền văn bản vào phần tử DOM!`, null);
                showToast(`❌ Không thể điền văn bản vào ô chat!`, "error");
                return;
            }

            await sendToHub(`${getHubUrl()}/api/test/stage-update`, JSON.stringify({
                testId,
                stage: 'PE_INJECTED'
            }));

            renderTestStageBox(
                testId,
                null,
                `2. Đã điền vào ô chat PE: ✅ Đã điền văn bản thành công!`,
                autoSubmit ? `3. Đã gửi trong chat PE: ⏳ Auto đếm ngược gửi (1.5s)...` : `3. Trạng thái gửi: ⚪ Đã điền xong — Chờ THOAN bấm Enter hoặc Alt+F9`
            );
            showToast(`✅ Đã điền nội dung test vào ô chat PE!`, "success");

            // Chặng 3: Nếu autoSubmit thì bấm gửi
            if (autoSubmit) {
                setTimeout(async () => {
                    const submitted = await submitPerplexityInput(inputEl);
                    if (submitted) {
                        await sendToHub(`${getHubUrl()}/api/test/stage-update`, JSON.stringify({
                            testId,
                            stage: 'PE_SUBMITTED'
                        }));
                        renderTestStageBox(
                            testId,
                            null,
                            null,
                            `3. Đã gửi trong chat PE: ✅ Đã kích hoạt gửi câu hỏi thành công! (${new Date().toLocaleTimeString()})`
                        );
                        showToast(`🚀 Đã gửi câu hỏi test vào Perplexity!`, "success");
                    } else {
                        renderTestStageBox(testId, null, null, `3. Đã gửi trong chat PE: ⚠️ Không tìm thấy nút gửi (Thoan bấm Enter)!`);
                    }
                }, 1500);
            }
        } catch (e) {
            renderTestStageBox(testId, `1. Đã tới Hub: ❌ Lỗi (${e.message})`, null, null);
            showToast(`❌ Lỗi gửi test PE: ${e.message}`, "error");
        }
    }

    async function handleManualTestSendAn() {
        const inputArea = document.getElementById("omni-test-input");
        const text = inputArea && inputArea.value.trim() ? inputArea.value.trim() : "Test directive thủ công từ Minh Chủ gửi AN.";
        const testId = `test-an-${Date.now()}`;
        currentActiveTestId = testId;

        // Copy NGAY LẬP TỨC vào clipboard trong khi còn user activation token (đồng bộ)
        copyToClipboardReliable(text);

        const threadInput = document.getElementById("omni-test-thread");
        const threadId = (threadInput && threadInput.value.trim()) ? threadInput.value.trim() : (lastThreadId || "OMNI-CYCLE-001");
        lastThreadId = threadId;

        renderTestStageBox(
            testId,
            `1. Đã tới Hub: ⏳ Đang kết nối Hub...`,
            `2. Đã ghi Inbox & Báo chuông: ⚪ Chờ Hub`,
            `3. AN Watcher đã ACK: ⚪ Chờ ghi Inbox`,
            ""
        );
        showToast(`📥 Đang gửi test sang AN [${testId}] (Thread: ${threadId})...`, "info");

        try {
            // Chặng 1 & 2: Gửi tới Hub -> Hub ghi inbox + phát beep + ghi clipboard Windows OS
            const hubRes = await sendToHub(`${getHubUrl()}/api/send/an`, JSON.stringify({
                testId,
                text,
                threadId
            }));

            if (!hubRes || hubRes.success === false) {
                renderTestStageBox(testId, `1. Đã tới Hub: ❌ Thất bại (${hubRes?.error || "Lỗi mạng"})`, null, null);
                showToast(`❌ Không thể gửi tới Hub!`, "error");
                return;
            }

            renderTestStageBox(
                testId,
                `1. Đã tới Hub: ✅ Thành công (${new Date().toLocaleTimeString()})`,
                `2. Đã ghi Inbox: ✅ Đã ghi .agents/PE_INBOX_LATEST.json & phát chuông`,
                `3. Trạng thái Watcher: ⏳ Chờ Sentinel Watcher thấy file & gửi ACK...`,
                `🔔 Thông báo: Đã ghi vào Inbox (.agents/PE_INBOX_LATEST.json) và copy vào Clipboard. Minh Chủ dán (Ctrl+V) vào Antigravity để kiểm thử.`
            );

            // Re-copy dự phòng
            copyToClipboardReliable(text);

            showToast(`📥 Đã gửi cho AN! Nội dung đã copy vào Clipboard, sẵn sàng dán vào Antigravity.`, "success");
            playTone(880, 0.2);
        } catch (e) {
            renderTestStageBox(testId, `1. Đã tới Hub: ❌ Lỗi (${e.message})`, null, null);
            showToast(`❌ Lỗi gửi test AN: ${e.message}`, "error");
        }
    }

    function handleExternalTestInjectPe(testId, text, autoSubmit) {
        if (testId && testId === locallyInjectedPeTestId) {
            console.log(`[Omni Bridge] 🧪 TestId [${testId}] đã được điền cục bộ tại tab này, bỏ qua re-inject từ SSE.`);
            return;
        }
        currentActiveTestId = testId;
        renderTestStageBox(
            testId,
            `1. Đã tới Hub: ✅ Nhận qua SSE (${new Date().toLocaleTimeString()})`,
            `2. Đã điền vào ô chat PE: ⏳ Đang điền...`,
            autoSubmit ? `3. Đã gửi trong chat PE: ⏳ Chờ auto submit...` : `3. Trạng thái gửi: ⚪ Chờ THOAN bấm Enter`
        );
        const inputEl = findPerplexityInput();
        if (inputEl) {
            setReactInputValue(inputEl, text);
            sendToHub(`${getHubUrl()}/api/test/stage-update`, JSON.stringify({ testId, stage: 'PE_INJECTED' }));
            renderTestStageBox(testId, null, `2. Đã điền vào ô chat PE: ✅ Đã điền xong!`, null);
            if (autoSubmit) {
                setTimeout(async () => {
                    const submitted = await submitPerplexityInput(inputEl);
                    if (submitted) {
                        sendToHub(`${getHubUrl()}/api/test/stage-update`, JSON.stringify({ testId, stage: 'PE_SUBMITTED' }));
                        renderTestStageBox(testId, null, null, `3. Đã gửi trong chat PE: ✅ Đã submit! (${new Date().toLocaleTimeString()})`);
                    }
                }, 1500);
            }
        } else {
            renderTestStageBox(testId, null, `2. Đã điền vào ô chat PE: ❌ Không tìm thấy ô nhập!`, null);
        }
    }

    function handleExternalTestDispatchedAn(testId, text, inboxPath) {
        currentActiveTestId = testId;
        renderTestStageBox(
            testId,
            `1. Đã tới Hub: ✅ Nhận qua SSE (${new Date().toLocaleTimeString()})`,
            `2. Đã ghi Inbox & Báo chuông: ✅ Đã ghi ${inboxPath || "Inbox"}`,
            `3. Trạng thái Watcher: ⏳ Chờ Sentinel Watcher thấy file & gửi ACK...`,
            `🔔 Thông báo: Đã ghi vào Inbox (.agents/PE_INBOX_LATEST.json). Minh Chủ dán (Ctrl+V) vào Antigravity để kiểm thử.`
        );
    }

    function handleExternalTestStageUpdated(testId, stage, stageData) {
        if (!currentActiveTestId || currentActiveTestId === testId) {
            currentActiveTestId = testId;
            if (stage === 'AN_ACKED') {
                renderTestStageBox(
                    testId,
                    null,
                    null,
                    `3. Trạng thái Watcher: ✅ Sentinel Watcher đã thấy file và ACK Inbox (Minh Chủ dán vào chat AN)`
                );
                showToast(`✅ Sentinel Watcher đã thấy file và gửi ACK cho [${testId}]!`, "success");
                playTone(659.25, 0.25);
            } else if (stage === 'PE_INJECTED') {
                renderTestStageBox(testId, null, `2. Đã điền vào ô chat PE: ✅ Đã điền thành công!`, null);
            } else if (stage === 'PE_SUBMITTED') {
                renderTestStageBox(testId, null, null, `3. Đã gửi trong chat PE: ✅ Đã gửi câu hỏi!`);
            }
        }
    }

    function createControlBar() {
        if (document.getElementById("omni-bridge-panel")) return;
        if (!document.body) {
            setTimeout(createControlBar, 200);
            return;
        }

        try {
            const panel = document.createElement("div");
            panel.id = "omni-bridge-panel";
            panel.setAttribute("translate", "no");
            panel.className = "notranslate no-katex";

            let savedTop = localStorage.getItem("omni_bridge_pos_top") || "14px";
            let savedLeft = localStorage.getItem("omni_bridge_pos_left") || "calc(50% - 370px)";
            if (savedLeft === "50%") savedLeft = "calc(50% - 370px)";

            // Kiểm tra an toàn để thanh công cụ không bao giờ bị bay ra ngoài viewport
            if (typeof savedTop === "string" && savedTop.endsWith("px")) {
                const topNum = parseInt(savedTop, 10);
                if (isNaN(topNum) || topNum < 0 || topNum > (window.innerHeight - 50)) {
                    savedTop = "14px";
                }
            }
            if (typeof savedLeft === "string" && savedLeft.endsWith("px")) {
                const leftNum = parseInt(savedLeft, 10);
                if (isNaN(leftNum) || leftNum < 0 || leftNum > (window.innerWidth - 100)) {
                    savedLeft = "calc(50% - 370px)";
                }
            }

            const isCollapsedInitial = localStorage.getItem("omni_bridge_minimized") === "true";
            const isTestBoxOpenInitial = false; // Mặc định luôn thu gọn mục Test để giữ giao diện tối giản

            panel.style.cssText = `
                position: fixed;
                top: ${savedTop};
                left: ${savedLeft};
                transform: none;
                background: #ffffff;
                border: 1px solid #cbd5e1;
                border-radius: 12px;
                padding: 8px 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.18);
                z-index: 9999998;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                color: #334155;
                user-select: none;
                width: 760px;
                max-width: 96vw;
                box-sizing: border-box;
                overflow: hidden;
                transition: width 0.2s ease, box-shadow 0.2s ease;
            `;

            panel.innerHTML = `
                <!-- DÒNG 1: HEADER & THANH ĐIỀU KHIỂN CHÍNH (CỐ ĐỊNH, KHÔNG WRAP, KÉO THẢ TẠI ĐÂY) -->
                <div id="omni-panel-header" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: nowrap; cursor: grab; user-select: none; min-height: 32px; width: 100%; box-sizing: border-box;">
                    <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden;">
                        <div id="omni-drag-handle" style="cursor: grab; padding: 2px 4px; color: #94a3b8; font-weight: bold; font-size: 14px; flex-shrink: 0;" title="Kéo thả vị trí thanh cầu nối">⋮⋮</div>
                        <div id="omni-status-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; transition: all 0.3s ease; flex-shrink: 0;"></div>
                        <div id="omni-status-text" style="font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0;" title="Trạng thái cầu nối">⚡ <b>[${SCRIPT_VERSION}] Omni Bridge</b></div>
                        <span id="omni-activity-chip" style="display: none; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 700; white-space: nowrap; flex-shrink: 0;"></span>
                    </div>
                <div id="omni-header-actions" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                    <button id="omni-btn-send-pe" style="padding: 4px 9px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: 600; font-size: 11px; cursor: pointer; transition: all 0.2s; white-space: nowrap;">🚀 Đổ vào PE (Alt+F9)</button>
                    <button id="omni-btn-fwd-an" style="padding: 4px 9px; border-radius: 6px; border: 1px solid #bae6fd; background: #f0f9ff; color: #0284c7; font-weight: 600; font-size: 11px; cursor: pointer; white-space: nowrap;">⚡ Chuyển sang AN (Alt+F10)</button>
                    <button id="omni-btn-pause" style="padding: 4px 8px; border-radius: 6px; border: 1px solid #fdba74; background: #fff7ed; color: #c2410c; font-weight: 600; font-size: 11px; cursor: pointer; white-space: nowrap;" title="Tạm dừng cầu nối để hỏi việc ngoài lề không bị chuyển sang AN">⏸️</button>
                    <div id="omni-hub-badge" style="padding: 3px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; white-space: nowrap; cursor: pointer;" title="Nhấp để kiểm tra kết nối Hub">Hub Offline</div>
                    <button id="omni-btn-minimize" style="padding: 2px 7px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #64748b; font-weight: bold; font-size: 12px; cursor: pointer; line-height: 1;" title="Thu gọn / Mở rộng bảng điều khiển">${isCollapsedInitial ? '▲' : '▼'}</button>
                </div>
            </div>

            <!-- PHẦN BODY: THU GỌN TOÀN BỘ KHI MINIMIZE -->
            <div id="omni-panel-body" style="display: ${isCollapsedInitial ? 'none' : 'flex'}; flex-direction: column; gap: 6px;">
                <!-- DÒNG PHỤ: CÔNG CỤ & TUỲ CHỌN -->
                <div id="omni-main-row" style="display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-top: 4px; border-top: 1px solid #f1f5f9; font-size: 11px; flex-wrap: nowrap;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <button id="omni-btn-toggle-viewer" style="padding: 3px 8px; border-radius: 5px; border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; font-weight: 600; font-size: 11px; cursor: pointer;" title="Mở / Thu gọn khung xem trước nội dung trao đổi">👁️ Xem tin ▾</button>
                        <button id="omni-btn-toggle-quick" style="padding: 3px 8px; border-radius: 5px; border: 1px solid #cbd5e1; background: #f8fafc; color: #b45309; font-weight: 600; font-size: 11px; cursor: pointer;" title="Mở rộng / Thu gọn cụm thao tác nhanh">⚡ Mở rộng ▾</button>
                        <button id="omni-btn-toggle-test" style="padding: 3px 8px; border-radius: 5px; border: 1px solid #bae6fd; background: #f0f9ff; color: #0284c7; font-weight: 700; font-size: 11px; cursor: pointer;" title="Mở / Thu gọn khung kiểm thử thủ công hai đầu">🧪 Test Hai Đầu ▾</button>
                        <div id="omni-auto-modes" style="display: flex; align-items: center; gap: 4px; padding: 1px 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #cbd5e1;">
                            <span style="font-size: 10px; font-weight: 700; color: #475569;">⚡ Tự động:</span>
                            <label style="display: flex; align-items: center; gap: 2px; font-size: 11px; cursor: pointer; color: #047857; font-weight: 600;" title="Tự động đổ báo cáo và tự động bấm gửi sang PE với độ trễ ngẫu nhiên từ 1 đến 4 giây (không chờ cố định)">
                                <input type="checkbox" id="omni-cb-auto-submit" style="cursor: pointer;"> Đổ & Submit (1-4s)
                            </label>
                            <label style="display: flex; align-items: center; gap: 2px; font-size: 11px; cursor: pointer; color: #b45309; font-weight: 600;" title="Chỉ tự động dán báo cáo vào ô chat, Minh Chủ tự bấm gửi thủ công">
                                <input type="checkbox" id="omni-cb-auto-fill" style="cursor: pointer;"> Chỉ dán chatbox
                            </label>
                        </div>
                        <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer; color: #0369a1; font-weight: 600;" title="Chuyển sang tiếng Việt không dấu (Alt+F8) triệt tiêu lỗi KaTeX">
                            <input type="checkbox" id="omni-cb-no-accents" style="cursor: pointer;"> Không dấu
                        </label>
                    </div>
                    <div id="omni-source-badge" style="padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; white-space: nowrap; cursor: pointer;" title="Nhấn để tải lại tin nhắn từ Supabase (Alt+F5)">Nguồn: SSE 🔄</div>
                </div>

                <!-- DÒNG THÔNG BÁO BÁO CÁO MỚI (LOUD NOTIFICATION BANNER) -->
                <div id="omni-report-banner" style="display: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; width: 100%; box-sizing: border-box; align-items: center; justify-content: space-between;"></div>

                <!-- DÒNG 2: KHUNG XEM TRƯỚC NỘI DUNG TRAO ĐỔI (COLLAPSIBLE VIEWER) -->
                <div id="omni-bridge-viewer" style="display: none; flex-direction: column; gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; width: 100%; box-sizing: border-box;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #475569; font-weight: 600;">
                        <span>💬 SSOT Message Feed (Dữ liệu thực từ Supabase):</span>
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <button id="omni-btn-refresh-feed" style="padding: 2px 7px; border-radius: 4px; border: 1px solid #0284c7; background: #f0f9ff; color: #0284c7; font-size: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 3px;" title="Tải lại tin nhắn mới nhất trực tiếp từ Supabase (Alt+F5)">🔄 Làm mới</button>
                            <button id="omni-btn-expand-preview" style="padding: 2px 7px; border-radius: 4px; border: 1px solid #cbd5e1; background: #ffffff; color: #0284c7; font-size: 10px; font-weight: 600; cursor: pointer;" title="Mở rộng khung xem tin để đọc toàn bộ">🔍 Phóng to</button>
                            <button id="omni-btn-copy-preview" style="padding: 2px 7px; border-radius: 4px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-size: 10px; font-weight: 600; cursor: pointer;">📋 Sao chép</button>
                        </div>
                    </div>
                    <!-- Metadata Feed Bar: Sender | JST Time | Thread | Row ID -->
                    <div id="omni-feed-meta" style="display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; padding: 4px 8px; background: #f1f5f9; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span id="omni-feed-sender-badge" style="padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;">AN</span>
                            <span id="omni-feed-time" style="color: #475569; font-family: Consolas, monospace; font-size: 10px;">--:--:-- JST</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span id="omni-feed-thread" style="color: #0369a1; font-weight: 600; font-size: 10px;">${lastThreadId}</span>
                            <span id="omni-feed-id" style="color: #64748b; font-family: Consolas, monospace; font-size: 10px;" title="ID bản ghi SSOT">ID: --</span>
                        </div>
                    </div>
                    <pre id="omni-preview-content" style="max-height: 120px; overflow-y: auto; background: #0f172a; color: #f8fafc; font-family: Consolas, monospace; font-size: 11px; padding: 8px 10px; border-radius: 6px; margin: 4px 0 0 0; white-space: pre-wrap; word-break: break-word; transition: max-height 0.2s ease;">${latestMessagePreview}</pre>

                    <!-- Khung SSOT và Audit Trace có nút ẩn/hiện chi tiết riêng -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 4px; border-top: 1px dashed #cbd5e1;">
                        <button id="omni-btn-toggle-audit-details" style="padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1; background: #ffffff; color: #64748b; font-size: 10px; font-weight: 600; cursor: pointer;">⚙️ Chi tiết kỹ thuật & Audit Trace ▾</button>
                    </div>
                    <div id="omni-audit-details-container" style="display: none; flex-direction: column; gap: 4px; margin-top: 4px;">
                        <div id="omni-rehydration-info" style="padding: 6px 8px; background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; font-family: Consolas, monospace; font-size: 10px; color: #38bdf8;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>🏛️ <b>Turn (SSOT):</b> <span id="omni-ssot-turn" style="color: #4ade80; font-weight: 700;">IDLE</span> (<span id="omni-ssot-actor" style="color: #f59e0b; font-weight: 700;">NONE</span>)</span>
                                <span>🚚 <b>Delivery:</b> <span id="omni-ssot-delivery" style="color: #38bdf8;">IDLE</span></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px;">
                                <span>⏱️ <b>Activity:</b> <span id="omni-ssot-activity" style="color: #a78bfa;">IDLE</span></span>
                                <span>📡 <b>Transport:</b> <span id="omni-ssot-transport" style="color: #94a3b8;">IDLE</span></span>
                            </div>
                            <div style="color: #94a3b8; margin-top: 4px; border-top: 1px dashed #334155; padding-top: 3px;">
                                ID: <span id="omni-ssot-id" style="color: #e2e8f0;">N/A</span> • Sender: <span id="omni-ssot-sender" style="color: #f59e0b; font-weight: 700;">N/A</span> • Time: <span id="omni-ssot-time" style="color: #e2e8f0;">N/A</span> • Src: <span id="omni-ssot-source" style="color: #38bdf8;">INITIAL</span>
                            </div>
                            <div id="omni-correlation-info" style="margin-top: 4px; border-top: 1px dashed #334155; padding-top: 4px; font-size: 10px; color: #94a3b8;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>📋 <b>Report:</b> <span id="omni-corr-report-id" style="color: #38bdf8;">N/A</span></span>
                                    <span>👤 <b>Handled By:</b> <span id="omni-corr-handled-by" style="color: #4ade80;">chưa xử lý</span></span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                                    <span>⏱️ <b>Handled At:</b> <span id="omni-corr-handled-at" style="color: #facc15;">chưa xử lý</span></span>
                                    <span>🔗 <b>In-Reply-To:</b> <span id="omni-corr-in-reply-to" style="color: #a78bfa;">N/A</span></span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 4px; font-weight: 700; font-size: 10px; color: #475569;">
                            <span>📊 Lịch sử vòng đời & Audit Trace:</span>
                        </div>
                        <div id="omni-audit-trace" style="max-height: 80px; overflow-y: auto; background: #0f172a; color: #94a3b8; font-family: Consolas, monospace; font-size: 10px; padding: 6px 8px; border-radius: 6px; margin-top: 2px;">(Chưa có sự kiện nào)</div>
                    </div>
                </div>

                <!-- DÒNG 3: CỤM NÚT ĐIỀN NHANH THỦ CÔNG (MANUAL FALLBACK ACTIONS) -->
                <div id="omni-quick-row" style="display: none; align-items: center; gap: 8px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 6px 10px; width: 100%; box-sizing: border-box; flex-wrap: wrap;">
                    <span style="font-size: 11px; font-weight: 700; color: #b45309;">🛠️ Thao tác nhanh:</span>
                    <button id="omni-btn-check-diag" style="padding: 4px 8px; border-radius: 5px; border: 1px solid #93c5fd; background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; cursor: pointer;" title="Kiểm tra kết nối tới Hub và phiên bản">🔍 Kiểm Tra Kết Nối</button>
                    <button id="omni-btn-quick-pe" style="padding: 4px 8px; border-radius: 5px; border: 1px solid #fde68a; background: #ffffff; color: #92400e; font-size: 11px; font-weight: 600; cursor: pointer;" title="Điền lệnh PE kiểm tra báo cáo và duyệt">📋 PE Đọc & Duyệt</button>
                    <button id="omni-btn-quick-an" style="padding: 4px 8px; border-radius: 5px; border: 1px solid #fde68a; background: #ffffff; color: #92400e; font-size: 11px; font-weight: 600; cursor: pointer;" title="Bắn lệnh nhắc nhở AN thi công và nộp báo cáo">⚙️ AN Nhận & Thi Công</button>
                    <button id="omni-btn-test-an" style="padding: 4px 8px; border-radius: 5px; border: 1px solid #a7f3d0; background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 700; cursor: pointer;" title="Gửi payload test thực sang AN để kiểm tra chuỗi Acknowledgment (BRIDGE-STATUS-LOGIC-AUDIT-001)">🧪 Gửi Test Sang AN</button>
                    <button id="omni-btn-quick-ping" style="padding: 4px 8px; border-radius: 5px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-size: 11px; font-weight: 600; cursor: pointer;" title="Điền 'PE đọc Bridge.'">🔔 Ping Cầu Nối</button>
                </div>

                <!-- DÒNG 4: KHUNG KIỂM THỬ THỦ CÔNG HAI ĐẦU (MANUAL TEST SLICE) -->
                <div id="omni-test-box" style="display: ${isTestBoxOpenInitial ? 'block' : 'none'}; margin-top: 4px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; width: 100%; box-sizing: border-box;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #0f172a;">🧪 Kiểm Thử Thủ Công Hai Đầu (PE & AN):</span>
                        <span id="omni-test-chip" style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #e2e8f0; color: #475569;">Sẵn sàng</span>
                    </div>
                    <textarea id="omni-test-input" rows="2" placeholder="Nhập nội dung test gửi tự do cho PE hoặc AN..." style="width: 100%; box-sizing: border-box; font-size: 11px; font-family: inherit; padding: 6px; border: 1px solid #cbd5e1; border-radius: 5px; resize: vertical; margin-bottom: 6px;"></textarea>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 170px;">
                            <button id="omni-btn-test-send-pe" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid #38bdf8; background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; cursor: pointer;" title="Chuyển tới Userscript và điền vào ô chat PE">📤 Gửi cho PE</button>
                            <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer; color: #0284c7; font-weight: 600; white-space: nowrap;" title="Tự động bấm nút Submit sau khi điền (Chặng 3)">
                                <input type="checkbox" id="omni-test-pe-auto" checked style="cursor: pointer;"> Tự gửi
                            </label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 220px;">
                            <button id="omni-btn-test-send-an" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid #34d399; background: #059669; color: #ffffff; font-size: 11px; font-weight: 700; cursor: pointer;" title="Ghi vào Inbox hiện có, phát âm báo và sẵn sàng dán vào Antigravity">📥 Gửi cho AN</button>
                            <input type="text" id="omni-test-thread" value="${lastThreadId || 'OMNI-CYCLE-001'}" placeholder="Thread ID" style="width: 125px; font-size: 10px; padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; color: #334155;" title="Thread ID cho payload AN (Hỗ trợ đa dự án: OMNI, YSDMS...)">
                        </div>
                    </div>
                    <!-- TIẾN TRÌNH 3 CHẶNG CỦA MÃ TEST -->
                    <div id="omni-test-stage-box" style="display: none; background: #0f172a; border-radius: 6px; padding: 6px 8px; font-family: Consolas, monospace; font-size: 10px; color: #e2e8f0;">
                        <div id="omni-test-id-line" style="color: #38bdf8; font-weight: bold; margin-bottom: 3px;">Mã Test: -</div>
                        <div id="omni-test-stage1" style="color: #94a3b8;">1. Đã tới Hub: ⚪</div>
                        <div id="omni-test-stage2" style="color: #94a3b8;">2. Đã điền / Đã ghi Inbox: ⚪</div>
                        <div id="omni-test-stage3" style="color: #94a3b8;">3. Đã gửi trong chat / AN ACK: ⚪</div>
                        <div id="omni-test-notice" style="color: #fbbf24; margin-top: 4px; font-style: italic; display: none;"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Kéo thả Draggable linh hoạt toàn bộ Header bar
        const header = document.getElementById("omni-panel-header");
        const handle = document.getElementById("omni-drag-handle");
        let isDragging = false, startX, startY, initLeft, initTop;

        const onDragStart = (e) => {
            if (e.target.closest("button") || e.target.closest("input") || e.target.closest("textarea")) return;
            isDragging = true;
            if (header) header.style.cursor = "grabbing";
            if (handle) handle.style.cursor = "grabbing";
            const rect = panel.getBoundingClientRect();
            initLeft = rect.left;
            initTop = rect.top;
            panel.style.transform = "none";
            panel.style.left = `${initLeft}px`;
            panel.style.top = `${initTop}px`;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        };

        if (header) header.addEventListener("mousedown", onDragStart);
        if (handle) handle.addEventListener("mousedown", onDragStart);

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let newLeft = initLeft + (e.clientX - startX);
            let newTop = initTop + (e.clientY - startY);
            const maxLeft = Math.max(10, window.innerWidth - panel.offsetWidth - 10);
            const maxTop = Math.max(10, window.innerHeight - 40);
            newLeft = Math.max(10, Math.min(maxLeft, newLeft));
            newTop = Math.max(10, Math.min(maxTop, newTop));
            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;
        });

        window.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                if (header) header.style.cursor = "grab";
                if (handle) handle.style.cursor = "grab";
                localStorage.setItem("omni_bridge_pos_left", panel.style.left);
                localStorage.setItem("omni_bridge_pos_top", panel.style.top);
            }
        });

        // Bắt sự kiện người dùng submit thủ công câu hỏi vào Perplexity (Enter hoặc Click nút gửi)
        // Nhằm ghi nhận ngay trạng thái ĐÃ GỬI và ngăn chặn đổ lặp khi ô chat bị xóa
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const inputEl = findPerplexityInput();
                if (inputEl && (e.target === inputEl || inputEl.contains(e.target))) {
                    const val = (inputEl.value || inputEl.textContent || '').trim();
                    if (val.length > 0) {
                        onUserSubmittedToPerplexity();
                    }
                }
            }
        }, true);

        document.addEventListener("click", (e) => {
            const btn = e.target.closest('button');
            if (btn && !btn.closest('#omni-bridge-panel') && !btn.closest('#omni-bridge-toast')) {
                const submitBtn = findPerplexitySubmitButton();
                if (btn === submitBtn || btn.contains(submitBtn) || submitBtn?.contains(btn)) {
                    const inputEl = findPerplexityInput();
                    const val = inputEl ? (inputEl.value || inputEl.textContent || '').trim() : '';
                    if (val.length > 0) {
                        onUserSubmittedToPerplexity();
                    }
                }
            }
        }, true);

        // Helper gắn sự kiện an toàn tuyệt đối chống null
        const safeBind = (id, handler, event = 'onclick') => {
            const el = document.getElementById(id);
            if (el) el[event] = handler;
        };

        // Nút bấm chính & công cụ
        safeBind("omni-btn-send-pe", () => executeFillAndSubmit(true));
        safeBind("omni-btn-fwd-an", () => forwardPeResponseToAn(true));
        safeBind("omni-btn-pause", () => togglePause());
        safeBind("omni-btn-minimize", () => toggleMinimize());
        safeBind("omni-btn-toggle-viewer", () => toggleViewer());
        safeBind("omni-btn-toggle-quick", () => toggleQuickRow());
        safeBind("omni-btn-toggle-test", () => toggleTestBox());
        safeBind("omni-btn-copy-preview", () => copyPreviewContent());

        async function runConnectionDiagnostic() {
            showToast("🔍 Đang kiểm tra kết nối tới Hub...", "info");
            try {
                const status = await hubRequest(`http://127.0.0.1:${activeHubPort}/api/status`, { timeout: 2000 });
                const sseOk = sseSource && sseSource.readyState === EventSource.OPEN;
                const msg = `✅ KẾT NỐI THÀNH CÔNG!\n\n`
                    + `• Userscript: ${SCRIPT_VERSION}\n`
                    + `• Hub: ${status.hub || 'Online'} (Cổng ${activeHubPort})\n`
                    + `• Bảng SSOT: ${status.table || 'public.pe_bridge'}\n`
                    + `• Supabase: ${status.supabaseUrl || 'OK'}\n`
                    + `• Transport: ${sseOk ? 'SSE (Realtime)' : 'Poll (3s Inbound Fallback)'}\n`
                    + `• Thread hiện tại: ${lastThreadId}\n`
                    + `• Hàng đợi ACK: Sẵn sàng`;
                alert(msg);
                isHubConnected = true;
                updateHubStatusBadge(true, sseOk ? 'SSE' : 'POLL');
            } catch (e) {
                alert(`❌ KHÔNG THỂ KẾT NỐI TỚI HUB Ở CỔNG ${activeHubPort}!\n\nLỗi: ${e.message}\n\nHãy đảm bảo file 'start_bridge_hub.bat' đang mở trên máy tính.`);
                isHubConnected = false;
                updateHubStatusBadge(false);
            }
        }

        // Nút cụm thao tác nhanh thủ công
        safeBind("omni-btn-check-diag", () => runConnectionDiagnostic());
        safeBind("omni-hub-badge", () => runConnectionDiagnostic());
        safeBind("omni-btn-quick-pe", () => executeFillAndSubmit(true, CONFIG.QUICK_PINGS.PE_REVIEW));
        safeBind("omni-btn-quick-an", () => triggerAnManualPing());
        safeBind("omni-btn-test-an", () => sendTestDirectiveToAn());
        safeBind("omni-btn-quick-ping", () => executeFillAndSubmit(true, CONFIG.QUICK_PINGS.PING_BRIDGE));

        // Nút kiểm thử thủ công hai đầu (Manual Test Slice)
        safeBind("omni-btn-test-send-pe", () => handleManualTestSendPe());
        safeBind("omni-btn-test-send-an", () => handleManualTestSendAn());

        // Khôi phục tùy chọn tự động gửi cho PE test
        const cbTestAuto = document.getElementById("omni-test-pe-auto");
        if (cbTestAuto) {
            const savedTestAuto = localStorage.getItem("omni_test_pe_auto");
            if (savedTestAuto !== null) cbTestAuto.checked = savedTestAuto === "true";
            cbTestAuto.onchange = () => localStorage.setItem("omni_test_pe_auto", cbTestAuto.checked ? "true" : "false");
        }

        // Khôi phục Thread ID kiểm thử
        const inputTestThread = document.getElementById("omni-test-thread");
        if (inputTestThread) {
            inputTestThread.onchange = () => {
                const val = inputTestThread.value.trim();
                if (val) {
                    lastThreadId = val;
                    localStorage.setItem("omni_bridge_thread_id", val);
                }
            };
        }

        // Nút làm mới tin nhắn từ Supabase
        safeBind("omni-btn-refresh-feed", () => manualRefreshFromSupabase());
        safeBind("omni-source-badge", () => {
            toggleViewer(true);
            manualRefreshFromSupabase();
        });

        // Nút mở rộng xem tin và thu gọn chi tiết kỹ thuật
        safeBind("omni-btn-expand-preview", () => togglePreviewExpand());
        safeBind("omni-btn-toggle-audit-details", () => toggleAuditDetails());

        // Khôi phục feed từ bộ nhớ đệm trước khi mạng đồng bộ xong
        try {
            const cachedFeedStr = localStorage.getItem("omni_bridge_latest_feed");
            if (cachedFeedStr) {
                const cachedFeed = JSON.parse(cachedFeedStr);
                updatePreviewFeed(cachedFeed, "LOCAL_CACHE");
            }
        } catch {}

        // Mặc định luôn thu gọn các khung mở rộng (test, quick row) để thanh công cụ luôn tinh gọn
        // Chỉ mở viewer nếu người dùng đã chủ động mở từ trước
        if (localStorage.getItem("omni_bridge_viewer_open") === "true") toggleViewer(true);
        if (localStorage.getItem("omni_bridge_minimized") === "true") toggleMinimize(true);

        // Khôi phục tùy chọn Auto (2 chế độ: Đổ & Submit hoặc Chỉ dán chatbox)
        const cbAutoSubmit = document.getElementById("omni-cb-auto-submit");
        const cbAutoFill = document.getElementById("omni-cb-auto-fill");
        const currentMode = getAutoMode();

        if (cbAutoSubmit) cbAutoSubmit.checked = (currentMode === "SUBMIT");
        if (cbAutoFill) cbAutoFill.checked = (currentMode === "FILL_ONLY");

        if (cbAutoSubmit) {
            cbAutoSubmit.onchange = () => {
                if (cbAutoSubmit.checked) {
                    if (cbAutoFill) cbAutoFill.checked = false;
                    localStorage.setItem("omni_bridge_auto_mode", "SUBMIT");
                    localStorage.setItem("omni_bridge_auto_enabled", "true");
                    showToast("⚡ Chế độ Tự động: [ĐỔ & SUBMIT (Random 1-4s)] đã BẬT!", "success");
                    renderTurnUI();
                } else {
                    localStorage.setItem("omni_bridge_auto_mode", "OFF");
                    localStorage.setItem("omni_bridge_auto_enabled", "false");
                    if (autoSubmitInterval) {
                        clearInterval(autoSubmitInterval);
                        autoSubmitInterval = null;
                    }
                    showToast("⚪ Đã TẮT chế độ tự động.", "info");
                    renderTurnUI();
                }
            };
        }

        if (cbAutoFill) {
            cbAutoFill.onchange = () => {
                if (cbAutoFill.checked) {
                    if (cbAutoSubmit) cbAutoSubmit.checked = false;
                    localStorage.setItem("omni_bridge_auto_mode", "FILL_ONLY");
                    localStorage.setItem("omni_bridge_auto_enabled", "true");
                    showToast("📝 Chế độ Tự động: [CHỈ DÁN CHATBOX] đã BẬT!", "info");
                    // Ngay lập tức dán báo cáo vào ô chat trước mắt Minh Chủ!
                    executeFillAndSubmit(true, null, false);
                } else {
                    localStorage.setItem("omni_bridge_auto_mode", "OFF");
                    localStorage.setItem("omni_bridge_auto_enabled", "false");
                    showToast("⚪ Đã TẮT chế độ tự động.", "info");
                }
                renderTurnUI();
            };
        }

        // Khôi phục tùy chọn Không dấu (Mặc định là true theo chỉ thị của Minh Chủ)
        const cbNoAccents = document.getElementById("omni-cb-no-accents");
        const savedNoAccents = localStorage.getItem("omni_bridge_no_accents");
        if (cbNoAccents) {
            cbNoAccents.checked = savedNoAccents !== null ? savedNoAccents === "true" : true;
            cbNoAccents.onchange = () => {
                localStorage.setItem("omni_bridge_no_accents", cbNoAccents.checked ? "true" : "false");
                showToast(`Chế độ không dấu: ${cbNoAccents.checked ? "BẬT" : "TẮT"}`, "info");
            };
        }

        // Nếu đang ở trạng thái paused từ phiên trước
        if (isBridgePaused) {
            const btnPause = document.getElementById("omni-btn-pause");
            if (btnPause) {
                btnPause.innerHTML = "▶️ Tiếp tục (Alt+P)";
                btnPause.style.background = "#fed7aa";
                btnPause.style.color = "#9a3412";
                btnPause.style.borderColor = "#ea580c";
            }
        }

        // Khởi tạo trạng thái giao diện và tự động kích hoạt đếm ngược nếu Auto đang bật
        renderTurnUI();
        } catch (err) {
            console.error("[OmniBridge] ❌ Lỗi dựng thanh điều khiển:", err);
        }
    }

    function resetPanelPosition() {
        const panel = document.getElementById("omni-bridge-panel");
        if (panel) {
            panel.style.top = "14px";
            panel.style.left = "calc(50% - 370px)";
            localStorage.setItem("omni_bridge_pos_top", "14px");
            localStorage.setItem("omni_bridge_pos_left", "calc(50% - 370px)");
            showToast("📍 Đã đặt lại vị trí thanh công cụ về giữa trên!", "info");
        }
    }

    // ==========================================
    // 8. LẮNG NGHE PHÍM TẮT TOÀN CỤC (ALT+0, ALT+F5, ALT+F8, ALT+F9, ALT+F10)
    // ==========================================
    window.addEventListener("keydown", (e) => {
        if (e.altKey && (e.key === "0" || e.code === "Digit0")) {
            e.preventDefault();
            console.log("[Omni Bridge] ⚡ Phím tắt Alt+0 -> Đặt lại vị trí bảng điều khiển!");
            resetPanelPosition();
        } else if (e.altKey && (e.key === "p" || e.key === "P" || e.code === "KeyP")) {
            e.preventDefault();
            console.log("[Omni Bridge] ⚡ Phím tắt Alt+P -> Tạm dừng / Tiếp tục cầu nối!");
            togglePause();
        } else 
        if (e.altKey && (e.key === "F8" || e.code === "F8")) {
            e.preventDefault();
            const cb = document.getElementById("omni-cb-no-accents");
            if (cb) {
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change'));
            }
        } else if (e.altKey && (e.key === "F9" || e.code === "F9")) {
            e.preventDefault();
            console.log("[Omni Bridge] ⚡ Phím tắt Alt+F9 -> Kích hoạt Đổ vào PE!");
            executeFillAndSubmit(true);
        } else if (e.altKey && (e.key === "F5" || e.code === "F5")) {
            e.preventDefault();
            console.log("[Omni Bridge] ⚡ Phím tắt Alt+F5 -> Làm mới tin nhắn từ Supabase!");
            manualRefreshFromSupabase();
        } else if (e.altKey && (e.key === "F10" || e.code === "F10")) {
            e.preventDefault();
            console.log("[Omni Bridge] ⚡ Phím tắt Alt+F10 -> Kích hoạt Chuyển sang AN!");
            forwardPeResponseToAn(true);
        }
    });

    // ==========================================
    // 9. KHỞI TẠO VÀ CHU KỲ QUAN SÁT
    // ==========================================
    async function init() {
        console.log("=================================================");
        console.log("  OMNILINGUIST REALTIME BRIDGE v1.0 INITIALIZED  ");
        console.log("=================================================");
        createControlBar();

        // Ghi nhận baseline hash của câu trả lời PE cũ đang có trên trang lúc khởi tạo
        const initialPe = getLatestPeResponse();
        if (initialPe && initialPe.text) {
            baselinePeTextHash = hashString(initialPe.text);
        }

        // BƯỚC 0: Tìm cổng Hub đang chạy (trong trường hợp cổng bị kẹt và tự động nhảy lên 3957, 3958...)
        await autoDiscoverHub();

        // BƯỚC 1: Khôi phục trạng thái SSOT từ Supabase trước tiên (BRIDGE-STATUS-REHYDRATION-001)
        await rehydrateStateFromSupabase();

        // BƯỚC 2: Sau snapshot SSOT mới kết nối SSE Hub
        connectSseHub();

        // BƯỚC 3: Loop Polling Fallback mỗi 3s (Inbound fallback khi SSE ngắt kết nối)
        setInterval(pollSnapshotLoop, CONFIG.POLL_INTERVAL_MS);

        // BƯỚC 4: Loop giám sát stream mỗi 800ms (được bảo vệ chặt chẽ bởi isPeRequestInFlight theo Rule 5)
        setInterval(monitorStreamingLoop, 800);

        // Loop đảm bảo thanh điều khiển luôn hiện diện nếu DOM bị SPA React render đè
        setInterval(() => {
            if (!document.getElementById("omni-bridge-panel")) {
                createControlBar();
            }
        }, 2000);
    }

    function startBridge() {
        try {
            init();
        } catch (e) {
            console.error("[OmniBridge] Lỗi init:", e);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startBridge);
    } else {
        startBridge();
    }
    window.addEventListener("load", () => {
        if (!document.getElementById("omni-bridge-panel")) {
            startBridge();
        }
    });
})();
