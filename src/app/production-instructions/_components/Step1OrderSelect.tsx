'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { searchOrders } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

const COMPANY_TEMPLATE_MAP: Record<string, 'HAE' | 'NLC' | 'SMK' | 'YAE' | 'GENERAL'> = {
  HAE: 'HAE', JAE: 'HAE', NLC: 'NLC', SMK: 'SMK', YAE: 'YAE',
}

interface OrderResult {
  order_id: string
  order_no: string
  products: {
    product_id: string
    product_code: string
    product_name: string
    primary_plastic_code: string | null
    primary_plastic_spec: string | null
    latest_design_revision_id: string | null
  } | null
  companies: { company_id: string; company_name: string; company_code: string } | null
}

interface Props { form: PIFormData; update: (p: Partial<PIFormData>) => void; onNext: () => void }

export default function Step1OrderSelect({ form, update, onNext }: Props) {
  const t = useTranslations('ProductionInstructions')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OrderResult[]>([])
  const [searching, setSearching] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setSearching(true)
    const data = await searchOrders(query)
    setResults(data as unknown as OrderResult[])
    setSearching(false)
  }

  const select = (order: OrderResult) => {
    const p = order.products
    const c = order.companies
    const companyCode = c?.company_code?.toUpperCase() ?? ''
    update({
      order_id: order.order_id,
      order_no: order.order_no,
      product_id: p?.product_id ?? '',
      product_code: p?.product_code ?? '',
      product_name: p?.product_name ?? '',
      company_id: c?.company_id ?? '',
      company_code: companyCode,
      template_type: COMPANY_TEMPLATE_MAP[companyCode] ?? 'GENERAL',
      material_spec: p?.primary_plastic_spec ?? p?.primary_plastic_code ?? '',
      material_thickness: 0,
      material_width: 0,
      recycled_pct: 0,
      design_revision_id: p?.latest_design_revision_id ?? null,
    })
  }

  const canNext = !!form.order_id

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('selectOrder')}</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t('searchOrderPlaceholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="form-input form-input-search flex-1"
        />
        <button
          onClick={search}
          disabled={searching}
          className="btn btn-secondary font-bold text-xs"
        >
          {searching ? t('searching') : t('search')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="border border-[var(--border-default)] rounded-md overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('orderNo')}</th>
                <th>{t('productCode')}</th>
                <th>{t('productName')}</th>
                <th>{t('customer')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map(o => (
                <tr
                  key={o.order_id}
                  onClick={() => select(o)}
                  className={`cursor-pointer ${
                    form.order_id === o.order_id ? 'bg-[var(--tint-blue-bg)] font-bold' : ''
                  }`}
                >
                  <td className="font-mono text-[var(--accent)] font-bold">{o.order_no}</td>
                  <td className="font-mono font-bold text-[var(--text-primary)]">{o.products?.product_code}</td>
                  <td className="text-[var(--text-primary)]">{o.products?.product_name}</td>
                  <td>{o.companies?.company_name}</td>
                  <td className="text-[var(--accent)] font-bold">
                    {form.order_id === o.order_id ? `✓ ${t('selected')}` : t('selectAction')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form.order_id && (
        <div className="card-flat bg-[var(--tint-teal-bg)] border-[var(--accent)]/30 p-4 text-sm space-y-1.5">
          <p className="font-bold text-[var(--accent)] text-base">{t('selectedOrderDetails')}</p>
          <p className="text-[var(--text-primary)]">{t('orderNo')}: <span className="font-mono font-bold text-[var(--accent)]">{form.order_no}</span></p>
          <p className="text-[var(--text-primary)]">{t('productCode')}: <span className="font-mono font-bold">{form.product_code}</span> — {form.product_name}</p>
          <p className="text-[var(--text-primary)]">{t('material')}: <span className="font-semibold">{form.material_spec || '—'}</span></p>
          <p className="text-[var(--text-primary)]">{t('template')}: <span className="badge badge--info font-mono font-bold">{form.template_type}</span></p>
        </div>
      )}

      <div className="flex justify-end pt-2">
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

