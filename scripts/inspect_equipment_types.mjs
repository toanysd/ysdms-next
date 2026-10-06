import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function inspectEquip() {
  let all = [], from = 0, ps = 1000
  while (true) {
    const { data, error } = await sb.from('equipment').select('equipment_type').range(from, from + ps - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < ps) break
    from += ps
  }
  const counts = {}
  all.forEach(r => {
    counts[r.equipment_type] = (counts[r.equipment_type] || 0) + 1
  })
  console.log(`SUPABASE EQUIPMENT BREAKDOWN BY TYPE (Total: ${all.length}):`)
  Object.keys(counts).sort().forEach(k => {
    console.log(`  • ${k.padEnd(20)}: ${counts[k]} items`)
  })
}

inspectEquip().catch(console.error)
