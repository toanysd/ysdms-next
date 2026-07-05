import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim()
})
const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])
async function check() {
  const tables = ['customers','product_master','machine_master','cutter_master','mold_base','mold_design_revision','mold_physical','production_log','orders','order_items','product_mold_map']
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    console.log(`${t.padEnd(25)} = ${error ? 'ERROR: '+error.message : count}`)
  }
}
check()
