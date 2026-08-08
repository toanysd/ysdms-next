'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Box, Shield, MapPin, QrCode, FileText, Printer, Wrench, RefreshCw,
  Clock, ArrowUpRight, ExternalLink, Link2, Camera, User
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { EquipmentDetailData, ActionDialogType, EquipmentDetailModalProps } from './types'
import MoldDetailView from './MoldDetailView'
import CutterDetailView from './CutterDetailView'
import StorageStatusCard from './StorageStatusCard'
import ActionDialogManager from './ActionDialogManager'

export default function EquipmentDetailModal({
  isOpen,
  onClose,
  equipmentId,
  initialData,
  onUpdateSuccess
}: EquipmentDetailModalProps) {
  const t = useTranslations('EquipmentDetailModal')
  const supabase = createClient()
  const [data, setData] = useState<EquipmentDetailData | null>(initialData || null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'revisions' | 'jobs' | 'movements'>('specs')
  const [activeAction, setActiveAction] = useState<ActionDialogType>(null)
  const [jobsHistory, setJobsHistory] = useState<any[]>([])
  const [movementsHistory, setMovementsHistory] = useState<any[]>([])
  const [statusLogs, setStatusLogs] = useState<any[]>([])

  const fetchEquipmentDetails = async (id: string) => {
    if (!id) return
    setLoading(true)
    let item: any = null

    // 1. Fetch primary equipment record
    const { data: eq } = await supabase
      .from('equipment')
      .select(`
        *,
        keeper_company:companies!keeper_company_id(company_name, company_code),
        company:companies!company_id(company_name, company_code),
        rack_layers(layer_code, racks(rack_code)),
        design_revisions(
          revision_id, design_code, design_length, design_width, design_height, design_depth, design_weight,
          cutline_length, cutline_width, pocket_numbers, cavity_count, cavity_pitch_mm, machine_feed_pitch_mm,
          plastic_type_designed, corner_r, chamfer_c, tray_info, customer_tray_name,
          products(product_code, product_name_internal, product_name)
        )
      `)
      .or(`equipment_id.eq.${id},legacy_physical_mold_id.eq.${id},legacy_cutter_id.eq.${id}`)
      .limit(1)
      .maybeSingle()

    if (eq) {
      item = { ...eq }
    } else {
      const { data: legacyCutter } = await supabase
        .from('cutters')
        .select(`
          *,
          keeper_company:companies!cutters_keeper_company_id_fkey(company_name, company_code),
          rack_layers(layer_code, racks(rack_code))
        `)
        .or(`cutter_id.eq.${id},legacy_id.eq.${id}`)
        .limit(1)
        .maybeSingle()

      if (legacyCutter) {
        item = {
          ...legacyCutter,
          equipment_id: legacyCutter.cutter_id,
          equipment_code: legacyCutter.cutter_no || legacyCutter.cutter_design_code || '—',
          display_name: legacyCutter.cutter_name || legacyCutter.cutter_design_code || '—',
          equipment_type: 'CUTTER',
          usage_status: legacyCutter.usage_status || (legacyCutter.cutter_presence ? 'STORAGE' : 'OUT')
        }
      } else {
        const { data: pMold } = await supabase
          .from('physical_molds')
          .select(`
            *,
            keeper_company:companies!keeper_company_id(company_name, company_code),
            rack_layers(layer_code, racks(rack_code))
          `)
          .or(`physical_mold_id.eq.${id},system_code.eq.${id}`)
          .limit(1)
          .maybeSingle()

        if (pMold) {
          item = {
            ...pMold,
            equipment_id: pMold.physical_mold_id,
            equipment_code: pMold.system_code,
            display_name: pMold.display_name,
            equipment_type: 'MOLD',
            usage_status: pMold.usage_status || 'STORAGE'
          }
        } else if (initialData) {
          const isLegacyCutter = Boolean((initialData as any).cutter_id || (initialData as any).cutter_no || (initialData as any).cutter_name)
          item = {
            ...initialData,
            equipment_id: initialData.equipment_id || (initialData as any).physical_mold_id || (initialData as any).cutter_id || id,
            equipment_code: initialData.equipment_code || (initialData as any).system_code || (initialData as any).cutter_no || '—',
            display_name: initialData.display_name || (initialData as any).cutter_name || (initialData as any).system_code || '—',
            equipment_type: initialData.equipment_type || (isLegacyCutter ? 'CUTTER' : 'MOLD')
          }
        }
      }
    }

    if (!item) {
      setLoading(false)
      return
    }

    // Preserve design_revisions from initialData if present
    if (!item.design_revisions && initialData?.design_revisions) {
      item.design_revisions = initialData.design_revisions
      item.design_revision_id = (initialData.design_revisions as any).revision_id || item.design_revision_id
    }

    const targetEqId = item.equipment_id || id

    // 2. FETCH ALL AUXILIARY DATA IN PARALLEL (Promise.all for high performance)
    const [revRes, jobsRes, historyRes, statusLogsRes] = await Promise.all([
      // Design Revisions (if missing)
      (!item.design_revisions && item.design_revision_id)
        ? supabase
            .from('design_revisions')
            .select(`
              revision_id, design_code, design_length, design_width, design_height, design_depth, design_weight,
              cutline_length, cutline_width, pocket_numbers, cavity_count, cavity_pitch_mm, machine_feed_pitch_mm,
              plastic_type_designed, corner_r, chamfer_c, tray_info, customer_tray_name,
              products(product_code, product_name_internal, product_name)
            `)
            .eq('revision_id', item.design_revision_id)
            .maybeSingle()
        : Promise.resolve({ data: item.design_revisions }),

      // Jobs History
      supabase
        .from('jobs')
        .select(`
          job_id, job_code, job_name, job_status, created_at, deadline, ship_date, job_category, notes,
          design_revisions(revision_id, design_code)
        `)
        .or(`physical_mold_id.eq.${id},equipment_id.eq.${id}`)
        .order('created_at', { ascending: true }),

      // Equipment History
      supabase
        .from('equipment_history')
        .select(`
          history_id, action_type, action_date, description, to_location,
          from_company:from_company_id(company_code, company_name),
          to_company:to_company_id(company_code, company_name),
          employees(employee_name)
        `)
        .eq('equipment_id', targetEqId)
        .order('action_date', { ascending: false })
        .limit(10),

      // Status Logs
      (supabase as any)
        .from('equipment_status_logs')
        .select(`
          status_log_id, status, action_date, to_location, notes,
          destinations(destination_name),
          employees(employee_name)
        `)
        .eq('equipment_id', targetEqId)
        .order('action_date', { ascending: false })
        .limit(10)
    ])

    if (revRes?.data) {
      item.design_revisions = revRes.data
    }

    // Compute Related Equipment (Molds ↔ Cutters)
    // Rule:
    // - Mold popup -> search & show ONLY Cutters (equipment_type != 'MOLD')
    // - Cutter popup -> search & show ONLY Molds (equipment_type == 'MOLD')
    const relatedSet = new Map<string, any>()
    const isItemCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(item.equipment_type)
    const revId = item.design_revision_id || item.design_revisions?.revision_id
    const rawCode = String(item.equipment_code || item.display_name || item.system_code || item.cutter_no || '').trim()

    function getWildcardPattern(code: string) {
      if (!code) return ''
      let str = String(code).trim()
      str = str.replace(/^CT[\s\-_]?/i, '')
      str = str.replace(/[\s\-_]?(D?R\d+)$/i, '')
      const clean = str.replace(/[\s\-_]/g, '')
      const match = clean.match(/^([A-Z]+)(\d+)$/i)
      if (match) {
        return '%' + match[1] + '%' + match[2] + '%'
      }
      return '%' + clean + '%'
    }

    const searchPattern = getWildcardPattern(rawCode)

    // 1. Junction table mold_design_cutters lookup (For Molds looking up Cutters)
    if (revId && !isItemCutter) {
      const { data: juncCutters } = await supabase
        .from('mold_design_cutters')
        .select('cutter_id')
        .eq('mold_design_id', revId)
      if (juncCutters && juncCutters.length > 0) {
        const cutterIds = juncCutters.map(j => j.cutter_id).filter(Boolean)
        if (cutterIds.length > 0) {
          const { data: linkedCutters } = await supabase
            .from('cutters')
            .select('cutter_id, cutter_no, cutter_name, usage_status, cutter_presence')
            .in('cutter_id', cutterIds)
          if (linkedCutters) {
            linkedCutters.forEach((lc: any) => {
              if (lc.cutter_id !== item.equipment_id) {
                relatedSet.set(lc.cutter_id, {
                  equipment_id: lc.cutter_id,
                  equipment_code: lc.cutter_no || lc.cutter_name,
                  display_name: lc.cutter_name || lc.cutter_no,
                  equipment_type: 'CUTTER',
                  usage_status: lc.usage_status || (lc.cutter_presence ? 'STORAGE' : 'OUT')
                })
              }
            })
          }
        }
      }
    }

    // 2. Base Code Matching for Related Equipment
    if (searchPattern) {
      if (isItemCutter) {
        // Current item is CUTTER -> search ONLY MOLDS
        const { data: eqMolds } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, usage_status, equipment_type')
          .eq('equipment_type', 'MOLD')
          .or(`equipment_code.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
          .limit(5)
        if (eqMolds) {
          eqMolds.forEach((em: any) => {
            if (em.equipment_id !== item.equipment_id) {
              relatedSet.set(em.equipment_id, {
                equipment_id: em.equipment_id,
                equipment_code: em.equipment_code,
                display_name: em.display_name,
                equipment_type: 'MOLD',
                usage_status: em.usage_status
              })
            }
          })
        }

        const { data: pMolds } = await supabase
          .from('physical_molds')
          .select('physical_mold_id, system_code, display_name, usage_status')
          .or(`system_code.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
          .limit(5)
        if (pMolds) {
          pMolds.forEach((pm: any) => {
            if (pm.physical_mold_id !== item.equipment_id && !relatedSet.has(pm.physical_mold_id)) {
              relatedSet.set(pm.physical_mold_id, {
                equipment_id: pm.physical_mold_id,
                equipment_code: pm.system_code,
                display_name: pm.display_name,
                equipment_type: 'MOLD',
                usage_status: pm.usage_status
              })
            }
          })
        }
      } else {
        // Current item is MOLD -> search ONLY CUTTERS
        const { data: eqCutters } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, usage_status, equipment_type')
          .neq('equipment_type', 'MOLD')
          .or(`equipment_code.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
          .limit(5)
        if (eqCutters) {
          eqCutters.forEach((ec: any) => {
            if (ec.equipment_id !== item.equipment_id) {
              relatedSet.set(ec.equipment_id, {
                equipment_id: ec.equipment_id,
                equipment_code: ec.equipment_code,
                display_name: ec.display_name,
                equipment_type: 'CUTTER',
                usage_status: ec.usage_status
              })
            }
          })
        }

        const { data: cutters } = await supabase
          .from('cutters')
          .select('cutter_id, cutter_no, cutter_name, usage_status, cutter_presence')
          .or(`cutter_no.ilike.${searchPattern},cutter_name.ilike.${searchPattern}`)
          .limit(5)
        if (cutters) {
          cutters.forEach((c: any) => {
            if (c.cutter_id !== item.equipment_id && !relatedSet.has(c.cutter_id)) {
              relatedSet.set(c.cutter_id, {
                equipment_id: c.cutter_id,
                equipment_code: c.cutter_no || c.cutter_name,
                display_name: c.cutter_name || c.cutter_no,
                equipment_type: 'CUTTER',
                usage_status: c.usage_status || (c.cutter_presence ? 'STORAGE' : 'OUT')
              })
            }
          })
        }
      }
    }

    item.related_equipment = Array.from(relatedSet.values())

    // 3. SINGLE ATOMIC STATE UPDATE — Update ALL data and turn off loading in ONE single frame
    setData(item)
    if (jobsRes?.data) setJobsHistory(jobsRes.data)
    if (historyRes?.data) setMovementsHistory(historyRes.data)
    if (statusLogsRes?.data) setStatusLogs(statusLogsRes.data as any[])
    setLoading(false)
  }

  useEffect(() => {
    if (!isOpen) {
      setData(null)
      setJobsHistory([])
      setMovementsHistory([])
      setStatusLogs([])
      setLoading(false)
      return
    }
    setActiveTab('specs')
    const targetId = equipmentId || initialData?.equipment_id || (initialData as any)?.physical_mold_id || (initialData as any)?.cutter_id
    if (targetId) {
      fetchEquipmentDetails(targetId)
    } else if (initialData) {
      const isLegacyCutter = Boolean((initialData as any).cutter_id || (initialData as any).cutter_no || (initialData as any).cutter_name)
      const normalized: any = {
        ...initialData,
        equipment_id: initialData.equipment_id || (initialData as any).physical_mold_id || (initialData as any).cutter_id,
        equipment_code: initialData.equipment_code || (initialData as any).system_code || (initialData as any).cutter_no || '—',
        display_name: initialData.display_name || (initialData as any).cutter_name || (initialData as any).system_code || '—',
        equipment_type: initialData.equipment_type || (isLegacyCutter ? 'CUTTER' : 'MOLD')
      }
      setData(normalized)
    }
  }, [isOpen, equipmentId, initialData])

  if (!isOpen) return null

  const isCutter = data ? ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(data.equipment_type) : false
  const latestStatusLog = statusLogs[0]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
    >
      {/* CONSTANT MODAL CONTAINER FRAME (Fixed dimensions prevent layout jumping) */}
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 1060, height: '92vh', minHeight: 640,
          display: 'flex', flexDirection: 'column',
          borderRadius: 12, overflow: 'hidden',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
        }}
      >
        {/* Loading overlay inside fixed container frame */}
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {t('loadingData')}
            </span>
          </div>
        ) : data ? (
          <>
            {/* Header Bar */}
            <div
              style={{
                padding: '12px 18px', borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: isCutter ? 'var(--tint-orange-bg)' : 'var(--tint-blue-bg)',
                    border: isCutter ? '1px solid var(--tint-orange-border)' : '1px solid var(--tint-blue-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isCutter ? 'var(--tint-orange-text)' : 'var(--tint-blue-text)'
                  }}
                >
                  {isCutter ? <Wrench size={18} /> : <Box size={18} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={isCutter ? 'badge badge--warning font-bold' : 'badge badge--info font-bold'} style={{ fontSize: 10 }}>
                      {isCutter ? t('cutterSpecs.title') : t('moldSpecs.overviewTitle')}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {data.usage_status === 'OUT' ? t('statusOut') : t('statusIn')}
                    </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span>{data.equipment_code}</span>
                    {data.display_name && data.display_name !== data.equipment_code && (
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        ({data.display_name})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{ padding: 6, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Main Content Grid (3 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: 14, padding: 14, overflowY: 'auto', flex: 1 }}>

              {/* LEFT COLUMN: Photo + Summary Reports + Related Devices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Photo Box */}
                <div
                  className="card-flat"
                  style={{
                    padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                  }}
                >
                  <div style={{
                    width: '100%', height: 140, borderRadius: 6, background: '#1e293b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
                    border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden'
                  }}>
                    <Box size={36} opacity={0.4} />
                    <span style={{ position: 'absolute', bottom: 6, fontSize: 10, color: '#94a3b8', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4 }}>
                      📷 No Image
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveAction('PHOTO_MANAGER')}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: 11, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    <Camera size={13} />
                    <span>{t('actions.photo')}</span>
                  </button>
                </div>

                {/* Quick Logs Card */}
                <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                    📄 {t('historyReportTitle')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('moldSpecs.teflonStatus')}:</span>
                    <span style={{ fontWeight: 700 }}>{data.is_teflon ? t('moldSpecs.teflonCoated') : t('moldSpecs.teflonStandard')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('recentTransport')}:</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{data.returned_date || '—'}</span>
                  </div>
                </div>

                {/* Related Devices / Molds Card (関連デバイス) */}
                <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Link2 size={13} /> {isCutter ? '関連金型' : '関連抜型'}
                  </div>

                  {data.related_equipment && data.related_equipment.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {data.related_equipment.map((item) => (
                        <div
                          key={item.equipment_id}
                          onClick={() => fetchEquipmentDetails(item.equipment_id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px',
                            borderRadius: 4, background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                            cursor: 'pointer', transition: 'all 0.1s ease',
                          }}
                        >
                          <span style={{ fontSize: 11 }}>
                            {item.equipment_type?.includes('MOLD') ? '🔧' : item.equipment_type?.includes('CUTTER') ? '✂️' : '📌'}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.equipment_code || item.display_name}
                            </span>
                            <span style={{ fontSize: 9, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.display_name}
                            </span>
                          </div>
                          <span className="badge badge--neutral" style={{ fontSize: 8 }}>
                            {item.usage_status || 'STORAGE'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('noRelatedDevices')}</span>
                  )}
                </div>
              </div>

              {/* MIDDLE COLUMN: Storage Card + Specs + Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Storage Card */}
                <StorageStatusCard data={data} latestLog={movementsHistory[0]} latestStatusLog={latestStatusLog} />

                {/* Modal Tabs Bar */}
                <div className="tab-nav" style={{ margin: 0 }}>
                  <button
                    className={`tab-item ${activeTab === 'specs' ? 'tab-item--active' : ''}`}
                    onClick={() => setActiveTab('specs')}
                  >
                    {t('tabs.specs')}
                  </button>
                  <button
                    className={`tab-item ${activeTab === 'jobs' ? 'tab-item--active' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                  >
                    {t('tabs.jobs')} ({jobsHistory.length})
                  </button>
                  <button
                    className={`tab-item ${activeTab === 'movements' ? 'tab-item--active' : ''}`}
                    onClick={() => setActiveTab('movements')}
                  >
                    {t('tabs.movements')} ({statusLogs.length || movementsHistory.length})
                  </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'specs' && (
                  isCutter ? (
                    <CutterDetailView data={data} jobsHistory={jobsHistory} />
                  ) : (
                    <MoldDetailView data={data} />
                  )
                )}

                {activeTab === 'jobs' && (
                  <div className="card-flat" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{t('tabs.jobs')}</div>
                    {jobsHistory.length > 0 ? (
                      <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th>Job Code</th>
                            <th>Job Name</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobsHistory.map(j => (
                            <tr key={j.job_id}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{j.job_code}</td>
                              <td>{j.job_name}</td>
                              <td><span className="badge badge--info">{j.job_status}</span></td>
                              <td style={{ fontFamily: 'monospace' }}>{j.created_at?.slice(0, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 12 }}>{t('cutterSpecs.noRepairHistory')}</div>
                    )}
                  </div>
                )}

                {activeTab === 'movements' && (
                  <div className="card-flat" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{t('tabs.movements')}</div>
                    {statusLogs.length > 0 ? (
                      <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th>Check Type</th>
                            <th>Location / Customer</th>
                            <th>Date</th>
                            <th>Staff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusLogs.map(l => (
                            <tr key={l.status_log_id}>
                              <td>
                                <span className={l.status === 'OUT' ? 'badge badge--error' : 'badge badge--success'}>
                                  {l.status}
                                </span>
                              </td>
                              <td>{l.destinations?.destination_name || l.to_location || '—'}</td>
                              <td style={{ fontFamily: 'monospace' }}>{l.action_date?.slice(0, 10)}</td>
                              <td>{l.employees?.employee_name || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 12 }}>移動履歴なし</div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Quick Action Buttons & Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Quick Action Group */}
                <div className="card-flat" style={{ padding: 12, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⚡ {t('actionGridTitle')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <button
                      onClick={() => setActiveAction('CHECKIN_OUT')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <RefreshCw size={13} /> {t('actions.checkInOut')}
                    </button>
                    <button
                      onClick={() => setActiveAction('RACK_MOVE')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0F766E',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <MapPin size={13} /> {t('actions.rackMove')}
                    </button>
                    <button
                      onClick={() => setActiveAction('TEFLON_COATING')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#F3E8FF', border: '1px solid #E9D5FF', color: '#6B21A8',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Shield size={13} /> {t('actions.teflon')}
                    </button>
                    <button
                      onClick={() => setActiveAction('PRINT_LABEL')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Printer size={13} /> {t('actions.print')}
                    </button>
                    <button
                      onClick={() => setActiveAction('PHOTO_MANAGER')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#ECFEFF', border: '1px solid #A5F3FC', color: '#0E7490',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Camera size={13} /> {t('actions.photo')}
                    </button>
                    <button
                      onClick={() => setActiveAction('QR_VIEW')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <QrCode size={13} /> {t('actions.qr')}
                    </button>
                    <button
                      onClick={() => setActiveAction('TRANSPORT')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <ArrowUpRight size={13} /> {t('actions.transport')}
                    </button>
                    <button
                      onClick={() => setActiveAction('WEIGHT_AUDIT')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <FileText size={13} /> {t('actions.weight')}
                    </button>
                    <button
                      onClick={() => setActiveAction('INVENTORY_AUDIT')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Clock size={13} /> {t('actions.inventoryAudit')}
                    </button>
                    <button
                      onClick={() => setActiveAction('SCRAP_DISPOSAL')}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '7px 8px', borderRadius: 6,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <X size={13} /> {t('actions.scrap')}
                    </button>
                  </div>
                </div>

                {/* Quick Access Page Links */}
                <div className="card-flat" style={{ padding: 12, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    🚀 {t('quickAccessTitle')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    <Link
                      href="/engineering/designs"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0F766E',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <FileText size={15} style={{ color: '#0F766E' }} />
                      <span>{t('quickLinks.design')}</span>
                    </Link>
                    <Link
                      href="/master/customers"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#F3E8FF', border: '1px solid #E9D5FF', color: '#6B21A8',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <User size={15} style={{ color: '#6B21A8' }} />
                      <span>{t('quickLinks.customer')}</span>
                    </Link>
                    <Link
                      href="/master/products"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#FFF7ED', border: '1px solid #FFEDD5', color: '#C2410C',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Box size={15} style={{ color: '#C2410C' }} />
                      <span>{t('quickLinks.product')}</span>
                    </Link>
                    <Link
                      href="/master/racks"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <MapPin size={15} style={{ color: '#1D4ED8' }} />
                      <span>{t('quickLinks.storage')}</span>
                    </Link>
                    <Link
                      href="/equipment/jobs"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Wrench size={15} style={{ color: '#B45309' }} />
                      <span>{t('quickLinks.transfer')}</span>
                    </Link>
                    <Link
                      href="/equipment/lifecycle"
                      style={{
                        fontSize: 10, fontWeight: 700, padding: '8px 4px', borderRadius: 6,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        textDecoration: 'none', textAlign: 'center',
                        background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <Clock size={15} style={{ color: '#BE123C' }} />
                      <span>{t('quickLinks.history')}</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '10px 18px', borderTop: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
              }}
            >
              <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
                {t('close')}
              </button>
              <Link
                href={isCutter ? `/equipment/cutting-dies?search=${data.equipment_code}` : `/equipment/molds?search=${data.equipment_code}`}
                className="btn btn-primary"
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
              >
                <ExternalLink size={13} />
                <span>{t('detailPageLink')}</span>
              </Link>
            </div>
          </>
        ) : null}
      </div>

      {/* Action Dialog Manager */}
      {data && (
        <ActionDialogManager
          activeAction={activeAction}
          onCloseAction={() => setActiveAction(null)}
          data={data}
          onSuccess={() => { setActiveAction(null); onUpdateSuccess?.(); }}
          onSelectAction={(act) => setActiveAction(act)}
        />
      )}
    </div>
  )
}
