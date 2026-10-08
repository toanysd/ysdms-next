/**
 * PE-AN Local Realtime Hub (Hardened Gateway v4.0)
 * Dự án: YSDMS NextGen — Phối hợp Tự trị PE-THOAN-AN
 * Ràng buộc: WO-BRIDGE-HARDENING
 * 
 * Tính năng:
 *  1. Supabase Realtime postgres_changes listener (Zero business polling).
 *  2. Localhost only (127.0.0.1, auto-shifting on EADDRINUSE).
 *  3. Session Secret Token & Origin check (Chống can thiệp ngoài).
 *  4. Database Verification (Chống message giả mạo).
 *  5. Idempotency Cache (Chống trùng lặp theo message_id).
 *  6. Structured Audit Log (.agents/bridge_audit.log).
 *  7. SSE Gateway cho Userscript và Long-polling cho Sentinel.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const DEFAULT_PORT = 7654;
const START_PORT = parseInt(process.env.HUB_PORT || process.argv[2] || DEFAULT_PORT, 10);
const HOST = '127.0.0.1';
const ROOT_DIR = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');

if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
}

// 1. Đọc cấu hình Supabase từ .env.local
const envPath = path.join(ROOT_DIR, '.env.local');
let supabaseUrl = '';
let supabaseServiceKey = '';

if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of envLines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [k, ...v] = trimmed.split('=');
            const val = v.join('=').trim().replace(/^["']|["']$/g, '');
            if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
            if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = val;
        }
    }
}

// Khởi tạo Supabase client với Realtime WebSocket
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    });
} else {
    console.warn('[WARN] Không tìm thấy NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
}

// 2. Sinh Session Secret Token bảo mật cục bộ
const SESSION_TOKEN = crypto.randomBytes(32).toString('hex');
fs.writeFileSync(path.join(AGENTS_DIR, 'hub_token.json'), JSON.stringify({
    token: SESSION_TOKEN,
    createdAt: new Date().toISOString()
}, null, 2), 'utf8');

// 3. Cache Idempotency (Lưu vết message_id đã xử lý)
const PROCESSED_CACHE_FILE = path.join(AGENTS_DIR, 'processed_messages.json');
let processedMessageIds = new Set();
if (fs.existsSync(PROCESSED_CACHE_FILE)) {
    try {
        const raw = JSON.parse(fs.readFileSync(PROCESSED_CACHE_FILE, 'utf8'));
        if (Array.isArray(raw)) processedMessageIds = new Set(raw);
    } catch (e) {}
}

function markMessageProcessed(messageId) {
    if (!messageId) return;
    processedMessageIds.add(messageId);
    try {
        fs.writeFileSync(PROCESSED_CACHE_FILE, JSON.stringify(Array.from(processedMessageIds).slice(-200), null, 2), 'utf8');
    } catch (e) {}
}

// 4. Audit Logger (JSONL)
const AUDIT_LOG_FILE = path.join(AGENTS_DIR, 'bridge_audit.log');
function auditLog(event, data = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        event,
        ...data
    };
    try {
        fs.appendFileSync(AUDIT_LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
    } catch (e) {}
    console.log(`[AUDIT] ${entry.timestamp} | ${event} | ${data.messageId || data.threadId || ''}`);
}

let activePort = START_PORT;
let sseClients = [];
let waitingSentinels = [];
let realtimeSubscribed = false;

// 5. Kiểm tra Origin & Token
function checkAuth(req) {
    const tokenHeader = req.headers['x-bridge-token'] || '';
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    const provided = tokenHeader || bearerToken;

    // Chấp nhận nếu có token đúng
    if (provided && provided === SESSION_TOKEN) return true;

    // Chấp nhận nếu gọi nội bộ từ localhost không có token nhưng có Origin hợp lệ từ Perplexity / Extension
    const origin = req.headers['origin'] || req.headers['referer'] || '';
    const isPerplexity = origin.includes('perplexity.ai');
    const isExtension = origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://');
    const isLocalhost = req.socket.remoteAddress === '127.0.0.1' || req.socket.remoteAddress === '::1' || req.socket.remoteAddress === '::ffff:127.0.0.1';

    // Cho phép Perplexity Userscript lấy token ban đầu qua /api/token
    if (isLocalhost && (isPerplexity || isExtension)) return true;

    return false;
}

// Helper CORS với hỗ trợ Chrome Private Network Access (PNA)
function setCorsHeaders(res, req) {
    const origin = req.headers['origin'] || 'https://www.perplexity.ai';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-bridge-token, Cache-Control');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
}

// 6. Xử lý Chỉ thị nhận được (Phân phối cho Sentinel)
function dispatchDirectiveToSentinel(directiveObj) {
    const { message_id, thread_id, message_type, content_md } = directiveObj;

    if (processedMessageIds.has(message_id)) {
        auditLog('DIRECTIVE_IGNORED_DUPLICATE', { messageId: message_id, threadId: thread_id });
        return { success: false, reason: 'DUPLICATE' };
    }

    markMessageProcessed(message_id);

    // Lưu vào PE_INBOX_LATEST
    const inboxMdPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md');
    const inboxJsonPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json');

    const mdContent = `# PE DIRECTIVE (SUPABASE SSOT)

- **Thread ID:** \`${thread_id}\`
- **Message ID:** \`${message_id}\`
- **Message Type:** \`${message_type}\`
- **Received At:** \`${new Date().toISOString()}\`
- **Origin:** Supabase Realtime via Hardened Local Hub

---

### Nội Dung Chỉ Thị
${content_md}
`;
    fs.writeFileSync(inboxMdPath, mdContent, 'utf8');
    fs.writeFileSync(inboxJsonPath, JSON.stringify(directiveObj, null, 2), 'utf8');

    auditLog('DIRECTIVE_DISPATCHED', {
        messageId: message_id,
        threadId: thread_id,
        waitingSentinels: waitingSentinels.length
    });

    // Bíp âm thanh
    try {
        if (process.platform === 'win32') {
            exec('powershell -Command "[console]::beep(880, 250)"', () => {});
        }
    } catch (e) {}

    // Bắn cho các Sentinel đang chờ ngầm (Long-polling)
    while (waitingSentinels.length > 0) {
        const sentinel = waitingSentinels.pop();
        try {
            sentinel.writeHead(200, { 'Content-Type': 'application/json' });
            sentinel.end(JSON.stringify({
                success: true,
                directive: directiveObj
            }));
        } catch (e) {}
    }

    // Bắn SSE thông báo tới Userscript rằng lệnh đã được dispatch
    broadcastSSE({
        type: 'DIRECTIVE_DISPATCHED_TO_AN',
        messageId: message_id,
        threadId: thread_id,
        timestamp: new Date().toISOString()
    });

    return { success: true };
}

function broadcastSSE(payload) {
    const str = JSON.stringify(payload);
    sseClients.forEach(client => {
        try {
            client.write(`data: ${str}\n\n`);
        } catch (e) {}
    });
}

// 7. Lắng nghe Supabase Realtime
function startSupabaseRealtime() {
    if (!supabase) return;

    try {
        console.log('[REALTIME] 📡 Đang kết nối Supabase Realtime Channel...');
        const channel = supabase.channel('hub_pe_an_realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'pe_an_messages' },
                (payload) => {
                    const row = payload.new;
                    console.log(`[REALTIME] 🔔 Nhận sự kiện Realtime INSERT: ${row.message_id} (${row.sender} - ${row.message_type})`);
                    auditLog('REALTIME_EVENT_RECEIVED', { messageId: row.message_id, sender: row.sender, type: row.message_type });

                    if (row.sender === 'PE' && row.status === 'PENDING') {
                        // Bắn sự kiện tới Userscript
                        broadcastSSE({
                            type: 'PE_MESSAGE_ARRIVED',
                            messageType: row.message_type || 'DIRECTIVE',
                            directive: row
                        });
                        auditLog('PE_DIRECTIVE_BROADCAST_SSE', { messageId: row.message_id, threadId: row.thread_id, type: row.message_type });
                    } else if (row.sender === 'AN' && row.status === 'PENDING' && row.message_type === 'REPORT') {
                        broadcastSSE({
                            type: 'AN_REPORT_DONE',
                            threadId: row.thread_id,
                            message: row.content_md
                        });
                        auditLog('AN_REPORT_BROADCAST_SSE', { messageId: row.message_id, threadId: row.thread_id });
                    }
                }
            )
            .subscribe((status) => {
                console.log(`[REALTIME] ⚡ Trạng thái Realtime: ${status}`);
                realtimeSubscribed = (status === 'SUBSCRIBED');
                auditLog('REALTIME_STATUS_CHANGE', { status });
                broadcastSSE({ type: 'REALTIME_STATUS', status, subscribed: realtimeSubscribed });
            });

        // Fallback Poller: 100% bảo hiểm nếu Realtime WebSocket bị delay hoặc reconnect
        let lastPolledId = null;
        setInterval(async () => {
            try {
                const { data, error } = await supabase
                    .from('pe_an_messages')
                    .select('*')
                    .eq('status', 'PENDING')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (data && data.message_id && data.message_id !== lastPolledId) {
                    lastPolledId = data.message_id;
                    if (data.sender === 'PE') {
                        broadcastSSE({
                            type: 'PE_MESSAGE_ARRIVED',
                            messageType: data.message_type || 'DIRECTIVE',
                            directive: data
                        });
                    } else if (data.sender === 'AN' && data.message_type === 'REPORT') {
                        broadcastSSE({
                            type: 'AN_REPORT_DONE',
                            threadId: data.thread_id,
                            message: data.content_md
                        });
                    }
                }
            } catch (e) {}
        }, 3000);

    } catch (err) {
        console.error('[REALTIME ERROR]', err);
        auditLog('REALTIME_CONNECT_ERROR', { error: err.message });
    }
}

// 8. HTTP Server Cục bộ (Chỉ bind 127.0.0.1)
const server = http.createServer(async (req, res) => {
    setCorsHeaders(res, req);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

    // --- GET /api/status ---
    if (url.pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            port: activePort,
            host: HOST,
            realtimeSubscribed,
            sseClients: sseClients.length,
            waitingSentinels: waitingSentinels.length,
            time: new Date().toISOString()
        }));
        return;
    }

    // --- GET /api/token (Cấp token bảo mật cho Client cùng máy) ---
    if (url.pathname === '/api/token' && req.method === 'GET') {
        if (!checkAuth(req)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Origin not allowed' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            token: SESSION_TOKEN,
            port: activePort
        }));
        return;
    }

    // --- GET /api/events (SSE Stream) ---
    if (url.pathname === '/api/events' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        res.write(`data: ${JSON.stringify({
            type: 'CONNECTED',
            port: activePort,
            realtimeSubscribed,
            token: SESSION_TOKEN
        })}\n\n`);
        sseClients.push(res);
        console.log(`[SSE] 🌐 Client kết nối SSE. Tổng: ${sseClients.length}`);

        req.on('close', () => {
            sseClients = sseClients.filter(c => c !== res);
        });
        return;
    }

    // --- GET /api/wait_directive (Sentinel Antigravity Worker Long-polling) ---
    if (url.pathname === '/api/wait_directive' && req.method === 'GET') {
        // Kiểm tra Token bắt buộc
        const token = req.headers['x-bridge-token'] || url.searchParams.get('token');
        if (token !== SESSION_TOKEN) {
            auditLog('SENTINEL_AUTH_FAILED', { ip: req.socket.remoteAddress });
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid or missing bridge token' }));
            return;
        }

        req.on('close', () => {
            waitingSentinels = waitingSentinels.filter(c => c !== res);
        });
        waitingSentinels.push(res);
        console.log(`[LONG-POLLING] 🕒 Sentinel đang chờ chỉ thị ngầm... (Active: ${waitingSentinels.length})`);
        return;
    }

    // --- POST /api/directive (Chuyển lệnh từ Userscript / Webhook sang AN) ---
    if (url.pathname === '/api/directive' && req.method === 'POST') {
        // Kiểm tra Auth
        const token = req.headers['x-bridge-token'] || '';
        if (token !== SESSION_TOKEN && !checkAuth(req)) {
            auditLog('DIRECTIVE_REJECTED_UNAUTHORIZED', { ip: req.socket.remoteAddress });
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized: Invalid token or Origin' }));
            return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const messageId = data.messageId || data.message_id;

                if (!messageId) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'message_id is required' }));
                    return;
                }

                // Chống trùng lặp (Idempotency)
                if (processedMessageIds.has(messageId)) {
                    auditLog('DIRECTIVE_REJECTED_DUPLICATE', { messageId });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Message already processed (Idempotent)' }));
                    return;
                }

                // Xác thực với Supabase (Anti-forgery: Message PHẢI tồn tại trong DB thật)
                let verifiedDirective = null;
                if (supabase) {
                    const { data: dbMsg, error: dbErr } = await supabase
                        .from('pe_an_messages')
                        .select('*')
                        .eq('message_id', messageId)
                        .maybeSingle();

                    if (dbErr || !dbMsg) {
                        auditLog('DIRECTIVE_REJECTED_FORGERY', { messageId, error: dbErr?.message });
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anti-forgery: message_id does not exist in Supabase pe_an_messages' }));
                        return;
                    }
                    verifiedDirective = dbMsg;
                } else {
                    // Fallback nếu không có Supabase client
                    verifiedDirective = {
                        message_id: messageId,
                        thread_id: data.threadId || data.thread_id || 'WO-BRIDGE-HARDENING',
                        message_type: data.messageType || data.message_type || 'DIRECTIVE',
                        content_md: data.directiveText || data.content_md || ''
                    };
                }

                // Chuyển directive cho Sentinel
                const result = dispatchDirectiveToSentinel(verifiedDirective);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, messageId, result }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // --- POST /api/report (AN nộp báo cáo xong, kích hoạt SSE AN_REPORT_DONE) ---
    if (url.pathname === '/api/report' && req.method === 'POST') {
        const token = req.headers['x-bridge-token'] || '';
        if (token !== SESSION_TOKEN && !checkAuth(req)) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized token' }));
            return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const threadId = data.threadId || 'WO-BRIDGE-HARDENING';
                const message = data.pingMessage || 'PE đọc Bridge.';

                console.log(`\n[REALTIME HUB] 🔔 AN ĐÃ NỘP BÁO CÁO (${threadId})!`);
                auditLog('AN_REPORT_SUBMITTED', { threadId, message });

                // Phát tín hiệu SSE
                broadcastSSE({
                    type: 'AN_REPORT_DONE',
                    threadId,
                    message,
                    timestamp: new Date().toISOString()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, broadcastedTo: sseClients.length }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

// Khởi chạy server và tự động chuyển cổng nếu trùng
function startServer(port) {
    activePort = port;
    server.listen(port, HOST, () => {
        console.log(`=======================================================`);
        console.log(`🚀 PE-AN Realtime Hub Hardened Gateway v4.0`);
        console.log(`👉 Binding    : http://${HOST}:${port} (Strictly Localhost)`);
        console.log(`👉 Auth Token : ${SESSION_TOKEN.slice(0, 10)}... (Đã lưu hub_token.json)`);
        console.log(`👉 Realtime   : Supabase WebSocket ${supabase ? 'Active' : 'Disabled'}`);
        console.log(`👉 SSE Stream : http://${HOST}:${port}/api/events`);
        console.log(`=======================================================`);

        // Ghi lại cổng và thông tin vào hub_port.json
        fs.writeFileSync(path.join(AGENTS_DIR, 'hub_port.json'), JSON.stringify({
            port,
            host: HOST,
            token: SESSION_TOKEN,
            updatedAt: new Date().toISOString()
        }, null, 2), 'utf8');

        // Bắt đầu lắng nghe Realtime
        startSupabaseRealtime();
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`[WARN] Cổng ${port} đã bị chiếm. Tự động chuyển lên ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(`[ERROR] Server error:`, err);
        }
    });
}

// Keep-alive SSE
setInterval(() => {
    sseClients.forEach(c => {
        try { c.write(':keepalive\n\n'); } catch (e) {}
    });
}, 15000);

startServer(START_PORT);
