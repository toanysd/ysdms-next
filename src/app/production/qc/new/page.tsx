import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QCForm } from './_components/QCForm'

export const dynamic = 'force-dynamic'

export default async function NewQCPage() {
  const t = await getTranslations('QC')
  const supabase = await createClient()

  // Fetch employees for KCS select
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, employee_name')
    .eq('is_active', true)
    .order('employee_name')

  return (
    <div className="flex flex-col h-full gap-3 max-w-3xl mx-auto w-full">
      {/* PageHeader Compact (Rule 3) */}
      <div className="shrink-0 flex items-center gap-4 p-3 card-flat">
        <Link href="/production/qc" className="btn btn-secondary shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToList')}
        </Link>
        <h1 className="text-lg font-bold text-slate-900">{t('newTitle')}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat p-6">
        <QCForm employees={employees || []} />
      </div>
    </div>
  )
}
