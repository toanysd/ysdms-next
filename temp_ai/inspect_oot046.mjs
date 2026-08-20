import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function inspectJob() {
  const { data: products } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal, product_name')
    .ilike('product_code', '%OOT%')

  console.log('Products:', products)

  const productIds = products?.map(p => p.product_id) || []

  const { data: jobs } = await supabase
    .from('jobs')
    .select('job_id, job_code, job_name, job_status, ship_date, deadline, mold_deadline, product_id, equipment_id')
    .or(`product_id.in.(${productIds.join(',')}),job_code.ilike.%OOT%,job_name.ilike.%OOT%`)

  console.log('Jobs for OOT:', jobs)
}

inspectJob()
