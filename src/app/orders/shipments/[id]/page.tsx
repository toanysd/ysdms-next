import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Route redirect: /orders/shipments/[id] -> /shipments/[id]
 * Canonically moved to /shipments/[id] per AGENTS.md (Rule 1) and ADR-012.
 * Preserves 100% of searchParams.
 */
export default async function OrderShipmentDetailRedirectPage(props: {
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
  redirect(`/shipments/${id}${qs ? `?${qs}` : ''}`)
}
