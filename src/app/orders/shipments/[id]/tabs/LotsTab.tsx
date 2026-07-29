'use client'

import { useTranslations } from 'next-intl'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Loader2, Package, Check } from 'lucide-react'

type Props = {
  shipment: any
  onRefresh: () => void
}

export function LotsTab({ shipment, onRefresh }: Props) {
  const t = useTranslations()

  const supabase = createClient()
  const [shipmentLots, setShipmentLots] = useState<any[]>([])
  const [availableLots, setAvailableLots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Add form state
  const [selectedLotId, setSelectedLotId] = useState('')
  const [qtyShipped, setQtyShipped] = useState<number | ''>('')
  const [cartonCount, setCartonCount] = useState<number | ''>('')
  const [palletNo, setPalletNo] = useState('')

  const fetchLots = useCallback(async () => {
    setLoading(true)
    
    // 1. Fetch assigned lots
    const { data: assigned } = await supabase
      .from('shipment_lots')
      .select(`
        shipment_lot_id, qty_shipped, carton_count, pallet_no, notes,
        production_lots (
          lot_id, lot_no, good_qty, defective_qty
        )
      `)
      .eq('shipment_id', shipment.shipment_id)
      .order('created_at', { ascending: false })

    setShipmentLots(assigned || [])

    // 2. Fetch available lots for this order
    if (shipment.order_id) {
      const { data: avail } = await supabase
        .from('production_lots')
        .select(`
          lot_id, lot_no, good_qty,
          production_orders!inner(
            order_line_id,
            order_lines!inner(order_id)
          )
        `)
        .eq('production_orders.order_lines.order_id', shipment.order_id)
      
      setAvailableLots(avail || [])
    }
    
    setLoading(false)
  }, [shipment, supabase])

  useEffect(() => {
    fetchLots()
  }, [fetchLots])

  const handleAdd = async () => {
    if (!selectedLotId || qtyShipped === '') return
    
    setSaving(true)
    const { error } = await supabase.from('shipment_lots').insert({
      shipment_id: shipment.shipment_id,
      lot_id: selectedLotId,
      qty_shipped: qtyShipped,
      carton_count: cartonCount === '' ? null : cartonCount,
      pallet_no: palletNo || null
    })

    setSaving(false)
    if (error) {
      alert(t('Common.addError') + error.message)
    } else {
      setSelectedLotId('')
      setQtyShipped('')
      setCartonCount('')
      setPalletNo('')
      fetchLots()
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm(t('Common.deleteConfirm'))) return
    const { error } = await supabase.from('shipment_lots').delete().eq('shipment_lot_id', id)
    if (error) alert(t('Common.deleteError') + error.message)
    else fetchLots()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ADD FORM */}
      <div className="card-flat" style={{ padding: 16, background: 'var(--bg-surface-2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={14} />
          {t('Orders.chiInhLo')}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ marginBottom: 4 }}>{t('Orders.loSanXuat')}</label>
            <select className="form-select" value={selectedLotId} onChange={e => setSelectedLotId(e.target.value)}>
              <option value="">-- {t('Common.selectPlaceholder')} --</option>
              {availableLots.map(l => (
                <option key={l.lot_id} value={l.lot_id}>
                  {l.lot_no || '—'} (OK: {l.good_qty || 0})
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: 100 }}>
            <label className="form-label" style={{ marginBottom: 4 }}>{t('Orders.slGiao')}</label>
            <input type="number" className="form-input text-right" value={qtyShipped} onChange={e => setQtyShipped(Number(e.target.value))} />
          </div>
          <div style={{ width: 100 }}>
            <label className="form-label" style={{ marginBottom: 4 }}>{t('Orders.soThung')}</label>
            <input type="number" className="form-input text-right" value={cartonCount} onChange={e => setCartonCount(Number(e.target.value))} />
          </div>
          <div style={{ width: 120 }}>
            <label className="form-label" style={{ marginBottom: 4 }}>{t('Orders.soPallet')}</label>
            <input type="text" className="form-input" value={palletNo} onChange={e => setPalletNo(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving || !selectedLotId || qtyShipped === ''}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {t('Common.add')}
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card-flat">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto', color: 'var(--text-muted)' }} /></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Orders.soLo')}</th>
                <th style={{ textAlign: 'right' }}>{t('Orders.soLuongGiao')}</th>
                <th style={{ textAlign: 'right' }}>{t('Orders.soThung')}</th>
                <th>{t('Orders.soPallet')}</th>
                <th style={{ textAlign: 'right' }}>{t('Common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {shipmentLots.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    {t('Shipments.noLotsAssigned')}
                  </td>
                </tr>
              ) : (
                shipmentLots.map(row => (
                  <tr key={row.shipment_lot_id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)' }}>
                      {row.production_lots?.lot_no || '-'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {row.qty_shipped.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {row.carton_count || '-'}
                    </td>
                    <td>
                      {row.pallet_no || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemove(row.shipment_lot_id)}
                        style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 4 }}
                        title={t('Common.delete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
