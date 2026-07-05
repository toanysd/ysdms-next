import { getEngineeringRequests } from '@/app/actions/engineering'
import EngineeringDashboard from './_components/EngineeringDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Hồ sơ Thiết kế & Kỹ thuật | YSDMS NextGen',
}

export default async function EngineeringPage() {
    const requests = await getEngineeringRequests()

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-bg)] p-4">
            <h1 className="text-xl font-bold text-blue-900 mb-4 flex flex-col">
                <span className="ja">設計・技術要求 (Yêu cầu Thiết kế & Kỹ thuật)</span>
            </h1>
            <EngineeringDashboard requests={requests} />
        </div>
    )
}
