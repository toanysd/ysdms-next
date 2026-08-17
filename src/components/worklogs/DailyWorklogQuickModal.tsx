'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { X, Printer, FileDown, Calendar, User, Loader2, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { DailyWorklogA4Sheet, PRICE_MAP, NippoItem } from '@/components/worklogs/DailyWorklogA4Sheet'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

type Props = {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
  initialEmployeeId?: string
}

type Employee = {
  employee_id: string
  employee_name: string
  employee_name_short: string | null
  employee_code: string | null
}

type WorkLog = {
  log_id: string
  work_date: string
  hours_spent: number | null
  notes: string | null
  job_id: string | null
  job_step_id: string | null
  employee_id: string | null
  processing_code_id: number | null
  processing_codes: {
    processing_code_id: number
    processing_name: string
  } | null
  jobs: {
    job_id: string
    job_code: string
    job_name: string
    physical_molds: { equipment_code: string } | null
    products: { product_code: string } | null
  } | null
}

const STORAGE_KEY_LAST_WORKER = 'ysdms_last_selected_worker_id'
const QUICK_HOURS = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0]

export function DailyWorklogQuickModal({
  isOpen,
  onClose,
  initialDate,
  initialEmployeeId,
}: Props) {
  const supabase = createClient()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [jobsList, setJobsList] = useState<{ value: string; label: string }[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ value: string; label: string }[]>([])
  const [rawCodes, setRawCodes] = useState<any[]>([])

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  )
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(initialEmployeeId || '')
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(false)

  // Edit Single Log State
  const [editingLog, setEditingLog] = useState<{
    log_id: string
    work_date: string
    employee_id: string
    job_id: string
    processing_code_id: string
    hours_spent: string
    notes: string
  } | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  // 1. Fetch Reference Data (Employees, Jobs, Processing Codes)
  useEffect(() => {
    if (!isOpen) return
    async function fetchRefData() {
      const [
        { data: empData },
        { data: jData },
        { data: codeData }
      ] = await Promise.all([
        supabase.from('employees').select('employee_id, employee_name, employee_name_short, employee_code').eq('is_active', true).order('employee_name'),
        supabase.from('jobs').select('job_id, job_code, job_name, job_category').neq('job_status', 'CANCELLED').order('job_code'),
        supabase.from('processing_codes').select('processing_code_id, processing_name').eq('is_active', true).order('processing_code_id')
      ])

      if (empData && empData.length > 0) {
        setEmployees(empData)
        const lastEmpId = localStorage.getItem(STORAGE_KEY_LAST_WORKER)
        if (initialEmployeeId && empData.some(e => e.employee_id === initialEmployeeId)) {
          setSelectedEmployeeId(initialEmployeeId)
        } else if (lastEmpId && empData.some(e => e.employee_id === lastEmpId)) {
          setSelectedEmployeeId(lastEmpId)
        } else {
          setSelectedEmployeeId(empData[0].employee_id)
        }
      }

      if (jData) {
        const sorted = [...jData].sort((a, b) => {
          const aIsInternal = a.job_code === '社内作業' || a.job_category === 'INTERNAL_OPS'
          const bIsInternal = b.job_code === '社内作業' || b.job_category === 'INTERNAL_OPS'
          if (aIsInternal && !bIsInternal) return -1
          if (!aIsInternal && bIsInternal) return 1
          return (a.job_code || '').localeCompare(b.job_code || '')
        })
        setJobsList(sorted.map(j => ({
          value: j.job_id,
          label: j.job_code === '社内作業' || j.job_category === 'INTERNAL_OPS'
            ? `📌 [${j.job_code}] ${j.job_name}`
            : `[${j.job_code}] ${j.job_name}`
        })))
      }

      if (codeData) {
        setRawCodes(codeData)
        setProcessingCodes(codeData.map(c => ({
          value: String(c.processing_code_id),
          label: `[${c.processing_code_id}] ${c.processing_name}`
        })))
      }
    }
    fetchRefData()
  }, [isOpen, initialEmployeeId, supabase])

  // 2. Fetch logs when date or employee changes
  const fetchLogs = useCallback(async () => {
    if (!selectedDate || !selectedEmployeeId) return

    setLoading(true)
    const { data } = await supabase
      .from('work_logs')
      .select(`
        log_id, work_date, hours_spent, notes, job_id, job_step_id, employee_id, processing_code_id,
        processing_codes(processing_code_id, processing_name),
        jobs(
          job_id,
          job_code,
          job_name,
          physical_molds:equipment_id(equipment_code),
          products:product_id(product_code)
        )
      `)
      .eq('work_date', selectedDate)
      .eq('employee_id', selectedEmployeeId)
      .order('created_at', { ascending: true })

    if (data) {
      setLogs(data as unknown as WorkLog[])
    }
    setLoading(false)
  }, [selectedDate, selectedEmployeeId, supabase])

  useEffect(() => {
    if (isOpen && selectedDate && selectedEmployeeId) {
      fetchLogs()
    }
  }, [isOpen, selectedDate, selectedEmployeeId, fetchLogs])

  const handleEmployeeChange = (empId: string) => {
    setSelectedEmployeeId(empId)
    if (empId) {
      localStorage.setItem(STORAGE_KEY_LAST_WORKER, empId)
    }
  }

  // 3. Trigger Edit Modal for a clicked row
  const handleEditRow = (item: NippoItem) => {
    const targetLog = logs.find(l => l.log_id === item.log_id)
    if (!targetLog) return

    setEditingLog({
      log_id: targetLog.log_id,
      work_date: targetLog.work_date || selectedDate,
      employee_id: targetLog.employee_id || selectedEmployeeId,
      job_id: targetLog.job_id || '',
      processing_code_id: targetLog.processing_code_id ? String(targetLog.processing_code_id) : '',
      hours_spent: targetLog.hours_spent ? String(targetLog.hours_spent) : '1.0',
      notes: targetLog.notes || '',
    })
  }

  // 4. Save Edited Log
  const handleSaveEditedLog = async () => {
    if (!editingLog) return
    const hours = parseFloat(editingLog.hours_spent)
    if (!hours || isNaN(hours) || hours <= 0) {
      alert('作業時間を正しく入力してください')
      return
    }

    let codeId: number | null = null
    let desc: string | null = null
    if (editingLog.processing_code_id) {
      codeId = parseInt(editingLog.processing_code_id)
      const matched = rawCodes.find(c => c.processing_code_id === codeId)
      if (matched) desc = matched.processing_name
    }

    setSavingEdit(true)
    try {
      const payload: any = {
        work_date: editingLog.work_date,
        employee_id: editingLog.employee_id,
        job_id: editingLog.job_id || null,
        processing_code_id: codeId,
        description: desc,
        hours_spent: hours,
        notes: editingLog.notes.trim() || null,
      }

      const { error } = await supabase
        .from('work_logs')
        .update(payload)
        .eq('log_id', editingLog.log_id)

      if (error) throw error

      setEditingLog(null)
      fetchLogs()
    } catch (err: any) {
      alert('保存エラー: ' + err.message)
    } finally {
      setSavingEdit(false)
    }
  }

  // 5. Delete Log
  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm('この日報明細を削除してもよろしいですか？')) return
    const { error } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (!error) {
      if (editingLog?.log_id === logId) setEditingLog(null)
      fetchLogs()
    }
  }

  // 6. Print / PDF Handler
  const handlePrint = (isPdf = false) => {
    const printContent = document.getElementById('daily-worklog-quick-sheet')
    if (!printContent) return

    const printWin = window.open('', '_blank', 'width=1050,height=800')
    if (!printWin) return

    const empObj = employees.find(e => e.employee_id === selectedEmployeeId)
    const empName = empObj ? empObj.employee_name : '担当者'

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>日報記録書_${empName}_${selectedDate}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              font-family: "MS PGothic", "Meiryo", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .nippo-a4-sheet {
              transform: none !important;
              box-shadow: none !important;
              border: none !important;
              padding: 22mm 12mm 20mm 12mm !important;
              width: 100% !important;
              height: 100% !important;
              box-sizing: border-box !important;
              page-break-inside: avoid;
            }
            .nippo-row-actions {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            }
            window.onafterprint = function() {
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWin.document.close()

    alert(`【印刷完了】\n日報記録書の印刷・PDF出力処理が完了しました。\n（対象: ${empName}様・${selectedDate}）`)
  }

  const selectedEmployeeName = useMemo(() => {
    const emp = employees.find(e => e.employee_id === selectedEmployeeId)
    return emp ? emp.employee_name : ''
  }, [employees, selectedEmployeeId])

  const totalHours = useMemo(() => {
    return Math.round(logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0) * 100) / 100
  }, [logs])

  const getModelCode = (log: WorkLog) => {
    if (!log.jobs) return '-'
    if (log.jobs.job_code === '社内作業') return '社内作業'
    if (log.jobs.physical_molds?.equipment_code) return log.jobs.physical_molds.equipment_code
    if (log.jobs.products?.product_code) return log.jobs.products.product_code
    return log.jobs.job_code
  }

  const nippoItems: NippoItem[] = useMemo(() => {
    return logs.map(l => {
      const pName = l.processing_codes?.processing_name || ''
      return {
        log_id: l.log_id,
        work_date: l.work_date,
        job_id: l.job_id || undefined,
        processing_code_id: l.processing_code_id || undefined,
        model_code: getModelCode(l),
        processing_name: pName,
        notes: l.notes || '',
        hours_spent: l.hours_spent,
        price_value: PRICE_MAP[pName] || ''
      }
    })
  }, [logs])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: 'var(--bg-surface)',
          borderRadius: 8,
          boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '96vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ── Header Toolbar ── */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: '#fff',
                border: '1px solid var(--tint-teal-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Printer size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                日報記録書の確認・直接編集・印刷
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                各行をクリックして直接編集（作業日・工数・内容の変更、削除）が可能です
              </div>
            </div>
          </div>

          {/* Quick Filter Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Date Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Worker Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border-default)', minWidth: 160 }}>
              <User size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  background: 'transparent',
                }}
              >
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    [{emp.employee_code || '—'}] {emp.employee_name_short || emp.employee_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Badge */}
            <div
              className="font-mono font-bold"
              style={{
                fontSize: 12,
                background: 'var(--tint-teal-bg)',
                color: 'var(--accent)',
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--tint-teal-border)',
                whiteSpace: 'nowrap',
              }}
            >
              本日合計: {totalHours} H ({logs.length}件)
            </div>

            {/* Print Buttons */}
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-1.5 shadow-sm"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => handlePrint(false)}
            >
              <Printer size={14} />
              <span>印刷 (Print)</span>
            </button>

            <button
              type="button"
              className="btn btn-primary flex items-center gap-1.5 shadow-sm"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => handlePrint(true)}
            >
              <FileDown size={14} />
              <span>PDF出力</span>
            </button>

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4,
                marginLeft: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Main A4 Sheet Preview Container ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--bg-base, #F1F5F9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: 12 }}>
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>日報データを読み込み中...</span>
            </div>
          ) : (
            <div
              id="daily-worklog-quick-sheet"
              style={{
                background: '#fff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                borderRadius: 4,
                display: 'inline-block',
                position: 'relative',
              }}
            >
              <DailyWorklogA4Sheet
                workDate={selectedDate}
                workerName={selectedEmployeeName}
                totalHours={totalHours}
                items={nippoItems}
                onEditItem={handleEditRow}
                onDeleteItem={handleDeleteLog}
              />
            </div>
          )}
        </div>

        {/* ── DIRECT ROW EDIT MODAL POPUP ── */}
        {editingLog && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10000,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditingLog(null) }}
          >
            <div
              className="card-flat"
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Edit Header */}
              <div
                style={{
                  padding: '12px 18px',
                  background: 'var(--tint-blue-bg)',
                  borderBottom: '1px solid var(--tint-blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit3 size={16} style={{ color: 'var(--tint-blue-text)' }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--tint-blue-text)' }}>
                    日報明細の直接編集 (Chỉnh sửa dòng nhật ký)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Edit Body */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Field 1: Work Date */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, margin: 0 }}>
                      作業日 (Ngày làm việc) <span style={{ color: 'red' }}>*</span>
                    </label>
                    {editingLog.work_date !== selectedDate && (
                      <span style={{ fontSize: 10.5, color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <AlertCircle size={12} />
                        日付変更: 本日の日報から移動します
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Calendar
                      size={14}
                      style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="date"
                      className="form-input font-mono font-bold"
                      style={{ paddingLeft: 30, fontSize: 13, height: 36 }}
                      value={editingLog.work_date}
                      onChange={(e) => setEditingLog({ ...editingLog, work_date: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field 2: Job / Mold Selection */}
                <div>
                  <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                    型番・対象JOB (Mã khuôn / JOB) <span style={{ color: 'red' }}>*</span>
                  </label>
                  <SearchableSelect
                    options={jobsList}
                    value={editingLog.job_id}
                    onChange={(val) => setEditingLog({ ...editingLog, job_id: val || '' })}
                    placeholder="JOBまたは型番を検索（例: 社内作業、ASH-023、OOT-046...）"
                    maxDropdownHeight="240px"
                  />
                </div>

                {/* Field 3: Processing Code */}
                <div>
                  <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                    作業内容・加工コード (Nội dung công việc) <span style={{ color: 'red' }}>*</span>
                  </label>
                  <SearchableSelect
                    options={processingCodes}
                    value={editingLog.processing_code_id}
                    onChange={(val) => setEditingLog({ ...editingLog, processing_code_id: val || '' })}
                    placeholder="コードまたは作業名で検索（例: 50 5S、11 本型穴あけ、53 金型整理...）"
                    maxDropdownHeight="240px"
                  />
                </div>

                {/* Field 4: Actual Hours with quick chips */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, margin: 0 }}>
                      作業時間 (h) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>クイック選択:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, alignItems: 'center' }}>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="24"
                      className="form-input font-mono font-bold text-center"
                      style={{ fontSize: 16, color: 'var(--accent)', height: 36 }}
                      value={editingLog.hours_spent}
                      onChange={(e) => setEditingLog({ ...editingLog, hours_spent: e.target.value })}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {QUICK_HOURS.map((h) => {
                        const isSelected = parseFloat(editingLog.hours_spent) === h
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setEditingLog({ ...editingLog, hours_spent: String(h) })}
                            style={{
                              padding: '3px 6px',
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              borderRadius: 4,
                              border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                              background: isSelected ? 'var(--accent)' : 'var(--bg-muted, #F8FAFC)',
                              color: isSelected ? '#fff' : 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            {h}h
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Field 5: Notes */}
                <div>
                  <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                    備考欄 (Ghi chú / Số shot / Chi tiết)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: 12, height: 36 }}
                    placeholder="詳細報告、引き継ぎ事項など..."
                    value={editingLog.notes}
                    onChange={(e) => setEditingLog({ ...editingLog, notes: e.target.value })}
                  />
                </div>

                {/* Edit Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteLog(editingLog.log_id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11.5,
                      color: 'var(--status-error, #DC2626)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    <Trash2 size={14} />
                    <span>この明細を削除</span>
                  </button>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingLog(null)}
                      style={{ fontSize: 12, padding: '6px 16px' }}
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveEditedLog}
                      disabled={savingEdit}
                      style={{ fontSize: 12.5, padding: '7px 20px', gap: 6 }}
                    >
                      {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      <span>{savingEdit ? '更新中...' : '更新して保存'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer Bar ── */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            ※ 印刷時はA4横向き（Landscape）で余白8mmを推奨します
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 12, padding: '5px 18px' }}>
            閉じる (Đóng)
          </button>
        </div>
      </div>
    </div>
  )
}
