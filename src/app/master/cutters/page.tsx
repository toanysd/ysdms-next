import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /master/cutters -> /equipment/cutting-dies
 * Standardized under WO-ROUTE-CLEANUP. Preserves 100% of searchParams.
 */
export default async function MasterCuttersRedirectPage(props: {
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
  redirect(`/equipment/cutting-dies${qs ? `?${qs}` : ''}`)
}
