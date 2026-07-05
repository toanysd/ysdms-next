// @ts-nocheck
import Link from 'next/link'
import { ArrowLeft, Plus, Layers, GitBranch, FlaskConical, CheckCircle2, Clock, FileText, Factory } from 'lucide-react'
import { getMoldBaseDetail } from '@/app/actions/mold'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function MoldDetailPage({ params }: Props) {
  const { id } = await params
  const { moldBase, revisions, derivedMolds, error } = await getMoldBaseDetail(id)

  if (!moldBase || error) {
    notFound()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>

      {/* ──── CARD 1: Thông tin Khuôn Gốc ──── */}
      <div className="card" style={{ flexShrink: 0, padding: 0 }}>
        {/* Header */}
        <div style={{
          height: 48,
          background: 'var(--bg-surface-3)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid var(--border-default)'
        }}>
          <Link href="/master/molds" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <Layers size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
            <span className="ja">金型詳細 — {moldBase.mold_master_code}</span>
            <span className="vi" style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Chi tiết Khuôn gốc</span>
          </h2>
        </div>

        {/* Body: Thông tin cơ bản */}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span className="ja">金型コード</span> <span className="vi">/ Mã Khuôn</span>
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                {moldBase.mold_master_code}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span className="ja">金型名称</span> <span className="vi">/ Tên Khuôn</span>
              </span>
              <span style={{ fontSize: 14 }}>{moldBase.mold_master_name || '—'}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span className="ja">顧客</span> <span className="vi">/ Khách hàng (Chủ sở hữu)</span>
              </span>
              {moldBase.companies ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="badge badge--neutral" style={{ fontFamily: 'monospace' }}>
                    {moldBase.companies.company_code}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{moldBase.companies.company_name}</span>
                </div>
              ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span className="ja">保管先</span> <span className="vi">/ Nơi lưu giữ (Keeper)</span>
              </span>
              {moldBase.keeper_company ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Factory size={14} style={{ color: 'var(--status-info)' }} />
                  <span className="badge badge--info" style={{ fontFamily: 'monospace' }}>
                    {moldBase.keeper_company.company_code}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{moldBase.keeper_company.company_name}</span>
                </div>
              ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span className="ja">状態</span> <span className="vi">/ Status</span>
              </span>
              {moldBase.status === 'ACTIVE' ? 
                (<span className="badge badge--success" style={{ width: 'fit-content' }}>ACTIVE</span>) :
                (<span className="badge badge--neutral" style={{ width: 'fit-content' }}>{moldBase.status || 'INACTIVE'}</span>)
              }
            </div>
          </div>
        </div>
      </div>

      {/* ──── CARD 2: Danh sách Revision ──── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          height: 48,
          background: 'var(--bg-surface-3)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
              <span className="ja">設計版一覧 (Revisions)</span>
              <span className="vi" style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Danh sách Phiên bản thiết kế</span>
            </h3>
          </div>
          <Link href={`/master/mold/${id}/revision/new`}>
            <button className="btn btn-primary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              <Plus size={14} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                <span className="ja">設計版追加</span>
              </div>
            </button>
          </Link>
        </div>

        <div className="custom-scrollbar" style={{ flex: 1, overflow: 'auto' }}>
          {revisions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 12, color: 'var(--text-muted)' }}>
              <Layers size={40} strokeWidth={1} />
              <div style={{ textAlign: 'center' }}>
                <p className="ja" style={{ fontWeight: 700, fontSize: 13 }}>設計版がまだありません</p>
                <p className="vi" style={{ fontSize: 11, marginTop: 4 }}>Chưa có phiên bản thiết kế nào. Hãy tạo Revision đầu tiên!</p>
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: 'center' }}>#</th>
                  <th style={{ width: 220 }}>
                    <span className="ja">設計版コード</span><span className="vi">Mã Revision</span>
                  </th>
                  <th style={{ width: 120 }}>
                    <span className="ja">版ラベル</span><span className="vi">Nhãn</span>
                  </th>
                  <th style={{ width: 140 }}>
                    <span className="ja">承認日</span><span className="vi">Ngày hiệu lực</span>
                  </th>
                  <th style={{ width: 120 }}>
                    <span className="ja">状態</span><span className="vi">Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((rev: any, index: number) => {
                  const displayCode = rev.revision_code.replace(/^(.+)-([^-]+)$/, '$1 $2')
                  const isApproved = !!rev.effective_date
                  
                  return (
                    <tr key={rev.revision_id}>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{index + 1}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>
                        <Link href={`/master/mold/${id}/revision/${rev.revision_id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-[var(--accent)] hover:underline">
                          {displayCode}
                        </Link>
                      </td>
                      <td>
                        <span className="badge badge--info">
                          {rev.revision_name}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {rev.effective_date || '—'}
                      </td>
                      <td>
                        {isApproved ? (
                          <span className="badge badge--success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} />
                            EFFECTIVE
                          </span>
                        ) : (
                          <span className="badge badge--warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} />
                            PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
