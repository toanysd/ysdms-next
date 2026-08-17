import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function checkMergedReferences() {
  const { data: mergedProds } = await supabase
    .from('products')
    .select('product_id, product_code')
    .eq('product_status', 'MERGED')

  console.log('Total MERGED products:', mergedProds?.length || 0)

  if (!mergedProds || mergedProds.length === 0) return

  const mergedIds = mergedProds.map(p => p.product_id)

  // Check design_revisions
  const { count: revCount } = await supabase
    .from('design_revisions')
    .select('revision_id', { count: 'exact', head: true })
    .in('product_id', mergedIds)

  console.log('Design revisions referencing MERGED products:', revCount)

  // Check order_lines
  const { count: orderCount } = await supabase
    .from('order_lines')
    .select('line_id', { count: 'exact', head: true })
    .in('product_id', mergedIds)

  console.log('Order lines referencing MERGED products:', orderCount)
}

checkMergedReferences().catch(console.error)
