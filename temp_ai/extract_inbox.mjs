/**
 * YSD Inbox Extractor
 * Đọc các file Excel trong temp_ai/inbox/, trích xuất dữ liệu khách hàng,
 * hiển thị preview, và tùy chọn import vào DB.
 *
 * Cách dùng (thường qua extract.bat):
 *   node temp_ai/extract_inbox.mjs --list     # Liệt kê file trong inbox
 *   node temp_ai/extract_inbox.mjs --preview  # Trích xuất, xem trước (không sửa DB)
 *   node temp_ai/extract_inbox.mjs --apply    # Trích xuất và import vào DB
 *   node temp_ai/extract_inbox.mjs --cleanup  # Di chuyển file đã xử lý sang _done/
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const INBOX_DIR = path.join(__dirname, 'inbox')
const DONE_DIR  = path.join(__dirname, 'inbox', '_done')
const MODE = process.argv.find(a => a.startsWith('--'))?.replace('--', '') || 'preview'

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envLines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
  .replace(/\r\n/g, '\n').split('\n')
const env = {}; let cur = null
for (const l of envLines) {
  if (/^[A-Z_]+=/.test(l)) { const i = l.indexOf('='); cur = l.slice(0, i); env[cur] = l.slice(i + 1) }
  else if (cur && l.trim()) env[cur] += l.trim()
}
const SUPA_URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const SUPA_KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const H = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }
async function dbFetch(p, opts = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1${p}`, { headers: H, ...opts })
  return res.json()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function norm(v) {
  if (v == null) return null
  return String(v).trim()
    .replace(/[\u3000\u00a0]/g, ' ')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, ' ').trim()
}

function isValidName(s) {
  if (!s || s.length < 2 || s.length > 80) return false
  return !/^(No\.|番号|コード|納入先|得意先|会社名|名称|住所|電話|TEL|FAX|備考|担当|[\d\-\/\.]+)$/i.test(s.trim())
}

/** Tìm cell theo label regex, lấy giá trị ô kế bên */
function findByLabel(sheet, regex) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:Z50')
  for (let r = range.s.r; r <= Math.min(range.e.r, 80); r++) {
    for (let c = range.s.c; c <= Math.min(range.e.c, 20); c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })]
      if (cell && String(cell.v).match(regex)) {
        for (const off of [1, 2, 3]) {
          const v = sheet[XLSX.utils.encode_cell({ r, c: c + off })]
          if (v?.v != null) return norm(String(v.v))
        }
      }
    }
  }
  return null
}

/** Parse sheet 納入先一覧表 → danh sách công ty/điểm giao */
function parseNyuusaki(sheet, context) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false })
  const companies = []
  let nameCol = 1 // default
  let codeCol = null, telCol = null, faxCol = null, addrCol = null

  // Tìm header
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = (rows[i] || []).map(v => norm(String(v ?? '')))
    if (row.some(v => /名称|会社名|納入先|得意先/.test(v))) {
      row.forEach((col, idx) => {
        if (/コード|CD|ID/.test(col)) codeCol = idx
        if (/名称|会社名|納入先|得意先/.test(col)) nameCol = idx
        if (/住所|アドレス/i.test(col)) addrCol = idx
        if (/TEL|電話/i.test(col)) telCol = idx
        if (/FAX/i.test(col)) faxCol = idx
      })
      rows.splice(0, i + 1) // bỏ header
      break
    }
  }

  for (const row of rows) {
    const name = norm(String(row[nameCol] ?? ''))
    if (!isValidName(name)) continue
    companies.push({
      company_name: name,
      company_code: codeCol != null ? norm(String(row[codeCol] ?? '')) : null,
      tel: telCol != null ? norm(String(row[telCol] ?? '')) : null,
      fax: faxCol != null ? norm(String(row[faxCol] ?? '')) : null,
      address: addrCol != null ? norm(String(row[addrCol] ?? '')) : null,
      company_type: ['CUSTOMER'],
      _source: context,
    })
  }
  return companies
}

/** Parse sheet 指示書作成シート → meta đơn hàng */
function parseShiji(sheet, filename) {
  return {
    mold_code:     findByLabel(sheet, /専用抜き型|金型No\.?|型番号|型No/),
    product_code:  findByLabel(sheet, /品\s*番|製品番号|製品コード/),
    product_name:  findByLabel(sheet, /品\s*名|製品名/),
    order_company: findByLabel(sheet, /得意先|発注元|注文者|お客様名/),
    quantity:      findByLabel(sheet, /数\s*量|ロット数/),
    delivery_date: findByLabel(sheet, /納\s*期|出荷日/),
    _file: filename,
  }
}

/** Đọc 1 file Excel */
function parseFile(filePath, customerHint) {
  const filename = path.basename(filePath)
  const result = { filePath, filename, customerHint, companies: [], orderMeta: null, sheets: [], error: null, skipped: false }
  let wb
  try { wb = XLSX.readFile(filePath, { cellDates: true }) }
  catch (e) { result.error = e.message; return result }

  result.sheets = wb.SheetNames

  // Sheet chứa dữ liệu KH (ưu tiên)
  const nyuusaki = wb.SheetNames.find(s => /納入先一覧表|得意先一覧/.test(s))
  if (nyuusaki) result.companies = parseNyuusaki(wb.Sheets[nyuusaki], filename)

  // Sheet 指示書作成シート(成形) — đơn hàng khay nhựa
  const shiji = wb.SheetNames.find(s => /指示書.*成形|成形.*指示書/.test(s))
  if (shiji) result.orderMeta = parseShiji(wb.Sheets[shiji], filename)

  // Nếu là file nội bộ sản xuất (có sheet 一般/外注/直送 mà không có sheet KH) → bỏ qua
  const isInternalForm = wb.SheetNames.some(s => /^(一般|外注|直送|A伝|B伝)$/.test(s))
    && !nyuusaki && !shiji
  if (isInternalForm) {
    result.skipped = true
    result.error = '内部指示書 (nội bộ sản xuất — không có dữ liệu KH)'
    return result
  }

  // Fallback 1: sheet 指示書作成シート không phân biệt (成形/紙器)
  if (!result.orderMeta) {
    const shijiAny = wb.SheetNames.find(s => /指示書|作成シート/.test(s))
    if (shijiAny) result.orderMeta = parseShiji(wb.Sheets[shijiAny], filename)
  }

  // Fallback 2: tên thư mục / customerHint nếu hợp lệ
  if (result.companies.length === 0) {
    const hint = result.orderMeta?.order_company || customerHint
    if (hint && isValidName(hint) && !/^(注文書|指示書|template)/.test(hint)) {
      result.companies.push({ company_name: hint, company_type: ['CUSTOMER'], _source: filename })
    }
  }
  return result
}

/** Quét inbox, trả về tất cả file Excel (bỏ qua _done/) */
function getInboxFiles() {
  const files = []
  function walk(dir, customerHint = null) {
    if (!fs.existsSync(dir)) return
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '_done' || e.name.startsWith('.')) continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full, e.name) // tên thư mục = customer hint
      else if (/\.(xlsx|xls)$/i.test(e.name) && e.name !== 'README.md') {
        files.push({ path: full, customerHint: customerHint || e.name.replace(/\.(xlsx|xls)$/i, '') })
      }
    }
  }
  walk(INBOX_DIR)
  return files
}

// ─── Code sinh code công ty ───────────────────────────────────────────────────
const _usedCodes = new Set()
function generateCode(name, existingCodes) {
  const KNOWN = { 'SMK':'SMK','AMP':'AMP','HAE':'HAE','NLC':'NLC','YAE':'YAE',
    '三菱':'MTB','日立':'HTC','大石':'OSI','出光':'IDM','ソニー':'SNY' }
  const cleaned = name.replace(/[（(][株有合][）)]/g,'').replace(/[　\s]+/g,' ').trim()
  let prefix = cleaned.match(/[A-Z]{2,}/i)?.[0].slice(0,4).toUpperCase() ?? null
  if (!prefix) for (const [k,v] of Object.entries(KNOWN)) { if (cleaned.includes(k)) { prefix=v; break } }
  if (!prefix) prefix = cleaned.slice(0,3).replace(/[^A-Za-z0-9]/g,'X').toUpperCase().padEnd(2,'X')
  let seq=1, code
  do { code=`${prefix}-${String(seq).padStart(3,'0')}`; seq++ } while (existingCodes.has(code)||_usedCodes.has(code))
  _usedCodes.add(code)
  return code
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
const SEP = '═'.repeat(60)
const sep = '─'.repeat(60)

// ── LIST ──────────────────────────────────────────────────────────────────────
if (MODE === 'list') {
  const files = getInboxFiles()
  console.log(`\n📂 Inbox: ${INBOX_DIR}\n`)
  if (files.length === 0) {
    console.log('  (trống — hãy copy file Excel vào thư mục này)\n')
  } else {
    files.forEach((f, i) => {
      const stat = fs.statSync(f.path)
      const size = (stat.size / 1024).toFixed(1) + ' KB'
      console.log(`  [${i+1}] ${path.relative(INBOX_DIR, f.path).padEnd(50)} ${size}`)
    })
    console.log(`\n  Tổng: ${files.length} file\n`)
  }
  process.exit(0)
}

// ── CLEANUP ───────────────────────────────────────────────────────────────────
if (MODE === 'cleanup') {
  const files = getInboxFiles()
  if (files.length === 0) { console.log('\n📂 Inbox đã trống.\n'); process.exit(0) }
  fs.mkdirSync(DONE_DIR, { recursive: true })
  const stamp = new Date().toISOString().slice(0,10)
  for (const f of files) {
    const dest = path.join(DONE_DIR, `${stamp}_${path.basename(f.path)}`)
    fs.renameSync(f.path, dest)
    console.log(`  ✓ Moved: ${path.basename(f.path)}`)
  }
  console.log(`\n✅ ${files.length} file đã chuyển sang _done/\n`)
  process.exit(0)
}

// ── PREVIEW / APPLY ───────────────────────────────────────────────────────────
const inboxFiles = getInboxFiles()
if (inboxFiles.length === 0) {
  console.log(`\n⚠️  Inbox trống. Hãy copy file Excel vào:\n   ${INBOX_DIR}\n`)
  process.exit(0)
}

console.log(`\n${SEP}`)
console.log('  YSD Inbox Extractor')
console.log(`  Mode: ${MODE.toUpperCase()} | ${inboxFiles.length} file trong inbox`)
console.log(SEP)

// Parse tất cả file
const allCompaniesMap = new Map()
const allOrders = []
let parseErrors = 0

for (const f of inboxFiles) {
  process.stdout.write(`  📄 ${path.basename(f.path).slice(0,50).padEnd(52)}`)
  const r = parseFile(f.path, f.customerHint)
  if (r.error) { parseErrors++; console.log(`❌ ${r.error}`); continue }
  console.log(`✓  (${r.sheets.length} sheets, ${r.companies.length} KH)`)
  for (const c of r.companies) {
    if (!c.company_name) continue
    const key = c.company_name.toLowerCase().trim()
    if (!allCompaniesMap.has(key)) allCompaniesMap.set(key, c)
  }
  if (r.orderMeta?.product_code || r.orderMeta?.mold_code) allOrders.push(r.orderMeta)
}

const allCompanies = [...allCompaniesMap.values()]
console.log(`\n${sep}`)
console.log(`📊 Kết quả trích xuất:`)
console.log(`   Công ty / điểm giao : ${allCompanies.length}`)
console.log(`   Đơn hàng có metadata: ${allOrders.length}`)
console.log(`   File lỗi            : ${parseErrors}`)
console.log(sep)

// So sánh với DB
console.log('\n🔄 So sánh với DB...')
const dbData = await dbFetch('/companies?select=company_code,company_name&limit=3000')
const existingCodes = new Set(dbData.map(c => c.company_code).filter(Boolean))
const dbNameSet = new Set(dbData.map(c => (c.company_name||'').toLowerCase().trim()))

const newCompanies = allCompanies.filter(c => !dbNameSet.has(c.company_name.toLowerCase().trim()))
const alreadyInDB = allCompanies.filter(c => dbNameSet.has(c.company_name.toLowerCase().trim()))

console.log(`\n✅ Đã có trong DB  : ${alreadyInDB.length}`)
console.log(`🆕 Chưa có (sẽ thêm): ${newCompanies.length}\n`)

if (newCompanies.length > 0) {
  console.log('Danh sách sẽ THÊM MỚI:')
  newCompanies.forEach((c, i) => {
    const tel = c.tel ? ` | ☎ ${c.tel}` : ''
    console.log(`  [${i+1}] ${c.company_name}${tel}`)
  })
}

if (allOrders.length > 0) {
  console.log('\nMeta đơn hàng trích xuất:')
  allOrders.slice(0,5).forEach(o => {
    console.log(`  SP: ${o.product_code??'n/a'} | Khuôn: ${o.mold_code??'n/a'} | KH: ${o.order_company??'n/a'} | Qty: ${o.quantity??'n/a'}`)
  })
}

if (MODE === 'preview') {
  console.log(`\n${sep}`)
  console.log('⚠️  Preview mode — DB không thay đổi.')
  console.log('   Để import: chạy extract.bat và chọn [3] Apply')
  console.log(sep + '\n')
  process.exit(0)
}

// ── APPLY ─────────────────────────────────────────────────────────────────────
if (newCompanies.length === 0) {
  console.log('\n✅ Không có gì mới để import.\n')
  process.exit(0)
}

console.log(`\n${SEP}`)
console.log(`🚀 Đang import ${newCompanies.length} công ty vào DB...`)
console.log(SEP)

let inserted = 0, errors = 0
for (const c of newCompanies) {
  const code = generateCode(c.company_name, existingCodes)
  existingCodes.add(code)
  const body = JSON.stringify({
    company_code: code,
    company_name: c.company_name,
    company_type: c.company_type || ['CUSTOMER'],
    tel: c.tel || null,
    fax: c.fax || null,
    address: c.address || null,
    is_active: true,
    notes: `[INBOX] ${c._source} | ${new Date().toISOString().slice(0,10)}`,
  })
  const res = await dbFetch('/companies', { method: 'POST', body })
  if (!Array.isArray(res) || res[0]?.error) {
    errors++
    console.log(`  ❌ [${code}] ${c.company_name} — ${res?.message || 'lỗi'}`)
  } else {
    inserted++
    console.log(`  ✅ [${code}] ${c.company_name}`)
  }
}

console.log(`\n${SEP}`)
console.log(`✅ Import hoàn thành: ${inserted} thêm mới | ${errors} lỗi`)
console.log(SEP + '\n')

// Ghi log
const logPath = path.join(__dirname, 'inbox', `_import_log_${new Date().toISOString().slice(0,10)}.txt`)
const logContent = [
  `Import log — ${new Date().toLocaleString('ja-JP')}`,
  `Files: ${inboxFiles.map(f => path.basename(f.path)).join(', ')}`,
  `Đã import: ${inserted} | Lỗi: ${errors}`,
  '',
  'Chi tiết:',
  ...newCompanies.slice(0, inserted).map(c => `  + ${c.company_name}`)
].join('\n')
fs.writeFileSync(logPath, logContent, 'utf8')
console.log(`📋 Log đã ghi: ${logPath}\n`)
