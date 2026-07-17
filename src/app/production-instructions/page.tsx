'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { getProductionInstructions } from '@/app/actions/production-instructions'

type PIStatus = 'DRAFT' | 'ISSUED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED'
type TemplateType = 'HAE' | 'NLC' | 'SMK' | 'YAE' | 'GENERAL'

interface ProductionInstruction {
  id: string
  instruction_no: string
  product_id: string | null
  instruction_type: 'FORMING' | 'OUTSOURCE'
  production_site: string | null
  quantity_ordered: number
  requested_date: string
  status: PIStatus
  template_type: TemplateType
  material_stock_warning: boolean | null
  created_at: string | null
  orders?: { order_no: string, companies?: { company_name: string } | null } | null
  products?: { product_code: string; product_name: string } | null
  delivery_sites?: { site_name: string } | null
}

const STATUS_CONFIG: Record<PIStatus, { label: string; className: string }> = {
  DRAFT:         { label: '下書き',     className: 'bg-gray-100 text-gray-700' },
  ISSUED:        { label: '発行済み',   className: 'bg-blue-100 text-blue-700' },
  IN_PRODUCTION: { label: '生産中',     className: 'bg-orange-100 text-orange-700' },
  COMPLETED:     { label: '完了',       className: 'bg-green-100 text-green-700' },
  CANCELLED:     { label: 'キャンセル', className: 'bg-red-100 text-red-700' },
}

const PRODUCTION_SITES = ['本社', '青森', '茨城', '坂田']

export default function ProductionInstructionsPage() {
  const [instructions, setInstructions] = useState<ProductionInstruction[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    production_site: '',
    date_from: '',
    date_to: '',
    search: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getProductionInstructions(filters)
    setInstructions(data as unknown as ProductionInstruction[])
    setLoading(false)
  }, [filters])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生産指示書</h1>
          <p className="text-sm text-gray-500 mt-1">Production Instructions (BP-32)</p>
        </div>
        <Link
          href="/production-instructions/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>＋</span> 新規作成
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="伝票No. / 品番 検索"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="col-span-2 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全ステータス</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filters.production_site}
            onChange={e => setFilters(f => ({ ...f, production_site: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">全拠点</option>
            {PRODUCTION_SITES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={filters.date_from}
            onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="date"
            value={filters.date_to}
            onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">読み込み中...</div>
        ) : instructions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">データがありません</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['伝票No.', '品番', '客先', '数量', '生産拠点', '納期', '状態', 'タグ', '操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {instructions.map(pi => {
                const status = STATUS_CONFIG[pi.status]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tags = (pi as any).production_instruction_tags || []
                const visibleTags = tags.slice(0, 2)
                const overflowCount = tags.length - 2
                return (
                  <tr key={pi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <Link href={`/production-instructions/${pi.id}`} className="text-blue-600 hover:underline">
                        {pi.instruction_no}
                      </Link>
                      {pi.material_stock_warning && (
                        <span className="ml-1 text-orange-500" title="材料在庫不足">⚠️</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{pi.products?.product_code ?? '—'}</td>
                    <td className="px-4 py-3">{pi.orders?.companies?.company_name ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-mono">{pi.quantity_ordered.toLocaleString()}</td>
                    <td className="px-4 py-3">{pi.production_site ?? '—'}</td>
                    <td className="px-4 py-3 font-mono">{pi.requested_date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tags.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {visibleTags.map((tag: any, idx: number) => {
                            const label = tag.tag_code
                              ? (tag.production_tag_master?.label_ja || tag.tag_code)
                              : tag.custom_label
                            const ps = tag.production_tag_master?.print_style || 'default'
                            const isRed = ps === 'red' || ps === 'red_bold'
                            return (
                              <span
                                key={idx}
                                className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                  isRed
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                              >
                                {label}
                              </span>
                            )
                          })}
                          {overflowCount > 0 && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                              +{overflowCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/production-instructions/${pi.id}`} className="text-blue-600 hover:underline text-xs">詳細</Link>
                        <Link href={`/api/production-instructions/${pi.id}/pdf`} target="_blank" className="text-green-600 hover:underline text-xs">PDF</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
