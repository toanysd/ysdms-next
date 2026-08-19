/**
 * Backfill Design Jobs for existing products.
 * 
 * Problem: Products created via AI OCR or old flows only have Mold/Equipment Jobs
 * but no Design Job (job_category = 'DESIGN'). This causes the 設計のみ tab 
 * on the schedule Gantt to show empty.
 * 
 * Solution: For each product that has design_revisions but no Design Job,
 * create a Design Job with 2 steps: [1. 試作金型作成, 2. 本型設計]
 * and copy the deadline from the existing Mold Job.
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
const envContent = readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function main() {
  console.log('=== Backfill Design Jobs ===\n')

  // 1. Find all products that have design_revisions
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal, company_id')
    .not('product_status', 'eq', 'ARCHIVED')
    .order('created_at', { ascending: false })

  if (prodErr) {
    console.error('Error fetching products:', prodErr.message)
    return
  }

  console.log(`Found ${products.length} active products\n`)

  let created = 0
  let skipped = 0

  for (const product of products) {
    // Check if product has design_revisions
    const { data: revisions } = await supabase
      .from('design_revisions')
      .select('revision_id, design_code, revision_number')
      .eq('product_id', product.product_id)
      .order('revision_number', { ascending: false })
      .limit(1)

    if (!revisions || revisions.length === 0) {
      // No design_revisions, skip
      continue
    }

    // Check if product already has a Design Job
    const { data: existingDesignJobs } = await supabase
      .from('jobs')
      .select('job_id, job_code')
      .eq('product_id', product.product_id)
      .eq('job_category', 'DESIGN')
      .limit(1)

    if (existingDesignJobs && existingDesignJobs.length > 0) {
      console.log(`  ⏭️  ${product.product_code}: Already has Design Job ${existingDesignJobs[0].job_code}`)
      skipped++
      continue
    }

    // Get existing Mold Job deadline to inherit
    const { data: moldJobs } = await supabase
      .from('jobs')
      .select('job_id, job_code, mold_deadline, ship_date, deadline, start_date, target_completion_date')
      .eq('product_id', product.product_id)
      .in('job_category', ['MOLD', 'MOLD_NEW', 'MOLD_MODIFY', 'CUTTER_NEW', 'EQUIPMENT_NEW'])
      .order('created_at', { ascending: false })
      .limit(1)

    const moldJob = moldJobs?.[0]
    const latestRev = revisions[0]

    // Generate Design Job code
    const codeCompact = product.product_code.replace(/^PRD-/, '').replace(/-/g, '')
    const jobCode = `DES-${codeCompact}`
    const jobName = `${product.product_name_internal || product.product_code} 設計`

    // Create Design Job
    const { data: newJob, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        job_code: jobCode,
        job_name: jobName,
        job_type_id: '9', // 設計
        job_category: 'DESIGN',
        product_id: product.product_id,
        design_revision_id: latestRev.revision_id,
        company_id: product.company_id,
        job_status: 'NEW',
        overall_progress: 0,
        priority: 5,
        start_date: moldJob?.start_date || new Date().toISOString().split('T')[0],
        mold_deadline: moldJob?.mold_deadline || null,
        ship_date: moldJob?.ship_date || null,
        deadline: moldJob?.deadline || moldJob?.mold_deadline || null,
        target_completion_date: moldJob?.target_completion_date || null,
        notes: '初回設計 (Backfill from existing product)',
      })
      .select('job_id, job_code')
      .single()

    if (jobErr) {
      console.error(`  ❌ ${product.product_code}: Error creating Design Job:`, jobErr.message)
      continue
    }

    // Create 2 steps: 試作金型作成 + 本型設計
    const steps = [
      {
        job_id: newJob.job_id,
        step_no: 1,
        step_name: '試作金型作成',
        step_status: 'NOT_STARTED',
        track: 'DESIGN',
        deadline: moldJob?.mold_deadline || null,
        notes: '試作金型作成',
      },
      {
        job_id: newJob.job_id,
        step_no: 2,
        step_name: '本型設計',
        step_status: 'NOT_STARTED',
        track: 'DESIGN',
        deadline: moldJob?.mold_deadline || null,
        notes: '本型設計',
      },
    ]

    const { error: stepErr } = await supabase.from('job_steps').insert(steps)

    if (stepErr) {
      console.error(`  ⚠️  ${product.product_code}: Job created but steps failed:`, stepErr.message)
    }

    console.log(`  ✅ ${product.product_code}: Created ${newJob.job_code} (deadline: ${moldJob?.mold_deadline || 'none'})`)
    created++
  }

  console.log(`\n=== Summary ===`)
  console.log(`Created: ${created} Design Jobs`)
  console.log(`Skipped: ${skipped} (already had Design Job)`)
  console.log(`Total products scanned: ${products.length}`)
}

main().catch(console.error)
