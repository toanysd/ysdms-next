// ==UserScript==
// @name         [v2.7.4] 🏭 YSDMS NextGen — PE ⟷ AN Realtime Bridge (Next-Step Status & Auto-Resume Button)
// @namespace    http://tampermonkey.net/
// @version      2.7.4
// @description  [v2.7.4] Cầu nối thời gian thực cho YSDMS NextGen: Hiển thị rõ Bước Tiếp Theo (Next Step), Nhận diện chính xác khi PE trả lời xong (kể cả khi đang Tạm dừng / F5 / Copy thủ công), Nút bấm trực quan [Tạm dừng / Tiếp tục Tự động gửi] tự động bắn sang AN ngay khi bấm Tiếp tục.
// @author       Antigravity (AN) & Perplexity (PE) — Approved by Minh Chủ THOAN
// @match        https://www.perplexity.ai/*
// @match        https://perplexity.ai/*
// @noframes
// @updateURL    http://127.0.0.1:3856/ysdms_pe_bridge.user.js
// @downloadURL  http://127.0.0.1:3856/ysdms_pe_bridge.user.js
// @connect      127.0.0.1
// @connect      localhost
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self || location.hostname === 'count.perplexity.ai') return;
    if (window.__YSDMS_BRIDGE_V274_LOADED__) return;
    window.__YSDMS_BRIDGE_V274_LOADED__ = true;

    const SCRIPT_VERSION = '2.7.4';
    const DEFAULT_PORT = 3856;
    const DEFAULT_THREAD_ID = 'BRIDGE-ORCHESTRATION';

    const STORAGE_KEYS = {
        PORT: 'ysdms_bridge_port_v25',
        MODE: 'ysdms_bridge_mode_v25', // 'PASTE_ONLY' | 'PASTE_AND_SUBMIT' | 'MANUAL'
        NO_ACCENT: 'ysdms_bridge_no_accent_v25',
        PAUSED: 'ysdms_bridge_paused_v25',
        MINIMIZED: 'ysdms_bridge_minimized_v25',
        POS: 'ysdms_bridge_pos_v25',
        INJECTED_MAP: 'ysdms_bridge_injected_map_v25',
        SUBMITTED_MAP: 'ysdms_bridge_submitted_map_v25',
        AN_BASELINE_MAP: 'ysdms_bridge_an_baseline_map_v274',
        DISPATCHED_AN_MAP: 'ysdms_bridge_dispatched_an_map_v274',
        LAST_FORWARDED_HASH: 'ysdms_bridge_last_fwd_hash_v25',
        TAB_PROJECT_OVERRIDE: 'bridge_tab_project_override_v25', // Lưu trong sessionStorage (riêng cho từng Tab)
        URL_OWNER_MAP: 'pe_bridge_url_owner_map_v27', // Ghim cứng URL hội thoại -> 'YSDMS' | 'OMNI'
        TAB_PAUSED_LOCK: 'pe_bridge_tab_paused_v27' // Khóa Pause cấp Tab dùng chung giữa các script
    };

    // =========================================================================
    // 1. QUẢN LÝ TRẠNG THÁI CỤC BỘ & KHÓA ĐỘC QUYỀN TAB ĐA DỰ ÁN (MUTUAL EXCLUSION)
    // =========================================================================
    function loadJsonStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveJsonStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }

    function hashString(str) {
        if (!str) return '0';
        let h = 0;
        for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        return String(h);
    }

    const state = {
        hubPort: parseInt(sessionStorage.getItem(STORAGE_KEYS.PORT) || localStorage.getItem(STORAGE_KEYS.PORT) || String(DEFAULT_PORT), 10) || DEFAULT_PORT,
        hubOnline: false,
        sseConnected: false,
        mode: localStorage.getItem(STORAGE_KEYS.MODE) || 'PASTE_ONLY',
        noAccent: localStorage.getItem(STORAGE_KEYS.NO_ACCENT) === 'true',
        isPaused: localStorage.getItem(STORAGE_KEYS.PAUSED) === 'true' || sessionStorage.getItem(STORAGE_KEYS.TAB_PAUSED_LOCK) === 'true',
        isMinimized: localStorage.getItem(STORAGE_KEYS.MINIMIZED) === 'true',
        feedOpen: false,
        latestRow: null,
        feedRows: [],
        turnPhase: 'IDLE', // IDLE | AN_STILL_WORKING_HOLD | AN_PENDING_INJECT | AN_TEXT_INJECTED | AN_SUBMITTING | WAITING_FOR_PE | PE_READY_TO_DISPATCH | WAITING_THOAN_APPROVAL | PE_DISPATCHED_TO_AN
        statusDetail: 'Đang kết nối Local Hub (:3856)...',
        injectedMap: loadJsonStorage(STORAGE_KEYS.INJECTED_MAP, {}),
        submittedMap: loadJsonStorage(STORAGE_KEYS.SUBMITTED_MAP, {}),
        anBaselineMap: loadJsonStorage(STORAGE_KEYS.AN_BASELINE_MAP, {}),
        dispatchedAnMap: loadJsonStorage(STORAGE_KEYS.DISPATCHED_AN_MAP, {}),
        submitTimer: null,
        isInjectingNow: false,
        isDispatchingPeNow: false,
        baselinePeProseText: '',
        lastObservedProseText: '',
        peStreamStableTicks: 0,
        pendingPeApprovalText: '',
        userSubmittedManualQuery: false,
        tabProjectOverride: sessionStorage.getItem(STORAGE_KEYS.TAB_PROJECT_OVERRIDE) || 'AUTO', // 'AUTO' | 'YSDMS' | 'OMNI'
        detectedTabProject: 'YSDMS' // 'YSDMS' | 'OMNI'
    };

    function isBridgeCurrentlyPaused() {
        if (state.isPaused) return true;
        if (localStorage.getItem(STORAGE_KEYS.PAUSED) === 'true') return true;
        if (sessionStorage.getItem(STORAGE_KEYS.TAB_PAUSED_LOCK) === 'true') return true;
        return false;
    }

    function setBridgePaused(paused) {
        state.isPaused = !!paused;
        localStorage.setItem(STORAGE_KEYS.PAUSED, String(state.isPaused));
        sessionStorage.setItem(STORAGE_KEYS.TAB_PAUSED_LOCK, String(state.isPaused));
        if (state.isPaused && state.submitTimer) {
            clearTimeout(state.submitTimer);
            state.submitTimer = null;
        }
        try {
            window.dispatchEvent(new CustomEvent('pe-bridge-pause-sync', { detail: { paused: state.isPaused } }));
        } catch {}
    }

    function getPinnedUrlOwner(pathname) {
        if (!pathname || pathname === '/' || pathname.length < 7) return null;
        const map = loadJsonStorage(STORAGE_KEYS.URL_OWNER_MAP, {});
        return map[pathname] || null;
    }

    function setPinnedUrlOwner(pathname, owner) {
        if (!pathname || pathname === '/' || pathname.length < 7) return;
        if (owner !== 'YSDMS' && owner !== 'OMNI') return;
        const map = loadJsonStorage(STORAGE_KEYS.URL_OWNER_MAP, {});
        if (map[pathname] !== owner) {
            map[pathname] = owner;
            const keys = Object.keys(map);
            if (keys.length > 80) delete map[keys[0]];
            saveJsonStorage(STORAGE_KEYS.URL_OWNER_MAP, map);
        }
    }

    /**
     * Thuật toán phân định ĐỘC QUYỀN Tab giữa YSDMS và OmniLinguist (100% loại trừ nhau):
     * 1. Ưu tiên quyền ép tay của Minh Chủ trên Tab (sessionStorage override).
     * 2. Nếu URL cuộc trò chuyện đã được ghim cứng (URL Pinning) -> giữ nguyên dự án đó, không bao giờ nhảy dự án dù nội dung chat nhắc tới tên dự án kia!
     * 3. Quét tiêu đề trang, URL và đoạn đầu cuộc hội thoại để định danh và ghim cứng URL.
     */
    function detectTabProjectAffinity() {
        const pathname = (window.location && window.location.pathname) || '';
        const override = sessionStorage.getItem(STORAGE_KEYS.TAB_PROJECT_OVERRIDE) || state.tabProjectOverride || 'AUTO';
        state.tabProjectOverride = override;
        if (override === 'YSDMS' || override === 'OMNI') {
            state.detectedTabProject = override;
            setPinnedUrlOwner(pathname, override);
            sessionStorage.setItem('pe_bridge_tab_owner_v27', override);
            return state.detectedTabProject;
        }

        // Nếu URL của cuộc trò chuyện này đã được ghim chủ sở hữu -> giữ cố định 100%
        const pinned = getPinnedUrlOwner(pathname);
        if (pinned === 'YSDMS' || pinned === 'OMNI') {
            state.detectedTabProject = pinned;
            sessionStorage.setItem('pe_bridge_tab_owner_v27', pinned);
            return state.detectedTabProject;
        }

        try {
            const titleAndUrl = `${document.title || ''} ${window.location.href || ''}`.toLowerCase();
            let sampleText = titleAndUrl;

            const proseNodes = document.querySelectorAll('h1, h2, .prose, [class*="prose"]');
            const maxNodes = Math.min(proseNodes.length, 6);
            for (let i = 0; i < maxNodes; i++) {
                const el = proseNodes[i];
                if (!el.closest('#ysdms-bridge-v25-root') && !el.closest('#omni-bridge-v25-root')) {
                    sampleText += ' ' + (el.innerText || el.textContent || '').slice(0, 500).toLowerCase();
                }
            }

            const ysdmsKeywords = [
                'ysdms', 'toanysd', 'pe_an_messages', 'mold_custody', 'khuôn', 'dao cắt',
                'panasonic', 'minebea', 'shirakawa', 'wo-p1-', 'wo-pipe', '3856', 'schema_reference'
            ];
            const omniKeywords = [
                'omnilinguist', 'omni_bridge', 'pe_bridge', 'omni-cycle', '3956',
                'omni_pe_bridge', 'omni_realtime_hub', 'linguist', 'vạn ngôn', 'nguyên ngữ'
            ];

            let ysdmsScore = 0;
            let omniScore = 0;

            for (const kw of ysdmsKeywords) {
                if (sampleText.includes(kw)) ysdmsScore += (titleAndUrl.includes(kw) ? 4 : 1);
            }
            for (const kw of omniKeywords) {
                if (sampleText.includes(kw)) omniScore += (titleAndUrl.includes(kw) ? 4 : 1);
            }

            if (omniScore > ysdmsScore && omniScore >= 1) {
                state.detectedTabProject = 'OMNI';
                setPinnedUrlOwner(pathname, 'OMNI');
                sessionStorage.setItem('pe_bridge_tab_owner_v27', 'OMNI');
            } else if (ysdmsScore > omniScore && ysdmsScore >= 1) {
                state.detectedTabProject = 'YSDMS';
                setPinnedUrlOwner(pathname, 'YSDMS');
                sessionStorage.setItem('pe_bridge_tab_owner_v27', 'YSDMS');
            } else {
                const prevTabOwner = sessionStorage.getItem('pe_bridge_tab_owner_v27');
                state.detectedTabProject = (prevTabOwner === 'OMNI' || prevTabOwner === 'YSDMS') ? prevTabOwner : 'YSDMS';
            }
        } catch {}

        return state.detectedTabProject;
    }

    function isTabActiveForYsdms() {
        return detectTabProjectAffinity() === 'YSDMS';
    }

    function getHubBaseUrl() {
        return `http://127.0.0.1:${state.hubPort}`;
    }

    function isMessageInjected(id) {
        return !!(id && state.injectedMap[id]);
    }

    function markMessageInjected(id) {
        if (!id) return;
        state.injectedMap[id] = Date.now();
        const keys = Object.keys(state.injectedMap);
        if (keys.length > 150) {
            delete state.injectedMap[keys[0]];
        }
        saveJsonStorage(STORAGE_KEYS.INJECTED_MAP, state.injectedMap);
    }

    function isMessageSubmitted(id) {
        return !!(id && state.submittedMap[id]);
    }

    function markMessageSubmitted(id) {
        if (!id) return;
        state.submittedMap[id] = Date.now();
        state.injectedMap[id] = Date.now();
        const keys = Object.keys(state.submittedMap);
        if (keys.length > 150) {
            delete state.submittedMap[keys[0]];
        }
        saveJsonStorage(STORAGE_KEYS.INJECTED_MAP, state.injectedMap);
        saveJsonStorage(STORAGE_KEYS.SUBMITTED_MAP, state.submittedMap);
    }

    // =========================================================================
    // 2. TIỆN ÍCH ÂM THANH (WEB AUDIO API) & XỬ LÝ TIẾNG VIỆT KHÔNG DẤU
    // =========================================================================
    function playChime(type = 'inject') {
        if (!isTabActiveForYsdms()) return;
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            const ctx = new Ctx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === 'inject') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'submit' || type === 'an_dispatch') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.08);
                osc.frequency.setValueAtTime(1046.5, now + 0.16);
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === 'warn') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(330, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            }
        } catch {}
    }

    function removeVietnameseAccents(str) {
        if (!str) return '';
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    function formatShortTime(isoStr) {
        if (!isoStr) return '--:--:--';
        try {
            const d = new Date(isoStr);
            return d.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Tokyo', hour12: false }) + ' JST';
        } catch {
            return '--:--:--';
        }
    }

    function formatFullJstStamp(isoStr) {
        try {
            const d = isoStr ? new Date(isoStr) : new Date();
            if (isNaN(d.getTime())) {
                return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }) + ' JST';
            }
            return d.toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }) + ' JST';
        } catch {
            return new Date().toISOString();
        }
    }

    // Tự động gắn nhãn Người gửi & Stamp thời gian JST cho mọi nội dung dán vào ô chat (nếu chưa có)
    function ensureChatboxPayloadStamped(rawText, options = {}) {
        if (!rawText) return '';
        const trimmed = rawText.trim();
        const hasStamp = /STAMP BẢN TIN:|STAMP XÁC THỰC|\[\s*🕒?\s*(STAMP|Thời gian|GỬI SUPABASE)[^\]]*\]/i.test(trimmed);
        if (hasStamp) return trimmed;

        const stamp = formatFullJstStamp(options.createdAt);
        const senderLabel = options.senderLabel || 'AN (Antigravity) ➔ PE (Perplexity)';
        const threadLabel = options.threadId || (state.latestRow && state.latestRow.thread_id) || DEFAULT_THREAD_ID;
        const msgIdShort = options.messageId ? ` | ID: ${String(options.messageId).slice(0, 8)}` : '';

        return [
            `🕒 [STAMP BẢN TIN: ${stamp} | 👤 NGƯỜI GỬI: ${senderLabel} | 📁 DỰ ÁN: YSDMS NextGen | 🧵 THREAD: ${threadLabel}${msgIdShort}]`,
            trimmed,
            `🕒 [STAMP XÁC THỰC CUỐI TIN: ${stamp} | NGƯỜI GỬI: ${senderLabel}${msgIdShort}]`
        ].join('\n');
    }

    // =========================================================================
    // 3. BỘ LỌC CHIP CONNECTOR (@Supabase / @GitHub) & KIỂM TRA TRẠNG THÁI BẬN
    // =========================================================================
    function isPerplexityBusy() {
        const stopSelectors = [
            'button[aria-label*="Stop" i]',
            'button[aria-label*="Dừng" i]',
            'button[data-testid*="stop" i]'
        ];
        for (const sel of stopSelectors) {
            const btn = document.querySelector(sel);
            if (btn && btn.offsetParent !== null) return true;
        }
        return false;
    }

    function isEchoBackTriggerText(text) {
        if (!text) return false;
        const lower = text.trim().toLowerCase();
        return (
            /^\[v2\.\d+\.\d+\]\s*pe đọc bridge/i.test(lower) ||
            lower.startsWith('pe đọc bridge.') ||
            lower.startsWith('pe doc bridge.') ||
            lower.includes('📌 báo cáo mới từ an đã lưu trên supabase') ||
            lower.includes('đề nghị pe dùng @supabase đọc toàn văn bản ghi')
        );
    }

    function buildPerplexityTriggerPrompt(row) {
        if (!row) return '';
        const id = row.id || row.message_id || 'unknown-id';
        const shortId = String(id).slice(0, 8);
        const threadId = row.thread_id || DEFAULT_THREAD_ID;
        const createdAtJst = formatFullJstStamp(row.created_at);
        const raw = (row.content_md || '').trim();
        if (!raw) return '';

        if (isEchoBackTriggerText(raw)) {
            return ensureChatboxPayloadStamped(raw, {
                createdAt: row.created_at,
                senderLabel: 'AN ➔ PE',
                threadId,
                messageId: id
            });
        }

        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const headings = lines.filter(l => /^#{1,3}\s+/.test(l) || /^(•|-|\d+\.)\s+\*\*/.test(l)).slice(0, 5);
        const summaryLines = headings.length > 0
            ? headings.map(h => '  ' + h.slice(0, 110)).join('\n')
            : '  ' + raw.replace(/\s+/g, ' ').slice(0, 320) + (raw.length > 320 ? '...' : '');

        return [
            `[v${SCRIPT_VERSION}] PE đọc Bridge.`,
            `🕒 [STAMP BẢN TIN: ${createdAtJst} | 👤 NGƯỜI GỬI: AN ➔ PE | 📁 DỰ ÁN: YSDMS NextGen | 🆔 ID: ${shortId}]`,
            `📌 BÁO CÁO MỚI TỪ AN ĐÃ LƯU TRÊN SUPABASE (YSDMS NextGen):`,
            `- Người gửi: AN (Antigravity Engineer) ➔ PE (Perplexity Architect)`,
            `- Thời gian tạo báo cáo: ${createdAtJst}`,
            `- Bảng SSOT: public.pe_an_messages`,
            `- Message ID: ${id}`,
            `- Thread ID: ${threadId}`,
            `- Độ dài bản gốc: ${raw.length} ký tự (Đã lưu đầy đủ trên Supabase)`,
            `- Tóm tắt nội dung:`,
            summaryLines,
            `---`,
            `👉 Đề nghị PE dùng @Supabase đọc toàn văn bản ghi message_id = "${id}" (thread_id = "${threadId}") trong bảng public.pe_an_messages để thẩm định và phản hồi chỉ thị tiếp theo cho AN (lưu ý gắn Stamp thời gian & nhãn người gửi PE ➔ AN).`,
            `🕒 [STAMP XÁC THỰC CUỐI TIN: ${createdAtJst} | NGƯỜI GỬI: AN ➔ PE | ID: ${shortId}]`
        ].join('\n');
    }

    function getLatestPeProseText() {
        let candidates = Array.from(document.querySelectorAll('.prose')).filter(el => {
            if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) return false;
            if (el.closest('button') || el.closest('[data-testid*="related"]') || el.closest('div[class*="related"]')) return false;
            if (el.closest('[data-message-author-role="user"]') || el.getAttribute('data-message-author-role') === 'user') return false;
            const txt = (el.innerText || el.textContent || '').trim();
            return txt.length > 0 && !isEchoBackTriggerText(txt);
        });

        if (candidates.length === 0) {
            candidates = Array.from(document.querySelectorAll('[class*="prose"], [class*="markdown"]')).filter(el => {
                if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) return false;
                if (el.closest('button') || el.closest('[data-testid*="related"]') || el.closest('div[class*="related"]')) return false;
                if (el.closest('[data-message-author-role="user"]') || el.getAttribute('data-message-author-role') === 'user') return false;
                const txt = (el.innerText || el.textContent || '').trim();
                return txt.length > 0 && !isEchoBackTriggerText(txt);
            });
        }

        const topProse = candidates.filter(el => !candidates.some(other => other !== el && other.contains(el)));
        if (topProse.length === 0) return '';

        const lastBlock = topProse[topProse.length - 1];

        const userQueries = Array.from(document.querySelectorAll(
            '[data-message-author-role="user"], [data-testid*="user-message"], .whitespace-pre-wrap'
        )).filter(el => {
            if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) return false;
            if (candidates.some(p => p.contains(el) || el.contains(p))) return false;
            return (el.innerText || '').trim().length > 0;
        });

        if (userQueries.length > 0) {
            const lastQuery = userQueries[userQueries.length - 1];
            const proseAfterLastQuery = topProse.filter(p =>
                Boolean(lastQuery.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)
            );
            if (proseAfterLastQuery.length >= 1) {
                return proseAfterLastQuery.map(p => (p.innerText || p.textContent || '').trim()).filter(Boolean).join('\n\n');
            }
        }

        let curr = lastBlock.parentElement;
        let bestBlocks = [lastBlock];
        for (let depth = 0; depth < 4 && curr && curr !== document.body; depth++) {
            const blocksInCurr = topProse.filter(p => curr.contains(p));
            if (blocksInCurr.length > 1 && blocksInCurr.length <= 15) {
                bestBlocks = blocksInCurr;
                break;
            }
            curr = curr.parentElement;
        }

        return bestBlocks.map(p => (p.innerText || p.textContent || '').trim()).filter(Boolean).join('\n\n');
    }

    function stripConnectorTokens(rawText) {
        if (!rawText) return '';
        return rawText
            .replace(/@?Supabase/gi, '')
            .replace(/@?GitHub/gi, '')
            .replace(/\b(Sources|Pro|Reasoning|Claude|Sonnet|Deep\s*Research)\b/gi, '')
            .trim();
    }

    function isExcludedButton(btn) {
        if (!btn) return true;
        const text = (btn.innerText || btn.textContent || '').toLowerCase();
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const testId = (btn.getAttribute('data-testid') || '').toLowerCase();
        const combined = `${text} ${aria} ${title} ${testId}`;

        const forbiddenWords = [
            'supabase', 'github', 'connector', 'source', 'nguồn',
            'attach', 'đính kèm', 'file', 'image', 'voice', 'mic', 'dictate',
            'model', 'focus', 'collection', 'space', 'bookmark', 'share', 'copy',
            'new thread', 'clear', 'delete', 'remove', 'close', 'xóa'
        ];
        for (const word of forbiddenWords) {
            if (combined.includes(word)) return true;
        }
        return false;
    }

    // =========================================================================
    // 4. BỘ ĐIỀN VĂN BẢN KỸ THUẬT 3 TRẠNG THÁI (v2.7.0 SMART 3-CASE EDITOR MACHINE)
    // =========================================================================
    function findPerplexityEditor() {
        const selectors = [
            '#ask-input',
            'textarea[placeholder*="Ask" i]',
            'textarea[placeholder*="Follow" i]',
            'textarea[placeholder*="Hỏi" i]',
            'textarea[placeholder*="Bất kỳ" i]',
            'div[contenteditable="true"][role="textbox"]',
            'div[contenteditable="true"][data-lexical-editor="true"]',
            'div.ProseMirror[contenteditable="true"]',
            'textarea',
            'div[contenteditable="true"]'
        ];
        for (const sel of selectors) {
            const nodes = document.querySelectorAll(sel);
            for (const el of nodes) {
                if (
                    el.offsetParent !== null &&
                    !el.closest('#ysdms-bridge-v25-root') &&
                    !el.closest('#omni-bridge-v25-root') &&
                    el.getBoundingClientRect().width > 120
                ) {
                    return el;
                }
            }
        }
        return null;
    }

    function getRawEditorText(editor) {
        if (!editor) return '';
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            return (editor.value || '').trim();
        }
        return (editor.innerText || editor.textContent || '').trim();
    }

    function getCleanEditorText(editor) {
        if (!editor) return '';
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            return stripConnectorTokens(editor.value || '');
        }
        const clone = editor.cloneNode(true);
        const chips = clone.querySelectorAll('[data-lexical-decorator="true"], [contenteditable="false"], button, .badge, .chip');
        chips.forEach(c => c.remove());
        return stripConnectorTokens(clone.innerText || clone.textContent || '');
    }

    // Phân tích chính xác 3 trạng thái của ô chat Perplexity:
    // - TH1: Đã có sẵn lệnh kích hoạt của Bridge trong ô chat (cùng ID hoặc khác ID)
    // - TH3A: Ô chat chỉ có tag/chip trình kết nối (@Supabase, @GitHub...)
    // - TH3B: Ô chat đang có chữ do Minh Chủ tự gõ tay dở dang (cần bảo vệ không ghi đè!)
    function inspectPerplexityEditorState(targetMessageId = '') {
        const editor = findPerplexityEditor();
        if (!editor) {
            return { exists: false, stateType: 'NO_EDITOR', rawText: '', cleanText: '', hasConnectorChips: false };
        }
        const rawText = getRawEditorText(editor);
        const cleanText = getCleanEditorText(editor);
        const chipNodes = editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT'
            ? []
            : Array.from(editor.querySelectorAll('[data-lexical-decorator="true"], [contenteditable="false"], .chip, .badge'));
        const hasConnectorChips = chipNodes.length > 0 || /@(Supabase|GitHub)/i.test(rawText);

        const shortId = (targetMessageId || '').slice(0, 8);
        const hasThisMessageId = Boolean(
            targetMessageId && (
                rawText.includes(targetMessageId) ||
                (shortId.length >= 6 && rawText.includes(shortId))
            )
        );
        const hasAnyBridgeTrigger = isEchoBackTriggerText(rawText) || isEchoBackTriggerText(cleanText) || /Message ID:\s*[0-9a-f-]{8,}/i.test(rawText);

        if (hasThisMessageId) {
            return { exists: true, editor, stateType: 'CASE1_SAME_TRIGGER_PRESENT', rawText, cleanText, hasConnectorChips, chipNodes };
        }
        if (hasAnyBridgeTrigger) {
            return { exists: true, editor, stateType: 'CASE1_OLDER_TRIGGER_PRESENT', rawText, cleanText, hasConnectorChips, chipNodes };
        }
        if (cleanText.length === 0 && hasConnectorChips) {
            return { exists: true, editor, stateType: 'CASE3A_CONNECTOR_TAGS_ONLY', rawText, cleanText, hasConnectorChips, chipNodes };
        }
        if (cleanText.length > 0) {
            return { exists: true, editor, stateType: 'CASE3B_USER_CUSTOM_TEXT', rawText, cleanText, hasConnectorChips, chipNodes };
        }
        return { exists: true, editor, stateType: 'EMPTY', rawText, cleanText, hasConnectorChips, chipNodes };
    }

    async function injectTextIntoPerplexity(rawContent, options = {}) {
        const manualUserClick = Boolean(options.manualUserClick);
        const targetMessageId = options.messageId || '';

        // CHỐT KHÓA CỨNG NÚT TẠM DỪNG (Hard Pause Guard v2.7.0):
        // Nếu đang bật "⏸️ Tạm dừng Auto" và KHÔNG phải do Minh Chủ chủ động bấm nút thủ công -> CHẶN 100%!
        if (!manualUserClick && isBridgeCurrentlyPaused()) {
            return false;
        }

        if (!rawContent || state.isInjectingNow) return false;
        const info = inspectPerplexityEditorState(targetMessageId);
        if (!info.exists || !info.editor) {
            console.warn('[YSDMS Bridge v2.7.0] Chưa tìm thấy ô chat Perplexity trên DOM.');
            return false;
        }

        // TH1: Nội dung kích hoạt của chính Message ID này đã nằm sẵn trong ô chat rồi -> Không dán bồi!
        if (!manualUserClick && info.stateType === 'CASE1_SAME_TRIGGER_PRESENT') {
            return true;
        }

        // TH3B: Ô chat đang có chữ riêng do Minh Chủ gõ dở -> Tạm hoãn Auto-Paste để bảo vệ văn bản của Minh Chủ!
        if (!manualUserClick && info.stateType === 'CASE3B_USER_CUSTOM_TEXT') {
            state.statusDetail = '🛡️ Ô chat đang có chữ Minh Chủ gõ tay — Tạm hoãn tự động dán (Bấm "📝 Chỉ Đổ" nếu muốn đè)';
            renderUI();
            return false;
        }

        const editor = info.editor;
        state.isInjectingNow = true;
        try {
            const stampedRaw = ensureChatboxPayloadStamped(rawContent, options);
            let finalContent = state.noAccent ? removeVietnameseAccents(stampedRaw) : stampedRaw;
            editor.focus();

            if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
                // Nếu trong textarea có sẵn @Supabase hoặc @GitHub ở đầu thì giữ lại prefix đó
                const existingConnectors = (editor.value || '').match(/@(Supabase|GitHub)\b/gi);
                if (existingConnectors && existingConnectors.length > 0 && !finalContent.includes(existingConnectors[0])) {
                    finalContent = `${existingConnectors.join(' ')} \n${finalContent}`;
                }
                const proto = editor.tagName === 'TEXTAREA'
                    ? window.HTMLTextAreaElement.prototype
                    : window.HTMLInputElement.prototype;
                const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (nativeSetter) {
                    nativeSetter.call(editor, finalContent);
                } else {
                    editor.value = finalContent;
                }
                editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: finalContent }));
                editor.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                editor.focus();
                const selection = window.getSelection();
                const range = document.createRange();

                if (info.hasConnectorChips && info.chipNodes && info.chipNodes.length > 0) {
                    // TH3A / TH1 có kèm Chip (@Supabase, @GitHub):
                    // Bảo toàn 100% các node chip trình kết nối ở đầu, chỉ chọn phần văn bản phía sau chip cuối cùng!
                    const lastChip = info.chipNodes[info.chipNodes.length - 1];
                    range.selectNodeContents(editor);
                    try {
                        range.setStartAfter(lastChip);
                    } catch {
                        range.collapse(false);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (!range.collapsed) {
                        try { document.execCommand('delete', false, null); } catch {}
                    }
                    const textWithLeadingSpace = finalContent.startsWith(' ') || finalContent.startsWith('\n')
                        ? finalContent
                        : ` ${finalContent}`;
                    document.execCommand('insertText', false, textWithLeadingSpace);
                } else {
                    // Ô chat trống hoặc đang chứa lệnh kích hoạt cũ (CASE1_OLDER_TRIGGER_PRESENT):
                    // Chọn toàn bộ và thay thế 1 lần duy nhất bằng insertText (TUYỆT ĐỐI KHÔNG bắn bồi 3 lệnh liên tiếp!)
                    range.selectNodeContents(editor);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    const inserted = document.execCommand('insertText', false, finalContent);
                    if (!inserted) {
                        const dt = new DataTransfer();
                        dt.setData('text/plain', finalContent);
                        editor.dispatchEvent(new ClipboardEvent('paste', {
                            bubbles: true,
                            cancelable: true,
                            clipboardData: dt
                        }));
                    }
                }
            }

            await new Promise(r => setTimeout(r, 180));
            const afterRaw = getRawEditorText(editor);
            const shortId = (targetMessageId || '').slice(0, 8);
            if (shortId && afterRaw.includes(shortId)) {
                return true;
            }
            return afterRaw.length >= Math.min(15, Math.floor(finalContent.trim().length * 0.25));
        } catch (err) {
            console.error('[YSDMS Bridge v2.7.0] Lỗi khi đổ văn bản:', err);
            return false;
        } finally {
            state.isInjectingNow = false;
        }
    }

    function findPerplexitySubmitButton() {
        const editor = findPerplexityEditor();
        const directSelectors = [
            'button[aria-label="Submit" i]',
            'button[aria-label*="Submit" i]',
            'button[aria-label*="Send" i]',
            'button[aria-label*="Gửi" i]',
            'button[data-testid*="submit" i]',
            'button[type="submit"]'
        ];
        for (const sel of directSelectors) {
            const btns = document.querySelectorAll(sel);
            for (const btn of btns) {
                if (
                    btn.offsetParent !== null &&
                    !btn.disabled &&
                    btn.getAttribute('aria-disabled') !== 'true' &&
                    !btn.closest('#ysdms-bridge-v25-root') &&
                    !btn.closest('#omni-bridge-v25-root') &&
                    !isExcludedButton(btn)
                ) {
                    return btn;
                }
            }
        }

        if (editor) {
            let container = editor.parentElement;
            for (let depth = 0; depth < 5 && container; depth++) {
                const buttons = Array.from(container.querySelectorAll('button')).filter(b =>
                    b.offsetParent !== null &&
                    !b.disabled &&
                    b.getAttribute('aria-disabled') !== 'true' &&
                    !b.closest('#ysdms-bridge-v25-root') &&
                    !b.closest('#omni-bridge-v25-root') &&
                    !isExcludedButton(b) &&
                    b.querySelector('svg')
                );
                if (buttons.length > 0) {
                    buttons.sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right);
                    return buttons[0];
                }
                container = container.parentElement;
            }
        }
        return null;
    }

    async function submitPerplexityChat(messageId) {
        const editor = findPerplexityEditor();
        const submitBtn = findPerplexitySubmitButton();

        state.baselinePeProseText = getLatestPeProseText();
        state.peStreamStableTicks = 0;

        if (submitBtn) {
            submitBtn.click();
        } else if (editor) {
            editor.focus();
            editor.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }));
        } else {
            return false;
        }

        await new Promise(r => setTimeout(r, 500));
        if (messageId) {
            markMessageSubmitted(messageId);
            notifyHubReportConsumed(messageId, 'BROWSER_SUBMITTED');
        }
        state.turnPhase = 'WAITING_FOR_PE';
        state.statusDetail = 'Đã gửi báo cáo cho PE — Đang chờ PE phân tích...';
        playChime('submit');
        renderUI();
        return true;
    }

    function attachNativeUserSubmitListener() {
        document.addEventListener('keydown', (e) => {
            if (!isTabActiveForYsdms()) return;
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                const editor = findPerplexityEditor();
                if (editor && (e.target === editor || editor.contains(e.target))) {
                    const row = state.latestRow;
                    if (row && row.sender === 'AN' && isMessageInjected(row.id) && !isMessageSubmitted(row.id)) {
                        state.baselinePeProseText = getLatestPeProseText();
                        state.peStreamStableTicks = 0;
                        setTimeout(() => {
                            markMessageSubmitted(row.id);
                            notifyHubReportConsumed(row.id, 'USER_ENTER_KEY');
                            state.turnPhase = 'WAITING_FOR_PE';
                            state.statusDetail = 'Minh Chủ đã bấm Enter gửi PE — Chờ PE phản hồi...';
                            renderUI();
                        }, 400);
                    }
                }
            }
        }, true);

        document.addEventListener('click', (e) => {
            if (!isTabActiveForYsdms()) return;
            const btn = e.target.closest('button');
            if (!btn || btn.closest('#ysdms-bridge-v25-root') || btn.closest('#omni-bridge-v25-root')) return;
            const submitBtn = findPerplexitySubmitButton();
            if (submitBtn && (btn === submitBtn || submitBtn.contains(btn))) {
                const row = state.latestRow;
                if (row && row.sender === 'AN' && isMessageInjected(row.id) && !isMessageSubmitted(row.id)) {
                    state.baselinePeProseText = getLatestPeProseText();
                    state.peStreamStableTicks = 0;
                    setTimeout(() => {
                        markMessageSubmitted(row.id);
                        notifyHubReportConsumed(row.id, 'USER_CLICK_SUBMIT');
                        state.turnPhase = 'WAITING_FOR_PE';
                        state.statusDetail = 'Minh Chủ đã bấm Gửi PE — Chờ PE phản hồi...';
                        renderUI();
                    }, 400);
                }
            }
        }, true);
    }

    // =========================================================================
    // 5. GIAO TIẾP VỚI LOCAL HUB (:3856) & ĐIỀU PHỐI TRẠNG THÁI (STATE MACHINE)
    // =========================================================================
    async function notifyHubBrowserAck(reportId) {
        if (!reportId) return;
        try {
            await fetch(`${getHubBaseUrl()}/api/pe-browser-ack`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceRowId: reportId,
                    scriptVersion: `v${SCRIPT_VERSION}`,
                    renderedAt: new Date().toISOString()
                })
            });
        } catch {}
    }

    async function notifyHubReportConsumed(reportId, by = 'BROWSER_SUBMITTED') {
        if (!reportId) return;
        try {
            await fetch(`${getHubBaseUrl()}/api/reports/consume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, by })
            });
        } catch {}
    }

    function requiresThoanDecision(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        return (
            lower.includes('chờ thoan chốt') ||
            lower.includes('chờ anh thoan chốt') ||
            lower.includes('chờ minh chủ thoan') ||
            lower.includes('chờ thoan duyệt') ||
            lower.includes('đợi thoan chốt') ||
            lower.includes('đợi thoan duyệt') ||
            lower.includes('chờ quyết định từ thoan') ||
            lower.includes('chờ quyết định của thoan') ||
            lower.includes('kính trình minh chủ thoan quyết định') ||
            lower.includes('dừng lại hỏi thoan')
        );
    }

    function normalizeProseFingerprint(text) {
        if (!text) return '0';
        const norm = text.replace(/\s+/g, ' ').trim();
        return hashString(`${norm.slice(0, 300)}||${norm.slice(-200)}||${norm.length}`);
    }

    function extractPeReplyTimestampInfo(proseText) {
        if (!proseText) return null;
        const regex = /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)\s*JST/gi;
        let match;
        let lastMatch = null;
        while ((match = regex.exec(proseText)) !== null) {
            lastMatch = match;
        }
        if (!lastMatch) return null;
        const dateStr = lastMatch[1];
        const timeStr = lastMatch[2];
        const hasSeconds = timeStr.split(':').length === 3;
        const iso = `${dateStr}T${hasSeconds ? timeStr : timeStr + ':00'}+09:00`;
        const ms = Date.parse(iso);
        if (isNaN(ms)) return null;
        return {
            ms,
            hasSeconds,
            timeLabel: `${timeStr} JST`,
            fullLabel: `${dateStr} ${timeStr} JST`
        };
    }

    function recordBaselineProseForAnId(anId, proseText) {
        if (!anId) return;
        const fp = normalizeProseFingerprint(proseText || '');
        if (state.anBaselineMap[anId] !== fp) {
            state.anBaselineMap[anId] = fp;
            const keys = Object.keys(state.anBaselineMap);
            if (keys.length > 80) delete state.anBaselineMap[keys[0]];
            saveJsonStorage(STORAGE_KEYS.AN_BASELINE_MAP, state.anBaselineMap);
        }
    }

    function isPeReplyDispatchedForAnId(anId) {
        if (!anId) return false;
        return Boolean(state.dispatchedAnMap[anId]);
    }

    function markPeReplyDispatchedForAnId(anId, proseText) {
        if (anId) {
            state.dispatchedAnMap[anId] = Date.now();
            const keys = Object.keys(state.dispatchedAnMap);
            if (keys.length > 80) delete state.dispatchedAnMap[keys[0]];
            saveJsonStorage(STORAGE_KEYS.DISPATCHED_AN_MAP, state.dispatchedAnMap);
        }
        if (proseText) {
            const prefixHash = hashString(proseText.slice(0, 300).replace(/\s+/g, ' ').trim());
            localStorage.setItem(STORAGE_KEYS.LAST_FORWARDED_HASH, prefixHash);
            state.baselinePeProseText = proseText;
            state.lastObservedProseText = proseText;
        }
    }

    function isProseAlreadyForwarded(proseText, anId) {
        if (anId && isPeReplyDispatchedForAnId(anId)) return true;
        if (!proseText) return false;
        const textHash = hashString(proseText);
        const prefixHash = hashString(proseText.slice(0, 300).replace(/\s+/g, ' ').trim());
        const fpHash = normalizeProseFingerprint(proseText);
        const lastFwdHash = localStorage.getItem(STORAGE_KEYS.LAST_FORWARDED_HASH);
        return Boolean(lastFwdHash && (textHash === lastFwdHash || prefixHash === lastFwdHash || fpHash === lastFwdHash));
    }

    function domHasSubmittedQueryForAnId(anId) {
        if (!anId) return false;
        const shortId = String(anId).slice(0, 8).toLowerCase();
        const editor = findPerplexityEditor();
        const userNodes = Array.from(document.querySelectorAll(
            '[data-message-author-role="user"], [data-testid*="user-message"], .whitespace-pre-wrap'
        ));
        for (const el of userNodes) {
            if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) continue;
            if (editor && (el === editor || editor.contains(el) || el.contains(editor))) continue;
            const txt = (el.innerText || el.textContent || '').toLowerCase();
            if (txt.includes(shortId)) return true;
        }
        return false;
    }

    function domHasProseAfterAnIdQuery(anId) {
        if (!anId) return false;
        const shortId = String(anId).slice(0, 8).toLowerCase();
        const editor = findPerplexityEditor();
        const userNodes = Array.from(document.querySelectorAll(
            '[data-message-author-role="user"], [data-testid*="user-message"], .whitespace-pre-wrap'
        )).filter(el => {
            if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) return false;
            if (editor && (el === editor || editor.contains(el) || el.contains(editor))) return false;
            const txt = (el.innerText || el.textContent || '').toLowerCase();
            return txt.includes(shortId);
        });
        if (userNodes.length === 0) return false;
        const matchingQuery = userNodes[userNodes.length - 1];
        const proseNodes = Array.from(document.querySelectorAll('.prose')).filter(el => {
            if (el.closest('#ysdms-bridge-v25-root') || el.closest('#omni-bridge-v25-root')) return false;
            if (el.closest('button') || el.closest('[data-testid*="related"]') || el.closest('div[class*="related"]')) return false;
            return (el.innerText || '').trim().length > 60;
        });
        return proseNodes.some(p =>
            Boolean(matchingQuery.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)
        );
    }

    function detectCompletedPeReplyForAnRow(row) {
        if (!row || row.sender !== 'AN') return null;
        const id = row.id || row.message_id;
        if (!id) return null;

        if (isPeReplyDispatchedForAnId(id)) {
            return { status: 'ALREADY_DISPATCHED' };
        }

        if (isPerplexityBusy()) {
            return { status: 'PE_BUSY' };
        }

        const currentProse = getLatestPeProseText();
        if (!currentProse || currentProse.length < 60 || isEchoBackTriggerText(currentProse)) {
            return null;
        }

        const peStamp = extractPeReplyTimestampInfo(currentProse);
        const rowCreatedMs = row.created_at ? new Date(row.created_at).getTime() : 0;

        // CHỐT CHẶN CHỐNG NHẬN NHẦM CÂU TRẢ LỜI CŨ KHI MINH CHỦ COPY THỦ CÔNG SANG AN:
        // Nếu câu trả lời PE trên màn hình có Stamp giờ NHỎ HƠN giờ tạo báo cáo AN hiện tại -> Đây là câu trả lời PE của lượt trước!
        if (peStamp && peStamp.ms > 0 && rowCreatedMs > 0) {
            const toleranceMs = peStamp.hasSeconds ? 5000 : 59999;
            if (peStamp.ms + toleranceMs < rowCreatedMs) {
                recordBaselineProseForAnId(id, currentProse);
                return null;
            }
        }

        if (isProseAlreadyForwarded(currentProse, id)) {
            return null;
        }

        const hasNewerPeStamp = Boolean(
            peStamp && peStamp.ms > 0 && rowCreatedMs > 0 &&
            (peStamp.ms + (peStamp.hasSeconds ? 5000 : 59999) >= rowCreatedMs)
        );
        const hasDomProseAfterQuery = domHasProseAfterAnIdQuery(id);
        const baselineFp = state.anBaselineMap[id];
        const curFp = normalizeProseFingerprint(currentProse);
        const hasChangedFromBaseline = Boolean(
            baselineFp && baselineFp !== curFp &&
            (isMessageInjected(id) || isMessageSubmitted(id))
        );

        if (hasNewerPeStamp || hasDomProseAfterQuery || hasChangedFromBaseline) {
            return {
                status: 'PE_COMPLETED',
                prose: currentProse,
                peTimeLabel: peStamp ? peStamp.timeLabel : formatShortTime(new Date().toISOString())
            };
        }

        return null;
    }

    async function evaluateAndProcessLatestRow(row, sourceLabel = 'SYNC') {
        if (!row) return;
        const id = row.id || row.message_id;
        row.id = id;
        state.latestRow = row;

        if (row.sender === 'AN') {
            // CHỐT CHẶN 1 (Dual Turn-Completion Gate): Nếu AN trên IDE vẫn đang chạy dở lượt (chưa kết thúc turn),
            // giữ nguyên trạng thái chờ, tuyệt đối chưa dán vào Perplexity để tránh PE duyệt sớm cắt ngang AN!
            if (row.anStillWorking) {
                state.turnPhase = 'AN_STILL_WORKING_HOLD';
                state.statusDetail = `⏳ AN đã ghi Supabase (${id.slice(0, 8)}) nhưng đang hoàn tất nốt lượt chạy trên IDE...`;
                renderUI();
                return;
            }

            const rowTime = formatShortTime(row.created_at);

            // Ghi nhận baseline .prose trước khi báo cáo AN được gửi cho PE
            if (!state.anBaselineMap[id] && !isMessageInjected(id) && !isMessageSubmitted(id)) {
                const curProse = getLatestPeProseText();
                const peStamp = extractPeReplyTimestampInfo(curProse);
                const rowCreatedMs = row.created_at ? new Date(row.created_at).getTime() : 0;
                const isAlreadyNewerReply = Boolean(
                    peStamp && peStamp.ms > 0 && rowCreatedMs > 0 &&
                    (peStamp.ms + (peStamp.hasSeconds ? 5000 : 59999) >= rowCreatedMs)
                );
                if (!isAlreadyNewerReply) {
                    recordBaselineProseForAnId(id, curProse);
                }
            }

            // KIỂM TRA ƯU TIÊN: PE đã trả lời xong hoặc đang trả lời cho báo cáo AN này chưa?
            const peCheck = detectCompletedPeReplyForAnRow(row);
            if (peCheck) {
                if (peCheck.status === 'ALREADY_DISPATCHED') {
                    state.turnPhase = 'PE_DISPATCHED_TO_AN';
                    state.statusDetail = `Đã chuyển chỉ thị của PE sang AN (Báo cáo ${id.slice(0, 8)}) — AN đang thực thi`;
                    renderUI();
                    return;
                }
                if (peCheck.status === 'PE_BUSY') {
                    if (!isMessageInjected(id)) markMessageInjected(id);
                    if (!isMessageSubmitted(id)) markMessageSubmitted(id);
                    state.turnPhase = 'WAITING_FOR_PE';
                    state.statusDetail = `PE đang phân tích báo cáo AN (${id.slice(0, 8)} • ${rowTime})...`;
                    renderUI();
                    return;
                }
                if (peCheck.status === 'PE_COMPLETED') {
                    if (!isMessageInjected(id)) markMessageInjected(id);
                    if (!isMessageSubmitted(id)) markMessageSubmitted(id);
                    state.pendingPeApprovalText = peCheck.prose;
                    if (requiresThoanDecision(peCheck.prose)) {
                        state.turnPhase = 'WAITING_THOAN_APPROVAL';
                        state.statusDetail = `PE đã trả lời (${peCheck.peTimeLabel}) — Chờ Minh Chủ THOAN chốt phương án`;
                    } else {
                        state.turnPhase = 'PE_READY_TO_DISPATCH';
                        state.statusDetail = isBridgeCurrentlyPaused()
                            ? `PE đã trả lời xong (${peCheck.peTimeLabel}) — Đang Tạm dừng Tự động gửi`
                            : `PE đã trả lời xong (${peCheck.peTimeLabel}) — Chuẩn bị tự động gửi cho AN...`;
                    }
                    renderUI();
                    return;
                }
            }

            const editorState = inspectPerplexityEditorState(id);
            // Tự động nhận diện nếu Minh Chủ đã bấm Submit (ô chat đã trống và câu hỏi đã nằm trên luồng hội thoại)
            if (isMessageInjected(id) && !isMessageSubmitted(id) && editorState.stateType !== 'CASE1_SAME_TRIGGER_PRESENT') {
                if (domHasSubmittedQueryForAnId(id)) {
                    markMessageSubmitted(id);
                }
            }

            const alreadySubmitted = isMessageSubmitted(id) || row.status === 'CONSUMED';
            const alreadyInjected = isMessageInjected(id) || editorState.stateType === 'CASE1_SAME_TRIGGER_PRESENT';

            // TH2: Đã dán và đã Submit -> Chờ PE phân tích
            if (alreadySubmitted) {
                state.turnPhase = 'WAITING_FOR_PE';
                state.statusDetail = `Đã gửi báo cáo AN (${id.slice(0, 8)} • ${rowTime}) — Chờ PE phản hồi...`;
                renderUI();
                return;
            }

            // TH1: Đã dán vào ô chat nhưng chưa Submit -> Giữ nguyên 100%, không dán bồi định kỳ!
            if (alreadyInjected) {
                if (!isMessageInjected(id)) markMessageInjected(id);
                state.turnPhase = 'AN_TEXT_INJECTED';
                state.statusDetail = `Đã đổ vào ô chat (${id.slice(0, 8)} • ${rowTime}) — Chờ Minh Chủ bấm Gửi`;
                renderUI();
                return;
            }

            state.turnPhase = 'AN_PENDING_INJECT';
            state.statusDetail = isBridgeCurrentlyPaused()
                ? `Có báo cáo mới từ AN (${id.slice(0, 8)} • ${rowTime}) — Đang Tạm dừng Tự động gửi`
                : `Có báo cáo mới từ AN (${id.slice(0, 8)} • ${rowTime}) — Chờ đổ vào ô chat`;
            renderUI();

            // CHỐT CHẶN ĐA DỰ ÁN TUYỆT ĐỐI: Chỉ khi Tab được xác nhận đích danh là 'YSDMS' mới được phép tự động thao tác!
            if (!isTabActiveForYsdms()) {
                return;
            }

            // CHỐT KHÓA CỨNG TẠM DỪNG (Hard Pause Guard):
            if (isBridgeCurrentlyPaused() || state.mode === 'MANUAL') {
                return;
            }

            if (isPerplexityBusy()) {
                state.statusDetail = `PE đang bận trả lời — Chờ PE xong sẽ tự đổ (${id.slice(0, 8)} • ${rowTime})...`;
                renderUI();
                return;
            }

            // TH3B: Nếu Minh Chủ đang gõ chữ riêng trong ô chat -> Bảo vệ chữ của Minh Chủ, không tự động đè!
            if (editorState.stateType === 'CASE3B_USER_CUSTOM_TEXT') {
                state.statusDetail = `🛡️ Ô chat đang có chữ Minh Chủ gõ tay — Tạm hoãn dán (${id.slice(0, 8)} • ${rowTime})`;
                renderUI();
                return;
            }

            const curProseBeforeInject = getLatestPeProseText();
            state.baselinePeProseText = curProseBeforeInject;
            state.lastObservedProseText = curProseBeforeInject;
            recordBaselineProseForAnId(id, curProseBeforeInject);
            state.peStreamStableTicks = 0;

            const triggerPrompt = buildPerplexityTriggerPrompt(row);
            // Đánh dấu Injected NGAY TRƯỚC KHI gọi hàm async để khóa chặt mọi chu kỳ timer chạy song song!
            markMessageInjected(id);
            const injectedOk = await injectTextIntoPerplexity(triggerPrompt, {
                manualUserClick: false,
                messageId: id
            });
            if (injectedOk) {
                notifyHubBrowserAck(id);
                playChime('inject');

                if (state.mode === 'PASTE_AND_SUBMIT' && !isBridgeCurrentlyPaused()) {
                    const randomDelayMs = Math.floor(Math.random() * 3001) + 1000;
                    const delaySecText = (randomDelayMs / 1000).toFixed(1);
                    state.turnPhase = 'AN_SUBMITTING';
                    state.statusDetail = `Đã đổ (${id.slice(0, 8)} • ${rowTime}) — Tự Submit sau ${delaySecText}s (ESC hủy)...`;
                    renderUI();

                    if (state.submitTimer) clearTimeout(state.submitTimer);
                    state.submitTimer = setTimeout(async () => {
                        if (!isBridgeCurrentlyPaused() && state.mode === 'PASTE_AND_SUBMIT' && isTabActiveForYsdms()) {
                            await submitPerplexityChat(id);
                        }
                    }, randomDelayMs);
                } else {
                    state.turnPhase = 'AN_TEXT_INJECTED';
                    state.statusDetail = `Đã đổ lệnh kích hoạt (${id.slice(0, 8)} • ${rowTime}) — Mời bấm Enter`;
                    renderUI();
                }
            }
            return;
        }

        if (row.sender === 'PE' || row.sender === 'THOAN') {
            const rowTime = formatShortTime(row.created_at);
            if (row.sender === 'PE' && requiresThoanDecision(row.content_md) && row.status !== 'CONSUMED') {
                state.turnPhase = 'WAITING_THOAN_APPROVAL';
                state.pendingPeApprovalText = row.content_md;
                state.statusDetail = `PE trình phương án (${id.slice(0, 8)} • ${rowTime}) — Chờ THOAN chốt`;
            } else {
                state.turnPhase = 'PE_DISPATCHED_TO_AN';
                state.statusDetail = `${row.sender} đã gửi chỉ thị (${id.slice(0, 8)} • ${rowTime}) — AN đang thực thi`;
            }
            renderUI();
        }
    }

    // LUÔN QUAN SÁT DOM PERPLEXITY MỖI GIÂY (Kể cả khi đang Tạm dừng Auto) để hiển thị đúng trạng thái thực tế!
    async function monitorPeDomResponseLoop() {
        if (!isTabActiveForYsdms()) return;

        const row = state.latestRow;
        if (
            state.turnPhase === 'PE_DISPATCHED_TO_AN' ||
            (row && (row.sender === 'PE' || row.sender === 'THOAN') && state.turnPhase !== 'WAITING_FOR_PE')
        ) {
            return;
        }

        const busy = isPerplexityBusy();
        const currentProse = getLatestPeProseText();

        if (busy) {
            state.peStreamStableTicks = 0;
            if (currentProse) state.lastObservedProseText = currentProse;
            if (row && row.sender === 'AN') {
                if (!isMessageInjected(row.id)) markMessageInjected(row.id);
                if (!isMessageSubmitted(row.id)) markMessageSubmitted(row.id);
            }
            if (state.turnPhase !== 'WAITING_FOR_PE') {
                state.turnPhase = 'WAITING_FOR_PE';
                state.statusDetail = 'PE đang phân tích & sinh câu trả lời trên Perplexity...';
                renderUI();
            }
            return;
        }

        // Nếu báo cáo AN đã đổ vào ô chat mà hiện tại ô chat đã trống và câu hỏi đã lên luồng chat -> Chuyển sang WAITING_FOR_PE
        if (row && row.sender === 'AN' && state.turnPhase === 'AN_TEXT_INJECTED') {
            const editorState = inspectPerplexityEditorState(row.id);
            if (editorState.stateType !== 'CASE1_SAME_TRIGGER_PRESENT' && domHasSubmittedQueryForAnId(row.id)) {
                markMessageSubmitted(row.id);
                state.turnPhase = 'WAITING_FOR_PE';
                state.statusDetail = `Đã gửi báo cáo AN (${row.id.slice(0, 8)}) — Chờ PE phản hồi...`;
                renderUI();
            }
        }

        if (!currentProse || currentProse.length < 60 || isEchoBackTriggerText(currentProse)) {
            return;
        }

        if (row && row.sender === 'AN') {
            const peCheck = detectCompletedPeReplyForAnRow(row);
            if (!peCheck || peCheck.status !== 'PE_COMPLETED') {
                return;
            }

            // Nếu nội dung .prose vẫn đang thay đổi giữa 2 chu kỳ -> PE vẫn đang stream chữ!
            if (currentProse !== state.lastObservedProseText) {
                state.lastObservedProseText = currentProse;
                state.peStreamStableTicks = 0;
                if (state.turnPhase !== 'WAITING_FOR_PE') {
                    state.turnPhase = 'WAITING_FOR_PE';
                    state.statusDetail = 'Đang thu thập câu trả lời mới của PE...';
                    renderUI();
                }
                return;
            }

            state.peStreamStableTicks += 1;
            if (state.peStreamStableTicks < 3) return;

            if (!isMessageInjected(row.id)) markMessageInjected(row.id);
            if (!isMessageSubmitted(row.id)) markMessageSubmitted(row.id);
            state.pendingPeApprovalText = currentProse;

            if (requiresThoanDecision(currentProse)) {
                if (state.turnPhase !== 'WAITING_THOAN_APPROVAL') {
                    state.turnPhase = 'WAITING_THOAN_APPROVAL';
                    state.statusDetail = `🟠 PE vừa trả lời (${peCheck.peTimeLabel}) — Chờ Minh Chủ THOAN chốt phương án!`;
                    playChime('warn');
                    showToast('🟠 PE yêu cầu Minh Chủ THOAN chốt quyết định trước khi chuyển sang AN!');
                    renderUI();
                }
                return;
            }

            // Nếu đang TẠM DỪNG AUTO hoặc chế độ MANUAL: Hiển thị rõ trạng thái "Đến lượt gửi cho AN" và chờ bấm [Tiếp tục Tự động gửi]!
            if (isBridgeCurrentlyPaused() || state.mode === 'MANUAL') {
                if (state.turnPhase !== 'PE_READY_TO_DISPATCH') {
                    state.turnPhase = 'PE_READY_TO_DISPATCH';
                    state.statusDetail = `PE đã trả lời xong (${peCheck.peTimeLabel}) — Đang Tạm dừng Tự động gửi`;
                    playChime('inject');
                    renderUI();
                }
                return;
            }

            // Nếu đang BẬT AUTO: Tự động bắn chỉ thị của PE sang cho AN ngay!
            if (state.isDispatchingPeNow) return;
            state.turnPhase = 'PE_READY_TO_DISPATCH';
            state.statusDetail = `PE đã trả lời xong (${peCheck.peTimeLabel}) — Đang tự động gửi cho AN...`;
            renderUI();

            state.isDispatchingPeNow = true;
            try {
                await handleRescueSendPeToAn(currentProse, row.thread_id || DEFAULT_THREAD_ID, false);
            } finally {
                state.isDispatchingPeNow = false;
            }
        }
    }

    async function fetchFeedFromHub(manualNotify = false) {
        if (!manualNotify && state.detectedTabProject === 'OMNI') {
            return;
        }
        try {
            const res = await fetch(`${getHubBaseUrl()}/api/messages/feed?limit=12`, {
                method: 'GET',
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            state.hubOnline = true;

            const rows = Array.isArray(data.rows) ? data.rows : (Array.isArray(data.data) ? data.data : []);
            state.feedRows = rows;

            if (rows.length > 0) {
                await evaluateAndProcessLatestRow(rows[0], 'POLL');
            } else {
                renderUI();
            }

            if (manualNotify) {
                showToast(`✅ Đã đồng bộ ${rows.length} bản ghi từ Supabase SSOT (public.pe_an_messages)!`);
            }
        } catch (err) {
            state.hubOnline = false;
            state.statusDetail = `Mất kết nối Local Hub (:${state.hubPort})`;
            renderUI();
            if (manualNotify) {
                showToast(`❌ Không kết nối được Local Hub :${state.hubPort}`, true);
            }
        }
    }

    let eventSource = null;
    function connectSse() {
        if (eventSource) {
            try { eventSource.close(); } catch {}
        }
        try {
            eventSource = new EventSource(`${getHubBaseUrl()}/api/events`);
            eventSource.onopen = () => {
                state.hubOnline = true;
                state.sseConnected = true;
                renderUI();
            };
            eventSource.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    state.hubOnline = true;
                    state.sseConnected = true;

                    if (data.type === 'LATEST_STATE' && data.record) {
                        const rec = Object.assign({}, data.record, { anStillWorking: Boolean(data.anStillWorking) });
                        await evaluateAndProcessLatestRow(rec, 'SSE_INIT');
                        fetchFeedFromHub(false);
                    } else if (data.type === 'AN_STILL_WORKING_HOLD' && data.record) {
                        const rec = Object.assign({}, data.record, { anStillWorking: true });
                        await evaluateAndProcessLatestRow(rec, 'SSE_HOLD');
                    } else if (
                        data.type === 'SUPABASE_ROW_PERSISTED' ||
                        data.type === 'AN_REPORT_PERSISTED' ||
                        data.type === 'AN_REPORT_DONE'
                    ) {
                        const row = data.record || {
                            id: data.id || data.reportId || data.messageId,
                            message_id: data.id || data.reportId || data.messageId,
                            thread_id: data.thread_id || data.threadId || DEFAULT_THREAD_ID,
                            sender: data.sender || 'AN',
                            content_md: data.content_md || '',
                            status: 'PENDING',
                            created_at: data.created_at || data.createdAt || new Date().toISOString()
                        };
                        if (row.content_md) {
                            await evaluateAndProcessLatestRow(row, 'SSE_AN');
                        }
                        fetchFeedFromHub(false);
                    } else if (data.type === 'REPORT_CONSUMED' && data.reportId) {
                        markMessageSubmitted(data.reportId);
                        if (state.latestRow && state.latestRow.id === data.reportId && state.turnPhase !== 'PE_READY_TO_DISPATCH') {
                            state.turnPhase = 'WAITING_FOR_PE';
                            state.statusDetail = `Báo cáo AN (${data.reportId.slice(0, 8)}) đã được gửi cho PE`;
                        }
                        renderUI();
                    } else if (data.type === 'WAITING_THOAN_APPROVAL') {
                        state.turnPhase = 'WAITING_THOAN_APPROVAL';
                        state.statusDetail = `PE trình phương án — Chờ Minh Chủ THOAN duyệt!`;
                        playChime('warn');
                        fetchFeedFromHub(false);
                    } else if (data.type === 'PE_DISPATCHED_TO_AN' || data.type === 'PE_REPLIED') {
                        state.turnPhase = 'PE_DISPATCHED_TO_AN';
                        state.statusDetail = `Đã chuyển chỉ thị của PE sang AN (${(data.peMessageId || data.messageId || '').slice(0, 8)})`;
                        playChime('an_dispatch');
                        fetchFeedFromHub(false);
                    } else if (data.type === 'MANUAL_TEST_PE' && data.text && isTabActiveForYsdms()) {
                        const ok = await injectTextIntoPerplexity(data.text, { manualUserClick: true });
                        if (ok && data.autoSubmit) {
                            setTimeout(() => submitPerplexityChat(null), 1200);
                        }
                    }
                } catch (e) {
                    console.warn('[YSDMS Bridge v2.7.4] Lỗi xử lý gói SSE:', e);
                }
            };
            eventSource.onerror = () => {
                state.sseConnected = false;
                renderUI();
            };
        } catch {
            state.sseConnected = false;
        }
    }

    // =========================================================================
    // 6. CÁC HÀNH ĐỘNG ĐIỀU KHIỂN THỦ CÔNG CỦA MINH CHỦ (BUTTON ACTIONS)
    // =========================================================================
    async function handleForceInjectAndSubmitAn(onlyPaste = false) {
        let targetRow = (state.latestRow && state.latestRow.sender === 'AN') ? state.latestRow : null;
        if (!targetRow) {
            targetRow = state.feedRows.find(r => r.sender === 'AN');
        }
        if (!targetRow || !targetRow.content_md) {
            showToast('⚠️ Không tìm thấy báo cáo nào của AN để đổ vào ô chat!', true);
            return;
        }

        const curProse = getLatestPeProseText();
        state.baselinePeProseText = curProse;
        state.lastObservedProseText = curProse;
        recordBaselineProseForAnId(targetRow.id, curProse);
        state.peStreamStableTicks = 0;

        const triggerPrompt = buildPerplexityTriggerPrompt(targetRow);
        markMessageInjected(targetRow.id);
        const ok = await injectTextIntoPerplexity(triggerPrompt, {
            manualUserClick: true,
            messageId: targetRow.id
        });
        if (!ok) {
            showToast('❌ Không tìm thấy ô nhập liệu Perplexity!', true);
            return;
        }

        notifyHubBrowserAck(targetRow.id);
        playChime('inject');

        if (onlyPaste) {
            state.turnPhase = 'AN_TEXT_INJECTED';
            state.statusDetail = `Đã đổ lệnh kích hoạt (${targetRow.id.slice(0, 8)}) vào ô chat`;
            showToast('📝 Đã đổ lệnh kích hoạt gọn vào ô chat (Chưa bấm gửi)!');
            renderUI();
        } else {
            state.turnPhase = 'AN_SUBMITTING';
            state.statusDetail = `Đang bấm Submit gửi PE (${targetRow.id.slice(0, 8)})...`;
            renderUI();
            setTimeout(async () => {
                await submitPerplexityChat(targetRow.id);
                showToast('🚀 Đã đổ & gửi lệnh kích hoạt cho PE thành công!');
            }, 600);
        }
    }

    async function handleRescueSendPeToAn(customText = null, customThreadId = null, isManualRescue = true) {
        let textToSend = customText ? customText.trim() : '';

        if (!textToSend) {
            const sel = window.getSelection();
            if (sel && sel.toString().trim().length > 15) {
                textToSend = sel.toString().trim();
            }
        }

        if (!textToSend) {
            textToSend = getLatestPeProseText();
        }

        if (!textToSend && state.pendingPeApprovalText) {
            textToSend = state.pendingPeApprovalText;
        }

        if (!textToSend && state.latestRow && (state.latestRow.sender === 'PE' || state.latestRow.sender === 'THOAN')) {
            textToSend = state.latestRow.content_md || '';
        }

        if (!textToSend || textToSend.length < 10) {
            showToast('⚠️ Hãy bôi đen chỉ thị của PE hoặc chờ PE trả lời xong trước khi bắn sang AN!', true);
            return;
        }

        const currentAnId = (state.latestRow && state.latestRow.sender === 'AN') ? state.latestRow.id : null;
        const threadId = customThreadId || (state.latestRow && state.latestRow.thread_id) || DEFAULT_THREAD_ID;
        try {
            showToast('⏳ Đang lưu Supabase & đánh thức AN (YSDMS) qua Native AgentAPI...');
            const res = await fetch(`${getHubBaseUrl()}/api/directive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    directiveText: textToSend,
                    threadId: threadId,
                    isManualRescue: Boolean(isManualRescue),
                    source: isManualRescue ? 'MANUAL_RESCUE_V274' : 'AUTO_LOOP_V274'
                })
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                throw new Error(data.error || `HTTP ${res.status}`);
            }
            markPeReplyDispatchedForAnId(currentAnId, textToSend);
            state.turnPhase = 'PE_DISPATCHED_TO_AN';
            state.statusDetail = `Đã bắn chỉ thị sang AN (${(data.messageId || '').slice(0, 8)}) — AN đang thực thi`;
            playChime('an_dispatch');
            showToast(data.retriggeredWakeup
                ? '⚡ Đã kích hoạt đánh thức lại AN (YSDMS) thành công!'
                : '⚡ Đã lưu Supabase & kích hoạt AN (YSDMS) thực thi thành công!');
            renderUI();
            fetchFeedFromHub(false);
        } catch (err) {
            showToast(`❌ Lỗi bắn sang AN: ${err.message}`, true);
        }
    }

    async function handleTogglePauseAuto() {
        const nextPaused = !isBridgeCurrentlyPaused();
        setBridgePaused(nextPaused);

        if (nextPaused) {
            showToast('⏸️ Đã Tạm dừng Tự động gửi!');
            if (state.latestRow) {
                await evaluateAndProcessLatestRow(state.latestRow, 'PAUSE_CLICK');
            } else {
                renderUI();
            }
            return;
        }

        showToast('▶️ Đã bật Tiếp tục Tự động gửi — Đang thực thi bước tiếp theo...');
        const row = state.latestRow;
        if (row && row.sender === 'AN') {
            const peCheck = detectCompletedPeReplyForAnRow(row);
            if (state.turnPhase === 'PE_READY_TO_DISPATCH' || (peCheck && peCheck.status === 'PE_COMPLETED')) {
                const proseToSend = (peCheck && peCheck.prose) || state.pendingPeApprovalText || getLatestPeProseText();
                if (proseToSend && !requiresThoanDecision(proseToSend)) {
                    await handleRescueSendPeToAn(proseToSend, row.thread_id || DEFAULT_THREAD_ID, false);
                    return;
                }
            }
            if (state.turnPhase === 'AN_TEXT_INJECTED' && state.mode === 'PASTE_AND_SUBMIT') {
                await submitPerplexityChat(row.id);
                return;
            }
            await evaluateAndProcessLatestRow(row, 'RESUME_AUTO');
            return;
        }
        renderUI();
    }

    // =========================================================================
    // 7. XÂY DỰNG GIAO DIỆN SÁNG (LIGHT THEME), KÉO THẢ, THU GỌN & SSOT FEED
    // =========================================================================
    let toastTimer = null;
    function showToast(msg, isError = false) {
        const toastEl = document.getElementById('ysdms-bridge-v25-toast');
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.style.background = isError ? '#FEE2E2' : '#ECFDF5';
        toastEl.style.color = isError ? '#991B1B' : '#065F46';
        toastEl.style.borderColor = isError ? '#FCA5A5' : '#6EE7B7';
        toastEl.style.display = 'block';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.style.display = 'none';
        }, 4000);
    }

    function getPhaseTheme(phase) {
        switch (phase) {
            case 'AN_STILL_WORKING_HOLD':
                return {
                    badge: '⏳ AN đang chạy nốt trên IDE (Giữ báo cáo)',
                    bg: '#FEF3C7',
                    border: '#F59E0B',
                    text: '#92400E',
                    dot: '#D97706'
                };
            case 'AN_PENDING_INJECT':
                return {
                    badge: '📥 Báo cáo AN mới (Chờ đổ vào chat PE)',
                    bg: '#FFFBEB',
                    border: '#FCD34D',
                    text: '#92400E',
                    dot: '#F59E0B'
                };
            case 'AN_TEXT_INJECTED':
                return {
                    badge: '📝 Đã đổ vào ô chat PE (Chờ Submit)',
                    bg: '#ECFDF5',
                    border: '#6EE7B7',
                    text: '#065F46',
                    dot: '#10B981'
                };
            case 'AN_SUBMITTING':
                return {
                    badge: '⏳ Đang đếm ngược Random 1–4s Submit...',
                    bg: '#F0FDFA',
                    border: '#5EEAD4',
                    text: '#115E59',
                    dot: '#14B8A6'
                };
            case 'WAITING_FOR_PE':
                return {
                    badge: '🟣 Đã gửi PE — Chờ PE phân tích...',
                    bg: '#F5F3FF',
                    border: '#C4B5FD',
                    text: '#5B21B6',
                    dot: '#8B5CF6'
                };
            case 'PE_READY_TO_DISPATCH':
                return {
                    badge: '🟢 PE đã trả lời xong — Đến lượt gửi cho AN',
                    bg: '#DCFCE7',
                    border: '#34D399',
                    text: '#065F46',
                    dot: '#059669'
                };
            case 'WAITING_THOAN_APPROVAL':
                return {
                    badge: '🟠 PE trình phương án — Chờ THOAN duyệt',
                    bg: '#FFF7ED',
                    border: '#FDBA74',
                    text: '#9A3412',
                    dot: '#F97316'
                };
            case 'PE_DISPATCHED_TO_AN':
                return {
                    badge: '🔵 Đã chuyển lệnh sang AN — AN đang thi công',
                    bg: '#EFF6FF',
                    border: '#93C5FD',
                    text: '#1E40AF',
                    dot: '#3B82F6'
                };
            default:
                return {
                    badge: '⚪ Sẵn sàng — Đang lắng nghe...',
                    bg: '#F8FAFC',
                    border: '#CBD5E1',
                    text: '#334155',
                    dot: '#64748B'
                };
        }
    }

    function getNextStepDescription(phase, isPaused, mode) {
        switch (phase) {
            case 'AN_STILL_WORKING_HOLD':
                return '⏭️ Tiếp theo: Chờ AN kết thúc lượt trên IDE ➔ Đổ vào PE';
            case 'AN_PENDING_INJECT':
                return isPaused
                    ? '⏭️ Tiếp theo: Đổ vào ô chat PE (Bấm [▶️ Tiếp tục tự động gửi])'
                    : '⏭️ Tiếp theo: Tự động đổ lệnh kích hoạt AN vào ô chat PE';
            case 'AN_TEXT_INJECTED':
                if (mode === 'PASTE_AND_SUBMIT' && isPaused) {
                    return '⏭️ Tiếp theo: Submit gửi PE (Bấm [▶️ Tiếp tục tự động gửi])';
                }
                return '⏭️ Tiếp theo: Bấm Enter/Gửi cho PE (Xong sẽ tự gửi về AN)';
            case 'AN_SUBMITTING':
                return '⏭️ Tiếp theo: Tự động Submit ➔ Chờ PE trả lời ➔ Gửi cho AN';
            case 'WAITING_FOR_PE':
                return isPaused
                    ? '⏭️ Tiếp theo: Chờ PE trả lời xong ➔ Sẵn sàng gửi cho AN'
                    : '⏭️ Tiếp theo: Chờ PE trả lời xong ➔ Tự động gửi cho AN';
            case 'PE_READY_TO_DISPATCH':
                return isPaused
                    ? '⏭️ Tiếp theo: Gửi cho AN (Bấm [▶️ Tiếp tục tự động gửi] bên dưới)'
                    : '⏭️ Tiếp theo: Đang tự động gửi chỉ thị của PE sang cho AN...';
            case 'WAITING_THOAN_APPROVAL':
                return '⏭️ Tiếp theo: Minh Chủ bấm [⚡ Duyệt phương án PE] để gửi AN';
            case 'PE_DISPATCHED_TO_AN':
                return mode === 'PASTE_AND_SUBMIT'
                    ? '⏭️ Tiếp theo: Chờ AN báo cáo xong ➔ Tự đổ & Submit cho PE'
                    : '⏭️ Tiếp theo: Chờ AN báo cáo xong ➔ Tự đổ vào ô chat PE';
            default:
                return '⏭️ Tiếp theo: Chờ bản tin mới từ AN hoặc PE...';
        }
    }

    function getAutoToggleButtonConfig(phase, isPaused, mode) {
        if (isPaused) {
            if (phase === 'PE_READY_TO_DISPATCH') {
                return {
                    label: '▶️ Tiếp tục Tự động gửi (Gửi ngay cho AN)',
                    bg: '#059669',
                    color: '#FFFFFF',
                    border: '#047857',
                    title: 'Đang Tạm dừng — Bấm để bật lại Tự động gửi và bắn ngay câu trả lời của PE sang cho AN'
                };
            }
            if (phase === 'AN_PENDING_INJECT') {
                return {
                    label: '▶️ Tiếp tục Tự động gửi (Đổ ngay vào PE)',
                    bg: '#D97706',
                    color: '#FFFFFF',
                    border: '#B45309',
                    title: 'Đang Tạm dừng — Bấm để bật lại Tự động gửi và đổ ngay báo cáo AN vào ô chat PE'
                };
            }
            if (phase === 'AN_TEXT_INJECTED' && mode === 'PASTE_AND_SUBMIT') {
                return {
                    label: '▶️ Tiếp tục Tự động gửi (Submit ngay cho PE)',
                    bg: '#0D9488',
                    color: '#FFFFFF',
                    border: '#0F766E',
                    title: 'Đang Tạm dừng — Bấm để bật lại Tự động gửi và Submit ngay cho PE'
                };
            }
            return {
                label: '▶️ Tiếp tục Tự động gửi (Đang Tạm dừng)',
                bg: '#FEF3C7',
                color: '#92400E',
                border: '#F59E0B',
                title: 'Đang Tạm dừng — Bấm để tiếp tục chế độ Tự động gửi'
            };
        }
        return {
            label: '⏸️ Tạm dừng Tự động gửi (Đang bật Auto)',
            bg: '#F1F5F9',
            color: '#1E293B',
            border: '#94A3B8',
            title: 'Chế độ Tự động gửi đang BẬT — Bấm vào đây nếu muốn Tạm dừng'
        };
    }

    function createBridgeDOM() {
        const existing = document.getElementById('ysdms-bridge-v25-root');
        if (existing) existing.remove();

        const styleEl = document.createElement('style');
        styleEl.id = 'ysdms-bridge-v25-style';
        styleEl.textContent = `
            #ysdms-bridge-v25-root {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 2147483640;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #0F172A;
                user-select: none;
            }
            .yb25-card {
                width: 375px;
                background: #FFFFFF;
                border: 1.5px solid #CBD5E1;
                border-radius: 12px;
                box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.08);
                overflow: hidden;
                transition: box-shadow 0.2s ease;
            }
            .yb25-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: #F1F5F9;
                border-bottom: 1px solid #E2E8F0;
                cursor: move;
            }
            .yb25-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12.5px;
                font-weight: 700;
                color: #0F172A;
            }
            .yb25-port-pill {
                font-size: 11px;
                font-weight: 600;
                font-family: monospace;
                padding: 2px 7px;
                border-radius: 999px;
                cursor: pointer;
                border: 1px solid transparent;
            }
            .yb25-icon-btn {
                background: #FFFFFF;
                border: 1px solid #CBD5E1;
                color: #334155;
                border-radius: 6px;
                padding: 2px 7px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
            }
            .yb25-icon-btn:hover {
                background: #E2E8F0;
                color: #0F172A;
            }
            .yb25-body {
                padding: 10px 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .yb25-status-box {
                padding: 8px 10px;
                border-radius: 8px;
                border: 1px solid #CBD5E1;
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            .yb25-status-main {
                font-size: 12.5px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .yb25-status-sub {
                font-size: 11px;
                color: #475569;
                font-family: monospace;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .yb25-status-next {
                font-size: 11.5px;
                font-weight: 700;
                color: #0F172A;
                background: rgba(255, 255, 255, 0.72);
                padding: 3px 6px;
                border-radius: 5px;
                border: 1px dashed rgba(15, 23, 42, 0.18);
                margin-top: 1px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .yb25-modes {
                display: flex;
                flex-direction: column;
                gap: 6px;
                background: #F8FAFC;
                padding: 7px 9px;
                border-radius: 8px;
                border: 1px solid #E2E8F0;
            }
            .yb25-modes-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }
            .yb25-chk-label {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 600;
                color: #1E293B;
                cursor: pointer;
            }
            .yb25-chk-label input {
                accent-color: #0D9488;
                width: 13.5px;
                height: 13.5px;
                cursor: pointer;
            }
            .yb25-actions {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .yb25-btn-row {
                display: flex;
                gap: 6px;
            }
            .yb25-btn {
                flex: 1;
                padding: 7px 10px;
                border-radius: 7px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                border: 1px solid transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: filter 0.15s ease;
            }
            .yb25-btn:hover {
                filter: brightness(0.95);
            }
            .yb25-btn-emerald {
                background: #059669;
                color: #FFFFFF;
            }
            .yb25-btn-teal-outline {
                background: #F0FDFA;
                color: #0F766E;
                border-color: #99F6E4;
            }
            .yb25-btn-blue {
                background: #2563EB;
                color: #FFFFFF;
            }
            .yb25-btn-orange {
                background: #EA580C;
                color: #FFFFFF;
            }
            .yb25-toolbar {
                display: flex;
                gap: 5px;
                padding-top: 4px;
                border-top: 1px solid #F1F5F9;
            }
            .yb25-tool-btn {
                flex: 1;
                background: #F8FAFC;
                border: 1px solid #CBD5E1;
                color: #334155;
                border-radius: 6px;
                padding: 5px 6px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-align: center;
            }
            .yb25-tool-btn:hover {
                background: #E2E8F0;
                color: #0F172A;
            }
            .yb25-feed-drawer {
                max-height: 250px;
                overflow-y: auto;
                border-top: 1px solid #E2E8F0;
                background: #F8FAFC;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .yb25-feed-item {
                background: #FFFFFF;
                border: 1px solid #E2E8F0;
                border-radius: 7px;
                padding: 6px 8px;
                font-size: 11px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .yb25-feed-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 700;
            }
            .yb25-feed-snippet {
                color: #475569;
                font-size: 11px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                word-break: break-word;
            }
            .yb25-feed-btns {
                display: flex;
                gap: 4px;
                margin-top: 2px;
            }
            .yb25-mini-btn {
                font-size: 10.5px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #CBD5E1;
                background: #F8FAFC;
                color: #1E293B;
                cursor: pointer;
            }
            .yb25-mini-btn:hover {
                background: #E2E8F0;
            }
            .yb25-pill {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #FFFFFF;
                border: 1.5px solid #CBD5E1;
                border-radius: 999px;
                padding: 6px 14px;
                box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
                color: #0F172A;
            }
        `;
        document.head.appendChild(styleEl);

        const root = document.createElement('div');
        root.id = 'ysdms-bridge-v25-root';

        const savedPos = loadJsonStorage(STORAGE_KEYS.POS, null);
        if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
            const safeLeft = Math.min(Math.max(10, savedPos.left), window.innerWidth - 180);
            const safeTop = Math.min(Math.max(10, savedPos.top), window.innerHeight - 80);
            root.style.left = `${safeLeft}px`;
            root.style.top = `${safeTop}px`;
            root.style.right = 'auto';
            root.style.bottom = 'auto';
        }

        document.body.appendChild(root);
        renderUI();
    }

    function enableDragOnHeader(headerEl, rootEl) {
        if (!headerEl || !rootEl) return;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initLeft = 0;
        let initTop = 0;

        headerEl.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('.yb25-port-pill') || e.target.closest('#yb25-tab-proj-btn')) return;
            isDragging = true;
            const rect = rootEl.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initLeft = rect.left;
            initTop = rect.top;
            rootEl.style.right = 'auto';
            rootEl.style.bottom = 'auto';
            rootEl.style.left = `${initLeft}px`;
            rootEl.style.top = `${initTop}px`;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = Math.min(Math.max(8, initLeft + dx), window.innerWidth - 120);
            const newTop = Math.min(Math.max(8, initTop + dy), window.innerHeight - 60);
            rootEl.style.left = `${newLeft}px`;
            rootEl.style.top = `${newTop}px`;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            const rect = rootEl.getBoundingClientRect();
            saveJsonStorage(STORAGE_KEYS.POS, { left: rect.left, top: rect.top });
        });
    }

    function renderUI() {
        const root = document.getElementById('ysdms-bridge-v25-root');
        if (!root) return;

        // NẾU TAB HIỆN TẠI ĐƯỢC NHẬN DIỆN LÀ CỦA DỰ ÁN OMNILINGUIST HOẶC CHƯA XÁC ĐỊNH:
        // Tự động thu về trạng thái Ngủ đông (Standby Pill nhỏ ở góc trái dưới) để nhường toàn bộ không gian và quyền điều khiển!
        if (!isTabActiveForYsdms()) {
            root.style.left = '16px';
            root.style.bottom = '14px';
            root.style.right = 'auto';
            root.style.top = 'auto';
            const standbyLabel = state.detectedTabProject === 'OMNI'
                ? 'nhường Tab cho Omni'
                : 'Đang chờ nhận diện Tab';
            root.innerHTML = `
                <div class="yb25-pill" id="yb25-claim-tab-pill" style="opacity:0.82;font-size:11px;padding:4px 10px;background:#F8FAFC;" title="Bấm vào đây để ghim Tab này cho dự án YSDMS (:3856)">
                    <span>[v${SCRIPT_VERSION}] 💤 YSDMS (:3856) ${standbyLabel}</span>
                    <span style="color:#059669;text-decoration:underline;">[Bật YSDMS]</span>
                </div>
            `;
            document.getElementById('yb25-claim-tab-pill')?.addEventListener('click', () => {
                state.tabProjectOverride = 'YSDMS';
                sessionStorage.setItem(STORAGE_KEYS.TAB_PROJECT_OVERRIDE, 'YSDMS');
                setPinnedUrlOwner(location.pathname, 'YSDMS');
                root.style.left = 'auto';
                root.style.right = '20px';
                root.style.bottom = '20px';
                renderUI();
                fetchFeedFromHub(true);
            });
            return;
        }

        const isPausedNow = isBridgeCurrentlyPaused();
        const theme = getPhaseTheme(state.turnPhase);
        const nextStepText = getNextStepDescription(state.turnPhase, isPausedNow, state.mode);
        const toggleBtnCfg = getAutoToggleButtonConfig(state.turnPhase, isPausedNow, state.mode);

        const row = state.latestRow;
        const rawThread = (row && row.thread_id) || 'DEFAULT';
        const shortThread = rawThread.length > 14 ? rawThread.slice(0, 12) + '…' : rawThread;
        const rowMeta = row
            ? `🕒 ${formatFullJstStamp(row.created_at)} • ${row.sender} • ${(row.id || '').slice(0, 8)} • ${shortThread}`
            : 'Chưa có bản ghi nào';

        if (state.isMinimized) {
            root.innerHTML = `
                <div class="yb25-pill" id="yb25-expand-pill" title="Bấm để mở rộng bảng điều khiển [v${SCRIPT_VERSION}] YSDMS Bridge">
                    <span style="width:9px;height:9px;border-radius:50%;background:${state.hubOnline ? '#10B981' : '#EF4444'};display:inline-block;"></span>
                    <span>[v${SCRIPT_VERSION}] 🏭 YSDMS</span>
                    <span style="color:${theme.text};background:${theme.bg};border:1px solid ${theme.border};padding:1px 8px;border-radius:999px;font-size:11px;">
                        ${theme.badge}
                    </span>
                </div>
            `;
            const pill = document.getElementById('yb25-expand-pill');
            if (pill) {
                pill.addEventListener('click', () => {
                    state.isMinimized = false;
                    localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'false');
                    renderUI();
                });
            }
            return;
        }

        const isPasteOnly = state.mode === 'PASTE_ONLY';
        const isPasteAndSubmit = state.mode === 'PASTE_AND_SUBMIT';

        root.innerHTML = `
            <div class="yb25-card">
                <div class="yb25-header" id="yb25-drag-handle" title="Kéo để di chuyển bảng điều khiển">
                    <div class="yb25-title">
                        <span>[v${SCRIPT_VERSION}] 🏭 YSDMS Bridge</span>
                        <span style="font-size:10px;background:#DBEAFE;color:#1E40AF;padding:1px 5px;border-radius:4px;cursor:pointer;" id="yb25-tab-proj-btn" title="Chế độ nhận diện dự án của Tab này (${state.tabProjectOverride}). Bấm để chuyển đổi.">
                            Tab: YSDMS (${state.tabProjectOverride === 'AUTO' ? 'Auto-Pinned' : 'Locked'})
                        </span>
                    </div>
                    <div style="display:flex;align-items:center;gap:5px;">
                        <span class="yb25-port-pill" id="yb25-port-btn" title="Bấm để đổi cổng Local Hub"
                              style="background:${state.hubOnline ? '#DCFCE7' : '#FEE2E2'};color:${state.hubOnline ? '#166534' : '#991B1B'};border-color:${state.hubOnline ? '#86EFAC' : '#FCA5A5'};">
                            ${state.hubOnline ? '🟢' : '🔴'} :${state.hubPort}
                        </span>
                        <button class="yb25-icon-btn" id="yb25-min-btn" title="Thu gọn thành viên thuốc">—</button>
                    </div>
                </div>

                <div class="yb25-body">
                    <div id="ysdms-bridge-v25-toast" style="display:none;padding:6px 9px;border-radius:6px;border:1px solid #6EE7B7;font-size:11.5px;font-weight:600;"></div>

                    <div class="yb25-status-box" style="background:${theme.bg};border-color:${theme.border};">
                        <div class="yb25-status-main" style="color:${theme.text};">
                            <span>${theme.badge}</span>
                        </div>
                        <div class="yb25-status-sub" title="${state.statusDetail}">
                            ${state.statusDetail}
                        </div>
                        <div class="yb25-status-next" title="${nextStepText}">
                            ${nextStepText}
                        </div>
                        <div class="yb25-status-sub" style="color:#64748B;">
                            ${rowMeta}
                        </div>
                    </div>

                    <div class="yb25-modes">
                        <div class="yb25-modes-row">
                            <label class="yb25-chk-label" title="Tự động đổ lệnh kích hoạt gọn của AN vào chatbox chờ Minh Chủ bấm Enter; chiều PE trả lời xong vẫn TỰ ĐỘNG đẩy về AN">
                                <input type="checkbox" id="yb25-chk-paste-only" ${isPasteOnly ? 'checked' : ''} />
                                <span>Chỉ dán chatbox</span>
                            </label>
                            <label class="yb25-chk-label" title="Tự động đổ lệnh kích hoạt gọn AN vào khung chat, đợi Random 1-4s rồi tự bấm Submit; chiều PE trả lời xong TỰ ĐỘNG đẩy về AN">
                                <input type="checkbox" id="yb25-chk-auto-submit" ${isPasteAndSubmit ? 'checked' : ''} />
                                <span>Đổ & Submit (1-4s)</span>
                            </label>
                            <label class="yb25-chk-label" title="Chuyển nội dung sang tiếng Việt không dấu trước khi đổ vào Perplexity (Alt+F8)">
                                <input type="checkbox" id="yb25-chk-no-accent" ${state.noAccent ? 'checked' : ''} />
                                <span>Không dấu</span>
                            </label>
                        </div>
                        <button class="yb25-btn" id="yb25-btn-toggle-pause"
                                style="background:${toggleBtnCfg.bg};color:${toggleBtnCfg.color};border-color:${toggleBtnCfg.border};padding:6px 10px;font-size:11.5px;"
                                title="${toggleBtnCfg.title}">
                            ${toggleBtnCfg.label}
                        </button>
                    </div>

                    <div class="yb25-actions">
                        ${state.turnPhase === 'WAITING_THOAN_APPROVAL' ? `
                            <button class="yb25-btn yb25-btn-orange" id="yb25-btn-approve-pe">
                                ⚡ Duyệt phương án PE & Bắn sang AN ngay
                            </button>
                        ` : ''}
                        <div class="yb25-btn-row">
                            <button class="yb25-btn yb25-btn-emerald" id="yb25-btn-send-pe" title="Đổ lệnh kích hoạt AN mới nhất vào khung chat và bấm Gửi ngay (Alt+F9)">
                                🚀 Đổ & Gửi PE (Alt+F9)
                            </button>
                            <button class="yb25-btn yb25-btn-teal-outline" id="yb25-btn-paste-pe" style="flex:0.65;" title="Chỉ đổ lệnh kích hoạt gọn của AN vào ô chat nhưng chưa bấm gửi">
                                📝 Chỉ Đổ
                            </button>
                        </div>
                        <button class="yb25-btn yb25-btn-blue" id="yb25-btn-rescue-an" title="Quét văn bản đang bôi đen hoặc câu trả lời cuối của PE để gửi về Hub & đánh thức AN (Alt+F10)">
                            📥 Cứu hộ: Bắn PE sang AN (Alt+F10)
                        </button>
                    </div>

                    <div class="yb25-toolbar">
                        <button class="yb25-tool-btn" id="yb25-btn-refresh" title="Kéo danh sách bản ghi mới nhất từ Supabase qua Hub (Alt+F5)">
                            🔄 Làm mới
                        </button>
                        <button class="yb25-tool-btn" id="yb25-btn-feed" style="${state.feedOpen ? 'background:#E0F2FE;border-color:#7DD3FC;color:#0369A1;' : ''}">
                            👁️ Xem tin (${state.feedRows.length})
                        </button>
                        <button class="yb25-tool-btn" id="yb25-btn-copy-latest" title="Copy toàn bộ nội dung bản ghi mới nhất vào Clipboard">
                            📋 Copy tin
                        </button>
                    </div>
                </div>

                ${state.feedOpen ? `
                    <div class="yb25-feed-drawer" id="yb25-feed-list">
                        ${state.feedRows.length === 0 ? `
                            <div style="text-align:center;color:#64748B;font-size:11px;padding:12px;">
                                Chưa tải được danh sách tin nhắn từ Hub.
                            </div>
                        ` : state.feedRows.map((item, idx) => {
                            const itemId = item.id || item.message_id || '';
                            const isAn = item.sender === 'AN';
                            const badgeBg = isAn ? '#DCFCE7' : '#DBEAFE';
                            const badgeColor = isAn ? '#166534' : '#1E40AF';
                            const statusText = (item.status === 'CONSUMED' || isMessageSubmitted(itemId))
                                ? 'ĐÃ GỬI'
                                : (isMessageInjected(itemId) ? 'ĐÃ ĐỔ CHAT' : (item.status || 'PENDING'));
                            const snippet = (item.content_md || '').replace(/\s+/g, ' ').slice(0, 140);
                            return `
                                <div class="yb25-feed-item">
                                    <div class="yb25-feed-head">
                                        <span style="background:${badgeBg};color:${badgeColor};padding:1px 6px;border-radius:4px;font-size:10px;">
                                            #${idx + 1} ${item.sender} • ${item.message_type || 'MSG'}
                                        </span>
                                        <span style="font-size:10px;color:#64748B;font-family:monospace;">
                                            ${statusText} • ${formatShortTime(item.created_at)}
                                        </span>
                                    </div>
                                    <div class="yb25-feed-snippet">${snippet.replace(/</g, '&lt;')}</div>
                                    <div class="yb25-feed-btns">
                                        <button class="yb25-mini-btn" data-action="paste" data-idx="${idx}">📝 Đổ kích hoạt</button>
                                        ${isAn
                                            ? `<button class="yb25-mini-btn" data-action="submit-pe" data-idx="${idx}" style="color:#059669;border-color:#6EE7B7;">🚀 Đổ & Gửi PE</button>`
                                            : `<button class="yb25-mini-btn" data-action="send-an" data-idx="${idx}" style="color:#2563EB;border-color:#93C5FD;">⚡ Bắn sang AN</button>`
                                        }
                                        <button class="yb25-mini-btn" data-action="copy" data-idx="${idx}">📋 Copy Full</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        enableDragOnHeader(document.getElementById('yb25-drag-handle'), root);

        document.getElementById('yb25-tab-proj-btn')?.addEventListener('click', () => {
            const next = state.tabProjectOverride === 'AUTO' ? 'YSDMS' : (state.tabProjectOverride === 'YSDMS' ? 'OMNI' : 'AUTO');
            state.tabProjectOverride = next;
            sessionStorage.setItem(STORAGE_KEYS.TAB_PROJECT_OVERRIDE, next);
            if (next === 'YSDMS' || next === 'OMNI') {
                setPinnedUrlOwner(location.pathname, next);
            }
            renderUI();
        });

        document.getElementById('yb25-min-btn')?.addEventListener('click', () => {
            state.isMinimized = true;
            localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'true');
            renderUI();
        });

        document.getElementById('yb25-port-btn')?.addEventListener('click', () => {
            const input = prompt('Nhập cổng Local Hub cho Tab này (YSDMS: 3856 / Omni: 3956):', String(state.hubPort));
            if (!input) return;
            const newPort = parseInt(input.trim(), 10);
            if (newPort > 1000 && newPort < 65535) {
                state.hubPort = newPort;
                sessionStorage.setItem(STORAGE_KEYS.PORT, String(newPort));
                connectSse();
                fetchFeedFromHub(true);
            }
        });

        document.getElementById('yb25-chk-paste-only')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.mode = 'PASTE_ONLY';
                if (state.submitTimer) clearTimeout(state.submitTimer);
            } else {
                state.mode = 'MANUAL';
            }
            localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
            renderUI();
        });

        document.getElementById('yb25-chk-auto-submit')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.mode = 'PASTE_AND_SUBMIT';
                if (!isBridgeCurrentlyPaused() && state.latestRow && state.latestRow.sender === 'AN' && state.turnPhase === 'AN_TEXT_INJECTED') {
                    submitPerplexityChat(state.latestRow.id);
                    return;
                }
            } else {
                state.mode = 'PASTE_ONLY';
                if (state.submitTimer) clearTimeout(state.submitTimer);
            }
            localStorage.setItem(STORAGE_KEYS.MODE, state.mode);
            renderUI();
        });

        document.getElementById('yb25-chk-no-accent')?.addEventListener('change', (e) => {
            state.noAccent = !!e.target.checked;
            localStorage.setItem(STORAGE_KEYS.NO_ACCENT, String(state.noAccent));
        });

        document.getElementById('yb25-btn-toggle-pause')?.addEventListener('click', () => {
            handleTogglePauseAuto();
        });

        document.getElementById('yb25-btn-approve-pe')?.addEventListener('click', () => {
            const textToApprove = state.pendingPeApprovalText || (state.latestRow && state.latestRow.content_md) || getLatestPeProseText();
            const tid = (state.latestRow && state.latestRow.thread_id) || DEFAULT_THREAD_ID;
            handleRescueSendPeToAn(textToApprove, tid);
        });

        document.getElementById('yb25-btn-send-pe')?.addEventListener('click', () => {
            handleForceInjectAndSubmitAn(false);
        });

        document.getElementById('yb25-btn-paste-pe')?.addEventListener('click', () => {
            handleForceInjectAndSubmitAn(true);
        });

        document.getElementById('yb25-btn-rescue-an')?.addEventListener('click', () => {
            handleRescueSendPeToAn();
        });

        document.getElementById('yb25-btn-refresh')?.addEventListener('click', () => {
            fetchFeedFromHub(true);
        });

        document.getElementById('yb25-btn-feed')?.addEventListener('click', () => {
            state.feedOpen = !state.feedOpen;
            if (state.feedOpen) fetchFeedFromHub(false);
            renderUI();
        });

        document.getElementById('yb25-btn-copy-latest')?.addEventListener('click', async () => {
            const target = state.latestRow || state.feedRows[0];
            if (!target || !target.content_md) {
                showToast('⚠️ Chưa có nội dung để copy!', true);
                return;
            }
            try {
                await navigator.clipboard.writeText(target.content_md);
                showToast(`📋 Đã copy toàn văn tin ${(target.id || '').slice(0, 8)} vào Clipboard!`);
            } catch {
                showToast('❌ Trình duyệt chặn quyền ghi Clipboard!', true);
            }
        });

        const feedList = document.getElementById('yb25-feed-list');
        if (feedList) {
            feedList.querySelectorAll('button[data-action]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const idx = parseInt(btn.getAttribute('data-idx') || '0', 10);
                    const act = btn.getAttribute('data-action');
                    const item = state.feedRows[idx];
                    if (!item || !item.content_md) return;
                    const itemId = item.id || item.message_id;

                    if (act === 'paste') {
                        const textToInject = item.sender === 'AN' ? buildPerplexityTriggerPrompt(item) : item.content_md;
                        markMessageInjected(itemId);
                        const ok = await injectTextIntoPerplexity(textToInject, { manualUserClick: true, messageId: itemId });
                        if (ok) {
                            state.turnPhase = 'AN_TEXT_INJECTED';
                            state.statusDetail = `Đã đổ lệnh kích hoạt tin #${idx + 1} (${itemId.slice(0, 8)}) vào ô chat`;
                            showToast(`📝 Đã đổ lệnh kích hoạt tin #${idx + 1} vào ô chat!`);
                            renderUI();
                        }
                    } else if (act === 'submit-pe') {
                        const textToInject = item.sender === 'AN' ? buildPerplexityTriggerPrompt(item) : item.content_md;
                        markMessageInjected(itemId);
                        const ok = await injectTextIntoPerplexity(textToInject, { manualUserClick: true, messageId: itemId });
                        if (ok) {
                            setTimeout(() => submitPerplexityChat(itemId), 500);
                        }
                    } else if (act === 'send-an') {
                        handleRescueSendPeToAn(item.content_md, item.thread_id);
                    } else if (act === 'copy') {
                        await navigator.clipboard.writeText(item.content_md);
                        showToast(`📋 Đã copy toàn văn tin #${idx + 1} vào Clipboard!`);
                    }
                });
            });
        }
    }

    // =========================================================================
    // 8. PHÍM TẮT TOÀN CỤC (CHỈ BẮT PHÍM KHI TAB THUỘC DỰ ÁN YSDMS) & KHỞI ĐỘNG
    // =========================================================================
    window.addEventListener('keydown', (e) => {
        if (!isTabActiveForYsdms()) return;
        if (e.key === 'Escape' && state.submitTimer) {
            clearTimeout(state.submitTimer);
            state.submitTimer = null;
            state.turnPhase = 'AN_TEXT_INJECTED';
            state.statusDetail = 'Đã hủy tự động Submit (ESC) — Chờ Minh Chủ bấm Enter';
            showToast('⏸️ Đã hủy đếm ngược Auto-Submit!');
            renderUI();
        } else if (e.altKey && e.key === 'F9') {
            e.preventDefault();
            handleForceInjectAndSubmitAn(false);
        } else if (e.altKey && e.key === 'F10') {
            e.preventDefault();
            handleRescueSendPeToAn();
        } else if (e.altKey && e.key === 'F8') {
            e.preventDefault();
            state.noAccent = !state.noAccent;
            localStorage.setItem(STORAGE_KEYS.NO_ACCENT, String(state.noAccent));
            renderUI();
            showToast(`🔤 Chế độ Không dấu: ${state.noAccent ? 'ĐÃ BẬT' : 'ĐÃ TẮT'}`);
        } else if (e.altKey && e.key === 'F5') {
            e.preventDefault();
            fetchFeedFromHub(true);
        }
    });

    function initBridge() {
        if (!document.body) {
            setTimeout(initBridge, 300);
            return;
        }
        detectTabProjectAffinity();
        const initProse = getLatestPeProseText();
        if (initProse) {
            state.lastObservedProseText = initProse;
        }
        createBridgeDOM();
        attachNativeUserSubmitListener();
        connectSse();
        fetchFeedFromHub(false);

        setInterval(() => {
            const prevProj = state.detectedTabProject;
            const curProj = detectTabProjectAffinity();
            if (prevProj !== curProj) {
                renderUI();
            }
            fetchFeedFromHub(false);
        }, 3500);

        setInterval(() => {
            monitorPeDomResponseLoop();
        }, 1000);

        setInterval(() => {
            if (document.body && !document.getElementById('ysdms-bridge-v25-root')) {
                createBridgeDOM();
            }
        }, 2000);

        console.log(`[YSDMS Bridge v${SCRIPT_VERSION}] 🚀 Auto-Loop & Compact Trigger Edition đã khởi tạo thành công!`);
    }

    initBridge();
})();
