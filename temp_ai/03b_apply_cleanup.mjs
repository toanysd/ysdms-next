/**
 * BƯỚC 3b: Fix Company Codes (không xóa record, chỉ sửa company_code rác thành code chuẩn)
 *
 * Chiến lược:
 *   - 64 records có company_code = tên file → sinh code chuẩn từ company_name
 *   - Không mark inactive (tránh đứt FK)
 *   - Ghi legacy_code cũ vào field `notes` để tra cứu lại
 *   - Import 1681 delivery sites của AMP với type DELIVERY_SITE
 *
 * Cách dùng:
 *   node temp_ai/03b_apply_cleanup.mjs --preview   (mặc định)
 *   node temp_ai/03b_apply_cleanup.mjs --apply
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APPLY = process.argv.includes('--apply')

// Load env
const envLines = fs.readFileSync(path.join(__dirname,'..', '.env.local'), 'utf8').replace(/\r\n/g,'\n').split('\n')
const env = {}; let cur = null
for (const l of envLines) {
  if (/^[A-Z_]+=/.test(l)) { const i=l.indexOf('='); cur=l.slice(0,i); env[cur]=l.slice(i+1) }
  else if (cur && l.trim()) env[cur]+=l.trim()
}
const URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const H = { apikey: KEY, Authorization:`Bearer ${KEY}`, 'Content-Type':'application/json', Prefer:'return=representation' }

async function dbFetch(p, opts={}) {
  const res = await fetch(`${URL}/rest/v1${p}`, { headers: H, ...opts })
  return res.json()
}

// ── Hàm sinh company_code từ tên công ty ──────────────────────────────────
const usedCodes = new Set()

function generateCode(name, existingCodes) {
  // Chuẩn hoá: bỏ (株)(有)(合), lấy ký tự Latin/Katakana đầu
  const cleaned = name
    .replace(/[（(]株[）)]/g, '').replace(/[（(]有[）)]/g, '').replace(/[（(]合[）)]/g, '')
    .replace(/[　\s]+/g, ' ').trim()

  // Thử lấy chữ cái Latin đầu
  const latinMatch = cleaned.match(/[A-Z]{2,}/i)
  let prefix = latinMatch ? latinMatch[0].slice(0, 4).toUpperCase() : null

  // Nếu không có Latin, lấy 2 ký tự Kanji/Katakana đầu rồi dùng Romaji đơn giản
  if (!prefix) {
    // Map một số tên phổ biến
    const KNOWN = {
      'SMK': 'SMK', 'AMP': 'AMP', 'HAE': 'HAE', 'NLC': 'NLC', 'YAE': 'YAE',
      '三菱': 'MTB', '日立': 'HTC', '東芝': 'TSB', '富士': 'FJT', 'ソニー': 'SNY',
      'パナソニック': 'PAN', '大石': 'OSI', '出光': 'IDM', '沖電線': 'OKD',
    }
    for (const [k, v] of Object.entries(KNOWN)) {
      if (cleaned.includes(k)) { prefix = v; break }
    }
    if (!prefix) {
      // Lấy 3 ký tự đầu và encode thành ASCII
      prefix = cleaned.slice(0, 3).replace(/[^A-Za-z0-9]/g, 'X').toUpperCase()
      if (prefix.length < 2) prefix = 'CO' + prefix
    }
  }

  // Tìm sequence chưa dùng
  let seq = 1
  let code
  do {
    code = `${prefix}-${String(seq).padStart(3, '0')}`
    seq++
  } while (existingCodes.has(code) || usedCodes.has(code))

  usedCodes.add(code)
  return code
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🔄 Tải dữ liệu DB...')
const dbAll = await dbFetch('/companies?select=company_id,company_code,company_name,company_type,notes&limit=2000')
const existingCodes = new Set(dbAll.map(c => c.company_code).filter(Boolean))
console.log(`📦 DB hiện có: ${dbAll.length} records, ${existingCodes.size} codes duy nhất\n`)

const GARBAGE_REGEX = /\.(xlsx?|pdf)$|[(\（]\d{6,8}[)\）]|^指示書|^注文書/i
const garbageRecords = dbAll.filter(c => GARBAGE_REGEX.test(c.company_code || ''))

console.log(`🗑️  Records cần fix company_code: ${garbageRecords.length}\n`)

// Generate new codes
const fixes = garbageRecords.map(rec => ({
  id: rec.company_id,
  oldCode: rec.company_code,
  newCode: generateCode(rec.company_name || 'UNKNOWN', existingCodes),
  name: rec.company_name,
}))

console.log('📋 Preview fixes (tối đa 20):')
fixes.slice(0, 20).forEach(f => {
  console.log(`  [${f.oldCode?.slice(0,35).padEnd(35)}] → [${f.newCode}]  "${f.name}"`)
})
if (fixes.length > 20) console.log(`  ... và ${fixes.length - 20} record khác`)

// Load parse result để get delivery sites
const parseResultPath = path.join(__dirname, '_parse_result.json')
let deliverySites = []
if (fs.existsSync(parseResultPath)) {
  const parsed = JSON.parse(fs.readFileSync(parseResultPath, 'utf8'))
  deliverySites = (parsed.companies || []).filter(c =>
    c.source_folder === 'AMP' && c.company_name && c.company_name.length > 1 &&
    !['後日確認', 'SMK'].includes(c.company_name)
  )
  console.log(`\n🆕 Delivery sites từ AMP sẽ import: ${deliverySites.length}`)

  // Tìm company_id của AMP để làm parent
  const ampRecord = dbAll.find(c => /^AMP$/i.test(c.company_code) || c.company_name === 'AMP')
  console.log(ampRecord ? `   AMP parent: [${ampRecord.company_code}] ${ampRecord.company_id}` : '   ⚠️ Không tìm thấy AMP trong DB (sẽ import không có parent)')
}

if (!APPLY) {
  console.log('\n─────────────────────────────────────────────────')
  console.log('⚠️  Preview mode. Chạy với --apply để thực sự sửa DB')
  console.log('─────────────────────────────────────────────────\n')
  process.exit(0)
}

// ── APPLY ─────────────────────────────────────────────────────────────────────
console.log('\n🚀 Đang apply thay đổi...\n')

// Phase 1: Fix company_codes
let fixedCount = 0, fixErrors = 0
for (const fix of fixes) {
  const body = JSON.stringify({
    company_code: fix.newCode,
    notes: `[CODE_FIXED] Legacy code: ${fix.oldCode}`,
  })
  const res = await dbFetch(`/companies?company_id=eq.${fix.id}`, { method: 'PATCH', body })
  if (res?.error || (Array.isArray(res) && res[0]?.error)) fixErrors++
  else fixedCount++
  existingCodes.add(fix.newCode) // track để tránh trùng
}
console.log(`✅ Fixed company codes: ${fixedCount} / ${fixes.length} (lỗi: ${fixErrors})`)

// Phase 2: Import delivery sites
let insertedCount = 0, skipCount = 0, insertErrors = 0
const dbNameSet = new Set(dbAll.map(c => (c.company_name||'').toLowerCase().trim()))

// Tìm AMP parent_id
const ampRecord = dbAll.find(c => /^AMP$/i.test(c.company_code) || c.company_name === 'AMP')
const ampParentId = ampRecord?.company_id || null

for (const site of deliverySites.slice(0, 500)) { // batch 500 trước
  const nameKey = (site.company_name||'').toLowerCase().trim()
  if (dbNameSet.has(nameKey)) { skipCount++; continue }

  const newCode = generateCode(site.company_name, existingCodes)
  existingCodes.add(newCode)
  dbNameSet.add(nameKey)

  const body = JSON.stringify({
    company_code: newCode,
    company_name: site.company_name,
    company_type: ['DELIVERY_SITE'],
    tel: site.tel || null,
    fax: site.fax || null,
    address: site.address || null,
    parent_company_id: ampParentId,
    is_active: true,
    notes: `[AUTO_IMPORT] Trích từ 納入先一覧表 AMP`,
  })

  const res = await dbFetch('/companies', { method: 'POST', body })
  if (!Array.isArray(res) || res[0]?.error) insertErrors++
  else { insertedCount++; }
}

console.log(`✅ Import delivery sites: ${insertedCount} mới, ${skipCount} đã có, ${insertErrors} lỗi`)
console.log('\n═══════════════════════════════════════════════════════')
console.log(`Tổng thay đổi: ${fixedCount} code fixed + ${insertedCount} records mới`)
console.log('═══════════════════════════════════════════════════════\n')
