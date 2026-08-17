import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectLegacyCutters() {
  const { data: cutters } = await supabase
    .from('cutters')
    .select('*')
    .limit(3)

  console.log('--- Legacy Cutters table sample ---')
  console.log(JSON.stringify(cutters, null, 2))
}

inspectLegacyCutters().catch(console.error)
