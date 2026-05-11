import { createClient } from '@/lib/supabase/server'
import DesignCenterClient from './_components/DesignCenterClient'

export const revalidate = 0

export default async function MoldDesignCenterPage() {
  const supabase = await createClient()

  // Fetch initial base designs
  const { data: moldBases } = await supabase
    .from('mold_base')
    .select(`
      *,
      customers (customer_name_jp, customer_code),
      revisions:mold_design_revision(
        id, revision_code, length_mm, width_mm, height_mm, 
        physical_molds:mold_physical(id, physical_code, checkin_status, cavity, entry_date)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 bg-[#01696f] text-white shadow-md z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <span>金型設計管理</span>
            </h1>
            <p className="text-xs text-teal-100">Thiết Kế Khuôn (Mold Design Center)</p>
          </div>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 overflow-hidden relative">
        <DesignCenterClient initialBases={moldBases || []} />
      </div>
    </div>
  )
}
