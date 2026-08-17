import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectTypes() {
  const { data } = await supabase.from('equipment').select('equipment_type, sub_type').limit(50)
  const types = Array.from(new Set(data?.map(d => d.equipment_type)))
  console.log('Unique equipment_type values in DB:', types)
}

inspectTypes().catch(console.error)
