/**
 * BƯỚC 2: Excel Parser
 * Đọc các file Excel từ kết quả Bước 1, trích xuất dữ liệu:
 *   - Sheet "納入先一覧表" → Danh sách khách hàng / điểm giao
 *   - Sheet "指示書作成シート(成形)" → Mã khuôn, mã SP, thông tin đơn hàng
 *
 * Cách dùng:
 *   node temp_ai/02_excel_parser.mjs                    # dùng kết quả từ 01_folder_scanner.mjs
 *   node temp_ai/02_excel_parser.mjs "path/to/file.xlsx" # parse 1 file cụ thể
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Chuẩn hoá text: loại bỏ khoảng trắng thừa, full-width → half-width */
function normalizeText(v) {
  if (v == null) return null
  return String(v)
    .trim()
    .replace(/[\u3000\u00a0]/g, ' ')        // full-width space → space
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c =>    // full-width alphanum → half
      String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, ' ')
    .trim()
}

/** Kiểm tra chuỗi có phải tên công ty hợp lệ không (không phải rác) */
function isValidCompanyName(name) {
  if (!name || name.length < 2 || name.length > 80) return false
  // Loại các giá trị rõ ràng không phải tên công ty
  const SKIP = /^(No\.|番号|コード|納入先|得意先|会社名|会社|名称|住所|電話|TEL|FAX|備考|担当|date|[\d\-\/\.]+)$/i
  return !SKIP.test(name.trim())
}

/** Tìm giá trị cell bằng regex trên toàn sheet (dùng cho 指示書) */
function findCellByLabel(sheet, labelRegex) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:Z100')
  for (let r = range.s.r; r <= Math.min(range.e.r, 60); r++) {
    for (let c = range.s.c; c <= Math.min(range.e.c, 20); c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })]
      if (cell && String(cell.v).match(labelRegex)) {
        // Thường giá trị nằm ở cell kề bên phải hoặc 2 cột bên phải
        for (const offset of [1, 2, 3]) {
          const valCell = sheet[XLSX.utils.encode_cell({ r, c: c + offset })]
          if (valCell && valCell.v != null) {
            return normalizeText(String(valCell.v))
          }
        }
      }
    }
  }
  return null
}

// ─── PARSER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Parse sheet 納入先一覧表 → Danh sách công ty
 * Sheet này thường là bảng: mỗi hàng = 1 khách hàng/điểm giao
 */
function parseNyuusakiSheet(sheet, customerFolder) {
  const companies = []
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false })
  if (!rows.length) return companies

  // Tìm header row (hàng chứa chữ "名称" hoặc "会社名" hoặc "納入先")
  let headerRow = -1
  let colMap = {}

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i].map(v => normalizeText(String(v ?? '')))
    const hasHeader = row.some(v => /名称|会社名|納入先|得意先/.test(v))
    if (hasHeader) {
      headerRow = i
      row.forEach((col, idx) => {
        if (/コード|CD|ID/.test(col)) colMap.code = idx
        if (/名称|会社名|納入先|得意先/.test(col)) colMap.name = idx
        if (/住所|アドレス|address/i.test(col)) colMap.address = idx
        if (/TEL|電話|phone/i.test(col)) colMap.tel = idx
        if (/FAX/i.test(col)) colMap.fax = idx
        if (/担当|contact/i.test(col)) colMap.contact = idx
      })
      break
    }
  }

  // Nếu không tìm thấy header rõ ràng, thử lấy tất cả tên từ cột đầu
  const startRow = headerRow >= 0 ? headerRow + 1 : 1
  const nameCol = colMap.name ?? 1 // default: cột thứ 2

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i]
    const rawName = normalizeText(String(row[nameCol] ?? ''))
    if (!isValidCompanyName(rawName)) continue

    companies.push({
      company_name: rawName,
      company_code: colMap.code != null ? normalizeText(String(row[colMap.code] ?? '')) : null,
      tel: colMap.tel != null ? normalizeText(String(row[colMap.tel] ?? '')) : null,
      fax: colMap.fax != null ? normalizeText(String(row[colMap.fax] ?? '')) : null,
      address: colMap.address != null ? normalizeText(String(row[colMap.address] ?? '')) : null,
      company_type: ['CUSTOMER'],
      source_folder: customerFolder,
      _raw_row: i,
    })
  }

  return companies
}

/**
 * Parse sheet 指示書作成シート(成形) → Master đơn hàng
 * Tìm thông tin: Mã khuôn, Mã SP, tên KH đặt hàng, số lượng, ngày giao
 */
function parseShijiSheetMeta(sheet, fileName) {
  return {
    // Mã khuôn: tìm "専用抜き型" hoặc "金型No" hoặc "型No"
    mold_code: findCellByLabel(sheet, /専用抜き型|金型No\.?|型番号|型No/),
    // Mã sản phẩm: tìm "品番" 
    product_code: findCellByLabel(sheet, /品\s*番|製品番号|製品コード/),
    // Tên sản phẩm: tìm "品名"
    product_name: findCellByLabel(sheet, /品\s*名|製品名/),
    // Khách hàng đặt hàng: tìm "得意先" hoặc "発注元" hoặc "会社名"
    order_company: findCellByLabel(sheet, /得意先|発注元|注文者|お客様名/),
    // Số lượng: tìm "数量"
    quantity: findCellByLabel(sheet, /数\s*量|ロット数/),
    // Ngày giao: tìm "納期"
    delivery_date: findCellByLabel(sheet, /納\s*期|出荷日|発送日/),
    // LOT No:
    lot_no: findCellByLabel(sheet, /LOT\s*No\.?|ロット番号/),
    _source_file: fileName,
  }
}

// ─── PARSE ONE FILE ──────────────────────────────────────────────────────────

function parseExcelFile(filePath, customerFolder) {
  const result = {
    filePath,
    customerFolder,
    companies: [],
    orderMeta: null,
    sheetsFound: [],
    error: null,
  }

  let workbook
  try {
    workbook = XLSX.readFile(filePath, { type: 'file', cellDates: true })
  } catch (e) {
    result.error = e.message
    return result
  }

  result.sheetsFound = workbook.SheetNames

  // Sheet 納入先一覧表
  const nyuusaki = workbook.SheetNames.find(s => /納入先一覧表|得意先一覧/.test(s))
  if (nyuusaki) {
    result.companies = parseNyuusakiSheet(workbook.Sheets[nyuusaki], customerFolder)
  }

  // Sheet 指示書作成シート(成形) hoặc tên tương tự
  const shiji = workbook.SheetNames.find(s => /指示書|作成シート|成形/.test(s))
  if (shiji) {
    result.orderMeta = parseShijiSheetMeta(workbook.Sheets[shiji], path.basename(filePath))
  }

  // Fallback: nếu không có sheet 納入先 nhưng có 指示書, lấy tên KH từ order_company
  if (result.companies.length === 0 && result.orderMeta?.order_company) {
    result.companies.push({
      company_name: result.orderMeta.order_company,
      company_type: ['CUSTOMER'],
      source_folder: customerFolder,
      _raw_row: 'from_shiji',
    })
  }

  // Luôn thêm tên thư mục gốc làm KH nếu chưa có
  if (result.companies.length === 0 && customerFolder && customerFolder !== '(root)') {
    result.companies.push({
      company_name: customerFolder,
      company_type: ['CUSTOMER'],
      source_folder: customerFolder,
      _raw_row: 'from_folder',
    })
  }

  return result
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const singleFile = process.argv[2]

let filesToParse = []

if (singleFile && singleFile.endsWith('.xls')) {
  // Parse 1 file cụ thể
  filesToParse.push({ latestFilePath: singleFile, customer: path.basename(path.dirname(singleFile)) })
} else {
  // Đọc từ kết quả Bước 1
  const scanResult = path.join(__dirname, '_scan_result.json')
  if (!fs.existsSync(scanResult)) {
    console.error('❌ Chưa có _scan_result.json. Chạy Bước 1 trước: node temp_ai/01_folder_scanner.mjs')
    process.exit(1)
  }
  const scan = JSON.parse(fs.readFileSync(scanResult, 'utf8'))
  // Giới hạn 50 file để test nhanh
  filesToParse = scan.latestFiles.slice(0, 50)
  console.log(`📂 Source: ${scan.rootPath}`)
  console.log(`📄 Parsing ${filesToParse.length} file (mới nhất theo từng SP)\n`)
}

const allCompanies = new Map() // company_name → info (dedup)
const orderMetas = []
let parsed = 0, errors = 0

for (const entry of filesToParse) {
  const r = parseExcelFile(entry.latestFilePath, entry.customer)
  parsed++

  if (r.error) { errors++; continue }

  for (const c of r.companies) {
    if (!c.company_name) continue
    const key = c.company_name.toLowerCase().replace(/\s+/g, '')
    if (!allCompanies.has(key) || (c.tel && !allCompanies.get(key).tel)) {
      allCompanies.set(key, c)
    }
  }

  if (r.orderMeta && (r.orderMeta.product_code || r.orderMeta.mold_code)) {
    orderMetas.push(r.orderMeta)
  }
}

console.log('═══════════════════════════════════════════════════════')
console.log(`✅ Đã parse   : ${parsed} file`)
console.log(`❌ Lỗi đọc   : ${errors} file`)
console.log(`🏢 Công ty   : ${allCompanies.size} (duy nhất)`)
console.log(`📋 Đơn hàng  : ${orderMetas.length} (có metadata)`)
console.log('═══════════════════════════════════════════════════════\n')

console.log('📋 Mẫu dữ liệu Công ty trích xuất:')
const companySample = [...allCompanies.values()].slice(0, 15)
companySample.forEach(c => {
  const tel = c.tel ? ` | ☎ ${c.tel}` : ''
  const code = c.company_code ? ` [${c.company_code}]` : ''
  console.log(`  ✦ ${c.company_name}${code}${tel}  (folder: ${c.source_folder})`)
})

console.log('\n📋 Mẫu dữ liệu Đơn hàng trích xuất:')
orderMetas.slice(0, 5).forEach(o => {
  console.log(`  ✦ SP: ${o.product_code ?? 'n/a'} | Khuôn: ${o.mold_code ?? 'n/a'} | KH: ${o.order_company ?? 'n/a'} | Qty: ${o.quantity ?? 'n/a'} | Giao: ${o.delivery_date ?? 'n/a'}`)
})

// Ghi output JSON để Bước 3 dùng
const output = {
  parsedAt: new Date().toISOString(),
  summary: { parsed, errors, companies: allCompanies.size, orders: orderMetas.length },
  companies: [...allCompanies.values()],
  orderMetas,
}
const outPath = path.join(__dirname, '_parse_result.json')
fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
console.log(`\n✅ Kết quả đã ghi: ${outPath}`)
console.log('→ Chạy Bước 3: node temp_ai/03_cleanup_companies.mjs để so sánh với DB\n')
