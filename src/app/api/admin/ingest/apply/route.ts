/**
 * POST /api/admin/ingest/apply
 * Nhận danh sách customers từ kết quả scan, upsert vào bảng companies.
 * 
 * Body: { customers: string[], sourceFolder?: string }
 * Response: { inserted, skipped, errors }
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const usedCodes = new Set<string>()

function generateCode(name: string, existingCodes: Set<string>): string {
  const cleaned = name
    .replace(/[（(]株[）)]/g, '').replace(/[（(]有[）)]/g, '').replace(/[（(]合[）)]/g, '')
    .replace(/[　\s]+/g, ' ').trim()

  const KNOWN: Record<string, string> = {
    'SMK':'SMK', 'AMP':'AMP', 'HAE':'HAE', 'NLC':'NLC', 'YAE':'YAE',
    '三菱':'MTB', '日立':'HTC', '東芝':'TSB', '富士':'FJT',
    'ソニー':'SNY', 'パナソニック':'PAN', '大石':'OSI', '出光':'IDM',
  }

  let prefix: string | null = null
  const latinMatch = cleaned.match(/[A-Z]{2,}/i)
  if (latinMatch) prefix = latinMatch[0].slice(0, 4).toUpperCase()

  if (!prefix) {
    for (const [k, v] of Object.entries(KNOWN)) {
      if (cleaned.includes(k)) { prefix = v; break }
    }
  }
  if (!prefix) {
    prefix = cleaned.slice(0, 3).replace(/[^A-Za-z0-9]/g, 'X').toUpperCase()
    if (prefix.length < 2) prefix = 'CO' + prefix
  }

  let seq = 1, code: string
  do { code = `${prefix}-${String(seq).padStart(3, '0')}`; seq++ }
  while (existingCodes.has(code) || usedCodes.has(code))
  usedCodes.add(code)
  return code
}

export async function POST(request: Request) {
  try {
    const { customers, sourceFolder = 'SCAN_AUTO' } = await request.json()
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ error: 'Thiếu danh sách customers' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: existing } = await supabase.from('companies').select('company_code, company_name')
    const existingCodes = new Set((existing || []).map((c: any) => c.company_code).filter(Boolean))
    const existingNames = new Set((existing || []).map((c: any) => (c.company_name || '').toLowerCase().trim()))

    let inserted = 0, skipped = 0, errors = 0
    const insertedList: string[] = []

    for (const name of customers) {
      if (!name || name.length < 2) { skipped++; continue }
      const nameKey = name.toLowerCase().trim()
      if (existingNames.has(nameKey)) { skipped++; continue }

      const code = generateCode(name, existingCodes)
      existingCodes.add(code)
      existingNames.add(nameKey)

      const { error } = await supabase.from('companies').insert({
        company_code: code,
        company_name: name,
        company_type: ['CUSTOMER'],
        is_active: true,
        notes: `[AUTO_IMPORT] Nguồn: ${sourceFolder} | ${new Date().toISOString().slice(0,10)}`,
      })

      if (error) errors++
      else { inserted++; insertedList.push(`[${code}] ${name}`) }
    }

    return NextResponse.json({
      success: true,
      summary: { total: customers.length, inserted, skipped, errors },
      insertedList,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
