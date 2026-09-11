'use client'

import { useState } from 'react'
import { Link2, Link2Off, Loader2, Search, ClipboardList } from 'lucide-react'
import { linkWorkOrderAction, unlinkWorkOrderAction, createWorkOrderFromOrderAction } from '../actions'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function WorkOrderLinker({ 
  orderId, 
  linkedWorkOrders, 
  suggestedWorkOrders,
  orderStatus
}: { 
  orderId: string, 
  linkedWorkOrders: any[], 
  suggestedWorkOrders: any[],
  orderStatus?: string
}) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [isCreatingWo, setIsCreatingWo] = useState(false)
  const [manualWoId, setManualWoId] = useState<string | null>(null)
  const supabase = createClient()

  const canCreateWo = (orderStatus === 'CONFIRMED' || orderStatus === 'IN_PRODUCTION') && linkedWorkOrders.length === 0

  const handleCreateWo = async () => {
    if (!confirm('この受注から製造指示票(Work Order)を発行し、各設備向けJob・工程ステップを自動生成しますか？\n\n(Tự động tạo Lệnh sản xuất và phát hành toàn bộ Jobs & Steps cho đơn hàng này?)')) {
      return
    }
    setIsCreatingWo(true)
    const res = await createWorkOrderFromOrderAction(orderId)
    setIsCreatingWo(false)
    if (!res.success) {
      alert(`エラー: ${res.error}`)
    } else {
      alert(res.message || '製造指示票(WO)と各設備Jobを発行しました。')
    }
  }

  const handleLink = async (woId: string) => {
    setIsProcessing(woId)
    const res = await linkWorkOrderAction(woId, orderId)
    setIsProcessing(null)
    if (!res.success) alert('Lỗi liên kết: ' + res.error)
  }

  const handleUnlink = async (woId: string) => {
    setIsProcessing(woId)
    const res = await unlinkWorkOrderAction(woId, orderId)
    setIsProcessing(null)
    if (!res.success) alert('Lỗi hủy liên kết: ' + res.error)
  }

  const fetchManualWOs = async (query: string) => {
    let q = supabase.from('work_orders').select('wo_id, wo_code, wo_status').is('order_id', null)
    if (query) {
      q = q.ilike('wo_code', `%${query}%`)
    }
    const { data } = await q.limit(20)
    return (data || []).map(wo => ({
      value: wo.wo_id,
      label: wo.wo_code,
      sublabel: wo.wo_status
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 20px', gap: 24, overflowY: 'auto' }} className="custom-scrollbar">
      
      {/* ── SECTION A: LINKED WOs ── */}
      <div className="form-section">
        <div className="form-section-header" style={{ background: 'var(--tint-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="form-section-title flex items-center gap-2">
            <Link2 size={14} /> Đã liên kết ({linkedWorkOrders.length})
          </h3>
          {canCreateWo && (
            <button
              type="button"
              onClick={handleCreateWo}
              disabled={isCreatingWo}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 12px',
                height: 28,
                backgroundColor: '#059669',
                borderColor: '#047857',
              }}
              title="Tự động tạo Lệnh sản xuất (WO) và phát hành toàn bộ Jobs & Steps gia công"
            >
              {isCreatingWo ? <Loader2 size={13} className="animate-spin" /> : <ClipboardList size={13} />}
              <span>製造指示作成</span>
            </button>
          )}
        </div>
        <div className="form-section-body" style={{ padding: 0 }}>
          {linkedWorkOrders.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, marginBottom: 12, fontSize: 13 }}>Chưa có lệnh sản xuất nào được liên kết với đơn hàng này.</p>
              {canCreateWo && (
                <button
                  type="button"
                  onClick={handleCreateWo}
                  disabled={isCreatingWo}
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '8px 16px',
                    backgroundColor: '#059669',
                    borderColor: '#047857',
                    margin: '0 auto',
                  }}
                >
                  {isCreatingWo ? <Loader2 size={14} className="animate-spin" /> : <ClipboardList size={14} />}
                  <span>▶ 製造指示作成 (Tạo Lệnh SX & Tự sinh Jobs)</span>
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã WO</th>
                  <th>Gia công / Trạng thái</th>
                  <th>Yêu cầu</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {linkedWorkOrders.map(wo => (
                  <tr key={wo.wo_id}>
                    <td><Link href={`/production/work-orders/${wo.wo_id}`} className="font-mono text-accent hover:underline font-bold text-[13px]">{wo.wo_code}</Link></td>
                    <td><span className="badge badge--info">{wo.wo_status}</span></td>
                    <td className="font-mono text-[12px]">{wo.created_at ? new Date(wo.created_at).toLocaleDateString('ja-JP') : ''}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleUnlink(wo.wo_id)} 
                        className="btn btn-secondary !p-1 text-red-600 hover:bg-red-50"
                        disabled={isProcessing === wo.wo_id}
                        title="Hủy liên kết"
                      >
                        {isProcessing === wo.wo_id ? <Loader2 size={14} className="animate-spin" /> : <Link2Off size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── SECTION B: SUGGESTED WOs ── */}
      <div className="form-section">
        <div className="form-section-header" style={{ background: 'var(--tint-orange-bg)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 className="form-section-title flex items-center gap-2"><Search size={14} /> Đề xuất liên kết ({suggestedWorkOrders.length})</h3>
        </div>
        
        {/* Manual Linker */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', display: 'flex', gap: 8, alignItems: 'end' }}>
          <div style={{ flex: 1, maxWidth: 400 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Tìm kiếm thủ công WO khác</label>
            <AsyncSearchableSelect
              placeholder="Nhập mã WO hoặc tên..."
              value={manualWoId}
              onChange={setManualWoId}
              fetchOptions={fetchManualWOs}
            />
          </div>
          <button 
            className="btn btn-primary" 
            disabled={!manualWoId || isProcessing === manualWoId}
            onClick={() => manualWoId && handleLink(manualWoId)}
          >
            {isProcessing === manualWoId ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />} Liên kết
          </button>
        </div>

        {/* Suggested List */}
        <div className="form-section-body" style={{ padding: 0 }}>
          {suggestedWorkOrders.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>Không có WO nào khớp với sản phẩm trong đơn.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã WO</th>
                  <th>Gia công / Trạng thái</th>
                  <th>Yêu cầu</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {suggestedWorkOrders.map(wo => (
                  <tr key={wo.wo_id}>
                    <td><Link href={`/production/work-orders/${wo.wo_id}`} className="font-mono text-accent hover:underline font-bold text-[13px]">{wo.wo_code}</Link></td>
                    <td><span className="badge badge--neutral">{wo.wo_status}</span></td>
                    <td className="font-mono text-[12px]">{wo.created_at ? new Date(wo.created_at).toLocaleDateString('ja-JP') : ''}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleLink(wo.wo_id)} 
                        className="btn btn-primary !p-1 px-3"
                        disabled={isProcessing === wo.wo_id}
                      >
                        {isProcessing === wo.wo_id ? <Loader2 size={14} className="animate-spin" /> : <span style={{ fontSize: 11 }}>Liên kết</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}
