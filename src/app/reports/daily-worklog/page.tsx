'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Printer, FileDown } from 'lucide-react'

// Hardcoded pricing table exactly as requested
const DESIGN_PRICES = [
  { name: '設計', price: '¥30,000', unit: '1機種' },
  { name: 'プラグ演算＆加工', price: '¥10,000', unit: '1機種' },
  { name: '試作プラグ演算＆加工', price: '¥5,000', unit: '1機種' },
  { name: '金型演算＆加工', price: '¥30,000', unit: '1機種' },
  { name: '試作金型演算＆加工', price: '¥10,000', unit: '1機種' },
  { name: '配送', price: '3～5,000円', unit: '1回' }
]

const MOLD_PRICES = [
  { name: '本型穴あけ', price: '¥3,000', unit: '1機種' },
  { name: '本型ミガキ', price: '¥3,000', unit: '1機種' },
  { name: '試作穴あけ', price: '¥1,500', unit: '1機種' },
  { name: '試作ミガキ', price: '¥1,500', unit: '1機種' },
  { name: '本型ネル貼り', price: '¥5,000', unit: '1機種' },
  { name: '試作ネル貼り', price: '¥2,000', unit: '1機種' },
  { name: 'プレス応援', price: '¥10', unit: 'ショット' }
]

const OTHER_PRICES = [
  { name: '本型手造りプラグ', price: '¥10,000', unit: '1機種' },
  { name: '試作手造りプラグ', price: '¥5,000', unit: '1機種' },
  { name: '材料出し', price: '¥4,000', unit: '1回' },
  { name: '出荷作業', price: '¥4,000', unit: '1回' },
  { name: '出荷応援', price: '¥2,000', unit: '1回' },
  { name: '検査', price: '¥3,000', unit: '1機種' },
  { name: '成形補助', price: '¥2,000', unit: '時間' }
]

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
        // Remember last user feature
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

  const handlePrint = () => {
    window.print()
  }

  const selectedEmployeeName = useMemo(() => {
    const emp = employees.find(e => e.employee_id === selectedEmployeeId)
    return emp ? (emp.employee_name_short || emp.employee_name) : ''
  }, [employees, selectedEmployeeId])

  const totalHours = useMemo(() => {
    return logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
  }, [logs])

  const getModelCode = (log: WorkLog) => {
    if (!log.jobs) return '-'
    if (log.jobs.physical_molds?.system_code) return log.jobs.physical_molds.system_code
    if (log.jobs.design_revisions?.design_code) return log.jobs.design_revisions.design_code
    if (log.jobs.products?.product_code) return log.jobs.products.product_code
    return log.jobs.job_code
  }

  // Ensure table has at least 15 rows for visual consistency with the image
  const MIN_ROWS = 15
  const displayRows = [...logs]
  while (displayRows.length < MIN_ROWS) {
    displayRows.push({
      log_id: `empty-${displayRows.length}`,
      work_date: selectedDate,
      hours_spent: null,
      notes: null,
      processing_codes: null,
      jobs: null
    })
  }

  // For display date
  const dateObj = new Date(selectedDate)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)]">
      {/* ── Settings Bar (Hidden in Print) ── */}
      <div className="print:hidden p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t('dailyWorklog.date')}</label>
            <input 
              type="date" 
              className="form-input"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: 160 }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t('dailyWorklog.employee')}</label>
            <select 
              className="form-input"
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              style={{ width: 220 }}
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
          <button className="btn btn-secondary flex items-center gap-2 shadow-sm" onClick={handlePrint}>
            <Printer size={16} />
            <span>{t('dailyWorklog.print')}</span>
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-sm" onClick={handlePrint}>
            <FileDown size={16} />
            <span>{t('dailyWorklog.exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* ── Printable Report Body ── */}
      <div className="flex-1 overflow-auto p-8 print:p-0 bg-[var(--bg-base)] print:bg-white flex justify-center">
        {/* A4 Landscape Wrapper */}
        <div 
          className="bg-white shadow-md print:shadow-none print:border-none print:w-full print:max-w-none"
          style={{
            width: '297mm',
            minHeight: '210mm',
            padding: '8mm 12mm',
            fontFamily: '"MS PGothic", "Meiryo", sans-serif',
            color: '#000',
            boxSizing: 'border-box'
          }}
        >
          {/* Print only specific styles */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 5mm;
              }
              body {
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print\\:hidden {
                display: none !important;
              }
              /* Hide layout components during print */
              header { display: none !important; }
              nav { display: none !important; }
              #sidebar { display: none !important; }
              main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
            }
            .nippo-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .nippo-table th, .nippo-table td {
              border: 1px solid #000;
              padding: 2px 4px;
              font-size: 12px;
              text-align: center;
              height: 24px;
            }
            .nippo-table th {
              background-color: transparent;
              font-weight: normal;
            }
            .pricing-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            .pricing-table td {
              padding: 1px 6px;
            }
            .pricing-table .col-name {
              width: 140px;
            }
            .pricing-table .col-price {
              width: 80px;
              text-align: right;
            }
            .pricing-table .col-unit {
              width: 60px;
              text-align: center;
            }
            .border-bottom-line {
              border-bottom: 1px solid #000;
              display: inline-block;
            }
          `}} />

          {/* Header */}
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px', marginTop: '0' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, border: '1px solid #000', width: '70px', height: '35px' }}>
              <div style={{ borderBottom: '1px solid #000', fontSize: '10px', padding: '1px' }}>確認印</div>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '10px 0' }}>日報記録書 【設計＆金型部門】</h1>
            <div style={{ position: 'absolute', right: '90px', top: '15px', fontSize: '13px', fontWeight: 'bold', color: '#666' }}>
              【社内作業】
            </div>
          </div>

          {/* Info row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '15px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span>作業日：</span>
              <span className="border-bottom-line" style={{ width: '80px', textAlign: 'center' }}>
                {!isNaN(dateObj.getTime()) ? dateObj.getFullYear() : '　　'}
              </span>
              <span>年</span>
              <span className="border-bottom-line" style={{ width: '40px', textAlign: 'center' }}>
                {!isNaN(dateObj.getTime()) ? dateObj.getMonth() + 1 : '　'}
              </span>
              <span>月</span>
              <span className="border-bottom-line" style={{ width: '40px', textAlign: 'center' }}>
                {!isNaN(dateObj.getTime()) ? dateObj.getDate() : '　'}
              </span>
              <span>日</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span>作業者：</span>
              <span className="border-bottom-line" style={{ width: '200px', paddingLeft: '10px', textAlign: 'left' }}>
                {selectedEmployeeName || '　'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span>労働時間：</span>
              <span className="border-bottom-line" style={{ width: '60px', textAlign: 'center' }}>
                {totalHours > 0 ? totalHours : '　'}
              </span>
              <span>H</span>
            </div>
          </div>

          <div>【作業項目】</div>
          
          <table className="nippo-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>型　番</th>
                <th style={{ width: '20%' }}>作業内容</th>
                <th style={{ width: '40%', textAlign: 'left', paddingLeft: '8px' }}>備考欄(詳細報告がある場合は、記載してください)(ショット数なども)</th>
                <th style={{ width: '10%' }}>作業時間</th>
                <th style={{ width: '15%' }}>付加価値(金額)</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((log, index) => (
                <tr key={log.log_id || `empty-${index}`}>
                  <td>{log.jobs ? getModelCode(log) : ''}</td>
                  <td>{log.processing_codes?.processing_name || ''}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '8px' }}>{log.notes || ''}</td>
                  <td>{log.hours_spent ? `${log.hours_spent} H` : ''}</td>
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', paddingRight: '15px', border: 'none' }}>合　計</td>
                <td style={{ fontWeight: 'bold' }}>{totalHours > 0 ? `${totalHours} H` : ''}</td>
                <td style={{ borderBottom: 'none', borderRight: 'none' }}></td>
              </tr>
            </tbody>
          </table>

          {/* Pricing Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            {/* Column 1 */}
            <div style={{ flex: 1 }}>
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="col-price">単価</th>
                    <th className="col-unit">単位</th>
                  </tr>
                </thead>
                <tbody>
                  {DESIGN_PRICES.map((item, i) => (
                    <tr key={i}>
                      <td className="col-name" style={{ borderBottom: '1px solid #ccc' }}>{item.name}</td>
                      <td className="col-price" style={{ borderBottom: '1px solid #ccc' }}>{item.price}</td>
                      <td className="col-unit" style={{ borderBottom: '1px solid #ccc' }}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ width: '30px' }}></div>

            {/* Column 2 */}
            <div style={{ flex: 1 }}>
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="col-price">単価</th>
                    <th className="col-unit">単位</th>
                  </tr>
                </thead>
                <tbody>
                  {MOLD_PRICES.map((item, i) => (
                    <tr key={i}>
                      <td className="col-name" style={{ borderBottom: '1px solid #ccc' }}>{item.name}</td>
                      <td className="col-price" style={{ borderBottom: '1px solid #ccc' }}>{item.price}</td>
                      <td className="col-unit" style={{ borderBottom: '1px solid #ccc' }}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ width: '30px' }}></div>

            {/* Column 3 */}
            <div style={{ flex: 1 }}>
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="col-price">単価</th>
                    <th className="col-unit">単位</th>
                  </tr>
                </thead>
                <tbody>
                  {OTHER_PRICES.map((item, i) => (
                    <tr key={i}>
                      <td className="col-name" style={{ borderBottom: '1px solid #ccc' }}>{item.name}</td>
                      <td className="col-price" style={{ borderBottom: '1px solid #ccc' }}>{item.price}</td>
                      <td className="col-unit" style={{ borderBottom: '1px solid #ccc' }}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
