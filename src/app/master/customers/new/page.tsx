export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CompanyForm } from '../_components/CustomerForm'

export default async function NewCustomerPage(props: {
  searchParams?: Promise<{ parent?: string }>
}) {
  const t = await getTranslations()
  const sp = await props.searchParams
  const parentId = sp?.parent

  const supabase = await createClient()

  // Danh sách công ty mẹ cho dropdown
  const { data: parentCandidates } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name')
    .contains('company_type', ['CUSTOMER'])
    .is('parent_company_id', null)
    .order('company_name', { ascending: true })
    .limit(200)

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{
        height: 48,
        background: 'var(--bg-surface-3)',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}>
        <Link href="/master/customers" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t('Master.themKhachHangMoi')}
        </div>
      </div>

      {/* Form */}
      <div className="custom-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <CompanyForm
          initialData={{
            parent_company_id: parentId ?? '',
            company_type: ['CUSTOMER'],
            is_active: true,
          }}
          parentCompanies={parentCandidates ?? []}
          mode="create"
        />
      </div>
    </div>
  )
}
