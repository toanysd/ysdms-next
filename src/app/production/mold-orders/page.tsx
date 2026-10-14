import { redirect } from 'next/navigation'

export default async function LegacyMoldOrdersRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (Array.isArray(v)) v.forEach((item) => params.append(k, item))
    else if (v !== undefined) params.set(k, v)
  }
  const qs = params.toString()
  redirect(qs ? `/equipment/jobs?${qs}` : '/equipment/jobs')
}
