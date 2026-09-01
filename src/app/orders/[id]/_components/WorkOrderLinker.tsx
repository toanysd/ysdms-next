'use client'

import { useState } from 'react'
import { Link2, Link2Off, Loader2, Search } from 'lucide-react'
import { linkWorkOrderAction, unlinkWorkOrderAction } from '../actions'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function WorkOrderLinker({ 
  orderId, 
  linkedWorkOrders, 
  suggestedWorkOrders 
}: { 
  orderId: string, 
  linkedWorkOrders: any[], 
  suggestedWorkOrders: any[] 
}) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [manualWoId, setManualWoId] = useState<string | null>(null)
  const supabase = createClient()

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
        <div className="form-section-header" style={{ background: 'var(--tint-teal-bg)' }}>
          <h3 className="form-section-title flex items-center gap-2"><Link2 size={14} /> Đã liên kết ({linkedWorkOrders.length})</h3>
        </div>
        <div className="form-section-body" style={{ padding: 0 }}>
          {linkedWorkOrders.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có lệnh sản xuất nào được liên kết.</div>
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
                    <td><Link href={`/equipment/jobs/${wo.wo_id}`} className="font-mono text-accent hover:underline font-bold text-[13px]">{wo.wo_code}</Link></td>
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
                    <td><Link href={`/equipment/jobs/${wo.wo_id}`} className="font-mono text-accent hover:underline font-bold text-[13px]">{wo.wo_code}</Link></td>
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
