/**
 * [v2.7.0] YSDMS NEXTGEN REALTIME BRIDGE HUB (Turn-Guard & Smart Editor Edition)
 * ------------------------------------------------
 * Cầu nối thời gian thực giữa Perplexity Web UI (PE) và Antigravity (AN)
 * dành riêng 100% cho dự án YSDMS NextGen.
 * 
 * Tuân thủ kỷ luật:
 * - Bind 127.0.0.1 (không lộ ra mạng ngoài).
 * - Cổng bắt đầu 3856 (tránh xa cổng 3000/5000/8000/8080).
 * - Tự động nhảy cổng port + 1 khi gặp EADDRINUSE.
 * - Idempotency cache chống duplicate directive.
 * - Xác thực SSOT với bảng public.pe_an_messages trên Supabase.
 * - Ranh giới bảo mật: chỉ ghi bảng pe_an_messages, tuyệt đối không đụng chạm dữ liệu nghiệp vụ.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec, spawn, execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');
const DATA_DIR = path.join(__dirname, 'data');
const PROCESSED_CACHE_FILE = path.join(AGENTS_DIR, 'bridge_processed_ids.json');
const DISPATCH_LEDGER_FILE = path.join(DATA_DIR, 'pe_dispatch_ledger.json');
const CORRELATION_LEDGER_FILE = path.join(DATA_DIR, 'pe_report_correlation.json');
const HANDOFF_LEDGER_FILE = path.join(DATA_DIR, 'pe_handoff_ledger.json');
const START_PORT = parseInt(process.env.YSDMS_BRIDGE_PORT || process.argv[2] || '3856', 10);
const HOST = '127.0.0.1';
const MAX_PORT_TRIES = 30;
const HUB_VERSION = 'v2.7.0';

// Đảm bảo các thư mục cần thiết tồn tại
[AGENTS_DIR, DATA_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Nạp biến môi trường từ .env.local / .env
function loadEnv() {
    const candidates = [
        path.join(ROOT_DIR, '.env.local'),
        path.join(ROOT_DIR, '.env'),
        path.join(__dirname, '.env')
    ];
    const env = {};
    for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf8').split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const [k, ...v] = trimmed.split('=');
                    const key = k.trim();
                    if (!env[key]) {
                        env[key] = v.join('=').trim().replace(/^["']|["']$/g, '');
                    }
                }
            }
        }
    }
    return env;
}

const ENV = loadEnv();
const SUPABASE_URL = (ENV.NEXT_PUBLIC_SUPABASE_URL || ENV.VITE_SUPABASE_URL || ENV.SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_KEY = ENV.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_ANON_KEY || ENV.SUPABASE_ANON_KEY || '';
const ACTIVE_KEY = SERVICE_KEY || ANON_KEY;

async function updateSupabaseMessageStatus(messageId, newStatus = 'CONSUMED') {
    if (!messageId || !SUPABASE_URL || !ACTIVE_KEY) return false;
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/pe_an_messages?message_id=eq.${encodeURIComponent(messageId)}`, {
            method: 'PATCH',
            headers: {
                'apikey': ACTIVE_KEY,
                'Authorization': `Bearer ${ACTIVE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ status: newStatus })
        });
        return res.ok;
    } catch (e) {
        console.warn('[SUPABASE STATUS] Lỗi cập nhật status:', e.message);
        return false;
    }
}

// 2. Quản lý bộ nhớ Idempotency Cache
function getProcessedDirectives() {
    if (!fs.existsSync(PROCESSED_CACHE_FILE)) return [];
    try {
        const data = JSON.parse(fs.readFileSync(PROCESSED_CACHE_FILE, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function markDirectiveProcessed(messageId) {
    if (!messageId) return;
    const processed = getProcessedDirectives();
    if (!processed.includes(messageId)) {
        processed.push(messageId);
        if (processed.length > 200) processed.shift();
        fs.writeFileSync(PROCESSED_CACHE_FILE, JSON.stringify(processed, null, 2), 'utf8');
    }
}

// 2.1. CÁC QUY TẮC RÀO CHẮN NGHIÊM NGẶT DÀNH CHO PE DIRECTIVE (PE AUDIT REQUIREMENTS)
const ALLOWED_THREAD_PREFIXES = [
    'YSDMS-', 'AUTH-', 'PROD-', 'CYCLE-', 'TEST-', 'ARCHITECTURE-',
    'WO-', 'BRIDGE-', 'GENERAL', 'DEFAULT', 'M18-', 'M19-', 'P0-', 'P1-', 'P2-'
];

function isValidBridgeThread(threadId) {
    if (!threadId || typeof threadId !== 'string') return false;
    const tid = threadId.toUpperCase().trim();
    if (!tid || tid.startsWith('OMNI-')) return false;
    return ALLOWED_THREAD_PREFIXES.some(p => tid.startsWith(p)) || tid.length >= 3;
}

function isEchoBackContent(content) {
    if (!content || typeof content !== 'string') return false;
    const text = content.trim().toLowerCase();
    if (
        text.startsWith('[v2.7.0] pe đọc bridge') ||
        text.startsWith('[v2.6.0] pe đọc bridge') ||
        text.startsWith('[v2.5.0] pe đọc bridge') ||
        text.startsWith('pe đọc bridge.') ||
        text.startsWith('pe doc bridge.') ||
        text.includes('📌 báo cáo mới từ an đã lưu trên supabase') ||
        text.includes('đề nghị pe dùng @supabase đọc toàn văn bản ghi')
    ) {
        return true;
    }
    if (text.length < 700 && (
        text.includes('an đã nộp báo cáo nghiệm thu vào bảng') ||
        text.includes('kinh moi pe tham dinh va phan hoi tiep theo') ||
        text.includes('kính mời pe thẩm định và phản hồi tiếp theo')
    )) {
        return true;
    }
    return false;
}

function requiresThoanApprovalFirst(content) {
    if (!content || typeof content !== 'string') return false;
    const lower = content.toLowerCase();
    return (
        lower.includes('chờ thoan chốt') ||
        lower.includes('chờ anh thoan chốt') ||
        lower.includes('chờ minh chủ thoan') ||
        lower.includes('chờ thoan duyệt') ||
        lower.includes('đợi thoan chốt') ||
        lower.includes('đợi thoan duyệt') ||
        lower.includes('chờ quyết định từ thoan') ||
        lower.includes('chờ quyết định của thoan') ||
        lower.includes('kính trình minh chủ thoan quyết định')
    );
}

function isDirectiveTargetingAn(content) {
    if (!content || typeof content !== 'string') return false;
    const text = content.trim();
    if (text.length < 50) return false; // Không dispatch các tin ping ngắn

    const upper = text.toUpperCase();
    if (upper === 'PE ĐỌC BRIDGE.' || upper === 'PE DOC BRIDGE.' || upper === 'PING BRIDGE.') return false;
    if (upper.startsWith('PING') && upper.length < 40) return false;

    // Loại trừ triệt để tin nhắn dội ngược (Echo back) từ prompt của AN/User
    if (isEchoBackContent(text)) {
        return false;
    }

    // Khi PE yêu cầu Minh Chủ THOAN chốt/duyệt trước -> Tạm dừng chờ THOAN ra quyết định
    if (requiresThoanApprovalFirst(text)) {
        return false;
    }

    // AN có năng lực tư duy độc lập để tự đọc hiểu toàn bộ chỉ thị / trao đổi kỹ thuật từ PE.
    // Không áp đặt bộ lọc từ khóa hạn hẹp làm tắc nghẽn luồng.
    return true;
}

// 2.2. Persistent Dispatch Ledger (Lưu trữ bền vững qua restart Hub)
function getDispatchLedger() {
    if (!fs.existsSync(DISPATCH_LEDGER_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(DISPATCH_LEDGER_FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveDispatchLedger(ledger) {
    try {
        fs.writeFileSync(DISPATCH_LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
    } catch (e) {
        console.warn('[HUB LEDGER] Lỗi lưu dispatch ledger:', e.message);
    }
}

function isRowAlreadyDispatchedOrAcked(messageId) {
    if (!messageId) return false;
    const ledger = getDispatchLedger();
    if (ledger[messageId]) return true;

    // Đối chiếu thêm với bộ nhớ cache ID
    const processed = getProcessedDirectives();
    if (processed.includes(messageId)) return true;

    // Đối chiếu với file audit ACK
    const ackFile = path.join(DATA_DIR, 'bridge_ack_audit.json');
    if (fs.existsSync(ackFile)) {
        try {
            const aLogs = JSON.parse(fs.readFileSync(ackFile, 'utf8'));
            if (Array.isArray(aLogs) && aLogs.some(a => a.peMessageId === messageId)) {
                return true;
            }
        } catch {}
    }

    return false;
}

function recordDispatchedDirective(row) {
    const ledger = getDispatchLedger();
    const hash = crypto.createHash('sha256').update(row.content_md || '').digest('hex');
    ledger[row.id] = {
        messageId: row.id,
        threadId: row.thread_id,
        dispatchedAt: new Date().toISOString(),
        contentHash: hash,
        status: 'DISPATCHED',
        ackAt: null
    };
    saveDispatchLedger(ledger);
    markDirectiveProcessed(row.id);
}

function markLedgerAcked(messageId, ackTimestamp, worker) {
    if (!messageId) return;
    const ledger = getDispatchLedger();
    if (ledger[messageId]) {
        ledger[messageId].status = 'ACKNOWLEDGED';
        ledger[messageId].ackAt = ackTimestamp || new Date().toISOString();
        ledger[messageId].worker = worker || 'AN';
        saveDispatchLedger(ledger);
    }
}

// 2.2b. Event Ledger phục vụ kiểm toán handoff hai chiều (BRIDGE-END-TO-END-HANDOFF-REPAIR-001)
function getHandoffLedger() {
    if (!fs.existsSync(HANDOFF_LEDGER_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(HANDOFF_LEDGER_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveHandoffLedger(ledger) {
    try {
        fs.writeFileSync(HANDOFF_LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
    } catch (e) {
        console.warn('[HUB HANDOFF LEDGER] Lỗi lưu handoff ledger:', e.message);
    }
}

function recordHandoffEvent(event) {
    const ledger = getHandoffLedger();
    const entry = {
        workflowId: event.workflowId || `wf-${Date.now()}`,
        requestId: event.requestId || `req-${Date.now()}`,
        handoffType: event.handoffType, // 'PE_TO_AN' hoặc 'AN_TO_PE'
        sourceRowId: event.sourceRowId,
        sourceCreatedAt: event.sourceCreatedAt || new Date().toISOString(),
        detectedAt: event.detectedAt || new Date().toISOString(),
        dispatchedAt: event.dispatchedAt || null,
        acknowledgedAt: event.acknowledgedAt || null,
        deliveredTo: event.deliveredTo || null,
        retryCount: event.retryCount || 0,
        finalState: event.finalState || 'DETECTED', // 'DETECTED' | 'DISPATCHED' | 'WAITING_FOR_AN_ACK' | 'ACKNOWLEDGED' | 'DELIVERED' | 'TIMEOUT' | 'FAILED'
        failureReason: event.failureReason || null
    };

    const idx = ledger.findIndex(e => e.sourceRowId === entry.sourceRowId || (entry.requestId && e.requestId === entry.requestId));
    if (idx >= 0) {
        ledger[idx] = { ...ledger[idx], ...entry };
    } else {
        ledger.push(entry);
    }
    if (ledger.length > 200) ledger.splice(0, ledger.length - 200);
    saveHandoffLedger(ledger);
    return entry;
}

function updateHandoffEvent(key, updates) {
    if (!key) return null;
    const ledger = getHandoffLedger();
    const entry = ledger.find(e => e.sourceRowId === key || e.requestId === key || e.workflowId === key);
    if (entry) {
        Object.assign(entry, updates);
        saveHandoffLedger(ledger);
        return entry;
    }
    return null;
}

// 2.3. Quản lý tương quan Báo Cáo AN ⟷ Phản Hồi PE (BRIDGE-PENDING-REPORT-CORRELATION-001)
function getCorrelationLedger() {
    if (!fs.existsSync(CORRELATION_LEDGER_FILE)) {
        return { reports: {}, consumed: {} };
    }
    try {
        const data = JSON.parse(fs.readFileSync(CORRELATION_LEDGER_FILE, 'utf8'));
        if (!data.reports) data.reports = {};
        if (!data.consumed) data.consumed = {};
        return data;
    } catch {
        return { reports: {}, consumed: {} };
    }
}

function saveCorrelationLedger(ledger) {
    try {
        fs.writeFileSync(CORRELATION_LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
    } catch (e) {
        console.warn('[HUB CORRELATION] Lỗi lưu correlation ledger:', e.message);
    }
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

function registerAnReport(row) {
    if (!row || !row.id) return;
    const ledger = getCorrelationLedger();
    if (ledger.reports[row.id]) return;

    ledger.reports[row.id] = {
        reportId: row.id,
        threadId: row.thread_id,
        workOrderId: extractWorkOrderId(row.content_md),
        createdAt: row.created_at || new Date().toISOString(),
        status: 'PENDING',
        handledBy: null,
        handledAt: null,
        peResponseId: null,
        inReplyTo: null
    };
    saveCorrelationLedger(ledger);
}

function markReportHandled(anReportId, peMessageId, worker = 'PE', workOrderId = null) {
    const ledger = getCorrelationLedger();
    let targetId = anReportId;

    if (!targetId) {
        const pending = Object.values(ledger.reports).filter(r => r.status === 'PENDING');
        if (pending.length > 0) {
            targetId = pending[pending.length - 1].reportId;
        }
    }

    if (targetId) {
        if (!ledger.reports[targetId]) {
            ledger.reports[targetId] = {
                reportId: targetId,
                status: 'HANDLED',
                handledBy: worker,
                handledAt: new Date().toISOString(),
                peResponseId: peMessageId,
                workOrderId: workOrderId
            };
        } else {
            ledger.reports[targetId].status = 'HANDLED';
            ledger.reports[targetId].handledBy = worker;
            ledger.reports[targetId].handledAt = new Date().toISOString();
            ledger.reports[targetId].peResponseId = peMessageId;
            if (workOrderId) ledger.reports[targetId].workOrderId = workOrderId;
        }
        saveCorrelationLedger(ledger);
        console.log(`[HUB CORRELATION] 🔗 Đã đánh dấu report [${targetId}] là HANDLED bởi PE [${peMessageId}]`);
        return targetId;
    }
    return null;
}

function markReportConsumed(anReportId, by = 'USER_INJECTION') {
    if (!anReportId) return;
    const ledger = getCorrelationLedger();
    ledger.consumed[anReportId] = {
        consumedAt: new Date().toISOString(),
        by
    };
    if (ledger.reports[anReportId] && ledger.reports[anReportId].status === 'PENDING') {
        ledger.reports[anReportId].status = 'CONSUMED';
        ledger.reports[anReportId].consumedAt = new Date().toISOString();
    }
    saveCorrelationLedger(ledger);
    console.log(`[HUB CORRELATION] 📥 Đã đánh dấu report [${anReportId}] là CONSUMED bởi [${by}]`);
}

async function computeReportCorrelation(threadId) {
    const ledger = getCorrelationLedger();
    let latestAnRecord = null;
    let latestPeRecord = null;
    let recentRows = [];

    if (SUPABASE_URL && ACTIVE_KEY) {
        try {
            let endpoint = `${SUPABASE_URL}/rest/v1/pe_an_messages?select=message_id,thread_id,sender,message_type,content_md,status,created_at&order=created_at.desc&limit=15`;
            if (threadId) {
                endpoint += `&thread_id=eq.${encodeURIComponent(threadId)}`;
            }
            const sRes = await fetch(endpoint, {
                headers: {
                    'apikey': ACTIVE_KEY,
                    'Authorization': `Bearer ${ACTIVE_KEY}`
                }
            });
            if (sRes.ok) {
                recentRows = await sRes.json();
                if (Array.isArray(recentRows)) {
                    recentRows.forEach(r => {
                        if (r && !r.id && r.message_id) r.id = r.message_id;
                        if (r && !r.message_id && r.id) r.message_id = r.id;
                    });
                }
            }
        } catch (e) {
            console.warn('[HUB CORRELATION] Lỗi đọc Supabase:', e.message);
        }
    }

    if (Array.isArray(recentRows) && recentRows.length > 0) {
        latestAnRecord = recentRows.find(r => r.sender === 'AN') || null;
        latestPeRecord = recentRows.find(r => r.sender === 'PE' && !isEchoBackContent(r.content_md)) || null;
    }

    if (ledger.reports) {
        const matchingReports = Object.values(ledger.reports).filter(r => !threadId || r.threadId === threadId);
        if (matchingReports.length > 0) {
            matchingReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const top = matchingReports[0];
            if (!latestAnRecord || new Date(top.createdAt) > new Date(latestAnRecord.created_at)) {
                latestAnRecord = {
                    id: top.reportId,
                    thread_id: top.threadId,
                    sender: 'AN',
                    content_md: top.workOrderId || '',
                    created_at: top.createdAt
                };
            }
        }
    }

    if (!latestAnRecord) {
        return {
            threadId,
            hasPendingReport: false,
            pendingAnReport: false,
            latestReport: null,
            status: 'IDLE',
            turnState: 'IDLE',
            nextActor: 'NONE'
        };
    }

    const reportId = latestAnRecord.id;
    const workOrderId = extractWorkOrderId(latestAnRecord.content_md);
    registerAnReport(latestAnRecord);

    let isHandled = false;
    let handledBy = null;
    let handledAt = null;
    let peResponseId = null;

    // 1. Kiểm tra ledger
    if (ledger.reports[reportId] && ledger.reports[reportId].status === 'HANDLED') {
        isHandled = true;
        handledBy = ledger.reports[reportId].handledBy || 'PE';
        handledAt = ledger.reports[reportId].handledAt;
        peResponseId = ledger.reports[reportId].peResponseId;
    }

    // 2. Kiểm tra nếu có bản ghi PE tạo sau hoặc tham chiếu reportId
    if (!isHandled && latestPeRecord) {
        const peCreatedAt = new Date(latestPeRecord.created_at).getTime();
        const anCreatedAt = new Date(latestAnRecord.created_at).getTime();
        const mentionsReport = latestPeRecord.content_md && latestPeRecord.content_md.includes(reportId);
        const inReplyTo = extractInReplyTo(latestPeRecord.content_md);

        if (inReplyTo === reportId || mentionsReport || peCreatedAt > anCreatedAt) {
            isHandled = true;
            handledBy = 'PE';
            handledAt = latestPeRecord.created_at;
            peResponseId = latestPeRecord.id;
            markReportHandled(reportId, latestPeRecord.id, 'PE', workOrderId);
        }
    }

    // 3. Kiểm tra consumed & pending
    const isConsumed = !!ledger.consumed[reportId];
    const isPending = !isHandled; // Vẫn đang chờ PE phản hồi cho đến khi có PE directive thực sự
    // SINGLE-FLIGHT (v1.0.16): Báo cáo đã được đổ vào PE (CONSUMED) thì KHÔNG được quảng bá là
    // "chờ đổ vào PE" nữa — nếu không, vòng poll 3s của browser sẽ kích hoạt auto-submit lặp lại.
    const isAwaitingInjection = isPending && !isConsumed;

    return {
        threadId,
        reportId,
        hasPendingReport: isPending,
        pendingAnReport: isAwaitingInjection,
        awaitingPeReply: isPending && isConsumed,
        latestReport: {
            reportId,
            workOrderId,
            createdAt: latestAnRecord.created_at,
            status: isHandled ? 'HANDLED' : (isConsumed ? 'CONSUMED' : 'PENDING'),
            handledBy,
            handledAt: handledAt || (isHandled ? new Date().toISOString() : null),
            peResponseId,
            inReplyToMessageId: isHandled ? (peResponseId || reportId) : null
        },
        turnState: isPending ? 'PE_TURN' : 'AN_TURN',
        nextActor: isPending ? 'PE' : 'AN'
    };
}

let activePort = START_PORT;
let sseClients = [];

function isAllowedOrigin(origin) {
    if (!origin) return false;
    if (origin === 'https://www.perplexity.ai') return true;
    // Cho phép loopback 127.0.0.1 hoặc localhost với dải cổng dynamic của Hub (3956 - 3985) hoặc cổng cố định 28888
    const loopbackRegex = /^http:\/\/(127\.0\.0\.1|localhost):(38[5-8][0-9]|39[5-8][0-9]|28888)$/;
    return loopbackRegex.test(origin);
}

function isValidHostHeader(hostHeader) {
    if (!hostHeader) return false;
    const parts = hostHeader.split(':');
    const hostname = parts[0];
    const port = parts[1];
    const isLoopback = (hostname === '127.0.0.1' || hostname === 'localhost');
    if (!isLoopback) return false;
    if (port) {
        const p = parseInt(port, 10);
        if (isNaN(p)) return false;
        // Cho phép dải cổng dynamic của Hub (3856 - 3885 hoặc 3956 - 3985) hoặc 28888
        const isAllowedPort = (p >= 3856 && p <= 3885) || (p >= 3956 && p <= 3985) || p === 28888;
        if (!isAllowedPort) return false;
    }
    return true;
}

function setCorsHeaders(req, res) {
    const origin = req && req.headers ? req.headers.origin : null;
    if (origin && isAllowedOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // Local CLI calls or background scripts without browser Origin header
        res.setHeader('Access-Control-Allow-Origin', `http://127.0.0.1:${activePort}`);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-bridge-token');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
}

function playBeep(freq = 880, durationMs = 200) {
    if (process.platform === 'win32') {
        exec(`powershell -NoProfile -Command "[console]::beep(${freq}, ${durationMs})"`, () => {});
    }
}

function setWindowsClipboard(text) {
    if (!text || process.platform !== 'win32') return;
    try {
        const child = spawn('clip', [], { stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true });
        child.on('error', (err) => {
            console.warn('[HUB CLIPBOARD] Không thể gọi clip.exe:', err.message);
        });
        child.stdin.end(text);
    } catch (e) {
        console.warn('[HUB CLIPBOARD] Lỗi ghi clipboard Windows:', e.message);
    }
}

const convMetaCache = {};

function getOrSaveSharedAgentApiEnv() {
    const sharedEnvFile = path.join(process.env.USERPROFILE || '', '.gemini', 'antigravity', 'agentapi_env.json');
    if (process.env.ANTIGRAVITY_LS_ADDRESS && process.env.ANTIGRAVITY_CSRF_TOKEN) {
        try {
            fs.writeFileSync(sharedEnvFile, JSON.stringify({
                ANTIGRAVITY_LS_ADDRESS: process.env.ANTIGRAVITY_LS_ADDRESS,
                ANTIGRAVITY_CSRF_TOKEN: process.env.ANTIGRAVITY_CSRF_TOKEN,
                updatedAt: new Date().toISOString()
            }, null, 2), 'utf8');
        } catch {}
        return { ...process.env };
    }
    try {
        if (fs.existsSync(sharedEnvFile)) {
            const saved = JSON.parse(fs.readFileSync(sharedEnvFile, 'utf8'));
            if (saved && saved.ANTIGRAVITY_LS_ADDRESS && saved.ANTIGRAVITY_CSRF_TOKEN) {
                return {
                    ...process.env,
                    ANTIGRAVITY_LS_ADDRESS: saved.ANTIGRAVITY_LS_ADDRESS,
                    ANTIGRAVITY_CSRF_TOKEN: saved.ANTIGRAVITY_CSRF_TOKEN
                };
            }
        }
    } catch {}
    return { ...process.env };
}

// Tự động lưu cấu hình AgentAPI ngay khi Hub khởi động nếu chạy từ trong Antigravity
getOrSaveSharedAgentApiEnv();

function resolveWorkspaceConversationId(exe, childEnv, workspaceMatchStr) {
    const convIdFile = path.join(AGENTS_DIR, 'active_conversation_id.txt');
    let savedConvId = '';
    if (fs.existsSync(convIdFile)) {
        savedConvId = fs.readFileSync(convIdFile, 'utf8').trim();
    }

    try {
        const brainDir = path.join(process.env.USERPROFILE || '', '.gemini', 'antigravity', 'brain');
        if (!fs.existsSync(brainDir)) return savedConvId;

        const candidates = fs.readdirSync(brainDir).map(id => {
            const logPath = path.join(brainDir, id, '.system_generated', 'logs', 'transcript.jsonl');
            if (!fs.existsSync(logPath)) return null;
            try {
                const stat = fs.statSync(logPath);
                return { id, logPath, mtimeMs: stat.mtimeMs, size: stat.size };
            } catch {
                return null;
            }
        }).filter(Boolean).sort((a, b) => b.mtimeMs - a.mtimeMs).slice(0, 8);

        const matchingRootCandidates = [];
        for (const cand of candidates) {
            if (!convMetaCache[cand.id]) {
                try {
                    const out = JSON.parse(execFileSync(exe, ['agentapi', 'get-conversation-metadata', cand.id], {
                        env: childEnv,
                        encoding: 'utf8',
                        timeout: 2500,
                        windowsHide: true
                    }));
                    const meta = (out && out.response && out.response.conversationMetadata && out.response.conversationMetadata.metadata) || {};
                    const uris = (meta.workspaces || []).map(w => (w.workspaceFolderAbsoluteUri || '').toLowerCase());
                    convMetaCache[cand.id] = {
                        isRoot: !meta.parentConversationId,
                        uris
                    };
                } catch {
                    continue;
                }
            }
            const info = convMetaCache[cand.id];
            if (info && info.isRoot && info.uris.some(u => u.includes(workspaceMatchStr.toLowerCase()))) {
                matchingRootCandidates.push(cand);
            }
        }

        if (matchingRootCandidates.length > 1) {
            const tokensToMatch = [
                hubLastAnReportId ? hubLastAnReportId.slice(0, 8) : '',
                hubLastSeenId ? hubLastSeenId.slice(0, 8) : '',
                hubLastSeenThreadId || ''
            ].filter(t => t && t.length >= 6);

            for (const token of tokensToMatch) {
                for (const cand of matchingRootCandidates) {
                    try {
                        const fd = fs.openSync(cand.logPath, 'r');
                        const readSize = Math.min(cand.size, 65536);
                        const buf = Buffer.alloc(readSize);
                        fs.readSync(fd, buf, 0, readSize, cand.size - readSize);
                        fs.closeSync(fd);
                        const tailStr = buf.toString('utf8');
                        if (tailStr.includes(token)) {
                            if (cand.id !== savedConvId) {
                                try { fs.writeFileSync(convIdFile, cand.id, 'utf8'); } catch {}
                            }
                            return cand.id;
                        }
                    } catch {}
                }
            }
        }

        if (matchingRootCandidates.length > 0) {
            const best = matchingRootCandidates[0];
            if (best.id !== savedConvId) {
                try { fs.writeFileSync(convIdFile, best.id, 'utf8'); } catch {}
            }
            return best.id;
        }
    } catch {}
    return savedConvId;
}

function isAnTurnCompletelyIdle(workspaceMatchStr = 'ysdms-nextgen') {
    try {
        const localAppData = process.env.LOCALAPPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local') : '');
        const exe = path.join(localAppData, 'Programs', 'Antigravity', 'resources', 'bin', 'language_server.exe');
        const childEnv = getOrSaveSharedAgentApiEnv();
        const targetConvId = fs.existsSync(exe)
            ? resolveWorkspaceConversationId(exe, childEnv, workspaceMatchStr)
            : '';
        if (!targetConvId) return true;

        const logPath = path.join(process.env.USERPROFILE || '', '.gemini', 'antigravity', 'brain', targetConvId, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(logPath)) return true;

        const stat = fs.statSync(logPath);
        const ageSinceModifyMs = Date.now() - stat.mtimeMs;

        // Fallback an toàn: nếu file transcript không thay đổi quá 90 giây -> coi như AN đã nghỉ (IDLE)
        if (ageSinceModifyMs > 90000) return true;

        const fd = fs.openSync(logPath, 'r');
        const readSize = Math.min(stat.size, 24576);
        const buf = Buffer.alloc(readSize);
        fs.readSync(fd, buf, 0, readSize, stat.size - readSize);
        fs.closeSync(fd);

        const lines = buf.toString('utf8').trim().split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return true;

        const lastObj = JSON.parse(lines[lines.length - 1]);
        const hasTools = Array.isArray(lastObj.tool_calls) && lastObj.tool_calls.length > 0;
        const isFinalPlannerResponse = (
            lastObj.type === 'PLANNER_RESPONSE' &&
            lastObj.status === 'DONE' &&
            !hasTools
        );

        // AN chỉ thực sự kết thúc 100% lượt chạy khi bước cuối là PLANNER_RESPONSE hoàn tất (không gọi thêm tool) và ổn định >= 1.5s
        return isFinalPlannerResponse && ageSinceModifyMs >= 1500;
    } catch {
        return true;
    }
}

let pendingWakeupTimer = null;

function executeAgentApiSend(directiveText) {
    if (!directiveText || process.platform !== 'win32') return;
    try {
        const localAppData = process.env.LOCALAPPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local') : '');
        const exe = path.join(localAppData, 'Programs', 'Antigravity', 'resources', 'bin', 'language_server.exe');
        if (!fs.existsSync(exe)) return;

        const childEnv = getOrSaveSharedAgentApiEnv();
        const targetConvId = resolveWorkspaceConversationId(exe, childEnv, 'ysdms-nextgen');

        if (targetConvId) {
            const prompt = `[⚡ v2.7.0 DIRECTIVE TỪ PE / MINH CHỦ QUA BRIDGE]\n\n${directiveText}\n\n---\n*Ghi chú: Directive được chuyển tự động vào ô chat qua Native AgentAPI từ Hub [v2.7.0].*`;
            const child = spawn(exe, ['agentapi', 'send-message', '--title=[v2.7.0] PE DIRECTIVE', targetConvId, prompt], {
                env: childEnv,
                windowsHide: true
            });
            child.on('close', (code) => {
                if (code === 0) {
                    console.log(`[AGENTAPI WAKEUP v2.7.0] 🚀 Đã tự động kích hoạt Antigravity YSDMS thành công (Conv: ${targetConvId.slice(0, 8)}...)!`);
                } else {
                    console.warn(`[AGENTAPI WAKEUP v2.7.0] agentapi exit code: ${code}`);
                }
            });
        }
    } catch (e) {
        console.warn('[AGENTAPI WAKEUP v2.7.0] Lỗi:', e.message);
    }
}

function notifyAntigravityAgentApi(directiveText, waitAttempts = 0) {
    if (!directiveText || process.platform !== 'win32') return;
    if (!isAnTurnCompletelyIdle('ysdms-nextgen') && waitAttempts < 45) {
        if (waitAttempts === 0) {
            console.log(`[TURN GUARD v2.7.0] ⏳ AN vẫn đang chạy lượt trước — Tạm giữ chỉ thị PE trong hàng đợi chờ AN nghỉ hẳn (IDLE) mới gửi...`);
        }
        if (pendingWakeupTimer) clearTimeout(pendingWakeupTimer);
        pendingWakeupTimer = setTimeout(() => {
            notifyAntigravityAgentApi(directiveText, waitAttempts + 1);
        }, 2000);
        return;
    }
    executeAgentApiSend(directiveText);
}

function broadcastSse(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach(client => {
        try { client.write(payload); } catch {}
    });
}

let hubLastSeenId = null;
let hubLastAnReportId = null;
let hubLastSeenThreadId = null;
let lastHoldNotifiedId = null;
let syncInterval = null;

function startSupabaseSyncDaemon() {
    if (!SUPABASE_URL || !ACTIVE_KEY) return;
    if (syncInterval) clearInterval(syncInterval);

    syncInterval = setInterval(async () => {
        try {
            const sRes = await fetch(`${SUPABASE_URL}/rest/v1/pe_an_messages?select=message_id,thread_id,sender,message_type,content_md,status,created_at&order=created_at.desc&limit=10`, {
                headers: {
                    'apikey': ACTIVE_KEY,
                    'Authorization': `Bearer ${ACTIVE_KEY}`
                }
            });
            if (!sRes.ok) return;
            const msgs = await sRes.json();
            if (!msgs || msgs.length === 0) return;
            if (Array.isArray(msgs)) {
                msgs.forEach(r => {
                    if (r && !r.id && r.message_id) r.id = r.message_id;
                    if (r && !r.message_id && r.id) r.message_id = r.id;
                });
            }
            const validRows = Array.isArray(msgs) ? msgs.filter(r => !(r.sender === 'PE' && isEchoBackContent(r.content_md))) : [];
            if (validRows.length === 0) return;
            const row = validRows[0];
            const latestAnRow = validRows.find(r => r && r.sender === 'AN');
            if (latestAnRow && latestAnRow.id) hubLastAnReportId = latestAnRow.id;
            if (row && row.thread_id) hubLastSeenThreadId = row.thread_id;

            const isFirstCheck = !hubLastSeenId;
            if (isFirstCheck || row.id !== hubLastSeenId) {
                // CHỐT CHẶN LƯỢT CHẠY [v2.7.0]: Nếu bản ghi mới là từ AN nhưng AN vẫn đang thao tác/chưa xuất xong câu trả lời cuối trên IDE
                // thì tạm hoãn phát sang PE cho đến khi AN hoàn tất 100% lượt chạy!
                const rowAgeMs = row.created_at ? (Date.now() - new Date(row.created_at).getTime()) : 0;
                if (!isFirstCheck && row.sender === 'AN' && rowAgeMs < 90000 && !isAnTurnCompletelyIdle('ysdms-nextgen')) {
                    if (lastHoldNotifiedId !== row.id) {
                        lastHoldNotifiedId = row.id;
                        console.log(`[TURN GUARD v2.7.0] ⏳ Báo cáo AN [${row.id.slice(0, 8)}] đã lên Supabase nhưng AN vẫn đang chạy trên IDE — Chờ AN dừng hẳn (IDLE) mới đẩy sang PE...`);
                        broadcastSse({
                            type: 'AN_STILL_WORKING_HOLD',
                            id: row.id,
                            threadId: row.thread_id,
                            timestamp: new Date().toISOString()
                        });
                    }
                    return;
                }

                if (!isFirstCheck) {
                    console.log(`[SUPABASE SYNC] 🔔 Phát hiện row mới trên public.pe_an_messages! ID: ${row.id} | Sender: ${row.sender} | Thread: ${row.thread_id} /* public.pe_bridge compatibility */`);
                }
                hubLastSeenId = row.id;
                const nextActor = row.sender === 'AN' ? 'PE' : 'AN';
                const turnState = row.sender === 'AN' ? 'AN_REPORTED' : 'PE_REPLIED';

                // Broadcast event SUPABASE_ROW_PERSISTED tới mọi clients
                broadcastSse({
                    type: 'SUPABASE_ROW_PERSISTED',
                    source: 'HUB_SUPABASE_SYNC',
                    record: row,
                    id: row.id,
                    thread_id: row.thread_id,
                    sender: row.sender,
                    created_at: row.created_at,
                    content_md: row.content_md,
                    nextActor: nextActor,
                    turnState: turnState,
                    threadId: row.thread_id,
                    timestamp: new Date().toISOString()
                });

                if (row.sender === 'AN') {
                    registerAnReport(row);
                    const workOrderId = extractWorkOrderId(row.content_md);
                    recordHandoffEvent({
                        workflowId: `wf-an-${row.id.slice(0, 8)}`,
                        requestId: `req-an-${row.id.slice(0, 8)}`,
                        handoffType: 'AN_TO_PE',
                        sourceRowId: row.id,
                        sourceCreatedAt: row.created_at,
                        detectedAt: new Date().toISOString(),
                        dispatchedAt: new Date().toISOString(),
                        deliveredTo: 'PE_BROWSER_UI',
                        finalState: 'DELIVERED'
                    });

                    broadcastSse({
                        type: 'AN_REPORT_PERSISTED',
                        source: 'HUB_SUPABASE_SYNC',
                        reportId: row.id,
                        threadId: row.thread_id,
                        createdAt: row.created_at,
                        workOrderId: workOrderId,
                        contentSnippet: (row.content_md || '').slice(0, 300),
                        content_md: row.content_md || '',
                        timestamp: new Date().toISOString()
                    });
                }

                // Chỉ dispatch PE row mới cho Watcher nếu đáp ứng toàn bộ tiêu chí nghiêm ngặt của PE:
                // 1. row.sender === 'PE'
                // 2. thread_id đúng và nằm trong whitelist quản lý
                // 3. row.id chưa từng được dispatch hoặc ACK (bền vững qua restart Hub)
                // 4. Nội dung là chỉ thị/phán quyết có target AN rõ ràng, không phải ping hay status note
                if (row.sender === 'PE') {
                    const inReplyTo = extractInReplyTo(row.content_md);
                    const workOrderId = extractWorkOrderId(row.content_md);
                    const handledId = markReportHandled(inReplyTo, row.id, 'PE', workOrderId);

                    broadcastSse({
                        type: 'PE_RESPONSE_PERSISTED',
                        source: 'HUB_SUPABASE_SYNC',
                        peMessageId: row.id,
                        inReplyToMessageId: handledId || inReplyTo,
                        workOrderId,
                        handledBy: 'PE',
                        handledAt: row.created_at || new Date().toISOString(),
                        pendingReport: false,
                        threadId: row.thread_id
                    });
                    const ageMs = row.created_at ? (Date.now() - new Date(row.created_at).getTime()) : 0;
                    const isStaleOnBoot = isFirstCheck && (ageMs > 10 * 60 * 1000 || row.status === 'CONSUMED');

                    if (isStaleOnBoot) {
                        console.log(`[SUPABASE SYNC] ℹ️ Khởi động Hub: Ghi nhận mốc row PE hiện tại [${row.id.slice(0, 8)}] (đã cũ/đã xử lý), chờ tin mới tiếp theo.`);
                    } else if (!isValidBridgeThread(row.thread_id)) {
                        console.log(`[SUPABASE SYNC] ⏭️ Bỏ qua row PE: thread_id [${row.thread_id}] không nằm trong whitelist quản lý.`);
                    } else if (isRowAlreadyDispatchedOrAcked(row.id) || row.status === 'CONSUMED') {
                        console.log(`[SUPABASE SYNC] ⏭️ Bỏ qua row PE: messageId [${row.id}] đã từng dispatch hoặc đã được CONSUMED.`);
                    } else if (requiresThoanApprovalFirst(row.content_md)) {
                        console.log(`[SUPABASE SYNC] ⏸️ Tạm dừng: PE yêu cầu Minh Chủ THOAN chốt/duyệt trước khi AN thi công.`);
                        broadcastSse({
                            type: 'WAITING_THOAN_APPROVAL',
                            source: 'HUB_SUPABASE_SYNC',
                            record: row,
                            peMessageId: row.id,
                            threadId: row.thread_id,
                            content_md: row.content_md,
                            timestamp: new Date().toISOString()
                        });
                    } else if (!isDirectiveTargetingAn(row.content_md)) {
                        console.log(`[SUPABASE SYNC] ⏭️ Bỏ qua row PE: nội dung là ping/ghi chú ngắn, không phải tin trao đổi kỹ thuật cho AN.`);
                    } else {
                        // Thỏa mãn toàn bộ guardrails -> Ghi nhận vào ledger và dispatch vào Inbox
                        recordDispatchedDirective(row);
                        updateSupabaseMessageStatus(row.id, 'CONSUMED');

                        const handoffReqId = `req-pe-${row.id.slice(0, 8)}`;
                        recordHandoffEvent({
                            workflowId: `wf-pe-${row.id.slice(0, 8)}`,
                            requestId: handoffReqId,
                            handoffType: 'PE_TO_AN',
                            sourceRowId: row.id,
                            sourceCreatedAt: row.created_at,
                            detectedAt: new Date().toISOString(),
                            dispatchedAt: new Date().toISOString(),
                            deliveredTo: 'AN_INBOX',
                            finalState: 'WAITING_FOR_AN_ACK'
                        });

                        broadcastSse({
                            type: 'PE_DISPATCHED_TO_AN',
                            source: 'HUB_SUPABASE_SYNC',
                            peMessageId: row.id,
                            requestId: handoffReqId,
                            threadId: row.thread_id,
                            status: 'WAITING_FOR_AN_ACK',
                            timestamp: new Date().toISOString()
                        });

                        const inboxMdPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md');
                        const inboxJsonPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json');
                        const mdContent = `# PE DIRECTIVE (YSDMS NEXTGEN BRIDGE SSOT ✅)\n\n`
                            + `- **Thread ID:** \`${row.thread_id}\`\n`
                            + `- **Request ID:** \`${handoffReqId}\`\n`
                            + `- **Message ID:** \`${row.id}\`\n`
                            + `- **Received At:** \`${new Date().toISOString()}\`\n`
                            + `- **Target Table:** \`public.pe_an_messages\`\n\n`
                            + `---\n\n### Nội Dung Chỉ Thị:\n\n${row.content_md}\n`;
                        fs.writeFileSync(inboxMdPath, mdContent, 'utf8');
                        fs.writeFileSync(inboxJsonPath, JSON.stringify({
                            requestId: handoffReqId,
                            threadId: row.thread_id,
                            messageId: row.id,
                            directiveText: row.content_md,
                            receivedAt: new Date().toISOString()
                        }, null, 2), 'utf8');
                        setWindowsClipboard(row.content_md);
                        notifyAntigravityAgentApi(row.content_md);
                        console.log(`[SUPABASE SYNC] ⚡ Đã tự động cập nhật PE_INBOX_LATEST.json & Windows Clipboard cho Watcher (Thread: ${row.thread_id})!`);
                    }
                }
            }
        } catch (e) {
            // im lặng để tránh rác log khi mạng chập chờn
        }
    }, 2500);
}

// Test Stage Tracker for Manual Test Slice (PE / AN)
const testStages = {};

function recordTestStage(testId, initialData) {
    if (!testId) return null;
    testStages[testId] = {
        testId,
        target: initialData.target || 'UNKNOWN',
        text: initialData.text || '',
        createdAt: new Date().toISOString(),
        stage1_hub: initialData.stage1_hub || { status: 'DONE', timestamp: new Date().toISOString(), label: 'Đã tới Hub' },
        stage2_delivered: initialData.stage2_delivered || { status: 'PENDING', timestamp: null, label: 'Chờ giao' },
        stage3_completed: initialData.stage3_completed || { status: 'PENDING', timestamp: null, label: 'Chờ hoàn tất' }
    };
    return testStages[testId];
}

function updateTestStage(testId, updates) {
    if (!testId || !testStages[testId]) return null;
    if (updates.stage1_hub) Object.assign(testStages[testId].stage1_hub, updates.stage1_hub);
    if (updates.stage2_delivered) Object.assign(testStages[testId].stage2_delivered, updates.stage2_delivered);
    if (updates.stage3_completed) Object.assign(testStages[testId].stage3_completed, updates.stage3_completed);
    return testStages[testId];
}

const server = http.createServer(async (req, res) => {
    setCorsHeaders(req, res);

    const host = req.headers.host || '';
    if (!isValidHostHeader(host)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'FORBIDDEN_HOST', message: 'Loopback interface on allowed ports only' }));
        return;
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

    // 1. Trạng thái Hub
    if ((url.pathname === '/api/status' || url.pathname === '/health') && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            hub: `YSDMS NextGen Realtime Bridge Hub ${HUB_VERSION}`,
            port: activePort,
            sseClients: sseClients.length,
            table: 'public.pe_an_messages',
            supabaseUrl: SUPABASE_URL ? 'CONFIGURED' : 'MISSING',
            time: new Date().toISOString()
        }));
        return;
    }

    // 1a. Phục vụ trực tiếp Userscript để cập nhật Tampermonkey chỉ bằng 1 cú click
    if (url.pathname === '/ysdms_pe_bridge.user.js' && req.method === 'GET') {
        try {
            const scriptPath = path.join(__dirname, 'ysdms_pe_bridge.user.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
            res.end(scriptContent);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Error reading userscript: ' + e.message);
        }
        return;
    }

    // 1b. Gửi test thủ công sang PE (Không qua bộ lọc nghiệp vụ)
    if ((url.pathname === '/api/send/pe' || url.pathname === '/api/test/send-pe') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const testId = data.testId || `test-pe-${Date.now()}`;
                const text = data.text || data.directiveText || data.content || 'Test message gửi cho PE.';
                const autoSubmit = !!data.autoSubmit;

                console.log(`\n[MANUAL TEST PE] 📤 ĐÃ TỚI HUB: Mã test [${testId}]`);
                console.log(`Nội dung   : ${text.slice(0, 150)}${text.length > 150 ? '...' : ''}`);
                console.log(`AutoSubmit : ${autoSubmit}\n`);

                recordTestStage(testId, {
                    testId,
                    target: 'PE',
                    text,
                    stage1_hub: { status: 'DONE', timestamp: new Date().toISOString(), label: 'Đã tới Hub' },
                    stage2_delivered: { status: 'PENDING', timestamp: null, label: 'Đang chuyển tới ô chat PE...' },
                    stage3_completed: { status: autoSubmit ? 'PENDING' : 'WAITING_USER', timestamp: null, label: autoSubmit ? 'Chờ tự động gửi...' : 'Chờ THOAN bấm Enter' }
                });

                broadcastSse({
                    type: 'TEST_INJECT_PE',
                    testId,
                    text,
                    autoSubmit,
                    timestamp: new Date().toISOString()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    testId,
                    stage: 'HUB_RECEIVED',
                    message: 'Đã tới Hub thành công, đang chuyển tới Userscript để điền vào ô chat PE'
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // 1c. Gửi test thủ công sang AN (Không qua bộ lọc nghiệp vụ)
    if ((url.pathname === '/api/send/an' || url.pathname === '/api/test/send-an') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const testId = data.testId || `test-an-${Date.now()}`;
                const text = data.text || data.directiveText || data.content || 'Test directive gửi cho AN.';
                const threadId = data.threadId || 'YSDMS-TEST-001';

                console.log(`\n[MANUAL TEST AN] 📥 ĐÃ TỚI HUB: Mã test [${testId}]`);
                console.log(`Thread ID  : ${threadId}`);
                console.log(`Nội dung   : ${text.slice(0, 150)}${text.length > 150 ? '...' : ''}\n`);

                const inboxMdPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md');
                const inboxJsonPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json');
                const nowIso = new Date().toISOString();

                const mdContent = `# TEST DIRECTIVE CHO AN (THỦ CÔNG)\n\n`
                    + `- **Thread ID:** \`${threadId}\`\n`
                    + `- **Test ID:** \`${testId}\`\n`
                    + `- **Request ID:** \`req-${testId}\`\n`
                    + `- **Received At:** \`${nowIso}\`\n`
                    + `- **Target:** \`AN_INBOX\`\n\n`
                    + `---\n\n### Nội Dung Test:\n\n${text}\n`;

                fs.writeFileSync(inboxMdPath, mdContent, 'utf8');
                fs.writeFileSync(inboxJsonPath, JSON.stringify({
                    requestId: `req-${testId}`,
                    threadId,
                    messageId: testId,
                    directiveText: text,
                    isTest: true,
                    receivedAt: nowIso
                }, null, 2), 'utf8');

                playBeep(988, 250);
                setWindowsClipboard(text);
                notifyAntigravityAgentApi(text);

                recordTestStage(testId, {
                    testId,
                    target: 'AN',
                    text,
                    stage1_hub: { status: 'DONE', timestamp: nowIso, label: 'Đã tới Hub' },
                    stage2_delivered: { status: 'DONE', timestamp: nowIso, label: 'Đã đưa vào Inbox & phát âm báo', inboxPath: inboxJsonPath },
                    stage3_completed: { status: 'PENDING', timestamp: null, label: 'Chờ AN Sentinel Watcher ACK...' }
                });

                broadcastSse({
                    type: 'TEST_DISPATCHED_AN',
                    testId,
                    text,
                    inboxPath: inboxJsonPath,
                    timestamp: nowIso
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    testId,
                    stage: 'INBOX_WRITTEN_AND_BEEPED',
                    inboxPath: inboxJsonPath,
                    message: 'Đã tới Hub và ghi vào Inbox, đã phát âm báo, đã copy vào Windows Clipboard. Sẵn sàng để Thoan dán vào Antigravity.'
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // 1d. Cập nhật tiến trình chặng của mã test từ client
    if (url.pathname === '/api/test/stage-update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const testId = data.testId;
                if (!testId || !testStages[testId]) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Không tìm thấy mã test: ${testId}` }));
                    return;
                }
                const nowIso = new Date().toISOString();
                if (data.stage === 'PE_INJECTED') {
                    updateTestStage(testId, {
                        stage2_delivered: { status: 'DONE', timestamp: nowIso, label: 'Đã điền vào ô chat PE' }
                    });
                } else if (data.stage === 'PE_SUBMITTED') {
                    updateTestStage(testId, {
                        stage3_completed: { status: 'DONE', timestamp: nowIso, label: 'Đã gửi trong chat PE' }
                    });
                } else if (data.stage === 'AN_ACKED') {
                    updateTestStage(testId, {
                        stage3_completed: { status: 'DONE', timestamp: nowIso, label: 'AN Watcher đã ACK' }
                    });
                }

                broadcastSse({
                    type: 'TEST_STAGE_UPDATED',
                    testId,
                    stage: data.stage,
                    stageData: testStages[testId],
                    timestamp: nowIso
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, stageData: testStages[testId] }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 1e. Tra cứu tiến trình chặng kiểm thử
    if (url.pathname === '/api/test/status' && req.method === 'GET') {
        const testId = url.searchParams.get('test_id') || url.searchParams.get('testId');
        if (testId) {
            const stage = testStages[testId];
            if (stage) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, test: stage }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Mã test không tồn tại' }));
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, total: Object.keys(testStages).length, tests: testStages }));
        return;
    }

    // 2. Kênh SSE Realtime
    if (url.pathname === '/api/events' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', port: activePort, hub: `ysdms-bridge-${HUB_VERSION}` })}\n\n`);
        sseClients.push(res);
        console.log(`[SSE] 🌐 Browser Perplexity đã kết nối. Tổng clients: ${sseClients.length}`);

        // Gửi ngay trạng thái lượt gần nhất từ Supabase SSOT
        (async () => {
            if (SUPABASE_URL && ACTIVE_KEY) {
                try {
                    const sRes = await fetch(`${SUPABASE_URL}/rest/v1/pe_an_messages?select=message_id,thread_id,sender,message_type,content_md,status,created_at&order=created_at.desc&limit=10`, {
                        headers: {
                            'apikey': ACTIVE_KEY,
                            'Authorization': `Bearer ${ACTIVE_KEY}`
                        }
                    });
                    if (sRes.ok) {
                        const msgs = await sRes.json();
                        if (Array.isArray(msgs)) {
                            msgs.forEach(r => {
                                if (r && !r.id && r.message_id) r.id = r.message_id;
                                if (r && !r.message_id && r.id) r.message_id = r.id;
                            });
                        }
                        const validMsgs = Array.isArray(msgs) ? msgs.filter(r => !(r.sender === 'PE' && isEchoBackContent(r.content_md))) : [];
                        if (validMsgs.length > 0) {
                            const rec = validMsgs[0];
                            const recAgeMs = rec.created_at ? (Date.now() - new Date(rec.created_at).getTime()) : 0;
                            if (rec.sender === 'AN' && recAgeMs < 90000 && !isAnTurnCompletelyIdle('ysdms-nextgen')) {
                                rec.anStillWorking = true;
                            }
                            const corr = await computeReportCorrelation(rec.thread_id);
                            const derived = rec.sender === 'AN' ? (corr.pendingAnReport ? 'AN_REPORTED' : (corr.awaitingPeReply ? 'PE_THINKING' : 'PE_HANDLED')) : (rec.sender === 'PE' ? 'WAITING_FOR_AN_ACK' : 'IDLE');
                            res.write(`data: ${JSON.stringify({
                                type: 'LATEST_STATE',
                                source: 'SUPABASE_REHYDRATION',
                                record: rec,
                                derivedState: derived,
                                correlation: corr
                            })}\n\n`);
                        }
                    }
                } catch (e) {
                    console.warn('[SSE] Lỗi nạp trạng thái ban đầu:', e.message);
                }
            }
        })();

        req.on('close', () => {
            sseClients = sseClients.filter(c => c !== res);
            console.log(`[SSE] 🔌 Browser đã ngắt kết nối. Còn lại: ${sseClients.length}`);
        });
        return;
    }

    // 3. Lấy tin nhắn mới nhất / danh sách feed từ public.pe_an_messages (SSOT Snapshot Rehydration & Correlation)
    if ((url.pathname === '/api/messages/latest' || url.pathname === '/api/messages/feed') && req.method === 'GET') {
        try {
            const threadId = url.searchParams.get('thread_id');
            const limitParam = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '15', 10), 1), 50);
            if (!SUPABASE_URL || !ACTIVE_KEY) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    source: 'SUPABASE_REHYDRATION',
                    success: false,
                    error: 'Supabase credentials not configured',
                    threadId: threadId,
                    record: null,
                    rows: [],
                    data: [],
                    derivedState: 'IDLE',
                    correlation: { pendingAnReport: false, awaitingPeReply: false },
                    timestamp: new Date().toISOString()
                }));
                return;
            }
            let endpoint = `${SUPABASE_URL}/rest/v1/pe_an_messages?select=message_id,thread_id,sender,message_type,content_md,status,created_at&order=created_at.desc&limit=${limitParam}`;
            if (threadId) {
                endpoint += `&thread_id=eq.${encodeURIComponent(threadId)}`;
            }
            const sRes = await fetch(endpoint, {
                headers: {
                    'apikey': ACTIVE_KEY,
                    'Authorization': `Bearer ${ACTIVE_KEY}`
                }
            });
            if (!sRes.ok) {
                res.writeHead(sRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Supabase status: ${sRes.status}` }));
                return;
            }
            const data = await sRes.json();
            if (Array.isArray(data)) {
                data.forEach(r => {
                    if (r && !r.id && r.message_id) r.id = r.message_id;
                    if (r && !r.message_id && r.id) r.message_id = r.id;
                });
            }
            const validRows = Array.isArray(data) ? data.filter(r => !(r.sender === 'PE' && isEchoBackContent(r.content_md))) : [];
            const record = validRows.length > 0 ? validRows[0] : null;
            if (record && record.sender === 'AN') {
                const recAgeMs = record.created_at ? (Date.now() - new Date(record.created_at).getTime()) : 0;
                if (recAgeMs < 90000 && !isAnTurnCompletelyIdle('ysdms-nextgen')) {
                    record.anStillWorking = true;
                }
            }
            const corr = await computeReportCorrelation(threadId || (record ? record.thread_id : null));
            const derived = !record ? 'IDLE' : (record.sender === 'AN' ? (corr.pendingAnReport ? 'AN_REPORTED' : (corr.awaitingPeReply ? 'PE_THINKING' : 'PE_HANDLED')) : (record.sender === 'PE' ? 'WAITING_FOR_AN_ACK' : 'IDLE'));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                source: 'SUPABASE_REHYDRATION',
                success: true,
                threadId: threadId || (record ? record.thread_id : null),
                record: record,
                rows: validRows,
                data: validRows,
                derivedState: derived,
                correlation: corr,
                timestamp: new Date().toISOString()
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 3b. Kiểm tra báo cáo chờ xử lý theo Thread (BRIDGE-PENDING-REPORT-CORRELATION-001)
    if (url.pathname === '/api/reports/pending' && req.method === 'GET') {
        try {
            const threadId = url.searchParams.get('thread_id') || 'YSDMS-AUTH-PHASE1';
            const corr = await computeReportCorrelation(threadId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                ...corr,
                timestamp: new Date().toISOString()
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // 3c. Đánh dấu Báo cáo đã được nạp/đưa vào PE (Consume report)
    if (url.pathname === '/api/reports/consume' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const reportId = data.reportId || data.messageId;
                const by = data.by || 'BROWSER_SUBMITTED';
                if (reportId) {
                    markReportConsumed(reportId, by);
                    await updateSupabaseMessageStatus(reportId, 'CONSUMED');
                    broadcastSse({
                        type: 'REPORT_CONSUMED',
                        reportId,
                        by,
                        timestamp: new Date().toISOString()
                    });
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, reportId, status: 'CONSUMED' }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 3d. Ghép cặp tương quan Báo Cáo ⟷ Phản Hồi (Correlation Webhook)
    if (url.pathname === '/api/reports/correlate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const anReportId = data.anReportId || data.reportId;
                const peMessageId = data.peMessageId;
                const worker = data.worker || 'PE';
                const workOrderId = data.workOrderId;
                const handledId = markReportHandled(anReportId, peMessageId, worker, workOrderId);
                broadcastSse({
                    type: 'PE_RESPONSE_PERSISTED',
                    source: 'API_CORRELATE',
                    peMessageId,
                    inReplyToMessageId: handledId,
                    workOrderId,
                    handledBy: worker,
                    handledAt: new Date().toISOString(),
                    pendingReport: false
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, handledId, peMessageId }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 3e. Event Ledger phục vụ đối soát handoff hai chiều (BRIDGE-END-TO-END-HANDOFF-REPAIR-001)
    if (url.pathname === '/api/handoff/ledger' && req.method === 'GET') {
        try {
            const threadId = url.searchParams.get('thread_id');
            const limit = parseInt(url.searchParams.get('limit') || '50', 10);
            let events = getHandoffLedger();
            if (threadId) {
                events = events.filter(e => !e.threadId || e.threadId === threadId);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                total: events.length,
                events: events.slice(-limit).reverse()
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    /**
     * BRIDGE-PERSIST-FIRST-DISPATCH-001:
     * Chỉ dispatch chỉ thị cho AN Watcher và ghi Inbox SAU KHI đã có persistedRow với UUID thật từ Supabase.
     * Nếu persist thất bại, hàm này tuyệt đối KHÔNG được gọi.
     */
    function dispatchPersistedPeDirectiveToAn(persistedRow, requestId, inReplyTo, workOrderId) {
        const messageId = persistedRow.id; // BẮT BUỘC là UUID thật từ Supabase
        const threadId = persistedRow.thread_id;
        const directiveText = persistedRow.content_md;
        const createdAt = persistedRow.created_at || new Date().toISOString();

        // 1. Ghi vào .agents/PE_INBOX_LATEST.md và JSON
        const inboxMdPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md');
        const inboxJsonPath = path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json');
        const mdContent = `# PE DIRECTIVE (YSDMS NEXTGEN BRIDGE SSOT ✅)\n\n`
            + `- **Thread ID:** \`${threadId}\`\n`
            + `- **Request ID:** \`${requestId}\`\n`
            + `- **Supabase Row UUID:** \`${messageId}\`\n`
            + `- **Received At:** \`${createdAt}\`\n`
            + `- **Target Table:** \`public.pe_an_messages\`\n\n`
            + `---\n\n### Nội Dung Chỉ Thị:\n\n${directiveText}\n`;

        fs.writeFileSync(inboxMdPath, mdContent, 'utf8');
        fs.writeFileSync(inboxJsonPath, JSON.stringify({
            requestId,
            threadId,
            messageId, // Bắt buộc là UUID thật từ Supabase
            directiveText,
            receivedAt: createdAt
        }, null, 2), 'utf8');
        setWindowsClipboard(directiveText);
        notifyAntigravityAgentApi(directiveText);
        updateSupabaseMessageStatus(messageId, 'CONSUMED');

        // 2. Correlation
        const handledReportId = markReportHandled(inReplyTo, messageId, 'PE', workOrderId);

        // 3. Persistent Ledger Handoff Event (với sourceRowId = UUID thật)
        recordDispatchedDirective({ id: messageId, thread_id: threadId, content_md: directiveText });
        recordHandoffEvent({
            workflowId: `wf-pe-${messageId.slice(0, 8)}`,
            requestId: requestId,
            handoffType: 'PE_TO_AN',
            sourceRowId: messageId, // BẮT BUỘC UUID SUPABASE THẬT
            sourceCreatedAt: createdAt,
            detectedAt: new Date().toISOString(),
            dispatchedAt: new Date().toISOString(),
            deliveredTo: 'AN_INBOX',
            finalState: 'WAITING_FOR_AN_ACK'
        });

        // 4. Phát SSE xác nhận
        hubLastSeenId = messageId;
        broadcastSse({
            type: 'PE_DISPATCHED_TO_AN',
            source: 'PERSISTED_SUPABASE_DISPATCH',
            peMessageId: messageId,
            requestId: requestId,
            threadId: threadId,
            status: 'WAITING_FOR_AN_ACK',
            timestamp: new Date().toISOString()
        });
        broadcastSse({
            type: 'SUPABASE_ROW_PERSISTED',
            source: 'PERSISTED_SUPABASE_DISPATCH',
            record: persistedRow,
            id: persistedRow.id,
            thread_id: persistedRow.thread_id,
            sender: persistedRow.sender,
            created_at: persistedRow.created_at,
            content_md: persistedRow.content_md,
            nextActor: 'AN',
            turnState: 'PE_REPLIED',
            threadId,
            timestamp: new Date().toISOString()
        });
        broadcastSse({
            type: 'PE_RESPONSE_PERSISTED',
            source: 'PERSISTED_SUPABASE_DISPATCH',
            peMessageId: messageId,
            inReplyToMessageId: handledReportId || inReplyTo,
            workOrderId,
            handledBy: 'PE',
            handledAt: new Date().toISOString(),
            pendingReport: false,
            threadId
        });
        broadcastSse({
            type: 'PE_REPLIED',
            requestId,
            threadId,
            messageId,
            sender: 'PE',
            persistedAt: createdAt,
            directiveText: directiveText.slice(0, 300)
        });

        playBeep(880, 250);
        return { inboxMdPath, handledReportId };
    }

    // 4. Webhook tiếp nhận Chỉ Thị từ PE (Trình duyệt gửi về khi PE sinh xong hoặc Cứu hộ Alt+F10)
    if (url.pathname === '/api/directive' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const threadId = data.threadId || 'BRIDGE-ORCHESTRATION';
                let messageId = data.messageId;
                const directiveText = data.directiveText || data.directive || data.content || '';
                const requestId = data.requestId || `req-${Date.now()}`;

                if (!messageId && !directiveText) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Thiếu messageId hoặc directiveText' }));
                    return;
                }

                // Server-side Defense: Loại trừ triệt để tin nhắn dội ngược (Echo back) từ prompt của AN/User
                if (isEchoBackContent(directiveText)) {
                    console.log(`[HUB DIRECTIVE] 🛡️ Bỏ qua tin nhắn dội ngược (User Query bubble) từ browser.`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, ignored: true, reason: 'ECHO_BACK_USER_QUERY_IGNORED' }));
                    return;
                }

                // Server-side Content Deduplication [v2.7.0]: Chặn gửi trùng cùng 1 câu trả lời PE (do hover/scroll trên DOM làm đổi nhẹ hash)
                if (directiveText) {
                    const cleanPrefix = directiveText.replace(/\s+/g, ' ').trim().slice(0, 350);
                    const prefixHash = crypto.createHash('sha256').update(cleanPrefix).digest('hex');
                    if (!global.__YSDMS_RECENT_PE_HASHES__) global.__YSDMS_RECENT_PE_HASHES__ = {};
                    const prevTime = global.__YSDMS_RECENT_PE_HASHES__[prefixHash];
                    if (prevTime && (Date.now() - prevTime < 15 * 60 * 1000)) {
                        console.log(`[HUB DEDUP v2.7.0] 🛡️ Đã chặn bản tin PE gửi trùng nội dung trong vòng 15 phút.`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, deduplicated: true, reason: 'DUPLICATE_PE_CONTENT_PREFIX' }));
                        return;
                    }
                    global.__YSDMS_RECENT_PE_HASHES__[prefixHash] = Date.now();
                }

                // =================================================================
                // BƯỚC 1: PERSISTENCE-FIRST GUARD (BẮT BUỘC LƯU SUPABASE TRƯỚC TIÊN)
                // =================================================================
                let persistedRow = null;
                const isTempOrManualId = !messageId || messageId.startsWith('pe-') || messageId.startsWith('manual-an-') || messageId.startsWith('test-') || messageId.length < 30;

                if (isTempOrManualId && SUPABASE_URL && ACTIVE_KEY) {
                    try {
                        const nowJst = new Date().toLocaleString("en-GB", { timeZone: "Asia/Tokyo" });
                        let contentToPersist = directiveText;
                        if (!contentToPersist.includes('[GỬI SUPABASE:') && !contentToPersist.includes('[GUI SUPABASE:')) {
                            contentToPersist = contentToPersist.trim() + `\n\n⏱️ [GỬI SUPABASE: ${nowJst} JST]`;
                        }
                        let msgType = data.messageType || data.message_type;
                        if (!msgType) {
                            const upperText = directiveText.toUpperCase();
                            if (upperText.includes('APPROVED') || upperText.includes('PHÊ DUYỆT') || upperText.includes('CHỐT ĐÓNG') || upperText.includes('CLOSED')) {
                                msgType = 'APPROVAL';
                            } else if (upperText.includes('QUESTION') || upperText.includes('CÂU HỎI') || upperText.includes('THẨM VẤN')) {
                                msgType = 'QUESTION';
                            } else if (upperText.includes('ANALYSIS') || upperText.includes('PHÂN TÍCH')) {
                                msgType = 'ANALYSIS';
                            } else {
                                msgType = 'DIRECTIVE';
                            }
                        }

                        const explicitMessageId = (messageId && messageId.length >= 30) ? messageId : crypto.randomUUID();
                        const safeThreadId = threadId || 'DEFAULT';
                        const safeMsgType = ['DIRECTIVE', 'ANALYSIS', 'QUESTION', 'APPROVAL', 'REPORT'].includes(msgType) ? msgType : 'DIRECTIVE';

                        let insertRes = null;
                        for (let attempt = 1; attempt <= 2; attempt++) {
                            try {
                                insertRes = await fetch(`${SUPABASE_URL}/rest/v1/pe_an_messages`, {
                                    method: 'POST',
                                    headers: {
                                        'apikey': ACTIVE_KEY,
                                        'Authorization': `Bearer ${ACTIVE_KEY}`,
                                        'Content-Type': 'application/json',
                                        'Prefer': 'return=representation'
                                    },
                                    body: JSON.stringify({
                                        message_id: explicitMessageId,
                                        thread_id: safeThreadId,
                                        sender: 'PE',
                                        message_type: safeMsgType,
                                        content_md: contentToPersist
                                    })
                                });
                                if (insertRes.ok) break;
                            } catch (netErr) {
                                if (attempt === 2) throw netErr;
                                await new Promise(r => setTimeout(r, 400));
                            }
                        }

                        if (insertRes && insertRes.ok) {
                            const insData = await insertRes.json();
                            if (insData && insData.length > 0) {
                                persistedRow = insData[0];
                                persistedRow.id = persistedRow.message_id || explicitMessageId;
                                messageId = persistedRow.id;
                                console.log(`[PERSIST-FIRST] ✅ Đã lưu bản ghi PE vào public.pe_an_messages. UUID thật: ${messageId}`);
                            }
                        } else if (insertRes) {
                            const errBody = await insertRes.text();
                            console.error(`[PERSIST-FIRST] ❌ Supabase từ chối persist: HTTP ${insertRes.status} - ${errBody}`);
                        }
                    } catch (e) {
                        console.error('[PERSIST-FIRST] ❌ Lỗi kết nối Supabase:', e.message);
                    }
                } else if (messageId && messageId.length >= 30) {
                    // Nếu client đã persist trước và truyền vào UUID thật
                    persistedRow = {
                        id: messageId,
                        thread_id: threadId,
                        sender: 'PE',
                        content_md: directiveText,
                        created_at: new Date().toISOString()
                    };
                }

                // NẾU PERSIST THẤT BẠI: TUYỆT ĐỐI CẤM GHI INBOX VÀ CẤM DISPATCH SANG AN WATCHER
                if (!persistedRow || !persistedRow.id) {
                    console.error(`[PERSIST-FIRST] 🛑 PERSIST THẤT BẠI: Hủy dispatch và KHÔNG ghi Inbox!`);
                    res.writeHead(502, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'PERSIST_FAILED: Không thể lưu bản ghi vào Supabase SSOT trước khi dispatch!',
                        persisted: false,
                        dispatched: false
                    }));
                    return;
                }

                const realUuid = persistedRow.id;

                // =================================================================
                // BƯỚC 2: KIỂM TRA IDEMPOTENCY VỚI UUID THẬT
                // =================================================================
                const processed = getProcessedDirectives();
                if (processed.includes(realUuid)) {
                    console.log(`[IDEMPOTENCY] 🛡️ Bỏ qua chỉ thị [${realUuid}] đã được xử lý.`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, idempotent: true, supabase_row_id: realUuid, messageId: realUuid }));
                    return;
                }
                markDirectiveProcessed(realUuid);

                console.log(`\n=======================================================`);
                console.log(`[OMNI BRIDGE] ⚡ TIẾP NHẬN CHỈ THỊ MỚI TỪ PE (PERSISTED FIRST)!`);
                console.log(`Thread     : ${threadId}`);
                console.log(`UUID Thật  : ${realUuid}`);
                console.log(`Thời gian  : ${new Date().toLocaleTimeString()}`);
                console.log(`-------------------------------------------------------`);
                console.log(directiveText.slice(0, 250) + (directiveText.length > 250 ? '...' : ''));
                console.log(`=======================================================\n`);

                // =================================================================
                // BƯỚC 3: THỰC HIỆN DISPATCH CHÍNH THỨC SAU KHI ĐÃ CÓ ROW SUPABASE
                // =================================================================
                const inReplyTo = data.inReplyToMessageId || extractInReplyTo(directiveText);
                const workOrderId = data.workOrderId || extractWorkOrderId(directiveText);
                const { inboxMdPath } = dispatchPersistedPeDirectiveToAn(persistedRow, requestId, inReplyTo, workOrderId);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    requestId,
                    messageId: realUuid,
                    supabase_row_id: realUuid,
                    created_at: persistedRow.created_at,
                    savedTo: inboxMdPath,
                    message: 'Đã persist Supabase thành công và dispatch chỉ thị tới AN Inbox!'
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 4b. Webhook AN Xác Nhận Đã Nhận Chỉ Thị (Explicit AN Acknowledgment)
    if (url.pathname === '/api/ack' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const requestId = data.requestId || 'req-unknown';
                const peMessageId = data.peMessageId || data.pe_message_id || data.messageId || 'msg-unknown';
                const worker = data.worker || data.client || 'AN';
                const ackTimestamp = data.ackTimestamp || data.timestamp || new Date().toISOString();

                console.log(`\n[ACK] ✅ AN ĐÃ XÁC NHẬN NHẬN CHỈ THỊ!`);
                console.log(`PE Message ID : ${peMessageId}`);
                console.log(`Request ID    : ${requestId}`);
                console.log(`Worker        : ${worker}`);
                console.log(`Thời gian     : ${ackTimestamp}\n`);

                const auditFile = path.join(DATA_DIR, 'bridge_ack_audit.json');
                let auditLogs = [];
                if (fs.existsSync(auditFile)) {
                    try { auditLogs = JSON.parse(fs.readFileSync(auditFile, 'utf8')); } catch {}
                }
                auditLogs.unshift({ requestId, peMessageId, worker, ackTimestamp });
                if (auditLogs.length > 50) auditLogs = auditLogs.slice(0, 50);
                fs.writeFileSync(auditFile, JSON.stringify(auditLogs, null, 2), 'utf8');

                // Cập nhật trạng thái ACKNOWLEDGED vào Persistent Dispatch Ledger và Handoff Ledger
                markLedgerAcked(peMessageId, ackTimestamp, worker);
                updateHandoffEvent(peMessageId, {
                    acknowledgedAt: ackTimestamp,
                    finalState: 'ACKNOWLEDGED',
                    deliveredTo: worker
                });

                // Cập nhật Test Stages nếu là test payload
                const testKey = testStages[peMessageId] ? peMessageId : (requestId ? requestId.replace('req-', '') : null);
                if (testKey && testStages[testKey]) {
                    updateTestStage(testKey, {
                        stage3_completed: { status: 'DONE', timestamp: ackTimestamp, label: 'Sentinel Watcher đã thấy file và ACK Inbox (Minh Chủ dán vào chat AN)' }
                    });
                    broadcastSse({
                        type: 'TEST_STAGE_UPDATED',
                        testId: testKey,
                        stage: 'AN_ACKED',
                        status: 'DONE',
                        ackTimestamp,
                        worker
                    });
                    console.log(`[TEST AN] ✅ Sentinel Watcher đã phát hiện file và gửi ACK cho mã test: ${testKey}`);
                }

                const ackPayload = JSON.stringify({
                    type: 'AN_ACK_RECEIVED',
                    requestId,
                    peMessageId,
                    worker,
                    ackTimestamp
                });

                sseClients.forEach(c => {
                    try { c.write(`data: ${ackPayload}\n\n`); } catch {}
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    requestId,
                    peMessageId,
                    ackTimestamp
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 4c. Webhook Browser ACK xác nhận Tab Perplexity đã render banner và nhận report từ AN (BRIDGE-REAL-BROWSER-HANDOFF-001)
    if (url.pathname === '/api/pe-browser-ack' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const sourceRowId = data.sourceRowId || data.reportId;
                const workflowId = data.workflowId || (sourceRowId ? `wf-an-${sourceRowId.slice(0, 8)}` : null);
                const renderedAt = data.renderedAt || new Date().toISOString();
                const scriptVersion = data.scriptVersion || HUB_VERSION;

                console.log(`[PE_BROWSER_ACK] 🌐 Browser đã xác nhận hiển thị Report [${sourceRowId}] (Script: ${scriptVersion})`);
                if (sourceRowId) {
                    updateHandoffEvent(sourceRowId, {
                        finalState: 'DELIVERED_TO_BROWSER',
                        browserAckAt: renderedAt,
                        scriptVersion
                    });
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, status: 'DELIVERED_TO_BROWSER', sourceRowId }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 5. Webhook AN Báo Cáo Xong (Kích hoạt chuyển chấm Xanh trên Perplexity)
    if (url.pathname === '/api/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const threadId = data.threadId || 'YSDMS-AUTH-PHASE1';
                const reportContent = data.content_md || data.reportText || '';

                let messageId = data.messageId;

                // Nếu AN gửi trực tiếp qua Hub thay vì gọi Supabase, Hub sẽ tự nộp lên Supabase
                if (!messageId && reportContent && SUPABASE_URL && ACTIVE_KEY) {
                    try {
                        const nowJst = new Date().toLocaleString("en-GB", { timeZone: "Asia/Tokyo" });
                        let contentToPersist = reportContent;
                        if (!contentToPersist.includes('[GỬI SUPABASE:') && !contentToPersist.includes('[GUI SUPABASE:')) {
                            contentToPersist = contentToPersist.trim() + `\n\n⏱️ [GỬI SUPABASE: ${nowJst} JST]`;
                        }
                        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/pe_an_messages`, {
                            method: 'POST',
                            headers: {
                                'apikey': ACTIVE_KEY,
                                'Authorization': `Bearer ${ACTIVE_KEY}`,
                                'Content-Type': 'application/json',
                                'Prefer': 'return=representation'
                            },
                            body: JSON.stringify({
                                thread_id: threadId,
                                sender: 'AN',
                                message_type: 'REPORT',
                                content_md: contentToPersist
                            })
                        });
                        if (insertRes.ok) {
                            const insData = await insertRes.json();
                            if (insData && insData.length > 0) messageId = insData[0].message_id || insData[0].id;
                        }
                    } catch (e) {
                        console.warn('[HUB REPORT] Lỗi nộp Supabase:', e.message);
                    }
                }

                if (messageId || reportContent) {
                    registerAnReport({
                        id: messageId,
                        thread_id: threadId,
                        content_md: reportContent,
                        created_at: new Date().toISOString()
                    });
                }

                // CHỐT CHẶN LƯỢT CHẠY [v2.7.0]: Nếu AN gọi /api/report trong khi lượt chạy trên IDE chưa kết thúc (chưa xuất xong câu trả lời cuối),
                // KHÔNG phát sóng SSE ngay mà để startSupabaseSyncDaemon tự động giải phóng ngay khi AN về trạng thái IDLE!
                if (messageId && !isAnTurnCompletelyIdle('ysdms-nextgen')) {
                    console.log(`[TURN GUARD v2.7.0] ⏳ Đã lưu báo cáo AN [${messageId.slice(0, 8)}] từ /api/report — Chờ AN kết thúc 100% lượt chạy trên IDE mới bắn sang PE...`);
                    broadcastSse({
                        type: 'AN_STILL_WORKING_HOLD',
                        id: messageId,
                        threadId: threadId,
                        timestamp: new Date().toISOString()
                    });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        threadId,
                        messageId,
                        heldUntilAnIdle: true,
                        message: 'Đã lưu Supabase. Hub sẽ tự động đẩy sang PE ngay khi AN hoàn tất lượt trả lời hiện tại.'
                    }));
                    return;
                }

                console.log(`\n=======================================================`);
                console.log(`[YSDMS BRIDGE v2.7.0] 🔔 AN ĐÃ NỘP BÁO CÁO NGHIỆM THU (${threadId})!`);
                console.log(`Bắn tín hiệu SSE để browser chuyển CHẤM XANH 🟢...`);
                console.log(`=======================================================\n`);

                if (messageId) {
                    hubLastSeenId = messageId;
                }
                const workOrderId = extractWorkOrderId(reportContent);
                recordHandoffEvent({
                    workflowId: `wf-an-${(messageId || 'anon').slice(0, 8)}`,
                    requestId: `req-an-${(messageId || 'anon').slice(0, 8)}`,
                    handoffType: 'AN_TO_PE',
                    sourceRowId: messageId || 'report-direct',
                    sourceCreatedAt: new Date().toISOString(),
                    detectedAt: new Date().toISOString(),
                    dispatchedAt: new Date().toISOString(),
                    deliveredTo: 'PE_BROWSER_UI',
                    finalState: 'WAITING_FOR_PE_BROWSER_ACK'
                });

                const anCreatedAt = new Date().toISOString();
                broadcastSse({
                    type: 'SUPABASE_ROW_PERSISTED',
                    source: 'DIRECT_AN_INSERT',
                    record: { id: messageId, thread_id: threadId, sender: 'AN', content_md: reportContent, created_at: anCreatedAt },
                    id: messageId,
                    thread_id: threadId,
                    sender: 'AN',
                    created_at: anCreatedAt,
                    content_md: reportContent,
                    nextActor: 'PE',
                    turnState: 'AN_REPORTED',
                    threadId,
                    timestamp: anCreatedAt
                });

                broadcastSse({
                    type: 'AN_REPORT_PERSISTED',
                    source: 'DIRECT_AN_INSERT',
                    reportId: messageId,
                    threadId: threadId,
                    createdAt: new Date().toISOString(),
                    workOrderId: workOrderId,
                    contentSnippet: (reportContent || '').slice(0, 300),
                    content_md: reportContent || '',
                    timestamp: new Date().toISOString()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    threadId,
                    messageId,
                    broadcastedTo: sseClients.length
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 6. Phục vụ Userscript trực tiếp cho Tampermonkey (Cập nhật 1-click)
    if (url.pathname === '/ysdms_pe_bridge.user.js' || url.pathname === '/ysdms_pe_bridge.user.js' || url.pathname === '/script') {
        const scriptPath = path.join(__dirname, 'ysdms_pe_bridge.user.js');
        if (fs.existsSync(scriptPath)) {
            res.writeHead(200, {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Access-Control-Allow-Origin': 'https://www.perplexity.ai'
            });
            fs.createReadStream(scriptPath).pipe(res);
            return;
        }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint không tồn tại' }));
});

function listenOnPort(p, tries = 0) {
    if (tries >= MAX_PORT_TRIES) {
        console.error(`[LỖI] Đã thử ${MAX_PORT_TRIES} cổng bắt đầu từ ${START_PORT} nhưng đều bị chiếm!`);
        process.exit(1);
    }

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`[THÔNG BÁO] Cổng ${p} đang bận, tự động nâng lên ${p + 1}...`);
            listenOnPort(p + 1, tries + 1);
        } else {
            console.error('[LỖI MẠNG]', err);
            process.exit(1);
        }
    });

    server.once('listening', () => {
        activePort = p;
        const portInfo = { port: activePort, host: HOST, pid: process.pid, startedAt: new Date().toISOString() };
        fs.writeFileSync(path.join(DATA_DIR, 'active_port.json'), JSON.stringify(portInfo, null, 2), 'utf8');
        console.log(`=================================================================`);
        console.log(`  YSDMS NEXTGEN REALTIME BRIDGE HUB ${HUB_VERSION} [HARDENED]`);
        console.log(`  Địa chỉ  : http://${HOST}:${activePort}`);
        console.log(`  Bảng SSOT: public.pe_an_messages (Supabase) /* public.pe_bridge compatibility */`);
        console.log(`  PID      : ${process.pid}`);
        console.log(`=================================================================`);
        console.log(`[HƯỚNG DẪN]`);
        console.log(`- Cài đặt Userscript 'ysdms_pe_bridge.user.js' vào Tampermonkey trên trình duyệt.`);
        console.log(`- Mở trang web Perplexity Pro (Project Space của YSDMS NextGen).`);
        console.log(`- Bấm Ctrl + C để dừng Hub an toàn.`);
        console.log(`-----------------------------------------------------------------\n`);

        // Khởi động Supabase Polling Daemon để đồng bộ realtime row mới
        startSupabaseSyncDaemon();
    });

    server.listen(p, HOST);
}

listenOnPort(START_PORT);

const cleanup = () => {
    try {
        if (syncInterval) clearInterval(syncInterval);
        const portFile = path.join(DATA_DIR, 'active_port.json');
        if (fs.existsSync(portFile)) fs.unlinkSync(portFile);
    } catch {}
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
