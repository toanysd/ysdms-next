'use client'

import { useState, useEffect } from 'react'
import { searchDeliverySites } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

const PRODUCTION_SITES = ['本社', '青森', '茨城', '坂田']

interface DeliverySite { site_id: string; site_name: string; site_code: string; site_address: string | null }
interface Props { form: PIFormData; update: (p: Partial<PIFormData>) => void; onBack: () => void; onNext: () => void }

export default function Step2ProductionInfo({ form, update, onBack, onNext }: Props) {
  const [siteQuery, setSiteQuery] = useState('')
  const [siteResults, setSiteResults] = useState<DeliverySite[]>([])
  const [searching, setSearching] = useState(false)

  const searchSite = async (q: string) => {
    if (q.length < 1) { setSiteResults([]); return }
    setSearching(true)
    const data = await searchDeliverySites(q)
    setSiteResults(data)
    setSearching(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => searchSite(siteQuery), 300)
    return () => clearTimeout(timer)
  }, [siteQuery])

  const canNext = form.production_site && form.quantity_ordered > 0 && form.requested_date && form.delivery_site_id

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">生産情報</h2>

      {/* Production site */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">生産拠点 <span className="text-red-500">*</span></label>
        <div className="flex gap-2 flex-wrap">
          {PRODUCTION_SITES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => update({ production_site: s })}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                form.production_site === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">数量 <span className="text-red-500">*</span></label>
          <input
            type="number"
            min={1}
            value={form.quantity_ordered || ''}
            onChange={e => update({ quantity_ordered: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="例: 1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">納期 <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.requested_date}
            onChange={e => update({ requested_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Delivery site */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">納入先 <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="納入先名またはコードで検索 (例: SMK, 11)"
          value={siteQuery}
          onChange={e => setSiteQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        {searching && <p className="text-xs text-gray-400 mt-1">検索中...</p>}
        {siteResults.length > 0 && (
          <div className="mt-1 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
            {siteResults.map(site => (
              <button
                key={site.site_id}
                type="button"
                onClick={() => { update({ delivery_site_id: site.site_id, delivery_site_name: site.site_name }); setSiteQuery(site.site_name); setSiteResults([]) }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0"
              >
                <span className="font-mono text-gray-500 mr-2">[{site.site_code}]</span>
                {site.site_name}
                {site.site_address && <span className="text-xs text-gray-400 ml-2">{site.site_address}</span>}
              </button>
            ))}
          </div>
        )}
        {form.delivery_site_id && (
          <p className="mt-1 text-sm text-green-700">✓ {form.delivery_site_name}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.is_first_time} onChange={e => update({ is_first_time: e.target.checked })} className="rounded" />
          初回 (初めての生産)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.has_label} onChange={e => update({ has_label: e.target.checked })} className="rounded" />
          ラベル要
        </label>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
        <textarea
          value={form.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
          placeholder="特記事項があれば記入"
        />
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">← 戻る</button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
