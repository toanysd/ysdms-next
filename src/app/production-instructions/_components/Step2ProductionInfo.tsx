'use client'

import { useState, useEffect } from 'react'
import { searchDeliverySites, getStandardTags } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

const PRODUCTION_SITES = ['本社', '青森', '茨城', '坂田']

interface DeliverySite { site_id: string; site_name: string; site_code: string; site_address: string | null }
interface Props { form: PIFormData; update: (p: Partial<PIFormData>) => void; onBack: () => void; onNext: () => void }

export default function Step2ProductionInfo({ form, update, onBack, onNext }: Props) {
  const [siteQuery, setSiteQuery] = useState('')
  const [siteResults, setSiteResults] = useState<DeliverySite[]>([])
  const [searching, setSearching] = useState(false)
  const [standardTags, setStandardTags] = useState<any[]>([])
  const [customTagInput, setCustomTagInput] = useState('')

  useEffect(() => {
    getStandardTags().then(setStandardTags)
  }, [])

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

  const handleToggleTag = (tagCode: string) => {
    const exists = form.tags.some(t => t.tag_code === tagCode)
    if (exists) {
      update({ tags: form.tags.filter(t => t.tag_code !== tagCode) })
    } else {
      update({ tags: [...form.tags, { tag_code: tagCode, custom_label: null }] })
    }
  }

  const handleAddCustomTag = () => {
    const val = customTagInput.trim()
    if (!val) return

    const currentCustomCount = form.tags.filter(t => t.custom_label !== null).length
    if (currentCustomCount >= 2) {
      alert('カスタムタグは最大2個まで登録可能です。')
      return
    }

    const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(val)
    const maxLen = isJapanese ? 12 : 24
    if (val.length > maxLen) {
      alert(`文字数制限を超えています (日本語: 最大12文字, 英数/越語: 最大24文字)。現在の文字数: ${val.length}`)
      return
    }

    update({ tags: [...form.tags, { tag_code: null, custom_label: val }] })
    setCustomTagInput('')
  }

  const handleRemoveCustomTag = (label: string) => {
    update({ tags: form.tags.filter(t => t.custom_label !== label) })
  }

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

      {/* Quantity + Daily target + Date */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">計画数量 <span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">日次目標数量</label>
          <input
            type="number"
            min={1}
            value={form.daily_quantity || ''}
            onChange={e => update({ daily_quantity: parseInt(e.target.value) || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="例: 200"
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

      {/* Material Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">厚み (mm)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={form.material_thickness || ''}
            onChange={e => update({ material_thickness: parseFloat(e.target.value) || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="例: 0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">シート巾 (mm)</label>
          <input
            type="number"
            min={0}
            value={form.material_width || ''}
            onChange={e => update({ material_width: parseInt(e.target.value) || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="例: 640"
          />
        </div>
      </div>

      {/* Delivery site */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">納入先 <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="納入先名 hoặc mã để tìm kiếm (Ví dụ: SMK, 11)"
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

      {/* Packaging Options Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">梱包・その他指示</label>
        <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={form.is_first_time} onChange={e => update({ is_first_time: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
            初回生産 (First Time)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={form.has_label} onChange={e => update({ has_label: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
            ラベル貼付要
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={form.plain_case} onChange={e => update({ plain_case: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
            無地箱指定 (Plain Case)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={form.plain_label} onChange={e => update({ plain_label: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
            無地ラベル (Plain Label)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={form.adhesive_sheet} onChange={e => update({ adhesive_sheet: e.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />
            粘着シート使用 (Adhesive Sheet)
          </label>
        </div>
      </div>

      {/* Tag Selector */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">指示書タグ (Tags) <span className="text-xs text-gray-500">(複数可, 赤色タグは警告・高優先)</span></label>
          <div className="flex gap-2 flex-wrap mb-2">
            {standardTags.map(tag => {
              const isSelected = form.tags.some(t => t.tag_code === tag.tag_code)
              const isRed = tag.print_style === 'red' || tag.print_style === 'red_bold'
              return (
                <button
                  key={tag.tag_code}
                  type="button"
                  onClick={() => handleToggleTag(tag.tag_code)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all font-medium ${
                    isSelected
                      ? isRed
                        ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-200'
                        : 'bg-gray-800 text-white border-gray-800 ring-2 ring-gray-200'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tag.label_ja}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom Tag Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">カスタムタグ追加 <span className="text-xs text-gray-500">(最大2点, 日本語12文字/英数越語24文字まで)</span></label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="例: 特急仕様など"
              value={customTagInput}
              onChange={e => setCustomTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              disabled={form.tags.filter(t => t.custom_label !== null).length >= 2}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              disabled={!customTagInput.trim() || form.tags.filter(t => t.custom_label !== null).length >= 2}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 disabled:opacity-40"
            >
              追加
            </button>
          </div>
        </div>

        {/* Selected Tags Preview */}
        {form.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center bg-gray-50 border border-gray-200 rounded-md p-3">
            <span className="text-xs text-gray-500 font-medium">選択中のタグ:</span>
            {form.tags.map((tag, idx) => {
              const matchedStandard = standardTags.find(s => s.tag_code === tag.tag_code)
              const label = matchedStandard ? matchedStandard.label_ja : tag.custom_label
              const isRed = matchedStandard && (matchedStandard.print_style === 'red' || matchedStandard.print_style === 'red_bold')
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
                    isRed
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => {
                      if (tag.tag_code) {
                        handleToggleTag(tag.tag_code)
                      } else if (tag.custom_label) {
                        handleRemoveCustomTag(tag.custom_label)
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 font-bold focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        )}
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
