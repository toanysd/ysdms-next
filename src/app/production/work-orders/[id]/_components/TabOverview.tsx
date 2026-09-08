'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, User, Package, FileText, ExternalLink } from 'lucide-react'
import type { WOEquipmentSetResult } from '../../types'

interface TabOverviewProps {
  wo: {
    wo_id: string
    wo_code: string
    wo_name: string
    wo_type: string
    wo_status: string
    start_date: string | null
    deadline: string | null
    priority: number
    notes: string | null
    companies?: { company_name: string; company_code: string; company_id: string } | null
    products?: { product_id: string; product_code: string; product_name: string; product_name_internal?: string } | null
    responsible?: { full_name: string; employee_id: string } | null
  }
  equipmentSet?: WOEquipmentSetResult | null
}

export function TabOverview({ wo, equipmentSet }: TabOverviewProps) {
  const comp = wo.companies
  const prod = wo.products
  const resp = wo.responsible

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ── Section 1: Basic WO Info ── */}
      <div className="card-flat" style={{ padding: '14px 18px', backgroundColor: 'var(--bg-surface)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: 8,
            marginBottom: 12,
          }}
        >
          <FileText size={16} color="var(--accent)" />
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            指示基本情報 (Thông tin Lệnh sản xuất)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>指示コード</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
              {wo.wo_code}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>指示名称</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              {wo.wo_name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>取引先 (顧客)</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              {comp?.company_name ? (
                <Link
                  href={`/master/customers/${comp.company_id}`}
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                >
                  {comp.company_name}
                </Link>
              ) : (
                '—'
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>製造種別</span>
            <span className="badge badge--neutral font-bold">{wo.wo_type}</span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Product & CAD Specs (SSOT: design_revisions) ── */}
      <div className="card-flat" style={{ padding: '14px 18px', backgroundColor: 'var(--bg-surface)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: 8,
            marginBottom: 12,
          }}
        >
          <Package size={16} color="var(--accent)" />
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            成形製品・設計仕様 (Product Specs & CAD Design SSOT)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>製品型番</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              {prod?.product_code ? (
                <Link
                  href={`/master/products/${prod.product_id}`}
                  style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {prod.product_code} {prod.product_name ? `(${prod.product_name})` : ''}
                  <ExternalLink size={12} />
                </Link>
              ) : (
                '—'
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>設計リビジョン</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
              {equipmentSet?.design_code || '—'} (Rev {equipmentSet?.revision_number ?? 0})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>指定プラスチック</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#0369A1',
                backgroundColor: 'var(--tint-blue-bg, #EFF6FF)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {equipmentSet?.plastic_type_designed || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>抜き寸法 (Cutline)</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
              {equipmentSet?.cutline_length && equipmentSet?.cutline_width
                ? `${equipmentSet.cutline_length} × ${equipmentSet.cutline_width} mm`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 3: Schedule & Management ── */}
      <div className="card-flat" style={{ padding: '14px 18px', backgroundColor: 'var(--bg-surface)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: 8,
            marginBottom: 12,
          }}
        >
          <Calendar size={16} color="var(--accent)" />
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            日程・生産管理 (Schedule & Control)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>開始予定日</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
              {wo.start_date ? wo.start_date.slice(0, 10) : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>出荷納期</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#DC2626',
              }}
            >
              {wo.deadline ? wo.deadline.slice(0, 10) : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>担当者</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <User size={14} color="#64748B" />
              {resp?.full_name || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, color: '#64748B', minWidth: 90, flexShrink: 0 }}>優先度</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              Level {wo.priority || 5}
            </span>
          </div>
        </div>

        {wo.notes && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--border-default)' }}>
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginBottom: 4 }}>特記事項・備考:</span>
            <p style={{ fontSize: 12, color: '#334155', margin: 0, lineHeight: 1.4 }}>
              {wo.notes}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
