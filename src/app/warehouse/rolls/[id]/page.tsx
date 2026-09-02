export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ArrowUpFromLine, Activity, CheckCircle, Clock, XCircle, AlertCircle, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function RollDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: roll } = await supabase
    .from('plastic_receipt_roll')
    .select(`
      *,
      plastic_master (*),
      plastic_receipt (*),
      plastic_adjustment_log (
        id, created_at, change_length_m, action_type, note, operator_name
      )
    `)
    .eq('id', params.id)
    .single()

  if (!roll) {
    notFound()
  }

  const logs = roll.plastic_adjustment_log || []
  logs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'in_stock': return { label: '在庫 / In Stock', badgeClass: 'badge--success', icon: CheckCircle }
      case 'in_use': return { label: '使用中 / In Use', badgeClass: 'badge--warning', icon: Clock }
      case 'empty': return { label: '空 / Empty', badgeClass: 'badge--neutral', icon: XCircle }
      case 'returned': return { label: '返品 / Returned', badgeClass: 'badge--error', icon: AlertCircle }
      default: return { label: status, badgeClass: 'badge--neutral', icon: AlertCircle }
    }
  }

  const st = getStatusConfig(roll.status || '')
  const pm = Array.isArray(roll.plastic_master) ? roll.plastic_master[0] : roll.plastic_master

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── BackBar (Detail Page Pattern) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/warehouse/rolls" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowLeft size={14} />
              戻る
            </Link>
            <Link href="/warehouse/rolls" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
              <ArrowUpFromLine size={14} />
              一覧
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>
              {roll.roll_barcode}
            </h1>
            <span className={`badge ${st.badgeClass} flex items-center gap-1`}>
              <st.icon size={12} />
              {st.label}
            </span>
          </div>
        </div>
        <div>
          <Link href={`/warehouse/rolls/${roll.id}/adjust`}>
            <button className="btn btn-primary flex items-center gap-1.5 cursor-pointer">
              <Activity size={14} />
              <span>Điều Chỉnh Kho (Adjust)</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Overview */}
        <div className="card-flat" style={{ padding: 20 }}>
          <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Thông Số Cuộn</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Mã Nhựa</p>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{pm?.plastic_code || '-'}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Family</p>
              <span className="badge badge--neutral">{pm?.plastic_family || '-'}</span>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Dày x Khổ</p>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{pm?.thickness_mm} x {pm?.width_mm}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Vị Trí</p>
              <p style={{ fontSize: 13 }}>{roll.location || '-'}</p>
            </div>
          </div>
          <hr style={{ margin: '16px 0', borderTop: '1px solid var(--border-default)', borderBottom: 'none' }} />
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Chiều Dài Ban Đầu</p>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{roll.nominal_length_m} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>m</span></p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Thực Tế Nhập Kho</p>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{roll.received_length_m || roll.nominal_length_m} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>m</span></p>
            </div>
            <div style={{ background: 'var(--tint-teal-bg)', padding: '8px 12px', borderRadius: 6, margin: '-8px -12px' }}>
              <p style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>Tồn Kho Hiện Tại</p>
              <p style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent)' }}>{roll.current_length_m} <span style={{ fontSize: 11, color: 'var(--accent)' }}>m</span></p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="card-flat" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Lịch Sử Điều Chỉnh (Adjustment Log)</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Thời Gian</th>
                <th style={{ width: '15%' }}>Thao Tác</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Thay Đổi (m)</th>
                <th style={{ width: '35%' }}>Lý Do / Ghi Chú</th>
                <th style={{ width: '15%' }}>Người Thực Hiện</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    Chưa có lịch sử điều chỉnh.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {new Date(log.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td>
                      <span className="badge badge--neutral font-bold">{log.action_type}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: log.change_length_m < 0 ? 'var(--status-error)' : 'var(--status-success)' }}>
                      {log.change_length_m > 0 ? '+' : ''}{log.change_length_m}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{log.note || '-'}</td>
                    <td>{log.operator_name || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
