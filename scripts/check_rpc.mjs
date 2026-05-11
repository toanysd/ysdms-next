import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function checkFn() {
    const { data, error } = await supabase.rpc('ship_order_items', {
      p_order_id: '00000000-0000-0000-0000-000000000000',
      p_items: []
    })
    console.log("RPC Error/Data:", error || data)
}
checkFn()
