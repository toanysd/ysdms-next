// ==UserScript==
// @name         Perplexity Bridge: Full-Duplex Workflow (PE-AN Protocol v3.10)
// @namespace    http://tampermonkey.net/
// @version      3.10
// @description  Hệ thống cầu nối PE <-> AN. Hỗ trợ tắt tự động chuyển lệnh sang AN. Giao diện an toàn 100%.
// @author       Antigravity
// @match        https://www.perplexity.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bridge v3.10] 🚀 Khởi chạy hệ thống SSE Client & UI Control.');

    let localHubPort = 3000;
    let sseEventSource = null;
    let lastAnReportMessage = null;
    let pendingDirectiveToAN = null;

    // Trạng thái Bật/Tắt tự động gửi lệnh sang AN
    let isAutoForwardToAN = localStorage.getItem('pe_an_auto_forward') !== 'false'; // Mặc định true

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
    bridgeUI.style.minWidth = '300px';
    
    bridgeUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 8px;">
            <strong style="display: flex; align-items: center; gap: 8px;">
                <span id="hub-status-dot" style="width: 10px; height: 10px; background-color: #EF4444; border-radius: 50%; display: inline-block; box-shadow: 0 0 5px #EF4444;"></span>
                PE ⇄ AN Bridge
            </strong>
            <span style="font-size: 11px; color: #94A3B8;">v3.10</span>
        </div>
        
        <!-- Toggle Chế độ Tự động PE -> AN -->
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: #CBD5E1; padding: 4px 0;" title="Nếu bật, khi PE có chỉ thị mới sẽ tự động đánh thức AN dưới nền.">
            <input type="checkbox" id="toggle-auto-forward" ${isAutoForwardToAN ? 'checked' : ''} style="accent-color: #3B82F6; cursor: pointer;">
            Tự động chuyển lệnh cho AN chạy ngầm
        </label>

        <div style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Nút gửi lệnh sang AN (chỉ hiện khi TẮT auto) -->
            <button id="btn-manual-forward-an" style="display: none; background-color: #3B82F6; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; text-align: left; font-weight: bold; transition: background 0.2s;">
                <span style="margin-right: 6px;">⚙️</span> Có lệnh mới! Click gửi sang AN
            </button>

            <!-- Nút điền báo cáo từ AN vào PE (LUÔN PHẢI BẤM TAY) -->
            <button id="btn-fill-pe" disabled style="background-color: #0F172A; color: #64748B; border: 1px solid #334155; padding: 8px 12px; border-radius: 4px; cursor: not-allowed; text-align: left; font-weight: bold; transition: all 0.3s;">
                <span style="margin-right: 6px;">🤖</span> Chờ AN làm việc...
            </button>

            <!-- Nút gửi tay -->
            <button id="btn-manual-fill" style="background-color: transparent; color: #94A3B8; border: 1px dashed #475569; padding: 4px 8px; border-radius: 4px; cursor: pointer; text-align: center; font-size: 11px; margin-top: 4px;">
                Tự điền thủ công (Fallback)
            </button>
        </div>
        <div id="bridge-log" style="font-size: 11px; color: #64748B; margin-top: 4px; font-family: monospace;">Đang khởi tạo...</div>
    `;

    document.body.appendChild(bridgeUI);

    const statusDot = document.getElementById('hub-status-dot');
    const btnFillPe = document.getElementById('btn-fill-pe');
    const btnManualFill = document.getElementById('btn-manual-fill');
    const btnManualForwardAn = document.getElementById('btn-manual-forward-an');
    const toggleAutoForward = document.getElementById('toggle-auto-forward');
    const logDiv = document.getElementById('bridge-log');

    // Lắng nghe thay đổi Toggle
    toggleAutoForward.addEventListener('change', (e) => {
        isAutoForwardToAN = e.target.checked;
        localStorage.setItem('pe_an_auto_forward', isAutoForwardToAN);
        log(`Đã ${isAutoForwardToAN ? 'BẬT' : 'TẮT'} tự động gửi lệnh cho AN.`);
        
        // Nếu bật tự động mà đang có lệnh chờ, gửi luôn
        if (isAutoForwardToAN && pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    function log(msg) {
        logDiv.innerText = msg;
        console.log(`[Bridge v3.10] ${msg}`);
    }

    // --- XỬ LÝ LỆNH TỪ PE (THAY THẾ CHỖ BẠN BẮT SỰ KIỆN SUPABASE) ---
    // GỌI HÀM NÀY khi script của bạn phát hiện có tin nhắn mới từ PE trên Supabase
    window.onNewPeDirectiveDetected = function(directiveData) {
        pendingDirectiveToAN = directiveData; // Lưu lại lệnh
        
        if (isAutoForwardToAN) {
            log("Tự động chuyển lệnh sang AN...");
            forwardDirectiveToLocalHub(directiveData);
        } else {
            log("Có lệnh mới từ PE! Chờ bạn bấm nút gửi sang AN.");
            // Hiện nút để bấm tay
            btnManualForwardAn.style.display = 'block';
            
            // Hiệu ứng nhấp nháy cho nút
            let flash = 0;
            const flashInt = setInterval(() => {
                btnManualForwardAn.style.opacity = flash % 2 === 0 ? '0.7' : '1';
                flash++;
                if(flash > 5 || isAutoForwardToAN) clearInterval(flashInt);
            }, 300);
        }
    };

    // Khi người dùng bấm nút gửi tay sang AN
    btnManualForwardAn.addEventListener('click', () => {
        if (pendingDirectiveToAN) {
            forwardDirectiveToLocalHub(pendingDirectiveToAN);
        }
    });

    // Hàm thực tế gọi API Local Hub
    function forwardDirectiveToLocalHub(data) {
        fetch(`http://127.0.0.1:${localHubPort}/api/directive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                threadId: data.threadId || 'WO-P1-004',
                messageId: data.messageId || Date.now().toString(),
                messageType: data.messageType || 'DIRECTIVE',
                directiveText: data.directiveText || data.content_md || ''
            })
        }).then(res => res.json())
          .then(res => {
              log("Đã kích hoạt AN chạy ngầm thành công!");
              pendingDirectiveToAN = null;
              btnManualForwardAn.style.display = 'none'; // Ẩn nút đi
          })
          .catch(err => {
              log("Lỗi gửi lệnh sang Hub: " + err.message);
          });
    }

    // --- CONNECTION TO LOCAL HUB (SSE để nhận báo cáo từ AN) ---
    function connectSSE() {
        if (sseEventSource) {
            sseEventSource.close();
        }
        
        sseEventSource = new EventSource(`http://127.0.0.1:${localHubPort}/api/events`);
        
        sseEventSource.onopen = () => {
            statusDot.style.backgroundColor = '#10B981'; // Green
            statusDot.style.boxShadow = '0 0 5px #10B981';
            log(`Đã kết nối Hub (: ${localHubPort})`);
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
                        connectSSE();
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

    // --- XỬ LÝ KHI AN BÁO CÁO XONG ---
    function handleAnReportReady(message) {
        lastAnReportMessage = message || "PE đọc Bridge.";
        log("✅ AN đã làm xong! Chờ bạn bấm điền vào PE.");
        
        // CẬP NHẬT GIAO DIỆN NÚT BẤM - CHỜ NGƯỜI DÙNG BẤM TAY (Theo yêu cầu)
        btnFillPe.style.backgroundColor = '#10B981';
        btnFillPe.style.color = 'white';
        btnFillPe.style.border = 'none';
        btnFillPe.style.cursor = 'pointer';
        btnFillPe.innerHTML = `<span style="margin-right: 6px;">🚀</span> Tự điền báo cáo của AN`;
        btnFillPe.disabled = false;
        
        let flash = 0;
        const flashInterval = setInterval(() => {
            btnFillPe.style.opacity = flash % 2 === 0 ? '0.7' : '1';
            flash++;
            if (flash > 5) {
                clearInterval(flashInterval);
                btnFillPe.style.opacity = '1';
            }
        }, 300);
    }

    // --- CHỨC NĂNG ĐIỀN VÀO CHATBOX ---
    function fillChatbox(text) {
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            alert('Không tìm thấy ô nhập liệu của Perplexity!');
            return;
        }

        // Tự điền vào ô text
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        log("Đã điền text. Bạn hãy tự kiểm tra và bấm nút Gửi trên Perplexity nhé.");

        // KHÔNG TỰ ĐỘNG BẤM NÚT GỬI CỦA PERPLEXITY ĐỂ TRÁNH VI PHẠM
        // Trả nút về trạng thái chờ
        btnFillPe.style.backgroundColor = '#0F172A';
        btnFillPe.style.color = '#64748B';
        btnFillPe.style.border = '1px solid #334155';
        btnFillPe.style.cursor = 'not-allowed';
        btnFillPe.innerHTML = `<span style="margin-right: 6px;">🤖</span> Chờ AN làm việc...`;
        btnFillPe.disabled = true;
    }

    // --- SỰ KIỆN NÚT BẤM (PE <- AN) ---
    btnFillPe.addEventListener('click', () => {
        if (!btnFillPe.disabled) {
            fillChatbox(lastAnReportMessage || "PE đọc Bridge.");
        }
    });

    btnManualFill.addEventListener('click', () => {
        const text = prompt("Nhập nội dung muốn gửi cho PE (mặc định: PE đọc Bridge.):", "PE đọc Bridge.");
        if (text) {
            fillChatbox(text);
        }
    });

})();
