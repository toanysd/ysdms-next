import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim()
})
const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function run() {
  console.log("Applying Migration 020...")
  // 1. product_mold_map
  await supabase.from('product_mold_map').delete().in('id', ['11111111-1111-1111-1111-111111111131', '11111111-1111-1111-1111-111111111132'])
  // 2. mold_physical
  await supabase.from('mold_physical').delete().in('id', ['11111111-1111-1111-1111-111111111121', '11111111-1111-1111-1111-111111111122'])
  // 3. mold_design_revision
  await supabase.from('mold_design_revision').delete().in('id', ['11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111112'])
  // 4. mold_base
  const { error } = await supabase.from('mold_base').delete().eq('id', '11111111-1111-1111-1111-111111111110')
  
  if (error) {
    console.error("Error applying Migration 020:", error)
  } else {
    console.log("Migration 020 hoàn tất: Đã purge toàn bộ seed bịa. DB sạch bong!")
  }
}

run().catch(console.error)
