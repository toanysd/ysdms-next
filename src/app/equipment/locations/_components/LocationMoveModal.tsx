'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import {
  X,
  Layers,
  Truck,
  MapPin,
  Building2,
  User,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import {
  getSelectorLookups,
  moveEquipmentLocation,
  transferEquipmentCompany,
  returnEquipmentToOwner,
  type SelectorLookups,
} from '../actions'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  equipment: {
    equipment_id: string
    equipment_code: string
    display_name: string
    current_rack_layer_id?: string | null
    current_layer_code?: string | null
    current_rack_code?: string | null
    current_location_in_factory?: string | null
    company_id?: string | null
    owner_company_name?: string | null
    keeper_company_id?: string | null
    keeper_company_name?: string | null
  }
  defaultTab?: 'RACK' | 'COMPANY'
}

export default function LocationMoveModal({
  isOpen,
  onClose,
  onSuccess,
  equipment,
  defaultTab = 'RACK',
}: Props) {
  const t = useTranslations('EquipmentLocations.modal')
  const tZones = useTranslations('EquipmentLocations.zones')

  const [activeTab, setActiveTab] = useState<'RACK' | 'COMPANY'>(defaultTab)
  const [lookups, setLookups] = useState<SelectorLookups | null>(null)
  const [loadingLookups, setLoadingLookups] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states - Rack Layer Move
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [selectedRackId, setSelectedRackId] = useState<string>('')
  const [selectedLayerId, setSelectedLayerId] = useState<string>('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [rackNotes, setRackNotes] = useState<string>('')

  // Form states - Company Transfer
  const [selectedToCompanyId, setSelectedToCompanyId] = useState<string>('')
  const [shipDate, setShipDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [companyEmployeeId, setCompanyEmployeeId] = useState<string>('')
  const [companyNotes, setCompanyNotes] = useState<string>('')

  // Load lookups on mount / open
  useEffect(() => {
    if (!isOpen) return
    setMessage(null)
    setActiveTab(defaultTab)

    // Load default employee from localStorage
    const savedEmp = localStorage.getItem('ysd_default_employee_id')
    if (savedEmp) {
      setSelectedEmployeeId(savedEmp)
      setCompanyEmployeeId(savedEmp)
    }

    async function fetchLookups() {
      setLoadingLookups(true)
      try {
        const res = await getSelectorLookups()
        setLookups(res)
      } catch (err) {
        console.error('Failed to load lookups:', err)
      } finally {
        setLoadingLookups(false)
      }
    }

    fetchLookups()
  }, [isOpen, defaultTab])

  // Cascade 1: Racks in selected zone
  const availableRacks = useMemo(() => {
    if (!lookups) return []
    if (!selectedZone) return lookups.racks
    return lookups.racks.filter((r) => r.zone_code === selectedZone)
  }, [lookups, selectedZone])

  // Cascade 2: Layers in selected rack
  const availableLayers = useMemo(() => {
    if (!lookups || !selectedRackId) return []
    const r = lookups.racks.find((rack) => rack.id === selectedRackId)
    return r ? r.layers : []
  }, [lookups, selectedRackId])

  // When selected rack changes, auto-select first layer if available
  useEffect(() => {
    if (availableLayers.length > 0 && !selectedLayerId) {
      setSelectedLayerId(availableLayers[0].id)
    }
  }, [availableLayers, selectedLayerId])

  if (!isOpen) return null

  // Handle Tab 1 Submit: Move Rack Layer
  const handleRackMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLayerId) {
      setMessage({ type: 'error', text: t('valLayerReq') })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await moveEquipmentLocation({
        equipmentId: equipment.equipment_id,
        oldRackLayerId: equipment.current_rack_layer_id || null,
        newRackLayerId: selectedLayerId,
        employeeId: selectedEmployeeId || null,
        notes: rackNotes || null,
      })

      if (res.success) {
        if (selectedEmployeeId) {
          localStorage.setItem('ysd_default_employee_id', selectedEmployeeId)
        }
        setMessage({ type: 'success', text: t('rackMoveSuccess') })
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 700)
      } else {
        setMessage({ type: 'error', text: res.error || t('moveFailed') })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Tab 2 Submit: Company Transfer
  const handleCompanyTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedToCompanyId) {
      setMessage({ type: 'error', text: t('valCompanyReq') })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await transferEquipmentCompany({
        equipmentId: equipment.equipment_id,
        fromCompanyId: equipment.keeper_company_id || null,
        toCompanyId: selectedToCompanyId,
        employeeId: companyEmployeeId || null,
        shipDate: shipDate,
        notes: companyNotes || null,
        itemName: equipment.display_name || equipment.equipment_code,
      })

      if (res.success) {
        if (companyEmployeeId) {
          localStorage.setItem('ysd_default_employee_id', companyEmployeeId)
        }
        setMessage({ type: 'success', text: t('companyTransferSuccess') })
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 700)
      } else {
        setMessage({ type: 'error', text: res.error || t('transferFailed') })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle 1-click Return to Owner
  const handle1ClickReturn = async () => {
    if (!equipment.company_id) {
      alert(t('noOwnerCompanyAlert'))
      return
    }

    if (!confirm(t('confirmReturnToOwner'))) return

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await returnEquipmentToOwner({
        equipmentId: equipment.equipment_id,
        ownerCompanyId: equipment.company_id,
        currentKeeperCompanyId: equipment.keeper_company_id || '',
        employeeId: companyEmployeeId || null,
        itemName: equipment.display_name || equipment.equipment_code,
      })

      if (res.success) {
        setMessage({ type: 'success', text: t('returnSuccess') })
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 700)
      } else {
        setMessage({ type: 'error', text: res.error || t('returnFailed') })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const isReturnedToOwner =
    equipment.company_id && equipment.keeper_company_id === equipment.company_id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-teal-400" />
            <div>
              <div className="font-bold text-[15px] leading-tight">{t('title')}</div>
              <div className="text-[11px] text-slate-300 font-mono">
                {equipment.equipment_code} — {equipment.display_name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('RACK')
              setMessage(null)
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'RACK'
                ? 'border-teal-600 text-teal-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={15} />
            <span>{t('tabRack')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('COMPANY')
              setMessage(null)
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'COMPANY'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck size={15} />
            <span>{t('tabCompany')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-[13px]">
          {/* Current Location / Status Callout */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[12px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('currentLocation')}:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {equipment.current_layer_code || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('currentRack')}:</span>
              <span className="text-slate-800 font-medium">
                {equipment.current_rack_code || '—'}
                {equipment.current_location_in_factory ? ` (${equipment.current_location_in_factory})` : ''}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="font-semibold text-slate-500">{t('currentKeeper')}:</span>
              <span className="font-semibold text-indigo-700">
                {equipment.keeper_company_name || 'YSD ((株)ヨシダ成形)'}
              </span>
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`p-3 rounded-md text-[12px] font-semibold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {loadingLookups ? (
            <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-teal-600" />
              <span>{t('loadingLookups')}</span>
            </div>
          ) : activeTab === 'RACK' ? (
            /* TAB 1: RACK LAYER CHANGE FORM */
            <form onSubmit={handleRackMoveSubmit} className="flex flex-col gap-3.5">
              {/* Step 1: Zone Select */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  1. {t('selectZone')} <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-input w-full text-[13px]"
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value)
                    setSelectedRackId('')
                    setSelectedLayerId('')
                  }}
                  required
                >
                  <option value="">{t('chooseZonePlaceholder')}</option>
                  {lookups?.zones.map((z) => {
                    let label = z
                    try {
                      label = tZones(z)
                    } catch {
                      label = z
                    }
                    return (
                      <option key={z} value={z}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Step 2: Rack Select */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  2. {t('selectRack')} <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-input w-full text-[13px] font-mono"
                  value={selectedRackId}
                  onChange={(e) => {
                    setSelectedRackId(e.target.value)
                    setSelectedLayerId('')
                  }}
                  disabled={!selectedZone}
                  required
                >
                  <option value="">{t('chooseRackPlaceholder')}</option>
                  {availableRacks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.rack_code_new} ({r.rack_code}) — {r.location_in_factory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Layer Select */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  3. {t('selectLayer')} <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-input w-full text-[13px] font-mono font-bold text-teal-800"
                  value={selectedLayerId}
                  onChange={(e) => setSelectedLayerId(e.target.value)}
                  disabled={!selectedRackId}
                  required
                >
                  <option value="">{t('chooseLayerPlaceholder')}</option>
                  {availableLayers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.layer_code} (Tầng {l.layer_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Performed by Employee */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('operator')}
                </label>
                <select
                  className="form-input w-full text-[13px]"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">{t('chooseEmployeePlaceholder')}</option>
                  {lookups?.employees.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name} ({emp.employee_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('notes')}
                </label>
                <input
                  type="text"
                  className="form-input w-full text-[13px]"
                  placeholder={t('notesPlaceholder')}
                  value={rackNotes}
                  onChange={(e) => setRackNotes(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary text-[12px] py-1.5 px-3"
                  disabled={submitting}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-[12px] py-1.5 px-4 font-semibold"
                  disabled={submitting || !selectedLayerId}
                >
                  {submitting && <Loader2 size={13} className="animate-spin mr-1.5 inline" />}
                  {t('saveMove')}
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: COMPANY TRANSFER FORM */
            <form onSubmit={handleCompanyTransferSubmit} className="flex flex-col gap-3.5">
              {/* 1-Click Return Button (If keeper !== owner) */}
              {equipment.company_id && !isReturnedToOwner && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex flex-col gap-1.5">
                  <div className="text-[12px] font-bold text-amber-900 flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-amber-700" />
                    <span>{t('oneClickReturnTitle')}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {t('oneClickReturnDesc', {
                      owner: equipment.owner_company_name || t('ownerDefault'),
                    })}
                  </p>
                  <button
                    type="button"
                    onClick={handle1ClickReturn}
                    disabled={submitting}
                    className="btn mt-1 text-[12px] py-1.5 px-3 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>{t('returnMoldBtn')}</span>
                  </button>
                </div>
              )}

              {/* Target Company Select */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('selectToCompany')} <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-input w-full text-[13px]"
                  value={selectedToCompanyId}
                  onChange={(e) => setSelectedToCompanyId(e.target.value)}
                  required
                >
                  <option value="">{t('chooseCompanyPlaceholder')}</option>
                  {lookups?.companies.map((c) => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_name} ({c.company_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Ship Date */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('shipDate')}
                </label>
                <input
                  type="date"
                  className="form-input w-full text-[13px]"
                  value={shipDate}
                  onChange={(e) => setShipDate(e.target.value)}
                  required
                />
              </div>

              {/* Handler Employee */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('operator')}
                </label>
                <select
                  className="form-input w-full text-[13px]"
                  value={companyEmployeeId}
                  onChange={(e) => setCompanyEmployeeId(e.target.value)}
                >
                  <option value="">{t('chooseEmployeePlaceholder')}</option>
                  {lookups?.employees.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name} ({emp.employee_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes / Reason */}
              <div>
                <label className="form-label text-[12px] font-semibold text-slate-700 block mb-1">
                  {t('notes')}
                </label>
                <input
                  type="text"
                  className="form-input w-full text-[13px]"
                  placeholder={t('companyNotesPlaceholder')}
                  value={companyNotes}
                  onChange={(e) => setCompanyNotes(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary text-[12px] py-1.5 px-3"
                  disabled={submitting}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="btn text-[12px] py-1.5 px-4 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  disabled={submitting || !selectedToCompanyId}
                >
                  {submitting && <Loader2 size={13} className="animate-spin mr-1.5 inline" />}
                  {t('saveTransfer')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
