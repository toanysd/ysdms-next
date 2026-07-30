'use client'

import Link from 'next/link'
import { PenTool, ExternalLink, Calendar, Layers } from 'lucide-react'
import type { ProductDetailData } from '../page'

export function DesignsTab({ product }: { product: ProductDetailData }) {
  const designs = product.design_revisions || []

  if (designs.length === 0) {
    return (
      <div className="card-flat" style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <PenTool size={24} style={{ color: 'var(--text-muted)', marginBottom: 8, opacity: 0.5 }} />
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
          関連する金型設計がありません
        </div>
        <div style={{ fontSize: 11, marginTop: 4 }}>
          Chưa có phiên bản thiết kế khuôn nào được liên kết với sản phẩm này.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
          設計バージョン一覧 ({designs.length} 件)
        </div>
      </div>

      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table w-full">
          <thead>
            <tr style={{ background: 'var(--bg-surface-2)' }}>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>
                図面・設計コード
              </th>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center' }}>
                Rev
              </th>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>
                プラスチック仕様
              </th>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center' }}>
                設計日
              </th>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center' }}>
                ステータス
              </th>
              <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>
                詳細
              </th>
            </tr>
          </thead>
          <tbody>
            {designs.map((d, idx) => {
              const plastic = d.plastic_master
              const plasticText = plastic 
                ? `${plastic.plastic_code || ''} ${plastic.thickness_mm != null ? plastic.thickness_mm + 'mm' : ''} ${plastic.color_name_normalized || ''}`.trim()
                : '—'

              return (
                <tr
                  key={d.revision_id}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <td style={{ padding: '8px 10px', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}>
                    <Link
                      href={`/engineering/designs/revisions/${d.revision_id}`}
                      style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <PenTool size={13} />
                      {d.design_code}
                    </Link>
                  </td>
                  <td style={{ padding: '8px 10px', fontSize: 12, fontFamily: 'monospace', textAlign: 'center', fontWeight: 600 }}>
                    R{d.revision_number ?? 0}
                  </td>
                  <td style={{ padding: '8px 10px', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {plasticText || '—'}
                  </td>
                  <td style={{ padding: '8px 10px', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {d.design_date || '—'}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <span className="badge badge--info" style={{ fontSize: 10 }}>
                      {d.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                    <Link
                      href={`/engineering/designs/revisions/${d.revision_id}`}
                      className="btn btn-secondary"
                      style={{ height: 26, padding: '0 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                    >
                      <ExternalLink size={12} />
                      <span>詳細</span>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
