import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /master/molds/[id]/revision/[revId] -> /engineering/designs/revisions/${revId}
 * Standardized under WO-ROUTE-CLEANUP. Preserves route param and searchParams.
 */
export default async function MasterMoldRevisionDetailRedirectPage(props: {
  params: Promise<{ revId: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { revId } = await props.params
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
  redirect(`/engineering/designs/revisions/${revId}${qs ? `?${qs}` : ''}`)
}
