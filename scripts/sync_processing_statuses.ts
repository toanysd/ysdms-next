import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const supabase = createClient(supabaseUrl, supabaseKey)

const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
const data = parse(fs.readFileSync(path.join(dir, 'processingstatus.csv'), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

async function run() {
  for (const row of data) {
    if (!row.ProcessingStatusID) continue
    const payload = {
      status_id: parseInt(row.ProcessingStatusID),
      status_code: row.ProcessingStatus?.trim(),
      status_name_vi: row.TinhTrangGiaCong?.trim()
    }
    const { error } = await supabase.from('processing_statuses').upsert(payload)
    if (error) console.error("Error inserting processing_statuses:", error.message)
  }
  
  // also processing_items
  const itemsData = parse(fs.readFileSync(path.join(dir, 'processingitems.csv'), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
  for (const row of itemsData) {
    if (!row.ProcessingItemID) continue
    const payload = {
      processing_item_id: parseInt(row.ProcessingItemID),
      item_name: row.ProcessingItem?.trim(),
      description: row.ItemDescription?.trim()
    }
    const { error } = await supabase.from('processing_items').upsert(payload)
    if (error) console.error("Error inserting processing_items:", error.message)
  }

  console.log("Done syncing statuses and items")
}

run()
