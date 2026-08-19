import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkCodes() {
  const { data, error } = await supabase
    .from('processing_codes')
    .select('processing_code_id, processing_name, department_code, category, is_active')
    .order('processing_code_id', { ascending: true })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Total codes:', data.length)
  console.table(data)
}

checkCodes()
