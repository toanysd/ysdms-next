'use client'

import React, { useState, useEffect } from 'react'
import { checkInMold, checkOutMold } from '../../actions'
import { BilingualLabel } from '@/components/ui/BilingualLabel'

export interface Rack {
  id: string
  code: string
  name?: string
}

export interface RackLayer {
  id: string
  rack_id: string
  code: string
  label?: string
}

export interface Employee {
  id: string
  name: string
  employee_code?: string
}

export interface Destination {
  id: string
  name: string
  code?: string
}

export interface Company {
  id: string
  name: string
  code?: string
}

export interface ItemType {
  id: string
  name: string
  code?: string
}

interface Props {
  mold: any // TODO: specific mold type
  mode: 'in' | 'out'
  isOpen: boolean
  onClose: () => void
  racks: Rack[]
  layers: RackLayer[] // allLayers
  employees: Employee[]
  destinations: Destination[]
  companies: Company[]
  itemTypes: ItemType[]
}

export function CheckinCheckoutModal({
  mold,
  mode,
  isOpen,
  onClose,
  racks,
  layers: allLayers,
  employees,
  destinations,
  companies = [],
  itemTypes = []
}: Props) {
  const [selectedRackId, setSelectedRackId] = useState<string>('')
  const [filteredLayers, setFilteredLayers] = useState<RackLayer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string>('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [shipDate, setShipDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState<string>('')
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter layers when rack changes
  useEffect(() => {
    if (selectedRackId) {
      setFilteredLayers(allLayers.filter(l => l.rack_id === selectedRackId))
      setSelectedLayerId('') // reset layer on rack change
    } else {
      setFilteredLayers([])
      setSelectedLayerId('')
    }
  }, [selectedRackId, allLayers])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedRackId('')
      setSelectedLayerId('')
      setSelectedEmployeeId('')
      setSelectedCompanyId('')
      setShipDate(new Date().toISOString().split('T')[0])
      setReturnDate('')
      setSelectedItemTypeId('')
      setNotes('')
      setError(null)
      setIsSubmitting(false)
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      let result;
      if (mode === 'in') {
        result = await checkInMold(mold.id, selectedLayerId, selectedEmployeeId)
      } else {
        result = await checkOutMold(mold.id, selectedCompanyId, selectedEmployeeId, {
          ship_date: shipDate,
          return_date: returnDate || undefined,
          item_type_id: selectedItemTypeId || undefined,
          notes: notes || undefined
        })
      }

      if (result.success) {
        onClose()
      } else {
        setError(result.error ?? 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    if (mode === 'in') {
      return selectedRackId && selectedLayerId && selectedEmployeeId
    } else {
      return selectedCompanyId && selectedEmployeeId && shipDate
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-mcs-primary text-white p-3 flex items-center gap-2">
          {mode === 'in' ? (
            <span className="text-lg">📥</span>
          ) : (
            <span className="text-lg">📤</span>
          )}
          <div className="flex-1">
            <h2 className="font-bold text-sm">
              {mode === 'in' ? 'CHECK-IN 入庫' : 'CHECK-OUT 出庫'}
            </h2>
            <div className="text-xs text-white/80 font-medium">
              Khuôn: {mold?.physical_code || mold?.id} / 金型: {mold?.physical_code || mold?.id}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4 bg-mcs-bg">
          {mode === 'in' ? (
            <>
              {/* Rack Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="ラック *" vi="Giá kệ *" />
                <select
                  value={selectedRackId}
                  onChange={(e) => setSelectedRackId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                >
                  <option value="">-- Chọn Giá kệ --</option>
                  {racks.map(r => (
                    <option key={r.id} value={r.id}>{r.code} {r.name ? `- ${r.name}` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Layer Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="レイヤー *" vi="Vị trí *" />
                <select
                  value={selectedLayerId}
                  onChange={(e) => setSelectedLayerId(e.target.value)}
                  disabled={!selectedRackId || isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Chọn Vị trí --</option>
                  {filteredLayers.map(l => (
                    <option key={l.id} value={l.id}>{l.code} {l.label ? `- ${l.label}` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Employee Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="担当者 *" vi="Nhân viên *" />
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                >
                  <option value="">-- Chọn Nhân viên --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} {e.employee_code ? `(${e.employee_code})` : ''}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Company Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="会社 *" vi="Công ty *" />
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                >
                  <option value="">-- Chọn Công ty --</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.code ? `(${c.code})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Employee Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="担当者 *" vi="Nhân viên giao *" />
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                >
                  <option value="">-- Chọn Nhân viên --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} {e.employee_code ? `(${e.employee_code})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Ship Date */}
                <div className="flex flex-col gap-1">
                  <BilingualLabel ja="出荷日 *" vi="Ngày gửi *" />
                  <input
                    type="date"
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                  />
                </div>

                {/* Return Date */}
                <div className="flex flex-col gap-1">
                  <BilingualLabel ja="返却期限" vi="Hạn trả về" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                  />
                </div>
              </div>

              {/* Item Type Dropdown */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="種類" vi="Loại hàng" />
                <select
                  value={selectedItemTypeId}
                  onChange={(e) => setSelectedItemTypeId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none"
                >
                  <option value="">-- Chọn Loại hàng --</option>
                  {itemTypes.map(it => (
                    <option key={it.id} value={it.id}>{it.name} {it.code ? `(${it.code})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Notes Textarea */}
              <div className="flex flex-col gap-1">
                <BilingualLabel ja="メモ" vi="Ghi chú" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full p-3 border border-mcs-border rounded bg-white text-sm focus:border-mcs-primary focus:ring-1 focus:ring-mcs-primary outline-none resize-none"
                  placeholder="Ghi chú thêm (tùy chọn)..."
                />
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-mcs-error-light border border-mcs-error/20 rounded text-mcs-error-text text-xs font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-mcs-surface border-t border-mcs-border flex justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 min-h-[44px] bg-transparent text-mcs-text-secondary border border-mcs-border hover:bg-mcs-surface-hover rounded font-bold text-sm transition-colors disabled:opacity-50"
          >
            Hủy キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="flex-1 min-h-[44px] bg-mcs-primary text-white hover:bg-mcs-primary-hover rounded font-bold text-sm transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận 確認 →'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
