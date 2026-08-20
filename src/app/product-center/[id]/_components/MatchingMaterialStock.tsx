'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import {
  Layers, Package, MapPin, CheckCircle2,
  AlertTriangle, RefreshCw, AlertCircle, Info, Sparkles
} from 'lucide-react'

interface MatchingMaterialStockProps {
  productId: string
  plasticTypeDesigned?: string | null
}

interface RollItem {
  id: string
  roll_barcode: string
  current_length_m: number
  nominal_length_m: number
  status: string | null
  location: string | null
  warehouse_location: string | null
  lot_no: string | null
  supplier_name: string | null
  plastic_master: {
    plastic_id: string
    plastic_code: string
    plastic_family: string | null
    thickness_mm: number | null
    width_mm: number | null
  } | null
}

export const MatchingMaterialStock: React.FC<MatchingMaterialStockProps> = ({
  productId,
  plasticTypeDesigned,
}) => {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [targetPlastic, setTargetPlastic] = useState<string | null>(plasticTypeDesigned || null)
  const [rolls, setRolls] = useState<RollItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMaterialAndStock = async () => {
    if (!productId) return
    setLoading(true)
    setError(null)

    try {
      let plasticCodeToMatch = targetPlastic

      // 1. If targetPlastic is not provided from props, fetch from latest design revision
      if (!plasticCodeToMatch) {
        const { data: rev, error: revErr } = await supabase
          .from('design_revisions')
          .select('plastic_type_designed')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (revErr) throw revErr
        plasticCodeToMatch = rev?.plastic_type_designed || null
        setTargetPlastic(plasticCodeToMatch)
      }

      // Edge case: If plasticCodeToMatch is null or empty, don't execute empty queries
      if (!plasticCodeToMatch || plasticCodeToMatch.trim() === '') {
        setRolls([])
        setLoading(false)
        return
      }

      // 2. Query plastic_receipt_roll with plastic_master
      const { data: allRolls, error: rollErr } = await supabase
        .from('plastic_receipt_roll')
        .select(`
          id, roll_barcode, current_length_m, nominal_length_m, status, location, warehouse_location, lot_no, supplier_name,
          plastic_master:plastic_master!plastic_receipt_roll_plastic_id_fkey (
            plastic_id, plastic_code, plastic_family, thickness_mm, width_mm
          )
        `)
        .eq('status', 'in_stock')
        .order('current_length_m', { ascending: false })

      if (rollErr) throw rollErr

      if (allRolls) {
        const cleanTarget = plasticCodeToMatch.toLowerCase().replace(/[\s\-_]/g, '')

        // Match by exact code or substring / family matching
        const matched = (allRolls as unknown as RollItem[]).filter((r) => {
          if (!r.plastic_master) return false
          const pCode = (r.plastic_master.plastic_code || '').toLowerCase().replace(/[\s\-_]/g, '')
          const pFamily = (r.plastic_master.plastic_family || '').toLowerCase().replace(/[\s\-_]/g, '')

          if (pCode && (cleanTarget.includes(pCode) || pCode.includes(cleanTarget))) return true
          if (pFamily && cleanTarget.includes(pFamily)) {
            // Also check thickness if specified
            if (r.plastic_master.thickness_mm) {
              const thStr = String(r.plastic_master.thickness_mm)
              if (cleanTarget.includes(thStr) || cleanTarget.includes(`${thStr}t`)) return true
            }
            return true
          }
          return false
        })

        setRolls(matched)
      }
    } catch (err: any) {
      console.error('Error loading matching material stock:', err)
      setError(err?.message || 'Lỗi tải tồn kho cuộn nhựa')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterialAndStock()
  }, [productId, plasticTypeDesigned])

  // Summary aggregation
  const { totalRolls, totalLengthMeters } = useMemo(() => {
    const totalLength = rolls.reduce((sum, r) => sum + (Number(r.current_length_m) || 0), 0)
    return {
      totalRolls: rolls.length,
      totalLengthMeters: totalLength,
    }
  }, [rolls])

  // 1. Edge case: Material Code Not Set
  if (!targetPlastic || targetPlastic.trim() === '') {
    return (
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid #FDE68A' }}>
        <div style={{
          background: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#D97706',
        }}>
          <AlertCircle size={16} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            {t('matchingMaterialStock')}
          </span>
        </div>
        <div style={{ padding: '16px 20px', color: '#92400E', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            {t('materialCodeNotSet')} — 設計図面に指定プラスチック樹脂が未登録のため、在庫照合をスキップしました。
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border, #bfdbfe)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--tint-blue-bg, #eff6ff)',
        borderBottom: '1px solid var(--tint-blue-border, #bfdbfe)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} style={{ color: 'var(--tint-blue-text, #2563eb)' }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('matchingMaterialStock')}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
              background: '#DBEAFE', color: '#1D4ED8', padding: '1px 8px', borderRadius: 4, marginLeft: 8
            }}>
              {targetPlastic}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={loadMaterialAndStock}
            className="btn btn-secondary"
            style={{ height: 24, width: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="再読込 (Làm mới)"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        padding: '10px 14px',
        background: 'var(--bg-surface-2, #f8fafc)',
        borderBottom: '1px solid var(--border-default, #e2e8f0)',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('totalRollsCount')}</div>
          <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: totalRolls > 0 ? '#059669' : 'var(--text-primary)' }}>
            {loading ? '...' : `${totalRolls} 本 (Rolls)`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('totalLengthMeters')}</div>
          <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {loading ? '...' : `${totalLengthMeters.toLocaleString()} m`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>在庫状況 (Status)</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: totalRolls > 0 ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
            {totalRolls > 0 ? (
              <>
                <CheckCircle2 size={13} />
                <span>{t('materialStockAvailable')}</span>
              </>
            ) : (
              <>
                <AlertTriangle size={13} />
                <span>在庫不足 / 欠品</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ padding: 12 }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            在庫ロールを照合中... (Checking stock...)
          </div>
        ) : error ? (
          <div style={{ padding: 14, color: '#DC2626', fontSize: 12 }}>
            <AlertTriangle size={14} style={{ display: 'inline', marginRight: 4 }} /> {error}
          </div>
        ) : rolls.length === 0 ? (
          <div style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <AlertTriangle size={18} style={{ margin: '0 auto 6px', color: '#D97706' }} />
            <div>{t('noMatchingRolls')}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{t('rollBarcode')}</th>
                  <th style={{ textAlign: 'left' }}>{t('materialSpec')}</th>
                  <th style={{ textAlign: 'right' }}>厚み (mm)</th>
                  <th style={{ textAlign: 'right' }}>巾 (mm)</th>
                  <th style={{ textAlign: 'right' }}>{t('currentLength')}</th>
                  <th style={{ textAlign: 'left' }}>ロットNo.</th>
                  <th style={{ textAlign: 'left' }}>保管場所</th>
                </tr>
              </thead>
              <tbody>
                {rolls.map((roll) => (
                  <tr key={roll.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
                      {roll.roll_barcode}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {roll.plastic_master?.plastic_code || targetPlastic}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                      {roll.plastic_master?.thickness_mm ?? '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                      {roll.plastic_master?.width_mm ?? '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#059669' }}>
                      {roll.current_length_m?.toLocaleString()} m
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {roll.lot_no || '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={11} style={{ color: 'var(--text-muted)' }} />
                        {roll.location || roll.warehouse_location || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
