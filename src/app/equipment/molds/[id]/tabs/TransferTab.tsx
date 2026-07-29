import { Truck, Calendar, Building2, ArrowRight, Plus } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { MoldDetailData } from '../page'

type ShipLog = {
  ship_id: string
  ship_date: string | null
  ship_status: string | null
  ship_item_name: string | null
  notes: string | null
  created_at: string | null
  from_company?: { company_name: string; company_code: string } | null
  to_company?: { company_name: string; company_code: string } | null
}

type Company = {
  company_id: string
  company_code: string
  company_name: string
}

export function TransferTab({ mold }: { mold: MoldDetailData }) {
  const locale = useLocale()
  const isVi = locale === 'vi'
  const supabase = createClient()
  const [shipLogs, setShipLogs] = useState<ShipLog[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedToCompany, setSelectedToCompany] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStatus, setSelectedStatus] = useState('SHIPPED')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('equipment_ship_logs')
      .select(`
        *,
        from_company:companies!equipment_ship_logs_from_company_id_fkey(company_name, company_code),
        to_company:companies!equipment_ship_logs_to_company_id_fkey(company_name, company_code)
      `)
      .eq('physical_mold_id', mold.physical_mold_id)
      .order('ship_date', { ascending: false })
      .range(0, 49)
    setShipLogs((data as any[]) || [])
    setLoading(false)
  }, [mold.physical_mold_id, supabase])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const openTransferModal = async () => {
    setModalOpen(true)
    setSelectedToCompany('')
    setSelectedDate(new Date().toISOString().split('T')[0])
    setSelectedStatus('SHIPPED')
    setNotes('')
    
    if (companies.length === 0) {
      const { data } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .eq('is_active', true)
        .order('company_name')
      if (data) {
        setCompanies(data)
      }
    }
  }

  const handleCreateTransfer = async () => {
    if (!selectedToCompany) return alert('移動先は必須です / Vui lòng chọn điểm đến')
    if (selectedToCompany === mold.keeper_company_id) return alert('移動先が出発元と同じです / Điểm đến trùng với điểm đi')
    setSaving(true)

    const { error: shipErr } = await supabase.from('equipment_ship_logs').insert({
      physical_mold_id: mold.physical_mold_id,
      from_company_id: mold.keeper_company_id,
      to_company_id: selectedToCompany,
      ship_date: selectedDate,
      ship_status: selectedStatus,
      ship_item_name: mold.display_name,
      notes: notes || null,
    })

    if (!shipErr) {
      const { error: moldErr } = await supabase
        .from('physical_molds')
        .update({ keeper_company_id: selectedToCompany })
        .eq('physical_mold_id', mold.physical_mold_id)

      if (!moldErr) {
        setModalOpen(false)
        window.location.reload()
      } else {
        alert(moldErr.message)
        setSaving(false)
      }
    } else {
      alert(shipErr.message)
      setSaving(false)
    }
  }

  return (
    <div className="card-flat" style={{ padding: 0 }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
          <Truck size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
          移動履歴 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Lịch sử vận chuyển</span>
        </h3>
        <button
          className="btn btn-secondary"
          style={{ height: 26, padding: '0 8px', fontSize: 11 }}
          onClick={openTransferModal}
        >
          <Plus size={12} />
          <span>新規移動作成 / Tạo di chuyển mới</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-2)' }}>
              {[
                { ja: '日付', vi: 'Ngày', w: 90 },
                { ja: '出発元', vi: 'Từ', w: 150 },
                { ja: '', vi: '', w: 30 },
                { ja: '移動先', vi: 'Đến', w: 150 },
                { ja: 'ステータス', vi: 'Status', w: 80 },
                { ja: '備考', vi: 'Ghi chú', w: 150 },
              ].map(h => (
                <th key={h.ja + h.vi} style={{
                  padding: '6px 10px', textAlign: 'left', fontSize: 10,
                  fontWeight: 700, color: 'var(--text-secondary)', width: h.w,
                  fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-default)',
                }}>
                  {isVi ? h.vi : h.ja}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>読み込み中...</td></tr>
            ) : shipLogs.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{isVi ? 'Không có dữ liệu' : '記録なし'}</td></tr>
            ) : (
              shipLogs.map(log => (
                <tr key={log.ship_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '5px 10px', fontSize: 11, color: 'var(--text-primary)' }}>
                    {log.ship_date ? new Date(log.ship_date).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: 11 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Building2 size={10} style={{ color: 'var(--text-muted)' }} />
                      {log.from_company?.company_name || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '5px 10px', textAlign: 'center' }}>
                    <ArrowRight size={12} style={{ color: 'var(--accent)' }} />
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Building2 size={10} />
                      {log.to_company?.company_name || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: 10, color: 'var(--text-secondary)' }}>
                    {log.ship_status || '—'}
                  </td>
                  <td style={{ padding: '5px 10px', fontSize: 10, color: 'var(--text-muted)' }}>
                    {log.notes || ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[400px]" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                新規移動作成 (Tạo di chuyển mới)
              </h3>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>出発元 / Từ (from_company) <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={mold.keeper_company ? `${mold.keeper_company.company_code} - ${mold.keeper_company.company_name}` : '未登録 (Chưa đăng ký)'}
                  readOnly
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>移動先 / Đến (to_company) <span style={{ color: 'red' }}>*</span></label>
                <select className="form-select" value={selectedToCompany} onChange={e => setSelectedToCompany(e.target.value)}>
                  <option value="">選択してください</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_code} - {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>移動日 / Ngày di chuyển <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>ステータス / Trạng thái</label>
                <select className="form-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="SHIPPED">輸送中 (SHIPPED)</option>
                  <option value="ARRIVED">到着済 (ARRIVED)</option>
                  <option value="PENDING">保留中 (PENDING)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>備考 / Ghi chú</label>
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateTransfer} disabled={saving}>
                {saving ? '保存中...' : '保存 / Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
