import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectTables() {
  // Inspect physical_molds sample row
  const { data: pm } = await supabase.from('physical_molds').select('*').limit(1)
  console.log('physical_molds keys:', pm ? Object.keys(pm[0]) : [])

  // Inspect orders sample row
  const { data: ord } = await supabase.from('orders').select('*').limit(1)
  console.log('orders keys:', ord ? Object.keys(ord[0]) : [])

  // Inspect order_lines sample row
  const { data: ol } = await supabase.from('order_lines').select('*').limit(1)
  console.log('order_lines keys:', ol ? Object.keys(ol[0]) : [])
}

inspectTables().catch(console.error)
