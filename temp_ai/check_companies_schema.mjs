// temp_ai/check_companies_schema.mjs
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const lines = readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
  .replace(/\r\n/g, '\n').split('\n')
const env = {}
let cur = null
for (const l of lines) {
  if (/^[A-Z_]+=/.test(l)) { const i = l.indexOf('='); cur = l.slice(0,i); env[cur] = l.slice(i+1) }
  else if (cur && l.trim()) env[cur] += l.trim()
}
const URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()

const res = await fetch(`${URL}/rest/v1/companies?select=*&limit=1`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
})
const [row] = await res.json()
if (row) {
  console.log('=== Cột của bảng companies ===')
  Object.keys(row).forEach(k => console.log(`  ${k}: ${JSON.stringify(row[k])?.slice(0,60)}`))
} else {
  console.log('Empty or error:', await res.text())
}
