'use client'

import { useState } from 'react'
import { searchOrders } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

const COMPANY_TEMPLATE_MAP: Record<string, 'HAE' | 'NLC' | 'SMK' | 'YAE' | 'GENERAL'> = {
  HAE: 'HAE', JAE: 'HAE', NLC: 'NLC', SMK: 'SMK', YAE: 'YAE',
}

interface OrderResult {
  id: string
  order_no: string
  products: { id: string; product_code: string; product_name: string; material_spec: string | null; material_thickness: number | null; material_width: number | null; antistatic: boolean; silicon: boolean; surface_coating: boolean; recycled_pct: number } | null
  companies: { id: string; name: string; code: string } | null
}

interface Props { form: PIFormData; update: (p: Partial<PIFormData>) => void; onNext: () => void }

export default function Step1OrderSelect({ form, update, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OrderResult[]>([])
  const [searching, setSearching] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setSearching(true)
    const data = await searchOrders(query)
    setResults(data)
    setSearching(false)
  }

  const select = (order: OrderResult) => {
    const p = order.products
    const c = order.companies
    const companyCode = c?.code?.toUpperCase() ?? ''
    update({
      order_id: order.id,
      order_no: order.order_no,
      product_id: p?.id ?? '',
      product_code: p?.product_code ?? '',
      product_name: p?.product_name ?? '',
      company_id: c?.id ?? '',
      company_code: companyCode,
      template_type: COMPANY_TEMPLATE_MAP[companyCode] ?? 'GENERAL',
      material_spec: p?.material_spec ?? '',
      material_thickness: p?.material_thickness ?? null,
      material_width: p?.material_width ?? null,
      antistatic: p?.antistatic ?? false,
      silicon: p?.silicon ?? false,
      surface_coating: p?.surface_coating ?? false,
      recycled_pct: p?.recycled_pct ?? 0,
    })
  }

  const canNext = !!form.order_id

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">受注を選択</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="受注No. または 品番で検索"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <button
          onClick={search}
          disabled={searching}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
        >
          {searching ? '検索中...' : '検索'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['受注No.', '品番', '品名', '客先', ''].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map(o => (
                <tr
                  key={o.id}
                  onClick={() => select(o)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    form.order_id === o.id ? 'bg-blue-50 ring-1 ring-inset ring-blue-400' : ''
                  }`}
                >
                  <td className="px-3 py-2 font-mono">{o.order_no}</td>
                  <td className="px-3 py-2">{o.products?.product_code}</td>
                  <td className="px-3 py-2 text-gray-600">{o.products?.product_name}</td>
                  <td className="px-3 py-2">{o.companies?.name}</td>
                  <td className="px-3 py-2 text-blue-600">{form.order_id === o.id ? '✓ 選択中' : '選択'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form.order_id && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm space-y-1">
          <p className="font-semibold text-blue-800">選択中の受注</p>
          <p>受注No.: <span className="font-mono">{form.order_no}</span></p>
          <p>品番: {form.product_code} — {form.product_name}</p>
          <p>材料: {form.material_spec || '—'}</p>
          <p>テンプレート: <span className="font-semibold">{form.template_type}</span></p>
        </div>
      )}

      <div className="flex justify-end pt-2">
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
