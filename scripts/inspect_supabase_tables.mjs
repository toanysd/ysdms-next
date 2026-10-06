import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function inspectSupabase() {
  console.log('--- SUPABASE PRODUCTION READ-ONLY AUDIT ---')
  console.log(`URL: ${envMap.NEXT_PUBLIC_SUPABASE_URL}`)

  const targetTables = [
    'work_orders',
    'jobs',
    'job_steps',
    'work_logs',
    'mold_work_orders',
    'production_schedules',
    'equipment',
    'equipment_loans',
    'equipment_assignments',
    'products',
    'companies',
    'employees',
    'machines',
    'orders',
    'order_lines'
  ]

  for (const tbl of targetTables) {
    try {
      const { count, error } = await sb.from(tbl).select('*', { count: 'exact', head: true })
      if (error) {
        console.log(`  • ${tbl.padEnd(25)} | ERROR: ${error.message} (Code: ${error.code})`)
      } else {
        console.log(`  • ${tbl.padEnd(25)} | ${String(count).padStart(8)} rows`)
      }
    } catch (e) {
      console.log(`  • ${tbl.padEnd(25)} | EXCEPTION: ${e.message}`)
    }
  }
}

inspectSupabase().catch(console.error)
