export const dynamic = 'force-dynamic'

import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'
import { WorkOrderForm } from './_components/WorkOrderForm'

export default function NewWorkOrderPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── BackBar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/production/work-orders" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
            <ArrowLeft size={14} />
            戻る
          </Link>
          <Link href="/production/work-orders" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
            <ArrowUpFromLine size={14} />
            一覧
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Tạo Lệnh Sản Xuất Mới
          </h1>
          <span className="badge badge--neutral font-bold">DRAFT</span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px', paddingTop: 16 }}>
        <WorkOrderForm />
      </div>
    </div>
  )
}
