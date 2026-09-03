'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, RefreshCw, Layers, ArrowRight, CheckCircle2 } from 'lucide-react'
import { consumePlasticRollAction } from '../../actions'

interface RollOption {
  id: string
  roll_barcode: string
  current_length_m: number
  nominal_length_m: number
  status: string
  location: string
  plastic_master?: {
    plastic_id: string
    plastic_code: string
    thickness_mm: number
    width_mm: number
  }
}

interface WorkOrderOption {
  wo_id: string
  wo_code: string
  wo_name: string
  wo_status: string
}

export function ConsumeForm({
  rolls,
  workOrders,
  preselectedRollId,
}: {
  rolls: RollOption[]
  workOrders: WorkOrderOption[]
  preselectedRollId?: string
}) {
  const router = useRouter()

  // Form State
  const [selectedRollId, setSelectedRollId] = useState<string>(
    preselectedRollId || rolls[0]?.id || ''
  )
  const [consumedAt, setConsumedAt] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [consumedMeters, setConsumedMeters] = useState<number | ''>(50)
  const [selectedWoId, setSelectedWoId] = useState<string>('')
  const [operatorName, setOperatorName] = useState<string>('')
  const [note, setNote] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Selected roll info
  const currentRoll = useMemo(() => {
    return rolls.find((r) => r.id === selectedRollId)
  }, [rolls, selectedRollId])

  const maxAvailable = currentRoll?.current_length_m || 0
  const consumedNum = Number(consumedMeters) || 0
  const remainingAfter = Math.max(0, maxAvailable - consumedNum)
  const isOver = consumedNum > maxAvailable

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!selectedRollId) {
      setError('ロールを選択してください。')
      return
    }
    if (consumedNum <= 0) {
      setError('消費量は1m以上の数値を入力してください。')
      return
    }
    if (isOver) {
      setError(`消費量(${consumedNum}m)が現在残量(${maxAvailable}m)を超えています。`)
      return
    }

    setLoading(true)

    try {
      const matchedWO = workOrders.find((w) => w.wo_id === selectedWoId)

      const res = await consumePlasticRollAction({
        roll_id: selectedRollId,
        consumed_m: consumedNum,
        consumed_at: consumedAt ? new Date(consumedAt).toISOString() : new Date().toISOString(),
        wo_id: selectedWoId || undefined,
        wo_code: matchedWO?.wo_code || undefined,
        operator_name: operatorName.trim() || undefined,
        note: note.trim() || undefined,
      })

      if (!res.success) {
        setError(res.error || '消費の記録に失敗しました')
      } else {
        setSuccessMsg(`消費を記録しました。残量: ${res.newLength}m (${res.newStatus === 'empty' ? '空・消費済' : '使用中'})`)
        setTimeout(() => {
          router.push('/plastics/inventory')
        }, 1200)
      }
    } catch (err: any) {
      console.error('Consume submit error:', err)
      setError(err?.message || '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs font-bold text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-xs font-bold text-emerald-700">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── 1. Chọn cuộn nhựa & xem hiện trạng ── */}
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <label className="text-xs font-bold text-slate-700 block mb-1">
          消費対象ロール (Target Roll) <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedRollId}
          onChange={(e) => {
            setSelectedRollId(e.target.value)
            setError(null)
          }}
          className="form-select text-xs font-mono font-bold w-full"
          required
        >
          {rolls.map((r) => {
            const m = r.plastic_master
            return (
              <option key={r.id} value={r.id}>
                {r.roll_barcode} ── {m?.plastic_code || '標準規格'} ({m?.thickness_mm || '—'}t × {m?.width_mm || '—'}mm) │ 残量: {r.current_length_m}m │ [{r.location}]
              </option>
            )
          })}
        </select>

        {currentRoll && (
          <div className="mt-3 p-3 bg-white rounded-md border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={16} color="var(--accent)" />
                <span className="text-xs font-bold text-slate-900">{currentRoll.roll_barcode}</span>
                <span className="text-xs text-slate-500">
                  {currentRoll.plastic_master?.plastic_code} ({currentRoll.plastic_master?.thickness_mm}t × {currentRoll.plastic_master?.width_mm}mm)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">保管場所: {currentRoll.location}</span>
            </div>

            {/* Meter Gauge */}
            <div className="flex items-center justify-between text-xs font-mono mt-1">
              <span>受入当初: <strong>{currentRoll.nominal_length_m}</strong>m</span>
              <span>現在残量: <strong className="text-teal-700">{maxAvailable}</strong>m</span>
              <span>消費後残量: <strong className={isOver ? 'text-red-600' : 'text-slate-900'}>{remainingAfter}</strong>m</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-300">
              <div
                style={{
                  width: `${Math.min(100, (remainingAfter / (currentRoll.nominal_length_m || 1)) * 100)}%`,
                  background: remainingAfter <= 50 ? '#DC2626' : 'var(--accent)',
                }}
                className="h-full transition-all"
              />
              <div
                style={{
                  width: `${Math.min(100, (consumedNum / (currentRoll.nominal_length_m || 1)) * 100)}%`,
                  background: isOver ? '#EF4444' : '#F59E0B',
                }}
                className="h-full transition-all opacity-80"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Số mét tiêu hao & preset ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            消費量 (Consumed Meters) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={maxAvailable}
              step={1}
              value={consumedMeters}
              onChange={(e) => setConsumedMeters(e.target.value === '' ? '' : Number(e.target.value))}
              className={`form-input text-sm font-mono font-bold w-full ${isOver ? 'border-red-500 text-red-600' : ''}`}
              placeholder="例: 80"
              required
            />
            <span className="text-xs font-bold text-slate-600">メートル (m)</span>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[11px] text-slate-500">クイック選択:</span>
            {[30, 50, 100, 150, 200].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setConsumedMeters(Math.min(maxAvailable, m))}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-mono font-bold transition-colors"
              >
                +{m}m
              </button>
            ))}
            <button
              type="button"
              onClick={() => setConsumedMeters(maxAvailable)}
              className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold transition-colors"
            >
              全量 ({maxAvailable}m)
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            消費日時 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={consumedAt}
            onChange={(e) => setConsumedAt(e.target.value)}
            className="form-input text-xs w-full"
            required
          />
        </div>
      </div>

      {/* ── 3. Liên kết WO & người vận hành ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            関連製造指示 (Work Order) — 任意
          </label>
          <select
            value={selectedWoId}
            onChange={(e) => setSelectedWoId(e.target.value)}
            className="form-select text-xs w-full"
          >
            <option value="">-- 製造指示なし (一般・試験・ロス消費) --</option>
            {workOrders.map((w) => (
              <option key={w.wo_id} value={w.wo_id}>
                {w.wo_code} : {w.wo_name} [{w.wo_status}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            記録担当者 / オペレーター
          </label>
          <input
            type="text"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            className="form-input text-xs w-full"
            placeholder="例: 佐藤 / 工場長"
          />
        </div>
      </div>

      {/* ── 4. Ghi chú ── */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          消費備考・理由 (Notes)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="form-textarea text-xs w-full"
          placeholder="成型機No.2にて本生産に使用、立ち上げ調整ロス約15m含む..."
        />
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary text-xs px-3 py-1.5 h-auto font-bold"
        >
          キャンセル
        </button>

        <button
          type="submit"
          disabled={loading || isOver}
          className="btn btn-primary text-xs px-4 py-2 h-auto flex items-center gap-1.5 font-bold disabled:opacity-50"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{loading ? '記録中...' : '消費を記録する →'}</span>
        </button>
      </div>
    </form>
  )
}
