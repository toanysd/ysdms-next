'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { WorklogFormShared } from '@/components/worklogs/WorklogFormShared'

interface WorklogFormProps {
  defaultJobId?: string
  defaultStepId?: string
  lockedJob?: {
    job_id: string
    job_code: string
    job_name: string | null
    companies?: { company_name?: string | null; company_code?: string | null } | null
  } | null
  preloadedSteps?: any[]
}

/**
 * Wrapper trang /worklogs/new — dùng WorklogFormShared ở chế độ page (hỗ trợ defaultJobId từ QR / URL).
 */
export default function WorklogForm({
  defaultJobId,
  defaultStepId,
  lockedJob,
  preloadedSteps,
}: WorklogFormProps) {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* PageHeader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <ClipboardList size={20} style={{ color: 'var(--accent)' }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          {t('Worklogs.nhatKyTaoMoi')}
        </h1>
      </div>

      <WorklogFormShared
        mode="page"
        defaultJobId={defaultJobId}
        defaultStepId={defaultStepId}
        lockedJob={lockedJob}
        preloadedSteps={preloadedSteps}
        onSuccess={(path) => {
          router.push(path || '/worklogs')
          router.refresh()
        }}
        onCancel={() => router.back()}
      />
    </div>
  )
}
