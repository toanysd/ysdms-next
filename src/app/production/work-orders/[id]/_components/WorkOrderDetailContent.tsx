'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Info, Layers, Wrench, ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react'
import { WorkOrderDetailHeader } from './WorkOrderDetailHeader'
import { TabOverview } from './TabOverview'
import { TabEquipmentSet } from './TabEquipmentSet'
import { TabJobs } from './TabJobs'
import { TabWorklogs } from './TabWorklogs'
import type { WOEquipmentSetResult, WorkOrderWorklogItem, WOStatus } from '../../types'

interface WorkOrderDetailContentProps {
  wo: any
  equipmentSet: WOEquipmentSetResult | null
  worklogs: WorkOrderWorklogItem[]
}

export function WorkOrderDetailContent({
  wo,
  equipmentSet,
  worklogs,
}: WorkOrderDetailContentProps) {
  const t = useTranslations('WorkOrders')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const initialTab = searchParams?.get('tab') || 'equipment_set'
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam && ['equipment_set', 'overview', 'jobs', 'worklogs'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    params.set('tab', tabKey)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const jobs = wo.jobs || []
  const isSetReady = equipmentSet?.summary.is_all_ready ?? false
  const totalSetItems = equipmentSet?.summary.total_items ?? 0
  const readySetItems = equipmentSet?.summary.ready_items ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      
      {/* ── 1. Detail Header (Back/Up, Status, Actions, PDF) ── */}
      <WorkOrderDetailHeader
        woId={wo.wo_id}
        woCode={wo.wo_code}
        status={wo.wo_status as WOStatus}
        equipmentSet={equipmentSet}
      />

      {/* ── 2. Tab Navigation (.tab-nav) ── */}
      <div 
        className="tab-nav" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6, 
          padding: '0 16px', 
          borderBottom: '1px solid var(--border-default)', 
          flexShrink: 0,
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        {/* Tab 1: SET 設備一覧 (M19 Core) */}
        <button
          type="button"
          onClick={() => handleTabChange('equipment_set')}
          className={`tab-item ${activeTab === 'equipment_set' ? 'tab-item--active active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: activeTab === 'equipment_set' ? 700 : 500,
            borderBottom: activeTab === 'equipment_set' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'equipment_set' ? 'var(--accent)' : 'var(--text-secondary)',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          <Layers size={15} />
          <span>{t('tabEquipmentSet')}</span>
          {totalSetItems > 0 && (
            <span 
              className={`badge ${isSetReady ? 'badge--success' : 'badge--warning'}`}
              style={{ fontSize: 11, fontFamily: 'monospace', padding: '1px 6px' }}
            >
              {readySetItems}/{totalSetItems}
            </span>
          )}
        </button>

        {/* Tab 2: 概要・仕様 (Overview) */}
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className={`tab-item ${activeTab === 'overview' ? 'tab-item--active active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: activeTab === 'overview' ? 700 : 500,
            borderBottom: activeTab === 'overview' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--accent)' : 'var(--text-secondary)',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          <Info size={15} />
          <span>{t('tabOverview')}</span>
        </button>

        {/* Tab 3: ジョブ・工程進捗 (Jobs) */}
        <button
          type="button"
          onClick={() => handleTabChange('jobs')}
          className={`tab-item ${activeTab === 'jobs' ? 'tab-item--active active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: activeTab === 'jobs' ? 700 : 500,
            borderBottom: activeTab === 'jobs' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'jobs' ? 'var(--accent)' : 'var(--text-secondary)',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          <Wrench size={15} />
          <span>{t('tabJobs')}</span>
          {jobs.length > 0 && (
            <span className="badge badge--neutral" style={{ fontSize: 11, fontFamily: 'monospace', padding: '1px 6px' }}>
              {jobs.length}
            </span>
          )}
        </button>

        {/* Tab 4: 日報・成形実績 (Worklogs) */}
        <button
          type="button"
          onClick={() => handleTabChange('worklogs')}
          className={`tab-item ${activeTab === 'worklogs' ? 'tab-item--active active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: activeTab === 'worklogs' ? 700 : 500,
            borderBottom: activeTab === 'worklogs' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'worklogs' ? 'var(--accent)' : 'var(--text-secondary)',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer'
          }}
        >
          <ClipboardList size={15} />
          <span>{t('tabWorklogs')}</span>
          {worklogs.length > 0 && (
            <span className="badge badge--neutral" style={{ fontSize: 11, fontFamily: 'monospace', padding: '1px 6px' }}>
              {worklogs.length}
            </span>
          )}
        </button>
      </div>

      {/* ── 3. Tab Content Area ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
        {activeTab === 'equipment_set' && equipmentSet && (
          <TabEquipmentSet equipmentSet={equipmentSet} />
        )}

        {activeTab === 'overview' && (
          <TabOverview wo={wo} equipmentSet={equipmentSet} />
        )}

        {activeTab === 'jobs' && (
          <TabJobs woId={wo.wo_id} jobs={jobs} />
        )}

        {activeTab === 'worklogs' && (
          <TabWorklogs woId={wo.wo_id} worklogs={worklogs} jobs={jobs} />
        )}
      </div>

    </div>
  )
}
