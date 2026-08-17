import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function main() {
  // Total count
  const { count } = await supabase.from('products').select('product_id', { count: 'exact', head: true })
  console.log('Total products in DB:', count)

  // Search SMK218
  const { data: smkData } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal, product_status')
    .ilike('product_code', '%SMK%218%')
  
  console.log('\nSMK218 products:')
  if (smkData) {
    smkData.forEach(p => console.log(`  ${p.product_code} | ${p.product_name_internal} | status: ${p.product_status}`))
  }

  // Fetch ALL products with pagination to count true total trial products
  let allProducts = []
  let from = 0
  const PAGE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('product_id, product_code, product_status')
      .neq('product_status', 'MERGED')
      .range(from, from + PAGE - 1)
    if (error || !data || data.length === 0) break
    allProducts = allProducts.concat(data)
    if (data.length < PAGE) break
    from += PAGE
  }

  console.log(`\nAll products fetched (paginated): ${allProducts.length}`)

  // Find trial products
  const trialProducts = allProducts.filter(p => {
    const clean = (p.product_code || '').trim().toUpperCase().replace(/[\s\-_]/g, '')
    const suffix = clean.replace(/^[A-Z]+\d+/, '')
    if (!suffix) return false
    return /^D($|R\d|[^A-Z])/i.test(suffix)
  })

  console.log(`Trial products found: ${trialProducts.length}`)
  trialProducts.forEach(p => console.log(`  ${p.product_code}`))
}

main().catch(console.error)
