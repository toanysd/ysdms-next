'use client'
import { useState } from 'react'
import MachineTable from './MachineTable'
import ModelTab from './ModelTab'
import TypeTab from './TypeTab'

export default function MachineTabs({ machines, models, types }: { machines: any[], models: any[], types: any[] }) {
    const [activeTab, setActiveTab] = useState<'INSTANCES' | 'MODELS' | 'TYPES'>('INSTANCES')

    return (
        <div className="flex flex-col w-full h-full bg-[var(--mcs-surface)] rounded-[8px] border border-[var(--mcs-border)] shadow-sm overflow-hidden">
            {/* Base Tab bar (36px height) */}
            <div className="flex h-[36px] bg-[var(--mcs-surface-2)] border-b border-[var(--mcs-border)] shrink-0">
                <button
                    onClick={() => setActiveTab('INSTANCES')}
                    className={`flex-1 md:flex-none justify-center md:min-w-[180px] h-full flex items-center font-bold px-[16px] transition-colors border-r border-[var(--mcs-border)] ${activeTab === 'INSTANCES'
                        ? 'bg-[var(--mcs-surface)] text-[var(--mcs-primary)] border-b-2 border-b-[var(--mcs-primary)] shadow-sm'
                        : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'
                        }`}
                >
                    <span className="text-[12px]">稼働中設備</span>
                    <span className="text-[10px] ml-[6px] font-normal opacity-80">(Máy Vật Lý Tại Xưởng)</span>
                </button>
                <button
                    onClick={() => setActiveTab('MODELS')}
                    className={`flex-1 md:flex-none justify-center md:min-w-[180px] h-full flex items-center font-bold px-[16px] transition-colors border-r border-[var(--mcs-border)] ${activeTab === 'MODELS'
                        ? 'bg-[var(--mcs-surface)] text-[var(--mcs-primary)] border-b-2 border-b-[var(--mcs-primary)] shadow-sm'
                        : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'
                        }`}
                >
                    <span className="text-[12px]">設備モデル</span>
                    <span className="text-[10px] ml-[6px] font-normal opacity-80">(Dòng Máy)</span>
                </button>
                <button
                    onClick={() => setActiveTab('TYPES')}
                    className={`flex-1 md:flex-none justify-center md:min-w-[180px] h-full flex items-center font-bold px-[16px] transition-colors border-r border-[var(--mcs-border)] ${activeTab === 'TYPES'
                        ? 'bg-[var(--mcs-surface)] text-[var(--mcs-primary)] border-b-2 border-b-[var(--mcs-primary)] shadow-sm'
                        : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)]'
                        }`}
                >
                    <span className="text-[12px]">設備種別</span>
                    <span className="text-[10px] ml-[6px] font-normal opacity-80">(Loại Máy)</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto p-[16px] bg-[var(--mcs-bg)]">
                {activeTab === 'INSTANCES' && <MachineTable initialData={machines || []} models={models || []} />}
                {activeTab === 'MODELS' && <ModelTab models={models || []} types={types || []} />}
                {activeTab === 'TYPES' && <TypeTab types={types || []} />}
            </div>
        </div>
    )
}
