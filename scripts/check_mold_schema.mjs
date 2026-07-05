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
    const res = await supabase.from('mold_physical').select('*').limit(1)
    console.log('mold_physical columns:', res.data ? Object.keys(res.data[0] || {}) : 'empty')

    const res2 = await supabase.from('mold_base').select('*').limit(1)
    console.log('mold_base columns:', res2.data ? Object.keys(res2.data[0] || {}) : 'empty')
    
    // Check if companies exist
    const res3 = await supabase.from('companies').select('*').limit(1)
    console.log('companies exist:', res3.error ? res3.error.message : 'Yes')
}
run()
