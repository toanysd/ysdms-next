import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function deepInspect() {
    const tables = ['employees', 'destinations', 'mold_status_logs', 'mold_teflon_logs', 'mold_location_logs', 'mold_ship_logs', 'mold_comments']
    
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1)
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
        
        if (error) {
            console.log(`❌ ${t}: ${error.message}`)
        } else if (data && data.length > 0) {
            console.log(`✅ ${t}: ${count} rows | Columns: [${Object.keys(data[0]).join(', ')}]`)
        } else {
            // Empty table — still get columns via a trick
            console.log(`⚠️ ${t}: ${count} rows (EMPTY) — exists but no data to inspect columns`)
        }
    }
}

deepInspect()
