import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeCode } from '@/lib/utils/normalizeCode'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawCode = searchParams.get('code') || ''

    if (!rawCode.trim()) {
      return NextResponse.json({ exists: false, product: null })
    }

    const supabase = await createClient()
    const normalizedInput = normalizeCode(rawCode)
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        product_id,
        product_code,
        product_name_internal,
        product_description,
        company_id,
        companies:companies!products_company_id_fkey(company_id, company_name, company_code),
        design_revisions(
          revision_id,
          design_code,
          revision_number,
          status,
          plastic_type_designed,
          created_at
        )
      `)
      .or(`product_code_normalized.eq.${normalizedInput},product_name_normalized.eq.${normalizedInput}`)
      .limit(1)
      .maybeSingle()

    if (error || !product) {
      return NextResponse.json({ exists: false, product: null })
    }

    // Find work orders by product_id OR by name matching code
    const woFilter = [
      `product_id.eq.${product.product_id}`,
      `wo_name.ilike.%${rawCode}%`,
      `wo_name.ilike.%${normalizedInput}%`
    ]
    const { data: rawWorkOrders } = await supabase
      .from('work_orders')
      .select('wo_id, wo_code, wo_name, wo_status, created_at, product_id, legacy_id')
      .or(woFilter.join(','))
      .order('created_at', { ascending: false })
      .limit(10)

    const workOrders = rawWorkOrders || []
    const woIds = workOrders.map(w => w.wo_id)

    // Find jobs
    const jobFilter = [
      `product_id.eq.${product.product_id}`,
      `job_name.ilike.%${rawCode}%`,
      `job_code.ilike.%${normalizedInput}%`
    ]
    if (woIds.length > 0) {
      jobFilter.push(`work_order_id.in.(${woIds.join(',')})`)
    }

    const { data: rawJobs } = await supabase
      .from('jobs')
      .select(`
        job_id,
        job_code,
        job_name,
        job_status,
        job_category,
        work_order_id,
        equipment_id,
        legacy_id,
        created_at,
        equipment(equipment_type, equipment_code)
      `)
      .or(jobFilter.join(','))
      .order('created_at', { ascending: false })
      .limit(20)

    const allJobs = rawJobs || []

    // Group jobs under corresponding work orders
    const workOrdersWithJobs = workOrders.map(wo => {
      const matchedJobs = allJobs.filter(j => 
        j.work_order_id === wo.wo_id || 
        (wo.legacy_id && j.legacy_id && wo.legacy_id.replace('WO', '') === j.legacy_id.replace('JOB', ''))
      )
      return {
        ...wo,
        jobs: matchedJobs
      }
    })

    return NextResponse.json({
      exists: true,
      product: {
        product_id: product.product_id,
        product_code: product.product_code,
        product_name_internal: product.product_name_internal,
        product_description: product.product_description,
        company_id: product.company_id,
        company_name: (product.companies as any)?.company_name || null,
        company_code: (product.companies as any)?.company_code || null,
        existingRevs: (product.design_revisions || []).sort((a: any, b: any) => (a.revision_number || 0) - (b.revision_number || 0)),
        hasWorkOrder: Boolean(workOrdersWithJobs && workOrdersWithJobs.length > 0),
        workOrders: workOrdersWithJobs,
        hasJobs: Boolean(allJobs && allJobs.length > 0),
        jobs: allJobs
      }
    })
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 })
  }
}
