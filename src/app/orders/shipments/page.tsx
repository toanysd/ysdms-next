import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /orders/shipments -> /shipments
 * Canonically moved to /shipments per AGENTS.md (Rule 1) and ADR-012.
 * Preserves 100% of searchParams for query tabs, filters, and pagination.
 */
export default async function OrderShipmentsRedirectPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await props.searchParams
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v !== undefined) {
      if (Array.isArray(v)) {
        v.forEach(val => params.append(k, val))
      } else {
        params.set(k, v)
      }
    }
  }
  const qs = params.toString()
  redirect(`/shipments${qs ? `?${qs}` : ''}`)
}
