'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  Package, Layers, Wrench, CalendarRange, PlusCircle, Hammer,
  Printer, FileText, BarChart3, Briefcase, Truck, Building2,
  ChevronRight, Sparkles
} from 'lucide-react'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'

type ActionItem = {
  key: string
  titleKey: string
  descKey: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  type: 'link' | 'action'
  href?: string
  actionType?: 'PRINT_NIPPO'
  badge?: string
  isPrimary?: boolean
}

type ActionGroup = {
  key: string
  titleKey: string
  tintBg: string
  tintBorder: string
  iconColor: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  items: ActionItem[]
}

export function QuickActionsHub() {
  const t = useTranslations('Dashboard.quickHub')
  const [isNippoModalOpen, setIsNippoModalOpen] = useState(false)

  const GROUPS: ActionGroup[] = [
    {
      key: 'engineering',
      titleKey: 'deptEngineering',
      tintBg: 'var(--tint-teal-bg)',
      tintBorder: 'var(--tint-teal-border)',
      iconColor: 'var(--accent)',
      icon: Package,
      items: [
        {
          key: 'product-center',
          titleKey: 'productCenter',
          descKey: 'productCenterDesc',
          icon: Package,
          type: 'link',
          href: '/product-center',
          isPrimary: true,
        },
        {
          key: 'cad-designs',
          titleKey: 'cadDesigns',
          descKey: 'cadDesignsDesc',
          icon: Layers,
          type: 'link',
          href: '/engineering/designs',
        },
        {
          key: 'equipment-list',
          titleKey: 'equipmentList',
          descKey: 'equipmentListDesc',
          icon: Wrench,
          type: 'link',
          href: '/equipment/molds',
        },
      ],
    },
    {
      key: 'manufacturing',
      titleKey: 'deptManufacturing',
      tintBg: 'var(--tint-blue-bg)',
      tintBorder: 'var(--tint-blue-border)',
      iconColor: 'var(--status-info, #2563eb)',
      icon: CalendarRange,
      items: [
        {
          key: 'mold-schedule',
          titleKey: 'moldSchedule',
          descKey: 'moldScheduleDesc',
          icon: CalendarRange,
          type: 'link',
          href: '/equipment/schedule',
          isPrimary: true,
        },
        {
          key: 'quick-create-job',
          titleKey: 'quickCreateJob',
          descKey: 'quickCreateJobDesc',
          icon: PlusCircle,
          type: 'link',
          href: '/equipment/jobs/quick-create',
        },
        {
          key: 'job-list',
          titleKey: 'jobList',
          descKey: 'jobListDesc',
          icon: Hammer,
          type: 'link',
          href: '/equipment/jobs',
        },
      ],
    },
    {
      key: 'worklog',
      titleKey: 'deptWorklog',
      tintBg: 'var(--tint-orange-bg)',
      tintBorder: 'var(--tint-orange-border)',
      iconColor: 'var(--status-warning, #d97706)',
      icon: Printer,
      items: [
        {
          key: 'print-nippo',
          titleKey: 'printNippo',
          descKey: 'printNippoDesc',
          icon: Printer,
          type: 'action',
          actionType: 'PRINT_NIPPO',
          isPrimary: true,
        },
        {
          key: 'worklog-input',
          titleKey: 'worklogInput',
          descKey: 'worklogInputDesc',
          icon: FileText,
          type: 'link',
          href: '/worklog',
        },
        {
          key: 'daily-report',
          titleKey: 'dailyReport',
          descKey: 'dailyReportDesc',
          icon: BarChart3,
          type: 'link',
          href: '/reports/daily-worklog',
        },
      ],
    },
    {
      key: 'sales',
      titleKey: 'deptSales',
      tintBg: 'var(--tint-purple-bg)',
      tintBorder: 'var(--tint-purple-border)',
      iconColor: 'var(--status-success, #059669)',
      icon: Briefcase,
      items: [
        {
          key: 'case-management',
          titleKey: 'caseManagement',
          descKey: 'caseManagementDesc',
          icon: Briefcase,
          type: 'link',
          href: '/cases',
          isPrimary: true,
        },
        {
          key: 'order-management',
          titleKey: 'orderManagement',
          descKey: 'orderManagementDesc',
          icon: Truck,
          type: 'link',
          href: '/orders',
        },
        {
          key: 'customer-master',
          titleKey: 'customerMaster',
          descKey: 'customerMasterDesc',
          icon: Building2,
          type: 'link',
          href: '/master/customers',
        },
      ],
    },
  ]

  const handleAction = (item: ActionItem) => {
    if (item.actionType === 'PRINT_NIPPO') {
      setIsNippoModalOpen(true)
    }
  }

  return (
    <>
      <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)', margin: 0 }}>
              {t('title')}
            </h2>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              — {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Department Action Groups */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
          }}
        >
          {GROUPS.map((group) => {
            const GroupIcon = group.icon
            return (
              <div
                key={group.key}
                style={{
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Department Header */}
                <div
                  style={{
                    padding: '6px 10px',
                    background: group.tintBg,
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <GroupIcon size={14} style={{ color: group.iconColor }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                    {t(group.titleKey as any)}
                  </span>
                </div>

                {/* Action Items */}
                <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    const isLink = item.type === 'link' && item.href

                    const content = (
                      <div
                        className="group flex items-center justify-between p-2 rounded transition-all hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-default)]"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: item.isPrimary ? 'var(--bg-surface-2)' : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: item.isPrimary ? group.tintBg : 'var(--bg-surface)',
                              color: item.isPrimary ? group.iconColor : 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                              flexShrink: 0,
                            }}
                          >
                            <ItemIcon size={13} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: item.isPrimary ? 700 : 600,
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {t(item.titleKey as any)}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {t(item.descKey as any)}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          size={13}
                          className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1"
                        />
                      </div>
                    )

                    if (isLink) {
                      return (
                        <Link
                          key={item.key}
                          href={item.href!}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {content}
                        </Link>
                      )
                    }

                    return (
                      <div key={item.key} onClick={() => handleAction(item)}>
                        {content}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Direct Nippo Modal from Dashboard */}
      {isNippoModalOpen && (
        <DailyWorklogQuickModal
          isOpen={isNippoModalOpen}
          onClose={() => setIsNippoModalOpen(false)}
        />
      )}
    </>
  )
}
