'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { OrderForm } from '../_components/OrderForm'
import { ArrowLeft } from 'lucide-react'

export default function CreateOrderPage() {
  const router = useRouter()

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
          新規受注登録
        </h1>
      </div>

      <OrderForm />
    </div>
  )
}
