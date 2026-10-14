import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export type Company = {
  company_id: string
  company_name: string
  company_code: string
  [key: string]: any
}

export type DesignRevisionItem = {
  revision_id: string
  design_code: string
  revision_number: number | null
  status: string | null
  equipment?: any[] | null
  cutters?: any[] | null
  surface_treatments?: any[] | null
  files?: any[] | null
  [key: string]: any
}

export type ProductDetailData = {
  product_id: string
  design_revisions: DesignRevisionItem[]
  [key: string]: any
}

/**
 * Route redirect: /master/products/[id] -> /product-center/${id}
 * Standardized under WO-ROUTE-CLEANUP. Preserves route param and searchParams.
 */
export default async function MasterProductDetailRedirectPage(props: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await props.params
  const sp = await props.searchParams
  const params = new URLSearchParams()
  if (sp) {
    for (const [k, v] of Object.entries(sp)) {
      if (v !== undefined) {
        if (Array.isArray(v)) {
          v.forEach(val => params.append(k, val))
        } else {
          params.set(k, v)
        }
      }
    }
  }
  const qs = params.toString()
  redirect(`/product-center/${id}${qs ? `?${qs}` : ''}`)
}
