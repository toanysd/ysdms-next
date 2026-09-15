import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /orders/shipments/new -> /shipments/new
 * Canonically moved to /shipments/new per AGENTS.md (Rule 1) and ADR-012.
 * Preserves 100% of searchParams (e.g. order_id).
 */
export default async function OrderShipmentNewRedirectPage(props: {
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
  redirect(`/shipments/new${qs ? `?${qs}` : ''}`)
}
