/**
 * FULL CLEANUP — Quét TẤT CẢ records (phân trang), fix company_code rác
 *
 * Tiêu chí "rác":
 *   - Chứa ký tự Nhật (Kanji/Kana)
 *   - Chứa đuôi file (.xlsx .xls .pdf .doc)
 *   - Chứa khoảng trắng
 *   - Dài hơn 25 ký tự
 *   - Là số thuần (>3 chữ số hoặc dạng 2022.7 / 20240722)
 *   - Chứa dấu chấm + số (2022.7, 2023.1.1付)
 *   - Dạng mã sản phẩm N-NNNNNN (ví dụ 1-912065-2)
 *   - Chứa ～ 付 様 向 など
 *
 * Mã SẠCH: ngắn gọn, chỉ A-Z 0-9 - _
 *   Ví dụ: SMK-001, AMP, ODE-001, IDM-001
 *
 * Cách dùng:
 *   node temp_ai/04_full_cleanup.mjs            (preview)
 *   node temp_ai/04_full_cleanup.mjs --apply    (thực thi)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const APPLY = process.argv.includes('--apply')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Load env ──────────────────────────────────────────────────────────────────
const envLines = fs.readFileSync(path.join(__dirname,'..', '.env.local'), 'utf8').replace(/\r\n/g,'\n').split('\n')
const env = {}; let cur = null
for (const l of envLines) {
  if (/^[A-Z_]+=/.test(l)) { const i=l.indexOf('='); cur=l.slice(0,i); env[cur]=l.slice(i+1) }
}
const URL  = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const KEY  = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const H    = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }

async function dbFetch(path, opts={}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { headers: H, ...opts })
  return r.json()
}

// ── Lấy TẤT CẢ records (paginated) ───────────────────────────────────────────
async function fetchAll() {
  const all = []
  let offset = 0
  const PAGE = 1000
  while (true) {
    const batch = await dbFetch(
      `/companies?select=company_id,company_code,company_name,notes&order=company_id&limit=${PAGE}&offset=${offset}`
    )
    if (!Array.isArray(batch) || batch.length === 0) break
    all.push(...batch)
    if (batch.length < PAGE) break
    offset += PAGE
  }
  return all
}

// ── Kiểm tra code có phải rác không ──────────────────────────────────────────
function isGarbage(code) {
  if (!code || code.length === 0) return true
  // Chứa ký tự Nhật (Kanji U+4E00–U+9FFF, Kana)
  if (/[\u3000-\u9FFF]/.test(code)) return true
  // Đuôi file
  if (/\.(xlsx?|pdf|doc|xls)$/i.test(code)) return true
  // Dài hơn 25 ký tự → khó là mã công ty chuẩn
  if (code.length > 25) return true
  // Chứa khoảng trắng
  if (/\s/.test(code)) return true
  // Chứa ký tự đặc biệt không phải - _ .
  if (/[\/\\%#@!]/.test(code)) return true
  // Dạng số ngày: 2022.7 / 2022.8.12 / 2023.1.1付
  if (/^\d{4}\.\d/.test(code)) return true
  if (/^\d{8}$/.test(code)) return true  // 20240722
  if (/^\d{6}$/.test(code)) return true  // 240205
  // Thuần số ngắn bất thường: 000, 1
  if (/^\d+$/.test(code) && parseInt(code) < 100) return true
  // Dạng mã sản phẩm AMP/SMK: bắt đầu bằng số, chứa - và số dài
  if (/^\d+-\d{4,}/.test(code)) return true  // 1-912065-2, 5-912056-6
  if (/^\d+-\d+-\d+/.test(code)) return true  // 3-111111-3
  // Chứa ký tự ～ 付 等
  if (/[～付等]/.test(code)) return true
  // Chứa ngoặc tên người (様 向 御)
  if (/[様向御]/.test(code)) return true
  // Mã kiểu "(株)" lẫn trong code
  if (/[（(]/.test(code) && code.length > 8) return true
  return false
}

// ── Sinh code mới từ tên công ty ─────────────────────────────────────────────
const usedCodes = new Set()
const KNOWN_MAP = {
  'SMK': 'SMK', 'AMP': 'AMP', 'HAE': 'HAE', 'NLC': 'NLC', 'YAE': 'YAE',
  '三菱': 'MTB', '日立': 'HTC', '東芝': 'TSB', '富士': 'FJT',
  'ソニー': 'SNY', 'パナソニック': 'PAN', '大石': 'OSI', '出光': 'IDM',
  '旺電舎': 'ODE', '信和': 'SNW', '新進': 'SHS', '最上': 'MOG',
  '石巻': 'ISM', '青野': 'AON', '阪井': 'SAK', '甲陵': 'KOR',
  'Orbray': 'ORB', '国上': 'KKM', 'MIYOSHI': 'MYS', 'MARUWA': 'MRW',
  'ベスコ': 'VCO', 'ワンリーフ': 'WLF', 'ミヤカワ': 'MYK',
  'ナガセ': 'NGS', 'アドバネクス': 'ADV', 'トープラテクノ': 'TPT',
  '菊池': 'KKC', '日東': 'NTC',
}

function generateCode(name, existingCodes) {
  if (!name) return null
  const clean = name.replace(/[（(][株有合][）)]/g,'').replace(/[　\s]+/g,' ').trim()

  // Sprawdź known map
  for (const [k, v] of Object.entries(KNOWN_MAP)) {
    if (clean.includes(k)) {
      let code = v
      if (!existingCodes.has(code) && !usedCodes.has(code)) {
        usedCodes.add(code)
        return code
      }
      // Thêm số suffix
      let seq = 1
      while (existingCodes.has(`${v}-${String(seq).padStart(3,'0')}`) || usedCodes.has(`${v}-${String(seq).padStart(3,'0')}`)) seq++
      code = `${v}-${String(seq).padStart(3,'0')}`
      usedCodes.add(code)
      return code
    }
  }

  // Latin prefix
  const latinMatch = clean.match(/[A-Z]{2,}/i)
  let prefix = latinMatch ? latinMatch[0].slice(0,4).toUpperCase() : null

  // Fallback: 3 ký tự đầu → encode
  if (!prefix) {
    const chars = [...clean].filter(c => c.match(/[A-Za-z0-9]/))
    if (chars.length >= 2) prefix = chars.slice(0,3).join('').toUpperCase()
    else prefix = 'CO' + Math.random().toString(36).slice(2,4).toUpperCase()
  }

  let seq = 1, code
  do { code = `${prefix}-${String(seq).padStart(3,'0')}`; seq++ }
  while (existingCodes.has(code) || usedCodes.has(code))
  usedCodes.add(code)
  return code
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const SEP = '═'.repeat(65)
console.log(`\n${SEP}`)
console.log('  YSD Full Company Code Cleanup (Paginated)')
console.log(`  Mode: ${APPLY ? 'APPLY ⚡' : 'PREVIEW 👁'}`)
console.log(SEP)

console.log('\n📦 Đang tải toàn bộ records (phân trang)...')
const all = await fetchAll()
console.log(`✅ Tổng: ${all.length} records`)

const existingCodes = new Set(all.map(c => c.company_code).filter(Boolean))

// Phân loại
const alreadyFixed = all.filter(c => c.notes?.includes('[CODE_FIXED'))
const garbage = all.filter(c => !c.notes?.includes('[CODE_FIXED') && isGarbage(c.company_code || ''))
const clean = all.filter(c => !c.notes?.includes('[CODE_FIXED') && !isGarbage(c.company_code || ''))

console.log(`\n📊 Phân tích:`)
console.log(`   ✅ Code sạch     : ${clean.length}`)
console.log(`   🔧 Đã fix trước  : ${alreadyFixed.length}`)
console.log(`   🗑️  CÒN RÁC      : ${garbage.length}  ← CẦN FIX`)

if (garbage.length > 0) {
  console.log(`\n📋 Mẫu records cần fix (tối đa 30):`)
  garbage.slice(0, 30).forEach((c, i) => {
    console.log(`  [${i+1}] ${(c.company_code||'').slice(0,35).padEnd(36)} → "${(c.company_name||'').slice(0,20)}"`)
  })
  if (garbage.length > 30) console.log(`  ... và ${garbage.length - 30} records khác`)
}

if (!APPLY) {
  console.log(`\n${'─'.repeat(65)}`)
  console.log('⚠️  PREVIEW mode — DB không thay đổi.')
  console.log('   Chạy với --apply để thực thi')
  console.log(`${'─'.repeat(65)}\n`)
  process.exit(0)
}

// ── APPLY ─────────────────────────────────────────────────────────────────────
console.log(`\n🚀 Đang fix ${garbage.length} records...\n`)
let fixed = 0, errors = 0

for (const rec of garbage) {
  const newCode = generateCode(rec.company_name, existingCodes)
  if (!newCode) { errors++; continue }

  existingCodes.add(newCode)

  const res = await dbFetch(`/companies?company_id=eq.${rec.company_id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      company_code: newCode,
      notes: `[CODE_FIXED_V3] Legacy: ${(rec.company_code||'').slice(0,80)}`,
    })
  })

  if (Array.isArray(res) && !res[0]?.error) {
    fixed++
    if (fixed % 50 === 0 || fixed <= 10) {
      console.log(`  [${fixed}] ${(rec.company_code||'').slice(0,30).padEnd(32)} → ${newCode.padEnd(12)} "${(rec.company_name||'').slice(0,20)}"`)
    }
  } else {
    errors++
    console.log(`  ❌ [${rec.company_id?.slice(0,8)}] ${rec.company_name?.slice(0,20)}: ${JSON.stringify(res)?.slice(0,60)}`)
  }
}

console.log(`\n${SEP}`)
console.log(`✅ HOÀN THÀNH: ${fixed} records đã fix | ${errors} lỗi`)
console.log(`   Tổng codes sạch sau fix: ${clean.length + alreadyFixed.length + fixed} / ${all.length}`)
console.log(`${SEP}\n`)
