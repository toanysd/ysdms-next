/**
 * TEST HỒI QUY: SINGLE-FLIGHT LOCK & AWAIT SUPABASE NEW ROW (v2.2.0)
 * Tái hiện & kiểm chứng:
 * 1. Sau khi đổ dữ liệu vào PE, hệ thống BẮT BUỘC rơi vào trạng thái CHỜ (Awaiting Supabase New Row).
 * 2. Vòng lặp Poll 3s / SSE duplicate / rehydration với bản ghi cũ KHÔNG được đổ lại vào PE.
 * 3. Khi Supabase cập nhật dữ liệu mới:
 *    - sender === 'PE' hoặc 'THOAN': Giải phóng chờ, chuyển sang lượt AN (AN_TURN), không đổ PE.
 *    - sender === 'AN' (ID mới): Giải phóng chờ, chuyển sang lượt PE (PE_TURN), đổ báo cáo mới cho PE.
 *
 * Kiểm chứng bằng chính các hàm thật trích xuất từ omni_pe_bridge.user.js.
 * Chạy: node tools/realtime-bridge/test_single_flight_lock.cjs
 */
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
function assert(title, cond, detail = '') {
    if (cond) { console.log(`  ✓ PASS: ${title}`); passed++; }
    else { console.error(`  ✗ FAIL: ${title} ${detail ? '(' + detail + ')' : ''}`); failed++; }
}

const usFile = fs.existsSync(path.join(__dirname, 'ysdms_pe_bridge.user.js')) ? 'ysdms_pe_bridge.user.js' : 'omni_pe_bridge.user.js';
const src = fs.readFileSync(path.join(__dirname, usFile), 'utf8');
function extractFunction(name) {
    const m = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm').exec(src);
    if (!m) throw new Error(`Không tìm thấy hàm ${name}`);
    let depth = 0;
    for (let i = src.indexOf('{', m.index); i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && --depth === 0) return src.slice(m.index, i + 1);
    }
    throw new Error(`Không đóng ngoặc được hàm ${name}`);
}

console.log('=================================================================');
console.log('  TEST HỒI QUY SINGLE-FLIGHT LOCK & AWAIT SUPABASE (v2.2.0)');
console.log('=================================================================');

// ---------- Môi trường giả lập ----------
const store = {};
global.localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
};
const TURN_STATES = { PE_TURN: 'PE_TURN', AN_TURN: 'AN_TURN', IDLE: 'IDLE' };
const DELIVERY_STATES = { ACKNOWLEDGED: 'ACKNOWLEDGED', IDLE: 'IDLE', WAITING_FOR_ACK: 'WAITING_FOR_ACK' };
const STATES = { AN_REPORTED: 'AN_REPORTED', WAITING_FOR_AN_ACK: 'WAITING_FOR_AN_ACK' };
let currentTurnState = TURN_STATES.IDLE;
let currentWorkflowState = null;
let currentAnMessageId = '';
let lastAnReportContent = '';
let currentCorrelation = {};
let isWaitingForNewPeResponse = false, hasObservedNewStream = false;
let isPeRequestInFlight = false, isPeStreaming = false;
let baselinePeTextHash = null, isAtomicUpdating = false, isBridgePaused = false;
let lastProcessedRowId = null, lastSupabaseRecord = null, lastRehydrationSource = 'INITIAL';
let lastThreadId = 'OMNI-CYCLE-001';
let currentNextActor = 'NONE';
let perplexityBusy = false;
let injectCount = 0;
let isAwaitingSupabaseNewRow = false;
let lastSubmittedAnReportId = null;

function terminateActivity() {}
function setDeliveryState(d) {}
function setTurnState(t, next = 'NONE') { currentTurnState = t; currentNextActor = next; }
function transitionToPeDirective(record, source, timeStr) {
    currentTurnState = TURN_STATES.AN_TURN;
    currentNextActor = 'AN';
    setAwaitingSupabaseNewRow(false);
    currentCorrelation.pendingAnReport = false;
}
function transitionToThoanDirective(record, source, timeStr) {
    currentTurnState = TURN_STATES.AN_TURN;
    currentNextActor = 'AN';
    setAwaitingSupabaseNewRow(false);
    currentCorrelation.pendingAnReport = false;
}
function formatJstTime() { return '07:28 JST'; }
function getLatestPeResponse() { return { text: 'PE old answer' }; }
function hashString(s) { return s.length; }
function updatePreviewFeed() {}
function playTone() {}
function showToast() {}
function logStateSnapshot() {}
function isPerplexityStreaming() { return perplexityBusy; }

// renderTurnUI giả lập: dùng ĐÚNG điều kiện cổng auto-submit của bản thật v2.2.0
function renderTurnUI() {
    if (isAwaitingSupabaseNewRow || (currentAnMessageId && currentAnMessageId === lastSubmittedAnReportId && isReportConsumed(currentAnMessageId))) {
        currentCorrelation.pendingAnReport = false;
    }
    if (currentTurnState !== TURN_STATES.PE_TURN || !currentCorrelation.pendingAnReport || isAwaitingSupabaseNewRow || currentAnMessageId === lastSubmittedAnReportId) return;
    const reason = getAutoInjectBlockReason(currentAnMessageId);
    if (reason === 'REPORT_HANDLED' || reason === 'REPORT_ALREADY_INJECTED' || reason === 'REPORT_ALREADY_SUBMITTED' || reason === 'AWAITING_SUPABASE_UPDATE') {
        currentCorrelation.pendingAnReport = false;
    }
    if (reason) return;
    // == executeFillAndSubmit (nhánh auto): khóa & bật trạng thái chờ TRƯỚC khi submit ==
    injectCount++;
    saveConsumedReport(currentAnMessageId);
    setAwaitingSupabaseNewRow(true, currentAnMessageId);
    currentCorrelation.pendingAnReport = false;
    isWaitingForNewPeResponse = true;
    isPeRequestInFlight = true;
}

// ---------- Nạp hàm thật ----------
eval([
    'setAwaitingSupabaseNewRow', 'getStoredHandledReports', 'isReportHandled',
    'getStoredConsumedReports', 'saveConsumedReport', 'isReportConsumed',
    'isReportLocked', 'getAutoInjectBlockReason', 'applyLocalLockToCorrelation',
    'transitionToAnReported', 'handleSupabaseRowPersisted'
].map(extractFunction).join('\n'));

const REPORT_ID = '5aed636e-9e4a-47c0-8cf0-9c6fa49b5ac6';
const rec = { id: REPORT_ID, thread_id: 'OMNI-CYCLE-001', sender: 'AN', content_md: 'Bao cao AN: Nghiem thu Vong 1 ... (day du)', created_at: new Date().toISOString() };

// Kịch bản 1: Hub phát sự kiện báo cáo AN mới
handleSupabaseRowPersisted(rec, 'DIRECT_AN_INSERT');
assert('Lần đầu: báo cáo được đổ vào PE đúng 1 lần', injectCount === 1, `injectCount=${injectCount}`);
assert('Báo cáo đã bị khóa CONSUMED ngay khi đổ', isReportConsumed(REPORT_ID));
assert('Trạng thái chờ Supabase được kích hoạt sau khi đổ', isAwaitingSupabaseNewRow === true);
assert('lastSubmittedAnReportId được ghi nhận chính xác', lastSubmittedAnReportId === REPORT_ID);
assert('pendingAnReport bị khóa về false', currentCorrelation.pendingAnReport === false);

// Kịch bản 2: Sự kiện trùng hoặc vòng Poll 3s khi Supabase CHƯA cập nhật dữ liệu mới
perplexityBusy = true; // PE bắt đầu suy nghĩ/trả lời
handleSupabaseRowPersisted({ ...rec, content_md: `Bản ghi báo cáo ID: ${REPORT_ID}` }, 'SSE_AN_REPORT');
assert('Sự kiện trùng khi đang chờ KHÔNG đổ lại', injectCount === 1, `injectCount=${injectCount}`);
assert('Cờ PE in-flight KHÔNG bị reset', isPeRequestInFlight === true);
assert('getAutoInjectBlockReason trả về lý do chặn AWAITING_SUPABASE_UPDATE hoặc REPORT_ALREADY_SUBMITTED', 
    getAutoInjectBlockReason(REPORT_ID) === 'AWAITING_SUPABASE_UPDATE' || getAutoInjectBlockReason(REPORT_ID) === 'REPORT_ALREADY_SUBMITTED');

for (let i = 0; i < 10; i++) {
    currentCorrelation = { threadId: 'OMNI-CYCLE-001', hasPendingReport: true, pendingAnReport: true,
        latestReport: { reportId: REPORT_ID, status: 'CONSUMED' } };
    applyLocalLockToCorrelation();
    renderTurnUI();
    handleSupabaseRowPersisted(rec, 'POLL_FALLBACK');
}
assert('10 chu kỳ Poll với Hub cũ vẫn giữ nguyên injectCount = 1', injectCount === 1, `injectCount=${injectCount}`);
assert('pendingAnReport luôn bị ép về false trong suốt quá trình chờ', currentCorrelation.pendingAnReport === false);

// Kịch bản 3: PE hoàn tất phản hồi, PE không còn bận nhưng Supabase VẪN chưa có hàng mới
perplexityBusy = false; isPeRequestInFlight = false; isWaitingForNewPeResponse = false;
currentCorrelation = { pendingAnReport: true, latestReport: { reportId: REPORT_ID } };
applyLocalLockToCorrelation(); renderTurnUI();
assert('Sau khi PE rảnh, nếu Supabase chưa có hàng mới thì VẪN KHÔNG ĐỔ LẠI', injectCount === 1, `injectCount=${injectCount}`);

// Kịch bản 4: Supabase cập nhật bản ghi MỚI từ PE (sender: 'PE')
const peRec = { id: 'pe-resp-00000000-0000-0000-0000-000000000001', thread_id: 'OMNI-CYCLE-001', sender: 'PE', content_md: 'Chi thi tu PE: Tiep tuc Vong 2', created_at: new Date().toISOString() };
handleSupabaseRowPersisted(peRec, 'HUB_SUPABASE_SYNC');
assert('Nhận bản ghi mới từ PE: Trạng thái chờ Supabase được giải phóng', isAwaitingSupabaseNewRow === false);
assert('Chuyển sang lượt AN (AN_TURN)', currentTurnState === TURN_STATES.AN_TURN);
assert('Đối tượng tiếp nhận là AN', currentNextActor === 'AN');
assert('Không đổ báo cáo nào vào PE khi đến lượt AN', injectCount === 1, `injectCount=${injectCount}`);

// Kịch bản 5: Supabase cập nhật bản ghi MỚI từ THOAN (sender: 'THOAN')
const thoanRec = { id: 'thoan-dir-000000-0000-0000-0000-000000000001', thread_id: 'OMNI-CYCLE-001', sender: 'THOAN', content_md: 'Chi thi truc tiep tu Minh Chu THOAN', created_at: new Date().toISOString() };
handleSupabaseRowPersisted(thoanRec, 'HUB_SUPABASE_SYNC');
assert('Nhận bản ghi từ THOAN: Lượt vẫn là AN_TURN', currentTurnState === TURN_STATES.AN_TURN);
assert('Đối tượng tiếp nhận từ THOAN là AN', currentNextActor === 'AN');
assert('Không đổ vào PE', injectCount === 1, `injectCount=${injectCount}`);

// Kịch bản 6: AN hoàn thành thi công, nộp bản ghi BÁO CÁO MỚI lên Supabase (sender: 'AN', ID mới)
const rec2 = { id: 'aaaaaaaa-0000-0000-0000-000000000002', thread_id: 'OMNI-CYCLE-001', sender: 'AN', content_md: 'Bao cao AN vong 2 moi tinh', created_at: new Date().toISOString() };
handleSupabaseRowPersisted(rec2, 'DIRECT_AN_INSERT');
assert('Bản ghi mới từ AN: Chuyển sang lượt PE (PE_TURN)', currentTurnState === TURN_STATES.PE_TURN);
assert('Đối tượng tiếp nhận từ AN là PE', currentNextActor === 'PE');
assert('Báo cáo mới được đổ vào PE (lần 2 tổng cộng)', injectCount === 2, `injectCount=${injectCount}`);
assert('Sau khi đổ lần 2: Hệ thống lại vào trạng thái chờ Supabase cập nhật mới', isAwaitingSupabaseNewRow === true);
assert('lastSubmittedAnReportId cập nhật sang báo cáo mới', lastSubmittedAnReportId === rec2.id);

// Duplicate sự kiện cho báo cáo 2
handleSupabaseRowPersisted(rec2, 'SSE_AN_REPORT');
handleSupabaseRowPersisted(rec2, 'POLL_FALLBACK');
assert('Báo cáo 2 không bị đổ lặp', injectCount === 2, `injectCount=${injectCount}`);

// Kịch bản 7: Báo cáo AN thứ 3 đến khi PE đang bận -> HOÃN, rồi đổ khi PE rảnh
const rec3 = { id: 'bbbbbbbb-0000-0000-0000-000000000003', thread_id: 'OMNI-CYCLE-001', sender: 'AN', content_md: 'Bao cao AN vong 3', created_at: new Date().toISOString() };
perplexityBusy = true;
handleSupabaseRowPersisted(rec3, 'DIRECT_AN_INSERT');
assert('PE đang bận: báo cáo 3 bị HOÃN (không chen ngang)', injectCount === 2, `injectCount=${injectCount}`);
assert('Báo cáo hoãn giữ pendingAnReport = true', currentCorrelation.pendingAnReport === true);
perplexityBusy = false;
renderTurnUI(); // chu kỳ poll kế tiếp khi PE rảnh
assert('PE rảnh: báo cáo 3 được đổ đúng 1 lần (lần 3 tổng cộng)', injectCount === 3, `injectCount=${injectCount}`);
assert('Sau khi đổ báo cáo 3: Lập tức vào trạng thái chờ Supabase mới', isAwaitingSupabaseNewRow === true);
renderTurnUI(); renderTurnUI();
assert('Không đổ lặp sau khi đã đổ báo cáo 3', injectCount === 3, `injectCount=${injectCount}`);

console.log('=================================================================');
console.log(`  KẾT QUẢ: ${passed} PASS / ${failed} FAIL`);
console.log('=================================================================');
process.exit(failed === 0 ? 0 : 1);
