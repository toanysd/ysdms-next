// ==UserScript==
// @name         Perplexity Bridge: Full-Duplex Workflow (PE-AN Protocol v3.8)
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Hệ thống cầu nối 2 chiều giữa Perplexity (PE) và Antigravity (AN) qua Supabase + Local SSE Hub. Thêm nút Manual Fill.
// @author       Antigravity
// @match        https://www.perplexity.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bridge v3.8] 🚀 Khởi chạy hệ thống SSE Client & UI Control.');

    let localHubPort = 3000;
    let sseEventSource = null;
    let lastAnReportMessage = null;

    // --- UI INJECTION ---
    const bridgeUI = document.createElement('div');
    bridgeUI.style.position = 'fixed';
    bridgeUI.style.bottom = '20px';
    bridgeUI.style.right = '20px';
    bridgeUI.style.zIndex = '999999';
    bridgeUI.style.backgroundColor = '#1E293B';
    bridgeUI.style.color = 'white';
    bridgeUI.style.padding = '12px 16px';
    bridgeUI.style.borderRadius = '8px';
    bridgeUI.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    bridgeUI.style.fontFamily = 'sans-serif';
    bridgeUI.style.fontSize = '14px';
    bridgeUI.style.display = 'flex';
    bridgeUI.style.flexDirection = 'column';
    bridgeUI.style.gap = '10px';
    bridgeUI.style.minWidth = '280px';
    
    bridgeUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 8px;">
            <strong style="display: flex; align-items: center; gap: 8px;">
                <span id="hub-status-dot" style="width: 10px; height: 10px; background-color: #EF4444; border-radius: 50%; display: inline-block; box-shadow: 0 0 5px #EF4444;"></span>
                PE ⇄ AN Bridge
            </strong>
            <span style="font-size: 11px; color: #94A3B8;">v3.8</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Nút gửi tay -->
            <button id="btn-manual-fill" style="background-color: #475569; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; text-align: left; transition: background 0.2s;">
                <span style="margin-right: 6px;">✍️</span> Tự điền Manual (Fallback)
            </button>
            
            <!-- Nút tự động sáng lên khi AN xong -->
            <button id="btn-auto-fill" disabled style="background-color: #0F172A; color: #64748B; border: 1px solid #334155; padding: 8px 12px; border-radius: 4px; cursor: not-allowed; text-align: left; font-weight: bold; transition: all 0.3s;">
                <span style="margin-right: 6px;">🤖</span> Chờ tín hiệu từ AN...
            </button>
        </div>
        <div id="bridge-log" style="font-size: 11px; color: #64748B; margin-top: 4px; font-family: monospace;">Đang kết nối Local Hub...</div>
    `;

    document.body.appendChild(bridgeUI);

    const statusDot = document.getElementById('hub-status-dot');
    const btnManualFill = document.getElementById('btn-manual-fill');
    const btnAutoFill = document.getElementById('btn-auto-fill');
    const logDiv = document.getElementById('bridge-log');

    function log(msg) {
        logDiv.innerText = msg;
        console.log(`[Bridge v3.8] ${msg}`);
    }

    // --- Lắng nghe thay đổi của Supabase TỪ USERSCRIPT (Nếu muốn Userscript trực tiếp đọc Supabase thay vì Local Hub) ---
    // Tuy nhiên, theo luồng của người dùng: PE -> Supabase -> Userscript -> Hub -> Antigravity.
    // Nếu Userscript v3.7 đã có logic Supabase Realtime, bạn CẦN THÊM ĐOẠN ĐÓ VÀO ĐÂY, HOẶC chỉ cần cập nhật giao diện này vào script cũ của bạn.
    
    // Đoạn code trên là UI MẪU. Người dùng hãy thay thế/thêm vào file Userscript hiện tại.

    // --- CONNECTION TO LOCAL HUB ---
    function connectSSE() {
        if (sseEventSource) {
            sseEventSource.close();
        }
        
        sseEventSource = new EventSource(\`http://127.0.0.1:\${localHubPort}/api/events\`);
        
        sseEventSource.onopen = () => {
            statusDot.style.backgroundColor = '#10B981'; // Green
            statusDot.style.boxShadow = '0 0 5px #10B981';
            log(\`Đã kết nối Hub (: \${localHubPort})\`);
        };
        
        sseEventSource.onmessage = (e) => {
            if (e.data === ':keepalive') return;
            
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'AN_REPORT_DONE') {
                    handleAnReportReady(data.message);
                } else if (data.type === 'CONNECTED') {
                    if (data.port && data.port !== localHubPort) {
                        localHubPort = data.port;
                        connectSSE(); // Reconnect to correct port
                    }
                }
            } catch (err) {
                console.error('SSE Parse Error', err);
            }
        };
        
        sseEventSource.onerror = (err) => {
            statusDot.style.backgroundColor = '#EF4444'; // Red
            statusDot.style.boxShadow = '0 0 5px #EF4444';
            log('Mất kết nối Hub. Đang thử lại...');
            sseEventSource.close();
            setTimeout(connectSSE, 3000);
        };
    }

    connectSSE();

    // --- HANDLE SIGNAL FROM AN ---
    function handleAnReportReady(message) {
        lastAnReportMessage = message || "PE đọc Bridge.";
        log("✅ Đã nhận tín hiệu AN hoàn thành!");
        
        // Cập nhật giao diện nút bấm
        btnAutoFill.style.backgroundColor = '#10B981';
        btnAutoFill.style.color = 'white';
        btnAutoFill.style.border = 'none';
        btnAutoFill.style.cursor = 'pointer';
        btnAutoFill.innerHTML = \`<span style="margin-right: 6px;">🚀</span> Gửi báo cáo vào PE\`;
        btnAutoFill.disabled = false;
        
        let flash = 0;
        const flashInterval = setInterval(() => {
            btnAutoFill.style.opacity = flash % 2 === 0 ? '0.7' : '1';
            flash++;
            if (flash > 5) {
                clearInterval(flashInterval);
                btnAutoFill.style.opacity = '1';
            }
        }, 300);
    }

    // --- CHỨC NĂNG ĐIỀN VÀO CHATBOX ---
    function fillAndSubmit(text) {
        // Tìm textarea của Perplexity
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            alert('Không tìm thấy ô nhập liệu của Perplexity!');
            return;
        }

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        log("Đã điền text. Chờ 500ms để submit...");

        setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label="Submit"]');
            if (sendButton && !sendButton.disabled) {
                sendButton.click();
                log("Đã submit lên PE.");
                
                btnAutoFill.style.backgroundColor = '#0F172A';
                btnAutoFill.style.color = '#64748B';
                btnAutoFill.style.border = '1px solid #334155';
                btnAutoFill.style.cursor = 'not-allowed';
                btnAutoFill.innerHTML = \`<span style="margin-right: 6px;">🤖</span> Chờ tín hiệu từ AN...\`;
                btnAutoFill.disabled = true;
                
            } else {
                log("Chưa thể bấm nút Submit. Vui lòng bấm tay (Enter).");
            }
        }, 500);
    }

    btnAutoFill.addEventListener('click', () => {
        if (!btnAutoFill.disabled) {
            fillAndSubmit(lastAnReportMessage || "PE đọc Bridge.");
        }
    });

    btnManualFill.addEventListener('click', () => {
        const text = prompt("Nhập nội dung muốn gửi cho PE (mặc định: PE đọc Bridge.):", "PE đọc Bridge.");
        if (text) {
            fillAndSubmit(text);
        }
    });
    
    btnManualFill.addEventListener('mouseover', () => btnManualFill.style.backgroundColor = '#64748B');
    btnManualFill.addEventListener('mouseout', () => btnManualFill.style.backgroundColor = '#475569');

})();
