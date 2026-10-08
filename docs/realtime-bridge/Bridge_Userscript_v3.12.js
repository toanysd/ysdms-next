// ==UserScript==
// @name         Perplexity Bridge: Full-Duplex Workflow (PE-AN Protocol v3.12 Light Draggable)
// @namespace    http://tampermonkey.net/
// @version      3.12
// @description  Hạ tầng cầu nối PE-AN Event-driven: Giao diện sáng thanh lịch, Thu gọn/Mở rộng, Di chuyển Drag & Drop, Tự nhận diện đa dạng ô nhập Perplexity.
// @author       Antigravity
// @match        https://www.perplexity.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bridge v3.12 Light] 🚀 Khởi chạy hệ thống SSE Client, UI Sáng & Drag/Drop.');

    let CANDIDATE_PORTS = [7654, 7655, 7656, 3888, 3456];
    let portScanIndex = 0;
    
    // Đọc cổng từ cache
    let savedPort = localStorage.getItem('pe_an_hub_port');
    if (!savedPort || savedPort === '3456') {
        savedPort = '7654';
        localStorage.setItem('pe_an_hub_port', '7654');
    }
    let localHubPort = parseInt(savedPort, 10);
    let sseEventSource = null;
    let sessionToken = '';
    let lastAnReportMessage = null;
    let pendingDirectiveToAN = null;

    // Toggle Auto-Forward: Đọc từ cache
    let isAutoForwardToAN = localStorage.getItem('pe_an_auto_forward') === 'true';

    // Trạng thái thu gọn: Đọc từ cache
    let isCollapsed = localStorage.getItem('pe_an_bridge_collapsed') === 'true';

    // Vị trí lưu trữ
    let savedPos = null;
    try {
        savedPos = JSON.parse(localStorage.getItem('pe_an_bridge_pos') || 'null');
    } catch(e) {
        savedPos = null;
    }

    // --- TẠO GIAO DIỆN CHÍNH (LIGHT THEME) ---
    const bridgeUI = document.createElement('div');
    bridgeUI.id = 'pe-an-bridge-container';
    bridgeUI.style.position = 'fixed';
    bridgeUI.style.zIndex = '999999';
    bridgeUI.style.backgroundColor = '#FFFFFF';
    bridgeUI.style.color = '#0F172A';
    bridgeUI.style.borderRadius = '12px';
    bridgeUI.style.boxShadow = '0 12px 32px -4px rgba(15, 23, 42, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 0 0 1px #E2E8F0';
    bridgeUI.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    bridgeUI.style.fontSize = '13px';
    bridgeUI.style.minWidth = '330px';
    bridgeUI.style.maxWidth = '380px';
    bridgeUI.style.overflow = 'hidden';
    bridgeUI.style.transition = 'box-shadow 0.2s, opacity 0.2s';
    bridgeUI.style.userSelect = 'none';

    // Áp dụng vị trí đã lưu hoặc mặc định góc phải dưới
    if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
        const maxL = Math.max(10, window.innerWidth - 350);
        const maxT = Math.max(10, window.innerHeight - 100);
        bridgeUI.style.left = `${Math.min(savedPos.left, maxL)}px`;
        bridgeUI.style.top = `${Math.min(savedPos.top, maxT)}px`;
        bridgeUI.style.bottom = 'auto';
        bridgeUI.style.right = 'auto';
    } else {
        bridgeUI.style.bottom = '24px';
        bridgeUI.style.right = '24px';
    }

    bridgeUI.innerHTML = `
        <!-- HEADER (Drag handle) -->
        <div id="bridge-header" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to right, #F8FAFC, #F1F5F9); border-bottom: 1px solid #E2E8F0; padding: 10px 14px; cursor: grab;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #94A3B8; font-size: 14px; cursor: grab;" title="Kéo để di chuyển">⠿</span>
                <span id="hub-status-dot" style="width: 10px; height: 10px; background-color: #EF4444; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #EF4444;"></span>
                <strong style="font-size: 13px; font-weight: 700; color: #0F172A;">PE ⇄ AN Bridge</strong>
                <span id="port-display" style="font-size: 11px; background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; padding: 1px 6px; border-radius: 10px; cursor: pointer; font-weight: 600;" title="Bấm để đổi cổng kết nối">:${localHubPort}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span id="realtime-badge" style="font-size: 10px; background: #F1F5F9; border: 1px solid #CBD5E1; padding: 2px 6px; border-radius: 4px; color: #64748B; font-weight: 600;">RT: OFF</span>
                <button id="btn-toggle-collapse" style="background: none; border: none; color: #64748B; cursor: pointer; font-size: 14px; font-weight: bold; padding: 2px 6px; border-radius: 4px; line-height: 1;" title="Thu gọn / Mở rộng">
                    ${isCollapsed ? '➕' : '➖'}
                </button>
            </div>
        </div>

        <!-- BODY CONTAINER -->
        <div id="bridge-body" style="padding: 12px 14px; display: ${isCollapsed ? 'none' : 'flex'}; flex-direction: column; gap: 10px; background: #FFFFFF;">
            
            <!-- Toggle Chế độ Tự động PE -> AN -->
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: #334155; padding: 6px 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px;" title="BẬT: Tự động chuyển chỉ thị sang Local Hub/AN. TẮT: Chờ THOAN bấm gửi thủ công.">
                <input type="checkbox" id="toggle-auto-forward" ${isAutoForwardToAN ? 'checked' : ''} style="accent-color: #2563EB; cursor: pointer; width: 15px; height: 15px;">
                <span style="font-weight: 500;">Tự động chuyển lệnh cho AN (Auto-forward)</span>
            </label>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Nút gửi lệnh sang AN (chỉ sáng khi TẮT auto hoặc có lệnh pending) -->
                <button id="btn-manual-forward-an" style="display: none; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; border: none; padding: 9px 12px; border-radius: 8px; cursor: pointer; text-align: left; font-weight: 600; font-size: 12px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                    <span style="margin-right: 6px;">📥</span> <span id="manual-forward-label">Có lệnh mới từ PE! Bấm gửi AN</span>
                </button>

                <!-- Nút đổ báo cáo từ AN vào PE (LUÔN CHỜ BẤM TAY) -->
                <button id="btn-fill-pe" disabled style="background-color: #F1F5F9; color: #94A3B8; border: 1px solid #E2E8F0; padding: 9px 12px; border-radius: 8px; cursor: not-allowed; text-align: left; font-weight: 700; font-size: 12px; transition: all 0.3s; display: flex; align-items: center; justify-content: space-between;">
                    <span id="btn-fill-pe-text"><span style="margin-right: 6px;">🤖</span> Chờ AN thi công...</span>
                    <span id="btn-fill-pe-badge" style="display: none; font-size: 10px; background: rgba(255,255,255,0.3); padding: 1px 6px; border-radius: 4px;">SẴN SÀNG</span>
                </button>

                <!-- Hàng công cụ phụ trợ: Copy & Điền tay -->
                <div style="display: flex; gap: 6px;">
                    <button id="btn-copy-clipboard" style="flex: 1; background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; font-weight: 500; transition: background 0.15s;" title="Sao chép nội dung báo cáo gần nhất vào Clipboard">
                        📋 Copy báo cáo
                    </button>
                    <button id="btn-manual-fill" style="flex: 1; background: #FFFFFF; color: #475569; border: 1px solid #CBD5E1; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; font-weight: 500; transition: background 0.15s;" title="Nhập thủ công nội dung đổ vào PE">
                        ✏️ Điền tay
                    </button>
                </div>
            </div>

            <!-- Toast / Log Thông báo -->
            <div id="bridge-toast" style="font-size: 11px; color: #64748B; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 8px; border-radius: 6px; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                Đang khởi tạo kết nối...
            </div>
        </div>

        <!-- MINI PILL TRẠNG THÁI (KHI THU GỌN) -->
        <div id="bridge-mini-pill" style="display: ${isCollapsed ? 'flex' : 'none'}; align-items: center; justify-content: space-between; padding: 6px 12px; background: #FFFFFF; font-size: 11px; font-weight: 600; color: #334155; cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 6px;">
                <span id="mini-status-text">🟢 Sẵn sàng</span>
            </div>
            <span id="mini-action-tag" style="color: #2563EB; font-size: 11px;">Mở rộng ↗</span>
        </div>
    `;

    document.body.appendChild(bridgeUI);

    // --- DOM REFERENCES ---
    const headerEl = document.getElementById('bridge-header');
    const bodyEl = document.getElementById('bridge-body');
    const miniPillEl = document.getElementById('bridge-mini-pill');
    const statusDot = document.getElementById('hub-status-dot');
    const realtimeBadge = document.getElementById('realtime-badge');
    const btnFillPe = document.getElementById('btn-fill-pe');
    const btnFillPeText = document.getElementById('btn-fill-pe-text');
    const btnFillPeBadge = document.getElementById('btn-fill-pe-badge');
    const btnCopyClipboard = document.getElementById('btn-copy-clipboard');
    const btnManualFill = document.getElementById('btn-manual-fill');
    const btnManualForwardAn = document.getElementById('btn-manual-forward-an');
    const manualForwardLabel = document.getElementById('manual-forward-label');
    const toggleAutoForward = document.getElementById('toggle-auto-forward');
    const btnToggleCollapse = document.getElementById('btn-toggle-collapse');
    const toastDiv = document.getElementById('bridge-toast');
    const portDisplay = document.getElementById('port-display');
    const miniStatusText = document.getElementById('mini-status-text');

    // --- CHỨC NĂNG THÔNG BÁO (TOAST) ---
    function log(msg, type = 'info') {
        toastDiv.innerText = msg;
        toastDiv.title = msg;
        if (type === 'success') {
            toastDiv.style.background = '#ECFDF5';
            toastDiv.style.color = '#047857';
            toastDiv.style.borderColor = '#A7F3D0';
        } else if (type === 'warning') {
            toastDiv.style.background = '#FFFBEB';
            toastDiv.style.color = '#B45309';
            toastDiv.style.borderColor = '#FDE68A';
        } else if (type === 'error') {
            toastDiv.style.background = '#FEF2F2';
            toastDiv.style.color = '#B91C1C';
            toastDiv.style.borderColor = '#FECACA';
        } else {
            toastDiv.style.background = '#F8FAFC';
            toastDiv.style.color = '#64748B';
            toastDiv.style.borderColor = '#E2E8F0';
        }
        console.log(`[Bridge v3.12] ${msg}`);
    }

    // --- CHỨC NĂNG THU GỌN / MỞ RỘNG (COLLAPSIBLE) ---
    function setCollapsed(collapse) {
        isCollapsed = collapse;
        localStorage.setItem('pe_an_bridge_collapsed', isCollapsed);
        if (isCollapsed) {
            bodyEl.style.display = 'none';
            miniPillEl.style.display = 'flex';
            btnToggleCollapse.innerText = '➕';
            bridgeUI.style.minWidth = '220px';
        } else {
            bodyEl.style.display = 'flex';
            miniPillEl.style.display = 'none';
            btnToggleCollapse.innerText = '➖';
            bridgeUI.style.minWidth = '330px';
        }
    }

    btnToggleCollapse.addEventListener('click', (e) => {
        e.stopPropagation();
        setCollapsed(!isCollapsed);
    });

    miniPillEl.addEventListener('click', () => {
        setCollapsed(false);
    });

    // --- CHỨC NĂNG KÉO THẢ DI CHUYỂN (DRAGGABLE) ---
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    headerEl.addEventListener('mousedown', (e) => {
        // Không kéo nếu click vào nút thu gọn hoặc đổi cổng
        if (e.target.id === 'btn-toggle-collapse' || e.target.id === 'port-display') return;
        
        isDragging = true;
        headerEl.style.cursor = 'grabbing';
        bridgeUI.style.boxShadow = '0 20px 40px -4px rgba(15, 23, 42, 0.28), 0 0 0 2px #3B82F6';
        
        const rect = bridgeUI.getBoundingClientRect();
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        // Cố định toạ độ tuyệt đối sang left/top
        bridgeUI.style.left = `${initialLeft}px`;
        bridgeUI.style.top = `${initialTop}px`;
        bridgeUI.style.bottom = 'auto';
        bridgeUI.style.right = 'auto';

        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // Giới hạn trong màn hình
        const maxLeft = window.innerWidth - bridgeUI.offsetWidth - 10;
        const maxTop = window.innerHeight - bridgeUI.offsetHeight - 10;

        newLeft = Math.max(10, Math.min(maxLeft, newLeft));
        newTop = Math.max(10, Math.min(maxTop, newTop));

        bridgeUI.style.left = `${newLeft}px`;
        bridgeUI.style.top = `${newTop}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        headerEl.style.cursor = 'grab';
        bridgeUI.style.boxShadow = '0 12px 32px -4px rgba(15, 23, 42, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 0 0 1px #E2E8F0';

        const rect = bridgeUI.getBoundingClientRect();
        localStorage.setItem('pe_an_bridge_pos', JSON.stringify({ left: rect.left, top: rect.top }));
    });

    // --- CỔNG KẾT NỐI ---
    portDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        const input = prompt("Nhập cổng Local Hub (VD: 7654):", localHubPort);
        if (input && !isNaN(parseInt(input, 10))) {
            localHubPort = parseInt(input, 10);
            localStorage.setItem('pe_an_hub_port', localHubPort.toString());
            portDisplay.innerText = `:${localHubPort}`;
            log(`Đã đổi sang cổng ${localHubPort}. Đang kết nối lại...`);
            connectSSE();
        }
    });

    // Toggle tự động
    toggleAutoForward.addEventListener('change', (e) => {
        isAutoForwardToAN = e.target.checked;
        localStorage.setItem('pe_an_auto_forward', isAutoForwardToAN);
        log(`Toggle: ${isAutoForwardToAN ? 'BẬT (Tự động)' : 'TẮT (Chờ duyệt)'}`);
        if (isAutoForwardToAN && pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    // --- XỬ LÝ LỆNH TỪ PE ---
    function handleNewDirective(directiveData) {
        pendingDirectiveToAN = directiveData;
        const mid = directiveData.message_id || 'unknown';
        const shortMid = mid.length > 8 ? mid.slice(0, 8) : mid;
        const timeStr = new Date().toLocaleTimeString();

        if (isAutoForwardToAN) {
            log(`Tự động nạp lệnh [${shortMid}] sang AN...`);
            forwardDirectiveToLocalHub(directiveData);
        } else {
            log(`Có lệnh [${shortMid}] lúc ${timeStr}! Chờ THOAN bấm gửi.`, 'warning');
            manualForwardLabel.innerText = `Lệnh mới [${shortMid}] (${timeStr}) → Bấm gửi AN`;
            btnManualForwardAn.style.display = 'block';
            
            // Nếu đang thu gọn, báo hiệu trên mini pill
            miniStatusText.innerText = `📥 Có lệnh mới [${shortMid}]!`;
        }
    }

    btnManualForwardAn.addEventListener('click', () => {
        if (pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    function forwardDirectiveToLocalHub(data) {
        log(`Đang gửi lệnh sang Local Hub (: ${localHubPort})...`);
        fetch(`http://127.0.0.1:${localHubPort}/api/directive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-bridge-token': sessionToken
            },
            body: JSON.stringify({
                messageId: data.message_id || data.messageId,
                threadId: data.thread_id || data.threadId || 'WO-BRIDGE-HARDENING',
                messageType: data.message_type || data.messageType || 'DIRECTIVE',
                directiveText: data.content_md || data.directiveText || ''
            })
        })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(() => {
            log(`Đã chuyển lệnh sang AN thành công!`, 'success');
            pendingDirectiveToAN = null;
            btnManualForwardAn.style.display = 'none';
            miniStatusText.innerText = `⚙️ AN đang thi công...`;
        })
        .catch(err => {
            log(`Lỗi gửi Hub: ${err.message}`, 'error');
            statusDot.style.backgroundColor = '#F59E0B';
            statusDot.style.boxShadow = '0 0 6px #F59E0B';
        });
    }

    // --- KẾT NỐI SSE TỚI LOCAL HUB ---
    function connectSSE() {
        if (sseEventSource) {
            sseEventSource.close();
        }
        
        sseEventSource = new EventSource(`http://127.0.0.1:${localHubPort}/api/events`);
        
        sseEventSource.onopen = () => {
            statusDot.style.backgroundColor = '#10B981'; // Green
            statusDot.style.boxShadow = '0 0 6px #10B981';
            if (portDisplay) portDisplay.innerText = `:${localHubPort}`;
            log(`Đã kết nối Hub (: ${localHubPort})`);
            miniStatusText.innerText = `🟢 Hub :${localHubPort} OK`;
        };
        
        sseEventSource.onmessage = (e) => {
            if (e.data === ':keepalive') return;
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'CONNECTED') {
                    if (data.token) sessionToken = data.token;
                    if (data.realtimeSubscribed) {
                        realtimeBadge.innerText = 'RT: ON';
                        realtimeBadge.style.background = '#ECFDF5';
                        realtimeBadge.style.color = '#047857';
                        realtimeBadge.style.borderColor = '#A7F3D0';
                    }
                    if (data.port) {
                        localHubPort = data.port;
                        localStorage.setItem('pe_an_hub_port', data.port);
                    }
                } else if (data.type === 'REALTIME_STATUS') {
                    if (data.subscribed) {
                        realtimeBadge.innerText = 'RT: ON';
                        realtimeBadge.style.background = '#ECFDF5';
                        realtimeBadge.style.color = '#047857';
                        realtimeBadge.style.borderColor = '#A7F3D0';
                    } else {
                        realtimeBadge.innerText = 'RT: ERR';
                        realtimeBadge.style.background = '#FEF2F2';
                        realtimeBadge.style.color = '#B91C1C';
                        realtimeBadge.style.borderColor = '#FECACA';
                    }
                } else if (data.type === 'PE_DIRECTIVE_ARRIVED') {
                    handleNewDirective(data.directive);
                } else if (data.type === 'DIRECTIVE_DISPATCHED_TO_AN') {
                    btnFillPeText.innerHTML = `<span style="margin-right: 6px;">⚙️</span> AN đang thi công...`;
                    miniStatusText.innerText = `⚙️ AN đang thi công...`;
                } else if (data.type === 'AN_REPORT_DONE') {
                    handleAnReportReady(data.message);
                }
            } catch (err) {
                console.error('[SSE ERROR]', err);
            }
        };
        
        sseEventSource.onerror = () => {
            statusDot.style.backgroundColor = '#EF4444'; // Red
            statusDot.style.boxShadow = '0 0 6px #EF4444';
            realtimeBadge.innerText = 'RT: OFF';
            realtimeBadge.style.background = '#F1F5F9';
            realtimeBadge.style.color = '#64748B';
            realtimeBadge.style.borderColor = '#CBD5E1';
            miniStatusText.innerText = `🔴 Mất kết nối`;
            
            // Quét cổng tiếp theo
            portScanIndex = (portScanIndex + 1) % CANDIDATE_PORTS.length;
            localHubPort = CANDIDATE_PORTS[portScanIndex];
            log(`Mất kết nối Hub. Thử cổng ${localHubPort}...`, 'warning');
            
            sseEventSource.close();
            setTimeout(connectSSE, 2500);
        };
    }

    connectSSE();

    // --- KHI AN BÁO CÁO XONG ---
    function handleAnReportReady(message) {
        lastAnReportMessage = message || "PE đọc Bridge: Hoàn tất nghiệm thu.";
        log("✅ AN đã hoàn tất báo cáo! Bấm để đổ vào PE.", 'success');
        
        // Nút xanh ngọc nổi bật
        btnFillPe.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        btnFillPe.style.color = '#FFFFFF';
        btnFillPe.style.border = 'none';
        btnFillPe.style.cursor = 'pointer';
        btnFillPe.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
        btnFillPeText.innerHTML = `<span style="margin-right: 6px;">🚀</span> Đổ báo cáo vào PE`;
        btnFillPeBadge.style.display = 'inline-block';
        btnFillPe.disabled = false;
        
        miniStatusText.innerText = `🚀 Báo cáo sẵn sàng!`;
        if (isCollapsed) {
            bridgeUI.style.boxShadow = '0 0 0 3px #10B981, 0 12px 32px rgba(16, 185, 129, 0.3)';
        }
    }

    // --- TÌM Ô NHẬP LIỆU PERPLEXITY (ĐA TẦNG ROBUST) ---
    function isElementVisible(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    }

    function findPerplexityInput() {
        const keywords = ['câu hỏi', 'ask', 'follow', 'search', 'nhập', 'prompt', 'tiếp theo'];

        // 1. Textarea có sẵn trên trang
        const textareas = Array.from(document.querySelectorAll('textarea'));
        for (const ta of textareas) {
            if (isElementVisible(ta)) {
                return { el: ta, type: 'textarea' };
            }
        }

        // 2. Contenteditable (Lexical, ProseMirror, Slate, Rich-editor)
        const editables = Array.from(document.querySelectorAll('div[contenteditable="true"], [role="textbox"], div[data-lexical-editor="true"], .ProseMirror, [contenteditable="plaintext-only"]'));
        for (const ed of editables) {
            if (isElementVisible(ed)) {
                return { el: ed, type: 'contenteditable' };
            }
        }

        // 3. Quét theo placeholder hoặc aria-label
        const allCandidates = Array.from(document.querySelectorAll('textarea, input[type="text"], input:not([type]), [contenteditable="true"]'));
        for (const c of allCandidates) {
            const ph = (c.getAttribute('placeholder') || '').toLowerCase();
            const aria = (c.getAttribute('aria-label') || '').toLowerCase();
            if (keywords.some(k => ph.includes(k) || aria.includes(k))) {
                return {
                    el: c,
                    type: c.tagName === 'TEXTAREA' ? 'textarea' : (c.getAttribute('contenteditable') === 'true' ? 'contenteditable' : 'input')
                };
            }
        }

        // 4. Tìm kiếm qua container query
        const queryWrapper = document.querySelector('form, [data-testid="search-input"], [data-testid="prompt-input"]');
        if (queryWrapper) {
            const inner = queryWrapper.querySelector('textarea, div[contenteditable="true"], input');
            if (inner) {
                return { el: inner, type: inner.tagName === 'TEXTAREA' ? 'textarea' : 'contenteditable' };
            }
        }

        // 5. Fallback cuối cùng: phần tử cuối cùng trong DOM
        if (textareas.length > 0) return { el: textareas[textareas.length - 1], type: 'textarea' };
        if (editables.length > 0) return { el: editables[editables.length - 1], type: 'contenteditable' };

        return null;
    }

    // --- ĐIỀN NỘI DUNG VÀO PERPLEXITY & CLIPBOARD ---
    async function fillPerplexityChatbox(text) {
        // Bước 1: Luôn sao chép nội dung vào Clipboard trước (Bảo hiểm 100%)
        let copied = false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                copied = true;
            }
        } catch (e) {
            console.warn('[Bridge] Không ghi được clipboard:', e);
        }

        // Bước 2: Tìm phần tử ô nhập liệu
        let target = findPerplexityInput();

        // Nếu chưa tìm thấy, thử click kích hoạt container tìm kiếm
        if (!target) {
            const clickTarget = document.querySelector('[placeholder*="câu hỏi"], [placeholder*="Ask"], div[class*="search"], div[class*="prompt"]');
            if (clickTarget) {
                clickTarget.click();
                clickTarget.focus();
                await new Promise(r => setTimeout(r, 120));
                target = findPerplexityInput();
            }
        }

        if (!target || !target.el) {
            log(copied ? "⚠️ Đã Copy vào Clipboard! Bạn hãy bấm ô chat & nhấn Ctrl+V." : "Không tìm thấy ô nhập! Hãy thử click vào ô chat rồi bấm lại.", 'warning');
            return;
        }

        const { el, type } = target;
        el.focus();

        try {
            if (type === 'textarea' || type === 'input') {
                const proto = type === 'textarea' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (setter) {
                    setter.call(el, text);
                } else {
                    el.value = text;
                }
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                // Contenteditable (Lexical / ProseMirror)
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                selection.removeAllRanges();
                selection.addRange(range);

                const success = document.execCommand('insertText', false, text);
                if (!success) {
                    el.innerText = text;
                    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
                }
            }

            el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            el.focus();

            log("✅ Đã điền báo cáo! THOAN hãy kiểm tra và bấm nút Gửi trên Perplexity.", 'success');
        } catch (err) {
            console.error('[Bridge Fill Error]', err);
            log("⚠️ Đã copy nội dung vào Clipboard. Hãy nhấn Ctrl+V vào ô chat!", 'warning');
        }

        // Reset trạng thái nút
        btnFillPe.style.background = '#F1F5F9';
        btnFillPe.style.color = '#94A3B8';
        btnFillPe.style.border = '1px solid #E2E8F0';
        btnFillPe.style.boxShadow = 'none';
        btnFillPe.style.cursor = 'not-allowed';
        btnFillPeText.innerHTML = `<span style="margin-right: 6px;">🤖</span> Chờ AN thi công...`;
        btnFillPeBadge.style.display = 'none';
        btnFillPe.disabled = true;
        miniStatusText.innerText = `🟢 Chờ lệnh mới`;
    }

    // --- SỰ KIỆN NÚT BẤM ---
    btnFillPe.addEventListener('click', () => {
        if (!btnFillPe.disabled) {
            fillPerplexityChatbox(lastAnReportMessage || "PE đọc Bridge: Hoàn tất nghiệm thu.");
        }
    });

    btnCopyClipboard.addEventListener('click', async () => {
        const textToCopy = lastAnReportMessage || "PE đọc Bridge: Hoàn tất nghiệm thu.";
        try {
            await navigator.clipboard.writeText(textToCopy);
            log("📋 Đã sao chép nội dung vào Clipboard thành công!", 'success');
        } catch (err) {
            log("Lỗi copy Clipboard: Hãy copy thủ công.", 'error');
        }
    });

    btnManualFill.addEventListener('click', () => {
        const text = prompt("Nhập nội dung muốn gửi cho PE:", lastAnReportMessage || "PE đọc Bridge: Hoàn tất nghiệm thu.");
        if (text) {
            fillPerplexityChatbox(text);
        }
    });

})();
