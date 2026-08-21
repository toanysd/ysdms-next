import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import FormingLogForm from './_components/FormingLogForm'
import PressLogForm from './_components/PressLogForm'
import DailyLogsTable from './_components/DailyLogsTable'
import { ClipboardList } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DailyLogsPage({
  searchParams
}: {
  searchParams: { tab?: string }
}) {
  const supabase = await createClient()
  const t = await getTranslations('DailyLogs')

  const currentTab = searchParams.tab === 'press' ? 'press' : 'forming'

  // Fetch forming logs
  const { data: formingLogs } = await supabase
    .from('forming_daily_logs')
    .select('*, employees!forming_daily_logs_operator_id_fkey(employee_name), products(product_code)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch press logs
  const { data: pressLogs } = await supabase
    .from('press_daily_logs')
    .select('*, employees!press_daily_logs_operator_id_fkey(employee_name), products(product_code)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: '12px 16px', background: 'var(--bg-surface)' }}>
        <ClipboardList style={{ width: 20, height: 20, color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{t('title')}</h1>
      </div>

      {/* TabBar */}
      <div className="tab-nav" style={{ flexShrink: 0, padding: '0 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <Link 
          href="?tab=forming" 
          className={`tab-item ${currentTab === 'forming' ? 'tab-item--active' : ''}`}
        >
          {t('forming')}
        </Link>
        <Link 
          href="?tab=press" 
          className={`tab-item ${currentTab === 'press' ? 'tab-item--active' : ''}`}
        >
          {t('press')}
        </Link>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentTab === 'forming' ? (
          <>
            <FormingLogForm />
            <DailyLogsTable logs={(formingLogs as any) || []} type="forming" />
          </>
        ) : (
          <>
            <PressLogForm />
            <DailyLogsTable logs={(pressLogs as any) || []} type="press" />
          </>
        )}
      </div>
    </div>
  )
}
