'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} className="btn btn-secondary !p-1.5" title="Quay lại">
      <ArrowLeft size={18} />
    </button>
  )
}
