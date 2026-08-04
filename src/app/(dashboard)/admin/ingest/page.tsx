'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  DatabaseZap, FolderSearch, CheckCircle2, AlertTriangle, 
  Loader2, RefreshCw, Upload, Users, FolderOpen,
  ChevronDown, ChevronUp
} from 'lucide-react'

type ScanResult = {
  scannedAt: string
  serverRoot: string
  summary: { totalGroups: number; totalCustomers: number; newCustomers: number; existingCustomers: number }
  newCustomers: string[]
  existingCustomers: string[]
  groups: Array<{ customer: string; productCode: string; latestDate: string; versions: number }>
}

type ApplyResult = {
  summary: { total: number; inserted: number; skipped: number; errors: number }
  insertedList: string[]
}

export default function IngestPage() {
  const t = useTranslations('Admin')
  const [serverRoot, setServerRoot] = useState('\\\\SERVER\\ysd-folder')
  const [scanning, setScanning] = useState(false)
  const [applying, setApplying] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [applyResult, setApplyResult] = useState<ApplyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showGroups, setShowGroups] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())

  const handleScan = async () => {
    setScanning(true); setError(null); setScanResult(null); setApplyResult(null)
    try {
      const res = await fetch('/api/admin/ingest/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverRoot }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setScanResult(data)
      setSelectedCustomers(new Set(data.newCustomers))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setScanning(false)
    }
  }

  const handleApply = async () => {
    if (!scanResult || selectedCustomers.size === 0) return
    setApplying(true); setError(null)
    try {
      const res = await fetch('/api/admin/ingest/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: [...selectedCustomers], sourceFolder: serverRoot }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setApplyResult(data)
      setScanResult(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setApplying(false)
    }
  }

  const toggleCustomer = (name: string) => {
    setSelectedCustomers(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow" style={{ background: 'var(--accent)' }}>
          <DatabaseZap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t('ingestTitle')}</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('ingestSubtitle')}</p>
        </div>
      </div>

      {/* Step 1: Config */}
      <div className="card-flat p-4 shadow-sm">
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: 'var(--accent)' }}>1</span>
          {t('dataSource')}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={serverRoot}
            onChange={e => setServerRoot(e.target.value)}
            className="form-input flex-1 font-mono text-sm"
            placeholder="\\SERVER\ysd-folder"
          />
          <button
            onClick={handleScan}
            disabled={scanning || !serverRoot}
            className="btn btn-primary h-9 px-4 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <FolderSearch size={16} />}
            {scanning ? t('scanningBtn') : t('scanBtn')}
          </button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {t('scanHint')}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--tint-purple-bg)', border: '1px solid var(--status-error)', color: 'var(--status-error)' }}>
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step 2: Scan result */}
      {scanResult && (
        <div className="card-flat overflow-hidden shadow-sm">
          <div className="card-header-tint px-4 py-3 border-b border-[var(--border-default)] flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: 'var(--accent)' }}>2</span>
              {t('scanResultTitle')}
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(scanResult.scannedAt).toLocaleString()}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 divide-x divide-[var(--border-default)] border-b border-[var(--border-default)]">
            {[
              { label: t('stats.productGroups'), value: scanResult.summary.totalGroups, icon: FolderOpen, color: 'var(--status-info)' },
              { label: t('stats.foundCustomers'), value: scanResult.summary.totalCustomers, icon: Users, color: 'var(--accent)' },
              { label: t('stats.newCustomers'), value: scanResult.summary.newCustomers, icon: CheckCircle2, color: 'var(--status-success)' },
              { label: t('stats.existingCustomers'), value: scanResult.summary.existingCustomers, icon: RefreshCw, color: 'var(--status-warning)' },
            ].map(s => (
              <div key={s.label} className="p-4 text-center">
                <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* New Customers List */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {t('newCustomersTitle', { count: scanResult.newCustomers.length })}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setSelectedCustomers(new Set(scanResult.newCustomers))}
                  className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>{t('selectAll')}</button>
                <button onClick={() => setSelectedCustomers(new Set())}
                  className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>{t('deselectAll')}</button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto border border-[var(--border-default)] rounded p-2 flex flex-wrap gap-1.5" style={{ background: 'var(--bg-surface-2)' }}>
              {scanResult.newCustomers.map(name => (
                <button
                  key={name}
                  onClick={() => toggleCustomer(name)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    selectedCustomers.has(name)
                      ? 'badge badge--success'
                      : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-muted)]'
                  }`}
                >
                  {selectedCustomers.has(name) ? '✓ ' : ''}{name}
                </button>
              ))}
              {scanResult.newCustomers.length === 0 && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('noNewCustomers')}</span>
              )}
            </div>

            {/* Existing Customers */}
            {scanResult.existingCustomers.length > 0 && (
              <div className="mt-3">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  {t('alreadyInDb', { count: scanResult.existingCustomers.length })}
                  <span className="ml-1 font-semibold" style={{ color: 'var(--status-warning)' }}>{scanResult.existingCustomers.join(', ')}</span>
                </p>
              </div>
            )}

            {/* Toggle groups */}
            <button
              onClick={() => setShowGroups(!showGroups)}
              className="mt-3 text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--text-muted)' }}
            >
              {showGroups ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showGroups ? t('hideGroups') : t('showGroups', { count: scanResult.summary.totalGroups })}
            </button>

            {showGroups && (
              <div className="mt-2 max-h-60 overflow-y-auto border border-[var(--border-default)] rounded text-xs">
                <table className="data-table w-full">
                  <thead className="sticky top-0">
                    <tr>
                      <th className="p-2 text-left font-medium">{t('tableHeaders.customer')}</th>
                      <th className="p-2 text-left font-medium">{t('tableHeaders.productCode')}</th>
                      <th className="p-2 text-left font-medium">{t('tableHeaders.latestFile')}</th>
                      <th className="p-2 text-center font-medium">{t('tableHeaders.versionCount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.groups.map((g, i) => (
                      <tr key={i} className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-surface-2)]">
                        <td className="p-2 font-medium">{g.customer}</td>
                        <td className="p-2 font-mono">{g.productCode}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{g.latestDate || '-'}</td>
                        <td className="p-2 text-center font-mono">{g.versions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 3: Apply */}
          <div className="px-4 py-3 bg-[var(--bg-surface-2)] border-t border-[var(--border-default)] flex items-center justify-between">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('selectedImport', { count: selectedCustomers.size })}
            </div>
            <button
              onClick={handleApply}
              disabled={applying || selectedCustomers.size === 0}
              className="btn btn-primary h-9 px-5 flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {applying ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {applying ? t('importingBtn') : t('importBtn', { count: selectedCustomers.size })}
            </button>
          </div>
        </div>
      )}

      {/* Apply result */}
      {applyResult && (
        <div className="card-flat p-4 rounded-lg" style={{ background: 'var(--tint-teal-bg)', border: '1px solid var(--status-success)' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--status-success)' }}>{t('importSuccess')}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: t('importStats.imported'), value: applyResult.summary.inserted, color: 'var(--status-success)' },
              { label: t('importStats.skipped'), value: applyResult.summary.skipped, color: 'var(--status-warning)' },
              { label: t('importStats.errors'), value: applyResult.summary.errors, color: 'var(--status-error)' },
            ].map(s => (
              <div key={s.label} className="text-center bg-[var(--bg-surface)] rounded border border-[var(--border-default)] p-2">
                <div className="text-xl font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {applyResult.insertedList.length > 0 && (
            <div className="text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] rounded p-2 max-h-40 overflow-y-auto">
              {applyResult.insertedList.map((item, i) => (
                <div key={i} className="py-0.5 font-mono text-[var(--text-primary)]">{item}</div>
              ))}
            </div>
          )}
          <button onClick={() => { setApplyResult(null); setScanResult(null) }}
            className="mt-3 text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--status-success)' }}>
            <RefreshCw size={12} /> {t('scanAgain')}
          </button>
        </div>
      )}
    </div>
  )
}
