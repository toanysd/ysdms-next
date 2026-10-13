// ==UserScript==
// @name         [v2.4.0] YSDMS NextGen Realtime Bridge: PE-AN Dual-Path Hub
// @namespace    https://ysdms.nextgen.local/
// @version      2.4.0
// @description  Cầu nối thời gian thực hai chiều PE - THOAN - AN tinh giản (v2.4.0 Dual-Path Architecture). Xóa bỏ 100% logic cào DOM ngầm, chiều PE->AN sử dụng Supabase Connector làm luồng chính kết hợp 1 nút cứu hộ thủ công Alt+F10, chiều AN->PE tự động nhận báo cáo qua SSE và đổ vào ô chat Perplexity.
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

    const SCRIPT_VERSION = "v2.4.0";
    console.log(`%c[${SCRIPT_VERSION} YSDMS Bridge Dual-Path] >>> SCRIPT ĐÃ ĐƯỢC NẠP VÀO TRANG <<<`, "background: #0284c7; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;");

    // ==========================================
    // 1. CẤU HÌNH & TRẠNG THÁI CẦU NỐI
    // ==========================================
    const CONFIG = {
        DEFAULT_PORT: 3856,
        CANDIDATE_PORTS: [3856, 3857, 3858, 3859, 3860],
        DEFAULT_THREAD_ID: localStorage.getItem("ysdms_bridge_thread_id") || "BRIDGE-ORCHESTRATION",
        STORAGE_KEY_PASTE_ONLY: "ysdms_bridge_paste_only",
        STORAGE_KEY_LAST_REPORT_ID: "ysdms_bridge_last_report_id"
    };

    let activeHubPort = CONFIG.DEFAULT_PORT;
    let sseEventSource = null;
    let isHubConnected = false;
    let currentTurnState = "PE_TURN"; // "PE_TURN" | "AN_TURN"
    let lastHandledReportId = localStorage.getItem(CONFIG.STORAGE_KEY_LAST_REPORT_ID) || null;
    let isOnlyPasteMode = localStorage.getItem(CONFIG.STORAGE_KEY_PASTE_ONLY) !== "false"; // Mặc định TRUE: Chỉ dán chatbox

    // ==========================================
    // 2. CHUÔNG ÂM THANH & TOAST THÔNG BÁO
    // ==========================================
    function playChime(type = "info") {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === "success") {
                osc.frequency.setValueAtTime(523.25, now);       // C5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === "warn") {
                osc.frequency.setValueAtTime(440, now);          // A4
                osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.15); // F4
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else {
                osc.frequency.setValueAtTime(587.33, now);       // D5
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {
            console.warn("[Bridge Audio] Không thể phát âm thanh:", e);
        }
    }

    function showToast(message, type = "info") {
        let container = document.getElementById("ysdms-bridge-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "ysdms-bridge-toast-container";
            container.style.cssText = "position: fixed; bottom: 80px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        const bg = type === "success" ? "#059669" : type === "warn" ? "#d97706" : type === "error" ? "#dc2626" : "#0284c7";
        toast.style.cssText = `background: ${bg}; color: #ffffff; padding: 10px 16px; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.25); opacity: 0; transform: translateY(10px); transition: all 0.25s ease; max-width: 380px; word-break: break-word; pointer-events: auto;`;
        toast.textContent = message;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ==========================================
    // 3. REACT INPUT INJECTOR (CHIỀU AN -> PE)
    // ==========================================
    function findPerplexityInput() {
        // 1. Textarea chính trong form/main
        const textareas = Array.from(document.querySelectorAll('textarea'));
        const validTextarea = textareas.find(ta => {
            if (ta.closest('#ysdms-bridge-panel')) return false;
            return ta.offsetParent !== null && !ta.disabled;
        });
        if (validTextarea) return { type: 'textarea', element: validTextarea };

        // 2. Div contenteditable (Lexical editor)
        const editables = Array.from(document.querySelectorAll('div[contenteditable="true"]'));
        const validEditable = editables.find(ed => {
            if (ed.closest('#ysdms-bridge-panel')) return false;
            return ed.offsetParent !== null;
        });
        if (validEditable) return { type: 'contenteditable', element: validEditable };

        return null;
    }

    function injectTextToPerplexity(text) {
        if (!text) return false;
        const target = findPerplexityInput();
        if (!target) {
            console.warn("[Bridge Inject] Không tìm thấy ô nhập liệu trên trang Perplexity.");
            return false;
        }

        const el = target.element;
        el.focus();

        if (target.type === 'textarea') {
            // Sử dụng Native Prototype Setter để kích hoạt React state
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
            if (nativeSetter) {
                nativeSetter.call(el, text);
            } else {
                el.value = text;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'End' }));
        } else {
            // ContentEditable: chọn toàn bộ và thay thế bằng execCommand
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        console.log(`[Bridge Inject] Đã đổ thành công ${text.length} ký tự vào ô chat.`);
        return true;
    }

    // ==========================================
    // 4. HÀNH ĐỘNG MINH CHỦ & CỨU HỘ THỦ CÔNG
    // ==========================================
    // 4.1. Minh Chủ nộp báo cáo cho PE (Alt+F9)
    function handleMinhChuSubmit() {
        const target = findPerplexityInput();
        if (!target) {
            showToast("⚠️ Không tìm thấy ô chat Perplexity để submit!", "warn");
            return;
        }

        // Tìm nút Submit / Arrow trên form
        const form = target.element.closest('form') || target.element.parentElement;
        const buttons = form ? Array.from(form.querySelectorAll('button')) : Array.from(document.querySelectorAll('button'));
        const submitBtn = buttons.find(b => {
            if (b.closest('#ysdms-bridge-panel')) return false;
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            return (aria.includes('submit') || aria.includes('send') || aria.includes('ask') || b.querySelector('svg[data-icon="arrow-right"]')) && !b.disabled;
        });

        if (submitBtn) {
            submitBtn.click();
            playChime("success");
            showToast("🚀 Minh Chủ đã phát lệnh gửi báo cáo cho PE!", "success");
        } else {
            // Fallback gửi phím Enter
            target.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            showToast("🚀 Đã phát sự kiện Enter vào ô chat!", "info");
        }
    }

    // 4.2. Nút Cứu Hộ Thủ Công duy nhất gửi chỉ thị sang AN (Alt+F10)
    function handleManualRescueForward() {
        // 1. Kiểm tra văn bản người dùng đang bôi đen (selection)
        let textToSend = window.getSelection()?.toString()?.trim() || "";

        // 2. Nếu không bôi đen, lấy khối câu trả lời cuối cùng của PE trên trang
        if (!textToSend || textToSend.length < 20) {
            const proseBlocks = Array.from(document.querySelectorAll('div.prose, [data-message-author-role="assistant"], div[dir="auto"]'))
                .filter(el => !el.closest('#ysdms-bridge-panel') && !el.closest('button') && (el.innerText || '').trim().length >= 40);
            if (proseBlocks.length > 0) {
                textToSend = (proseBlocks[proseBlocks.length - 1].innerText || '').trim();
            }
        }

        if (!textToSend || textToSend.length < 20) {
            showToast("⚠️ Không tìm thấy nội dung chỉ thị từ PE để cứu hộ! Hãy bôi đen văn bản cần gửi.", "warn");
            playChime("warn");
            return;
        }

        showToast("⚡ Đang gửi chỉ thị cứu hộ sang Supabase qua Hub...", "info");
        const payload = {
            directive: textToSend,
            threadId: CONFIG.DEFAULT_THREAD_ID,
            source: "MANUAL_RESCUE_BUTTON"
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: `http://127.0.0.1:${activeHubPort}/api/directive`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            onload: function(res) {
                if (res.status >= 200 && res.status < 300) {
                    playChime("success");
                    showToast("✅ Đã chuyển thành công chỉ thị cứu hộ sang cho AN!", "success");
                    setTurnState("AN_TURN");
                } else {
                    playChime("warn");
                    showToast(`❌ Gửi cứu hộ thất bại: HTTP ${res.status}`, "error");
                }
            },
            onerror: function(err) {
                playChime("warn");
                showToast("❌ Không thể kết nối tới Hub cục bộ!", "error");
            }
        });
    }

    // ==========================================
    // 5. SSE CLIENT & ĐỒNG BỘ TRẠNG THÁI LƯỢT
    // ==========================================
    function setTurnState(newState) {
        currentTurnState = newState;
        updateUI();
    }

    function initSSEConnection() {
        if (sseEventSource) {
            sseEventSource.close();
            sseEventSource = null;
        }

        const sseUrl = `http://127.0.0.1:${activeHubPort}/api/events`;
        console.log(`[Bridge SSE] Đang kết nối tới ${sseUrl}...`);

        try {
            sseEventSource = new EventSource(sseUrl);

            sseEventSource.onopen = function() {
                isHubConnected = true;
                console.log(`[Bridge SSE] Đã kết nối thành công tới Hub cổng ${activeHubPort}.`);
                updateUI();
                syncLatestTurn();
            };

            sseEventSource.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    handleSSEEvent(data);
                } catch (e) {
                    console.warn("[Bridge SSE] Lỗi parse JSON sự kiện:", e);
                }
            };

            sseEventSource.onerror = function() {
                isHubConnected = false;
                updateUI();
                // Thử kết nối lại sau 4 giây
                setTimeout(() => {
                    if (!isHubConnected) initSSEConnection();
                }, 4000);
            };
        } catch (err) {
            isHubConnected = false;
            updateUI();
        }
    }

    function handleSSEEvent(eventData) {
        console.log("[Bridge SSE] Nhận sự kiện từ Hub:", eventData);
        const type = eventData.event || eventData.type;

        if (type === "AN_REPORT_DISPATCHED" || type === "AN_REPORT_READY" || type === "AN_REPORT_PERSISTED") {
            const report = eventData.data || eventData.report || eventData;
            const reportId = report.id || report.message_id || report.reportId;
            const content = report.content_md || report.content || report.text;

            if (reportId && reportId === lastHandledReportId) {
                console.log(`[Bridge SSE] Báo cáo ${reportId} đã được xử lý trước đó -> Bỏ qua.`);
                return;
            }

            lastHandledReportId = reportId;
            if (reportId) localStorage.setItem(CONFIG.STORAGE_KEY_LAST_REPORT_ID, reportId);

            playChime("success");
            showToast("📥 Đã nhận báo cáo mới từ AN! Đang đổ vào ô chat Perplexity...", "success");
            setTurnState("PE_TURN");

            // Tự động đổ vào khung chat
            setTimeout(() => {
                const injected = injectTextToPerplexity(content);
                if (injected) {
                    showToast("✅ Đã dán báo cáo vào ô chat! Minh Chủ có thể duyệt trước khi gửi.", "info");
                }
            }, 300);
        } else if (type === "PE_DIRECTIVE_ACKNOWLEDGED" || type === "DIRECTIVE_RECEIVED") {
            setTurnState("AN_TURN");
        }
    }

    function syncLatestTurn() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://127.0.0.1:${activeHubPort}/api/messages/latest`,
            onload: function(res) {
                try {
                    const json = JSON.parse(res.responseText);
                    const latest = (json.data && json.data[0]) || json.data;
                    if (latest) {
                        if (latest.sender === 'AN') {
                            setTurnState("PE_TURN");
                        } else if (latest.sender === 'PE') {
                            setTurnState("AN_TURN");
                        }
                    }
                } catch (e) {}
            }
        });
    }

    // ==========================================
    // 6. GIAO DIỆN PANEL ĐIỀU KHIỂN TINH GIẢN
    // ==========================================
    function createBridgePanel() {
        if (document.getElementById("ysdms-bridge-panel")) return;

        const panel = document.createElement("div");
        panel.id = "ysdms-bridge-panel";
        panel.style.cssText = `
            position: fixed;
            bottom: 18px;
            right: 20px;
            z-index: 999990;
            background: #0f172a;
            color: #f8fafc;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 10px 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
            font-size: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: none;
        `;

        panel.innerHTML = `
            <div id="ysdms-bridge-status-indicator" style="display: flex; align-items: center; gap: 6px;">
                <span id="ysdms-bridge-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span>
                <span id="ysdms-bridge-turn-badge" style="background: #0284c7; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">LƯỢT PE</span>
            </div>
            <div style="height: 16px; width: 1px; background: #334155;"></div>
            <button id="ysdms-btn-submit-pe" style="background: #059669; color: #ffffff; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; font-weight: bold; cursor: pointer;" title="Gửi nội dung vào ô chat cho PE (Alt+F9)">🚀 Gửi PE (Alt+F9)</button>
            <button id="ysdms-btn-rescue-an" style="background: #0284c7; color: #ffffff; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; font-weight: bold; cursor: pointer;" title="Cứu hộ thủ công: Gửi chỉ thị sang AN (Alt+F10)">⚡ Cứu hộ AN (Alt+F10)</button>
            <div style="height: 16px; width: 1px; background: #334155;"></div>
            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 11px; color: #94a3b8;">
                <input type="checkbox" id="ysdms-chk-paste-only" ${isOnlyPasteMode ? 'checked' : ''} style="cursor: pointer;" />
                Chỉ dán chatbox
            </label>
        `;

        document.body.appendChild(panel);

        // Bind events
        document.getElementById("ysdms-btn-submit-pe")?.addEventListener("click", handleMinhChuSubmit);
        document.getElementById("ysdms-btn-rescue-an")?.addEventListener("click", handleManualRescueForward);
        document.getElementById("ysdms-chk-paste-only")?.addEventListener("change", (e) => {
            isOnlyPasteMode = e.target.checked;
            localStorage.setItem(CONFIG.STORAGE_KEY_PASTE_ONLY, isOnlyPasteMode);
            showToast(isOnlyPasteMode ? "🔒 Chế độ: Chỉ dán chatbox (Minh Chủ duyệt trước khi gửi)" : "⚡ Chế độ: Tự động submit sau khi dán", "info");
        });

        updateUI();
    }

    function updateUI() {
        const dot = document.getElementById("ysdms-bridge-dot");
        const badge = document.getElementById("ysdms-bridge-turn-badge");

        if (dot) {
            dot.style.background = isHubConnected ? "#10b981" : "#ef4444";
            dot.title = isHubConnected ? `Hub kết nối cổng ${activeHubPort}` : "Hub ngắt kết nối";
        }

        if (badge) {
            if (currentTurnState === "PE_TURN") {
                badge.textContent = "LƯỢT PE";
                badge.style.background = "#0284c7"; // Cyan
            } else {
                badge.textContent = "LƯỢT AN";
                badge.style.background = "#d97706"; // Amber
            }
        }
    }

    // ==========================================
    // 7. PHÍM TẮT TOÀN CỤC & KHỞI CHẠY
    // ==========================================
    window.addEventListener("keydown", function(e) {
        if (e.altKey && (e.key === "F9" || e.code === "F9")) {
            e.preventDefault();
            handleMinhChuSubmit();
        } else if (e.altKey && (e.key === "F10" || e.code === "F10")) {
            e.preventDefault();
            handleManualRescueForward();
        }
    });

    function init() {
        createBridgePanel();
        initSSEConnection();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }
})();
