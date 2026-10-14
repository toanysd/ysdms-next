import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /production/materials -> /plastics/inventory
 * Standardized under WO-ROUTE-CLEANUP. Preserves 100% of searchParams.
 */
export default async function ProductionMaterialsRedirectPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
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
  redirect(`/plastics/inventory${qs ? `?${qs}` : ''}`)
}
