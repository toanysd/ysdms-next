"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl"
import { CheckinCheckoutModal } from "../designs/_components/CheckinCheckoutModal"
import { RelocateModal } from "../designs/_components/RelocateModal"

type TabType = 'INFO' | 'HISTORY' | 'JOBS'

export default function MoldDetailPanel({ 
  moldId, 
  onClose,
  racks,
  allLayers,
  employees,
  destinations,
  companies,
  itemTypes
}: { 
  moldId: string, 
  onClose: () => void,
  racks: any[],
  allLayers: any[],
  employees: any[],
  destinations: any[],
  companies: any[],
  itemTypes: any[]
}) {
  const [activeTab, setActiveTab] = useState<TabType>('INFO')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<'in' | 'out' | 'relocate' | 'teflon' | null>(null)
  const supabase = createClient()
  const t = useTranslations("Equipment")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      
      const { data: mold } = await supabase
        .from('physical_molds')
        .select(`
          physical_mold_id, system_code, display_name, usage_status, device_status, updated_at,
          current_rack_layer_id, cav_type_id, serial_no, material_notes, weight_g,
          mold_revisions (
            revision_code, version_label, length_mm, width_mm, height_mm, drawing_no,
            products (
              product_name_internal, product_code,
              companies (company_name)
            )
          ),
          cav_types (cav_name),
          rack_layers (
            code, label,
            racks (name, code)
          )
        `)
        .eq('physical_mold_id', moldId)
        .single()

      if (mold) {
        setData(mold)
      }
      setLoading(false)
    }

    if (moldId) {
      loadData()
    }
  }, [moldId, supabase])

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!moldId) return null

  const checkinStatus = data?.usage_status === 'IN_STOCK' ? 'IN' : data?.usage_status === 'SHIPPED' ? 'OUT' : 'AUDIT'
  const currentLayer = allLayers.find(l => l.id === data?.current_rack_layer_id) ?? null
  const currentLayerWithRack = currentLayer 
    ? { ...currentLayer, rack: racks.find(r => r.id === currentLayer.rack_id)! }
    : null

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-24 bg-slate-100 rounded border border-slate-200 w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-24 bg-slate-100 rounded border border-slate-200 w-full"></div>
        </div>
      )
    }

    if (activeTab === 'INFO') {
      const rev = Array.isArray(data?.mold_revisions) ? data?.mold_revisions[0] : data?.mold_revisions
      const base = rev?.products
      const cust = base?.companies
      const rl = Array.isArray(data?.rack_layers) ? data?.rack_layers[0] : data?.rack_layers
      const it = Array.isArray(data?.cav_types) ? data?.cav_types[0] : data?.cav_types
      const maker: any = null

      return (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ĐỊNH DANH */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-xs text-slate-600">
                {t('basicInfo')}
              </div>
              <div className="p-3 text-sm space-y-2">
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('moldCode')}:</span><span className="font-semibold text-slate-800">{data?.system_code || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('moldName')}:</span><span className="text-slate-800">{base?.product_name_internal || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('moldType')}:</span><span className="text-slate-800">{it?.cav_name || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('cavity')}:</span><span className="text-slate-800">{data?.cavity || 1}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('serialNo')}:</span><span className="text-slate-800">{data?.serial_no || '-'}</span></div>
              </div>
            </div>

            {/* VỊ TRÍ KHO */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-xs text-slate-600">
                {t('storageLocation')}
              </div>
              <div className="p-3 text-sm space-y-2">
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('rackLayer')}:</span><span className="font-medium text-slate-800">{rl?.racks?.name || '-'} / {rl?.label || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('rackCode')}:</span><span className="text-slate-800 font-mono text-xs">{rl?.code || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('updatedAt')}:</span><span className="text-slate-800">{data?.updated_at ? new Date(data.updated_at).toLocaleDateString() : '-'}</span></div>
              </div>
            </div>

            {/* THIẾT KẾ */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-xs text-slate-600">
                {t('designSpec')}
              </div>
              <div className="p-3 text-sm space-y-2">
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('revision')}:</span><span className="text-slate-800">{rev?.revision_code || '-'} / {rev?.version_label || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('dimensions')}:</span><span className="text-slate-800">{rev?.length_mm || '-'} × {rev?.width_mm || '-'} × {rev?.height_mm || '-'} mm</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('weight')}:</span><span className="text-slate-800">{data?.weight_g ? `${data.weight_g} g` : '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('material')}:</span><span className="text-slate-800">{data?.material_notes || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('drawing')}:</span><span className="text-slate-800">{rev?.drawing_no || '-'}</span></div>
              </div>
            </div>

            {/* TRẠNG THÁI */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-xs text-slate-600">
                {t('statusLabel')}
              </div>
              <div className="p-3 text-sm space-y-3">
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-slate-500 text-xs">{t('checkinStatus')}:</span>
                  <span className={`inline-flex w-fit px-2 py-0.5 rounded text-xs font-bold ${
                    checkinStatus === 'IN' ? 'bg-teal-100 text-teal-800' : 
                    checkinStatus === 'OUT' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {checkinStatus === 'IN' ? `● ${t('inStock')}` : checkinStatus === 'OUT' ? `○ ${t('outOfStock')}` : `▲ ${t('audit')}`}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-slate-500 text-xs">{t('teflon')}:</span>
                  <span className="text-slate-800 text-sm">
                    {data?.teflon_count > 0 ? `${data.teflon_count} ${t('times')} (${t('recent')} ${data.last_teflon_date ? new Date(data.last_teflon_date).toLocaleDateString('ja-JP') : '-'})` : t('neverPlated')}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-slate-500 text-xs">{t('deviceStatus')}:</span>
                  <span className="text-slate-800 text-sm font-medium">{data?.device_status || 'ACTIVE'}</span>
                </div>
              </div>
            </div>

            {/* KHÁCH HÀNG */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden md:col-span-2">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-xs text-slate-600">
                {t('owner')}
              </div>
              <div className="p-3 text-sm space-y-2 grid grid-cols-1 md:grid-cols-2">
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('owner')}:</span><span className="font-semibold text-slate-800">{cust?.company_name || '-'}</span></div>
                <div className="grid grid-cols-[100px_1fr]"><span className="text-slate-500 text-xs">{t('maker')}:</span><span className="text-slate-800">{maker?.delivery_name || '-'}</span></div>
              </div>
            </div>

          </div>

          {/* ACTION BUTTON GROUP */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 bg-mcs-primary rounded-full"></span>
              <span className="font-bold text-xs text-slate-600">{t('operations')}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {checkinStatus === 'IN' && (
                <div className="flex gap-2">
                  <button onClick={() => setModalMode('out')} className="flex-1 min-h-[44px] bg-white border border-mcs-border hover:border-mcs-primary text-mcs-text rounded font-bold text-sm shadow-sm transition-colors">
                    {t('checkout')}
                  </button>
                  <button onClick={() => setModalMode('relocate')} className="flex-1 min-h-[44px] bg-white border border-mcs-border hover:border-mcs-primary text-mcs-text rounded font-bold text-sm shadow-sm transition-colors">
                    {t('relocate')}
                  </button>
                </div>
              )}
              
              {checkinStatus === 'OUT' && (
                <button onClick={() => setModalMode('in')} className="w-full min-h-[44px] bg-mcs-primary hover:bg-mcs-primary-hover text-white rounded font-bold text-sm shadow-sm transition-colors">
                  {t('checkin')}
                </button>
              )}            </div>
          </div>
        </div>
      )
    }

    if (activeTab === 'HISTORY') {
      return <TimelineTab moldId={moldId} supabase={supabase} t={t} />
    }

    // Empty states for the rest
    return (
      <div className="p-6 flex flex-col items-center justify-center text-slate-400 h-[300px] border border-dashed border-slate-200 m-4 rounded bg-slate-50">
        <span className="text-2xl mb-2">🚧</span>
        <p className="text-sm font-medium">{t('underDev')}</p>
        <p className="text-xs mt-1">{t('underDevExplanation')}</p>
      </div>
    )
  }

  return (
    <>
      {/* OVERLAY */}
      <div 
        className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* SLIDE OVER PANEL */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[640px] bg-white shadow-2xl flex flex-col transform transition-transform border-l border-slate-200">
        {/* HEADER */}
        <div className="bg-[#01696f] text-white p-4 flex items-center justify-between shadow-md z-10 relative">
          <div>
            <div className="text-teal-100 text-[10px] font-bold tracking-wider mb-0.5">{t('details')}</div>
            <h2 className="text-xl font-bold">{data?.system_code || 'Loading...'}</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Actions placeholder */}
            <button disabled title="Phase 5C" className="opacity-50 cursor-not-allowed px-3 py-1.5 bg-white/10 rounded text-xs font-medium border border-white/20">
              📋 IN/OUT
            </button>
            <button disabled title="Phase 5C" className="opacity-50 cursor-not-allowed px-3 py-1.5 bg-white/10 rounded text-xs font-medium border border-white/20">
              🎨 TEFLON
            </button>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 sticky top-0 z-0 hide-scrollbar">
          {[
            { id: 'INFO', label: t('tabInfo') },
            { id: 'HISTORY', label: t('tabHistory') },
            { id: 'JOBS', label: t('tabJobs') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 flex flex-col items-center justify-center min-w-[80px] border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-teal-600 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-teal-700' : ''}`}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {renderTabContent()}
        </div>
      </div>

      {/* MODALS */}
      {data && (
        <>
          <CheckinCheckoutModal
            mold={data}
            mode={modalMode === 'in' ? 'in' : 'out'}
            isOpen={modalMode === 'in' || modalMode === 'out'}
            onClose={() => setModalMode(null)}
            racks={racks}
            allLayers={allLayers}
            employees={employees}
            destinations={destinations}
            companies={companies}
            itemTypes={itemTypes}
          />
          <RelocateModal
            mold={data}
            currentLayer={currentLayerWithRack}
            isOpen={modalMode === 'relocate'}
            onClose={() => setModalMode(null)}
            racks={racks}
            allLayers={allLayers}
            employees={employees}
          />
        </>
      )}
    </>
  )
}

function TimelineTab({ moldId, supabase, t }: { moldId: string, supabase: any, t: any }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const [statusRes, locationRes] = await Promise.all([
        supabase.from('equipment_status_logs')
          .select('*, employees(employee_name)')
          .eq('physical_mold_id', moldId)
          .order('logged_at', { ascending: false })
          .limit(20),
        supabase.from('mold_location_history')
          .select('*, from_layer:rack_layers!mold_location_history_old_rack_layer_id_fkey(code,label), to_layer:rack_layers!mold_location_history_new_rack_layer_id_fkey(code,label), employees!mold_location_history_moved_by_fkey(employee_name)')
          .eq('physical_mold_id', moldId)
          .order('moved_at', { ascending: false })
          .limit(20)
      ])

      const statusData = (statusRes.data || []).map((l: any) => ({
        ...l,
        type: 'STATUS',
        timestamp: new Date(l.logged_at).getTime()
      }))

      const locationData = (locationRes.data || []).map((l: any) => ({
        ...l,
        type: 'LOCATION',
        timestamp: new Date(l.moved_at).getTime()
      }))

      const combined = [...statusData, ...locationData].sort((a, b) => b.timestamp - a.timestamp)
      setLogs(combined)
      setLoading(false)
    }

    fetchLogs()
  }, [moldId, supabase])

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-12 bg-slate-200 rounded w-full"></div>
        <div className="h-12 bg-slate-200 rounded w-full"></div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-slate-500 h-[300px]">
        <p className="text-sm">{t('noHistory')}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
        {logs.map((log, idx) => {
          const isStatus = log.type === 'STATUS'
          return (
            <div key={`${log.type}-${log.id}`} className="relative pl-6">
              {/* Timeline dot */}
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${isStatus ? 'bg-teal-500' : 'bg-blue-500'}`}></div>
              
              <div className="bg-white border border-slate-200 rounded p-3 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-slate-700">
                    {isStatus ? t('statusChanged') : t('locationMoved')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString('ja-JP')}
                  </span>
                </div>
                
                {isStatus ? (
                  <div className="text-sm text-slate-600 mt-2">
                    {t('newStatus')}: <span className="font-semibold text-slate-800">{log.status}</span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                      {log.from_layer?.code || t('outOfRack')}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-xs font-medium">
                      {log.to_layer?.code || t('outOfRack')}
                    </span>
                  </div>
                )}
                
                <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                  <span>{t('operator')}: {log.employees?.employee_name || t('system')}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
