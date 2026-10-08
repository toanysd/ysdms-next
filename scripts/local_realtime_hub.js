/**
 * PE-AN Local Realtime Hub (SSE + Webhook)
 * Dự án: YSDMS NextGen & OmniLinguist
 * Mục đích: Cầu nối thời gian thực giữa Perplexity (trình duyệt) và Antigravity (máy cục bộ).
 * Tuân thủ Quy Tắc Quản Lý Cổng Mạng: Tự động chuyển cổng (EADDRINUSE + 1), bind 127.0.0.1.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const START_PORT = 3456;
const HOST = '127.0.0.1';
const ROOT_DIR = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');

if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
}

let activePort = START_PORT;
let sseClients = [];
let lastDirectiveId = '';
let lastDirectiveTime = 0;

// Helper: Gửi phản hồi CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Helper: Phát âm thanh Windows
function playSystemAlert() {
    try {
        if (process.platform === 'win32') {
            exec('powershell -Command "[console]::beep(880, 250)"', () => {});
        }
    } catch (e) {}
}

// Xử lý Request
const server = http.createServer((req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

    // 1. Trạng thái Server
    if (url.pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            port: activePort,
            sseClients: sseClients.length,
            time: new Date().toISOString()
        }));
        return;
    }

    // 2. Kênh SSE Realtime (Trình duyệt kết nối vào để nhận tin tức thời từ AN)
    if (url.pathname === '/api/events' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', port: activePort })}\n\n`);
        sseClients.push(res);
        console.log(`[SSE] 🌐 Tab Perplexity đã kết nối Realtime. Tổng clients: ${sseClients.length}`);

        req.on('close', () => {
            sseClients = sseClients.filter(c => c !== res);
            console.log(`[SSE] 🔌 Tab đã ngắt kết nối. Còn lại: ${sseClients.length}`);
        });
        return;
    }

    // 3. Webhook: PE ➔ AN (Trình duyệt báo có chỉ thị mới từ PE trên Supabase)
    if (url.pathname === '/api/directive' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const threadId = data.threadId || 'WO-P1-004';
                const messageId = data.messageId || 'unknown';
                const messageType = data.messageType || 'DIRECTIVE';
                const directiveText = data.directiveText || '';

                const now = Date.now();
                if (messageId === lastDirectiveId && (now - lastDirectiveTime < 5000)) {
                    console.log(`[REALTIME HUB] ⏳ Bỏ qua thông báo trùng lặp trong 5 giây (${messageId})`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Bỏ qua trùng lặp' }));
                    return;
                }
                lastDirectiveId = messageId;
                lastDirectiveTime = now;

                console.log(`\n=======================================================`);
                console.log(`[REALTIME HUB] ⚡ NHẬN CHỈ THỊ MỚI TỪ PE TRÊN SUPABASE!`);
                console.log(`Thread     : ${threadId}`);
                console.log(`Loại tin   : ${messageType}`);
                console.log(`Message ID : ${messageId}`);
                console.log(`Thời gian  : ${new Date().toLocaleTimeString()}`);
                console.log(`-------------------------------------------------------`);
                console.log(directiveText.slice(0, 300) + (directiveText.length > 300 ? '...' : ''));
                console.log(`=======================================================\n`);

                // Lưu vào .agents/PE_INBOX_LATEST.md và PE_INBOX_LATEST.json
                const inboxMdPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md');
                const inboxJsonPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json');

                const mdContent = `# PE DIRECTIVE (SUPABASE SSOT)

- **Thread ID:** \`${threadId}\`
- **Message ID:** \`${messageId}\`
- **Message Type:** \`${messageType}\`
- **Received At:** \`${new Date().toISOString()}\`
- **Origin:** Supabase public.pe_an_messages via Realtime Hub

---

### Nội Dung Chỉ Thị:
${directiveText}
`;
                fs.writeFileSync(inboxMdPath, mdContent, 'utf8');
                fs.writeFileSync(inboxJsonPath, JSON.stringify({
                    threadId,
                    messageId,
                    messageType,
                    receivedAt: new Date().toISOString(),
                    directiveText
                }, null, 2), 'utf8');

                playSystemAlert();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    savedTo: inboxMdPath,
                    message: 'Đã nhận thông báo chỉ thị từ Supabase thành công!'
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 4. Webhook: AN ➔ PE (AN thi công xong, gửi báo cáo để trình duyệt chuyển sang CHẤM XANH)
    if (url.pathname === '/api/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const threadId = data.threadId || 'WO-P1-004';

                console.log(`\n=======================================================`);
                console.log(`[REALTIME HUB] 🔔 AN ĐÃ NỘP BÁO CÁO LÊN SUPABASE (${threadId})!`);
                console.log(`Bắn tín hiệu SSE để trình duyệt chuyển CHẤM XANH & sáng nút Điền vào PE...`);
                console.log(`=======================================================\n`);

                // Phát tín hiệu SSE cho tất cả các tab Perplexity đang mở
                const ssePayload = JSON.stringify({
                    type: 'AN_REPORT_DONE',
                    threadId: threadId,
                    message: data.pingMessage || 'PE đọc Bridge.',
                    timestamp: new Date().toISOString()
                });

                sseClients.forEach(client => {
                    client.write(`data: ${ssePayload}\n\n`);
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    broadcastedTo: sseClients.length
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end();
});

// Cơ chế tự động chuyển cổng EADDRINUSE (port + 1)
function startServer(port) {
    activePort = port;
    server.listen(port, HOST, () => {
        console.log(`=======================================================`);
        console.log(`🚀 PE-AN Realtime Hub đã khởi chạy thành công!`);
        console.log(`👉 Cổng hoạt động: http://${HOST}:${port}`);
        console.log(`👉 SSE Endpoint : http://${HOST}:${port}/api/events`);
        console.log(`👉 Directive API: http://${HOST}:${port}/api/directive`);
        console.log(`👉 Report API   : http://${HOST}:${port}/api/report`);
        console.log(`=======================================================`);

        // Ghi lại cổng hoạt động ra file để client tự nhận diện
        fs.writeFileSync(path.join(AGENTS_DIR, 'hub_port.json'), JSON.stringify({ port, host: HOST }), 'utf8');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`[WARN] Cổng ${port} đã bị chiếm dụng. Đang tự động nâng lên cổng ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(`[ERROR] Lỗi khởi động server:`, err);
        }
    });
}

// Giữ kết nối SSE không bị timeout
setInterval(() => {
    sseClients.forEach(client => {
        client.write(`:keepalive\n\n`);
    });
}, 15000);

startServer(START_PORT);
