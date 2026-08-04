'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { searchDeliverySites, getStandardTags } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

const PRODUCTION_SITES = ['本社', '青森', '茨城', '坂田']

interface DeliverySite { site_id: string; site_name: string; site_code: string; site_address: string | null }
interface Props { form: PIFormData; update: (p: Partial<PIFormData>) => void; onBack: () => void; onNext: () => void }

export default function Step2ProductionInfo({ form, update, onBack, onNext }: Props) {
  const t = useTranslations('ProductionInstructions')
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
      alert(t('valCustomTagLimit'))
      return
    }

    const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(val)
    const maxLen = isJapanese ? 12 : 24
    if (val.length > maxLen) {
      alert(t('valCustomTagLength', { len: val.length }))
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
      <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('productionInfo')}</h2>

      {/* Production site */}
      <div>
        <label className="form-label mb-1">{t('productionSite')} <span className="text-red-500">*</span></label>
        <div className="flex gap-2 flex-wrap">
          {PRODUCTION_SITES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => update({ production_site: s })}
              className={`btn text-xs font-bold ${
                form.production_site === s
                  ? 'btn-primary'
                  : 'btn-secondary'
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
          <label className="form-label mb-1">{t('plannedQuantity')} <span className="text-red-500">*</span></label>
          <input
            type="number"
            min={1}
            value={form.quantity_ordered || ''}
            onChange={e => update({ quantity_ordered: parseInt(e.target.value) || 0 })}
            className="form-input font-mono font-bold"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="form-label mb-1">{t('dailyQuantity')}</label>
          <input
            type="number"
            min={1}
            value={form.daily_quantity || ''}
            onChange={e => update({ daily_quantity: parseInt(e.target.value) || null })}
            className="form-input font-mono font-bold"
            placeholder="200"
          />
        </div>
        <div>
          <label className="form-label mb-1">{t('requestedDate')} <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.requested_date}
            onChange={e => update({ requested_date: e.target.value })}
            className="form-input font-mono font-bold"
          />
        </div>
      </div>

      {/* Material Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label mb-1">{t('materialThickness')}</label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={form.material_thickness || ''}
            onChange={e => update({ material_thickness: parseFloat(e.target.value) || null })}
            className="form-input font-mono"
            placeholder="0.5"
          />
        </div>
        <div>
          <label className="form-label mb-1">{t('materialWidth')}</label>
          <input
            type="number"
            min={0}
            value={form.material_width || ''}
            onChange={e => update({ material_width: parseInt(e.target.value) || null })}
            className="form-input font-mono"
            placeholder="640"
          />
        </div>
      </div>

      {/* Delivery site */}
      <div>
        <label className="form-label mb-1">{t('deliverySite')} <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder={t('deliverySitePlaceholder')}
          value={siteQuery}
          onChange={e => setSiteQuery(e.target.value)}
          className="form-input form-input-search"
        />
        {searching && <p className="text-xs text-[var(--text-muted)] mt-1">{t('searching')}</p>}
        {siteResults.length > 0 && (
          <div className="mt-1 border border-[var(--border-default)] rounded-md max-h-48 overflow-y-auto bg-[var(--bg-surface)]">
            {siteResults.map(site => (
              <button
                key={site.site_id}
                type="button"
                onClick={() => { update({ delivery_site_id: site.site_id, delivery_site_name: site.site_name }); setSiteQuery(site.site_name); setSiteResults([]) }}
                className="w-full text-left px-3 py-2 hover:bg-[var(--bg-surface-2)] text-sm border-b border-[var(--border-subtle)] last:border-0"
              >
                <span className="font-mono text-[var(--accent)] font-bold mr-2">[{site.site_code}]</span>
                <span className="font-semibold text-[var(--text-primary)]">{site.site_name}</span>
                {site.site_address && <span className="text-xs text-[var(--text-muted)] ml-2">{site.site_address}</span>}
              </button>
            ))}
          </div>
        )}
        {form.delivery_site_id && (
          <p className="mt-1 text-sm text-[var(--status-success)] font-bold">✓ {form.delivery_site_name}</p>
        )}
      </div>

      {/* Packaging Options Checkboxes */}
      <div>
        <label className="form-label mb-1">{t('packagingInstructions')}</label>
        <div className="grid grid-cols-2 gap-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-md p-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-[var(--text-primary)]">
            <input type="checkbox" checked={form.is_first_time} onChange={e => update({ is_first_time: e.target.checked })} className="rounded text-[var(--accent)] focus:ring-[var(--accent)]" />
            {t('isFirstTime')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-[var(--text-primary)]">
            <input type="checkbox" checked={form.has_label} onChange={e => update({ has_label: e.target.checked })} className="rounded text-[var(--accent)] focus:ring-[var(--accent)]" />
            {t('hasLabel')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-[var(--text-primary)]">
            <input type="checkbox" checked={form.plain_case} onChange={e => update({ plain_case: e.target.checked })} className="rounded text-[var(--accent)] focus:ring-[var(--accent)]" />
            {t('plainCase')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-[var(--text-primary)]">
            <input type="checkbox" checked={form.plain_label} onChange={e => update({ plain_label: e.target.checked })} className="rounded text-[var(--accent)] focus:ring-[var(--accent)]" />
            {t('plainLabel')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-[var(--text-primary)]">
            <input type="checkbox" checked={form.adhesive_sheet} onChange={e => update({ adhesive_sheet: e.target.checked })} className="rounded text-[var(--accent)] focus:ring-[var(--accent)]" />
            {t('adhesiveSheet')}
          </label>
        </div>
      </div>

      {/* Tag Selector */}
      <div className="space-y-3">
        <div>
          <label className="form-label mb-1">{t('instructionTags')} <span className="text-xs text-[var(--text-muted)]">({t('tagsNote')})</span></label>
          <div className="flex gap-2 flex-wrap mb-2">
            {standardTags.map(tag => {
              const isSelected = form.tags.some(tItem => tItem.tag_code === tag.tag_code)
              const isRed = tag.print_style === 'red' || tag.print_style === 'red_bold'
              return (
                <button
                  key={tag.tag_code}
                  type="button"
                  onClick={() => handleToggleTag(tag.tag_code)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all font-bold ${
                    isSelected
                      ? isRed
                        ? 'bg-[var(--bg-error)] text-[var(--status-error)] border-[var(--status-error)] ring-2 ring-[var(--status-error)]/20'
                        : 'bg-[var(--accent)] text-white border-[var(--accent)] ring-2 ring-[var(--accent)]/20'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-default)] hover:border-[var(--border-strong)]'
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
          <label className="form-label mb-1">{t('customTagAdd')} <span className="text-xs text-[var(--text-muted)]">({t('customTagNote')})</span></label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('customTagPlaceholder')}
              value={customTagInput}
              onChange={e => setCustomTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              disabled={form.tags.filter(tItem => tItem.custom_label !== null).length >= 2}
              className="form-input flex-1 disabled:bg-[var(--bg-surface-2)] disabled:text-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              disabled={!customTagInput.trim() || form.tags.filter(tItem => tItem.custom_label !== null).length >= 2}
              className="btn btn-primary text-xs font-bold disabled:opacity-40"
            >
              {t('add')}
            </button>
          </div>
        </div>

        {/* Selected Tags Preview */}
        {form.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-md p-3">
            <span className="text-xs text-[var(--text-muted)] font-semibold">{t('selectedTags')}</span>
            {form.tags.map((tag, idx) => {
              const matchedStandard = standardTags.find(s => s.tag_code === tag.tag_code)
              const label = matchedStandard ? matchedStandard.label_ja : tag.custom_label
              const isRed = matchedStandard && (matchedStandard.print_style === 'red' || matchedStandard.print_style === 'red_bold')
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${
                    isRed
                      ? 'bg-[var(--bg-error)] text-[var(--status-error)] border-[var(--status-error)]/30'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-default)]'
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
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold focus:outline-none ml-1"
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
        <label className="form-label mb-1">{t('notes')}</label>
        <textarea
          value={form.notes}
          onChange={e => update({ notes: e.target.value })}
          rows={3}
          className="form-textarea resize-none"
          placeholder={t('notesPlaceholder')}
        />
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="btn btn-secondary font-bold px-4">← {t('back')}</button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="btn btn-primary font-bold px-6"
        >
          {t('next')} →
        </button>
      </div>
    </div>
  )
}

