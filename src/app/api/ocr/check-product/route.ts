import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawCode = searchParams.get('code') || ''

    if (!rawCode.trim()) {
      return NextResponse.json({ exists: false, product: null })
    }

    const supabase = await createClient()

    const cleanCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    const baseCode = cleanCode.replace(/R\d+$/i, '')
    const baseInternal = rawCode.trim().toUpperCase().replace(/(?:[\s\-_(]|^)(?:R|REV\.?|REVISION\s*)(\d+)\)?$/i, '').trim()

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
      .or(`product_code.eq.${baseCode},product_code.eq.${cleanCode},product_name_internal.eq.${baseInternal}`)
      .limit(1)
      .maybeSingle()

    if (error || !product) {
      return NextResponse.json({ exists: false, product: null })
    }

    return NextResponse.json({
      exists: true,
      product: {
        product_id: product.product_id,
        product_code: product.product_code,
        product_name_internal: product.product_name_internal,
        product_description: product.product_description,
        company_id: product.company_id,
        company_name: (product.companies as any)?.company_name || null,
        existingRevs: (product.design_revisions || []).sort((a: any, b: any) => (a.revision_number || 0) - (b.revision_number || 0))
      }
    })
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 })
  }
}
