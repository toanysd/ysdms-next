export const dynamic = 'force-dynamic'

import { calculateMRP } from '@/app/actions/mrp'
import MrpDashboardClient from './_components/MrpDashboardClient'

export const metadata = {
  title: 'MRP (資材要件計画) | YSDMS NextGen',
}

export const revalidate = 0 // Tắt cache

export default async function MrpPage() {
  const mrpData = await calculateMRP()

  return (
    <MrpDashboardClient initialData={mrpData} />
  )
}
