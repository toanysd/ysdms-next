'use client'

import React, { useState } from 'react'
import MasterDashboard from '@/app/dashboard/MasterDashboard-v8.5.2-1'
import ProductionOverview from '@/components/dashboard/ProductionOverview'
import { MonthlyRow, DailyRow } from '@/types/dashboard'
import { Focus, BarChart3 } from 'lucide-react'

interface Props {
  monthlyData: MonthlyRow[]
  trendData: DailyRow[]
}

export default function DashboardTabs({ monthlyData, trendData }: Props) {
  const [activeTab, setActiveTab] = useState<'master' | 'production'>('production')

  return (
    <div className="min-h-screen bg-[var(--mcs-surface)] dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 pt-4 sticky top-0 z-10 shadow-sm">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('master')}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'master' 
              ? 'border-[var(--mcs-primary)] text-[var(--mcs-primary)]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Focus size={16} />
            Master Control
          </button>
          <button 
            onClick={() => setActiveTab('production')}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'production' 
              ? 'border-[var(--mcs-primary)] text-[var(--mcs-primary)]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <BarChart3 size={16} />
            Production Report
          </button>
        </div>
      </div>
      
      <div className="p-0">
        {activeTab === 'master' && <MasterDashboard />}
        {activeTab === 'production' && (
           <div className="p-6">
             <ProductionOverview monthlyData={monthlyData} trendData={trendData} />
           </div>
        )}
      </div>
    </div>
  )
}
