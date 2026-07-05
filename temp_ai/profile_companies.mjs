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

const res = await fetch(`${URL}/rest/v1/companies?select=company_code,company_name&limit=1000`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
})
const data = await res.json()

let garbageCount = 0
const garbageSamples = []

data.forEach(c => {
  const code = c.company_code || ''
  const name = c.company_name || ''
  // Tiêu chí nhận diện rác cơ bản
  const isGarbage = 
    code.toLowerCase().includes('.pdf') || 
    code.toLowerCase().includes('.xls') || 
    code.length > 30 ||
    name.toLowerCase().includes('.pdf') || 
    name.toLowerCase().includes('.xls') ||
    name.length > 50

  if (isGarbage) {
    garbageCount++
    if (garbageSamples.length < 10) {
      garbageSamples.push({ code, name })
    }
  }
})

console.log(`Total analyzed: ${data.length}`)
console.log(`Potential garbage records: ${garbageCount}`)
console.log('Samples:')
console.table(garbageSamples)
