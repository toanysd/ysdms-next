'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, PackageCheck, AlertCircle, RefreshCw, Barcode } from 'lucide-react'
import { createPlasticReceiptAction, RollInput } from '../../actions'

interface PlasticMasterItem {
  plastic_id: string
  plastic_code: string
  plastic_family: string
  thickness_mm: number
  width_mm: number
  standard_length_m: number | null
}

interface RollRowItem extends RollInput {
  rowId: string
}

function generateBarcode(prefix: string, index: number) {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rnd = Math.floor(100 + Math.random() * 900)
  return `ROLL-${yy}${mm}${dd}-${rnd}-${index + 1}`
}

function generateReceiptNo() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rnd = Math.floor(1000 + Math.random() * 9000)
  return `RC-${yy}${mm}${dd}-${rnd}`
}

export function ReceiptForm({ plastics }: { plastics: PlasticMasterItem[] }) {
  const router = useRouter()

  // Header State
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().split('T')[0])
  const [receiptNo, setReceiptNo] = useState(() => generateReceiptNo())
  const [supplierName, setSupplierName] = useState('')
  const [note, setNote] = useState('')

  // Rolls State
  const [rolls, setRolls] = useState<RollRowItem[]>(() => [
    {
      rowId: 'row-1',
      roll_barcode: generateBarcode('ROLL', 0),
      plastic_id: plastics[0]?.plastic_id || '',
      received_length_m: plastics[0]?.standard_length_m || 350,
      lot_no: '',
      location: '本社',
    },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddRoll = () => {
    const nextIdx = rolls.length
    const defaultPlastic = plastics[0]
    const newRow: RollRowItem = {
      rowId: `row-${Date.now()}-${nextIdx}`,
      roll_barcode: generateBarcode('ROLL', nextIdx),
      plastic_id: defaultPlastic?.plastic_id || '',
      received_length_m: defaultPlastic?.standard_length_m || 350,
      lot_no: '',
      location: rolls[rolls.length - 1]?.location || '本社',
    }
    setRolls([...rolls, newRow])
  }

  const handleRemoveRoll = (rowId: string) => {
    if (rolls.length <= 1) return
    setRolls(rolls.filter((r) => r.rowId !== rowId))
  }

  const handleRollChange = (rowId: string, field: keyof RollInput, value: any) => {
    setRolls((prev) =>
      prev.map((r) => {
        if (r.rowId !== rowId) return r
        const updated = { ...r, [field]: value }

        // If plastic_id changed, auto-fill standard length if available
        if (field === 'plastic_id') {
          const matched = plastics.find((p) => p.plastic_id === value)
          if (matched && matched.standard_length_m) {
            updated.received_length_m = matched.standard_length_m
          }
        }
        return updated
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await createPlasticReceiptAction({
        receipt_no: receiptNo,
        receipt_date: receiptDate,
        supplier_name: supplierName,
        note,
        rolls: rolls.map((r) => ({
          roll_barcode: r.roll_barcode,
          plastic_id: r.plastic_id,
          received_length_m: Number(r.received_length_m),
          lot_no: r.lot_no,
          location: r.location,
        })),
      })

      if (!res.success) {
        setError(res.error || '入荷登録に失敗しました')
      } else {
        router.push('/plastics/inventory')
      }
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err?.message || '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const totalMeters = rolls.reduce((sum, r) => sum + (Number(r.received_length_m) || 0), 0)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs font-bold text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Step 1: Thông tin phiếu nhập (plastic_receipt) ── */}
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <PackageCheck size={16} color="var(--accent)" />
          <span>ステップ 1: 入荷伝票基本情報 (Receipt Header)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              入荷日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              className="form-input text-xs w-full"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              納品書No / 入荷伝票No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={receiptNo}
              onChange={(e) => setReceiptNo(e.target.value)}
              className="form-input text-xs font-mono font-bold w-full"
              placeholder="RC-XXXXXX"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              仕入先メーカー / 商社
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="form-input text-xs w-full"
              placeholder="例: 吉田樹脂株式会社"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              特記事項・備考
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input text-xs w-full"
              placeholder="パレット納品、検収備考など"
            />
          </div>
        </div>
      </div>

      {/* ── Step 2: Chi tiết từng cuộn (plastic_receipt_roll) ── */}
      <div className="border border-slate-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Barcode size={16} color="var(--accent)" />
            <span>ステップ 2: ロール受入明細 (Roll Items: {rolls.length} 本)</span>
          </h2>
          <button
            type="button"
            onClick={handleAddRoll}
            className="btn btn-secondary text-xs px-2.5 py-1 h-auto flex items-center gap-1 font-bold"
          >
            <Plus size={14} />
            <span>ロールを追加</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full text-xs">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>No</th>
                <th style={{ width: 170 }}>バーコード (Roll Barcode) *</th>
                <th>原料規格・材質 (Plastic Spec) *</th>
                <th style={{ width: 120, textAlign: 'right' }}>受入長 (m) *</th>
                <th style={{ width: 130 }}>ロットNo (Lot#)</th>
                <th style={{ width: 110 }}>保管場所</th>
                <th style={{ width: 45, textAlign: 'center' }}>削除</th>
              </tr>
            </thead>
            <tbody>
              {rolls.map((r, idx) => (
                <tr key={r.rowId}>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace', color: '#64748B' }}>
                    {idx + 1}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={r.roll_barcode}
                      onChange={(e) => handleRollChange(r.rowId, 'roll_barcode', e.target.value)}
                      className="form-input text-xs font-mono font-bold w-full"
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={r.plastic_id}
                      onChange={(e) => handleRollChange(r.rowId, 'plastic_id', e.target.value)}
                      className="form-select text-xs w-full"
                      required
                    >
                      {plastics.map((p) => (
                        <option key={p.plastic_id} value={p.plastic_id}>
                          {p.plastic_code} ({p.thickness_mm}t × {p.width_mm}mm)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={r.received_length_m}
                      onChange={(e) => handleRollChange(r.rowId, 'received_length_m', e.target.value)}
                      className="form-input text-xs font-mono font-bold text-right w-full"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={r.lot_no || ''}
                      onChange={(e) => handleRollChange(r.rowId, 'lot_no', e.target.value)}
                      className="form-input text-xs font-mono w-full"
                      placeholder="メーカーLot"
                    />
                  </td>
                  <td>
                    <select
                      value={r.location || '本社'}
                      onChange={(e) => handleRollChange(r.rowId, 'location', e.target.value)}
                      className="form-select text-xs w-full"
                    >
                      <option value="本社">本社工場</option>
                      <option value="青森">青森工場</option>
                      <option value="倉庫A">外部倉庫A</option>
                      <option value="未指定">未指定</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoll(r.rowId)}
                      disabled={rolls.length <= 1}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-30 transition-colors p-1"
                      title="この行を削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Summary Bar & Actions ── */}
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-slate-300">
        <div className="flex items-center gap-6 text-xs font-mono font-bold text-slate-700">
          <span>受入ロール総数: <strong className="text-slate-900 text-sm">{rolls.length}</strong> 本</span>
          <span>受入合計メートル: <strong className="text-teal-700 text-sm">{totalMeters.toLocaleString()}</strong> m</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary text-xs px-3 py-1.5 h-auto font-bold"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-xs px-4 py-2 h-auto flex items-center gap-1.5 font-bold"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{loading ? '登録中...' : '入荷登録を確定する →'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
