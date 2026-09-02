'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Calendar, FileText, Building2, AlignLeft, AlertCircle } from 'lucide-react'
import { createReceiptAction } from '../actions'
import { useRouter } from 'next/navigation'

type MasterOption = {
  id: string
  code: string
  family: string
  thickness_mm: number
  width_mm: number
}

type SupplierOption = {
  id: string
  name: string
}

export function ReceiptForm({ plastics, suppliers }: { plastics: MasterOption[], suppliers: SupplierOption[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [header, setHeader] = useState({
    receipt_no: `RC-${Date.now().toString().slice(-6)}`,
    receipt_date: new Date().toISOString().split('T')[0],
    supplier_id: '',
    invoice_no: '',
    note: ''
  })

  const [rolls, setRolls] = useState<any[]>([])

  const addRoll = () => {
    setRolls([
      ...rolls, 
      { id: Date.now(), plastic_id: '', nominal_length_m: 0, roll_barcode: '', location: '' }
    ])
  }

  const updateRoll = (id: number, field: string, value: any) => {
    setRolls(rolls.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const removeRoll = (id: number) => {
    setRolls(rolls.filter(r => r.id !== id))
  }

  const generateRandomBarcode = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const rnd = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `RCV-${today}-${rnd}`
  }

  const handleSubmit = async () => {
    setErrorMsg('')
    setLoading(true)
    
    if (!header.receipt_no) {
      setErrorMsg('Vui lòng nhập Số Phiếu (Receipt No)')
      setLoading(false)
      return
    }
    if (rolls.length === 0) {
      setErrorMsg('Vui lòng thêm ít nhất 1 cuộn nhựa')
      setLoading(false)
      return
    }
    const invalidRolls = rolls.filter(r => !r.plastic_id || r.nominal_length_m <= 0)
    if (invalidRolls.length > 0) {
      setErrorMsg('Vui lòng điền đủ Mã Nhựa và Chiều Dài (>0) cho tất cả các cuộn')
      setLoading(false)
      return
    }

    // Auto-gen barcode if empty
    const preparedRolls = rolls.map(r => ({
      ...r,
      roll_barcode: r.roll_barcode.trim() || generateRandomBarcode()
    }))

    const res = await createReceiptAction(header, preparedRolls)
    if (res.error) {
      setErrorMsg(res.error)
      setLoading(false)
    } else {
      router.push('/warehouse/rolls')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* HEADER SECTION */}
      <div className="card-flat" style={{ padding: 20 }}>
        <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Thông Tin Phiếu Nhập</h2>
        <div className="form-grid-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">Số Phiếu (*)</label>
            <div className="relative">
              <FileText className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: 32 }}
                value={header.receipt_no} 
                onChange={e => setHeader({...header, receipt_no: e.target.value})} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">Ngày Nhập (*)</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
              <input 
                type="date" 
                className="form-input" 
                style={{ paddingLeft: 32 }}
                value={header.receipt_date} 
                onChange={e => setHeader({...header, receipt_date: e.target.value})} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Nhà Cung Cấp</label>
            <div className="relative">
              <Building2 className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
              <select 
                className="form-input" 
                style={{ paddingLeft: 32 }}
                value={header.supplier_id} 
                onChange={e => setHeader({...header, supplier_id: e.target.value})}
              >
                <option value="">-- Chọn --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label">Số Invoice</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: INV-2026..."
              value={header.invoice_no} 
              onChange={e => setHeader({...header, invoice_no: e.target.value})} 
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
          <label className="form-label">Ghi chú</label>
          <div className="relative">
            <AlignLeft className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: 32 }}
              value={header.note} 
              onChange={e => setHeader({...header, note: e.target.value})} 
            />
          </div>
        </div>
      </div>

      {/* LINE ITEMS SECTION */}
      <div className="card-flat" style={{ padding: 20 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Danh Sách Cuộn Nhựa</h2>
          <button className="btn btn-secondary flex items-center gap-1.5 cursor-pointer" onClick={addRoll}>
            <Plus size={14} />
            <span>Thêm Cuộn</span>
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Mã Nhựa (Plastic)</th>
              <th style={{ width: '25%' }}>Mã Barcode Cuộn (Bỏ trống = Tự động)</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Chiều Dài (m)</th>
              <th style={{ width: '15%' }}>Vị Trí (Location)</th>
              <th style={{ width: '5%', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {rolls.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                  Chưa có cuộn nào. Bấm "Thêm Cuộn" để bắt đầu.
                </td>
              </tr>
            ) : (
              rolls.map((r, index) => (
                <tr key={r.id}>
                  <td>
                    <select 
                      className="form-input" 
                      style={{ fontSize: 13, fontFamily: 'monospace' }}
                      value={r.plastic_id} 
                      onChange={e => updateRoll(r.id, 'plastic_id', e.target.value)}
                    >
                      <option value="">-- Chọn Loại Nhựa --</option>
                      {plastics.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.code} ({p.family} - {p.thickness_mm}x{p.width_mm})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: 13, fontFamily: 'monospace' }}
                      placeholder="RCV-2026..."
                      value={r.roll_barcode} 
                      onChange={e => updateRoll(r.id, 'roll_barcode', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ fontSize: 13, fontFamily: 'monospace', textAlign: 'right' }}
                      value={r.nominal_length_m || ''} 
                      onChange={e => updateRoll(r.id, 'nominal_length_m', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: 13 }}
                      value={r.location} 
                      onChange={e => updateRoll(r.id, 'location', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      onClick={() => removeRoll(r.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {errorMsg && (
        <div style={{ padding: 12, borderRadius: 6, background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button 
          className="btn btn-secondary cursor-pointer" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Hủy Bỏ
        </button>
        <button 
          className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          <span>{loading ? 'Đang Lưu...' : 'Hoàn Tất Nhập Kho'}</span>
        </button>
      </div>
    </div>
  )
}
