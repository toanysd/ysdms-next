'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Loader2, Package, Check } from 'lucide-react'

type Props = {
  shipment: any
  onRefresh: () => void
}

export function LotsTab({ shipment, onRefresh }: Props) {
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
      alert('追加エラー / Lỗi thêm lô: ' + error.message)
    } else {
      setSelectedLotId('')
      setQtyShipped('')
      setCartonCount('')
      setPalletNo('')
      fetchLots()
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm('削除しますか？ / Bạn có chắc muốn xóa?')) return
    const { error } = await supabase.from('shipment_lots').delete().eq('shipment_lot_id', id)
    if (error) alert('削除エラー: ' + error.message)
    else fetchLots()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ADD FORM */}
      <div className="card-flat" style={{ padding: 16, background: 'var(--bg-surface-2)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={14} />
          <span className="ja">ロット割当</span>
          <span className="vi" style={{ fontSize: 10 }}>Chỉ định lô</span>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ marginBottom: 4 }}><span className="ja">製造ロット</span><span className="vi">Lô sản xuất</span></label>
            <select className="form-select" value={selectedLotId} onChange={e => setSelectedLotId(e.target.value)}>
              <option value="">-- 選択 / Chọn --</option>
              {availableLots.map(l => (
                <option key={l.lot_id} value={l.lot_id}>
                  {l.lot_no || 'No. 未定'} (OK: {l.good_qty || 0})
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: 100 }}>
            <label className="form-label" style={{ marginBottom: 4 }}><span className="ja">出荷数</span><span className="vi">SL giao</span></label>
            <input type="number" className="form-input text-right" value={qtyShipped} onChange={e => setQtyShipped(Number(e.target.value))} />
          </div>
          <div style={{ width: 100 }}>
            <label className="form-label" style={{ marginBottom: 4 }}><span className="ja">箱数</span><span className="vi">Số thùng</span></label>
            <input type="number" className="form-input text-right" value={cartonCount} onChange={e => setCartonCount(Number(e.target.value))} />
          </div>
          <div style={{ width: 120 }}>
            <label className="form-label" style={{ marginBottom: 4 }}><span className="ja">パレットNo</span><span className="vi">Số Pallet</span></label>
            <input type="text" className="form-input" value={palletNo} onChange={e => setPalletNo(e.target.value)} />
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving || !selectedLotId || qtyShipped === ''}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              追加 / Thêm
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
                <th><span className="ja">ロット番号</span><span className="vi">Số lô</span></th>
                <th style={{ textAlign: 'right' }}><span className="ja">出荷数</span><span className="vi">Số lượng giao</span></th>
                <th style={{ textAlign: 'right' }}><span className="ja">箱数</span><span className="vi">Số thùng</span></th>
                <th><span className="ja">パレットNo</span><span className="vi">Số Pallet</span></th>
                <th style={{ textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {shipmentLots.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    割当済みのロットはありません / Chưa có lô nào được gán
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
                        title="削除 / Xóa"
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
