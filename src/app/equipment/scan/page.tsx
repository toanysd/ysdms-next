'use client'

import React, { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  QrCode,
  Camera,
  ArrowLeft,
  Search,
  Sparkles,
} from 'lucide-react'

function ScanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('EquipmentLocations.qr')
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const trimmed = query.trim()
    // If it's a UUID or equipment code, navigate to locations search or mold detail
    if (trimmed.length > 20 && trimmed.includes('-')) {
      // Likely a UUID
      router.push(`/equipment/molds/${trimmed}`)
    } else {
      // Normal code search
      router.push(`/equipment/locations?search=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/equipment/locations"
          className="btn btn-secondary flex items-center gap-1.5 text-xs text-slate-700"
        >
          <ArrowLeft size={14} />
          <span>{t('backToLocations')}</span>
        </Link>
      </div>

      {/* Main Scanner Card */}
      <div className="card-flat bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-100 mb-2">
          <Camera size={32} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {t('scanTitle')}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {t('scanSubtitle')}
          </p>
        </div>

        {/* Camera Viewport Placeholder */}
        <div className="relative aspect-video max-w-md mx-auto bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-6 text-slate-400 overflow-hidden shadow-inner">
          {/* Viewfinder Target Graphic */}
          <div className="w-48 h-48 border-2 border-teal-500/50 border-dashed rounded-lg flex flex-col items-center justify-center p-4">
            <QrCode size={48} className="text-teal-400/60 mb-2 animate-pulse" />
            <span className="text-[11px] font-mono text-teal-300/80 uppercase tracking-wider font-semibold">
              AR Target Viewport
            </span>
          </div>

          <div className="absolute bottom-3 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-900/80 text-teal-400 px-3 py-1 rounded-full border border-slate-700">
              <Sparkles size={12} />
              <span>Camera AR Active in Sprint 2</span>
            </span>
          </div>
        </div>

        {/* Manual Query Fallback Form */}
        <div className="max-w-md mx-auto pt-2">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="M-ARK001-4 / UUID / Equipment Code..."
                className="form-input form-input-search w-full font-mono text-sm pl-9 pr-4 py-2"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim()}
              className="btn btn-primary w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              <Search size={15} />
              <span>{t('singleTitle')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-400">Loading...</div>}>
      <ScanContent />
    </Suspense>
  )
}
