/**
 * BƯỚC 3: DB Cleanup Analyzer + Upsert Preview
 * So sánh danh sách công ty từ Bước 2 với DB hiện tại:
 *   - Nhóm các bản ghi "rác" (company_code = tên file) theo company_name giống nhau
 *   - Đề xuất merge (chọn master + mark rác là inactive)
 *   - Preview danh sách công ty MỚI từ file Excel (chưa có trong DB)
 *
 * Cách dùng:
 *   node temp_ai/03_cleanup_companies.mjs          # preview only (không sửa DB)
 *   node temp_ai/03_cleanup_companies.mjs --apply  # áp dụng thật vào DB
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APPLY = process.argv.includes('--apply')

// Đọc .env.local để lấy Supabase credentials
const envLines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
  .replace(/\r\n/g, '\n').split('\n')
const env = {}
let cur = null
for (const l of envLines) {
  if (/^[A-Z_]+=/.test(l)) { const i = l.indexOf('='); cur = l.slice(0, i); env[cur] = l.slice(i + 1) }
  else if (cur && l.trim()) env[cur] += l.trim()
}
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const SUPABASE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }

async function dbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, { headers, ...opts })
  return res.json()
}

// ─── LOAD DATA ───────────────────────────────────────────────────────────────

console.log('🔄 Đang tải dữ liệu từ DB...')
const dbCompanies = await dbFetch('/companies?select=company_id,company_code,company_name,company_type,is_active,notes&limit=2000')

console.log(`📦 DB hiện có: ${dbCompanies.length} records\n`)

// ─── PHASE A: TÌM RÁC TRONG DB ────────────────────────────────────────────

const GARBAGE_CODE_REGEX = /\.(xlsx?|pdf)$|[\（\(]\d{6,8}[\)\）]|^指示書|^注文書/i

const garbageInDB = dbCompanies.filter(c => GARBAGE_CODE_REGEX.test(c.company_code || ''))
const cleanInDB = dbCompanies.filter(c => !GARBAGE_CODE_REGEX.test(c.company_code || ''))

console.log(`🗑️  Records rác trong DB   : ${garbageInDB.length}`)
console.log(`✅  Records sạch trong DB  : ${cleanInDB.length}\n`)

// Gom rác theo company_name
const garbageGrouped = new Map()
for (const rec of garbageInDB) {
  const nameKey = (rec.company_name || '').toLowerCase().trim()
  if (!garbageGrouped.has(nameKey)) garbageGrouped.set(nameKey, { name: rec.company_name, records: [] })
  garbageGrouped.get(nameKey).records.push(rec)
}

// Tìm master cho mỗi nhóm rác (ưu tiên record có code ngắn, sạch)
const mergeProposals = []
for (const [nameKey, group] of garbageGrouped) {
  // Tìm trong cleanInDB xem có record cùng tên không
  const cleanMatch = cleanInDB.find(c => (c.company_name || '').toLowerCase().trim() === nameKey)
  const masterRecord = cleanMatch || group.records.reduce((best, r) =>
    (r.company_code?.length ?? 999) < (best.company_code?.length ?? 999) ? r : best
  )

  mergeProposals.push({
    company_name: group.name,
    master: masterRecord,
    garbage: group.records.filter(r => r.company_id !== masterRecord.company_id),
    hasCleanMaster: !!cleanMatch,
  })
}

console.log('═══════════════════════════════════════════════════════')
console.log(`📋 Đề xuất gom nhóm rác: ${mergeProposals.length} tên công ty`)
console.log('═══════════════════════════════════════════════════════')

mergeProposals.slice(0, 15).forEach(p => {
  const status = p.hasCleanMaster ? '✅ Master sạch' : '⚠️ Tự chọn ngắn nhất'
  console.log(`\n  🏢 "${p.company_name}" [${status}]`)
  console.log(`     Master : [${p.master.company_code}] id=${p.master.company_id.slice(0, 8)}...`)
  p.garbage.forEach(g => {
    console.log(`     → Rác  : [${g.company_code?.slice(0, 40)}] id=${g.company_id.slice(0, 8)}...`)
  })
})

if (mergeProposals.length > 15) console.log(`\n  ... và ${mergeProposals.length - 15} nhóm khác`)

// ─── PHASE B: CÔNG TY MỚI TỪ FILE EXCEL ─────────────────────────────────────

const parseResultPath = path.join(__dirname, '_parse_result.json')
let newFromFiles = []

if (fs.existsSync(parseResultPath)) {
  const parseResult = JSON.parse(fs.readFileSync(parseResultPath, 'utf8'))
  const fromExcel = parseResult.companies || []

  const dbNameSet = new Set(dbCompanies.map(c => (c.company_name || '').toLowerCase().trim()))

  newFromFiles = fromExcel.filter(c => {
    const key = (c.company_name || '').toLowerCase().trim()
    return key.length > 1 && !dbNameSet.has(key)
  })

  console.log(`\n\n🆕 Công ty mới từ file Excel (chưa có trong DB): ${newFromFiles.length}`)
  newFromFiles.slice(0, 20).forEach(c => {
    const tel = c.tel ? ` | ☎ ${c.tel}` : ''
    console.log(`   ✦ "${c.company_name}"${tel}`)
  })
  if (newFromFiles.length > 20) console.log(`   ... và ${newFromFiles.length - 20} công ty khác`)
} else {
  console.log('\n⚠️  Chưa có _parse_result.json. Chạy Bước 2 để phân tích file Excel.')
}

// ─── APPLY (nếu có --apply) ───────────────────────────────────────────────────

if (APPLY) {
  console.log('\n\n🚀 Đang áp dụng thay đổi vào DB...\n')
  let mergedCount = 0, insertedCount = 0, errorCount = 0

  // Phase A: Đánh dấu rác là inactive, ghi note
  for (const proposal of mergeProposals) {
    for (const garbage of proposal.garbage) {
      const updateRes = await dbFetch(`/companies?company_id=eq.${garbage.company_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_active: false,
          notes: `[MERGED] Mã rác: ${garbage.company_code} → Master: ${proposal.master.company_id}`,
        }),
      })
      if (!updateRes.error) mergedCount++
      else errorCount++
    }
  }

  // Phase B: Insert công ty mới
  for (const c of newFromFiles.slice(0, 100)) { // giới hạn 100/lần
    // Sinh company_code tự động: lấy ký tự đầu + sequence
    const prefix = (c.company_name || 'UNK').slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
    const code = `${prefix}-NEW`

    const insertRes = await dbFetch('/companies', {
      method: 'POST',
      body: JSON.stringify({
        company_code: code,
        company_name: c.company_name,
        company_type: c.company_type || ['CUSTOMER'],
        tel: c.tel || null,
        fax: c.fax || null,
        address: c.address || null,
        is_active: true,
        notes: `[AUTO] Trích xuất từ folder: ${c.source_folder}`,
      }),
    })
    if (!Array.isArray(insertRes) || insertRes[0]?.error) errorCount++
    else insertedCount++
  }

  console.log('═══════════════════════════════════════════════════════')
  console.log(`✅ Đã merge  (inactive): ${mergedCount}`)
  console.log(`✅ Đã insert mới       : ${insertedCount}`)
  console.log(`❌ Lỗi                 : ${errorCount}`)
  console.log('═══════════════════════════════════════════════════════')
} else {
  console.log('\n\n─────────────────────────────────────────────────')
  console.log('⚠️  Preview mode - không thay đổi DB.')
  console.log('   Để áp dụng thật: node temp_ai/03_cleanup_companies.mjs --apply')
  console.log('─────────────────────────────────────────────────\n')

  // Ghi report
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      dbTotal: dbCompanies.length,
      garbageInDB: garbageInDB.length,
      cleanInDB: cleanInDB.length,
      mergeProposals: mergeProposals.length,
      newFromFiles: newFromFiles.length,
    },
    mergeProposals: mergeProposals.map(p => ({
      company_name: p.company_name,
      master_id: p.master.company_id,
      master_code: p.master.company_code,
      garbage_ids: p.garbage.map(g => ({ id: g.company_id, code: g.company_code })),
      hasCleanMaster: p.hasCleanMaster,
    })),
    newCompanies: newFromFiles,
  }

  const reportPath = path.join(__dirname, '_cleanup_report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📊 Report đã ghi: ${reportPath}`)
  console.log('→ Xem xét report rồi chạy với --apply nếu đồng ý\n')
}
