import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspect() {
    // Get a sample row to see all columns
    const tables = ['mold_physical', 'mold_design_revision', 'mold_base']
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('*').limit(1)
        if (error) {
            console.log(`❌ ${t}: ${error.message}`)
        } else if (data && data.length > 0) {
            console.log(`✅ ${t} columns:`, Object.keys(data[0]).join(', '))
        } else {
            console.log(`⚠️ ${t}: empty table`)
        }
    }
    
    // Count rows
    for (const t of ['mold_physical', 'mold_design_revision', 'mold_base', 'companies', 'rack_layers', 'item_types', 'processing_codes', 'mold_jobs', 'mold_work_logs']) {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
        console.log(`  ${t}: ${count} rows`)
    }
}

inspect()
