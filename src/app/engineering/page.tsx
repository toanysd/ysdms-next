import { useTranslations } from 'next-intl'
import { getEngineeringRequests } from '@/app/actions/engineering'
import EngineeringDashboard from './_components/EngineeringDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: '設計・技術管理 | YSDMS NextGen',
}

export default async function EngineeringPage() {
  const t = useTranslations()
    const requests = await getEngineeringRequests()

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-bg)] p-4">
            <h1 className="text-xl font-bold text-blue-900 mb-4 flex flex-col">
                {t('Engineering.yeuCauThietKeKyThuat')}
            </h1>
            <EngineeringDashboard requests={requests} />
        </div>
    )
}
