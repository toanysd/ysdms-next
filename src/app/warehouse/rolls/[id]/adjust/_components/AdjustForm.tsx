'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Save, AlertCircle } from 'lucide-react'
import { adjustRollAction } from './actions'

export function AdjustForm({ rollId, currentLength }: { rollId: string, currentLength: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [type, setType] = useState('USE')
  const [delta, setDelta] = useState<number | ''>('')
  const [reason, setReason] = useState('')

  const calculatedNew = typeof delta === 'number' ? currentLength + delta : currentLength

  const handleSubmit = async () => {
    setErrorMsg('')
    setLoading(true)

    if (typeof delta !== 'number') {
      setErrorMsg('Vui lòng nhập chiều dài thay đổi (Delta)')
      setLoading(false)
      return
    }

    if (calculatedNew < 0) {
      setErrorMsg('Tồn kho không được âm. Vui lòng kiểm tra lại số liệu trừ.')
      setLoading(false)
      return
    }

    if (reason.length < 5) {
      setErrorMsg('Vui lòng nhập lý do (ít nhất 5 ký tự).')
      setLoading(false)
      return
    }

    const res = await adjustRollAction(rollId, delta, type, reason)
    if (res.error) {
      setErrorMsg(res.error)
      setLoading(false)
    } else {
      router.push(`/warehouse/rolls/${rollId}`)
    }
  }

  return (
    <div className="card-flat" style={{ padding: 20, maxWidth: 600 }}>
      <h2 className="text-[14px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Điều Chỉnh Kho Thủ Công</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="form-label font-bold">Loại Điều Chỉnh (*)</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="USE">Dùng vào sản xuất (USE / Trừ kho)</option>
            <option value="CORRECTION">Kiểm kê điều chỉnh (CORRECTION / +/-)</option>
            <option value="DAMAGE">Hỏng/Loại bỏ (DAMAGE / Trừ kho)</option>
            <option value="RETURN">Trả lại kho (RETURN / Cộng kho)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">Thay Đổi (Delta m) (*)</label>
            <input 
              type="number" 
              className="form-input" 
              style={{ fontFamily: 'monospace', fontWeight: 700 }}
              placeholder="-50 hoặc 20"
              value={delta} 
              onChange={e => setDelta(e.target.value ? Number(e.target.value) : '')} 
            />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Âm = Trừ, Dương = Cộng</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">Tồn Kho Mới (Dự kiến)</label>
            <div style={{ 
              padding: '8px 12px', 
              background: calculatedNew < 0 ? '#FEF2F2' : 'var(--bg-surface-2)', 
              borderRadius: 6,
              border: calculatedNew < 0 ? '1px solid #F87171' : '1px solid transparent',
              fontFamily: 'monospace', 
              fontWeight: 800,
              fontSize: 14,
              color: calculatedNew < 0 ? '#B91C1C' : 'var(--text-primary)'
            }}>
              {calculatedNew} m
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="form-label font-bold">Lý Do / Ghi Chú (*)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ghi rõ lý do điều chỉnh..."
            value={reason} 
            onChange={e => setReason(e.target.value)} 
          />
        </div>

        {errorMsg && (
          <div style={{ padding: 12, borderRadius: 6, background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

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
            disabled={loading || calculatedNew < 0}
          >
            <Save size={16} />
            <span>{loading ? 'Đang Xử Lý...' : 'Xác Nhận Điều Chỉnh'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
