'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, Loader2, Layers, Box } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'

// ── Enum Labels ──
const ELEC_LABELS: Record<string, { ja: string; vi: string }> = {
  normal:     { ja: '通常',     vi: 'Thường' },
  conductive: { ja: '導電',     vi: 'Dẫn điện' },
  antistatic: { ja: '帯電防止', vi: 'Chống tĩnh điện' },
}
const SILICONE_LABELS: Record<string, { ja: string; vi: string }> = {
  silicone_free: { ja: 'ノンシリコン', vi: 'Không silicone' },
  with_silicone: { ja: 'シリコン有',   vi: 'Có silicone' },
  unknown:       { ja: '未確認',       vi: 'Chưa xác nhận' },
}
const REVIEW_LABELS: Record<string, { ja: string; vi: string; color: string; bg: string }> = {
  draft:     { ja: '未確認', vi: 'Chưa xác nhận', color: 'var(--text-muted)',      bg: 'var(--bg-surface-2)' },
  checked:   { ja: '確認済', vi: 'Đã kiểm tra',   color: 'var(--status-warning)', bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)' },
  confirmed: { ja: '承認済', vi: 'Đã xác nhận',   color: 'var(--status-success)', bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)' },
}
const COLOR_JA: Record<string, string> = {
  natural: 'ナチュラル', clear: 'クリア', black: '黒', white: '白',
  green: '緑', blue: '青', brown: '茶', gray: 'グレー', unknown: '未確認',
}
const ROLL_STATUS_LABELS: Record<string, { ja: string; color: string }> = {
  in_stock: { ja: '在庫中', color: 'var(--status-success)' },
  in_use:   { ja: '使用中', color: 'var(--status-warning)' },
  empty:    { ja: '消費済', color: 'var(--text-muted)' },
  returned: { ja: '返品',   color: 'var(--status-info)' },
}

function InfoRow({ label, jaLabel, value, mono }: { label: string; jaLabel: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 160, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>{jaLabel}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{label}</div>
      </div>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: mono ? 600 : 400 }}>
        {value || <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </div>
    </div>
  )
}

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
      color, background: bg, fontFamily: 'var(--font-jp)', display: 'inline-block',
    }}>{text}</span>
  )
}

export default function PlasticDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const supabase = createClient()

  const [plastic, setPlastic] = useState<any>(null)
  const [rolls, setRolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rollsLoading, setRollsLoading] = useState(true)
  const [rollPage, setRollPage] = useState(1)
  const [rollTotal, setRollTotal] = useState(0)
  const ROLL_PAGE_SIZE = 30

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('plastic_master')
        .select('*')
        .eq('plastic_id', id)
        .single()
      if (!error && data) setPlastic(data)
      setLoading(false)
    }
    load()
  }, [id, supabase])

  const fetchRolls = useCallback(async () => {
    setRollsLoading(true)
    const from = (rollPage - 1) * ROLL_PAGE_SIZE
    const to = from + ROLL_PAGE_SIZE - 1
    const { data, count, error } = await supabase
      .from('plastic_receipt_roll')
      .select('*, plastic_receipt(receipt_no, receipt_date)', { count: 'exact' })
      .eq('plastic_id', id)
      .order('created_at', { ascending: false })
      .range(from, to)
    if (!error) {
      setRolls(data || [])
      setRollTotal(count || 0)
    }
    setRollsLoading(false)
  }, [id, rollPage, supabase])

  useEffect(() => { fetchRolls() }, [fetchRolls])

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}><Loader2 size={20} className="animate-spin inline-block mr-2" /> 読み込み中...</div>
  if (!plastic) return <div style={{ padding: 32, color: 'var(--text-muted)' }}>データが見つかりません。</div>

  const elec = ELEC_LABELS[plastic.electrical_property] || { ja: '—', vi: '—' }
  const sili = SILICONE_LABELS[plastic.silicone_status_normalized] || { ja: '—', vi: '—' }
  const review = REVIEW_LABELS[plastic.status_review] || REVIEW_LABELS.draft
  const colorJa = COLOR_JA[plastic.color_name_normalized] || plastic.color_name_normalized || '—'

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="card-flat" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}>
            <ArrowLeft size={13} /> <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
          </button>
          <Link href="/plastics/master" className="btn btn-secondary" style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <ArrowUpFromLine size={12} /> <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
          </Link>
          <div style={{ marginLeft: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box size={18} style={{ color: 'var(--accent)' }} />
              <h1 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)', margin: 0 }}>
                {plastic.plastic_code}
              </h1>
              <Badge
                text={plastic.is_active ? '有効' : '無効'}
                color={plastic.is_active ? 'var(--status-success)' : 'var(--text-muted)'}
                bg={plastic.is_active ? 'color-mix(in srgb, var(--status-success) 12%, transparent)' : 'var(--bg-surface-2)'}
              />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              プラスチックマスター詳細 / Chi tiết mã nhựa
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Left: Thông số cơ bản */}
        <div className="card-flat" style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            基本情報 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Thông tin cơ bản</span>
          </h3>
          <InfoRow jaLabel="材質 (ファミリー)" label="Họ nhựa" value={
            <span>{plastic.plastic_family}{plastic.plastic_subtype ? ` / ${plastic.plastic_subtype}` : ''}</span>
          } />
          <InfoRow jaLabel="厚さ (mm)" label="Độ dày" value={plastic.thickness_mm} mono />
          <InfoRow jaLabel="幅 (mm)" label="Khổ rộng" value={plastic.width_mm} mono />
          <InfoRow jaLabel="標準長 (m)" label="Chiều dài tiêu chuẩn" value={plastic.standard_length_m ? `${plastic.standard_length_m} m` : null} mono />
          <InfoRow jaLabel="色コード" label="Mã màu gốc" value={plastic.color_code_raw} mono />
          <InfoRow jaLabel="色 (標準化)" label="Màu chuẩn hóa" value={colorJa} />
        </div>

        {/* Right: Tính chất */}
        <div className="card-flat" style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-jp)', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            特性・管理 <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Tính chất & Quản lý</span>
          </h3>
          <InfoRow jaLabel="導電性" label="Tính chất điện" value={
            <Badge text={elec.ja} color={plastic.electrical_property === 'conductive' ? 'var(--status-error)' : plastic.electrical_property === 'antistatic' ? 'var(--status-warning)' : 'var(--text-secondary)'} bg={plastic.electrical_property === 'conductive' ? 'color-mix(in srgb, var(--status-error) 12%, transparent)' : plastic.electrical_property === 'antistatic' ? 'color-mix(in srgb, var(--status-warning) 12%, transparent)' : 'var(--bg-surface-2)'} />
          } />
          <InfoRow jaLabel="シリコン" label="Silicone" value={
            <Badge text={sili.ja} color={plastic.silicone_status_normalized === 'with_silicone' ? 'var(--status-info)' : 'var(--status-success)'} bg={plastic.silicone_status_normalized === 'with_silicone' ? 'color-mix(in srgb, var(--status-info) 12%, transparent)' : 'color-mix(in srgb, var(--status-success) 12%, transparent)'} />
          } />
          <InfoRow jaLabel="添加剤" label="Phụ gia" value={plastic.additive_flags || plastic.additive_text_raw} />
          <InfoRow jaLabel="外観" label="Bề mặt" value={plastic.appearance_text_raw} />
          <InfoRow jaLabel="確認状態" label="Trạng thái xác nhận" value={
            <Badge text={review.ja} color={review.color} bg={review.bg} />
          } />
          <InfoRow jaLabel="備考" label="Ghi chú" value={plastic.remarks_raw} />
        </div>
      </div>

      {/* Rolls Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', margin: 0 }}>
            <Layers size={14} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
            在庫ロール <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6 }}>Cuộn trong kho ({rollTotal} cuộn)</span>
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                {['ロールコード', '残り (m)', 'ステータス', '保管場所', '入荷番号', '入荷日'].map(h => (
                  <th key={h} style={{ padding: '5px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: h.includes('m)') ? 'right' : 'left', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rollsLoading && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  <Loader2 size={14} className="animate-spin inline-block mr-2" /> 読み込み中...
                </td></tr>
              )}
              {!rollsLoading && rolls.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  このプラスチックの在庫ロールはありません
                </td></tr>
              )}
              {!rollsLoading && rolls.map((r, idx) => {
                const st = ROLL_STATUS_LABELS[r.status] || { ja: r.status, color: 'var(--text-muted)' }
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)' }}>
                    <td style={{ padding: '5px 8px', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>{r.roll_barcode}</td>
                    <td style={{ padding: '5px 8px', fontSize: 13, fontWeight: 700, textAlign: 'right', fontFamily: 'monospace', color: r.current_length_m < 50 ? 'var(--status-warning)' : 'var(--text-primary)' }}>
                      {r.current_length_m} m
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'left' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: st.color, fontFamily: 'var(--font-jp)' }}>{st.ja}</span>
                    </td>
                    <td style={{ padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)' }}>{r.location || r.warehouse_location || '—'}</td>
                    <td style={{ padding: '5px 8px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{r.plastic_receipt?.receipt_no || '—'}</td>
                    <td style={{ padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)' }}>{r.plastic_receipt?.receipt_date || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {rollTotal > ROLL_PAGE_SIZE && (
          <Pagination currentPage={rollPage} totalRecords={rollTotal} pageSize={ROLL_PAGE_SIZE} onPageChange={setRollPage} />
        )}
      </div>
    </div>
  )
}
