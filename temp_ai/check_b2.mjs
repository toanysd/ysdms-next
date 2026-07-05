// temp_ai/check_b2.mjs — Đọc key từ .env.local đúng cách
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env.local')
const envRaw = readFileSync(envPath, 'utf8')

// Parse multi-line values (values có thể wrap xuống dòng tiếp theo)
const lines = envRaw.replace(/\r\n/g, '\n').split('\n')
const env = {}
let currentKey = null
for (const line of lines) {
  if (line.match(/^[A-Z_]+=.*/)) {
    const idx = line.indexOf('=')
    currentKey = line.slice(0, idx)
    env[currentKey] = line.slice(idx + 1)
  } else if (currentKey && line.trim() && !line.startsWith('#')) {
    env[currentKey] += line.trim() // append wrapped line
  }
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()

console.log(`URL: ${SUPABASE_URL}`)
console.log(`Key length: ${SERVICE_KEY?.length}`)

async function query(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  return res
}

// Dùng Supabase REST API trực tiếp để kiểm tra cột
async function checkColumn(table, column) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${column}&limit=1`
  const res = await fetch(url, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    }
  })
  const data = await res.json()
  return { status: res.status, data }
}

async function main() {
  console.log('\n=== Kiểm tra parent_company_id trên companies ===')
  const r1 = await checkColumn('companies', 'company_id,company_name,parent_company_id')
  if (r1.status === 200) {
    console.log('✅ parent_company_id TỒN TẠI — Migration 069+070 OK (không duplicate error)')
    console.log('   Sample:', JSON.stringify(r1.data).slice(0, 200))
  } else {
    console.log('❌ Status:', r1.status, JSON.stringify(r1.data))
  }

  console.log('\n=== Kiểm tra contact_person trên delivery_sites ===')
  const r2 = await checkColumn('delivery_sites', 'site_id,site_name,contact_person,contact_email')
  if (r2.status === 200) {
    console.log('✅ contact_person TỒN TẠI — Migration 070 OK')
    console.log(`   Count: ${r2.data.length} rows`)
  } else {
    console.log('❌ Status:', r2.status, JSON.stringify(r2.data).slice(0, 200))
  }

  // Kiểm tra count companies
  console.log('\n=== Tổng số companies ===')
  const r3 = await fetch(`${SUPABASE_URL}/rest/v1/companies?select=*&limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'count=exact',
    }
  })
  const countHeader = r3.headers.get('content-range')
  console.log(`   Content-Range: ${countHeader}`)
  console.log(`   → Tổng: ${countHeader?.split('/')[1] ?? 'N/A'} records`)
}

main().catch(console.error)
