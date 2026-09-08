'use client'

import React from 'react'
import { PlayCircle, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { WorkOrderKpis } from '../types'

interface WorkOrderKpiCardsProps {
  kpis: WorkOrderKpis
  activeStatus?: string
  onStatusSelect?: (status: string) => void
}

export function WorkOrderKpiCards({
  kpis,
  activeStatus,
  onStatusSelect,
}: WorkOrderKpiCardsProps) {
  const t = useTranslations('WorkOrders')

  const cards = [
    {
      id: 'IN_PROGRESS',
      label: t('kpiInProgress'),
      count: kpis.in_progress,
      icon: PlayCircle,
      iconColor: '#0284C7',
      bgTint: 'var(--tint-blue-bg, #EFF6FF)',
      borderColor: '#BAE6FD',
    },
    {
      id: 'PLANNED',
      label: t('kpiPlanned'),
      count: kpis.planned,
      icon: Clock,
      iconColor: '#D97706',
      bgTint: 'var(--tint-orange-bg, #FFFBEB)',
      borderColor: '#FDE68A',
    },
    {
      id: 'OVERDUE',
      label: t('kpiOverdue'),
      count: kpis.overdue,
      icon: AlertTriangle,
      iconColor: '#DC2626',
      bgTint: '#FEF2F2',
      borderColor: '#FECACA',
    },
    {
      id: 'COMPLETED',
      label: t('kpiCompleted'),
      count: kpis.completed,
      icon: CheckCircle2,
      iconColor: '#16A34A',
      bgTint: 'var(--tint-teal-bg, #F0FDF4)',
      borderColor: '#BBF7D0',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        flexShrink: 0,
        padding: '0 16px',
      }}
    >
      {cards.map((c) => {
        const Icon = c.icon
        const isSelected = activeStatus === c.id

        return (
          <div
            key={c.id}
            onClick={() => onStatusSelect && onStatusSelect(c.id === activeStatus ? 'ALL' : c.id)}
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 6,
              border: `1.5px solid ${isSelected ? c.iconColor : 'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                }}
              >
                {c.count}
              </div>
            </div>

            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 6,
                backgroundColor: c.bgTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={18} color={c.iconColor} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
