import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeCode } from '@/lib/utils/normalizeCode'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawCode = searchParams.get('code') || ''

    if (!rawCode.trim()) {
      return NextResponse.json({ exists: false, product: null })
    }

    const supabase = await createClient()

    // 1. Dùng hàm normalizeCode như chỉ thị (chỉ bỏ khoảng trắng, gạch nối, underscore)
    const normalizedInput = normalizeCode(rawCode)
    
    // Nếu PE muốn query giống hệt hướng dẫn:
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

    const { data: workOrders } = await supabase
      .from('work_orders')
      .select('wo_id, wo_code, wo_name, wo_status, created_at')
      .eq('product_id', product.product_id)
      .limit(5)

    const { data: jobs } = await supabase
      .from('jobs')
      .select('job_id, job_code, job_name, job_status, created_at')
      .eq('product_id', product.product_id)
      .limit(5)

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
        hasWorkOrder: Boolean(workOrders && workOrders.length > 0),
        workOrders: workOrders || [],
        hasJobs: Boolean(jobs && jobs.length > 0),
        jobs: jobs || []
      }
    })
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 })
  }
}
