import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const payload = {
      mold_master_id: 'a0fcfb8e-e2b4-4b53-9097-7e6d2b3c10b7', // some valid uuid, but we'll see if it fails for other reasons
      company_id: '1c315499-c4b1-43b5-8285-56ebc0250bba',
      design_code: '12X356X460_TEST_99',
      has_plug: false,
      has_separate_cutter: false
  }
  
  // Just fetch a valid mold_master_id first
  const {data: mm} = await supabase.from('mold_masters').select('mold_master_id').limit(1).single()
  if (mm) payload.mold_master_id = mm.mold_master_id

  const res = await supabase.from('design_revisions').insert([payload]).select('revision_id').single()
  console.log("Insert result:", res)
  
  // Try upserting a tray
  const trayPayload = {
    company_id: payload.company_id,
    product_code: 'TRAY_TEST_99',
    product_name: 'TRAY_TEST_99',
    product_status: 'ACTIVE'
  }
  const res2 = await supabase.from('products').insert([trayPayload]).select()
  console.log("Tray result:", res2)
}

testInsert().finally(() => process.exit(0))
