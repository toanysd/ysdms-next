// ==UserScript==
// @name         Perplexity Bridge: Full-Duplex Workflow (PE-AN Protocol v3.11 Hardened)
// @namespace    http://tampermonkey.net/
// @version      3.11
// @description  Hạ tầng cầu nối PE-AN Event-driven chuẩn: Realtime SSE, Toggle mặc định OFF, Handshake Token, Chống gửi trùng, An toàn 100%.
// @author       Antigravity
// @match        https://www.perplexity.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bridge v3.11 Hardened] 🚀 Khởi chạy hệ thống SSE Client & UI Control.');

    let localHubPort = 3456;
    let sseEventSource = null;
    let sessionToken = '';
    let lastAnReportMessage = null;
    let pendingDirectiveToAN = null;

    // QUY TẮC AN TOÀN PE: Mặc định Toggle là OFF khi cài mới
    let isAutoForwardToAN = localStorage.getItem('pe_an_auto_forward') === 'true';

    // --- UI INJECTION ---
    const bridgeUI = document.createElement('div');
    bridgeUI.style.position = 'fixed';
    bridgeUI.style.bottom = '20px';
    bridgeUI.style.right = '20px';
    bridgeUI.style.zIndex = '999999';
    bridgeUI.style.backgroundColor = '#0F172A';
    bridgeUI.style.color = '#F8FAFC';
    bridgeUI.style.padding = '14px 18px';
    bridgeUI.style.borderRadius = '10px';
    bridgeUI.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6), 0 0 1px 1px #334155';
    bridgeUI.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    bridgeUI.style.fontSize = '13px';
    bridgeUI.style.display = 'flex';
    bridgeUI.style.flexDirection = 'column';
    bridgeUI.style.gap = '10px';
    bridgeUI.style.minWidth = '320px';
    
    bridgeUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">
            <strong style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                <span id="hub-status-dot" style="width: 10px; height: 10px; background-color: #EF4444; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #EF4444;"></span>
                PE ⇄ AN Bridge
            </strong>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span id="realtime-badge" style="font-size: 10px; background: #334155; padding: 2px 6px; border-radius: 4px; color: #94A3B8;">RT: OFF</span>
                <span style="font-size: 11px; color: #64748B; font-weight: bold;">v3.11</span>
            </div>
        </div>
        
        <!-- Toggle Chế độ Tự động PE -> AN (Mặc định OFF) -->
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: #CBD5E1; padding: 2px 0;" title="BẬT: Tự động chuyển chỉ thị sang Local Hub/AN. TẮT: Chờ THOAN bấm gửi thủ công.">
            <input type="checkbox" id="toggle-auto-forward" ${isAutoForwardToAN ? 'checked' : ''} style="accent-color: #3B82F6; cursor: pointer; width: 15px; height: 15px;">
            <span>Tự động chuyển lệnh cho AN (Auto-forward)</span>
        </label>

        <div style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Nút gửi lệnh sang AN (chỉ sáng khi TẮT auto hoặc có lệnh pending) -->
            <button id="btn-manual-forward-an" style="display: none; background-color: #2563EB; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; text-align: left; font-weight: bold; font-size: 12px; transition: background 0.2s; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);">
                <span style="margin-right: 6px;">📥</span> <span id="manual-forward-label">Có lệnh mới từ PE! Bấm gửi AN</span>
            </button>

            <!-- Nút đổ báo cáo từ AN vào PE (LUÔN CHỜ BẤM TAY) -->
            <button id="btn-fill-pe" disabled style="background-color: #1E293B; color: #64748B; border: 1px solid #334155; padding: 8px 12px; border-radius: 6px; cursor: not-allowed; text-align: left; font-weight: bold; font-size: 12px; transition: all 0.3s;">
                <span style="margin-right: 6px;">🤖</span> Chờ AN thi công...
            </button>

            <!-- Nút gửi tay phụ trợ -->
            <button id="btn-manual-fill" style="background-color: transparent; color: #64748B; border: 1px dashed #334155; padding: 4px 8px; border-radius: 4px; cursor: pointer; text-align: center; font-size: 11px; margin-top: 2px;">
                Tự điền thủ công (Fallback)
            </button>
        </div>
        <div id="bridge-log" style="font-size: 11px; color: #64748B; margin-top: 2px; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Khởi tạo...</div>
    `;

    document.body.appendChild(bridgeUI);

    const statusDot = document.getElementById('hub-status-dot');
    const realtimeBadge = document.getElementById('realtime-badge');
    const btnFillPe = document.getElementById('btn-fill-pe');
    const btnManualFill = document.getElementById('btn-manual-fill');
    const btnManualForwardAn = document.getElementById('btn-manual-forward-an');
    const manualForwardLabel = document.getElementById('manual-forward-label');
    const toggleAutoForward = document.getElementById('toggle-auto-forward');
    const logDiv = document.getElementById('bridge-log');

    // Lắng nghe thay đổi Toggle
    toggleAutoForward.addEventListener('change', (e) => {
        isAutoForwardToAN = e.target.checked;
        localStorage.setItem('pe_an_auto_forward', isAutoForwardToAN);
        log(`Toggle: ${isAutoForwardToAN ? 'BẬT (Tự động)' : 'TẮT (Chờ duyệt)'}`);
        
        // Nếu bật lên mà đang có lệnh pending, gửi luôn
        if (isAutoForwardToAN && pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    function log(msg) {
        logDiv.innerText = msg;
        logDiv.title = msg;
        console.log(`[Bridge v3.11] ${msg}`);
    }

    // --- XỬ LÝ LỆNH TỪ PE (Nhận qua SSE từ Hub hoặc hàm gọi ngoài) ---
    function handleNewDirective(directiveData) {
        pendingDirectiveToAN = directiveData;
        const mid = directiveData.message_id || 'unknown';
        const shortMid = mid.length > 8 ? mid.slice(0, 8) : mid;
        const timeStr = new Date().toLocaleTimeString();

        if (isAutoForwardToAN) {
            log(`Tự động nạp lệnh [${shortMid}] sang AN...`);
            forwardDirectiveToLocalHub(directiveData);
        } else {
            log(`Có lệnh [${shortMid}] lúc ${timeStr}! Chờ THOAN bấm gửi.`);
            manualForwardLabel.innerText = `Lệnh mới [${shortMid}] (${timeStr}) → Bấm gửi AN`;
            btnManualForwardAn.style.display = 'block';
            
            // Nhấp nháy nút
            let flash = 0;
            const flashInt = setInterval(() => {
                btnManualForwardAn.style.opacity = flash % 2 === 0 ? '0.7' : '1';
                flash++;
                if (flash > 6 || isAutoForwardToAN) clearInterval(flashInt);
            }, 300);
        }
    }

    // Expose cho script ngoài nếu có
    window.onNewPeDirectiveDetected = handleNewDirective;

    // Khi người dùng bấm nút gửi tay sang AN
    btnManualForwardAn.addEventListener('click', () => {
        if (pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    // Hàm gọi API Local Hub với Token bảo mật
    function forwardDirectiveToLocalHub(data) {
        log(`Đang gửi lệnh sang Local Hub (Port ${localHubPort})...`);
        
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
        .then(res => {
            log(`Đã chuyển lệnh sang AN thành công!`);
            pendingDirectiveToAN = null;
            btnManualForwardAn.style.display = 'none';
        })
        .catch(err => {
            log(`Lỗi gửi Hub: ${err.message} (Chuyển DEGRADED)`);
            statusDot.style.backgroundColor = '#F59E0B'; // DEGRADED
            statusDot.style.boxShadow = '0 0 6px #F59E0B';
        });
    }

    // --- CONNECTION TO LOCAL HUB (SSE) ---
    function connectSSE() {
        if (sseEventSource) {
            sseEventSource.close();
        }
        
        sseEventSource = new EventSource(`http://127.0.0.1:${localHubPort}/api/events`);
        
        sseEventSource.onopen = () => {
            statusDot.style.backgroundColor = '#10B981'; // Green
            statusDot.style.boxShadow = '0 0 6px #10B981';
            log(`Đã kết nối Hub (: ${localHubPort})`);
        };
        
        sseEventSource.onmessage = (e) => {
            if (e.data === ':keepalive') return;
            
            try {
                const data = JSON.parse(e.data);
                
                if (data.type === 'CONNECTED') {
                    if (data.token) sessionToken = data.token;
                    if (data.realtimeSubscribed) {
                        realtimeBadge.innerText = 'RT: ON';
                        realtimeBadge.style.background = '#065F46';
                        realtimeBadge.style.color = '#34D399';
                    }
                    if (data.port && data.port !== localHubPort) {
                        localHubPort = data.port;
                        connectSSE();
                    }
                } else if (data.type === 'REALTIME_STATUS') {
                    if (data.subscribed) {
                        realtimeBadge.innerText = 'RT: ON';
                        realtimeBadge.style.background = '#065F46';
                        realtimeBadge.style.color = '#34D399';
                    } else {
                        realtimeBadge.innerText = 'RT: ERR';
                        realtimeBadge.style.background = '#7F1D1D';
                        realtimeBadge.style.color = '#FCA5A5';
                    }
                } else if (data.type === 'PE_DIRECTIVE_ARRIVED') {
                    handleNewDirective(data.directive);
                } else if (data.type === 'DIRECTIVE_DISPATCHED_TO_AN') {
                    btnFillPe.innerHTML = `<span style="margin-right: 6px;">⚙️</span> AN đang thi công...`;
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
            realtimeBadge.style.background = '#334155';
            realtimeBadge.style.color = '#94A3B8';
            log('Mất kết nối Hub. Đang thử lại...');
            sseEventSource.close();
            setTimeout(connectSSE, 3000);
        };
    }

    connectSSE();

    // --- XỬ LÝ KHI AN BÁO CÁO XONG ---
    function handleAnReportReady(message) {
        lastAnReportMessage = message || "PE đọc Bridge.";
        log("✅ AN đã hoàn tất báo cáo! Bấm để đổ vào PE.");
        
        // Nút sáng màu xanh lục - CHỜ THOAN BẤM TAY (An toàn tuyệt đối)
        btnFillPe.style.backgroundColor = '#059669';
        btnFillPe.style.color = '#FFFFFF';
        btnFillPe.style.border = 'none';
        btnFillPe.style.cursor = 'pointer';
        btnFillPe.innerHTML = `<span style="margin-right: 6px;">🚀</span> Đổ báo cáo vào PE`;
        btnFillPe.disabled = false;
        
        let flash = 0;
        const flashInterval = setInterval(() => {
            btnFillPe.style.opacity = flash % 2 === 0 ? '0.7' : '1';
            flash++;
            if (flash > 6) {
                clearInterval(flashInterval);
                btnFillPe.style.opacity = '1';
            }
        }, 300);
    }

    // --- CHỨC NĂNG ĐIỀN VÀO CHATBOX PERPLEXITY ---
    function fillChatbox(text) {
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            alert('Không tìm thấy ô nhập liệu của Perplexity!');
            return;
        }

        // Điền text thông qua native setter để React nhận diện
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        log("Đã điền báo cáo! THOAN hãy kiểm tra và bấm nút Gửi trên Perplexity.");

        // Reset nút về trạng thái chờ
        btnFillPe.style.backgroundColor = '#1E293B';
        btnFillPe.style.color = '#64748B';
        btnFillPe.style.border = '1px solid #334155';
        btnFillPe.style.cursor = 'not-allowed';
        btnFillPe.innerHTML = `<span style="margin-right: 6px;">🤖</span> Chờ AN thi công...`;
        btnFillPe.disabled = true;
    }

    // Sự kiện nút bấm
    btnFillPe.addEventListener('click', () => {
        if (!btnFillPe.disabled) {
            fillChatbox(lastAnReportMessage || "PE đọc Bridge.");
        }
    });

    btnManualFill.addEventListener('click', () => {
        const text = prompt("Nhập nội dung muốn gửi cho PE:", "PE đọc Bridge.");
        if (text) {
            fillChatbox(text);
        }
    });

})();
