import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ShipmentForm } from './_components/ShipmentForm'

export const dynamic = 'force-dynamic'

export default async function NewShipmentPage() {
  const t = await getTranslations('Shipment')
  const supabase = await createClient()

  // Fetch active delivery sites
  const { data: deliverySites } = await supabase
    .from('delivery_sites')
    .select('site_id, site_name')
    .eq('is_active', true)
    .order('site_name')

  return (
    <div className="flex flex-col h-full gap-3 max-w-3xl mx-auto w-full">
      {/* PageHeader Compact */}
      <div className="shrink-0 flex items-center gap-4 p-3 card-flat">
        <Link href="/orders/shipments" className="btn btn-secondary shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToList')}
        </Link>
        <h1 className="text-lg font-bold text-slate-900">{t('newTitle')}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat p-6">
        <ShipmentForm deliverySites={deliverySites || []} />
      </div>
    </div>
  )
}
