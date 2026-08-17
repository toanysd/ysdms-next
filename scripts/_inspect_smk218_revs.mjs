import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectRevs() {
  const { data: revs } = await supabase
    .from('design_revisions')
    .select('*')
    .in('revision_id', ['416de927-05fb-4601-a895-1262b2ceeef6', 'cf3888ba-be47-4f50-a534-3c1cf19d6dc5'])

  console.log('Design revisions for SMK218:')
  console.log(JSON.stringify(revs, null, 2))
}

inspectRevs().catch(console.error)
