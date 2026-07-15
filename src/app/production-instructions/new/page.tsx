'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Step1OrderSelect from '../_components/Step1OrderSelect'
import Step2ProductionInfo from '../_components/Step2ProductionInfo'
import Step3MaterialConfirm from '../_components/Step3MaterialConfirm'
import { createProductionInstruction } from '@/app/actions/production-instructions'

export type PIFormData = {
  // Step 1
  order_id: string
  order_no: string
  product_id: string
  product_code: string
  product_name: string
  company_id: string
  company_code: string
  template_type: 'HAE' | 'NLC' | 'SMK' | 'YAE' | 'GENERAL'
  material_spec: string
  material_thickness: number | null
  material_width: number | null
  antistatic: boolean
  silicon: boolean
  surface_coating: boolean
  recycled_pct: number
  // Step 2
  production_site: string
  quantity_ordered: number
  requested_date: string
  delivery_site_id: string
  delivery_site_name: string
  is_first_time: boolean
  has_label: boolean
  notes: string
  // Step 3 (computed)
  material_stock_warning: boolean
  material_stock_qty: number | null
}

const INITIAL: PIFormData = {
  order_id: '', order_no: '', product_id: '', product_code: '', product_name: '',
  company_id: '', company_code: '', template_type: 'GENERAL',
  material_spec: '', material_thickness: null, material_width: null,
  antistatic: false, silicon: false, surface_coating: false, recycled_pct: 0,
  production_site: '本社', quantity_ordered: 0, requested_date: '',
  delivery_site_id: '', delivery_site_name: '',
  is_first_time: false, has_label: false, notes: '',
  material_stock_warning: false, material_stock_qty: null,
}

const STEPS = ['① 受注選択', '② 生産情報', '③ 材料確認']

export default function NewProductionInstructionPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PIFormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<PIFormData>) => setForm(f => ({ ...f, ...patch }))

  const handleSubmit = async (status: 'DRAFT' | 'ISSUED') => {
    setSubmitting(true)
    setError(null)
    const result = await createProductionInstruction({ ...form, status })
    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }
    router.push(`/production-instructions/${result.id}`)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">生産指示書 新規作成</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
              ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {step === 0 && <Step1OrderSelect form={form} update={update} onNext={() => setStep(1)} />}
        {step === 1 && <Step2ProductionInfo form={form} update={update} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step3MaterialConfirm
            form={form}
            update={update}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</p>}
      </div>
    </div>
  )
}
