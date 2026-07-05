/**
 * POST /api/admin/ingest/scan
 * Quét thư mục server, trả về preview danh sách file mới nhất theo SP
 * và danh sách công ty sẽ được import.
 * 
 * Body: { serverRoot?: string }
 * Response: { customers, groups, newCompanies, existingCompanies }
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

const SERVER_ROOT = process.env.YSD_SERVER_ROOT || '\\\\SERVER\\ysd-folder'

// ── Cấu hình thư mục 注文書 ───────────────────────────────────────────────
const CUSTOMER_FOLDERS: Record<string, { customer: string | null; type: 'dedicated' | 'multi' }> = {
  '新SMK注文書': { customer: 'SMK', type: 'dedicated' },
  '新AMP注文書': { customer: 'AMP', type: 'dedicated' },
  '新HAE注文書': { customer: 'HAE', type: 'dedicated' },
  '新NLC注文書': { customer: 'NLC', type: 'dedicated' },
  '新YAE注文書': { customer: 'YAE', type: 'dedicated' },
  '新一般注文書': { customer: null, type: 'multi' },
}

const SKIP_FOLDER_REGEX = /廃棄|バックアップ|template|金型検定|金型棚卸|化学物質|生産条件|納品書改定|不具合|写真|証明書|※|預かり証|保管料/
const DATE_REGEX = /[(\（](\d{6,8})[)\）]/
const PRODUCT_CODE_REGEX = /^([A-Z]{2,5}[\-－][0-9]{2,4})/

function safeReadDir(dir: string) {
  try { return fs.readdirSync(dir, { withFileTypes: true }) } catch { return [] }
}

function getFileMeta(filePath: string, filename: string) {
  const dateMatch = filename.match(DATE_REGEX)
  const dateStr = dateMatch ? (dateMatch[1].length === 6 ? '20' + dateMatch[1] : dateMatch[1]) : null
  let mtime: Date | null = null
  try { mtime = fs.statSync(filePath).mtime } catch { /* skip */ }
  return { dateStr, mtime, sortKey: dateStr || mtime?.toISOString().slice(0,10).replace(/-/g,'') || '0' }
}

function scanDedicatedFolder(folderPath: string, customerName: string) {
  const groups: any[] = []
  for (const entry of safeReadDir(folderPath)) {
    if (!entry.isDirectory() || SKIP_FOLDER_REGEX.test(entry.name)) continue
    const productPath = path.join(folderPath, entry.name)
    const productCode = entry.name.match(PRODUCT_CODE_REGEX)?.[1] ?? entry.name.slice(0, 20)
    const files = safeReadDir(productPath)
      .filter(e => e.isFile() && /\.(xlsx|xls)$/i.test(e.name))
      .map(e => ({ ...getFileMeta(path.join(productPath, e.name), e.name), path: path.join(productPath, e.name), name: e.name }))
      .sort((a, b) => b.sortKey > a.sortKey ? 1 : -1)
    if (!files.length) continue
    groups.push({ customer: customerName, productCode, latestFile: files[0].path, latestDate: files[0].sortKey, versions: files.length })
  }
  return groups
}

function scanMultiCustomerFolder(folderPath: string) {
  const groups: any[] = []
  for (const l1 of safeReadDir(folderPath)) {
    if (!l1.isDirectory() || SKIP_FOLDER_REGEX.test(l1.name)) continue
    const l1Path = path.join(folderPath, l1.name)
    for (const l2 of safeReadDir(l1Path)) {
      if (!l2.isDirectory() || SKIP_FOLDER_REGEX.test(l2.name)) continue
      const l2Path = path.join(l1Path, l2.name)
      if (PRODUCT_CODE_REGEX.test(l2.name)) {
        // l1 = Customer, l2 = Product
        const files = safeReadDir(l2Path)
          .filter(e => e.isFile() && /\.(xlsx|xls)$/i.test(e.name))
          .map(e => ({ ...getFileMeta(path.join(l2Path, e.name), e.name), path: path.join(l2Path, e.name) }))
          .sort((a, b) => b.sortKey > a.sortKey ? 1 : -1)
        if (!files.length) continue
        groups.push({ customer: l1.name, productCode: l2.name.match(PRODUCT_CODE_REGEX)?.[1] ?? l2.name.slice(0,20), latestFile: files[0].path, latestDate: files[0].sortKey, versions: files.length })
      } else {
        // l1 = あ行, l2 = Customer
        for (const l3 of safeReadDir(l2Path)) {
          if (!l3.isDirectory() || SKIP_FOLDER_REGEX.test(l3.name)) continue
          const l3Path = path.join(l2Path, l3.name)
          const files = safeReadDir(l3Path)
            .filter(e => e.isFile() && /\.(xlsx|xls)$/i.test(e.name))
            .map(e => ({ ...getFileMeta(path.join(l3Path, e.name), e.name), path: path.join(l3Path, e.name) }))
            .sort((a, b) => b.sortKey > a.sortKey ? 1 : -1)
          if (!files.length) continue
          groups.push({ customer: l2.name, productCode: l3.name.match(PRODUCT_CODE_REGEX)?.[1] ?? l3.name.slice(0,20), latestFile: files[0].path, latestDate: files[0].sortKey, versions: files.length })
        }
      }
    }
  }
  return groups
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const root = body.serverRoot || SERVER_ROOT

    if (!fs.existsSync(root)) {
      return NextResponse.json({ error: `Không truy cập được: ${root}` }, { status: 400 })
    }

    // Quét thư mục
    const allGroups: any[] = []
    for (const [folderName, config] of Object.entries(CUSTOMER_FOLDERS)) {
      const folderPath = path.join(root, folderName)
      if (!fs.existsSync(folderPath)) continue
      if (config.type === 'dedicated' && config.customer) {
        allGroups.push(...scanDedicatedFolder(folderPath, config.customer))
      } else {
        allGroups.push(...scanMultiCustomerFolder(folderPath))
      }
    }

    const customers = [...new Set(allGroups.map(g => g.customer))].sort()

    // So sánh với DB
    const supabase = await createClient()
    const { data: dbCompanies } = await supabase
      .from('companies')
      .select('company_code, company_name')
    const dbNameSet = new Set((dbCompanies || []).map((c: any) => (c.company_name || '').toLowerCase().trim()))

    const newCustomers = customers.filter(c => !dbNameSet.has(c.toLowerCase().trim()))
    const existingCustomers = customers.filter(c => dbNameSet.has(c.toLowerCase().trim()))

    return NextResponse.json({
      scannedAt: new Date().toISOString(),
      serverRoot: root,
      summary: {
        totalGroups: allGroups.length,
        totalCustomers: customers.length,
        newCustomers: newCustomers.length,
        existingCustomers: existingCustomers.length,
      },
      customers,
      newCustomers,
      existingCustomers,
      groups: allGroups,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
