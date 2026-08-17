'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Printer, FileDown } from 'lucide-react'
import { DailyWorklogA4Sheet, PRICE_MAP, NippoItem } from '@/components/worklogs/DailyWorklogA4Sheet'

type Employee = {
  employee_id: string
  employee_name: string
  employee_name_short: string | null
}

type WorkLog = {
  log_id: string
  work_date: string
  hours_spent: number | null
  notes: string | null
  processing_codes: {
    processing_name: string
  } | null
  jobs: {
    job_code: string
    physical_molds: { system_code: string } | null
    design_revisions: { design_code: string } | null
    products: { product_code: string } | null
  } | null
}

export default function DailyWorklogReportPage() {
  const t = useTranslations('Reports')
  const supabase = createClient()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from('employees')
        .select('employee_id, employee_name, employee_name_short')
        .eq('is_active', true)
        .order('employee_name')
      
      if (data && data.length > 0) {
        setEmployees(data)
        const lastEmpId = localStorage.getItem('ysdms_last_employee_id')
        if (lastEmpId && data.some(e => e.employee_id === lastEmpId)) {
          setSelectedEmployeeId(lastEmpId)
        } else {
          setSelectedEmployeeId(data[0].employee_id)
        }
      }
    }
    fetchEmployees()
  }, [supabase])

  // Save to localStorage when employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      localStorage.setItem('ysdms_last_employee_id', selectedEmployeeId)
    }
  }, [selectedEmployeeId])

  const fetchLogs = useCallback(async () => {
    if (!selectedDate || !selectedEmployeeId) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('work_logs')
      .select(`
        log_id, work_date, hours_spent, notes,
        processing_codes(processing_name),
        jobs(
          job_code,
          physical_molds(system_code),
          design_revisions(design_code),
          products(product_code)
        )
      `)
      .eq('work_date', selectedDate)
      .eq('employee_id', selectedEmployeeId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setLogs(data as unknown as WorkLog[])
    }
    setLoading(false)
  }, [selectedDate, selectedEmployeeId, supabase])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handlePrint = (isPdf = false) => {
    window.print()
    setTimeout(() => {
      if (window.confirm('印刷ダイアログを起動しました。「PDFに保存」でPDFファイルとしてダウンロードしますか？')) {
        // Confirmed PDF export
      }
    }, 1000)
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
    if (log.jobs.physical_molds?.system_code) return log.jobs.physical_molds.system_code
    if (log.jobs.design_revisions?.design_code) return log.jobs.design_revisions.design_code
    if (log.jobs.products?.product_code) return log.jobs.products.product_code
    return log.jobs.job_code
  }

  const nippoItems: NippoItem[] = useMemo(() => {
    return logs.map(l => {
      const pName = l.processing_codes?.processing_name || ''
      return {
        log_id: l.log_id,
        model_code: getModelCode(l),
        processing_name: pName,
        notes: l.notes || '',
        hours_spent: l.hours_spent,
        price_value: ''
      }
    })
  }, [logs])

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)]">
      {/* Print Specific CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          header, nav, #sidebar, .topbar { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          .nippo-a4-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
            transform: none !important;
          }
        }
      `}} />

      {/* ── Settings Bar (Hidden in Print) ── */}
      <div className="print:hidden p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t('dailyWorklog.date')}</label>
            <input 
              type="date" 
              className="form-input font-mono"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: 160, height: 36 }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t('dailyWorklog.employee')}</label>
            <select 
              className="form-input"
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              style={{ width: 220, height: 36 }}
            >
              <option value="">{t('dailyWorklog.selectEmployee')}</option>
              {employees.map(e => (
                <option key={e.employee_id} value={e.employee_id}>{e.employee_name_short || e.employee_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end h-full pt-5">
            {loading && <span className="text-[12px] text-[var(--text-muted)]">{t('dailyWorklog.loading')}</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-5">
          <button className="btn btn-secondary flex items-center gap-2 shadow-sm" onClick={() => handlePrint(false)}>
            <Printer size={16} />
            <span>{t('dailyWorklog.print')}</span>
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-sm" onClick={() => handlePrint(true)}>
            <FileDown size={16} />
            <span>{t('dailyWorklog.exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* ── Printable Report Body ── */}
      <div className="flex-1 overflow-auto p-8 print:p-0 bg-[var(--bg-base)] print:bg-white flex justify-center items-start">
        <div className="bg-white shadow-lg print:shadow-none print:border-none p-4 rounded-sm">
          <DailyWorklogA4Sheet
            workDate={selectedDate}
            workerName={selectedEmployeeName}
            totalHours={totalHours}
            items={nippoItems}
          />
        </div>
      </div>
    </div>
  )
}
