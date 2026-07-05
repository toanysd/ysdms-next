import { calculateMRP } from '@/app/actions/mrp'
import MrpDashboardClient from './_components/MrpDashboardClient'

export const metadata = {
  title: 'MRP (Tính nhu cầu Vật tư) | YSDMS Next-Gen',
}

export const revalidate = 0 // Tắt cache

export default async function MrpPage() {
  const mrpData = await calculateMRP()

  return (
    <MrpDashboardClient initialData={mrpData} />
  )
}
