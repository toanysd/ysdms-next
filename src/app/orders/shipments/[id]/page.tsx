'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useParams } from 'next/navigation'

import { ShipmentBackButton } from './ShipmentBackButton'
import { ShipmentDetailHeader } from './ShipmentDetailHeader'
import { ShipmentTabNavigation, type TabId } from './ShipmentTabNavigation'

import { OverviewTab } from './tabs/OverviewTab'
import { RequiredDocsTab } from './tabs/RequiredDocsTab'
import { LotsTab } from './tabs/LotsTab'

function TabContent({ tab, shipment, onRefresh }: { tab: TabId; shipment: any; onRefresh: () => void }) {
  switch (tab) {
    case 'overview': return <OverviewTab shipment={shipment} onRefresh={onRefresh} />
    case 'docs':     return <RequiredDocsTab shipment={shipment} onRefresh={onRefresh} />
    case 'lots':     return <LotsTab shipment={shipment} onRefresh={onRefresh} />
    default:         return null
  }
}

export default function ShipmentDetailPage() {
  const params = useParams()
  const shipmentId = params.id as string
  const supabase = createClient()

  const [shipment, setShipment] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const fetchShipment = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('shipments')
      .select(`
        *,
        orders(order_no, companies(company_name))
      `)
      .eq('shipment_id', shipmentId)
      .single()

    if (err) {
      setError(err.message)
    } else {
      setShipment(data)
    }
    setLoading(false)
  }, [shipmentId, supabase])

  useEffect(() => { fetchShipment() }, [fetchShipment])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 8 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>読み込み中...</span>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="card-flat" style={{ padding: 20, textAlign: 'center' }}>
        <AlertTriangle size={24} style={{ color: 'var(--status-error)', marginBottom: 8 }} />
        <div style={{ fontSize: 13, color: 'var(--status-error)', fontWeight: 600 }}>
          {error || '出荷データが見つかりません / Không tìm thấy phiếu xuất'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          ID: {shipmentId}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Row 1: Back buttons + Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10, flexShrink: 0 }}>
          <ShipmentBackButton />
        </div>
        <div style={{ flex: 1 }}>
          <ShipmentDetailHeader shipment={shipment} />
        </div>
      </div>

      {/* Row 2: Tabs */}
      <ShipmentTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Row 3: Tab content */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 0 }}>
        <TabContent tab={activeTab} shipment={shipment} onRefresh={fetchShipment} />
      </div>
    </div>
  )
}
