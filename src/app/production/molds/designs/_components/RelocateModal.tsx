'use client'

import React, { useState, useEffect } from 'react'
import { relocateMold } from '../../actions'
import { BilingualLabel } from '@/components/ui/BilingualLabel'
import { Rack, RackLayer, Employee } from './CheckinCheckoutModal'

interface RelocateModalProps {
  mold: {
    id: string
    legacy_id?: string | number
    current_rack_layer_id: string | null
    mold_design?: { design_name: string }
    physical_code?: string
  }
  currentLayer: (RackLayer & { rack: Rack }) | null
  isOpen: boolean
  onClose: () => void
  racks: Rack[]
  allLayers: RackLayer[]
  employees: Employee[]
}

export function RelocateModal({
  mold,
  currentLayer,
  isOpen,
  onClose,
  racks,
  allLayers,
  employees
}: RelocateModalProps) {
  const [selectedRackId, setSelectedRackId] = useState<string>('')
  const [filteredLayers, setFilteredLayers] = useState<RackLayer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string>('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter layers
  useEffect(() => {
    if (selectedRackId) {
      setFilteredLayers(allLayers.filter(l => l.rack_id === selectedRackId))
      setSelectedLayerId('')
    } else {
      setFilteredLayers([])
      setSelectedLayerId('')
    }
  }, [selectedRackId, allLayers])

  // Reset state
  useEffect(() => {
    if (isOpen) {
      setSelectedRackId('')
      setSelectedLayerId('')
      setSelectedEmployeeId('')
      setError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const isSameLocation = selectedLayerId === mold.current_rack_layer_id

  const isFormValid = () => {
    if (!selectedLayerId || !selectedEmployeeId) return false
    if (isSameLocation) return false
    return true
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await relocateMold(mold.id, selectedLayerId, selectedEmployeeId)
      
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

  // Get selected layer data for preview
  const newLayer = allLayers.find(l => l.id === selectedLayerId)
  const newRack = newLayer ? racks.find(r => r.id === newLayer.rack_id) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-mcs-primary text-white p-3 flex items-center gap-2">
          <span className="text-lg">🔄</span>
          <div className="flex-1">
            <h2 className="font-bold text-sm">DI CHUYỂN VỊ TRÍ 移動</h2>
            <div className="text-xs text-white/80 font-medium">
              Khuôn: {mold?.physical_code || mold?.id} {mold.mold_design?.design_name ? `- ${mold.mold_design.design_name}` : ''}
            </div>
          </div>
        </div>

        {/* Visual Feedback Preview */}
        <div className="p-4 bg-mcs-surface-2 border-b border-mcs-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-mcs-text">
            <span>Vị trí hiện tại (現在)</span>
            <span className="text-slate-400">→</span>
            <span>Vị trí mới (新規)</span>
          </div>
          <div className="flex items-center justify-between">
            {/* Current */}
            <div className="flex-1">
              {currentLayer ? (
                <span className="inline-block px-2 py-1 bg-mcs-primary text-mcs-text-inverse text-[11px] font-bold rounded">
                  {currentLayer.rack?.code} / {currentLayer.code}
                </span>
              ) : (
                <span className="inline-block px-2 py-1 bg-slate-200 text-slate-500 text-[11px] font-bold rounded">
                  Chưa xác định / 不明
                </span>
              )}
            </div>
            
            <div className="px-3 text-slate-400">→</div>

            {/* New */}
            <div className="flex-1 text-right">
              {newRack && newLayer ? (
                <span className="inline-block px-2 py-1 bg-mcs-warning text-mcs-text-inverse text-[11px] font-bold rounded shadow-sm">
                  {newRack.code} / {newLayer.code}
                </span>
              ) : (
                <span className="inline-block px-2 py-1 border border-dashed border-slate-300 text-slate-400 text-[11px] font-bold rounded">
                  -- Chọn vị trí --
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4 bg-mcs-bg">
          {/* Rack Dropdown */}
          <div className="flex flex-col gap-1">
            <BilingualLabel ja="新ラック *" vi="Giá kệ mới *" />
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
            <BilingualLabel ja="新レイヤー *" vi="Vị trí mới *" />
            {selectedRackId && filteredLayers.length === 0 ? (
              <div className="text-xs text-mcs-warning-text bg-mcs-warning-light p-2 rounded border border-mcs-warning/30">
                Rack này chưa có vị trí nào
              </div>
            ) : (
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
            )}
            {isSameLocation && (
              <span className="text-xs text-mcs-error font-medium mt-1">
                ⚠️ Vị trí giống hiện tại
              </span>
            )}
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
              'Di chuyển 移動 →'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
