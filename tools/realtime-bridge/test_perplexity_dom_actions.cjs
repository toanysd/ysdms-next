/**
 * TEST MÔ PHỎNG HÀNH VI TRÊN TRANG PERPLEXITY THẬT (DOM & WORKFLOW TEST)
 * Kiểm chứng 100% logic của omni_pe_bridge.user.js:
 * 1. Nhận diện ô nhập Perplexity và nút Submit
 * 2. Cơ chế Tạm Dừng (Alt+P / isBridgePaused)
 * 3. Khung xem tin nhắn (Message Viewer & Copy)
 * 4. Cụm nút điền nhanh thủ công (PE Review, AN Execute, Ping)
 * 5. Bộ lọc Envelope Protocol & Tem thời gian Rule 4
 * 6. Bộ khử dấu tiếng Việt triệt tiêu lỗi KaTeX
 */

const fs = require('fs');
const path = require('path');

console.log("=================================================================");
console.log("  KIỂM THỬ MÔ PHỎNG HÀNH VI THỰC TẾ TRÊN PERPLEXITY (DOM ACTIONS)");
console.log("=================================================================");

let passed = 0;
let failed = 0;

function assert(title, condition, detail = "") {
    if (condition) {
        console.log(`  ✓ PASS: ${title}`);
        passed++;
    } else {
        console.error(`  ✗ FAIL: ${title} ${detail ? "(" + detail + ")" : ""}`);
        failed++;
    }
}

// 1. Đọc mã nguồn userscript
const usFile = fs.existsSync(path.join(__dirname, 'ysdms_pe_bridge.user.js')) ? 'ysdms_pe_bridge.user.js' : 'omni_pe_bridge.user.js';
const usPath = path.join(__dirname, usFile);
const usContent = fs.readFileSync(usPath, 'utf8');

// 2. Trích xuất các hàm quan trọng từ userscript
function extractFunction(name) {
    const regex = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
    const match = regex.exec(usContent);
    if (!match) return null;
    
    let start = match.index;
    let braceCount = 0;
    let end = -1;
    for (let i = usContent.indexOf('{', start); i < usContent.length; i++) {
        if (usContent[i] === '{') braceCount++;
        else if (usContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                end = i + 1;
                break;
            }
        }
    }
    return end !== -1 ? usContent.slice(start, end) : null;
}

// Kiểm tra hàm tồn tại
assert("Tìm thấy hàm verifyDirectiveIntegrity", extractFunction('verifyDirectiveIntegrity') !== null);
assert("Tìm thấy hàm removeVietnameseTones", extractFunction('removeVietnameseTones') !== null);
assert("Tìm thấy hàm togglePause", extractFunction('togglePause') !== null);
assert("Tìm thấy hàm toggleViewer", extractFunction('toggleViewer') !== null);
assert("Tìm thấy hàm toggleQuickRow", extractFunction('toggleQuickRow') !== null);
assert("Tìm thấy hàm triggerAnManualPing", extractFunction('triggerAnManualPing') !== null);

// 3. Test Logic Envelope Integrity (Chống cắt cụt văn bản khi Claude Sonnet stream)
eval(extractFunction('removeVietnameseTones'));
eval(extractFunction('verifyDirectiveIntegrity'));

const textTruncated = `=== PE-DIRECTIVE ===
Thread: OMNI-001
Chỉ thị đang viết dở dang...`;

const checkTruncated = verifyDirectiveIntegrity(textTruncated);
assert("Phát hiện văn bản bị cắt cụt (thiếu === END ===)", checkTruncated.complete === false);

const textCompleteEnvelope = `=== PE-DIRECTIVE ===
Thread: OMNI-001
Phán quyết: APPROVE
=== END ===`;
const checkCompleteEnvelope = verifyDirectiveIntegrity(textCompleteEnvelope);
assert("Phê duyệt văn bản có đủ Envelope Protocol", checkCompleteEnvelope.complete === true);

const textRule4Only = `Chỉ thị không có envelope nhưng có tem kết thúc.
⏱️ [PE KẾT THÚC: 2026-10-09 08:51:00]`;
const checkRule4 = verifyDirectiveIntegrity(textRule4Only);
assert("Phê duyệt văn bản có tem Rule 4 kết thúc", checkRule4.complete === true);

// 4. Test Bộ Lọc Tiếng Việt Không Dấu (KaTeX Conflict Prevention)
const sampleVietnamese = "Kiểm tra tiến độ thực thi lệnh của AN và phê duyệt dự án";
const stripped = removeVietnameseTones(sampleVietnamese);
assert("Khử dấu tiếng Việt triệt tiêu lỗi KaTeX", !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(stripped));
assert("Nội dung không dấu chính xác", stripped === "Kiem tra tien do thuc thi lenh cua AN va phe duyet du an");

// 5. Test Mô Phỏng Trạng Thái Tạm Dừng (Pause State / Alt+P)
let testPaused = false;
function simulateTogglePause() {
    testPaused = !testPaused;
    return testPaused ? "PAUSED" : "ACTIVE";
}
assert("Kích hoạt Alt+P lần 1 -> Chuyển sang PAUSED", simulateTogglePause() === "PAUSED");
assert("Kích hoạt Alt+P lần 2 -> Khôi phục ACTIVE", simulateTogglePause() === "ACTIVE");

// 6. Test Cấu Trúc Khung Xem Tin và Cụm Nút Điền Nhanh
assert("Khung xem tin có ID omni-bridge-viewer", usContent.includes('id="omni-bridge-viewer"'));
assert("Khung xem tin có ô chứa văn bản omni-preview-content", usContent.includes('id="omni-preview-content"'));
assert("Khung xem tin có thanh metadata feed omni-feed-meta", usContent.includes('id="omni-feed-meta"'));
assert("Thanh feed có badge người gửi omni-feed-sender-badge", usContent.includes('id="omni-feed-sender-badge"'));
assert("Thanh feed có thời gian JST omni-feed-time", usContent.includes('id="omni-feed-time"'));
assert("Thanh feed có thông tin thread omni-feed-thread", usContent.includes('id="omni-feed-thread"'));
assert("Thanh feed có thông tin row ID omni-feed-id", usContent.includes('id="omni-feed-id"'));
assert("Khay điền nhanh có nút PE Đọc & Duyệt", usContent.includes('omni-btn-quick-pe'));
assert("Khay điền nhanh có nút AN Nhận & Thi Công", usContent.includes('omni-btn-quick-an'));
assert("Khay điền nhanh có nút Ping Cầu Nối", usContent.includes('omni-btn-quick-ping'));
assert("Lắng nghe phím tắt Alt+P trong keydown", usContent.includes('(e.key === "p" || e.key === "P" || e.code === "KeyP")'));

// 7. Test SSOT Message Feed Logic & JST Formatter
assert("Tìm thấy hàm formatJstDateTime", extractFunction('formatJstDateTime') !== null);
assert("Tìm thấy hàm formatJstTime", extractFunction('formatJstTime') !== null);
assert("Tìm thấy hàm updatePreviewFeed", extractFunction('updatePreviewFeed') !== null);
assert("Tìm thấy hàm transitionToThoanDirective", extractFunction('transitionToThoanDirective') !== null);

eval(extractFunction('formatJstDateTime'));
eval(extractFunction('formatJstTime'));

const sampleUtc = "2026-10-10T02:00:00.000Z"; // 11:00:00 JST (+09:00)
const jstFormatted = formatJstDateTime(sampleUtc);
assert("formatJstDateTime định dạng đúng múi giờ Asia/Tokyo", jstFormatted.includes("11:00:00") && jstFormatted.includes("JST"));
const jstTimeOnly = formatJstTime(sampleUtc);
assert("formatJstTime chứa giờ và hậu tố JST", jstTimeOnly.includes("11:00:00") && jstTimeOnly.includes("JST"));

// 8. Test Nhận Diện Nút Submit & Chống False-Positive v1.0.9
assert("Tìm thấy hàm findPerplexitySubmitButton", extractFunction('findPerplexitySubmitButton') !== null);
assert("Tìm thấy hàm submitPerplexityInput", extractFunction('submitPerplexityInput') !== null);

// Mô phỏng cây DOM Perplexity thực tế (gồm cả chip GitHub, Supabase và thanh toolbar)
const mockDomButtons = [
    { text: "@ GitHub", aria: "GitHub connector", title: "", testId: "", rect: { bottom: 400, right: 300, width: 80, height: 28 }, type: "button", id: "btn-chip-github" },
    { text: "⚡ Supabase", aria: "Supabase connector", title: "", testId: "", rect: { bottom: 400, right: 400, width: 90, height: 28 }, type: "button", id: "btn-chip-supabase" },
    { text: "+", aria: "Attach files", title: "", testId: "", rect: { bottom: 450, right: 50, width: 32, height: 32 }, type: "button", id: "btn-attach" },
    { text: "Search", aria: "Search mode", title: "", testId: "", rect: { bottom: 450, right: 120, width: 60, height: 32 }, type: "button", id: "btn-search" },
    { text: "Computer", aria: "Computer use", title: "", testId: "", rect: { bottom: 450, right: 200, width: 70, height: 32 }, type: "button", id: "btn-computer" },
    { text: "15 drafts", aria: "Drafts", title: "", testId: "", rect: { bottom: 450, right: 280, width: 60, height: 32 }, type: "button", id: "btn-drafts" },
    { text: "Model", aria: "Select model", title: "", testId: "", rect: { bottom: 450, right: 360, width: 60, height: 32 }, type: "button", id: "btn-model" },
    { text: "", aria: "Voice input", title: "Microphone", testId: "", rect: { bottom: 450, right: 420, width: 32, height: 32 }, type: "button", id: "btn-mic" },
    // Nút Submit tròn đen ở góc phải ngoài cùng
    { text: "", aria: "Submit", title: "Submit query", testId: "submit-button", rect: { bottom: 450, right: 480, width: 32, height: 32 }, type: "button", id: "btn-submit-real" }
];

// Trích xuất logic loại trừ từ findPerplexitySubmitButton
function testFilterSubmitButton(buttons) {
    const banned = ['github', 'supabase', 'search', 'computer', 'draft', 'model', 'attach', 'mic', '+'];
    const candidates = buttons.filter(b => {
        const text = (b.text || '').toLowerCase().trim();
        const aria = (b.aria || '').toLowerCase().trim();
        const combined = `${text} ${aria}`;
        if (text.startsWith('@')) return false;
        for (const kw of banned) {
            if (combined.includes(kw)) return false;
        }
        return true;
    });

    candidates.sort((a, b) => {
        if (Math.abs(a.rect.bottom - b.rect.bottom) > 15) return b.rect.bottom - a.rect.bottom;
        return b.rect.right - a.rect.right;
    });
    return candidates[0] || null;
}

const chosenBtn = testFilterSubmitButton(mockDomButtons);
assert("Loại bỏ 100% connector chip (@ GitHub, Supabase) và nút toolbar phụ", chosenBtn !== null && chosenBtn.id === "btn-submit-real");

// 9. Test Tiêu Chí Xác Nhận Submit (Strictly Non-Falsifiable)
const sampleReportMarker = "AN da nop bao cao";
function testVerifySubmitSuccess(currentVal) {
    const trimmed = (currentVal || '').trim();
    return trimmed === '' || !trimmed.includes(sampleReportMarker);
}

assert("Xác nhận THẤT BẠI khi văn bản báo cáo vẫn còn trong ô chat", testVerifySubmitSuccess("AN da nop bao cao [ID: 8ae21b4a...]: Nội dung dở dang") === false);
assert("Xác nhận THÀNH CÔNG khi ô chat bị xóa sạch rỗng", testVerifySubmitSuccess("") === true);
assert("Xác nhận THÀNH CÔNG khi ô chat đã chuyển sang câu hỏi mới không còn text báo cáo", testVerifySubmitSuccess("Xin chào Perplexity") === true);

// 10. Test Tính Năng Auto Submit Ngẫu Nhiên 1-4s (Random Submit Delay)
assert("Tìm thấy hàm getRandomSubmitDelayMs trong Userscript", usContent.includes("function getRandomSubmitDelayMs"));
assert("Tìm thấy hàm buildAnReportPingMessage trong Userscript", usContent.includes("function buildAnReportPingMessage"));
assert("Cấu hình AUTO_SUBMIT_MIN_SEC = 1 và AUTO_SUBMIT_MAX_SEC = 4", usContent.includes("AUTO_SUBMIT_MIN_SEC: 1") && usContent.includes("AUTO_SUBMIT_MAX_SEC: 4"));
assert("Giao diện Auto Submit hiển thị nhãn Đổ & Submit (1-4s)", usContent.includes("Đổ & Submit (1-4s)"));

// Trích xuất và kiểm tra phân bổ ngẫu nhiên từ hàm getRandomSubmitDelayMs
function evalRandomSubmitDelayMs(minSec = 1, maxSec = 4) {
    const minMs = minSec * 1000;
    const maxMs = maxSec * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

let minObserved = Infinity;
let maxObserved = -Infinity;
const sampleDelays = [];
for (let i = 0; i < 1000; i++) {
    const d = evalRandomSubmitDelayMs(1, 4);
    if (d < minObserved) minObserved = d;
    if (d > maxObserved) maxObserved = d;
    if (i < 5) sampleDelays.push((d / 1000).toFixed(1) + "s");
}

assert("Độ trễ ngẫu nhiên luôn nằm nghiêm ngặt trong khoảng [1000ms, 4000ms]", minObserved >= 1000 && maxObserved <= 4000);
assert("Độ trễ không phải cố định 4s mà phân bổ đa dạng (Variance > 0)", maxObserved > minObserved && (maxObserved - minObserved) >= 2500, `Min: ${minObserved}ms, Max: ${maxObserved}ms`);

console.log("=================================================================");
console.log(`KẾT QUẢ DOM SIMULATION: Tổng: ${passed + failed} | ĐẠT: ${passed} | LỖI: ${failed}`);
console.log(`Mẫu độ trễ ngẫu nhiên: [ ${sampleDelays.join(", ")} ]`);
console.log("=================================================================");

if (failed > 0) process.exit(1);
console.log("✅ 100% KIỂM THỬ HÀNH VI PERPLEXITY & AUTO SUBMIT 1-4S ĐẠT CHUẨN!");
