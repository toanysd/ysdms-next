'use client'

import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { OrderForm } from '../_components/OrderForm'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CreateOrderPage() {
  const router = useRouter()
  const t = useTranslations('Orders')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button 
          onClick={() => router.back()} 
          className="btn btn-secondary"
          style={{ marginRight: 16, padding: '8px 12px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          {t('newOrderRegistration')}
        </h1>
      </div>

      <Suspense fallback={<div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>}>
        <OrderForm />
      </Suspense>
    </div>
  )
}
