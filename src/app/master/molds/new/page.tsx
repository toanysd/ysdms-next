export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { addMoldBaseAction } from '@/app/actions/mold'

export default async function NewMoldBasePage() {
  const t = await getTranslations('Master')
  const supabase = await createClient()
  
  // Fetch danh sách khách hàng để đưa vào thẻ Select
  const { data: companies } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name')
    .order('company_code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-2xl mx-auto w-full">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/molds" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span>{t('Master.newMoldBaseRegistration')}</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 p-4 bg-[var(--mcs-info-light)] border-l-4 border-[var(--mcs-info)] rounded-r flex flex-col gap-1 text-xs">
          <span className="font-bold text-[var(--mcs-info-text)]">{t('Master.baseMoldExplanationTitle')}</span>
          <span className="text-[var(--mcs-text-secondary)] leading-relaxed">
            {t('Master.baseMoldExplanation')}
          </span>
        </div>

        <form action={addMoldBaseAction} className="space-y-6">
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.moldCode')} <span className="text-[var(--mcs-error)]">*</span>
              </label>
              <input type="text" name="code" required className="w-full h-[34px] font-mono text-sm form-input" placeholder="VD: JAE-001" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.moldName')}
              </label>
              <input type="text" name="name" className="w-full h-[34px] form-input" placeholder="VD: Khay linh kiện A" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.customer')}
              </label>
              <select name="company_id" className="w-full h-[34px] bg-white text-sm form-input">
                <option value="">-- Chưa gán khách hàng --</option>
                {companies?.map(c => (
                  <option key={c.company_id} value={c.company_id}>
                    [{c.company_code}] {c.company_name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/molds">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                {t('Master.cancel')}
              </button>
            </Link>
            
            <button type="submit" className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors">
              <Save size={16} />
              <span>{t('Master.saveMoldBase')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
