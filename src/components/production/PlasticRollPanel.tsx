'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Layers,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  Box,
  Sliders,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface PlasticRollPanelProps {
  onRollSelect: (rollId: string | null) => void
  highlightedRollId: string | null
  refreshKey?: number
}

interface RollItem {
  id: string
  roll_barcode: string
  commercial_grade_code: string | null
  current_length_m: number
  nominal_length_m?: number | null
  received_length_m: number | null
  status: string
  warehouse_location: string | null
  lot_no: string | null
  supplier_name: string | null
  assignedMachine?: string | null
  assignedDate?: string | null
  assignedShift?: string | null
  feedLengthMm?: number | null
}

export default function PlasticRollPanel({
  onRollSelect,
  highlightedRollId,
  refreshKey,
}: PlasticRollPanelProps) {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(true)
  const [rolls, setRolls] = useState<RollItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false)

  // Fetch rolls & current schedule assignments
  const fetchRolls = useCallback(async () => {
    setLoading(true)

    // 1. Fetch rolls from plastic_receipt_roll
    const { data: rollData, error: rErr } = await supabase
      .from('plastic_receipt_roll')
      .select('id, roll_barcode, commercial_grade_code, current_length_m, received_length_m, nominal_length_m, status, warehouse_location, lot_no, supplier_name')
      .in('status', ['in_stock', 'in_use', 'IN_USE', 'AVAILABLE', 'PARTIAL'])
      .order('current_length_m', { ascending: true })

    // 2. Fetch active assignments in scheduled tray jobs
    const todayStr = new Date().toISOString().split('T')[0]
    const { data: scheduleData } = await supabase
      .from('v_tray_schedule_gantt')
      .select('roll_id, machine_code, machine_name, schedule_date, shift')
      .gte('schedule_date', todayStr)
      .not('roll_id', 'is', null)

    const assignmentMap = new Map<string, { machine: string; date: string; shift: string }>()
    if (scheduleData) {
      for (const item of scheduleData) {
        if (item.roll_id && !assignmentMap.has(item.roll_id)) {
          assignmentMap.set(item.roll_id, {
            machine: `${item.machine_code} ${item.machine_name}`,
            date: item.schedule_date,
            shift: item.shift || 'DAY',
          })
        }
      }
    }

    if (rollData) {
      const merged: RollItem[] = rollData.map((r: any) => {
        const assign = assignmentMap.get(r.id)
        return {
          id: r.id,
          roll_barcode: r.roll_barcode,
          commercial_grade_code: r.commercial_grade_code,
          current_length_m: r.current_length_m || 0,
          received_length_m: r.received_length_m || r.nominal_length_m || 1000,
          status: r.status,
          warehouse_location: r.warehouse_location,
          lot_no: r.lot_no,
          supplier_name: r.supplier_name,
          assignedMachine: assign?.machine,
          assignedDate: assign?.date,
          assignedShift: assign?.shift,
          feedLengthMm: 500, // Default pitch 500mm if machine feed length not set
        }
      })
      setRolls(merged)
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchRolls()
  }, [fetchRolls, refreshKey])

  // Count critical rolls (< 500m)
  const criticalCount = useMemo(() => {
    return rolls.filter((r) => r.current_length_m < 500).length
  }, [rolls])

  // Filter rolls by search & threshold
  const filteredRolls = useMemo(() => {
    return rolls.filter((r) => {
      if (filterCriticalOnly && r.current_length_m >= 500) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const match =
          r.roll_barcode.toLowerCase().includes(q) ||
          (r.commercial_grade_code && r.commercial_grade_code.toLowerCase().includes(q)) ||
          (r.assignedMachine && r.assignedMachine.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [rolls, filterCriticalOnly, searchQuery])

  // If collapsed, render slim floating button
  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: '45%',
          transform: 'translateY(-50%)',
          zIndex: 40,
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '-2px 4px 12px rgba(0,0,0,0.15)',
          }}
          title="原反ロール在庫パネルを開く"
        >
          <ChevronLeft size={16} />
          <span style={{ writingMode: 'vertical-rl', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
            原反在庫 ({rolls.length})
          </span>
          {criticalCount > 0 && (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#DC2626',
                color: '#FFFFFF',
                fontSize: 9,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {criticalCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        background: '#FFFFFF',
        borderLeft: '2px solid #CBD5E1',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 30,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={16} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>原反ロール在庫</div>
            <div style={{ fontSize: 10, color: '#64748B' }}>
              {rolls.length} 本登録中
              {criticalCount > 0 && (
                <span style={{ color: '#DC2626', fontWeight: 700, marginLeft: 4 }}>
                  (🔴 {criticalCount} 本が&lt;500m)
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => fetchRolls()}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}
            title="更新"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              border: 'none',
              background: '#E2E8F0',
              borderRadius: 4,
              cursor: 'pointer',
              padding: '3px 6px',
              color: '#334155',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            title="パネルを閉じる"
          >
            <span>閉じる</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="ロール番号・材質検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input text-xs"
            style={{ height: 26, width: '100%', paddingLeft: 24 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            style={{
              border: 'none',
              background: filterCriticalOnly ? '#FEE2E2' : '#F1F5F9',
              color: filterCriticalOnly ? '#DC2626' : '#475569',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <AlertTriangle size={11} />
            <span>500m未満のみ ({criticalCount})</span>
          </button>

          {highlightedRollId && (
            <button
              onClick={() => onRollSelect(null)}
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--accent)',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              強調表示を解除
            </button>
          )}
        </div>
      </div>

      {/* ── Rolls List ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#64748B', fontSize: 11 }}>
            <RefreshCw size={16} className="animate-spin" style={{ margin: '0 auto 6px' }} />
            原反ロール読込中...
          </div>
        ) : filteredRolls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 25, color: '#94A3B8', fontSize: 11 }}>
            該当するロールがありません
          </div>
        ) : (
          filteredRolls.map((roll) => {
            const isCritical = roll.current_length_m < 500
            const nominal = roll.received_length_m || 1000
            const pct = Math.min(100, Math.max(0, Math.round((roll.current_length_m / nominal) * 100)))

            // Estimate remaining sheets: (currentM * 1000) / feedLengthMm (default 500mm pitch)
            const feedMm = roll.feedLengthMm || 500
            const estSheets = Math.floor((roll.current_length_m * 1000) / feedMm)

            const isHighlighted = highlightedRollId === roll.id

            return (
              <div
                key={roll.id}
                onClick={() => onRollSelect(isHighlighted ? null : roll.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: isHighlighted
                    ? '2px solid var(--accent)'
                    : isCritical
                    ? '1px solid #FECACA'
                    : '1px solid #E2E8F0',
                  background: isHighlighted
                    ? '#EFF6FF'
                    : isCritical
                    ? '#FEF2F2'
                    : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  boxShadow: isHighlighted ? '0 0 8px rgba(59,130,246,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                className="hover:border-slate-400"
              >
                {/* Roll top row: Barcode + Grade + Critical badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                    {roll.roll_barcode}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isCritical ? (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: '1px 4px',
                          borderRadius: 3,
                          background: '#DC2626',
                          color: '#FFFFFF',
                        }}
                      >
                        ⚠️ 補充急
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: 3,
                          background: '#E2E8F0',
                          color: '#475569',
                        }}
                      >
                        {roll.commercial_grade_code || 'PET'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter gauge & progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10 }}>
                  <span style={{ color: '#475569' }}>
                    残: <strong style={{ color: isCritical ? '#DC2626' : '#0F172A', fontFamily: 'monospace', fontSize: 11 }}>{roll.current_length_m.toLocaleString()}m</strong>
                    <span style={{ color: '#94A3B8', marginLeft: 2 }}>/ {nominal.toLocaleString()}m</span>
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: isCritical ? '#DC2626' : 'var(--accent)' }}>
                    {pct}%
                  </span>
                </div>

                <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isCritical ? '#DC2626' : pct < 25 ? '#F59E0B' : 'var(--accent)',
                    }}
                  />
                </div>

                {/* Estimate sheet count via pitch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 9, color: '#64748B', marginTop: 1 }}>
                  <span>推定残可能: ~{estSheets.toLocaleString()} 枚</span>
                  <span>(送り: {feedMm}mm)</span>
                </div>

                {/* Current assignment if in use */}
                {roll.assignedMachine && (
                  <div
                    style={{
                      fontSize: 9,
                      padding: '2px 6px',
                      borderRadius: 3,
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#92400E',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 2,
                    }}
                  >
                    <span>使用中: {roll.assignedMachine}</span>
                    <span>{roll.assignedDate}</span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ── Footer Link to Inventory ── */}
      <div style={{ padding: '8px 10px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'center' }}>
        <Link
          href="/plastics/inventory"
          style={{
            fontSize: 11,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>全原反ロール管理へ</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  )
}
