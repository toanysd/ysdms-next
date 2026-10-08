'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, FileSpreadsheet, Download, Loader2, Info, Building2, MapPin, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CompanyOption {
  company_id: string
  company_code: string
  company_name: string
}

interface InventorySurveyExportModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilterLocation?: string
}

export default function InventorySurveyExportModal({
  isOpen,
  onClose,
  currentFilterLocation = ''
}: InventorySurveyExportModalProps) {
  const t = useTranslations('Equipment.Molds')
  const supabase = createClient()

  const [scope, setScope] = useState<'ALL' | 'BY_CUSTOMER' | 'BY_LOCATION'>('ALL')
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>(currentFilterLocation || '')
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setError(null)
      fetchCompanies()
      if (currentFilterLocation) {
        setSelectedLocation(currentFilterLocation)
      }
    }
  }, [isOpen, currentFilterLocation])

  const fetchCompanies = async () => {
    setLoadingCompanies(true)
    try {
      const { data, error: err } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .order('company_code', { ascending: true })

      if (err) throw err
      if (data) {
        setCompanies(data)
      }
    } catch (err: any) {
      console.warn('Error fetching companies for export modal:', err.message)
    } finally {
      setLoadingCompanies(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('scope', scope)

      if (scope === 'BY_CUSTOMER') {
        if (!selectedCompanyId) {
          setError(t('exportSurveyModal.selectCustomer'))
          setExporting(false)
          return
        }
        params.set('companyId', selectedCompanyId)
      } else if (scope === 'BY_LOCATION') {
        if (!selectedLocation) {
          setError(t('exportSurveyModal.selectLocation'))
          setExporting(false)
          return
        }
        params.set('location', selectedLocation)
      }

      const res = await fetch(`/api/equipment/molds/export-survey?${params.toString()}`)
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || `HTTP ${res.status}`)
      }

      // Extract filename from Content-Disposition header if available
      const disposition = res.headers.get('content-disposition') || ''
      let filename = '貸与設備棚卸調査表.xlsx'
      const match = disposition.match(/filename\*=UTF-8''([^;]+)/i) || disposition.match(/filename="?([^;"]+)"?/i)
      if (match && match[1]) {
        filename = decodeURIComponent(match[1])
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      onClose()
    } catch (err: any) {
      console.error('Export error:', err)
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="card-flat bg-white rounded-lg shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-slate-900 leading-tight">
                {t('exportSurveyModal.title')}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t('exportSurveyModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 text-[12px]">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-center gap-2">
              <span className="font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Scope Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">
              {t('exportSurveyModal.scopeLabel')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScope('ALL')}
                className={`py-2 px-3 rounded border text-center font-medium transition-all ${
                  scope === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t('exportSurveyModal.scopeAll')}
              </button>
              <button
                type="button"
                onClick={() => setScope('BY_CUSTOMER')}
                className={`py-2 px-3 rounded border text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                  scope === 'BY_CUSTOMER'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 size={13} />
                <span>{t('exportSurveyModal.scopeCustomer')}</span>
              </button>
              <button
                type="button"
                onClick={() => setScope('BY_LOCATION')}
                className={`py-2 px-3 rounded border text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                  scope === 'BY_LOCATION'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MapPin size={13} />
                <span>{t('exportSurveyModal.scopeLocation')}</span>
              </button>
            </div>
          </div>

          {/* Conditional Dropdown for Customer Scope */}
          {scope === 'BY_CUSTOMER' && (
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded border border-slate-200">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-500" />
                <span>{t('exportSurveyModal.selectCustomer')}</span>
              </label>
              {loadingCompanies ? (
                <div className="flex items-center gap-2 text-slate-500 py-1">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading companies...</span>
                </div>
              ) : (
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="form-input w-full h-[32px] text-[12px] bg-white border border-slate-300 rounded px-2"
                >
                  <option value="">-- 取引先を選択 (Chọn khách hàng) --</option>
                  {companies.map((c) => (
                    <option key={c.company_id} value={c.company_id}>
                      [{c.company_code}] {c.company_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Conditional Dropdown for Location Scope */}
          {scope === 'BY_LOCATION' && (
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded border border-slate-200">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-500" />
                <span>{t('exportSurveyModal.selectLocation')}</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-input w-full h-[32px] text-[12px] bg-white border border-slate-300 rounded px-2"
              >
                <option value="">全保管位置 (Tất cả vị trí)</option>
                <option value="ASSIGNED">配置済 (Đã gán kệ)</option>
                <option value="UNASSIGNED">未配置 (Chưa gán kệ)</option>
                <optgroup label="エリア別 (Theo khu vực)">
                  <option value="ZONE_MR">MR エリア (Xưởng chính)</option>
                  <option value="ZONE_SP">SP エリア (Dự phòng)</option>
                  <option value="ZONE_2F">2F エリア (Tầng 2)</option>
                  <option value="ZONE_CS">CS エリア</option>
                  <option value="ZONE_MD">MD エリア</option>
                </optgroup>
              </select>
            </div>
          )}

          {/* Survey 11 Columns Specs Notice Box */}
          <div className="p-3 bg-blue-50/60 rounded border border-blue-200 text-slate-700">
            <div className="flex items-start gap-2">
              <Info size={15} className="text-blue-700 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-[11px] leading-relaxed text-blue-900 font-medium">
                  {t('exportSurveyModal.surveySpecNotice')}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-600 mt-1">
                  <div>• A: No.</div>
                  <div>• B: 客先資産番号</div>
                  <div>• C: 設備名称・金型名</div>
                  <div>• D: YSD管理番号</div>
                  <div>• E: 品名・製品型番</div>
                  <div>• F: 数量 (1 台)</div>
                  <div>• G: 貸出書の有無 (○/×)</div>
                  <div>• H: 金型の有無 (○/×)</div>
                  <div>• I: 保管場所</div>
                  <div>• J: 稼働状況</div>
                  <div className="col-span-2">• K: 最終使用日・今後の見通し</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="btn btn-secondary px-3.5 h-[32px] text-[12px]"
          >
            {t('exportSurveyModal.close')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="btn btn-primary px-4 h-[32px] text-[12px] flex items-center gap-1.5"
            style={{ background: '#047857', borderColor: '#047857' }}
          >
            {exporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t('exportSurveyModal.exporting')}</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>{t('exportSurveyModal.exportBtn')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
