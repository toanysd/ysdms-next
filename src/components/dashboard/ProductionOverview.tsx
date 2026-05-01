'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie, Legend
} from 'recharts'
import { Activity, CalendarDays, Factory, TrendingUp } from 'lucide-react'
import { MonthlyRow, DailyRow } from '@/types/dashboard'

interface Props {
  monthlyData: MonthlyRow[]
  trendData: DailyRow[]
}

export default function ProductionOverview({ monthlyData, trendData }: Props) {
  // Calculate KPIs securely
  const totalQtyYTD = monthlyData.reduce((sum, row) => sum + Number(row.total_qty || 0), 0)
  const avgWorkingDays = Math.round(monthlyData.reduce((sum, row) => sum + Number(row.working_days || 0), 0) / (monthlyData.length || 1))
  const maxActiveMolds = Math.max(...monthlyData.map(row => Number(row.active_molds || 0)), 0)
  
  // Issue 2 Fix: Parse avg_qty_per_day securely from string
  const avgQtyPerDayTotal = monthlyData.length > 0 
    ? Math.round(monthlyData.reduce((sum, row) => sum + parseFloat((row.avg_qty_per_day as any) || '0'), 0) / monthlyData.length)
    : 0

  // Find peak month
  const maxQty = Math.max(...monthlyData.map(d => Number(d.total_qty || 0)), 0)

  // Mock Customer Donut Data
  const customerDonutData = [
    { name: 'JAE', value: 4500000 },
    { name: 'DIC', value: 3200000 },
    { name: 'YCM', value: 1500000 },
    { name: 'Others', value: 800000 },
  ]
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#94a3b8']

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Production YTD" 
          value={new Intl.NumberFormat().format(totalQtyYTD)} 
          subtitle="Total output this year"
          icon={<Factory className="text-emerald-500 dark:text-emerald-400" size={24} />}
          color="border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
        />
        <KpiCard 
          title="Avg Working Days/Mo" 
          value={avgWorkingDays} 
          subtitle="Active production days"
          icon={<CalendarDays className="text-blue-500 dark:text-blue-400" size={24} />}
          color="border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20"
        />
        <KpiCard 
          title="Avg Qty / Day" 
          value={new Intl.NumberFormat().format(avgQtyPerDayTotal)} 
          subtitle="Across all active months"
          icon={<TrendingUp className="text-amber-500 dark:text-amber-400" size={24} />}
          color="border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20"
        />
        <KpiCard 
          title="Peak Active Molds" 
          value={maxActiveMolds} 
          subtitle="Highest mold count in a month"
          icon={<Activity className="text-indigo-500 dark:text-indigo-400" size={24} />}
          color="border-indigo-500/30 bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20"
        />
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-500 dark:text-emerald-400" />
          Monthly Production Volume
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis 
                dataKey="month_label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'var(--tooltip-bg, #fff)' }}
                formatter={(value: number) => new Intl.NumberFormat().format(value)}
              />
              <Bar dataKey="total_qty" radius={[6, 6, 0, 0]} animationDuration={1500}>
                {monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Number(entry.total_qty || 0) === maxQty ? '#10b981' : '#cbd5e1'} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Trend Line & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">30-Day Production Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="order_date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'var(--tooltip-bg, #fff)' }}
                  formatter={(value: number) => new Intl.NumberFormat().format(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_qty" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={false}
                  activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4">Customer Distribution</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerDonutData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                >
                  {customerDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat().format(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'var(--tooltip-bg, #fff)' }} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div className={`p-6 rounded-2xl border flex flex-col justify-between h-full transition-transform hover:-translate-y-1 duration-300 shadow-sm ${color}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{title}</p>
          <h4 className="text-4xl font-black">{value}</h4>
        </div>
        <div className="p-3 rounded-full bg-white/50 dark:bg-black/20 shadow-sm backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <p className="text-xs font-semibold opacity-70">{subtitle}</p>
    </div>
  )
}
