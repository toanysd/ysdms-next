/**
 * BƯỚC 1 (FINAL): Folder Scanner — YSD Server Structure
 *
 * Cấu trúc thực tế \\SERVER\ysd-folder:
 *   新SMK注文書/         ← Khách hàng: SMK (1 thư mục = 1 KH lớn)
 *     SMK-001 (ProductCode)/
 *       file.xlsx          ← Đơn hàng
 *   新AMP注文書/          ← Khách hàng: AMP
 *   新一般注文書/          ← Nhiều KH nhỏ (sắp xếp theo abc あいうえお)
 *     あ行/
 *       社名A/
 *         ProductCode/
 *           file.xlsx
 *
 * Chiến lược: Quét mỗi thư mục 注文書, detect loại (1-customer vs multi-customer),
 * gom nhóm file theo Product Code, lấy file mới nhất.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── CẤU HÌNH ────────────────────────────────────────────────────────────────
const SERVER_ROOT = '\\\\SERVER\\ysd-folder'

// Mapping thư mục → tên khách hàng chính
const CUSTOMER_FOLDER_MAP = {
  '新SMK注文書':  { customer: 'SMK', type: 'dedicated' },    // 1 folder = 1 KH
  '新AMP注文書':  { customer: 'AMP', type: 'dedicated' },
  '新HAE注文書':  { customer: 'HAE', type: 'dedicated' },
  '新NLC注文書':  { customer: 'NLC', type: 'dedicated' },
  '新YAE注文書':  { customer: 'YAE', type: 'dedicated' },
  '新一般注文書':  { customer: null,   type: 'multi' },        // nhiều KH, sắp xếp abc
  'ＹＳＤ注文書':  { customer: 'YSD',  type: 'dedicated' },
}

// Regex nhận diện tên thư mục product code (có mã SP kiểu YSD)
const PRODUCT_CODE_REGEX = /^([A-Z]{2,5}[\-－][0-9]{2,4})/

// Regex lấy ngày từ tên file
const DATE_REGEX = /[(\（](\d{6,8})[)\）]/

// Regex loại bỏ thư mục không phải đơn hàng
const SKIP_FOLDER_REGEX = /廃棄|バックアップ|template|金型検定|金型棚卸|化学物質|生産条件|納品書改定|不具合|茶色材料|写真|証明書|※|預かり証|保管料/

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function safeReadDir(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }) }
  catch { return [] }
}

function getDateFromFilename(filename) {
  const m = filename.match(DATE_REGEX)
  if (!m) return null
  const d = m[1]
  return d.length === 6 ? '20' + d : d
}

function getMtime(p) {
  try { return fs.statSync(p).mtime } catch { return null }
}

// ─── SCANNER ─────────────────────────────────────────────────────────────────

/**
 * Quét thư mục dành riêng 1 KH (新SMK注文書, 新AMP注文書...)
 * Cấu trúc: [CustomerFolder]/[ProductFolder]/[Files]
 */
function scanDedicatedFolder(folderPath, customerName) {
  const results = []
  const productDirs = safeReadDir(folderPath)

  for (const pDir of productDirs) {
    if (!pDir.isDirectory()) continue
    if (SKIP_FOLDER_REGEX.test(pDir.name)) continue

    const productPath = path.join(folderPath, pDir.name)
    // Lấy mã SP từ tên folder (VD: "SMK-001 (ProductCode)")
    const productCodeMatch = pDir.name.match(PRODUCT_CODE_REGEX)
    const productCode = productCodeMatch ? productCodeMatch[1] : pDir.name.slice(0, 20)

    // Lấy tất cả file Excel trong thư mục này (đệ quy 1 cấp)
    const files = []
    const entries = safeReadDir(productPath)
    for (const e of entries) {
      if (e.isFile() && /\.(xlsx|xls)$/i.test(e.name)) {
        const fp = path.join(productPath, e.name)
        const dateStr = getDateFromFilename(e.name)
        const mtime = getMtime(fp)
        files.push({ path: fp, name: e.name, date: dateStr, mtime, sortKey: dateStr || mtime?.toISOString().slice(0,10).replace(/-/g,'') || '0' })
      }
    }

    if (files.length === 0) continue

    // Lấy file mới nhất
    files.sort((a, b) => b.sortKey > a.sortKey ? 1 : -1)
    const latest = files[0]

    results.push({
      customer: customerName,
      productFolder: pDir.name,
      productCode,
      latestFilePath: latest.path,
      latestFileName: latest.name,
      latestDate: latest.date || latest.mtime?.toISOString().slice(0,10),
      totalVersions: files.length,
      allFiles: files.map(f => f.path),
    })
  }
  return results
}

/**
 * Quét thư mục đa KH (新一般注文書)
 * Cấu trúc: [Root]/[あいう行 hoặc CustomerName]/[CustomerName]/[ProductFolder]/[Files]
 */
function scanMultiCustomerFolder(folderPath) {
  const results = []
  const level1 = safeReadDir(folderPath)

  for (const l1 of level1) {
    if (!l1.isDirectory()) continue
    if (SKIP_FOLDER_REGEX.test(l1.name)) continue

    const l1Path = path.join(folderPath, l1.name)
    // Kiểm tra cấp 2: là thư mục khách hàng hay thư mục abc
    const l2 = safeReadDir(l1Path)

    for (const l2e of l2) {
      if (!l2e.isDirectory()) continue
      if (SKIP_FOLDER_REGEX.test(l2e.name)) continue

      const l2Path = path.join(l1Path, l2e.name)
      // l2e.name có thể là: tên KH (nếu l1 là あ行) hoặc ProductCode
      const isProductCode = PRODUCT_CODE_REGEX.test(l2e.name)

      if (isProductCode) {
        // l1 = CustomerName, l2 = ProductCode
        const customerName = l1.name
        const files = safeReadDir(l2Path).filter(e => e.isFile() && /\.(xlsx|xls)$/i.test(e.name))
        if (!files.length) continue
        const filesWithDate = files.map(e => {
          const fp = path.join(l2Path, e.name)
          const d = getDateFromFilename(e.name)
          const mt = getMtime(fp)
          return { path: fp, name: e.name, sortKey: d || mt?.toISOString().slice(0,10).replace(/-/g,'') || '0' }
        }).sort((a,b) => b.sortKey > a.sortKey ? 1 : -1)

        results.push({
          customer: customerName,
          productFolder: l2e.name,
          productCode: l2e.name.match(PRODUCT_CODE_REGEX)?.[1] || l2e.name.slice(0,20),
          latestFilePath: filesWithDate[0].path,
          latestFileName: filesWithDate[0].name,
          latestDate: filesWithDate[0].sortKey,
          totalVersions: files.length,
        })
      } else {
        // l1 = あ行, l2 = CustomerName → đệ quy thêm 1 cấp
        const customerName = l2e.name
        const l3 = safeReadDir(l2Path)
        for (const l3e of l3) {
          if (!l3e.isDirectory()) continue
          const l3Path = path.join(l2Path, l3e.name)
          const files = safeReadDir(l3Path).filter(e => e.isFile() && /\.(xlsx|xls)$/i.test(e.name))
          if (!files.length) continue
          const filesWithDate = files.map(e => {
            const fp = path.join(l3Path, e.name)
            const d = getDateFromFilename(e.name)
            const mt = getMtime(fp)
            return { path: fp, name: e.name, sortKey: d || mt?.toISOString().slice(0,10).replace(/-/g,'') || '0' }
          }).sort((a,b) => b.sortKey > a.sortKey ? 1 : -1)

          results.push({
            customer: customerName,
            productFolder: l3e.name,
            productCode: l3e.name.match(PRODUCT_CODE_REGEX)?.[1] || l3e.name.slice(0,20),
            latestFilePath: filesWithDate[0].path,
            latestFileName: filesWithDate[0].name,
            latestDate: filesWithDate[0].sortKey,
            totalVersions: files.length,
          })
        }
      }
    }
  }
  return results
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
console.log(`\n🔍 YSD Server Scanner\n   Root: ${SERVER_ROOT}\n`)

const allGroups = []
const customerSet = new Set()

for (const [folderName, config] of Object.entries(CUSTOMER_FOLDER_MAP)) {
  const folderPath = path.join(SERVER_ROOT, folderName)
  if (!fs.existsSync(folderPath)) {
    console.log(`  ⚠️  Không tìm thấy: ${folderName}`)
    continue
  }

  console.log(`  📁 Đang quét: ${folderName}...`)
  let groups = []

  if (config.type === 'dedicated') {
    groups = scanDedicatedFolder(folderPath, config.customer)
    customerSet.add(config.customer)
  } else {
    groups = scanMultiCustomerFolder(folderPath)
    groups.forEach(g => customerSet.add(g.customer))
  }

  allGroups.push(...groups)
  console.log(`     → ${groups.length} nhóm sản phẩm, ${new Set(groups.map(g => g.customer)).size} khách hàng`)
}

console.log('\n═══════════════════════════════════════════════════════')
console.log(`📊 Tổng nhóm sản phẩm  : ${allGroups.length}`)
console.log(`🏢 Tổng khách hàng     : ${customerSet.size}`)
console.log('═══════════════════════════════════════════════════════\n')

console.log('🏢 Danh sách Khách hàng tìm thấy:')
;[...customerSet].sort().forEach(c => console.log(`   • ${c}`))

console.log('\n📄 Mẫu 20 nhóm sản phẩm (file mới nhất):')
allGroups.slice(0, 20).forEach(g => {
  console.log(`  [${(g.customer||'?').padEnd(15)}] ${g.productCode.padEnd(20)} → ${g.latestDate||'?'} (${g.totalVersions}v) | ${g.latestFileName.slice(0,40)}`)
})

// Ghi kết quả
const outputPath = path.join(__dirname, '_scan_result.json')
fs.writeFileSync(outputPath, JSON.stringify({
  scannedAt: new Date().toISOString(),
  serverRoot: SERVER_ROOT,
  summary: { groups: allGroups.length, customers: customerSet.size },
  customers: [...customerSet].sort(),
  latestFiles: allGroups,
}, null, 2))

console.log(`\n✅ Kết quả đã ghi: ${outputPath}`)
console.log('→ Tiếp theo: node temp_ai/02_excel_parser.mjs\n')
