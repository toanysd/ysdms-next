import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import GrindingLogForm from './_components/GrindingLogForm'
import GrindingTable from './_components/GrindingTable'
import { Recycle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GrindingPage() {
  const supabase = await createClient()
  const t = await getTranslations('Grinding')

  const { data: logs } = await supabase
    .from('grinding_daily_logs')
    .select(`
      *,
      employees(employee_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <Recycle style={{ width: 20, height: 20, color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{t('title')}</h1>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <GrindingLogForm />
        <GrindingTable logs={(logs as any) || []} />
      </div>
    </div>
  )
}
