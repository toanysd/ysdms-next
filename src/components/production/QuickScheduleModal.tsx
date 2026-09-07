'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X,
  Calendar,
  Clock,
  Package,
  Layers,
  User,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PlusCircle,
} from 'lucide-react'

interface QuickScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function QuickScheduleModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickScheduleModalProps) {
  const supabase = createClient()

  // Form states
  const todayStr = new Date().toISOString().split('T')[0]
  const [machineId, setMachineId] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [workOrderId, setWorkOrderId] = useState<string>('')
  const [rollId, setRollId] = useState<string>('')
  const [operatorId, setOperatorId] = useState<string>('')
  const [scheduleDate, setScheduleDate] = useState<string>(todayStr)
  const [shift, setShift] = useState<'DAY' | 'NIGHT'>('DAY')
  const [plannedQty, setPlannedQty] = useState<number>(5000)
  const [notes, setNotes] = useState<string>('')

  // Dropdown options
  const [machines, setMachines] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [rolls, setRolls] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Submission state
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Load dropdown sources when modal opens
  useEffect(() => {
    if (!isOpen) return

    async function loadOptions() {
      // 1. Machines
      const { data: mData } = await supabase
        .from('machines')
        .select('machine_id, machine_code, machine_name')
        .eq('is_active', true)
        .order('machine_code')
      if (mData && mData.length > 0) {
        setMachines(mData)
        if (!machineId) setMachineId(mData[0].machine_id)
      }

      // 2. Products
      const { data: pData } = await supabase
        .from('products')
        .select('product_id, product_code, product_name_internal')
        .limit(50)
      if (pData) setProducts(pData)

      // 3. Work Orders
      const { data: woData } = await supabase
        .from('work_orders')
        .select('wo_id, wo_code, wo_name')
        .limit(50)
      if (woData) setWorkOrders(woData)

      // 4. Rolls
      const { data: rData } = await supabase
        .from('plastic_receipt_roll')
        .select('id, roll_barcode, commercial_grade_code, current_length_m')
        .in('status', ['in_stock', 'in_use', 'IN_USE', 'AVAILABLE'])
        .limit(50)
      if (rData) setRolls(rData)

      // 5. Employees
      const { data: eData } = await supabase
        .from('employees')
        .select('employee_id, employee_name, employee_name_short')
        .limit(20)
      if (eData) setEmployees(eData)
    }

    loadOptions()
  }, [isOpen, machineId, supabase])

  if (!isOpen) return null

  // Calculate start & end ISO timestamps based on shift
  // TODO(future): multi-shift support — add shift selector when night shift is introduced
  const calculateShiftTimes = (date: string) => {
    return {
      start: `${date}T08:00:00+09:00`,
      end: `${date}T17:00:00+09:00`,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!machineId) {
      setErrorMsg('成型機を選択してください')
      return
    }
    if (!scheduleDate) {
      setErrorMsg('予定日を選択してください')
      return
    }

    setLoading(true)
    const times = calculateShiftTimes(scheduleDate)

    const insertPayload = {
      machine_id: machineId,
      product_id: productId || null,
      work_order_id: workOrderId || null,
      roll_id: rollId || null,
      operator_id: operatorId || null,
      schedule_date: scheduleDate,
      scheduled_start: times.start,
      scheduled_end: times.end,
      shift,
      planned_quantity: plannedQty || 0,
      actual_quantity: 0,
      status: 'PLANNED',
      notes: notes.trim() || null,
    }

    const { data, error } = await supabase.from('production_schedules').insert(insertPayload).select()

    if (error) {
      console.error('Insert error:', error)
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onSuccess()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 8,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusCircle size={18} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
              成型指示・スケジュール新規登録 (Quick Schedule)
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div style={{ margin: '12px 18px 0', padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, color: '#DC2626', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Row 1: Machine & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                対象成型機 <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                className="form-input text-xs w-full"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                required
              >
                {machines.map((m) => (
                  <option key={m.machine_id} value={m.machine_id}>
                    {m.machine_code} ({m.machine_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                成型予定日 <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input text-xs w-full"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2: Planned Qty (shift locked to day per PO decision) */}
          {/* TODO(future): multi-shift support — add shift selector when night shift is introduced */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
              計画数量 (枚) <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="number"
              step="500"
              className="form-input text-xs w-full"
              value={plannedQty}
              onChange={(e) => setPlannedQty(parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Row 3: Product & Work Order */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                成型品番 (Product)
              </label>
              <select
                className="form-input text-xs w-full"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">-- 指定なし / 後で指定 --</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_code} ({p.product_name_internal || ''})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                製造指示No (WO)
              </label>
              <select
                className="form-input text-xs w-full"
                value={workOrderId}
                onChange={(e) => setWorkOrderId(e.target.value)}
              >
                <option value="">-- 指示なし --</option>
                {workOrders.map((wo) => (
                  <option key={wo.wo_id} value={wo.wo_id}>
                    {wo.wo_code} {wo.wo_name ? `(${wo.wo_name})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Plastic Roll & Operator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                引当原反ロール
              </label>
              <select
                className="form-input text-xs w-full"
                value={rollId}
                onChange={(e) => setRollId(e.target.value)}
              >
                <option value="">-- 未割当 / 自動引当 --</option>
                {rolls.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roll_barcode} ({r.commercial_grade_code || 'PET'} / 残{r.current_length_m}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                担当オペレーター
              </label>
              <select
                className="form-input text-xs w-full"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
              >
                <option value="">-- 未割当 --</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name} {emp.employee_name_short ? `(${emp.employee_name_short})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
              特記事項・備考
            </label>
            <input
              type="text"
              placeholder="試作・特急品・金型調整など"
              className="form-input text-xs w-full"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary text-xs px-4 py-1.5 h-auto font-bold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-xs px-5 py-1.5 h-auto font-bold flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>登録中...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>スケジュールを登録</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
