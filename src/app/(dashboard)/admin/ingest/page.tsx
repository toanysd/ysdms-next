'use client'

import { useState } from 'react'
import { 
  DatabaseZap, FolderSearch, CheckCircle2, AlertTriangle, 
  Loader2, Play, RefreshCw, Upload, Users, FolderOpen,
  ChevronDown, ChevronUp, X 
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
      setSelectedCustomers(new Set(data.newCustomers)) // chọn tất cả KH mới theo mặc định
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow">
          <DatabaseZap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--mcs-text)] ja">データ自動取込ツール</h1>
          <p className="text-xs text-[var(--mcs-text-muted)] vi">Công cụ nhập dữ liệu tự động từ Server</p>
        </div>
      </div>

      {/* Step 1: Cấu hình */}
      <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg p-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[var(--mcs-primary)] text-white text-xs flex items-center justify-center">1</span>
          Nguồn dữ liệu / データソース
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={serverRoot}
            onChange={e => setServerRoot(e.target.value)}
            className="flex-1 h-9 px-3 text-sm border border-[var(--mcs-border)] rounded bg-[var(--mcs-surface-2)] text-[var(--mcs-text)] font-mono focus:outline-none focus:border-[var(--mcs-primary)]"
            placeholder="\\SERVER\ysd-folder"
          />
          <button
            onClick={handleScan}
            disabled={scanning || !serverRoot}
            className="btn-primary h-9 px-4 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <FolderSearch size={16} />}
            {scanning ? 'Đang quét...' : 'Quét thư mục'}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--mcs-text-muted)]">
          Script sẽ quét các thư mục 新SMK注文書, 新AMP注文書, 新一般注文書... và tìm file Excel mới nhất cho từng sản phẩm.
        </p>
      </div>

      {/* Lỗi */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step 2: Kết quả quét */}
      {scanResult && (
        <div className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[var(--mcs-surface-3)] border-b border-[var(--mcs-border)] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--mcs-text)] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--mcs-primary)] text-white text-xs flex items-center justify-center">2</span>
              Kết quả quét
            </h2>
            <span className="text-xs text-[var(--mcs-text-muted)]">{new Date(scanResult.scannedAt).toLocaleString('ja-JP')}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 divide-x divide-[var(--mcs-border)] border-b border-[var(--mcs-border)]">
            {[
              { label: 'Nhóm SP', value: scanResult.summary.totalGroups, icon: FolderOpen, color: 'text-blue-600' },
              { label: 'KH tìm thấy', value: scanResult.summary.totalCustomers, icon: Users, color: 'text-purple-600' },
              { label: 'KH mới', value: scanResult.summary.newCustomers, icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Đã có', value: scanResult.summary.existingCustomers, icon: RefreshCw, color: 'text-orange-600' },
            ].map(s => (
              <div key={s.label} className="p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[var(--mcs-text-muted)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Danh sách KH mới */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[var(--mcs-text)]">
                Khách hàng mới ({scanResult.newCustomers.length}) — chọn để import:
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setSelectedCustomers(new Set(scanResult.newCustomers))}
                  className="text-xs text-[var(--mcs-primary)] hover:underline">Chọn tất cả</button>
                <button onClick={() => setSelectedCustomers(new Set())}
                  className="text-xs text-[var(--mcs-text-muted)] hover:underline">Bỏ chọn</button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto border border-[var(--mcs-border)] rounded bg-[var(--mcs-surface-2)] p-2 flex flex-wrap gap-1.5">
              {scanResult.newCustomers.map(name => (
                <button
                  key={name}
                  onClick={() => toggleCustomer(name)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    selectedCustomers.has(name)
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-[var(--mcs-surface)] border-[var(--mcs-border)] text-[var(--mcs-text-muted)]'
                  }`}
                >
                  {selectedCustomers.has(name) ? '✓ ' : ''}{name}
                </button>
              ))}
              {scanResult.newCustomers.length === 0 && (
                <span className="text-xs text-[var(--mcs-text-muted)]">Không có khách hàng mới — tất cả đã có trong DB</span>
              )}
            </div>

            {/* KH đã có */}
            {scanResult.existingCustomers.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-[var(--mcs-text-muted)] mb-1">
                  Đã tồn tại trong DB ({scanResult.existingCustomers.length}):
                  <span className="ml-1 text-orange-600">{scanResult.existingCustomers.join(', ')}</span>
                </p>
              </div>
            )}

            {/* Toggle groups */}
            <button
              onClick={() => setShowGroups(!showGroups)}
              className="mt-3 text-xs text-[var(--mcs-text-muted)] flex items-center gap-1 hover:text-[var(--mcs-primary)]"
            >
              {showGroups ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showGroups ? 'Ẩn' : 'Xem'} chi tiết {scanResult.summary.totalGroups} nhóm sản phẩm
            </button>

            {showGroups && (
              <div className="mt-2 max-h-60 overflow-y-auto border border-[var(--mcs-border)] rounded text-xs">
                <table className="w-full">
                  <thead className="bg-[var(--mcs-surface-3)] sticky top-0">
                    <tr>
                      <th className="p-2 text-left font-medium text-[var(--mcs-text-secondary)]">Khách hàng</th>
                      <th className="p-2 text-left font-medium text-[var(--mcs-text-secondary)]">Mã SP</th>
                      <th className="p-2 text-left font-medium text-[var(--mcs-text-secondary)]">File mới nhất</th>
                      <th className="p-2 text-center font-medium text-[var(--mcs-text-secondary)]">Số phiên bản</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.groups.map((g, i) => (
                      <tr key={i} className="border-t border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)]">
                        <td className="p-2 font-medium">{g.customer}</td>
                        <td className="p-2 font-mono">{g.productCode}</td>
                        <td className="p-2 text-[var(--mcs-text-muted)]">{g.latestDate || '-'}</td>
                        <td className="p-2 text-center">{g.versions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 3: Apply */}
          <div className="px-4 py-3 bg-[var(--mcs-surface-3)] border-t border-[var(--mcs-border)] flex items-center justify-between">
            <div className="text-xs text-[var(--mcs-text-muted)]">
              Đã chọn <span className="font-bold text-[var(--mcs-primary)]">{selectedCustomers.size}</span> khách hàng để import
            </div>
            <button
              onClick={handleApply}
              disabled={applying || selectedCustomers.size === 0}
              className="btn-primary h-9 px-5 flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {applying ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {applying ? 'Đang import...' : `Import ${selectedCustomers.size} KH vào DB`}
            </button>
          </div>
        </div>
      )}

      {/* Kết quả Apply */}
      {applyResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-green-600" />
            <h2 className="text-sm font-bold text-green-800">Import hoàn thành!</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Đã import', value: applyResult.summary.inserted, color: 'text-green-700' },
              { label: 'Bỏ qua (đã có)', value: applyResult.summary.skipped, color: 'text-orange-600' },
              { label: 'Lỗi', value: applyResult.summary.errors, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="text-center bg-white rounded border border-green-200 p-2">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          {applyResult.insertedList.length > 0 && (
            <div className="text-xs bg-white border border-green-200 rounded p-2 max-h-40 overflow-y-auto">
              {applyResult.insertedList.map((item, i) => (
                <div key={i} className="text-green-800 py-0.5">{item}</div>
              ))}
            </div>
          )}
          <button onClick={() => { setApplyResult(null); setScanResult(null) }}
            className="mt-3 text-xs text-green-700 flex items-center gap-1 hover:underline">
            <RefreshCw size={12} /> Quét lại
          </button>
        </div>
      )}
    </div>
  )
}
