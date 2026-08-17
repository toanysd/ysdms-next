import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function check() {
  const { data, error } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal, product_status, notes')
    .ilike('product_code', '%SMK%218%')
  
  console.log('Error:', error)
  console.log('Products:', JSON.stringify(data, null, 2))

  const { data: revs } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code, product_id, parent_design_id, design_category')
    .ilike('design_code', '%SMK%218%')
  
  console.log('Revisions:', JSON.stringify(revs, null, 2))
}

check().catch(console.error)
