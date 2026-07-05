import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function run() {
    const r1 = await supabase.from('mold_design_revision').select('*').limit(1)
    console.log('mold_design_revision:', r1.data ? Object.keys(r1.data[0] || {}) : 'empty')

    const r2 = await supabase.from('mold_physical').select('*').limit(1)
    console.log('mold_physical:', r2.data ? Object.keys(r2.data[0] || {}) : 'empty')
}
run()
