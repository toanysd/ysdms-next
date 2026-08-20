'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { Wrench, FlaskConical, Package, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react'

interface ProductKPIBarProps {
  productId: string
}

interface KPIData {
  setCount: number
  totalSetPossible: number
  sampleStatus: string | null
  sampleType: string | null
  totalOrderedQty: number
  totalHoursSpent: number
  loading: boolean
}

export const ProductKPIBar: React.FC<ProductKPIBarProps> = ({ productId }) => {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [kpi, setKpi] = useState<KPIData>({
    setCount: 0,
    totalSetPossible: 8,
    sampleStatus: null,
    sampleType: null,
    totalOrderedQty: 0,
    totalHoursSpent: 0,
    loading: true,
  })

  useEffect(() => {
    let isMounted = true

    async function loadKPIs() {
      if (!productId) return

      try {
        // 1. SET Completeness Query:
        // Get all design revisions for this product -> find related equipment & assignments
        const fetchSet = async () => {
          const { data: revs } = await supabase
            .from('design_revisions')
            .select('revision_id')
            .eq('product_id', productId)

          if (!revs || revs.length === 0) return 0

          const revIds = revs.map((r) => r.revision_id)
          const { data: directEquip } = await supabase
            .from('equipment')
            .select('equipment_type, equipment_id')
            .in('design_revision_id', revIds)

          const types = new Set<string>()
          const moldIds: string[] = []

          if (directEquip) {
            directEquip.forEach((eq) => {
              if (eq.equipment_type) types.add(eq.equipment_type)
              if (eq.equipment_type === 'MOLD') {
                moldIds.push(eq.equipment_id)
              }
            })
          }

          // Check assignments attached to these molds
          if (moldIds.length > 0) {
            const { data: assignments } = await supabase
              .from('equipment_assignments')
              .select('assigned_equipment_id, equipment:equipment!equipment_assignments_assigned_equipment_id_fkey(equipment_type)')
              .in('primary_equipment_id', moldIds)

            if (assignments) {
              assignments.forEach((a: any) => {
                if (a.equipment?.equipment_type) {
                  types.add(a.equipment.equipment_type)
                }
              })
            }
          }

          return types.size
        }

        // 2. Latest Sample Request Status
        const fetchSample = async () => {
          const { data } = await supabase
            .from('sample_requests')
            .select('result_status, sample_type, created_at')
            .eq('product_id', productId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          return data ? { status: data.result_status, type: data.sample_type } : null
        }

        // 3. Total Ordered Quantity (pcs)
        const fetchOrders = async () => {
          const { data } = await supabase
            .from('order_lines')
            .select('quantity')
            .eq('product_id', productId)

          if (!data) return 0
          return data.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0)
        }

        // 4. Total Worklog Hours Spent
        const fetchHours = async () => {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('job_id')
            .eq('product_id', productId)

          if (!jobs || jobs.length === 0) return 0

          const jobIds = jobs.map((j) => j.job_id)
          const { data: logs } = await supabase
            .from('work_logs')
            .select('hours_spent')
            .in('job_id', jobIds)

          if (!logs) return 0
          return logs.reduce((sum, l) => sum + (Number(l.hours_spent) || 0), 0)
        }

        // Execute all 4 queries in parallel
        const [setCount, sampleInfo, totalOrderedQty, totalHoursSpent] = await Promise.all([
          fetchSet(),
          fetchSample(),
          fetchOrders(),
          fetchHours(),
        ])

        if (isMounted) {
          setKpi({
            setCount,
            totalSetPossible: 8,
            sampleStatus: sampleInfo?.status || null,
            sampleType: sampleInfo?.type || null,
            totalOrderedQty,
            totalHoursSpent,
            loading: false,
          })
        }
      } catch (err) {
        console.error('Error fetching Product KPI bar data:', err)
        if (isMounted) {
          setKpi((prev) => ({ ...prev, loading: false }))
        }
      }
    }

    loadKPIs()

    return () => {
      isMounted = false
    }
  }, [productId])

  // Sample status formatting
  const renderSampleBadge = () => {
    if (!kpi.sampleStatus) {
      return (
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          —
        </span>
      )
    }

    switch (kpi.sampleStatus) {
      case 'CUSTOMER_OK':
        return (
          <span style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
            <CheckCircle2 size={13} />
            <span>合格 (OK)</span>
          </span>
        )
      case 'CUSTOMER_NG':
        return (
          <span style={{ color: '#DC2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
            <AlertTriangle size={13} />
            <span>不合格 (NG)</span>
          </span>
        )
      case 'SENT_TO_CUSTOMER':
        return <span style={{ color: '#0284C7', fontWeight: 700 }}>🚚 送付済</span>
      case 'IN_MAKING':
        return <span style={{ color: '#D97706', fontWeight: 700 }}>⚙️ 試作中</span>
      case 'REQUESTED':
        return <span style={{ color: '#64748B', fontWeight: 700 }}>📝 依頼済</span>
      default:
        return <span>{kpi.sampleStatus}</span>
    }
  }

  return (
    <div style={{
      background: 'var(--bg-surface, #ffffff)',
      borderBottom: '1px solid var(--border-default, #e2e8f0)',
      padding: '6px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      fontSize: 12,
    }}>
      {/* KPI Item 1: SET Completeness */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 8px', borderRadius: 4,
        background: kpi.setCount >= 6 ? '#ECFDF5' : '#FFFBEB',
        border: `1px solid ${kpi.setCount >= 6 ? '#A7F3D0' : '#FDE68A'}`,
      }}>
        <Wrench size={13} style={{ color: kpi.setCount >= 6 ? '#059669' : '#D97706' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('kpiSetCompleteness') || 'SET設備'}:</span>
        <span style={{
          fontFamily: 'monospace', fontWeight: 800, fontSize: 12,
          color: kpi.setCount >= 6 ? '#059669' : '#D97706',
        }}>
          {kpi.loading ? '...' : `${kpi.setCount}/${kpi.totalSetPossible}`}
        </span>
      </div>

      {/* KPI Item 2: Sample Test Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 8px', borderRadius: 4,
        background: '#F8FAFC',
        border: '1px solid var(--border-default, #e2e8f0)',
      }}>
        <FlaskConical size={13} style={{ color: 'var(--tint-purple-text, #8B5CF6)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('kpiSampleVerdict') || '試作判定'}:</span>
        <span style={{ fontSize: 11 }}>
          {kpi.loading ? '...' : renderSampleBadge()}
        </span>
      </div>

      {/* KPI Item 3: Total Ordered Quantity */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 8px', borderRadius: 4,
        background: '#F8FAFC',
        border: '1px solid var(--border-default, #e2e8f0)',
      }}>
        <Package size={13} style={{ color: 'var(--accent, #0D9488)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('kpiTotalOrders') || '総受注'}:</span>
        <span style={{
          fontFamily: 'monospace', fontWeight: 800, fontSize: 12,
          color: 'var(--text-primary)',
        }}>
          {kpi.loading ? '...' : `${kpi.totalOrderedQty.toLocaleString()} pcs`}
        </span>
      </div>

      {/* KPI Item 4: Total Worklog Hours */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '3px 8px', borderRadius: 4,
        background: '#F8FAFC',
        border: '1px solid var(--border-default, #e2e8f0)',
      }}>
        <Clock size={13} style={{ color: 'var(--tint-blue-text, #3B82F6)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('totalActualHours') || '実績工数'}:</span>
        <span style={{
          fontFamily: 'monospace', fontWeight: 800, fontSize: 12,
          color: 'var(--text-primary)',
        }}>
          {kpi.loading ? '...' : `${kpi.totalHoursSpent.toFixed(1)} h`}
        </span>
      </div>
    </div>
  )
}
