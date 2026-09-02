export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ReceiptForm } from './_components/ReceiptForm'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'

export default async function NewReceiptPage() {
  const supabase = await createClient()
  
  // Fetch master data for dropdowns
  const { data: plastics } = await supabase
    .from('plastic_master')
    .select('id:plastic_id, code:plastic_code, family:plastic_family, thickness_mm, width_mm')
    .eq('is_active', true)
    .order('plastic_code', { ascending: true })

  // Lấy danh sách suppliers (công ty có cung cấp vật tư) - Ở đây dùng bảng companies tạm
  // Thực tế có thể thêm `.eq('is_supplier', true)` nếu schema hỗ trợ
  const { data: suppliers } = await supabase
    .from('companies')
    .select('id:company_id, name:company_name')
    .order('company_name', { ascending: true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── BackBar (Detail Page Pattern) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mặc dù Client Component `router.back()` là chuẩn cho Back, với Server component ta có thể dùng Link href previous hoặc component client riêng. 
              Ở đây giả lập nút ← 戻る (Back) đơn giản trỏ về danh sách */}
          <Link href="/warehouse/rolls" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
            <ArrowLeft size={14} />
            戻る
          </Link>
          <Link href="/warehouse/rolls" className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
            <ArrowUpFromLine size={14} />
            一覧
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Tạo Phiếu Nhập Kho (New Receipt)
          </h1>
          <span className="badge badge--info font-bold">DRAFT</span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
        <ReceiptForm plastics={plastics || []} suppliers={suppliers || []} />
      </div>
    </div>
  )
}
