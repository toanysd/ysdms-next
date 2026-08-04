// @ts-nocheck
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Plus, Layers, GitBranch, FlaskConical, CheckCircle2, Clock, FileText, Factory } from 'lucide-react'
import { getMoldBaseDetail } from '@/app/actions/mold'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function MoldDetailPage({ params }: Props) {
  const t = await getTranslations('Master')
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
            {t('Master.chiTietKhuonGoc')}
          </h2>
        </div>

        {/* Body: Thông tin cơ bản */}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('Master.maKhuon')}
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                {moldBase.mold_master_code}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('Master.tenKhuon')}
              </span>
              <span style={{ fontSize: 14 }}>{moldBase.mold_master_name || '—'}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('Master.khachHangChuSoHuu')}
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
                {t('Master.noiLuuGiuKeeper')}
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
                {t('Master.status')}
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
              {t('Master.danhSachPhienBanThietKe')}
            </h3>
          </div>
          <Link href={`/master/mold/${id}/revision/new`}>
            <button className="btn btn-primary" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
              <Plus size={14} />
              {t('Master.maRevision')}
            </button>
          </Link>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {revisions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: 8, padding: 48 }}>
              <FileText size={32} style={{ opacity: 0.5 }} />
              <span>デザインリビジョンがまだありません。</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: 'center' }}>#</th>
                  <th>
                    {t('Master.maRevision')}
                  </th>
                  <th style={{ width: 120 }}>
                    {t('Master.nhan')}
                  </th>
                  <th style={{ width: 140 }}>
                    {t('Master.ngayHieuLuc')}
                  </th>
                  <th style={{ width: 120 }}>
                    {t('Master.status')}
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
