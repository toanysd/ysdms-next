import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envLines = fs.readFileSync(path.join(__dirname,'..', '.env.local'), 'utf8').replace(/\r\n/g,'\n').split('\n')
const env = {}; for (const l of envLines) { if (/^[A-Z_]+=/.test(l)) { const i=l.indexOf('='); env[l.slice(0,i)]=l.slice(i+1) } }
const URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim(), KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }

const FIXES = [
  { name: '菊池製作所', code: 'KKS' },
  { name: '東海商事',   code: 'TKS-002' },
  { name: 'ｴｺｰｸﾘｴｲｼｮﾝ', code: 'ECR' },
  { name: '大村技研',   code: 'OMG' },
  { name: 'ロッキー化成', code: 'RKY' },
]

const pages = await Promise.all([0,1000,2000].map(o=>
  fetch(`${URL}/rest/v1/companies?select=company_id,company_code,company_name&order=company_id&limit=1000&offset=${o}`,{headers:H}).then(r=>r.json())
))
const all = pages.flat()
const existCodes = new Set(all.map(c=>c.company_code).filter(Boolean))
let fixed = 0
for (const f of FIXES) {
  const rec = all.find(c => c.company_name === f.name)
  if (!rec) { console.log('NOT FOUND:', f.name); continue }
  let code = f.code
  if (existCodes.has(code)) { let s=2; while(existCodes.has(code+'-'+s))s++; code=code+'-'+s }
  const res = await fetch(`${URL}/rest/v1/companies?company_id=eq.${rec.company_id}`,{method:'PATCH',headers:H,body:JSON.stringify({company_code:code,notes:`[CODE_FIXED_MANUAL] Legacy: ${rec.company_code}`})})
  const j = await res.json()
  if(Array.isArray(j)&&!j[0]?.error){fixed++;existCodes.add(code);console.log(` ✅ ${rec.company_code?.padEnd(22)}→ ${code.padEnd(12)} | ${f.name}`)}
  else console.log(` ❌ ${f.name}:`,JSON.stringify(j)?.slice(0,60))
}
console.log(`\nFixed ${fixed}/5`)
