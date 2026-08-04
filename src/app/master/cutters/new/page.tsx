export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addCutterAction } from '@/app/actions/cutter'

export default async function NewCutterPage() {
  const t = await getTranslations('Master')

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-2xl mx-auto w-full">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/cutters" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span>{t('Master.newCutterRegistration')}</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form action={addCutterAction} className="space-y-6">
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.cutterCode')} <span className="text-[var(--mcs-error)]">*</span>
              </label>
              <input type="text" name="code" required className="w-full h-[34px] font-mono text-sm form-input" placeholder="VD: D-001" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.type')}
              </label>
              <select name="type" className="w-full h-[34px] bg-white text-sm form-input">
                <option value="">-- 未選択 --</option>
                <option value="Tomson">Tomson (トムソン刀)</option>
                <option value="Pinnacle">Pinnacle (ピナクル刀)</option>
                <option value="Engraving">Engraving (彫刻刀)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                {t('Master.width_mm')} (mm)
              </label>
              <input type="number" step="1" min="0" name="width_mm" className="w-full h-[34px] form-input" placeholder="VD: 500" />
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/cutters">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                {t('Master.cancel')}
              </button>
            </Link>
            
            <button type="submit" className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors">
              <Save size={16} />
              <span>{t('Master.saveCutter')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
