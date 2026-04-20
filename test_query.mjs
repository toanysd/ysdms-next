import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) envKeys[match[1]] = match[2].trim()
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function test() {
    console.log("Connecting to Supabase...")
    const { data: itemData, error: e1 } = await supabase.from('order_items').select('*').limit(1).single()
    console.log("ITEM DATA ERROR:", e1?.message || "OK")
    if (!itemData) {
        console.log("No order item found to test.")
        return
    }

    console.log("Running nested query on product_mold_map...")
    const { data: moldMappings, error: e2 } = await supabase
        .from('product_mold_map')
        .select(`
            mold_design_revision (
                id, revision_code,
                mold_physical (
                    id, physical_code, storage_location, status
                )
            )
        `)
        .eq('product_id', itemData.product_id)

    console.log("NESTED QUERY ERROR:", e2?.message || "OK")
    console.log("Found mappings count:", moldMappings?.length)
    console.log("Query test finished.")
}

test().catch(console.error)
