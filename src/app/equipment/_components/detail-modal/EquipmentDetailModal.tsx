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

    // 1. Try equipment table first
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
      // 2. Try cutters table
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
        // 3. Try physical_molds table
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

    if (item) {
        if (!item.design_revisions) {
          if (initialData?.design_revisions) {
            item.design_revisions = initialData.design_revisions
            item.design_revision_id = (initialData.design_revisions as any).revision_id || item.design_revision_id
          } else {
            let revData: any = null
            if (item.design_revision_id) {
              const { data: r } = await supabase
                .from('design_revisions')
                .select(`
                  revision_id, design_code, design_length, design_width, design_height, design_depth, design_weight,
                  cutline_length, cutline_width, pocket_numbers, cavity_count, cavity_pitch_mm, machine_feed_pitch_mm,
                  plastic_type_designed, corner_r, chamfer_c, tray_info, customer_tray_name,
                  products(product_code, product_name_internal, product_name)
                `)
                .eq('revision_id', item.design_revision_id)
                .maybeSingle()
              revData = r
            }

            if (!revData) {
              const rawCode = String(item.equipment_code || item.display_name || item.system_code || item.cutter_no || '').trim()
              const cleanCode = rawCode.replace(/[\s\-_]?R\d+$/i, '').replace(/[\s\-_]/g, '')
              if (cleanCode) {
                const { data: rByCode } = await supabase
                  .from('design_revisions')
                  .select(`
                    revision_id, design_code, design_length, design_width, design_height, design_depth, design_weight,
                    cutline_length, cutline_width, pocket_numbers, cavity_count, cavity_pitch_mm, machine_feed_pitch_mm,
                    plastic_type_designed, corner_r, chamfer_c, tray_info, customer_tray_name,
                    products(product_code, product_name_internal, product_name)
                  `)
                  .or(`design_code.ilike.%${cleanCode}%,design_code.ilike.%${rawCode}%`)
                  .limit(1)
                  .maybeSingle()
                revData = rByCode
              }
            }

            if (revData) {
              item.design_revisions = revData
              item.design_revision_id = revData.revision_id
            }
          }
        }

      // Compute Related Equipment (Molds ↔ Cutters)
      const relatedSet = new Map<string, any>()
      const revId = item.design_revision_id || item.design_revisions?.revision_id
      const rawCode = String(item.equipment_code || item.display_name || item.system_code || item.cutter_no || '').trim()
      const baseProductCode = rawCode.replace(/[\s\-_]?R\d+$/i, '').replace(/[\s\-_]/g, '')

      // 1. Junction table mold_design_cutters lookup
      if (revId) {
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
      if (baseProductCode) {
        const isCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE'].includes(item.equipment_type)
        if (isCutter) {
          const { data: pMolds } = await supabase
            .from('physical_molds')
            .select('physical_mold_id, system_code, display_name, usage_status, device_status')
            .or(`system_code.ilike.%${baseProductCode}%,display_name.ilike.%${baseProductCode}%`)
            .limit(5)
          if (pMolds) {
            pMolds.forEach((pm: any) => {
              if (pm.physical_mold_id !== item.equipment_id) {
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
          const { data: cutters } = await supabase
            .from('cutters')
            .select('cutter_id, cutter_no, cutter_name, usage_status, cutter_presence')
            .or(`cutter_no.ilike.%${baseProductCode}%,cutter_name.ilike.%${baseProductCode}%`)
            .limit(5)
          if (cutters) {
            cutters.forEach((c: any) => {
              if (c.cutter_id !== item.equipment_id) {
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
      setData(item)
    }

    setLoading(false)

    // Use actual ID for history
    const targetEqId = item?.equipment_id || id

    // Fetch Jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select(`
        job_id, job_code, job_name, job_status, created_at, deadline, ship_date, job_category, notes,
        design_revisions(revision_id, design_code)
      `)
      .or(`physical_mold_id.eq.${id},equipment_id.eq.${id}`)
      .order('created_at', { ascending: true })

    if (jobs) setJobsHistory(jobs)

    // Fetch History
    const { data: history } = await supabase
      .from('equipment_history')
      .select(`
        history_id, action_type, action_date, description, to_location,
        from_company:from_company_id(company_code, company_name),
        to_company:to_company_id(company_code, company_name),
        employees(employee_name)
      `)
      .eq('equipment_id', targetEqId)
      .order('action_date', { ascending: false })
      .limit(10)

    if (history) setMovementsHistory(history)

    // Fetch Status Logs
    const { data: sLogs } = await (supabase as any)
      .from('equipment_status_logs')
      .select(`
        status_log_id, status, action_date, to_location, notes,
        destinations(destination_name),
        employees(employee_name)
      `)
      .eq('equipment_id', targetEqId)
      .order('action_date', { ascending: false })
      .limit(10)

    if (sLogs) setStatusLogs(sLogs as any[])
  }

  useEffect(() => {
    if (!isOpen) return
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
        {loading && (!data || (!data.design_revisions && !data.cutline_length)) ? (
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
                    <Link2 size={13} /> {t('relatedDevices')}
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
                <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                    ⚡ {t('actionGridTitle')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    <button onClick={() => setActiveAction('CHECKIN_OUT')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <RefreshCw size={11} /> {t('actions.checkInOut')}
                    </button>
                    <button onClick={() => setActiveAction('RACK_MOVE')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={11} /> {t('actions.rackMove')}
                    </button>
                    <button onClick={() => setActiveAction('TEFLON_COATING')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Shield size={11} /> {t('actions.teflon')}
                    </button>
                    <button onClick={() => setActiveAction('PRINT_LABEL')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Printer size={11} /> {t('actions.print')}
                    </button>
                    <button onClick={() => setActiveAction('PHOTO_MANAGER')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Camera size={11} /> {t('actions.photo')}
                    </button>
                    <button onClick={() => setActiveAction('QR_VIEW')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <QrCode size={11} /> {t('actions.qr')}
                    </button>
                    <button onClick={() => setActiveAction('TRANSPORT')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <ArrowUpRight size={11} /> {t('actions.transport')}
                    </button>
                    <button onClick={() => setActiveAction('WEIGHT_AUDIT')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FileText size={11} /> {t('actions.weight')}
                    </button>
                    <button onClick={() => setActiveAction('INVENTORY_AUDIT')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} /> {t('actions.inventoryAudit')}
                    </button>
                    <button onClick={() => setActiveAction('SCRAP_DISPOSAL')} className="btn btn-secondary" style={{ fontSize: 10, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 3, color: 'var(--tint-red-text)' }}>
                      <X size={11} /> {t('actions.scrap')}
                    </button>
                  </div>
                </div>

                {/* Quick Access Page Links */}
                <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                    🚀 {t('quickAccessTitle')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                    <Link href="/engineering/designs" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <FileText size={12} style={{ color: 'var(--accent)' }} />
                      <span>{t('quickLinks.design')}</span>
                    </Link>
                    <Link href="/master/customers" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <User size={12} style={{ color: 'var(--tint-purple-text)' }} />
                      <span>{t('quickLinks.customer')}</span>
                    </Link>
                    <Link href="/master/products" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <Box size={12} style={{ color: 'var(--tint-orange-text)' }} />
                      <span>{t('quickLinks.product')}</span>
                    </Link>
                    <Link href="/master/racks" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <MapPin size={12} style={{ color: 'var(--tint-teal-text)' }} />
                      <span>{t('quickLinks.storage')}</span>
                    </Link>
                    <Link href="/equipment/jobs" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <Wrench size={12} style={{ color: 'var(--accent)' }} />
                      <span>{t('quickLinks.transfer')}</span>
                    </Link>
                    <Link href="/equipment/lifecycle" className="btn btn-secondary" style={{ fontSize: 9, padding: 4, flexDirection: 'column', gap: 2, textDecoration: 'none', textAlign: 'center' }}>
                      <Clock size={12} style={{ color: 'var(--tint-purple-text)' }} />
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
