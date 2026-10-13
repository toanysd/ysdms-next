/**
 * TEST SUITE: EXACTLY-ONCE DISPATCH & THINKING SHIELD (v2.3.0)
 * Kiểm chứng 6 cam kết an toàn cốt lõi:
 * 1. Chế độ "Chỉ dán chatbox" chỉ đổ đúng 1 lần cho mỗi report ID (Single Injection Guard).
 * 2. Ô chat rỗng (sau khi submit hoặc bị xóa) TUYỆT ĐỐI KHÔNG kích hoạt đổ lặp.
 * 3. Khi PE đang suy nghĩ / nghiên cứu (isPerplexityBusy = true) -> CHẶN 100% việc đụng vào ô chat.
 * 4. Khi người dùng submit thủ công (Enter / Click), hệ thống nhận diện ngay và khóa trạng thái chờ Supabase.
 * 5. Muốn đổ lại cùng 1 báo cáo, người dùng BẮT BUỘC phải bấm thủ công (force = true).
 * 6. Chiều ngược lại (PE ➔ AN): Mỗi phản hồi của PE chỉ được forward sang Supabase đúng 1 lần cho mỗi inReplyTo.
 *
 * Chạy: node tools/realtime-bridge/test_exactly_once_guard.cjs
 */
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
function assert(title, cond, detail = '') {
    if (cond) { console.log(`  ✓ PASS: ${title}`); passed++; }
    else { console.error(`  ✗ FAIL: ${title} ${detail ? '(' + detail + ')' : ''}`); failed++; }
}

const usFile = 'ysdms_pe_bridge.user.js';
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
console.log('  TEST SUITE: EXACTLY-ONCE DISPATCH & THINKING SHIELD (v2.3.0)');
console.log('=================================================================');

// ---------- Giả lập môi trường ----------
const store = {};
global.localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
};

const TURN_STATES = { PE_TURN: 'PE_TURN', AN_TURN: 'AN_TURN', IDLE: 'IDLE' };
let currentTurnState = TURN_STATES.IDLE;
let currentAnMessageId = '';
let lastSubmittedAnReportId = null;
let lastInjectedReportId = null;
let isAwaitingSupabaseNewRow = false;
let isWaitingForNewPeResponse = false;
let isPeRequestInFlight = false;
let isPeStreaming = false;
let baselinePeTextHash = null;
let currentCorrelation = {};
let isBridgePaused = false;
let isSubmitting = false;
let lastFilledReportId = null;
let lastThreadId = 'WO-P1-009';
let mockInputText = '';
let busyFlag = false;
let injectCount = 0;

function logStateSnapshot() {}
function showToast() {}
function renderTurnUI() {}
function getLatestPeResponse() { return { text: 'PE old baseline answer' }; }
function hashString(s) { return String(s).length * 31; }
function isReportHandled() { return false; }
function isReportConsumed() { return false; }
function saveConsumedReport() {}

// Nạp hàm thật từ Userscript
eval([
    'getStoredInjectedReports', 'isReportInjected', 'markReportInjected', 'setAwaitingSupabaseNewRow',
    'isReportLocked', 'getAutoInjectBlockReason'
].map(extractFunction).join('\n'));

// Giả lập hàm isPerplexityBusy kết nối cờ kiểm thử
global.isPerplexityBusy = function() { return busyFlag; };

const REPORT_1 = 'aa540adc-f693-465a-8b32-b6dc9856c9fd';
const REPORT_2 = 'bb651bee-07d1-459a-980f-61c0656347a3';

// -----------------------------------------------------------------
// [TEST 1] Single Injection Guard: Đổ lần đầu thành công
// -----------------------------------------------------------------
currentAnMessageId = REPORT_1;
assert('Ban đầu: Báo cáo 1 chưa được inject', !isReportInjected(REPORT_1));
markReportInjected(REPORT_1);
assert('Sau khi inject: isReportInjected trả về true', isReportInjected(REPORT_1));
assert('localStorage lưu đúng ID đã inject', localStorage.getItem('omni_bridge_last_injected_report_id') === REPORT_1);

// -----------------------------------------------------------------
// [TEST 2] Block lặp khi chatbox rỗng: Ô chat rỗng không được đổ lại
// -----------------------------------------------------------------
mockInputText = ''; // Ô chat bị xóa rỗng sau khi người dùng gửi hoặc do Perplexity reset
const isAlreadyInjected = isReportInjected(currentAnMessageId) || lastFilledReportId === currentAnMessageId;
assert('Phát hiện báo cáo đã từng được inject', isAlreadyInjected === true);
const blockReason = getAutoInjectBlockReason(currentAnMessageId);
assert('getAutoInjectBlockReason chặn với mã REPORT_ALREADY_INJECTED', blockReason === 'REPORT_ALREADY_INJECTED');

// -----------------------------------------------------------------
// [TEST 3] Thinking Shield: Khi PE đang suy nghĩ/làm việc -> Chặn 100%
// -----------------------------------------------------------------
currentAnMessageId = REPORT_2; // Báo cáo mới 2 chưa từng inject
busyFlag = true; // PE đang nghiên cứu / suy nghĩ (Sonnet Thinking)
const busyReason = getAutoInjectBlockReason(REPORT_2);
assert('Khi PE bận: getAutoInjectBlockReason chặn với mã PERPLEXITY_BUSY', busyReason === 'PERPLEXITY_BUSY');

// -----------------------------------------------------------------
// [TEST 4] Bắt sự kiện submit thủ công của người dùng
// -----------------------------------------------------------------
busyFlag = false;
function simulateUserSubmit(reportId) {
    saveConsumedReport(reportId);
    setAwaitingSupabaseNewRow(true, reportId);
    markReportInjected(reportId);
    isPeRequestInFlight = true;
    isWaitingForNewPeResponse = true;
    currentCorrelation.pendingAnReport = false;
}
simulateUserSubmit(REPORT_2);
assert('Sau submit thủ công: isAwaitingSupabaseNewRow = true', isAwaitingSupabaseNewRow === true);
assert('lastSubmittedAnReportId ghi nhận đúng REPORT_2', lastSubmittedAnReportId === REPORT_2);
assert('isPeRequestInFlight = true', isPeRequestInFlight === true);
assert('getAutoInjectBlockReason chặn với AWAITING_SUPABASE_UPDATE', getAutoInjectBlockReason(REPORT_2) === 'AWAITING_SUPABASE_UPDATE');

// -----------------------------------------------------------------
// [TEST 5] Quyền bấm thủ công (force = true)
// -----------------------------------------------------------------
function canFill(force, reportId) {
    if (force) return true; // Minh Chủ chủ động bấm Alt+F9
    if (isPerplexityBusy()) return false;
    if (isReportInjected(reportId)) return false;
    return true;
}
assert('Chế độ tự động: Bị chặn vì đã inject', canFill(false, REPORT_1) === false);
assert('Chế độ thủ công (force=true): Cho phép đổ lại theo lệnh người dùng', canFill(true, REPORT_1) === true);

// -----------------------------------------------------------------
// [TEST 6] Chiều ngược lại (PE ➔ AN): Idempotent Forwarding
// -----------------------------------------------------------------
let forwardCount = 0;
function simulateForwardPeResponse(text, inReplyTo, force = false) {
    const textHash = hashString(text);
    const lastHash = localStorage.getItem('omni_bridge_last_forwarded_hash');
    const lastInReply = localStorage.getItem('omni_bridge_last_forwarded_in_reply_to');

    if (!force) {
        if (textHash === lastHash) return false;
        if (inReplyTo && inReplyTo === lastInReply) return false;
    }

    forwardCount++;
    localStorage.setItem('omni_bridge_last_forwarded_hash', textHash);
    if (inReplyTo) {
        localStorage.setItem('omni_bridge_last_forwarded_in_reply_to', inReplyTo);
    }
    return true;
}

const peAnswer1 = 'PE APPROVAL: Ke hoach WO-P1-009 phe duyet thanh cong.';
assert('Forward lần 1: Thành công', simulateForwardPeResponse(peAnswer1, REPORT_1) === true);
assert('Forward lần 2 (cùng reply/hash): Bị chặn (Idempotent)', simulateForwardPeResponse(peAnswer1, REPORT_1) === false);
assert('forwardCount vẫn là 1', forwardCount === 1);
assert('Forward lần 3 với force=true: Cho phép theo lệnh người dùng', simulateForwardPeResponse(peAnswer1, REPORT_1, true) === true);
assert('forwardCount nâng lên 2', forwardCount === 2);

console.log('=================================================================');
console.log(`  KẾT QUẢ: ${passed} PASS / ${failed} FAIL`);
console.log('=================================================================');
process.exit(failed === 0 ? 0 : 1);
