import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const url = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)[1].trim()
const anonKey = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$/m)[1].trim()
const supabase = createClient(url, anonKey)

async function test() {
  const { data, count, error } = await supabase
    .from('jobs')
    .select(`
      job_id,
      job_code,
      job_name,
      job_status,
      overall_progress,
      mold_deadline,
      deadline,
      created_at,
      priority,
      job_types(job_type_name_ja, job_type_name_vi),
      companies!jobs_company_id_fkey(company_name),
      equipment!jobs_equipment_id_fkey(equipment_id, display_name, equipment_code, actual_length_mm, actual_width_mm, actual_height_mm),
      design_revisions!jobs_design_revision_id_fkey(revision_id, design_code, design_length, design_width, design_height, plastic_type_designed),
      products!jobs_product_id_fkey(product_id, product_code, product_name, product_name_internal, product_material_specs(material_type))
    `, { count: 'exact' })
    .range(0, 5)

  console.log('QUERY RESULT:', { error, count, rowsCount: data?.length })
  if (data && data.length > 0) {
    console.log('Sample row 0:', JSON.stringify(data[0], null, 2))
  }
}

test()
