import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function run() {
  const { data, error } = await supabase
    .from('jobs')
    .select('job_id, product_id, physical_mold_id, design_revision_id, job_code, products!jobs_product_id_fkey(product_code, product_name)')
    .ilike('job_code', '%IRI%')
  console.dir(data, { depth: null })
  if (error) console.error(error)
}
run()
