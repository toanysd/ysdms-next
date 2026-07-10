import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrderDetailData } from '../page'
import { Loader2, Printer } from 'lucide-react'

export function ProductionInstructionsTab({ order }: { order: OrderDetailData }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [instructions, setInstructions] = useState<any[]>([])

  useEffect(() => {
    async function fetchInstructions() {
      if (!order.order_lines || order.order_lines.length === 0) {
        setInstructions([])
        setLoading(false)
        return
      }

      const lineIds = order.order_lines.map(l => l.line_id)

      const { data, error } = await supabase
        .from('production_orders')
        .select(`
          po_id, po_code, po_status, planned_quantity, actual_quantity, 
          planned_start, priority, material_type, material_thickness, material_width,
          order_line_id
        `)
        .in('order_line_id', lineIds)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setInstructions(data)
      }
      setLoading(false)
    }

    fetchInstructions()
  }, [order, supabase])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 8, color: 'var(--text-muted)' }}>
        <Loader2 size={16} className="animate-spin" />
        <span style={{ fontSize: 13 }}>読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="card-flat" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
          製造指示一覧{instructions.length})
        </div>
      </div>

      {instructions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          製造指示がありません
        </div>
      ) : (
        <div className="custom-scrollbar" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>PO Code</th>
                <th style={{ width: 150 }}>状態</th>
                <th style={{ width: 100, textAlign: 'right' }}>計画</th>
                <th style={{ width: 100, textAlign: 'right' }}>実績</th>
                <th style={{ width: 120, textAlign: 'center' }}>開始(予定)</th>
                <th style={{ width: 180 }}>材料 (種別/厚み/幅)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {instructions.map(po => (
                <tr key={po.po_id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)' }}>
                    {po.po_code}
                  </td>
                  <td>
                    <span className="badge badge--info">{po.po_status}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {po.planned_quantity || 0}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: po.actual_quantity >= po.planned_quantity ? 'var(--status-success)' : 'inherit' }}>
                    {po.actual_quantity || 0}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                    {po.planned_start ? po.planned_start.substring(0, 10).replace(/-/g, '/') : '-'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {po.material_type ? `${po.material_type} / ${po.material_thickness} / ${po.material_width}` : '-'}
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => alert('PO印刷機能は開発中です')}>
                      <Printer size={12} /> 印刷
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
