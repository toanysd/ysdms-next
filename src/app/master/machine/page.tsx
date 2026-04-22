import { Suspense } from 'react'
import { getMachineEffectiveSpecs, getMachineModels, getMachineTypes } from '@/app/actions/machine'
import MachineTabs from './MachineTabs'

export const dynamic = 'force-dynamic'

export default async function MachineMasterPage() {
  const machines = await getMachineEffectiveSpecs()
  const models = await getMachineModels()
  const types = await getMachineTypes()

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--mcs-bg)] text-[var(--mcs-text)] font-sans">
      <header className="flex h-[48px] bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] px-[16px] items-center justify-between shrink-0 shadow-sm z-20">
        <div>
          <h1 className="text-[16px] font-bold text-[var(--mcs-text)]">
            設備管理 <span className="text-[12px] font-normal text-[var(--mcs-text-muted)] tracking-wider ml-[8px] uppercase">Quản trị Thiết bị Nhà máy</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-[16px] md:p-[24px]">
        <Suspense fallback={<div className="animate-pulse h-full w-full bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded"></div>}>
          <MachineTabs machines={machines || []} models={models || []} types={types || []} />
        </Suspense>
      </main>
    </div>
  )
}
