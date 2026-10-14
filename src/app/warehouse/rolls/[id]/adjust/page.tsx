import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /warehouse/rolls/[id]/adjust -> /plastics/inventory?search=[id]
 * Standardized under WO-ROUTE-CLEANUP. Preserves roll id as search query and additional searchParams.
 */
export default async function WarehouseRollAdjustRedirectPage(props: {
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
  if (!params.has('search')) {
    params.set('search', id)
  }
  const qs = params.toString()
  redirect(`/plastics/inventory${qs ? `?${qs}` : ''}`)
}
