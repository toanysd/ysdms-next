import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import InspectionForm from './_components/InspectionForm'
import InspectionTable from './_components/InspectionTable'
import { ClipboardCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DailyInspectionPage() {
  const supabase = await createClient()
  const t = await getTranslations('DailyInspection')

  const { data: logs } = await supabase
    .from('inspection_daily_logs')
    .select(`
      *,
      employees!inspection_daily_logs_inspector_id_fkey(employee_name),
      products(product_code)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <ClipboardCheck style={{ width: 20, height: 20, color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{t('title')}</h1>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InspectionForm />
        <InspectionTable logs={(logs as any) || []} />
      </div>
    </div>
  )
}
