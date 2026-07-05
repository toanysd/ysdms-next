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

async function testMoldRevision() {
  // Try inserting one mold revision
  // Get a valid master and design
  const { data: mm } = await supabase.from('mold_masters').select('mold_master_id').limit(1).single()
  const { data: dr } = await supabase.from('design_revisions').select('revision_id').limit(1).single()
  
  console.log("Master:", mm)
  console.log("Design:", dr)

  const payload = {
    mold_master_id: mm?.mold_master_id,
    design_revision_id: dr?.revision_id,
    revision_code: 'TEST3_REV',
    revision_name: 'TEST3'
  }
  
  console.log("Payload:", payload)
  const res = await supabase.from('mold_revisions').insert([payload]).select()
  console.log("Result:", res)
}

testMoldRevision().finally(() => process.exit(0))
