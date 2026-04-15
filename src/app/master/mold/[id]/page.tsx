import Link from 'next/link'
import { ArrowLeft, Plus, Layers, GitBranch, FlaskConical, CheckCircle2, Clock, FileText } from 'lucide-react'
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
    <div className="flex flex-col h-full gap-4">

      {/* ──── CARD 1: Thông tin Khuôn Gốc ──── */}
      <div className="bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
          <div className="flex items-center gap-2">
            <Link href="/master/mold" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-1">
              <ArrowLeft size={18} />
            </Link>
            <Layers size={20} className="text-[var(--mcs-primary)]" />
            <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
              <span className="ja">金型詳細 — {moldBase.code}</span>
              <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Chi tiết Khuôn gốc</span>
            </h2>
          </div>
        </div>

        {/* Body: Thông tin cơ bản */}
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
              <span className="ja">金型コード</span> <span className="vi">/ Mã Khuôn</span>
            </span>
            <span className="font-mono font-bold text-[16px] text-[var(--mcs-text)]">{moldBase.code}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
              <span className="ja">金型名称</span> <span className="vi">/ Tên</span>
            </span>
            <span className="text-sm">{moldBase.name || '—'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
              <span className="ja">顧客</span> <span className="vi">/ Khách hàng</span>
            </span>
            {moldBase.customers ? (
              <span className="inline-flex items-center gap-1">
                <span className="px-2 py-0.5 bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)] border border-[var(--mcs-primary)] border-opacity-30 rounded font-bold text-[11px]">
                  {moldBase.customers.code}
                </span>
                <span className="text-sm text-[var(--mcs-text-secondary)]">{moldBase.customers.name}</span>
              </span>
            ) : <span className="text-[var(--mcs-text-muted)]">—</span>}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--mcs-text-muted)] text-[10px] font-bold uppercase tracking-wide">
              <span className="ja">状態</span> <span className="vi">/ Status</span>
            </span>
            {moldBase.is_active ? 
              (<span className="w-fit px-2 py-0.5 bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] border border-[rgba(39,174,96,0.25)] rounded uppercase text-[10px] font-bold">Active</span>) :
              (<span className="w-fit px-2 py-0.5 bg-[var(--mcs-neutral-light)] text-[var(--mcs-neutral-text)] border border-[rgba(149,165,166,0.25)] rounded uppercase text-[10px] font-bold">Inactive</span>)
            }
          </div>
        </div>

        {/* Phả hệ: Kế thừa từ bản D */}
        {moldBase.prototype && (
          <div className="mx-5 mb-4 p-3 bg-[var(--mcs-info-light)] border border-[var(--mcs-info)] border-opacity-30 rounded-lg flex items-center gap-3">
            <FlaskConical size={20} className="text-[var(--mcs-info)] shrink-0" />
            <div className="flex flex-col text-[12px]">
              <span className="ja font-bold text-[var(--mcs-info-text)]">
                試作元 (Prototype Origin)
              </span>
              <span className="vi text-[11px] text-[var(--mcs-text-secondary)]">
                Kế thừa thiết kế từ bản thử nghiệm: {' '}
                <Link href={`/master/mold/${moldBase.prototype.id}`} className="font-mono font-bold text-[var(--mcs-info)] hover:underline">
                  {moldBase.prototype.code}
                </Link>
                {moldBase.prototype.name && ` — ${moldBase.prototype.name}`}
              </span>
            </div>
          </div>
        )}

        {/* Phả hệ ngược: Các khuôn sản xuất kế thừa từ mình (nếu mình là bản D) */}
        {derivedMolds && derivedMolds.length > 0 && (
          <div className="mx-5 mb-4 p-3 bg-[var(--mcs-success-light)] border border-[var(--mcs-success)] border-opacity-30 rounded-lg flex items-center gap-3">
            <GitBranch size={20} className="text-[var(--mcs-success)] shrink-0" />
            <div className="flex flex-col text-[12px]">
              <span className="ja font-bold text-[var(--mcs-success-text)]">
                量産展開先 (Production Derivatives)
              </span>
              <span className="vi text-[11px] text-[var(--mcs-text-secondary)]">
                Các khuôn sản xuất kế thừa từ bản thử nghiệm này:{' '}
                {derivedMolds.map((dm: any, i: number) => (
                  <span key={dm.id}>
                    {i > 0 && ', '}
                    <Link href={`/master/mold/${dm.id}`} className="font-mono font-bold text-[var(--mcs-success)] hover:underline">
                      {dm.code}
                    </Link>
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ──── CARD 2: Danh sách Revision ──── */}
      <div className="bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--mcs-text-muted)]" />
            <h3 className="text-[13px] font-bold text-[var(--mcs-text)] flex flex-col">
              <span className="ja">設計版一覧 (Revisions)</span>
              <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh sách Phiên bản thiết kế</span>
            </h3>
          </div>
          <Link href={`/master/mold/${id}/revision/new`}>
            <button className="btn-primary h-[30px] px-3 flex items-center gap-1.5 text-xs">
              <Plus size={15} />
              <div className="flex flex-col items-center leading-none mt-0.5">
                <span className="ja">設計版追加</span>
                <span className="vi text-[9px] font-normal opacity-80">Thêm Revision</span>
              </div>
            </button>
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          {revisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--mcs-text-muted)]">
              <Layers size={40} strokeWidth={1} />
              <div className="text-center">
                <p className="ja font-bold text-[13px]">設計版がまだありません</p>
                <p className="vi text-[11px] mt-1">Chưa có phiên bản thiết kế nào. Hãy tạo Revision đầu tiên!</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--mcs-surface-3)] sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-[var(--mcs-text-secondary)]">
                <tr>
                  <th className="p-3 font-bold w-[60px] text-center">#</th>
                  <th className="p-3 font-bold w-[220px]">
                    <span className="ja">設計版コード</span><span className="vi">Mã Revision</span>
                  </th>
                  <th className="p-3 font-bold w-[120px]">
                    <span className="ja">版ラベル</span><span className="vi">Nhãn</span>
                  </th>
                  <th className="p-3 font-bold w-[160px]">
                    <span className="ja">承認日</span><span className="vi">Ngày duyệt</span>
                  </th>
                  <th className="p-3 font-bold w-[120px]">
                    <span className="ja">状態</span><span className="vi">Status</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {revisions.map((rev: any, index: number) => {
                  // Hiển thị Nhãn dạng thân thiện: JAE-001-R1 → JAE-001 R1
                  const displayCode = rev.revision_code.replace(/^(.+)-([^-]+)$/, '$1 $2')
                  const isApproved = !!rev.approved_date

                  return (
                    <tr key={rev.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] transition-colors cursor-pointer group">
                      <td className="p-3 text-center text-[var(--mcs-text-muted)] font-mono">{index + 1}</td>
                      <td className="p-3 font-mono font-bold text-[var(--mcs-text)] text-sm">
                        {displayCode}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)] border border-[var(--mcs-primary)] border-opacity-30 rounded font-bold text-[11px]">
                          {rev.version_label}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--mcs-text-secondary)]">
                        {rev.approved_date || '—'}
                      </td>
                      <td className="p-3">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] border border-[rgba(39,174,96,0.25)] rounded text-[10px] font-bold">
                            <CheckCircle2 size={12} />
                            APPROVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--mcs-warning-light)] text-[var(--mcs-warning-text)] border border-[rgba(243,156,18,0.25)] rounded text-[10px] font-bold">
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
